import React from 'react';
import { ShieldCheck, Heart, Lock, Filter, UserX, Camera, CheckCircle2 } from 'lucide-react';
import { Language } from '../lib/translations';

interface TrustProps {
  locale: Language;
}

export default function TrustSafety({ locale }: TrustProps) {
  const isEn = locale === 'en';
  const isAr = locale === 'ar';

  const sectionTitle = isEn
    ? 'Why Zawaj Al Araqi?'
    : isAr
    ? 'لماذا منصة حلال للزواج؟'
    : 'بۆچی پلاتفۆرمی حەڵاڵ؟';

  const sectionSub = isEn
    ? 'A dedicated, respectful workspace designed for lifelong family foundations - built strictly for marriage.'
    : isAr
    ? 'مساحة بناء وقورة وعائلية تهتم بصون الكرامات والخصوصية وتبتعد تماماً عن العبث والتسلية.'
    : 'پانتاییەکی شایستە و پارێزراو بۆ دۆزینەوەی نیوەی تری ژیانت بە شێوازێکی جدی و بەڕێزەوە.';

  const cards = [
    {
      icon: <Heart className="w-5 h-5 text-accent-coral" />,
      title: isEn
        ? 'Serious marriage only'
        : isAr
        ? 'زواج جاد فقط'
        : 'تەنها هاوسەرگیری جدی',
      desc: isEn
        ? 'Not a casual dating environment. All users commit to real integration timelines and honest intentions.'
        : isAr
        ? 'ليست منصة للتعارف العشوائي أو التسلية. الجميع يلتزم بذكر الخطوبة والجدول الزمني بجدية.'
        : 'نەک بۆ چات و کات بەسەربردن. هەمووان لێرەن بە نیەتێکی پاک و جدی بۆ هاوسەرگیری.',
    },
    {
      icon: <Lock className="w-5 h-5 text-[#40798C]" />,
      title: isEn
        ? 'Privacy-first profiles'
        : isAr
        ? 'ملفات تركز أولاً على السرية'
        : 'پڕۆفایلی تەواو پارێزراو',
      desc: isEn
        ? 'Designed with privacy-first layouts. Share contact and details only when you feel fully ready.'
        : isAr
        ? 'مصمم لتعزيز الخصوصية في واجهات الاستخدام. تفاصيل حسابك وجهات تواصلك تظهر باختيارك وقبولك.'
        : 'دیزاین کراوە بە گرنگیدان بە پاراستنی نهێنیت پێش هەموو شتێک.',
    },
    {
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
      title: isEn
        ? 'Mutual consent before chat'
        : isAr
        ? 'موافقة ثنائية متبادلة لبدء الحوار'
        : 'ڕەزامەندی دوولایەنە پێش چات',
      desc: isEn
        ? 'No unsolicited reach-outs. Conversation triggers only when both individuals actively express sincere Interest.'
        : isAr
        ? 'لا يحق لأحد إرسال رسائل عشوائية. تفتح غرفة الدردشة بعد القبول والصدر الرحب من الطرفين.'
        : 'بێ نامەی نەخوازراو. چاتکردن تەنها کاتێک دەستپێدەکات کە هەردوولا پەسەندی ناساندنەکە بکەن.',
    },
    {
      icon: <Filter className="w-5 h-5 text-purple-600" />,
      title: isEn
        ? 'Advanced compatibility filters'
        : isAr
        ? 'معايير تصفية وتوافق متطورة'
        : 'فلتەری پێشکەوتووی گونجان',
      desc: isEn
        ? 'Match by values, educational level, professional background, sector preference, and regional locations directly.'
        : isAr
        ? 'البحث حسب فئة العمل، مستوى التعليم، المحافظة، والسمات الفكرية لتقارب الرؤى ونقاء الاختيار.'
        : 'گەڕان و هەڵبژاردن بەپێی بەهاکان، خوێندن، شوێن، و بەرپرسیارێتییەکان بە ئاسانی.',
    },
    {
      icon: <UserX className="w-5 h-5 text-amber-600" />,
      title: isEn
        ? 'Respectful communication'
        : isAr
        ? 'أسلوب حوار رصين ومحترم'
        : 'گفتوگۆی شایستە و دۆستانە',
      desc: isEn
        ? 'Zero tolerance for abusive dialogue. Respect is built into our core framework and community enforcement guidelines.'
        : isAr
        ? 'حظر فوري للمعاملات المسيئة. نظام ضبط المجتمع يضمن رقي الخطاب للحفاظ على أجواء عائلية.'
        : 'پەیوەندی تەنها لە چوارچێوەی ڕێز و بەهاکاندا بێت. بێ لێبووردەیی بەرامبەر بێڕێزی.',
    },
    {
      icon: <Camera className="w-5 h-5 text-pink-600" />,
      title: isEn
        ? 'Photo control'
        : isAr
        ? 'تحكم مطلق في خصوصية صورك'
        : 'کۆنترۆڵی تەواوی وێنەکانت',
      desc: isEn
        ? 'Your portraits are blurred by default. Reveal your photo exclusively to partners whose profiles you enjoy.'
        : isAr
        ? 'الصور تخضع للتمويه بصفة افتراضية. كشف صوركِ التعريفية متاح فقط لمن تثقين في جديتهم وقبولك لمقترحهم.'
        : 'وێنەکانت بە لێڵی دەمێننەوە. تەنها بۆ ئەو کەسانەی خۆت دەتەوێت دەتوانیت ئاشکرای بکەیت.',
    },
  ];

  return (
    <section className="py-16 bg-transparent" id="why-halal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
          <p className="text-xs font-mono font-bold tracking-widest text-[#40798C] uppercase">
            {isEn ? 'CORE PRINCIPLES' : isAr ? 'ركائز المنصة الأساسية' : 'بنەما هەمیشەییەکانی حەڵاڵ'}
          </p>
          <h2 className="text-3xl sm:text-4xl font-serif font-black text-warm-charcoal font-display">
            {sectionTitle}
          </h2>
          <p className="text-[#6B635B] text-sm sm:text-base font-medium">
            {sectionSub}
          </p>
        </div>

        {/* 3x2 / Responsive Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className="bg-white/40 backdrop-blur-xl p-6 sm:p-8 rounded-[2rem] border border-white/45 shadow-md flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-start"
            >
              <div className="space-y-4">
                <div className="w-11 h-11 rounded-2xl bg-white/70 border border-white/50 flex items-center justify-center shadow-sm">
                  {card.icon}
                </div>
                <h3 className="text-base sm:text-lg font-bold text-warm-charcoal font-serif">
                  {card.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#6B635B] leading-relaxed font-normal">
                  {card.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-stone-200/25 mt-5 flex items-center space-x-1.5 rtl:space-x-reverse text-[9px] text-[#40798C] font-semibold tracking-wider font-mono uppercase">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{isEn ? 'Designed Priority' : isAr ? 'ركيزة مدمجة' : 'پێوەری کارا'}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

