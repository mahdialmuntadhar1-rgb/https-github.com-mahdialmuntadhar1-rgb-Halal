import React, { useState, useEffect } from 'react';
import { AppLanguage } from '../types';
import { Coffee, Check, Sparkles, BarChart3, ThumbsUp, Heart, Clock, MessageSquare, ChevronRight } from 'lucide-react';

interface MarriageCafeProps {
  locale: AppLanguage;
  triggerToast: (msg: string) => void;
  onNavigateToTab?: (tab: any) => void;
}

interface CafeReply {
  id: string;
  name: string;
  nameAr: string;
  nameCkb: string;
  governorate: string;
  governorateAr: string;
  governorateCkb: string;
  timeAgo: string;
  timeAgoAr: string;
  timeAgoCkb: string;
  text: string;
  textAr: string;
  textCkb: string;
  likes: number;
}

export default function MarriageCafe({ locale, triggerToast, onNavigateToTab }: MarriageCafeProps) {
  const isEn = locale === 'en';
  const isCkb = locale === 'ckb';

  const txt = (en: string, ar: string, ckb: string) => {
    return isEn ? en : isCkb ? ckb : ar;
  };

  // State for relative likes/helpful counts of discussion replies
  const [replies, setReplies] = useState<CafeReply[]>([
    {
      id: 'rep1',
      name: 'Darya',
      nameAr: 'داريا',
      nameCkb: 'داریا',
      governorate: 'Erbil',
      governorateAr: 'أربيل',
      governorateCkb: 'هەولێر',
      timeAgo: '2 hours ago',
      timeAgoAr: 'قبل ساعتين',
      timeAgoCkb: '٢ کاتژمێر پێش ئێستا',
      text: 'For me, mutual respect and shared spiritual goals are absolute prerequisites. If you cannot respect each other\'s personal growth and spiritual paths, everything else becomes secondary.',
      textAr: 'بالنسبة لي، فإن الاحترام المتبادل والأهداف الروحية المشتركة هي شروط أساسية مطلقة. إذا لم يكن بمقدوركما احترام النمو الشخصي والمسارات الروحية لبعضكما البعض، فإن كل شيء آخر يصبح ثانوياً.',
      textCkb: 'بۆ من، ڕێزی دوولایەنە و ئامانجە ڕۆحییە هاوبەشەکان مەرجی پێشوەختەی ڕەهان. ئەگەر نەتوانن ڕێز لە گەشەی کەسی و ڕێگا ڕۆحییەکانی یەکتر بگرن، هەموو شتێکی تر دەبێتە لاوەکی.',
      likes: 42
    },
    {
      id: 'rep2',
      name: 'Kamil',
      nameAr: 'كامل',
      nameCkb: 'کامیل',
      governorate: 'Sulaymaniyah',
      governorateAr: 'السليمانية',
      governorateCkb: 'سلێمانی',
      timeAgo: '4 hours ago',
      timeAgoAr: 'قبل ٤ ساعات',
      timeAgoCkb: '٤ کاتژمێر پێش ئێستا',
      text: 'Patience and the ability to listen. In today\'s fast-paced world, many people react instantly. A successful spouse is someone who listens to understand, not just to argue.',
      textAr: 'الصبر والقدرة على الاستماع. في عالمنا السريع اليوم، يتفاعل الكثير من الناس بشكل فوري ولحظي. الشريك الناجح هو الذي يصغي ليفهم ويتفهم، وليس لمجرد الجدال أو فرض الرأي.',
      textCkb: 'ئارامگرتن و توانای گوێگرتن. لە جیهانی خێرای ئەمڕۆدا، زۆرێک لە خەڵک دەستبەجێ کاردانەوە نیشان دەدەن. هاوسەری سەرکەوتوو کەسێکە کە گوێ دەگرێت بۆ تێگەیشتن، نەک تەنها بۆ دەمەقاڵێ.',
      likes: 28
    },
    {
      id: 'rep3',
      name: 'Noor',
      nameAr: 'نور',
      nameCkb: 'نوور',
      governorate: 'Baghdad',
      governorateAr: 'بغداد',
      governorateCkb: 'بەغداد',
      timeAgo: '6 hours ago',
      timeAgoAr: 'قبل ٦ ساعات',
      timeAgoCkb: '٦ کاتژمێر پێش ئێستا',
      text: 'A high sense of responsibility and family attachment. When a spouse deeply respects and cares for their own parents and siblings, they will naturally extend that beautiful treatment to their new family.',
      textAr: 'الشعور العالي بالمسؤولية والارتباط الأسري. عندما يحترم الشريك والديه وإخوته بعمق ويهتم بهم، فإنه سينقل هذا التعامل النبيل والجميل بشكل طبيعي إلى عائلته الجديدة.',
      textCkb: 'هەستێکی بەرزی بەرپرسیارێتی و وابەستەیی خێزان. کاتێک هاوسەرێک بە قووڵی ڕێز لە دایک و باوک و خوشک و برای خۆی دەگرێت و گرنگییان پێدەدات، بە شێوەیەکی سروشتی ئەو مامەڵە جوانە بۆ خێزانە نوێیەکەی دەگوازێتەوە.',
      likes: 56
    },
    {
      id: 'rep4',
      name: 'Saman',
      nameAr: 'سامان',
      nameCkb: 'سامان',
      governorate: 'Duhok',
      governorateAr: 'دهوك',
      governorateCkb: 'دهۆک',
      timeAgo: '1 day ago',
      timeAgoAr: 'قبل يوم واحد',
      timeAgoCkb: '١ ڕۆژ پێش ئێستا',
      text: 'Honesty even in small matters. True trust is built brick by brick. Being transparent about your financial goals, lifestyle desires, and expectations from day one is the halal way to long-term success.',
      textAr: 'الصدق حتى في صغائر الأمور. الثقة الحقيقية تُبنى لبنة لبنة. الوضوح والشفافية بشأن أهدافك المالية، ورغبات أسلوب حياتك، وتوقعاتك منذ اليوم الأول هو السبيل الحلال للنجاح طويل الأمد.',
      textCkb: 'ڕاستگۆیی تەنانەت لە کارە بچووکەکانیشدا. متمانەی ڕاستەقینە خشت بە خشت دروست دەکرێت. شەفافبوون سەبارەت بە ئامانجە داراییەکانت، خواستەکانی شێوازی ژیانت و چاوەڕوانییەکانت لە ڕۆژی یەکەمەوە، ڕێگای حەڵاڵە بۆ سەرکەوتنی درێژخایەن.',
      likes: 35
    }
  ]);

  const [likedReplyIds, setLikedReplyIds] = useState<string[]>([]);

  // Daily Poll state management
  const [activePollIndex, setActivePollIndex] = useState<number>(0);
  
  const pollQuestions = [
    {
      id: 'poll1',
      questionEn: "Should both spouses work after marriage?",
      questionAr: "هل ينبغي لِكِلا الزوجين العمل بعد الزواج والمساهمة مالياً؟",
      questionCkb: "ئایا پێویستە هەردوو هاوسەرەکە کار بکەن دوای هاوسەرگیری؟",
      options: [
        { key: 'A', en: 'Yes, both should contribute to career & home', ar: 'نعم، يجب على كلاهما المساهمة في العمل والمنزل معاً', ckb: 'بەڵێ، پێویستە هەردوولا بەشداری بکەن لە کار و ماڵدا', percentage: 52 },
        { key: 'B', en: 'Only if financially necessary', ar: 'فقط إذا دعت الحاجة المادية والظروف الاقتصادية', ckb: 'تەنها ئەگەر لە ڕووی داراییەوە پێویست بوو', percentage: 28 },
        { key: 'C', en: 'No, one should focus entirely on family', ar: 'لا، يفضل تفرغ أحد الطرفين تماماً لرعاية شؤون الأسرة', ckb: 'نەخێر، پێویستە یەکێکیان تەواو تەرخان بێت بۆ خێزان', percentage: 12 },
        { key: 'D', en: 'Up to mutual agreement & lifestyle', ar: 'الأمر متروك للاتفاق المتبادل ونمط الحياة المفضل', ckb: 'بەپێی ڕێککەوتنی دوولایەنە و شێوازی ژیان', percentage: 8 }
      ],
      insightEn: "💡 52% of modern Iraqi applicants view dual-career households as a positive path toward shared success and economic ease.",
      insightAr: "💡 ٥٢٪ من المتقدمين في العراق يرون العمل المشترك وسيلة إيجابية للنجاح الأسري والتكافل الاقتصادي الصادق.",
      insightCkb: "💡 ٥٢٪ لە خوازیارانی عێراق پێیان وایە کاری هاوبەش ڕێگایەکی باشە بۆ سەرکەوتنی خێزان."
    },
    {
      id: 'poll2',
      questionEn: "How important is local cultural alignment in marriage?",
      questionAr: "ما مدى أهمية التقارب الاجتماعي والثقافي الإقليمي لإنجاح الزواج؟",
      questionCkb: "تا چەند هاوتایی کولتووری و ناوچەیی گرنگە بۆ هاوسەرگیری؟",
      options: [
        { key: 'A', en: 'Extremely critical for family harmony', ar: 'حاسم للغاية لضمان انسجام العائلتين وتجنب الخلافات', ckb: 'زۆر گرنگە بۆ تەبایی خێزانی', percentage: 41 },
        { key: 'B', en: 'Highly respected but not a dealbreaker', ar: 'محترم ومحبذ جداً ولكنه ليس شرطاً مانعاً للارتباط', ckb: 'ڕێزلێگیراوە بەڵام مەرجی سەرەکی نییە', percentage: 46 },
        { key: 'C', en: 'Minor (Individual values matter more)', ar: 'ثانوي (القيم الفردية والأخلاقية للشخص تهم أكثر)', ckb: 'لاوەکییە (بەها کەسییەکان گرنگترن)', percentage: 11 },
        { key: 'D', en: 'Irrelevant in modern marriages', ar: 'غير مؤثر تماماً في بيوت الزوجية العصرية', ckb: 'هیچ کاریگەرییەکی نییە', percentage: 2 }
      ],
      insightEn: "💡 Traditional foundations: 41% believe local family alignment guarantees smooth long-term courtship.",
      insightAr: "💡 ركائز أصيلة: ٤١٪ يجدون التوافق العائلي المحلي صمام أمان لاستقرار بيوت الزوجية الممتدة.",
      insightCkb: "💡 بنەما گرنگەکان: ٤١٪ پێیان وایە هاوتایی خێزانی ناوچەیی گەرەنتییە بۆ سەقامگیری ژیانی هاوسەری."
    }
  ];

  // User votes registry
  const [userVotes, setUserVotes] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('marriage_cafe_widget_votes');
    return saved ? JSON.parse(saved) : {};
  });

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState<string>('14:41:30');

  useEffect(() => {
    // Simulated countdown timer decrementing
    let hours = 14;
    let minutes = 41;
    let seconds = 30;

    const interval = setInterval(() => {
      if (seconds > 0) {
        seconds--;
      } else {
        seconds = 59;
        if (minutes > 0) {
          minutes--;
        } else {
          minutes = 59;
          if (hours > 0) {
            hours--;
          } else {
            hours = 23; // reset
          }
        }
      }

      const hStr = hours.toString().padStart(2, '0');
      const mStr = minutes.toString().padStart(2, '0');
      const sStr = seconds.toString().padStart(2, '0');
      setTimeLeft(`${hStr}:${mStr}:${sStr}`);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleLikeReply = (replyId: string) => {
    if (likedReplyIds.includes(replyId)) {
      // Unlike
      setLikedReplyIds(likedReplyIds.filter(id => id !== replyId));
      setReplies(replies.map(r => r.id === replyId ? { ...r, likes: r.likes - 1 } : r));
    } else {
      // Like
      setLikedReplyIds([...likedReplyIds, replyId]);
      setReplies(replies.map(r => r.id === replyId ? { ...r, likes: r.likes + 1 } : r));
      triggerToast(
        isEn 
          ? "👍 Acknowledged as a helpful marriage value contribution!" 
          : "👍 تم الإعجاب بالمساهمة الحوارية القيمة للمقبلين على الزواج!"
      );
    }
  };

  const handlePollVote = (questionId: string, optionKey: string) => {
    if (userVotes[questionId]) return; // already voted

    const updated = { ...userVotes, [questionId]: optionKey };
    setUserVotes(updated);
    localStorage.setItem('marriage_cafe_widget_votes', JSON.stringify(updated));

    triggerToast(
      isEn 
        ? "🗳️ Sincere anonymous vote cast successfully in global statistics!" 
        : "🗳️ تم تسجيل صوتك الموقر بسرية تامة لتدقيق مؤشرات التوافق!"
    );
  };

  return (
    <div className="space-y-12" id="marriage-cafe-section">
      
      {/* SECTION 1: THE MARRIAGE CAFE LOUNGE DISCUSSION */}
      <div className="bg-white/70 backdrop-blur-md border border-[#E8DCC4] rounded-[2.5rem] p-6 sm:p-10 shadow-xl space-y-8 text-start relative overflow-hidden">
        {/* Background visual detail */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-accent-coral/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#40798C]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-flex items-center space-x-1.5 rtl:space-x-reverse bg-[#40798C]/10 text-[#40798C] px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-mono font-black uppercase tracking-widest">
            <Coffee className="w-4 h-4 text-[#40798C] animate-pulse" />
            <span>{txt("Marriage Cafe", "مقهى الزواج", "کۆڕی گفتوگۆی پیرۆزی هاوسەرگیری")}</span>
          </span>
          <h3 className="text-2xl sm:text-3.5xl font-serif font-black text-warm-charcoal tracking-tight">
            {txt("Marriage Café", "مقهى الزواج التفاعلي", "چایخانەی هاوسەرگیری")}
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 font-medium leading-relaxed max-w-2xl mx-auto">
            {txt(
              "Instead of direct messaging immediately, users express their thoughts on crucial relationship questions. This calm, moderated lounge reveals values naturally and builds authentic, dignified trust.",
              "بدلاً من المراسلة المباشرة الفورية، يعبر الأعضاء عن أفكارهم وقيمهم العائلية تجاه الأسئلة المصيرية للزواج. هذا الفضاء الهادئ والمنضبط يساعد على كشف المبادئ بوقار وبناء ثقة متبادلة حقيقية.",
              "لەجیاتی نامەناردنی خێرا، ئەندامان گوزارشت لە بیروبۆچوونەکانیان دەکەن لەسەر پرسیارە چارەنووسسازەکانی هاوسەرگیری بۆ دروستکردنی متمانەی بەهادار."
            )}
          </p>
        </div>

        {/* TODAY'S CORE QUESTION BOARD */}
        <div className="bg-[#FAF7F2] border border-[#E8DCC4] rounded-2xl sm:rounded-3xl p-5 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-xs relative">
          <div className="space-y-2 text-start w-full sm:max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-accent-coral animate-ping" />
              <span className="text-[10px] font-mono font-extrabold text-[#9C7F59] uppercase tracking-widest">
                🔥 {txt("Today's Core Question", "سؤال اليوم الجوهري للمقبلين", "پرسیاری بنەڕەتی ئەمڕۆ")}
              </span>
            </div>
            <h4 className="text-base sm:text-xl font-serif font-black text-warm-charcoal leading-snug">
              {txt(
                "\"What is one quality you admire most in a future spouse?\"",
                "\"ما هي الصفة أو الخصلة النبيلة التي تبحث عنها وتفضلها أكثر في شريك حياتك المستقبلي؟\"",
                "\"گرنگترین سیفەت چییە کە زۆرترین بەهای پێدەدەیت لە هاوسەری پاشەڕۆژتدا؟\""
              )}
            </h4>
          </div>
          <button 
            onClick={() => {
              if (onNavigateToTab) onNavigateToTab('community');
              triggerToast(txt("Opening discussion forum... join respectfully!", "جاري الانتقال لساحة النقاش... شارك برأيك الوقور!", "کردنەوەی مەکۆی گفتوگۆ..."));
            }}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs sm:text-sm shadow-md shadow-emerald-800/10 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{txt("Join Discussion", "شارك في النقاش", "بەشداری بکە لە گفتوگۆدا")}</span>
          </button>
        </div>

        {/* USER ANSWERS LIST */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 pt-2">
          {replies.map((rep) => {
            const hasLiked = likedReplyIds.includes(rep.id);

            return (
              <div 
                key={rep.id}
                className="bg-[#FAFAFA] border border-[#E6DCC3]/60 hover:border-accent-coral/40 rounded-2xl sm:rounded-3xl p-5 hover:shadow-lg transition-all duration-300 flex flex-col justify-between space-y-4 text-start group/card relative"
              >
                <div className="space-y-3">
                  {/* Card Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-stone-100 to-stone-200 border border-stone-200/60 flex items-center justify-center text-warm-charcoal font-serif font-black text-xs sm:text-sm">
                        {rep.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h5 className="font-serif font-black text-xs sm:text-sm text-warm-charcoal group-hover/card:text-accent-coral transition-colors">
                            {txt(rep.name, rep.nameAr, rep.nameCkb)}
                          </h5>
                          <span className="text-[10px] bg-stone-100 border border-stone-200 text-stone-500 font-bold px-2 py-0.5 rounded-md flex items-center gap-0.5">
                            📍 {txt(rep.governorate, rep.governorateAr, rep.governorateCkb)}
                          </span>
                        </div>
                        <p className="text-[9px] sm:text-[10px] text-stone-400 font-semibold font-mono">
                          {txt(rep.timeAgo, rep.timeAgoAr, rep.timeAgoCkb)}
                        </p>
                      </div>
                    </div>
                    
                    {/* Halal Intent label */}
                    <span className="text-[8.5px] sm:text-[9.5px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-md flex items-center gap-1 shrink-0">
                      <Heart className="w-2.5 h-2.5 fill-emerald-700" />
                      <span>{txt("Marriage Intent", "نية زواج حلال", "خواستی هاوسەرگیری")}</span>
                    </span>
                  </div>

                  {/* Reply text content */}
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-semibold italic">
                    "{txt(rep.text, rep.textAr, rep.textCkb)}"
                  </p>
                </div>

                {/* Helpful button */}
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                  <button
                    onClick={() => handleLikeReply(rep.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10.5px] font-bold transition duration-200 cursor-pointer ${
                      hasLiked 
                        ? 'bg-accent-coral/15 text-accent-coral' 
                        : 'bg-stone-100 hover:bg-stone-200/80 text-stone-500'
                    }`}
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${hasLiked ? 'fill-accent-coral' : ''}`} />
                    <span>{txt("Helpful", "مفيد", "سودبەخش")} ({rep.likes})</span>
                  </button>

                  <span className="text-[9.5px] font-bold text-stone-400 group-hover/card:text-[#40798C] transition-colors flex items-center gap-1">
                    <span>{txt("View Profile", "عرض الملف الشخصي", "پڕۆفایل ببینە")}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* SECTION 2: THE DAILY ENGAGEMENT POLL */}
      <div className="bg-white/70 backdrop-blur-md border border-[#E8DCC4] rounded-[2.5rem] p-6 sm:p-10 shadow-xl space-y-8 text-start relative overflow-hidden" id="daily-poll-section">
        {/* Background Visual Blobs */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-accent-pink/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-stretch gap-8">
          
          {/* LEFT SIDE: ENGAGEMENT MOTIVATION */}
          <div className="w-full lg:w-5/12 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="inline-flex items-center space-x-1.5 rtl:space-x-reverse bg-accent-coral/10 text-accent-coral px-3.5 py-1 rounded-full text-[10px] sm:text-xs font-mono font-black uppercase tracking-widest">
                <span>{txt("Zawaj Al Araqi Daily Engagement", "التفاعل اليومي لمنصة الزواج العراقي", "تێکەڵبوونی ڕۆژانەی زەواج")}</span>
              </span>
              <h3 className="text-xl sm:text-3xl font-serif font-black text-warm-charcoal leading-snug">
                {txt("Share Your Thoughts on the Daily Poll", "شارك رأيك الوقور في الاستطلاع اليومي", "ڕای خۆت لە ڕاپرسی ڕۆژانەدا دەرببڕە")}
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 font-medium leading-relaxed">
                {txt(
                  "Every single day, we pose a thought-provoking, respectful poll. Discover how potential spouses in Erbil, Baghdad, and Sulaymaniyah view careers, family management, finances, and wedding planning.",
                  "في كل يوم، نطرح استطلاعاً قيّماً ومحترماً يمس صلب الحياة الزوجية. اكتشف كيف يرى شركاء العمر المتوافقون في بغداد، وأربيل، والسليمانية شؤون المهنة، والبيت، وتدبير الميزانية الزوجية والمستقبل.",
                  "هەموو ڕۆژێک ڕاپرسیەکی گرنگ و بەپێز بڵاودەکەینەوە. بزانە هاوسەرانی پاشەڕۆژ لە هەولێر و بەغداد و سلێمانی چۆن لە پیشە، بەڕێوەبردنی ماڵ و پلانەکان دەڕوانن."
                )}
              </p>
            </div>

            {/* RESPONDENTS & COUNTDOWN ROW */}
            <div className="grid grid-cols-2 gap-4 bg-[#FAF7F2]/80 border border-[#E8DCC4]/50 rounded-2xl p-4">
              <div className="text-start space-y-1">
                <span className="text-[9px] uppercase font-mono font-extrabold text-stone-400 tracking-wider">
                  {txt("Total Respondents", "إجمالي المشاركين", "کۆی گشتی بەشداربووان")}
                </span>
                <p className="text-lg sm:text-xl font-serif font-black text-warm-charcoal tracking-tight">
                  4,019
                </p>
              </div>
              <div className="text-start space-y-1">
                <span className="text-[9px] uppercase font-mono font-extrabold text-stone-400 tracking-wider flex items-center gap-1">
                  <Clock className="w-3 h-3 text-accent-coral animate-spin" style={{ animationDuration: '6s' }} />
                  <span>{txt("Next Poll In", "الاستطلاع التالي خلال", "ڕاپرسی داهاتوو لە")}</span>
                </span>
                <p className="text-lg sm:text-xl font-mono font-black text-accent-coral tracking-tight">
                  {timeLeft}
                </p>
              </div>
            </div>

            {/* TAB SELECTORS FOR QUESTION 1 & QUESTION 2 */}
            <div className="flex gap-2">
              <button
                onClick={() => setActivePollIndex(0)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                  activePollIndex === 0
                    ? 'bg-warm-charcoal text-white border-warm-charcoal shadow-md'
                    : 'bg-white border-stone-200 hover:bg-stone-50 text-stone-500'
                }`}
              >
                {txt("Question 1", "الاستبيان الأول", "پرسیاری ١")}
              </button>
              <button
                onClick={() => setActivePollIndex(1)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                  activePollIndex === 1
                    ? 'bg-warm-charcoal text-white border-warm-charcoal shadow-md'
                    : 'bg-white border-stone-200 hover:bg-stone-50 text-stone-500'
                }`}
              >
                {txt("Question 2", "الاستبيان الثاني", "پرسیاری ٢")}
              </button>
            </div>
          </div>

          {/* RIGHT SIDE: INTERACTIVE POLL CARD */}
          <div className="w-full lg:w-7/12 bg-white border border-[#E8DCC4]/80 rounded-3xl p-5 sm:p-7 shadow-lg flex flex-col justify-between">
            {/* Poll Card Header */}
            <div className="space-y-4">
              <div className="flex items-center gap-1.5 text-stone-400">
                <BarChart3 className="w-4 h-4 text-[#40798C]" />
                <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-[#40798C]">
                  {txt("Interactive Poll Widget - Multi-choice", "لوحة التصويت التفاعلية الحية", "پێشکەوتنی دەنگدان")}
                </span>
              </div>

              {/* ACTIVE QUESTION */}
              <h4 className="text-sm sm:text-lg font-serif font-black text-warm-charcoal leading-snug">
                {txt(
                  pollQuestions[activePollIndex].questionEn,
                  pollQuestions[activePollIndex].questionAr,
                  pollQuestions[activePollIndex].questionCkb
                )}
              </h4>

              {/* OPTIONS LIST */}
              <div className="space-y-3 pt-2">
                {pollQuestions[activePollIndex].options.map((opt) => {
                  const activePollId = pollQuestions[activePollIndex].id;
                  const votedKey = userVotes[activePollId];
                  const hasVoted = !!votedKey;
                  const isSelected = votedKey === opt.key;
                  
                  // Adjust percentage slightly if voted
                  const displayPercent = hasVoted 
                    ? (isSelected ? opt.percentage + 2 : opt.percentage - 1) 
                    : opt.percentage;

                  return (
                    <button
                      key={opt.key}
                      disabled={hasVoted}
                      onClick={() => handlePollVote(activePollId, opt.key)}
                      className={`w-full text-start p-4 rounded-xl sm:rounded-2xl border text-xs sm:text-sm font-semibold transition-all duration-300 relative overflow-hidden flex items-center justify-between ${
                        hasVoted
                          ? isSelected
                            ? 'bg-emerald-50/60 border-emerald-300 text-emerald-900 font-black'
                            : 'bg-stone-50/55 border-stone-200 text-stone-400'
                          : 'bg-[#FAFAFA] border-[#E8DCC4] hover:bg-white hover:border-accent-coral text-stone-700 cursor-pointer hover:shadow-xs active:scale-98'
                      }`}
                    >
                      {/* Background fill animation */}
                      {hasVoted && (
                        <div 
                          className={`absolute left-0 top-0 bottom-0 ${isSelected ? 'bg-emerald-500/10' : 'bg-stone-200/5'} transition-all duration-1000`} 
                          style={{ width: `${displayPercent}%` }}
                        />
                      )}

                      <span className="relative z-10 flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-full text-xs flex items-center justify-center font-mono font-bold ${
                          isSelected 
                            ? 'bg-emerald-600 text-white shadow-sm' 
                            : hasVoted 
                              ? 'bg-stone-200 text-stone-400' 
                              : 'bg-stone-100 text-stone-500 border border-stone-200/60'
                        }`}>
                          {isSelected ? <Check className="w-3.5 h-3.5 text-white stroke-[3]" /> : opt.key}
                        </span>
                        <span>{txt(opt.en, opt.ar, opt.ckb)}</span>
                      </span>

                      {hasVoted && (
                        <span className="relative z-10 text-xs font-mono font-extrabold text-stone-500">
                          {displayPercent}%
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Insight block after vote */}
            {userVotes[pollQuestions[activePollIndex].id] ? (
              <div className="mt-5 p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl text-[11px] sm:text-xs text-emerald-800 font-medium leading-relaxed flex items-start gap-2.5 animate-fade-in">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 animate-pulse" />
                <p>{txt(pollQuestions[activePollIndex].insightEn, pollQuestions[activePollIndex].insightAr, pollQuestions[activePollIndex].insightCkb)}</p>
              </div>
            ) : (
              <p className="mt-5 text-[10px] sm:text-[11px] font-medium text-stone-400 leading-normal flex items-center gap-1">
                <span>🔒</span>
                <span>{txt("All votes are 100% anonymous. Poll results help align compatibility models.", "جميع التصويتات سرية ١٠٠٪ وبدون أسماء. تساهم النتائج في تدقيق وترشيح الأطراف المتوافقة.", "هەموو دەنگدانەکان ١٠٠٪ بە نهێنین. ئەنجامەکان یارمەتیدەرن لە باشترکردنی گونجانی هاوسەرگیری.")}</span>
              </p>
            )}

          </div>

        </div>
      </div>

    </div>
  );
}





