'use client';

import { Icon } from '@/components/ui/Icon';

/** Inline script that sets data-theme before paint, so there is no flash. */
export const themeScript = `(function(){try{var t=localStorage.getItem('grta-theme');if(t!=='light'&&t!=='dark'){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme='light'}})()`;

export function ThemeToggle({ label }: { label: string }) {
  function toggle() {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('grta-theme', next); } catch { /* storage may be blocked */ }
  }
  return (
    <button type="button" onClick={toggle} aria-label={label} title={label} className="grid h-10 w-10 place-items-center rounded-full text-muted hover:bg-sunk hover:text-fg">
      <Icon name="theme" size={20} accent={false} />
    </button>
  );
}
