import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { IllustrationSlot } from '@/components/brand/IllustrationSlot';
import { HeroCard } from '@/components/ui/HeroCard';
import { ButtonLink } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Section, SectionHead } from '@/components/ui/Section';
import { ContactButton } from '@/components/contact/ContactModal';
import { ContactForm } from '@/components/contact/ContactForm';
import { DoorSection } from '@/components/home/DoorSection';
import { NineThreeOne } from '@/components/home/NineThreeOne';
import { Flywheel } from '@/components/home/Flywheel';
import { pageMeta } from '@/lib/meta';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMeta(locale, 'home', '/');
}

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('home');
  const tc = await getTranslations('contact');

  const values = t.raw('values') as Array<{ icon: string; title: string; text: string }>;
  const hiitSteps = t.raw('hiit.steps') as Array<{ n: string; title: string; text: string }>;
  const trust = t.raw('trust.items') as Array<{ icon: string; title: string; text: string }>;

  return (
    <>
      {/* ── Hero: centred card, text on a soft fade, cast on the right ── */}
      <HeroCard variant="full" slot="home-hero" alt={t('hero.alt')} focus="72% 62%" id="hero-title">
        <p className="t-label mb-5">{t('hero.label')}</p>
        <h1 id="hero-title" className="t-display text-[clamp(2.75rem,1.5rem+3.6vw,4.6rem)]!">
          {t('hero.title1')}<br />{t('hero.title2')}<br />
          <span className="text-brand">{t('hero.title3')}</span>
        </h1>
        <p className="t-lead mt-6">{t('hero.lead')}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ContactButton size="lg" arrow>{t('hero.ctaPrimary')}</ContactButton>
          <ButtonLink href="/lab" variant="secondary" size="lg" className="bg-surface/80 backdrop-blur-sm">{t('hero.ctaSecondary')}</ButtonLink>
        </div>
      </HeroCard>

      {/* ── Value tiles ────────────────────────────────── */}
      <section aria-label={t('hero.label')} className="relative pt-12 pb-16 md:pt-14 md:pb-24">
        <div className="wrap relative">
          <ul className="grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <li key={v.title}>
                <Icon name={v.icon} size={44} className="text-brand" />
                <h2 className="mt-4 font-display text-lg font-bold">{v.title}</h2>
                <p className="mt-2 text-[0.95rem] text-muted">{v.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Pick your door + live demo ─────────────────── */}
      <DoorSection
        art={{
          hr: <IllustrationSlot slot="home-door-hr" alt={t('doors.hr.alt')} sizes="(min-width: 1024px) 35vw, 90vw" />,
          project: <IllustrationSlot slot="home-door-project" alt={t('doors.project.alt')} sizes="(min-width: 1024px) 35vw, 90vw" />,
        }}
      />

      {/* ── 9 → 3 → 1 ──────────────────────────────────── */}
      <Section tone="forest" aria-labelledby="hiit-title" className="overflow-hidden">
        <div aria-hidden className="threads-bg pointer-events-none absolute inset-0 opacity-15 [mask-image:linear-gradient(to_left,#000,transparent_70%)]" />
        <div className="wrap relative grid items-center gap-14 lg:grid-cols-2">
          <div>
            <SectionHead label={t('hiit.label')} title={t('hiit.title')} lead={t('hiit.lead')} id="hiit-title" />
            <ol className="mt-10 grid gap-6 sm:grid-cols-3">
              {hiitSteps.map((s) => (
                <li key={s.n}>
                  <p className="font-display text-5xl font-extrabold text-snow">{s.n}</p>
                  <p className="mt-1 font-mono text-xs uppercase tracking-widest text-fjord">{s.title}</p>
                  <p className="mt-3 text-sm text-[#C9D3CC]">{s.text}</p>
                </li>
              ))}
            </ol>
            <ButtonLink href="/how-it-works#method" variant="onDark" arrow className="mt-10">{t('hiit.cta')}</ButtonLink>
          </div>
          <NineThreeOne labels={['9', '3', '1'].map((n, i) => `${n} ${hiitSteps[i].title}`) as [string, string, string]} />
        </div>
      </Section>

      {/* ── How it learns ──────────────────────────────── */}
      <Section aria-labelledby="learn-title">
        <div className="wrap grid items-center gap-14 lg:grid-cols-2">
          <Flywheel steps={t.raw('learn.steps') as string[]} center={t('learn.center')} />
          <div>
            <SectionHead label={t('learn.label')} title={t('learn.title')} lead={t('learn.lead')} id="learn-title" />
            <p className="mt-6 border-l-2 border-accent pl-4 font-display text-lg font-semibold">{t('learn.note')}</p>
          </div>
        </div>
      </Section>

      {/* ── Partners ───────────────────────────────────── */}
      <Section tone="surface" aria-labelledby="partners-title" className="py-16! md:py-20!">
        <div className="wrap flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div className="max-w-2xl">
            <p className="t-label mb-3">{t('partners.label')}</p>
            <h2 id="partners-title" className="t-h3 text-2xl!">{t('partners.title')}</h2>
            <p className="mt-3 text-muted">{t('partners.text')}</p>
          </div>
          <ButtonLink href="/partners" variant="secondary" arrow>{t('partners.cta')}</ButtonLink>
        </div>
      </Section>

      {/* ── Trust ──────────────────────────────────────── */}
      <Section aria-labelledby="trust-title">
        <div className="wrap">
          <h2 id="trust-title" className="t-h2 max-w-2xl">{t('trust.title')}</h2>
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {trust.map((i) => (
              <li key={i.title} className="card p-6">
                <Icon name={i.icon} size={28} />
                <h3 className="mt-4 font-display text-lg font-bold">{i.title}</h3>
                <p className="mt-2 text-sm text-muted">{i.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* ── Contact ────────────────────────────────────── */}
      <Section id="contact" tone="sunk" aria-labelledby="contact-title">
        <div className="wrap grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHead label={tc('label')} title={tc('title')} lead={tc('lead')} id="contact-title" />
          <div className="card p-6 sm:p-8">
            <ContactForm source="home" />
          </div>
        </div>
      </Section>
    </>
  );
}
