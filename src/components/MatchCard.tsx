import React, { useState, useEffect } from 'react';
import { MatchProfile, AppLanguage } from '../types';
import { Heart, Lock, ShieldCheck, CheckCircle, Star, Fingerprint, MessageSquare, ThumbsUp, ThumbsDown, Eye, Check, Loader2 } from 'lucide-react';
import { apiClient } from '../services/apiClient';

interface MatchCardProps {
  key?: string | number;
  match: MatchProfile;
  locale: AppLanguage;
  onSendRequest: (id: string) => void;
  onInitiateChat: (id: string) => void;
  onOpenDetails: (match: MatchProfile) => void;
  savedMatchIds?: string[];
  onToggleSaveMatch?: (id: string) => void;
  isInterested?: boolean;
  onToggleInterested?: (id: string) => void;
  onPass?: (id: string) => void;
}

export default function MatchCard({
  match,
  locale,
  onSendRequest,
  onInitiateChat,
  onOpenDetails,
  savedMatchIds = [],
  onToggleSaveMatch,
  isInterested = false,
  onToggleInterested,
  onPass
}: MatchCardProps) {
  // Photo privacy simulation state
  const [photoAccessRequested, setPhotoAccessRequested] = useState(false);
  const [photoAccessApproved, setPhotoAccessApproved] = useState(match.requestStatus === 'accepted');
  const [isSimulatingPhoto, setIsSimulatingPhoto] = useState(false);

  // Safe Chat Request Flow State
  const [chatFlow, setChatFlow] = useState<'none' | 'interest_sent' | 'interest_accepted' | 'chat_requested' | 'chat_approved'>(
    match.requestStatus === 'accepted' ? 'chat_approved' : match.requestStatus === 'sent' ? 'interest_sent' : 'none'
  );
  const [isSimulatingChat, setIsSimulatingChat] = useState(false);
  const [toastText, setToastText] = useState<string | null>(null);

  useEffect(() => {
    if (match.requestStatus === 'accepted') {
      setChatFlow('chat_approved');
      setPhotoAccessApproved(true);
    } else if (match.requestStatus === 'sent') {
      setChatFlow('interest_sent');
    }
  }, [match.requestStatus]);

  // Photo blur status - photos are blurred by default for privacy (except when approved)
  const isBlur = !photoAccessApproved && match.requestStatus !== 'accepted';
  const isHiddenState = match.photoStatus === 'hidden' && match.requestStatus !== 'accepted' && !photoAccessApproved;
  const isInitialsState = match.photoStatus === 'initials' && match.requestStatus !== 'accepted' && !photoAccessApproved;
  const initialsLetter = match.name ? match.name.charAt(0).toUpperCase() : '?';
  const isSaved = savedMatchIds.includes(match.id);

  const txt = (en: string, ar: string, ckb: string) => {
    return locale === 'en' ? en : locale === 'ckb' ? ckb : ar;
  };

  const getReligionSect = () => {
    if (match.religion === 'islam') {
      const sectStr = match.sect === 'sunni' 
        ? txt('Sunni', 'سُنّي', 'سوننە') 
        : match.sect === 'shiaa' 
          ? txt('Shiaa', 'شيعي', 'شیعە') 
          : txt('Muslim', 'مسلم', 'موسڵمان');
      return `${sectStr} ${txt('Muslim', 'مسلم', 'موسڵمان')}`;
    }
    return txt('Non-Muslim', 'غير مسلم', 'نا موسڵمان');
  };

  const getEthnicity = () => {
    if (match.ethnicity === 'arab') return txt('Arab', 'عربي', 'عەرەب');
    if (match.ethnicity === 'kurdish') return txt('Kurdish', 'كوردي', 'کورد');
    return txt('Others', 'آخرون', 'هیتر');
  };

  const translateValue = (v: string) => {
    const valueMap: Record<string, { ar: string, ckb: string }> = {
      'Family First': { ar: 'العائلة أولاً', ckb: 'خێزان لە پێشینەیە' },
      'Religious Commitment': { ar: 'الالتزام الديني', ckb: 'پابەندبوونی ئاینی' },
      'Financial Stability': { ar: 'الاستقرار المالي', ckb: 'سەقامگیری دارایی' },
      'Mutual Respect': { ar: 'الاحترام المتبادل', ckb: 'ڕێزی دوولایەنە' },
      'Traditional Values': { ar: 'القيم التقليدية', ckb: 'بەها کلتورییەکان' },
      'Modern Outlook': { ar: 'نظرة حديثة', ckb: 'ڕوانینی مۆدێرن' },
      'No Smoking': { ar: 'عدم التدخين', ckb: 'جگەرەنەکێشان' },
      'Educated Partner': { ar: 'شريك متعلم', ckb: 'هاوبەشی خوێندەوار' },
    };
    const key = v.trim();
    if (locale === 'en') return key;
    if (valueMap[key]) {
      return locale === 'ckb' ? valueMap[key].ckb : valueMap[key].ar;
    }
    return v;
  };

  const handleRequestPhotoAccess = () => {
    if (isSimulatingPhoto || photoAccessApproved) return;
    setIsSimulatingPhoto(true);
    setPhotoAccessRequested(true);
    setToastText(txt("Requesting photo access...", "جاري طلب الإذن لعرض الصورة...", "داواکاری بینینی وێنە دەنێردرێت..."));
    
    // Simulate other user accepting after 2 seconds!
    setTimeout(() => {
      setPhotoAccessApproved(true);
      setIsSimulatingPhoto(false);
      setToastText(txt(`✨ Photo access approved by ${match.name}!`, `✨ وافقت ${match.name} على طلبك لعرض الصورة!`, `✨ ${match.name} داواکارییەکی قبوڵ کرد بۆ بینینی وێنەکە!`));
      // Clear toast after 4s
      setTimeout(() => setToastText(null), 4000);
    }, 2000);
  };

  const handleChatFlowClick = () => {
    if (isSimulatingChat) return;

    if (chatFlow === 'none') {
      setIsSimulatingChat(true);
      setChatFlow('interest_sent');
      setToastText(txt("Sending your interest...", "جاري إبداء اهتمامك الوقور...", "ئارەزوومەندی دەنێردرێت..."));
      
      // Notify parent of request status if any API is integrated
      onSendRequest(match.id);

      // Simulate other user accepting interest after 2s
      setTimeout(() => {
        setChatFlow('interest_accepted');
        setIsSimulatingChat(false);
        setToastText(txt(`🌟 ${match.name} accepted your interest! Chat request available.`, `🌟 قبلت ${match.name} اهتمامك! طلب المحادثة متاح الآن.`, `🌟 ${match.name} ئارەزووی تۆی قبوڵکرد! داواکاری چات بەردەستە.`));
        setTimeout(() => setToastText(null), 4000);
      }, 2000);

    } else if (chatFlow === 'interest_accepted') {
      setIsSimulatingChat(true);
      setChatFlow('chat_requested');
      setToastText(txt("Requesting secure chat...", "جاري طلب بدء المحادثة الآمنة...", "داواکاری چاتی پارێزراو دەنێردرێت..."));

      // Simulate other user accepting chat request after 2s
      setTimeout(() => {
        setChatFlow('chat_approved');
        setIsSimulatingChat(false);
        setPhotoAccessApproved(true); // Approved chat also unlocks photo!
        setToastText(txt(`💍 Respectful Chat Approved with ${match.name}!`, `💍 تمت الموافقة على المحادثة الوقورة مع ${match.name}!`, `💍 چاتی ڕێزدارانە پەسەندکرا لەگەڵ ${match.name}!`));
        setTimeout(() => setToastText(null), 4000);
      }, 2000);
    }
  };

  return (
    <div className={`relative bg-[#FBF9F4] border-2 ${
      match.gender === 'female' ? 'border-[#E6C6BA] hover:border-[#D9A392]' : 'border-[#C1D3D4] hover:border-[#8EAFB2]'
    } rounded-3xl p-5 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden group text-start`}>
      
      {/* Postcard Background Lines & Accents */}
      <div className="absolute inset-x-0 bottom-12 top-0 pointer-events-none opacity-5 bg-[radial-gradient(#C5B393_1.2px,transparent_1.2px)] [background-size:16px_16px]"></div>
      
      {/* Decorative Stamp Edge Cutout Overlays in corners for that postcard physical look */}
      <div className="absolute top-0 right-0 w-4 h-4 bg-transparent border-b-2 border-l-2 border-[#E3D6C0] rounded-bl-full pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-4 h-4 bg-transparent border-b-2 border-r-2 border-[#E3D6C0] rounded-br-full pointer-events-none"></div>

      {/* Header Container */}
      <div className="flex justify-between items-start gap-4 mb-4 z-10">
        
        {/* Verification Seals & Match Score */}
        <div className="flex flex-col gap-1.5">
          <span className={`text-[10px] font-black tracking-wider bg-white border ${
            match.gender === 'female' ? 'border-[#D9A392] text-accent-coral' : 'border-[#8EAFB2] text-[#40798C]'
          } px-2.5 py-0.5 rounded-md uppercase font-mono shadow-sm`}>
            {match.compatibilityScore}% {txt('Match', 'توافق', 'گونجان')}
          </span>
          {match.verified && (
            <span className="bg-[#40798C] text-white flex items-center gap-1 text-[8.5px] font-bold px-2 py-0.5 rounded-md shadow-sm border border-[#2D5A6B] select-none">
              <ShieldCheck className="w-3 h-3 text-white shrink-0" />
              <span>{txt('Verified Profile', 'ملف موثق', 'پڕۆفایلی سەلمێنراو')}</span>
            </span>
          )}
        </div>

        {/* Dynamic Decorative Postage Stamp (Top-Right) */}
        <div className={`relative shrink-0 w-16 h-20 border-2 border-dashed ${
          match.gender === 'female' ? 'border-[#D9A392]' : 'border-[#8EAFB2]'
        } rounded bg-white p-1.5 flex flex-col items-center justify-center text-center rotate-3 group-hover:rotate-6 transition-transform shadow-sm`}>
          <div className="w-full h-full border border-[#EADFC9] rounded flex flex-col items-center justify-center bg-[#FAF8F4] overflow-hidden">
            <span className="text-[6px] font-mono text-stone-400 font-extrabold uppercase leading-none">{txt('IRAQ', 'العراق', 'عێراق')}</span>
            <Heart className={`w-5 h-5 ${match.gender === 'female' ? 'text-accent-pink fill-accent-pink/10' : 'text-[#40798C] fill-[#40798C]/10'} my-1 animate-pulse`} />
            <span className="text-[7px] font-mono text-[#40798C] font-black leading-none">{match.id.toUpperCase()}</span>
          </div>
          {/* Postmark circular overlay stamp if online */}
          {match.isOnline && (
            <div className="absolute -bottom-2 -left-2 w-8 h-8 rounded-full border border-emerald-500/40 bg-emerald-50/10 flex items-center justify-center -rotate-12 select-none pointer-events-none">
              <div className="text-[5px] font-mono font-bold text-emerald-600 leading-none text-center">
                <span>ACTIVE</span>
                <span className="block border-t border-emerald-500/30 text-[4px] mt-0.5">POST</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area - Left Polaroid Image, Right Correspondence */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-stretch mb-4 z-10">
        
        {/* Left Side: Polaroid Portrait Clip */}
        <div className="sm:col-span-5 flex flex-col justify-start">
          <div className="p-2.5 bg-white shadow-md border border-stone-200/60 rounded-lg transform -rotate-1 group-hover:rotate-1 transition-transform relative">
            <div className="aspect-[1/1] w-full bg-stone-100 rounded overflow-hidden relative">
              
              {/* Image renderer */}
              {isHiddenState ? (
                <div className="w-full h-full bg-gradient-to-br from-[#ECE8E1] via-[#E1DDD5] to-[#D5CFB9] flex flex-col items-center justify-center p-3 text-center">
                  <Lock className="w-4 h-4 text-[#40798C] mb-1" />
                  <p className="text-[8px] text-warm-charcoal font-black uppercase tracking-wider leading-none">
                    {txt('Hidden', 'مخفية', 'شاراوە')}
                  </p>
                </div>
              ) : isInitialsState ? (
                <div className="w-full h-full bg-gradient-to-br from-[#E6ECEA] via-[#D5E1DF] to-[#CAD3D2] flex flex-col items-center justify-center p-3 text-center">
                  <div className={`w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center ${
                    match.gender === 'female' ? 'text-accent-coral' : 'text-[#40798C]'
                  } font-serif font-black text-lg border border-white`}>
                    {initialsLetter}
                  </div>
                </div>
              ) : (
                <>
                  <img
                    src={match.avatarUrl}
                    alt={match.name}
                    className={`w-full h-full object-cover transition-all duration-750 ease-in-out ${
                      isBlur ? 'filter blur-[15px]' : 'filter-none scale-100'
                    }`}
                    referrerPolicy="no-referrer"
                  />
                  {isBlur && (
                    <div className="absolute inset-0 bg-[#2D2A26]/40 backdrop-blur-[4px] flex flex-col items-center justify-center p-2.5 text-center animate-fade-in">
                      <Lock className="w-5 h-5 text-white mb-1.5 drop-shadow animate-pulse" />
                      <p className="text-[10px] text-white font-extrabold uppercase tracking-widest mb-2 drop-shadow leading-tight">
                        {txt('Photo hidden for privacy', 'الصورة مموهة للخصوصية', 'وێنە لێڵکراوە بۆ پاراستن')}
                      </p>
                      
                      {!photoAccessRequested ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRequestPhotoAccess();
                          }}
                          className="px-3 py-1.5 bg-white text-warm-charcoal hover:bg-stone-50 font-black text-[9px] uppercase tracking-wide rounded-lg shadow-md transition duration-200 active:scale-95 cursor-pointer flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5 text-accent-coral shrink-0" />
                          <span>{txt('Request photo access', 'طلب عرض الصورة', 'داواکردنی بینینی وێنە')}</span>
                        </button>
                      ) : (
                        <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-2.5 py-1.5 rounded-xl text-white text-[9px] font-bold">
                          {isSimulatingPhoto ? (
                            <Loader2 className="w-3 h-3 animate-spin text-white shrink-0" />
                          ) : (
                            <Check className="w-3 h-3 text-emerald-300 shrink-0" />
                          )}
                          <span>
                            {isSimulatingPhoto 
                              ? txt('Requesting...', 'جاري الطلب...', 'داوا دەکرێت...') 
                              : txt('Photo access approved', 'تمت الموافقة', 'پەسەندکرا')}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}

              {/* Interested watermark stamp overlay */}
              {isInterested && (
                <div className="absolute inset-0 bg-[#4CAF50]/10 flex items-center justify-center pointer-events-none z-10 animate-fade-in">
                  <div className="border-4 border-dashed border-[#4CAF50] text-[#4CAF50] font-sans font-black text-[10px] px-2 py-1 uppercase rounded rotate-12 bg-white/95 shadow-lg tracking-widest">
                    {txt('★ INTERESTED ★', '★ مهتم ★', '★ ئارەزوومەند ★')}
                  </div>
                </div>
              )}

              {/* Live Status indicator */}
              {match.isOnline && (
                <div className="absolute bottom-1 right-1 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500 text-white shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                  <span className="text-[7px] font-mono font-bold uppercase tracking-widest">{txt('Live', 'متصل', 'چالاک')}</span>
                </div>
              )}
            </div>
            
            {/* Polaroid handwritten label */}
            <div className="pt-2 text-center">
              <span className="font-serif font-bold text-xs sm:text-sm text-warm-charcoal block tracking-tight">
                {match.name}, <span className="font-sans text-stone-500 font-normal">{match.age}</span>
              </span>
              <span className="text-[9px] font-mono text-[#6B635B] block mt-0.5">
                📍 {match.city}, {match.governorate}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Postcard Correspondence / Address Lines */}
        <div className="sm:col-span-7 flex flex-col justify-between space-y-3">
          
          {/* Handwritten-style message card */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1">
              <span className="text-[9px] font-mono uppercase tracking-widest text-[#40798C] font-black">{txt('MESSAGE NOTE', 'رسالة التعريف', 'پەیامی ناساندن')}</span>
              <div className="flex-1 h-px bg-dashed bg-[#E3D6C0]"></div>
            </div>
            <p className="text-[11px] text-[#5D554D] italic leading-relaxed font-serif pl-3 border-l-2 border-[#E3D6C0] line-clamp-2">
              "{match.aboutMe}"
            </p>

            <div className="flex items-center gap-1 mt-1">
              <span className="text-[9px] font-mono uppercase tracking-widest text-[#D9A392] font-black">{txt('INTENTION', 'مأرب الزواج', 'ئامانجی هاوسەرگیری')}</span>
              <div className="flex-1 h-px bg-dashed bg-[#E3D6C0]/60"></div>
            </div>
            <p className="text-[11px] text-stone-600 leading-relaxed font-sans pl-3 border-l-2 border-[#D9A392] line-clamp-2">
              {match.intention}
            </p>
          </div>

          {/* Postal Address Guide Lines */}
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <span className="text-[9px] font-mono uppercase tracking-widest text-[#C5B393] font-black">{txt('DOSSIER SPECS', 'المعايير الأساسية', 'خاسیەتە سەرەکییەکان')}</span>
              <div className="flex-1 h-px bg-dashed bg-[#E3D6C0]"></div>
            </div>
            <div className="space-y-0.5 font-mono text-[9px] sm:text-[10px]">
              {/* Row 1 */}
              <div className="flex justify-between items-center border-b border-[#EADFC9]/80 pb-0.5">
                <span className="text-stone-400 text-[8px] uppercase">{txt('Sect', 'المذهب', 'مەزهەب')}</span>
                <span className="font-bold text-warm-charcoal text-right">{getReligionSect()}</span>
              </div>
              {/* Row 2 */}
              <div className="flex justify-between items-center border-b border-[#EADFC9]/80 pb-0.5">
                <span className="text-stone-400 text-[8px] uppercase">{txt('Profession', 'العمل', 'پیشە')}</span>
                <span className="font-bold text-[#40798C] text-right truncate max-w-[130px]">{match.profession}</span>
              </div>
              {/* Row 3 */}
              <div className="flex justify-between items-center border-b border-[#EADFC9]/80 pb-0.5">
                <span className="text-stone-400 text-[8px] uppercase">{txt('Education', 'التعليم', 'خوێندن')}</span>
                <span className="font-bold text-stone-600 text-right truncate max-w-[130px]">{match.education}</span>
              </div>
              {/* Row 4 */}
              <div className="flex justify-between items-center border-b border-[#EADFC9]/80 pb-0.5">
                <span className="text-stone-400 text-[8px] uppercase">{txt('Timeline', 'المدة المطلوبة', 'ماوەی دڵخواز')}</span>
                <span className="font-bold text-stone-600 text-right">{match.timeline.replace(/Within/g, '').trim()}</span>
              </div>
              {/* Row 5 */}
              <div className="flex justify-between items-center border-b border-[#EADFC9]/80 pb-0.5">
                <span className="text-stone-400 text-[8px] uppercase">{txt('Ethnicity', 'القومية', 'نەتەوە')}</span>
                <span className="font-bold text-accent-coral text-right">{getEthnicity()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Badges and Tags row */}
      <div className="flex flex-wrap gap-1 mb-3 z-10" id={`postcard-badges-${match.id}`}>
        
        {/* Core Privacy/Dignity Badges as specified in instructions */}
        <span className="text-[8px] font-mono font-black px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
          🛡️ {match.photoStatus === 'visible' ? txt('Verified Profile', 'ملف موثق بالكامل', 'پڕۆفایلی سەلمێنراو') : txt('Photo Protected', 'حماية الصورة الشخصية', 'وێنەی پارێزراو')}
        </span>
        <span className="text-[8px] font-mono font-black px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
          🌸 {txt('Family Respectful', 'تواصل عائلي وقور', 'ڕێزی خێزانی')}
        </span>
        <span className="text-[8px] font-mono font-black px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200">
          💍 {txt('Serious Intention', 'نية جادة للزواج', 'مەبەستی جدی')}
        </span>

        {/* Fingerprint Identity Protection Visual Seal (Visual Badge only, no biometric collection as requested) */}
        <span className="text-[8px] font-mono font-black px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 flex items-center gap-1 shadow-2xs cursor-help" title={txt('Official Civil ID Verification & Privacy Protected. No biometric data collected.', 'توثيق الهوية الموحدة وحماية الخصوصية. لا يتم جمع أي بصمات حقيقية.', 'سەلماندنی ناسنامەی نیشتمانی و پاراستنی تایبەتمەندێتی. هیچ زانیارییەکی بایۆمەتری کۆناکرێتەوە.')}>
          <Fingerprint className="w-2.5 h-2.5 text-blue-600 shrink-0" />
          <span>{txt('Verified Trust Seal', 'ختم ثقة الهوية', 'مۆری متمانەی ناسنامە')}</span>
        </span>

        {match.badges && match.badges.slice(0, 1).map((badgeKey) => {
          return (
            <span 
              key={badgeKey} 
              className="text-[8px] font-mono font-extrabold px-2 py-0.5 rounded bg-[#FCF8F0] border border-[#E3D6C0] text-stone-600 shadow-2xs"
            >
              {badgeKey === 'Serious for marriage' ? txt('💍 Serious', '💍 جاد بالزواج', '💍 جدی بۆ هاوسەرگیری') :
               badgeKey === 'Family involved' ? txt('👨‍👩‍👧 Family Aware', '👨‍👩‍👧 الأهل عل علم', '👨‍👩‍👧 خێزان ئاگادارە') :
               badgeKey === 'Ready for engagement' ? txt('📝 Ready', '📝 جاهز كلياً', '📝 ئامادەیە') :
               badgeKey === 'Studying first' ? txt('📚 Studies First', '📚 الدراسة أولاً', '📚 خوێندن لە پێشینەیە') :
               txt('🔒 Private', '🔒 ملف تحفظي', '🔒 پڕۆفایلی تایبەتی')}
            </span>
          )
        })}
        {match.valuesSummary.slice(0, 1).map((val) => (
          <span 
            key={val} 
            className="text-[8.5px] font-mono font-extrabold px-2 py-0.5 rounded bg-white border border-[#E3D6C0]/60 text-stone-500"
          >
            {translateValue(val)}
          </span>
        ))}
      </div>

      {/* CTA Buttons - Interactive and split based on request and preferences */}
      <div className="pt-2.5 z-10 border-t border-[#EADFC9] mt-auto space-y-2.5">
        
        {/* Row 1: Preferences (Interested vs Pass) */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onPass && onPass(match.id)}
            className="flex-1 py-1.5 px-3 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-[10px] font-bold transition flex items-center justify-center gap-1 bg-white shadow-2xs"
          >
            <ThumbsDown className="w-3 h-3 text-red-500 shrink-0" />
            <span>{txt('Pass Candidate', 'تجاوز الملف', 'تێپەڕاندنی پڕۆفایل')}</span>
          </button>

          <button
            type="button"
            onClick={() => onToggleInterested && onToggleInterested(match.id)}
            className={`flex-1 py-1.5 px-3 rounded-lg border text-[10px] font-bold transition flex items-center justify-center gap-1 ${
              isInterested
                ? 'bg-emerald-500 border-emerald-600 text-white shadow-2xs hover:bg-emerald-600'
                : 'bg-white border-[#E3D6C0] text-stone-600 hover:bg-stone-50 shadow-2xs'
            }`}
          >
            <ThumbsUp className={`w-3 h-3 shrink-0 ${isInterested ? 'text-white' : 'text-stone-500'}`} />
            <span>{isInterested ? txt('Interested ✓', 'أبديت الاهتمام ✓', 'ئارەزوومەندم ✓') : txt('Interested', 'إبداء اهتمام', 'ئارەزوومەندم')}</span>
          </button>
        </div>

        {/* Row 2: Respectful Requests & Locked Messages */}
        <div className="flex items-center gap-1.5 w-full">
          {/* Action / Status Button */}
          <div className="flex-1">
            {chatFlow === 'none' && (
              <button
                type="button"
                onClick={handleChatFlowClick}
                className="w-full py-2.5 rounded-xl bg-warm-charcoal text-white font-bold text-xs hover:bg-[#34302D] active:scale-98 transition duration-200 shadow-sm flex items-center justify-center space-x-1.5 group/btn cursor-pointer"
              >
                {isSimulatingChat ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-accent-pink" />
                ) : (
                  <Heart className="w-3.5 h-3.5 text-accent-pink fill-accent-pink/20 group-hover/btn:scale-110 transition-transform shrink-0" />
                )}
                <span>{txt('Send Interest', 'إرسال اهتمام وقور', 'ناردنی ئارەزوومەندی')}</span>
              </button>
            )}

            {chatFlow === 'interest_sent' && (
              <button
                type="button"
                disabled
                className="w-full py-2.5 rounded-xl bg-accent-coral/10 text-accent-coral border border-accent-coral/20 font-bold text-xs flex items-center justify-center space-x-1"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-accent-coral animate-ping shrink-0" />
                <span>{txt('Interest Sent (Pending...)', 'تم إرسال الاهتمام (قيد الانتظار)', 'ئارەزوومەندی نێردرا (چاوەڕوانە)')}</span>
              </button>
            )}

            {chatFlow === 'interest_accepted' && (
              <button
                type="button"
                onClick={handleChatFlowClick}
                className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 active:scale-98 transition duration-200 shadow-sm flex items-center justify-center space-x-1.5 group/btn cursor-pointer"
              >
                {isSimulatingChat ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                ) : (
                  <ShieldCheck className="w-3.5 h-3.5 text-white shrink-0" />
                )}
                <span>{txt('Request Chat', 'طلب محادثة وقورة', 'داواکردنی چات')}</span>
              </button>
            )}

            {chatFlow === 'chat_requested' && (
              <button
                type="button"
                disabled
                className="w-full py-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-xs flex items-center justify-center space-x-1"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
                <span>{txt('Chat Requested...', 'تم طلب المحادثة...', 'داوای چات کرا...')}</span>
              </button>
            )}

            {chatFlow === 'chat_approved' && (
              <button
                type="button"
                disabled
                className="w-full py-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-xs flex items-center justify-center space-x-1"
              >
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>{txt('Chat Approved ✓', 'تمت الموافقة على المحادثة ✓', 'چات پەسەندکرا ✓')}</span>
              </button>
            )}
          </div>

          {/* Secure Message Trigger (Locked or Unlocked) */}
          <div className="shrink-0">
            {chatFlow === 'chat_approved' ? (
              <button
                type="button"
                onClick={() => onInitiateChat(match.id)}
                className="px-3 py-2.5 rounded-xl bg-[#40798C] hover:bg-[#346271] text-white font-bold text-xs transition duration-200 shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                title={txt('Open Guided Chat', 'فتح المحادثة الموجهة', 'کردنەوەی چات')}
              >
                <MessageSquare className="w-4 h-4 text-emerald-200 shrink-0 animate-bounce" />
                <span>{txt('Message', 'مراسلة', 'چات')}</span>
              </button>
            ) : (
              <div className="relative group/tooltip">
                <button
                  type="button"
                  disabled
                  className="px-3 py-2.5 rounded-xl bg-stone-100 border border-stone-200 text-stone-400 font-bold text-xs cursor-not-allowed flex items-center justify-center gap-1"
                >
                  <Lock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span>{txt('Message', 'مراسلة', 'چات')}</span>
                </button>
                {/* Tooltip Popup */}
                <div className="absolute bottom-full right-0 mb-2 hidden group-hover/tooltip:block w-52 bg-stone-900 text-white text-[9px] rounded-lg p-2 text-center shadow-lg z-30 font-sans font-normal leading-normal">
                  <p>{txt('Chat opens only after both sides agree.', 'تفتح المحادثة فقط بعد موافقة الطرفين كلياً.', 'چات دەکرێتەوە تەنها دوای ڕەزامەندی هەردوولا.')}</p>
                </div>
              </div>
            )}
          </div>

          {/* Bookmark & Detail triggers */}
          <div className="flex gap-1 shrink-0">
            {onToggleSaveMatch && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleSaveMatch(match.id);
                }}
                className={`rounded-xl w-9.5 h-9.5 flex items-center justify-center border transition-all shadow-2xs ${
                  isSaved 
                    ? 'bg-amber-50 border-amber-300 text-amber-500' 
                    : 'bg-white border-[#E3D6C0] text-stone-400 hover:text-stone-600'
                }`}
                title="Bookmark Dossier"
                id={`bookmark-btn-${match.id}`}
              >
                <Star className={`w-3.5 h-3.5 ${isSaved ? 'fill-amber-400 text-amber-500' : ''}`} />
              </button>
            )}
            
            <button
              type="button"
              onClick={() => onOpenDetails(match)}
              className="rounded-xl w-9.5 h-9.5 flex items-center justify-center bg-white border border-[#E3D6C0] text-stone-500 hover:text-stone-700 transition shadow-2xs"
              title="View Full Dossier"
            >
              <span className="text-xs font-bold">↗</span>
            </button>
          </div>
        </div>

        {/* Friendly Text Notice for serious courtship privacy guidelines */}
        <div className="text-center pt-1">
          <p className="text-[9.5px] font-semibold text-stone-400 italic">
            🔒 {txt('Chat opens only after both sides agree.', 'تفتح المحادثة فقط بعد موافقة الطرفين بشكل متبادل.', 'چات دەکرێتەوە تەنها کاتێک هەردوو لا ڕازی بن.')}
          </p>
        </div>

        {/* Micro toast alert on card-level */}
        {toastText && (
          <div className="bg-[#40798C] text-white text-[9.5px] font-bold py-1.5 px-3 rounded-xl text-center shadow-md animate-fade-in border border-[#2D5A6B] flex items-center justify-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-ping shrink-0" />
            <span>{toastText}</span>
          </div>
        )}

      </div>

    </div>
  );
}
