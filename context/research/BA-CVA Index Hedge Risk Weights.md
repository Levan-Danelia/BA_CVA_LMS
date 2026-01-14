# Technical Exposition of Index Hedge Recognition and Risk Weight Derivation within the PRA Basic Approach for CVA (BA-CVA)

## 1. Executive Technical Summary of Index Hedge Architecture

The transposition of the Basel 3.1 standards into the United Kingdom\'s
regulatory framework, finalized through the Prudential Regulation
Authority (PRA) Policy Statement 9/24 (PS9/24) and the associated
*Credit Valuation Adjustment Risk Part* of the PRA Rulebook, establishes
a rigid, formulaic hierarchy for the capitalization of Credit Valuation
Adjustment (CVA) risk. Within this hierarchy, the Basic Approach
(BA-CVA) functions as the mandatory default methodology for institutions
lacking the approval or infrastructure for the Standardised Approach
(SA-CVA). The BA-CVA is bifurcated into a \"Reduced\" path, which
strictly aggregates gross exposure, and a \"Full\" path, which permits
the recognition of hedging instruments.

Index hedges---specifically Index Credit Default Swaps (CDS)---serve a
distinct and mathematically bounded role within the Full BA-CVA. Unlike
single-name hedges, which can offset both systematic and idiosyncratic
risk components of a specific counterparty exposure, index hedges are
recognized exclusively as mitigants of **systematic credit spread
risk**. They are mathematically isolated in the aggregation formula,
appearing solely as a subtraction term (\$IH\$) from the systematic
component of the portfolio\'s Stand-Alone CVA (\$SCVA_c\$). This
isolation reflects the regulatory premise that while indices track broad
market movements (systematic drift), they offer no protection against
the default or credit deterioration of specific, unrelated obligors
(idiosyncratic variance).

The derivation of the capital relief provided by an index hedge is
governed by a prescriptive \"look-through\" methodology. Institutions
must decompose indices into their underlying constituents to calculate a
**name-weighted average risk weight**, which is subsequently scaled by a
**0.7 diversification factor**. This scalar is a critical supervisory
proxy for intra-index diversification, effectively reducing the capital
charge associated with the index notional by 30% relative to a
single-name equivalent. Furthermore, the entire framework is calibrated
by a global **Discount Scalar (\$DS\_{BA-CVA}\$)** of 0.65, which
applies to the final aggregated capital requirement, thereby scaling the
effective benefit of any hedge.

This report provides an exhaustive analysis of the mechanisms governing
Index Hedges under the PRA\'s near-final rules. It focuses specifically
on the derivation of risk weights (\$RW_i\$), the mathematical behavior
of the Index Hedge term (\$IH\$) within the aggregation formula, and the
implications of sectoral mapping tables (Table 1) on capital efficiency.

## 2. The Discount Scalar and Framework Calibration

Before dissecting the specific formulas for index hedges, it is
necessary to establish the global calibration parameter that dictates
the ultimate economic value of any hedging activity within the BA-CVA.
The PRA, aligning with the Basel Committee\'s recalibration, has
introduced a **Discount Scalar (\$DS\_{BA-CVA}\$)** set at **0.65**.

### 2.1 The Mechanic of the Scalar

The Discount Scalar is applied multiplicatively to the final result of
the aggregation formula. If \$K\_{full}\$ represents the capital
requirement calculated using the core formulas (including hedge
recognition), the final Own Funds Requirement (\$K\_{final}\$) is:

\$\$K\_{final} = DS\_{BA-CVA} \\times K\_{full}\$\$

\$\$K\_{final} = 0.65 \\times K\_{full}\$\$

This parameter is not a variable; it is a fixed constant in the *Credit
Valuation Adjustment Risk Part*. Its presence implies that the marginal
capital relief provided by an index hedge is also scaled. For every unit
of risk (\$IH\$) reduced within the formula, the actual capital saving
is only 0.65 units.^1^

### 2.2 Regulatory Rationale and Hedge Implications

The scalar exists because the underlying BA-CVA formulas---based on
assumptions of perfect correlation within buckets and high correlation
across buckets---are inherently conservative. Without the scalar, the
BA-CVA would produce capital requirements significantly in excess of the
Standardised Approach (SA-CVA) or the legacy standardized method,
potentially incentivizing firms to exit client-clearing or market-making
activities.

