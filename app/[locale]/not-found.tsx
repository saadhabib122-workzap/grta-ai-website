import { useTranslations } from 'next-intl';
import { ButtonLink } from '@/components/ui/Button';
import { Mark } from '@/components/brand/Logo';

export default function NotFound() {
  const t = useTranslations('notFound');
  return (
    <section className="wrap grid min-h-[70vh] place-items-center pt-[120px] pb-20 text-center">
      <div className="flex flex-col items-center">
        <Mark size={88} living />
        <h1 className="t-h2 mt-8">{t('title')}</h1>
        <p className="t-lead mt-3">{t('text')}</p>
        <ButtonLink href="/" arrow className="mt-8">{t('home')}</ButtonLink>
      </div>
    </section>
  );
}
