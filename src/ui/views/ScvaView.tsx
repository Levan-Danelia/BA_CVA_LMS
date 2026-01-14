import React from 'react';
import { Calculator } from 'lucide-react';
import { NavigationButtons } from '../components/NavigationButtons';

export const ScvaView: React.FC = () => {
    return (
        <div className="view-container">
            <header className="view-header">
                <div className="view-header-content">
                    <Calculator className="view-header-icon" />
                    <h1 className="view-header-title">Standalone CVA (SCVA)</h1>
                </div>
            </header>

            <div className="view-content">
                <div className="content-wrapper">

                    {/* SCVA SECTION */}
                    <section className="view-section">
                        <div className="heading-section">
                            <span>Standalone CVA (SCVA)</span>
                        </div>

                        <div className="text-block">
                            <p className="text_body">
                                <strong>Standalone CVA (SCVA)</strong> is the fundamental building block of the BA-CVA framework, representing the capital charge for a single counterparty before any portfolio-level aggregation or hedging recognition. The formula combines four inputs—a risk weight based on sector and credit quality, the exposure size (EAD), the time dimension (maturity), and a discount factor—to produce a standardised measure of credit spread risk that can then be aggregated across the portfolio in K Reduced and K Hedged.
                            </p>
                        </div>

                        {/* FORMULA CARD */}
                        <div className="card card-v1">
                            <div className="card-body">
                                <div className="card-stat-value">
                                    SCVA<sub>c</sub> = (1/α) · RW<sub>c</sub> · Σ (M<sub>NS</sub> · EAD<sub>NS</sub> · DF<sub>NS</sub>)
                                </div>
                            </div>
                        </div>

                        {/* ALPHA SECTION */}
                        <section className="view-section">
                            <div className="heading-section">
                                <span>Alpha (α)</span>
                            </div>
                            <div className="text-block">
                                <p className="text_body">
                                    <strong>Alpha (α)</strong> neutralises the conservatism already embedded in exposure values. Under CCR rules, EAD is typically inflated by a 1.4 multiplier to buffer for model risk, and dividing by α removes this inflation to prevent double-counting when CVA risk weights are applied. For Pension Funds, the CCR framework already uses α = 1.0, so the SCVA calculation mirrors this to maintain consistency across risk frameworks.
                                </p>
                            </div>

                            <div className="layout-grid-2">
                                <div className="card card-v2">
                                    <div className="card-body">
                                        <h3 className="card-title-large">Standard Counterparties</h3>
                                        <p className="card-subtitle">Alpha Scalar</p>
                                        <div className="card-stat-value">1.40</div>
                                        <p className="card-description">
                                            Neutralizes the 1.4 supervisor multiplier applied to exposure values within the standard measurement framework.
                                        </p>
                                    </div>
                                </div>
                                <div className="card card-v3">
                                    <div className="card-body">
                                        <h3 className="card-title-large">Pension Funds</h3>
                                        <p className="card-subtitle">Alpha Scalar</p>
                                        <div className="card-stat-value">1.00</div>
                                        <p className="card-description">
                                            Maintains alignment with the uninflated baseline exposure values utilized for specific fund types.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* RISK WEIGHT SECTION */}
                        <section className="view-section">
                            <div className="heading-section">
                                <span>Risk Weight (RW<sub>c</sub>)</span>
                            </div>
                            <div className="text-block">
                                <p className="text_body">
                                    <strong>Risk Weight (RW<sub>c</sub>)</strong> is determined by two factors: the counterparty's sector and its credit quality (Investment Grade or High Yield/Unrated). Unlike accounting CVA which uses market credit spreads, the regulatory approach uses fixed supervisory weights to provide stability and remove dependence on potentially illiquid or volatile spread data—ensuring capital requirements remain consistent through market cycles.
                                </p>
                            </div>

                            <table className="table">
                                <thead>
                                    <tr>
                                        <th className="text_table_header_left">Counterparty Sector</th>
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

                        {/* EAD SECTION */}
                        <section className="view-section">
                            <div className="heading-section">
                                <span>Exposure at Default (EAD<sub>NS</sub>)</span>
                            </div>
                            <div className="text-block">
                                <p className="text_body">
                                    <strong>Exposure at Default (EAD<sub>NS</sub>)</strong> represents the volume of risk, quantifying the potential loss if the counterparty were to default. The BA-CVA framework does not require a separate exposure engine—it reuses the EAD already calculated under the firm's CCR framework (whether SA-CCR or IMM), ensuring consistency across regulatory capital calculations and avoiding duplicative measurement methodologies.
                                </p>
                            </div>
                        </section>

                        {/* MATURITY SECTION */}
                        <section className="view-section">
                            <div className="heading-section">
                                <span>Effective Maturity (M<sub>NS</sub>)</span>
                            </div>
                            <div className="text-block">
                                <p className="text_body">
                                    <strong>Effective Maturity (M<sub>NS</sub>)</strong> is the time dimension of the formula—longer maturities mean longer exposure to credit spread risk, and therefore higher capital. The calculation method depends on transaction type, firm methodology, and collateralisation status, with floors and caps applied as shown below.
                                </p>
                            </div>

                            {/* UNIFIED MATURITY MATRIX */}
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th className="text_table_header_left">Transaction Type</th>
                                        <th className="text_table_header_left">Methodology</th>
                                        <th className="text_table_header_left">Collateral Status</th>
                                        <th className="text_table_header_right">Regulatory Boundary</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="text_table_left">Derivatives</td>
                                        <td className="text_table_left">Non-IMM (Weighted Average)</td>
                                        <td className="text_table_left">Uncollateralised</td>
                                        <td className="text_table_right">1-Year Floor</td>
                                    </tr>
                                    <tr>
                                        <td className="text_table_left">Derivatives</td>
                                        <td className="text_table_left">Non-IMM (Weighted Average)</td>
                                        <td className="text_table_left">Margined / Collateralised</td>
                                        <td className="text_table_right">No Floor</td>
                                    </tr>
                                    <tr>
                                        <td className="text_table_left">Derivatives</td>
                                        <td className="text_table_left">IMM (Internal Model Method)</td>
                                        <td className="text_table_left">Uncollateralised</td>
                                        <td className="text_table_right">1-Year Floor</td>
                                    </tr>
                                    <tr>
                                        <td className="text_table_left">Derivatives</td>
                                        <td className="text_table_left">IMM (Internal Model Method)</td>
                                        <td className="text_table_left">Margined / Collateralised</td>
                                        <td className="text_table_right">No Floor</td>
                                    </tr>
                                    <tr>
                                        <td className="text_table_left">SFTs (Repos)</td>
                                        <td className="text_table_left">Contractual Maturity</td>
                                        <td className="text_table_left">Fully Collateralised</td>
                                        <td className="text_table_right">No Floor</td>
                                    </tr>
                                    <tr>
                                        <td colSpan={3} className="text_table_left">
                                            All Netting Sets (Full Horizon Capture)
                                        </td>
                                        <td className="text_table_right">Longest Contractual Cap</td>
                                    </tr>
                                </tbody>
                            </table>
                            <p className="table-footnote">
                                Note: Unlike other credit risk frameworks, the BA-CVA does not apply a standard 5-year maturity cap.
                            </p>
                        </section>

                        {/* DISCOUNT FACTOR SECTION */}
                        <section className="view-section">
                            <div className="heading-section">
                                <span>Discount Factor (DF<sub>NS</sub>)</span>
                            </div>
                            <div className="text-block">
                                <p className="text_body">
                                    <strong>Discount Factor (DF<sub>NS</sub>)</strong> adjusts the exposure to present value, ensuring longer-dated exposures do not generate disproportionately high capital charges. For non-IMM firms, the discount factor is a function of maturity applying exponential decay at a 5% supervisory rate, while IMM firms use DF = 1.0 because their exposure models already incorporate time-weighting within the simulation engine.
                                </p>
                            </div>

                            <div className="layout-grid-2">
                                <div className="card card-v5">
                                    <div className="card-body">
                                        <h3 className="card-title-large">Modeling Firms (IMM)</h3>
                                        <p className="card-subtitle">Discount Factor</p>
                                        <div className="card-stat-value">1.0 Fixed</div>
                                        <p className="card-description">
                                            IMM modeled exposure profiles already incorporate discounting and time-weighting within the simulation engine.
                                        </p>
                                    </div>
                                </div>
                                <div className="card card-v6">
                                    <div className="card-body">
                                        <h3 className="card-title-large">Standardized Firms (Non-IMM)</h3>
                                        <p className="card-subtitle">Discount Factor Formula</p>
                                        <div className="card-stat-value">[1 - exp(-0.05 · M)] / (0.05 · M)</div>
                                        <p className="card-description">
                                            The factor is derived from the calculated maturity using the 5% monthly equivalent discount rate.
                                        </p>
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
