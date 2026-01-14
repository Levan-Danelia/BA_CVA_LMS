import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { NavigationButtons } from '../components/NavigationButtons';

export const SnhView: React.FC = () => {
    return (
        <div className="view-container">
            <header className="view-header">
                <div className="view-header-content">
                    <ShieldCheck className="view-header-icon" />
                    <h1 className="view-header-title">Single Name Hedges (SNH)</h1>
                </div>
            </header>

            <div className="view-content">
                <div className="content-wrapper">

                    {/* SNH SECTION */}
                    <section className="view-section">
                        <div className="heading-section">
                            <span>Single Name Hedges (SNH)</span>
                        </div>

                        <div className="text-block">
                            <p className="text_body">
                                <strong>Single Name Hedges (SNH)</strong> provide capital relief by offsetting the credit spread risk of specific counterparties, with eligible instruments including single-name Credit Default Swaps (CDS) and contingent CDS. Unlike index hedges, SNH can reduce both the systematic and idiosyncratic components of K Hedged—however, the relief is not automatic and is scaled by the supervisory correlation (r<sub>hc</sub>) between the hedge reference entity and the counterparty.
                            </p>
                        </div>

                        {/* FORMULA CARD */}
                        <div className="card card-v1">
                            <div className="card-body">
                                <div className="card-stat-value">
                                    SNH<sub>c</sub> = Σ (r<sub>hc</sub> · RW<sub>h</sub> · M<sub>h</sub><sup>SN</sup> · B<sub>h</sub><sup>SN</sup> · DF<sub>h</sub><sup>SN</sup>)
                                </div>
                            </div>
                        </div>

                        {/* CORRELATION SECTION */}
                        <section className="view-section">
                            <div className="heading-section">
                                <span>Supervisory Correlation (r<sub>hc</sub>)</span>
                            </div>
                            <div className="text-block">
                                <p className="text_body">
                                    <strong>Supervisory Correlation (r<sub>hc</sub>)</strong> measures how closely the hedge is expected to track the counterparty's credit spread, acting as an effectiveness scalar on the hedge notional. Direct-match hedges receive full recognition (100%), while proxy hedges—where the reference entity differs from the counterparty—receive reduced recognition to reflect basis risk, as shown in the table below.
                                </p>
                            </div>

                            <table className="table">
                                <thead>
                                    <tr>
                                        <th className="text_table_header_left">Hedge Relationship Type</th>
                                        <th className="text_table_header_left">Criteria</th>
                                        <th className="text_table_header_right">Correlation (r<sub>hc</sub>)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="text_table_left">Direct Match</td>
                                        <td className="text_table_left">The hedge references the counterparty entity directly.</td>
                                        <td className="text_table_right">100%</td>
                                    </tr>
                                    <tr>
                                        <td className="text_table_left">Legally Related</td>
                                        <td className="text_table_left">The hedge references a legally related entity (e.g., Parent or Subsidiary).</td>
                                        <td className="text_table_right">80%</td>
                                    </tr>
                                    <tr>
                                        <td className="text_table_left">Proxy Hedge</td>
                                        <td className="text_table_left">The hedge references an entity sharing the same sector and region.</td>
                                        <td className="text_table_right">50%</td>
                                    </tr>
                                </tbody>
                            </table>
                        </section>

                        {/* RISK WEIGHT SECTION */}
                        <section className="view-section">
                            <div className="heading-section">
                                <span>Hedge Risk Weight (RW<sub>h</sub>)</span>
                            </div>
                            <div className="text-block">
                                <p className="text_body">
                                    <strong>Hedge Risk Weight (RW<sub>h</sub>)</strong> is determined by the sector and credit quality of the hedge's reference entity, using the same supervisory table as SCVA. This symmetry is intentional—when a direct-match CDS references the counterparty itself, the hedge risk weight equals the counterparty risk weight, and combined with r<sub>hc</sub> = 100%, the hedge can fully offset the SCVA in the net calculation.
                                </p>
                            </div>

                            <table className="table">
                                <thead>
                                    <tr>
                                        <th className="text_table_header_left">Reference Entity Sector</th>
                                        <th className="text_table_header_right">Investment Grade (IG)</th>
                                        <th className="text_table_header_right">High Yield & Unrated (HY)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { s: 'Sovereigns (inc. Central Banks, MDBs)', ig: '0.5%', hy: '2.0%' },
                                        { s: 'Local Govt / Public Admin / PSEs', ig: '1.0%', hy: '4.0%' },
                                        { s: 'Financials (inc. Govt-backed Financials)', ig: '5.0%', hy: '12.0%' },
                                        { s: 'Pension Funds', ig: '3.5%', hy: '8.5%' },
                                        { s: 'Industrials, Energy, Agriculture', ig: '3.0%', hy: '7.0%' },
                                        { s: 'Consumer Goods, Services, Transport', ig: '3.0%', hy: '8.5%' },
                                        { s: 'Technology, Telecommunications', ig: '2.0%', hy: '5.5%' },
                                        { s: 'Health Care, Utilities, Professional Services', ig: '1.5%', hy: '5.0%' },
                                        { s: 'Other Sector', ig: '5.0%', hy: '12.0%' }
                                    ].map((row) => (
                                        <tr key={row.s}>
                                            <td className="text_table_left">{row.s}</td>
                                            <td className="text_table_right">{row.ig}</td>
                                            <td className="text_table_right">{row.hy}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </section>

                        {/* MATURITY SECTION */}
                        <section className="view-section">
                            <div className="heading-section">
                                <span>Hedge Maturity (M<sub>h</sub><sup>SN</sup>)</span>
                            </div>
                            <div className="text-block">
                                <p className="text_body">
                                    <strong>Hedge Maturity (M<sub>h</sub><sup>SN</sup>)</strong> is the residual contractual life of the hedging instrument—not the underlying exposure. Longer-dated hedges provide protection over a wider window and therefore contribute greater capital relief, with maturity acting as a volume-weighting factor in the SNH formula.
                                </p>
                            </div>
                        </section>

                        {/* DISCOUNT FACTOR SECTION */}
                        <section className="view-section">
                            <div className="heading-section">
                                <span>Supervisory Discount Factor (DF<sub>h</sub><sup>SN</sup>)</span>
                            </div>
                            <div className="text-block">
                                <p className="text_body">
                                    <strong>Supervisory Discount Factor (DF<sub>h</sub><sup>SN</sup>)</strong> adjusts the hedge to present value using the same 5% supervisory rate as SCVA. Unlike SCVA—where IMM firms may use DF = 1.0—the SNH discount factor applies to <strong>all firms</strong>, standardising the regulatory value of protection and preventing internal models from inflating hedge benefits.
                                </p>
                            </div>

                            <div className="card card-v1">
                                <div className="card-body">
                                    <div className="card-stat-value">
                                        DF<sub>h</sub><sup>SN</sup> = [1 - exp(-0.05 · M<sub>h</sub><sup>SN</sup>)] / (0.05 · M<sub>h</sub><sup>SN</sup>)
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* NOTIONAL SECTION */}
                        <section className="view-section">
                            <div className="heading-section">
                                <span>Hedge Notional (B<sub>h</sub><sup>SN</sup>)</span>
                            </div>
                            <div className="text-block">
                                <p className="text_body">
                                    <strong>Hedge Notional (B<sub>h</sub><sup>SN</sup>)</strong> is the face value of the credit protection—the insured amount the protection seller agrees to pay upon a credit event. This is the base scale upon which all other parameters (correlation, risk weight, maturity, discount factor) are applied, with larger notionals providing greater capital relief subject to the effectiveness adjustments above.
                                </p>
                            </div>
                        </section>

                    </section>

                    <NavigationButtons />
                </div>
            </div>
        </div>
    );
};
