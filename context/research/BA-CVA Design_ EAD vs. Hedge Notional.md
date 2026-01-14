# The Structural Mechanics and Regulatory Rationale of the Basic Approach for CVA (BA-CVA): A Comprehensive Analysis of Exposure at Default versus Hedge Notional Netting

## Executive Summary

The implementation of the Basel 3.1 standards marks a definitive turning
point in the prudential regulation of trading book and counterparty
credit risks. Within this broader transformation, the capitalization of
Credit Valuation Adjustment (CVA) risk has undergone a fundamental
architectural redesign. The transition involves the retirement of the
legacy Internal Model Method (IMM) for CVA in favor of a bifurcated
framework comprising the sensitivity-based Standardised Approach
(SA-CVA) and the formulaic Basic Approach (BA-CVA). The BA-CVA, codified
for UK firms in the Prudential Regulation Authority's (PRA) Policy
Statement 9/24 (PS9/24) and the *Credit Valuation Adjustment Risk Part*
of the Rulebook, serves as the mandatory default methodology for the
vast majority of institutions that lack the requisite approval or
infrastructure for the SA-CVA.

A defining and structurally complex feature of the BA-CVA is its
mechanism for recognizing risk mitigation. The framework mandates a
direct comparison---and subsequent netting---of **Exposure at Default
(EAD)**, a dynamic risk measure derived from Counterparty Credit Risk
(CCR) calculations, against the **Notional Amount** of eligible hedging
instruments. This design choice, which juxtaposes a modelled, potential
future exposure against a static contractual value, initially appears to
introduce a dimensional incoherence. Critics and practitioners often
point to the fundamental mismatch between a stochastic exposure profile
(EAD) and a fixed hedge size (Notional) as a source of significant basis
risk and capital volatility.

However, an exhaustive analysis of the regulatory text, the underlying
financial theory, and the calibration objectives reveals that this
comparison is not a simplistic subtraction of unlike terms. Rather, it
is a sophisticated, albeit coarse, **supervisory proxy** designed to
approximate the netting of credit spread sensitivities (CS01) without
imposing the operational burden of calculating Greeks. By subjecting
both the EAD and the Hedge Notional to a consistent system of
supervisory Risk Weights (\$RW\$) and Discount Factors (\$DF\$), the
regulator converts these disparate inputs into standardized \"risk
units\" or \"bond-equivalent\" values that are mathematically comparable
within the logic of the framework.

The rationale for this design is tripartite, driven by the competing
necessities of **operational simplicity**, **prudential conservatism**,
and **regulatory consistency**.

1.  **Simplicity:** By utilizing EAD (an output already mandated for CCR
    > capital) and Notional (a primary trade attribute), the framework
    > eliminates the need for the \"Basic\" firm to build a dedicated
    > market risk sensitivity engine, aligning the capital requirement
    > with the capabilities of Tier 2 and Tier 3 institutions.

2.  **Conservatism:** The regulator explicitly acknowledges the basis
    > risk inherent in comparing dynamic exposures with static hedges.
    > This is not ignored but is priced into the capital charge via the
    > **Hedging Mismatch Adjustment (HMAC)**---a \"safety tax\" on proxy
    > hedges---and the **Beta (\$\\beta\$)** floor, which mandates that
    > even a perfectly hedged portfolio must retain 25% of its gross
    > capital requirement.

3.  **Consistency:** The design preserves continuity with the \"bond
    > equivalent\" view of counterparty risk established in Basel II,
    > while refining it with the distinction between systematic and
    > idiosyncratic risk components (\$\\rho = 50\\%\$).

This report provides a deep-dive technical exposition of the BA-CVA,
dissecting the mathematical formulations that enable the EAD-Notional
comparison, evaluating the regulatory incentives created by the mismatch
penalties, and analyzing the strategic implications for firms navigating
the \"cliff edge\" between the Basic and Standardised approaches.

## 1. The Regulatory Architecture and Design Philosophy of Basel 3.1 CVA

To fully comprehend the rationale behind the specific mechanics of the
BA-CVA---specifically the netting of EAD and Hedge Notional---it is
essential to first contextualize the framework within the broader
architecture of the Basel 3.1 reforms and their implementation in the UK
via the PRA Rulebook. The design choices regarding hedging recognition
are not isolated decisions but are downstream consequences of the
decision to remove internal modelling from CVA capital.

### 1.1 The Shift from Modeled to Prescriptive Approaches

