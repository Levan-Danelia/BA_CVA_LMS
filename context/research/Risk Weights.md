In the calculation of the **standalone CVA (\$SCVA_c\$)**, the parameter
**\$RW_c\$** represents the supervisory risk weight assigned to a
counterparty to reflect the volatility of its credit spread 1, 2. These
weights are prescriptive and are determined by the counterparty\'s
**sector** and **credit quality** 3-5.

### 1. Supervisory Risk Weight Table (\$RW_c\$)

Firms must assign risk weights according to the following table from the
Credit Valuation Adjustment Risk Part of the PRA Rulebook 4, 5:

Counterparty Sector,Investment Grade (IG),High Yield (HY) & Non-Rated
(NR)

\"Sovereigns (inc. Central Banks, MDBs)\",0.5%,2.0%

\"Local Government (PSEs, Public Admin)\",1.0%,4.0%

\"Financials (inc. Govt-backed, excl. Pension Funds)\",5.0%,12.0%

Pension Funds,3.5%,8.5%

\"Basic Materials, Energy, Industrials, Agriculture\",3.0%,7.0%

\"Consumer Goods, Transport, Support Services\",3.0%,8.5%

\"Technology, Telecommunications\",2.0%,5.5%

\"Health Care, Utilities, Professional/Technical\",1.5%,5.0%

Other Sector,5.0%,12.0%

### 2. Treatment of Special Entities

The PRA has introduced specific modifications for certain entity types
to reflect UK market conditions and mitigate capital volatility:

-   **Unrated Central Banks:** Firms may assign the risk weight of the
    > **relevant central government** to unrated central bank exposures
    > 6, 7. This prevents these entities from being penalised with the
    > \"Other Sector\" or \"High Yield\" weights, typically resulting in
    > a lower weight of 0.5% or 2.0% 6, 7.

-   **Pension Funds:** These entities have a dedicated row in the risk
    > weight table 4, 5. Additionally, CVA capital for pension funds is
    > reduced through the **removal of the 1.4 alpha factor** in the
    > \$EAD\$ calculation, providing a coherent cross-framework
    > treatment 7-9.

### 3. Credit Quality Mapping and Penalties

The framework creates a steep capital cliff between Investment Grade
(IG) and High Yield (HY) or Non-Rated (NR) exposures 10.

-   **Non-Rated Entities:** Counterparties without an external rating
    > are treated as **High Yield** by default, which can increase the
    > capital charge significantly (e.g., a 2.4x jump for Financials)
    > 10-12.

-   **IRB Firm Mapping:** Firms with permission to use the **Internal
    > Ratings Based (IRB)** approach must map their internal ratings to
    > an external credit quality step to determine whether the
    > counterparty qualifies for the IG or HY risk weight 11, 12.

-   **Sectoral Granularity:** For corporate sub-sectors, firms must
    > accurately tag counterparties with specific industry codes (such
    > as NACE) to access lower risk weights, such as the 1.5% assigned
    > to Health Care and Utilities 13.

### 4. Role in the Standalone Formula

Within the \$SCVA_c\$ formula, \$RW_c\$ acts as a **linear multiplier**
applied to the maturity-adjusted exposure 14-16. Because it is a direct
multiplier, the risk weight is the primary driver of differentiation in
capital charges between different types of counterparties; for example,
a High-Yield corporate exposure generates multiple times the capital
requirement of a Sovereign exposure with identical maturity and \$EAD\$
10, 17.
