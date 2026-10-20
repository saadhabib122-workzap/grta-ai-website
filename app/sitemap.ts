import type { MetadataRoute } from 'next';

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://grta.ai';
const PAGES = ['', '/how-it-works', '/lab', '/partners', '/about', '/legal'];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map((p) => ({
    url: `${SITE}${p}`,
    lastModified: new Date(),
    changeFrequency: p === '/lab' ? 'weekly' : 'monthly',
    priority: p === '' ? 1 : p === '/legal' ? 0.3 : 0.8,
  }));
}
