import { calculateBACVA } from './bacva_engine';
import type { Counterparty, NettingSet, SingleNameHedge, IndexHedge } from '../types/bacva';

const mockCounterparties: Counterparty[] = [
    { id: 'CP001', name: 'Alpha Bank Ltd', sector: 'FIN', creditQuality: 'IG' },
    { id: 'CP002', name: 'Northern Energy Corp', sector: 'IND', creditQuality: 'IG' },
    { id: 'CP003', name: 'Maple Pension Trust', sector: 'PEN', creditQuality: 'IG' },
    { id: 'CP004', name: 'GlobalTech Solutions', sector: 'TEC', creditQuality: 'HY' },
    { id: 'CP005', name: 'Riverside Finance Ltd', sector: 'FIN', creditQuality: 'IG' },
];

const mockNettingSets: NettingSet[] = [
    { id: 'NS001', counterpartyId: 'CP001', name: 'Alpha Bank - IRS', exposureMethod: 'IMM', ead: 1500, maturity: 4.85 },
    { id: 'NS002', counterpartyId: 'CP002', name: 'Northern Energy', exposureMethod: 'SA-CCR', ead: 450, maturity: 1.61 },
    { id: 'NS003', counterpartyId: 'CP003', name: 'Maple Pension', exposureMethod: 'IMM', ead: 800, maturity: 18.50 },
    { id: 'NS004', counterpartyId: 'CP004', name: 'GlobalTech', exposureMethod: 'SA-CCR', ead: 250, maturity: 1.00 },
    { id: 'NS005', counterpartyId: 'CP005', name: 'Riverside - Repo', exposureMethod: 'SFT', ead: 2000, maturity: 0.10 },
];

const mockSNHedges: SingleNameHedge[] = [
    { id: 'SN001', hedgedCounterpartyId: 'CP001', referenceEntity: 'Alpha Bank Ltd', type: 'direct', referenceSector: 'FIN', referenceCQ: 'IG', notional: 500, maturity: 3.0 },
    { id: 'SN002', hedgedCounterpartyId: 'CP001', referenceEntity: 'Alpha Asset Mgmt', type: 'legally_related', referenceSector: 'FIN', referenceCQ: 'IG', notional: 300, maturity: 2.5 },
    { id: 'SN003', hedgedCounterpartyId: 'CP002', referenceEntity: 'Atlantic Oil Co', type: 'sector_region', referenceSector: 'IND', referenceCQ: 'IG', notional: 200, maturity: 2.0 },
    { id: 'SN004', hedgedCounterpartyId: 'CP004', referenceEntity: 'GlobalTech Holdings', type: 'legally_related', referenceSector: 'TEC', referenceCQ: 'HY', notional: 150, maturity: 1.5 },
    { id: 'SN005', hedgedCounterpartyId: 'CP005', referenceEntity: 'Riverside Finance Ltd', type: 'direct', referenceSector: 'FIN', referenceCQ: 'IG', notional: 1000, maturity: 0.5 },
];

const mockIndexHedges: IndexHedge[] = [
    { id: 'IH001', name: 'EuroCredit IG Index', notional: 750, maturity: 5.0 },
    { id: 'IH002', name: 'NorthAm IG Index', notional: 500, maturity: 3.0 },
];

const result = calculateBACVA(mockCounterparties, mockNettingSets, mockSNHedges, mockIndexHedges);

console.log('--- BA-CVA Calculation Results ---');
console.log('K Reduced:', result.kReduced.toFixed(4));
console.log('IH Total:', result.ih.toFixed(4));
console.log('K Hedged:', result.kHedged.toFixed(4));
console.log('K Full:', result.kFull.toFixed(4));
console.log('Final Capital:', result.finalCapital.toFixed(4));
console.log('---------------------------------');
