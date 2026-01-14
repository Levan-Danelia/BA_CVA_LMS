# Index Hedges (IH)

The **Index Hedge (\$IH\$)** represents the total offset provided by
eligible index Credit Default Swaps (CDS) (such as iTraxx or CDX) across
the entire portfolio 1, 2. Unlike single-name hedges, index hedges are
designed to mitigate the **systematic component** of CVA risk---the risk
that the market as a whole experiences credit spread widening 2, 3.

## 1. The \$IH\$ Formula

According to Rule 4.8 of the Credit Valuation Adjustment Risk Part, the
total index hedge value is the sum of all individual index hedges
(\$i\$):

\$\$IH = \\sum\_{i} RW_i\^{ind} \\cdot M_i\^{ind} \\cdot B_i\^{ind}
\\cdot DF_i\^{ind}\$\$ 4, 5

## 2. Component Breakdown

- **Supervisory Risk Weight (\$RW_i\^{ind}\$):** This is the risk
  > weight assigned to the index, derived from the standard Table 1
  > risk weights but adjusted by a **0.7 multiplier** to reflect the
  > diversification inherent in an index 6, 7. The specific
  > calculation depends on the index composition:

- **Homogeneous Indices:** If all constituents belong to the **same
  > sector and credit quality**, firms take the relevant Table 1 value
  > and multiply it by 0.7 6, 7.

- **Heterogeneous/Mixed Indices:** If the index spans multiple sectors
  > or contains a mix of Investment Grade and High Yield names, firms
  > must calculate a **name-weighted average** of the applicable Table
  > 1 risk weights and then multiply the result by 0.7 6, 7.

- **Remaining Maturity (\$M_i\^{ind}\$):** This is the **contractual
  > remaining maturity** of the index hedging instrument 5, 6.

- **Hedge Notional (\$B_i\^{ind}\$):** This is the total **notional
  > amount** of the index CDS 5, 6.

- **Supervisory Discount Factor (\$DF_i\^{ind}\$):** This factor
  > discounts the index notional using the standard continuous-time
  > formula at a **5% supervisory rate**:

- \$\$DF_i\^{ind} = \\frac{1 - e\^{-0.05 \\cdot M_i\^{ind}}}{0.05
  > \\cdot M_i\^{ind}}\$\$ 5, 6

## 3. Functional Role in \$K\_{hedged}\$

In the aggregation formula for \$K\_{hedged}\$, the \$IH\$ value is
applied specifically to the **systematic term**:

\$\$K\_{hedged} = \\sqrt{\\left(\\rho \\cdot \\sum\_{C} (SCVA_c - SNH_c)
\\mathbf{- IH}\\right)\^2 + \...}\$\$ 8, 9

- **Systematic Offset Only:** \$IH\$ is subtracted from the sum of
  > counterparty risks before that sum is squared 2, 8. This means it
  > can significantly reduce the capital charge associated with
  > general market movements 2, 10.

- **No Idiosyncratic Relief:** Because an index hedge represents a
  > basket of names, it **cannot be used to offset the idiosyncratic
  > component** of the formula 2, 10. It is mathematically excluded
  > from the second term of the square root, reflecting the regulatory
  > view that an index cannot protect a firm against the specific
  > spread blowout or default of a single counterparty 2, 11.

- **Netting Effect:** If a firm is \"over-hedged\" at an index level
  > (i.e., \$IH\$ is larger than the systematic exposure), the squared
  > nature of the formula ensures that the excess hedge will still
  > contribute to the total capital requirement 8, 9.
