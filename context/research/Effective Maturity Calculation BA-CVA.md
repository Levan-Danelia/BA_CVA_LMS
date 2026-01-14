# Technical Specification: Effective Maturity (**\$M\_{NS}\$**) Calculation Under PRA BA-CVA Rules (PS9/24 & PS17/23)

## 1. Regulatory Architecture and the Role of Maturity in BA-CVA

The implementation of the Basel 3.1 standards within the United Kingdom
represents a definitive shift in the quantification of Counterparty
Credit Risk (CCR), specifically regarding the calculation of capital
requirements for Credit Valuation Adjustment (CVA) risk. The Prudential
Regulation Authority (PRA), through Policy Statements PS17/23 and
PS9/24, has established the **Basic Approach to CVA (BA-CVA)** as the
default methodology for firms that do not possess the requisite
permissions for the Standardised Approach (SA-CVA). Central to this
framework is the precise determination of **Effective Maturity
(\$M\_{NS}\$)**, a parameter that serves as the primary temporal driver
of the capital charge.

While the concept of maturity is foundational across the prudential
framework, its application within BA-CVA is mathematically distinct from
its use in the standardised credit risk or internal ratings-based (IRB)
approaches. The PRA has introduced specific overrides to the standard
definitions found in the Capital Requirements Regulation (CRR), creating
a bespoke calculation logic that bifurcates based on the firm\'s broader
permission status (Internal Model Method vs. Non-Internal Model Method)
and the collateralisation status of the netting set.

This report provides an exhaustive, expert-level analysis of the
\$M\_{NS}\$ parameter. It dissects the statutory text of the PRA
Rulebook, analyzes the interaction between maturity and supervisory
discount factors, and provides granular calculation methodologies for
derivatives and Securities Financing Transactions (SFTs). The analysis
is strictly grounded in the near-final rules and supervisory statements,
ensuring a definitive reference for implementation.

### 1.1 The Mathematical Primacy of **\$M\_{NS}\$** in the Standalone CVA Formula

To understand the criticality of the effective maturity calculation, one
must first isolate its position within the broader Standalone CVA
(\$SCVA_c\$) algorithm. The PRA Rulebook mandates that capital
requirements be calculated first at the counterparty level before
aggregation. The formula for \$SCVA_c\$ is a linear summation of
risk-weighted, discounted exposures, defined as:

\$\$SCVA_c = \\frac{1}{\\alpha} \\cdot RW_c \\cdot \\sum\_{NS \\in c}
(M\_{NS} \\cdot EAD\_{NS} \\cdot DF\_{NS})\$\$

Where:

-   **\$M\_{NS}\$ (Effective Maturity):** The variable of interest,
    > representing the weighted or effective time horizon of the risk
    > within the netting set.

-   **\$EAD\_{NS}\$ (Exposure at Default):** The exposure value
    > calculated under SA-CCR or IMM.

-   **\$DF\_{NS}\$ (Discount Factor):** A supervisory term dependent on
    > \$M\_{NS}\$ (for non-IMM firms) or fixed at unity (for IMM firms).

-   **\$RW_c\$ (Risk Weight):** The supervisory risk weight assigned to
    > the counterparty.

-   **\$\\alpha\$ (Alpha):** Fixed at 1.4, aligning with the CCR
    > exposure conversion but analytically removed in the lead term to
    > prevent double-counting of the leverage factor inherent in
    > \$EAD\$.

The implications of this formula structure are profound. Unlike credit
risk RWA, where maturity (\$M\$) enters into a complex, concave
probability function (the IRB risk weight formula), in BA-CVA,
\$M\_{NS}\$ acts as a **linear scalar** on the exposure term. A doubling
of effective maturity, holding all else constant, results in a doubling
of the pre-discounted capital requirement. This linear sensitivity makes
the accurate calculation of \$M\_{NS}\$---and specifically the
application of floors and caps---the single most significant determinant
of capital variability for long-dated portfolios.

### 1.2 The \"Override Principle\" in the PRA Rulebook

A recurring theme in the PRA's implementation is the use of an
\"Override Principle.\" Rather than drafting a standalone definition for
maturity within the CVA Risk Part, the PRA references **Article 162 of
the Credit Risk: Internal Ratings Based Approach (CRR) Part**, but
immediately applies a series of critical modifications.

