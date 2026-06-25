import React from 'react';
import { AppLanguage, UserProfile } from '../types';
import ProfileCard from '../components/ProfileCard';
import { Sparkles, Edit3, UserCheck, ShieldCheck } from 'lucide-react';
import { TRANSLATIONS } from '../lib/translations';

interface ProfilePreviewScreenProps {
  locale: AppLanguage;
  profile: UserProfile;
  profileStrength: number;
  onEditClick: () => void;
}

export default function ProfilePreviewScreen({
  locale,
  profile,
  profileStrength,
  onEditClick
}: ProfilePreviewScreenProps) {
  const t = TRANSLATIONS[locale] || TRANSLATIONS.ar;
  const copy = {
    en: {
      title: 'My Marriage Profile',
      sub: 'Preview how prospective matches see your compatibility and seriousness answers.',
      edit: 'Edit profile',
      score: 'Profile completeness',
      scoreSub: 'Complete profiles receive more approvals from serious members.',
      seal: 'Privacy protection active',
      sealSub: 'Your profile follows your privacy settings. Photos stay protected according to the options you choose.'
    },
    ar: {
      title: 'ملفي للزواج',
      sub: 'عاين كيف يرى الأعضاء المناسبون بياناتك وإجابات الجدية.',
      edit: 'تعديل الملف',
      score: 'اكتمال الملف',
      scoreSub: 'الملفات المكتملة تحصل على قبول أكثر من الأعضاء الجادين.',
      seal: 'حماية الخصوصية مفعلة',
      sealSub: 'ملفك يعمل وفق إعدادات الخصوصية التي اخترتها، وتبقى الصور محمية حسب خياراتك.'
    },
    ku: {
      title: 'پڕۆفایلی هاوسەرگیریی من',
      sub: 'ببینە ئەندامە گونجاوەکان چۆن زانیاری و وەڵامە جدییەکانت دەبینن.',
      edit: 'دەستکاری پڕۆفایل',
      score: 'تەواوی پڕۆفایل',
      scoreSub: 'پڕۆفایلی تەواوتر زۆرجار پەسەندی زیاتر لە ئەندامە جدییەکان وەردەگرێت.',
      seal: 'پاراستنی تایبەتمەندی چالاکە',
      sealSub: 'پڕۆفایلەکەت بە پێی ڕێکخستنەکانی تایبەتمەندی کاردەکات، و وێنەکان بە پێی هەڵبژاردنەکانت پارێزراون.'
    }
  }[locale];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-start" id="profile-preview-screen">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-200 pb-5">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-warm-charcoal font-serif tracking-tight">
            {copy.title}
          </h2>
          <p className="text-[#6B635B] text-xs sm:text-sm font-medium mt-1">
            {copy.sub}
          </p>
        </div>

        <button
          onClick={onEditClick}
          className="flex items-center space-x-1.5 px-4.5 py-2.5 rounded-xl bg-accent-coral text-white font-bold text-xs hover:opacity-95 transition active:scale-95 shadow-md shadow-accent-coral/10"
        >
          <Edit3 className="w-4 h-4" />
          <span>{copy.edit}</span>
        </button>
      </div>

      {/* Profile strength widget */}
      <div className="bg-gradient-to-r from-[#40798C]/10 via-[#40798C]/5 to-transparent border border-[#40798C]/20 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <UserCheck className="w-5 h-5 text-[#40798C]" />
            <h4 className="font-bold text-warm-charcoal text-sm">
              {copy.score}
            </h4>
          </div>
          <p className="text-xs text-[#6B635B] font-medium max-w-sm">
            {copy.scoreSub}
          </p>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="flex-1 sm:w-36 bg-white/40 border border-white/20 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#40798C] to-[#599da0] h-full transition-all duration-500"
              style={{ width: `${profileStrength}%` }}
            />
          </div>
          <span className="text-xs font-mono font-black text-[#40798C] shrink-0">
            {profileStrength}% {t.completeScore}
          </span>
        </div>
      </div>

      {/* Main card representation */}
      <ProfileCard profile={profile} locale={locale} isCurrentUser={true} />

      {/* Important Security Shield info */}
      <div className="bg-emerald-500/10 p-5 rounded-2xl border border-emerald-500/20 text-[#2E7D32] flex items-start space-x-3">
        <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-wider font-mono">
            {copy.seal}
          </p>
          <p className="text-xs font-medium leading-relaxed">
            {copy.sealSub}
          </p>
        </div>
      </div>

    </div>
  );
}
