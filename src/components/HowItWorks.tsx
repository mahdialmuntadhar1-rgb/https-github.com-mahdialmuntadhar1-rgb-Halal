import React from 'react';
import { UserPlus, Settings2, HeartHandshake } from 'lucide-react';
import { Language, TRANSLATIONS } from '../lib/translations';

interface HowItWorksProps {
  locale: Language;
}

export default function HowItWorks({ locale }: HowItWorksProps) {
  const t = TRANSLATIONS[locale];

  const steps = [
    {
      icon: <UserPlus className="w-6 h-6 text-accent-coral" />,
      title: t.step1Title,
      description: t.step1Desc,
    },
    {
      icon: <Settings2 className="w-6 h-6 text-accent-pink" />,
      title: t.step2Title,
      description: t.step2Desc,
    },
    {
      icon: <HeartHandshake className="w-6 h-6 text-[#40798C]" />,
      title: t.step3Title,
      description: t.step3Desc,
    },
  ];

  return (
    <section className="py-16 border-y border-white/20 bg-transparent" id="how-it-works">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <p className="text-xs font-mono font-bold tracking-widest text-accent-coral uppercase">
            {locale === 'en' ? 'Process Overview' : locale === 'ar' ? 'نظرة عامة على العملية' : 'تێڕوانینی گشتی پڕۆسەکە'}
          </p>
          <h2 className="text-3xl font-serif font-black text-warm-charcoal font-display">
            {t.howItWorksTitle}
          </h2>
          <p className="text-[#6B635B] text-sm sm:text-base font-medium">
            {t.howItWorksSub}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {steps.map((step, idx) => (
            <div 
              key={idx} 
              className="relative bg-white/40 backdrop-blur-xl p-6 rounded-[2rem] border border-white/30 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 text-start"
            >
              <div className="w-12 h-12 bg-white/60 backdrop-blur-md rounded-2xl border border-white/30 flex items-center justify-center mb-4">
                {step.icon}
              </div>
              <h3 className="text-lg font-bold text-warm-charcoal mb-2 font-serif">{step.title}</h3>
              <p className="text-xs sm:text-sm text-[#6B635B] leading-relaxed font-normal">{step.description}</p>
              
              {idx < 2 && (
                <div className="hidden md:block absolute top-[20%] right-[-1rem] rtl:right-auto rtl:left-[-1rem] transform translate-y-1/2 z-20 text-[#6B635B]/40 font-sans text-xl font-bold">
                  ➔
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
