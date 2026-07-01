import React, { useState, useMemo } from 'react';
import { AppLanguage } from '../types';
import { 
  Coffee, 
  Check, 
  Sparkles, 
  Heart, 
  Clock, 
  MessageSquare, 
  ThumbsUp, 
  Share2, 
  Send, 
  Image as ImageIcon, 
  Plus, 
  User, 
  MapPin, 
  Grid,
  HelpCircle,
  Award,
  BarChart3,
  Flame,
  Camera,
  MessageCircle,
  Eye,
  ChevronRight
} from 'lucide-react';

interface MarriageCafeProps {
  locale: AppLanguage;
  triggerToast: (msg: string) => void;
  onNavigateToTab?: (tab: any) => void;
  isAuthenticated?: boolean;
  userProfileName?: string;
  userProfileGovernorate?: string;
}

interface SocialPost {
  id: string;
  author: string;
  authorAr: string;
  authorCkb: string;
  gender: 'male' | 'female';
  governorate: string;
  governorateAr: string;
  governorateCkb: string;
  timeAgo: string;
  timeAgoAr: string;
  timeAgoCkb: string;
  type: 'photo' | 'opinion' | 'poll';
  caption: string;
  captionAr: string;
  captionCkb: string;
  imageUrl?: string;
  pollQuestion?: string;
  pollQuestionAr?: string;
  pollQuestionCkb?: string;
  pollOptions?: {
    key: string;
    en: string;
    ar: string;
    ckb: string;
    votes: number;
  }[];
  userVotedOption?: string; // option key like 'A', 'B' etc.
  likes: number;
  likedByUser: boolean;
  comments: {
    id: string;
    author: string;
    authorAr: string;
    authorCkb: string;
    text: string;
    textAr: string;
    textCkb: string;
    timeAgo: string;
  }[];
}

const PRESET_PHOTOS = [
  {
    id: 'p1',
    name: 'Traditional Tea (Istikan)',
    url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=600',
    description: 'A symbol of traditional warmth and hospitality.'
  },
  {
    id: 'p2',
    name: 'Citadel of Erbil sunset',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600',
    description: 'Timeless ancient beauty of our homeland.'
  },
  {
    id: 'p3',
    name: 'Engagement Golden Rings',
    url: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&q=80&w=600',
    description: 'The blessed symbol of marital commitment.'
  },
  {
    id: 'p4',
    name: 'Elegant roses & book',
    url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&q=80&w=600',
    description: 'A touch of respect and romantic grace.'
  },
  {
    id: 'p5',
    name: 'Baghdad historic street',
    url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=600',
    description: 'Beautiful cultural roots of Baghdad Al-Mutanabbi.'
  }
];

