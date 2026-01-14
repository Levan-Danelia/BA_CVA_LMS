import React from 'react';
import { Binary } from 'lucide-react';
import { NavigationButtons } from '../components/NavigationButtons';

export const KHedgedView: React.FC = () => {
    return (
        <div className="view-container">
            <header className="view-header">
                <div className="view-header-content">
                    <Binary className="view-header-icon" />
                    <h1 className="view-header-title">K Hedged</h1>
                </div>
            </header>

            <div className="view-content">
                <div className="content-wrapper">

                    {/* INTRO SECTION */}
                    <section className="view-section">
                        <div className="heading-section">
                            <span>K Hedged</span>
                        </div>

                        <div className="text-block">
                            <p className="text_body">
                                <strong>K Hedged</strong> is the "net" risk view of the portfolio, applying the same aggregation structure as K Reduced but to exposures <em>after</em> accounting for eligible hedges. The formula recognises two types of hedge: <strong>Single Name Hedges (SNH)</strong> reduce both systematic and idiosyncratic risk by offsetting specific counterparty exposures, while <strong>Index Hedges (IH)</strong> reduce only the systematic component since they reference diversified baskets rather than individual names. A third term, <strong>HMA (Hedge Mismatch Adjustment)</strong>, adds back capital to reflect basis risk when hedges do not directly reference the counterparty.
                            </p>
                        </div>

                        {/* FORMULA CARD */}
                        <div className="card card-v1">
                            <div className="card-body">
                                <div className="card-stat-value">
                                    K<sub>hedged</sub> = √ [ <span className="formula-systematic">(ρ · Σ(SCVA<sub>c</sub> - SNH<sub>c</sub>) - Σ IH<sub>i</sub>)<sup>2</sup></span> + <span className="formula-idiosyncratic">Σ(1 - ρ<sup>2</sup>) · (SCVA<sub>c</sub> - SNH<sub>c</sub>)<sup>2</sup></span> + <span className="formula-hma">Σ HMA<sub>c</sub></span> ]
                                </div>
                                <div className="legend-container">
                                    <div className="legend-item">
                                        <div className="legend-dot-systematic"></div>
                                        <span className="legend-label">Systematic Part</span>
                                    </div>
                                    <div className="legend-item">
                                        <div className="legend-dot-idiosyncratic"></div>
                                        <span className="legend-label">Idiosyncratic Part</span>
                                    </div>
                                    <div className="legend-item">
                                        <div className="legend-dot-hma"></div>
                                        <span className="legend-label">HMA Part</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SYSTEMATIC COMPONENT SECTION */}
                        <section className="view-section">
                            <div className="heading-section">
                                <span>Systematic Component</span>
                            </div>
                            <div className="text-block">
                                <p className="text_body">
                                    The term <strong>(ρ · Σ(SCVA<sub>c</sub> - SNH<sub>c</sub>) - IH)<sup>2</sup></strong> captures <strong>systematic risk</strong> after hedging. First, single name hedges (SNH) are netted from each counterparty's SCVA to produce a net exposure figure, then index hedges (IH) are subtracted from the correlated total. Both hedge types reduce systematic risk—SNH by lowering the net exposure at the counterparty level, and IH by directly offsetting the portfolio-wide correlated component.
                                </p>
                            </div>
                        </section>

                        {/* IDIOSYNCRATIC COMPONENT SECTION */}
                        <section className="view-section">
                            <div className="heading-section">
                                <span>Idiosyncratic Component</span>
                            </div>
                            <div className="text-block">
                                <p className="text_body">
                                    The term <strong>(1 - ρ<sup>2</sup>) · Σ(SCVA<sub>c</sub> - SNH<sub>c</sub>)<sup>2</sup></strong> captures <strong>idiosyncratic risk</strong> after hedging. Only single name hedges provide relief here—index hedges are notably absent because they reference diversified baskets and cannot mitigate the risk of a specific counterparty blowing out. The "square then sum" logic continues to reward diversification across net exposures, reflecting the assumption that idiosyncratic shocks are uncorrelated between counterparties.
                                </p>
                            </div>
                        </section>

                        {/* HMA COMPONENT SECTION */}
                        <section className="view-section">
                            <div className="heading-section">
                                <span>Hedging Misalignment (HMA) Component</span>
                            </div>
                            <div className="text-block">
                                <p className="text_body">
                                    The term <strong>Σ HMA<sub>c</sub></strong> is a capital <strong>add-on</strong> for basis risk. When a hedge does not directly reference the counterparty (e.g., using a parent company CDS as a proxy), the SNH term still provides capital relief in the first two components—but HMA "adds back" capital to reflect the risk that the proxy hedge may not perfectly track the actual counterparty spread during market stress.
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
