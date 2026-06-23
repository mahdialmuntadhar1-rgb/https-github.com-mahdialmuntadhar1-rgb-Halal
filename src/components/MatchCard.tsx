import React from 'react';
import { MatchProfile, AppLanguage } from '../types';
import { Heart, Lock, ShieldCheck, CheckCircle } from 'lucide-react';

interface MatchCardProps {
  key?: string | number;
  match: MatchProfile;
  locale: AppLanguage;
  onSendRequest: (id: string) => void;
  onInitiateChat: (id: string) => void;
  onOpenDetails: (match: MatchProfile) => void;
}

export default function MatchCard({
  match,
  locale,
  onSendRequest,
  onInitiateChat,
  onOpenDetails
}: MatchCardProps) {
  const isBlur = match.photoStatus === 'blurred' && match.requestStatus !== 'accepted';
  const isHiddenState = match.photoStatus === 'hidden' && match.requestStatus !== 'accepted';
  const isInitialsState = match.photoStatus === 'initials' && match.requestStatus !== 'accepted';
  const initialsLetter = match.name ? match.name.charAt(0).toUpperCase() : '?';

  return (
    <div className="bg-white/40 backdrop-blur-xl border border-white/35 rounded-[2.2rem] shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between group text-start">
      {/* Photo container with privacy indicators */}
      <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden select-none">
        
        {/* Render conditions based on photoStatus */}
        {isHiddenState ? (
          /* HIDDEN STATE */
          <div className="w-full h-full bg-gradient-to-br from-[#ECE8E1] via-[#E1DDD5] to-[#D5CFB9] flex flex-col items-center justify-center p-4 text-center">
            <div className="w-10 h-10 rounded-full bg-white/95 shadow-md flex items-center justify-center text-[#6B635B] mb-2">
              <Lock className="w-4 h-4 text-[#40798C]" />
            </div>
            <p className="text-[10px] text-warm-charcoal font-black uppercase tracking-wider">
              {locale === 'en' ? 'Portrait Hidden' : locale === 'ar' ? 'الصورة الشخصية مخفية' : 'وێنە شاراوەیە'}
            </p>
            <p className="text-[8px] text-stone-500 font-medium">
              {locale === 'en' ? 'Portrait only revealed on mutual consent' : 'تُكشف الصورة فقط بموافقة الطرفين'}
            </p>
          </div>
        ) : isInitialsState ? (
          /* INITIALS STATE */
          <div className="w-full h-full bg-gradient-to-br from-[#E6ECEA] via-[#D5E1DF] to-[#CAD3D2] flex flex-col items-center justify-center p-4 text-center">
            <div className="w-14 h-14 rounded-full bg-white/95 shadow-md flex items-center justify-center text-accent-coral mb-2 font-serif font-black text-xl border border-white">
              {initialsLetter}
            </div>
            <p className="text-[10px] text-warm-charcoal font-black uppercase tracking-wider">
              {locale === 'en' ? 'Initials-Only Mode' : locale === 'ar' ? 'الاسم الثنائي فقط' : 'پۆرتریتی ناوی یەکەم'}
            </p>
            <p className="text-[8px] text-stone-500 font-medium font-mono">
              {locale === 'en' ? 'Reveals after request acceptance' : 'تظهر بالكامل بعد قبول الطلب'}
            </p>
          </div>
        ) : (
          /* BLURRED OR VISIBLE STATE */
          <>
            <img
              src={match.avatarUrl}
              alt={match.name}
              className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${
                isBlur ? 'filter blur-[15px]' : ''
              }`}
              referrerPolicy="no-referrer"
            />

            {/* High quality Blur Overlay layer */}
            {isBlur && (
              <div className="absolute inset-0 bg-[#2D2A26]/30 flex flex-col items-center justify-center p-4 text-center">
                <div className="w-9 h-9 rounded-full bg-white/95 shadow-md flex items-center justify-center text-warm-charcoal mb-1.5">
                  <Lock className="w-4 h-4 text-accent-coral" />
                </div>
                <p className="text-[10px] text-white font-bold uppercase tracking-wider">
                  {locale === 'en' ? 'Portrait Protected' : 'الصورة مصانة'}
                </p>
                <p className="text-[8px] text-white/90">
                  {locale === 'en' ? 'Click "Send Request" to request photo unlock' : 'اضغط على "إرسال طلب" لطلب فك حجب الصورة'}
                </p>
              </div>
            )}
          </>
        )}

        {/* Compatibility & Demo Verification inside card header */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center z-10">
          <span className="text-[9px] font-black tracking-wider bg-white/80 backdrop-blur-md text-accent-coral border border-accent-coral/25 px-2.5 py-0.5 rounded-md uppercase font-mono shadow-sm">
            {match.compatibilityScore}% {locale === 'en' ? 'Compatibility' : locale === 'ar' ? 'توافق' : 'گونجان'}
          </span>
          {match.verified && (
            <span className="bg-[#40798C] text-white flex items-center gap-1 text-[8px] font-bold px-2 py-0.5 rounded-md shadow-sm border border-white/20 select-none">
              <ShieldCheck className="w-3 h-3 text-white shrink-0" />
              <span>{locale === 'en' ? 'Demo Verified' : locale === 'ar' ? 'موثق تجريبي' : 'خۆپیشاندانی سەلمێنراو'}</span>
            </span>
          )}
        </div>

        {/* Location label */}
        <div className="absolute bottom-3 left-3 bg-[#2D2A26]/50 backdrop-blur-sm text-white text-[9px] font-mono font-bold px-2.5 py-1 rounded-md uppercase tracking-wider z-10">
          📍 {match.governorate}
        </div>
      </div>

      {/* Info and CTA area */}
      <div className="p-5 text-left space-y-4 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          {/* Name block */}
          <div className="flex justify-between items-start gap-2">
            <h4 
              onClick={() => onOpenDetails(match)}
              className="text-base font-bold text-warm-charcoal font-serif hover:text-accent-coral transition-all cursor-pointer leading-tight font-display"
            >
              {match.name}, <span className="font-normal text-[#6B635B]">{match.age}</span>
            </h4>
            <span className="text-[9px] font-bold text-[#40798C] bg-[#40798C]/5 border border-[#40798C]/15 px-2 py-0.5 rounded-md">
              🕒 {match.timeline.replace(/Within/g, '').trim()}
            </span>
          </div>

          {/* Specific profession and detailed description (including education level) */}
          <div className="space-y-0.5">
            <p className="text-[10px] font-bold text-[#40798C] font-mono uppercase tracking-wider flex items-center gap-1">
              💼 <span>{match.profession}</span>
            </p>
            <p className="text-[10px] font-bold text-stone-500 font-mono uppercase tracking-wider flex items-center gap-1">
              🎓 <span>{match.education}</span>
            </p>
          </div>

          <p className="text-xs text-[#6B635B] leading-relaxed font-medium line-clamp-2 italic">
            "{match.aboutMe}"
          </p>

          {/* Religion/sect, photo privacy status, and ethnicity */}
          <div className="flex flex-wrap gap-1.5 text-[9px] font-bold font-mono">
            {/* Religion & Sect */}
            <span className="text-[#40798C] bg-[#40798C]/10 px-2 py-0.5 rounded border border-[#40798C]/20 capitalize">
              🕌 {match.religion === 'islam' ? `${match.sect || 'Sunni'} Muslim` : 'Non-Muslim'}
            </span>
            
            {/* Privacy / photo status */}
            <span className="text-amber-700 bg-amber-50/60 px-2 py-0.5 rounded border border-amber-200/50 capitalize">
              {match.requestStatus === 'accepted' 
                ? (locale === 'en' ? '🔓 Portrait Visible' : locale === 'ar' ? '🔓 الصورة مكشوفة' : '🔓 وێنە بینراوە')
                : match.photoStatus === 'hidden'
                ? (locale === 'en' ? '🔒 Portrait Hidden' : locale === 'ar' ? '🔒 الصورة مخفية' : '🔒 وێنە شاراوەیە')
                : match.photoStatus === 'initials'
                ? (locale === 'en' ? '🔒 Initials Only' : locale === 'ar' ? '🔒 الاسم الثنائي فقط' : '🔒 تەنها سەرەتای ناو')
                : (locale === 'en' ? '🔒 Portrait Blurred' : locale === 'ar' ? '🔒 الصورة مموهة' : '🔒 وێنە لێڵکراوە')}
            </span>

            <span className="text-accent-coral bg-[#FF7F50]/10 px-2 py-0.5 rounded border border-[#FF7F50]/20 capitalize">
              {match.ethnicity}
            </span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {match.valuesSummary.slice(0, 2).map((val) => (
              <span 
                key={val} 
                className="text-[9px] font-bold text-[#4A443F] bg-white border border-stone-200 px-2 py-0.5 rounded-md"
              >
                {val}
              </span>
            ))}
          </div>
        </div>

        {/* Primary card CTA buttons */}
        <div className="pt-2">
          {match.requestStatus === 'none' && (
            <button
              type="button"
              onClick={() => onSendRequest(match.id)}
              className="w-full py-2.5 rounded-xl bg-warm-charcoal text-white font-bold text-xs hover:opacity-90 transition duration-200 shadow-lg flex items-center justify-center space-x-1.5"
            >
              <Heart className="w-3.5 h-3.5 text-accent-pink fill-accent-pink/20" />
              <span>{locale === 'en' ? 'Send Request' : 'إرسال طلب'}</span>
            </button>
          )}

          {match.requestStatus === 'sent' && (
            <div className="space-y-1">
              <button
                type="button"
                disabled
                className="w-full py-2.5 rounded-xl bg-accent-coral/10 text-accent-coral border border-accent-coral/20 font-bold text-xs cursor-not-allowed flex items-center justify-center space-x-1"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-accent-coral animate-ping shrink-0" />
                <span>{locale === 'en' ? 'Request Pending Review' : 'بانتظار مراجعة القبول'}</span>
              </button>
              <p className="text-[8px] text-center text-[#6B635B] font-mono font-medium">
                {locale === 'en' ? 'Auto-approves in 2.5 seconds (Simulated)' : 'موافقة تلقائية خلال 2.5 ثانية (محاكاة)'}
              </p>
            </div>
          )}

          {match.requestStatus === 'accepted' && (
            <button
              type="button"
              onClick={() => onInitiateChat(match.id)}
              className="w-full py-2.5 rounded-xl bg-[#40798C] hover:opacity-90 text-white font-bold text-xs transition duration-200 shadow-md flex items-center justify-center space-x-1.5"
            >
              <CheckCircle className="w-4 h-4 text-emerald-300" />
              <span>{locale === 'en' ? 'Connected! Chat' : 'تم القبول! دردشة'} ➔</span>
            </button>
          )}
        </div>
      </div>

      {/* Click target helper for detailed popover */}
      <div 
        onClick={() => onOpenDetails(match)}
        className="bg-white/45 hover:bg-white border-t border-white/20 p-2 text-center text-[9px] font-bold text-[#6B635B] cursor-pointer transition uppercase font-mono tracking-wider"
      >
        {locale === 'en' ? 'View Full Dossier ↗' : 'عرض الملف الكامل ↗'}
      </div>
    </div>
  );
}
