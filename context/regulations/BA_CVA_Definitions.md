# BA-CVA Regulatory Definitions

**Source:** PRA Rulebook - Credit Valuation Adjustment Risk Part (Annex K)
**Reference Documents:** PS9/24, PS17/23
**Effective Date:** 1 January 2026

---

## Purpose

This document contains the **exact definitions and terminology** as they appear in the PRA regulation. Use these precise terms in all book content, examples, and code to ensure consistency with regulatory text and prevent reader confusion.

---

## 1. Core BA-CVA Components

### Capital Requirement Terms

| Regulatory Term | Exact Symbol | Definition from Regulation |
| ----------------- | -------------- | ---------------------------- |
| **Discount Scalar** | $DS_{BA-CVA}$ | Fixed at 0.65. Applied to final capital requirement calculation. |
| **Own Funds Requirement (Reduced)** | $DS_{BA-CVA} \times K_{reduced}$ | Capital requirement when firm does not use eligible BA-CVA hedges. |
| **Own Funds Requirement (Full)** | $DS_{BA-CVA} \times K_{full}$ | Capital requirement when firm uses one or more eligible BA-CVA hedges. |
| **K Reduced** | $K_{reduced}$ | Calculated as: $\sqrt{(\rho \cdot \sum_{C} SCVA_c)^2 + (1 - \rho^2) \cdot \sum_{C} SCVA_c^2}$ |
| **K Full** | $K_{full}$ | Calculated as: $\beta \cdot K_{reduced} + (1 - \beta) \cdot K_{hedged}$ |
| **K Hedged** | $K_{hedged}$ | Calculated as: $\sqrt{\left(\rho \cdot \sum_{C} (SCVA_c - SNH_c) - IH\right)^2 + (1 - \rho^2) \cdot \sum_{C} (SCVA_c - SNH_c)^2 + \sum_{C} HMAC_c}$ |

### Standalone CVA

| Regulatory Term | Exact Symbol | Definition from Regulation |
| ----------------- | -------------- | ---------------------------- |
| **Standalone CVA** | $SCVA_c$ | The own funds requirement for counterparty $c$ on a standalone basis. Formula: $\frac{1}{\alpha} \cdot RW_c \cdot \sum_{NS} M_{NS} \cdot EAD_{NS} \cdot DF_{NS}$ |

---

## 2. Supervisory Parameters

### Fixed Parameters

| Regulatory Term | Exact Symbol | Value | Definition from Regulation |
| ----------------- | -------------- | ------- | ---------------------------- |
| **Discount Scalar** | $DS_{BA-CVA}$ | 0.65 | Applied to reduce final capital requirement |
| **Supervisory Correlation Parameter** | $\rho$ | 50% (0.50) | Splits risk into systematic and idiosyncratic components |
| **Beta** | $\beta$ | 0.25 | Hedge recognition floor - ensures minimum 25% of $K_{reduced}$ retained |
| **Alpha** | $\alpha$ | Per CRR Article 274(2) | Standard: 1.4; Pension funds: 1.0. Neutralizes CCR conservatism |
| **Supervisory Discount Rate** | - | 0.05 (5%) | Used in discount factor formula |
| **Index Hedge Scalar** | - | 0.7 (70%) | Multiplier applied to index hedge risk weights |

### Variable Parameters

| Regulatory Term | Exact Symbol | Definition from Regulation |
| ----------------- | -------------- | ---------------------------- |
| **Risk Weight** | $RW_c$ | Risk weight for counterparty that reflects volatility of its credit spread (Table 1 at 4.4) |
| **Supervisory Correlation (Hedge)** | $r_{hc}$ | Supervisory correlation between credit spread of counterparty $c$ and credit spread of single-name hedge $h$ (Table at 4.10) |

---

## 3. Netting Set Level Parameters

### Exposure Measures

| Regulatory Term | Exact Symbol | Definition from Regulation |
| ----------------- | -------------- | ---------------------------- |
| **Exposure at Default** | $EAD_{NS}$ | Exposure at default of the netting set, calculated in same manner as for CCR own funds requirements (SA-CCR or IMM) |
| **Effective Maturity** | $M_{NS}$ | Effective maturity for the netting set. For IMM firms: per CRR Article 162(2)(g), not capped at 5 years but at longest contractual remaining maturity. For non-IMM: notional-weighted average per CRR Article 162(2) |
| **Supervisory Discount Factor** | $DF_{NS}$ | For IMM firms: 1. For non-IMM: $\frac{1 - e^{-0.05 \cdot M_{NS}}}{0.05 \cdot M_{NS}}$ |

