import React from 'react';
import { GraduationCap } from 'lucide-react';
import { NavigationButtons } from '../components/NavigationButtons';
import { BA_CVA_SCALARS, SECTOR_RISK_WEIGHTS, HEDGE_CORRELATIONS, HMA_FACTORS } from '../../constants/bacva_params';
import { calculateDiscountFactor } from '../../utils/bacva_engine';
import type { SectorCode, CreditQuality, HedgeType } from '../../types/bacva';

export const PracticeView: React.FC = () => {
    // Raw Input Data for SCVA
    const rawData = [
        { name: 'Alpha Bank Ltd', sector: 'FIN' as SectorCode, cq: 'IG' as CreditQuality, m: 4.85, ead: 1500, method: 'IMM' },
        { name: 'Northern Energy Corp', sector: 'IND' as SectorCode, cq: 'IG' as CreditQuality, m: 1.61, ead: 450, method: 'SA-CCR' },
        { name: 'Maple Pension Trust', sector: 'PEN' as SectorCode, cq: 'IG' as CreditQuality, m: 18.50, ead: 800, method: 'IMM' },
        { name: 'GlobalTech Solutions', sector: 'TEC' as SectorCode, cq: 'HY' as CreditQuality, m: 1.00, ead: 250, method: 'SA-CCR' },
        { name: 'Riverside Finance Ltd', sector: 'FIN' as SectorCode, cq: 'IG' as CreditQuality, m: 0.10, ead: 2000, method: 'SFT' },
    ];

    // Raw Input Data for SNH
    const snhRawData = [
        { entity: 'Alpha Bank Ltd', sector: 'FIN' as SectorCode, cq: 'IG' as CreditQuality, type: 'direct' as HedgeType, notional: 500, m: 3.0 },
        { entity: 'Alpha Asset Mgmt', sector: 'FIN' as SectorCode, cq: 'IG' as CreditQuality, type: 'legally_related' as HedgeType, notional: 300, m: 2.5 },
        { entity: 'Atlantic Oil Co', sector: 'IND' as SectorCode, cq: 'IG' as CreditQuality, type: 'sector_region' as HedgeType, notional: 200, m: 2.0 },
        { entity: 'GlobalTech Holdings', sector: 'TEC' as SectorCode, cq: 'HY' as CreditQuality, type: 'legally_related' as HedgeType, notional: 150, m: 1.5 },
        { entity: 'Riverside Finance Ltd', sector: 'FIN' as SectorCode, cq: 'IG' as CreditQuality, type: 'direct' as HedgeType, notional: 1000, m: 0.5 },
    ];

    // Dynamic Calculations - SCVA
    const tableData = rawData.map(item => {
        const alpha = item.sector === 'PEN' ? BA_CVA_SCALARS.ALPHA_PENSION : BA_CVA_SCALARS.ALPHA_STANDARD;
        const rwValue = SECTOR_RISK_WEIGHTS[item.sector][item.cq];
        const df = item.method === 'IMM' ? 1.0 : calculateDiscountFactor(item.m);

        // SCVA = (1/Alpha) * RW * Maturity * EAD * DF
        const scva = (1 / alpha) * rwValue * item.m * item.ead * df;

        return {
            ...item,
            alpha,
            rwLabel: `${(rwValue * 100).toFixed(2)}%`,
            df,
            scva
        };
    });

    const totalSCVA = tableData.reduce((acc, curr) => acc + curr.scva, 0);

    // Dynamic Calculations - SNH & HMA
    const snhTableData = snhRawData.map(item => {
        const rwValue = SECTOR_RISK_WEIGHTS[item.sector][item.cq];
        const df = calculateDiscountFactor(item.m);
        const rhc = HEDGE_CORRELATIONS[item.type];
        const hmaFactor = HMA_FACTORS[item.type];

        // SNH Benefit = r_hc * RW * M * Notional * DF
        const riskTerm = rwValue * item.m * item.notional * df;
        const snhBenefit = rhc * riskTerm;

        // HMA = (1 - r_hc^2) * (RW * M * Notional * DF)^2
        const hmaBenefit = hmaFactor * Math.pow(riskTerm, 2);

        return {
            ...item,
            rwLabel: `${(rwValue * 100).toFixed(2)}%`,
            rhcLabel: `${(rhc * 100).toFixed(0)}%`,
            hmaFactorLabel: `${(hmaFactor * 100).toFixed(0)}%`,
            df,
            riskTerm,
            riskTermSquared: Math.pow(riskTerm, 2),
            snh: snhBenefit,
            hma: hmaBenefit
        };
    });

    const totalSNH = snhTableData.reduce((acc, curr) => acc + curr.snh, 0);
    const totalHMA = snhTableData.reduce((acc, curr) => acc + curr.hma, 0);

    // Raw Input Data for IH (Regulatory CDS Indices from Python example)
    const ihRawData = [
        {
            id: 'Index 1',
            name: 'Generic European IG Index',
            notional: 750,
            m: 5.0,
            constituents: [
                { sector: 'FIN', cq: 'IG', weight: 0.248, rw: 0.050 },
                { sector: 'IND', cq: 'IG', weight: 0.200, rw: 0.030 },
                { sector: 'CON', cq: 'IG', weight: 0.200, rw: 0.030 },
                { sector: 'TEC', cq: 'IG', weight: 0.104, rw: 0.020 },
                { sector: 'HLT', cq: 'IG', weight: 0.152, rw: 0.015 },
                { sector: 'OTH', cq: 'IG', weight: 0.096, rw: 0.050 },
            ]
        },
        {
            id: 'Index 2',
            name: 'Generic North American IG Index',
            notional: 500,
            m: 3.0,
            constituents: [
                { sector: 'FIN', cq: 'IG', weight: 0.200, rw: 0.050 },
                { sector: 'IND', cq: 'IG', weight: 0.248, rw: 0.030 },
                { sector: 'CON', cq: 'IG', weight: 0.152, rw: 0.030 },
                { sector: 'TEC', cq: 'IG', weight: 0.200, rw: 0.020 },
                { sector: 'HLT', cq: 'IG', weight: 0.104, rw: 0.015 },
                { sector: 'OTH', cq: 'IG', weight: 0.096, rw: 0.050 },
            ]
        },
    ];

    // Dynamic Calculations - IH
    const ihTableData = ihRawData.map(item => {
        const preScalarRw = item.constituents.reduce((acc, c) => acc + (c.rw * c.weight), 0);
        const indexScalar = BA_CVA_SCALARS.INDEX_SCALAR; // 0.7
        const rwInd = preScalarRw * indexScalar;
        const df = calculateDiscountFactor(item.m);
        const ih = rwInd * item.m * item.notional * df;

        return {
            ...item,
            preScalarRw,
            indexScalar,
            rwInd,
            rwIndLabel: `${(rwInd * 100).toFixed(4)}%`,
            df,
            ih
        };
    });

    const totalIH = ihTableData.reduce((acc, curr) => acc + curr.ih, 0);

    // K Reduced Calculations
    const rho = BA_CVA_SCALARS.RHO; // 0.50
    const sumSCVA = tableData.reduce((acc, curr) => acc + curr.scva, 0);
    const sumSCVASquared = tableData.reduce((acc, curr) => acc + Math.pow(curr.scva, 2), 0);

    const systematicPart = Math.pow(rho * sumSCVA, 2);
    const idiosyncraticPart = (1 - Math.pow(rho, 2)) * sumSCVASquared;
    const kReduced = Math.sqrt(systematicPart + idiosyncraticPart);

    // K Hedged Calculations
    const snhByCounterparty = snhTableData.reduce((acc: Record<string, number>, curr) => {
        acc[curr.entity] = (acc[curr.entity] || 0) + curr.snh;
        return acc;
    }, {});

    const counterpartyHedgedData = tableData.map(cpty => {
        const snhTotal = snhByCounterparty[cpty.name] || 0;
        const diff = cpty.scva - snhTotal;
        return {
            ...cpty,
            snhTotal,
            diff,
            diffSquared: Math.pow(diff, 2)
        };
    });

    const sumDiff = counterpartyHedgedData.reduce((acc, curr) => acc + curr.diff, 0);
    const sumDiffSquared = counterpartyHedgedData.reduce((acc, curr) => acc + curr.diffSquared, 0);

    const systematicPartHedged = Math.pow(rho * sumDiff - totalIH, 2);
    const idiosyncraticPartHedged = (1 - Math.pow(rho, 2)) * sumDiffSquared;
    const kHedged = Math.sqrt(systematicPartHedged + idiosyncraticPartHedged + totalHMA);

    // K Full and K Final
    const beta = BA_CVA_SCALARS.BETA; // 0.25
    const kFull = (beta * kReduced) + ((1 - beta) * kHedged);
    const dsBaCva = BA_CVA_SCALARS.DS_BA_CVA; // 0.65
    const kFinal = kFull * dsBaCva;

    return (
        <div className="view-container">
            <header className="view-header">
                <div className="view-header-content">
                    <GraduationCap className="view-header-icon" />
                    <h1 className="view-header-title">Practice</h1>
                </div>
            </header>

            <div className="view-content">
                <div className="content-wrapper">
                    {/* INTRODUCTION SECTION */}
                    <section className="view-section">
                        <div className="heading-section">
                            <span>Calculation Walkthrough</span>
                        </div>
                        <p className="text_body">
                            This section demonstrates the complete BA-CVA calculation using a sample portfolio of five counterparties and associated hedges. We will work through each step sequentially: first calculating SCVA for each counterparty, then computing SNH and HMA for hedges, deriving the index hedge benefit, and finally aggregating everything into K Reduced, K Hedged, K Full, and K Final. Follow the arithmetic in each table to see exactly how the numbers flow through the framework.
                        </p>
                    </section>
                    {/* SCVA SECTION */}
                    <section className="view-section">
                        <div className="heading-section">
                            <span>Standalone CVA (SCVA)</span>
                        </div>
                        <div className="text-block">
                            <p className="text_body">
                                For each counterparty, the SCVA calculation follows a straightforward multiplication: take the inverse of alpha (1/α), multiply by the risk weight from the sector/credit quality lookup table, then multiply by maturity, EAD, and the discount factor. The key decision points are: (1) alpha is 1.0 for pension funds, 1.4 for all other counterparties; (2) the discount factor is 1.0 for IMM firms since their exposure models already incorporate time-weighting, otherwise use the supervisory formula DF = [1 - exp(-0.05 × M)] / (0.05 × M). Work through each row in the table below by applying this formula to verify your understanding.
                            </p>
                            {/* FORMULA CARD */}
                            <div className="card card-v1 mb-card-gap">
                                <div className="card-body">

                                    <div className="card-stat-value">
                                        SCVA<sub>c</sub> = (1/α) · RW<sub>c</sub> · M<sub>c</sub> · EAD<sub>c</sub> · DF<sub>c</sub>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="table-container">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th className="text_table_header_left">Counterparty</th>
                                        <th className="text_table_header_left">Sector</th>
                                        <th className="text_table_header_left">CQ</th>
                                        <th className="text_table_header_right">Alpha</th>
                                        <th className="text_table_header_right">RW</th>
                                        <th className="text_table_header_right">Maturity</th>
                                        <th className="text_table_header_right">DF</th>
                                        <th className="text_table_header_right">EAD</th>
                                        <th className="text_table_header_right">SCVA</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tableData.map((row, idx) => (
                                        <tr key={idx}>
                                            <td className="text_table_left">{row.name}</td>
                                            <td className="text_table_left">{row.sector}</td>
                                            <td className="text_table_left">{row.cq}</td>
                                            <td className="text_table_right">{row.alpha.toFixed(2)}</td>
                                            <td className="text_table_right">{row.rwLabel}</td>
                                            <td className="text_table_right">{row.m.toFixed(2)}</td>
                                            <td className="text_table_right">{row.df.toFixed(4)}</td>
                                            <td className="text_table_right">{row.ead}</td>
                                            <td className="text_table_right">{row.scva.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colSpan={8} className="text_table_left">Portfolio Total SCVA</td>
                                        <td className="text_table_right">{totalSCVA.toFixed(2)}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </section>

                    {/* SNH SECTION */}
                    <section className="view-section">
                        <div className="heading-section">
                            <span>Single Name Hedges (SNH)</span>
                        </div>

                        <div className="text-block">
                            <p className="text_body">
                                For each single name hedge, first compute the <strong>Risk Term = RW × M × B × DF</strong> using the reference entity's risk weight, the hedge maturity, notional, and the supervisory discount factor. Then multiply by the supervisory correlation r<sub>hc</sub> which depends on the relationship between the hedge and the counterparty: direct match receives 100%, legally related (parent/subsidiary) receives 80%, and sector/region proxy receives 50%. Unlike SCVA, the discount factor always uses the supervisory formula regardless of firm methodology. The total SNH across all hedges will be subtracted from SCVA when calculating K Hedged.
                            </p>
                        </div>

                        {/* FORMULA CARD */}
                        <div className="card card-v2">
                            <div className="card-body">

                                <div className="card-stat-value">
                                    SNH<sub>c</sub> = (r<sub>hc</sub> · RW<sub>h</sub> · M<sub>h</sub> · B<sub>h</sub> · DF<sub>h</sub>)
                                </div>
                            </div>
                        </div>

                        <div className="table-container">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th className="text_table_header_left">Reference Entity</th>
                                        <th className="text_table_header_left">Sector</th>
                                        <th className="text_table_header_left">CQ</th>
                                        <th className="text_table_header_left">Hedge Type</th>
                                        <th className="text_table_header_right">Notional</th>
                                        <th className="text_table_header_right">Maturity</th>
                                        <th className="text_table_header_right">DF</th>
                                        <th className="text_table_header_right">RW</th>
                                        <th className="text_table_header_right">r<sub>hc</sub></th>
                                        <th className="text_table_header_right">SNH</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {snhTableData.map((row, idx) => (
                                        <tr key={idx}>
                                            <td className="text_table_left">{row.entity}</td>
                                            <td className="text_table_left">{row.sector}</td>
                                            <td className="text_table_left">{row.cq}</td>
                                            <td className="text_table_left">{row.type.split('_').join(' ').replace(/\b\w/g, l => l.toUpperCase())}</td>
                                            <td className="text_table_right">{row.notional}</td>
                                            <td className="text_table_right">{row.m.toFixed(2)}</td>
                                            <td className="text_table_right">{row.df.toFixed(4)}</td>
                                            <td className="text_table_right">{row.rwLabel}</td>
                                            <td className="text_table_right">{row.rhcLabel}</td>
                                            <td className="text_table_right">{row.snh.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colSpan={9} className="text_table_left">Total Single Name Hedge (Σ SNH<sub>c</sub>)</td>
                                        <td className="text_table_right">{totalSNH.toFixed(2)}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </section>

                    {/* HMA SECTION */}
                    <section className="view-section">
                        <div className="heading-section">
                            <span>Hedge Mismatch Adjustment (HMA)</span>
                        </div>

                        <div className="text-block">
                            <p className="text_body">
                                HMA reuses the same Risk Term calculated for SNH but applies a different transformation: square the Risk Term, then multiply by the mismatch factor <strong>(1 - r<sub>hc</sub>²)</strong>. The mismatch factor is derived by squaring the correlation and subtracting from one—this means direct-match hedges (100% correlation) produce a factor of zero and therefore no HMA add-on. Legally related hedges (80% correlation) produce a factor of 0.36, and proxy hedges (50% correlation) produce 0.75. The squaring of both the correlation and the Risk Term aligns HMA with variance-based aggregation logic. Notice in the table that direct-match hedges contribute nothing to total HMA.
                            </p>
                        </div>

                        {/* FORMULA CARD */}
                        <div className="card card-v3 mb-card-gap">
                            <div className="card-body">

                                <div className="card-stat-value">
                                    HMA<sub>c</sub> = (1 - r<sub>hc</sub><sup>2</sup>) · (RW<sub>h</sub> · M<sub>h</sub> · B<sub>h</sub> · DF<sub>h</sub>)<sup>2</sup>
                                </div>
                            </div>
                        </div>

                        <div className="table-container">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th className="text_table_header_left">Reference Entity</th>
                                        <th className="text_table_header_left">Hedge Type</th>
                                        <th className="text_table_header_right">Risk Term (RW·M·B·DF)</th>
                                        <th className="text_table_header_right">(Risk Term)<sup>2</sup></th>
                                        <th className="text_table_header_right">r<sub>hc</sub></th>
                                        <th className="text_table_header_right">HMA Factor</th>
                                        <th className="text_table_header_right">HMA</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {snhTableData.map((row, idx) => (
                                        <tr key={idx}>
                                            <td className="text_table_left">{row.entity}</td>
                                            <td className="text_table_left">{row.type.split('_').join(' ').replace(/\b\w/g, l => l.toUpperCase())}</td>
                                            <td className="text_table_right">{row.riskTerm.toFixed(2)}</td>
                                            <td className="text_table_right">{row.riskTermSquared.toFixed(2)}</td>
                                            <td className="text_table_right">{row.rhcLabel}</td>
                                            <td className="text_table_right">{row.hmaFactorLabel}</td>
                                            <td className="text_table_right">{row.hma.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colSpan={6} className="text_table_left">Total Hedge Mismatch Adjustment (Σ HMA<sub>c</sub>)</td>
                                        <td className="text_table_right">{totalHMA.toFixed(2)}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </section>

                    {/* IH SECTION */}
                    <section className="view-section">
                        <div className="heading-section">
                            <span>Index Hedges (IH)</span>
                        </div>

                        <div className="text-block">
                            <p className="text_body">
                                Index hedge risk weights require a two-step derivation. First, perform the <strong>look-through</strong>: for each constituent in the index, multiply its portfolio weight by its sector risk weight, then sum all contributions to get the weighted average risk weight. Second, apply the <strong>0.70 scalar</strong> to reflect the diversification benefit inherent in an index versus a single name. The constituent derivation tables below show this arithmetic for each index. Once you have the final index risk weight, the IH calculation follows the same structure as SNH: RW<sub>ind</sub> × M × B × DF, using the supervisory discount factor.
                            </p>
                        </div>

                        {/* FORMULA CARD */}
                        <div className="card card-v4 mb-card-gap">
                            <div className="card-body">
                                <div className="card-stat-value">
                                    IH<sub>i</sub> = RW<sub>i,ind</sub> · M<sub>i,ind</sub> · B<sub>i,ind</sub> · DF<sub>i,ind</sub>
                                </div>
                            </div>
                        </div>

                        {/* CONSTITUENT DERIVATION */}
                        {ihTableData.map((index, idx) => (
                            <div key={idx}>
                                <div className="table_title">Constituent Derivation: {index.id}</div>
                                <div className="table-container">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th className="text_table_header_left">Sector / Credit Quality</th>
                                                <th className="text_table_header_right">Weight (w<sub>j</sub>)</th>
                                                <th className="text_table_header_right">Risk Weight (RW<sub>j</sub>)</th>
                                                <th className="text_table_header_right">Contribution (w<sub>j</sub> · RW<sub>j</sub>)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {index.constituents.map((c, cIdx) => (
                                                <tr key={cIdx}>
                                                    <td className="text_table_left">{c.sector} - {c.cq}</td>
                                                    <td className="text_table_right">{(c.weight * 100).toFixed(1)}%</td>
                                                    <td className="text_table_right">{(c.rw * 100).toFixed(1)}%</td>
                                                    <td className="text_table_right">{(c.weight * c.rw * 100).toFixed(4)}%</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <td className="text_table_left">Weighted Average RW (Σ w<sub>j</sub> · RW<sub>j</sub>)</td>
                                                <td colSpan={3} className="text_table_right">{(index.preScalarRw * 100).toFixed(4)}%</td>
                                            </tr>
                                            <tr>
                                                <td className="text_table_left">Index Risk Weight (RW<sub>i,ind</sub> = 0.7 · Σ)</td>
                                                <td colSpan={3} className="text_table_right">{(index.rwInd * 100).toFixed(4)}%</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                        ))}

                        <div className="table_title">Final Index Hedge Relief (IH)</div>
                        <div className="table-container">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th className="text_table_header_left">Index ID</th>
                                        <th className="text_table_header_right">RW<sub>i,ind</sub></th>
                                        <th className="text_table_header_right">Maturity (M<sub>i,ind</sub>)</th>
                                        <th className="text_table_header_right">Net Notional (B<sub>i,ind</sub>)</th>
                                        <th className="text_table_header_right">DF<sub>i,ind</sub></th>
                                        <th className="text_table_header_right">Relief (IH<sub>i</sub>)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ihTableData.map((row, idx) => (
                                        <tr key={idx}>
                                            <td className="text_table_left">{row.id}</td>
                                            <td className="text_table_right">{(row.rwInd * 100).toFixed(4)}%</td>
                                            <td className="text_table_right">{row.m.toFixed(2)}</td>
                                            <td className="text_table_right">{row.notional.toLocaleString()}</td>
                                            <td className="text_table_right">{row.df.toFixed(4)}</td>
                                            <td className="text_table_right">{row.ih.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colSpan={5} className="text_table_left">Total Index Hedge Relief (Σ IH<sub>i</sub>)</td>
                                        <td className="text_table_right">{totalIH.toFixed(2)}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </section>

                    {/* K REDUCED SECTION */}
                    <section className="view-section">
                        <div className="heading-section">
                            <span>K Reduced</span>
                        </div>

                        <div className="text-block">
                            <p className="text_body">
                                K Reduced aggregates individual SCVA values into a portfolio-level capital charge using two components with different correlation assumptions. For the <strong>systematic component</strong>, sum all SCVA values first, multiply by ρ, then square—this "sum then square" logic assumes perfect correlation within the systematic portion. For the <strong>idiosyncratic component</strong>, square each SCVA individually, sum those squares, then multiply by (1 - ρ²)—this "square then sum" logic assumes zero correlation, providing a diversification benefit. The final K Reduced is the square root of the sum of both components. The table walks through each intermediate calculation so you can trace how the numbers flow.
                            </p>
                        </div>

                        {/* FORMULA CARD */}
                        <div className="card card-v5 mb-card-gap">
                            <div className="card-body">
                                <div className="card-stat-value">
                                    K<sub>reduced</sub> = √ [ (ρ · SCVA<sub>c</sub>)<sup>2</sup> + (1 - ρ<sup>2</sup>) · SCVA<sub>c</sub><sup>2</sup> ]
                                </div>
                            </div>
                        </div>

                        <div className="table-container">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th className="text_table_header_left">Component</th>
                                        <th className="text_table_header_right">Value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="text_table_left">SCVA<sub>c</sub></td>
                                        <td className="text_table_right">{sumSCVA.toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <td className="text_table_left">ρ</td>
                                        <td className="text_table_right">0.50</td>
                                    </tr>
                                    <tr>
                                        <td className="text_table_left">(ρ · SCVA<sub>c</sub>)<sup>2</sup></td>
                                        <td className="text_table_right">{systematicPart.toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <td className="text_table_left">(1 - ρ<sup>2</sup>)</td>
                                        <td className="text_table_right">0.75</td>
                                    </tr>
                                    <tr>
                                        <td className="text_table_left">SCVA<sub>c</sub><sup>2</sup></td>
                                        <td className="text_table_right">{sumSCVASquared.toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <td className="text_table_left">(1 - ρ<sup>2</sup>) · SCVA<sub>c</sub><sup>2</sup></td>
                                        <td className="text_table_right">{idiosyncraticPart.toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <td className="text_table_left">(ρ · SCVA<sub>c</sub>)<sup>2</sup> + (1 - ρ<sup>2</sup>) · SCVA<sub>c</sub><sup>2</sup></td>
                                        <td className="text_table_right">{((systematicPart + idiosyncraticPart)).toFixed(2)}</td>
                                    </tr>
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td className="text_table_left">K<sub>reduced</sub></td>
                                        <td className="text_table_right">{kReduced.toFixed(2)}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </section>

                    {/* K HEDGED SECTION */}
                    <section className="view-section">
                        <div className="heading-section">
                            <span>K Hedged</span>
                        </div>

                        <div className="text-block">
                            <p className="text_body">
                                K Hedged follows the same aggregation structure as K Reduced but operates on <strong>net exposures</strong> after subtracting SNH from each counterparty's SCVA. For the <strong>systematic component</strong>, sum the net exposures, multiply by ρ, then subtract total IH before squaring—note that index hedges only appear here, not in the idiosyncratic component. For the <strong>idiosyncratic component</strong>, square each net exposure, sum those squares, multiply by (1 - ρ²). Finally, add the total HMA <em>inside</em> the square root—this add-on sits alongside the other variance terms. The table traces each step from raw inputs to the final K Hedged figure.
                            </p>
                        </div>

                        {/* FORMULA CARD */}
                        <div className="card card-v6 mb-card-gap">
                            <div className="card-body">
                                <div className="card-stat-value">
                                    K<sub>hedged</sub> = √ [ (ρ · (SCVA<sub>c</sub> - SNH<sub>c</sub>) - IH<sub>i</sub>)<sup>2</sup> + (1 - ρ<sup>2</sup>) · (SCVA<sub>c</sub> - SNH<sub>c</sub>)<sup>2</sup> + HMA<sub>c</sub> ]
                                </div>
                            </div>
                        </div>

                        <div className="table-container">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th className="text_table_header_left">Component</th>
                                        <th className="text_table_header_right">Value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="text_table_left">SCVA<sub>c</sub></td>
                                        <td className="text_table_right">{sumSCVA.toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <td className="text_table_left">SNH<sub>c</sub></td>
                                        <td className="text_table_right">{totalSNH.toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <td className="text_table_left">(SCVA<sub>c</sub> - SNH<sub>c</sub>)</td>
                                        <td className="text_table_right">{sumDiff.toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <td className="text_table_left">ρ</td>
                                        <td className="text_table_right">0.50</td>
                                    </tr>
                                    <tr>
                                        <td className="text_table_left">IH<sub>i</sub></td>
                                        <td className="text_table_right">{totalIH.toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <td className="text_table_left">(ρ · (SCVA<sub>c</sub> - SNH<sub>c</sub>) - IH<sub>i</sub>)<sup>2</sup></td>
                                        <td className="text_table_right">{systematicPartHedged.toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <td className="text_table_left">(SCVA<sub>c</sub> - SNH<sub>c</sub>)<sup>2</sup></td>
                                        <td className="text_table_right">{sumDiffSquared.toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <td className="text_table_left">(1 - ρ<sup>2</sup>)</td>
                                        <td className="text_table_right">0.75</td>
                                    </tr>
                                    <tr>
                                        <td className="text_table_left">(1 - ρ<sup>2</sup>) · (SCVA<sub>c</sub> - SNH<sub>c</sub>)<sup>2</sup></td>
                                        <td className="text_table_right">{idiosyncraticPartHedged.toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <td className="text_table_left">HMA<sub>c</sub></td>
                                        <td className="text_table_right">{totalHMA.toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <td className="text_table_left">Total Sum under √</td>
                                        <td className="text_table_right">{(systematicPartHedged + idiosyncraticPartHedged + totalHMA).toFixed(2)}</td>
                                    </tr>
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td className="text_table_left">K<sub>hedged</sub></td>
                                        <td className="text_table_right">{kHedged.toFixed(2)}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </section>

                    {/* K FULL SECTION */}
                    <section className="view-section">
                        <div className="heading-section">
                            <span>K Full</span>
                        </div>

                        <div className="text-block">
                            <p className="text_body">
                                K Full combines the unhedged and hedged capital views using a simple weighted average. The weight β applies to K Reduced (the unhedged view), and (1 - β) applies to K Hedged. This weighting ensures that even with perfect hedges, a minimum portion of the unhedged capital requirement is always retained—the β floor protects against model risk, basis risk, and the operational reality that hedges can fail during stress. The arithmetic is a straightforward linear combination of the two K values calculated in the previous steps.
                            </p>
                        </div>

                        {/* FORMULA CARD */}
                        <div className="card card-v1 mb-card-gap">
                            <div className="card-body">

                                <div className="card-stat-value">
                                    K<sub>full</sub> = β · K<sub>reduced</sub> + (1 - β) · K<sub>hedged</sub>
                                </div>
                            </div>
                        </div>

                        <div className="table-container">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th className="text_table_header_left">Component</th>
                                        <th className="text_table_header_right">Value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="text_table_left">K<sub>reduced</sub></td>
                                        <td className="text_table_right">{kReduced.toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <td className="text_table_left">K<sub>hedged</sub></td>
                                        <td className="text_table_right">{kHedged.toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <td className="text_table_left">β</td>
                                        <td className="text_table_right">0.25</td>
                                    </tr>
                                    <tr>
                                        <td className="text_table_left">β · K<sub>reduced</sub></td>
                                        <td className="text_table_right">{(beta * kReduced).toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <td className="text_table_left">(1 - β) · K<sub>hedged</sub></td>
                                        <td className="text_table_right">{((1 - beta) * kHedged).toFixed(2)}</td>
                                    </tr>
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td className="text_table_left">K<sub>full</sub></td>
                                        <td className="text_table_right">{kFull.toFixed(2)}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </section>

                    {/* K FINAL SECTION */}
                    <section className="view-section">
                        <div className="heading-section">
                            <span>K Final</span>
                        </div>

                        <div className="text-block">
                            <p className="text_body">
                                The final step applies the discount scalar DS<sub>BA-CVA</sub> to K Full. This scalar is a calibration adjustment that reduces the calculated capital to compensate for the conservatism embedded in the standardised framework—particularly the fixed correlation assumption and prescriptive risk weights which tend to overstate risk compared to internal models. The multiplication is straightforward: K Final = DS<sub>BA-CVA</sub> × K Full. The resulting figure is the actual Pillar 1 capital requirement the firm must hold against CVA risk.
                            </p>
                        </div>

                        {/* FORMULA CARD */}
                        <div className="card card-v2">
                            <div className="card-body">

                                <div className="card-stat-value">
                                    K<sub>final</sub> = DS<sub>BA-CVA</sub> · K<sub>full</sub>
                                </div>
                            </div>
                        </div>

                        <div className="table-container">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th className="text_table_header_left">Component</th>
                                        <th className="text_table_header_right">Value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="text_table_left">K<sub>full</sub></td>
                                        <td className="text_table_right">{kFull.toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <td className="text_table_left">DS<sub>BA-CVA</sub></td>
                                        <td className="text_table_right">0.65</td>
                                    </tr>
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td className="text_table_left">K<sub>final</sub></td>
                                        <td className="text_table_right">{kFinal.toFixed(2)}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </section>

                    <NavigationButtons />
                </div>
            </div>
        </div>
    );
};
