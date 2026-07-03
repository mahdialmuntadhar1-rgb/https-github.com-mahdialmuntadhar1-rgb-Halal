import React from 'react';
import { AppLanguage } from '../types';
import { Heart, Coffee, BarChart2, BookOpen, ArrowRight } from 'lucide-react';

interface TodayInZawajProps {
  locale: AppLanguage;
  onNavigateToTab: (tab: any) => void;
}

export default function TodayInZawaj({ locale, onNavigateToTab }: TodayInZawajProps) {
  const isEn = locale === 'en';
  const isCkb = locale === 'ckb';

  const txt = (en: string, ar: string, ckb: string) => {
    return isEn ? en : isCkb ? ckb : ar;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" id="today-in-zawaj-dashboard">
      {/* Card 1: Discover Matches */}
      <div 
        onClick={() => onNavigateToTab('explore')}
        className="bg-white border border-[#EBE8E2] rounded-3xl p-5 flex flex-col justify-between hover:shadow-lg hover:border-accent-coral/20 transition-all duration-300 cursor-pointer text-left group"
      >
        <div>
          <div className="flex justify-between items-center mb-5">
            <div className="w-10 h-10 bg-orange-50 border border-orange-100 rounded-xl flex items-center justify-center text-orange-500 group-hover:scale-105 transition-transform">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <span className="text-[10px] font-bold text-stone-400 bg-stone-50 border border-stone-200/60 px-2.5 py-1 rounded-md">
              {txt("Instant & Verified", "فوري وموثق", "خێرا و متمانەپێکراو")}
            </span>
          </div>
          
          <h3 className="text-base font-bold text-[#2C2A29] mb-1.5 font-serif">
            {txt("Discover Matches", "اكتشاف الشركاء", "دۆزینەوەی هاوبەشەکان")}
          </h3>
          <p className="text-xs text-stone-500 font-medium leading-relaxed mb-4">
            {txt("Find compatible people near you.", "ابحث عن أشخاص متوافقين بالقرب منك.", "دۆزینەوەی کەسانی گونجاو لە نزیکتەوە.")}
          </p>
        </div>

        <div className="flex items-center gap-1 text-[11px] font-black tracking-wider text-stone-700 uppercase group-hover:text-accent-coral transition-colors">
          <span>{txt("Explore Section", "استكشاف القسم", "گەڕان لەم بەشە")}</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>

      {/* Card 2: Marriage Café */}
      <div 
        onClick={() => onNavigateToTab('community')}
        className="bg-white border border-[#EBE8E2] rounded-3xl p-5 flex flex-col justify-between hover:shadow-lg hover:border-[#40798C]/20 transition-all duration-300 cursor-pointer text-left group"
      >
        <div>
          <div className="flex justify-between items-center mb-5">
            <div className="w-10 h-10 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 group-hover:scale-105 transition-transform">
              <Coffee className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50/50 border border-emerald-100/80 px-2.5 py-1 rounded-md">
              {txt("Status: Active Lounge", "الحالة: نشط الآن", "دۆخ: چالاکە")}
            </span>
          </div>
          
          <h3 className="text-base font-bold text-[#2C2A29] mb-1.5 font-serif">
            {txt("Marriage Café", "مقهى الزواج", "چایخانەی هاوسەرگیری")}
          </h3>
          <p className="text-xs text-stone-500 font-medium leading-relaxed mb-4">
            {txt("Participate in respectful community discussions.", "شارك في نقاشات مجتمعية محترمة وجادة.", "بەشداری بکە لە گفتوگۆ جدییەکانی کۆمەڵگە.")}
          </p>
        </div>

        <div className="flex items-center gap-1 text-[11px] font-black tracking-wider text-stone-700 uppercase group-hover:text-[#40798C] transition-colors">
          <span>{txt("Explore Section", "استكشاف القسم", "گەڕان لەم بەشە")}</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>

      {/* Card 3: Daily Poll */}
      <div 
        onClick={() => onNavigateToTab('community')}
        className="bg-white border border-[#EBE8E2] rounded-3xl p-5 flex flex-col justify-between hover:shadow-lg hover:border-amber-500/20 transition-all duration-300 cursor-pointer text-left group"
      >
        <div>
          <div className="flex justify-between items-center mb-5">
            <div className="w-10 h-10 bg-amber-50 border border-amber-100 rounded-xl flex items-center justify-center text-amber-500 group-hover:scale-105 transition-transform">
              <BarChart2 className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-amber-700 bg-amber-50/50 border border-amber-100/80 px-2.5 py-1 rounded-md">
              {txt("Interactive Insights", "رؤى تفاعلية", "تێڕوانینی کارلێکەر")}
            </span>
          </div>
          
          <h3 className="text-base font-bold text-[#2C2A29] mb-1.5 font-serif">
            {txt("Daily Poll", "الاستطلاع اليومي", "ڕاپرسی ڕۆژانە")}
          </h3>
          <p className="text-xs text-stone-500 font-medium leading-relaxed mb-4">
            {txt("Vote on interesting topics and see live results.", "صوّت على مواضيع هادفة وشاهد النتائج مباشرة.", "دەنگ بدە لەسەر بابەتە گرنگەکان و ئەنجامەکان ببینە.")}
          </p>
        </div>

        <div className="flex items-center gap-1 text-[11px] font-black tracking-wider text-stone-700 uppercase group-hover:text-amber-600 transition-colors">
          <span>{txt("Explore Section", "استكشاف القسم", "گەڕان لەم بەشە")}</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>

      {/* Card 4: Values & Advice */}
      <div 
        onClick={() => onNavigateToTab('trust_safety')}
        className="bg-white border border-[#EBE8E2] rounded-3xl p-5 flex flex-col justify-between hover:shadow-lg hover:border-blue-500/20 transition-all duration-300 cursor-pointer text-left group"
      >
        <div>
          <div className="flex justify-between items-center mb-5">
            <div className="w-10 h-10 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center text-blue-500 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-blue-700 bg-blue-50/50 border border-blue-100/80 px-2.5 py-1 rounded-md">
              {txt("Pre-Marriage Wisdom", "حكمة ما قبل الزواج", "حیکمەتی پێش هاوسەرگیری")}
            </span>
          </div>
          
          <h3 className="text-base font-bold text-[#2C2A29] mb-1.5 font-serif">
            {txt("Values & Advice", "القيم والنصائح", "بەها و ئامۆژگارییەکان")}
          </h3>
          <p className="text-xs text-stone-500 font-medium leading-relaxed mb-4">
            {txt("Read relationship guidance and tips.", "اقرأ إرشادات ونصائح لبناء زواج ناجح.", "ئامۆژگاری و ڕێنمایی بۆ دروستکردنی خێزانی بەختەوەر بخوێنەوە.")}
          </p>
        </div>

        <div className="flex items-center gap-1 text-[11px] font-black tracking-wider text-stone-700 uppercase group-hover:text-blue-500 transition-colors">
          <span>{txt("Explore Section", "استكشاف القسم", "گەڕان لەم بەشە")}</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );
}
















