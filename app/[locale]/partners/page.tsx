import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Icon } from '@/components/ui/Icon';
import { PageHero } from '@/components/ui/PageHero';
import { Section, SectionHead } from '@/components/ui/Section';
import { ContactButton } from '@/components/contact/ContactModal';
import { pageMeta } from '@/lib/meta';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMeta(locale, 'partners', '/partners');
}

export default async function Partners({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('partners');

  const questions = t.raw('questions.items') as string[];
  const weItems = t.raw('exchange.weItems') as string[];
  const youItems = t.raw('exchange.youItems') as string[];
  const path = t.raw('path.steps') as Array<{ title: string; text: string }>;
  const examples = t.raw('challenges.examples') as Array<{ org: string; title: string; tags: string[] }>;

  return (
    <>
      <PageHero
        label={t('hero.label')}
        title={t('hero.title')}
        lead={t('hero.lead')}
        slot="partners-hero"
        alt={t('hero.alt')}
        focus="40% 50%"
      >
        <ContactButton mode="partner" size="lg" arrow>{t('challenges.cta')}</ContactButton>
      </PageHero>

      <Section tone="surface" aria-labelledby="questions-title">
        <div className="wrap">
          <h2 id="questions-title" className="t-h2 max-w-2xl">{t('questions.title')}</h2>
          <ol className="mt-12 grid gap-5 md:grid-cols-2">
            {questions.map((q, i) => (
              <li key={q} className="flex gap-5 rounded-xl border border-line bg-bg p-6">
                <span className="font-display text-4xl font-extrabold text-thread">{i + 1}</span>
                <p className="font-display text-lg font-semibold leading-snug">{q}</p>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <Section aria-labelledby="exchange-title">
        <div className="wrap">
          <h2 id="exchange-title" className="t-h2">{t('exchange.title')}</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {[{ h: t('exchange.we'), items: weItems, icon: 'collective' }, { h: t('exchange.you'), items: youItems, icon: 'customers' }].map((col) => (
              <div key={col.h} className="card p-7">
                <h3 className="t-h3 flex items-center gap-3"><Icon name={col.icon} size={26} />{col.h}</h3>
                <ul className="mt-5 grid gap-3">
                  {col.items.map((it) => <li key={it} className="flex gap-3"><Icon name="check" size={20} accent={false} className="mt-0.5 text-tag" />{it}</li>)}
                </ul>
              </div>
            ))}
          </div>

          <h3 className="t-h3 mt-20">{t('path.title')}</h3>
          <ol className="mt-8 grid gap-6 md:grid-cols-4">
            {path.map((s, i) => (
              <li key={s.title} className="relative">
                {/* connector to the next step */}
                {i < path.length - 1 && <span aria-hidden className="absolute top-5 left-12 -right-4 hidden h-px bg-thread md:block" />}
                <span className="relative grid h-10 w-10 place-items-center rounded-full border border-thread bg-bg font-mono text-sm">{i + 1}</span>
                <h4 className="mt-4 font-display text-lg font-bold">{s.title}</h4>
                <p className="mt-1.5 text-sm text-muted">{s.text}</p>
              </li>
            ))}
          </ol>

          <div className="mt-20 grid gap-5 md:grid-cols-2">
            <div className="rounded-xl bg-sunk p-7">
              <h3 className="t-h3 flex items-center gap-3"><Icon name="globe" size={26} />{t('international.title')}</h3>
              <p className="mt-3 text-muted">{t('international.text')}</p>
            </div>
            <div className="rounded-xl bg-sunk p-7">
              <h3 className="t-h3 flex items-center gap-3"><Icon name="check" size={26} />{t('terms.title')}</h3>
              <p className="mt-3 text-muted">{t('terms.text')}</p>
            </div>
          </div>
        </div>
      </Section>

      <Section id="challenges" tone="forest" aria-labelledby="challenges-title">
        <div className="wrap">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-start">
            <div>
              <SectionHead label={t('challenges.label')} title={t('challenges.title')} lead={t('challenges.lead')} id="challenges-title" />
              <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#2F5245] px-3 py-1.5 font-mono text-xs uppercase tracking-wider text-fjord">
                <span className="h-2 w-2 animate-pulse rounded-full bg-accent" />{t('challenges.status')}
              </p>
              <div className="mt-8"><ContactButton mode="partner" variant="onDark" arrow>{t('challenges.cta')}</ContactButton></div>
            </div>
            <ul className="relative grid gap-4">
              {examples.map((e, i) => (
                <li key={e.title} className="relative rounded-xl border border-[#2F5245] bg-[#18332A] p-5">
                  <p className="font-mono text-xs uppercase tracking-wider text-fjord">{e.org}</p>
                  <p className="mt-2 font-display text-lg font-semibold">{e.title}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {e.tags.map((tag) => <span key={tag} className="rounded-full bg-snow/10 px-2.5 py-0.5 text-xs">{tag}</span>)}
                  </div>
                  {i < examples.length - 1 && (
                    <span className="absolute -bottom-4 left-8 z-10 rounded-full bg-accent px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-snow">
                      {t('challenges.match')}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>
    </>
  );
}