This legislative technique creates a hierarchy of interpretation:

1.  **Base Definition:** Refer to Article 162 (Maturity for IRB).

2.  **CVA-Specific Modification:** Apply the overrides contained in the
    > Credit Valuation Adjustment Risk Part.

The most consequential override concerns the **Maturity Cap**. In the
standard IRB framework for credit risk, effective maturity is capped at
**5 years** to limit the capital impact of ultra-long-dated exposures.
For BA-CVA, the PRA has explicitly disapplied this cap. The rule states:

> **\"M_NS is not capped at five years but instead at the longest
> contractual remaining maturity in the netting set.\"** ^1^

This divergence is driven by the economic reality of CVA. Credit
Valuation Adjustment is a market value concept; if a counterparty
defaults in year 20 of a 30-year swap, the bank incurs a loss at that
time. Capping the regulatory maturity at 5 years would systematically
undercapitalise the tail risk of long-dated derivatives. Consequently,
firms must implement systems that can identify the absolute longest
contractual maturity in a netting set (\$t\_{longest}\$), a data point
that may not be historically preserved in credit risk engines designed
for the 5-year cap.

## 2. Calculation Methodology for Non-IMM Firms

For the vast majority of firms that do not possess the regulatory
permission to use the Internal Model Method (IMM) for counterparty
credit risk, the calculation of \$M\_{NS}\$ is governed by a
prescriptive **average notional weighted** methodology. This applies to
firms utilizing the Standardised Approach for Counterparty Credit Risk
(SA-CCR) to generate the \$EAD\_{NS}\$ input.

### 2.1 The Weighted Average Definition (Article 162(2)(b))

The PRA Rulebook directs non-IMM firms to calculate \$M\_{NS}\$ in
accordance with **Article 162(2)(b)** of the CRR. This article provides
the mathematical foundation for the calculation, defining effective
maturity (\$M\$) as the ratio of the notional-weighted time-to-maturity
to the total notional.

The formula is expressed as:

\$\$M\_{NS} = \\frac{\\sum\_{i} P_i \\cdot t_i}{\\sum\_{i} P_i}\$\$

Where:

-   \$i\$ represents each transaction within the netting set.

-   \$P_i\$ is the **notional amount** of transaction \$i\$.

-   \$t_i\$ is the **remaining contractual maturity** of transaction
    > \$i\$, measured in years.

Analytical Insight:

The reliance on notional weighting rather than exposure weighting is a
critical simplification in the BA-CVA framework for non-IMM firms. In
true economic CVA, maturity is weighted by the expected exposure profile
(where peak exposure might occur years into the future). However, SA-CCR
firms lack the simulated exposure profiles necessary for such a
calculation. Therefore, the regulator accepts notional weighting as a
proxy.

This proxy introduces specific biases:

-   **Amortizing Structures:** For trades with amortizing notionals,
    > \$P_i\$ should technically reflect the *current* remaining
    > notional, though systems often carry the *original* notional. The
    > rules imply current effective notional.

-   **Cross-Product Netting:** In a netting set containing both Interest
    > Rate Swaps (high notional, low risk per unit) and Equity Options
    > (low notional, high risk per unit), the maturity calculation will
    > be dominated by the Interest Rate Swaps due to their sheer
    > notional size. This can dilute the maturity signal if the
    > high-risk equity trades are short-dated.

### 2.2 The Interaction of the Average and the \"Longest\" Cap

There is a frequent misunderstanding in the industry regarding the
\"longest contractual maturity\" rule. It is vital to clarify that the
**Longest Contractual Maturity** is the **Cap**, not the **Definition**
of \$M\_{NS}\$ for non-IMM firms.

The algorithm for a non-IMM firm is a two-step process:

1.  **Calculate Weighted Average:** Compute the notional-weighted
    > average (\$M\_{raw}\$) of all trades in the netting set.

2.  **Apply Cap:** Compare \$M\_{raw}\$ to the maturity of the single
    > longest trade in the netting set (\$t\_{longest}\$).