For the Index Hedge desk, this scalar alters the \"break-even\" analysis
of hedging. The cost of the hedge (carry, transaction costs, bid-offer)
must be weighed against a capital relief benefit that is effectively
discounted by 35%. Consequently, the efficiency of an index hedge in
BA-CVA is driven less by the gross notional and more by the optimization
of the **Risk Weight (\$RW_i\$)** derivation, ensuring that the
calculated \$IH\$ term is maximized relative to the economic cost of the
instrument.

## 3. Mathematical Architecture of the Systematic Component

The recognition of Index Hedges is structurally confined to the
**Systematic Component** of the BA-CVA aggregation formula.
Understanding this confinement is essential for interpreting how risk
weights impact the final capital charge.

### 3.1 The Full BA-CVA Aggregation Formula

The capital requirement for the hedged portfolio (\$K\_{hedged}\$) is
calculated using a square-root-of-sum-of-squares aggregation that
separates risk into systematic and idiosyncratic terms. The formula, as
defined in the *Credit Valuation Adjustment Risk Part* (Rule 4.6) and
Basel standard MAR50.21, is:

\$\$K\_{hedged} = \\sqrt{ \\underbrace{ \\left( \\rho \\cdot \\sum\_{c}
(SCVA_c - SNH_c) - IH \\right)\^2 }\_{\\text{Systematic Risk Term}} +
\\underbrace{ (1 - \\rho\^2) \\cdot \\sum\_{c} (SCVA_c - SNH_c)\^2
}\_{\\text{Idiosyncratic Risk Term}} } + \\sum\_{c} HMA_c\$\$

Where:

-   **\$SCVA_c\$**: Stand-Alone CVA capital for counterparty \$c\$.

-   **\$SNH_c\$**: Risk reduction from single-name hedges for
    > counterparty \$c\$.

-   **\$IH\$**: The Index Hedge term (aggregate risk reduction from
    > index hedges).

-   **\$HMA_c\$**: Hedging Mismatch Adjustment (for single-name proxy
    > hedges).

-   **\$\\rho\$**: Supervisory correlation parameter, set at
    > **0.50**.^2^

### 3.2 Position and Impact of the Index Hedge (**\$IH\$**)

The term \$IH\$ acts as a direct subtrahend in the first term under the
square root.

Analysis of the Systematic Term:

\$\$Systematic = \\left( \\rho \\cdot \\sum\_{c} (SCVA_c - SNH_c) - IH
\\right)\^2\$\$

1.  **Correlation Scaling:** The counterparty risk (\$SCVA_c\$) is
    > scaled by \$\\rho = 0.5\$. This reflects the supervisory
    > assumption that 50% of the CVA volatility is driven by broad
    > market factors.

2.  **Direct Subtraction:** The \$IH\$ term is subtracted from this
    > scaled sum. Critically, \$IH\$ is **not** multiplied by \$\\rho\$
    > inside the parentheses. The formula assumes that the calculated
    > \$IH\$ value already represents a \"systematic equivalent\" risk.

3.  **Non-Negativity:** The term is squared, meaning that if \$IH\$
    > exceeds the systematic exposure (\$\\rho \\cdot \\sum SCVA\$), the
    > term becomes positive again (representing an over-hedged short
    > position). Firms must manage the \$IH\$ quantity to converge the
    > term towards zero without overshooting, as regulatory capital
    > cannot be negative and \"short CVA\" risk is also capitalized.

Analysis of the Idiosyncratic Term:

\$\$Idiosyncratic = (1 - \\rho\^2) \\cdot \\sum\_{c} (SCVA_c -
SNH_c)\^2\$\$

The \$IH\$ term is entirely absent from this component.

-   **Implication:** An index hedge provides **zero relief** for the
    > idiosyncratic portion of the portfolio. Since \$\\rho = 0.5\$, and
    > \$(1 - 0.5\^2) = 0.75\$, a significant portion of the variance
    > (weighted by 0.75 in the sum of squares) remains unhedged by
    > indices. This structural floor ensures that banks cannot use
    > macro-hedges to eliminate the capital requirement for concentrated
    > name-specific risks.

### 3.3 The Absence of Index HMA

The Hedging Mismatch Adjustment (\$HMA_c\$) in the formula applies to
single-name hedges (\$SNH_c\$) where there is a basis mismatch between
the hedge reference entity and the counterparty.

