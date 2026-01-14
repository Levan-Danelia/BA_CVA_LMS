The following tables provide a granular breakdown of the **Effective
Maturity (\$M\_{NS}\$)** calculation for standalone CVA, separating the
methodology for **IMM** and **Non-IMM** firms while identifying specific
regulatory treatments for different transaction types and collateral
statuses.

### Table 1: Effective Maturity (\$M\_{NS}\$) for IMM Firms

Firms with permission to use the **Internal Models Method (IMM)** for
counterparty credit risk must determine maturity based on their approved
model parameters, subject to BA-CVA specific constraints 1, 2.

Transaction Category,Collateral Status,Primary Methodology,Maturity
Floor (1-Year),Maturity Cap

Derivatives,Fully Collateralised,\"Article 162(2)(g) or (2) 1, 2.\",Not
Applied; uses actual contractual risk duration 3.,Longest contractual
remaining maturity 1-3.

Derivatives,Unsecured / Partially Collateralised,\"Article 162(2)(g) or
(2) 1, 2.\",Applied; standard 1-year floor remains 3.,Longest
contractual remaining maturity 1-3.

SFTs (if material/fair-valued),Fully Collateralised,\"Article 162(2)(g)
or (2) 1, 2.\",\"Not Applied; prevents penalty for short-term trades 3,
4.\",Longest contractual remaining maturity 1-3.

SFTs (if material/fair-valued),Unsecured / Partially
Collateralised,\"Article 162(2)(g) or (2) 1, 2.\",Applied; standard
regulatory floor applies 3.,Longest contractual remaining maturity 1-3.

### Table 2: Effective Maturity (\$M\_{NS}\$) for Non-IMM Firms

Firms that do **not** use the IMM must use a formulaic approach based on
transaction notionals rather than internal model profiles 1, 5.

Transaction Category,Collateral Status,Primary Methodology,Maturity
Floor (1-Year),Maturity Cap

Derivatives,Fully Collateralised,\"Notional-weighted average maturity 1,
3, 5.\",Not Applied; preserves risk sensitivity 3.,\"Longest contractual
remaining maturity 1, 3, 5.\"

Derivatives,Unsecured / Partially Collateralised,\"Notional-weighted
average maturity 1, 3, 5.\",Applied per standard IRB rules 3.,\"Longest
contractual remaining maturity 1, 3, 5.\"

SFTs (if material/fair-valued),Fully Collateralised,\"Notional-weighted
average maturity 1, 3, 5.\",\"Not Applied; reflects short-term nature of
SFTs 3, 4.\",\"Longest contractual remaining maturity 1, 3, 5.\"

SFTs (if material/fair-valued),Unsecured / Partially
Collateralised,\"Notional-weighted average maturity 1, 3, 5.\",Applied
per standard IRB rules 3.,\"Longest contractual remaining maturity 1, 3,
5.\"

### Key Technical Summary

-   **Netting Set Level:** All maturity calculations are performed at
    > the **netting set (\$NS\$) level**, and then integrated into the
    > counterparty-level \$SCVA_c\$ formula 6-8.

-   **The \"No-Floor\" Rule:** The most significant change for both firm
    > types is that **fully collateralised transactions** (typically
    > margined trades) are no longer forced to a 1-year maturity,
    > allowing for lower capital charges on short-term exposures 3.

-   **Removal of the 5-Year Cap:** Unlike general credit risk
    > frameworks, \$M\_{NS}\$ for BA-CVA is **not capped at five years**
    > 1, 3, 5. It must represent the actual **longest contractual
    > remaining maturity** of any transaction within that netting set 1,
    > 3, 5.

-   **SFT Materiality:** Securities Financing Transactions only enter
    > these tables if they are **fair-valued** for accounting and their
    > CVA risk is deemed **material** 4, 9, 10.
