export type SectorCode = 'SOV' | 'GOV' | 'FIN' | 'PEN' | 'IND' | 'CON' | 'TEC' | 'HLT' | 'OTH';
export type CreditQuality = 'IG' | 'HY';
export type ExposureMethod = 'IMM' | 'SA-CCR' | 'SFT';
export type HedgeType = 'direct' | 'legally_related' | 'sector_region';

export interface Counterparty {
    id: string;
    name: string;
    sector: SectorCode;
    creditQuality: CreditQuality;
}

export interface NettingSet {
    id: string;
    counterpartyId: string;
    name: string;
    exposureMethod: ExposureMethod;
    ead: number; // Nominal exposure value
    maturity: number; // Years (M_NS)
}

export interface SingleNameHedge {
    id: string;
    hedgedCounterpartyId: string;
    referenceEntity: string;
    type: HedgeType;
    referenceSector: SectorCode;
    referenceCQ: CreditQuality;
    notional: number; // B_sn
    maturity: number; // M_sn
}

export interface IndexHedge {
    id: string;
    name: string;
    notional: number; // B_ind
    maturity: number; // M_ind
}

export interface BA_CVA_Result {
    scva: Record<string, number>; // Map of counterpartyId to SCVA_c
    kReduced: number;
    snh: Record<string, number>; // Map of counterpartyId to SNH_c
    hma: Record<string, number>; // Map of counterpartyId to HMA_c
    ih: number;
    kHedged: number;
    kFull: number;
    finalCapital: number;
}