The pre-Basel 3.1 regime allowed sophisticated firms to capitalize CVA
risk using an Internal Model Method (IMM), which effectively calculated
a Value-at-Risk (VaR) on the firm\'s actual CVA P&L. This approach
allowed for the recognition of complex, dynamic hedges and the netting
of sensitivities across the full spectrum of market risk factors.
However, the regulatory community, led by the Basel Committee on Banking
Supervision (BCBS), concluded that the dispersion in CVA capital
outcomes across firms was driven more by modelling choices than by
fundamental differences in risk profile.

Consequently, the \"Internal Model Approach for CVA\" was eliminated. In
its place, the regulator established a hierarchy designed to balance
risk sensitivity with comparability:

1.  **Standardised Approach (SA-CVA):** A sensitivity-based method that
    > mimics the Fundamental Review of the Trading Book (FRTB). It
    > requires the calculation of Delta and Vega sensitivities for
    > counterparty credit spreads and market risk factors. Access is
    > gated by strict supervisory approval.^1^

2.  **Basic Approach (BA-CVA):** The default method. It is explicitly
    > \"non-modeled,\" meaning it cannot rely on internal Greek
    > calculations. It must rely on supervisory formulas.^1^

3.  **Alternative Approach (AA-CVA):** A fallback for firms with limited
    > materiality (aggregate notionals below £88 billion), allowing CVA
    > capital to be set at 100% of CCR capital.^1^

The **design constraint** for the BA-CVA is therefore strict: it must
produce a risk-sensitive capital number without requiring the bank to
calculate the sensitivity of its CVA to credit spreads (\$CS01\$). The
regulator must essentially \"reverse engineer\" a sensitivity proxy
using data fields that are already present in the bank\'s regulatory
reporting infrastructure. The two most readily available fields that
correlate with \"Risk\" and \"Mitigation\" are EAD (from the CCR
framework) and Notional (from the trade repository).

### 1.2 The Concept of \"Supervisory Proxy\"

A critical intellectual leap in the BA-CVA is the redefinition of what
\"CVA\" means for capital purposes. The PRA Rulebook clarifies that
\"Regulatory CVA\" is distinct from \"Accounting CVA\" (IFRS 13).

-   **Accounting CVA:** A fair value adjustment reflecting
    > market-implied PDs, LGDs, and complex simulations of future
    > exposure including drift, diffusion, and wrong-way risk.

-   **Regulatory CVA:** A **supervisory proxy** calculated using
    > prescriptive formulas. It assumes that CVA risk is driven almost
    > entirely by the volatility of the counterparty\'s credit spread,
    > ignoring (for the purpose of the Basic calculation) the volatility
    > of the underlying market risk factors that drive exposure.^1^

Because the \"Exposure\" (\$SCVA_c\$) is a proxy, the \"Hedge\"
(\$SNH_c\$) must also be a proxy. The framework does not attempt to
compare the *market value change* of the hedge to the *market value
change* of the CVA. Instead, it compares the **Standardized Risk Value**
of the hedge to the **Standardized Risk Value** of the exposure.

This abstraction allows the regulator to compare EAD and Notional. They
are not compared as raw currency amounts; they are compared as inputs
into a standardized volatility equation. The regulator effectively says:
\"We define the risk of the exposure as \$Vol \\times EAD\$ and the
benefit of the hedge as \$Vol \\times Notional\$.\" In this context, EAD
and Notional are simply the volume scalars for the volatility
parameter.^2^

### 1.3 The \"Bond Equivalent\" Theoretical Foundation

The comparison of EAD and Notional has its roots in the \"bond
equivalent\" view of counterparty risk, a simplifying assumption used
since Basel II.3

In this worldview, a derivative exposure is analytically equivalent to
holding a zero-coupon bond issued by the counterparty.

-   The **Face Value** of this hypothetical bond is the **EAD**.

-   The **Maturity** of this hypothetical bond is the **Effective
    > Maturity (\$M\$)** of the netting set.

If a risk manager wishes to hedge a bond, they buy a Credit Default Swap
(CDS). The **Notional Amount** of the CDS corresponds to the Face Value
of the bond it protects. Therefore, if one accepts the premise that
\$EAD \\approx Bond\\\_Face\\\_Value\$, then comparing EAD to CDS
Notional is mathematically consistent.

The \"mismatch\" arises because EAD is not a static face value; it is a
probabilistic estimate of potential future value (\$RC + PFE\$).
However, for the purpose of a standardized capital charge, the regulator
accepts EAD as the \"best available static proxy\" for the
loan-equivalent size of the trade.^4^

