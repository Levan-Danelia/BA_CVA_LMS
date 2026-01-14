# Technical Analysis of the Basic Approach for CVA: Exposure-Hedge Interoperability and Capital Mechanics

## 1. Introduction: The Regulatory Reformation of Counterparty Risk

The global financial architecture governing Counterparty Credit Risk
(CCR) has undergone a fundamental transformation with the finalization
of the Basel 3.1 standards. In the United Kingdom, this transformation
is codified through the Prudential Regulation Authority\'s (PRA) Policy
Statement 9/24 (PS9/24), which establishes a new, rigorous regime for
capitalizing Credit Valuation Adjustment (CVA) risk.^1^ At the core of
this regime lies the Basic Approach for CVA (BA-CVA), a methodology that
replaces internal value-at-risk models with a prescriptive, formulaic
framework designed to approximate the systematic and idiosyncratic risks
inherent in derivative portfolios.

For financial institutions, the transition to BA-CVA is not merely a
calibration exercise; it is a structural overhaul of how risk is
defined, measured, and capitalized. The user's query identifies the
central mechanical tension within this framework: the interaction
between the **Exposure at Default (\$EAD\$)**, which populates the asset
side of the risk equation, and the **Hedge Notional (\$B\$)**, which
populates the mitigation side. These two inputs, derived from disparate
regulatory lineages---one from the statistical conservatism of
counterparty credit risk, the other from the contractual certainty of
credit risk mitigation---must be reconciled within a single aggregation
formula to produce a net capital requirement.

This report provides an exhaustive technical exposition of this
interaction. It demonstrates that the BA-CVA does not function as a
simple arithmetic subtraction of hedge notional from exposure. Instead,
it operates as a sophisticated **risk-weighted normalization engine**.
The framework compels a modification of the \$EAD\$ input (stripping the
alpha factor) and a rigorous adjustment of the Hedge Notional (applying
correlation and currency haircuts) to create a unified unit of
\"economic risk\" before any netting occurs. Furthermore, the non-linear
aggregation logic of the BA-CVA means that the efficiency of this
interaction is asymmetric: while perfect hedging reduces capital,
over-hedging or imperfect hedging can actively penalize the firm through
idiosyncratic variance add-ons.

The analysis that follows dissects every parameter, formula, and
regulatory nuance governing this mechanism, drawing directly from the
PRA Rulebook and the supporting Basel framework documents to guide
practitioners through the optimization of their CVA capital structures.

## 2. Regulatory Architecture: The Hierarchy of Approaches

To understand the specific interaction of variables, one must first
situate the BA-CVA within the broader hierarchy of the PRA\'s prudential
framework. The \"Credit Valuation Adjustment Risk Part\" of the PRA
Rulebook supersedes the legacy provisions of the Capital Requirements
Regulation (CRR), creating a bifurcated landscape for CVA capital.^1^

### 2.1 The Abandonment of Internal Models

Under the previous Basel II.5 regime, many large firms capitalized CVA
risk using an Advanced Method (AM-CVA) based on internal Value-at-Risk
(VaR) models. Basel 3.1 and PS9/24 explicitly remove this capability.
The regulator has determined that the modelling of CVA spread risk is
too fraught with variability and model risk to support a purely internal
approach. Instead, the framework introduces the **Standardised Approach
(SA-CVA)**, which requires prior supervisory permission and relies on
delta and vega sensitivities to specific risk factors, and the **Basic
Approach (BA-CVA)**, which serves as the default.^1^

The BA-CVA is designed as a supervisory proxy. It does not attempt to
model the actual price fluctuation of the CVA liability. Rather, it
constructs a capital charge using a \"constructive\" approach: it
calculates the stand-alone risk of every counterparty based on
supervisory parameters and then aggregates them using a correlation
matrix. It is within this constructive logic that the definitions of
\$EAD\$ and Notional become paramount.

### 2.2 The Calculation Pathways: Reduced vs. Full

The BA-CVA is unique in that it requires firms to run two parallel
calculations to determine the final capital charge.

1.  **Reduced BA-CVA (\$K\_{reduced}\$):** This calculation assumes the
    > firm has *zero hedges*. It aggregates the standalone risk
    > (\$SCVA_c\$) of all counterparties. This serves as a \"gross
    > risk\" baseline.^1^

