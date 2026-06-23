/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserProfile, MatchProfile, Conversation } from './types';
import Header from './components/Header';
import LandingScreen from './screens/LandingScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import MatchExplorerScreen from './screens/MatchExplorerScreen';
import ChatScreen from './screens/ChatScreen';
import ProfilePreviewScreen from './screens/ProfilePreviewScreen';
import PrivacySettingsScreen from './screens/PrivacySettingsScreen';
import AccountPlaceholderScreen from './screens/AccountPlaceholderScreen';
import TrustPrivacyScreen from './screens/TrustPrivacyScreen';
import CommunityFeed from './components/CommunityFeed';
import AdminPanel from './components/AdminPanel';
import { useLocale } from './hooks/useLocale';
import { mockApi } from './services/mockApi';
import { Sparkles, Check, Heart } from 'lucide-react';
import { HeroImage } from './types';

export default function App() {
  const { locale, setLocale, t } = useLocale('ar');
  const [currentTab, setTab] = useState<'landing' | 'onboarding' | 'explore' | 'chat' | 'philosophy' | 'profile' | 'privacy' | 'account' | 'trust_safety' | 'community' | 'admin'>('landing');

  // Async States
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [savedMatchIds, setSavedMatchIds] = useState<string[]>([]);
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [matches, setMatches] = useState<MatchProfile[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeMatchId, setActiveMatchId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load Slideshow photos
  const loadHeroImages = async () => {
    try {
      const imgs = await mockApi.getHeroImages();
      setHeroImages(imgs);
    } catch (err) {
      console.error("Failed loading hero photos", err);
    }
  };

  // Sync saved list
  useEffect(() => {
    if (userProfile?.savedMatches) {
      setSavedMatchIds(userProfile.savedMatches);
    }
  }, [userProfile]);

  // Load Initial API Data
  useEffect(() => {
    async function loadData() {
      try {
        const [profile, matchesList, convs] = await Promise.all([
          mockApi.getCurrentUser(),
          mockApi.getMatches(),
          mockApi.getConversations()
        ]);
        setUserProfile(profile);
        setMatches(matchesList);
        setConversations(convs);
        await loadHeroImages();
      } catch (err) {
        console.error("Failed to load initial data", err);
      }
    }
    loadData();
  }, []);

  // Bookmark Toggler
  const handleToggleSaveMatch = async (matchId: string) => {
    try {
      const updatedUser = await mockApi.toggleSaveProfile(matchId);
      setUserProfile(updatedUser);
      const savedIds = updatedUser.savedMatches || [];
      setSavedMatchIds(savedIds);
      
      const isSavedNow = savedIds.includes(matchId);
      triggerToast(
        isSavedNow
          ? "⭐ Candidate added to your Saved Portfolios!"
          : "🗑️ Portfolio bookmark removed."
      );
    } catch (err) {
      console.error("Failed toggling save candidates", err);
    }
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  };

  // Profile strength indicator
  const calculateProfileStrength = (): number => {
    if (!userProfile) return 0;
    let score = 0;
    if (userProfile.name) score += 15;
    if (userProfile.age > 0) score += 15;
    if (userProfile.religion && userProfile.ethnicity && userProfile.country) score += 20;
    if (userProfile.profession && userProfile.education) score += 20;
    if (userProfile.languages.length > 0) score += 15;
    if (userProfile.values.length > 0) score += 15;
    return score;
  };

  // Onboarding wizard completion
  const handleOnboardingComplete = async (updatedProfile: UserProfile) => {
    try {
      const saved = await mockApi.updateCurrentUserProfile(updatedProfile);
      setUserProfile(saved);
      triggerToast(`✨ Congratulations! Your halal introduction is sealed. Compatibility pool updated!`);
      setTab('explore');
    } catch (err) {
      console.error("Failed to complete onboarding", err);
    }
  };

  // Direct profile/privacy/nesting changes from screens
  const handleUpdateUserProfile = async (updatedValues: Partial<UserProfile>) => {
    if (!userProfile) return;
    try {
      const saved = await mockApi.updateCurrentUserProfile(updatedValues);
      setUserProfile(saved);
    } catch (err) {
      console.error("Failed to update profile values", err);
    }
  };

  // Send request with simulation response
  const handleSendRequest = async (matchId: string) => {
    try {
      await mockApi.sendIntroductionRequest(matchId);
      // Reload matches list immediately to show "pending" state
      const updatedMatches = await mockApi.getMatches();
      setMatches(updatedMatches);
      triggerToast(`✉️ Introduction request sent securely. Acknowledging respect rules...`);

      // Trigger auto-approval response simulation
      setTimeout(async () => {
        try {
          const { match } = await mockApi.acceptIntroductionRequest(matchId);
          // Reload matches & conversations list immediately
          const [updatedMatchesList, updatedConvs] = await Promise.all([
            mockApi.getMatches(),
            mockApi.getConversations()
          ]);
          setMatches(updatedMatchesList);
          setConversations(updatedConvs);
          triggerToast(`🎉 Mutual interest! ${match.name} accepted your request. Chat unlocked! 🔓`);
        } catch (simErr) {
          console.error("Failed simulator auto-approval", simErr);
        }
      }, 2800);

    } catch (err) {
      console.error("Failed to send introduction request", err);
    }
  };

  // Quick navigation into deep Chat
  const handleInitiateChat = (matchId: string) => {
    setActiveMatchId(matchId);
    setTab('chat');
  };

  // Send message API mapping
  const handleSendMessage = async (matchId: string, text: string, sender: 'user' | 'match') => {
    try {
      await mockApi.sendMessage(matchId, text, sender);
      const updatedConvs = await mockApi.getConversations();
      setConversations(updatedConvs);
    } catch (err) {
      console.error("Failed to dispatch chat log message", err);
    }
  };

  if (!userProfile) {
    return (
      <div className="bg-warm-ivory min-h-screen flex items-center justify-center">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-accent-coral rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-3 h-3 bg-accent-pink rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-3 h-3 bg-[#40798C] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    );
  }

  const profileStrength = calculateProfileStrength();
  const acceptedMatches = matches.filter(m => m.requestStatus === 'accepted');

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

      {/* Header bar component */}
      <Header
        currentTab={currentTab}
        setTab={setTab}
        profileStrength={profileStrength}
        userProfileName={userProfile.name}
        locale={locale}
        setLocale={setLocale}
        isAdmin={userProfile?.email?.trim().toLowerCase() === 'safaribosafar@gmail.com' || localStorage.getItem('simulate_admin') === 'true'}
        heroImages={heroImages}
      />

      {/* Primary switcher layout */}
      <main className="flex-grow">
        {currentTab === 'landing' && (
          <LandingScreen
            locale={locale}
            onSelectGender={async (gender) => {
              const updatedProfile = {
                ...userProfile,
                gender,
                photoPrivacy: gender === 'female' ? 'hidden_by_default' : 'visible' as const
              };
              await handleUpdateUserProfile(updatedProfile);
              triggerToast(
                locale === 'en' 
                  ? `✨ Gender set to ${gender}. Let's fill out your parameters!` 
                  : locale === 'ckb'
                    ? `✨ ڕەگەز دیاریکرا بە ${gender === 'male' ? 'نێر' : 'مێ'}. با دەست پێ بکەین!`
                    : `✨ تم تحديد الجنس كـ ${gender === 'male' ? 'ذكر' : 'أنثى'}. فلنبدأ!`
              );
              setTab('onboarding');
            }}
            onExploreMatches={() => setTab('explore')}
            setTab={setTab}
          />
        )}

        {currentTab === 'onboarding' && (
          <OnboardingScreen
            locale={locale}
            userProfile={userProfile}
            onComplete={handleOnboardingComplete}
          />
        )}

        {currentTab === 'explore' && (
          <MatchExplorerScreen
            locale={locale}
            matches={matches}
            onSendRequest={handleSendRequest}
            onInitiateChat={handleInitiateChat}
            userGender={userProfile.gender}
            userGovernorate={userProfile.governorate}
            savedMatchIds={savedMatchIds}
            onToggleSaveMatch={handleToggleSaveMatch}
          />
        )}

        {currentTab === 'chat' && (
          <ChatScreen
            locale={locale}
            acceptedMatches={acceptedMatches}
            conversations={conversations}
            onSendMessage={handleSendMessage}
            activeMatchId={activeMatchId}
            setActiveMatchId={setActiveMatchId}
          />
        )}

        {currentTab === 'profile' && (
          <ProfilePreviewScreen
            locale={locale}
            profile={userProfile}
            profileStrength={profileStrength}
            onEditClick={() => setTab('onboarding')}
          />
        )}

        {currentTab === 'privacy' && (
          <PrivacySettingsScreen
            locale={locale}
            profile={userProfile}
            onUpdatePrivacy={handleUpdateUserProfile}
            triggerToast={triggerToast}
          />
        )}

        {currentTab === 'account' && (
          <AccountPlaceholderScreen
            locale={locale}
            userName={userProfile.name}
            triggerToast={triggerToast}
          />
        )}

        {currentTab === 'trust_safety' && (
          <TrustPrivacyScreen
            locale={locale}
            onBackToOverview={() => setTab('landing')}
          />
        )}

        {currentTab === 'community' && (
          <CommunityFeed
            locale={locale}
            currentEmail={userProfile.email}
            currentUserProfile={{ name: userProfile.name || 'Respected Member', gender: userProfile.gender }}
            triggerToast={triggerToast}
          />
        )}

        {currentTab === 'admin' && (
          <AdminPanel
            locale={locale}
            currentEmail={userProfile.email}
            triggerToast={triggerToast}
            onRefreshHero={loadHeroImages}
          />
        )}
      </main>

      {/* PERSISTENT FOOTER */}
      <footer className="bg-warm-charcoal text-[#C3BFB9] py-12 border-t border-white/10 relative z-10 text-start">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-white/10">
            
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
              <h5 className="text-white text-xs font-bold uppercase tracking-widest font-mono">App Mission</h5>
              <p className="text-xs text-[#C3BFB9]/80 leading-relaxed font-normal">
                HALAL is designed for serious people seeking marriage with privacy, dignity, and mutual respect.
              </p>
            </div>

          </div>

          {/* Copyrights and meta */}
          <div className="flex flex-col sm:flex-row justify-between items-center pt-8 text-xs font-medium">
            <p>{t.copyright}</p>
            <div className="flex flex-wrap gap-4 mt-4 sm:mt-0 justify-center items-center">
              <button 
                onClick={() => setTab('trust_safety')} 
                className="hover:text-white transition font-extrabold underline decoration-accent-coral decoration-2 underline-offset-4 flex items-center gap-1 text-xs"
              >
                🛡️ {locale === 'en' ? 'Trust & Privacy Center' : locale === 'ar' ? 'مركز الأمان والموثوقية' : 'ڕێبەری ئاسایش ومتمانە'}
              </button>
              <span>•</span>
              <button onClick={() => setTab('privacy')} className="hover:text-white transition">{t.privacyPolicy}</button>
              <span>•</span>
              <button onClick={() => setTab('account')} className="hover:text-white transition">{t.idVerify}</button>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