\$\$M\_{NS} = \\min \\left( \\frac{\\sum P_i t_i}{\\sum P_i},
t\_{longest} \\right)\$\$

In almost all mathematical scenarios, the weighted average will be
naturally less than or equal to the maximum value in the set
(\$t\_{longest}\$). Therefore, the cap is rarely binding unless the
portfolio consists of a single trade (where average = longest). The
significance of the PRA\'s rule text---\"capped at the longest
contractual remaining maturity\"---is primarily to explicitly **remove**
the standard 5-year cap found in other parts of the CRR. It grants
permission for \$M\_{NS}\$ to exceed 5 years if the weighted average
justifies it.

**Example Scenario:**

-   Trade A: £100m Notional, 30 Year Maturity.

-   Trade B: £100m Notional, 1 Year Maturity.

-   **Weighted Average:** \$(100 \\cdot 30 + 100 \\cdot 1) / 200 =
    > 15.5\$ Years.

-   **Standard Credit Risk Cap:** 5 Years.

-   **BA-CVA Cap:** 30 Years (Longest trade).

-   **Final \$M\_{NS}\$:** 15.5 Years.

Under the standard credit risk rules, this exposure would be capped at 5
years. Under BA-CVA, the capital requirement reflects the 15.5-year
duration, resulting in a substantially higher charge.

### 2.3 The Supervisory Discount Factor (**\$DF\_{NS}\$**) for Non-IMM Firms

A unique feature of the Non-IMM calculation in BA-CVA is the mandatory
application of a supervisory discount factor. Because the SA-CCR
exposure measure (\$EAD\$) does not inherently account for the time
value of money (it is a future exposure proxy), the PRA introduces
discounting explicitly in the \$SCVA\$ formula.

The Discount Factor is a function of the calculated \$M\_{NS}\$:

\$\$DF\_{NS} = \\frac{1 - e\^{-0.05 \\cdot M\_{NS}}}{0.05 \\cdot
M\_{NS}}\$\$

This formula implies a continuous discounting model using a **fixed
supervisory interest rate of 5%**.

Mathematical Behavior and Risk Sensitivity:

The product of \$M\_{NS}\$ and \$DF\_{NS}\$ determines the effective
scaling of the capital charge.

Let \$f(M) = M \\cdot DF(M) = \\frac{1 - e\^{-0.05M}}{0.05}\$.

-   As \$M \\to 0\$, \$f(M) \\to M\$ (Linear behavior for short
    > maturities).

-   As \$M \\to \\infty\$, \$f(M) \\to \\frac{1}{0.05} = 20\$.

Implication:

This formula creates a \"soft cap\" on the capital requirement. Even
though the \"hard\" 5-year cap is removed, the mathematics of the
discount factor ensures that the capital charge does not explode
linearly to infinity.

-   At \$M=5\$ years: \$DF \\approx 0.88\$, Term \$\\approx 4.4\$.

-   At \$M=30\$ years: \$DF \\approx 0.52\$, Term \$\\approx 15.5\$.

-   At \$M=50\$ years: \$DF \\approx 0.37\$, Term \$\\approx 18.4\$.

While the charge for a 30-year trade is significantly higher than for a
5-year trade (factor of \~3.5x), it is not 6x higher, reflecting the
discounting effect. This mechanism provides a crucial offset to the
removal of the 5-year cap for non-IMM firms.

## 3. Calculation Methodology for IMM Firms

Firms with supervisory permission to use the Internal Model Method (IMM)
generally have more sophisticated simulation engines capable of
generating exposure profiles over time. The PRA rules leverage this
capability, prescribing a calculation method for \$M\_{NS}\$ that is
conceptually distinct from the simple notional weighting used by non-IMM
firms.

### 3.1 Effective Maturity via Effective Expected Exposure (Article 162(2)(g))

IMM firms are directed to calculate \$M\_{NS}\$ in accordance with
**Article 162(2)(g)** of the *Credit Risk: Internal Ratings Based
Approach (CRR) Part*. This article defines maturity based on the
time-weighted profile of the **Effective Expected Exposure (EEE)**.

The general formula under Article 162(2)(g) is:

\$\$M\_{NS} = \\frac{\\sum\_{k=1}\^{t\_{horizon}} \\text{Effective }
EE_k \\cdot \\Delta t_k \\cdot df_k \\cdot
s_k}{\\sum\_{k=1}\^{t\_{horizon}} \\text{Effective } EE_k \\cdot \\Delta
t_k \\cdot df_k \\cdot s_k}\$\$

Where:

-   \$\\text{Effective } EE_k\$: The Effective Expected Exposure at time
    > bucket \$k\$. Note that Effective EE is non-decreasing; it is the
    > maximum of the Expected Exposure (\$EE\$) at current time \$t\$
    > and any previous time \$\\tau \< t\$. This captures the
    > \"rollover\" risk and prevents the exposure profile from dipping
    > artificially.

-   \$\\Delta t_k\$: The time interval of the bucket.

-   \$df_k\$: The risk-free discount factor.

-   \$s_k\$: The survival probability of the counterparty (often set to
    > 1 or omitted in simplified implementations unless specific
    > wrong-way risk permissions exist).

The BA-CVA Override:

Just as with non-IMM firms, the critical override for IMM firms is the
removal of the 5-year cap.

> **\"M_NS is not capped at five years but instead at the longest
> contractual remaining maturity in the netting set.\"** ^1^

For IMM firms, this override is mechanically implemented by extending
the summation horizon (\$t\_{horizon}\$) in the formula above from 5
years to \$t\_{longest}\$.

### 3.2 Impact of Exposure Profile Shape

The use of Effective Expected Exposure (\$EEE\$) makes \$M\_{NS}\$
highly sensitive to the *shape* of the exposure profile, not just the
notional.

-   **Front-Loaded Risk:** If a netting set consists of trades that
    > amortize quickly or have peak exposure in the first year (e.g.,
    > short-dated FX options), the \$EEE\$ will be high in early time
    > buckets and low in later buckets. The weighted average calculation
    > will result in a short \$M\_{NS}\$.

-   **Back-Loaded Risk:** For trades like cross-currency swaps with
    > principal exchange at maturity, the \$EEE\$ profile may rise over
    > time. This weights the later time buckets more heavily, pushing
    > \$M\_{NS}\$ closer to the contractual maturity.

This risk sensitivity is the primary advantage of the IMM approach. It
rewards firms for risk-mitigating trade structures (like amortization)
in a way that the simple notional-weighted average of the Non-IMM
approach cannot.

### 3.3 The Fixed Discount Factor (**\$DF\_{NS} = 1\$**)

A crucial simplification for IMM firms in the BA-CVA framework is the
setting of the Discount Factor.

-   **Rule:** For IMM firms, \$DF\_{NS} = 1.0\$. ^1^

-   **Rationale:** The IMM exposure metric (\$EAD = \\alpha \\times
    > \\text{Effective } EEPE\$) is derived from the integration of the
    > exposure profile. The Basel Committee and PRA determined that
    > applying the supervisory discount formula (used for Non-IMM) to an
    > IMM-derived exposure would result in double-counting or
    > inconsistency, as IMM models often already incorporate discounting
    > effects in the pricing simulations or effective PE definitions.

Consequence:

Since \$DF\_{NS}\$ is fixed at 1.0, the IMM capital charge is linear
with respect to \$M\_{NS}\$.

\$\$SCVA_c\^{IMM} \\propto M\_{NS} \\cdot EAD\_{IMM}\$\$