---

## 4. Hedge Components

### Single-Name Hedges

| Regulatory Term | Exact Symbol | Definition from Regulation |
| ----------------- | -------------- | ---------------------------- |
| **Single Name Hedge** | $SNH_c$ | Formula: $\sum_{h \in C} r_{hc} \cdot RW_h \cdot M_h^{SN} \cdot B_h^{SN} \cdot DF_h^{SN}$ |
| **Remaining Maturity (Single-Name)** | $M_h^{SN}$ | The remaining maturity of a single-name eligible BA-CVA hedge |
| **Notional (Single-Name)** | $B_h^{SN}$ | The notional of single-name eligible BA-CVA hedge $h$. For contingent CDS: current market value of reference portfolio/instrument |
| **Discount Factor (Single-Name)** | $DF_h^{SN}$ | Formula: $\frac{1 - e^{-0.05 \cdot M_h^{SN}}}{0.05 \cdot M_h^{SN}}$ |
| **Risk Weight (Single-Name)** | $RW_h$ | Supervisory risk weight of single-name hedge $h$ that reflects volatility of credit spread of reference name (Table at 4.4) |

### Index Hedges

| Regulatory Term | Exact Symbol | Definition from Regulation |
| ----------------- | -------------- | ---------------------------- |
| **Index Hedge** | $IH$ | Formula: $\sum_{i} RW_i^{ind} \cdot M_i^{ind} \cdot B_i^{ind} \cdot DF_i^{ind}$ |
| **Remaining Maturity (Index)** | $M_i^{ind}$ | The remaining maturity of index eligible BA-CVA hedge |
| **Notional (Index)** | $B_i^{ind}$ | The notional of the index eligible BA-CVA hedge |
| **Discount Factor (Index)** | $DF_i^{ind}$ | Formula: $\frac{1 - e^{-0.05 \cdot M_i^{ind}}}{0.05 \cdot M_i^{ind}}$ |
| **Risk Weight (Index)** | $RW_i^{ind}$ | Supervisory risk weight from Table 1 (4.4) with adjustments: (1) Same sector/quality: multiply by 0.7; (2) Mixed: name-weighted average then multiply by 0.7 |

### Hedge Mismatch Adjustment

| Regulatory Term | Exact Symbol | Definition from Regulation |
| ----------------- | -------------- | ---------------------------- |
| **Hedge Mismatch Adjustment** | $HMAC$ | Formula: $\sum_{h \in C} (1 - r_{hc}^2) \cdot (RW_h \cdot M_h^{SN} \cdot B_h^{SN} \cdot DF_h^{SN})^2$ |

---

## 5. Counterparty and Transaction Definitions

### Core Definitions

| Regulatory Term | Exact Definition from Regulation |
| ----------------- | ---------------------------------- |
| **covered transaction** | (1) A derivative transaction, excluding: (a) derivatives with QCCP; (b) derivatives with clearing member as intermediary; (c) derivatives where firm is clearing member intermediary; (d) derivatives with client where firm is clearing member intermediary; (e) transactions with counterparties meeting conditions in 3.2. (2) A securities financing transaction if: (a) fair-valued under accounting framework; and (b) CVA risk is material. |
| **netting set** | Has meaning in Article 272(4) of CRR |
| **counterparty** | Denoted as $c$ - all counterparties for which firm uses BA-CVA to calculate CVA risk own funds requirements and with which firm has at least one covered transaction |

### Hedge Definitions

| Regulatory Term | Exact Definition from Regulation |
| ----------------- | ---------------------------------- |
| **eligible BA-CVA hedge** | A transaction used for mitigating counterparty credit spread component of CVA risk and managed as such, being either: (1) single-name CDS or single-name contingent CDS referencing: (a) counterparty directly; (b) entity legally related to counterparty; or (c) entity in same sector and region as counterparty; or (2) an index credit default swap. |
| **legally related** | Cases where reference name and counterparty are either a parent undertaking and its subsidiary, or two subsidiaries of common parent undertaking |

---

## 6. Risk Weight Table (Table 1 at 4.4)

### Exact Sector Descriptions from Regulation

