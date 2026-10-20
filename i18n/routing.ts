import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // Add 'da' here once messages/da.json is translated. Until then, Danish URLs
  // would serve English text labelled as Danish, which hurts SEO.
  locales: ['en'],
  defaultLocale: 'en',
  // English lives at "/", Danish at "/da" once it is translated
  localePrefix: 'as-needed',
});

export type Locale = (typeof routing.locales)[number];
