import { COMPETENCIES, COMPETENCY_INFO, detectCompetencies, type Competency } from './competencies';
import { PEOPLE, type Person } from './nordlys';
import type { HiitPlan } from './schemas';

/* The 9 → 3 → 1 engine. People and rooms are chosen deterministically;
   the insights and plan come from Claude when available, else from templates. */

export const ROOMS: Array<{ id: 'A' | 'B' | 'C'; name: string; competencies: Competency[] }> = [
  { id: 'A', name: 'Direction', competencies: ['strategy', 'economy', 'legal'] },
  { id: 'B', name: 'Delivery', competencies: ['operations', 'supply-chain', 'customers'] },
  { id: 'C', name: 'Enablers', competencies: ['technology-data', 'communication', 'risk-security'] },
];

/** Best available expert per competency, nine distinct people. */
export function pickExperts(): Record<Competency, Person> {
  const taken = new Set<string>();
  const out = {} as Record<Competency, Person>;
  for (const c of COMPETENCIES) {
    const p = PEOPLE.filter((x) => x.availability.status !== 'busy' && !taken.has(x.id))
      .sort((a, b) => (b.skills[c] ?? 0) - (a.skills[c] ?? 0) || b.years - a.years)[0];
    out[c] = p;
    taken.add(p.id);
  }
  return out;
}

const INSIGHT: Record<Competency, (topic: string) => string> = {
  strategy: () => 'Agree what “done” looks like, and which two outcomes matter most to leadership.',
  economy: () => 'Build the business case early: one-off costs, running costs and where savings land.',
  legal: () => 'Map the rules that apply now and the ones coming, so the plan doesn’t need redoing.',
  operations: () => 'Pilot in one unit first, measure, then scale. Keep daily work running.',
  'supply-chain': () => 'Start with the few suppliers or flows that make up most of the impact.',
  customers: () => 'Ask a handful of real customers what they would notice, before deciding.',
  'technology-data': () => 'Agree the baseline and one dashboard everyone trusts, before changing anything.',
  communication: () => 'Tell people why, early and often. Name one owner for questions.',
  'risk-security': () => 'List the three things most likely to go wrong and who acts if they do.',
};

const KPI: Record<Competency, string> = {
  strategy: 'Decision memo approved',
  economy: 'Business case signed off',
  legal: 'Compliance check passed',
  operations: 'Pilot running in one unit',
  'supply-chain': 'Top suppliers engaged',
  customers: 'Customer test completed',
  'technology-data': 'Baseline dashboard live',
  communication: 'All affected teams briefed',
  'risk-security': 'Risk register owned',
};

export function localHiit(question: string): HiitPlan {
  const topic = question.replace(/[?.!]+$/, '').replace(/^how (do|can|should) (we|i) /i, '').trim();
  // Lowercase only the first letter, so acronyms like CO2 survive
  const lead = topic.charAt(0).toLowerCase() + topic.slice(1);
  const scores = detectCompetencies(question);
  const ranked = [...COMPETENCIES].sort((a, b) => scores[b] - scores[a]);
  const weeks = [2, 4, 6, 8, 12];
  return {
    summary: `Agree a credible plan to ${lead}.`,
    perspectives: COMPETENCIES.map((c) => ({ competency: c, insight: INSIGHT[c](lead) })),
    plan: ['technology-data', ranked[0], ranked[1], 'communication', 'risk-security']
      .filter((c, i, a) => a.indexOf(c) === i)
      .slice(0, 5)
      .map((c, i) => ({
        priority: i + 1,
        action: i === 0 && c === 'technology-data' ? 'Set the baseline and agree how progress is measured' : INSIGHT[c as Competency](lead).split(/[.:]/)[0],
        competency: c as Competency,
        weeks: weeks[i],
        kpi: KPI[c as Competency],
      })),
  };
}

export const competencyName = (c: Competency) => COMPETENCY_INFO[c].name;
