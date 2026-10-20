import type { ComponentProps, ReactNode } from 'react';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/cn';
import { Icon } from './Icon';

type Variant = 'primary' | 'secondary' | 'ghost' | 'onDark';
type Size = 'md' | 'lg';

const base =
  'group inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-[background,color,box-shadow,transform] duration-200 ease-brand active:translate-y-px disabled:opacity-50 disabled:pointer-events-none';

const variants: Record<Variant, string> = {
  primary: 'bg-brand text-on-brand hover:shadow-lift hover:brightness-110',
  secondary: 'border-[1.5px] border-fg text-fg hover:bg-fg hover:text-bg',
  ghost: 'text-brand px-0! hover:underline underline-offset-4',
  onDark: 'bg-snow text-forest hover:bg-birch',
};

const sizes: Record<Size, string> = {
  md: 'h-11 px-5 text-[0.95rem]',
  lg: 'h-13 px-7 text-base',
};

type Common = { variant?: Variant; size?: Size; arrow?: boolean; className?: string; children: ReactNode };

export function buttonClass({ variant = 'primary', size = 'md', className }: Omit<Common, 'children'>) {
  return cn(base, variants[variant], sizes[size], className);
}

function Arrow() {
  return <Icon name="arrow-right" size={18} accent={false} className="transition-transform duration-200 group-hover:translate-x-0.5" />;
}

export function Button({ variant, size, arrow, className, children, ...rest }: Common & Omit<ComponentProps<'button'>, 'children'>) {
  return (
    <button className={buttonClass({ variant, size, className })} {...rest}>
      {children}
      {arrow && <Arrow />}
    </button>
  );
}

export function ButtonLink({ variant, size, arrow, className, children, ...rest }: Common & Omit<ComponentProps<typeof Link>, 'children'>) {
  return (
    <Link className={buttonClass({ variant, size, className })} {...rest}>
      {children}
      {arrow && <Arrow />}
    </Link>
  );
}
