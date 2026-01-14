# Technical Exposition of the Basic Approach for Credit Valuation Adjustment (BA-CVA) under PRA Near-Final Rules (PS9/24)

## Table of Contents

1.  **Executive Summary**

2.  **Regulatory Architecture and Scope of Application**

    -   Legislative Context: The PS9/24 and PS17/23 Frameworks

    -   The \"Credit Valuation Adjustment Risk Part\" of the PRA
        > Rulebook

    -   Definition of Covered Transactions

    -   Scope Exclusions and Exemptions

3.  **Technical Taxonomy and Key Definitions**

    -   Distinction Between Accounting CVA and Regulatory CVA

    -   Counterparty Credit Spread Risk

    -   Defining the Netting Set (\$NS\$)

    -   Exposure at Default (\$EAD\$) and its derivation from CCR

4.  **The Basic Approach Framework: Structural Overview**

    -   The Hierarchy of Approaches: SA-CVA, BA-CVA, AA-CVA

    -   Eligibility Criteria for the Basic Approach

    -   The Role of the Discount Scalar (\$DS\_{BA-CVA}\$)

5.  **Calculation of Stand-Alone CVA (\$SCVA_c\$)**

    -   The Fundamental Formula

    -   Parameter Specification: Risk Weights (\$RW_c\$)

    -   Parameter Specification: Effective Maturity (\$M\_{NS}\$)

    -   Parameter Specification: Discount Factor (\$DF\_{NS}\$)

    -   Parameter Specification: Exposure at Default (\$EAD\_{NS}\$)

6.  **The Reduced Basic Approach (Reduced BA-CVA)**

    -   Conceptual Framework: The \"No-Hedge\" Assumption

    -   Aggregation Formula Mechanics

    -   Systematic vs. Idiosyncratic Risk Decomposition

    -   Correlation Parameters (\$\\rho\$)

7.  **The Full Basic Approach (Full BA-CVA)**

    -   Conceptual Framework: Recognition of Hedging Instruments

    -   Eligibility Criteria for Hedges (Single-Name vs. Index)

    -   The Hedging Mismatch Adjustment (\$HMA\$)

    -   Treatment of Index Hedges

8.  **Risk Weight Calibration and Sectoral Mapping**

    -   Analysis of Supervisory Risk Weight Table (Table 1)

    -   Treatment of Sovereigns and Central Banks

    -   Treatment of Financials and Corporates

    -   High-Yield and Non-Rated Penalties

9.  **Specific Transaction Types and Asset Classes**

    -   Securities Financing Transactions (SFTs) and Materiality

    -   Pension Fund Arrangements

    -   Client Clearing and Intragroup Transactions

10. **Reporting, Disclosure, and Transitional Arrangements**

    -   Reporting Templates (CAP 26.02) and Data Granularity

    -   Disclosure Requirements (UKB CVA1)

    -   Transitional Provisions for Legacy Trades

11. **Conclusion**

## 1. Executive Summary

The Prudential Regulation Authority (PRA) has fundamentally restructured
the capital adequacy regime regarding Credit Valuation Adjustment (CVA)
risk through the publication of Policy Statement 9/24 (PS9/24),
\"Implementation of the Basel 3.1 standards near-final rules part 2.\"
This regulatory package, which solidifies and complements the earlier
Policy Statement 17/23 (PS17/23), mandates a transition from existing
modeled approaches to a more prescriptive, standardized framework. At
the heart of this regime lies the **Basic Approach for CVA (BA-CVA)**, a
non-modeled, formulaic methodology designed to quantify the risk of
mark-to-market losses arising from the fluctuation of counterparty
credit spreads.

The BA-CVA serves as the default methodology for the vast majority of
firms that do not seek or qualify for the more complex Standardised
Approach (SA-CVA). The framework is codified in the newly established
**Credit Valuation Adjustment Risk Part** of the PRA Rulebook, which
replaces the relevant articles of the onshored Capital Requirements
Regulation (CRR). The primary objective of the BA-CVA is to deliver a
risk-sensitive capital charge that balances simplicity with granular
differentiation across sectors, credit qualities, and maturities, while
explicitly removing the internal modeling of CVA variance which was a
feature of the previous regime.

Technically, the BA-CVA is bifurcated into two distinct calculation
paths: the **Reduced BA-CVA** and the **Full BA-CVA**. The Reduced
approach offers a simplified calculation for firms that do not hedge CVA
risk, aggregating risk capital based solely on the stand-alone CVA risk
of counterparties. Conversely, the Full approach permits the recognition
of eligible hedges---specifically single-name and index Credit Default
Swaps (CDS)---to offset the capital charge, subject to a rigorous
\"mismatch\" adjustment that penalizes imperfect hedging correlations.
Both approaches rely on a fundamental scalar, the **Discount Scalar
(\$DS\_{BA-CVA}\$)**, set at 0.65, which calibrates the aggregate
requirement to ensure consistency with the broader capital framework and
prevent punitive step-changes in capital requirements relative to the
prior standardized method.

A critical dimension of the PS9/24 rules is the recalibration of
supervisory inputs to reflect UK specificities. Notably, the PRA has
aligned the risk weighting of unrated central banks with their
respective sovereigns, effectively neutralizing capital charges for
high-quality central bank exposures that lack external credit ratings.
Furthermore, the interplay between the Counterparty Credit Risk (CCR)
framework and BA-CVA is tightened; specifically, the removal of the 1.4
alpha factor for pension fund exposures in the CCR calculation flows
directly into the BA-CVA \$EAD\$ inputs, creating a coherent
cross-framework treatment of these entities.

