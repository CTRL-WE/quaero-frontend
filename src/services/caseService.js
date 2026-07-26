// import apiClient from '../api/apiClient';

const MOCK_DELAY = 400;

const mockCases = [
  {
    id: 'case-001',
    claim: 'Exposed fraudulent billing practices at a regional hospital chain',
    evidenceTeaser:
      'Internal memos reveal a pattern of upcoding Medicare claims between 2022–2024, totalling an estimated $4.3 million in overbilled services.',
    completed: true,
  },
  {
    id: 'case-002',
    claim: 'City council members received undisclosed campaign donations from a land developer',
    evidenceTeaser:
      'Financial disclosures cross-referenced with LLC filings show three council members received payments routed through shell companies tied to Greenfield Realty.',
    completed: false,
  },
  {
    id: 'case-003',
    claim: 'Pesticide runoff from local farms exceeded EPA safety thresholds',
    evidenceTeaser:
      'Water-quality reports from downstream monitoring stations recorded atrazine levels at 4.2 ppb — well above the 3.0 ppb maximum contaminant level.',
    completed: true,
  },
  {
    id: 'case-004',
    claim: 'A ride-sharing company systematically under-reported driver accident rates',
    evidenceTeaser:
      'Leaked internal dashboards show 37 % more incidents than the figures submitted in the company\'s 2025 annual safety report.',
    completed: false,
  },
];

const mockBriefs = {
  'case-001': {
    id: 'case-001',
    claim: 'Exposed fraudulent billing practices at a regional hospital chain',
    publicEvidence:
      'A twelve-month investigation uncovered systematic upcoding of Medicare claims across four facilities operated by Lakewood Health Partners. Internal communications obtained through whistleblower disclosures show that billing supervisors were instructed to reclassify routine outpatient visits as complex evaluations, inflating reimbursement rates by an average of 62 %. Cross-referencing CMS billing data with patient medical records confirmed that at least 8,400 claims filed between January 2022 and March 2024 carried diagnosis codes unsupported by clinical documentation. The estimated financial impact exceeds $4.3 million in fraudulent reimbursements. Two compliance officers who raised concerns internally were reassigned within weeks, and the hospital\'s external audit firm failed to flag the discrepancies in consecutive annual reviews.',
  },
  'case-002': {
    id: 'case-002',
    claim: 'City council members received undisclosed campaign donations from a land developer',
    publicEvidence:
      'Campaign finance records filed with the county clerk were cross-referenced against corporate registry filings and real-estate transaction logs. The analysis revealed that Greenfield Realty LLC funnelled a combined $112,000 to three sitting council members through a network of four intermediary LLCs incorporated in Delaware. None of these contributions appeared on the candidates\' publicly filed disclosure forms. The donations coincided with two critical zoning-variance votes that converted 240 acres of protected wetland into commercially developable parcels. Subsequent FOIA requests surfaced emails between a Greenfield executive and a council aide discussing the timing of the contributions relative to the vote schedule.',
  },
  'case-003': {
    id: 'case-003',
    claim: 'Pesticide runoff from local farms exceeded EPA safety thresholds',
    publicEvidence:
      'Water-quality data collected over an eighteen-month period from six monitoring stations downstream of the Cedar Valley agricultural district showed persistent atrazine concentrations averaging 4.2 parts per billion — 40 % above the EPA maximum contaminant level of 3.0 ppb. Soil-core samples taken at field boundaries confirmed the presence of residual chlorpyrifos at depths consistent with subsurface leaching into the local aquifer. State inspection reports obtained via public-records requests indicate that two of the five largest farms in the district had not submitted pesticide-application logs for the 2023 growing season, despite regulatory requirements. Satellite imagery analysis corroborated aerial spraying events that coincided with rainfall periods, suggesting inadequate buffer-zone compliance.',
  },
  'case-004': {
    id: 'case-004',
    claim: 'A ride-sharing company systematically under-reported driver accident rates',
    publicEvidence:
      'Leaked internal analytics dashboards from UrbanRide\'s safety division document 14,200 driver-involved collisions during the first three quarters of 2025, compared with the 10,350 incidents disclosed in the company\'s publicly filed annual safety report — a discrepancy of roughly 37 %. The internal system categorised 2,800 of the omitted incidents as "minor contact events" and excluded them from the reportable total, despite several resulting in passenger injuries documented in insurance claims. An engineering post-mortem memo noted that the classification algorithm was intentionally tuned to reclassify low-speed impacts below 8 mph as non-reportable. Former safety-team employees corroborated that leadership directed the threshold change shortly before the company\'s Series F fundraising round.',
  },
};

// TODO: replace with real apiClient call once Case endpoint is live
// export async function getFeed() {
//   const { data } = await apiClient.get('/cases');
//   return data;
// }
export function getFeed() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockCases), MOCK_DELAY);
  });
}

// TODO: replace with real apiClient call once Case endpoint is live
// export async function getBrief(caseId) {
//   const { data } = await apiClient.get(`/cases/${caseId}/brief`);
//   return data;
// }
export function getBrief(caseId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const brief = mockBriefs[caseId];
      if (brief) {
        resolve(brief);
      } else {
        reject(new Error(`Case not found: ${caseId}`));
      }
    }, MOCK_DELAY);
  });
}
