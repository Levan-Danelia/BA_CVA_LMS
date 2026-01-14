# BA-CVA Skill File: Basic Approach for Credit Valuation Adjustment

## Regulatory Framework

**Regulation:** PRA Near-Final Rules (PS9/24 and PS17/23)  
**Rulebook Part:** Credit Valuation Adjustment Risk Part  
**Implementation Date:** 1 January 2026  
**Jurisdiction:** United Kingdom (PRA)

---

## 1. Scope and Application

### 1.1 Covered Transactions

The BA-CVA applies to all **covered transactions**, which include:

1. **Derivative Transactions**: All OTC derivatives NOT cleared through a qualifying central counterparty (QCCP)
2. **Securities Financing Transactions (SFTs)**: Only if fair-valued AND CVA risk is material

### 1.2 Exclusions

```json
{
    "exclusions": {
        "qccp_cleared": "Derivatives transacted directly with or through a QCCP",
        "client_clearing": "Where firm acts as clearing member intermediary",
        "intragroup": "Transactions meeting Article 382(4) conditions",
        "nfc_minus": "Non-financial counterparties below clearing threshold"
    }
}
```

### 1.3 Approach Hierarchy

| Approach   | Description            | Eligibility                                          |
|------------|------------------------|------------------------------------------------------|
| **SA-CVA** | Standardised Approach  | Requires PRA permission                              |
| **BA-CVA** | Basic Approach         | Default for all firms without SA-CVA permission      |
| **AA-CVA** | Alternative Approach   | Aggregate notional < £88 billion                     |

---

## 2. Supervisory Parameters

### 2.1 Global Constants

```json
{
    "supervisory_parameters": {
        "DS_BA_CVA": {
            "value": 0.65,
            "description": "Discount Scalar applied to final capital requirement",
            "purpose": "Calibration to prevent punitive capital spikes"
        },
        "rho": {
            "value": 0.50,
            "description": "Supervisory correlation parameter",
            "purpose": "Splits risk into systematic and idiosyncratic components"
        },
        "beta": {
            "value": 0.25,
            "description": "Hedge recognition floor",
            "purpose": "Ensures minimum 25% of K_reduced retained regardless of hedging"
        },
        "alpha": {
            "value": 1.4,
            "description": "CCR alpha factor (removed in SCVA calculation)",
            "pension_fund_value": 1.0,
            "purpose": "Neutralises CCR conservatism in CVA context"
        },
        "supervisory_discount_rate": {
            "value": 0.05,
            "description": "5% flat rate used in discount factor formula"
        },
        "index_hedge_scalar": {
            "value": 0.70,
            "description": "Multiplier applied to index hedge risk weights"
        }
    }
}
```

### 2.2 Risk Weights by Sector (Table 1)

```json
{
    "risk_weights": {
        "sovereigns_central_banks_mdbs": {
            "sector_code": "SOV",
            "description": "Sovereigns including central banks and multilateral development banks",
            "investment_grade": 0.005,
            "high_yield_unrated": 0.020
        },
        "local_government_pse": {
            "sector_code": "GOV",
            "description": "Local government, government-backed non-financials, education and public administration",
            "investment_grade": 0.010,
            "high_yield_unrated": 0.040
        },
        "financials": {
            "sector_code": "FIN",
            "description": "Financials including government-backed financials, excluding pension funds",
            "investment_grade": 0.050,
            "high_yield_unrated": 0.120
        },
        "pension_funds": {
            "sector_code": "PEN",
            "description": "Pension funds",
            "investment_grade": 0.035,
            "high_yield_unrated": 0.085
        },
        "basic_materials_energy_industrials": {
            "sector_code": "IND",
            "description": "Basic materials, energy, industrials, agriculture, manufacturing, mining and quarrying",
            "investment_grade": 0.030,
            "high_yield_unrated": 0.070
        },
        "consumer_transport_services": {
            "sector_code": "CON",
            "description": "Consumer goods and services, transportation and storage, administrative and support service activities",
            "investment_grade": 0.030,
            "high_yield_unrated": 0.085
        },
        "technology_telecommunications": {
            "sector_code": "TEC",
            "description": "Technology, telecommunications",
            "investment_grade": 0.020,
            "high_yield_unrated": 0.055
        },
        "healthcare_utilities_professional": {
            "sector_code": "HLT",
            "description": "Health care, utilities, professional and technical activities",
            "investment_grade": 0.015,
            "high_yield_unrated": 0.050
        },
        "other": {
            "sector_code": "OTH",
            "description": "Other sector",
            "investment_grade": 0.050,
            "high_yield_unrated": 0.120
        }
    }
}
```

