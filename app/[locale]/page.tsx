import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Icon } from '@/components/ui/Icon';
import { Section, SectionHead } from '@/components/ui/Section';
import { ContactButton } from '@/components/contact/ContactModal';
import type { Mode } from '@/components/contact/ContactForm';
import { NewsSignup } from '@/components/contact/NewsSignup';
import { BeforeAfter } from '@/components/home/BeforeAfter';
import { pageMeta } from '@/lib/meta';

type Props = { params: Promise<{ locale: string }> };
type Item = { icon: string; title: string; text: string };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMeta(locale, 'home', '/');
}

/** The call to action after a section. Every one opens the same contact form. */
function Cta({ text, label, mode = 'demo', onDark = false }: { text?: ReactNode; label: string; mode?: Mode; onDark?: boolean }) {
  return (
    <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-4">
      {text && <p className="max-w-2xl text-lg font-medium">{text}</p>}
      <ContactButton mode={mode} variant={onDark ? 'onDark' : 'primary'} size="lg" arrow>{label}</ContactButton>
    </div>
  );
}

function Box({ item, big = false }: { item: Item; big?: boolean }) {
  return (
    <li className={big ? 'card p-7' : 'rounded-[20px] bg-sunk p-6'}>
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#FDECE4]">
        <Icon name={item.icon} size={26} className="text-ember" />
      </span>
      <h3 className={big ? 't-h3 mt-5' : 'mt-4 text-lg font-bold'}>{item.title}</h3>
      <p className="mt-2 text-muted">{item.text}</p>
    </li>
  );
}

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const does = t.raw('does.items') as Item[];
  const steps = t.raw('how.steps') as Array<{ letter: string; title: string; text: string }>;
  const cases = t.raw('cases.items') as Array<{ title: string; text: string }>;
  const people = t.raw('team.people') as Array<{ name: string; role: string; initials: string }>;
  const security = t.raw('security.items') as Array<{ icon: string; text: string }>;

  return (
    <>
      {/* 1. What GRTA does */}
      <section aria-labelledby="hero-title" className="pt-[calc(72px+3rem)] pb-16 md:pt-[calc(72px+4.5rem)]">
        <div className="wrap grid items-center gap-12 lg:grid-cols-[1fr_1.15fr]">
          <div>
            <h1 id="hero-title" className="t-h1">{t('hero.title')}</h1>
            <p className="t-lead mt-6 max-w-xl">{t('hero.lead')}</p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <ContactButton size="lg" arrow>{t('hero.cta')}</ContactButton>
              <a href="#how" className="inline-flex h-13 items-center rounded-full border-[1.5px] border-line px-7 font-semibold hover:bg-sunk">{t('hero.ctaSecondary')}</a>
            </div>
          </div>
          <BeforeAfter />
        </div>
      </section>

      <Section id="does" tone="sunk" aria-labelledby="does-title">
        <div className="wrap">
          <SectionHead label={t('does.label')} title={t('does.title')} id="does-title" />
          <ul className="mt-12 grid gap-5 md:grid-cols-3">
            {does.map((it) => <Box key={it.title} item={it} big />)}
          </ul>
          <div className="mt-12 grid max-w-4xl gap-4 text-lg">
            <p>{t('does.why')}</p>
            <p className="font-semibold">{t('does.cube')}</p>
          </div>
          <Cta text={t('does.ctaText')} label={t('does.cta')} />
        </div>
      </Section>

      {/* 2. How it works: ABCD */}
      <Section id="how" aria-labelledby="how-title">
        <div className="wrap">
          <SectionHead label={t('how.label')} title={t('how.title')} id="how-title" />
          <ol className="mt-12 grid gap-4 lg:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s.letter} className="relative card p-6">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-ember text-lg font-bold text-white">{s.letter}</span>
                <h3 className="mt-4 text-lg font-bold">{s.title}</h3>
                <p className="mt-2 text-muted">{s.text}</p>
                {i < steps.length - 1 && (
                  /* Arrow to the next step: right on desktop, down on mobile */
                  <span aria-hidden className="absolute z-10 grid h-8 w-8 place-items-center rounded-full border border-line bg-white text-ember max-lg:-bottom-6 max-lg:left-1/2 max-lg:-translate-x-1/2 max-lg:rotate-90 lg:top-1/2 lg:-right-6 lg:-translate-y-1/2">
                    <Icon name="arrow-right" size={16} />
                  </span>
                )}
              </li>
            ))}
          </ol>
          <p className="mt-5 text-sm text-muted">{t('how.smallPrint')}</p>

          {/* shortcut: placeholder until Andi sends platform screenshots; swap in a next/image */}
          <div role="img" aria-label={t('how.screenshot')} className="mx-auto mt-12 max-w-5xl overflow-hidden rounded-[20px] border border-line bg-sunk shadow-soft">
            <div className="flex gap-1.5 border-b border-line bg-white px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-line" /><span className="h-2.5 w-2.5 rounded-full bg-line" /><span className="h-2.5 w-2.5 rounded-full bg-line" />
            </div>
            <p className="grid aspect-[16/6] place-items-center p-6 text-center text-muted">{t('how.screenshotNote')}</p>
          </div>
          <Cta label={t('how.cta')} />
        </div>
      </Section>

      {/* 3. What you get */}
      <Section id="get" tone="sunk" aria-labelledby="get-title">
        <div className="wrap">
          <SectionHead label={t('get.label')} title={t('get.title')} lead={t('get.lead')} id="get-title" />
          <ul className="mt-12 grid gap-5 md:grid-cols-3">
            {(t.raw('get.main') as Item[]).map((it) => <Box key={it.title} item={it} big />)}
          </ul>
          <h3 className="mt-14 text-lg font-bold">{t('get.moreTitle')}</h3>
          <ul className="mt-5 grid gap-5 md:grid-cols-3">
            {(t.raw('get.more') as Item[]).map((it) => <li key={it.title} className="card p-6"><Icon name={it.icon} size={26} className="text-ember" /><h4 className="mt-3 font-bold">{it.title}</h4><p className="mt-1.5 text-muted">{it.text}</p></li>)}
          </ul>
          <Cta text={t('get.ctaText')} label={t('get.cta')} />
        </div>
      </Section>

      {/* 4. Greater together */}
      <Section tone="brand" aria-labelledby="together-title">
        <div className="wrap"><div className="max-w-4xl">
          <p className="t-label mb-4">{t('together.label')}</p>
          <h2 id="together-title" className="t-h2">{t('together.title')}</h2>
          <p className="mt-6 text-xl leading-relaxed">{t('together.text')}</p>
          <p className="mt-4 text-xl leading-relaxed text-muted">{t('together.meaning')}</p>
          <Cta text={t('together.ctaText')} label={t('together.cta')} mode="cocreate" onDark />
        </div></div>
      </Section>

      {/* 5. Customer cases */}
      <Section id="cases" aria-labelledby="cases-title">
        <div className="wrap">
          <SectionHead label={t('cases.label')} title={t('cases.title')} id="cases-title" />
          <ul className="mt-12 grid gap-5 md:grid-cols-3">
            {cases.map((c) => (
              <li key={c.title} className="card flex flex-col p-7">
                <span aria-hidden className="text-5xl leading-none font-bold text-ember">“</span>
                <blockquote className="mt-2 text-lg italic leading-relaxed">{c.text}</blockquote>
                <p className="mt-auto pt-6 text-sm font-semibold text-brand">{c.title}</p>
              </li>
            ))}
          </ul>
          <Cta label={t('cases.cta')} mode="contact" />
        </div>
      </Section>

      {/* 6. Who we are */}
      <Section id="team" tone="sunk" aria-labelledby="team-title">
        <div className="wrap">
          <SectionHead label={t('team.label')} title={t('team.title')} lead={t('team.lead')} id="team-title" />
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {people.map((p) => (
              <li key={p.name} className="card p-6">
                {/* shortcut: initials until the LinkedIn photos and short profiles arrive */}
                <span aria-hidden className="grid h-24 w-24 place-items-center rounded-full bg-[#DCE6F2] text-2xl font-bold text-brand">{p.initials}</span>
                <h3 className="mt-5 text-lg font-bold">{p.name}</h3>
                <p className="mt-1 text-muted">{p.role}</p>
              </li>
            ))}
          </ul>
          <Cta label={t('team.cta')} mode="contact" />
        </div>
      </Section>

      {/* 7. Security and compliance */}
      <Section id="security" aria-labelledby="security-title">
        <div className="wrap">
          <SectionHead label={t('security.label')} title={t('security.title')} id="security-title" />
          <ul className="mt-12 grid gap-5 md:grid-cols-2">
            {security.map((s) => (
              <li key={s.text} className="flex items-start gap-4 rounded-[20px] border border-line p-6">
                <Icon name={s.icon} size={26} className="mt-0.5 text-ember" />
                <p className="text-lg">{s.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* 8. Getting started, with the news sign-up beside it */}
      <Section id="start" tone="sunk" aria-labelledby="start-title">
        <div className="wrap grid items-start gap-10 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <SectionHead label={t('start.label')} title={t('start.title')} id="start-title" />
            <div className="mt-6 grid gap-4 text-lg">
              <p>{t('start.text')}</p>
              <p className="text-muted">{t('start.access')}</p>
              <p className="text-muted">{t('start.roadmap')}</p>
            </div>
            <Cta text={t('start.ctaText')} label={t('start.cta')} />
          </div>
          <NewsSignup />
        </div>
      </Section>
    </>
  );
}
