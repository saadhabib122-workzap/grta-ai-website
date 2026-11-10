import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export function Section({ id, tone = 'default', className, children, ...rest }: {
  id?: string;
  tone?: 'default' | 'sunk' | 'brand';
  className?: string;
  children: ReactNode;
  'aria-labelledby'?: string;
}) {
  const tones = {
    default: '',
    sunk: 'bg-sunk',
    // Navy block with light text
    brand: 'bg-brand text-white [--text-muted:#C9D6E6] [--tag:#FFB48F] [--border:#3A6597]',
  };
  return (
    <section id={id} className={cn('relative py-20 md:py-28', tones[tone], className)} {...rest}>
      {children}
    </section>
  );
}

export function SectionHead({ label, title, lead, id, align = 'left', className, titleClass }: {
  label?: string;
  title: ReactNode;
  lead?: ReactNode;
  id?: string;
  align?: 'left' | 'center';
  className?: string;
  titleClass?: string;
}) {
  return (
    <div className={cn('max-w-3xl', align === 'center' && 'mx-auto text-center', className)}>
      {label && <p className="t-label mb-4">{label}</p>}
      <h2 id={id} className={cn('t-h2', titleClass)}>{title}</h2>
      {lead && <p className="t-lead mt-5">{lead}</p>}
    </div>
  );
}
