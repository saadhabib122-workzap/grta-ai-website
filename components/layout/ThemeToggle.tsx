'use client';

import { Icon } from '@/components/ui/Icon';

/** Inline script that sets data-theme before paint, so there is no flash.
    Light unless the visitor chose dark: the briefing wants a light site by default. */
export const themeScript = `(function(){var t='light';try{if(localStorage.getItem('grta-theme')==='dark')t='dark'}catch(e){}document.documentElement.dataset.theme=t})()`;

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
