import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Mark } from '@/components/brand/Logo';
import { ContactButton } from '@/components/contact/ContactModal';

export function Footer() {
  const t = useTranslations('footer');
  const nav = useTranslations('nav');
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-forest text-snow">
      <div aria-hidden className="threads-bg pointer-events-none absolute inset-0 opacity-25 [mask-image:radial-gradient(ellipse_at_90%_20%,#000_10%,transparent_60%)]" />
      <div className="wrap relative grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr] md:py-20">
        <div>
          <Mark size={56} block="var(--c-ink)" />
          <p className="t-h2 mt-6 max-w-sm">{t('tagline')}</p>
          <p className="mt-3 font-mono text-sm tracking-widest text-fjord">{t('equation')}</p>
        </div>
        <div>
          <p className="t-label mb-4 text-fjord!">{t('explore')}</p>
          <ul className="grid gap-2.5 text-[#DCE3DE]">
            <li><Link className="hover:text-snow" href="/how-it-works">{nav('howItWorks')}</Link></li>
            <li><Link className="hover:text-snow" href="/lab">{nav('lab')}</Link></li>
            <li><Link className="hover:text-snow" href="/partners">{nav('partners')}</Link></li>
            <li><Link className="hover:text-snow" href="/about">{nav('about')}</Link></li>
          </ul>
        </div>
        <div>
          <p className="t-label mb-4 text-fjord!">{t('contact')}</p>
          <ul className="grid gap-2.5 text-[#DCE3DE]">
            <li><a className="hover:text-snow" href="mailto:hello@grta.ai">hello@grta.ai</a></li>
            <li><Link className="hover:text-snow" href="/legal">{t('legal')}</Link></li>
          </ul>
          <ContactButton variant="onDark" className="mt-6">{t('bookDemo')}</ContactButton>
        </div>
      </div>
      <div className="wrap relative flex flex-wrap items-center justify-between gap-3 border-t border-[#2F5245] py-6 text-sm text-[#A9BAB0]">
        <span>{t('rights', { year })}</span>
        <span className="font-display font-semibold text-snow">{t('together')}</span>
      </div>
    </footer>
  );
}
