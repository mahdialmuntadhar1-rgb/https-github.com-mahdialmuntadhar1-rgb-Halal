import React, { useState, useEffect } from 'react';
import { AppLanguage, UserProfile, MatchProfile } from '../types';
import { 
  Mail, Phone, Calendar, MapPin, Briefcase, GraduationCap, Check, X, 
  Inbox, Sparkles, Send, ShieldCheck, Heart, RotateCcw, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PostboxProps {
  locale: AppLanguage;
  userProfile: UserProfile;
  matches: MatchProfile[];
  onAcceptRequest: (matchId: string) => void;
  onDeclineRequest: (matchId: string) => void;
  triggerToast: (msg: string) => void;
  onNavigateToTab?: (tab: any) => void;
}

interface PostcardData {
  id: string;
  matchId: string;
  senderName: string;
  senderAge: number;
  senderGender: 'male' | 'female';
  senderProfession: string;
  senderEducation: string;
  senderDistrict: string;
  senderGovernorate: string;
  senderEmail: string;
  senderPhone: string;
  senderPhoto: string;
  messageEn: string;
  messageAr: string;
  messageCkb: string;
  stampUrl: string;
  createdAt: string;
  status: 'pending' | 'accepted' | 'declined';
}

export default function Postbox({ 
  locale, 
  userProfile, 
  matches, 
  onAcceptRequest, 
  onDeclineRequest,
  triggerToast,
  onNavigateToTab
}: PostboxProps) {
  const isEn = locale === 'en';
  const isCkb = locale === 'ckb';

  const txt = (en: string, ar: string, ckb: string) => {
    return isEn ? en : isCkb ? ckb : ar;
  };

  // State for postcards
  const [postcards, setPostcards] = useState<PostcardData[]>([]);
  const [selectedPostcard, setSelectedPostcard] = useState<PostcardData | null>(null);

  // Load / Generate postcards based on user's gender
  useEffect(() => {
    // Determine the gender of senders (opposite to the user)
    const targetGender = userProfile.gender === 'female' ? 'male' : 'female';
    
    // Filter opposite gender matches to build postcards from
    const prospectiveSenders = matches.filter(m => m.gender === targetGender);
    
    // Fallback if no matches loaded yet
    const pool = prospectiveSenders.length > 0 ? prospectiveSenders : matches;

    // Define some vintage stamp URLs
    const stamps = [
      "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=80&fit=crop&q=80", // Vintage festive
      "https://images.unsplash.com/photo-1549417229-aa67d3263c09?w=80&fit=crop&q=80", // Elegant crest
      "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=80&fit=crop&q=80"  // Botanical rose
    ];

    const messages = [
      {
        en: "Assalamu Alaikum. I reviewed your profile and felt a deep resonance with your commitment to family first and traditional values. I hope we can establish respectful contact to understand our compatibility under the guidance of our guardians.",
        ar: "السلام عليكم ورحمة الله. لقد اطلعت على ملفكم الشخصي الموقر وشعرت بتوافق عميق مع مبادئكم الكريمة التي تركز على العائلة أولاً. آمل أن نتمكن من فتح قناة تواصل محترمة لتقييم الانسجام تحت إشراف الأهل.",
        ckb: "ئەسەلامو عەلەیکوم. من سەیری پڕۆفایلی جەنابتانم کرد و هەستم بە گونجانێکی قووڵ کرد لەگەڵ بەهاکانتاندا. هیوادارم بتوانین پەیوەندییەکی ڕێزدار دروست بکەین لە ژێر چاودێری سەرپەرشتیارەکانماندا."
      },
      {
        en: "Respectful greetings. Your timeline and aspirations for a quiet, stable marital household match my lifestyle plan perfectly. I share your professional dedication and education level. I would be honored if you accept my proposal postcard.",
        ar: "تحية طيبة وقورة. إن جدولكم الزمني وتطلعاتكم لتأسيس بيت زوجي مستقر وهادئ يتطابقان تماماً مع رؤيتي للمستقبل. أشارككم نفس الالتزام المهني والتعليمي، وسيكون من دواعي سروري قبول بطاقتي البريدية.",
        ckb: "سڵاو و ڕێز. پلان و تەمەنی جەنابتان بۆ هاوسەرگیرییەکی سەقامگیر و ئارام زۆر گونجاوە لەگەڵ شێوازی ژیانی مندا. شانازی دەکەم ئەگەر پۆستکارتەکەم قبوڵ بکەن."
      },
      {
        en: "Assalamu Alaikum. I am serious about finding a lifetime partner who appreciates honesty, continuous learning, and peaceful mutual support. I find your parameters truly beautiful. I pray this postcard opens a halal door for us.",
        ar: "السلام عليكم. أنا جاد للغاية في البحث عن شريك حياة يقدر الصدق والتعلم المستمر والدعم المتبادل الهادئ. لقد وجدت معاييركم جميلة وراقية حقاً، وأدعو الله أن تفتح هذه البطاقة لنا باباً مباركاً وحلالاً.",
        ckb: "ئەسەلامو عەلەیکوم. من زۆر جددیم لە دۆزینەوەی هاوبەشێکی ژیان کە بەهای ڕاستگۆیی و پشتگیری دوولایەنە بزانێت. هیوادارم ئەم پۆستکارتە ببێتە هۆی خێر بۆ هەردوولامان."
      }
    ];

    // Build the 3 postcard objects
    const items: PostcardData[] = pool.slice(0, 3).map((match, idx) => {
      // Generate realistic Iraqi phone numbers and emails for the mock postcard senders
      const senderLastName = match.name.split(' ')[1] || 'Al-Baghdadi';
      const cleanFirstName = match.name.split(' ')[0].toLowerCase();
      const mockEmail = `${cleanFirstName}.${senderLastName.toLowerCase().replace('-', '')}@halal.iq`;
      const mockPhone = `+964 77${idx} ${400 + idx * 77} ${8000 + idx * 95}`;
      const mockDistrict = match.city || (idx === 0 ? 'Karrada' : idx === 1 ? 'Mansour' : 'Adhamiyah');

      return {
        id: `postcard-${match.id}`,
        matchId: match.id,
        senderName: match.name,
        senderAge: match.age,
        senderGender: match.gender,
        senderProfession: match.profession,
        senderEducation: match.education,
        senderDistrict: mockDistrict,
        senderGovernorate: match.governorate || 'Baghdad',
        senderEmail: mockEmail,
        senderPhone: mockPhone,
        senderPhoto: match.avatarUrl,
        messageEn: messages[idx % messages.length].en,
        messageAr: messages[idx % messages.length].ar,
        messageCkb: messages[idx % messages.length].ckb,
        stampUrl: stamps[idx % stamps.length],
        createdAt: new Date(Date.now() - (idx + 1) * 3600000 * 4).toISOString(), // staggered times
        status: match.requestStatus === 'accepted' ? 'accepted' : match.requestStatus === 'declined' ? 'declined' : 'pending'
      };
    });

    setPostcards(items);
  }, [matches, userProfile.gender]);

  const handleAccept = (postcard: PostcardData) => {
    // Call the parent handler
    onAcceptRequest(postcard.matchId);
    
    // Update local state
    setPostcards(prev => prev.map(p => p.id === postcard.id ? { ...p, status: 'accepted' } : p));
    if (selectedPostcard?.id === postcard.id) {
      setSelectedPostcard({ ...postcard, status: 'accepted' });
    }
    
    triggerToast(
      txt(
        `💍 Accepted proposal postcard from ${postcard.senderName}! Communication unlocked in Private Chat.`,
        `💍 تم قبول بطاقة طلب الزواج من ${postcard.senderName}! تم تفعيل التواصل الآمن في المحادثات.`,
        `💍 پۆستکارتی داواکاری هاوسەرگیری لەلایەن ${postcard.senderName} قبوڵ کرا! گفتوگۆی تایبەت چالاک بوو.`
      )
    );
  };

  const handleDecline = (postcard: PostcardData) => {
    onDeclineRequest(postcard.matchId);
    
    setPostcards(prev => prev.map(p => p.id === postcard.id ? { ...p, status: 'declined' } : p));
    if (selectedPostcard?.id === postcard.id) {
      setSelectedPostcard({ ...postcard, status: 'declined' });
    }

    triggerToast(
      txt(
        `✉️ Declined request from ${postcard.senderName} with respect and dignity.`,
        `✉️ تم الاعتذار عن الطلب من ${postcard.senderName} بكل احترام ووقار شرعي.`,
        `✉️ داواکارییەکەی ${postcard.senderName} بە ڕێزەوە ڕەتکرایەوە.`
      )
    );
  };

  const formatDate = (isoStr: string) => {
    try {
      const date = new Date(isoStr);
      return date.toLocaleDateString(isEn ? 'en-US' : 'ar-IQ', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 text-start" id="postcards-tab-view">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-stone-200 pb-5">
        <div>
          <span className="inline-flex items-center gap-1.5 bg-[#40798C]/10 text-[#40798C] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            <Inbox className="w-4 h-4 animate-pulse" />
            <span>{txt('Postbox (Postcards)', 'صندوق البريد الوقور', 'سندوقی پۆستە')}</span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-warm-charcoal font-serif tracking-tight">
            {txt('Your Received Postcards', 'البطاقات البريدية المستلمة', 'پۆستکارتە وەرگیراوەکانت')}
          </h2>
          <p className="text-[#6B635B] text-xs sm:text-sm font-medium mt-1">
            {txt(
              'Marriage proposals are received as traditional postcards. Senders disclose their age, profession, where they live, and their education.',
              'تصلك طلبات الزواج والتعارف الجاد على هيئة بطاقات بريدية كلاسيكية وقورة. يظهر فيها عمر الشريك، مهنته، مكان إقامته، وتحصيله العلمي بالتفصيل.',
              'داواکارییەکانی هاوسەرگیری وەک پۆستکارتی کلاسیکی دەگەنە دەستت. تەمەن، پیشە، شوێنی نیشتەجێبوون و ئاستی خوێندنی ناردکارەکە نیشان دەدەن.'
            )}
          </p>
        </div>

        {onNavigateToTab && (
          <button
            onClick={() => onNavigateToTab('explore')}
            className="flex items-center gap-1.5 bg-warm-charcoal hover:bg-stone-800 text-white font-bold text-xs px-4.5 py-2.5 rounded-xl transition shadow-md"
          >
            <Send className="w-4 h-4" />
            <span>{txt('Send a Postcard', 'أرسل بطاقة بريدية للغير', 'ناردنی پۆستکارت')}</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Postcard List */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-sm font-bold text-warm-charcoal uppercase tracking-wider font-mono flex items-center gap-1.5">
            <span>{txt('Incoming Mailbox', 'الرسائل الواردة', 'نامە هاتووەکان')}</span>
            <span className="bg-accent-coral/10 text-accent-coral px-2.5 py-0.5 rounded-full text-xs font-black">
              {postcards.filter(p => p.status === 'pending').length} {txt('New', 'جديد', 'نوێ')}
            </span>
          </h3>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
            {postcards.map((p) => {
              const isActive = selectedPostcard?.id === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPostcard(p)}
                  className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer text-start relative overflow-hidden flex items-center gap-4 ${
                    isActive 
                      ? 'bg-white border-accent-coral shadow-md scale-[1.01] ring-1 ring-accent-coral' 
                      : 'bg-white/80 border-stone-200 hover:border-stone-300 hover:bg-white shadow-xs'
                  }`}
                >
                  {/* Status Ribbon on card */}
                  <div className={`absolute top-0 right-0 w-2.5 h-full ${
                    p.status === 'accepted' ? 'bg-emerald-500' : p.status === 'declined' ? 'bg-stone-300' : 'bg-accent-coral'
                  }`} />

                  {/* Sender Avatar */}
                  <div className="relative shrink-0">
                    <img 
                      src={p.senderPhoto} 
                      alt={p.senderName} 
                      className={`w-12 h-12 rounded-full object-cover border-2 ${isActive ? 'border-accent-coral' : 'border-stone-200'}`}
                      referrerPolicy="no-referrer"
                    />
                    {p.status === 'accepted' && (
                      <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-0.5 rounded-full border border-white">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex justify-between items-baseline gap-2">
                      <h4 className="text-sm font-black text-warm-charcoal truncate">{p.senderName}</h4>
                      <span className="text-[10px] text-stone-400 shrink-0 font-mono">{formatDate(p.createdAt)}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-stone-500">
                      <span>{p.senderAge} {txt('yrs', 'سنة', 'ساڵ')}</span>
                      <span>•</span>
                      <span>{p.senderDistrict}, {p.senderGovernorate}</span>
                    </div>

                    <p className="text-[11px] text-stone-600 italic truncate mt-1">
                      "{locale === 'en' ? p.messageEn : locale === 'ckb' ? p.messageCkb : p.messageAr}"
                    </p>
                  </div>
                </div>
              );
            })}

            {postcards.length === 0 && (
              <div className="p-8 text-center bg-stone-50 border border-dashed border-stone-200 rounded-3xl space-y-3">
                <Inbox className="w-8 h-8 text-stone-300 mx-auto" />
                <p className="text-xs text-stone-500 font-bold">{txt('Your postbox is currently empty.', 'صندوق البريد الخاص بك فارغ حالياً.', 'سندوقی پۆستەکەت لە ئێستادا بەتاڵە.')}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Detailed Postcard Reader */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {selectedPostcard ? (
              <motion.div
                key={selectedPostcard.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Visual Traditional Postcard Wrapper */}
                <div 
                  className="bg-[#FAF6EE] border-4 border-[#E6DEC9] rounded-[2.5rem] p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col md:flex-row gap-6 md:gap-8 justify-between text-start"
                  style={{ backgroundImage: 'radial-gradient(#EFE9DB 1px, transparent 0)', backgroundSize: '24px 24px' }}
                  id="expanded-postcard-card"
                >
                  {/* Authentic Vintage Borders */}
                  <div className="absolute inset-2 border border-[#DFD8C4] rounded-[2rem] pointer-events-none" />
                  
                  {/* Left Column of Postcard: The Message */}
                  <div className="flex-1 space-y-5 relative z-10">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono font-bold text-[#8A7E64] uppercase tracking-wider block">
                        ✉️ {txt('HALAL MARRIAGE INTENTION GREETING', 'ميثاق طلب التعارف الشرعي', 'پەیامی هاوسەرگیری حەڵاڵ')}
                      </span>
                      <h3 className="text-2xl font-serif font-black text-warm-charcoal tracking-tight">
                        {txt('Letter of Proposal', 'رسالة الخطوبة والمودة', 'نامەی داواکاری')}
                      </h3>
                      <p className="text-[10px] text-stone-400 font-mono">
                        {txt('Received on', 'تاريخ الاستلام', 'وەرگیرا لە')}: {formatDate(selectedPostcard.createdAt)}
                      </p>
                    </div>

                    {/* Handwriting style message text */}
                    <div className="bg-white/50 backdrop-blur-xs border border-[#E9E1CD] p-5 rounded-2xl shadow-inner text-stone-800 text-[13.5px] leading-relaxed font-serif italic relative">
                      <div className="absolute top-2 left-2 text-[#E2D9C5] text-4xl select-none font-serif">“</div>
                      <p className="relative z-10 pl-3">
                        {locale === 'en' 
                          ? selectedPostcard.messageEn 
                          : locale === 'ckb' 
                            ? selectedPostcard.messageCkb 
                            : selectedPostcard.messageAr}
                      </p>
                    </div>

                    {/* SENDER GENERAL INFO SUMMARY */}
                    <div className="bg-[#EDE6D7]/60 p-4 rounded-2xl border border-[#DFD8C4] space-y-3 text-xs">
                      <h4 className="font-bold text-[#5B503A] uppercase tracking-wider text-[10px] font-mono border-b border-[#DFD8C4] pb-1.5">
                        👤 {txt('About the Sender', 'تفاصيل عن مرسل البطاقة', 'دەربارەی ناردکار')}
                      </h4>
                      <div className="grid grid-cols-2 gap-3 font-medium text-stone-700">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-[#40798C] shrink-0" />
                          <span><strong>{txt('Age', 'العمر', 'تەمەن')}:</strong> {selectedPostcard.senderAge} {txt('Years Old', 'سنة', 'ساڵ')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-[#40798C] shrink-0" />
                          <span className="truncate"><strong>{txt('Profession', 'المهنة', 'پیشە')}:</strong> {selectedPostcard.senderProfession}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-[#40798C] shrink-0" />
                          <span className="truncate"><strong>{txt('Lives in', 'مكان الإقامة', 'شوێنی ژیان')}:</strong> {selectedPostcard.senderDistrict}, {selectedPostcard.senderGovernorate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <GraduationCap className="w-4 h-4 text-[#40798C] shrink-0" />
                          <span className="truncate"><strong>{txt('Education', 'التعليم', 'خوێندن')}:</strong> {selectedPostcard.senderEducation}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Vertical Postcard Split Line */}
                  <div className="hidden md:block w-px bg-dashed bg-[#DFD8C4] h-auto my-4 self-stretch relative">
                    <span className="absolute top-1/2 -translate-y-1/2 -left-1 text-[9px] text-[#A69C85] bg-[#FAF6EE] px-1 font-mono">POST</span>
                  </div>

                  {/* Right Column of Postcard: Stamp & Address */}
                  <div className="w-full md:w-56 shrink-0 flex flex-col justify-between items-center md:items-end gap-6 relative z-10">
                    
                    {/* Stamp & Postmark */}
                    <div className="flex justify-between items-start w-full gap-4">
                      {/* Postmark Circle */}
                      <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#8A7E64]/40 flex items-center justify-center text-center text-[8px] font-mono font-bold text-[#8A7E64]/60 rotate-12">
                        <div>
                          <div>ZAWAJ</div>
                          <div className="border-y border-[#8A7E64]/30 my-0.5">IRAQ</div>
                          <div>POSTAL</div>
                        </div>
                      </div>

                      {/* Vintage stamp image */}
                      <div className="w-14 h-16 border-2 border-[#8A7E64] p-0.5 bg-white shadow-md rotate-[-6deg] relative overflow-hidden">
                        <img 
                          src={selectedPostcard.stampUrl} 
                          alt="Stamp" 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-0.5 right-0.5 bg-accent-coral/90 text-[6px] text-white font-mono px-1 font-black rounded-xs">
                          250 f
                        </div>
                      </div>
                    </div>

                    {/* Sender Profile Photo & Official Seal */}
                    <div className="text-center w-full space-y-2 mt-2">
                      <div className="relative inline-block">
                        <img 
                          src={selectedPostcard.senderPhoto} 
                          alt={selectedPostcard.senderName} 
                          className="w-24 h-24 rounded-full object-cover mx-auto border-3 border-white shadow-lg"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute bottom-1 right-2 bg-emerald-500 text-white p-1 rounded-full border-2 border-white shadow-md">
                          <ShieldCheck className="w-4 h-4" />
                        </span>
                      </div>
                      <div>
                        <h4 className="text-base font-serif font-black text-warm-charcoal">{selectedPostcard.senderName}</h4>
                        <p className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">
                          {selectedPostcard.senderGender === 'female' ? txt('Bride Prospect', 'عروسة محتملة', 'بووکی ئامادەکراو') : txt('Groom Prospect', 'عريس محتمل', 'زاوای ئامادەکراو')}
                        </p>
                      </div>
                    </div>

                    {/* CONTACT INFORMATION PANEL - Reveals ONLY if accepted! */}
                    <div className="w-full mt-4">
                      {selectedPostcard.status === 'accepted' ? (
                        <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-2xl text-xs space-y-2 text-[#1B5E20] animate-fade-in font-semibold">
                          <p className="font-bold text-[9px] font-mono text-emerald-800 uppercase tracking-widest border-b border-emerald-500/20 pb-1">
                            🔓 {txt('CONTACT UNLOCKED', 'بيانات الاتصال مكشوفة', 'پەیوەندی ئاشکرا بوو')}
                          </p>
                          <div className="flex items-center gap-2 truncate">
                            <Mail className="w-3.5 h-3.5 text-[#1B5E20]" />
                            <span>{selectedPostcard.senderEmail}</span>
                          </div>
                          <div className="flex items-center gap-2 truncate">
                            <Phone className="w-3.5 h-3.5 text-[#1B5E20]" />
                            <span>{selectedPostcard.senderPhone}</span>
                          </div>
                        </div>
                      ) : selectedPostcard.status === 'declined' ? (
                        <div className="bg-stone-100 border border-stone-200 p-3 rounded-2xl text-xs text-center text-stone-500 font-semibold font-mono">
                          🚫 {txt('PROPOSAL DECLINED', 'تم الاعتذار عن الطلب', 'داواکاری ڕەتکرایەوە')}
                        </div>
                      ) : (
                        <div className="bg-accent-coral/10 border border-accent-coral/20 p-3.5 rounded-2xl text-xs text-center text-[#9c301c] font-semibold space-y-1">
                          <p className="font-bold text-[9px] font-mono uppercase tracking-wider">
                            🔒 {txt('CONTACT LOCKED', 'بيانات الاتصال محمية', 'پەیوەندی پارێزراوە')}
                          </p>
                          <p className="text-[10px] leading-relaxed text-stone-500 font-medium">
                            {txt('Accept proposal below to reveal the email and phone number.', 'اقبل هذا الطلب لكشف البريد الإلكتروني ورقم الهاتف.', 'ئەم داواکارییە قبوڵ بکە بۆ ئاشکراکردنی ئیمەیڵ و مۆبایل.')}
                          </p>
                        </div>
                      )}
                    </div>

                  </div>
                </div>

                {/* POSTCARD ACTION BAR */}
                {selectedPostcard.status === 'pending' && (
                  <div className="flex flex-col sm:flex-row gap-3.5 pt-2">
                    <button
                      onClick={() => handleAccept(selectedPostcard)}
                      className="flex-1 flex justify-center items-center gap-2 bg-gradient-to-r from-[#40798C] to-[#2D5866] hover:opacity-95 text-white font-bold text-sm px-6 py-4 rounded-2xl shadow-lg shadow-[#40798C]/15 transition-all duration-200 active:scale-98"
                    >
                      <Check className="w-5 h-5 stroke-[3]" />
                      <span>{txt('Accept Proposal & Reveal Contact 💍', 'قبول الطلب وكشف بيانات الاتصال 💍', 'قبوڵکردنی داواکاری و بینینی ژمارە 💍')}</span>
                    </button>

                    <button
                      onClick={() => handleDecline(selectedPostcard)}
                      className="flex justify-center items-center gap-2 bg-white border border-stone-200 hover:bg-stone-50 text-stone-600 font-bold text-sm px-6 py-4 rounded-2xl shadow-xs transition-all duration-200"
                    >
                      <X className="w-5 h-5 text-stone-400" />
                      <span>{txt('Decline with Dignity ❌', 'الاعتذار بوقار واحترام ❌', 'ڕەتکردنەوەی بەڕێزەوە ❌')}</span>
                    </button>
                  </div>
                )}

                {selectedPostcard.status === 'accepted' && (
                  <div className="bg-emerald-500/5 border border-emerald-500/20 p-5 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="space-y-1 text-center sm:text-start">
                      <h4 className="font-bold text-emerald-800 text-sm flex items-center justify-center sm:justify-start gap-1.5">
                        <Heart className="w-4 h-4 text-accent-coral fill-accent-coral animate-pulse" />
                        <span>{txt('Mutual courtship unlocked!', 'تم فتح باب النصيب المبارك والمودة!', 'پەیوەندی هاوسەرگیری چالاک بوو!')}</span>
                      </h4>
                      <p className="text-xs text-stone-500 font-medium leading-relaxed">
                        {txt(
                          `You've accepted ${selectedPostcard.senderName}'s postcard. You can now chat directly in absolute privacy.`,
                          `لقد قبلت بطاقة ${selectedPostcard.senderName}. يمكنكما الآن المراسلة مباشرة في بيئة آمنة تامة الخصوصية.`,
                          `پۆستکارتی ${selectedPostcard.senderName}ت قبوڵ کرد. ئێستا دەتوانیت ڕاستەوخۆ گفتوگۆ بکەیت.`
                        )}
                      </p>
                    </div>

                    {onNavigateToTab && (
                      <button
                        onClick={() => onNavigateToTab('chat')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-3 rounded-xl transition shadow-md whitespace-nowrap"
                      >
                        {txt('Open Private Chat 💬', 'افتح المحادثة الخاصة 💬', 'کردنەوەی چات 💬')}
                      </button>
                    )}
                  </div>
                )}

              </motion.div>
            ) : (
              <div className="bg-stone-50/50 border border-dashed border-stone-200 rounded-[2.5rem] p-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
                  <Mail className="w-8 h-8" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-base font-black text-warm-charcoal">{txt('Select a Postcard to Inspect', 'اختر بطاقة بريدية لمعاينتها', 'پۆستکارتێک هەڵبژێرە بۆ بینینی')}</h4>
                  <p className="text-xs text-stone-400 font-medium max-w-sm mx-auto leading-relaxed">
                    {txt(
                      'Click on any incoming request from the mailbox list to inspect their handwritten letter, contact details, and complete dossier credentials.',
                      'انقر على أي بطاقة بريدية هابطة في صندوق البريد لقراءة رسالتهم، ومعاينة بياناتهم، وتحصيلهم العلمي الموثق.',
                      'کلیک لەسەر هەر پۆستکارتێکی هاتوودا بکە بۆ خوێندنەوەی ناوەڕۆکەکەی و بینینی زانیارییەکان.'
                    )}
                  </p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
