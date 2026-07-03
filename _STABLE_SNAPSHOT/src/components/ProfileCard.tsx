import React from 'react';
import { UserProfile, MatchProfile, AppLanguage } from '../types';
import { ShieldCheck, Calendar, MapPin, Award, Smile, Globe, Heart } from 'lucide-react';

interface ProfileCardProps {
  profile: UserProfile | MatchProfile;
  locale: AppLanguage;
  isCurrentUser?: boolean;
}

export default function ProfileCard({ profile, locale, isCurrentUser = false }: ProfileCardProps) {
  const isMatch = 'compatibilityScore' in profile;
  
  const valuesArray = 'valuesSummary' in profile ? profile.valuesSummary : (profile.values || []);

  const txt = (en: string, ar: string, ckb: string) => {
    return locale === 'en' ? en : locale === 'ckb' ? ckb : ar;
  };

  const getReligionSect = () => {
    if (profile.religion === 'islam') {
      const sectStr = profile.sect === 'sunni' 
        ? txt('Sunni', 'سُنّي', 'سوننە') 
        : profile.sect === 'shiaa' 
          ? txt('Shiaa', 'شيعي', 'شیعە') 
          : txt('Muslim', 'مسلم', 'موسڵمان');
      return `${sectStr} ${txt('Muslim', 'مسلم', 'موسڵمان')}`;
    }
    return txt('Non-Muslim', 'غير مسلم', 'نا موسڵمان');
  };

  const getEthnicity = () => {
    if (profile.ethnicity === 'arab') return txt('Arab', 'عربي', 'عەرەب');
    if (profile.ethnicity === 'kurdish') return txt('Kurdish', 'كوردي', 'کورد');
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

  return (
    <div className="bg-white/50 backdrop-blur-xl border border-white/60 rounded-[2.5rem] p-6 sm:p-8 shadow-xl text-start space-y-6" id="profile-card">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img
              src={'avatarUrl' in profile && profile.avatarUrl ? profile.avatarUrl : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop'}
              alt={profile.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-accent-coral shadow-md"
              referrerPolicy="no-referrer"
            />
            {('verified' in profile && profile.verified) && (
              <span className="absolute bottom-0 right-0 bg-[#40798C] text-white p-1 rounded-full border border-white/60 shadow">
                <ShieldCheck className="w-3.5 h-3.5" />
              </span>
            )}
          </div>
          <div>
            <h4 className="text-xl font-serif font-black text-warm-charcoal font-display flex flex-wrap items-center gap-2">
              <span>{profile.name || txt('Anonymous User', 'مجهول الهوية', 'بەکارهێنەری نەناسراو')}</span>
              {isCurrentUser && (
                <span className="text-[9px] bg-accent-coral/10 text-accent-coral font-bold px-2.5 py-0.5 rounded-full border border-accent-coral/20 uppercase font-mono">
                  {txt('Me', 'أنا', 'من')}
                </span>
              )}
              {('verified' in profile && profile.verified) && (
                <span className="text-[9px] bg-[#40798C]/15 text-[#40798C] font-bold px-2.5 py-0.5 rounded-full border border-[#40798C]/20 uppercase font-mono flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#40798C]" />
                  <span>{txt('Demo Verified', 'موثق تجريبي', 'سەلمێنراوی تاقیکاری')}</span>
                </span>
              )}
            </h4>
            <p className="text-xs text-[#6B635B] font-semibold mt-0.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#40798C]" />
              <span>{profile.governorate || txt('Unspecified Governorate', 'محافظة غير محددة', 'پارێزگای دیارینەکراو')}, {profile.country || 'Iraq'}</span>
            </p>
          </div>
        </div>

        {isMatch && (
          <div className="bg-gradient-to-br from-[#40798C] to-[#599da0] px-4 py-2.5 rounded-2xl text-white shadow-md text-center shrink-0">
            <span className="text-[10px] block font-bold uppercase tracking-wider font-mono text-cyan-100">
              {txt('Compatibility', 'درجة التوافق', 'ڕێژەی گونجان')}
            </span>
            <span className="text-xl font-black">{profile.compatibilityScore}%</span>
          </div>
        )}
      </div>

      {/* Grid of Key Info */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 pt-4 border-t border-dashed border-stone-200">
        <div>
          <span className="text-[9px] font-bold text-[#6B635B] uppercase tracking-wider block font-mono">
            {txt('Age & Gender', 'العمر والجنس', 'تەمەن و ڕەگەز')}
          </span>
          <p className="font-bold text-warm-charcoal text-xs sm:text-sm mt-0.5">
            {profile.age || '—'} {txt('yrs', 'سنة', 'ساڵ')} • <span>{profile.gender === 'male' ? txt('Male', 'ذكر', 'نێر') : txt('Female', 'أنثى', 'مێ')}</span>
          </p>
        </div>

        <div>
          <span className="text-[9px] font-bold text-[#6B635B] uppercase tracking-wider block font-mono">
            {txt('Belief details', 'تفاصيل المذهب', 'وردەکارییەکانی بیروباوەڕ')}
          </span>
          <p className="font-bold text-warm-charcoal text-xs sm:text-sm mt-0.5">
            {getReligionSect()} • {getEthnicity()}
          </p>
        </div>

        <div>
          <span className="text-[9px] font-bold text-[#6B635B] uppercase tracking-wider block font-mono">
            {txt('Profession', 'المهنة', 'پیشە')}
          </span>
          <p className="font-bold text-warm-charcoal text-xs sm:text-sm mt-0.5 truncate">
            {profile.profession || '—'}
          </p>
        </div>

        <div>
          <span className="text-[9px] font-bold text-[#6B635B] uppercase tracking-wider block font-mono">
            {txt('Education', 'التحصيل الدراسي', 'ئاستی خوێندن')}
          </span>
          <p className="font-bold text-warm-charcoal text-xs sm:text-sm mt-0.5 truncate">
            {profile.education || '—'}
          </p>
        </div>

        <div>
          <span className="text-[9px] font-bold text-[#6B635B] uppercase tracking-wider block font-mono">
            {txt('Courtship Timeline', 'الجدول الزمني للزواج', 'ماوەی هاوسەرگیری')}
          </span>
          <p className="font-bold text-warm-charcoal text-xs sm:text-sm mt-0.5">
            {profile.timeline || '—'}
          </p>
        </div>

        <div>
          <span className="text-[10px] font-bold text-[#6B635B] uppercase tracking-wider block font-mono">
            {txt('Wants Children', 'الرغبة في الأطفال', 'منداڵبوون')}
          </span>
          <p className="font-bold text-warm-charcoal text-xs sm:text-sm mt-0.5">
            {profile.wantsChildren || '—'}
          </p>
        </div>

        <div>
          <span className="text-[10px] font-bold text-[#6B635B] uppercase tracking-wider block font-mono">
            {txt('Languages', 'اللغات', 'زمانەکان')}
          </span>
          <p className="font-bold text-warm-charcoal text-xs sm:text-sm mt-0.5 truncate">
            {profile.languages?.join(', ') || '—'}
          </p>
        </div>
      </div>

      {/* Sincere message / Description if available */}
      {('aboutMe' in profile && profile.aboutMe) && (
        <div className="bg-[#40798C]/5 p-4 rounded-2xl border border-[#40798C]/10 text-[#4A443F] text-xs sm:text-sm leading-relaxed italic">
          "{profile.aboutMe}"
        </div>
      )}

      {/* Values Summary Tags */}
      {valuesArray && valuesArray.length > 0 && (
        <div className="space-y-2">
          <span className="text-[9px] font-bold text-[#6B635B] uppercase tracking-wider block font-mono">
            {txt('Strict Values Commitments', 'الالتزام بالقيم الأساسية', 'بڕوابوون بە بنەما سەرەکییەکان')}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {valuesArray.map((v) => (
              <span key={v} className="bg-white border border-stone-200 px-3 py-1 rounded-xl text-xs font-semibold text-warm-charcoal shadow-sm">
                ⭐ {translateValue(v)}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
















