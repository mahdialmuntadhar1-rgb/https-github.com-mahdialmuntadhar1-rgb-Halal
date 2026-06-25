import React, { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, ShieldAlert } from 'lucide-react';
import { UserProfile } from '../types';
import { Language, TRANSLATIONS } from '../lib/translations';
import { INTENTION_BADGES } from '../services/mockApi';
import { displayValue, labelFor } from '../i18n/labels';

interface OnboardingWizardProps {
  locale: Language;
  onComplete: (profile: UserProfile) => void;
  initialProfile: UserProfile;
}

const GOVERNORATES = [
  'Baghdad', 'Basra', 'Nineveh', 'Erbil', 'Sulaymaniyah', 'Duhok', 'Kirkuk',
  'Najaf', 'Karbala', 'Babil', 'Wasit', 'Diyala', 'Anbar', 'Salah al-Din',
  'Maysan', 'Dhi Qar', 'Muthanna', 'Qadisiyah', 'Halabja'
];

const EDUCATION_LEVELS = [
  'High School',
  'Diploma / Institute',
  "Bachelor's Degree",
  "Master's Degree",
  'Doctorate',
  'Other'
];

export default function OnboardingWizard({ locale, onComplete, initialProfile }: OnboardingWizardProps) {
  const t = TRANSLATIONS[locale] || TRANSLATIONS.ar;
  const [step, setStep] = useState(1);
  const [accepted18, setAccepted18] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [profile, setProfile] = useState<UserProfile>({
    ...initialProfile,
    country: initialProfile.country || 'Iraq',
    governorate: initialProfile.governorate || 'Baghdad',
    education: initialProfile.education || "Bachelor's Degree",
    maritalStatus: initialProfile.maritalStatus || 'Single',
    intention: initialProfile.intention || 'Serious for marriage',
    intentionBadges: initialProfile.intentionBadges || ['Serious for marriage'],
    lookingFor: initialProfile.lookingFor || '',
    bio: initialProfile.bio || initialProfile.lookingFor || '',
    photoPrivacy: initialProfile.photoPrivacy || 'visible'
  });

  const completionFields = useMemo(
    () => [
      profile.gender,
      profile.age >= 18 ? profile.age : '',
      profile.governorate,
      profile.education,
      profile.profession,
      profile.maritalStatus,
      profile.intention,
      profile.bio,
      profile.lookingFor,
      profile.photoPrivacy,
      profile.intentionBadges?.length ? 'badges' : ''
    ],
    [profile]
  );
  const completion = Math.round((completionFields.filter(Boolean).length / completionFields.length) * 100);

  const updateProfile = (fields: Partial<UserProfile>) => setProfile((prev) => ({ ...prev, ...fields }));

  const toggleBadge = (badge: NonNullable<UserProfile['intentionBadges']>[number]) => {
    const active = profile.intentionBadges || [];
    updateProfile({
      intentionBadges: active.includes(badge) ? active.filter((item) => item !== badge) : [...active, badge]
    });
  };

  const validate = () => {
    const currentErrors: string[] = [];
    if (step === 1 && !accepted18) currentErrors.push(t.confirm18Error);
    if (step === 1 && (!profile.age || profile.age < 18)) currentErrors.push(t.age18Error);
    if (step === 2 && !profile.profession.trim()) currentErrors.push(t.occupationRequired);
    if (step === 3 && (!profile.bio || profile.bio.trim().length < 20)) currentErrors.push(t.bioRequired);
    if (step === 3 && (!profile.lookingFor || profile.lookingFor.trim().length < 15)) currentErrors.push(t.lookingForRequired);
    setErrors(currentErrors);
    return currentErrors.length === 0;
  };

  const next = () => {
    if (!validate()) return;
    if (step < 4) {
      setStep((value) => value + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onComplete(profile);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white/70 backdrop-blur-xl p-5 sm:p-8 rounded-[1.75rem] border border-white/80 shadow-xl relative z-10" id="onboarding-flow">
      <div className="mb-7 space-y-4 text-start">
        <div className="flex justify-between items-center text-xs font-mono">
          <span className="font-black text-[#40798C] uppercase tracking-wider">
            {t.basicMarriageProfile}
          </span>
          <span className="text-[#6B635B] font-black">{t.stepOf.replace('{step}', String(step)).replace('{total}', '4')}</span>
        </div>
        <div className="w-full bg-stone-200/60 h-2 rounded-full overflow-hidden">
          <div className="bg-gradient-to-r from-accent-coral to-[#40798C] h-full transition-all" style={{ width: `${step * 25}%` }} />
        </div>
        <div className="rounded-2xl bg-[#40798C]/10 border border-[#40798C]/15 p-4">
          <p className="text-xs font-black text-[#40798C]">{t.profileComplete.replace('{percent}', String(completion))}</p>
          <p className="text-xs text-[#6B635B] mt-1">{t.completeEssentials}</p>
        </div>
        {errors.length > 0 && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-start space-y-1">
            <p className="text-xs font-bold text-rose-800 uppercase tracking-widest flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-500" />
              {t.pleaseReview}
            </p>
            {errors.map((error) => <p key={error} className="text-xs text-rose-700 font-semibold">• {error}</p>)}
          </div>
        )}
      </div>

      {step === 1 && (
        <div className="space-y-5 text-start">
          <Field label={t.gender}>
            <div className="grid grid-cols-2 gap-3">
              {(['male', 'female'] as const).map((gender) => (
                <button key={gender} type="button" onClick={() => updateProfile({ gender })} className={`p-3 rounded-xl border text-sm font-bold ${profile.gender === gender ? 'bg-[#40798C] text-white border-[#40798C]' : 'bg-white border-stone-200 text-warm-charcoal'}`}>
                  {gender === 'male' ? t.male : t.female}
                </button>
              ))}
            </div>
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label={t.age}>
              <input type="number" min={18} max={80} value={profile.age || ''} onChange={(event) => updateProfile({ age: Number(event.target.value) })} className="input-basic" />
            </Field>
            <Field label={t.cityGovernorate}>
              <select value={profile.governorate} onChange={(event) => updateProfile({ governorate: event.target.value })} className="input-basic">
                {GOVERNORATES.map((gov) => <option key={gov} value={gov}>{displayValue(gov, locale)}</option>)}
              </select>
            </Field>
          </div>
          <label className="flex gap-3 rounded-2xl bg-amber-50 border border-amber-200 p-4 text-xs font-bold text-amber-900">
            <input type="checkbox" checked={accepted18} onChange={(event) => setAccepted18(event.target.checked)} className="mt-0.5" />
            <span>{t.confirm18}</span>
          </label>
        </div>
      )}

      {step === 2 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-start">
          <Field label={t.education}>
            <select value={profile.education} onChange={(event) => updateProfile({ education: event.target.value })} className="input-basic">
              {EDUCATION_LEVELS.map((level) => <option key={level} value={level}>{displayValue(level, locale)}</option>)}
            </select>
          </Field>
          <Field label={t.profession}>
            <input value={profile.profession} onChange={(event) => updateProfile({ profession: event.target.value })} className="input-basic" placeholder={t.occupationPlaceholder} />
          </Field>
          <Field label={t.maritalStatus}>
            <select value={profile.maritalStatus} onChange={(event) => updateProfile({ maritalStatus: event.target.value })} className="input-basic">
              {['Single', 'Divorced', 'Widowed'].map((status) => <option key={status} value={status}>{labelFor(status, t)}</option>)}
            </select>
          </Field>
          <Field label={t.marriageIntention}>
            <select value={profile.intention} onChange={(event) => updateProfile({ intention: event.target.value })} className="input-basic">
              {['Ready for marriage soon', 'Serious for marriage', 'Studying first', 'Family discussion needed'].map((item) => <option key={item} value={item}>{labelFor(item, t)}</option>)}
            </select>
          </Field>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4 text-start">
          <Field label={t.shortBio}>
            <textarea value={profile.bio || ''} onChange={(event) => updateProfile({ bio: event.target.value })} className="input-basic min-h-28" placeholder={t.bioPlaceholder} />
          </Field>
          <Field label={t.lookingFor}>
            <textarea value={profile.lookingFor || ''} onChange={(event) => updateProfile({ lookingFor: event.target.value })} className="input-basic min-h-24" placeholder={t.lookingForPlaceholder} />
          </Field>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-5 text-start">
          <Field label={t.privacyPreference}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                ['visible', t.visibleProfile],
                ['hidden_by_default', t.blurPhoto],
                ['hidden', t.privateProfile]
              ].map(([value, label]) => (
                <button key={value} type="button" onClick={() => updateProfile({ photoPrivacy: value as UserProfile['photoPrivacy'] })} className={`p-3 rounded-xl border text-xs font-bold ${profile.photoPrivacy === value ? 'bg-warm-charcoal text-white border-warm-charcoal' : 'bg-white border-stone-200 text-warm-charcoal'}`}>
                  {label}
                </button>
              ))}
            </div>
          </Field>
          <Field label={t.intentionBadges}>
            <div className="flex flex-wrap gap-2">
              {INTENTION_BADGES.map((badge) => (
                <button key={badge} type="button" onClick={() => toggleBadge(badge)} className={`rounded-xl px-3 py-2 text-xs font-black border flex items-center gap-1 ${profile.intentionBadges?.includes(badge) ? 'bg-[#40798C] text-white border-[#40798C]' : 'bg-white text-warm-charcoal border-stone-200'}`}>
                  {profile.intentionBadges?.includes(badge) && <Check className="w-3.5 h-3.5" />}
                  {labelFor(badge, t)}
                </button>
              ))}
            </div>
          </Field>
        </div>
      )}

      <div className="flex justify-between items-center pt-7 border-t border-stone-200 mt-8">
        <button type="button" onClick={() => setStep((value) => Math.max(1, value - 1))} disabled={step === 1} className="flex items-center gap-1.5 px-5 py-3 rounded-xl text-sm font-black bg-white border border-stone-200 text-warm-charcoal disabled:opacity-30">
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          {t.back}
        </button>
        <button type="button" onClick={next} className="flex items-center gap-2 bg-gradient-to-r from-accent-coral to-[#40798C] text-white px-6 py-3 rounded-xl text-sm font-extrabold shadow-lg">
          {step === 4 ? t.enterExplore : t.continue}
          <ArrowRight className="w-4 h-4 rtl:rotate-180" />
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-black text-warm-charcoal uppercase tracking-wider mb-2 font-mono">{label}</span>
      {children}
    </label>
  );
}