2.  Full BA-CVA (\$K\_{full}\$): This calculation recognizes eligible
    > hedges. However, the recognition is not total. The final capital
    > requirement is a weighted blend:\
    > \
    > \$\$K\_{total} = DS\_{BA-CVA} \\times \\left( \\beta \\cdot
    > K\_{reduced} + (1 - \\beta) \\cdot K\_{hedged} \\right)\$\$\
    > \
    > Where \$\\beta = 0.25\$.1

This formula reveals the first critical constraint on the interaction
between \$EAD\$ and Notional: **The 25% Floor.** Even if a firm hedges
its exposure perfectly such that the Notional equals the \$EAD\$ and
\$K\_{hedged}\$ drops to zero, the firm must still hold 25% of the
capital required for the unhedged portfolio. This reflects a regulatory
skepticism regarding the permanence and effectiveness of hedges during
times of market stress.^1^ The interaction we are analyzing governs the
\$K\_{hedged}\$ term, which drives 75% of the final capital outcome.

## 3. The Exposure Component: Anatomy of Stand-Alone CVA (**\$SCVA_c\$**)

The first half of the interaction is the **Stand-Alone CVA
(\$SCVA_c\$)**, representing the risk generated by the derivative
portfolio with a specific counterparty \$c\$. The inputs for this
calculation are derived from the Counterparty Credit Risk (CCR)
framework but are subject to critical modifications before entering the
CVA engine.

### 3.1 The Governing Formula

Rule 4.3 of the CVA Risk Part defines \$SCVA_c\$ as follows ^1^:

\$\$SCVA_c = \\frac{1}{\\alpha} \\cdot RW_c \\cdot \\sum\_{NS \\in c}
\\left( M\_{NS} \\cdot EAD\_{NS} \\cdot DF\_{NS} \\right)\$\$

This formula is a linear product of four distinct terms. To understand
how \$EAD\$ interacts with the hedge, we must analyze the specific
\"modification\" applied to it: the alpha adjustment.

### 3.2 The Input: Exposure at Default (**\$EAD\_{NS}\$**)

The \$EAD\_{NS}\$ is the exposure value of the netting set, calculated
using the firm\'s approved CCR methodology---either the **Standardised
Approach for Counterparty Credit Risk (SA-CCR)** or the **Internal Model
Method (IMM)**.^1^

In the context of CCR (Default Risk Capital), \$EAD\$ is defined as:

\$\$EAD\_{CCR} = \\alpha \\times (Replacement\\\_Cost +
Potential\\\_Future\\\_Exposure)\$\$

where \$\\alpha = 1.4\$.1

This alpha factor of 1.4 is a supervisory scalar introduced in Basel
III. It is designed to capture risks that are not explicitly modelled in
the \$RC + PFE\$ framework, specifically:

-   **General Wrong-Way Risk (GWWR):** The risk that credit spreads
    > widen (counterparty credit quality deteriorates) systematically as
    > market risk factors move against the bank.

-   **Model Error:** Uncertainty in the estimation of PFE or Effective
    > Expected Positive Exposure (EEPE).

-   **Granularity:** The fact that credit portfolios are not infinitely
    > granular.

Therefore, the \$EAD\$ sitting in the firm\'s risk system for Default
Risk Capital is an **inflated, stress-calibrated number**. It is 40%
higher than the modelled expectation of exposure.

### 3.3 The Modification: The De-Alpha Adjustment (**\$\\frac{1}{\\alpha}\$**)

The BA-CVA formula explicitly introduces the term
**\$\\frac{1}{\\alpha}\$** as a multiplier.^1^

\$\$Input\_{CVA} = \\frac{1}{1.4} \\times EAD\_{CCR} \\\\ Input\_{CVA} =
\\frac{1}{1.4} \\times (1.4 \\times (RC + PFE)) \\\\ Input\_{CVA} = RC +
PFE\$\$

Theoretical Implication:

This modification is the most critical aspect of the asset-side
calculation. By dividing by 1.4, the regulator is stripping away the
\"Default Risk Buffer\" to isolate the Economic Exposure.