-   **Index Treatment:** There is no corresponding \"\$HMA\_{index}\$\"
    > term added to the end of the formula. The \"basis risk\" of an
    > index---the fact that the index spread does not perfectly track
    > the counterparty portfolio---is handled implicitly by:

    1.  Excluding \$IH\$ from the idiosyncratic term.

    2.  Scaling the counterparty exposure by \$\\rho=0.5\$ in the
        > systematic term, effectively acknowledging that only 50% of
        > the risk is correlated enough to be offset by a market
        > benchmark.

## 4. The Index Hedge (**\$IH\$**) Derivation Formula

The value \$IH\$ is not merely the notional amount of the index. It is a
risk-weighted, duration-adjusted, discounted exposure value derived
through summation across all eligible index instruments.

### 4.1 The Summation Formula

According to the PRA Rulebook (and Basel MAR50.23), \$IH\$ is calculated
as:

\$\$IH = \\sum\_{i} \\left( RW_i \\times M\_{i} \\times B\_{i} \\times
DF\_{i} \\right)\$\$

This linear summation implies that multiple index hedges (e.g., a long
position in iTraxx Main and a long position in CDX IG) are additive in
their risk reduction, provided they are all \"eligible hedges\" (i.e.,
bought protection). If a firm sells protection on an index (short
hedge), \$B_i\$ would be negative, reducing the \$IH\$ term and
potentially increasing the net Systematic component.

### 4.2 Variable Specification: Notional (**\$B\_{i}\$**)

-   **Definition:** \$B_i\$ is the notional amount of the index credit
    > default swap \$i\$.

-   **Currency:** Must be expressed in the reporting currency (GBP for
    > UK firms), requiring FX conversion at spot rates for non-GBP
    > indices (e.g., CDX.NA.IG in USD).

-   **Amortization:** If the index notional amortizes, the current
    > effective notional is used.

### 4.3 Variable Specification: Effective Maturity (**\$M\_{i}\$**)

-   **Definition:** \$M_i\$ is the effective maturity of the index
    > hedge, expressed in years.

-   **Capping Rules:** Consistent with CRR Article 162 logic applied in
    > the CVA Part:

    -   \$M_i\$ is generally the contractual remaining maturity.

    -   Unlike the netting set maturity (\$M\_{NS}\$), which has a floor
        > of 1 year for non-collateralized trades (though PS9/24 removes
        > this floor for fully collateralized transitions), index hedges
        > are typically treated at their actual maturity.

    -   **Mismatch Impact:** A hedge with a short maturity (\$M_i \<
        > M\_{NS}\$) generates a smaller \$IH\$ term because \$M_i\$
        > acts as a linear multiplier. A 1-year hedge provides roughly
        > 20% of the capital relief of a 5-year hedge (ignoring
        > discounting effects), forcing firms to maintain tenor
        > alignment to maximize efficiency.

### 4.4 Variable Specification: Discount Factor (**\$DF\_{i}\$**)

The discount factor is calculated using a continuous compounding formula
with a fixed 5% supervisory interest rate:

\$\$DF\_{i} = \\frac{1 - e\^{-0.05 \\times M\_{i}}}{0.05 \\times
M\_{i}}\$\$

-   **Mathematical Behavior:**

    -   As \$M_i \\to 0\$, \$DF_i \\to 1\$. (Short dated hedges have
        > little discounting).

    -   As \$M_i \\to \\infty\$, \$DF_i\$ decreases. (Long dated hedges
        > are discounted more heavily).

-   **Comparison with Exposure:** The \$SCVA_c\$ calculation uses the
    > same \$DF\$ formula for the counterparty netting set (unless the
    > firm uses IMM and sets \$DF=1\$). This symmetry ensures that the
    > \"time value of risk\" is treated consistently between the
    > exposure and the hedge.

## 5. Risk Weight Derivation: The Look-Through Methodology

The most intricate component of the \$IH\$ calculation is the
**Supervisory Risk Weight (\$RW_i\$)**. The PRA does not assign a single
blanket risk weight to \"Indices.\" Instead, it enforces a
**Look-Through Approach** that derives the risk weight from the
underlying constituents.

### 5.1 The 0.7 Diversification Scalar

A universal rule applies to all index hedges in the BA-CVA: the derived
risk weight is multiplied by **0.7**.

