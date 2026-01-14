The role of **alpha (\$\\alpha\$)** in the BA-CVA framework is primarily
to **neutralise the conservatism** inherent in standard Counterparty
Credit Risk (CCR) exposure values to prevent the double-counting of risk
buffers 1, 2.

### 1. The Neutralisation Mechanism

In the standard CCR framework (used for SA-CCR and IMM), the **Exposure
at Default (\$EAD\$)** is typically calculated as \$\\alpha \\cdot (RC +
PFE)\$, where \$\\alpha\$ is a supervisory multiplier set at **1.4** 1.

However, the standalone CVA formula (\$SCVA_c\$) is structured as
follows:

\$\$SCVA_c = \\mathbf{\\frac{1}{\\alpha}} \\cdot RW_c \\cdot \\sum\_{NS}
(M\_{NS} \\cdot EAD\_{NS} \\cdot DF\_{NS})\$\$ 3-5

By multiplying the entire summation by **\$1/\\alpha\$**, the framework
effectively **divides out the 1.4 multiplier** 2, 6. This ensures that
the BA-CVA charge is driven by the \"pure\" replacement cost and
potential future exposure, un-inflated by the general CCR alpha buffer
1, 7.

### 2. Preventing Double-Counting

The PRA Rulebook explicitly states that this division is necessary
because the BA-CVA framework **applies its own layers of conservatism**
through:

-   **Supervisory Risk Weights (\$RW_c\$):** Which are calibrated
    > specifically for credit spread volatility 2, 8.

-   **Aggregation Logic:** Which assumes high correlations between
    > counterparties 2, 9.

-   **The Discount Scalar (\$DS\_{BA-CVA}\$):** A separate 0.65
    > multiplier applied at the end of the calculation 2, 10.

If the alpha factor were not removed, the capital requirement would be
**punitively high** due to double-counting these conservative
assumptions 2.

### 3. Alpha Relief for Pension Funds

A critical exception in the near-final rules concerns **Pension Fund
arrangements**. To mitigate the impact of removing their previous CVA
exemption, the PRA has introduced a specific **alpha adjustment** 11,
12:

Exposure Type,Standard Alpha (\$\\alpha\$),CVA Impact

Standard Counterparties,1.4,\"Neutralised in the \$SCVA_c\$ formula to
return exposure to a \"\"1.0\"\" base 1, 2.\"

Pension Funds,1.0,\"The CCR \$EAD\$ is calculated with \$\\alpha = 1.0\$
instead of 1.4, resulting in a linear reduction of \~28% in the total
CVA capital charge 12-14.\"

### Summary of Alpha\'s Function

Feature,Role in BA-CVA

Definition,\"A supervisory scaling factor taken from the Counterparty
Credit Risk (CRR) Part 6, 15.\"

Standard Value,\"1.4 (unless the firm has permission for a higher
model-based alpha) 1, 2.\"

Formula Role,\"Acts as a divisor (\$1/\\alpha\$) to extract the raw
exposure value from the CCR \$EAD\$ 2, 3.\"

Strategic Goal,\"To ensure CVA risk is calculated on the actual exposure
profile rather than a credit-risk-weighted exposure profile 2, 7.\"
