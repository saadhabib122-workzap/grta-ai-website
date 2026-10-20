import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { NineThreeOne } from '@/components/home/NineThreeOne';
import { AvailabilityArtifact, BriefArtifact, GapArtifact, NetworkArtifact, PulseArtifact, TranslateArtifact, VariantsArtifact } from '@/components/how/Artifacts';
import { ButtonLink } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { ChapterNav, PageHero } from '@/components/ui/PageHero';
import { Section, SectionHead } from '@/components/ui/Section';
import { pageMeta } from '@/lib/meta';
import { cn } from '@/lib/cn';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMeta(locale, 'how', '/how-it-works');
}

type Step = { icon: string; title: string; text: string };

/* One animated product mock-up per journey step, in the same order as how.journey.steps */
const ARTIFACTS = [BriefArtifact, GapArtifact, TranslateArtifact, AvailabilityArtifact, VariantsArtifact, PulseArtifact];

export default async function HowItWorks({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('how');

  const steps = t.raw('journey.steps') as Step[];
  const scout = t.raw('journey.scout.items') as Array<{ title: string; text: string }>;
  const phases = t.raw('method.phases') as Array<{ time: string; title: string; text: string }>;
  const format = t.raw('method.format') as Array<{ label: string; minutes: number; strong?: boolean }>;
  const comps = t.raw('method.competencies') as Array<{ icon: string; name: string }>;
  const aiItems = t.raw('method.aiRole.items') as string[];
  const cookbook = t.raw('rollout.cookbook') as Array<{ title: string; text: string }>;
  const profile = t.raw('rollout.profile') as string[];
  const principles = t.raw('rollout.networkPrinciples') as Array<{ title: string; text: string }>;
  const total = format.reduce((s, f) => s + f.minutes, 0);
  const th = await getTranslations('home.hiit');
  const hiitSteps = th.raw('steps') as Array<{ n: string; title: string }>;
  const hiitLabels = hiitSteps.map((x) => `${x.n} ${x.title}`) as [string, string, string];

  return (
    <>
      <PageHero label={t('hero.label')} title={t('hero.title')} lead={t('hero.lead')} slot="how-hiit" alt={t('hero.alt')} focus="50% 60%" />

      <ChapterNav
        label={t('hero.label')}
        items={[
          { id: 'journey', label: t('chapters.journey') },
          { id: 'method', label: t('chapters.method') },
          { id: 'rollout', label: t('chapters.rollout') },
        ]}
      />

      {/* ── Chapter 1: Journey ─────────────────────────── */}
      <Section id="journey" aria-labelledby="journey-title">
        <div className="wrap">
          <SectionHead label={t('journey.label')} title={t('journey.title')} lead={t('journey.lead')} id="journey-title" />
          <ol className="relative mt-16 grid gap-16 md:gap-24">
            {/* the thread that runs through the journey */}
            <span aria-hidden className="absolute top-6 bottom-6 left-6 hidden w-px bg-gradient-to-b from-thread/0 via-thread/50 to-thread/0 lg:left-1/2 lg:block" />
            {steps.map((s, i) => {
              const Artifact = ARTIFACTS[i];
              return (
                <li key={s.title} className="relative grid items-center gap-8 lg:grid-cols-2 lg:gap-24">
                  <span aria-hidden className="absolute top-1/2 left-1/2 hidden h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-bg bg-thread lg:block" />
                  <div className={cn('max-w-xl', i % 2 === 1 && 'lg:order-2')}>
                    <div className="flex items-center gap-3">
                      <span className="grid h-12 w-12 place-items-center rounded-full border border-line bg-surface">
                        <Icon name={s.icon} size={24} />
                      </span>
                      <span className="font-mono text-sm text-tag">0{i + 1}</span>
                    </div>
                    <h3 className="t-h2 mt-5 text-[clamp(1.5rem,1.2rem+1vw,2.1rem)]!">{s.title}</h3>
                    <p className="t-lead mt-3">{s.text}</p>
                  </div>
                  <div className={cn('w-full max-w-[520px] lg:justify-self-center', i % 2 === 1 && 'lg:order-1')}>
                    {Artifact && <Artifact />}
                  </div>
                </li>
              );
            })}
          </ol>

          <div className="mt-24">
            <h3 className="t-h2 text-[clamp(1.5rem,1.2rem+1vw,2.1rem)]!">{t('journey.scout.title')}</h3>
            <p className="t-lead mt-3">{t('journey.scout.text')}</p>
            <ul className="mt-8 grid gap-5 md:grid-cols-3">
              {scout.map((s) => (
                <li key={s.title} className="card p-6">
                  <Icon name="scout" size={26} />
                  <h4 className="mt-4 font-display text-lg font-bold">{s.title}</h4>
                  <p className="mt-2 text-sm text-muted">{s.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* ── Chapter 2: Method ──────────────────────────── */}
      <Section id="method" tone="forest" aria-labelledby="method-title">
        <div className="wrap">
          <SectionHead label={t('method.label')} title={t('method.title')} lead={t('method.lead')} id="method-title" />

          <ol className="mt-12 grid gap-px overflow-hidden rounded-xl bg-[#2F5245] sm:grid-cols-2 lg:grid-cols-4">
            {phases.map((p, i) => (
              <li key={p.title} className="bg-forest p-6">
                <p className="font-mono text-xs uppercase tracking-widest text-fjord">{p.time}</p>
                <p className="mt-4 font-display text-4xl font-extrabold">{i + 1}</p>
                <h3 className="mt-2 font-display text-lg font-bold">{p.title}</h3>
                <p className="mt-2 text-sm text-[#C9D3CC]">{p.text}</p>
              </li>
            ))}
          </ol>

          <div className="mt-14">
            <h3 className="t-h3">{t('method.formatTitle')}</h3>
            <div className="mt-5 flex h-auto flex-col gap-1 overflow-hidden rounded-lg text-xs sm:h-20 sm:flex-row sm:gap-0.5">
              {format.map((f, i) => (
                <div
                  key={i}
                  className={cn('flex items-center px-3 py-2 sm:px-2', f.strong ? 'bg-[#A8C7A0] font-semibold text-ink' : 'bg-[#2C4A3F] text-[#DCE3DE]')}
                  style={{ flexGrow: f.minutes, flexBasis: 0 }}
                  title={`${f.label}: ${f.minutes < 2 ? '90 sec' : `${Math.round(f.minutes * 10) / 10} min`}`}
                >
                  <span className="leading-tight">{f.label}</span>
                  <span className="ml-auto pl-2 font-mono opacity-70 sm:hidden">{f.minutes < 2 ? '90s' : `${Math.round(f.minutes)}m`}</span>
                </div>
              ))}
            </div>
            <div className="mt-2 hidden justify-between font-mono text-xs text-[#9FB2A8] sm:flex">
              <span>0</span><span>{Math.round(total / 2)} min</span><span>{Math.round(total)} min</span>
            </div>
          </div>

          <div className="mt-14 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <h3 className="t-h3">{t('method.competenciesTitle')}</h3>
              <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {comps.map((c, i) => (
                  <li key={c.name} className="flex items-center gap-3 rounded-lg border border-[#2F5245] px-3 py-3 text-sm">
                    <span className="font-mono text-xs text-fjord">{i + 1}</span>
                    <Icon name={c.icon} size={20} className="text-snow" />
                    {c.name}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl bg-[#18332A] p-6">
              <h3 className="t-h3 flex items-center gap-2"><Icon name="spark" size={22} />{t('method.aiRole.title')}</h3>
              <ul className="mt-4 grid gap-2.5 text-[#DCE3DE]">
                {aiItems.map((a) => <li key={a} className="flex gap-2.5"><Icon name="check" size={18} accent={false} className="mt-0.5 text-fjord" />{a}</li>)}
              </ul>
            </div>
          </div>

          <div className="mt-14 grid items-center gap-10 rounded-xl border border-[#2F5245] bg-[#18332A] p-6 md:p-10 lg:grid-cols-[1fr_1.3fr]">
            <div>
              <h3 className="t-h3">{t('method.flowTitle')}</h3>
              <p className="mt-3 text-[#C9D3CC]">{t('method.flowText')}</p>
              <ButtonLink href="/lab#hiit" variant="onDark" arrow className="mt-8">{t('method.cta')}</ButtonLink>
            </div>
            <NineThreeOne labels={hiitLabels} />
          </div>
        </div>
      </Section>

      {/* ── Chapter 3: Rolling it out ──────────────────── */}
      <Section id="rollout" aria-labelledby="rollout-title">
        <div className="wrap">
          <SectionHead label={t('rollout.label')} title={t('rollout.title')} lead={t('rollout.lead')} id="rollout-title" />

          <div className="mt-14">
            <h3 className="t-h3">{t('rollout.cookbookTitle')}</h3>
            <p className="mt-1 text-muted">{t('rollout.cookbookLead')}</p>
            <ol className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-5">
              {cookbook.map((c, i) => (
                <li key={c.title} className={cn('card relative p-4 sm:p-5', i === 9 && 'border-accent/40')}>
                  <span className={cn('grid h-8 w-8 place-items-center rounded-full font-mono text-sm', i === 9 ? 'bg-accent text-snow' : 'bg-sunk text-fg')}>{i + 1}</span>
                  <h4 className="mt-3 font-display font-bold leading-snug">{c.title}</h4>
                  <p className="mt-1.5 text-sm text-muted">{c.text}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-16 grid gap-6 rounded-xl bg-sunk p-6 md:grid-cols-[1fr_1.4fr] md:p-10">
            <div>
              <h3 className="t-h3">{t('rollout.profileTitle')}</h3>
              <p className="mt-2 text-muted">{t('rollout.profileLead')}</p>
            </div>
            <ul className="grid gap-2 sm:grid-cols-2">
              {profile.map((p) => (
                <li key={p} className="flex items-center gap-3 rounded-md bg-surface px-4 py-3 text-[0.95rem]">
                  <span className="h-2 w-2 shrink-0 rounded-full bg-thread" />{p}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-16 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <NetworkArtifact guideLabel={t('rollout.guide')} memberLabel={t('rollout.member')} />
            <div>
              <h3 className="t-h2 text-[clamp(1.5rem,1.2rem+1vw,2.1rem)]!">{t('rollout.networkTitle')}</h3>
              <p className="t-lead mt-3">{t('rollout.networkLead')}</p>
              <ul className="mt-8 grid gap-4 sm:grid-cols-2">
                {principles.map((p) => (
                  <li key={p.title} className="flex gap-3">
                    <Icon name="check" size={20} accent={false} className="mt-0.5 text-tag" />
                    <span><span className="font-semibold">{p.title}.</span> <span className="text-muted">{p.text}</span></span>
                  </li>
                ))}
              </ul>
              <ButtonLink href="/lab#network" variant="secondary" arrow className="mt-8">{t('rollout.networkCta')}</ButtonLink>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