### 2.3 Single-Name Hedge Correlations (Table 2)

```json
{
    "hedge_correlations": {
        "direct_reference": {
            "r_hc": 1.00,
            "description": "Hedge references counterparty c directly",
            "hmac_factor": 0.00
        },
        "legally_related": {
            "r_hc": 0.80,
            "description": "Hedge references entity legally related to counterparty c (parent/subsidiary)",
            "hmac_factor": 0.36
        },
        "same_sector_region": {
            "r_hc": 0.50,
            "description": "Hedge references entity sharing sector and region with counterparty c",
            "hmac_factor": 0.75
        }
    }
}
```

---

## 3. Core Formulas

### 3.1 Standalone CVA (SCVA_c)

The fundamental building block for each counterparty:

$$SCVA_c = \frac{1}{\alpha} \cdot RW_c \cdot \sum_{NS \in c} \left( M_{NS} \cdot EAD_{NS} \cdot DF_{NS} \right)$$

**Where:**

- $\alpha = 1.4$ (or 1.0 for pension funds)
- $RW_c$ = Risk weight from Table 1 based on sector and credit quality
- $M_{NS}$ = Effective maturity of netting set
- $EAD_{NS}$ = Exposure at Default from SA-CCR or IMM
- $DF_{NS}$ = Supervisory discount factor

### 3.2 Discount Factor (DF)

**For IMM firms:**
$$DF_{NS} = 1.0$$

**For non-IMM firms (SA-CCR):**
$$DF_{NS} = \frac{1 - e^{-0.05 \cdot M_{NS}}}{0.05 \cdot M_{NS}}$$

```json
{
    "discount_factor_rules": {
        "imm_firms": {
            "df_value": 1.0,
            "condition": "Firm has PRA Article 283 permission for IMM"
        },
        "non_imm_firms": {
            "formula": "(1 - exp(-0.05 * M_NS)) / (0.05 * M_NS)",
            "supervisory_rate": 0.05
        }
    }
}
```

### 3.3 Effective Maturity (M_NS)

**M_NS is an INPUT to BA-CVA, derived from other regulatory frameworks:**

```json
{
    "maturity_inputs": {
        "imm_firms": {
            "source": "IMM model output per CRR Article 162(2)(g)",
            "description": "M_NS from internal model based on expected exposure profiles"
        },
        "non_imm_firms": {
            "source": "Notional-weighted average per CRR Article 162(2)(b)",
            "formula": "M_NS = Σ(Notional_i × M_i) / Σ(Notional_i)",
            "floor": "1-year floor for uncollateralised trades",
            "cap": "Longest contractual remaining maturity (no 5-year cap in BA-CVA)"
        }
    },
    "key_point": "BA-CVA takes M_NS as given input - maturity determination follows IRB rules"
}
```

---

## 4. Reduced BA-CVA (Unhedged)

### 4.1 Formula

$$K_{reduced} = \sqrt{\left( \rho \cdot \sum_{c} SCVA_c \right)^2 + (1 - \rho^2) \cdot \sum_{c} SCVA_c^2}$$

**Final Capital Requirement:**
$$CVA\_Capital_{reduced} = DS_{BA-CVA} \cdot K_{reduced} = 0.65 \cdot K_{reduced}$$

### 4.2 Risk Decomposition

| Component          | Formula                                           | Interpretation                                           |
|--------------------|---------------------------------------------------|----------------------------------------------------------|
| **Systematic**     | $\left( \rho \cdot \sum_{c} SCVA_c \right)^2$     | Market-wide credit risk; assumes perfect correlation     |
| **Idiosyncratic**  | $(1 - \rho^2) \cdot \sum_{c} SCVA_c^2$            | Name-specific risk; benefits from diversification        |

