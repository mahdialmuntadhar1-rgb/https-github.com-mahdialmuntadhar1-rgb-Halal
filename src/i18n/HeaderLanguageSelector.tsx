import React from 'react';
import { useLanguage } from './LanguageProvider';
import type { Language } from './translations';

const options: Array<{ id: Language; label: string }> = [
  { id: 'ar', label: 'العربية' },
  { id: 'ku', label: 'کوردی' },
  { id: 'en', label: 'English' },
];

export function HeaderLanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white/90 p-1 shadow-sm">
      {options.map((option) => {
        const active = language === option.id;

        return (
          <button
            key={option.id}
            type="button"
            onClick={() => setLanguage(option.id)}
            aria-pressed={active}
            className={
              active
                ? 'rounded-xl bg-slate-900 px-3 py-2 text-xs font-bold text-white'
                : 'rounded-xl bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100'
            }
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