The implementation of these rules, set for **1 January 2026**, requires
firms to fundamentally re-engineer their capital calculation engines.
They must move from aggregate level adjustments to counterparty-level
\$SCVA_c\$ calculations, requiring precise mapping of every netting set
to the new Table 1 risk buckets, accurate computation of effective
maturity without legacy floors for collateralized trades, and the
capability to bifurcate risk into systematic and idiosyncratic
components for mandatory disclosure. This report provides an exhaustive,
technical analysis of these rules, dissecting the mathematical
formulations, eligibility thresholds, and parameter calibrations as set
out in the near-final PRA instruments.

## 2. Regulatory Architecture and Scope of Application

The regulatory architecture governing CVA risk in the United Kingdom is
undergoing a wholesale transformation. The transition involves the
revocation of the relevant sections of the retained EU Capital
Requirements Regulation (CRR) and their replacement with a dedicated
\"Part\" of the PRA Rulebook. This shift allows the PRA to maintain a
dynamic rulebook that is responsive to UK market conditions while
adhering to the Basel 3.1 international standards.

### Legislative Context: The PS9/24 and PS17/23 Frameworks

The near-final rules for CVA risk are the product of a multi-year
consultation process, initiated by Consultation Paper 16/22 (CP16/22)
and crystallized through two primary policy statements.

-   **PS17/23 (Near-final part 1):** Published in December 2023, this
    > document provided the initial near-final text for the Market Risk,
    > CVA Risk, and Counterparty Credit Risk frameworks. It established
    > the core methodology for the BA-CVA.^1^

-   **PS9/24 (Near-final part 2):** Published in September 2024, this
    > document finalized the Credit Risk and Output Floor components but
    > also introduced critical clarifications and amendments to the CVA
    > rules text initially proposed in PS17/23. Importantly, Appendix 2
    > of PS9/24 contains the consolidated \"Near-final PRA Rulebook: CRR
    > Firms: (CRR) Instrument ,\" which includes the definitive legal
    > text for the **Credit Valuation Adjustment Risk Part**.^4^

Firms must rely on the text within PS9/24 Appendix 2 as the source of
truth for all formulas and definitions, as it supersedes previous
drafts. The \"near-final\" designation indicates that while the policy
substance is settled, the formal legal instrument awaits the Treasury\'s
revocation of the existing CRR legislation.^1^

### The \"Credit Valuation Adjustment Risk Part\" of the PRA Rulebook

The **Credit Valuation Adjustment Risk Part** is a self-contained
section of the Rulebook. It is structured to provide a comprehensive
code for CVA capital, largely decoupling it from the direct text of the
CRR, although it cross-references the CCR Part for exposure values. The
Part applies to all **CRR Firms** (banks, building societies, and
designated investment firms) and **CRR Consolidation Entities**, unless
they fall under specific simplified regimes like the Small Domestic
Deposit Taker (SDDT) framework.^4^

The Rulebook mandates that institutions must calculate own funds
requirements for CVA risk in accordance with this Part for all \"covered
transactions\" irrespective of whether they are held in the trading book
or the non-trading book.^6^ This effectively erases the banking
book/trading book boundary for the purposes of CVA risk applicability,
ensuring that the mark-to-market risk of derivative counterparty default
is capitalized wherever it resides in the firm.

### Definition of Covered Transactions

The scope of the CVA risk charge is defined by the concept of \"covered
transactions.\" Under the near-final rules, covered transactions
include:

1.  **Derivatives:** All over-the-counter (OTC) derivative instruments
    > that are not cleared by a qualifying central counterparty (QCCP).
    > This captures the entire universe of bilateral derivatives where
    > the firm faces the credit risk of a specific counterparty.^6^

2.  **Securities Financing Transactions (SFTs):** SFTs (such as
    > repurchase agreements and securities lending) are included in the
    > scope *only if* they are fair-valued for accounting purposes by
    > the firm *and* the CVA risk arising from them is deemed
    > \"material\".^6^

The definition excludes transactions cleared through a QCCP, reflecting
the view that the daily margining and mutualization mechanics of CCPs
mitigate the specific CVA risk profile targeted by this capital charge.

### Scope Exclusions and Exemptions

The PRA Rulebook retains and clarifies specific exclusions from the CVA
risk charge, balancing prudential safety with economic policy
objectives:

-   **Non-Financial Counterparties (NFCs):** Transactions with
    > non-financial counterparties that do not exceed the clearing
    > threshold (NFC-) are generally exempt, aligning with the intent to
    > avoid penalizing corporate hedging.^2^

-   **Pension Funds:** PS17/23 and PS9/24 confirm the removal of the
    > previous temporary exemption for pension fund transactions.
    > However, to mitigate the cliff-edge impact, the PRA has introduced
    > transitional arrangements and specific risk weight adjustments
    > (discussed in Section 8) for these entities.^2^

-   **Intragroup Transactions:** Transactions between entities within
    > the same consolidation group may be exempt from CVA capital
    > requirements, provided they meet specific criteria regarding risk
    > management and legal enforceability, consistent with the existing
    > CRR Article 382 exemptions.^6^

-   **Client Clearing:** Transactions where the firm acts as a clearing
    > member intermediary for a client to a QCCP are excluded, as the
    > firm is not the primary bearer of the CVA risk in the same manner
    > as a principal bilateral trade.^6^

## 3. Technical Taxonomy and Key Definitions

