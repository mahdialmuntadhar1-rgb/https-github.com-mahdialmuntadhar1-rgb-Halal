import React from 'react';
import { AlertTriangle, Bookmark, GraduationCap, Heart, Lock, MapPin, ShieldCheck } from 'lucide-react';
import { AppLanguage, MatchProfile } from '../types';
import { TRANSLATIONS } from '../lib/translations';
import { displayValue, labelFor } from '../i18n/labels';

interface MatchCardProps {
  key?: string;
  match: MatchProfile;
  locale: AppLanguage;
  onToggleSaved: (id: string) => void;
  onReport: (id: string) => void;
  onOpenDetails: (match: MatchProfile) => void;
}

export default function MatchCard({ match, locale, onToggleSaved, onReport, onOpenDetails }: MatchCardProps) {
  const t = TRANSLATIONS[locale] || TRANSLATIONS.ar;
  const isProtected = match.photoStatus === 'blurred' || match.photoStatus === 'hidden' || match.photoStatus === 'initials';
  const initialsLetter = match.name ? match.name.charAt(0).toUpperCase() : '?';

  return (
    <article className="bg-white/70 border border-white/70 rounded-[1.5rem] shadow-lg shadow-stone-200/30 hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden flex flex-col text-start">
      <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
        {match.photoStatus === 'hidden' || match.photoStatus === 'initials' ? (
          <div className="w-full h-full bg-gradient-to-br from-[#ECE8E1] to-[#D5E1DF] flex flex-col items-center justify-center text-center p-4">
            <div className="w-16 h-16 rounded-full bg-white shadow flex items-center justify-center font-serif font-black text-2xl text-accent-coral">
              {match.photoStatus === 'hidden' ? <Lock className="w-6 h-6 text-[#40798C]" /> : initialsLetter}
            </div>
            <p className="mt-3 text-[10px] font-black uppercase tracking-wider text-warm-charcoal">
              {t.privateProfile}
            </p>
          </div>
        ) : (
          <>
            <img
              src={match.avatarUrl}
              alt={match.name}
              className={`w-full h-full object-cover transition-transform duration-700 hover:scale-105 ${match.photoStatus === 'blurred' ? 'blur-[12px]' : ''}`}
              referrerPolicy="no-referrer"
            />
            {match.photoStatus === 'blurred' && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/10">
                <div className="rounded-full bg-white/90 p-3 shadow">
                  <Lock className="w-5 h-5 text-accent-coral" />
                </div>
              </div>
            )}
          </>
        )}

        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="bg-white/90 text-accent-coral border border-accent-coral/20 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase">
            {match.compatibilityScore}% {t.fit}
          </span>
          {match.verified && (
            <span className="bg-[#40798C] text-white flex items-center gap-1 text-[9px] font-bold px-2 py-1 rounded-lg">
              <ShieldCheck className="w-3 h-3" />
              18+
            </span>
          )}
        </div>
      </div>

      <div className="p-5 space-y-4 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <button type="button" onClick={() => onOpenDetails(match)} className="text-left">
            <h3 className="text-lg font-serif font-black text-warm-charcoal hover:text-accent-coral transition">
              {match.name}, <span className="font-normal text-[#6B635B]">{match.age}</span>
            </h3>
            <p className="text-[11px] text-[#6B635B] font-bold flex items-center gap-1 mt-1">
              <MapPin className="w-3.5 h-3.5 text-[#40798C]" />
              {match.city ? `${match.city}, ` : ''}{displayValue(match.governorate, locale)}
            </p>
          </button>
          <button
            type="button"
            onClick={() => onToggleSaved(match.id)}
            className={`p-2 rounded-xl border transition ${match.saved ? 'bg-accent-coral text-white border-accent-coral' : 'bg-white text-[#6B635B] border-stone-200 hover:text-accent-coral'}`}
            title={t.saveProfile}
          >
            <Bookmark className={`w-4 h-4 ${match.saved ? 'fill-white' : ''}`} />
          </button>
        </div>

        <div className="space-y-2">
          <p className="text-[11px] font-bold text-[#40798C] flex items-center gap-1">
            <GraduationCap className="w-3.5 h-3.5" />
            {displayValue(match.education, locale)}
          </p>
          <p className="text-xs text-warm-charcoal font-semibold">{match.profession}</p>
          <p className="text-xs text-[#6B635B] leading-relaxed line-clamp-3">"{match.aboutMe}"</p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
          <span className="bg-[#40798C]/10 text-[#40798C] px-2 py-1 rounded-lg">{match.timeline}</span>
          <span className="bg-accent-coral/10 text-accent-coral px-2 py-1 rounded-lg">{t.marriageIntention}</span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {(match.intentionBadges || ['Serious for marriage']).map((badge) => (
            <span key={badge} className="text-[9px] font-black bg-white border border-stone-200 text-warm-charcoal px-2 py-1 rounded-lg">
              {labelFor(badge, t)}
            </span>
          ))}
        </div>

        <div className="mt-auto flex gap-2 pt-2">
          <button
            type="button"
            onClick={() => onOpenDetails(match)}
            className="flex-1 rounded-xl bg-warm-charcoal text-white py-2.5 text-xs font-bold hover:opacity-90 transition flex items-center justify-center gap-1.5"
          >
            <Heart className="w-3.5 h-3.5 text-accent-pink" />
            {t.viewProfile}
          </button>
          <button
            type="button"
            onClick={() => onReport(match.id)}
            className="rounded-xl bg-white border border-stone-200 text-[#6B635B] p-2.5 hover:text-red-600 transition"
            title={t.report}
          >
            <AlertTriangle className="w-4 h-4" />
          </button>
        </div>

        {isProtected && (
          <p className="text-[10px] text-[#6B635B] font-medium">
            {t.privatePhotoNote}
          </p>
        )}
      </div>
    </article>
  );
}
