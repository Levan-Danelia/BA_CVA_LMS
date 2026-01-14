The transition from individual counterparty risk (\$SCVA_c\$) to the
final capital requirement in the **Reduced BA-CVA** approach is governed
by two primary supervisory constants: the **Discount Scalar
(\$DS\_{BA-CVA}\$)** and the **Correlation Parameter (\$\\rho\$)** 1-3.

### Summary of Aggregation Parameters

Parameter,Value,Functional Role in the Formula

\$DS\_{BA-CVA}\$,0.65,\"A global multiplier applied to the final
calculated capital to ensure consistency with other CVA frameworks and
prevent \"\"punitively high\"\" capital charges 1, 2, 4.\"

\$\\rho\$ (Rho),50% (0.5),The supervisory correlation parameter used to
aggregate risks across different counterparties within the
square-root-of-sum-of-squares formula 5-7.

### The Role of \$\\rho\$ (Rho): Risk Decomposition

The parameter \$\\rho\$ is the mathematical pivot that splits the total
CVA risk into two distinct components for the entire portfolio 3, 8:

-   **The Systematic Component (\$\\rho \\cdot \\sum SCVA_c)\^2\$:**
    > This represents **market-wide credit spread risk** 5, 8. By
    > summing the standalone risks *before* squaring them and applying
    > \$\\rho\$, the formula assumes that 50% of the risk is driven by
    > general market movements where all counterparty spreads widen
    > simultaneously 5, 8.

-   **The Idiosyncratic Component \$(1 - \\rho\^2) \\cdot \\sum
    > (SCVA_c)\^2\$:** This represents **name-specific risk**, such as a
    > single counterparty facing bankruptcy 5, 8. By squaring the values
    > *individually* before summing, the formula acknowledges that 50%
    > of the risk is specific to individual entities 5. This component
    > rewards diversification; a portfolio of many small exposures will
    > result in a lower idiosyncratic charge than one large exposure 5.

### The Role of \$DS\_{BA-CVA}\$: Global Calibration

The **Discount Scalar** of **0.65** is applied at the very end of the
calculation 4, 9. Its primary roles include:

-   **Neutralising Conservatism:** The BA-CVA aggregation assumes
    > perfect correlation within certain buckets, which is a
    > conservative simplification 2. The 0.65 scalar acts as a **35%
    > discount** to adjust for this \"built-in\" conservatism 2.

-   **Framework Alignment:** It ensures that the capital outcome for
    > firms using the Basic Approach is relatively aligned with the more
    > complex Standardised Approach (SA-CVA), preventing a massive
    > \"cliff-edge\" or step-change in capital requirements for firms
    > moving between methods 1, 2.

-   **Final Scaling:** It is the last multiplier in the formula:
    > **Capital \$= 0.65 \\times K\_{reduced}\$** 4, 9.