This linearity contrasts with the concave (\"soft capped\") behavior of
the Non-IMM formula. It implies that for IMM firms, the precise
estimation of the maturity parameter---and specifically the extension
beyond 5 years---has a more punitive marginal impact per year of
duration than for Non-IMM firms. IMM firms must therefore be extremely
rigorous in their trade compression and netting efficiency to manage the
\$M\_{NS}\$ of long-dated netting sets.

## 4. The Bifurcation of Secured vs. Unsecured Transactions

The PRA's PS9/24 introduces a definitive bifurcation in the treatment of
maturity floors based on the collateralisation status of the netting
set. This represents a significant deviation from earlier standardized
approaches where a generic 1-year floor was often applied
indiscriminately.

### 4.1 The Unsecured Netting Set: The 1-Year Floor

For netting sets that are **unsecured** or partially secured but do not
meet the strict definition of \"fully collateralised,\" the standard
Basel maturity floor applies.

Rule:

\$\$M\_{NS} = \\max(M\_{calculated}, 1 \\text{ year})\$\$

This floor is a prudential backstop. It reflects the regulatory view
that replacing a counterparty or hedging the open risk of an unsecured
trade takes time, and estimating risk over a period shorter than one
year might underestimate the potential credit deterioration (migration
risk) of the counterparty. Even if a derivative has only 3 months
remaining, if it is unsecured, it attracts capital as if it were a
1-year risk.

### 4.2 The \"Fully Collateralised\" Exemption

The PRA has explicitly amended the rules to **disapply** the 1-year
floor for fully collateralised transactions. This alignment with
international standards is a critical relief measure for the securities
financing and short-term derivatives markets.

> **\"The PRA has amended the near-final rules to clarify that the
> maturity floor does not apply to collateralised transactions\...\"**
> ^2^

Definition of Fully Collateralised:

To qualify for this exemption, the netting set must satisfy specific
documentation requirements, primarily:

1.  **Daily Revaluation:** The exposures must be marked-to-market daily.

2.  **Daily Margining:** There must be a contractual obligation to
    > exchange Variation Margin (VM) daily.

3.  **Liquidation Provisions:** The agreement (e.g., ISDA CSA, GMRA)
    > must allow for the prompt liquidation or set-off of collateral in
    > the event of default.

Calculation Implication:

For a qualifying secured netting set:

\$\$M\_{NS} = M\_{calculated}\$\$

This allows \$M\_{NS}\$ to drop below 1 year. For example, a 3-month
repo or a short-dated FX swap under a CSA will effectively use its
actual maturity (e.g., 0.25 years).

### 4.3 The \"Margin Period of Risk\" (MPOR) Floor

While the 1-year floor is removed, it is replaced by a \"technical\"
floor determined by the **Margin Period of Risk (MPOR)**. The effective
maturity cannot logically be shorter than the time it takes to close out
the risk upon default.

The Floor Logic:

\$\$M\_{NS} \\geq \\text{MPOR (in years)}\$\$

The MPOR is determined by the nature of the transaction and the
collateral agreement:

-   **Standard Derivatives/SFTs:** 10 business days (\$10/250 = 0.04\$
    > years).

-   **Central Counterparties (CCPs):** Often 5 business days (\$5/250 =
    > 0.02\$ years) for client trades, though BA-CVA applies to
    > non-cleared trades.

-   **Disputes/Illiquid Collateral:** If the netting set has a history
    > of disputes or contains illiquid collateral, the MPOR floor
    > increases (e.g., to 20 business days or \$0.08\$ years).

Synthesis:

For a fully collateralised Non-IMM netting set:

\$\$M\_{NS} = \\max \\left( \\text{MPOR}, \\min \\left( \\frac{\\sum P_i
t_i}{\\sum P_i}, t\_{longest} \\right) \\right)\$\$

This structure creates a massive capital incentive for
collateralisation. A 6-month unsecured trade has \$M=1.0\$. The same
trade, if fully secured, has \$M=0.5\$. This 50% reduction in the
maturity scalar directly translates to a 50% reduction in the capital
requirement (before even considering the reduction in \$EAD\$ due to
collateral).

## 5. Securities Financing Transactions (SFTs)

SFTs (Repos, Reverse Repos, Securities Lending/Borrowing) occupy a
unique space in the BA-CVA framework. While often excluded from
accounting CVA, they are brought into regulatory CVA scope if deemed
**material**.

### 5.1 Materiality and Scope

The PRA requires firms to include SFTs in the CVA capital charge only if
they are **fair-valued** for accounting purposes and the CVA risk is
**material**.

-   **Materiality Test:** Firms must document their assessment. If SFT
    > CVA risk is deemed immaterial, \$M\_{NS}\$ calculation is moot.

-   **Qualitative Factors:** Materiality often hinges on the size of the
    > gross notionals and the presence of \"Wrong Way Risk\" (e.g.,
    > reverse repo-ing a bond issued by the counterparty or a correlated
    > entity).