| Sector of Counterparty (Exact Wording) | Investment Grade | High Yield and Non-rated |
| ----------------------------------------- | ------------------ | -------------------------- |
| Sovereigns including central banks and multilateral development banks | 0.5% | 2.0% |
| Local government, government-backed non-financials, education and public administration | 1.0% | 4.0% |
| Financials including government-backed financials, excluding pension funds | 5.0% | 12.0% |
| Pension funds | 3.5% | 8.5% |
| Basic materials, energy, industrials, agriculture, manufacturing, mining and quarrying | 3.0% | 7.0% |
| Consumer goods and services, transportation and storage, administrative and support service activities | 3.0% | 8.5% |
| Technology, telecommunications | 2.0% | 5.5% |
| Health care, utilities, professional and technical activities | 1.5% | 5.0% |
| Other sector | 5.0% | 12.0% |

---

## 7. Supervisory Correlation Table (Table at 4.10)

### Exact Wording from Regulation

| Single name hedge of counterparty c (Exact Wording) | Value of $r_{hc}$ |
| ------------------------------------------------------ | ------------------- |
| references counterparty $c$ directly | 100% |
| is legally related to counterparty $c$ | 80% |
| shares sector and region with counterparty $c$ | 50% |

---

## 8. Subscript and Index Notation

### Standard Notation from Regulation

| Symbol | Meaning | Usage in Regulation |
| -------- | --------- | --------------------- |
| $c$ | Counterparty index | All counterparties for which firm uses BA-CVA |
| $C$ | Set of all counterparties | Used in summation: $\sum_{C}$ |
| $NS$ | Netting set | Used in summation: $\sum_{NS}$ |
| $h$ | Single-name hedge index | All single-name eligible BA-CVA hedges for a counterparty |
| $i$ | Index hedge index | All index hedges that firm has taken out to hedge CVA risk |

---

## 9. Formula Structure Terms

### Exact Terms from Regulation

| Component | Regulatory Description |
| ----------- | ------------------------ |
| **Systematic component** | $(ρ \cdot \sum_{C} SCVA_c)^2$ or $(ρ \cdot \sum_{C} (SCVA_c - SNH_c) - IH)^2$ |
| **Idiosyncratic component** | $(1 - ρ^2) \cdot \sum_{C} SCVA_c^2$ or $(1 - ρ^2) \cdot \sum_{C} (SCVA_c - SNH_c)^2$ |

---

## 10. Usage Guidelines

### Mandatory Terminology

**Always use these exact terms from regulation:**

1. **"own funds requirement"** (not "capital requirement" or "capital charge")
2. **"covered transaction"** (not "eligible transaction" or "in-scope transaction")
3. **"netting set"** (not "netting group" or "portfolio")
4. **"effective maturity"** (not "maturity" or "weighted maturity")
5. **"exposure at default"** (not "exposure" or "EAD value")
6. **"supervisory discount factor"** (not "discount factor" or "discounting")
7. **"supervisory correlation parameter"** (not "correlation" or "rho parameter")
8. **"eligible BA-CVA hedge"** (not "hedge" or "eligible hedge")
9. **"single-name eligible BA-CVA hedge"** (when referring to single-name hedges)
10. **"index eligible BA-CVA hedge"** (when referring to index hedges)
11. **"legally related"** (not "related party" or "affiliated entity")
12. **"investment grade"** and **"high yield and non-rated"** (exact categories)

### Variable Naming in Code

Use these exact symbols in Python code:

```python
# Correct - matches regulation
DS_BA_CVA = 0.65
rho = 0.50
beta = 0.25
SCVA_c = ...
K_reduced = ...
K_hedged = ...
K_full = ...
SNH_c = ...
IH = ...
HMAC = ...
M_NS = ...
EAD_NS = ...
DF_NS = ...
RW_c = ...
r_hc = ...

# For single-name hedges
M_h_SN = ...
B_h_SN = ...
DF_h_SN = ...
RW_h = ...

# For index hedges
M_i_ind = ...
B_i_ind = ...
DF_i_ind = ...
RW_i_ind = ...
```

### Section References

When citing regulation sections, use exact numbering:

- **4.2** - Reduced version of BA-CVA
- **4.3** - Standalone CVA calculation ($SCVA_c$)
- **4.4** - Risk weight table (Table 1)
- **4.5** - Full version of BA-CVA
- **4.6** - K hedged calculation
- **4.7** - Single-name hedge calculation ($SNH_c$)
- **4.8** - Index hedge calculation ($IH$)
- **4.9** - Hedge mismatch adjustment ($HMAC$)
- **4.10** - Supervisory correlation table

---

## Version Control

| Version | Date | Changes |
| --------- | ------ | --------- |
| 1.0 | January 2026 | Initial compilation from PRA Rulebook Annex K |
