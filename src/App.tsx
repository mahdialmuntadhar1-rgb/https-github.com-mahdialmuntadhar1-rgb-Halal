import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { AppTab, CommunityCategory, CommunityPost, ContentReport, Conversation, HeroImage, IntroductionRequest, SessionUser, UserProfile } from './types';
import Header from './components/Header';
import LandingScreen from './screens/LandingScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import MatchExplorerScreen from './screens/MatchExplorerScreen';
import CommunityScreen from './screens/CommunityScreen';
import AdminScreen from './screens/AdminScreen';
import ChatScreen from './screens/ChatScreen';
import AuthScreen from './screens/AuthScreen';
import ProfilePreviewScreen from './screens/ProfilePreviewScreen';
import PrivacySettingsScreen from './screens/PrivacySettingsScreen';
import AccountPlaceholderScreen from './screens/AccountPlaceholderScreen';
import TrustPrivacyScreen from './screens/TrustPrivacyScreen';
import { useLocale } from './hooks/useLocale';
import { apiClient } from './lib/apiClient';

export default function App() {
  const { locale, setLocale, t } = useLocale('ar');
  const [currentTab, setTab] = useState<AppTab>('landing');
  const [authStatus, setAuthStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');
  const [session, setSession] = useState<SessionUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([]);
  const [reports, setReports] = useState<ContentReport[]>([]);
  const [introductionRequests, setIntroductionRequests] = useState<IntroductionRequest[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeMatchId, setActiveMatchId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const resetPrivateState = () => {
    setSession(null);
    setUserProfile(null);
    setCommunityPosts([]);
    setReports([]);
    setIntroductionRequests([]);
    setConversations([]);
    setActiveMatchId(null);
  };

  const refreshAll = async () => {
    const [sessionData, profile, heroes, posts, conversationList] = await Promise.all([
      apiClient.getSession(),
      apiClient.getCurrentUser(),
      apiClient.getHeroImages(),
      apiClient.getCommunityPosts(),
      apiClient.getConversations(),
    ]);
    const nextSession = { ...sessionData, role: profile.backendRole || sessionData.role };
    const isAdminUser = nextSession.role === 'admin';
    const [reportList, requestList] = isAdminUser
      ? await Promise.all([apiClient.getReports(), apiClient.getAdminIntroductionRequests()])
      : [[], []];
    setSession(nextSession);
    setUserProfile(profile);
    setHeroImages(heroes);
    setCommunityPosts(posts);
    setReports(reportList);
    setIntroductionRequests(requestList);
    setConversations(conversationList);
    setAuthStatus('authenticated');
  };

  useEffect(() => {
    const boot = async () => {
      try {
        if (!apiClient.hasToken() && !apiClient.getIsDemoMode()) {
          setHeroImages(await apiClient.getHeroImages());
          setAuthStatus('unauthenticated');
          return;
        }

        await refreshAll();
      } catch (err) {
        resetPrivateState();
        try {
          setHeroImages(await apiClient.getHeroImages());
        } catch {
          setHeroImages([]);
        }
        setAuthStatus('unauthenticated');
      }
    };

    boot();
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => setToastMessage(null), 3600);
  };

  const calculateProfileStrength = (): number => {
    if (!userProfile) return 0;
    const fields = [
      userProfile.gender,
      userProfile.age >= 18 ? userProfile.age : '',
      userProfile.governorate,
      userProfile.education,
      userProfile.profession,
      userProfile.maritalStatus,
      userProfile.intention,
      userProfile.bio || userProfile.lookingFor,
      userProfile.lookingFor,
      userProfile.photoPrivacy,
      userProfile.intentionBadges?.length ? 'badges' : ''
    ];
    return Math.round((fields.filter(Boolean).length / fields.length) * 100);
  };

  const handleUpdateUserProfile = async (updatedValues: Partial<UserProfile>) => {
    const saved = await apiClient.updateCurrentUserProfile(updatedValues);
    setUserProfile(saved);
  };

  const handleOnboardingComplete = async (updatedProfile: UserProfile) => {
    const saved = await apiClient.updateCurrentUserProfile(updatedProfile);
    setUserProfile(saved);
    triggerToast(t.profileReady);
    setTab('explore');
  };

  const handleToggleSavedProfile = async (id: string) => {
    triggerToast(t.savedProfilesUpdated);
  };

  const handleReportProfile = async (id: string) => {
    await apiClient.reportProfile(id);
    const reportList = await apiClient.getReports();
    setReports(reportList);
    triggerToast(t.profileReported);
  };

  const handleCreatePost = async (category: CommunityCategory, text: string) => {
    const posts = await apiClient.addCommunityPost(category, text);
    setCommunityPosts(posts);
    triggerToast(t.postCreated);
  };

  const handleLikePost = async (id: string) => {
    const posts = await apiClient.likePost(id);
    setCommunityPosts(posts);
  };

  const handleComment = async (id: string, text: string) => {
    const posts = await apiClient.addComment(id, text);
    setCommunityPosts(posts);
  };

  const handleReportPost = async (id: string) => {
    await apiClient.reportPost(id);
    setReports(await apiClient.getReports());
    triggerToast(t.postReported);
  };

  const handleAddHeroImage = async (url: string, alt: string) => {
    await apiClient.addHeroImage({ url, alt });
    setHeroImages(await apiClient.getHeroImages());
  };

  const handleUpdateHeroImage = async (id: string, updates: Partial<HeroImage>) => {
    setHeroImages(await apiClient.updateHeroImage(id, updates));
  };

  const handleRemoveHeroImage = async (id: string) => {
    setHeroImages(await apiClient.removeHeroImage(id));
  };

  const handleMoveHeroImage = async (id: string, direction: 'up' | 'down') => {
    setHeroImages(await apiClient.moveHeroImage(id, direction));
  };

  const handleModerateContent = async (targetType: 'profile' | 'post', targetId: string, action: 'hide' | 'delete') => {
    await apiClient.moderateContent(targetType, targetId, action);
    setReports(await apiClient.getReports());
    setCommunityPosts(await apiClient.getCommunityPosts());
    triggerToast(t.contentHidden);
  };

  const handleDecideIntroductionRequest = async (id: string, decision: 'accept' | 'decline') => {
    await apiClient.decideIntroductionRequest(id, decision);
    const [requestList, conversationList] = await Promise.all([
      apiClient.getAdminIntroductionRequests(),
      apiClient.getConversations(),
    ]);
    setIntroductionRequests(requestList);
    setConversations(conversationList);
    triggerToast(decision === 'accept' ? 'Introduction request accepted. Conversation unlocked.' : 'Introduction request declined.');
  };

  const handleSendMessage = async (matchId: string, text: string) => {
    const conversation = conversations.find((item) => item.matchId === matchId);
    if (!conversation) {
      triggerToast('Conversation is not available yet.');
      return;
    }

    await apiClient.sendMessage(conversation.id, text);
    setConversations(await apiClient.getConversations());
  };

  const handleLogin = async (email: string, password: string): Promise<SessionUser> => {
    const loggedIn = await apiClient.login(email, password);
    await refreshAll();
    triggerToast(t.welcome);
    return loggedIn;
  };

  const handleRegister = async (email: string, password: string): Promise<SessionUser> => {
    const registered = await apiClient.register(email, password);
    await refreshAll();
    setTab('onboarding');
    triggerToast(t.profileReady);
    return registered;
  };

  const handleLogout = () => {
    apiClient.logout();
    resetPrivateState();
    setAuthStatus('unauthenticated');
    setTab('landing');
  };

  if (authStatus === 'loading') {
    return (
      <div className="bg-warm-ivory min-h-screen flex items-center justify-center">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-accent-coral rounded-full animate-bounce" />
          <div className="w-3 h-3 bg-accent-pink rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-3 h-3 bg-[#40798C] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    );
  }

  if (authStatus === 'unauthenticated' || !userProfile || !session) {
    return <AuthScreen locale={locale} onLogin={handleLogin} onRegister={handleRegister} />;
  }

  const profileStrength = calculateProfileStrength();
  const isAdmin = session.role === 'admin';

  return (
    <div dir={t.dir} lang={locale} className="bg-warm-ivory min-h-screen text-warm-charcoal font-sans flex flex-col justify-between selection:bg-accent-coral/20 selection:text-accent-coral relative overflow-hidden">
      {toastMessage && (
        <div className="fixed bottom-6 end-6 z-55 max-w-sm bg-warm-charcoal text-white text-xs sm:text-sm p-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10 animate-slide-in">
          <Sparkles className="w-5 h-5 text-amber-300 shrink-0" />
          <p className="font-bold">{toastMessage}</p>
        </div>
      )}

      <Header
        currentTab={currentTab}
        setTab={setTab}
        profileStrength={profileStrength}
        userProfileName={userProfile.name}
        locale={locale}
        setLocale={setLocale}
        isAdmin={isAdmin}
        onLogout={handleLogout}
      />

      <main className="flex-grow">
        {currentTab === 'landing' && (
          <LandingScreen
            locale={locale}
            heroImages={heroImages}
            onSelectGender={(gender) => {
              setUserProfile((current) =>
                current
                  ? { ...current, gender, photoPrivacy: gender === 'female' ? 'hidden_by_default' : 'visible' }
                  : current
              );
              setTab('onboarding');
            }}
            onExploreMatches={() => setTab('explore')}
            setTab={setTab}
          />
        )}

        {currentTab === 'onboarding' && (
          <OnboardingScreen locale={locale} userProfile={userProfile} onComplete={handleOnboardingComplete} />
        )}

        {currentTab === 'explore' && (
          <MatchExplorerScreen
            locale={locale}
            onToggleSaved={handleToggleSavedProfile}
            onReportProfile={handleReportProfile}
            userGender={userProfile.gender}
          />
        )}

        {currentTab === 'community' && (
          <CommunityScreen
            locale={locale}
            posts={communityPosts}
            onCreatePost={handleCreatePost}
            onLikePost={handleLikePost}
            onComment={handleComment}
            onReportPost={handleReportPost}
          />
        )}

        {currentTab === 'chat' && (
          <ChatScreen
            locale={locale}
            acceptedMatches={conversations.map((conversation) => conversation.match).filter((match): match is NonNullable<Conversation['match']> => Boolean(match))}
            conversations={conversations}
            onSendMessage={handleSendMessage}
            activeMatchId={activeMatchId}
            setActiveMatchId={setActiveMatchId}
          />
        )}

        {currentTab === 'admin' && (
          <AdminScreen
            isAdmin={isAdmin}
            locale={locale}
            heroImages={heroImages}
            reports={reports}
            introductionRequests={introductionRequests}
            onAddHeroImage={handleAddHeroImage}
            onUpdateHeroImage={handleUpdateHeroImage}
            onRemoveHeroImage={handleRemoveHeroImage}
            onMoveHeroImage={handleMoveHeroImage}
            onModerateContent={handleModerateContent}
            onDecideIntroductionRequest={handleDecideIntroductionRequest}
          />
        )}

        {currentTab === 'profile' && (
          <ProfilePreviewScreen locale={locale} profile={userProfile} profileStrength={profileStrength} onEditClick={() => setTab('onboarding')} />
        )}

        {currentTab === 'privacy' && (
          <PrivacySettingsScreen locale={locale} profile={userProfile} onUpdatePrivacy={handleUpdateUserProfile} triggerToast={triggerToast} />
        )}

        {currentTab === 'account' && (
          <AccountPlaceholderScreen locale={locale} userName={userProfile.name} triggerToast={triggerToast} />
        )}

        {currentTab === 'trust_safety' && (
          <TrustPrivacyScreen locale={locale} onBackToOverview={() => setTab('landing')} />
        )}
      </main>

      <footer className="bg-warm-charcoal text-[#C3BFB9] py-10 border-t border-white/10 relative z-10 text-start">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <p className="text-xl font-serif font-bold text-white">{t.brand}</p>
            <p className="text-xs mt-2 max-w-md">{t.footerDesc}</p>
          </div>
          <div className="flex flex-wrap gap-4 text-xs font-bold">
            <button onClick={() => setTab('explore')} className="hover:text-white">{t.exploreMembers}</button>
            <button onClick={() => setTab('chat')} className="hover:text-white">{t.chat}</button>
            <button onClick={() => setTab('community')} className="hover:text-white">{t.communityQuestions}</button>
            <button onClick={() => setTab('trust_safety')} className="hover:text-white">{t.safetyTitle}</button>
            {isAdmin && <button onClick={() => setTab('admin')} className="hover:text-white">{t.admin}</button>}
          </div>
        </div>
      </footer>
    </div>
  );
}