-   **Accounting Alignment:** CVA is a fair value adjustment. It is
    > priced based on the **Expected Exposure (EE)**, which is the mean
    > of the distribution of future values. The CCR \$EAD\$ (with alpha)
    > targets a tail percentile (approximating a 99.9% confidence
    > level). Using a tail metric to calculate the volatility of an
    > expectation (which is what CVA risk represents) would be
    > conceptually flawed and punitive.

-   **Normalization:** This adjustment normalizes the exposure unit. It
    > converts the \"Regulatory Dollar\" (which is 1.40 USD) back into
    > an \"Economic Dollar\" (1.00 USD). This normalization is essential
    > because, as we will see in Section 4, the **Hedge Notional** is
    > inherently an Economic Dollar (a contractual amount). To subtract
    > hedges from exposures, they must be in the same currency of risk.
    > The \$\\frac{1}{\\alpha}\$ term ensures this dimensional
    > consistency.^2^

The Pension Fund Exception:

A nuanced exception exists for Pension Funds. PS9/24 confirms that for
transactions with Pension Funds, the alpha factor in the underlying
SA-CCR calculation is reduced from 1.4 to 1.0.1

-   In this specific case, \$EAD\_{CCR} = 1.0 \\times (RC + PFE)\$.

-   Consequently, the BA-CVA formula divides by \$\\alpha=1\$.

-   The net result is the same: the input to CVA is the pure economic
    > exposure. The regulator achieves this by lowering the input alpha
    > rather than changing the CVA formula itself.

### 3.4 The Time-Value Adjustment: Discount Factor (**\$DF\_{NS}\$**)

The second modification to the exposure is the application of the
Supervisory Discount Factor.

-   **Formula:** \$DF\_{NS} = \\frac{1 - e\^{-0.05 \\cdot M\_{NS}}}{0.05
    > \\cdot M\_{NS}}\$.^1^

-   **Economic Logic:** This factor (which is always \$\\le 1\$)
    > reflects the time value of money, assuming a flat 5% interest
    > rate. It converts the exposure profile into a **Present Value
    > equivalent**.

-   **Interaction with Hedge:** This is crucial for the offset. A hedge
    > notional is typically a static face value. The exposure, however,
    > extends into the future. By discounting the exposure, the
    > regulator ensures that a \$100m hedge (valid today) is compared
    > against the *present value* of the exposure, not its future
    > nominal value.

-   **IMM Override:** For firms using the IMM, \$DF\_{NS}\$ is set to
    > **1.0**. This is because IMM simulations calculate Effective
    > Expected Positive Exposure (EEPE) by averaging profiles over time,
    > which inherently incorporates a form of time-weighting, rendering
    > the separate discount factor redundant or operationally complex to
    > overlay.^1^

### 3.5 The Volatility Scaler: Risk Weight (**\$RW_c\$**)

Finally, the modified, discounted exposure is scaled by the **Risk
Weight (\$RW_c\$)**.

-   This parameter transforms the \"Exposure Amount\" into a \"Risk
    > Amount.\"

-   It is taken from Table 1 of the Rulebook and varies by sector (e.g.,
    > Financials = 5.0%, Corporates = 3.0% for IG).^1^

-   **Interaction Note:** The hedge will also be subject to a Risk
    > Weight. The interaction between \$EAD\$ and Notional is therefore
    > not just a comparison of dollar amounts, but a comparison of
    > **Risk-Weighted Dollars**. A \$100m exposure to a High Yield
    > corporate (\$RW=8.5\\%\$) generates \$8.5m of \"Risk.\" A \$100m
    > hedge on an Investment Grade Bank (\$RW=5\\%\$) generates only
    > \$5m of \"Risk Mitigation.\" This mismatch prevents a simple 1:1
    > offset even if notionals are identical.

## 4. The Hedged Component: Anatomy of Single-Name Hedge (**\$SNH_c\$**)

The second half of the interaction is the **Single-Name Hedge
(\$SNH_c\$)**. This term quantifies the risk mitigation provided by
eligible credit derivatives. The calculation of this term involves its
own set of modifications to the raw contractual notional.

### 4.1 The Governing Formula

Rule 4.7 of the CVA Risk Part defines \$SNH_c\$ as ^1^:

\$\$SNH_c = \\sum\_{h \\in c} \\left( r\_{hc} \\cdot RW_h \\cdot
M_h\^{SN} \\cdot B_h\^{SN} \\cdot DF_h\^{SN} \\right)\$\$