## 2. The Mechanics of the Unhedged Exposure: The Role of EAD

To understand the comparison, we must first dissect the \"Asset\" side
of the equation: the Stand-Alone CVA (\$SCVA_c\$). This value represents
the gross risk that the hedge attempts to offset.

### 2.1 The Stand-Alone CVA (**\$SCVA_c\$**) Formula

The core engine of the BA-CVA is the calculation of \$SCVA_c\$ for each
counterparty. The PRA Rulebook (Chapter 4 of the CVA Risk Part) defines
this as ^1^:

\$\$SCVA_c = \\frac{1}{\\alpha} \\cdot RW_c \\cdot \\sum\_{NS \\in c}
(M\_{NS} \\cdot EAD\_{NS} \\cdot DF\_{NS})\$\$

Each term in this formula plays a specific role in constructing the
sensitivity proxy:

1.  **\$RW_c\$ (Supervisory Risk Weight):** This parameter proxies the
    > **Volatility** of the counterparty\'s credit spread. Instead of
    > using a market-implied volatility or historical time series (as in
    > VaR), the firm looks up the counterparty in **Table 1** based on
    > Sector and Credit Quality Step (CQS). For example, an Investment
    > Grade Financial is assigned a 5.0% weight, while a High Yield
    > Corporate (Consumer Goods) is assigned 8.5%.^1^ This ensures
    > consistency across the industry---every bank assigns the same
    > volatility to the same counterparty type.

2.  **\$M\_{NS}\$ (Effective Maturity):** This proxies the **Duration**
    > of the exposure. In bond math, sensitivity is roughly \$Duration
    > \\times Spread\\\_Change\$. Here, \$M\_{NS}\$ scales the exposure
    > to account for the fact that longer-dated trades are more
    > sensitive to spread widening.

3.  **\$EAD\_{NS}\$ (Exposure at Default):** This proxies the
    > **Principal Amount** or volume of the risk. It is the base upon
    > which the volatility acts.

4.  **\$DF\_{NS}\$ (Discount Factor):** This adjusts for the time value
    > of money, using a supervisory discount rate of 5%. It ensures the
    > capital charge reflects the present value of the risk.^1^

### 2.2 EAD as a Proxy for Exposure Sensitivity

Why use EAD? Under the Standardised Approach for Counterparty Credit
Risk (SA-CCR), EAD is calculated as:

\$\$EAD = \\alpha \\cdot (Replacement\\\_Cost +
Potential\\\_Future\\\_Exposure)\$\$

This metric encapsulates both the current mark-to-market risk (RC) and
the risk that the trade value will increase in the future (PFE). By
using EAD as the multiplier in the \$SCVA\$ formula, the regulator
effectively asserts that the **Credit Spread Sensitivity (CS01)** of the
netting set is proportional to its EAD.

While this is an approximation (true CS01 depends on the specific cash
flow structure of the derivatives), it is a robust enough correlation
for a \"Basic\" approach. It ensures that the capital charge scales
linearly with the size and volatility of the portfolio.

### 2.3 The Critical \"Alpha\" Adjustment

A crucial technical detail in the BA-CVA design is the term
\$\\frac{1}{\\alpha}\$ in the \$SCVA_c\$ formula.2

In the CCR framework, the EAD includes a multiplier of \$\\alpha =
1.4\$. This 1.4 factor is a buffer for model risk, correlation error,
and general uncertainty in the estimation of default risk exposure.

However, for CVA risk, the regulator strips this buffer out
(\$EAD\_{CCR} / 1.4\$). The rationale is twofold:

1.  **Avoidance of Double Counting:** The BA-CVA framework includes its
    > own calibration scalars (specifically the Discount Scalar of 0.65)
    > and conservative aggregation assumptions (correlation \$\\rho =
    > 50\\%\$). Applying the CCR alpha on top of these CVA-specific
    > buffers would be punitive and analytically incoherent.^1^

2.  **Pure Economic Exposure:** The objective of CVA capital is to
    > capitalize the risk of mark-to-market loss, not default loss. The
    > \"pure\" exposure (\$RC + PFE\$) is a better proxy for the
    > valuation base than the regulatory EAD used for default capital.

This adjustment highlights the precision of the design: the regulator
wants to compare the \"pure\" exposure of the derivative against the
\"pure\" notional of the hedge.

### 2.4 The Treatment of Specific Counterparties

The derivation of \$SCVA_c\$ is further nuanced by specific counterparty
treatments in the UK rules (PS9/24), which affects the EAD input:

-   **Pension Funds:** For these entities, the CCR alpha factor is
    > reduced to 1.0 (from 1.4) in the SA-CCR framework itself. Since
    > BA-CVA uses the CCR inputs, this flows through to CVA. However,
    > since the BA-CVA formula *already* divides by alpha, the net
    > effect is neutral, but the alignment of risk weights (specifically
    > the 3.5% / 8.5% bucket for Pension Funds in Table 1) ensures they
    > are treated as a distinct risk class.^1^

-   **Unrated Central Banks:** PS9/24 introduces a critical deviation
    > where unrated central banks can be mapped to the risk weight of
    > their sovereign (0.5% or 2.0%) rather than the punitive
    > \"unrated\" bucket. This significantly lowers the \$SCVA_c\$ for
    > these entities, affecting the \"target\" that any hedge would need
    > to offset.^1^

## 3. The Mechanics of the Hedge: The Role of Notional

On the other side of the netting equation lies the Single-Name Hedge
(\$SNH_c\$). This term calculates the risk mitigation provided by
eligible credit derivatives.

### 3.1 The Single-Name Hedge (**\$SNH_c\$**) Formula

The value of the hedge in the BA-CVA calculation is defined as ^1^:

\$\$SNH_c = \\sum\_{h \\in C} r\_{hc} \\cdot RW_h \\cdot M_h\^{SN}
\\cdot B_h\^{SN} \\cdot DF_h\^{SN}\$\$

Here, **\$B_h\^{SN}\$** represents the **Notional Amount** of the
eligible hedging instrument.

### 3.2 Notional as the Sensitivity Proxy for CDS

The rationale for using Notional here is grounded in the mechanics of
Credit Default Swaps. Unlike complex derivatives (options, swaptions), a
CDS is a linear instrument with respect to credit spread movements.

The sensitivity of a CDS (its CS01) can be approximated as:

\$\$CS01\_{CDS} \\approx Notional \\times Duration \\times 1bp\$\$

In the \$SNH_c\$ formula:

-   \$M_h\^{SN}\$ captures the **Duration**.

-   \$B_h\^{SN}\$ captures the **Notional**.

-   \$RW_h\$ represents the **Spread Volatility** (analogous to the 1bp
    > shock in a sensitivity calculation).

Therefore, the term \$(RW_h \\cdot M_h\^{SN} \\cdot B_h\^{SN})\$ is a
direct calculation of the **Risk-Weighted Sensitivity** of the hedge. By
using the Notional, the regulator is not making a crude simplification;
they are using the primary driver of risk for the instrument in
question. The \"design choice\" is simply to use the trade\'s face value
rather than requiring the bank to calculate a Delta, because for a CDS,
the Notional *is* the proxy for Delta.^6^

### 3.3 The Correlation Parameter (**\$r\_{hc}\$**): Haircutting the Proxy

The most significant innovation in the BA-CVA hedge logic is the
correlation parameter (\$r\_{hc}\$). This parameter explicitly
recognizes that EAD and Notional are rarely perfectly matched because
the hedge often references a different legal entity than the
counterparty.

The regulator defines three tiers of hedging quality 1:

1.  **Direct Hedge (\$r\_{hc} = 100\\%\$):** The CDS references the
    > exact counterparty. In this case, 100% of the Notional is
    > recognized.

2.  **Legal Entity Proxy (\$r\_{hc} = 80\\%\$):** The CDS references a
    > parent, subsidiary, or legally related entity. The regulator
    > applies a 20% haircut to the Notional\'s effectiveness.

3.  **Sector/Region Proxy (\$r\_{hc} = 50\\%\$):** The CDS references an
    > entity in the same sector and region (e.g., hedging a French bank
    > with a generic European Financials index or a different French
    > bank). The regulator applies a 50% haircut.

This parameter serves as the bridge between the specific risk of the
exposure (EAD) and the potentially generic risk of the hedge (Notional).
It allows firms to use \"proxy hedging\"---a common practice where
liquid indices are used to hedge illiquid names---while analytically
reducing the recognized Notional to account for the basis risk.

## 4. The Structural Mismatch: Comparing Dynamics with Statics

The core of the user\'s inquiry addresses the validity of netting
**EAD** (a dynamic, potential exposure) against **Hedge Notional** (a
static, current value). This section analyzes the mathematical
justification and the regulatory compromise inherent in this design.

### 4.1 Netting Risk Units, Not Raw Values

