import React from 'react';
import { Zap } from 'lucide-react';
import { NavigationButtons } from '../components/NavigationButtons';

export const HmaView: React.FC = () => {
    return (
        <div className="view-container">
            <header className="view-header">
                <div className="view-header-content">
                    <Zap className="view-header-icon" />
                    <h1 className="view-header-title">Hedge Mismatch Adjustment (HMA)</h1>
                </div>
            </header>

            <div className="view-content">
                <div className="content-wrapper">

                    {/* HMA MAIN SECTION */}
                    <section className="view-section">
                        <div className="heading-section">
                            <span>Hedge Mismatch Adjustment (HMA)</span>
                        </div>

                        <div className="text-block">
                            <p className="text_body">
                                <strong>Hedge Mismatch Adjustment (HMA)</strong> is a capital add-on that penalises imperfect hedges. When a hedge does not directly reference the counterparty, the SNH term still provides capital relief in the systematic and idiosyncratic components—but HMA claws back capital to reflect the residual basis risk. For direct-match hedges (r<sub>hc</sub> = 100%), HMA is zero since there is no mismatch. For proxy hedges (r<sub>hc</sub> &lt; 100%), HMA increases with the size of the mismatch—the more imperfect the hedge, the greater the capital add-on.
                            </p>
                        </div>

                        {/* HMA FORMULA CARD */}
                        <div className="card card-v1">
                            <div className="card-body">
                                <div className="card-stat-value">
                                    HMA<sub>c</sub> = Σ (1 - r<sub>hc</sub><sup>2</sup>) · (RW<sub>h</sub> · M<sub>h</sub><sup>SN</sup> · B<sub>h</sub><sup>SN</sup> · DF<sub>h</sub><sup>SN</sup>)<sup>2</sup>
                                </div>
                            </div>
                        </div>

                        {/* CORRELATION MISMATCH SECTION */}
                        <section className="view-section">
                            <div className="heading-section">
                                <span>Correlation Mismatch Factor (1 - r<sub>hc</sub><sup>2</sup>)</span>
                            </div>
                            <div className="text-block">
                                <p className="text_body">
                                    The term <strong>(1 - r<sub>hc</sub><sup>2</sup>)</strong> is the mismatch factor, with the correlation squared to align with variance-based portfolio logic. For a direct-match hedge (r<sub>hc</sub> = 100%), the factor equals zero—meaning no HMA add-on is required. For a legally related hedge (r<sub>hc</sub> = 80%), the factor is 0.36, and for a proxy hedge (r<sub>hc</sub> = 50%), it rises to 0.75, reflecting the substantial uncertainty about whether the proxy will track the counterparty during market stress.
                                </p>
                            </div>
                        </section>

                        {/* HEDGE RISK SECTION */}
                        <section className="view-section">
                            <div className="heading-section">
                                <span>Hedge Risk Component</span>
                            </div>
                            <div className="text-block">
                                <p className="text_body">
                                    The term <strong>(RW<sub>h</sub> · M<sub>h</sub><sup>SN</sup> · B<sub>h</sub><sup>SN</sup> · DF<sub>h</sub><sup>SN</sup>)<sup>2</sup></strong> is the squared hedge value, using the same risk weight, maturity, notional, and discount factor inputs as the SNH formula. HMA aggregates like idiosyncratic risk—summing squared values (variances) rather than summing values directly—because basis risk between different proxy hedges is assumed to be uncorrelated and therefore always additive.
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
