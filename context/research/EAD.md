Based on the sources provided and our conversation history,
**\$EAD\_{NS}\$ (Exposure at Default)** is determined at the **netting
set level** 1. It represents the exposure value for all transactions
within a specific netting set that are subject to CVA capital
requirements.

### 1. Transaction Scope

The \$EAD\$ is derived from the following transaction types:

-   **OTC Derivatives:** It includes derivatives not cleared through a
    > qualifying central counterparty (QCCP).

-   **Securities Financing Transactions (SFTs):** These only contribute
    > to the \$EAD\$ if they are **fair-valued** for accounting purposes
    > and their CVA risk is deemed **material** 1.

### 2. Calculation Methodology by Firm Type

According to our conversation history, the methodology for calculating
the \$EAD\$ value depends on the firm's regulatory permissions:

-   **Non-IMM Firms:** These firms typically derive \$EAD\$ using the
    > **Standardised Approach for Counterparty Credit Risk (SA-CCR)**.
    > (Note: This specific detail is from our conversation history and
    > is not explicitly in the provided excerpts).

-   **IMM Firms:** Firms with permission to use the **Internal Models
    > Method (IMM)** derive the \$EAD\$ from their internal models for
    > counterparty credit risk 2.

### 3. Application in the BA-CVA Framework

The \$EAD\_{NS}\$ serves as the base exposure amount which is then
adjusted by the following factors at the netting set level:

-   **Effective Maturity (\$M\_{NS}\$):** The exposure is multiplied by
    > the maturity of the netting set 1.

-   **Supervisory Discount Factor (\$DF\_{NS}\$):** The exposure is
    > further adjusted to reflect the time value of money.

The final \$EAD\_{NS}\$ for each netting set is a component of the
summation in the **standalone CVA (\$SCVA_c\$)** formula, where it is
scaled by the counterparty\'s specific risk weight (\$RW_c\$) 1.
