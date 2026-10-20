import { handleLab } from '@/lib/server/lab-route';
import { HIIT_SYSTEM } from '@/lib/ai/prompts';
import { HiitPlanSchema } from '@/lib/lab/schemas';
import { localHiit } from '@/lib/lab/hiit';

export async function POST(req: Request) {
  return handleLab(req, { tool: 'hiit', field: 'question', min: 15, max: 800, system: HIIT_SYSTEM, schema: HiitPlanSchema, local: localHiit });
}
