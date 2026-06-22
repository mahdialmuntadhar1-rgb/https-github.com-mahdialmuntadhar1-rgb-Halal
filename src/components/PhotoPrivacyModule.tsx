import React, { useState } from 'react';
import { Lock, Unlock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { Language, TRANSLATIONS } from '../lib/translations';

interface PhotoPrivacyProps {
  locale: Language;
}

export default function PhotoPrivacyModule({ locale }: PhotoPrivacyProps) {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const t = TRANSLATIONS[locale];

  return (
    <section className="py-16 border-b border-white/20 bg-transparent" id="photo-privacy-rules">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Explanation Area */}
          <div className="lg:col-span-6 space-y-6 text-start">
            <div className="inline-flex items-center space-x-1.5 rtl:space-x-reverse bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 text-xs font-bold tracking-widest uppercase shadow-sm text-[#40798C]">
              <Lock className="w-3.5 h-3.5" />
              <span>{locale === 'en' ? 'Differentiator Feature' : locale === 'ar' ? 'ميزة تفاضلية أساسية' : 'تایبەتمەندی جیاکەرەوە'}</span>
            </div>
            
            <h2 className="text-3xl font-serif font-black text-warm-charcoal tracking-tight font-display">
              {t.privacyTitle}
            </h2>
            
            <p className="text-[#6B635B] text-sm sm:text-base leading-relaxed">
              {t.privacySub}
            </p>

            <ul className="space-y-3.5 text-sm font-medium text-[#4A443F]">
              <li className="flex items-start space-x-2.5 rtl:space-x-reverse">
                <ShieldCheck className="w-5 h-5 text-[#40798C] shrink-0 mt-0.5" />
                <span><strong>{t.rule1Title}:</strong> {t.rule1Desc}</span>
              </li>
              <li className="flex items-start space-x-2.5 rtl:space-x-reverse">
                <ShieldCheck className="w-5 h-5 text-[#40798C] shrink-0 mt-0.5" />
                <span><strong>{t.rule2Title}:</strong> {t.rule2Desc}</span>
              </li>
              <li className="flex items-start space-x-2.5 rtl:space-x-reverse">
                <ShieldCheck className="w-5 h-5 text-[#40798C] shrink-0 mt-0.5" />
                <span><strong>{t.rule3Title}:</strong> {t.rule3Desc}</span>
              </li>
            </ul>

            <div className="p-4 bg-white/40 backdrop-blur-md rounded-2xl border border-white/30 flex items-center space-x-3 rtl:space-x-reverse shadow-inner">
              <div className="w-2.5 h-2.5 rounded-full bg-[#40798C] shrink-0 animate-ping" />
              <p className="text-xs font-bold text-[#40798C]">
                {locale === 'en' 
                  ? '"98% of families surveyed preferred this controlled-release setup."' 
                  : locale === 'ar' 
                  ? '"٩٨٪ من العائلات التي شملها الاستطلاع فضلت هذا الإعداد للخصوصية والتحكم."' 
                  : '"٪٩٨ی ئەو خێزانانەی ڕاپرسییان لەگەڵ کراوە، ئەم ڕێکخستنی کۆنترۆڵکردنەیان پێ باشتر بووە."'}
              </p>
            </div>
          </div>

          {/* Interactive Screen Simulator */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="w-full max-w-sm bg-white/40 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/30 shadow-2xl space-y-6 relative text-start">
              
              <div className="flex justify-between items-center pb-4 border-b border-white/30">
                <h4 className="text-sm font-bold text-warm-charcoal">
                  {locale === 'en' ? 'Privacy Sandbox Simulator' : locale === 'ar' ? 'مُحاكي خصوصية الصور' : 'سیمیولەتەری پاراستنی وێنە'}
                </h4>
                <div className="text-[10px] bg-accent-coral/10 text-accent-coral font-bold px-2.5 py-0.5 rounded-full border border-accent-coral/20">
                  {locale === 'en' ? 'WOMAN PERSPECTIVE' : locale === 'ar' ? 'منظور المرأة' : 'تێڕوانینی ئافرەت'}
                </div>
              </div>

              {/* Sample Profile representation */}
              <div className="bg-white/40 backdrop-blur-sm p-4 rounded-3xl border border-white/30 space-y-4">
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  {/* Blurred Portrait vs Visible */}
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-inner border border-white/30 shrink-0">
                    <img
                      src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400"
                      alt="Noor"
                      className={`w-full h-full object-cover transition-all duration-700 ${
                        isUnlocked ? 'filter-none scale-100' : 'filter blur-[10px] scale-105'
                      }`}
                      referrerPolicy="no-referrer"
                    />
                    <div className={`absolute inset-0 bg-stone-900/15 flex items-center justify-center transition-opacity duration-500 ${
                      isUnlocked ? 'opacity-0' : 'opacity-100'
                    }`}>
                      <Lock className="w-4 h-4 text-white drop-shadow" />
                    </div>
                  </div>

                  <div className="text-start">
                    <h5 className="font-bold text-warm-charcoal text-sm">
                      {locale === 'en' ? 'Noor (Pharmacist, Baghdad)' : locale === 'ar' ? 'نور (صيدلانية، بغداد)' : 'نوور (دەرمانساز، بەغدا)'}
                    </h5>
                    <p className="text-xs text-[#6B635B] font-semibold">
                      {locale === 'en' ? 'Age 26 • Verified Profile' : locale === 'ar' ? 'العمر ٢٦ • ملف شخصي موثق' : 'تەمەن ٢٦ • پرۆفایلی سەلمێنراو'}
                    </p>
                    <p className="text-[10px] text-[#6B635B]/70 font-mono mt-0.5">
                      {locale === 'en' ? 'Status: ' : locale === 'ar' ? 'الحالة: ' : 'دۆخ: '}
                      <span className="font-bold">
                        {isUnlocked 
                          ? (locale === 'en' ? '🔓 Unlocked Portrait' : locale === 'ar' ? '🔓 تم إلغاء قفل الصورة' : '🔓 وێنەی ئاشکراکراو')
                          : (locale === 'en' ? '🔒 Protected Blur default' : locale === 'ar' ? '🔒 صورة مموهة محمية تلقائياً' : '🔒 وێنەی لێڵکراوی پارێزراو')}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-white/40 rounded-xl text-xs text-[#4A443F] italic border-l-2 border-accent-coral rtl:border-l-0 rtl:border-r-2 leading-snug text-start">
                  {locale === 'en' 
                    ? '"Seeking a companion of fine intellect and high family values."' 
                    : locale === 'ar' 
                    ? '"أبحث عن شريك حياة ذو فكر راقٍ وقيم عائلية نبيلة."' 
                    : '"بەدوای هاوبەشێکی ژیاندا دەگەڕێم خاوەنی بیرکردنەوەیەکی بەرز و بەها خێزانییە بەرزەکان بێت."'}
                </div>
              </div>

              {/* Simulator controls */}
              <div className="space-y-3">
                <p className="text-xs text-[#6B635B] font-semibold text-center">
                  {locale === 'en' 
                    ? 'Toggle what Omar (the other user) represents here:' 
                    : locale === 'ar' 
                    ? 'قم بالتبديل لرؤية ما يشاهده الطرف الآخر (عمر):' 
                    : 'دیاریبکە بۆ بینینی ئەوەی کە بەرامبەرەکە (عومەر) دەیبینێت:'}
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setIsUnlocked(false)}
                    className={`py-2 px-3 text-xs font-bold rounded-xl border flex items-center justify-center space-x-1.5 rtl:space-x-reverse transition-all ${
                      !isUnlocked
                        ? 'bg-warm-charcoal text-white border-warm-charcoal shadow-md'
                        : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <EyeOff className="w-4 h-4" />
                    <span>{locale === 'en' ? 'Before Approval' : locale === 'ar' ? 'قبل الموافقة' : 'پێش پەسەندکردن'}</span>
                  </button>

                  <button
                    onClick={() => setIsUnlocked(true)}
                    className={`py-2 px-3 text-xs font-bold rounded-xl border flex items-center justify-center space-x-1.5 rtl:space-x-reverse transition-all ${
                      isUnlocked
                        ? 'bg-accent-coral text-white border-accent-coral shadow-md'
                        : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <Eye className="w-4 h-4" />
                    <span>{locale === 'en' ? 'Approved View' : locale === 'ar' ? 'بعد موافقتك' : 'دوای پەسەندکردن'}</span>
                  </button>
                </div>

                <p className="text-[10px] text-[#6B635B]/65 text-center font-mono pt-1">
                  {locale === 'en' 
                    ? '*Demonstrates the dynamic image transformation secure flow.' 
                    : locale === 'ar' 
                    ? '*يُوضح هذا التدفق الآمن للتحول الديناميكي للصور.' 
                    : '*پێشان متمانە و چۆنیەتی گۆڕینی پارێزراوی وێنە دەدات.'}
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