export default function MarriageCafe({ 
  locale, 
  triggerToast, 
  onNavigateToTab,
  isAuthenticated = false,
  userProfileName = 'Anonymous Candidate',
  userProfileGovernorate = 'Baghdad'
}: MarriageCafeProps) {
  const isEn = locale === 'en';
  const isCkb = locale === 'ckb';

  const txt = (en: string, ar: string, ckb: string) => {
    return isEn ? en : isCkb ? ckb : ar;
  };

  // 1. Core Social Feed State
  const [posts, setPosts] = useState<SocialPost[]>([
    {
      id: 'post-1',
      author: 'Ahmad Al-Saeedi',
      authorAr: 'أحمد السعيدي',
      authorCkb: 'ئەحمەد سەعیدی',
      gender: 'male',
      governorate: 'Baghdad',
      governorateAr: 'بغداد',
      governorateCkb: 'بەغداد',
      timeAgo: '10 minutes ago',
      timeAgoAr: 'قبل ١٠ دقائق',
      timeAgoCkb: '١٠ خولەک پێش ئێستا',
      type: 'photo',
      caption: 'The foundation of a successful marital home lies in mutual consultation (Shura). May Allah bless everyone with a pious companion who shares their faith and values.',
      captionAr: 'أساس البيت الزوجي الناجح والمبارك يقوم على الشورى والرحمة المتبادلة. نسأل الله أن يرزق الجميع شريكاً صالحاً يتقي الله ويشاركنا ذات القيم الراقية.',
      captionCkb: 'بنەمای ماڵی هاوسەرگیری سەرکەوتوو لەسەر شورا و ڕێز دروست دەبێت. خوا کاندیدی گونجاو بەسەر هەمواندا ببارێنێت.',
      imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=600',
      likes: 84,
      likedByUser: false,
      comments: [
        {
          id: 'c-1',
          author: 'Saja Jamil',
          authorAr: 'سجى جميل',
          authorCkb: 'سەجا جەمیل',
          text: 'Mashallah, beautiful sentiment! Mutual respect is indeed the pillar of any lasting halal marriage.',
          textAr: 'ما شاء الله، كلمات راقية! الاحترام والشورى هما عماد الأسرة الطيبة المستقرة.',
          textCkb: 'ماشاءالله، وتەی زۆر جوانە! ڕێزی دوولایەنە کۆڵەکەی هاوسەرگیریە.',
          timeAgo: '5 minutes ago'
        }
      ]
    },
    {
      id: 'post-2',
      author: 'Darya',
      authorAr: 'داريا',
      authorCkb: 'داریا',
      gender: 'female',
      governorate: 'Erbil',
      governorateAr: 'أربيل',
      governorateCkb: 'هەولێر',
      timeAgo: '2 hours ago',
      timeAgoAr: 'قبل ساعتين',
      timeAgoCkb: '٢ کاتژمێر پێش ئێستا',
      type: 'poll',
      caption: 'I would love to gather honest community opinions on how we should handle the transition from initial digital mutual approval to involving family guardians (Wali). What is the ideal timeline for you?',
      captionAr: 'أود أن أسمع آراء المجتمع بكل أمانة حول كيفية الانتقال من القبول الرقمي المتبادل إلى دعوة أولياء الأمور (الوالي). ما هو الوقت المثالي والمناسب لخطوة كهذه بنظركم؟',
      captionCkb: 'حەز دەکەم ڕای ئێوە بزانم لەسەر ئەوەی دوای ڕێککەوتنی دوولایەنە کەی باسی خێزان بکرێت؟ کاتێکی گونجاو چییە لای ئێوە؟',
      pollQuestion: 'What is the ideal timeline to involve family after mutual approval?',
      pollQuestionAr: 'ما هو الوقت المثالي لإشراك العائلة بعد القبول المتبادل؟',
      pollQuestionCkb: 'کاتی گونجاو بۆ ئاگادارکردنەوەی خێزان کەیە دوای ڕێککەوتن؟',
      pollOptions: [
        { key: 'A', en: 'Immediately (Within 1 week)', ar: 'فوراً (خلال أسبوع واحد)', ckb: 'دەستبەجێ (لە ماوەی یەک هەفتەدا)', votes: 45 },
        { key: 'B', en: 'After 2-3 weeks of structured messaging', ar: 'بعد ٢-٣ أسابيع من المحادثة المقننة والوقورة', ckb: 'دوای ٢-٣ هەفتە لە چاتی ڕێکوپێک', votes: 112 },
        { key: 'C', en: '1 month (To ensure core values match)', ar: 'بعد شهر كامل (للتأكد تماماً من توافق المبادئ)', ckb: '١ مانگ دوای دڵنیابوون لە بەهاکان', votes: 78 },
        { key: 'D', en: 'Varies by governorate customs', ar: 'يختلف حسب عادات وتقاليد كل محافظة وعشيرة', ckb: 'بەپێی نەریتی پارێزگاکان دەگۆڕێت', votes: 23 }
      ],
      likes: 120,
      likedByUser: false,
      comments: [
        {
          id: 'c-2',
          author: 'Kamil',
          authorAr: 'كامل',
          authorCkb: 'کامیل',
          text: 'Personally, Option B is best. It gives both sides a chance to evaluate core morals before formalizing.',
          textAr: 'شخصياً أجد الخيار الثاني (ب) هو الأنسب. يتيح فرصة لتقييم الأخلاق الأساسية بوقار قبل إعلام الأهل.',
          textCkb: 'بە ڕای من بژاردەی دووەم باشترە. هەلێک دەداتە هەردوولا بۆ تێگەیشتن پێش ڕێکارە فەرمییەکان.',
          timeAgo: '1 hour ago'
        }
      ]
    },
    {
      id: 'post-3',
      author: 'Noor J.',
      authorAr: 'نور ج.',
      authorCkb: 'نوور ج.',
      gender: 'female',
      governorate: 'Baghdad',
      governorateAr: 'بغداد',
      governorateCkb: 'بەغداد',
      timeAgo: '4 hours ago',
      timeAgoAr: 'قبل ٤ ساعات',
      timeAgoCkb: '٤ کاتژمێر پێش ئێستا',
      type: 'opinion',
      caption: 'The single most important trait in a life companion is patience and the ability to listen. In our fast modern times, listening to understand is a rare, divine gem. Do you agree?',
      captionAr: 'الصفة الأهم على الإطلاق في شريك الحياة هي الصبر والقدرة الكافية على الإصغاء. في عصرنا الحديث المتسارع، الاستماع من أجل الفهم هو جوهرة إلهية نادرة. هل توافقونني الرأي؟',
      captionCkb: 'گرنگترین سیفەت لە هاوبەشی ژیاندا ئارامگرتن و گوێگرتنە. لەم سەردەمە خێرایەدا، گوێگرتن بۆ تێگەیشتن گەوهەرێکی دەگمەنە. هاوڕان؟',
      likes: 67,
      likedByUser: false,
      comments: []
    }
  ]);

  // 2. Publisher Form State
  const [activeFormType, setActiveFormType] = useState<'opinion' | 'photo' | 'poll'>('opinion');
  const [captionText, setCaptionText] = useState('');
  const [selectedPresetPhoto, setSelectedPresetPhoto] = useState<string>(PRESET_PHOTOS[0].url);
  
  // Custom Poll Inputs
  const [pollQuestionText, setPollQuestionText] = useState('');
  const [pollOptA, setPollOptA] = useState('');
  const [pollOptB, setPollOptB] = useState('');
  const [pollOptC, setPollOptC] = useState('');

  // 3. Comment Box State
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  // 4. Modal/Interactive States
  const [showPhotoPicker, setShowPhotoPicker] = useState(false);

  // 5. Submit New Post Handler
  const handlePublishPost = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      triggerToast(txt(
        "💍 Please login or create a profile to write opinions, upload photos, or create polls!",
        "💍 يرجى تسجيل الدخول أو إكمال ملفك أولاً لتتمكن من كتابة الآراء، مشاركة الصور، أو إطلاق الاستطلاعات!",
        "💍 تکایە بچۆ ژوورەوە یان پڕۆفایل دروست بکە بۆ نووسینی ڕا و بڵاوکردنەوەی وێنەکان!"
      ));
      if (onNavigateToTab) onNavigateToTab('onboarding');
      return;
    }

    if (!captionText.trim()) {
      triggerToast(txt("⚠️ Please write a caption or thought first!", "⚠️ يرجى كتابة تعليقك أو فكرتك أولاً!", "⚠️ تکایە سەرەتا بابەتێک بنووسە!"));
      return;
    }

    if (activeFormType === 'poll' && (!pollQuestionText.trim() || !pollOptA.trim() || !pollOptB.trim())) {
      triggerToast(txt("⚠️ Please fill the poll question and at least two options!", "⚠️ يرجى ملء سؤال الاستطلاع وخيارين على الأقل!", "⚠️ تکایە پرسیاری ڕاپرسیەکە و دوو بژاردە بنووسە!"));
      return;
    }

    // Build the new post
    const newPost: SocialPost = {
      id: `custom-post-${Date.now()}`,
      author: userProfileName,
      authorAr: userProfileName,
      authorCkb: userProfileName,
      gender: 'male', // default or dynamic based on profile
      governorate: userProfileGovernorate,
      governorateAr: userProfileGovernorate,
      governorateCkb: userProfileGovernorate,
      timeAgo: 'Just now',
      timeAgoAr: 'الآن',
      timeAgoCkb: 'ئێستا',
      type: activeFormType,
      caption: captionText,
      captionAr: captionText,
      captionCkb: captionText,
      likes: 1,
      likedByUser: true,
      comments: []
    };

    if (activeFormType === 'photo') {
      newPost.imageUrl = selectedPresetPhoto;
    } else if (activeFormType === 'poll') {
      newPost.pollQuestion = pollQuestionText;
      newPost.pollQuestionAr = pollQuestionText;
      newPost.pollQuestionCkb = pollQuestionText;
      
      const options = [
        { key: 'A', en: pollOptA, ar: pollOptA, ckb: pollOptA, votes: 1 },
        { key: 'B', en: pollOptB, ar: pollOptB, ckb: pollOptB, votes: 0 }
      ];

      if (pollOptC.trim()) {
        options.push({ key: 'C', en: pollOptC, ar: pollOptC, ckb: pollOptC, votes: 0 });
      }

      newPost.pollOptions = options;
      newPost.userVotedOption = 'A'; // Auto-voted for option A as publisher
    }

    // Add to state list
    setPosts([newPost, ...posts]);

    // Reset fields
    setCaptionText('');
    setPollQuestionText('');
    setPollOptA('');
    setPollOptB('');
    setPollOptC('');
    triggerToast(txt(
      "✨ Post shared successfully in the Marriage Café social feed!",
      "✨ تم نشر مشاركتك بنجاح في مقهى الزواج التفاعلي ليتفاعل معها الأعضاء بوقار!",
      "✨ بابەتەکەت بە سەرکەوتوویی لە چایخانەی هاوسەرگیری بڵاوکرایەوە!"
    ));
  };

  // 6. Like Post Handler
  const handleLikePost = (postId: string) => {
    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id === postId) {
          const isLiked = post.likedByUser;
          return {
            ...post,
            likedByUser: !isLiked,
            likes: isLiked ? post.likes - 1 : post.likes + 1
          };
        }
        return post;
      })
    );

    const post = posts.find(p => p.id === postId);
    if (post && !post.likedByUser) {
      triggerToast(txt("❤️ Liked post!", "❤️ أعجبتك المشاركة!", "❤️ بەدڵت بوو!"));
    }
  };

  // 7. Poll Vote Handler
  const handlePollVote = (postId: string, optionKey: string) => {
    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id === postId && !post.userVotedOption) {
          const updatedOptions = post.pollOptions?.map(opt => {
            if (opt.key === optionKey) {
              return { ...opt, votes: opt.votes + 1 };
            }
            return opt;
          });
          return {
            ...post,
            pollOptions: updatedOptions,
            userVotedOption: optionKey
          };
        }
        return post;
      })
    );
    triggerToast(txt("🗳️ Anonymous vote registered!", "🗳️ تم تسجيل صوتك بسرية تامة!", "🗳️ دەنگەکەت بە نهێنی تۆمارکرا!"));
  };

  // 8. Submit Comment Handler
  const handleAddComment = (postId: string) => {
    const inputVal = commentInputs[postId];
    if (!inputVal || !inputVal.trim()) return;

    if (!isAuthenticated) {
      triggerToast(txt("💍 Please login or register to write comments!", "💍 يرجى تسجيل الدخول أولاً للتعليق!", "💍 تکایە بچۆ ژوورەوە بۆ ناردنی کۆمێنت!"));
      return;
    }

    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id === postId) {
          const newComment = {
            id: `comment-${Date.now()}`,
            author: userProfileName,
            authorAr: userProfileName,
            authorCkb: userProfileName,
            text: inputVal,
            textAr: inputVal,
            textCkb: inputVal,
            timeAgo: 'Just now'
          };
          return {
            ...post,
            comments: [...post.comments, newComment]
          };
        }
        return post;
      })
    );

    // Clear specific comment input
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    triggerToast(txt("💬 Comment added respectfully!", "💬 تم إضافة تعليقك بوقار واحترام!", "💬 کۆمێنتەکە بە سەرکەوتوویی زیادکرا!"));
  };

  return (
    <div className="space-y-8" id="marriage-cafe-timeline-wrapper">
      
      {/* SOCIAL MEDIA STYLE CAFE BOARD HEADER */}
      <div className="bg-[#FAF8F5] border border-[#E8DCC4] rounded-3xl p-5 sm:p-6 text-start space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-accent-coral/15 flex items-center justify-center text-accent-coral">
            <Coffee className="w-5 h-5 animate-bounce" />
          </div>
          <div>
            <h3 className="text-lg sm:text-2xl font-serif font-black text-warm-charcoal flex items-center gap-1.5">
              <span>{txt("Marriage Café Lounge", "مقهى ومجلس الزواج التفاعلي", "چایخانەی هاوسەرگیری")}</span>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-700 px-2.5 py-0.5 rounded-full font-mono uppercase font-extrabold animate-pulse">
                {txt("Community Hub", "ساحة تفاعلية", "مەکۆی گشتی")}
              </span>
            </h3>
            <p className="text-xs text-stone-500 font-semibold">
              {txt(
                "An elegant social platform to share thoughts, view verified photo diaries, write opinions, and vote on family polls.",
                "منصة تواصل راقية تمكنك من مشاركة الأفكار، مذكرات الصور الموثقة، كتابة الآراء، والتصويت على شؤون الأسرة.",
                "پلاتفۆرمێکی کۆمەڵایەتی بەرز بۆ هاوبەشکردنی بیرۆکەکان، وێنەکان، و دەنگدان لەسەر ڕاپرسییەکان."
              )}
            </p>
          </div>
        </div>
      </div>

      {/* ----------------- FEED PUBLISHER BOX ----------------- */}
      <div className="bg-white border border-[#E8DCC4] rounded-3xl p-5 sm:p-6 shadow-md text-start space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center font-bold font-serif text-warm-charcoal shadow-inner">
            {userProfileName.charAt(0)}
          </div>
          <span className="text-xs sm:text-sm font-bold text-warm-charcoal">
            {txt("What is on your mind regarding marriage, values, or life?", "ما هي تطلعاتك أو أفكارك بخصوص الزواج المبارك والأسرة؟", "بیرۆکەت چییە لەسەر هاوسەرگیری و پێکەوەژیان؟")}
          </span>
        </div>

        {/* TYPE SELECTOR TABS */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-stone-100">
          <button
            type="button"
            onClick={() => setActiveFormType('opinion')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer border ${
              activeFormType === 'opinion'
                ? 'bg-accent-coral text-white border-accent-coral shadow-sm'
                : 'bg-stone-50 hover:bg-stone-100 text-stone-500 border-stone-200'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span>{txt("Write Opinion", "كتابة رأي فكري", "نووسینی ڕا")}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveFormType('photo');
              setShowPhotoPicker(true);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer border ${
              activeFormType === 'photo'
                ? 'bg-[#40798C] text-white border-[#40798C] shadow-sm'
                : 'bg-stone-50 hover:bg-stone-100 text-stone-500 border-stone-200'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>{txt("Upload Photo", "مشاركة صورة وقورة", "بڵاوکردنەوەی وێنە")}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFormType('poll')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer border ${
              activeFormType === 'poll'
                ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                : 'bg-stone-50 hover:bg-stone-100 text-stone-500 border-stone-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>{txt("Create Poll", "إطلاق استطلاع رأي", "دروستکردنی ڕاپرسی")}</span>
          </button>
        </div>

        {/* INTERACTIVE FORM FIELDS */}
        <form onSubmit={handlePublishPost} className="space-y-4 pt-2">
          
          {/* Main Caption Input */}
          <textarea
            value={captionText}
            onChange={(e) => setCaptionText(e.target.value)}
            rows={3}
            placeholder={
              activeFormType === 'opinion'
                ? txt("Share an opinion or question (e.g. \"I believe mutual goals are key...\")", "اكتب رأيك الفكري أو سؤالك الجاد للمجتمع (مثال: الشورى في بيوت الزوجية...)", "ڕا و سەرنجەکانت لێرە بنووسە...")
                : activeFormType === 'photo'
                  ? txt("Write a beautiful caption to accompany your photo...", "اكتب تعليقاً جميلاً ووقوراً ليرمز لصورتك المقترحة...", "نووسینێک بۆ وێنەکەت بنووسە...")
                  : txt("Introduce your poll topic with a brief caption...", "اكتب مقدمة قصيرة تشرح هدف استطلاعك التفاعلي...", "مقدمەیەکی کورت بۆ ڕاپرسیەکە بنووسە...")
            }
            className="w-full p-4 bg-[#FAF9F6] border border-[#E6DCC3] rounded-2xl text-xs sm:text-sm text-warm-charcoal font-semibold outline-none focus:border-accent-coral/50 shadow-inner"
          />

          {/* Photo Preset Selector preview */}
          {activeFormType === 'photo' && (
            <div className="bg-[#FAF9F6] p-4 border border-[#E6DCC3]/80 rounded-2xl space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-mono font-bold text-[#9C7F59] flex items-center gap-1">
                  <Camera className="w-3.5 h-3.5" />
                  <span>{txt("Selected Photo Preset", "الصورة التعبيرية المختارة", "وێنەی دیاریکراو")}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowPhotoPicker(true)}
                  className="text-[10px] text-accent-coral font-black underline cursor-pointer hover:opacity-85"
                >
                  {txt("Change Photo ➔", "تغيير الصورة ➔", "گۆڕینی وێنە ➔")}
                </button>
              </div>

              <div className="flex items-center gap-4">
                <img
                  src={selectedPresetPhoto}
                  alt="Preset preview"
                  className="w-20 h-20 rounded-xl object-cover border border-stone-200 shadow-sm"
                  referrerPolicy="no-referrer"
                />
                <p className="text-xs text-stone-500 font-medium italic">
                  "{PRESET_PHOTOS.find(p => p.url === selectedPresetPhoto)?.description || 'Verified Marriage Motif'}"
                </p>
              </div>
            </div>
          )}

          {/* Poll Setup Block */}
          {activeFormType === 'poll' && (
            <div className="bg-[#F6F8F9] p-4 border border-stone-200 rounded-2xl space-y-3">
              <span className="text-[11px] font-mono font-bold text-[#40798C] flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{txt("Poll Custom Options", "تجهيز خيارات استبيان اليوم", "ئامادەکردنی بژاردەکانی ڕاپرسی")}</span>
              </span>

              <div className="space-y-2">
                <input
                  type="text"
                  value={pollQuestionText}
                  onChange={(e) => setPollQuestionText(e.target.value)}
                  placeholder={txt("Ask a question: (e.g. \"How important is salary alignment?\")", "سؤال الاستطلاع: (مثال: ما أهمية التوافق في الميزانية الزوجية؟)", "پرسیار بنووسە...")}
                  className="w-full px-3 py-2.5 bg-white border border-stone-200 rounded-xl text-xs font-bold text-warm-charcoal outline-none focus:border-[#40798C]"
                />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={pollOptA}
                    onChange={(e) => setPollOptA(e.target.value)}
                    placeholder={txt("Option A *", "الخيار الأول *", "بژاردەی یەکەم *")}
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-semibold text-warm-charcoal outline-none focus:border-[#40798C]"
                    required
                  />
                  <input
                    type="text"
                    value={pollOptB}
                    onChange={(e) => setPollOptB(e.target.value)}
                    placeholder={txt("Option B *", "الخيار الثاني *", "بژاردەی دووەم *")}
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-semibold text-warm-charcoal outline-none focus:border-[#40798C]"
                    required
                  />
                  <input
                    type="text"
                    value={pollOptC}
                    onChange={(e) => setPollOptC(e.target.value)}
                    placeholder={txt("Option C (Optional)", "الخيار الثالث (اختياري)", "بژاردەی سێیەم (ئارەزوومەندانە)")}
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-semibold text-stone-600 outline-none focus:border-[#40798C]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Submit Row */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-[#2D3142] hover:bg-warm-charcoal text-white font-black text-xs sm:text-sm active:scale-95 transition flex items-center gap-1.5 shadow-md shadow-black/10 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{txt("Post to Marriage Café", "انشر في مقهى الزواج", "بڵاوکردنەوە لە چایخانە")}</span>
            </button>
          </div>

        </form>
      </div>

      {/* PHOTO PICKER MODAL/DIALOG */}
      {showPhotoPicker && (
        <div className="fixed inset-0 bg-[#1A1816]/75 backdrop-blur-xs z-[10001] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white border border-[#E8DCC4] rounded-[2rem] p-6 max-w-md w-full text-start space-y-4 shadow-2xl">
            <div className="flex justify-between items-center">
              <h4 className="text-sm sm:text-base font-serif font-black text-warm-charcoal flex items-center gap-1.5">
                <Camera className="w-5 h-5 text-accent-coral" />
                <span>{txt("Select Dignified Traditional Photo", "اختر صورة تعبيرية وقورة للمجتمع", "وێنەیەکی گونجاو هەڵبژێرە")}</span>
              </h4>
              <button 
                onClick={() => setShowPhotoPicker(false)}
                className="w-7 h-7 bg-stone-100 hover:bg-stone-200 rounded-full flex items-center justify-center text-stone-500 cursor-pointer text-xs font-bold"
              >
                ✕
              </button>
            </div>
            
            <p className="text-[11px] text-stone-500 font-semibold leading-relaxed">
              {txt(
                "To maintain pristine family respect and prevent inappropriate uploads, choose one of our highly curated Iraqi wedding, heritage, or tea presets.",
                "للحفاظ على قيم الاحترام والذوق العام، يرجى الاختيار من بين صورنا التعبيرية التراثية أو العائلية أو صور زفاف عراقية أصيلة.",
                "بۆ پاراستنی ڕێز، تکایە یەکێک لە وێنە فەرمییە کۆمەڵایەتییەکان دیاری بکە."
              )}
            </p>

            <div className="grid grid-cols-2 gap-3 max-h-[250px] overflow-y-auto pr-1">
              {PRESET_PHOTOS.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => {
                    setSelectedPresetPhoto(item.url);
                    setShowPhotoPicker(false);
                    triggerToast(txt("Photo preview selected!", "تم اختيار الصورة بنجاح!", "وێنەکە دیاریکرا!"));
                  }}
                  className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all p-1 bg-stone-50 ${
                    selectedPresetPhoto === item.url 
                      ? 'border-accent-coral ring-2 ring-accent-coral/25 bg-accent-coral/5' 
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <img src={item.url} alt={item.name} className="w-full h-24 object-cover rounded-lg" referrerPolicy="no-referrer" />
                  <span className="block text-[9px] font-bold text-warm-charcoal text-center mt-1 truncate px-1">
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ----------------- SOCIAL FEED TIMELINE ----------------- */}
      <div className="space-y-6" id="social-feed-posts-container">
        {posts.map((post) => {
          
          // Poll percentage math
          const totalVotes = post.pollOptions?.reduce((sum, opt) => sum + opt.votes, 0) || 1;
          const hasVoted = !!post.userVotedOption;

          return (
            <div 
              key={post.id}
              className="bg-white border border-[#E8DCC4]/80 rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300 text-start space-y-4"
            >
              
              {/* Post Author Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-serif font-black shadow-inner border ${
                    post.gender === 'female' 
                      ? 'bg-rose-50 border-rose-200/60 text-rose-600' 
                      : 'bg-[#40798C]/10 border-[#40798C]/20 text-[#40798C]'
                  }`}>
                    {post.author.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="font-serif font-black text-xs sm:text-sm text-warm-charcoal">
                        {txt(post.author, post.authorAr, post.authorCkb)}
                      </h4>
                      <span className="text-[10px] bg-stone-100 border border-stone-150 text-stone-500 px-2 py-0.5 rounded-md font-bold flex items-center gap-0.5 shadow-2xs">
                        📍 {txt(post.governorate, post.governorateAr, post.governorateCkb)}
                      </span>
                      {post.gender === 'female' && (
                        <span className="text-[8px] sm:text-[9px] font-mono font-black text-rose-600 bg-rose-50 border border-rose-100 px-1.5 py-0.5 rounded-md">
                          🔒 {txt("Photo Protected", "العروس محمية", "بووک پارێزراوە")}
                        </span>
                      )}
                    </div>
                    <p className="text-[9.5px] font-mono font-bold text-stone-400">
                      {txt(post.timeAgo, post.timeAgoAr, post.timeAgoCkb)}
                    </p>
                  </div>
                </div>

                <span className="text-[9px] sm:text-[10px] bg-[#FAF8F5] border border-stone-200 text-[#9C7F59] px-2.5 py-1 rounded-full font-mono font-bold">
                  {post.type === 'opinion' && `💬 ${txt("Opinion", "رأي فكري", "ڕا")}`}
                  {post.type === 'photo' && `🖼️ ${txt("Diary Entry", "مذكرة مصورة", "وێنەی گەشتی ژیان")}`}
                  {post.type === 'poll' && `📊 ${txt("Community Poll", "استطلاع مجتمعي", "ڕاپرسی گشتی")}`}
                </span>
              </div>

              {/* Caption Text Body */}
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-semibold">
                {txt(post.caption, post.captionAr, post.captionCkb)}
              </p>

              {/* Type 1: Photo Share content */}
              {post.type === 'photo' && post.imageUrl && (
                <div className="relative rounded-2xl overflow-hidden aspect-video border border-stone-200 bg-stone-100 group/img shadow-inner">
                  <img
                    src={post.imageUrl}
                    alt="Marriage Café Shared Entry"
                    className="w-full h-full object-cover select-none pointer-events-none group-hover/img:scale-102 transition duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Floating badge */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/40 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-[9px] font-mono font-bold">
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>{txt("Verified Safe Image", "صورة تراثية معتمدة", "وێنەی پشتڕاستکراو")}</span>
                  </div>
                </div>
              )}

              {/* Type 2: Poll content */}
              {post.type === 'poll' && post.pollOptions && (
                <div className="bg-[#FAF9F7] border border-[#E8DCC4]/50 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center gap-1.5 text-[#40798C] pb-1 border-b border-[#E8DCC4]/30">
                    <BarChart3 className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider">
                      {txt(post.pollQuestion || '', post.pollQuestionAr || '', post.pollQuestionCkb || '')}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {post.pollOptions.map((opt) => {
                      const isOptionSelected = post.userVotedOption === opt.key;
                      const percent = Math.round((opt.votes / totalVotes) * 100) || 0;

                      return (
                        <button
                          key={opt.key}
                          disabled={hasVoted}
                          onClick={() => handlePollVote(post.id, opt.key)}
                          className={`w-full text-start p-3 rounded-xl border text-xs font-bold transition-all duration-300 relative overflow-hidden flex items-center justify-between ${
                            hasVoted
                              ? isOptionSelected
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                                : 'bg-white border-stone-200 text-stone-400'
                              : 'bg-white border-stone-150 hover:border-accent-coral text-stone-700 cursor-pointer'
                          }`}
                        >
                          {/* Animated background bar */}
                          {hasVoted && (
                            <div 
                              className={`absolute left-0 top-0 bottom-0 ${isOptionSelected ? 'bg-emerald-500/10' : 'bg-stone-100'} transition-all duration-1000`} 
                              style={{ width: `${percent}%` }}
                            />
                          )}

                          <span className="relative z-10 flex items-center gap-2">
                            <span className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-mono font-extrabold ${
                              isOptionSelected 
                                ? 'bg-emerald-600 text-white' 
                                : 'bg-stone-100 text-stone-500'
                            }`}>
                              {opt.key}
                            </span>
                            <span>{txt(opt.en, opt.ar, opt.ckb)}</span>
                          </span>

                          {hasVoted && (
                            <span className="relative z-10 font-mono text-[10px] font-extrabold text-stone-500">
                              {percent}% ({opt.votes})
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Engagement Row: Like, Comments trigger */}
              <div className="pt-3 border-t border-stone-100 flex items-center gap-4 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => handleLikePost(post.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition duration-150 cursor-pointer ${
                    post.likedByUser 
                      ? 'bg-rose-50 text-rose-600' 
                      : 'hover:bg-stone-100 text-stone-500'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${post.likedByUser ? 'fill-rose-600 text-rose-600' : 'text-stone-400'}`} />
                  <span>{txt("Love", "حب واحترام", "بۆچوونی جوان")} ({post.likes})</span>
                </button>

                <div className="flex items-center gap-1.5 text-stone-500 px-3 py-1.5">
                  <MessageSquare className="w-4 h-4 text-stone-400" />
                  <span>{txt("Replies", "مساهمات الحوار", "کۆمێنتەکان")} ({post.comments.length})</span>
                </div>
              </div>

              {/* 💬 Comments Thread List */}
              {post.comments.length > 0 && (
                <div className="bg-stone-50/70 border border-stone-150/60 rounded-2xl p-3 sm:p-4 space-y-3">
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="text-start space-y-1 bg-white border border-stone-100 rounded-xl p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-warm-charcoal">
                          {txt(comment.author, comment.authorAr, comment.authorCkb)}
                        </span>
                        <span className="text-[9px] text-stone-400 font-mono">
                          {comment.timeAgo}
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 leading-normal font-medium">
                        {txt(comment.text, comment.textAr, comment.textCkb)}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Comment Input Row */}
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  value={commentInputs[post.id] || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setCommentInputs(prev => ({ ...prev, [post.id]: val }));
                  }}
                  placeholder={txt("Write a respectful marital reply...", "اكتب رداً وقوراً وشرعياً على هذا الرأي...", "وەڵامێکی بەڕێز بنووسە...")}
                  className="flex-1 px-4 py-2.5 bg-[#FAF9F6] border border-[#E6DCC3] rounded-xl text-xs sm:text-sm font-semibold text-warm-charcoal outline-none focus:border-accent-coral/30 shadow-inner"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddComment(post.id);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => handleAddComment(post.id)}
                  className="px-4 py-2.5 bg-[#40798C] hover:bg-[#316070] text-white rounded-xl text-xs font-bold active:scale-95 transition cursor-pointer flex items-center gap-1 shrink-0 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{txt("Send", "أرسل", "بنێرە")}</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
