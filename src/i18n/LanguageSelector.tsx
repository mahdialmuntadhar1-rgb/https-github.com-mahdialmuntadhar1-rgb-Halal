import React from 'react';
import { useLanguage } from './LanguageProvider';
import { languageMeta, type Language } from './translations';

const options: Language[] = ['ar', 'ku', 'en'];

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex w-full flex-col gap-4">
      {options.map((option) => {
        const active = language === option;

        return (
          <button
            key={option}
            type="button"
            onClick={() => setLanguage(option)}
            className={
              active
                ? 'w-full rounded-3xl bg-gradient-to-r from-emerald-950 to-yellow-500 px-6 py-5 text-lg font-black text-white shadow-lg'
                : 'w-full rounded-3xl bg-gradient-to-r from-emerald-950/80 to-yellow-500/80 px-6 py-5 text-lg font-black text-white shadow'
            }
          >
            {languageMeta[option].label}
          </button>
        );
      })}
    </div>
  );
}