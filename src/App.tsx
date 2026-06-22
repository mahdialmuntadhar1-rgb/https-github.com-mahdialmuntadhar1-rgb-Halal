/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserProfile, MatchProfile, Conversation, Message } from './types';
import { INITIAL_MATCHES } from './data/matches';
import Header from './components/Header';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import OnboardingWizard from './components/OnboardingWizard';
import PhotoPrivacyModule from './components/PhotoPrivacyModule';
import MatchExplorer from './components/MatchExplorer';
import ChatSimulator from './components/ChatSimulator';
import TrustSafety from './components/TrustSafety';
import { Language, TRANSLATIONS } from './lib/translations';
import { Heart, Sparkles, Check, Info, Lock, ShieldCheck, Mail, Sliders } from 'lucide-react';

export default function App() {
  const [currentTab, setTab] = useState<'landing' | 'onboarding' | 'explore' | 'chat' | 'philosophy'>('landing');
  const [locale, setLocale] = useState<Language>('ar');

  const t = TRANSLATIONS[locale];
  
  // Initialize standard User Profile
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: '',
    age: 0,
    gender: 'male',
    country: '',
    religion: 'islam',
    sect: 'sunni',
    ethnicity: 'arab',
    education: '',
    profession: '',
    languages: ['Arabic', 'English'],
    intention: 'Seeking serious marriage introduces.',
    timeline: 'Within 1 year',
    wantsChildren: 'Yes, definitely',
    relocation: 'Yes, open globally',
    familyInvolvement: 'Moderate combined with support',
    values: [],
    photoPrivacy: 'visible',
    partnerReligion: 'islam',
    partnerSect: 'sunni',
    partnerEthnicity: 'arab'
  });

  // Calculate profile completion score based on entered fields
  const calculateProfileStrength = (): number => {
    let score = 0;
    if (userProfile.name) score += 15;
    if (userProfile.age > 0) score += 15;
    if (userProfile.religion && userProfile.ethnicity && userProfile.country) score += 20;
    if (userProfile.profession && userProfile.education) score += 20;
    if (userProfile.languages.length > 0) score += 15;
    if (userProfile.values.length > 0) score += 15;
    return score;
  };

  // State elements for active pool and notifications
  const [matches, setMatches] = useState<MatchProfile[]>(INITIAL_MATCHES);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeMatchId, setActiveMatchId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  };

  // Onboarding compilation
  const handleOnboardingComplete = (updatedProfile: UserProfile) => {
    setUserProfile(updatedProfile);
    triggerToast(`✨ Congratulations! Your halal introduction is sealed. Compatibility pool updated!`);
    setTab('explore');
  };

  // Request dispatch with automated mock responsive approval simulation
  const handleSendRequest = (matchId: string) => {
    // Set pending status
    setMatches((prevMatches) =>
      prevMatches.map((m) =>
        m.id === matchId ? { ...m, requestStatus: 'sent' } : m
      )
    );
    triggerToast(`✉️ Introduction request sent securely. Acknowledging respect rules...`);

    // Simulate 2.5s review approval
    setTimeout(() => {
      setMatches((prevMatches) =>
        prevMatches.map((m) => {
          if (m.id === matchId) {
            triggerToast(`🎉 Mutual interest! ${m.name} accepted your request. Chat unlocked! 🔓`);
            return {
              ...m,
              requestStatus: 'accepted',
              photoStatus: 'unlocked'
            };
          }
          return m;
        })
      );

      // Bootstrap Conversation
      setConversations((prev) => {
        if (prev.some(c => c.matchId === matchId)) return prev;
        const targetMatch = matches.find(m => m.id === matchId);
        const name = targetMatch ? targetMatch.name : 'your partner';
        return [
          ...prev,
          {
            matchId,
            messages: [
              {
                id: `welcome_${matchId}`,
                sender: 'match',
                text: `Assalamu Alaikum. Thank you for connecting with serious intentions. I liked your profile and compatibility values! What does a peaceful married life look like to you?`,
                timestamp: 'Just now'
              }
            ]
          }
        ];
      });
    }, 2800);
  };

  const handleInitiateChat = (matchId: string) => {
    setActiveMatchId(matchId);
    setTab('chat');
  };

  // Chat message logging
  const handleSendMessage = (matchId: string, text: string, sender: 'user' | 'match') => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setConversations((prev) =>
      prev.map((c) => {
        if (c.matchId === matchId) {
          return {
            ...c,
            messages: [
              ...c.messages,
              {
                id: `msg_${Date.now()}`,
                sender,
                text,
                timestamp: timeNow
              }
            ]
          };
        }
        return c;
      })
    );
  };

  // Helper filters accepted list
  const acceptedMatches = matches.filter(m => m.requestStatus === 'accepted');
  const profileStrength = calculateProfileStrength();

  const handleScrollToRules = () => {
    const el = document.getElementById('photo-privacy-rules');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      setTab('landing');
      setTimeout(() => {
        document.getElementById('photo-privacy-rules')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <div 
      dir={t.dir} 
      lang={locale} 
      className="bg-warm-ivory min-h-screen text-warm-charcoal font-sans flex flex-col justify-between selection:bg-accent-coral/20 selection:text-accent-coral relative overflow-hidden"
    >
      
      {/* Blur blobs background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-accent-coral rounded-full blur-[140px]" />
        <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[50%] bg-accent-pink rounded-full blur-[140px]" />
        <div className="absolute top-[40%] left-[20%] w-[40%] h-[40%] bg-[#40798C] rounded-full blur-[140px]" />
      </div>

      {/* Dynamic Toast Notifications */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-55 max-w-sm bg-warm-charcoal text-white text-xs sm:text-sm p-4 rounded-2xl shadow-2xl flex items-center space-x-3 border border-white/10 animate-slide-in">
          <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
          <p className="font-bold">{toastMessage}</p>
        </div>
      )}

      {/* Primary Header Component */}
      <Header
        currentTab={currentTab}
        setTab={setTab}
        profileStrength={profileStrength}
        userProfileName={userProfile.name}
        locale={locale}
        setLocale={setLocale}
      />

      {/* Main Content Render Switcher */}
      <main className="flex-grow">
        {currentTab === 'landing' && (
          <div className="animate-fade-in">
            <Hero
              locale={locale}
              onSelectGender={(gender) => {
                setUserProfile(prev => ({
                  ...prev,
                  gender,
                  photoPrivacy: gender === 'female' ? 'hidden_by_default' : 'visible'
                }));
                triggerToast(locale === 'en' ? `✨ Gender set to ${gender}. Let's fill out your parameters!` : locale === 'ar' ? `✨ تم تحديد الجنس كـ ${gender === 'male' ? 'ذكر' : 'أنثى'}. فلنبدأ بملء المعايير!` : `✨ ڕەگەز دیاریکرا بە ${gender === 'male' ? 'نێر' : 'مێ'}. با دەست بکەین بە پڕکردنەوەی پێوەرەکان!`);
                setTab('onboarding');
              }}
              onExploreMatches={() => setTab('explore')}
            />
            <HowItWorks locale={locale} />
            <PhotoPrivacyModule locale={locale} />
            <TrustSafety locale={locale} />

            {/* In-Depth Core Philosophy Section (Chunk 12) */}
            <section className="bg-transparent py-16" id="core-philosophy">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-gradient-to-br from-accent-coral to-accent-pink rounded-[2.5rem] p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl">
                  {/* Decorative element */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2" />
                  
                  <div className="max-w-2xl space-y-6 relative z-10 text-start">
                    <span className="text-[10px] uppercase bg-white/20 px-3 py-1 rounded-full font-mono font-bold tracking-widest">
                      {t.philSub}
                    </span>
                    <h3 className="text-3xl sm:text-4xl font-serif font-black tracking-tight font-display">
                      {t.philTitle}
                    </h3>
                    <p className="text-sm sm:text-base text-white/90 font-medium leading-relaxed">
                      {t.philDesc}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-xs font-semibold text-white/90">
                      <div className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-white shrink-0" />
                        <span>{t.philPoint1}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-white shrink-0" />
                        <span>{t.philPoint2}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-white shrink-0" />
                        <span>{t.philPoint3}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-white shrink-0" />
                        <span>{t.philPoint4}</span>
                      </div>
                    </div>

                    <div className="pt-6">
                      <button
                        onClick={() => setTab('onboarding')}
                        className="px-8 py-4 rounded-2xl bg-white text-warm-charcoal font-bold hover:bg-warm-ivory transition active:scale-95 shadow-lg shadow-black/10 text-xs sm:text-sm"
                      >
                        {t.philBtn}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {currentTab === 'onboarding' && (
          <section className="py-12 px-4 animate-fade-in relative z-10">
            <div className="max-w-3xl mx-auto text-center mb-8 space-y-2">
              <h2 className="text-3xl font-serif font-black text-warm-charcoal font-display">{t.wizardTitle}</h2>
              <p className="text-[#6B635B] text-sm font-medium">
                {t.wizardSub}
              </p>
            </div>
            <OnboardingWizard
              locale={locale}
              onComplete={handleOnboardingComplete}
              initialProfile={userProfile}
            />
          </section>
        )}

        {currentTab === 'explore' && (
          <section className="py-4 animate-fade-in">
            <MatchExplorer
              locale={locale}
              matches={matches}
              onSendRequest={handleSendRequest}
              onInitiateChat={handleInitiateChat}
              userGender={userProfile.gender}
            />
          </section>
        )}

        {currentTab === 'chat' && (
          <section className="py-4 animate-fade-in">
            <ChatSimulator
              locale={locale}
              acceptedMatches={acceptedMatches}
              conversations={conversations}
              onSendMessage={handleSendMessage}
              activeMatchId={activeMatchId}
              setActiveMatchId={setActiveMatchId}
            />
          </section>
        )}
      </main>

      {/* PERSISTENT FOOTER (Chunk 13) */}
      <footer className="bg-warm-charcoal text-[#C3BFB9] py-12 border-t border-white/10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-white/10 text-start">
            
            {/* Branding */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-coral to-accent-pink flex items-center justify-center">
                  <span className="text-white font-serif font-bold text-sm">H</span>
                </div>
                <span className="text-xl font-serif font-bold tracking-wider text-white font-display">{t.brand}</span>
              </div>
              <p className="text-xs text-[#C3BFB9]/80 max-w-sm font-normal">
                {t.footerDesc}
              </p>
            </div>

            {/* Quick Links */}
            <div className="md:col-span-3 space-y-3">
              <h5 className="text-white text-xs font-bold uppercase tracking-widest font-mono">{t.exploreTitle}</h5>
              <ul className="text-xs space-y-2">
                <li>
                  <button onClick={() => setTab('landing')} className="hover:text-white transition">{t.overview}</button>
                </li>
                <li>
                  <button onClick={() => setTab('onboarding')} className="hover:text-white transition">{t.onboarding}</button>
                </li>
                <li>
                  <button onClick={() => setTab('explore')} className="hover:text-white transition">{t.explore}</button>
                </li>
                <li>
                  <button onClick={() => setTab('chat')} className="hover:text-white transition">{t.chat}</button>
                </li>
              </ul>
            </div>

            {/* Respect rules disclaimer */}
            <div className="md:col-span-4 space-y-3">
              <h5 className="text-white text-xs font-bold uppercase tracking-widest font-mono">{t.footerPledgeTitle}</h5>
              <p className="text-xs text-[#C3BFB9]/80 leading-relaxed font-normal">
                {t.footerPledgeDesc}
              </p>
            </div>

          </div>

          {/* Copyrights and meta */}
          <div className="flex flex-col sm:flex-row justify-between items-center pt-8 text-xs font-medium">
            <p>{t.copyright}</p>
            <div className="flex space-x-4 mt-4 sm:mt-0">
              <a href="#" className="hover:text-white transition">{t.privacyPolicy}</a>
              <span>•</span>
              <a href="#" className="hover:text-white transition">{t.terms}</a>
              <span>•</span>
              <a href="#" className="hover:text-white transition">{t.idVerify}</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