A precise understanding of the BA-CVA requires mastery of the specific
definitions provided in the **Glossary** and **Chapter 1** of the Credit
Valuation Adjustment Risk Part. The framework relies on a distinct
taxonomy that separates regulatory capital mechanics from accounting
standards.

### Distinction Between Accounting CVA and Regulatory CVA

The PRA rules explicitly distinguish between CVA as an accounting
adjustment and CVA as a regulatory risk metric.

-   **Accounting CVA:** Under IFRS 13, CVA is a fair value adjustment
    > reflecting the market price of counterparty credit risk. It
    > includes market-implied probability of default and loss given
    > default.

-   **Regulatory CVA:** For the purpose of BA-CVA, regulatory CVA is not
    > a modeled value derived from the firm\'s books. Instead, it is a
    > **supervisory proxy** calculated using the formulas in the
    > Rulebook. When the rules refer to \"CVA Risk,\" they refer to the
    > risk of changes in this supervisory proxy value, driven by changes
    > in credit spreads.^8^

Consequently, the BA-CVA capital charge is *not* a charge against the
volatility of the firm\'s actual IFRS CVA P&L. It is a charge against
the volatility of a standardized, regulatory construct that approximates
CVA exposure.

### Counterparty Credit Spread Risk

The primary risk factor captured by the BA-CVA is **Counterparty Credit
Spread Risk**. This is defined as the risk of losses arising from
changes in the credit spread of the counterparty. The BA-CVA assumes
that the credit spread is the dominant driver of CVA value changes.
While market risk factors (like interest rates or FX rates) drive the
*exposure* component of CVA, the BA-CVA simplifies this by focusing the
capital charge on the *credit* component, applying risk weights to the
exposure profile.^8^

### Defining the Netting Set (**\$NS\$**)

The unit of calculation for the BA-CVA is the **Netting Set (\$NS\$)**.

-   **Legal Definition:** A group of transactions with a single
    > counterparty that are subject to a legally enforceable bilateral
    > netting agreement.

-   **Treatment:** The BA-CVA inputs (Maturity, Exposure) are aggregated
    > at the netting set level. The rules permit firms to treat a single
    > transaction as its own netting set if no netting agreement
    > exists.^9^

-   **Synthetic Netting Sets:** Crucially, PS17/23 clarified that firms
    > may split a legal netting set into \"synthetic netting sets\" for
    > capital calculation purposes. This allows a firm to apply the
    > SA-CVA to a portion of trades within a netting set (where it has
    > permission) and apply the BA-CVA to the remainder, ensuring
    > flexibility in implementation.^3^

### Exposure at Default (**\$EAD\$**) and its derivation from CCR

The input variable \$EAD\_{NS}\$ is foundational to the \$SCVA_c\$
formula.

-   **Source:** It is derived from the firm\'s Counterparty Credit Risk
    > (CCR) method, typically the Standardised Approach for CCR (SA-CCR)
    > or the Internal Models Method (IMM).

-   **Adjustment:** In the context of CCR, the exposure value is usually
    > calculated as \$\\alpha \\times (RC + PFE)\$, where \$\\alpha =
    > 1.4\$. However, for BA-CVA, the rules generally require the
    > removal of this alpha scaling within the specific \$SCVA_c\$
    > formula (using terms like \$EAD\_{NS}/\\alpha\$), as the CVA
    > framework applies its own scalar (\$DS\_{BA-CVA}\$).

-   **Implication:** This means the BA-CVA is driven by the \"pure\"
    > replacement cost and potential future exposure, un-inflated by the
    > general CCR alpha buffer.^11^

## 4. The Basic Approach Framework: Structural Overview

The Basic Approach is designed as the \"standard\" method for CVA risk,
sitting between the simple Alternative Approach and the complex
Standardised Approach.

### The Hierarchy of Approaches: SA-CVA, BA-CVA, AA-CVA

The PRA establishes a clear hierarchy:

1.  **SA-CVA:** The preferred method for sophisticated firms with active
    > CVA desks. It uses internal sensitivities but requires prior PRA
    > permission.

2.  **BA-CVA:** The default method. If a firm does not have SA-CVA
    > permission, it *must* use BA-CVA (unless eligible for AA-CVA). It
    > uses supervisory formulas and risk weights.

3.  **AA-CVA:** A fallback for firms with limited materiality. Firms
    > with aggregate non-centrally cleared derivative notionals below
    > £88 billion (redenominated from €100bn) may essentially set CVA
    > capital = 100% of CCR capital.^6^

### Eligibility Criteria for the Basic Approach

There are no restrictive eligibility criteria *preventing* the use of
BA-CVA. It is universally available. A firm might effectively be
\"forced\" onto BA-CVA if it fails the stringent model approval
requirements for SA-CVA or if it exceeds the materiality thresholds for
AA-CVA.

-   **Thresholds:** While AA-CVA has a notional threshold (£88bn
    > approx), BA-CVA does not. A global systemically important bank
    > (G-SIB) could theoretically use BA-CVA if it lacked SA-CVA
    > approval, though the capital outcome might be conservative.^6^

### The Role of the Discount Scalar (**\$DS\_{BA-CVA}\$**)

To align the capital outcomes of the formulaic BA-CVA with the more
risk-sensitive SA-CVA, the PRA applies a global calibration parameter.

-   **Parameter:** \$DS\_{BA-CVA}\$

-   **Value:** **0.65**

