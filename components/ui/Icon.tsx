import { cn } from '@/lib/cn';

/** Icon from the brand sprite (brand/icons → public/brand/icons.svg). */
export function Icon({ name, size = 24, accent = true, className, label }: {
  name: string;
  size?: number;
  /** Show the ember accent stroke. Off = single colour. */
  accent?: boolean;
  className?: string;
  label?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('shrink-0', className)}
      style={accent ? ({ ['--icon-accent' as string]: 'var(--accent)' }) : undefined}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <use href={`/brand/icons.svg#i-${name}`} />
    </svg>
  );
}
