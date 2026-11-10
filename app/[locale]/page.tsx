import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Icon } from '@/components/ui/Icon';
import { Section, SectionHead } from '@/components/ui/Section';
import { ContactButton } from '@/components/contact/ContactModal';
import type { Mode } from '@/components/contact/ContactForm';
import { NewsSignup } from '@/components/contact/NewsSignup';
import { BeforeAfter } from '@/components/home/BeforeAfter';
import { cn } from '@/lib/cn';
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
    <div className="mt-16 flex flex-wrap items-center gap-x-8 gap-y-5">
      {text && <p className="max-w-xl text-lg font-medium leading-relaxed">{text}</p>}
      <ContactButton mode={mode} variant={onDark ? 'onDark' : 'primary'} size="lg" arrow>{label}</ContactButton>
    </div>
  );
}

/** A section illustration, framed the same way everywhere. */
function Illustration({ name, alt }: { name: string; alt: string }) {
  return (
    <div className="overflow-hidden rounded-[28px] bg-white shadow-soft ring-1 ring-line">
      <Image src={`/illustrations/${name}.webp`} alt={alt} width={1800} height={1005} sizes="(min-width: 1024px) 50vw, 100vw" className="h-auto w-full" />
    </div>
  );
}

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const does = t.raw('does.items') as Item[];
  const steps = t.raw('how.steps') as Array<{ letter: string; title: string; text: string }>;
  const main = t.raw('get.main') as Item[];
  const more = t.raw('get.more') as Item[];
  const cases = t.raw('cases.items') as Array<{ title: string; text: string }>;
  const people = t.raw('team.people') as Array<{ name: string; role: string; photo: string }>;
  const security = t.raw('security.items') as Array<{ icon: string; text: string }>;

  return (
    <>
      {/* 1. What GRTA does */}
      <section aria-labelledby="hero-title" className="pt-[calc(72px+3.5rem)] pb-24 md:pt-[calc(72px+6rem)] md:pb-32">
        <div className="wrap grid items-center gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div>
            <h1 id="hero-title" className="t-h1 lg:text-[clamp(2.6rem,1rem+3.2vw,4.25rem)]!">{t('hero.title')}</h1>
            <p className="t-lead mt-8 max-w-xl">{t('hero.lead')}</p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <ContactButton size="lg" arrow>{t('hero.cta')}</ContactButton>
              <a href="#how" className="inline-flex h-13 items-center rounded-full px-6 font-semibold text-brand hover:bg-sunk">{t('hero.ctaSecondary')}</a>
            </div>
          </div>
          <BeforeAfter />
        </div>
      </section>

      <Section id="does" tone="sunk" aria-labelledby="does-title">
        <div className="wrap">
          <SectionHead title={t('does.title')} id="does-title" />
          <ul className="mt-16 grid gap-12 md:grid-cols-3 md:gap-10 lg:gap-16">
            {does.map((it) => (
              <li key={it.title} className="border-t border-line pt-8">
                <Icon name={it.icon} size={36} className="text-ember" />
                <h3 className="t-h3 mt-6">{it.title}</h3>
                <p className="mt-3 leading-relaxed text-muted">{it.text}</p>
              </li>
            ))}
          </ul>
          <div className="mt-24 grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <div className="grid gap-6 text-xl leading-relaxed">
              <p>{t('does.why')}</p>
              <p className="font-semibold text-brand">{t('does.cube')}</p>
            </div>
            <Illustration name="puzzle" alt={t('illustrations.puzzle')} />
          </div>
          <Cta text={t('does.ctaText')} label={t('does.cta')} />
        </div>
      </Section>

      {/* 2. How it works: ABCD as a process flow */}
      <Section id="how" aria-labelledby="how-title">
        <div className="wrap">
          <SectionHead title={t('how.title')} id="how-title" />
          <ol className="mt-16 grid gap-12 lg:grid-cols-4 lg:gap-10">
            {steps.map((s, i) => (
              <li key={s.letter} className="relative max-lg:pl-20">
                {i < steps.length - 1 && (
                  /* The line to the next step: across on desktop, down on mobile */
                  <span aria-hidden className="absolute bg-[#F6C9B5] max-lg:top-16 max-lg:-bottom-10 max-lg:left-7 max-lg:w-0.5 lg:top-7 lg:right-[-2.5rem] lg:left-16 lg:h-0.5" />
                )}
                <span className="grid h-14 w-14 place-items-center rounded-full bg-ember text-xl font-bold text-white max-lg:absolute max-lg:top-0 max-lg:left-0">{s.letter}</span>
                <h3 className="t-h3 lg:mt-8">{s.title}</h3>
                <p className="mt-3 leading-relaxed text-muted">{s.text}</p>
              </li>
            ))}
          </ol>
          <p className="mt-12 text-sm text-muted">{t('how.smallPrint')}</p>

          {/* shortcut: placeholder until Andi sends platform screenshots; swap in a next/image */}
          <div role="img" aria-label={t('how.screenshot')} className="mx-auto mt-20 max-w-4xl overflow-hidden rounded-[28px] bg-sunk ring-1 ring-line">
            <div className="flex gap-1.5 bg-white px-5 py-3.5">
              <span className="h-2.5 w-2.5 rounded-full bg-line" /><span className="h-2.5 w-2.5 rounded-full bg-line" /><span className="h-2.5 w-2.5 rounded-full bg-line" />
            </div>
            <p className="grid aspect-[16/5] place-items-center p-6 text-center text-muted">{t('how.screenshotNote')}</p>
          </div>
          <Cta label={t('how.cta')} />
        </div>
      </Section>

      {/* 3. What you get: three main boxes, then three more */}
      <Section id="get" tone="sunk" aria-labelledby="get-title">
        <div className="wrap">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <SectionHead title={t('get.title')} lead={t('get.lead')} id="get-title" />
            <Illustration name="building" alt={t('illustrations.building')} />
          </div>
          <ul className="mt-20 grid gap-6 md:grid-cols-3">
            {main.map((it) => (
              <li key={it.title} className="rounded-[28px] bg-white p-8 shadow-soft lg:p-10">
                <Icon name={it.icon} size={36} className="text-ember" />
                <h3 className="t-h3 mt-8">{it.title}</h3>
                <p className="mt-3 leading-relaxed text-muted">{it.text}</p>
              </li>
            ))}
          </ul>
          <h3 className="mt-20 text-xl font-bold">{t('get.moreTitle')}</h3>
          <ul className="mt-6 grid gap-6 md:grid-cols-3">
            {more.map((it) => (
              <li key={it.title} className="rounded-[24px] p-8 ring-1 ring-line">
                <Icon name={it.icon} size={28} className="text-ember" />
                <h4 className="mt-5 text-lg font-bold">{it.title}</h4>
                <p className="mt-2 leading-relaxed text-muted">{it.text}</p>
              </li>
            ))}
          </ul>
          <Cta text={t('get.ctaText')} label={t('get.cta')} />
        </div>
      </Section>

      {/* 4. Greater together */}
      <Section tone="brand" aria-labelledby="together-title">
        <div className="wrap grid items-center gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          <div>
            <h2 id="together-title" className="t-h2">{t('together.title')}</h2>
            <p className="mt-8 text-xl leading-relaxed">{t('together.text')}</p>
            <p className="mt-5 text-xl leading-relaxed text-muted">{t('together.meaning')}</p>
            <Cta text={t('together.ctaText')} label={t('together.cta')} mode="cocreate" onDark />
          </div>
          <Illustration name="staircase" alt={t('illustrations.staircase')} />
        </div>
      </Section>

      {/* 5. Customer cases, as quotes in italics */}
      <Section id="cases" aria-labelledby="cases-title">
        <div className="wrap">
          <SectionHead title={t('cases.title')} id="cases-title" />
          <ul className="mt-16 grid gap-14 md:grid-cols-3 md:gap-12">
            {cases.map((c) => (
              <li key={c.title} className="flex flex-col border-t-2 border-ember pt-8">
                <blockquote className="text-xl leading-relaxed italic">“{c.text}”</blockquote>
                <p className="mt-6 font-semibold text-brand">{c.title}</p>
              </li>
            ))}
          </ul>
          <Cta label={t('cases.cta')} mode="contact" />
        </div>
      </Section>

      {/* 6. Who we are */}
      <Section id="team" tone="sunk" aria-labelledby="team-title">
        <div className="wrap">
          <SectionHead title={t('team.title')} lead={t('team.lead')} id="team-title" />
          <ul className="mt-16 grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
            {people.map((p) => (
              <li key={p.name}>
                <Image src={p.photo} alt={p.name} width={176} height={176} className="aspect-square w-full max-w-44 rounded-[28px] object-cover shadow-soft" />
                <h3 className="mt-6 text-lg font-bold">{p.name}</h3>
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
          <SectionHead title={t('security.title')} id="security-title" />
          <ul className="mt-16 grid gap-x-16 md:grid-cols-2">
            {security.map((s, i) => (
              <li key={s.text} className={cn('flex items-start gap-5 border-t border-line py-8', i > 1 && 'md:border-b')}>
                <Icon name={s.icon} size={28} className="mt-0.5 text-ember" />
                <p className="text-lg leading-relaxed">{s.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* 8. Getting started, with the news sign-up beside it */}
      <Section id="start" tone="sunk" aria-labelledby="start-title">
        <div className="wrap grid items-start gap-14 lg:grid-cols-[1.3fr_1fr] lg:gap-20">
          <div>
            <SectionHead title={t('start.title')} id="start-title" />
            <div className="mt-8 grid gap-5 text-lg leading-relaxed">
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