-   **Function:** The final capital requirement (\$K\$) is multiplied by
    > 0.65. This essentially discounts the calculated risk by 35%,
    > acknowledging that the supervisory aggregation assumptions
    > (perfect correlation within buckets) are conservative. Without
    > this scalar, the BA-CVA would produce punitively high capital
    > charges.^11^

## 5. Calculation of Stand-Alone CVA (**\$SCVA_c\$**)

The engine of the BA-CVA is the calculation of the Stand-Alone CVA
(\$SCVA_c\$) for each counterparty. This value represents the regulatory
CVA risk attributable to a single counterparty \$c\$, assuming no
diversification benefits with other counterparties.

### The Fundamental Formula

According to Rule 4.2 of the Credit Valuation Adjustment Risk Part ^11^,
the formula for \$SCVA_c\$ is:

\$\$SCVA_c = \\frac{1}{\\alpha} \\times RW_c \\times \\sum\_{NS \\in c}
(M\_{NS} \\times EAD\_{NS} \\times DF\_{NS})\$\$

Where the summation \$\\sum\_{NS \\in c}\$ applies if a firm has
multiple netting sets with the same counterparty \$c\$.

### Parameter Specification: Risk Weights (**\$RW_c\$**)

-   **Definition:** The supervisory risk weight assigned to counterparty
    > \$c\$.

-   **Source:** These are taken directly from **Table 1** in the
    > Rulebook (analyzed in Section 8).

-   **Impact:** This is the primary driver of differentiation. A
    > High-Yield corporate (12% RW) generates 24 times more capital per
    > unit of exposure than a Sovereign (0.5% RW).^11^

### Parameter Specification: Effective Maturity (**\$M\_{NS}\$**)

-   **Definition:** The effective maturity of the netting set.

-   **Calculation for IMM Firms:** Determined per CRR Article 162(2)(g).

-   **Calculation for Non-IMM Firms:** Determined per CRR Article
    > 162(2)(b), calculated as the notional-weighted average remaining
    > maturity of the transactions in the netting set.

-   **Constraint:** \$M\_{NS}\$ is capped at the longest contractual
    > remaining maturity in the netting set.

-   **Flooring Exception:** A critical technical nuance in PS9/24 is the
    > clarification regarding the maturity floor. For the purposes of
    > BA-CVA, the maturity floor (typically 1 year in IRB contexts)
    > **does not apply** to fully collateralized transactions. This
    > ensures that short-term SFTs or margined derivatives are not
    > penalized with an artificial 1-year maturity duration, preserving
    > the risk sensitivity of the framework.^10^

### Parameter Specification: Discount Factor (**\$DF\_{NS}\$**)

-   **Definition:** A factor that discounts the exposure to present
    > value.

-   **Formula:** \$DF\_{NS} = \\frac{1 - e\^{-0.05 \\times
    > M\_{NS}}}{0.05 \\times M\_{NS}}\$.

-   **Assumption:** The formula implies a flat supervisory discount rate
    > of 5%.

-   **Simplification:** Firms using the IMM for CCR are permitted to set
    > \$DF\_{NS} = 1.0\$. This simplification is allowed because IMM
    > exposure profiles (\$EAD\$) are often already constructed to
    > reflect time-weighted risk, or simply to reduce operational burden
    > for model users.^11^

### Parameter Specification: Exposure at Default (**\$EAD\_{NS}\$**)

-   **Definition:** The exposure value calculated under the CCR Part
    > (e.g., SA-CCR or IMM).

-   **The Alpha Adjustment:** The formula explicitly divides by
    > \$\\alpha\$ (where \$\\alpha=1.4\$). This term
    > \$\\frac{1}{\\alpha}\$ neutralizes the alpha multiplier inherent
    > in the CCR exposure value. The BA-CVA framework applies its own
    > conservatism via the risk weights and aggregation logic, so
    > applying the CCR alpha would be double-counting.^11^

## 6. The Reduced Basic Approach (Reduced BA-CVA)

The Reduced BA-CVA is the mandatory baseline calculation. Even firms
using the Full BA-CVA must calculate the Reduced version for reporting
purposes, as it represents the \"gross\" risk view.

### Conceptual Framework: The \"No-Hedge\" Assumption

The Reduced BA-CVA ignores any credit hedges the firm may have
purchased. It calculates the capital required as if the firm holds the
CVA risk \"naked.\" This approach is intended for firms that do not
actively hedge CVA or where the hedges do not meet the strict
eligibility criteria of the Full approach.^6^

### Aggregation Formula Mechanics

Once the \$SCVA_c\$ is calculated for every counterparty, the aggregate
capital requirement (\$K\_{reduced}\$) represents the portfolio-level
risk. The aggregation formula uses a square-root-of-sum-of-squares
approach to combine risks, adjusting for correlation.

The formula (Credit Valuation Adjustment Risk Part, Rule 4.2) is:

\$\$K\_{reduced} = DS\_{BA-CVA} \\times \\sqrt{ \\left( \\rho \\cdot
\\sum\_{c} SCVA_c \\right)\^2 + (1 - \\rho\^2) \\cdot \\sum\_{c}
(SCVA_c)\^2 }\$\$

### Systematic vs. Idiosyncratic Risk Decomposition

The formula mathematically separates risk into two orthogonal
components:

1.  **Systematic Component:** \$\\left( \\rho \\cdot \\sum\_{c} SCVA_c
    > \\right)\^2\$

    -   This term sums the \$SCVA_c\$ values *before* squaring.

    -   **Interpretation:** It assumes that all counterparties are
        > perfectly correlated. If credit spreads widen in the market,
        > they widen for everyone. The magnitude is scaled by \$\\rho\$.
        > This captures general market credit risk.