### 4.2 The Input: Hedge Notional (**\$B_h\^{SN}\$**)

The primary input **\$B_h\^{SN}\$** is defined as the **notional of the
single-name eligible BA-CVA hedge**.^1^

-   **Contractual Definition:** For standard Credit Default Swaps (CDS),
    > this is the face value of the protection bought. For Contingent
    > CDS, it is the current market value of the reference portfolio.^1^

-   **No Alpha Adjustment:** Unlike the \$EAD\$ calculation, there is
    > **no regulatory alpha factor** applied to the hedge notional. The
    > formula does not multiply \$B_h\^{SN}\$ by 1.4 or divide it by
    > 1.4. This confirms the logic established in Section 3.3: since the
    > exposure side was \"de-alpha\'ed\" to return to an economic par,
    > the hedge side (which is already at economic par) enters without
    > scalar modification.

### 4.3 The Hidden Modification: Currency Mismatch Haircuts (**\$H\_{fx}\$**)

The user explicitly asked about modifications. While the core BA-CVA
formula for \$SNH\$ uses the term \$B_h\^{SN}\$, deeper regulatory
analysis reveals that this notional is subject to **Credit Risk
Mitigation (CRM)** adjustments before it enters the calculation.

According to **CRE 22.82** (referenced in the broader Basel framework
and PRA credit risk mitigation rules), when there is a currency mismatch
between the credit protection (the hedge) and the underlying obligation
(the exposure), a **haircut (\$H\_{fx}\$)** must be applied.^7^

-   **The Haircut:** The standard supervisory haircut for currency
    > mismatch is **8%** (assuming a 10-day holding period and daily
    > revaluation).^3^

-   Application: The \"effective notional\" recognized for the hedge is
    > reduced:\
    > \
    > \$\$B\_{effective} = B\_{contractual} \\times (1 - H\_{fx})\$\$\
    > \$\$B\_{effective} = B\_{contractual} \\times (1 - 0.08) = 0.92
    > \\times B\_{contractual}\$\$

-   **Interaction:** This means that if a firm hedges a USD exposure
    > with a EUR-denominated CDS, the BA-CVA framework implicitly
    > penalizes the notional by 8% before it even interacts with the
    > exposure. The \$B_h\^{SN}\$ term in the formula effectively
    > represents this **haircut-adjusted notional**. This ensures that
    > the hedge provides a buffer against FX volatility which might
    > erode the value of the protection during a stress event.

### 4.4 The Correlation Haircut (**\$r\_{hc}\$**)

A distinct and explicit modification in the BA-CVA formula is the
**Supervisory Correlation Parameter (\$r\_{hc}\$)**. This parameter acts
as a functional haircut to the notional based on **basis risk**---the
risk that the hedge and the counterparty do not default
simultaneously.^1^

-   **100% (Direct Hedge):** The CDS references the counterparty
    > directly. \$B\_{effective} = 100\\% \\times B\$.

-   **80% (Legal Entity):** The CDS references a parent or subsidiary.
    > \$B\_{effective} = 80\\% \\times B\$.

-   **50% (Sector/Region Proxy):** The CDS references an entity in the
    > same sector and region. \$B\_{effective} = 50\\% \\times B\$.

**Insight:** This parameter dramatically alters the \"working\"
notional. If a firm hedges an illiquid corporate exposure using a liquid
index proxy or a sector peer, the regulator effectively disqualifies 50%
of the hedge\'s notional value from the offset. To achieve a full offset
of the exposure risk, the firm would theoretically need to purchase
**double** the notional of the proxy hedge. However, as detailed in
Section 5, this triggers a secondary penalty via the \$HMAC\$ add-on.

### 4.5 Risk Weight (**\$RW_h\$**) and Maturity (**\$M_h\^{SN}\$**)

Similar to the exposure side, the hedge notional is transformed into
risk units.

-   **Risk Weight:** Ideally, \$RW_h\$ (hedge) equals \$RW_c\$
    > (counterparty). If they differ (e.g., hedging a corporate exposure
    > with a bank CDS), the risk-weighted amounts will diverge.

