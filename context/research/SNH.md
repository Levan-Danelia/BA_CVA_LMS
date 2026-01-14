The **Total Single-Name Hedge (\$SNH_c\$)** represents the aggregate
offset provided by all eligible single-name credit derivatives used to
hedge the CVA risk of a specific counterparty \$c\$. It is a core
component of the \$K\_{hedged}\$ formula in the Full BA-CVA framework 1,
2.

The formula for calculating the offset from single-name hedges is
defined in Rule 4.7 of the Credit Valuation Adjustment Risk Part 2, 3:

**\$\$SNH_c = \\sum\_{h \\in C} r\_{hc} \\cdot RW_h \\cdot M_h\^{SN}
\\cdot B_h\^{SN} \\cdot DF_h\^{SN}\$\$**

The components are detailed as follows:

### 1. Supervisory Correlation (\$r\_{hc}\$)

This parameter represents the **supervisory correlation** between the
credit spread of the counterparty \$c\$ and the credit spread of the
hedging instrument \$h\$. The value is determined by the closeness of
the relationship between the two entities 4, 5:

Relationship of Single-Name Hedge to Counterparty,Value of \$r\_{hc}\$

References counterparty \$c\$ directly,100%

\"Referenced entity is legally related to counterparty \$c\$ (e.g.,
parent/subsidiary)\",80%

Referenced entity shares sector and region with counterparty \$c\$,50%

### 2. Supervisory Risk Weight (\$RW_h\$)

This is the risk weight assigned to the **reference name of the hedging
instrument**. It reflects the volatility of that name\'s credit spread
6, 7.

-   **Source:** Firms must use the **same supervisory risk weight table
    > (Table 1)** used for the \$SCVA_c\$ calculation, matching the
    > hedge\'s reference name to its appropriate sector and credit
    > quality (Investment Grade vs. High Yield/Non-Rated) 6-8.

### 3. Remaining Maturity (\$M_h\^{SN}\$)

This represents the **remaining contractual maturity** of the
single-name eligible BA-CVA hedge 4, 5.

### 4. Hedge Notional (\$B_h\^{SN}\$)

This is the **notional amount** of the single-name credit default swap
(CDS) 4, 5.

-   **Contingent CDS:** For single-name contingent CDS, the notional
    > must be determined by the **current market value** of the
    > reference portfolio or instrument 4, 5.

### 5. Supervisory Discount Factor (\$DF_h\^{SN}\$)

This component discounts the hedge\'s notional to its present value
using a continuous-time approach 6, 7:**\$\$DF_h\^{SN} = \\frac{1 -
e\^{-0.05 \\cdot M_h\^{SN}}}{0.05 \\cdot M_h\^{SN}}\$\$**

-   This formula assumes a flat **5% supervisory discount rate** applied
    > over the remaining maturity of the hedge (\$M_h\^{SN}\$) 6, 7.

### Eligibility and Summation

-   **Eligible Instruments:** Only **single-name CDS** or **single-name
    > contingent CDS** qualify as eligible single-name hedges 9, 10.

-   **Aggregation:** The formula uses a summation (\$\\sum\_{h \\in
    > C}\$), meaning if a firm has multiple hedges for a single
    > counterparty (e.g., one direct CDS and one proxy hedge on a parent
    > company), the risk-weighted, discounted, and correlation-adjusted
    > values of all these hedges are added together to determine the
    > total \$SNH_c\$ 2, 6.

-   **Role in Aggregation:** The resulting \$SNH_c\$ is subtracted
    > directly from the counterparty\'s \$SCVA_c\$ in the
    > \$K\_{hedged}\$ formula, though any mismatch in the correlation
    > (\$r\_{hc} \< 100\\%\$) will trigger a separate **Hedging Mismatch
    > Adjustment (\$HMAC\$)** charge 1, 11.
