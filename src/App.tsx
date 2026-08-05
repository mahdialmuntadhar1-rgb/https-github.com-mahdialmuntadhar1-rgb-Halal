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
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'register'>('login');

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
          const [profile, matchesResult, convs] = await Promise.all([
            apiClient.getCurrentUser(),
            apiClient.getMatches(),
            apiClient.getConversations()
          ]);
          setUserProfile(profile);
          setIsAuthenticated(true);
          setMatches(matchesResult.matches);
          setConversations(convs);

          // Route initial loaded user appropriately - allow full explore access
          setTab('explore');
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
      
      // Route user correctly: registration and login are separate from onboarding now
      setTab('explore');
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
          ? `✨ Gender set to ${gender}. Let's fill out your parameters!`
          : locale === 'ckb'
            ? `✨ ڕەگەز دیاریکرا بە ${gender === 'male' ? 'نێر' : 'مێ'}. با دەست پێ بکەین!`
            : `✨ تم تحديد الجنس كـ ${gender === 'male' ? 'ذكر' : 'أنثى'}. فلنبدأ!`
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
      triggerToast("🚪 Logged out securely. Come back soon!");
    }
  };

  const handleDeleteAccount = async () => {
    await apiClient.deleteAccount();
    setIsAuthenticated(false);
    setUserProfile(null);
    setMatches([]);
    setConversations([]);
    setSavedMatchIds([]);
    setTab('landing');
    triggerToast(
      locale === 'en'
        ? 'Your account has been permanently deleted.'
        : 'تم حذف حسابك نهائياً.'
    );
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
    if (userProfile.languages?.length > 0) score += 15;
    if (userProfile.values?.length > 0) score += 15;
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
          ? `✨ Congratulations! Your halal introduction is sealed. Compatibility pool updated!`
          : `✨ مبارك! تم توثيق حسابك وربطه ببيانات الشركاء المتوافقين في العراق!`
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

  // Send introduction request and leave status pending until the receiver responds
  const handleSendRequest = async (matchId: string) => {
    try {
      await apiClient.sendIntroductionRequest(matchId);
      // Reload matches list immediately to show "pending" state
      const updatedMatchesRes = await apiClient.getMatches();
      setMatches(updatedMatchesRes.matches);
      triggerToast(`✉️ Introduction request sent securely. Awaiting their respectful response.`);
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
      throw err;
    }
  };

  const handleDeclineRequest = async (matchId: string) => {
    try {
      await apiClient.declineIntroductionRequest(matchId);
      const updatedMatchesListRes = await apiClient.getMatches();
      setMatches(updatedMatchesListRes.matches);
    } catch (err) {
      console.error("Failed to decline proposal request", err);
      throw err;
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
            {locale === 'en' ? 'Verifying Sincere Connection...' : locale === 'ar' ? 'جاري التحقق من الاتصال الآمن...' : 'پێداچوونەوە بە پەیوەندی پارێزراو...'}
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
      className="bg-warm-ivory min-h-screen text-warm-charcoal font-sans flex flex-col justify-between selection:bg-accent-coral/20 selection:text-accent-coral relative overflow-hidden pb-20 sm:pb-24"
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
        isAuthenticated={isAuthenticated}
        locale={locale}
        setLocale={setLocale}
        isAdmin={userProfile?.role === 'admin'}
        heroImages={heroImages}
        onLogout={isAuthenticated ? handleLogout : undefined}
        onRequestAuth={(mode) => {
          setAuthInitialMode(mode);
          setTab('onboarding');
        }}
      />

      {/* Primary switcher layout */}
      <main className="flex-grow">
        {isProtectedTab && !isAuthenticated ? (
          <AuthScreen
            locale={locale}
            onAuthSuccess={handleAuthSuccess}
            triggerToast={triggerToast}
            initialMode={authInitialMode}
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
                        ? `💍 Gender set to ${gender === 'male' ? 'Groom' : 'Bride'}. Please create your account or log in to proceed!` 
                        : locale === 'ckb'
                          ? `💍 ڕەگەز دیاریکرا بە ${gender === 'male' ? 'زاوا' : 'بووک'}. تکایە بۆ بەردەوامبوون پڕۆفایلەکەت دروست بکە یان بچۆ ژوورەوە!`
                          : `💍 تم تحديد الجنس كـ ${gender === 'male' ? 'عريس' : 'عروسة'}. يرجى إنشاء حسابك أو تسجيل الدخول للمتابعة!`
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
                      ? `✨ Gender set to ${gender}. Let's fill out your parameters!` 
                      : locale === 'ckb'
                        ? `✨ ڕەگەز دیاریکرا بە ${gender === 'male' ? 'نێر' : 'مێ'}. با دەست پێ بکەین!`
                        : `✨ تم تحديد الجنس كـ ${gender === 'male' ? 'ذكر' : 'أنثى'}. فلنبدأ!`
                  );
                  setTab('onboarding');
                }}
                onExploreMatches={() => setTab('explore')}
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
                onDeleteAccount={handleDeleteAccount}
              />
            )}

            {currentTab === 'trust_safety' && (
              <TrustPrivacyScreen
                locale={locale}
                onBackToOverview={() => setTab('landing')}
              />
            )}

            {currentTab === 'community' && userProfile && (
              <CommunityFeed
                locale={locale}
                currentEmail={userProfile.email}
                currentUserProfile={{ name: userProfile.name || 'Respected Member', gender: userProfile.gender }}
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
          onClick={() => setTab('explore')}
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
                  ? '💍 Please log in or create an account to view and chat with matches.' 
                  : '💍 يرجى تسجيل الدخول أولاً لتصفح والدردشة مع شركاء التوافق.'
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
                  ? '💍 Please log in to view received postcards.' 
                  : '💍 يرجى تسجيل الدخول أولاً لتصفح الرسائل والبطاقات البريدية.'
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
            {locale === 'en' ? 'Postbox' : locale === 'ar' ? 'صندوقي' : 'سندوقی پۆستە'}
          </span>
        </button>

        {/* My Dossier Option */}
        <button
          onClick={() => {
            if (!isAuthenticated) {
              triggerToast(
                locale === 'en' 
                  ? '💍 Please sign in to view your profile dossier.' 
                  : '💍 يرجى تسجيل الدخول لعرض وتعديل ملفك التعريفي.'
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
            {locale === 'en' ? 'My Profile' : locale === 'ar' ? 'ملفي' : 'پڕۆفایلم'}
          </span>
        </button>
      </div>

    </div>
  );
}
