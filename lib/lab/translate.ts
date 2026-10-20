import { COMPETENCIES, COMPETENCY_INFO, detectCompetencies, type Competency } from './competencies';
import type { Translation } from './schemas';

/* Built-in translator: maps common self-description phrases to matchable competencies. */

const PHRASES: Array<{ re: RegExp; c: Competency; label: string; because: string; conf: number }> = [
  { re: /complexity into clarity|make .*simple|simplif|clarity/i, c: 'communication', label: 'Stakeholder communication', because: 'Turning complicated material into something others understand is stakeholder communication.', conf: 0.78 },
  { re: /complexity into clarity|clarity|big picture/i, c: 'strategy', label: 'Executive reporting', because: 'People who create clarity are often the ones preparing decisions for leaders.', conf: 0.62 },
  { re: /synerg|cross-?functional|across (teams|departments)|align/i, c: 'strategy', label: 'Cross-functional coordination', because: '“Synergy” usually means getting different teams to work towards one goal.', conf: 0.66 },
  { re: /stakeholder/i, c: 'communication', label: 'Stakeholder management', because: 'Working “across stakeholders” is managing their interests and expectations.', conf: 0.72 },
  { re: /ideation|innovat|creative|brainstorm/i, c: 'strategy', label: 'Workshop facilitation', because: '“Ideation” in practice is running sessions that turn ideas into options.', conf: 0.58 },
  { re: /streamlin|efficien|lean|optimi[sz]/i, c: 'operations', label: 'Process improvement', because: '“Streamlining” is removing steps and waste from how work flows.', conf: 0.7 },
  { re: /numbers don.?t add up|numbers|spreadsheet|figures|budget/i, c: 'economy', label: 'Financial analysis', because: 'Being called when the numbers look wrong signals strong financial analysis.', conf: 0.8 },
  { re: /numbers don.?t add up|data|insight|analy/i, c: 'technology-data', label: 'Data validation', because: 'Spotting what doesn’t add up is checking data quality and logic.', conf: 0.68 },
  { re: /people person|connector|network|relationship/i, c: 'communication', label: 'Relationship building', because: 'Being a connector means building and keeping working relationships.', conf: 0.64 },
  { re: /firefight|fix|troubleshoot|problem.?solv|call when/i, c: 'operations', label: 'Root-cause problem solving', because: 'Being the person others call in a crisis shows practical problem solving.', conf: 0.66 },
  { re: /lead|manag|coach|mentor/i, c: 'strategy', label: 'Team leadership', because: 'Leading or coaching others is a leadership competency.', conf: 0.6 },
  { re: /customer|client|user/i, c: 'customers', label: 'Customer insight', because: 'Mentioning customers or users points at understanding their needs.', conf: 0.6 },
  { re: /risk|safe|secur|compliance/i, c: 'risk-security', label: 'Risk assessment', because: 'Talking about safety or risk suggests experience weighing what could go wrong.', conf: 0.62 },
];

export function localTranslate(text: string): Translation {
  const items: Translation['items'] = [];
  const used = new Set<string>();
  for (const p of PHRASES) {
    if (items.length >= 4) break;
    if (p.re.test(text) && !used.has(p.label)) {
      items.push({ competency: p.c, label: p.label, because: p.because, confidence: p.conf });
      used.add(p.label);
    }
  }
  if (items.length < 2) {
    const scores = detectCompetencies(text);
    for (const c of COMPETENCIES.filter((x) => scores[x] > 0).sort((a, b) => scores[b] - scores[a])) {
      if (items.length >= 3) break;
      if (items.some((i) => i.competency === c)) continue;
      items.push({ competency: c, label: COMPETENCY_INFO[c].name, because: 'The words you used are common in this field.', confidence: 0.45 });
    }
  }
  return {
    items,
    note: items.length
      ? 'Based on the words alone. In GRTA, past projects and peer feedback confirm or correct this.'
      : 'There isn’t enough here to go on. Try describing something you actually did.',
  };
}
