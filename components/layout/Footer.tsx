import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Lockup } from '@/components/brand/Logo';

export function Footer() {
  const t = useTranslations('footer');
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-sunk">
      <div className="wrap flex flex-wrap items-center justify-between gap-6 py-10 text-sm text-muted">
        <div className="flex items-center gap-4">
          <Lockup size={28} className="text-fg" />
          <span className="font-semibold text-fg">{t('tagline')}</span>
        </div>
        <nav aria-label={t('contact')} className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <a className="hover:text-fg" href="mailto:hello@grta.ai">hello@grta.ai</a>
          <Link className="hover:text-fg" href="/legal">{t('legal')}</Link>
          <span>{t('rights', { year })}</span>
        </nav>
      </div>
    </footer>
  );
}
