import { handleLab } from '@/lib/server/lab-route';
import { TRANSLATE_SYSTEM } from '@/lib/ai/prompts';
import { TranslationSchema } from '@/lib/lab/schemas';
import { localTranslate } from '@/lib/lab/translate';

export async function POST(req: Request) {
  return handleLab(req, { tool: 'translate', field: 'text', min: 8, max: 600, system: TRANSLATE_SYSTEM, schema: TranslationSchema, local: localTranslate });
}