-   **Maturity:** The hedge maturity \$M_h\$ dictates the discount
    > factor \$DF_h\$. A hedge shorter than the exposure will have a
    > larger \$DF\$ (closer to 1) but a smaller linear multiplier
    > (\$M\$), resulting in a partial offset.

## 5. The Mechanics of Interaction: Netting, Aggregation, and Penalties

The crux of the user\'s query---\"how do these two elements work
together\"---is resolved in the aggregation formula for
**\$K\_{hedged}\$**. The interaction is defined by a process of
**Risk-Weighted Netting** followed by **Non-Linear Aggregation**.

### 5.1 The Netting Term: **\$(SCVA_c - SNH_c)\$**

The BA-CVA does not subtract total hedges from total exposures. It
calculates a Net Risk Position for each counterparty individually.

The core interaction term is:

\$\$Net\\\_Risk_c = SCVA_c - SNH_c\$\$

Substituting the full expansions:

\$\$Net\\\_Risk_c = \\left - \\left\$\$

The Conditions for Perfect Offset:

For the hedge to perfectly neutralize the exposure (i.e.,
\$Net\\\_Risk_c = 0\$), the following must hold:

1.  **Risk Match:** \$RW_c = RW_h\$ (Same sector/quality).

2.  **Maturity Match:** \$M\_{NS} = M_h\$ (Same duration).

3.  **Direct Hedge:** \$r\_{hc} = 100\\%\$ (No basis risk).

4.  **Currency Match:** No FX haircut on \$B_h\$.

If these conditions are met, the Discount Factors (\$DF\$) and Risk
Weights (\$RW\$) factor out, leaving the fundamental interoperability
equation:

\$\$\\frac{EAD\_{NS}}{\\alpha} - B_h\^{SN} = 0\$\$

\$\$B_h\^{SN} = \\frac{EAD\_{NS}}{1.4}\$\$

**Implication:** This is the \"Golden Ratio\" of BA-CVA hedging. To
neutralize the regulatory capital charge, a firm should **not** hedge
the SA-CCR exposure amount. They should hedge the **economic exposure**,
which is approximately **71.4%** (\$\\frac{1}{1.4}\$) of the SA-CCR
\$EAD\$. Hedging the full regulatory \$EAD\$ results in
**over-hedging**.

### 5.2 The Aggregation Logic: The \"Sum of Squares\" Trap

Once the Net Risk for each counterparty is calculated, it is aggregated
using the formula for \$K\_{hedged}\$ ^1^:

\$\$K\_{hedged} = \\sqrt{ \\underbrace{ \\left( \\rho \\cdot \\sum\_{c}
(SCVA_c - SNH_c) - IH \\right)\^2 }\_{\\text{Systematic Risk}} +
\\underbrace{ (1 - \\rho\^2) \\cdot \\sum\_{c} (SCVA_c - SNH_c)\^2
}\_{\\text{Idiosyncratic Risk}} + \\underbrace{ \\sum\_{c} HMAC_c
}\_{\\text{Mismatch Add-on}} }\$\$

This formula reveals why the interaction is not a simple subtraction. It
splits the risk into two orthogonal components:

1\. Systematic Risk (Linear Sum):

\$\\left( \\sum (SCVA - SNH) \\right)\^2\$

-   In this component, netting occurs **across counterparties**.

-   If Counterparty A is over-hedged (Net Risk \< 0) and Counterparty B
    > is under-hedged (Net Risk \> 0), the negative value from A
    > **offsets** the positive value from B.

-   This recognizes that in a systematic market crash, being \"short
    > credit\" on one name hedges being \"long credit\" on another.

2\. Idiosyncratic Risk (Sum of Squares):

\$\\sum (SCVA - SNH)\^2\$

-   In this component, the Net Risk of each counterparty is **squared
    > individually**.

-   **The Over-Hedging Penalty:** Because the square of a negative
    > number is positive, **over-hedging (\$SNH \> SCVA\$) increases the
    > capital charge.**

    -   If Net Risk = +10, Square = 100.

    -   If Net Risk = -10, Square = 100.

-   The regulator penalizes deviation from zero in *either* direction.
    > This prevents firms from speculatively over-hedging single names
    > to reduce their systematic total, as this would leave them exposed
    > to the idiosyncratic risk that the specific hedged name acts
    > differently from the portfolio.