2.  **Idiosyncratic Component:** \$(1 - \\rho\^2) \\cdot \\sum\_{c}
    > (SCVA_c)\^2\$

    -   This term squares the \$SCVA_c\$ values individually *before*
        > summing.

    -   **Interpretation:** It assumes zero correlation between
        > counterparties. It captures the risk that a specific
        > counterparty\'s spread blows out due to name-specific factors
        > (e.g., bankruptcy). This term benefits from diversification (a
        > portfolio of many small exposures has lower idiosyncratic risk
        > than one giant exposure).

### Correlation Parameters (**\$\\rho\$**)

-   **Value:** The supervisory correlation parameter \$\\rho\$ is set at
    > **0.5** (50%).^14^

-   **Implication:** This 50% correlation implies a balance. The
    > regulator assumes that half of the CVA risk is driven by general
    > market movements (Systematic) and half is driven by name-specific
    > fortunes (Idiosyncratic). This is a significant simplification
    > compared to the SA-CVA but provides a robust, conservative floor
    > for capital.

## 7. The Full Basic Approach (Full BA-CVA)

For firms that actively hedge, the Full BA-CVA allows the recognition of
these hedges to reduce the capital requirement.

### Conceptual Framework: Recognition of Hedging Instruments

The Full BA-CVA adjusts the \$SCVA_c\$ terms by subtracting the notional
value of eligible hedges. However, it does not allow a simple 1:1
offset. Instead, it introduces a \"Hedging Mismatch\" term that adds
back capital to account for basis risk (the risk that the hedge does not
perfectly track the exposure).^6^

### Eligibility Criteria for Hedges (Single-Name vs. Index)

Only specific instruments qualify:

-   **Single-Name Hedges:** Credit Default Swaps (CDS) or Contingent CDS
    > that reference:

    -   The counterparty directly.

    -   An entity legally related to the counterparty (e.g.,
        > parent/subsidiary).

    -   An entity belonging to the same sector and region (though this
        > attracts higher mismatch penalties).

-   **Index Hedges:** CDS indices (e.g., iTraxx, CDX) that reference a
    > basket of names. These are used to hedge the *systematic*
    > component of CVA risk.^15^

### The Hedging Mismatch Adjustment (**\$HMA\$**)

The calculation of Full BA-CVA requires calculating a \"mismatch\" term.
While the Reduced approach uses only \$SCVA_c\$, the Full approach uses
\$(SCVA_c - HMA_c)\$ in the aggregation formula (conceptually).

The formula structure effectively becomes:

\$\$K\_{full} = DS\_{BA-CVA} \\times \\sqrt{ (Systematic\\\_Net)\^2 +
(Idiosyncratic\\\_Net)\^2 }\$\$

Where \"Net\" implies the \$SCVA_c\$ values are reduced by hedge
notionals. However, to account for basis risk, the regulations introduce
a mismatch add-on.

The formula for mismatch (\$HMAC\$) is typically:

\$\$HMAC = \\sum\_{h} (1 - r\_{hc}\^2) \\times (Risk\\\_of\\\_Hedge)\$\$

where \$r\_{hc}\$ is the correlation between the hedge \$h\$ and the
counterparty \$c\$.

-   If the hedge is the **exact** counterparty (\$r\_{hc}=1\$), the term
    > becomes zero (perfect hedge).

-   If the hedge is a **proxy** (\$r\_{hc} \< 1\$), the term is
    > positive, adding a capital charge for the imperfection.^15^

### Treatment of Index Hedges

Index hedges are treated differently because they do not map to a single
counterparty \$c\$. They are primarily used to offset the **Systematic
Component** of the aggregation formula. In the Full BA-CVA calculation:

-   Index hedges are subtracted from the \$\\sum SCVA_c\$ term in the
    > systematic part of the square root.

