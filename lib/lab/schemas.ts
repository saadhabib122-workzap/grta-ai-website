import { z } from 'zod';
import { COMPETENCIES } from './competencies';

/* Shared result shapes. The built-in engine and the Claude engine both return these,
   so the UI has a single code path. */

const competency = z.enum(COMPETENCIES);

export const BriefSchema = z.object({
  goal: z.string().describe('One sentence: what success looks like, in plain words'),
  timeline: z.string().nullable().describe('Deadline or time frame if mentioned, else null'),
  roles: z.array(z.object({ title: z.string(), why: z.string() })).describe('3 to 6 roles the team needs'),
  competencies: z.array(competency).describe('Competencies the brief explicitly needs, most important first'),
  gaps: z
    .array(z.object({ competency, message: z.string() }))
    .describe('Up to 3 competencies the author did not ask for but projects like this usually need'),
});
export type Brief = z.infer<typeof BriefSchema>;

export const TranslationSchema = z.object({
  items: z
    .array(
      z.object({
        competency,
        label: z.string().describe('A concrete, matchable skill name, 2 to 4 words'),
        because: z.string().describe('One short sentence explaining the link to the original words'),
        confidence: z.number().describe('0 to 1'),
      }),
    )
    .describe('2 to 4 matchable competencies'),
  note: z.string().describe('One sentence on what would confirm or correct this translation'),
});
export type Translation = z.infer<typeof TranslationSchema>;

export const HiitPlanSchema = z.object({
  summary: z.string().describe('The question restated as a clear objective, one sentence'),
  perspectives: z
    .array(z.object({ competency, insight: z.string().describe('One concrete sentence from this perspective') }))
    .describe('Exactly one insight per competency, all 9 competencies'),
  plan: z
    .array(
      z.object({
        priority: z.number(),
        action: z.string(),
        competency,
        weeks: z.number().describe('Deadline in weeks from today'),
        kpi: z.string(),
      }),
    )
    .describe('4 to 6 prioritised actions'),
});
export type HiitPlan = z.infer<typeof HiitPlanSchema>;

export type EngineResult<T> = { data: T; engine: 'ai' | 'local' };