### 5.2 The \"0.5 Year\" Myth vs. Reality

The user query raised a specific question regarding a \"0.5 year\" rule
for SFTs. It is essential to clarify the regulatory source of this
figure to avoid confusion.

-   **Foundation IRB (F-IRB) Rule:** In the calculation of *Credit Risk*
    > RWA (not CVA), Article 162(1) allows a flat maturity of **0.5
    > years** for certain short-term corporate exposures and SFTs.

-   **BA-CVA Rule:** There is **no fixed 0.5-year parameter** in the
    > BA-CVA maturity calculation. The BA-CVA rules point to Article
    > 162(2), which mandates the calculation of the **actual effective
    > maturity**.

Clarification:

For BA-CVA, an SFT netting set maturity is calculated exactly as
described in Section 4.2:

-   It is the **weighted average remaining maturity** (Non-IMM) or
    > **effective duration** (IMM).

-   Because SFTs are almost always fully collateralised (daily
    > margined), the **1-year floor is removed**.

-   The effective floor is the **MPOR** (typically 5 or 10 business
    > days).

Therefore, for a book of overnight repos or 1-week repos, the
\$M\_{NS}\$ will be extremely short (e.g., 0.02 to 0.04 years). It is
**not** floored at 0.5 years. Applying a 0.5-year floor would be a
misinterpretation of the cross-reference to Article 162, potentially
resulting in a punitive overestimation of capital for short-dated repo
desks.

### 5.3 Calculating **\$M\_{NS}\$** for SFT Netting Sets

Scenario Analysis:

Consider a netting set with a counterparty consisting of two SFTs:

1.  **Reverse Repo A:** £100m cash lent, 1 week remaining (\$t=0.019\$
    > years).

2.  **Securities Borrow B:** £50m bond borrowed, 3 months remaining
    > (\$t=0.25\$ years).

Calculation (Non-IMM):

\$\$M\_{weighted} = \\frac{(100 \\cdot 0.019) + (50 \\cdot 0.25)}{100 +
50}\$\$

\$\$M\_{weighted} = \\frac{1.9 + 12.5}{150} = \\frac{14.4}{150} = 0.096
\\text{ years}\$\$

**Floors:**

-   Is it fully collateralised? Yes (assuming GMRA with daily margin).
    > 1-year floor disapplied.

-   MPOR Floor: 5 business days = 0.019 years.

-   \$M\_{NS} = \\max(0.096, 0.019) = 0.096 \\text{ years}\$.

If the 1-year floor were applied (e.g., due to a failure in
documentation), \$M\_{NS}\$ would jump to **1.0 years**, increasing the
CVA capital charge by a factor of roughly **10x**. This highlights the
operational criticality of tagging SFT netting sets correctly as \"fully
collateralised\" in calculation engines.

## 6. Implementation and Data Challenges

Implementing the \$M\_{NS}\$ logic for BA-CVA requires specific data
attributes that may not be present in legacy credit risk systems.

### 6.1 Data Requirements

  **Data Attribute**              **Purpose**                    **Challenge**
  ------------------------------- ------------------------------ ----------------------------------------------------------------------------------------------------------------
  **Contractual Maturity Date**   Base calculation for Non-IMM   Must be maintained for *all* trades, even those past their call dates if risk remains.
  **Notional Amount (\$P_i\$)**   Weighting for Non-IMM          Handling amortizing schedules; systems must pull *current* effective notional, not original.
  **Collateral Flag**             Floor Determination            Binary flag: \"Fully Collateralised\" vs \"Other\". Must link to CSA/GMRA data to verify daily frequency.
  **Netting Set ID**              Aggregation                    Maturity is a netting set property. Incorrect mapping of trades to netting sets distorts the weighted average.
  **Methodology Flag**            Logic Selection                Identifying if the counterparty is under IMM or SA-CCR permission.

### 6.2 The \"Cliff Edge\" Risk in Mixed Portfolios

A significant implementation risk arises in \"mixed\" portfolios where a
netting set contains both secured and unsecured trades (possible under
certain master netting agreements, though rare).