```json
{
    "reduced_ba_cva": {
        "formula": "sqrt((rho * sum(SCVA_c))^2 + (1 - rho^2) * sum(SCVA_c^2))",
        "final_capital": "DS_BA_CVA * K_reduced",
        "components": {
            "systematic": {
                "formula": "(rho * sum(SCVA_c))^2",
                "correlation_assumption": "Perfect correlation between all counterparties",
                "weight": "rho^2 = 0.25"
            },
            "idiosyncratic": {
                "formula": "(1 - rho^2) * sum(SCVA_c^2)",
                "correlation_assumption": "Zero correlation between counterparties",
                "weight": "1 - rho^2 = 0.75"
            }
        }
    }
}
```

---

## 5. Full BA-CVA (With Hedges)

### 5.1 Master Formula

$$K_{full} = \beta \cdot K_{reduced} + (1 - \beta) \cdot K_{hedged}$$

Where $\beta = 0.25$, so:
$$K_{full} = 0.25 \cdot K_{reduced} + 0.75 \cdot K_{hedged}$$

**Final Capital Requirement:**
$$CVA\_Capital_{full} = DS_{BA-CVA} \cdot K_{full} = 0.65 \cdot K_{full}$$

### 5.2 Hedged Capital Component (K_hedged)

$$K_{hedged} = \sqrt{\left( \rho \cdot \sum_{c} (SCVA_c - SNH_c) - IH \right)^2 + (1 - \rho^2) \cdot \sum_{c} (SCVA_c - SNH_c)^2 + \sum_{c} HMAC_c}$$

### 5.3 Single-Name Hedge (SNH_c)

$$SNH_c = \sum_{h \in c} r_{hc} \cdot RW_h \cdot M_h^{SN} \cdot B_h^{SN} \cdot DF_h^{SN}$$

**Where:**

- $r_{hc}$ = Hedge correlation (100%, 80%, or 50%)
- $RW_h$ = Risk weight of hedge reference entity
- $M_h^{SN}$ = Remaining maturity of hedge
- $B_h^{SN}$ = Notional of hedge
- $DF_h^{SN}$ = Discount factor for hedge

### 5.4 Index Hedge (IH)

$$IH = \sum_{i} RW_i^{ind} \cdot M_i^{ind} \cdot B_i^{ind} \cdot DF_i^{ind}$$

**Where:**

- $RW_i^{ind}$ = Risk weight for index (calculated below)
- $M_i^{ind}$ = Remaining maturity of index hedge
- $B_i^{ind}$ = Notional of index hedge
- $DF_i^{ind}$ = Discount factor for index hedge

#### Index Hedges vs Single-Name Hedges

```json
{
    "index_hedge_purpose": {
        "target": "SYSTEMATIC CVA risk (market-wide credit spread movements)",
        "mechanism": "IH offsets only the systematic component in K_hedged formula",
        "portfolio_connection": "NONE - index composition is based on the actual index used, NOT the portfolio",
        "contrast_with_single_name": "Single-name hedges target SPECIFIC counterparty risk"
    },
    "key_insight": "Index hedges provide general market protection, not direct counterparty offset"
}
```

The 0.7 scalar reflects that index hedges are less effective than single-name hedges due to basis risk between the index and specific portfolio exposures.

**Index Risk Weight Calculation:**

For heterogeneous indices (multiple sectors), each constituent is mapped to a Table 1 sector:

```text
Step 1: Map each index constituent to a sector code
Step 2: Calculate weight of each sector (num_names_in_sector / total_names)
Step 3: Look up Table 1 RW for each sector
Step 4: Calculate weighted average: RW_pre_scalar = Σ (weight_i × RW_i)
Step 5: Apply index scalar: RW_ind = RW_pre_scalar × 0.7
```

**Example - EuroCredit IG Index (125 names):**