-   They effectively reduce the \"market risk\" portion of the CVA
    > charge but do not reduce the idiosyncratic portion (as an index
    > cannot hedge a specific name\'s default).

## 8. Risk Weight Calibration and Sectoral Mapping

The PRA has adopted the Basel 3.1 risk weights but with crucial
modifications to suit the UK market and competitiveness objectives.
These weights are fixed in **Table 1** of the Credit Valuation
Adjustment Risk Part.

### Analysis of Supervisory Risk Weight Table (Table 1)

The table assigns \$RW_c\$ based on **Sector** and **Credit Quality Step
(CQS)**.

**Table 1: Supervisory Risk Weights (\$RW_c\$) for BA-CVA** ^13^

  **Counterparty Sector**                        **Investment Grade (IG)**   **High Yield (HY) & Unrated (NR)**
  ---------------------------------------------- --------------------------- ------------------------------------
  **Sovereigns** (Central Banks, MDBs)           0.5%                        2.0%
  **Local Government** (PSEs, Public Admin)      1.0%                        4.0%
  **Financials** (Banks, Insurers)               5.0%                        12.0%
  **Basic Materials / Energy / Industrials**     3.0%                        7.0%
  **Consumer Goods / Services / Transport**      3.0%                        8.5%
  **Technology / Telecoms**                      2.0%                        5.5%
  **Health Care / Utilities / Prof. Services**   1.5%                        5.0%
  **Other Sector**                               5.0%                        12.0%

### Treatment of Sovereigns and Central Banks

-   **Sovereigns (0.5% / 2.0%):** These attract the lowest risk weights,
    > acknowledging the low volatility of sovereign spreads relative to
    > corporates.

-   **Unrated Central Banks:** PS9/24 introduces a critical deviation
    > from the draft rules. Firms may now assign the risk weight of the
    > **relevant central government** to an unrated central bank
    > exposure. This prevents unrated central banks (common in non-G7
    > jurisdictions) from falling into the punitive \"Other\" or
    > \"Unrated\" buckets (potentially 12% or higher), instead likely
    > receiving the 0.5% or 2.0% sovereign weight. This alignment
    > recognizes the fiscal interdependence of central banks and
    > states.^16^

### Treatment of Financials and Corporates

-   **Financials (5.0% / 12.0%):** Financial institutions attract the
    > highest sectoral risk weights (tied with \"Other\"). This reflects
    > the systemic nature of financial credit spreads---during a crisis,
    > bank spreads tend to widen aggressively and in correlation.

-   **Corporate Differentiation:** The rules differentiate between
    > corporate sub-sectors. **Technology/Telecoms (2.0%)** and **Health
    > Care/Utilities (1.5%)** are viewed as less volatile than **Basic
    > Materials/Energy (3.0%)**. This granular mapping requires firms to
    > tag every counterparty with a specific NACE code or industry
    > classification to access the lower weights.

### High-Yield and Non-Rated Penalties

The step-up from IG to HY/NR is steep.

-   For **Financials**, the weight jumps from 5.0% to 12.0% (a 2.4x
    > increase).

-   For **Consumer Goods**, it jumps from 3.0% to 8.5% (a 2.8x
    > increase).

-   **Implication:** This structure creates a significant capital
    > incentive for firms to trade with Investment Grade counterparties
    > or to obtain valid credit assessments. Unrated entities are
    > treated as High Yield by default, which is capital-intensive.

## 9. Specific Transaction Types and Asset Classes

### Securities Financing Transactions (SFTs) and Materiality

The inclusion of SFTs (repos, securities lending) is a major scope
expansion in Basel 3.1, but the PRA applies a proportionality filter.

-   **Materiality Threshold:** SFTs are only \"Covered Transactions\" if
    > they are fair-valued *and* CVA risk is material.

-   **Assessment:** The PRA expects firms to assess materiality based on
    > the volatility of SFT credit spreads and the size of the exposure.
    > If deemed immaterial (which is common given the short-term,
    > secured nature of SFTs), they are excluded from the \$SCVA\$
    > calculation entirely. If material, they enter the calculation, but
    > with the benefit of the \"no maturity floor\" rule discussed in
    > Section 5.^7^

### Pension Fund Arrangements

PS9/24 confirms a supportive stance towards Pension Funds.

-   **Exemption Removal:** The blanket exemption for pension funds from
    > CVA capital charges is removed in line with Basel standards.

-   **Mitigation:** To soften the impact, the PRA has:

    1.  Reduced the SA-CCR alpha factor for Pension Funds from 1.4 to
        > 1.0. Since \$EAD\$ is an input to BA-CVA, this linearly
        > reduces the CVA capital charge by \~28%.^3^

    2.  Confirmed that Pension Funds fall into specific sector buckets
        > (likely \"Other Sector\" or \"Financials\" depending on exact
        > legal structure) but the alpha adjustment is the primary lever
        > for relief.

### Client Clearing and Intragroup Transactions

-   **Client Clearing:** When a bank clears a trade for a client (acting
    > as an intermediary), the CVA risk is generally excluded because
    > the firm passes the risk to the CCP.

-   **Intragroup:** Trades between a UK bank and its subsidiary are
    > exempt if they meet the conditions of Article 382 (centralized
    > risk management, prompt transfer of funds). This prevents capital
    > charges on internal bookkeeping trades.^6^

## 10. Reporting, Disclosure, and Transitional Arrangements

The transition to BA-CVA is accompanied by a new reporting framework
designed to give supervisors visibility into the components of the
calculation.

### Reporting Templates (CAP 26.02) and Data Granularity

The PRA has introduced specific reporting templates (e.g., **CAP
26.02**) for CVA risk.

-   **Granularity:** Firms must report the \$SCVA_c\$ components broken
    > down by risk bucket (e.g., Total \$SCVA\$ for Sovereigns, Total
    > \$SCVA\$ for Financials).

-   **Consistency:** PS9/24 rectified early inconsistencies between the
    > reporting instructions and the disclosure templates regarding the
    > square root calculation. The final rules ensure that the reporting
    > templates align with the mathematical definition of
    > \$K\_{reduced}\$ and \$K\_{full}\$.^4^

### Disclosure Requirements (UKB CVA1)

Pillar 3 disclosure requirements (Template **UKB CVA1**) mandate public
transparency.

-   **Systematic vs. Idiosyncratic:** Firms must publicly disclose the
    > \"Systematic component\" and \"Idiosyncratic component\" of their
    > CVA charge separately.

    -   This forces firms to run the aggregation formula\'s two terms
        > explicitly and publish them.

    -   This transparency allows the market to see whether a bank\'s CVA
        > risk is driven by general market concentration (high
        > systematic) or specific large exposures (high
        > idiosyncratic).^19^

### Transitional Provisions for Legacy Trades

Recognizing the capital impact on long-dated trades entered into under
the old regime, Chapter 7 of the Credit Valuation Adjustment Risk Part
introduces transitional measures.

-   **Scope:** Trades entered into before the implementation date (1
    > January 2026) with counterparties that were previously exempt
    > (e.g., NFCs, Pension Funds).

-   **Mechanism:** These trades may benefit from a transitional
    > \"discount\" or continued exemption for a defined period
    > (2026-2029), allowing firms to phase in the capital charge rather
    > than taking a \"day one\" hit. Firms must flag these trades in
    > their reporting to apply the transitional scalar.^4^

## 11. Conclusion

The **Basic Approach for CVA (BA-CVA)**, as finalized in the PRA\'s
PS9/24, represents a rigorous, formulaic standard for capitalizing
counterparty credit spread risk. By replacing internal models with a
supervisory algorithm governed by the **Credit Valuation Adjustment Risk
Part**, the PRA has prioritized consistency and comparability across the
UK banking sector.

The framework\'s mechanics are driven by the **Stand-Alone CVA
(\$SCVA_c\$)** formula, which acts as the fundamental building block.
This formula integrates inputs from the Counterparty Credit Risk
framework (\$EAD\$, \$M\$) but applies distinct CVA-specific
parameters---most notably the **Discount Scalar of 0.65** and the
**Table 1 Risk Weights**. The bifurcation into **Reduced** (no hedging)
and **Full** (hedging recognized) approaches ensures that the regime is
proportionate, offering a simpler path for less sophisticated firms
while rewarding active risk management for those with hedging
capabilities.

The \"Near-Final\" rules also exhibit significant tailoring to the UK
market. The alignment of **unrated Central Bank** risk weights with
Sovereigns and the removal of the **1.4 alpha factor** for Pension Funds
demonstrate a regulatory intent to mitigate disproportionate impacts on
key economic sectors. However, the strict sectoral differentiation in
risk weights and the detailed separation of systematic and idiosyncratic
risks in disclosure requirements impose a higher standard of data
granularity and classification accuracy than the previous standardized
method.

Effective **1 January 2026**, this framework serves as the definitive
rulebook. Firms must now focus on the operational implementation of
these formulas---ensuring accurate netting set mapping, validating
eligibility for the Full approach, and establishing the reporting
infrastructure to handle the distinct systematic/idiosyncratic
breakdowns required by the PRA.

#### Works cited

1.  Basel 3.1 -- PRA PS 9/24 - KPMG International, accessed on January
    > 5, 2026,
    > [[https://kpmg.com/xx/en/our-insights/regulatory-insights/basel-3-1-near-final-rules.html]{.ul}](https://kpmg.com/xx/en/our-insights/regulatory-insights/basel-3-1-near-final-rules.html)

2.  Basel 3.1 Implementation in the UK: An Update on PRA Reforms \|
    > Insights - Skadden, accessed on January 5, 2026,
    > [[https://www.skadden.com/insights/publications/2024/01/basel-31-implementation]{.ul}](https://www.skadden.com/insights/publications/2024/01/basel-31-implementation)

3.  PS17/23 -- Implementation of the Basel 3.1 standards near-final part
    > 1 \| Bank of England, accessed on January 5, 2026,
    > [[https://www.bankofengland.co.uk/prudential-regulation/publication/2023/december/implementation-of-the-basel-3-1-standards-near-final-policy-statement-part-1]{.ul}](https://www.bankofengland.co.uk/prudential-regulation/publication/2023/december/implementation-of-the-basel-3-1-standards-near-final-policy-statement-part-1)

4.  PS9/24 -- Implementation of the Basel 3.1 standards near-final part
    > 2 \| Bank of England, accessed on January 5, 2026,
    > [[https://www.bankofengland.co.uk/prudential-regulation/publication/2024/september/implementation-of-the-basel-3-1-standards-near-final-policy-statement-part-2]{.ul}](https://www.bankofengland.co.uk/prudential-regulation/publication/2024/september/implementation-of-the-basel-3-1-standards-near-final-policy-statement-part-2)

5.  PRA RULEBOOK - (CRR) INSTRUMENT \[2025\] - Bank of England, accessed
    > on January 5, 2026,
    > [[https://www.bankofengland.co.uk/-/media/boe/files/prudential-regulation/consultation-paper/2024/october/cp1324app1.pdf]{.ul}](https://www.bankofengland.co.uk/-/media/boe/files/prudential-regulation/consultation-paper/2024/october/cp1324app1.pdf)

6.  Chapter 7 -- Credit valuation adjustment and counterparty credit
    > risk - Bank of England, accessed on January 5, 2026,
    > [[https://www.bankofengland.co.uk/prudential-regulation/publication/2022/november/implementation-of-the-basel-3-1-standards/credit-valuation-adjustment]{.ul}](https://www.bankofengland.co.uk/prudential-regulation/publication/2022/november/implementation-of-the-basel-3-1-standards/credit-valuation-adjustment)

7.  Response to consultation on Regulatory Technical Standards on CVA
    > risk of securities financing transactions \| European Banking
    > Authority, accessed on January 5, 2026,
    > [[https://www.eba.europa.eu/eba-response/81822?destination=/publications-and-media/events/consultation-regulatory-technical-standards-cva-risk-securities-financing-transactions]{.ul}](https://www.eba.europa.eu/eba-response/81822?destination=/publications-and-media/events/consultation-regulatory-technical-standards-cva-risk-securities-financing-transactions)

8.  Capital Adequacy Requirements (CAR) (2027) -- Chapter 8 -- Credit
    > Valuation Adjustment (CVA) Risk - Office of the Superintendent of
    > Financial Institutions, accessed on January 5, 2026,
    > [[https://www.osfi-bsif.gc.ca/en/guidance/guidance-library/capital-adequacy-requirements-car-2027-chapter-8-credit-valuation-adjustment-cva-risk]{.ul}](https://www.osfi-bsif.gc.ca/en/guidance/guidance-library/capital-adequacy-requirements-car-2027-chapter-8-credit-valuation-adjustment-cva-risk)

9.  PRA Rulebook - (CRR) Instrument \[2025\] - Bank of England, accessed
    > on January 5, 2026,
    > [[https://www.bankofengland.co.uk/-/media/boe/files/prudential-regulation/policy-statement/2025/october/ps1925app2.pdf]{.ul}](https://www.bankofengland.co.uk/-/media/boe/files/prudential-regulation/policy-statement/2025/october/ps1925app2.pdf)

10. Basel 3.1: the PRA issues partial, near-final rules - Grant Thornton
    > UK, accessed on January 5, 2026,
    > [[https://www.grantthornton.co.uk/insights/basel-3.1-the-pra-issues-partial-near-final-rules]{.ul}](https://www.grantthornton.co.uk/insights/basel-3.1-the-pra-issues-partial-near-final-rules)

11. Whistlebrook\'s Considerations on Basel 3.1 Executive Summary,
    > accessed on January 5, 2026,
    > [[https://www.whistlebrook.co.uk/wp-content/uploads/2025/01/Basel-3.1-Whistlebrook-Summary-without-Watermark-Jan-2025-2.pdf]{.ul}](https://www.whistlebrook.co.uk/wp-content/uploads/2025/01/Basel-3.1-Whistlebrook-Summary-without-Watermark-Jan-2025-2.pdf)

12. Capital Adequacy Requirements (CAR) (2024) - Chapter 8 -- Credit
    > Valuation Adjustment (CVA) Risk - Office of the Superintendent of
    > Financial Institutions, accessed on January 5, 2026,
    > [[https://www.osfi-bsif.gc.ca/en/guidance/guidance-library/capital-adequacy-requirements-car-2024-chapter-8-credit-valuation-adjustment-cva-risk]{.ul}](https://www.osfi-bsif.gc.ca/en/guidance/guidance-library/capital-adequacy-requirements-car-2024-chapter-8-credit-valuation-adjustment-cva-risk)

13. MAR50 - Credit valuation adjustment framework - Bank for
    > International Settlements, accessed on January 5, 2026,
    > [[https://www.bis.org/basel_framework/chapter/MAR/50.htm]{.ul}](https://www.bis.org/basel_framework/chapter/MAR/50.htm)

14. Credit Valuation Adjustment (CVA) Risk Reporting -- Instructions -
    > Bank of England, accessed on January 5, 2026,
    > [[https://www.bankofengland.co.uk/-/media/boe/files/prudential-regulation/consultation-paper/2022/november/cva-reporting-instructions.pdf]{.ul}](https://www.bankofengland.co.uk/-/media/boe/files/prudential-regulation/consultation-paper/2022/november/cva-reporting-instructions.pdf)

15. PRA Rulebook - (CRR) Instrument \[2024\] - Bank of England, accessed
    > on January 5, 2026,
    > [[https://www.bankofengland.co.uk/-/media/boe/files/prudential-regulation/policy-statement/2023/december/ps1723app2.pdf]{.ul}](https://www.bankofengland.co.uk/-/media/boe/files/prudential-regulation/policy-statement/2023/december/ps1723app2.pdf)

16. UK Basel 3.1: Near-final Rules Part 2 (PS9/24) - Key Changes \|
    > Katalysys, accessed on January 5, 2026,
    > [[https://www.katalysys.com/insights/uk-basel-3-1-ps924-keychanges]{.ul}](https://www.katalysys.com/insights/uk-basel-3-1-ps924-keychanges)

17. UK Basel 3.1: An overview of the near-final rules \| Katalysys -
    > Risk and Regulatory Advisory, accessed on January 5, 2026,
    > [[https://www.katalysys.com/insights/basel-3-1-cp-16-22-overview-of-proposed-changes]{.ul}](https://www.katalysys.com/insights/basel-3-1-cp-16-22-overview-of-proposed-changes)

18. Counterparty Credit Risk Supervisory Statement - Bank of England,
    > accessed on January 5, 2026,
    > [[https://www.bankofengland.co.uk/-/media/boe/files/prudential-regulation/supervisory-statement/2024/counterparty-credit-risk-ss.pdf]{.ul}](https://www.bankofengland.co.uk/-/media/boe/files/prudential-regulation/supervisory-statement/2024/counterparty-credit-risk-ss.pdf)

19. Annex XXXX Credit valuation adjustment (CVA) disclosure requirements
    > -- Instructions - Bank of England, accessed on January 5, 2026,
    > [[https://www.bankofengland.co.uk/-/media/boe/files/prudential-regulation/consultation-paper/2022/november/cva-disclosure-instructions.pdf]{.ul}](https://www.bankofengland.co.uk/-/media/boe/files/prudential-regulation/consultation-paper/2022/november/cva-disclosure-instructions.pdf)

20. Annex XXXX Credit valuation adjustment (CVA) disclosure requirements
    > -- Instructions - Bank of England, accessed on January 5, 2026,
    > [[https://www.bankofengland.co.uk/-/media/boe/files/prudential-regulation/policy-statement/2024/september/annex-xxxx-cva-disclosure-instructions.pdf]{.ul}](https://www.bankofengland.co.uk/-/media/boe/files/prudential-regulation/policy-statement/2024/september/annex-xxxx-cva-disclosure-instructions.pdf)