### 5.3 The Mismatch Add-On (**\$HMAC\$**)

The interaction includes a final \"tax\" on the quality of the hedge
interaction, known as the Hedging Mismatch Adjustment (\$HMAC\$).

\$\$HMAC_c = \\sum\_{h \\in c} (1 - r\_{hc}\^2) \\cdot
(Risk\\\_Weighted\\\_Hedge)\^2\$\$

-   This term is **additive**. It sits outside the square root for the
    > individual components but is added to the total variance.

-   If a firm uses a Proxy Hedge (\$r\_{hc} = 50\\%\$), the term \$(1 -
    > 0.5\^2) = 0.75\$.

-   This means 75% of the risk-weighted hedge value is added back to the
    > capital requirement as a penalty for basis risk.

-   **Result:** Even if a proxy hedge arithmetically reduces the
    > \$(SCVA - SNH)\$ term to zero, the \$HMAC\$ ensures that the
    > capital relief is never 100%. This incentivizes the use of Direct
    > Hedges (\$r=100\\%\$, where \$HMAC=0\$) over Proxy Hedges.

## 6. Table: Summary of Variable Interactions

  **Variable**             **Source**          **Modification in BA-CVA**              **Rationale for Modification**                                                                            **Interaction Impact**
  ------------------------ ------------------- --------------------------------------- --------------------------------------------------------------------------------------------------------- ---------------------------------------------------------------------------
  **EAD**                  CCR (SA-CCR/IMM)    Divided by \$\\alpha\$ (1.4)            Converts \"Stressed Regulatory Exposure\" to \"Economic Expected Exposure\" to match CVA pricing logic.   Reduces the target hedge notional required to offset risk.
  **Hedge Notional**       Contract (CDS)      No Alpha Adjustment                     Already represents an economic contractual value.                                                         Must match the de-alpha\'ed EAD.
  **Hedge Notional**       Contract (CDS)      Currency Haircut (\$H\_{fx} = 8\\%\$)   Applied if hedge currency differs from exposure currency (per CRE 22.82).                                 Reduces effective hedge value; requires higher notional to compensate.
  **Effective Maturity**   CCR Rulebook        No 1-Year Floor                         Floor removed for collateralized trades to capture short-term risk sensitivity.                           Hedge maturity must match actual exposure maturity, not regulatory floor.
  **Discount Factor**      Formula             Applied (unless IMM)                    Converts nominal amounts to Present Value.                                                                Hedge must match the duration profile to align discount factors.
  **Correlation**          Supervisory Table   \$r\_{hc}\$ Multiplier (100%/80%/50%)   Penalizes basis risk for proxy hedges.                                                                    Effectively haircuts the hedge notional for offset purposes.

## 7. Strategic Implications and Recommendations

The complex mechanics of the BA-CVA interaction dictate specific
strategies for capital optimization.

### 7.1 Re-Calibrating Hedge Ratios

Traders and Treasury desks must recognize that the \"Capital-Neutral
Hedge\" is **not** the SA-CCR EAD.

-   **Recommendation:** Hedge ratios should be targeted at
    > \$\\frac{EAD\_{SA-CCR}}{1.4}\$. Hedging 100% of the SA-CCR
    > exposure results in a \~40% over-hedge in the BA-CVA calculation.
    > Due to the squared idiosyncratic term, this over-hedge does not
    > provide \"extra safety\"; it actively consumes capital.

### 7.2 Minimizing Mismatch Penalties

The \$HMAC\$ add-on is punitive for proxy hedges (\$r=50\\%\$).

-   **Recommendation:** Where liquidity permits, prioritize **Direct
    > Hedges** (\$r=100\\%\$). If a direct hedge is unavailable, firms
    > should evaluate whether the reduction in the Systematic component
    > achieved by a proxy hedge outweighs the mandatory \$HMAC\$ penalty
    > and the residual Idiosyncratic charge. In many cases, an imperfect
    > proxy hedge may be less capital-efficient than holding no hedge at
    > all, especially if the correlation assumption (\$50\\%\$)
    > overstates the actual economic correlation.

### 7.3 Managing Currency Basis

The interaction analysis confirms that currency mismatches trigger an 8%
haircut on the hedge notional.

