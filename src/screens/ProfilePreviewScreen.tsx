import React, { useState } from 'react';
import { AppLanguage, UserProfile } from '../types';
import ProfileCard from '../components/ProfileCard';
import ProfileEditor from '../components/ProfileEditor';
import { Sparkles, Edit3, UserCheck, ShieldCheck } from 'lucide-react';

interface ProfilePreviewScreenProps {
  locale: AppLanguage;
  profile: UserProfile;
  profileStrength: number;
  onSaveProfile: (updatedValues: Partial<UserProfile>) => void;
  triggerToast: (msg: string) => void;
}

export default function ProfilePreviewScreen({
  locale,
  profile,
  profileStrength,
  onSaveProfile,
  triggerToast
}: ProfilePreviewScreenProps) {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="profile-preview-screen-edit">
        <ProfileEditor
          locale={locale}
          profile={profile}
          onSave={onSaveProfile}
          onClose={() => setIsEditing(false)}
          triggerToast={triggerToast}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left" id="profile-preview-screen">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-200 pb-5">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-warm-charcoal font-serif tracking-tight">
            {locale === 'en' ? 'My Marriage Dossier' : 'ملفي الشخصي للتعارف'}
          </h2>
          <p className="text-[#6B635B] text-xs sm:text-sm font-medium mt-1">
            {locale === 'en' 
              ? 'Preview how prospective matches inspect your compatibility and seriousness answers.'
              : 'معاينة كيف يرى الشركاء المحتملون أجوبتك ومعايرك ومدى جدية نيتك.'}
          </p>
        </div>

        <button
          onClick={() => setIsEditing(true)}
          className="flex items-center space-x-1.5 px-4.5 py-2.5 rounded-xl bg-accent-coral text-white font-bold text-xs hover:opacity-95 transition active:scale-95 shadow-md shadow-accent-coral/10"
        >
          <Edit3 className="w-4 h-4" />
          <span>{locale === 'en' ? 'Edit Dossier Parameters' : 'تعديل المعايير والبيانات'}</span>
        </button>
      </div>

      {/* Profile strength widget */}
      <div className="bg-gradient-to-r from-[#40798C]/10 via-[#40798C]/5 to-transparent border border-[#40798C]/20 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <UserCheck className="w-5 h-5 text-[#40798C]" />
            <h4 className="font-bold text-warm-charcoal text-sm">
              {locale === 'en' ? 'Dossier Completeness Score' : 'مؤشر اكتمال الملف الشخصي'}
            </h4>
          </div>
          <p className="text-xs text-[#6B635B] font-medium max-w-sm">
            {locale === 'en'
              ? 'Complete profiles receive up to 5x higher mutual match approvals from serious partners.'
              : 'الملفات المكتملة تحصل على فرصة قبول أعلى بـ 5 مرات من الشركاء الجادين.'}
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
            {profileStrength}% {locale === 'en' ? 'Complete' : 'مكتمل'}
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
            {locale === 'en' ? 'Privacy Seal Active' : 'ميثاق الخصوصية الشرعي مفعّل'}
          </p>
          <p className="text-xs font-medium leading-relaxed">
            {locale === 'en'
              ? "Your profile is sheltered under active privacy settings. Photos remain masked by whatever options you set, and our anti-abuse filters automatically screen conversation requests for absolute dignity."
              : "ملفك محمي بالكامل بموجب أعلى معايير الأمان الشرعية. لا أحد يرى صورتك إلا بعد قبول ثنائي متبادل والتحقق من الهوية."}
          </p>
        </div>
      </div>

    </div>
  );
}

