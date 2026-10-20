import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';

type Page = 'home' | 'how' | 'lab' | 'partners' | 'about' | 'legal';

/** Per-page title, description, canonical and hreflang alternates. */
export async function pageMeta(locale: string, page: Page, path: string): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'meta' });
  const localized = (l: string) => (l === routing.defaultLocale ? path : `/${l}${path === '/' ? '' : path}`);
  const title = t(`${page}.title`);
  return {
    title: page === 'home' ? { absolute: title } : title,
    description: t(`${page}.description`),
    alternates: {
      canonical: localized(locale),
      // Danish is scaffolded but not translated yet; only English is advertised
      languages: { en: localized('en'), 'x-default': localized('en') },
    },
    openGraph: { title, description: t(`${page}.description`), url: localized(locale) },
  };
}
