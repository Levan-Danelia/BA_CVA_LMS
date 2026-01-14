The **Standalone CVA (\$SCVA_c\$)** represents the own funds requirement
for a single counterparty \$c\$, calculated on the assumption that there
are **no diversification benefits** with other counterparties 1-3. It
serves as the **fundamental building block** of the Basic Approach for
CVA (BA-CVA) framework, forming the \"gross\" risk view from which the
final capital charge is derived 4, 5. Technically, it is a **supervisory
proxy** for risk rather than a modeled value derived from a firm\'s
accounting books; it focuses primarily on **counterparty credit spread
risk**, which is the risk of loss caused by fluctuations in a
counterparty\'s credit spreads 6, 7.

The calculation is governed by the following formula:**\$\$SCVA_c =
\\frac{1}{\\alpha} \\cdot RW_c \\cdot \\sum\_{NS} (M\_{NS} \\cdot
EAD\_{NS} \\cdot DF\_{NS})\$\$** 1, 2, 8, 9.

The components of this formula function as follows:

-   **Alpha Neutralisation (\$1/\\alpha\$):** The framework divides the
    > exposure by the CCR alpha factor (typically 1.4) to **neutralise
    > the conservatism** built into standard exposure calculations 8,
    > 10, 11. This ensures the BA-CVA charge is based on the **\"pure\"
    > exposure profile** without double-counting risk buffers already
    > present in the counterparty credit risk framework 8, 12, 13.

-   **Supervisory Risk Weight (\$RW_c\$):** This is a prescriptive
    > multiplier from the PRA Rulebook that reflects the **volatility of
    > a counterparty\'s credit spread** 14-16. It is determined by the
    > counterparty\'s specific **sector and credit quality** (Investment
    > Grade vs. High Yield/Non-Rated) 16-19.

-   **Netting Set Summation (\$\\sum\_{NS}\$):** \$SCVA_c\$ is
    > calculated by summing the maturity-adjusted and discounted
    > exposures of every **netting set** the firm has with that specific
    > counterparty 1-3, 20.

-   **Effective Maturity (\$M\_{NS}\$):** This represents the effective
    > duration of the netting set 15, 21. For BA-CVA, this value is
    > **not capped at five years** and, for fully collateralised
    > transactions, the **one-year floor is removed** to preserve risk
    > sensitivity 9, 21-23.

-   **Exposure at Default (\$EAD\_{NS}\$):** This is the base exposure
    > value derived from Counterparty Credit Risk (CCR) methods like
    > SA-CCR or IMM 10, 12, 24, 25. It includes all OTC derivatives and
    > any Securities Financing Transactions (SFTs) that are fair-valued
    > and deemed **material** 24, 26-28.

-   **Supervisory Discount Factor (\$DF\_{NS}\$):** This factor adjusts
    > the exposure for the time value of money 29, 30. Firms using
    > internal models (IMM) may use a flat value of **1.0**, while all
    > other firms must use a formula based on a **5% supervisory
    > discount rate** 29, 31, 32.
