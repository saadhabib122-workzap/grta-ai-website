import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PageHero } from '@/components/ui/PageHero';
import { LabTabs, type LabTab } from '@/components/lab/LabTabs';
import { BriefDemo } from '@/components/lab/BriefDemo';
import { TranslateDemo } from '@/components/lab/TranslateDemo';
import { TeamDemo } from '@/components/lab/TeamDemo';
import { HiitDemo } from '@/components/lab/HiitDemo';
import { NetworkDemo } from '@/components/lab/NetworkDemo';
import { Pulse } from '@/components/lab/Pulse';
import { pageMeta } from '@/lib/meta';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMeta(locale, 'lab', '/lab');
}

function Demo({ tool, title, lead, children }: { tool: LabTab; title: string; lead: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-8">
      <div className="max-w-2xl">
        <h2 className="t-h2">{title}</h2>
        <p className="t-lead mt-3">{lead}</p>
      </div>
      {children}
      <div className="card p-6 sm:p-8"><Pulse tool={tool} /></div>
    </div>
  );
}

export default async function Lab({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('lab');

  return (
    <>
      <PageHero label={t('hero.label')} title={t('hero.title')} lead={t('hero.lead')} slot="how-brief" alt={t('hero.alt')} focus="62% 50%">
        <p className="text-sm text-muted">{t('aiNote')}</p>
      </PageHero>
      <section aria-label={t('hero.label')} className="pt-14 pb-24 md:pt-20">
        <div className="wrap">
          <LabTabs
            panels={{
              brief: (
                <Demo tool="brief" title={t('brief.title')} lead={t('brief.lead')}>
                  <BriefDemo examples={t.raw('brief.exampleList') as string[]} initialText={(t.raw('brief.exampleList') as string[])[0]} />
                </Demo>
              ),
              translate: <Demo tool="translate" title={t('translate.title')} lead={t('translate.lead')}><TranslateDemo /></Demo>,
              team: <Demo tool="team" title={t('team.title')} lead={t('team.lead')}><TeamDemo /></Demo>,
              hiit: <Demo tool="hiit" title={t('hiit.title')} lead={t('hiit.lead')}><HiitDemo /></Demo>,
              network: <Demo tool="network" title={t('network.title')} lead={t('network.lead')}><NetworkDemo /></Demo>,
            }}
          />
        </div>
      </section>
    </>
  );
}