-   **Logic:** This factor accounts for the diversification of
    > idiosyncratic risk within the index. Since the index spread is an
    > average of multiple names, it is less volatile than the spread of
    > any single constituent. The 0.7 factor serves as a dampener,
    > effectively saying, \"An index with an average risk weight of 5%
    > is only as volatile as a single name with a risk weight of 3.5%.\"

-   Formulaic Application:\
    > \
    > \$\$RW\_{final} = RW\_{derived} \\times 0.7\$\$\
    > \
    > This scalar is applied at the very end of the \$RW\$ derivation
    > process.4

### 5.2 Derivation for Homogeneous Indices

An index is defined as **homogeneous** if all its constituents belong to
the **same sector** and represent the **same credit quality** (as
defined by Table 1 buckets).

**Procedure:**

1.  Identify the common Sector (e.g., Financials).

2.  Identify the common Credit Quality (e.g., Investment Grade).

3.  Lookup the corresponding Risk Weight from **Table 1**.

4.  Apply the 0.7 scalar.

\$\$RW_i = RW\_{Table1} \\times 0.7\$\$

*Example:* A specialized index of IG US Banks.

-   Table 1 (Financials, IG) = 5.0%.

-   \$RW_i = 5.0\\% \\times 0.7 = 3.5\\%\$.

### 5.3 Derivation for Heterogeneous (Mixed) Indices

Most benchmark indices (e.g., iTraxx Europe Main, CDX North America
Investment Grade) are **heterogeneous**. They span multiple sectors
(Financials, TMT, Energy, etc.) and may contain mixed credit qualities
(e.g., split-rated names).

Procedure: The Name-Weighted Average

For these indices, the PRA mandates a constituent-level calculation.5

1.  **Decompose** the index into its \$N\$ constituents.

2.  **Assign** a risk weight (\$RW_k\$) to each constituent \$k\$ based
    > on its specific Sector and Credit Quality (IG vs. HY/NR) using
    > Table 1.

3.  **Weight** each \$RW_k\$ by the constituent\'s weight \$w_k\$ in the
    > index (usually \$1/N\$ for standard benchmarks).

4.  **Sum** the weighted risk weights.

5.  **Multiply** the sum by 0.7.

Formula:

\$\$RW\_{i} = 0.7 \\times \\sum\_{k=1}\^{N} \\left( w_k \\times
RW\_{Table1}(Sector_k, Quality_k) \\right)\$\$

### 5.4 Sensitivity Analysis of the Weighted Average

The weighted average mechanism makes the \$RW_i\$ highly sensitive to
the composition of the index.

-   **The \"Financials\" Drag:** Financial constituents have a high base
    > RW (5.0% for IG, 12.0% for HY). An index with a higher proportion
    > of banks (e.g., iTraxx Main vs. CDX IG) will have a higher
    > \$RW_i\$.

    -   *Mathematical Consequence:* A higher \$RW_i\$ increases the
        > \$IH\$ term. Since \$IH\$ is subtracted from the capital
        > requirement, a \"riskier\" index (higher RW) provides a
        > **larger capital offset**. This aligns with the economic
        > reality that a volatile hedge is needed to offset volatile
        > exposures. A bank with significant exposure to other banks
        > (high systematic risk) needs a hedge with a high \$RW\$ (like
        > a Financials-heavy index) to efficiently neutralize that risk.

