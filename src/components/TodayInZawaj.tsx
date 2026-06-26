import React, { useState } from 'react';
import { AppLanguage, MatchProfile } from '../types';
import { Heart, Coffee, HelpCircle, Sparkles, Shield, ChevronRight, CheckCircle2 } from 'lucide-react';

interface TodayInZawajProps {
  locale: AppLanguage;
  matches: MatchProfile[];
  onSelectMatch: (match: MatchProfile) => void;
  onNavigateToTab: (tab: any) => void;
}

export default function TodayInZawaj({ locale, matches, onSelectMatch, onNavigateToTab }: TodayInZawajProps) {
  const isEn = locale === 'en';
  const isCkb = locale === 'ckb';

  const txt = (en: string, ar: string, ckb: string) => {
    return isEn ? en : isCkb ? ckb : ar;
  };

  // State for compatibility check voting
  const [votedAnswer, setVotedAnswer] = useState<string | null>(null);

  // Take the first verified match as today's suggested match
  const suggestedMatch = matches.find(m => m.verified) || matches[0];

  const tips = [
    txt("Your face is blurred by default. You control who sees your portrait.", "صورتك الشخصية مموهة تلقائياً. أنت وحدك من يتحكم بمن يمكنه رؤية وجهك الوقور.", "وێنەکەت بە شێوەیەکی خۆکار لێڵ کراوە. تەنها خۆت دەتوانیت دیاری بکەیت کێ وێنەکەت ببینێت."),
    txt("Chaperoned chats keep communications pure, safe, and serious.", "المحادثات الموجهة تبقي التواصل نقيّاً، آمناً، وجادّاً.", "چاتی فەرمی و چاودێریکراو پەیوەندییەکان بە پاکی، پارێزراوی و جدی دەهێڵێتەوە."),
    txt("Do not share contact details until you are completely sure.", "تجنب مشاركة وسائل الاتصال الخارجية حتى تتأكد تماماً من جدية الطرف الآخر.", "دوور بکەوە لە هاوبەشکردنی ژمارەی مۆبایل تا دڵنیا دەبیتەوە لە جدیبوونی بەرامبەر.")
  ];

  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  const rotateTip = () => {
    setCurrentTipIndex((prev) => (prev + 1) % tips.length);
  };

  return (
    <div className="bg-[#FAF7F2] border border-[#E8DCC4]/60 rounded-3xl p-5 shadow-sm space-y-4 text-start">
      <div className="flex justify-between items-center pb-2 border-b border-[#EADFC9]/70">
        <div className="flex items-center gap-2">
          <span className="text-xl">🌟</span>
          <div>
            <h3 className="text-sm font-black text-warm-charcoal tracking-wide uppercase font-mono">
              {txt("Today in Zawaj", "اليوم في زواج", "ئەمڕۆ لە زەواج")}
            </h3>
            <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider font-mono">
              {txt("Your Daily Courtship Digest", "موجز زواجك اليومي الموقر", "پوختەی ڕۆژانەی هاوسەرگیری")}
            </p>
          </div>
        </div>
        <span className="text-[9px] font-mono font-extrabold px-2 py-0.5 rounded-full bg-[#EADFC9] text-stone-600">
          {new Date().toLocaleDateString(isEn ? 'en-US' : 'ar-IQ', { weekday: 'long', month: 'short', day: 'numeric' })}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Today's Suggested Match */}
        {suggestedMatch && (
          <div className="bg-white border border-[#E6DCC3] rounded-2xl p-4 flex flex-col justify-between hover:shadow-md transition duration-300 relative group">
            <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-[#40798C] text-white text-[8px] font-mono font-black px-1.5 py-0.5 rounded">
              <Sparkles className="w-2.5 h-2.5 shrink-0 animate-pulse" />
              <span>{suggestedMatch.compatibilityScore}%</span>
            </div>
            <div>
              <span className="text-[9px] font-mono font-black uppercase text-accent-coral block mb-1">
                💍 {txt("Blessed Match", "الترشيح المبارك", "پێشنیاری بەختەوەر")}
              </span>
              <h4 className="text-sm font-black text-warm-charcoal">{suggestedMatch.name}, {suggestedMatch.age}</h4>
              <p className="text-[11px] font-semibold text-stone-500 mt-1 line-clamp-2">
                📍 {suggestedMatch.governorate} • {suggestedMatch.profession}
              </p>
            </div>
            <button
              onClick={() => onSelectMatch(suggestedMatch)}
              className="mt-3.5 w-full py-1.5 bg-[#FAF7F2] hover:bg-accent-pink/10 hover:text-accent-pink text-[10px] font-extrabold rounded-lg border border-[#E6DCC3]/60 transition text-center text-stone-600 flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>{txt("View Profile", "عرض الملف", "بینینی پڕۆفایل")}</span>
              <ChevronRight className="w-3 h-3 shrink-0" />
            </button>
          </div>
        )}

        {/* Card 2: Discussion in Marriage Café */}
        <div className="bg-white border border-[#E6DCC3] rounded-2xl p-4 flex flex-col justify-between hover:shadow-md transition duration-300">
          <div>
            <span className="text-[9px] font-mono font-black uppercase text-[#40798C] block mb-1">
              ☕ {txt("Marriage Café Discussion", "نقاش مقهى الزواج", "گفتوگۆی چایخانەی هاوسەرگیری")}
            </span>
            <h4 className="text-xs font-bold text-stone-700 leading-snug">
              {txt("“What matters most before committing to engagement?”", "«ما هو الأمر الأكثر أهمية قبل الالتزام بالخطوبة؟»", "«گرنگترین شت چییە پێش ئەنجامدانی مارەبڕین؟»")}
            </h4>
            <p className="text-[10px] text-stone-400 mt-2">
              💬 28 {txt("candidates answered today", "أعضاء شاركوا اليوم", "ئەندام ئەمڕۆ بەشدارییان کرد")}
            </p>
          </div>
          <button
            onClick={() => onNavigateToTab('community')}
            className="mt-3.5 w-full py-1.5 bg-[#FAF7F2] hover:bg-[#40798C]/10 hover:text-[#40798C] text-[10px] font-extrabold rounded-lg border border-[#E6DCC3]/60 transition text-center text-stone-600 flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>{txt("Join Discussion", "شارك بالنقاش", "بەشداری بکە")}</span>
            <Coffee className="w-3 h-3 text-stone-500 shrink-0" />
          </button>
        </div>

        {/* Card 3: Compatibility Question Check */}
        <div className="bg-white border border-[#E6DCC3] rounded-2xl p-4 flex flex-col justify-between hover:shadow-md transition duration-300">
          <div>
            <span className="text-[9px] font-mono font-black uppercase text-amber-600 block mb-1">
              ❓ {txt("Compatibility Check", "سؤال التوافق اليومي", "پرسیاری گونجانی ڕۆژانە")}
            </span>
            <h4 className="text-xs font-bold text-stone-700 leading-snug">
              {txt("How important is family approval for your union?", "ما مدى أهمية موافقة الأهل لتسهيل أمر الزواج؟", "ڕەزامەندی خێزان تا چەند گرنگە بۆ هاوسەرگیری؟")}
            </h4>

            {!votedAnswer ? (
              <div className="grid grid-cols-2 gap-1.5 mt-3">
                <button
                  onClick={() => setVotedAnswer('high')}
                  className="py-1 px-2 border border-stone-200 hover:border-accent-coral text-[9px] font-bold text-stone-600 rounded bg-[#FAF8F4] transition cursor-pointer text-center"
                >
                  {txt("Very Essential", "ضروري جداً", "زۆر پێویستە")}
                </button>
                <button
                  onClick={() => setVotedAnswer('low')}
                  className="py-1 px-2 border border-stone-200 hover:border-accent-coral text-[9px] font-bold text-stone-600 rounded bg-[#FAF8F4] transition cursor-pointer text-center"
                >
                  {txt("Secondary", "أمر ثانوي", "لاوەکییە")}
                </button>
              </div>
            ) : (
              <div className="mt-3 flex items-center gap-1 bg-emerald-50 text-emerald-800 text-[10px] font-semibold py-1.5 px-2 rounded-lg border border-emerald-100">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{txt("Voted! Unlocks matches with similar answers.", "تم التصويت! يفتح لك مرشحين بنفس التفكير.", "دەنگت دا! پێشنیارەکان بەپێی وەڵامەکەت دەبن.")}</span>
              </div>
            )}
          </div>
          <span className="text-[8px] text-stone-400 font-mono mt-2 block">
            {txt("✓ Answer takes under 10 seconds", "✓ الإجابة تستغرق أقل من ١٠ ثوانٍ", "✓ وەڵامدانەوە کەمتر لە ١٠ چرکەی دەوێت")}
          </span>
        </div>

        {/* Card 4: Privacy Tip of the Day */}
        <div className="bg-white border border-[#E6DCC3] rounded-2xl p-4 flex flex-col justify-between hover:shadow-md transition duration-300">
          <div>
            <span className="text-[9px] font-mono font-black uppercase text-emerald-600 block mb-1">
              🛡️ {txt("Privacy Shield Tip", "نصيحة خصوصية اليوم", "ئامۆژگاری پاراستنی ئەمڕۆ")}
            </span>
            <p className="text-xs font-semibold text-stone-600 leading-relaxed italic">
              “{tips[currentTipIndex]}”
            </p>
          </div>
          <button
            onClick={rotateTip}
            className="mt-3.5 w-full py-1.5 bg-[#FAF7F2] hover:bg-stone-100 text-[9px] font-black uppercase tracking-wider rounded-lg border border-[#E6DCC3]/60 transition text-center text-stone-500 flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>{txt("Next Tip", "النصيحة التالية", "ئامۆژگاری داهاتوو")}</span>
            <Shield className="w-3 h-3 text-emerald-600 shrink-0 animate-pulse" />
          </button>
        </div>
      </div>
    </div>
  );
}
