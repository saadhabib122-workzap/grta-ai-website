/* The 9 HIIT competencies, with the plain-language signals that point to each.
   Shared by the brief parser, the translator, team matching and the HIIT simulator. */

export const COMPETENCIES = [
  'strategy',
  'economy',
  'legal',
  'operations',
  'supply-chain',
  'customers',
  'technology-data',
  'communication',
  'risk-security',
] as const;

export type Competency = (typeof COMPETENCIES)[number];

export const COMPETENCY_INFO: Record<Competency, { name: string; icon: string; keywords: string[]; roles: string[] }> = {
  strategy: {
    name: 'Strategy',
    icon: 'strategy',
    keywords: ['strategy', 'strategic', 'vision', 'roadmap', 'priorit', 'goal', 'target', 'transform', 'growth', 'expand', 'market entry', 'board', 'direction', 'pivot'],
    roles: ['Strategy lead'],
  },
  economy: {
    name: 'Economy & finance',
    icon: 'economy',
    keywords: ['cost', 'budget', 'finance', 'financial', 'price', 'pricing', 'revenue', 'profit', 'roi', 'invest', 'numbers', 'margin', 'funding', 'spend', 'cheap'],
    roles: ['Financial controller'],
  },
  legal: {
    name: 'Legal & compliance',
    icon: 'legal',
    keywords: ['legal', 'law', 'contract', 'compliance', 'regulat', 'gdpr', 'policy', 'licen', 'tender', 'audit', 'directive', 'csrd'],
    roles: ['Legal counsel'],
  },
  operations: {
    name: 'Operations',
    icon: 'operations',
    keywords: ['operation', 'process', 'lean', 'efficien', 'workflow', 'production', 'rollout', 'implement', 'migrat', 'deliver', 'capacity', 'service', 'stress'],
    roles: ['Operations manager'],
  },
  'supply-chain': {
    name: 'Supply chain',
    icon: 'supply-chain',
    keywords: ['supply', 'supplier', 'procure', 'purchas', 'logistic', 'warehouse', 'transport', 'shipping', 'inventory', 'sourcing', 'vendor', 'co2', 'emission'],
    roles: ['Procurement specialist', 'Logistics planner'],
  },
  customers: {
    name: 'Customers & market',
    icon: 'customers',
    keywords: ['customer', 'client', 'market', 'marketing', 'user', 'launch', 'sales', 'brand awareness', 'segment', 'app', 'consumer', 'patient', 'student'],
    roles: ['Market analyst', 'Customer insight lead'],
  },
  'technology-data': {
    name: 'Technology & data',
    icon: 'technology-data',
    keywords: ['data', 'system', 'software', 'it ', 'crm', 'erp', 'ai ', 'digital', 'platform', 'app', 'developer', 'cloud', 'analytics', 'model', 'dashboard', 'integration', 'tech'],
    roles: ['Data analyst', 'Solution architect'],
  },
  communication: {
    name: 'Communication & brand',
    icon: 'communication',
    keywords: ['communicat', 'change management', 'adoption', 'training', 'brand', 'message', 'stakeholder', 'internal', 'employees', 'engage', 'storytelling', 'pr '],
    roles: ['Change & communication lead'],
  },
  'risk-security': {
    name: 'Risk & security',
    icon: 'risk-security',
    keywords: ['risk', 'security', 'secure', 'safety', 'cyber', 'privacy', 'resilien', 'continuity', 'fraud', 'threat', 'compliance risk'],
    roles: ['Risk & security advisor'],
  },
};

/** Score how strongly a text points at each competency (0..n keyword hits). */
export function detectCompetencies(text: string): Record<Competency, number> {
  const t = ` ${text.toLowerCase()} `;
  const out = {} as Record<Competency, number>;
  for (const c of COMPETENCIES) {
    out[c] = COMPETENCY_INFO[c].keywords.reduce((n, k) => n + (t.includes(k) ? 1 : 0), 0);
  }
  return out;
}