It is a common misconception that the BA-CVA simply subtracts Notional
from EAD (\$Net = EAD - Notional\$). This would indeed be dimensionally
flawed.

Instead, the netting occurs within the aggregation formula for the
Hedged Capital (\$K\_{hedged}\$):

\$\$K\_{hedged} \\approx \\sqrt{ (\\sum SCVA_c - \\sum SNH_c)\^2 +
\\dots }\$\$

The subtraction happens between the **Risk-Weighted Capital Charges**,
not the raw inputs.

-   \$SCVA_c\$ is the capital charge required for the exposure.

-   \$SNH_c\$ is the capital relief provided by the hedge.

The framework compares Risk-Weighted Exposure Sensitivity vs.
Risk-Weighted Hedge Sensitivity.

If a firm has a \$100m EAD to a Sovereign (\$RW=0.5\\%\$) and buys
\$100m of CDS protection on that Sovereign (\$RW=0.5\\%\$), and the
maturities match, then:

\$\$SCVA_c \\approx 0.5\\% \\times 100m = 0.5 \\\\ SNH_c \\approx 0.5\\%
\\times 100m = 0.5 \\\\ Net = 0.5 - 0.5 = 0\$\$

The comparison holds because the **Risk Weights** (\$RW\$) standardize
the units. Both EAD and Notional are converted into \"units of spread
volatility.\" This conversion justifies the netting operation.^6^

### 4.2 The \"Dynamic vs. Static\" Dilemma

A rigorous critique of the BA-CVA design highlights that **EAD is
dynamic** while **Notional is static**.

-   **EAD (SA-CCR):** Includes a Potential Future Exposure (PFE)
    > component. It assumes the exposure *could* grow significantly if
    > market factors move.

-   **Hedge Notional:** Fixed at the time of calculation.

Rationale: The regulator accepts this temporal mismatch to enforce
conservatism.

By requiring the use of EAD (with PFE), the regulator ensures that the
capital charge anticipates future exposure growth. However, by using
current Notional for the hedge, the regulator refuses to give credit for
\"potential future hedging.\"

If the exposure grows (realizing the PFE), the current hedge will become
insufficient. The framework implicitly tells the bank: \"You must hold
capital today for the potential growth of the exposure (EAD). If you
want to offset that capital, you must buy enough actual hedge Notional
today to cover that potential peak.\"

This forces banks to over-hedge relative to current Mark-to-Market (MtM)
if they want full capital relief. They must hedge the EAD (MtM + PFE),
not just the current exposure. This is a deliberate prudential design
choice to ensure banks are capitalized for tail events where exposure
spikes and the counterparty defaults simultaneously.8

### 4.3 The \"Cliff Edge\" Incentive

This design creates a powerful incentive for firms to move to SA-CVA. In
SA-CVA, firms calculate sensitivities based on the current state. They
can dynamically rebalance hedges as the exposure changes.

In BA-CVA, the \"cost\" of the static Notional assumption is high. To
offset the PFE component of EAD, the firm must pay for CDS protection on
a notional amount that it may never actually utilize (if the exposure
does not grow). This inefficiency acts as a \"tax\" on the Basic
Approach, pushing sophisticated firms with large derivatives books to
invest in the infrastructure required for the Standardised Approach.9

## 5. Mitigating the Imperfection: HMAC and Beta

The regulator recognizes that comparing EAD and Notional via generic
Risk Weights is an imperfect science. To prevent firms from \"gaming\"
this simple metric (e.g., by hedging a risky High Yield name with a
cheap, low-volatility Index proxy), the BA-CVA includes two critical
backstops: the **Hedging Mismatch Adjustment (HMAC)** and the **Beta
(\$\\beta\$) Floor**.

### 5.1 The Hedging Mismatch Adjustment (HMAC)

The HMAC is a penalty term added to the capital charge specifically to
address basis risk.

Formula 1:

\$\$HMAC = \\sum\_{h \\in C} (1 - r\_{hc}\^2) \\cdot (RW_h \\cdot
M_h\^{SN} \\cdot B_h\^{SN} \\cdot DF_h\^{SN})\^2\$\$

**Mechanism:** This term takes the risk-weighted value of the hedge
(\$RW \\times Notional\$) and squares it, then multiplies by \$(1 -
r\_{hc}\^2)\$.

-   **Perfect Hedge (\$r\_{hc} = 100\\%\$):** The term becomes zero.
    > There is no penalty for netting EAD and Notional.