-   **The \"Unrated\" Penalty:** Unrated constituents default to the
    > High Yield column (unless mapped to Sovereign, see Section 7.3).

    -   IG Corporate: 2.0% - 3.0%.

    -   Unrated Corporate: 5.5% - 8.5% (or 12% for \"Other\").

    -   Inclusion of unrated names spikes the \$RW_i\$, increasing the
        > hedge potency in the formula (assuming the unrated names
        > don\'t trigger internal limit breaches).

## 6. Sectoral Mapping and Table 1 Analysis

The accuracy of the \$RW_i\$ derivation hinges on the correct mapping of
index constituents to the buckets in **Table 1**. The PRA\'s
implementation in PS9/24 introduces specific nuances.

### 6.1 The Table 1 Matrix

The supervisory risk weights are strictly defined:

  **Sector Bucket**                            **IG Risk Weight (%)**   **HY / NR Risk Weight (%)**
  -------------------------------------------- ------------------------ -----------------------------
  **Sovereigns** (Central Banks, MDBs)         0.5%                     2.0%
  **Local Government** (PSEs, Public Admin)    1.0%                     4.0%
  **Financials** (Banks, Insurers)             **5.0%**                 **12.0%**
  **Basic Materials / Energy / Industrials**   3.0%                     7.0%
  **Consumer Goods / Services**                3.0%                     8.5%
  **Technology / Telecoms**                    2.0%                     5.5%
  **Health Care / Utilities**                  1.5%                     5.0%
  **Other Sector**                             5.0%                     12.0%

### 6.2 Sector-Specific Nuances for Indices

1.  **Financials:** The high weights (5.0% / 12.0%) reflect high
    > systemic correlation. Indices tracking the financial sector (e.g.,
    > iTraxx Senior Fin) are the most potent hedges for systematic risk
    > in the BA-CVA formula.

2.  **Technology & Health Care:** These sectors have very low weights
    > (1.5% - 2.0%). Using a generic index to hedge exposure to a
    > Tech-heavy portfolio might result in an **under-hedge** if the
    > index is weighed down by Basic Materials (3.0%). The weighted
    > average calculation forces this granularity.

3.  **Other Sector:** This bucket acts as a catch-all with punitive
    > weights (5.0% / 12.0%). Firms must strive to map every index
    > constituent to a specific sector to avoid falling into \"Other,\"
    > which artificially inflates the RW (though, in a hedging context,
    > this inflation increases the calculated deduction, potentially
    > creating a perverse incentive if not monitored).

### 6.3 Treatment of Unrated Central Banks (PRA Divergence)

A critical modification in PS9/24 concerns unrated central banks.

-   **Basel Baseline:** Unrated central banks typically default to
    > \"Sovereigns (HY/NR)\" at 2.0% or \"Other\" at 12.0%.

-   **PRA Rule:** Firms may assign the risk weight of the **relevant
    > central government** to an unrated central bank exposure.^6^

-   **Impact on Indices:** If an index (e.g., an Emerging Market
    > Sovereign Index) contains central bank obligations:

    -   The firm looks at the sovereign rating.

    -   If the Sovereign is IG, the Central Bank is treated as IG
        > (0.5%).

    -   If the Sovereign is HY, the Central Bank is treated as HY
        > (2.0%).

    -   This prevents the punitive 12.0% \"Other\" weight from
        > distorting the index average.

### 6.4 Treatment of Pension Funds

PS9/24 confirms that Pension Funds are generally not exempt but benefit
from reduced alpha in CCR. In BA-CVA Table 1, they typically fall under
**\"Other Sector\"** or **\"Financials,\"** depending on their legal
constitution.

-   **Index Composition:** If an index were to include pension fund
    > obligations (rare), they would likely attract the 5.0% or 12.0%
    > weight, significantly impacting the average.

## 7. Operational Implementation of Index Look-Through

Implementing the Full BA-CVA for indices requires a dynamic data
architecture capable of \"looking through\" to the constituent level.
This is not a static quarterly exercise but a dynamic requirement
aligned with the reporting frequency.

### 7.1 Dynamic Constituent Data

Indices are not static entities. They \"roll\" every six months (March
and September for iTraxx/CDX), and their composition changes due to
corporate actions (mergers, defaults).

-   **Roll Management:** When an index rolls (e.g., from Series 38 to
    > Series 39), the firm may hold positions in both. The BA-CVA
    > calculation must calculate \$RW_i\$ separately for the old series
    > (off-the-run) and the new series (on-the-run) if their
    > compositions differ.

-   **Defaulted Constituents:** If a constituent defaults, it is removed
    > from the index. The weighted average calculation must exclude the
    > defaulted entity (or treat it as 0 weight) and re-normalize the
    > weights of the survivors, or follow the specific index rulebook
    > for post-default notional.

### 7.2 Data Lineage Requirements

To calculate \$RW_i\$ compliantly, the firm needs the following data
points for every constituent \$k\$ of every index \$i\$:

1.  **Identity:** LEI or Ticker.

2.  **Sector:** NACE code or GICS code, mapped to the 8 PRA buckets.

3.  **Credit Rating:** External rating (S&P, Moody\'s, Fitch), mapped to
    > Credit Quality Step (CQS).

4.  **Weight:** The notional weight of the constituent in the index.

**Operational Risk:** Relying on a \"proxy\" RW for an index (e.g.,
assuming it is all \"Basic Materials\") is generally non-compliant if it
materially misrepresents the risk. However, if a firm lacks data for a
specific constituent, the conservative approach in a *hedging* context
is ambiguous.

-   *Conservative for Exposure:* Assume highest RW.

-   *Conservative for Hedge:* Assume **lowest** RW (minimizing the
    > capital deduction).

-   *Guidance:* Firms should likely default missing constituent data to
    > the lowest applicable RW (e.g., 0.5% Sovereign or 1.5% Health
    > Care) to ensure they are not overstating the benefit of the hedge
    > (\$IH\$).

## 8. Interaction with Correlation and the HMA

While indices do not have a direct \"Mismatch Adjustment\" (\$HMA\$)
added to the end of the formula like single-names, they are subject to
the implicit mismatch of the correlation structure.

### 8.1 The Implicit Penalty

The formula for the systematic term is:

\$\$(\\rho \\cdot \\sum SCVA - IH)\^2\$\$

Because \$\\rho = 0.5\$, the regulator essentially says, \"Your index
hedge (\$IH\$) is assumed to be perfect correlation-wise, BUT your
underlying portfolio (\$SCVA\$) is only 50% correlated with the
systematic factor.\"

-   **Netting Efficiency:** You can only hedge the \"systematic half\"
    > of your exposure. If you have £100 of exposure, only £50 is
    > systematic. If you buy £100 of index protection (assuming RWs
    > match), you are over-hedged on the systematic side (net result
    > -£50, squared to £2,500 risk) and completely unhedged on the
    > idiosyncratic side.

-   **Optimal Strategy:** The optimal index hedge ratio is driven by
    > \$\\rho\$. You should generally aim to hedge only the portion of
    > risk deemed systematic.

### 8.2 Why No HMA for Indices?

Single-name hedges have an \$HMA\$ add-on because a single-name CDS
(e.g., Vodafone) might be used to hedge a different name (e.g.,
Telefonica). This is a \"proxy hedge\" with basis risk.

-   Indices are treated as \"market risk\" instruments. The framework
    > assumes they are *intended* to hedge general market drift, not
    > specific names. Therefore, the \"basis risk\" is the difference
    > between \"Market\" and \"Counterparty,\" which is exactly what the
    > \$\\rho=0.5\$ parameter captures. Adding an extra \$HMA\$ would be
    > double-counting the basis risk.

## 9. Reporting and Disclosure of Index Hedges

The transparency requirements under Basel 3.1 / PRA PS9/24 are
significantly enhanced. Firms must disclose the components of their CVA
charge, explicitly revealing the impact of index hedges.

### 9.1 Pillar 3 Disclosure (Template UKB CVA1)

Firms must disclose:

1.  **Systematic Component:** The value of \$\\sqrt{(\\rho \\cdot \\sum
    > SCVA - IH)\^2}\$.

2.  **Idiosyncratic Component:** The value of \$\\sqrt{(1-\\rho\^2)
    > \\cdot \\sum SCVA\^2}\$.

**Interpretation:**

-   A firm with a high *Idiosyncratic* charge and a low *Systematic*
    > charge is clearly using Index Hedges to \"clean up\" the market
    > risk, leaving only the residual name risk.

-   Regulators and analysts can infer the \"Hedge Effectiveness\" by
    > comparing the unhedged systematic risk (\$\\rho \\cdot \\sum
    > SCVA\$) with the reported systematic component.

### 9.2 Regulatory Reporting (Template CAP 26.02)

In the CAP 26.02 return:

-   **Breakdown:** Firms often report the \$IH\$ term allocated across
    > the risk buckets or as a separate line item depending on the
    > specific template version (PRA rules often require bucket-level
    > granularity).

-   **Look-Through Reporting:** Because \$RW_i\$ is a weighted average,
    > the \"Index\" doesn\'t sit neatly in one bucket (e.g.,
    > \"Financials\"). Reporting instructions typically require
    > splitting the index notional into the relevant buckets based on
    > the constituent weights, or reporting it in a dedicated \"Index\"
    > row if provided, though the calculation logic remains
    > look-through.

## 10. Conclusion

The treatment of Index Hedges in the PRA\'s Basic Approach for CVA
represents a sophisticated balance between standardization and risk
sensitivity. By rejecting a simple \"flat rate\" for indices and
mandating a **name-weighted average look-through**, the PRA ensures that
the capital relief provided by these instruments reflects the true
sectoral and credit quality composition of the hedge.

The introduction of the **0.7 diversification scalar** and the **0.65
global discount scalar** are the two primary levers that calibrate this
framework. The 0.7 scalar recognizes that indices are inherently less
volatile than single names, while the 0.65 scalar aligns the overall
capital outcome with broader prudential goals.

For regulatory capital desks, the message is clear: Index Hedges are
efficient tools for managing the **Systematic** component of CVA risk,
but they offer no relief for **Idiosyncratic** risk. The derivation of
their value requires robust data lineage to map every constituent to the
8 buckets of **Table 1**, ensuring that \"Financial\" concentrations or
\"Unrated\" tails are accurately captured in the risk weight. The result
is a regime where capital efficiency is achieved not just by hedging,
but by the precision of the data used to substantiate the hedge\'s
regulatory value.

### Summary of Key Formulaic Relationships

  **Component**                      **Formula / Value**                                  **Implication for Index Hedge**
  ---------------------------------- ---------------------------------------------------- ----------------------------------------------------------
  **Systematic Term**                \$(\\rho \\cdot \\sum SCVA - IH)\^2\$                \$IH\$ subtracts directly from this term.
  **Idiosyncratic Term**             \$(1 - \\rho\^2) \\cdot \\sum SCVA\^2\$              \$IH\$ is excluded; no relief provided.
  **Correlation (\$\\rho\$)**        \$0.50\$                                             Limits systematic hedge benefit to 50% of exposure.
  **Index Hedge (\$IH\$)**           \$\\sum (RW_i \\cdot M_i \\cdot B_i \\cdot DF_i)\$   Additive sum of risk-weighted hedge notionals.
  **Index Risk Weight (\$RW_i\$)**   \$0.7 \\times \\sum (w_k \\cdot RW\_{Table1})\$      Look-through average scaled by diversification factor.
  **Discount Scalar**                \$0.65\$                                             Final capital relief is 65% of calculated \$IH\$ impact.

This architecture ensures that while Index Hedges are recognized as
powerful macro-hedges, they cannot be used to artificially zero-out the
capital requirements for a portfolio of diversified but specifically
risky counterparties.

#### Works cited

1.  BA-CVA Rules Research Request.docx

2.  Capital Adequacy Requirements (CAR) (2024) - Chapter 8 -- Credit
    > Valuation Adjustment (CVA) Risk - Office of the Superintendent of
    > Financial Institutions, accessed on January 5, 2026,
    > [[https://www.osfi-bsif.gc.ca/en/guidance/guidance-library/capital-adequacy-requirements-car-2024-chapter-8-credit-valuation-adjustment-cva-risk]{.ul}](https://www.osfi-bsif.gc.ca/en/guidance/guidance-library/capital-adequacy-requirements-car-2024-chapter-8-credit-valuation-adjustment-cva-risk)

3.  Capital Adequacy Requirements (CAR) (2027) -- Chapter 8 -- Credit
    > Valuation Adjustment (CVA) Risk - Office of the Superintendent of
    > Financial Institutions, accessed on January 5, 2026,
    > [[https://www.osfi-bsif.gc.ca/en/guidance/guidance-library/capital-adequacy-requirements-car-2027-chapter-8-credit-valuation-adjustment-cva-risk]{.ul}](https://www.osfi-bsif.gc.ca/en/guidance/guidance-library/capital-adequacy-requirements-car-2027-chapter-8-credit-valuation-adjustment-cva-risk)

4.  Credit Valuation Adjustment risk: targeted final revisions - Bank
    > for International Settlements, accessed on January 5, 2026,
    > [[https://www.bis.org/bcbs/publ/d488.pdf]{.ul}](https://www.bis.org/bcbs/publ/d488.pdf)

5.  MAR50 - Credit valuation adjustment framework - Bank for
    > International Settlements, accessed on January 5, 2026,
    > [[https://www.bis.org/basel_framework/chapter/MAR/50.htm]{.ul}](https://www.bis.org/basel_framework/chapter/MAR/50.htm)

6.  PS9/24 -- Implementation of the Basel 3.1 standards near-final part
    > 2 \| Bank of England, accessed on January 5, 2026,
    > [[https://www.bankofengland.co.uk/prudential-regulation/publication/2024/september/implementation-of-the-basel-3-1-standards-near-final-policy-statement-part-2]{.ul}](https://www.bankofengland.co.uk/prudential-regulation/publication/2024/september/implementation-of-the-basel-3-1-standards-near-final-policy-statement-part-2)
