'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { Icon } from '@/components/ui/Icon';
import { buttonClass } from '@/components/ui/Button';
import { ContactForm } from './ContactForm';

type Mode = 'demo' | 'waitlist' | 'partner';
const Ctx = createContext<{ open: (m?: Mode) => void }>({ open: () => {} });

export const useContactModal = () => useContext(Ctx);

/** Provides the "Book a demo" modal to the whole site, using the native <dialog> for focus and Esc handling. */
export function ContactModalProvider({ children }: { children: ReactNode }) {
  const t = useTranslations('contact');
  const ref = useRef<HTMLDialogElement>(null);
  const [mode, setMode] = useState<Mode>('demo');
  const [key, setKey] = useState(0);

  const open = useCallback((m: Mode = 'demo') => {
    setMode(m);
    setKey((k) => k + 1); // fresh form each time
    ref.current?.showModal();
  }, []);

  useEffect(() => {
    // Deep link: /#book-a-demo opens the modal (state already defaults to demo)
    if (window.location.hash === '#book-a-demo') ref.current?.showModal();
  }, []);

  const title = mode === 'waitlist' ? t('waitlistTitle') : t('modalTitle');
  const lead = mode === 'waitlist' ? t('waitlistLead') : t('modalLead');

  return (
    <Ctx.Provider value={{ open }}>
      {children}
      <dialog
        ref={ref}
        aria-labelledby="contact-modal-title"
        onClick={(e) => { if (e.target === ref.current) ref.current?.close(); }}
        className="m-auto w-[min(640px,calc(100vw-32px))] max-h-[calc(100dvh-32px)] rounded-xl border border-line bg-surface p-0 text-fg shadow-lift backdrop:bg-ink/50 backdrop:backdrop-blur-sm open:animate-[rise_.3s_var(--ease)]"
      >
        <div className="p-6 sm:p-8">
          <div className="mb-6 flex items-start justify-between gap-6">
            <div>
              <h2 id="contact-modal-title" className="t-h3">{title}</h2>
              <p className="mt-2 text-muted">{lead}</p>
            </div>
            <button
              type="button"
              onClick={() => ref.current?.close()}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full hover:bg-sunk"
              aria-label="Close"
            >
              <Icon name="close" accent={false} size={20} />
            </button>
          </div>
          <ContactForm key={key} mode={mode} source={`modal-${mode}`} />
        </div>
      </dialog>
    </Ctx.Provider>
  );
}

/** A button that opens the modal. Usable inside server components. */
export function ContactButton({ mode = 'demo', variant = 'primary', size = 'md', arrow = false, className, children }: {
  mode?: Mode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'onDark';
  size?: 'md' | 'lg';
  arrow?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const { open } = useContactModal();
  return (
    <button type="button" onClick={() => open(mode)} className={buttonClass({ variant, size, className })}>
      {children}
      {arrow && <Icon name="arrow-right" size={18} accent={false} className="transition-transform group-hover:translate-x-0.5" />}
    </button>
  );
}
