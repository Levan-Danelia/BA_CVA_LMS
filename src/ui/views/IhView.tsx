import React from 'react';
import { BarChart3 } from 'lucide-react';
import { NavigationButtons } from '../components/NavigationButtons';

export const IhView: React.FC = () => {
    return (
        <div className="view-container">
            <header className="view-header">
                <div className="view-header-content">
                    <BarChart3 className="view-header-icon" />
                    <h1 className="view-header-title">Index Hedges (IH)</h1>
                </div>
            </header>

            <div className="view-content">
                <div className="content-wrapper">

                    {/* IH MAIN SECTION */}
                    <section className="view-section">
                        <div className="heading-section">
                            <span>Index Hedges (IH)</span>
                        </div>

                        <div className="text-block">
                            <p className="text_body">
                                <strong>Index Hedges (IH)</strong> provide capital relief by offsetting systematic CVA risk, with eligible instruments including index CDS such as iTraxx and CDX. Unlike single name hedges, index hedges <strong>only reduce the systematic component</strong> of K Hedged—they cannot mitigate idiosyncratic risk because an index tracks broad market credit movements rather than individual counterparty spreads. This limitation is structural: when a specific counterparty deteriorates independently of the market, the index hedge provides no protection.
                            </p>
                        </div>

                        {/* IH FORMULA CARD */}
                        <div className="card card-v1">
                            <div className="card-body">
                                <div className="card-stat-value">
                                    IH = Σ (RW<sub>i</sub><sup>ind</sup> · M<sub>i</sub><sup>ind</sup> · B<sub>i</sub><sup>ind</sup> · DF<sub>i</sub><sup>ind</sup>)
                                </div>
                            </div>
                        </div>

                        {/* RISK WEIGHT SECTION */}
                        <section className="view-section">
                            <div className="heading-section">
                                <span>Index Risk Weight (RW<sub>i</sub><sup>ind</sup>)</span>
                            </div>
                            <div className="text-block">
                                <p className="text_body">
                                    <strong>Index Risk Weight (RW<sub>i</sub><sup>ind</sup>)</strong> is derived using a look-through approach, where the regulator requires firms to decompose indices into their underlying constituents and calculate a name-weighted average of risk weights. A <strong>0.70 scalar</strong> is then applied to the derived weight to reflect the diversification benefit within the index—since an index is less volatile than any single constituent, it deserves a lower risk weight than the simple average would suggest.
                                </p>
                            </div>
                        </section>

                        <table className="table">
                            <thead>
                                <tr>
                                    <th className="text_table_header_left">Reference Sector (Constituents)</th>
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

                        {/* LOOK-THROUGH EXAMPLE */}
                        <section className="view-section">
                            <div className="heading-section">
                                <span>Look-Through Example</span>
                            </div>
                            <div className="text-block">
                                <p className="text_body">
                                    For a heterogeneous index containing constituents from different sectors, the look-through approach requires calculating the name-weighted average of constituent risk weights before applying the 0.70 scalar. The example below illustrates this for an index with 60% Financials (IG) and 40% Industrials (IG) constituents.
                                </p>
                            </div>

                            <table className="table">
                                <thead>
                                    <tr>
                                        <th className="text_table_header_left">Constituent Group</th>
                                        <th className="text_table_header_right">Weight</th>
                                        <th className="text_table_header_right">RW</th>
                                        <th className="text_table_header_right">Contribution</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="text_table_left">Financials (IG)</td>
                                        <td className="text_table_right">60%</td>
                                        <td className="text_table_right">5.0%</td>
                                        <td className="text_table_right">3.00%</td>
                                    </tr>
                                    <tr>
                                        <td className="text_table_left">Industrials (IG)</td>
                                        <td className="text_table_right">40%</td>
                                        <td className="text_table_right">3.0%</td>
                                        <td className="text_table_right">1.20%</td>
                                    </tr>
                                </tbody>
                                <tfoot>
                                    <tr className="text_table_left">
                                        <td colSpan={3} className="text_table_left">Base Weight</td>
                                        <td className="text_table_right">4.20%</td>
                                    </tr>
                                    <tr className="text_table_left">
                                        <td colSpan={3} className="text_table_left">Final RW (× 0.70)</td>
                                        <td className="text_table_right">2.94%</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </section>

                        {/* MATURITY SECTION */}
                        <section className="view-section">
                            <div className="heading-section">
                                <span>Hedge Maturity (M<sub>i</sub><sup>ind</sup>)</span>
                            </div>
                            <div className="text-block">
                                <p className="text_body">
                                    <strong>Hedge Maturity (M<sub>i</sub><sup>ind</sup>)</strong> is the residual contractual life of the index hedge, measured in years. Longer-dated hedges provide greater capital relief as they protect over a wider window of potential market stress, with maturity acting as a volume-weighting factor in the IH formula similar to its role in SNH.
                                </p>
                            </div>
                        </section>

                        {/* NOTIONAL SECTION */}
                        <section className="view-section">
                            <div className="heading-section">
                                <span>Hedge Notional (B<sub>i</sub><sup>ind</sup>)</span>
                            </div>
                            <div className="text-block">
                                <p className="text_body">
                                    <strong>Hedge Notional (B<sub>i</sub><sup>ind</sup>)</strong> is the face value of the index CDS position, representing the total amount of protection purchased. For non-GBP indices (e.g., CDX in USD or iTraxx in EUR), the notional must be converted to the firm's reporting currency at spot rates to ensure consistency with the exposure side of the calculation.
                                </p>
                            </div>
                        </section>

                        {/* DISCOUNT FACTOR SECTION */}
                        <section className="view-section">
                            <div className="heading-section">
                                <span>Supervisory Discount Factor (DF<sub>i</sub><sup>ind</sup>)</span>
                            </div>
                            <div className="text-block">
                                <p className="text_body">
                                    <strong>Supervisory Discount Factor (DF<sub>i</sub><sup>ind</sup>)</strong> adjusts the hedge to present value using the same 5% supervisory rate applied throughout the BA-CVA framework. Like SNH, this standardised factor applies to all firms regardless of their exposure methodology, ensuring consistent treatment of hedges across institutions.
                                </p>
                            </div>

                            <div className="card card-v1">
                                <div className="card-body">
                                    <div className="card-stat-value">
                                        DF<sub>i</sub><sup>ind</sup> = [1 - exp(-0.05 · M<sub>i</sub><sup>ind</sup>)] / (0.05 · M<sub>i</sub><sup>ind</sup>)
                                    </div>
                                </div>
                            </div>
                        </section>
                    </section>

                    <NavigationButtons />
                </div>
            </div>
        </div>
    );
};
