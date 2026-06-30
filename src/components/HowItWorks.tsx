import React from 'react';
import { UserPlus, Settings2, ShieldCheck, Heart, MessagesSquare, CheckCircle } from 'lucide-react';
import { Language } from '../lib/translations';

interface HowItWorksProps {
  locale: Language;
}

export default function HowItWorks({ locale }: HowItWorksProps) {
  const isEn = locale === 'en';
  const isAr = locale === 'ar';

  const sectionTitle = isEn
    ? 'A Honorable Marital Journey'
    : isAr
    ? 'رحلة زواج وقورة ومنظمة'
    : 'ڕێڕەوێکی شایستە بۆ هاوسەرگیری';

  const sectionSub = isEn
    ? 'We avoid modern swiping loops. Zawaj Al Araqi guides you through 5 clear, values-aligned steps.'
    : isAr
    ? 'نبتعد تماماً عن العبث والتمرير العشوائي. نوجهك بوضوح وأمان عبر ٥ خطوات راقية معتمدة.'
    : 'دوورین لە هەڵسوکەوتی عەشوایی. لە حەڵاڵ لەڕێی ٥ هەنگاوەوە بە شێوازێکی تەندروست ڕێنموویت دەکەین.';

  const steps = [
    {
      icon: <UserPlus className="w-5 h-5 text-accent-coral" />,
      title: isEn
        ? 'Step 1: Create your private profile'
        : isAr
        ? 'الخطوة ١: إنشاء ملفك الشخصي الخاص'
        : 'هەنگاوی ١: پڕۆفایلی تایبەتیت دروست بکە',
      desc: isEn
        ? 'Establish your background, educational levels, marital plans, and set photo visibility preferences.'
        : isAr
        ? 'حدد مؤهلاتك العلمية، خطتك للبيت المستقبلي، وتفضيلات ظهور صورك الشخصية بكل خصوصية.'
        : 'زانیاری لەسەر بەهاکانت، ئاستی خوێندن و خواستی خێزانیت دیاریبکە لەگەڵ شێوازی بینینی وێنەکانت.',
    },
    {
      icon: <Settings2 className="w-5 h-5 text-[#40798C]" />,
      title: isEn
        ? 'Step 2: Set your preferences'
        : isAr
        ? 'الخطوة ٢: تحديد شروط المستقبل'
        : 'هەنگاوی ٢: مەرج و تایبەتمەندییەکانت دیاریبکە',
      desc: isEn
        ? 'Enter details for your expected spouse including values compatibility thresholds, age ranges, and geographic locations.'
        : isAr
        ? 'أدخل المعايير المطلوبة في الطرف الآخر بوضوح؛ مثل مستويات الأعمار، السكن، ونسبة التوافق الفكري.'
        : 'تایبەتمەندییە خوازراوەکانی هاوسەری ئایندەت تێبنووسە لەوانە تەمەن، شوێن و بەها فکرییەکان.',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-purple-600" />,
      title: isEn
        ? 'Step 3: Explore compatible matches'
        : isAr
        ? 'الخطوة ٣: تصفح الشركاء المتوافقين'
        : 'هەنگاوی ٣: هاوبەشە گونجاوەکان ببینە',
      desc: isEn
        ? 'Our system filters the member portfolio to show only matches tailored to your fundamental criteria and values.'
        : isAr
        ? 'يقوم النظام بترشيح وتصفية الملفات العراقية الجادة التي تتوافق مع مبادئك وأسلوب حياتك تلقائياً.'
        : 'سیستەمەکەمان تەنها ئەو پڕۆفایلە جدییانەت پیشان دەدات کە لەگەڵ بەها و دۆخت یەکدەگرنەوە.',
    },
    {
      icon: <Heart className="w-5 h-5 text-pink-600" />,
      title: isEn
        ? 'Step 4: Send introduction request'
        : isAr
        ? 'الخطوة ٤: إرسال طلب تواصل وتعريف'
        : 'هەنگاوی ٤: داواکاری ناساندن بنێرە',
      desc: isEn
        ? 'When interested, send a secure request. Your portrait remains completely blurred until they answer.'
        : isAr
        ? 'عندما ترغب ببدء التعارف، أرسل طلب تواصل محترم. ستبقى صورتك آمنة ومموهة تماماً حتى موافقتهم.'
        : 'کاتێک پڕۆفایلێکت بە دڵ بوو، داوای ناساندن بنێرە. وێنەت بە لێڵی دەمێنێتەوە تا پەسەندی دەکەن.',
    },
    {
      icon: <MessagesSquare className="w-5 h-5 text-emerald-600" />,
      title: isEn
        ? 'Step 5: Chat only after mutual approval'
        : isAr
        ? 'الخطوة ٥: محادثة محترمة عقب القبول المتبادل'
        : 'هەنگاوی ٥: چات تەنها دوای پەسەندکردنی یەکتر',
      desc: isEn
        ? 'Once interest is mutual, profiles unlock completely, allowing a secure chat under respectful parameters.'
        : isAr
        ? 'بمجرد التوافق المتبادل، يتم كشف الصور التعريفية وتفتح الغرفة الخاصة لبدء حوار بناء للخطوبة والزواج.'
        : 'دوای پەسەندکردنی دوولایەنە، وێنەکان ئاشکرادەبن و ژوورێکی گفتوگۆی پارێزراو بۆ هۆگری دەکرێتەوە.',
    },
  ];

  return (
    <section className="py-16 border-y border-stone-200/20 bg-transparent" id="how-it-works">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
          <p className="text-xs font-mono font-bold tracking-widest text-accent-coral uppercase">
            {isEn ? 'THE JOURNEY' : isAr ? 'خطوات الارتباط' : 'هەنگاوەکانی گەیشتن'}
          </p>
          <h2 className="text-3xl sm:text-4xl font-serif font-black text-warm-charcoal font-display">
            {sectionTitle}
          </h2>
          <p className="text-[#6B635B] text-sm sm:text-base font-medium">
            {sectionSub}
          </p>
        </div>

        {/* 5-Step Card Layout */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mt-12 items-stretch">
          {steps.map((step, idx) => (
            <div 
              key={idx} 
              className="relative bg-white/45 backdrop-blur-xl p-6 rounded-[2rem] border border-white/50 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-start flex flex-col justify-between"
              id={`how-it-works-step-${idx + 1}`}
            >
              <div className="space-y-4">
                <div className="w-10 h-10 bg-white/80 border border-white/50 rounded-2xl flex items-center justify-center shadow-inner">
                  {step.icon}
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-serif font-black text-warm-charcoal mb-2 leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-xs text-[#6B635B] leading-relaxed font-medium">
                    {step.desc}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-stone-200/20 flex justify-between items-center text-[10px] text-[#C3BFB9] font-mono">
                <span>STAGE 0{idx + 1}</span>
                {idx === 4 && <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />}
              </div>
              
              {/* Connector Arror for Desktop */}
              {idx < 4 && (
                <div className="hidden lg:block absolute top-1/2 right-[-14px] rtl:right-auto rtl:left-[-14px] transform -translate-y-1/2 z-20 text-stone-300 font-bold text-base">
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

