import React from 'react';
import { AppLanguage, UserProfile } from '../types';
import { TRANSLATIONS } from '../lib/translations';
import OnboardingWizard from '../components/OnboardingWizard';

interface OnboardingScreenProps {
  locale: AppLanguage;
  userProfile: UserProfile;
  onComplete: (updatedProfile: UserProfile) => void;
}

export default function OnboardingScreen({ locale, userProfile, onComplete }: OnboardingScreenProps) {
  const t = TRANSLATIONS[locale] || TRANSLATIONS['ar'];

  return (
    <section className="py-12 px-4 animate-fade-in relative z-10" id="onboarding-screen">
      <div className="max-w-3xl mx-auto text-center mb-8 space-y-2">
        <h2 className="text-3xl font-serif font-black text-warm-charcoal font-display">{t.wizardTitle}</h2>
        <p className="text-[#6B635B] text-sm font-medium">
          {t.wizardSub}
        </p>
      </div>
      <OnboardingWizard
        locale={locale}
        onComplete={onComplete}
        initialProfile={userProfile}
      />
    </section>
  );
}