-   **Proxy Hedge (\$r\_{hc} = 50\\%\$):** The term becomes positive.
    > \$(1 - 0.5\^2) = 0.75\$. The firm pays a penalty proportional to
    > 75% of the squared hedge variance.

**Rationale:** This effectively says, \"We allowed you to net your EAD
with a proxy Notional in the main formula, but we know that proxy is
imperfect. Therefore, we are charging you a \'basis risk premium\'
(HMAC) to account for the variance between the name you are exposed to
and the name you hedged with.\" This restores the statistical rigor that
was lost by using simple Notional subtraction.^1^

### 5.2 The Beta (**\$\\beta\$**) Floor

The aggregation formula for Full BA-CVA is:

\$\$K\_{full} = \\beta \\cdot K\_{reduced} + (1 - \\beta) \\cdot
K\_{hedged}\$\$

Where \$\\beta = 0.25\$.1

Rationale: This creates a mandatory floor. \$K\_{reduced}\$ is the
capital charge ignoring all hedges.

The formula dictates that even if \$K\_{hedged} = 0\$ (perfect hedging
of EAD with Notional), the final capital charge (\$K\_{full}\$) will be
25% of the unhedged charge.

This serves as a final \"fail-safe\" against the model risk of the
BA-CVA design. It acknowledges that EAD and Notional are never perfectly
additive/subtractive in reality. Operational risks, liquidity risks at
default, and gap risks mean that a \"perfect\" hedge on paper might fail
in a crisis. The regulator mandates that firms keep 25% of their chips
on the table, regardless of how much Notional they buy.1

### 5.3 Treatment of Index Hedges

A crucial distinction in the netting logic is the treatment of Index
Hedges (\$IH\$).

-   Single-Name Hedges (\$SNH_c\$) are netted against specific
    > counterparties.

-   Index Hedges (\$IH\$) are subtracted from the **Systematic
    > Component** of the aggregation formula only.

\$\$K\_{hedged} = \\sqrt{(\\rho \\cdot \\sum (SCVA - SNH) - IH)\^2 +
(1-\\rho\^2)\\sum(SCVA - SNH)\^2}\$\$

Rationale: An Index Hedge (e.g., iTraxx Main) tracks the general market,
not a specific firm. Therefore, it can only reduce the Systematic Risk
(the first term). It provides zero relief for the Idiosyncratic Risk
(the second term, driven by \$(1-\\rho\^2)\$).

Furthermore, the regulator applies a 0.7 multiplier to the risk weight
of indices (for homogeneous indices) or a weighted average (for mixed
indices).1 This 30% haircut on the Index Notional reflects the
diversification benefit within the index, ensuring that a firm cannot
over-claim relief by using a low-volatility index to hedge
high-volatility single names.

## 6. Strategic and Operational Implications

The rationale for comparing EAD and Notional translates into specific
strategic imperatives for banks operating under the BA-CVA.

### 6.1 Data Infrastructure and Reporting

The BA-CVA design validates the \"data-driven\" regulatory approach.
Banks do not need to upgrade their risk engines to calculate daily
sensitivities for CVA. They simply need to link their **Risk Data
Aggregation (BCBS 239)** systems:

-   Feed 1: EAD from the CCR engine.

-   Feed 2: Notional and Maturity from the Trade Repository.

-   Feed 3: Counterparty Sector/Rating for Table 1 mapping.

This significantly lowers the barrier to entry, allowing smaller firms
to comply without engaging external vendors for complex Greek
calculations.^11^

### 6.2 Managing the \"Discount Scalar\" (**\$DS\_{BA-CVA}\$**)

The PRA applies a scalar of **0.65** to the final BA-CVA result.^1^

\$\$Final\\\_Capital = 0.65 \\times K\_{full}\$\$

Rationale: The regulator is aware that the \"proxy\" assumptions (adding
risk-weighted EADs, conservative correlations) generally produce a
capital number that is too high relative to economic reality. The 0.65
scalar is a calibration tool---a \"fudge factor\"---that aligns the
BA-CVA output with the more precise SA-CVA output. It implicitly admits
that the EAD vs. Notional comparison is conservative by roughly 35%.1

### 6.3 Transitional Arrangements

For firms transitioning to this regime, particularly regarding
counterparties previously exempt (like Pension Funds or NFCs), the EAD
vs. Notional logic is phased in.

-   **Legacy Trades:** Trades entered before 1 Jan 2026 may benefit from
    > transitional relief (exemptions phase-out).

