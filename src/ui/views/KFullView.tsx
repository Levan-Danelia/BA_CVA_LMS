import React from 'react';
import { Settings2 } from 'lucide-react';
import { NavigationButtons } from '../components/NavigationButtons';

export const KFullView: React.FC = () => {
    return (
        <div className="view-container">
            <header className="view-header">
                <div className="view-header-content">
                    <Settings2 className="view-header-icon" />
                    <h1 className="view-header-title">K Full</h1>
                </div>
            </header>

            <div className="view-content">
                <div className="content-wrapper">

                    {/* INTRO SECTION */}
                    <section className="view-section">
                        <div className="heading-section">
                            <span>K Full</span>
                        </div>

                        <div className="text-block">
                            <p className="text_body">
                                <strong>K Full</strong> is a weighted average that blends the unhedged view (K<sub>reduced</sub>) with the hedged view (K<sub>hedged</sub>). This blending ensures firms receive credit for risk management while maintaining a prudent floor—even a perfectly hedged portfolio cannot reduce capital to zero, as the regulator builds in protection against model limitations and hedge failures.
                            </p>
                        </div>

                        <div className="layout-grid-2">
                            {/* K FULL CARD */}
                            <div className="card card-v1">
                                <div className="card-body">
                                    <div className="card-stat-value">
                                        K<sub>full</sub> = β · K<sub>reduced</sub> + (1 - β) · K<sub>hedged</sub>
                                    </div>
                                </div>
                            </div>
                            {/* K FINAL CARD */}
                            <div className="card card-v2">
                                <div className="card-body">
                                    <div className="card-stat-value">
                                        K<sub>final</sub> = DS<sub>BA-CVA</sub> · K<sub>full</sub>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* BETA SECTION */}
                        <section className="view-section">
                            <div className="heading-section">
                                <span>The Beta Multiplier (β)</span>
                            </div>
                            <div className="text-block">
                                <p className="text_body">
                                    The parameter <strong>β (Beta) = 0.25</strong> is the hedge recognition floor, assigning 25% weight to the unhedged K<sub>reduced</sub> and 75% weight to the hedged K<sub>hedged</sub>. In practice, even if a firm employs a perfect hedging strategy that results in K<sub>hedged</sub> = 0, it is still required to hold 25% of the original unhedged capital charge. This constraint exists because no hedge is perfectly correlated with its exposure during extreme market stress—the β floor provides a buffer against basis risk, model uncertainty, and the operational reality that hedges can fail precisely when they are needed most.
                                </p>
                            </div>
                        </section>

                        {/* DISCOUNT SCALAR SECTION */}
                        <section className="view-section">
                            <div className="heading-section">
                                <span>The Discount Scalar (DS)</span>
                            </div>
                            <div className="text-block">
                                <p className="text_body">
                                    The <strong>Discount Scalar (DS<sub>BA-CVA</sub>) = 0.65</strong> is the final calibration multiplier applied to K<sub>full</sub>, effectively reducing the calculated capital requirement by 35%. This discount exists because the BA-CVA framework relies on prescriptive assumptions—such as the fixed 50% correlation parameter—which can be overly conservative. The scalar adjusts the output to a more realistic risk level while maintaining prudential soundness, and also ensures international consistency by aligning UK capital outcomes with Basel 3.1 standards.
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