| Sector      | Names | Weight | RW (IG) | Weighted RW |
|-------------|-------|--------|---------|-------------|
| FIN         | 31    | 0.25   | 5.0%    | 0.0125      |
| IND         | 25    | 0.20   | 3.0%    | 0.0060      |
| CON         | 25    | 0.20   | 3.0%    | 0.0060      |
| TEC         | 13    | 0.10   | 2.0%    | 0.0020      |
| HLT         | 19    | 0.15   | 1.5%    | 0.0022      |
| OTH         | 12    | 0.10   | 5.0%    | 0.0050      |
| **Total**   | 125   | 1.00   |         | **0.0338**  |

RW_ind = 0.0338 × 0.7 = **0.0236 (2.36%)**

```json
{
    "index_hedge_risk_weight": {
        "homogeneous_index": {
            "condition": "All constituents same sector AND same credit quality",
            "formula": "Table_1_RW * 0.7"
        },
        "heterogeneous_index": {
            "condition": "Multiple sectors OR mixed credit quality",
            "formula": "Σ(weight_i × RW_i) * 0.7",
            "steps": [
                "Map each constituent to Table 1 sector",
                "Calculate name-weighted average RW",
                "Multiply by 0.7 scalar"
            ]
        }
    }
}
```

### 5.5 Hedge Mismatch Adjustment (HMAC)

$$HMAC_c = \sum_{h \in c} (1 - r_{hc}^2) \cdot \left( RW_h \cdot M_h^{SN} \cdot B_h^{SN} \cdot DF_h^{SN} \right)^2$$

```json
{
    "hmac_penalty": {
        "direct_hedge": {
            "r_hc": 1.00,
            "penalty_factor": 0.00,
            "interpretation": "No mismatch penalty for direct hedges"
        },
        "legally_related_hedge": {
            "r_hc": 0.80,
            "penalty_factor": 0.36,
            "interpretation": "36% of squared hedge value added as penalty"
        },
        "sector_region_hedge": {
            "r_hc": 0.50,
            "penalty_factor": 0.75,
            "interpretation": "75% of squared hedge value added as penalty"
        }
    }
}
```

---

## 6. Eligible Hedges

### 6.1 Single-Name Hedges

```json
{
    "eligible_single_name_hedges": {
        "instrument_types": [
            "Single-name CDS",
            "Single-name contingent CDS"
        ],
        "reference_entity_requirements": {
            "direct": "References counterparty c directly",
            "legally_related": "References parent/subsidiary of counterparty c",
            "sector_region": "References entity in same sector AND region as counterparty c"
        },
        "contingent_cds_notional": "Current market value of reference portfolio/instrument"
    }
}
```

### 6.2 Index Hedges

```json
{
    "eligible_index_hedges": {
        "instrument_type": "Index CDS (e.g., iTraxx, CDX)",
        "purpose": "Offset systematic component of CVA risk",
        "risk_weight_adjustment": 0.70,
        "note": "Index hedges do NOT reduce idiosyncratic component"
    }
}
```

---

## 7. Special Treatments

### 7.1 Pension Funds

```json
{
    "pension_fund_treatment": {
        "alpha_value": 1.0,
        "standard_alpha": 1.4,
        "capital_reduction": "~28% linear reduction due to alpha adjustment",
        "risk_weight": {
            "investment_grade": 0.035,
            "high_yield_unrated": 0.085
        },
        "transitional_provisions": "Legacy trades benefit from 2026-2029 phase-in"
    }
}
```

### 7.2 Central Banks (Unrated)

```json
{
    "unrated_central_bank_treatment": {
        "rule": "May be mapped to relevant sovereign risk weight",
        "purpose": "Prevents punitive treatment for central banks lacking external ratings",
        "typical_result": {
            "investment_grade_sovereign": 0.005,
            "high_yield_sovereign": 0.020
        }
    }
}
```

### 7.3 Securities Financing Transactions

