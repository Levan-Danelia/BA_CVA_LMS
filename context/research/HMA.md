The **Hedging Mismatch Adjustment (\$HMAC\$)** is a prescriptive capital
add-on within the **Full BA-CVA** framework 1. Its primary role is to
penalise **basis risk**, which occurs when the credit derivative used as
a hedge does not perfectly match the counterparty being hedged 2, 3.

### 1. The \$HMAC\$ Formula

According to Rule 4.9 of the Credit Valuation Adjustment Risk Part, the
adjustment is calculated for each single-name hedge \$h\$ as follows:

**\$\$HMAC = \\sum\_{h \\in C} (1 - r\_{hc}\^2) \\cdot (RW_h \\cdot
M_h\^{SN} \\cdot B_h\^{SN} \\cdot DF_h\^{SN})\^2\$\$** 4, 5

### 2. Detailed Component Breakdown

The formula uses the same risk-weighted and discounted notional values
as the Single-Name Hedge (\$SNH_c\$) calculation, but squares them and
applies a correlation-based penalty:

-   **Supervisory Correlation (\$r\_{hc}\$):** This is the key driver of
    > the penalty. It represents the correlation between the
    > counterparty \$c\$ and the hedge \$h\$.

-   **100% Correlation:** If the hedge references the counterparty
    > **directly**, \$r\_{hc} = 1\$. In this case, \$(1 - 1\^2) = 0\$,
    > resulting in **zero \$HMAC\$ penalty** for that hedge 4-6.

-   **80% Correlation:** If the hedge references an entity **legally
    > related** to the counterparty (e.g., a parent company), a partial
    > penalty is applied 4, 5.

-   **50% Correlation:** If the hedge references an entity that only
    > **shares the same sector and region**, a higher penalty is applied
    > 4, 5.

-   **Supervisory Risk Weight (\$RW_h\$):** The risk weight assigned to
    > the reference name of the hedge based on the Table 1 sectors and
    > credit quality 7, 8.

-   **Remaining Maturity (\$M_h\^{SN}\$):** The contractual remaining
    > maturity of the hedging instrument 9, 10.

-   **Hedge Notional (\$B_h\^{SN}\$):** The notional amount of the
    > single-name CDS or contingent CDS 9, 10.

-   **Supervisory Discount Factor (\$DF_h\^{SN}\$):** The factor used to
    > present-value the hedge notional, calculated using a flat 5%
    > supervisory rate: \$\\frac{1 - e\^{-0.05 \\cdot M_h\^{SN}}}{0.05
    > \\cdot M_h\^{SN}}\$ 8, 9.

### 3. Role in the Portfolio Aggregation

In the **\$K\_{hedged}\$** formula, the \$HMAC\$ terms for all hedges
are summed across all counterparties (\$\\sum\_{C} HMAC_c\$) and
included as a final addition inside the square root:

\$\$K\_{hedged} = \\sqrt{(Systematic\\\_Net)\^2 +
(Idiosyncratic\\\_Net)\^2 + \\mathbf{\\sum\_{C} HMAC_c}}\$\$ 11, 12

### 4. Strategic Purpose: The \"Proxy Hedge\" Penalty

The framework is designed to allow \"proxy hedging\" to reduce the
systematic and idiosyncratic components of the capital charge, but it
simultaneously \"adds back\" capital through the \$HMAC\$ to account for
the risk that the proxy (the hedge) might not perform exactly like the
exposure 3, 13. This ensures that while some capital relief is granted
for proxy hedges, it is less than the relief granted for a direct,
perfect hedge 6.
