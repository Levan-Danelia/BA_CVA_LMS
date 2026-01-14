import React from 'react';
import { Layers } from 'lucide-react';
import { NavigationButtons } from '../components/NavigationButtons';

export const KReducedView: React.FC = () => {
    return (
        <div className="view-container">
            <header className="view-header">
                <div className="view-header-content">
                    <Layers className="view-header-icon" />
                    <h1 className="view-header-title">K Reduced</h1>
                </div>
            </header>

            <div className="view-content">
                <div className="content-wrapper">

                    {/* INTRO SECTION */}
                    <section className="view-section">
                        <div className="heading-section">
                            <span>K Reduced</span>
                        </div>

                        <div className="text-block">
                            <p className="text_body">
                                Once SCVA has been calculated for every counterparty, the next step is aggregation. <strong>K Reduced</strong> represents the total capital requirement assuming no hedges are recognised—it is the "gross" view of portfolio risk. The aggregation formula splits risk into two components: <strong>systematic</strong> (correlated) and <strong>idiosyncratic</strong> (uncorrelated), combined under a square root structure that reflects variance-based portfolio mathematics.
                            </p>
                        </div>

                        {/* FORMULA CARD */}
                        <div className="card card-v1">
                            <div className="card-body">
                                <div className="card-stat-value">
                                    K<sub>reduced</sub> = √ [ <span className="formula-systematic">(ρ · Σ SCVA<sub>c</sub>)<sup>2</sup></span> + <span className="formula-idiosyncratic">(1 - ρ<sup>2</sup>) · Σ SCVA<sub>c</sub><sup>2</sup></span> ]
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
                                    The term <strong>(ρ · Σ SCVA<sub>c</sub>)<sup>2</sup></strong> captures <strong>systematic risk</strong>—the portion of credit spread movements that are correlated across all counterparties. Notice the structure: individual SCVA values are summed <em>before</em> squaring, which is the "sum then square" logic assuming perfect correlation within this component. There is no diversification benefit here—systematic shocks hit the entire portfolio at once.
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
                                    The term <strong>(1 - ρ<sup>2</sup>) · Σ SCVA<sub>c</sub><sup>2</sup></strong> captures <strong>idiosyncratic risk</strong>—shocks unique to individual counterparties that are independent of broader conditions. Here the structure is reversed: individual SCVA values are squared <em>before</em> summing, which is the "square then sum" logic assuming zero correlation between names. The result is a <strong>diversification benefit</strong>—a portfolio of many uncorrelated exposures carries less combined risk than the simple sum of its parts.
                                </p>
                            </div>
                        </section>

                        {/* RHO SECTION */}
                        <section className="view-section">
                            <div className="heading-section">
                                <span>Supervisory Correlation (ρ)</span>
                            </div>
                            <div className="text-block">
                                <p className="text_body">
                                    The parameter <strong>ρ (Rho) = 0.50</strong> is the mathematical engine of the aggregation, determining how much weight falls on systematic versus idiosyncratic risk. This is a fixed supervisory constant—firms cannot substitute their own correlation estimates. At ρ = 0.50, the squared weight on the systematic component is 0.25 (ρ²), while the idiosyncratic component receives 0.75 (1 - ρ²), meaning 75% of portfolio variance is attributed to diversifiable factors—a significant incentive for maintaining granular counterparty exposure.
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