```json
{
    "sft_treatment": {
        "inclusion_criteria": {
            "fair_valued": "Must be fair-valued under applicable accounting framework",
            "materiality": "CVA risk must be material"
        },
        "exposure_method": {
            "note": "SFTs use their own EAD calculation method (not SA-CCR or IMM)",
            "methods": ["Comprehensive Method", "Financial Collateral Simple Method", "VaR Method"]
        },
        "discount_factor": {
            "rule": "SFTs are NOT IMM, so use the formula: DF = (1 - exp(-0.05 × M)) / (0.05 × M)",
            "note": "IMM override (DF=1.0) does NOT apply to SFTs"
        },
        "maturity_floor": "No 1-year floor for margined/collateralised SFTs",
        "exclusion_note": "If CVA risk immaterial, exclude from SCVA calculation entirely"
    }
}
```

---

## 8. Calculation Workflow

### 8.1 Step-by-Step Process

```text
┌─────────────────────────────────────────────────────────────────────┐
│                    BA-CVA CALCULATION WORKFLOW                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  STEP 1: Data Collection (Per Netting Set)                          │
│  ─────────────────────────────────────────                          │
│  • Identify all covered transactions                                 │
│  • Group by counterparty and netting set                            │
│  • Obtain EAD_NS from SA-CCR or IMM                                 │
│  • Calculate M_NS (effective maturity)                              │
│                                                                      │
│  STEP 2: Counterparty Classification                                │
│  ───────────────────────────────────                                │
│  • Assign sector code (SOV, GOV, FIN, PEN, IND, CON, TEC, HLT, OTH)│
│  • Determine credit quality (IG or HY/NR)                           │
│  • Look up RW_c from Table 1                                        │
│                                                                      │
│  STEP 3: Calculate DF_NS                                            │
│  ──────────────────────                                             │
│  • IMM firms: DF = 1.0                                              │
│  • Others: DF = (1 - exp(-0.05 * M)) / (0.05 * M)                  │
│                                                                      │
│  STEP 4: Calculate SCVA_c (Per Counterparty)                        │
│  ────────────────────────────────────────                           │
│  • Sum across all netting sets: Σ(M_NS × EAD_NS × DF_NS)           │
│  • Apply risk weight and alpha: SCVA_c = (1/α) × RW_c × Σ(...)     │
│                                                                      │
│  STEP 5: Aggregate to K_reduced                                     │
│  ──────────────────────────────                                     │
│  • Systematic = (ρ × Σ SCVA_c)²                                     │
│  • Idiosyncratic = (1 - ρ²) × Σ SCVA_c²                            │
│  • K_reduced = √(Systematic + Idiosyncratic)                        │
│                                                                      │
│  STEP 6 (If Hedged): Calculate Hedge Components                     │
│  ───────────────────────────────────────────────                    │
│  • SNH_c for each counterparty with single-name hedges              │
│  • IH for index hedges                                              │
│  • HMAC_c for mismatch penalties                                    │
│                                                                      │
│  STEP 7 (If Hedged): Calculate K_hedged                             │
│  ───────────────────────────────────────                            │
│  • Net systematic = (ρ × Σ(SCVA_c - SNH_c) - IH)²                  │
│  • Net idiosyncratic = (1 - ρ²) × Σ(SCVA_c - SNH_c)²              │
│  • K_hedged = √(Net_Sys + Net_Idio + Σ HMAC_c)                     │
│                                                                      │
│  STEP 8: Final Capital                                              │
│  ─────────────────────                                              │
│  • Reduced: Capital = 0.65 × K_reduced                              │
│  • Full: Capital = 0.65 × (0.25 × K_reduced + 0.75 × K_hedged)     │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 8.2 Decision Tree

```text
                    ┌──────────────────────┐
                    │  Firm has SA-CVA     │
                    │    permission?       │
                    └──────────┬───────────┘
                               │
              ┌────────────────┴────────────────┐
              │ YES                             │ NO
              ▼                                 ▼
     ┌────────────────┐              ┌──────────────────────┐
     │  Use SA-CVA    │              │ Aggregate notional   │
     │  (Chapter 5)   │              │    < £88bn?          │
     └────────────────┘              └──────────┬───────────┘
                                                │
                              ┌─────────────────┴─────────────────┐
                              │ YES                               │ NO
                              ▼                                   ▼
                    ┌──────────────────┐              ┌──────────────────┐
                    │ May use AA-CVA   │              │ Must use BA-CVA  │
                    │ (CVA = 100% CCR) │              │   (Chapter 4)    │
                    └──────────────────┘              └────────┬─────────┘
                                                               │
                                              ┌────────────────┴────────────────┐
                                              │ Eligible hedges?                │
                                              └────────────────┬────────────────┘
                                                               │
                                      ┌────────────────────────┴────────────────────────┐
                                      │ NO                                              │ YES
                                      ▼                                                 ▼
                            ┌──────────────────┐                              ┌──────────────────┐
                            │ Reduced BA-CVA   │                              │  Full BA-CVA     │
                            │ 0.65 × K_reduced │                              │ 0.65 × K_full    │
                            └──────────────────┘                              └──────────────────┘
