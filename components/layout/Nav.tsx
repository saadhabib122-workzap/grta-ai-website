'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Lockup } from '@/components/brand/Logo';
import { Icon } from '@/components/ui/Icon';
import { ContactButton } from '@/components/contact/ContactModal';
import { ThemeToggle } from './ThemeToggle';
import { cn } from '@/lib/cn';

/* Section anchors on the one-page site. "/#id" also works from the legal page.
   Log in is left out until the platform is confirmed invite-only. */
const LINKS = ['does', 'how', 'get', 'cases', 'team'] as const;

export function Nav() {
  const t = useTranslations('nav');
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <header className={cn('fixed inset-x-0 top-0 z-50 bg-bg/90 backdrop-blur-md transition-shadow duration-300', (scrolled || open) && 'shadow-[0_1px_0_var(--border)]')}>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded-md focus:bg-surface focus:px-3 focus:py-2">
        {t('skip')}
      </a>
      <div className="wrap flex h-[72px] items-center justify-between gap-6">
        <Link href="/" aria-label={t('home')} className="rounded-md">
          <Lockup size={32} />
        </Link>

        <nav aria-label={t('primary')} className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {LINKS.map((l) => (
              <li key={l}>
                <a href={`/#${l}`} className="whitespace-nowrap rounded-full px-3.5 py-2 text-[0.95rem] font-medium text-muted transition-colors hover:bg-sunk hover:text-fg">
                  {t(`links.${l}`)}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <ThemeToggle label={t('theme')} />
          <ContactButton>{t('bookDemo')}</ContactButton>
        </div>

        <button
          type="button"
          className="grid h-11 w-11 place-items-center rounded-full lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? t('close') : t('menu')}
          onClick={() => setOpen((o) => !o)}
        >
          <Icon name={open ? 'close' : 'menu'} />
        </button>
      </div>

      {open && (
        <div id="mobile-menu" className="h-[calc(100dvh-72px)] overflow-y-auto border-t border-line bg-bg lg:hidden">
          <nav aria-label={t('primary')} className="wrap flex flex-col gap-1 py-6">
            {LINKS.map((l) => (
              <a key={l} href={`/#${l}`} onClick={() => setOpen(false)} className="t-h3 rounded-md py-3">
                {t(`links.${l}`)}
              </a>
            ))}
            <ContactButton size="lg" className="mt-6 w-full">{t('bookDemo')}</ContactButton>
            <div className="mt-4"><ThemeToggle label={t('theme')} /></div>
          </nav>
        </div>
      )}
    </header>
  );
}
