/* Nordlys Group: a fictional organisation of 48 people used by every Lab demo.
   No real personal data. Levels: 2 = strong, 1 = adequate. */

import type { Competency } from './competencies';

export type Availability = { status: 'available' | 'partial' | 'busy'; note?: string };

export type Person = {
  id: string;
  name: string;
  role: string;
  dept: string;
  years: number;
  skills: Partial<Record<Competency, 1 | 2>>;
  availability: Availability;
  /** What makes this person a credible wildcard, if anything */
  wildcard?: { traits: string[]; evidence: string };
};

type Template = { role: string; dept: string; skills: Partial<Record<Competency, 1 | 2>> };

const T: Template[] = [
  { role: 'Head of Strategy', dept: 'Strategy office', skills: { strategy: 2, economy: 1 } },
  { role: 'Financial controller', dept: 'Finance', skills: { economy: 2, 'risk-security': 1 } },
  { role: 'Legal counsel', dept: 'Legal', skills: { legal: 2, 'risk-security': 1 } },
  { role: 'Operations manager', dept: 'Operations', skills: { operations: 2, 'supply-chain': 1 } },
  { role: 'Procurement specialist', dept: 'Procurement', skills: { 'supply-chain': 2, economy: 1 } },
  { role: 'Logistics planner', dept: 'Logistics', skills: { 'supply-chain': 2, operations: 1, 'technology-data': 1 } },
  { role: 'Market analyst', dept: 'Marketing', skills: { customers: 2, 'technology-data': 1 } },
  { role: 'Customer service lead', dept: 'Customer service', skills: { customers: 2, operations: 1, communication: 1 } },
  { role: 'Data scientist', dept: 'Data & analytics', skills: { 'technology-data': 2, strategy: 1 } },
  { role: 'Solution architect', dept: 'IT', skills: { 'technology-data': 2, 'risk-security': 1 } },
  { role: 'Change & communication lead', dept: 'People & culture', skills: { communication: 2, strategy: 1 } },
  { role: 'Brand manager', dept: 'Marketing', skills: { communication: 2, customers: 1 } },
  { role: 'Security officer', dept: 'IT', skills: { 'risk-security': 2, legal: 1, 'technology-data': 1 } },
  { role: 'Sustainability manager', dept: 'Strategy office', skills: { strategy: 1, 'supply-chain': 1, legal: 1, communication: 1 } },
  { role: 'Product owner', dept: 'Digital', skills: { 'technology-data': 1, customers: 2, operations: 1 } },
  { role: 'HR business partner', dept: 'People & culture', skills: { communication: 1, strategy: 1, legal: 1 } },
];

const NAMES = [
  'Ingrid Lund', 'Kofi Mensah', 'Mei Chen', 'Lars Holm', 'Amara Okafor', 'Sofia Berg',
  'Jonas Dahl', 'Fatima Haddad', 'Emil Strand', 'Priya Nair', 'Mikkel Juhl', 'Aisha Diallo',
  'Henrik Vik', 'Lucía Romero', 'Oskar Nyberg', 'Yuki Tanaka', 'Nora Eide', 'Tobias Kraus',
  'Selma Aydın', 'Rasmus Krogh', 'Grace Wanjiru', 'Viktor Sand', 'Leila Karimi', 'Anders Moe',
  'Freja Thomsen', 'Daniel Osei', 'Hanna Laine', 'Marco Bianchi', 'Sara Lindqvist', 'Ibrahim Sow',
  'Elin Fjeld', 'Tomás Silva', 'Maja Krog', 'Chidi Eze', 'Astrid Nilsen', 'Arjun Mehta',
  'Liv Hagen', 'Pavel Novák', 'Ebba Sjöberg', 'Kwame Asante', 'Ida Bak', 'Hamza Ali',
  'Karin Wold', 'Nikolai Petrov', 'Sigrid Ås', 'Musa Kamau', 'Clara Weber', 'Oliver Brandt',
];

const BUSY_NOTES = [
  'On the ERP migration until March',
  'Parental leave until June',
  'Fully booked on the Q4 tender',
  'Seconded to the Oslo office this quarter',
];

/* Hand-picked wildcards: unusual on paper, with evidence from past work */
const WILDCARDS: Record<number, Person['wildcard']> = {
  3: { traits: ['launch', 'stress-test', 'bottleneck', 'operations'], evidence: 'Found the routing bottleneck that would have stalled two warehouse go-lives, by stress-testing the plan a week early.' },
  20: { traits: ['community', 'adoption', 'students', 'engagement'], evidence: 'Grew the internal mentoring network from 12 to 300 people in a year, with no budget.' },
  28: { traits: ['data', 'forecast', 'model', 'emissions'], evidence: 'Built the emissions data pipeline for last year’s sustainability report, as a side project from IT security.' },
  33: { traits: ['customer', 'migration', 'training', 'crm'], evidence: 'Trained 140 colleagues through the last system change and wrote the guide people still use.' },
  41: { traits: ['regulation', 'germany', 'market', 'legal'], evidence: 'Spent four years in the Hamburg office connecting our systems with German partners, under German data rules.' },
};

export const PEOPLE: Person[] = NAMES.map((name, i) => {
  const tpl = T[i % T.length];
  const busy = i % 7 === 2 || i % 11 === 5;
  const partial = !busy && i % 5 === 1;
  return {
    id: `p${i + 1}`,
    name,
    role: tpl.role,
    dept: tpl.dept,
    years: 2 + ((i * 7) % 19),
    skills: tpl.skills,
    availability: busy
      ? { status: 'busy', note: BUSY_NOTES[i % BUSY_NOTES.length] }
      : partial
        ? { status: 'partial', note: '2 days a week' }
        : { status: 'available' },
    wildcard: WILDCARDS[i],
  };
});

export const DEPARTMENTS = [...new Set(PEOPLE.map((p) => p.dept))];
