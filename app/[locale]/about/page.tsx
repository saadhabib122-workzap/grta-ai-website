import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Icon } from '@/components/ui/Icon';
import { PageHero } from '@/components/ui/PageHero';
import { Section, SectionHead } from '@/components/ui/Section';
import { pageMeta } from '@/lib/meta';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMeta(locale, 'about', '/about');
}

export default async function About({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('about');

  const parts = t.raw('equation.parts') as Array<{ k: string; v: string }>;
  const story = t.raw('story.paragraphs') as string[];
  const principles = t.raw('principles.items') as Array<{ title: string; text: string }>;
  const trust = t.raw('trust.items') as Array<{ icon: string; title: string; text: string }>;

  return (
    <>
      <PageHero label={t('hero.label')} title={t('hero.title')} lead={t('hero.lead')} slot="about-together" alt={t('together.alt')} focus="55% 55%" />

      <Section tone="forest" aria-labelledby="eq-title">
        <div className="wrap grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 id="eq-title" className="font-display text-[clamp(2.5rem,1.6rem+3.5vw,4.5rem)] font-extrabold tracking-tight">
              AI + BI + <span className="text-[#A8C7A0]">CI</span> = DI
            </h2>
            <p className="mt-6 max-w-xl text-lg text-[#C9D3CC]">{t('equation.text')}</p>
          </div>
          <dl className="grid grid-cols-2 gap-3">
            {parts.map((p, i) => (
              <div key={p.k} className={i === 2 ? 'rounded-xl bg-[#A8C7A0] p-5 text-ink' : i === 3 ? 'rounded-xl bg-snow p-5 text-ink' : 'rounded-xl border border-[#2F5245] p-5'}>
                <dt className="font-display text-3xl font-extrabold">{p.k}</dt>
                <dd className="mt-1 text-sm opacity-80">{p.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      <Section aria-labelledby="story-title">
        <div className="wrap grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <h2 id="story-title" className="t-h2">{t('story.title')}</h2>
          <div className="grid gap-5 text-lg leading-relaxed">
            {story.map((p, i) => <p key={i} className={i === story.length - 1 ? 'font-display text-xl font-semibold' : 'text-muted'}>{p}</p>)}
          </div>
        </div>
      </Section>

      <Section tone="surface" aria-labelledby="principles-title">
        <div className="wrap">
          <h2 id="principles-title" className="t-h2">{t('principles.title')}</h2>
          <ul className="mt-12 grid gap-5 md:grid-cols-3">
            {principles.map((p, i) => (
              <li key={p.title} className="rounded-xl border border-line bg-bg p-7">
                <span className="font-mono text-sm text-tag">0{i + 1}</span>
                <h3 className="t-h3 mt-3">{p.title}</h3>
                <p className="mt-2 text-muted">{p.text}</p>
              </li>
            ))}
          </ul>
          <p className="t-h2 mt-16 text-center">{t('together.title')}</p>
        </div>
      </Section>

      <Section id="trust" aria-labelledby="trust-title">
        <div className="wrap">
          <SectionHead label={t('trust.label')} title={t('trust.title')} id="trust-title" />
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {trust.map((it) => (
              <li key={it.title} className="card p-6">
                <Icon name={it.icon} size={28} />
                <h3 className="mt-4 font-display text-lg font-bold">{it.title}</h3>
                <p className="mt-2 text-sm text-muted">{it.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </Section>
    </>
  );
}
