The **\$K\_{hedged}\$** formula is the \"net\" risk view of a portfolio
under the Full Basic Approach for CVA. It aggregates standalone
counterparty risks after accounting for the offsetting effects of
eligible single-name and index hedges 1, 2.

According to Rule 4.6 of the Credit Valuation Adjustment Risk Part, the
formula for **\$K\_{hedged}\$** is defined as:

\$\$K\_{hedged} = \\sqrt{\\left(\\rho \\cdot \\sum\_{C} (SCVA_c - SNH_c)
- IH\\right)\^2 + (1 - \\rho\^2) \\cdot \\sum\_{C} (SCVA_c - SNH_c)\^2 +
\\sum\_{C} HMAC_c}\$\$ 2, 3

### Structural Components of the Formula

The formula is divided into three distinct mathematical parts to capture
different dimensions of hedged risk:

**1. The Net Systematic Component: \$\\left(\\rho \\cdot \\sum\_{C}
(SCVA_c - SNH_c) - IH\\right)\^2\$**

-   **Function:** This calculates the remaining **market-wide risk**
    > after all hedges are applied 4, 5.

-   **Role of \$IH\$:** Index hedges are subtracted only from this
    > systematic component 6, 7. They reduce the general market credit
    > spread risk but do not mitigate name-specific risks 6.

-   **Role of \$SNH_c\$:** Single-name hedges also contribute to
    > reducing systematic risk here by lowering the net standalone
    > exposure (\$SCVA_c - SNH_c\$) 2, 3.

**2. The Net Idiosyncratic Component: \$(1 - \\rho\^2) \\cdot \\sum\_{C}
(SCVA_c - SNH_c)\^2\$**

-   **Function:** This calculates the remaining **name-specific risk**
    > 4, 8.

-   **Diversification Benefit:** By squaring the net exposures
    > individually before summing, the formula rewards firms for having
    > a diversified portfolio of small net exposures rather than a few
    > large unhedged ones 8.

-   **Note on Indices:** Index hedges (**\$IH\$**) are notably absent
    > from this part of the formula because an index cannot hedge the
    > specific default or spread blowout of a single name 6, 7, 9.

**3. The Hedging Mismatch Adjustment: \$\\sum\_{C} HMAC_c\$**

-   **Function:** This is an **add-on** that penalises imperfect hedges
    > 1, 5.

-   **Basis Risk:** If a firm uses a proxy hedge (e.g., hedging a
    > counterparty with its parent company\'s CDS), the \$SNH_c\$ term
    > reduces the capital in the first two components, but the
    > **\$HMAC_c\$** term \"adds back\" capital to account for the risk
    > that the proxy doesn\'t perfectly track the actual counterparty
    > 10-12.

### Parameter Definitions

-   **\$\\rho\$ (Rho):** The supervisory correlation parameter, fixed at
    > **50%** (0.5) 8, 13.

-   **\$SCVA_c\$:** The Standalone CVA requirement for counterparty
    > \$c\$ 13, 14.

-   **\$SNH_c\$:** The total offset provided by all **single-name
    > hedges** for counterparty \$c\$ 13, 14.

-   **\$IH\$:** The total offset provided by all **index hedges** across
    > the entire portfolio 13, 14.

-   **\$HMAC_c\$:** The specific **mismatch adjustment** for the hedges
    > assigned to counterparty \$c\$ 11, 13.
