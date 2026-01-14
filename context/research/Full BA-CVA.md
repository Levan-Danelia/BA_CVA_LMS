The **Full Basic Approach (\$K\_{full}\$)** is the regulatory
calculation path used by firms that employ **eligible BA-CVA
hedges**---specifically single-name and index Credit Default Swaps
(CDS)---to mitigate their counterparty credit spread risk 1-3. While the
Reduced approach assumes a \"naked\" or unhedged position, the Full
approach allows for a reduction in capital requirements by recognizing
the risk-offsetting effects of these instruments 2, 4, 5.

### The \$K\_{full}\$ Formula

The capital requirement under this approach is a weighted average that
blends the unhedged risk with the hedged risk 3, 5. The formula is
defined as:

**\$K\_{full} = \\beta \\cdot K\_{reduced} + (1 - \\beta) \\cdot
K\_{hedged}\$** 3, 5

Once this weighted value is determined, the final own funds requirement
is calculated by applying the **Discount Scalar (\$DS\_{BA-CVA}\$)** of
**0.65** 3, 5.

### The Role of Beta (\$\\beta\$)

The parameter **\$\\beta\$ (Beta)** is a fixed supervisory constant set
at **0.25** (25%) 3, 5. Its primary functions in the framework are:

-   **Weighting Factor:** It assigns a 25% weight to the unhedged
    > capital requirement (\$K\_{reduced}\$) and a 75% weight to the
    > capital requirement calculated after recognizing hedges
    > (\$K\_{hedged}\$) 3, 5.

-   **Capital Floor:** By maintaining a 25% weight on the unhedged
    > position, \$\\beta\$ ensures that even a \"perfectly\" hedged
    > portfolio cannot reduce its CVA capital charge by more than
    > **75%** relative to the \$K\_{reduced}\$ level Source:
    > Conversation History, 71, 119.

-   **Addressing Basis Risk:** The inclusion of \$\\beta\$ serves as a
    > conservative buffer, acknowledging that hedges may not perfectly
    > capture all aspects of CVA risk or that there may be residual
    > risks not fully accounted for in the \$K\_{hedged}\$ formula 2, 3.

### Core Components

-   **\$K\_{reduced}\$:** This is the \"gross\" risk view, calculated
    > using the standard aggregation formula for standalone CVA
    > (\$SCVA_c\$) without any recognition of hedging offsets 3, 4, 6.

-   **\$K\_{hedged}\$:** This represents the \"net\" risk view of the
    > portfolio 3. It incorporates the offsets provided by single-name
    > hedges against specific counterparties and index hedges against
    > the systematic component of the portfolio 3, 5, 7.

-   **Aggregation Logic:** Both components of \$K\_{full}\$ rely on the
    > same **supervisory correlation parameter (\$\\rho\$)** of **50%**
    > to decompose risk into systematic and idiosyncratic elements 3,
    > 5, 8.
