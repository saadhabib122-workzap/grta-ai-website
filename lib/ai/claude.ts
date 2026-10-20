import 'server-only';
import Anthropic from '@anthropic-ai/sdk';
import { betaZodOutputFormat } from '@anthropic-ai/sdk/helpers/beta/zod';
import type { z } from 'zod';

/*
 * Thin wrapper for the Lab's structured-output calls.
 * - Model: Claude Sonnet 5.5 (fast, inexpensive, strong at structured extraction).
 * - Output: validated against a Zod schema via structured outputs.
 * - Refusals: server-side fallback ("default") so a policy decline is retried on
 *   the server's chosen fallback model instead of failing the demo.
 * Returns null on any failure; callers then use the built-in engine.
 */

export const LAB_MODEL = 'claude-sonnet-5-5';

let client: Anthropic | null = null;

export function aiEnabled() {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

function getClient() {
  if (!client) client = new Anthropic({ timeout: 30_000, maxRetries: 1 });
  return client;
}

export async function structured<S extends z.ZodType>({ system, user, schema, maxTokens = 4000 }: {
  system: string;
  user: string;
  schema: S;
  maxTokens?: number;
}): Promise<z.infer<S> | null> {
  if (!aiEnabled()) return null;
  try {
    const response = await getClient().beta.messages.parse({
      model: LAB_MODEL,
      max_tokens: maxTokens,
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      output_config: { effort: 'low', format: betaZodOutputFormat(schema) },
      cache_control: { type: 'ephemeral' },
      system,
      messages: [{ role: 'user', content: user }],
    });
    if (response.stop_reason === 'refusal' || response.stop_reason === 'max_tokens') return null;
    return (response.parsed_output as z.infer<S> | null) ?? null;
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) console.warn('[lab] Claude rate limited');
    else if (error instanceof Anthropic.AuthenticationError) console.error('[lab] Claude API key rejected');
    else if (error instanceof Anthropic.APIError) console.error(`[lab] Claude API error ${error.status}: ${error.message}`);
    else console.error('[lab] Claude call failed', error);
    return null;
  }
}
