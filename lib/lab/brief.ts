import { COMPETENCIES, COMPETENCY_INFO, detectCompetencies, type Competency } from './competencies';
import type { Brief } from './schemas';

/* Built-in brief engine: deterministic, no AI. Good enough to show the idea;
   the Claude engine replaces it when an API key is configured. */

const ROLE_HINTS: Array<{ re: RegExp; title: string; why: string; c: Competency }> = [
  { re: /procure|purchas|sourcing/i, title: 'Procurement specialist', why: 'Knows suppliers, contracts and where cost and emissions hide.', c: 'supply-chain' },
  { re: /logistic|transport|warehouse/i, title: 'Logistics planner', why: 'Understands routes, volumes and what can change quickly.', c: 'supply-chain' },
  { re: /\bdata\b|analytics|numbers/i, title: 'Data analyst', why: 'Sets the baseline and measures progress against the target.', c: 'technology-data' },
  { re: /\bIT\b|system|crm|erp|platform/i, title: 'Solution architect', why: 'Owns the technical design and integrations.', c: 'technology-data' },
  { re: /developer|engineer/i, title: 'Developers', why: 'Build and adjust the product.', c: 'technology-data' },
  { re: /designer|design|ux/i, title: 'Product designer', why: 'Shapes the experience for real users.', c: 'customers' },
  { re: /team lead|manager/i, title: 'Team leads from the front line', why: 'Know how the work is done today and carry the change to their teams.', c: 'operations' },
  { re: /market|launch|campaign/i, title: 'Market analyst', why: 'Knows the audience and how to reach it.', c: 'customers' },
  { re: /customer service|support/i, title: 'Customer service lead', why: 'Brings the customer view and daily reality.', c: 'customers' },
  { re: /old system|legacy/i, title: 'Super-user of the current system', why: 'Knows the workarounds nobody wrote down.', c: 'operations' },
];

const GAP_RULES: Array<{ when: RegExp; c: Competency; message: string }> = [
  { when: /migrat|new (crm|erp|system|platform)|moving .* to|roll ?out|transform|reorgani/i, c: 'communication', message: 'Projects that change how people work usually need change management and internal communication. You haven’t asked for any.' },
  { when: /germany|\bdenmark\b|sweden|norway|market in|country|abroad|\beu\b|international/i, c: 'legal', message: 'Entering another market brings local rules on contracts, data and marketing. Consider legal and compliance.' },
  { when: /\d+ ?%|co2|emission|kpi|target/i, c: 'technology-data', message: 'A measurable target needs someone who owns the data and the baseline.' },
  { when: /cost|budget|price|without raising|cheap/i, c: 'economy', message: 'You mention cost. A finance perspective keeps the business case honest.' },
  { when: /\d+ ?weeks|launch|deadline|urgent|asap|next (spring|month|quarter)/i, c: 'risk-security', message: 'With a fixed date, someone should own the risks and the plan B.' },
  { when: /app|launch|customer|user|market/i, c: 'customers', message: 'This touches customers. Bring in someone who knows them first-hand.' },
  { when: /co2|emission|sustainab|esg|2028|2030/i, c: 'legal', message: 'Climate targets come with reporting duties such as CSRD. Legal and compliance can save rework later.' },
];

function firstSentence(text: string) {
  const s = text.trim().split(/(?<=[.!?])\s+/)[0] ?? text.trim();
  return s
    .replace(/^(we|i)\s+(need|want|have|must|should)\s+(to\s+)?/i, '')
    .replace(/^(we're|we are|i'm|i am)\s+/i, '')
    .replace(/^(our|my)\s+/i, (m) => m)
    .replace(/[.!?]+$/, '')
    .replace(/^./, (c) => c.toUpperCase());
}

function findTimeline(text: string): string | null {
  const m =
    text.match(/\b(by|before|within|in|until)\s+(the\s+)?(end of\s+)?((19|20)\d{2}|(\d+|two|three|four|five|six|seven|eight|nine|ten|twelve)\s+(weeks?|months?|days?)|q[1-4](\s+(19|20)\d{2})?|next\s+\w+|spring|summer|autumn|winter)\b/i) ??
    text.match(/\b(next\s+(spring|summer|autumn|winter|month|quarter|year)|(19|20)\d{2})\b/i);
  return m ? m[0].replace(/^./, (c) => c.toUpperCase()) : null;
}

export function localBrief(text: string): Brief {
  const scores = detectCompetencies(text);
  const roles: Brief['roles'] = [];
  const seen = new Set<string>();
  const covered = new Set<Competency>();

  for (const h of ROLE_HINTS) {
    if (h.re.test(text) && !seen.has(h.title)) {
      roles.push({ title: h.title, why: h.why });
      seen.add(h.title);
      covered.add(h.c);
      scores[h.c] = Math.max(scores[h.c], 1);
    }
  }

  const competencies = COMPETENCIES.filter((c) => scores[c] > 0).sort((a, b) => scores[b] - scores[a]);
  if (competencies.length === 0) competencies.push('strategy', 'operations');

  for (const c of competencies) {
    if (roles.length >= 5) break;
    if (covered.has(c)) continue;
    const title = COMPETENCY_INFO[c].roles[0];
    if (seen.has(title)) continue;
    roles.push({ title, why: `Covers ${COMPETENCY_INFO[c].name.toLowerCase()}, which your brief relies on.` });
    seen.add(title);
    covered.add(c);
  }

  const gaps: Brief['gaps'] = [];
  for (const g of GAP_RULES) {
    if (gaps.length >= 3) break;
    if (g.when.test(text) && !competencies.includes(g.c) && !gaps.some((x) => x.competency === g.c)) {
      gaps.push({ competency: g.c, message: g.message });
    }
  }

  return { goal: firstSentence(text), timeline: findTimeline(text), roles, competencies, gaps };
}