```

---

## 9. Reporting Requirements

### 9.1 Disclosure Template (UKB CVA1)

```json
{
    "disclosure_requirements": {
        "template": "UKB CVA1",
        "mandatory_breakdowns": {
            "systematic_component": "Must disclose separately",
            "idiosyncratic_component": "Must disclose separately",
            "by_sector": "SCVA aggregated by Table 1 sector buckets"
        },
        "reporting_template": "CAP 26.02"
    }
}
```

---

## 10. Transitional Provisions

```json
{
    "transitional_provisions": {
        "scope": "Legacy trades entered before 1 January 2026",
        "eligible_counterparties": [
            "Pension funds (previously exempt)",
            "Non-financial counterparties (previously exempt)"
        ],
        "phase_in_period": {
            "start": "2026",
            "end": "2029"
        },
        "mechanism": "Transitional discount/continued exemption for defined period"
    }
}
```

---

## 11. Python Implementation Reference

### 11.1 Parameter Dictionary

```python
BA_CVA_PARAMS = {
    # Global Scalars
    "DS_BA_CVA": 0.65,
    "rho": 0.50,
    "beta": 0.25,
    "alpha_standard": 1.4,
    "alpha_pension_fund": 1.0,
    "supervisory_rate": 0.05,
    "index_hedge_scalar": 0.70,
    
    # Risk Weights (Investment Grade, High Yield/Unrated)
    "risk_weights": {
        "SOV": (0.005, 0.020),  # Sovereigns, Central Banks, MDBs
        "GOV": (0.010, 0.040),  # Local Government, PSEs
        "FIN": (0.050, 0.120),  # Financials (excl. pension funds)
        "PEN": (0.035, 0.085),  # Pension Funds
        "IND": (0.030, 0.070),  # Basic Materials, Energy, Industrials
        "CON": (0.030, 0.085),  # Consumer, Transport, Services
        "TEC": (0.020, 0.055),  # Technology, Telecommunications
        "HLT": (0.015, 0.050),  # Healthcare, Utilities, Professional
        "OTH": (0.050, 0.120),  # Other
    },
    
    # Hedge Correlations
    "hedge_correlations": {
        "direct": 1.00,
        "legally_related": 0.80,
        "sector_region": 0.50,
    },
}
```

### 11.2 Key Functions (Signatures)

```python
def calculate_discount_factor(maturity: float, is_imm: bool = False) -> float:
    """Calculate supervisory discount factor DF_NS."""
    pass

def calculate_scva(
    ead_ns: float,
    maturity_ns: float,
    risk_weight: float,
    alpha: float = 1.4,
    is_imm: bool = False
) -> float:
    """Calculate standalone CVA for a single netting set."""
    pass

def calculate_k_reduced(scva_values: list[float], rho: float = 0.50) -> float:
    """Calculate K_reduced from list of SCVA values."""
    pass

def calculate_snh(
    r_hc: float,
    rw_h: float,
    maturity_h: float,
    notional_h: float
) -> float:
    """Calculate single-name hedge benefit."""
    pass

def calculate_index_hedge(
    rw_ind: float,
    maturity_ind: float,
    notional_ind: float
) -> float:
    """Calculate index hedge benefit."""
    pass

