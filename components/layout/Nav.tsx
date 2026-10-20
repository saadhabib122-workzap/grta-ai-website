'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { Lockup } from '@/components/brand/Logo';
import { Icon } from '@/components/ui/Icon';
import { ContactButton } from '@/components/contact/ContactModal';
import { ThemeToggle } from './ThemeToggle';
import { cn } from '@/lib/cn';

const LINKS = [
  { href: '/how-it-works', key: 'howItWorks' },
  { href: '/lab', key: 'lab' },
  { href: '/partners', key: 'partners' },
  { href: '/about', key: 'about' },
] as const;

export function Nav() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the mobile menu when the route changes
  const [prevPath, setPrevPath] = useState(pathname);
  if (pathname !== prevPath) { setPrevPath(pathname); setOpen(false); }
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-[background,box-shadow,backdrop-filter] duration-300',
        scrolled || open ? 'bg-bg/85 shadow-[0_1px_0_var(--border)] backdrop-blur-md' : 'bg-transparent max-lg:bg-bg/85 max-lg:backdrop-blur-md',
      )}
    >
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded-md focus:bg-surface focus:px-3 focus:py-2">
        {t('skip')}
      </a>
      <div className={cn('wrap grid h-[72px] grid-cols-[1fr_auto] items-center gap-6 transition-[margin] duration-300 lg:grid-cols-[1fr_auto_1fr]', !scrolled && 'lg:mt-[calc(var(--layout-frame)+6px)]')}>
        <Link href="/" aria-label={t('home')} className="justify-self-start rounded-md">
          <Lockup size={32} />
        </Link>

        <nav aria-label={t('primary')} className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {LINKS.map((l) => {
              const active = pathname.startsWith(l.href);
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'relative whitespace-nowrap rounded-full px-3.5 py-2 text-[0.95rem] font-medium transition-colors hover:text-fg',
                      active ? 'text-fg' : 'text-muted',
                    )}
                  >
                    {t(l.key)}
                    {active && <span className="absolute inset-x-3.5 -bottom-0.5 h-px bg-thread" />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hidden items-center gap-2 justify-self-end lg:flex">
          <ThemeToggle label={t('theme')} />
          <ContactButton mode="waitlist" variant="ghost" className="mr-3 text-fg!">{t('logIn')}</ContactButton>
          <ContactButton>{t('bookDemo')}</ContactButton>
        </div>

        <button
          type="button"
          className="grid h-11 w-11 place-items-center justify-self-end rounded-full lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? t('close') : t('menu')}
          onClick={() => setOpen((o) => !o)}
        >
          <Icon name={open ? 'close' : 'menu'} accent={false} />
        </button>
      </div>

      {open && (
        <div id="mobile-menu" className="h-[calc(100dvh-72px)] overflow-y-auto border-t border-line bg-bg lg:hidden">
          <nav aria-label={t('primary')} className="wrap flex flex-col gap-1 py-6">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="t-h3 rounded-md py-3" aria-current={pathname.startsWith(l.href) ? 'page' : undefined}>
                {t(l.key)}
              </Link>
            ))}
            <div className="mt-6 flex flex-col gap-3">
              <ContactButton size="lg" className="w-full">{t('bookDemo')}</ContactButton>
              <ContactButton mode="waitlist" variant="secondary" size="lg" className="w-full">{t('logIn')}</ContactButton>
            </div>
            <div className="mt-4"><ThemeToggle label={t('theme')} /></div>
          </nav>
        </div>
      )}
    </header>
  );
}
