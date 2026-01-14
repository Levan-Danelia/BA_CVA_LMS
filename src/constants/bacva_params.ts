import type { SectorCode, CreditQuality } from '../types/bacva';

export const BA_CVA_SCALARS = {
    DS_BA_CVA: 0.65,
    RHO: 0.50,
    BETA: 0.25,
    SUPERVISORY_RATE: 0.05,
    INDEX_SCALAR: 0.70,
    ALPHA_STANDARD: 1.4,
    ALPHA_PENSION: 1.0,
};

export const SECTOR_RISK_WEIGHTS: Record<SectorCode, Record<CreditQuality, number>> = {
    SOV: { IG: 0.005, HY: 0.020 },
    GOV: { IG: 0.010, HY: 0.040 },
    FIN: { IG: 0.050, HY: 0.120 },
    PEN: { IG: 0.035, HY: 0.085 },
    IND: { IG: 0.030, HY: 0.070 },
    CON: { IG: 0.030, HY: 0.085 },
    TEC: { IG: 0.020, HY: 0.055 },
    HLT: { IG: 0.015, HY: 0.050 },
    OTH: { IG: 0.050, HY: 0.120 },
};

export const HEDGE_CORRELATIONS = {
    direct: 1.00,
    legally_related: 0.80,
    sector_region: 0.50,
};

export const HMA_FACTORS = {
    direct: 0, // 1 - 1.0^2
    legally_related: 0.36, // 1 - 0.8^2
    sector_region: 0.75, // 1 - 0.5^2
};
