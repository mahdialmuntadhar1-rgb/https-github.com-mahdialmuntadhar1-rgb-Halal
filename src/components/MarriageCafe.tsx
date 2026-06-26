import React, { useState } from 'react';
import { AppLanguage } from '../types';
import { Coffee, Vote, Check, Sparkles, MessageCircle, BarChart3 } from 'lucide-react';

interface MarriageCafeProps {
  locale: AppLanguage;
  triggerToast: (msg: string) => void;
}

interface CafeQuestion {
  id: string;
  questionEn: string;
  questionAr: string;
  questionCkb: string;
  options: {
    key: string;
    en: string;
    ar: string;
    ckb: string;
    percentage: number;
  }[];
  insightEn: string;
  insightAr: string;
  insightCkb: string;
}

export default function MarriageCafe({ locale, triggerToast }: MarriageCafeProps) {
  const isEn = locale === 'en';
  const isCkb = locale === 'ckb';

  const txt = (en: string, ar: string, ckb: string) => {
    return isEn ? en : isCkb ? ckb : ar;
  };

  const questions: CafeQuestion[] = [
    {
      id: 'engagement',
      questionEn: "What matters most before committing to a formal engagement?",
      questionAr: "ما هو الجانب الأكثر أهمية وحسماً قبل إعلان الخطوبة رسمياً؟",
      questionCkb: "گرنگترین لایەن چییە پێش ڕاگەیاندنی فەرمی نیشانەکردن؟",
      options: [
        { key: 'A', en: 'Mutual respect & temper', ar: 'الاحترام المتبادل وتوافق الطبع', ckb: 'ڕێزگرتنی دوولایەنە و ڕەوشت', percentage: 48 },
        { key: 'B', en: 'Religious & moral values', ar: 'الالتزام الديني والأخلاقي للشريك', ckb: 'پابەندبوونی ئاینی و ئەخلاقی', percentage: 32 },
        { key: 'C', en: 'Financial stability & work', ar: 'الاستقرار المالي والوظيفة الجادة', ckb: 'جێگیری دارایی و پیشەی جدی', percentage: 14 },
        { key: 'D', en: 'Explicit family blessings', ar: 'مباركة الأهل الصريحة للطرفين', ckb: 'بەرەکەتی خێزان بۆ هەردوولا', percentage: 6 }
      ],
      insightEn: "💡 48% of Iraqi brides prioritize character compatibility and emotional maturity above financial metrics during initial courtship.",
      insightAr: "💡 ٤٨٪ من الشريكات في العراق يفضلن وضوح الطباع والاحترام المتبادل على المؤشرات المادية في اللقاءات الأولى.",
      insightCkb: "💡 ٤٨٪ لە کچان لە عێراقدا ڕێزی دوولایەنە و گونجانی ڕەوشت پێش دەخەن لەسەر دۆخی دارایی."
    },
    {
      id: 'governorate',
      questionEn: "Would you accept seeking marriage from a different governorate?",
      questionAr: "هل تقبل الارتباط وشريك العمر من محافظة عراقية أخرى؟",
      questionCkb: "ئایا ڕازیت هاوسەرگیری لەگەڵ کەسێک بکەیت لە پارێزگایەکی تر بێت؟",
      options: [
        { key: 'A', en: 'Absolutely yes (Open to travel)', ar: 'نعم بالتأكيد (أقبل السفر والاستقرار)', ckb: 'بەڵێ بێگومان (ئامادەم بۆ گەشتکردن)', percentage: 55 },
        { key: 'B', en: 'Prefer close by (Same governorate)', ar: 'أفضل القريب (من نفس المحافظة فقط)', ckb: 'نزیکم پێ باشترە (هەمان پارێزگا)', percentage: 28 },
        { key: 'C', en: 'Open to discuss relocations', ar: 'مستعد للنقاش حسب ظروف العمل والأهل', ckb: 'ئامادەم بۆ گفتوگۆ بەپێی کار و خێزان', percentage: 12 },
        { key: 'D', en: 'No, local marriage only', ar: 'لا، أفضل الزواج المحلي داخل مدينتي', ckb: 'نەخێر، تەنها هاوسەرگیری ناوخۆیی', percentage: 5 }
      ],
      insightEn: "💡 55% of users are highly progressive and willing to explore marital union across governorates for the right, serious candidate.",
      insightAr: "💡 ٥٥٪ من الأعضاء يبدون مرونة كاملة للارتباط العابر للمحافظات في سبيل العثور على الشريك الصالح والجاد.",
      insightCkb: "💡 ٥٥٪ لە ئەندامان نەرمی تەواو نیشان دەدەن بۆ هاوسەرگیری لەگەڵ پارێزگاکانی تر بۆ دۆزینەوەی هاوبەشی گونجاو."
    },
    {
      id: 'family',
      questionEn: "How critical is explicit family approval in your decision?",
      questionAr: "ما مدى تأثير موافقة الأهل الصريحة في قرار اختيارك للشريك؟",
      questionCkb: "ڕەزامەندی خێزان تا چەند کاریگەرە لە بڕیاری هەڵبژاردنی هاوبەشەکەت؟",
      options: [
        { key: 'A', en: '100% dealbreaker (No family, no union)', ar: 'شرط أساسي ١٠٠٪ (رضا الأهل أولاً دائماً)', ckb: 'مەرجی سەرەکی ١٠٠٪ (ڕەزامەندی خێزان هەمیشە یەکەمە)', percentage: 65 },
        { key: 'B', en: 'Highly preferred & respected', ar: 'مفضل جداً ومقدّر في اتخاذ القرار', ckb: 'زۆر باشترە و جێگای ڕێزە', percentage: 25 },
        { key: 'C', en: 'Secondary (Important but my choice)', ar: 'ثانوي (رأيهم مهم لكن القرار لي شخصياً)', ckb: 'لاوەکی (ڕایان گرنگە بەڵام بڕیارەکە لای منە)', percentage: 8 },
        { key: 'D', en: 'Up to individual alignment only', ar: 'يعتمد على التوافق الشخصي بيننا فقط', ckb: 'تەنها بەپێی ڕێککەوتنی نێوان خۆمان', percentage: 2 }
      ],
      insightEn: "💡 Traditional Iraqi family dynamics remain pivotal: 65% declare family approval as a definitive prerequisite for marriage.",
      insightAr: "💡 الروابط الأسرية العراقية متينة للغاية: ٦٥٪ يعتبرون رضا الأهل شرطاً شرعياً واجتماعياً لا غنى عنه لإتمام الميثاق.",
      insightCkb: "💡 پەیوەندییە خێزانییەکان لە عێراقدا زۆر بەهێزن: ٦٥٪ ڕەزامەندی خێزان بە مەرجێکی بنەڕەتی دەزانن."
    },
    {
      id: 'trust',
      questionEn: "What element makes a serious courtship profile most trustworthy?",
      questionAr: "ما هو العنصر الأكثر أهمية لتوثيق مصداقية وجدية الملف التعريفي؟",
      questionCkb: "چ شتێک پڕۆفایلی جدی و ڕاستگۆ نیشان دەدات؟",
      options: [
        { key: 'A', en: 'Verified Badge & Government check', ar: 'علامة التوثيق الزرقاء وفحص الهوية', ckb: 'نیشانەی شین و پشتڕاستکردنەوەی ناسنامە', percentage: 42 },
        { key: 'B', en: 'Detailed answers on family values', ar: 'التفاصيل الشاملة حول القيم والأسرة', ckb: 'زانیاری ورد لەسەر بەها و خێزان', percentage: 35 },
        { key: 'C', en: 'Involving parents / guardian contact', ar: 'إشراك ولي الأمر أو معلومات الاتصال به', ckb: 'هاوبەشکردنی پەیوەندی باوک یان سەرپەرشت', percentage: 15 },
        { key: 'D', en: 'Sincere & long "About Me" description', ar: 'الصدق والوضوح في كتابة النبذة الشخصية', ckb: 'ڕاستگۆیی لە نووسینی پێناسەی خۆتدا', percentage: 8 }
      ],
      insightEn: "💡 Sincerity indicators: Profiles with Government Verification badges receive 3x more respectful requests weekly.",
      insightAr: "💡 مؤشرات الجدية: الحسابات الموثقة بالهوية الحكومية تتلقى طلبات وقورة بمعدل ٣ أضعاف مقارنة بغيرها أسبوعياً.",
      insightCkb: "💡 پڕۆفایلە پشتڕاستکراوەکان بە ناسنامە ٣ جار زیاتر داواکاری فەرمی وەردەگرن بەراورد بەوانی تر."
    }
  ];

  // Store user votes locally (questionId -> chosen option key)
  const [votes, setVotes] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('marriage_cafe_votes');
    return saved ? JSON.parse(saved) : {};
  });

  const handleVote = (questionId: string, optionKey: string) => {
    if (votes[questionId]) return; // already voted

    const updated = { ...votes, [questionId]: optionKey };
    setVotes(updated);
    localStorage.setItem('marriage_cafe_votes', JSON.stringify(updated));

    triggerToast(
      isEn 
        ? "☕ Thank you! Your serious feedback was registered in our Marriage Café stats." 
        : "☕ شكراً لك! تم تسجيل رأيك الوقور في إحصائيات مقهى الزواج بنجاح."
    );
  };

  return (
    <div className="bg-[#FAF7F2] border border-[#E8DCC4] rounded-[2rem] p-6 shadow-sm space-y-6 text-start">
      <div className="flex items-center justify-between border-b border-[#EADFC9] pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#40798C]/10 text-[#40798C] rounded-2xl">
            <Coffee className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-black text-warm-charcoal font-serif">
              {txt("Marriage Café", "مقهى الزواج التفاعلي", "چایخانەی هاوسەرگیری")}
            </h3>
            <p className="text-xs text-stone-400 font-bold">
              {txt("Real candidate alignment polls & sincere guidelines", "استطلاعات تفاعلية حية بين المقبلين على الزواج في العراق", "ڕاپرسی ڕاستەقینە لە نێوان گەنجانی عێراق")}
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono font-extrabold px-3 py-1 bg-[#EADFC9]/50 rounded-full text-stone-600">
          ☕ {txt("Interactive Lounge", "مجلس حواري وقور", "کۆڕی گفتوگۆ")}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {questions.map((q) => {
          const userChoice = votes[q.id];
          const hasVoted = !!userChoice;

          return (
            <div 
              key={q.id}
              className="bg-white border border-[#E6DCC3]/80 rounded-2xl p-5 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <h4 className="text-xs font-black text-stone-700 leading-snug mb-4 flex items-start gap-1.5 min-h-[36px]">
                  <span className="text-accent-coral shrink-0">✦</span>
                  <span>{txt(q.questionEn, q.questionAr, q.questionCkb)}</span>
                </h4>

                <div className="space-y-2">
                  {q.options.map((opt) => {
                    const isSelected = userChoice === opt.key;
                    // Adjust percentage slightly if selected to give a dynamic feel
                    const percent = hasVoted ? (isSelected ? opt.percentage + 2 : opt.percentage - 1) : opt.percentage;
                    
                    return (
                      <button
                        key={opt.key}
                        disabled={hasVoted}
                        onClick={() => handleVote(q.id, opt.key)}
                        className={`w-full text-left p-3 rounded-xl border text-xs transition duration-200 relative overflow-hidden flex items-center justify-between ${
                          hasVoted
                            ? isSelected
                              ? 'bg-emerald-50/50 border-emerald-300 text-emerald-900 font-bold'
                              : 'bg-stone-50 border-stone-200 text-stone-400'
                            : 'bg-[#FAF8F4] border-[#EADFC9] hover:bg-white hover:border-accent-coral text-stone-600 cursor-pointer'
                        }`}
                      >
                        {/* Simulated background progress bar */}
                        {hasVoted && (
                          <div 
                            className={`absolute left-0 top-0 bottom-0 ${isSelected ? 'bg-emerald-500/10' : 'bg-stone-300/5'} transition-all duration-1000`} 
                            style={{ width: `${percent}%` }}
                          />
                        )}

                        <span className="relative z-10 flex items-center gap-2">
                          <span className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-mono ${
                            isSelected 
                              ? 'bg-emerald-500 text-white' 
                              : hasVoted 
                                ? 'bg-stone-200 text-stone-400' 
                                : 'bg-stone-100 text-stone-500'
                          }`}>
                            {isSelected ? <Check className="w-3 h-3 text-white" /> : opt.key}
                          </span>
                          <span>{txt(opt.en, opt.ar, opt.ckb)}</span>
                        </span>

                        {hasVoted && (
                          <span className="relative z-10 text-[10px] font-mono font-extrabold text-stone-500">
                            {percent}%
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Voted Insight block */}
              {hasVoted && (
                <div className="mt-4 p-3.5 bg-[#40798C]/5 border border-[#40798C]/15 rounded-xl text-[10.5px] text-[#2F5968] font-medium leading-relaxed animate-fade-in flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-[#40798C] shrink-0 mt-0.5 animate-pulse" />
                  <span>{txt(q.insightEn, q.insightAr, q.insightCkb)}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="bg-[#40798C]/5 border border-[#40798C]/15 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-stone-600 text-start">
          <BarChart3 className="w-5 h-5 text-[#40798C]" />
          <p className="font-semibold text-stone-600 leading-snug">
            {txt("Answers help refine our machine-learning compatibility suggestions offline.", "تساهم هذه التصويتات في تدقيق ترشيحات التوافق الآلية بين الأعضاء بذكاء وأمان.", "ئەم دەنگدانانە دەبنە هۆی باشترکردنی پێشنیارەکانی هاوسەرگیری بە شێوازێکی زیرەک.")}
          </p>
        </div>
        <button
          onClick={() => triggerToast(isEn ? "☕ Sincere statistics refreshed!" : "☕ تم تحديث إحصائيات المقهى الموقر!")}
          className="px-4 py-2 bg-warm-charcoal text-white hover:bg-black transition text-xs font-bold rounded-xl shrink-0 cursor-pointer shadow-sm"
        >
          {txt("Refresh Stats", "تحديث الإحصائيات", "نوێکردنەوەی ئامارەکان")}
        </button>
      </div>
    </div>
  );
}
