import React from 'react';
import { ShieldCheck, Scale, Heart, UserX } from 'lucide-react';
import { Language, TRANSLATIONS } from '../lib/translations';

interface TrustProps {
  locale: Language;
}

export default function TrustSafety({ locale }: TrustProps) {
  const t = TRANSLATIONS[locale];

  const safetyCards = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#40798C]" />,
      title: t.verificationTitle,
      desc: t.verificationDesc
    },
    {
      icon: <Scale className="w-6 h-6 text-accent-pink" />,
      title: t.pledgeTitle,
      desc: t.pledgeDesc
    },
    {
      icon: <Heart className="w-6 h-6 text-accent-coral" />,
      title: t.privacyLockedTitle,
      desc: t.privacyLockedDesc
    },
    {
      icon: <UserX className="w-6 h-6 text-[#599da0]" />,
      title: locale === 'en' 
        ? 'Respect and Anti-Harassment Guard'
        : locale === 'ar'
        ? 'درع الحماية من المضايقات والنزاهة'
        : 'درعی ڕێگری لە بێزارکردن و پاکی و ڕاستگۆیی',
      desc: locale === 'en'
        ? 'Conversations that breach respectful boundaries are flagged automatically. Respect is not an option; it is built into our core framework.'
        : locale === 'ar'
        ? 'يتم الكشف التلقائي عن أي محادثة تسيء للآداب والحدود العائلية لضمان جو وقور.'
        : 'ئەو گفتوگۆیانەی کە سنوورە شایستەکان دەبەزێنن بە شێوەیەکی ئۆتۆماتیکی ئاگادار دەکرێنەوە بۆ هێشتنەوەی ژینگەیەکی لەبار.'
    }
  ];

  return (
    <section className="py-16 border-t border-white/20 bg-transparent" id="trust-and-safety">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <p className="text-xs font-mono font-bold tracking-widest text-accent-coral uppercase">
            {locale === 'en' ? 'Trust & Dignity First' : locale === 'ar' ? 'الثقة والوقار أولاً' : 'متمانە و ڕێزلێنان لە پێشینەیە'}
          </p>
          <h2 className="text-3xl font-serif font-black text-warm-charcoal font-display">
            {t.safetyTitle}
          </h2>
          <p className="text-[#6B635B] text-sm sm:text-base font-medium">
            {t.safetySub}
          </p>
        </div>

        {/* Safety grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {safetyCards.map((card, idx) => (
            <div
              key={idx}
              className="bg-white/40 backdrop-blur-xl p-6 rounded-[2rem] border border-white/30 shadow-lg flex flex-col justify-between hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 text-start"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-white/60 backdrop-blur-md border border-white/30 flex items-center justify-center">
                  {card.icon}
                </div>
                <h3 className="text-base font-bold text-warm-charcoal font-serif">{card.title}</h3>
                <p className="text-xs sm:text-sm text-[#6B635B] font-normal leading-relaxed">{card.desc}</p>
              </div>

              <div className="pt-4 border-t border-white/20 mt-5 text-[10px] text-[#40798C] font-semibold tracking-wider font-mono uppercase">
                🛡️ {locale === 'en' ? 'Verified Secure' : locale === 'ar' ? 'موثق وآمن' : 'متمانەپێکراو و پارێزراو'}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
