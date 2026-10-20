import { COMPETENCIES, COMPETENCY_INFO, type Competency } from './competencies';
import { PEOPLE, type Person } from './nordlys';

/* Deterministic team matching over Nordlys Group.
   The AI only ever explains results; it never picks people. */

export type Variant = 'execution' | 'challenger' | 'innovation';
export type TeamBrief = { id: string; title: string; needs: Competency[]; domain: string[]; traits: string[] };

export const PRESET_BRIEFS: TeamBrief[] = [
  {
    id: 'co2',
    title: 'Cut supply-chain CO2 by 30% before 2028',
    needs: ['supply-chain', 'technology-data', 'economy', 'legal', 'strategy', 'communication'],
    domain: ['Procurement', 'Logistics', 'Strategy office'],
    traits: ['data', 'forecast', 'emissions'],
  },
  {
    id: 'crm',
    title: 'Move customer service to a new CRM by spring',
    needs: ['technology-data', 'customers', 'operations', 'communication', 'risk-security'],
    domain: ['IT', 'Customer service'],
    traits: ['migration', 'training', 'crm', 'adoption'],
  },
  {
    id: 'launch',
    title: 'Launch the new app in Germany in eight weeks',
    needs: ['customers', 'technology-data', 'legal', 'communication', 'operations', 'risk-security'],
    domain: ['Digital', 'Marketing'],
    traits: ['launch', 'stress-test', 'germany', 'regulation'],
  },
];

export type Member = { person: Person; covers: Competency[]; fit: number; reason: string };
export type TeamResult = {
  variant: Variant;
  members: Member[];
  coverage: Record<Competency, 0 | 1 | 2>;
  score: number; // 0..1 share of needs covered (strong = 1, adequate = .6)
  spread: number; // distinct departments / members
};

const level = (p: Person, c: Competency) => p.skills[c] ?? 0;
const availableWeight = (p: Person) => (p.availability.status === 'available' ? 1 : p.availability.status === 'partial' ? 0.75 : 0);

function coverageOf(members: Person[], needs: Competency[]) {
  const cov = Object.fromEntries(COMPETENCIES.map((c) => [c, 0])) as Record<Competency, 0 | 1 | 2>;
  for (const c of needs) cov[c] = Math.max(0, ...members.map((m) => level(m, c))) as 0 | 1 | 2;
  return cov;
}

function scoreCoverage(cov: Record<Competency, number>, needs: Competency[]) {
  return needs.reduce((s, c) => s + (cov[c] === 2 ? 1 : cov[c] === 1 ? 0.6 : 0), 0) / needs.length;
}

function reasonFor(p: Person, covers: Competency[], variant: Variant, brief: TeamBrief) {
  const list = covers.map((c) => COMPETENCY_INFO[c].name.toLowerCase());
  const names = list.length > 1 ? `${list.slice(0, -1).join(', ')} and ${list[list.length - 1]}` : list[0] ?? 'a useful perspective';
  const inDomain = brief.domain.includes(p.dept);
  const avail = p.availability.status === 'partial' ? ` Available ${p.availability.note}.` : '';
  if (variant === 'execution') return `Strong on ${names}, ${p.years} years in ${p.dept.toLowerCase()}.${avail}`;
  if (variant === 'challenger') return `Brings ${names} from ${p.dept.toLowerCase()}, a different angle from the rest of the team.${avail}`;
  return `${inDomain ? 'Knows the domain, but' : 'New to this domain,'} brings ${names} with fresh eyes.${avail}`;
}

export function buildTeam(brief: TeamBrief, variant: Variant, size = 5): TeamResult {
  const pool = PEOPLE.filter((p) => availableWeight(p) > 0 && !p.wildcard);
  const team: Person[] = [];

  while (team.length < size) {
    const cov = coverageOf(team, brief.needs);
    const depts = new Set(team.map((m) => m.dept));
    let best: Person | null = null;
    let bestScore = -Infinity;

    for (const p of pool) {
      if (team.includes(p)) continue;
      // marginal coverage gain
      let gain = 0;
      for (const c of brief.needs) gain += Math.max(0, level(p, c) - cov[c]) * (c === brief.needs[0] ? 1.4 : 1);
      if (gain === 0 && team.length < size - 1) continue;

      const inDomain = brief.domain.includes(p.dept);
      let s = gain * availableWeight(p);
      if (variant === 'execution') s += (inDomain ? 0.8 : 0) + p.years / 20;
      if (variant === 'challenger') s += depts.has(p.dept) ? -1.2 : 0.6;
      if (variant === 'innovation') s += (inDomain ? -0.9 : 0.5) + (p.years < 8 ? 0.4 : 0) + (depts.has(p.dept) ? -0.6 : 0);

      if (s > bestScore) { bestScore = s; best = p; }
    }
    if (!best) break;
    team.push(best);
  }

  const coverage = coverageOf(team, brief.needs);
  const members = team.map((p) => {
    const covers = brief.needs.filter((c) => level(p, c) > 0);
    const fit = Math.min(0.97, 0.5 + covers.reduce((s, c) => s + level(p, c) * 0.09, 0) + (brief.domain.includes(p.dept) ? 0.08 : 0));
    return { person: p, covers, fit: Math.round(fit * 100) / 100, reason: reasonFor(p, covers, variant, brief) };
  });

  return {
    variant,
    members,
    coverage,
    score: Math.round(scoreCoverage(coverage, brief.needs) * 100) / 100,
    spread: Math.round((new Set(team.map((m) => m.dept)).size / Math.max(1, team.length)) * 100) / 100,
  };
}

/** Strong matches who can't join right now, with the reason. */
export function busyMatches(brief: TeamBrief, n = 2) {
  return PEOPLE.filter((p) => p.availability.status === 'busy')
    .map((p) => ({ p, s: brief.needs.reduce((s, c) => s + level(p, c), 0) + (brief.domain.includes(p.dept) ? 1 : 0) }))
    .filter((x) => x.s >= 2)
    .sort((a, b) => b.s - a.s)
    .slice(0, n)
    .map((x) => x.p);
}

/** One unexpected candidate whose track record fits the brief's hidden needs. */
export function wildcardFor(brief: TeamBrief) {
  const scored = PEOPLE.filter((p) => p.wildcard && p.availability.status !== 'busy')
    .map((p) => ({ p, s: p.wildcard!.traits.filter((t) => brief.traits.includes(t)).length }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s);
  return scored[0]?.p ?? null;
}