def calculate_hmac(
    r_hc: float,
    rw_h: float,
    maturity_h: float,
    notional_h: float
) -> float:
    """Calculate hedge mismatch adjustment."""
    pass

def calculate_k_hedged(
    scva_values: list[float],
    snh_values: list[float],
    ih_total: float,
    hmac_values: list[float],
    rho: float = 0.50
) -> float:
    """Calculate K_hedged with all hedge components."""
    pass

def calculate_ba_cva_capital(
    k_reduced: float,
    k_hedged: float = None,
    beta: float = 0.25,
    ds_ba_cva: float = 0.65
) -> float:
    """Calculate final BA-CVA capital requirement."""
    pass
```

---

## 12. Key Regulatory References

| Document      | Description                                              |
|---------------|----------------------------------------------------------|
| **PS9/24**    | Implementation of Basel 3.1 standards near-final part 2  |
| **PS17/23**   | Implementation of Basel 3.1 standards near-final part 1  |
| **Annex K**   | Credit Valuation Adjustment Risk Part (PRA Rulebook)     |
| **CAP 26.02** | CVA Risk Reporting Template                              |
| **UKB CVA1**  | CVA Disclosure Template                                  |
| **MAR50**     | Basel Framework CVA Chapter                              |

---

---

## 13. Context Sources and Materials

This skill file has been built from comprehensive reference materials:

### Regulatory Sources

- **PRA PS9/24 and PS17/23**: Near-final rules for BA-CVA implementation
- **Credit Valuation Adjustment Risk Part**: PRA Rulebook Annex K
- **Basel MAR50**: International framework for CVA risk

### Research Materials

- 20 detailed research documents covering:
  - BA-CVA design choices (EAD vs. Hedge Notional)
  - Index hedge risk weight methodologies
  - Effective maturity calculations
  - Counterparty classification frameworks
  - Hedge eligibility criteria
  - Python implementation patterns

### Blog Series (9-Part Technical Walkthrough)

1. **Introduction**: Regulatory scope, timeline, and 0.65 Discount Scalar
2. **Standalone CVA (SCVA)**: Risk weights, effective maturity, discount factors, alpha parameter
3. **K Reduced**: Unhedged portfolio aggregation with systematic (ρ=0.5) and idiosyncratic components
4. **Single Name Hedges (SNH)**: Supervisory correlations (100%, 80%, 50%) and direct hedge recognition
5. **Hedge Mismatch Adjustment (HMA)**: Basis risk penalties for imperfect hedge correlations
6. **Index Hedges (IH)**: Systematic risk offset with 0.7 multiplier and sectoral mapping
7. **K Hedged**: Net risk view integrating SNH, IH, and HMA in square-root formula
8. **K Full**: Beta floor (0.25) balancing K_reduced and K_hedged
9. **K Final**: Final 0.65 Discount Scalar application and reporting requirements

### Implementation Resources

- **BA_CVA_PARAMS.json**: Complete supervisory parameter dictionary
- **BA_CVA_Detailed.ipynb**: Jupyter notebook with step-by-step calculations and worked examples
- **Quarto Book Style Guide**: Professional formatting and presentation standards
- **SFT_Book.qmd**: Reference template for 4-section book design (Focus, Design, Practice, Source)

### Writing Style and Standards

- **Font**: Lato for body, Avenir Next for headings
- **Tone**: Technical but accessible, implementation-focused
- **Format**: Formula boxes with MathJax, HTML tables with custom styling
- **Approach**: Regulatory precision with practical application examples
- **Structure**: Clear component breakdowns, calculation walkthroughs, color-coded risk decomposition

---

## 14. Version History

| Version | Date         | Changes                                                                                                                                                                                                                      |
|---------|--------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1.0     | January 2026 | Initial skill file based on PRA PS9/24 and PS17/23                                                                                                                                                                           |
| 1.1     | January 2026 | Comprehensive context update: Added 20 research documents, 8 blog posts, implementation notebook, and book style guide. Full BA-CVA calculation framework established with all supervisory parameters, formulas, and Python. |