-   **Pension Funds:** While the alpha is 1.0, the risk weight is
    > non-zero (3.5% for IG). This means Pension Fund EADs will now
    > generate a capital requirement. Since these entities are rarely
    > hedged with single-name CDS (lack of liquidity), firms will likely
    > rely on **Index Hedges** to offset the systematic risk of these
    > long-dated EADs. The efficacy of Index Hedges (limited to the
    > systematic term) becomes a critical capital efficiency lever for
    > Pension Fund desks.^1^

## 7. Conclusion

The rationale for comparing **Exposure at Default (EAD)** and **Hedge
Notional** in the BA-CVA design is a triumph of **pragmatism over
theoretical purity**.

The Basel Committee and the PRA have prioritized **operational
simplicity**, **standardization**, and **conservatism**. By defining
Regulatory CVA as a supervisory proxy, they created a framework where:

1.  **EAD** serves as the dimensionally consistent proxy for the
    > **\"Bond Equivalent\"** exposure.

2.  **Notional** serves as the dimensionally consistent proxy for the
    > **Sensitivity** of the hedge.

3.  **Risk Weights** serve as the proxy for **Volatility**.

The \"mismatch\" between dynamic EAD and static Notional is not an
oversight; it is a calibrated feature. It forces firms to capitalize for
potential future exposure growth (PFE) unless they over-hedge with
current Notional. The inherent basis risks are rigorously priced via the
**HMAC** penalty and the **Beta** floor, ensuring that the
\"simplicity\" of the approach does not lead to capital inadequacy.

For the industry, this design codifies a clear incentive structure:
perfect single-name hedging is rewarded with near-total offsets, while
proxy/index hedging is taxed via HMAC and the systematic-only offset.
Ultimately, the BA-CVA acts as a conservative backstop, encouraging
sophisticated firms to move to SA-CVA while providing a robust,
data-available mechanism for the rest of the market to capitalize
counterparty credit spread risk.

### Table 1: Comparative Mechanics of Exposure and Hedge Inputs in BA-CVA

  **Component**             **Input Metric**               **Regulatory Logic (Proxy Role)**                                                                                     **Adjustment/Constraint**
  ------------------------- ------------------------------ --------------------------------------------------------------------------------------------------------------------- ----------------------------------------------------------------------------------------------------
  **Unhedged Exposure**     **EAD** (\$EAD\_{NS}\$)        Proxies the \"Bond Equivalent\" value of the derivative portfolio. Includes PFE to capture potential future growth.   **Alpha Removal:** \$EAD\$ is divided by 1.4 to remove CCR-specific conservatism.
  **Sensitivity Factor**    **Risk Weight** (\$RW\$)       Proxies **Credit Spread Volatility**. Replaces internal volatility estimates.                                         **Table 1:** Prescriptive weights based on Sector & Credit Quality (e.g., 5.0% for IG Financials).
  **Hedge Value**           **Notional** (\$B_h\^{SN}\$)   Proxies the **Sensitivity** of the hedge. Assuming linearity, Notional \$\\propto\$ CS01.                             **Correlation (\$r\_{hc}\$):** Haircuts the Notional if the hedge is a proxy (80% or 50%).
  **Basis Risk**            **Mismatch**                   Captures the error between the dynamic exposure and static/proxy hedge.                                               **HMAC:** A penalty term added to capital: \$\\sum (1-r\^2) \\times (\\dots)\^2\$.
  **Overall Calibration**   **Scalar**                     Aligns the proxy result with modelled outcomes.                                                                       **\$DS\_{BA-CVA}\$ (0.65):** Discounts the total requirement to prevent punitive capital charges.

### Table 2: Hierarchy of Hedge Recognition in BA-CVA

  **Hedge Type**            **Correlation (rhc​)**   **Implication for Capital Calculation**
  ------------------------- ------------------------ ---------------------------------------------------------------------------------------------------------------------------
  **Direct Hedge**          **100%**                 Full recognition of Notional. Zero HMAC penalty. Maximizes capital relief.
  **Legal Entity Proxy**    **80%**                  Partial recognition. 20% of risk is unhedged. Incurs moderate HMAC penalty.
  **Sector/Region Proxy**   **50%**                  Low recognition. 50% of risk is unhedged. Incurs high HMAC penalty.
  **Index Hedge**           **N/A**                  Used to offset **Systematic Risk** only. Does not offset Idiosyncratic risk (\$SCVA\^2\$ term). Multiplied by 0.7 factor.

^11^

#### Works cited

1.  Regulation.docx

