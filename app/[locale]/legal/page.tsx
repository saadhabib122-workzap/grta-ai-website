import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ChapterNav } from '@/components/ui/PageHero';
import { HeroCard } from '@/components/ui/HeroCard';
import { legalUpdated, privacy, terms, type LegalBlock } from '@/content/legal';
import { pageMeta } from '@/lib/meta';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMeta(locale, 'legal', '/legal');
}

function Blocks({ blocks }: { blocks: LegalBlock[] }) {
  return (
    <ol className="mt-8 grid gap-10">
      {blocks.map((b, i) => (
        <li key={b.h}>
          <h3 className="flex gap-3 font-display text-xl font-bold"><span className="font-mono text-sm font-normal text-tag">0{i + 1}</span>{b.h}</h3>
          <div className="mt-3 grid gap-3 text-muted">
            {b.p?.map((p) => <p key={p}>{p}</p>)}
            {b.list && <ul className="grid list-disc gap-1.5 pl-5 marker:text-thread">{b.list.map((l) => <li key={l}>{l}</li>)}</ul>}
            {b.after?.map((p) => <p key={p}>{p}</p>)}
          </div>
        </li>
      ))}
    </ol>
  );
}

export default async function Legal({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('legal');

  return (
    <>
      <HeroCard>
        <h1 id="page-title" className="t-h1">{t('title')}</h1>
        <p className="mt-4 font-mono text-sm text-tag">{t('updated', { date: legalUpdated })}</p>
        <p className="mt-6 max-w-2xl rounded-lg border border-line bg-sunk px-4 py-3 text-sm text-muted">{t('draft')}</p>
      </HeroCard>
      <ChapterNav label={t('title')} items={[{ id: 'privacy', label: t('privacyTitle') }, { id: 'terms', label: t('termsTitle') }]} />
      <section id="privacy" aria-labelledby="privacy-title" className="py-16">
        <div className="wrap"><div className="max-w-3xl">
          <h2 id="privacy-title" className="t-h2">{t('privacyTitle')}</h2>
          <Blocks blocks={privacy} />
        </div></div>
      </section>
      <section id="terms" aria-labelledby="terms-title" className="border-t border-line py-16">
        <div className="wrap"><div className="max-w-3xl">
          <h2 id="terms-title" className="t-h2">{t('termsTitle')}</h2>
          <Blocks blocks={terms} />
        </div></div>
      </section>
    </>
  );
}
