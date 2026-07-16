import React, { useState, useEffect } from 'react';
import { MatchProfile, AppLanguage } from '../types';
import { Check, MapPin, Briefcase, GraduationCap, Eye, Bookmark, Send, Lock, Loader2 } from 'lucide-react';

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
  onProfileInterest?: (profileId: string, onSuccess?: () => void) => void;
}

export default function MatchCard({
  match,
  locale,
  onSendRequest,
  onInitiateChat,
  onOpenDetails,
  savedMatchIds = [],
  onToggleSaveMatch,
  onProfileInterest
}: MatchCardProps) {

  const isEn = locale === 'en';
  const isCkb = locale === 'ckb';
  const txt = (en: string, ar: string, ckb: string) => {
    return isEn ? en : isCkb ? ckb : ar;
  };

  const isSaved = savedMatchIds.includes(match.id);
  const [isRequestSent, setIsRequestSent] = useState(
    match.requestStatus === 'sent' || match.requestStatus === 'accepted'
  );
  const [isSending, setIsSending] = useState(false);

  // Sync state if match prop changes
  useEffect(() => {
    setIsRequestSent(match.requestStatus === 'sent' || match.requestStatus === 'accepted');
  }, [match.requestStatus]);

  const handleSendMarriageRequest = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isRequestSent || isSending) return;
    
    setIsSending(true);
    
    // Use unified handler if provided
    if (onProfileInterest) {
      onProfileInterest(match.id, () => {
        setIsRequestSent(true);
        setIsSending(false);
      });
    } else {
      // Fallback to old handler
      setTimeout(() => {
        onSendRequest(match.id);
        setIsRequestSent(true);
        setIsSending(false);
      }, 1000);
    }
  };

  const isPhotoLocked = (status: string | undefined, reqStatus: string | undefined) => {
    if (!status || status === 'visible' || status === 'unlocked') return false;
    if (reqStatus === 'accepted') return false;
    return true;
  };

  return (
    <div className="bg-white border border-[#EBE8E2] rounded-[2rem] overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between text-start" id={`match-card-${match.id}`}>
      
      {/* 1. Avatar Image Container */}
      <div className="h-64 w-full relative overflow-hidden bg-stone-100 shrink-0 select-none">
        {isPhotoLocked(match.photoStatus, match.requestStatus) && match.photoStatus === 'hidden' ? (
          <div className="w-full h-full bg-gradient-to-br from-[#ECE8E1] via-[#E1DDD5] to-[#D5CFB9] flex flex-col items-center justify-center p-4 text-center">
            <Lock className="w-6 h-6 text-[#40798C] mb-1.5 animate-bounce" />
            <p className="text-[11px] text-warm-charcoal font-black uppercase tracking-wider">
              {txt('Photo Hidden', 'الصورة مخفية', 'وێنە شاراوەیە')}
            </p>
            <p className="text-[9px] text-stone-500 mt-0.5">
              {txt('Unlocked upon match approval', 'تظهر عند الموافقة المتبادلة', 'دەکرێتەوە دوای پەسەندکردنی دوولایەنە')}
            </p>
          </div>
        ) : isPhotoLocked(match.photoStatus, match.requestStatus) && match.photoStatus === 'initials' ? (
          <div className="w-full h-full bg-gradient-to-br from-[#E6ECEA] via-[#D5E1DF] to-[#CAD3D2] flex flex-col items-center justify-center p-4 text-center">
            <div className="w-14 h-14 rounded-full bg-white shadow-md flex items-center justify-center text-[#0B5C43] font-serif font-black text-2xl border border-stone-100 mb-1.5">
              {match.name ? match.name.charAt(0).toUpperCase() : '?'}
            </div>
            <p className="text-[11px] text-stone-600 font-bold uppercase tracking-wider">
              {txt('Protected Initials', 'حماية خصوصية الهوية', 'پاراستنی ناونیشانی سەرەتایی')}
            </p>
          </div>
        ) : (
          <>
            <img
              src={match.avatarUrl}
              alt={match.name}
              className={`w-full h-full object-cover transition-transform duration-700 hover:scale-105 ${
                isPhotoLocked(match.photoStatus, match.requestStatus) && match.photoStatus === 'blurred' ? 'filter blur-[16px]' : ''
              }`}
              referrerPolicy="no-referrer"
            />
            {isPhotoLocked(match.photoStatus, match.requestStatus) && match.photoStatus === 'blurred' && (
              <div className="absolute inset-0 bg-[#2D2A26]/45 flex flex-col items-center justify-center p-4 text-center">
                <div className="bg-white/95 p-1.5 rounded-full shadow-md mb-1.5">
                  <Lock className="w-4 h-4 text-accent-coral" />
                </div>
                <p className="text-[11px] text-white font-extrabold uppercase tracking-widest bg-stone-900/40 px-2 py-0.5 rounded backdrop-blur-xs">
                  {txt('Photo Protected', 'صورة شخصية مصانة', 'وێنەی پارێزراو')}
                </p>
                <p className="text-[9px] text-white/90 mt-0.5 max-w-[150px] leading-tight">
                  {txt('Unlocks upon match acceptance.', 'تنفك الحماية تلقائياً فور القبول.', 'دەکرێتەوە دوای قبوڵکردنی طلبەکە.')}
                </p>
              </div>
            )}
          </>
        )}

        {/* Top-Right: Verified Seal */}
        {match.verified && (
          <div className="absolute top-3.5 right-3.5 bg-white/95 backdrop-blur-xs border border-[#EBE6DC] text-[#0B5C43] text-[10px] font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-sm">
            <Check className="w-3.5 h-3.5 text-[#0B5C43] stroke-[3]" />
            <span>{txt("Verified", "موثق", "سەلمێنراو")}</span>
          </div>
        )}

        {/* Bottom-Left: Governorate Label */}
        <div className="absolute bottom-4 left-4 text-white text-xs font-bold drop-shadow-md flex items-center gap-1 bg-black/15 px-2 py-0.5 rounded-md backdrop-blur-2xs">
          <MapPin className="w-3.5 h-3.5 text-white/90" />
          <span>{match.governorate}</span>
        </div>
      </div>

      {/* 2. Body Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        
        <div>
          {/* Header row with Name, Age & Compatibility */}
          <div className="flex justify-between items-center gap-2">
            <h4 className="text-lg font-bold text-[#22201E] font-serif leading-tight">
              {match.name}, <span className="font-sans text-stone-500 font-normal">{match.age}</span>
            </h4>
            <span className="bg-[#E1F7F1] text-[#0B5C43] text-[11px] font-bold px-2.5 py-1 rounded-lg shrink-0">
              {match.compatibilityScore}% {txt("Compatibility", "توافق", "گونجانی")}
            </span>
          </div>

          {/* Traits with grey icons */}
          <div className="mt-4 space-y-2 text-[12px] text-stone-500 font-medium">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-stone-400 shrink-0" />
              <span className="truncate">{match.profession}</span>
            </div>
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-stone-400 shrink-0" />
              <span className="truncate">{match.education}</span>
            </div>
          </div>

          {/* Biography quotes */}
          <p className="mt-4 text-[12.5px] text-stone-600 leading-relaxed italic line-clamp-3">
            "{match.aboutMe}"
          </p>
        </div>

        {/* 3. Action Buttons */}
        <div className="mt-5 space-y-2">
          
          {/* Row 1: View Profile & Bookmark */}
          <div className="grid grid-cols-12 gap-2">
            <button
              onClick={() => onOpenDetails(match)}
              className="col-span-10 py-2 bg-white border border-[#DDD9D2] hover:bg-stone-50 active:scale-99 text-xs font-extrabold text-[#4E4B45] rounded-xl flex items-center justify-center gap-1.5 transition duration-200 cursor-pointer"
            >
              <Eye className="w-4 h-4 text-[#6B635B]" />
              <span>{txt("View Profile", "عرض الملف الشخصي", "بینینی پڕۆفایل")}</span>
            </button>

            <button
              onClick={() => onToggleSaveMatch && onToggleSaveMatch(match.id)}
              className={`col-span-2 rounded-xl flex items-center justify-center border transition duration-200 cursor-pointer ${
                isSaved 
                  ? 'bg-amber-50 border-amber-300 text-amber-500' 
                  : 'bg-white border-[#DDD9D2] text-stone-400 hover:text-stone-600 hover:border-[#CFC9C0]'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-400 text-amber-500' : ''}`} />
            </button>
          </div>

          {/* Row 2: Send Marriage Request */}
          <button
            onClick={handleSendMarriageRequest}
            disabled={isRequestSent || isSending}
            className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition duration-200 cursor-pointer ${
              isRequestSent
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 cursor-not-allowed'
                : isSending
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-100 cursor-wait'
                  : 'bg-[#0B5C43] hover:bg-[#094d38] active:scale-99 text-white hover:shadow-md'
            }`}
          >
            {isSending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            <span>
              {isRequestSent
                ? txt("Marriage Request Sent ✓", "تم إرسال طلب الزواج ✓", "داواکاری هاوسەرگیری نێردرا ✓")
                : isSending
                  ? txt("Sending...", "جاري الإرسال...", "دەنێردرێت...")
                  : txt("Send Marriage Request", "إرسال طلب زواج", "ناردنی داواکاری هاوسەرگیری")}
            </span>
          </button>

        </div>

      </div>

    </div>
  );
}
