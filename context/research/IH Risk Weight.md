# Index Hedge Risk Weight Calculation

To calculate the supervisory risk weight for an index hedge
(**\$RW_i\^{ind}\$**), you must first identify the base risk weights
from **Table 1** (Rule 4.4) for the index constituents and then apply
the mandatory **0.7 diversification scalar** 1, 2.

The methodology differs based on whether the index is **homogeneous**
(all names in the same bucket) or **mixed** 1, 2. Below are the
calculations for different scenarios.

## 1. Homogeneous Index Example

If an index contains names that all fall into the same **sector** and
share the same **credit quality**, you simply take that specific Table 1
value and multiply it by 0.7 1, 2.

- **Index:** Senior Financials Investment Grade (IG).

- **Table 1 Base Weight:** The risk weight for IG Financials is
  > **5.0%** 3-5.

- **Calculation:** \$5.0\\% \\times 0.7 = \\mathbf{3.5\\%}\$.

## 2. Mixed Credit Quality Example (Single Sector)

If an index is restricted to one sector but contains a mix of
**Investment Grade (IG)** and **High Yield (HY)** names, you must
calculate the **name-weighted average** of the Table 1 risk weights
before applying the scalar 1, 2.

- **Index:** Consumer Goods Sector Index.

- **Composition:** 70% of the index notionals are IG; 30% are HY.

- **Table 1 Weights:** Consumer IG is **3.0%**; Consumer HY is
  > **8.5%** 3-5.

- **Step 1 (Weighted Average):** \$(0.70 \\times 3.0\\%) + (0.30
  > \\times 8.5\\%) = 2.1\\% + 2.55\\% = \\mathbf{4.65\\%}\$.

- **Step 2 (Apply 0.7 Scalar):** \$4.65\\% \\times 0.7 =
  > \\mathbf{3.255\\%}\$.

## 3. Mixed Sector Example (Multi-Sector Index)

For indices spanning multiple industries, you map each constituent to
its respective sector/quality bucket, average them by name-weight, and
then scale the result 1, 2.

- **Index:** Diversified \"Safe-Haven\" Index (all names are IG).

- **Composition:** 50% Technology/Telecoms and 50% Health
  > Care/Utilities.

- **Table 1 Weights:** Tech IG is **2.0%**; Health Care IG is **1.5%**
  > 3-5.

- **Step 1 (Weighted Average):** \$(0.50 \\times 2.0\\%) + (0.50
  > \\times 1.5\\%) = 1.0\\% + 0.75\\% = \\mathbf{1.75\\%}\$.

- **Step 2 (Apply 0.7 Scalar):** \$1.75\\% \\times 0.7 =
  > \\mathbf{1.225\\%}\$.

## Summary of Key Table 1 Weights for \$RW_i\^{ind}\$ Calculations

To perform these calculations yourself, use these base values from the
sources 3-5:

Counterparty Sector,Investment Grade (IG),High Yield (HY) / Unrated

Sovereigns,0.5%,2.0%

Financials,5.0%,12.0%

Technology / Telecoms,2.0%,5.5%

Health Care / Utilities,1.5%,5.0%

Basic Materials / Energy,3.0%,7.0%

Consumer / Transport,3.0%,8.5%

**Note:** If a constituent is **unrated**, you must treat it as **High
Yield** for this calculation unless it is an unrated Central Bank, which
may map to its Sovereign\'s weight 6, 7.
