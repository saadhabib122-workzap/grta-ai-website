import { handleLab } from '@/lib/server/lab-route';
import { BRIEF_SYSTEM } from '@/lib/ai/prompts';
import { BriefSchema } from '@/lib/lab/schemas';
import { localBrief } from '@/lib/lab/brief';

export async function POST(req: Request) {
  return handleLab(req, { tool: 'brief', field: 'text', min: 30, max: 2000, system: BRIEF_SYSTEM, schema: BriefSchema, local: localBrief });
}