-   **PRA Rule:** If the netting set does not meet the strict \"fully
    > collateralised\" definition (which implies *all* transactions are
    > covered by the margin mechanism), the **1-year floor applies**.

-   **Impact:** A single unsecured, unmargined trade introduced into a
    > large netting set of short-dated secured trades could technically
    > contaminate the \"fully collateralised\" status of the set,
    > triggering the 1-year floor and causing a massive spike in capital
    > requirements.

-   **Mitigation:** Firms often operationally separate secured and
    > unsecured trades into distinct netting sets (or synthetic netting
    > sets) to protect the collateralised exemptions, provided the legal
    > netting agreement supports this separation or the regulatory
    > \"synthetic netting\" permission is granted.

## 7. Comparative Summary Tables

### 7.1 Calculation Logic by Firm Type

  **Methodology**                **Non-IMM (SA-CCR)**                                              **IMM (Internal Models)**
  ------------------------------ ----------------------------------------------------------------- -----------------------------------------------------------------
  **Base Calculation**           **Notional Weighted Average**                                     **Effective Duration of EEE Profile**
  **Reference Rule**             Article 162(2)(b)                                                 Article 162(2)(g)
  **Constraint (Cap)**           Cap = **Longest Contractual Maturity** (Overrides Basel 5y cap)   Cap = **Longest Contractual Maturity** (Overrides Basel 5y cap)
  **Discount Factor (\$DF\$)**   Calculated: \$\\frac{1 - e\^{-0.05 \\cdot M}}{0.05 \\cdot M}\$    Fixed: **1.0**
  **Sensitivity**                Concave (damped by DF)                                            Linear (undamped)

### 7.2 Floor Logic by Collateral Status

  **Transaction Type**   **Unsecured / Partially Secured**   **Fully Collateralised (Daily Margin)**
  ---------------------- ----------------------------------- -----------------------------------------
  **Floor Rule**         **1 Year Floor applies**            **1 Year Floor DISAPPLIED**
  **Effective Floor**    1.0 Years                           MPOR (e.g., 10 days / 0.04 years)
  **Primary Driver**     Regulatory minimum                  Liquidity / Close-out period
  **Risk Sensitivity**   Low (flat charge for \<1y)          High (sensitive to actual tenor)

## 8. Conclusion

The determination of Effective Maturity (\$M\_{NS}\$) for BA-CVA under
the PRA\'s PS9/24 is a procedure defined by specific overrides to the
standard credit risk framework. The two most consequential technical
specifications are:

1.  **The removal of the 5-year cap** for all firms, forcing capital to
    > scale with the full contractual tenor of long-dated liabilities.
    > This is partially mitigated for Non-IMM firms via a supervisory
    > discount factor, but remains a linear driver for IMM firms.

2.  **The removal of the 1-year floor** for fully collateralised
    > transactions, allowing SFTs and margined derivatives to attract
    > capital commensurate with their short liquidation horizons (MPOR).

For practitioners, the \"0.5 year\" rule often cited in credit risk
contexts is a red herring for BA-CVA; the correct approach is a rigorous
calculation of the weighted average (or IMM duration), strictly floored
only by the Margin Period of Risk for secured trades. Accurate flagging
of collateral status and precise notional data for weighted averaging
are the operational keystones for minimizing unwarranted capital
consumption under this regime.

#### Works cited

1.  PRA Rulebook - (CRR) Instrument \[2024\] - Bank of England, accessed
    > on January 5, 2026,
    > [[https://www.bankofengland.co.uk/-/media/boe/files/prudential-regulation/policy-statement/2023/december/ps1723app2.pdf]{.ul}](https://www.bankofengland.co.uk/-/media/boe/files/prudential-regulation/policy-statement/2023/december/ps1723app2.pdf)

2.  PS17/23 -- Implementation of the Basel 3.1 standards near-final part
    > 1 \| Bank of England, accessed on January 5, 2026,
    > [[https://www.bankofengland.co.uk/prudential-regulation/publication/2023/december/implementation-of-the-basel-3-1-standards-near-final-policy-statement-part-1]{.ul}](https://www.bankofengland.co.uk/prudential-regulation/publication/2023/december/implementation-of-the-basel-3-1-standards-near-final-policy-statement-part-1)
