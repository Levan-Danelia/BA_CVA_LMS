import React from 'react';
import { BookOpen } from 'lucide-react';
import { NavigationButtons } from '../components/NavigationButtons';

export const IntroductionView: React.FC = () => {
    return (
        <div className="view-container">
            <header className="view-header">
                <div className="view-header-content">
                    <BookOpen className="view-header-icon" />
                    <h1 className="view-header-title">Introduction</h1>
                </div>
            </header>

            <div className="view-content">
                <div className="content-wrapper">

                    {/* WELCOME SECTION */}
                    <section className="view-section">
                        <div className="heading-section">
                            <span>Welcome</span>
                        </div>
                        <div className="text-block">
                            <p className="text_body">
                                Welcome to the Basic Approach to Credit Valuation Adjustment (BA-CVA) learning module. This interactive guide will help you understand the standardized methodology for calculating CVA capital requirements under Basel 3.1 regulations. Whether you are new to CVA capital calculations or looking to deepen your understanding, this module provides a structured walkthrough of each component in the framework.
                            </p>
                        </div>
                    </section>

                    {/* WHAT IS CVA SECTION */}
                    <section className="view-section">
                        <div className="heading-section">
                            <span>What is CVA?</span>
                        </div>
                        <div className="text-block">
                            <p className="text_body">
                                Credit Valuation Adjustment (CVA) represents the market value of counterparty credit risk embedded in derivative transactions. When a bank enters into a derivative contract, there is a risk that the counterparty may default before the contract matures, leaving the bank with an unrealized gain that cannot be collected. CVA quantifies this risk as an adjustment to the fair value of derivatives, and regulators require banks to hold capital against potential CVA losses arising from credit spread movements.
                            </p>
                        </div>
                    </section>

                    {/* BA-CVA OVERVIEW SECTION */}
                    <section className="view-section">
                        <div className="heading-section">
                            <span>The BA-CVA Framework</span>
                        </div>
                        <div className="text-block">
                            <p className="text_body">
                                The Basic Approach (BA-CVA) is a standardized method for calculating CVA capital that uses regulatory-prescribed parameters rather than internal models. It provides a structured formula that aggregates counterparty-level CVA contributions while recognizing the capital-reducing benefits of eligible hedges. The framework balances simplicity with risk sensitivity, making it accessible to institutions that do not have approval to use advanced internal models.
                            </p>
                        </div>
                    </section>

                    {/* WHAT YOU WILL LEARN SECTION */}
                    <section className="view-section">
                        <div className="heading-section">
                            <span>What You Will Learn</span>
                        </div>
                        <div className="text-block">
                            <p className="text_body">
                                This module covers all the key components of the BA-CVA calculation, organized in a logical sequence from the high-level capital charge down to individual inputs:
                            </p>
                        </div>

                        <div className="card card-v1">
                            <div className="card-body">
                                <ul className="list-standard">
                                    <li><strong>Process Maps</strong> - Visual flowcharts showing how data flows through the BA-CVA calculation from inputs to final capital.</li>
                                    <li><strong>K Full</strong> - The complete capital charge formula that blends hedged and unhedged components using the beta parameter.</li>
                                    <li><strong>K Reduced</strong> - The unhedged capital charge based solely on counterparty CVA exposures.</li>
                                    <li><strong>K Hedged</strong> - The capital charge after recognizing the risk-reducing effects of eligible hedges.</li>
                                    <li><strong>SCVA</strong> - Standalone CVA calculation for individual counterparties using exposure, maturity, and risk weights.</li>
                                    <li><strong>SNH</strong> - Single Name Hedges that provide direct credit protection on specific counterparties.</li>
                                    <li><strong>HMA</strong> - Hedge Mismatch Adjustment that accounts for basis risk between hedges and exposures.</li>
                                    <li><strong>IH</strong> - Index Hedges that offer broad market-based credit protection through index instruments.</li>
                                    <li><strong>Practice</strong> - Interactive exercises to test your understanding of the BA-CVA framework.</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* HOW TO USE SECTION */}
                    <section className="view-section">
                        <div className="heading-section">
                            <span>How to Use This Module</span>
                        </div>
                        <div className="text-block">
                            <p className="text_body">
                                Navigate through the topics using the sidebar menu or the navigation buttons at the bottom of each page. The content is organized to build understanding progressively—starting with the overall structure and working down to the detailed inputs. Each section includes explanatory text, formulas, and visual aids to reinforce key concepts. We recommend following the sequence in order for the best learning experience, though you can jump to specific topics using the sidebar if you need to reference particular components.
                            </p>
                        </div>
                    </section>

                    <NavigationButtons />
                </div>
            </div>
        </div>
    );
};
