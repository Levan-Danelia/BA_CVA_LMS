import type {
    Counterparty,
    NettingSet,
    SingleNameHedge,
    IndexHedge,
    BA_CVA_Result
} from '../types/bacva';
import {
    BA_CVA_SCALARS,
    SECTOR_RISK_WEIGHTS,
    HEDGE_CORRELATIONS,
    HMA_FACTORS
} from '../constants/bacva_params';

/**
 * Calculates the supervisory discount factor (DF_NS or DF_SN)
 * Formula: (1 - exp(-0.05 * M)) / (0.05 * M)
 */
export const calculateDiscountFactor = (maturity: number): number => {
    if (maturity <= 0) return 1.0;
    const r = BA_CVA_SCALARS.SUPERVISORY_RATE;
    return (1 - Math.exp(-r * maturity)) / (r * maturity);
};

/**
 * Calculates Standalone CVA (SCVA) for a counterparty
 */
export const calculateCounterpartySCVA = (
    counterparty: Counterparty,
    nettingSets: NettingSet[]
): number => {
    const alpha = counterparty.sector === 'PEN'
        ? BA_CVA_SCALARS.ALPHA_PENSION
        : BA_CVA_SCALARS.ALPHA_STANDARD;

    const rw = SECTOR_RISK_WEIGHTS[counterparty.sector][counterparty.creditQuality];

    const sumTerms = nettingSets.reduce((sum, ns) => {
        const df = ns.exposureMethod === 'IMM' ? 1.0 : calculateDiscountFactor(ns.maturity);
        return sum + (ns.maturity * ns.ead * df);
    }, 0);

    return (1 / alpha) * rw * sumTerms;
};

/**
 * Calculates K_reduced (Gross aggregation)
 */
export const calculateKReduced = (scvas: number[]): number => {
    const rho = BA_CVA_SCALARS.RHO;
    const sumSCVA = scvas.reduce((a, b) => a + b, 0);
    const sumSCVASquared = scvas.reduce((a, b) => a + b * b, 0);

    return Math.sqrt(
        Math.pow(rho * sumSCVA, 2) + (1 - Math.pow(rho, 2)) * sumSCVASquared
    );
};

/**
 * Calculates Single Name Hedge (SNH_c) and Hedge Mismatch Adjustment (HMA_c)
 */
export const calculateSNHComponents = (
    hedges: SingleNameHedge[]
): { snh: number; hma: number } => {
    return hedges.reduce((acc, h) => {
        const rw = SECTOR_RISK_WEIGHTS[h.referenceSector][h.referenceCQ];
        const df = calculateDiscountFactor(h.maturity);
        const rhc = HEDGE_CORRELATIONS[h.type];
        const hmaFactor = HMA_FACTORS[h.type];

        const riskTerm = rw * h.maturity * h.notional * df;

        return {
            snh: acc.snh + (rhc * riskTerm),
            hma: acc.hma + (hmaFactor * Math.pow(riskTerm, 2))
        };
    }, { snh: 0, hma: 0 });
};

/**
 * Calculates Total Index Hedge benefit (IH)
 * Note: Index risk weights are scaled by 0.7
 */
export const calculateTotalIH = (indexHedges: IndexHedge[]): number => {
    // For simplicity, assuming a standard FIN/IG index if composition isn't provided
    // In a real app, this would use index-specific risk weights
    const defaultRW = SECTOR_RISK_WEIGHTS.FIN.IG * BA_CVA_SCALARS.INDEX_SCALAR;

    return indexHedges.reduce((sum, ih) => {
        const df = calculateDiscountFactor(ih.maturity);
        return sum + (defaultRW * ih.maturity * ih.notional * df);
    }, 0);
};

/**
 * Main BA-CVA Engine
 */
export const calculateBACVA = (
    counterparties: Counterparty[],
    nettingSets: NettingSet[],
    snHedges: SingleNameHedge[],
    indexHedges: IndexHedge[]
): BA_CVA_Result => {
    const scvaMap: Record<string, number> = {};
    const snhMap: Record<string, number> = {};
    const hmaMap: Record<string, number> = {};

    // 1. Calculate SCVA per counterparty
    counterparties.forEach(cp => {
        const cpNettingSets = nettingSets.filter(ns => ns.counterpartyId === cp.id);
        scvaMap[cp.id] = calculateCounterpartySCVA(cp, cpNettingSets);

        const cpHedges = snHedges.filter(h => h.hedgedCounterpartyId === cp.id);
        const { snh, hma } = calculateSNHComponents(cpHedges);
        snhMap[cp.id] = snh;
        hmaMap[cp.id] = hma;
    });

    // 2. K Reduced
    const kReduced = calculateKReduced(Object.values(scvaMap));

    // 3. Index Hedges
    const ih = calculateTotalIH(indexHedges);

    // 4. K Hedged
    const rho = BA_CVA_SCALARS.RHO;
    const diffs = counterparties.map(cp => scvaMap[cp.id] - snhMap[cp.id]);
    const sumDiffs = diffs.reduce((a, b) => a + b, 0);
    const sumDiffsSquared = diffs.reduce((a, b) => a + b * b, 0);
    const totalHMA = Object.values(hmaMap).reduce((a, b) => a + b, 0);

    const kHedged = Math.sqrt(
        Math.pow(rho * sumDiffs - ih, 2) +
        (1 - Math.pow(rho, 2)) * sumDiffsSquared +
        totalHMA
    );

    // 5. K Full
    const beta = BA_CVA_SCALARS.BETA;
    const kFull = (beta * kReduced) + (1 - beta) * kHedged;

    // 6. Final Capital
    const finalCapital = kFull * BA_CVA_SCALARS.DS_BA_CVA;

    return {
        scva: scvaMap,
        kReduced,
        snh: snhMap,
        hma: hmaMap,
        ih,
        kHedged,
        kFull,
        finalCapital
    };
};