2.  MAR50 - Credit valuation adjustment framework - Bank for
    > International Settlements, accessed on January 7, 2026,
    > [[https://www.bis.org/basel_framework/chapter/MAR/50.htm]{.ul}](https://www.bis.org/basel_framework/chapter/MAR/50.htm)

3.  Counterparty Credit Risk - Free, accessed on January 7, 2026,
    > [[http://radoudoux.free.fr/last2/jGregoryCPTY%20Risk.pdf]{.ul}](http://radoudoux.free.fr/last2/jGregoryCPTY%20Risk.pdf)

4.  The xVA Challenge - University of Warwick, accessed on January 7,
    > 2026,
    > [[https://warwick.ac.uk/fac/sci/mathsys/people/students/mathsysii/tokaeva/gregory_counterparty_credit_risk_funding.pdf]{.ul}](https://warwick.ac.uk/fac/sci/mathsys/people/students/mathsysii/tokaeva/gregory_counterparty_credit_risk_funding.pdf)

5.  Instructions: Impact study on the proposed frameworks for market
    > risk and CVA risk - Bank for International Settlements, accessed
    > on January 7, 2026,
    > [[https://www.bis.org/bcbs/qis/instr_impact_study_jul15.pdf]{.ul}](https://www.bis.org/bcbs/qis/instr_impact_study_jul15.pdf)

6.  Draft Capital Adequacy Requirements (CAR) (2027) -- Chapter 8 --
    > Credit Valuation Adjustment (CVA) Risk, accessed on January 7,
    > 2026,
    > [[https://www.osfi-bsif.gc.ca/sites/default/files/documents/2027-car-nfp-ch8-dft-en.pdf?v=1763683200057]{.ul}](https://www.osfi-bsif.gc.ca/sites/default/files/documents/2027-car-nfp-ch8-dft-en.pdf?v=1763683200057)

7.  Navigating the Challenges and Nuances of Hedging in SA-CVA \| S&P
    > Global, accessed on January 7, 2026,
    > [[https://www.spglobal.com/market-intelligence/en/news-insights/research/challenges-hedging-in-sacva]{.ul}](https://www.spglobal.com/market-intelligence/en/news-insights/research/challenges-hedging-in-sacva)

8.  Regulatory Capital Rule: Large Banking Organizations and Banking
    > Organizations With Significant Trading Activity - Federal
    > Register, accessed on January 7, 2026,
    > [[https://www.federalregister.gov/documents/2023/09/18/2023-19200/regulatory-capital-rule-large-banking-organizations-and-banking-organizations-with-significant]{.ul}](https://www.federalregister.gov/documents/2023/09/18/2023-19200/regulatory-capital-rule-large-banking-organizations-and-banking-organizations-with-significant)

9.  Basel 4: CVA Risk - KPMG International, accessed on January 7, 2026,
    > [[https://assets.kpmg.com/content/dam/kpmg/xx/pdf/2018/03/basel-4-the-way-ahead.pdf]{.ul}](https://assets.kpmg.com/content/dam/kpmg/xx/pdf/2018/03/basel-4-the-way-ahead.pdf)

10. policy advice on the basel iii reforms on credit valuation
    > adjustment (cva) and market risk - European Banking Authority,
    > accessed on January 7, 2026,
    > [[https://www.eba.europa.eu/sites/default/files/document_library/EBA-2019-Op-15%20-%20Policy%20Advice%20on%20the%20Basel%20III%20reforms%20on%20credit%20valuation%20adjustment%20%28CVA%29%20and%20market%20risk.pdf]{.ul}](https://www.eba.europa.eu/sites/default/files/document_library/EBA-2019-Op-15%20-%20Policy%20Advice%20on%20the%20Basel%20III%20reforms%20on%20credit%20valuation%20adjustment%20%28CVA%29%20and%20market%20risk.pdf)

11. Review of the Credit Valuation Adjustment Risk Framework -
    > consultative document - Bank for International Settlements,
    > accessed on January 7, 2026,
    > [[https://www.bis.org/bcbs/publ/d325.pdf]{.ul}](https://www.bis.org/bcbs/publ/d325.pdf)

12. Capital Adequacy Requirements (CAR) (2027) -- Chapter 9 -- Market
    > Risk, accessed on January 7, 2026,
    > [[https://www.osfi-bsif.gc.ca/en/guidance/guidance-library/capital-adequacy-requirements-car-2027-chapter-9-market-risk]{.ul}](https://www.osfi-bsif.gc.ca/en/guidance/guidance-library/capital-adequacy-requirements-car-2027-chapter-9-market-risk)