-   **Recommendation:** Align the currency of the CDS with the
    > settlement currency of the netting set whenever possible. If
    > cross-currency hedging is necessary, the notional must be
    > \"grossed up\" by approximately \$\\frac{1}{0.92}\$ (approx 8.7%)
    > to achieve the same risk offset, increasing the cost of
    > protection.

### 7.4 Utilizing Index Hedges

While single-name hedges interact with both systematic and idiosyncratic
terms, **Index Hedges (\$IH\$)** interact *only* with the systematic
term.

-   **Recommendation:** Use Index Hedges to manage macro-level credit
    > spread duration (CS01) and systematic drift. Use Single-Name
    > Hedges to surgically remove idiosyncratic outliers. Do not rely on
    > Index Hedges to mitigate high concentrations of single-name risk,
    > as they provide zero relief in the Idiosyncratic aggregation term.

## 8. Conclusion

The interaction between \$EAD\$ and Hedge Notional in the BA-CVA
framework is a study in **regulatory normalization**. The PRA has
constructed a formula that forces two fundamentally different
metrics---a stress-calibrated regulatory exposure and a contractual
hedge notional---to meet on a level playing field: the **Risk-Weighted
Economic Present Value**.

By stripping the alpha factor from the exposure and applying rigorous
haircuts (currency, correlation) to the hedge, the framework isolates
the pure economic volatility of the credit spread. It rewards precision:
the ideal state is a perfectly matched, direct, same-currency hedge
sized to the expected exposure. Any deviation from this ideal---whether
through over-hedging, maturity mismatch, or proxy usage---is met with
non-linear capital penalties. For firms navigating the implementation of
PS9/24, understanding this \"De-Alpha / Risk-Weight / Square-Root\"
mechanic is the key to transforming CVA from a capital burden into a
manageable resource.

#### Works cited

1.  Regulation.docx

2.  Review of the Credit Valuation Adjustment Risk Framework -
    > consultative document - Bank for International Settlements,
    > accessed on January 7, 2026,
    > [[https://www.bis.org/bcbs/publ/d325.pdf]{.ul}](https://www.bis.org/bcbs/publ/d325.pdf)

3.  Capital Adequacy Requirements (CAR) (2024) - Chapter 8 -- Credit
    > Valuation Adjustment (CVA) Risk - Office of the Superintendent of
    > Financial Institutions, accessed on January 7, 2026,
    > [[https://www.osfi-bsif.gc.ca/en/guidance/guidance-library/capital-adequacy-requirements-car-2024-chapter-8-credit-valuation-adjustment-cva-risk]{.ul}](https://www.osfi-bsif.gc.ca/en/guidance/guidance-library/capital-adequacy-requirements-car-2024-chapter-8-credit-valuation-adjustment-cva-risk)

4.  Credit Valuation Adjustment risk: targeted final revisions - Bank
    > for International Settlements, accessed on January 7, 2026,
    > [[https://www.bis.org/bcbs/publ/d488.pdf]{.ul}](https://www.bis.org/bcbs/publ/d488.pdf)

5.  Chapter 7 -- Credit valuation adjustment and counterparty credit
    > risk - Bank of England, accessed on January 7, 2026,
    > [[https://www.bankofengland.co.uk/prudential-regulation/publication/2022/november/implementation-of-the-basel-3-1-standards/credit-valuation-adjustment]{.ul}](https://www.bankofengland.co.uk/prudential-regulation/publication/2022/november/implementation-of-the-basel-3-1-standards/credit-valuation-adjustment)

6.  MAR50 - Credit valuation adjustment framework - Bank for
    > International Settlements, accessed on January 7, 2026,
    > [[https://www.bis.org/basel_framework/chapter/MAR/50.htm]{.ul}](https://www.bis.org/basel_framework/chapter/MAR/50.htm)

7.  Basel III: Finalising post-crisis reforms - Bank for International
    > Settlements, accessed on January 7, 2026,
    > [[https://www.bis.org/bcbs/publ/d424.pdf]{.ul}](https://www.bis.org/bcbs/publ/d424.pdf)

8.  CA-4.5.12 - CBB Rulebook, accessed on January 7, 2026,
    > [[https://cbben.thomsonreuters.com/rulebook/ca-4512-3]{.ul}](https://cbben.thomsonreuters.com/rulebook/ca-4512-3)
