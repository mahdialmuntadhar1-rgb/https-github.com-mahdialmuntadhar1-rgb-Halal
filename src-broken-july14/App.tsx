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
import MarriageCafeFeed from './components/MarriageCafeFeed';
import AdminPanel from './components/AdminPanel';
import AuthScreen from './screens/AuthScreen';
import Postbox from './components/Postbox';
import GenderSelectionScreen from './screens/GenderSelectionScreen';
import FloatingInstallButton from './components/FloatingInstallButton';
import { useLocale } from './hooks/useLocale';
import { apiClient } from './services/apiClient';
import { Sparkles, Check, Heart, Home, Compass, MessageCircle, User, Inbox } from 'lucide-react';
import { HeroImage, AppTab } from './types';

export default function App() {
  const { locale, setLocale, t } = useLocale('ar');
  const [currentTab, setTab] = useState<AppTab>('landing');

  // Async States
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoadingSession, setIsLoadingSession] = useState<boolean>(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [savedMatchIds, setSavedMatchIds] = useState<string[]>([]);
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [matches, setMatches] = useState<MatchProfile[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeMatchId, setActiveMatchId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [preselectedGender, setPreselectedGender] = useState<'male' | 'female' | null>(null);

  // Load Slideshow photos
  const loadHeroImages = async () => {
    try {
      const imgs = await apiClient.getHeroImages();
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
      setIsLoadingSession(true);
      const token = localStorage.getItem('halal_token');
      try {
        await loadHeroImages();
        if (token) {
          const [rawProfile, matchesResult, convs] = await Promise.all([
            apiClient.getCurrentUser(),
            apiClient.getMatches(),
            apiClient.getConversations()
          ]);
          const profile = {
            ...rawProfile,
            name: rawProfile.name || '',
            age: rawProfile.age || 18,
            languages: rawProfile.languages || [],
            values: rawProfile.values || [],
            country: rawProfile.country || 'Iraq',
            governorate: rawProfile.governorate || '',
            religion: rawProfile.religion || '',
            ethnicity: rawProfile.ethnicity || '',
            education: rawProfile.education || '',
            profession: rawProfile.profession || '',
            photoPrivacy: rawProfile.photoPrivacy || 'visible',
            savedMatches: rawProfile.savedMatches || [],
          };
          setUserProfile(profile);
          setIsAuthenticated(true);
          setMatches(matchesResult.matches);
          setConversations(convs);

          // Route initial loaded user appropriately based on profile completeness
          if (!profile.gender) {
            setTab('gender-selection');
          } else if (!profile.education || !profile.profession || !profile.values || profile.values.length === 0) {
            setTab('onboarding');
          } else {
            setTab('explore');
          }
        } else {
          setIsAuthenticated(false);
          setUserProfile(null);
        }
      } catch (err) {
        console.error("Failed to load initial data", err);
        if (token) {
          localStorage.removeItem('halal_token');
        }
        setIsAuthenticated(false);
        setUserProfile(null);
      } finally {
        setIsLoadingSession(false);
      }
    }
    loadData();
  }, []);

  const handleAuthSuccess = async (token: string, profile: UserProfile) => {
    setIsLoadingSession(true);
    localStorage.setItem('halal_token', token);
    try {
      let currentProfile = profile;
      currentProfile = {
        ...currentProfile,
        name: currentProfile.name || '',
        age: currentProfile.age || 18,
        languages: currentProfile.languages || [],
        values: currentProfile.values || [],
        country: currentProfile.country || 'Iraq',
        governorate: currentProfile.governorate || '',
        religion: currentProfile.religion || '',
        ethnicity: currentProfile.ethnicity || '',
        education: currentProfile.education || '',
        profession: currentProfile.profession || '',
        photoPrivacy: currentProfile.photoPrivacy || 'visible',
        savedMatches: currentProfile.savedMatches || [],
      };
      if (preselectedGender) {
        try {
          const updated = {
            ...profile,
            gender: preselectedGender,
            photoPrivacy: preselectedGender === 'female' ? ('hidden_by_default' as const) : ('visible' as const)
          };
          currentProfile = await apiClient.updateCurrentUserProfile(updated);
          setPreselectedGender(null); // Clear it
        } catch (err) {
          console.error("Failed to update preselected gender", err);
        }
      }

      setUserProfile(currentProfile);
      setIsAuthenticated(true);
      const [matchesResult, convs] = await Promise.all([
        apiClient.getMatches(),
        apiClient.getConversations()
      ]);
      setMatches(matchesResult.matches);
      setConversations(convs);
      
      // Route user correctly: registration, login, and onboarding are united as a single flow
      if (!currentProfile.gender) {
        setTab('gender-selection');
      } else if (!currentProfile.education || !currentProfile.profession || !currentProfile.values || currentProfile.values.length === 0) {
        setTab('onboarding');
      } else {
        setTab('explore');
      }
    } catch (err) {
      console.error("Failed loading data after auth", err);
    } finally {
      setIsLoadingSession(false);
    }
  };

  const handleSelectGenderInScreen = async (gender: 'male' | 'female') => {
    if (!userProfile) return;
    try {
      const updatedProfile = {
        ...userProfile,
        gender,
        photoPrivacy: gender === 'female' ? ('hidden_by_default' as const) : ('visible' as const)
      };
      const saved = await apiClient.updateCurrentUserProfile(updatedProfile);
      setUserProfile(saved);
      triggerToast(
        locale === 'en'
          ? `âœ¨ Gender set to ${gender}. Let's fill out your parameters!`
          : locale === 'ckb'
            ? `âœ¨ Ú•Û•Ú¯Û•Ø² Ø¯ÛŒØ§Ø±ÛŒÚ©Ø±Ø§ Ø¨Û• ${gender === 'male' ? 'Ù†ÛŽØ±' : 'Ù…ÛŽ'}. Ø¨Ø§ Ø¯Û•Ø³Øª Ù¾ÛŽ Ø¨Ú©Û•ÛŒÙ†!`
            : `âœ¨ ØªÙ… ØªØ­Ø¯ÙŠØ¯ Ø§Ù„Ø¬Ù†Ø³ ÙƒÙ€ ${gender === 'male' ? 'Ø°ÙƒØ±' : 'Ø£Ù†Ø«Ù‰'}. ÙÙ„Ù†Ø¨Ø¯Ø£!`
      );
      setTab('onboarding');
    } catch (err) {
      console.error("Failed to update gender", err);
    }
  };

  const handleLogout = async () => {
    setIsLoadingSession(true);
    try {
      await apiClient.logout();
    } catch (err) {
      console.error(err);
    } finally {
      setIsAuthenticated(false);
      setUserProfile(null);
      setMatches([]);
      setConversations([]);
      setTab('landing');
      setIsLoadingSession(false);
      triggerToast("ðŸšª Logged out securely. Come back soon!");
    }
  };

  // Bookmark Toggler
  const handleToggleSaveMatch = async (matchId: string) => {
    try {
      const updatedUser = await apiClient.toggleSaveProfile(matchId);
      setUserProfile(updatedUser);
      const savedIds = updatedUser.savedMatches || [];
      setSavedMatchIds(savedIds);
      
      const isSavedNow = savedIds.includes(matchId);
      triggerToast(
        isSavedNow
          ? "â­ Candidate added to your Saved Portfolios!"
          : "ðŸ—‘ï¸ Portfolio bookmark removed."
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
      setIsAuthenticated(true);
      setUserProfile(updatedProfile);

      // Load matching pool
      const [matchesResult, convs] = await Promise.all([
        apiClient.getMatches(),
        apiClient.getConversations()
      ]);
      setMatches(matchesResult.matches);
      setConversations(convs);

      triggerToast(
        locale === 'en'
          ? `âœ¨ Congratulations! Your halal introduction is sealed. Compatibility pool updated!`
          : `âœ¨ Ù…Ø¨Ø§Ø±Ùƒ! ØªÙ… ØªÙˆØ«ÙŠÙ‚ Ø­Ø³Ø§Ø¨Ùƒ ÙˆØ±Ø¨Ø·Ù‡ Ø¨Ø¨ÙŠØ§Ù†Ø§Øª Ø§Ù„Ø´Ø±ÙƒØ§Ø¡ Ø§Ù„Ù…ØªÙˆØ§ÙÙ‚ÙŠÙ† ÙÙŠ Ø§Ù„Ø¹Ø±Ø§Ù‚!`
      );
      setTab('explore');
    } catch (err) {
      console.error("Failed to complete onboarding", err);
    }
  };

  // Direct profile/privacy/nesting changes from screens
  const handleUpdateUserProfile = async (updatedValues: Partial<UserProfile>) => {
    if (!userProfile) return;
    try {
      const saved = await apiClient.updateCurrentUserProfile(updatedValues);
      setUserProfile(saved);
    } catch (err) {
      console.error("Failed to update profile values", err);
    }
  };

  // Send request with simulation response
  const handleSendRequest = async (matchId: string) => {
    try {
      await apiClient.sendIntroductionRequest(matchId);
      // Reload matches list immediately to show "pending" state
      const updatedMatchesRes = await apiClient.getMatches();
      setMatches(updatedMatchesRes.matches);
      triggerToast(`âœ‰ï¸ Introduction request sent securely. Acknowledging respect rules...`);

      // Trigger auto-approval response simulation
      setTimeout(async () => {
        try {
          const { match } = await apiClient.acceptIntroductionRequest(matchId);
          // Reload matches & conversations list immediately
          const [updatedMatchesListRes, updatedConvs] = await Promise.all([
            apiClient.getMatches(),
            apiClient.getConversations()
          ]);
          setMatches(updatedMatchesListRes.matches);
          setConversations(updatedConvs);
          triggerToast(`ðŸŽ‰ Mutual interest! ${match.name} accepted your request. Chat unlocked! ðŸ”“`);
        } catch (simErr) {
          console.error("Failed simulator auto-approval", simErr);
        }
      }, 2800);

    } catch (err) {
      console.error("Failed to send introduction request", err);
    }
  };

  const handleAcceptRequest = async (matchId: string) => {
    try {
      await apiClient.acceptIntroductionRequest(matchId);
      const [updatedMatchesListRes, updatedConvs] = await Promise.all([
        apiClient.getMatches(),
        apiClient.getConversations()
      ]);
      setMatches(updatedMatchesListRes.matches);
      setConversations(updatedConvs);
    } catch (err) {
      console.error("Failed to accept proposal request", err);
    }
  };

  const handleDeclineRequest = async (matchId: string) => {
    try {
      await apiClient.declineIntroductionRequest(matchId);
      const updatedMatchesListRes = await apiClient.getMatches();
      setMatches(updatedMatchesListRes.matches);
    } catch (err) {
      console.error("Failed to decline proposal request", err);
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
      await apiClient.sendMessage(matchId, text, sender);
      const updatedConvs = await apiClient.getConversations();
      setConversations(updatedConvs);
    } catch (err) {
      console.error("Failed to dispatch chat log message", err);
    }
  };

  if (isLoadingSession) {
    return (
      <div className="bg-warm-ivory min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-accent-coral rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-3 h-3 bg-accent-pink rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-3 h-3 bg-[#40798C] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <p className="text-xs font-serif font-black tracking-widest text-[#6B635B] animate-pulse uppercase">
            {locale === 'en' ? 'Verifying Sincere Connection...' : locale === 'ar' ? 'Ø¬Ø§Ø±ÙŠ Ø§Ù„ØªØ­Ù‚Ù‚ Ù…Ù† Ø§Ù„Ø§ØªØµØ§Ù„ Ø§Ù„Ø¢Ù…Ù†...' : 'Ù¾ÛŽØ¯Ø§Ú†ÙˆÙˆÙ†Û•ÙˆÛ• Ø¨Û• Ù¾Û•ÛŒÙˆÛ•Ù†Ø¯ÛŒ Ù¾Ø§Ø±ÛŽØ²Ø±Ø§Ùˆ...'}
          </p>
        </div>
      </div>
    );
  }

  const profileStrength = calculateProfileStrength();
  const acceptedMatches = matches.filter(m => m.requestStatus === 'accepted');
  const isProtectedTab = ['explore', 'chat', 'profile', 'privacy', 'account', 'community', 'admin', 'onboarding', 'gender-selection'].includes(currentTab);

  return (
    <div 
      dir={t.dir} 
      lang={locale} 
      className="bg-warm-ivory min-h-screen text-warm-charcoal font-sans flex flex-col justify-between selection:bg-accent-coral/20 selection:text-accent-coral relative overflow-x-hidden pb-20 sm:pb-24"
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
        userProfileName={userProfile ? userProfile.name : undefined}
        locale={locale}
        setLocale={setLocale}
        isAdmin={userProfile?.role === 'admin'}
        heroImages={heroImages}
        onLogout={isAuthenticated ? handleLogout : undefined}
        onLoginClick={() => setTab('explore')}
      />
      {/* Primary switcher layout */}
      <main className="flex-grow">
        {isProtectedTab && !isAuthenticated ? (
          <AuthScreen
            locale={locale}
            onAuthSuccess={handleAuthSuccess}
            triggerToast={triggerToast}
          />
        ) : (
          <>
            {currentTab === 'gender-selection' && (
              <GenderSelectionScreen
                locale={locale}
                onSelectGender={handleSelectGenderInScreen}
              />
            )}

            {currentTab === 'landing' && (
              <LandingScreen
                locale={locale}
                onSelectGender={async (gender) => {
                  if (!isAuthenticated || !userProfile) {
                    setPreselectedGender(gender);
                    triggerToast(
                      locale === 'en' 
                        ? `ðŸ’ Gender set to ${gender === 'male' ? 'Groom' : 'Bride'}. Please create your account or log in to proceed!` 
                        : locale === 'ckb'
                          ? `ðŸ’ Ú•Û•Ú¯Û•Ø² Ø¯ÛŒØ§Ø±ÛŒÚ©Ø±Ø§ Ø¨Û• ${gender === 'male' ? 'Ø²Ø§ÙˆØ§' : 'Ø¨ÙˆÙˆÚ©'}. ØªÚ©Ø§ÛŒÛ• Ø¨Û† Ø¨Û•Ø±Ø¯Û•ÙˆØ§Ù…Ø¨ÙˆÙˆÙ† Ù¾Ú•Û†ÙØ§ÛŒÙ„Û•Ú©Û•Øª Ø¯Ø±ÙˆØ³Øª Ø¨Ú©Û• ÛŒØ§Ù† Ø¨Ú†Û† Ú˜ÙˆÙˆØ±Û•ÙˆÛ•!`
                          : `ðŸ’ ØªÙ… ØªØ­Ø¯ÙŠØ¯ Ø§Ù„Ø¬Ù†Ø³ ÙƒÙ€ ${gender === 'male' ? 'Ø¹Ø±ÙŠØ³' : 'Ø¹Ø±ÙˆØ³Ø©'}. ÙŠØ±Ø¬Ù‰ Ø¥Ù†Ø´Ø§Ø¡ Ø­Ø³Ø§Ø¨Ùƒ Ø£Ùˆ ØªØ³Ø¬ÙŠÙ„ Ø§Ù„Ø¯Ø®ÙˆÙ„ Ù„Ù„Ù…ØªØ§Ø¨Ø¹Ø©!`
                    );
                    setTab('onboarding');
                    return;
                  }
                  const updatedProfile = {
                    ...userProfile,
                    gender,
                    photoPrivacy: gender === 'female' ? 'hidden_by_default' : 'visible' as const
                  };
                  await handleUpdateUserProfile(updatedProfile);
                  triggerToast(
                    locale === 'en' 
                      ? `âœ¨ Gender set to ${gender}. Let's fill out your parameters!` 
                      : locale === 'ckb'
                        ? `âœ¨ Ú•Û•Ú¯Û•Ø² Ø¯ÛŒØ§Ø±ÛŒÚ©Ø±Ø§ Ø¨Û• ${gender === 'male' ? 'Ù†ÛŽØ±' : 'Ù…ÛŽ'}. Ø¨Ø§ Ø¯Û•Ø³Øª Ù¾ÛŽ Ø¨Ú©Û•ÛŒÙ†!`
                        : `âœ¨ ØªÙ… ØªØ­Ø¯ÙŠØ¯ Ø§Ù„Ø¬Ù†Ø³ ÙƒÙ€ ${gender === 'male' ? 'Ø°ÙƒØ±' : 'Ø£Ù†Ø«Ù‰'}. ÙÙ„Ù†Ø¨Ø¯Ø£!`
                  );
                  setTab('onboarding');
                }}
                onExploreMatches={() => setTab('landing')}
                setTab={setTab}
                isAuthenticated={isAuthenticated}
                userProfileName={userProfile?.name}
                userProfile={userProfile || undefined}
                preSelectedGender={preselectedGender}
              />
            )}

            {currentTab === 'onboarding' && (
              <OnboardingScreen
                locale={locale}
                userProfile={userProfile || {
                  name: '',
                  age: 24,
                  gender: preselectedGender || 'male',
                  country: 'Iraq',
                  governorate: 'Baghdad',
                  religion: 'islam',
                  ethnicity: 'arab',
                  education: "Bachelor Degree",
                  profession: 'Professional',
                  languages: ['Arabic'],
                  photoPrivacy: preselectedGender === 'female' ? 'hidden_by_default' : 'visible',
                  values: ['Family First', 'Mutual Respect']
                }}
                onComplete={handleOnboardingComplete}
              />
            )}

            {currentTab === 'explore' && userProfile && (
              <MatchExplorerScreen
                locale={locale}
                matches={matches}
                onSendRequest={handleSendRequest}
                onInitiateChat={handleInitiateChat}
                userGender={userProfile.gender}
                userGovernorate={userProfile.governorate}
                savedMatchIds={savedMatchIds}
                onToggleSaveMatch={handleToggleSaveMatch}
                userProfile={userProfile}
                onUpdateUserProfile={handleUpdateUserProfile}
                onNavigateToTab={setTab}
              />
            )}

            {currentTab === 'postcards' && userProfile && (
              <Postbox
                locale={locale}
                userProfile={userProfile}
                matches={matches}
                onAcceptRequest={handleAcceptRequest}
                onDeclineRequest={handleDeclineRequest}
                triggerToast={triggerToast}
                onNavigateToTab={setTab}
              />
            )}

            {currentTab === 'chat' && userProfile && (
              <ChatScreen
                locale={locale}
                acceptedMatches={acceptedMatches}
                conversations={conversations}
                onSendMessage={handleSendMessage}
                activeMatchId={activeMatchId}
                setActiveMatchId={setActiveMatchId}
              />
            )}

            {currentTab === 'profile' && userProfile && (
              <ProfilePreviewScreen
                locale={locale}
                profile={userProfile}
                profileStrength={profileStrength}
                onSaveProfile={handleUpdateUserProfile}
                triggerToast={triggerToast}
              />
            )}

            {currentTab === 'privacy' && userProfile && (
              <PrivacySettingsScreen
                locale={locale}
                profile={userProfile}
                onUpdatePrivacy={handleUpdateUserProfile}
                triggerToast={triggerToast}
              />
            )}

            {currentTab === 'account' && userProfile && (
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

            {currentTab === 'community' && userProfile && (
              <MarriageCafeFeed
                locale={locale}
                userProfile={userProfile}
                triggerToast={triggerToast}
              />
            )}

            {currentTab === 'admin' && userProfile && (
              <AdminPanel
                locale={locale}
                currentEmail={userProfile.email}
                triggerToast={triggerToast}
                onRefreshHero={loadHeroImages}
              />
            )}
          </>
        )}
      </main>

      {/* PERSISTENT FOOTER */}
      <footer className="bg-warm-charcoal text-[#C3BFB9] py-12 border-t border-white/10 relative z-10 text-start">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-white/10">
            
            {/* Branding */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center space-x-2.5">
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
                  <button onClick={() => setTab('landing')} className="hover:text-white transition">{t.explore}</button>
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
                ðŸ›¡ï¸ {locale === 'en' ? 'Trust & Privacy Center' : locale === 'ar' ? 'Ù…Ø±ÙƒØ² Ø§Ù„Ø£Ù…Ø§Ù† ÙˆØ§Ù„Ù…ÙˆØ«ÙˆÙ‚ÙŠØ©' : 'Ú•ÛŽØ¨Û•Ø±ÛŒ Ø¦Ø§Ø³Ø§ÛŒØ´ ÙˆÙ…ØªÙ…Ø§Ù†Û•'}
              </button>
              <span>â€¢</span>
              <button onClick={() => setTab('privacy')} className="hover:text-white transition">{t.privacyPolicy}</button>
              <span>â€¢</span>
              <button onClick={() => setTab('account')} className="hover:text-white transition">{t.idVerify}</button>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating PWA Install Button for mobile users */}
      <FloatingInstallButton locale={locale} />

      {/* PERSISTENT BOTTOM TASKBAR */}
      <div 
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md bg-white/95 backdrop-blur-md border border-[#EBE6DD]/60 rounded-2xl shadow-xl px-2 py-2 flex items-center justify-around animate-slide-in"
        id="bottom-navigation-taskbar"
      >
        {/* Home Option */}
        <button
          onClick={() => setTab('landing')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 ${
            currentTab === 'landing' 
              ? 'text-accent-coral scale-105 font-extrabold' 
              : 'text-[#6B635B] hover:text-[#40798C] hover:bg-warm-ivory/40'
          }`}
          id="taskbar-home-btn"
        >
          <Home className={`w-5 h-5 mb-0.5 transition-transform duration-200 ${currentTab === 'landing' ? 'scale-110' : ''}`} />
          <span className="text-[10px] sm:text-xs tracking-tight">{t.overview}</span>
        </button>

        {/* Partner Exploration Option */}
        <button
          onClick={() => setTab('landing')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 ${
            currentTab === 'explore' 
              ? 'text-accent-coral scale-105 font-extrabold' 
              : 'text-[#6B635B] hover:text-[#40798C] hover:bg-warm-ivory/40'
          }`}
          id="taskbar-explore-btn"
        >
          <Compass className={`w-5 h-5 mb-0.5 transition-transform duration-200 ${currentTab === 'explore' ? 'scale-110' : ''}`} />
          <span className="text-[10px] sm:text-xs tracking-tight">{t.explore}</span>
        </button>

        {/* Chat Option */}
        <button
          onClick={() => {
            if (!isAuthenticated) {
              triggerToast(
                locale === 'en' 
                  ? 'ðŸ’ Please log in or create an account to view and chat with matches.' 
                  : 'ðŸ’ ÙŠØ±Ø¬Ù‰ ØªØ³Ø¬ÙŠÙ„ Ø§Ù„Ø¯Ø®ÙˆÙ„ Ø£ÙˆÙ„Ø§Ù‹ Ù„ØªØµÙØ­ ÙˆØ§Ù„Ø¯Ø±Ø¯Ø´Ø© Ù…Ø¹ Ø´Ø±ÙƒØ§Ø¡ Ø§Ù„ØªÙˆØ§ÙÙ‚.'
              );
              setTab('onboarding');
            } else {
              setTab('chat');
            }
          }}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 ${
            currentTab === 'chat' 
              ? 'text-accent-coral scale-105 font-extrabold' 
              : 'text-[#6B635B] hover:text-[#40798C] hover:bg-warm-ivory/40'
          }`}
          id="taskbar-chat-btn"
        >
          <div className="relative">
            <MessageCircle className={`w-5 h-5 mb-0.5 transition-transform duration-200 ${currentTab === 'chat' ? 'scale-110' : ''}`} />
            {isAuthenticated && conversations.some(c => c.unreadCount && c.unreadCount > 0) && (
              <span className="absolute -top-1 -right-1 bg-accent-coral w-2.5 h-2.5 rounded-full ring-2 ring-white animate-pulse" />
            )}
          </div>
          <span className="text-[10px] sm:text-xs tracking-tight">{t.chat}</span>
        </button>

        {/* Postbox Option */}
        <button
          onClick={() => {
            if (!isAuthenticated) {
              triggerToast(
                locale === 'en' 
                  ? 'ðŸ’ Please log in to view received postcards.' 
                  : 'ðŸ’ ÙŠØ±Ø¬Ù‰ ØªØ³Ø¬ÙŠÙ„ Ø§Ù„Ø¯Ø®ÙˆÙ„ Ø£ÙˆÙ„Ø§Ù‹ Ù„ØªØµÙØ­ Ø§Ù„Ø±Ø³Ø§Ø¦Ù„ ÙˆØ§Ù„Ø¨Ø·Ø§Ù‚Ø§Øª Ø§Ù„Ø¨Ø±ÙŠØ¯ÙŠØ©.'
              );
              setTab('onboarding');
            } else {
              setTab('postcards');
            }
          }}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 ${
            currentTab === 'postcards' 
              ? 'text-accent-coral scale-105 font-extrabold' 
              : 'text-[#6B635B] hover:text-[#40798C] hover:bg-warm-ivory/40'
          }`}
          id="taskbar-postcards-btn"
        >
          <div className="relative">
            <Inbox className={`w-5 h-5 mb-0.5 transition-transform duration-200 ${currentTab === 'postcards' ? 'scale-110' : ''}`} />
          </div>
          <span className="text-[10px] sm:text-xs tracking-tight">
            {locale === 'en' ? 'Postbox' : locale === 'ar' ? 'ØµÙ†Ø¯ÙˆÙ‚ÙŠ' : 'Ø³Ù†Ø¯ÙˆÙ‚ÛŒ Ù¾Û†Ø³ØªÛ•'}
          </span>
        </button>

        {/* My Dossier Option */}
        <button
          onClick={() => {
            if (!isAuthenticated) {
              triggerToast(
                locale === 'en' 
                  ? 'ðŸ’ Please sign in to view your profile dossier.' 
                  : 'ðŸ’ ÙŠØ±Ø¬Ù‰ ØªØ³Ø¬ÙŠÙ„ Ø§Ù„Ø¯Ø®ÙˆÙ„ Ù„Ø¹Ø±Ø¶ ÙˆØªØ¹Ø¯ÙŠÙ„ Ù…Ù„ÙÙƒ Ø§Ù„ØªØ¹Ø±ÙŠÙÙŠ.'
              );
              setTab('onboarding');
            } else {
              setTab('profile');
            }
          }}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 ${
            currentTab === 'profile' 
              ? 'text-accent-coral scale-105 font-extrabold' 
              : 'text-[#6B635B] hover:text-[#40798C] hover:bg-warm-ivory/40'
          }`}
          id="taskbar-profile-btn"
        >
          <User className={`w-5 h-5 mb-0.5 transition-transform duration-200 ${currentTab === 'profile' ? 'scale-110' : ''}`} />
          <span className="text-[10px] sm:text-xs tracking-tight">
            {locale === 'en' ? 'My Profile' : locale === 'ar' ? 'Ù…Ù„ÙÙŠ' : 'Ù¾Ú•Û†ÙØ§ÛŒÙ„Ù…'}
          </span>
        </button>
      </div>

    </div>
  );
}


