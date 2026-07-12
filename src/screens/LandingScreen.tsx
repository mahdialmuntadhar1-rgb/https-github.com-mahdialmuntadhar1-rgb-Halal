import React, { useState, useMemo } from 'react';
import { AppLanguage, AppTab, MatchProfile, UserProfile } from '../types';
import { TRANSLATIONS } from '../lib/translations';
import Hero from '../components/Hero';
import HowItWorks from '../components/HowItWorks';
import PhotoPrivacyModule from '../components/PhotoPrivacyModule';
import TrustSafety from '../components/TrustSafety';
import MarriageCafe from '../components/MarriageCafe';
import { apiClient } from '../services/apiClient';
import { 
  Check, 
  MapPin, 
  User, 
  Users, 
  GraduationCap, 
  Filter, 
  Sparkles, 
  Heart, 
  ShieldCheck, 
  Lock,
  ArrowRight,
  UserCheck,
  X,
  Compass,
  Award,
  Coffee
} from 'lucide-react';

interface LandingScreenProps {
  locale: AppLanguage;
  onSelectGender: (gender: 'male' | 'female') => void;
  onExploreMatches: () => void;
  setTab: (tab: AppTab) => void;
  isAuthenticated: boolean;
  userProfileName?: string;
  userProfile?: UserProfile;
  preSelectedGender?: 'male' | 'female' | null;
}

// 19 Governorates list with English, Arabic, and Kurdish translations
export const GOVERNORATE_OPTIONS = [
  { id: 'Baghdad', en: 'Baghdad (Ø¨ØºØ¯Ø§Ø¯ / Ø¨Û•ØºØ¯Ø§Ø¯)', ar: 'Ø¨ØºØ¯Ø§Ø¯ (Baghdad)', ckb: 'Ø¨Û•ØºØ¯Ø§Ø¯ (Baghdad)' },
  { id: 'Erbil', en: 'Erbil (Ø£Ø±Ø¨ÙŠÙ„ / Ù‡Û•ÙˆÙ„ÛŽØ±)', ar: 'Ø£Ø±Ø¨ÙŠÙ„ (Erbil)', ckb: 'Ù‡Û•ÙˆÙ„ÛŽØ± (Erbil)' },
  { id: 'Sulaymaniyah', en: 'Sulaymaniyah (Ø§Ù„Ø³Ù„ÙŠÙ…Ø§Ù†ÙŠØ© / Ø³Ù„ÛŽÙ…Ø§Ù†ÛŒ)', ar: 'Ø§Ù„Ø³Ù„ÙŠÙ…Ø§Ù†ÙŠØ© (Sulaymaniyah)', ckb: 'Ø³Ù„ÛŽÙ…Ø§Ù†ÛŒ (Sulaymaniyah)' },
  { id: 'Duhok', en: 'Duhok (Ø¯Ù‡ÙˆÙƒ / Ø¯Ù‡Û†Ú©)', ar: 'Ø¯Ù‡ÙˆÙƒ (Duhok)', ckb: 'Ø¯Ù‡Û†Ú© (Duhok)' },
  { id: 'Halabja', en: 'Halabja (Ø­Ù„Ø¨Ø¬Ø© / Ù‡Û•ÚµÛ•Ø¨Ø¬Û•)', ar: 'Ø­Ù„Ø¨Ø¬Ø© (Halabja)', ckb: 'Ù‡Û•ÚµÛ•Ø¨Ø¬Û• (Halabja)' },
  { id: 'Kirkuk', en: 'Kirkuk (ÙƒØ±ÙƒÙˆÙƒ / Ú©Û•Ø±Ú©ÙˆÚ©)', ar: 'ÙƒØ±ÙƒÙˆÙƒ (Kirkuk)', ckb: 'Ú©Û•Ø±Ú©ÙˆÚ© (Kirkuk)' },
  { id: 'Nineveh', en: 'Nineveh (Ù†ÙŠÙ†ÙˆÙ‰ / Ù†Û•ÛŒÙ†Û•ÙˆØ§)', ar: 'Ù†ÙŠÙ†ÙˆÙ‰ (Nineveh)', ckb: 'Ù†Û•ÛŒÙ†Û•ÙˆØ§ (Nineveh)' },
  { id: 'Basra', en: 'Basra (Ø§Ù„Ø¨ØµØ±Ø© / Ø¨Û•Ø³Ø±Û•)', ar: 'Ø§Ù„Ø¨ØµØ±Ø© (Basra)', ckb: 'Ø¨Û•Ø³Ø±Û• (Basra)' },
  { id: 'Najaf', en: 'Najaf (Ø§Ù„Ù†Ø¬Ù / Ù†Û•Ø¬Û•Ù)', ar: 'Ø§Ù„Ù†Ø¬Ù (Najaf)', ckb: 'Ù†Û•Ø¬Û•Ù (Najaf)' },
  { id: 'Karbala', en: 'Karbala (ÙƒØ±Ø¨Ù„Ø§Ø¡ / Ú©Û•Ø±Ø¨Û•Ù„Ø§)', ar: 'ÙƒØ±Ø¨Ù„Ø§Ø¡ (Karbala)', ckb: 'Ú©Û•Ø±Ø¨Û•Ù„Ø§ (Karbala)' },
  { id: 'Babil', en: 'Babil (Ø¨Ø§Ø¨Ù„ / Ø¨Ø§Ø¨Ù„)', ar: 'Ø¨Ø§Ø¨Ù„ (Babel)', ckb: 'Ø¨Ø§Ø¨Ù„ (Babel)' },
  { id: 'Anbar', en: 'Anbar (Ø§Ù„Ø£Ù†Ø¨Ø§Ø± / Ø¦Û•Ù†Ø¨Ø§Ø±)', ar: 'Ø§Ù„Ø£Ù†Ø¨Ø§Ø± (Anbar)', ckb: 'Ø¦Û•Ù†Ø¨Ø§Ø± (Anbar)' },
  { id: 'Diyala', en: 'Diyala (Ø¯ÙŠØ§Ù„Ù‰ / Ø¯ÛŒØ§Ù„Û•)', ar: 'Ø¯ÙŠØ§Ù„Ù‰ (Diyala)', ckb: 'Ø¯ÛŒØ§Ù„Û• (Diyala)' },
  { id: 'Salah al-Din', en: 'Salah al-Din (ØµÙ„Ø§Ø­ Ø§Ù„Ø¯ÙŠÙ† / Ø³Û•ÚµØ§Ø­Û•Ø¯ÛŒÙ†)', ar: 'ØµÙ„Ø§Ø­ Ø§Ù„Ø¯ÙŠÙ† (Salah al-Din)', ckb: 'Ø³Û•ÚµØ§Ø­Û•Ø¯ÛŒÙ† (Salah al-Din)' },
  { id: 'Wasit', en: 'Wasit (ÙˆØ§Ø³Ø· / ÙˆØ§Ø³ÛŒØª)', ar: 'ÙˆØ§Ø³Ø· (Wasit)', ckb: 'ÙˆØ§Ø³ÛŒØª (Wasit)' },
  { id: 'Maysan', en: 'Maysan (Ù…ÙŠØ³Ø§Ù† / Ù…ÛŒØ³Ø§Ù†)', ar: 'Ù…ÙŠØ³Ø§Ù† (Maysan)', ckb: 'Ù…ÛŒØ³Ø§Ù† (Maysan)' },
  { id: 'Dhi Qar', en: 'Dhi Qar (Ø°ÙŠ Ù‚Ø§Ø± / Ø²ÛŒÙ‚Ø§Ø±)', ar: 'Ø°ÙŠ Ù‚Ø§Ø± (Dhi Qar)', ckb: 'Ø²ÛŒÙ‚Ø§Ø± (Dhi Qar)' },
  { id: 'Muthanna', en: 'Muthanna (Ø§Ù„Ù…Ø«Ù†Ù‰ / Ù…ÙˆØªÛ•Ù†Ø§)', ar: 'Ø§Ù„Ù…Ø«Ù†Ù‰ (Muthanna)', ckb: 'Ù…ÙˆØªÛ•Ù†Ø§ (Muthanna)' },
  { id: 'Qadisiyah', en: 'Qadisiyah (Ø§Ù„Ù‚Ø§Ø¯Ø³ÙŠØ© / Ù‚Ø§Ø¯Ø³ÙŠÛ•)', ar: 'Ø§Ù„Ù‚Ø§Ø¯Ø³ÙŠØ© (Qadisiyah)', ckb: 'Ù‚Ø§Ø¯Ø³ÛŒÛ• (Qadisiyah)' }
];

// System-selected landmarks for the 19 Iraqi governorates
const GOVERNORATE_LANDMARKS: Record<string, { en: string; ar: string; ckb: string; icon: string }> = {
  Baghdad: { en: 'Al-Mutanabbi Street', ar: 'Ø´Ø§Ø±Ø¹ Ø§Ù„Ù…ØªÙ†Ø¨ÙŠ Ø§Ù„ØªØ±Ø§Ø«ÙŠ', ckb: 'Ø´Û•Ù‚Ø§Ù…ÛŒ Ù…ÙˆØªÛ•Ù†Û•Ø¨ÛŒ Ù…ÛŽÚ˜ÙˆÙˆÛŒÛŒ', icon: 'ðŸ“š' },
  Erbil: { en: 'Erbil Citadel', ar: 'Ù‚Ù„Ø¹Ø© Ø£Ø±Ø¨ÙŠÙ„ Ø§Ù„Ø£Ø«Ø±ÙŠØ©', ckb: 'Ù‚Û•ÚµØ§ÛŒ Ù‡Û•ÙˆÙ„ÛŽØ±ÛŒ Ø¯ÛŽØ±ÛŒÙ†', icon: 'ðŸ°' },
  Sulaymaniyah: { en: 'Salim Street & Azadi Park', ar: 'Ø´Ø§Ø±Ø¹ Ø³Ø§Ù„Ù… ÙˆØ­Ø¯ÙŠÙ‚Ø© Ø¢Ø²Ø§Ø¯ÙŠ', ckb: 'Ø´Û•Ù‚Ø§Ù…ÛŒ Ø³Ø§Ù„Ù… Ùˆ Ø¨Ø§Ø®ÛŒ Ø¯Ø§ÛŒÚ©', icon: 'ðŸŒ³' },
  Duhok: { en: 'Duhok Dam & Dream City', ar: 'Ø³Ø¯ Ø¯Ù‡ÙˆÙƒ ÙˆÙ…Ø¯ÙŠÙ†Ø© Ø§Ù„Ø£Ø­Ù„Ø§Ù…', ckb: 'Ø¨Û•Ù†Ø¯Ø§ÙˆÛŒ Ø¯Ù‡Û†Ú© Ùˆ Ø¯Ø±ÛŒÙ… Ø³ÛŒØªÛŒ', icon: 'ðŸŽ¡' },
  Halabja: { en: 'Sarchinar & Ahmad Awa', ar: 'Ø´Ù„Ø§Ù„Ø§Øª Ø£Ø­Ù…Ø¯ Ø¢ÙˆØ§ Ø§Ù„Ø¬Ù…ÙŠÙ„Ø©', ckb: 'Ù‡Ø§ÙˆÛŒÙ†Û•Ù‡Û•ÙˆØ§Ø±ÛŒ Ø¦Û•Ø­Ù…Û•Ø¯ Ø¦Ø§ÙˆØ§', icon: 'ðŸŒŠ' },
  Kirkuk: { en: 'Kirkuk Citadel', ar: 'Ù‚Ù„Ø¹Ø© ÙƒØ±ÙƒÙˆÙƒ Ø§Ù„ØªØ§Ø±ÙŠØ®ÙŠØ©', ckb: 'Ù‚Û•ÚµØ§ÛŒ Ú©Û•Ø±Ú©ÙˆÚ©ÛŒ Ù…ÛŽÚ˜ÙˆÙˆÛŒÛŒ', icon: 'ðŸ›ï¸' },
  Nineveh: { en: 'Al-Nuri Mosque & Mosul Woods', ar: 'ØºØ§Ø¨Ø§Øª Ø§Ù„Ù…ÙˆØµÙ„ ÙˆØ§Ù„Ù…Ù†Ø§Ø±Ø© Ø§Ù„Ø­Ø¯Ø¨Ø§Ø¡', ckb: 'Ø¯Ø§Ø±Ø³ØªØ§Ù†Û•Ú©Ø§Ù†ÛŒ Ù…ÙˆØ³Úµ', icon: 'ðŸ•Œ' },
  Basra: { en: 'Shatt al-Arab Corniche', ar: 'ÙƒÙˆØ±Ù†ÙŠØ´ Ø´Ø· Ø§Ù„Ø¹Ø±Ø¨', ckb: 'Ú©Û†Ú•Ù†ÛŒØ´ÛŒ Ø´Û•ØªÙ„ Ø¹Û•Ø±Û•Ø¨', icon: 'â›µ' },
  Najaf: { en: 'Wadi-us-Salaam & Heritage Bazaar', ar: 'Ø§Ù„Ø³ÙˆÙ‚ Ø§Ù„ÙƒØ¨ÙŠØ± ÙˆØ§Ù„ØªØ±Ø§Ø« Ø§Ù„Ù†Ø¬ÙÙŠ', ckb: 'Ø¨Ø§Ø²Ø§Ú•ÛŒ Ú¯Û•ÙˆØ±Û•ÛŒ Ù†Û•Ø¬Û•Ù', icon: 'ðŸ•Œ' },
  Karbala: { en: 'Al-Hussein Area & Lake Milh', ar: 'Ù…Ù†Ø·Ù‚Ø© Ø§Ù„Ø­Ø±Ù…ÙŠÙ† ÙˆØ¨Ø­ÙŠØ±Ø© Ø§Ù„Ù…Ù„Ø­', ckb: 'Ù†Ø§ÙˆÚ†Û•ÛŒ Ø­Û•Ø±Û•Ù…Û•ÛŒÙ†', icon: 'ðŸŒ…' },
  Babil: { en: 'Ancient Ruins of Babylon', ar: 'Ø¢Ø«Ø§Ø± Ø¨Ø§Ø¨Ù„ Ø§Ù„ØªØ§Ø±ÙŠØ®ÙŠØ© ÙˆØ£Ø³Ø¯ Ø¨Ø§Ø¨Ù„', ckb: 'Ø´ÙˆÛŽÙ†Û•ÙˆØ§Ø±ÛŒ Ø¯ÛŽØ±ÛŒÙ†ÛŒ Ø¨Ø§Ø¨Ù„', icon: 'ðŸ¦' },
  Anbar: { en: 'Habbaniyah Lake & Euphrates', ar: 'Ø¨Ø­ÙŠØ±Ø© Ø§Ù„Ø­Ø¨Ø§Ù†ÙŠØ© ÙˆÙ†Ù‡Ø± Ø§Ù„ÙØ±Ø§Øª', ckb: 'Ø¯Û•Ø±ÛŒØ§Ú†Û•ÛŒ Ø­Û•Ø¨Ø§Ù†ÛŒÛ•', icon: 'ðŸ–ï¸' },
  Diyala: { en: 'Hamrin Hills & Orange Groves', ar: 'Ø¨Ø³Ø§ØªÙŠÙ† Ø§Ù„Ø¨Ø±ØªÙ‚Ø§Ù„ ÙˆØªÙ„Ø§Ù„ Ø­Ù…Ø±ÙŠÙ†', ckb: 'Ø¨Ø§Ø®Û•Ú©Ø§Ù†ÛŒ Ù¾Ø±ØªÛ•Ù‚Ø§ÚµÛŒ Ø¯ÛŒØ§Ù„Û•', icon: 'ðŸŠ' },
  "Salah al-Din": { en: 'Spiral Minaret of Samarra', ar: 'Ù…Ø¦Ø°Ù†Ø© Ø§Ù„Ù…Ù„ÙˆÙŠØ© Ø§Ù„Ø£Ø«Ø±ÙŠØ© ÙÙŠ Ø³Ø§Ù…Ø±Ø§Ø¡', ckb: 'Ù…Ù†Ø§Ø±Û•ÛŒ Ù…Û•Ù„ÙˆÛŒÛŒÛ•ÛŒ Ø³Ø§Ù…Û•Ú•Ø§', icon: 'ðŸ•Œ' },
  Wasit: { en: 'Kut Barrage & Tigris Banks', ar: 'Ø³Ø¯ Ø§Ù„ÙƒÙˆØª ÙˆØ¶ÙØ§Ù Ù†Ù‡Ø± Ø¯Ø¬Ù„Ø©', ckb: 'Ø¨Û•Ù†Ø¯Ø§ÙˆÛŒ Ú©ÙˆØª', icon: 'ðŸŒŠ' },
  Maysan: { en: 'Amara Marshes & Kahla River', ar: 'Ø£Ù‡ÙˆØ§Ø± Ø§Ù„Ø¹Ù…Ø§Ø±Ø© ÙˆÙ†Ù‡Ø± Ø§Ù„ÙƒØ­Ù„Ø§Ø¡', ckb: 'Ø£Ù‡ÙˆØ§Ø± Ø§Ù„Ø¹Ù…Ø§Ø±Ø© ÙˆÙ†Ù‡Ø± Ø§Ù„ÙƒØ­Ù„Ø§Ø¡', icon: 'ðŸš£' },
  "Dhi Qar": { en: 'Ziggurat of Ur & Chibayish Marshes', ar: 'Ø²Ù‚ÙˆØ±Ø© Ø£ÙˆØ± Ø§Ù„Ø£Ø«Ø±ÙŠØ© ÙˆØ£Ù‡ÙˆØ§Ø± Ø§Ù„Ø¬Ø¨Ø§ÙŠØ´', ckb: 'Ø²Û•Ù‚ÙˆÙˆØ±Û•ÛŒ Ø¦Û†Ø± Ùˆ Ø¦Û•Ù‡ÙˆØ§Ø±Û•Ú©Ø§Ù†', icon: 'ðŸº' },
  Muthanna: { en: 'Sawa Lake & Warka Ruins', ar: 'Ø¨Ø­ÙŠØ±Ø© Ø³Ø§ÙˆØ© ÙˆØ¢Ø«Ø§Ø± Ø§Ù„ÙˆØ±ÙƒØ§Ø¡', ckb: 'Ø¯Û•Ø±ÛŒØ§Ú†Û•ÛŒ Ø³Ø§ÙˆØ§', icon: 'ðŸœï¸' },
  Qadisiyah: { en: 'Nippur Ruins & Diwaniyah River', ar: 'Ø¢Ø«Ø§Ø± Ù†ÙŠØ¨ÙˆØ± ÙˆØ¶ÙØ§Ù Ù†Ù‡Ø± Ø§Ù„Ø¯ÙŠÙˆØ§Ù†ÙŠØ©', ckb: 'Ø´ÙˆÛŽÙ†Û•ÙˆØ§Ø±ÛŒ Ù†ÛŒÙ¾Û†Ø±', icon: 'ðŸŒ¾' },
};

export default function LandingScreen({ locale, onSelectGender, onExploreMatches, setTab, isAuthenticated, userProfileName, userProfile, preSelectedGender }: LandingScreenProps) {
  const t = TRANSLATIONS[locale] || TRANSLATIONS['ar'];
  const isEn = locale === 'en';
  const isCkb = locale === 'ckb';

  const isProfileIncomplete = useMemo(() => {
    return isAuthenticated && (
      !userProfile || !userProfile.age || userProfile.age === 0 || !userProfile.education || !userProfile.profession
    );
  }, [isAuthenticated, userProfile]);

  // State management for governorate filtering
  const [selectedGov, setSelectedGov] = useState<string>('all');
  const [minAge, setMinAge] = useState<number>(18);
  const [maxAge, setMaxAge] = useState<number>(55);
  
  // Set default gender preference based on user profile or default
  const defaultGenderPref = useMemo(() => {
    const activeG = userProfile?.gender || preSelectedGender;
    return activeG ? (activeG === 'male' ? 'female' : 'male') : 'all';
  }, [userProfile, preSelectedGender]);

  const [genderPref, setGenderPref] = useState<'all' | 'female' | 'male'>(defaultGenderPref);

  // Synchronize default gender preference when profile changes
  React.useEffect(() => {
    apiClient.getMatches().then(res => setPreviewMatches(res.matches.slice(0, 6))).catch(() => {});
  }, []);

  useEffect(() => {
    const activeG = userProfile?.gender || preSelectedGender;
    if (activeG) {
      setGenderPref(activeG === 'male' ? 'female' : 'male');
    }
  }, [userProfile, preSelectedGender]);

  const [activeCategory, setActiveCategory] = useState<'all' | 'brides' | 'grooms' | 'professionals'>('all');
  const [selectedStory, setSelectedStory] = useState<MatchProfile | null>(null);
  const [homeTab, setHomeTab] = useState<'discover' | 'cafe'>('discover');
  
  // Local toast notification system
  const [localToast, setLocalToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setLocalToast(msg);
    setTimeout(() => setLocalToast(null), 4000);
  };

  // Filter matches dynamically (we guarantee at least 10 men and 10 women per governorate in previewMatches.length > 0 ? previewMatches : [])
  const filteredMatches = useMemo(() => {
    let result = (selectedGov.toLowerCase() === 'all' || selectedGov.toLowerCase() === 'all iraq')
      ? previewMatches.length > 0 ? previewMatches : []
      : previewMatches.length > 0 ? previewMatches : [].filter(m => m.governorate.toLowerCase() === selectedGov.toLowerCase());
    
    // Filter by age range
    result = result.filter(m => m.age >= minAge && m.age <= maxAge);
    
    // Filter by gender preference
    if (genderPref !== 'all') {
      result = result.filter(m => m.gender === genderPref);
    } else {
      const activeG = userProfile?.gender || preSelectedGender;
      if (activeG) {
        const opposite = activeG === 'male' ? 'female' : 'male';
        result = result.filter(m => m.gender === opposite);
      } else {
        // If not logged in, apply category pills (brides / grooms)
        if (activeCategory === 'brides') {
          result = result.filter(m => m.gender === 'female');
        } else if (activeCategory === 'grooms') {
          result = result.filter(m => m.gender === 'male');
        }
      }
    }
    
    if (activeCategory === 'professionals') {
      result = result.filter(m => 
        m.education.toLowerCase().includes('bachelor') || 
        m.education.toLowerCase().includes('doctor') || 
        m.education.toLowerCase().includes('degree') || 
        m.profession.toLowerCase().includes('engineer') || 
        m.profession.toLowerCase().includes('architect') || 
        m.profession.toLowerCase().includes('pharmacist') || 
        m.profession.toLowerCase().includes('cardiologist')
      );
    }
    
    // Return sorted by compatibility score or verification
    const sorted = result.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
    
    return sorted;
  }, [selectedGov, activeCategory, userProfile, isProfileIncomplete, minAge, maxAge, genderPref, preSelectedGender]);

  // Featured Active Candidates (filtered active profiles who have been online)
  const featuredCandidates = useMemo(() => {
    const activeG = userProfile?.gender || preSelectedGender;
    
    // Pick 4 outstanding profiles from diverse regions
    const baghdadGroom = previewMatches.length > 0 ? previewMatches : [].find(m => m.governorate === 'Baghdad' && m.gender === 'male' && m.id === 'm1');
    const erbilGroom = previewMatches.length > 0 ? previewMatches : [].find(m => m.governorate === 'Erbil' && m.gender === 'male' && m.id === 'm2');
    const slemaniBride = previewMatches.length > 0 ? previewMatches : [].find(m => m.governorate === 'Sulaymaniyah' && m.gender === 'female' && m.id === 'f1');
    const baghdadBride = previewMatches.length > 0 ? previewMatches : [].find(m => m.governorate === 'Baghdad' && m.gender === 'female' && m.id === 'f2');
    
    const candidates: MatchProfile[] = [];
    
    if (activeG === 'male') {
      // User is male, show brides only
      if (slemaniBride) candidates.push(slemaniBride);
      if (baghdadBride) candidates.push(baghdadBride);
    } else if (activeG === 'female') {
      // User is female, show grooms only
      if (erbilGroom) candidates.push(erbilGroom);
      if (baghdadGroom) candidates.push(baghdadGroom);
    } else {
      // Not selected yet, show both
      if (slemaniBride) candidates.push(slemaniBride);
      if (erbilGroom) candidates.push(erbilGroom);
      if (baghdadBride) candidates.push(baghdadBride);
      if (baghdadGroom) candidates.push(baghdadGroom);
    }
    
    return candidates;
  }, [userProfile, preSelectedGender]);

  // Nearby location candidates based on selected governorate or user's own profile location
  const nearbyMatches = useMemo(() => {
    const userGov = userProfile?.governorate || 'Baghdad';
    const hasFilter = selectedGov && selectedGov !== 'all';

    if (hasFilter) {
      // User explicitly filtered by governorate
      let result = previewMatches.length > 0 ? previewMatches : [].filter(m => m.governorate.toLowerCase() === selectedGov.toLowerCase());
      if (genderPref !== 'all') {
        result = result.filter(m => m.gender === genderPref);
      } else {
        const activeG = userProfile?.gender || preSelectedGender;
        if (activeG) {
          result = result.filter(m => m.gender === (activeG === 'male' ? 'female' : 'male'));
        }
      }
      return result.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
    } else {
      // No explicit governorate filter: show user's governorate first, then make public whoever is available in Iraq
      let nearbyResult = previewMatches.length > 0 ? previewMatches : [].filter(m => m.governorate.toLowerCase() === userGov.toLowerCase());
      let otherResult = previewMatches.length > 0 ? previewMatches : [].filter(m => m.governorate.toLowerCase() !== userGov.toLowerCase());

      let targetGender = genderPref;
      if (targetGender === 'all') {
        const activeG = userProfile?.gender || preSelectedGender;
        if (activeG) {
          targetGender = activeG === 'male' ? 'female' : 'male';
        }
      }

      if (targetGender !== 'all') {
        nearbyResult = nearbyResult.filter(m => m.gender === targetGender);
        otherResult = otherResult.filter(m => m.gender === targetGender);
      }

      nearbyResult = nearbyResult.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
      otherResult = otherResult.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

      return [...nearbyResult, ...otherResult];
    }
  }, [selectedGov, userProfile, genderPref, preSelectedGender]);

  const getGovDisplayName = (govId: string) => {
    const gov = GOVERNORATE_OPTIONS.find(g => g.id === govId);
    if (!gov) return govId;
    return isEn ? gov.en : isCkb ? gov.ckb : gov.ar;
  };

  const txt = (en: string, ar: string, ckb: string) => {
    return isEn ? en : isCkb ? ckb : ar;
  };

  const handleProfileClick = (candidate: MatchProfile) => {
    if (!isAuthenticated) {
      showToast(txt(
        "ðŸ’ Please login or create an account to view deep lifestyle values & send requests!",
        "ðŸ’ ÙŠØ±Ø¬Ù‰ ØªØ³Ø¬ÙŠÙ„ Ø§Ù„Ø¯Ø®ÙˆÙ„ Ø£Ùˆ Ø¥Ù†Ø´Ø§Ø¡ Ø­Ø³Ø§Ø¨ Ù„Ø§Ø³ØªÙƒØ´Ø§Ù ØªÙØ§ØµÙŠÙ„ Ø§Ù„Ù‚ÙŠÙ… Ø§Ù„Ø¹Ø§Ø¦Ù„ÙŠØ© ÙˆØ§Ù„ØªÙˆØ§ØµÙ„ Ø§Ù„Ø¬Ø§Ø¯!",
        "ðŸ’ ØªÚ©Ø§ÛŒÛ• Ø³Û•Ø±Û•ØªØ§ Ø¨Ú†Û† Ú˜ÙˆÙˆØ±Û•ÙˆÛ• ÛŒØ§Ù† Ù¾Ú•Û†ÙØ§ÛŒÙ„ Ø¯Ø±ÙˆØ³Øª Ø¨Ú©Û• Ø¨Û† Ø¯ÛŒØªÙ†ÛŒ Ø¨Û•Ù‡Ø§Ú©Ø§Ù†!"
      ));
      setTab('onboarding');
    } else {
      onExploreMatches();
    }
  };

  return (
    <div className="animate-fade-in space-y-10 relative" id="landing-screen">
      {/* Beta Badge */}
      <div style={{position: "fixed", top: 0, left: 0, right: 0, zIndex: 99999, background: "#1C2541", color: "#E8DCC4", padding: "8px", textAlign: "center", fontSize: "13px", fontFamily: "system-ui", borderBottom: "1px solid #E8DCC4", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px"}}>
        <span style={{width: "8px", height: "8px", background: "#f59e0b", borderRadius: "50%", display: "inline-block"}}></span>
        {locale === "ar" ? "Ù†Ø³Ø®Ø© ØªØ¬Ø±ÙŠØ¨ÙŠØ©" : locale === "ckb" ? "ÙˆÛ•Ø´Ø§Ù†ÛŒ ØªØ§Ù‚ÛŒÚ©Ø±Ø¯Ù†Û•ÙˆÛ•" : "Beta"}
      </div>
      <div style={{height: "36px"}}></div>

      
      {/* LOCAL TOAST NOTIFICATION */}
      {localToast && (
        <div className="fixed bottom-6 right-6 z-[9999] max-w-sm bg-warm-charcoal text-white text-xs sm:text-sm p-4 rounded-2xl shadow-2xl flex items-center space-x-3 border border-emerald-500/25 animate-slide-in">
          <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
          <p className="font-bold">{localToast}</p>
        </div>
      )}

      {/* HERO SECTION */}
      <Hero
        locale={locale}
        onSelectGender={onSelectGender}
        onExploreMatches={onExploreMatches}
        setTab={setTab}
        isAuthenticated={isAuthenticated}
        userProfileName={userProfileName}
        selectedGov={selectedGov}
        setSelectedGov={setSelectedGov}
        showToast={showToast}
        userProfile={userProfile}
        preSelectedGender={preSelectedGender}
      />

      {/* BUSINESS HERO SECTION (Stunning professional sub-header representing authority, trust, and premium certified Iraqi matrimonial services) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2" id="business-hero-section">
        <div className="bg-gradient-to-br from-[#1C2541] via-[#2F3E46] to-[#1C2541] border border-[#E8DCC4]/30 rounded-[2rem] p-6 sm:p-10 text-white relative overflow-hidden shadow-2xl">
          {/* Subtle golden branding lines */}
          <div className="absolute top-0 right-0 w-56 h-56 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Business Hero Left Column */}
            <div className="lg:col-span-8 text-start space-y-4">
              <span className="inline-flex items-center gap-1 bg-amber-500/15 text-amber-300 border border-amber-500/30 px-3.5 py-1 rounded-full text-[10px] sm:text-xs font-mono font-black uppercase tracking-wider">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>{txt("OFFICIAL PREMIUM DIVISION", "Ø§Ù„Ø¨ÙˆØ§Ø¨Ø© Ø§Ù„Ù…Ù‡Ù†ÙŠØ© Ø§Ù„Ø±Ø³Ù…ÙŠØ© Ø§Ù„Ù…Ø¹ØªÙ…Ø¯Ø©", "Ø¨Û•Ø´ÛŒ ÙÛ•Ø±Ù…ÛŒ Ùˆ Ø³Û•Ø±Û•Ú©ÛŒ")}</span>
              </span>
              <h2 className="text-2xl sm:text-4xl font-serif font-black tracking-tight leading-tight">
                {txt("Licensed, Chaperoned Courtship Services", "Ø§Ù„ÙˆØ³Ø§Ø·Ø© Ø§Ù„Ù…Ù‡Ù†ÙŠØ© Ø§Ù„Ù…Ø¹ØªÙ…Ø¯Ø© Ù„Ù„Ø²ÙˆØ§Ø¬ Ø§Ù„ÙˆÙ‚ÙˆØ± ÙÙŠ Ø§Ù„Ø¹Ø±Ø§Ù‚", "Ø®Ø²Ù…Û•ØªÚ¯ÙˆØ²Ø§Ø±ÛŒ ÙÛ•Ø±Ù…ÛŒ Ù‡Ø§ÙˆØ³Û•Ø±Ú¯ÛŒØ±ÛŒ Ø¨Û•Ù¾ÛŽÛŒ Ø¨Û•Ù‡Ø§ Ú©Û†Ù…Û•ÚµØ§ÛŒÛ•ØªÛŒÛŒÛ•Ú©Ø§Ù†")}
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 font-medium leading-relaxed max-w-3xl">
                {txt(
                  "We bridge tradition and modernity. Each applicant undergoes rigorous ID validation and manual lifestyle assessment to guarantee the most sincere, family-supported match pool in all 19 Iraqi governorates.",
                  "Ù†Ø¬Ù…Ø¹ Ø¨ÙŠÙ† Ø§Ù„Ø£ØµØ§Ù„Ø© ÙˆØ§Ù„Ø­Ø¯Ø§Ø«Ø© Ø¨Ø£Ø³Ù„ÙˆØ¨ Ø¢Ù…Ù†. ÙŠØ®Ø¶Ø¹ ÙƒÙ„ Ù…ØªÙ‚Ø¯Ù… Ù„Ø¹Ù…Ù„ÙŠØ© ØªØ¯Ù‚ÙŠÙ‚ ÙˆØªÙˆØ«ÙŠÙ‚ Ø´Ø§Ù…Ù„Ø© Ù„Ø¶Ù…Ø§Ù† Ø¬Ø¯ÙŠØ© Ø§Ù„Ù†ÙˆØ§ÙŠØ§ ÙˆØ­ÙØ¸ ÙƒØ±Ø§Ù…Ø© ÙˆØ®ØµÙˆØµÙŠØ© Ø§Ù„Ø¹Ø§Ø¦Ù„Ø§Øª Ø§Ù„ÙƒØ±ÙŠÙ…Ø© ÙÙŠ Ø¹Ù…ÙˆÙ… Ù…Ø­Ø§ÙØ¸Ø§Øª Ø§Ù„Ø¹Ø±Ø§Ù‚.",
                  "Ø¦ÛŽÙ…Û• Ù…Û†Ø¯ÛŽØ±Ù†Û• Ùˆ Ø¯Ø§Ø¨ÙˆÙ†Û•Ø±ÛŒØª Ú©Û†Ø¯Û•Ú©Û•ÛŒÙ†Û•ÙˆÛ• Ø¨Û• Ø´ÛŽÙˆØ§Ø²ÛŽÚ©ÛŒ Ø¨ÛŽÙˆÛ•ÛŒ. Ù‡Û•Ù…ÙˆÙˆ Ù¾Ú•Û†ÙØ§ÛŒÙ„Û•Ú©Ø§Ù† Ù¾Ø´ØªÚ•Ø§Ø³Øª Ø¯Û•Ú©Ø±ÛŽÙ†Û•ÙˆÛ• Ø¨Û† Ø¯ÚµÙ†ÛŒØ§Ø¨ÙˆÙˆÙ† Ù„Û• Ú•Ø§Ø³ØªÚ¯Û†ÛŒÛŒ Ú©Ø§Ø±Û•Ú©Ø§Ù† Ù„Û• Ù¡Ù© Ù¾Ø§Ø±ÛŽØ²Ú¯Ø§Ú©Û•ÛŒ Ø¹ÛŽØ±Ø§Ù‚."
                )}
              </p>

              {/* Core Features list with clean styling */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs font-semibold text-stone-100">
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 p-3 rounded-xl">
                  <span className="text-lg">ðŸ’¼</span>
                  <div>
                    <p className="font-extrabold text-amber-300">{txt("100% Manual Vetting", "ØªØ¯Ù‚ÙŠÙ‚ Ø¨Ø´Ø±ÙŠ ÙƒØ§Ù…Ù„", "Ù¾Ø¯Ø§Ú†ÙˆÙˆÙ†Û•ÙˆÛ•ÛŒ Ø¯Û•Ø³ØªÛŒ Ù¡Ù Ù Ùª")}</p>
                    <p className="text-[10px] text-stone-400 font-medium">{txt("Employment & ID checks", "ØªÙˆØ«ÙŠÙ‚ Ø§Ù„Ù‡ÙˆÙŠØ© ÙˆØ§Ù„Ø¹Ù…Ù„", "Ù¾Ø´ØªÚ•Ø§Ø³ØªÚ©Ø±Ø¯Ù†Û•ÙˆÛ•ÛŒ Ú©Ø§Ø±")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 p-3 rounded-xl">
                  <span className="text-lg">ðŸ›¡ï¸</span>
                  <div>
                    <p className="font-extrabold text-amber-300">{txt("Privacy Secured", "Ø®ØµÙˆØµÙŠØ© Ù…ØµÙˆÙ†Ø©", "Ù¾Ø§Ø±Ø§Ø³ØªÙ†ÛŒ ØªÛ•ÙˆØ§ÙˆÛŒ Ù†Ù‡ÛŽÙ†ÛŒ")}</p>
                    <p className="text-[10px] text-stone-400 font-medium">{txt("Blur portraits on demand", "ØªÙ…ÙˆÙŠÙ‡ Ø§Ù„ØµÙˆØ± Ù„Ù„Ø¹Ø±Ø§Ø¦Ø³", "Ù„ÛŽÚµÚ©Ø±Ø¯Ù†ÛŒ ÙˆÛŽÙ†Û• Ø¨Û•Ù¾ÛŽÛŒ Ø®ÙˆØ§Ø³Øª")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 p-3 rounded-xl">
                  <span className="text-lg">ðŸ¤</span>
                  <div>
                    <p className="font-extrabold text-amber-300">{txt("Wali Involvement", "Ø¥Ø´Ø±Ø§Ùƒ Ø£ÙˆÙ„ÙŠØ§Ø¡ Ø§Ù„Ø£Ù…ÙˆØ±", "Ø¦Ø§Ú¯Ø§Ø¯Ø§Ø±Ú©Ø±Ø¯Ù†Û•ÙˆÛ•ÛŒ Ø³Û•Ø±Ù¾Û•Ø±Ø´ØªÛŒØ§Ø±")}</p>
                    <p className="text-[10px] text-stone-400 font-medium">{txt("Chaperoned introductions", "Ø®Ø·ÙˆØ¨Ø© ÙˆÙ‚ÙˆØ±Ø© ÙˆØ¹Ø§Ø¦Ù„ÙŠØ©", "Ù¾Ú•Û†Ø³Û•ÛŒ ÙÛ•Ø±Ù…ÛŒ Ùˆ Ø¹Ø§Ø¦Ù„ÛŒ")}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Hero Right Column: stats widget */}
            <div className="lg:col-span-4 bg-white/10 border border-white/15 rounded-2xl p-5 text-center space-y-4 shadow-xl backdrop-blur-md">
              <span className="text-[10px] font-mono font-black text-amber-400 uppercase tracking-widest block">
                â­ {txt("IRAQ STATISTICS", "Ù…Ø¤Ø´Ø±Ø§Øª Ø§Ù„Ù†Ø¬Ø§Ø­ Ø§Ù„Ù…Ø¨Ø§Ø±Ùƒ", "Ø¦Ø§Ù…Ø§Ø±Û•Ú©Ø§Ù†ÛŒ Ø³Û•Ø±Ú©Û•ÙˆØªÙ†")}
              </span>
              <div className="grid grid-cols-2 gap-2 text-start">
                <div className="bg-black/20 p-3 rounded-xl">
                  <span className="block text-[8px] font-mono text-stone-400 uppercase">{txt("Verified Applicants", "Ø§Ù„Ø£Ø¹Ø¶Ø§Ø¡ Ø§Ù„Ù…ÙˆØ«Ù‚ÙˆÙ†", "Ú©Ø§Ù†Ø¯ÛŒØ¯Û•Ú©Ø§Ù†")}</span>
                  <span className="text-lg font-serif font-black text-white">24,580+</span>
                </div>
                <div className="bg-black/20 p-3 rounded-xl">
                  <span className="block text-[8px] font-mono text-stone-400 uppercase">{txt("Blessed Marriages", "Ø²ÙŠØ¬Ø§Øª Ù…Ø¨Ø§Ø±ÙƒØ©", "Ù‡Ø§ÙˆØ³Û•Ø±Ú¯ÛŒØ±ÛŒ Ø³Û•Ø±Ú©Û•ÙˆØªÙˆÙˆ")}</span>
                  <span className="text-lg font-serif font-black text-emerald-400">1,412+</span>
                </div>
              </div>

              <div className="p-3 bg-amber-500/10 border border-amber-500/25 rounded-xl text-xs text-amber-200 font-semibold leading-relaxed text-start flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 animate-pulse" />
                <p>{txt(
                  "Join our verified circle and discover candidates based on profound cultural, religious, and lifestyle alignment.",
                  "Ø§Ù†Ø¶Ù… Ù„ØµÙÙˆØªÙ†Ø§ Ø§Ù„Ù…Ø¨Ø§Ø±ÙƒØ© ÙˆØ§ÙƒØªØ´Ù Ø§Ù„Ø´Ø±ÙŠÙƒ Ø§Ù„Ø£Ù†Ø³Ø¨ Ø§Ù„Ù…ØªÙˆØ§ÙÙ‚ Ù…Ø¹Ùƒ Ø¹Ù‚Ø§Ø¦Ø¯ÙŠØ§Ù‹ ÙˆØ«Ù‚Ø§ÙÙŠØ§Ù‹ ÙˆØ§Ø¬ØªÙ…Ø§Ø¹ÙŠØ§Ù‹.",
                  "Ø¨Ø¨Û•Ø±Û• Ø¦Û•Ù†Ø¯Ø§Ù… Ù„Û• Ø®ÛŽØ²Ø§Ù†ÛŒ Ù¾ÛŒØ±Û†Ø²Ù…Ø§Ù† Ø¨Û† Ø¯Û†Ø²ÛŒÙ†Û•ÙˆÛ•ÛŒ Ø´ÛŒØ§ÙˆØªØ±ÛŒÙ† Ù‡Ø§ÙˆØ³Û•Ø±."
                )}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- HOME NAVIGATION TABS ----------------- */}
      <section className="sticky top-0 md:top-20 z-40 bg-warm-ivory/95 backdrop-blur-md py-4 border-b border-[#E8DCC4]/50 shadow-xs" id="home-navigation-tabs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-[#FAF8F5]/80 border border-[#E8DCC4] rounded-2xl sm:rounded-3xl p-1.5 sm:p-2 flex gap-2 shadow-inner">
            
            {/* Tab 1: Discover Member */}
            <button
              onClick={() => {
                setHomeTab('discover');
                showToast(txt("Opening candidate discovery filters...", "Ø¬Ø§Ø±ÙŠ Ø§Ù„Ø§Ù†ØªÙ‚Ø§Ù„ Ù„Ø³Ø§Ø­Ø© Ø§Ø³ØªÙƒØ´Ø§Ù Ø§Ù„Ø£Ø¹Ø¶Ø§Ø¡...", "Ú©Ø±Ø¯Ù†Û•ÙˆÛ•ÛŒ ÙÙ„ØªÛ•Ø±ÛŒ Ú©Ø§Ù†Ø¯ÛŒØ¯Û•Ú©Ø§Ù†..."));
              }}
              className={`flex-1 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-black transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                homeTab === 'discover'
                  ? 'bg-gradient-to-r from-[#40798C] to-[#2F5866] text-white shadow-lg shadow-[#40798C]/25'
                  : 'bg-transparent text-stone-500 hover:text-warm-charcoal hover:bg-stone-50/50'
              }`}
            >
              <Compass className={`w-4 h-4 sm:w-5 sm:h-5 ${homeTab === 'discover' ? 'animate-spin-slow' : ''}`} />
              <span>{txt("Discover Member", "Ø§Ø³ØªÙƒØ´Ø§Ù Ø§Ù„Ø£Ø¹Ø¶Ø§Ø¡", "Ø¯Û†Ø²ÛŒÙ†Û•ÙˆÛ•ÛŒ Ø¦Û•Ù†Ø¯Ø§Ù…")}</span>
            </button>

            {/* Tab 2: Marriage Cafe */}
            <button
              onClick={() => {
                setHomeTab('cafe');
                showToast(txt("Entering Marriage CafÃ© social feed...", "Ø¬Ø§Ø±ÙŠ ÙØªØ­ Ù…Ù‚Ù‡Ù‰ ÙˆÙ…Ø¬Ù„Ø³ Ø§Ù„Ø²ÙˆØ§Ø¬ Ø§Ù„ØªÙØ§Ø¹Ù„ÙŠ...", "Ú†ÙˆÙˆÙ†Û• Ù†Ø§Ùˆ Ú†Ø§ÛŒØ®Ø§Ù†Û•ÛŒ Ù‡Ø§ÙˆØ³Û•Ø±Ú¯ÛŒØ±ÛŒ..."));
              }}
              className={`flex-1 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-black transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                homeTab === 'cafe'
                  ? 'bg-gradient-to-r from-accent-coral to-accent-pink text-white shadow-lg shadow-accent-coral/25'
                  : 'bg-transparent text-stone-500 hover:text-warm-charcoal hover:bg-stone-50/50'
              }`}
            >
              <Coffee className={`w-4 h-4 sm:w-5 sm:h-5 ${homeTab === 'cafe' ? 'animate-pulse' : ''}`} />
              <span>{txt("Marriage CafÃ© (Social)", "Ù…Ù‚Ù‡Ù‰ Ø§Ù„Ø²ÙˆØ§Ø¬ Ø§Ù„ØªÙØ§Ø¹Ù„ÙŠ", "Ú†Ø§ÛŒØ®Ø§Ù†Û•ÛŒ Ù‡Ø§ÙˆØ³Û•Ø±Ú¯ÛŒØ±ÛŒ")}</span>
              <span className="hidden sm:inline bg-white/20 text-white text-[9px] px-2 py-0.5 rounded-full font-mono font-extrabold animate-pulse">
                LIVE FEED
              </span>
            </button>

          </div>
        </div>
      </section>

      {/* ----------------- DYNAMIC TAB RENDERING ----------------- */}
      {homeTab === 'discover' ? (
        <section className="py-2 space-y-8" id="governorate-matrimonial-portal">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            
            {/* NEARBY CANDIDATES SECTION (BY LOCATION) */}
            <div className="bg-[#FAF7F2] border border-[#E8DCC4] rounded-[2rem] p-5 sm:p-7 space-y-4 shadow-sm text-start">
              <div className="flex justify-between items-center flex-wrap gap-2 text-start">
                <div>
                  <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-700 px-2.5 py-0.5 rounded-full text-[9px] font-mono font-extrabold uppercase animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    {txt("Active Nearby Candidates", "Ù†Ø´Ø·ÙˆÙ† Ø¨Ø§Ù„Ù‚Ø±Ø¨ Ù…Ù†Ùƒ Ø§Ù„Ø¢Ù†", "Ú©Ø§Ù†Ø¯ÛŒØ¯Û• Ú†Ø§Ù„Ø§Ú©Û•Ú©Ø§Ù†ÛŒ Ù†Ø²ÛŒÚ©Øª")}
                  </span>
                  <h4 className="text-sm sm:text-lg font-serif font-black text-warm-charcoal flex items-center gap-1 mt-1">
                    <span>ðŸ“ {txt(`Candidates Nearby in ${getGovDisplayName(selectedGov === 'all' ? (userProfile?.governorate || 'Baghdad') : selectedGov)}`, `Ø¹Ø±ÙˆØ¶ Ù…Ù‚ÙŠÙ…Ø© ÙÙŠ ${getGovDisplayName(selectedGov === 'all' ? (userProfile?.governorate || 'Baghdad') : selectedGov)}`, `Ú©Ø§Ù†Ø¯ÛŒØ¯Û• Ù†Ø²ÛŒÚ©Û•Ú©Ø§Ù†ÛŒ ${getGovDisplayName(selectedGov === 'all' ? (userProfile?.governorate || 'Baghdad') : selectedGov)}`)}</span>
                  </h4>
                </div>
                <p className="text-[10px] text-stone-500 font-bold max-w-sm">
                  ðŸ“Œ {txt("Based on selected governorate or your profile location.", "ØªÙ„Ù‚Ø§Ø¦ÙŠØ§Ù‹ Ø­Ø³Ø¨ Ù…ÙˆÙ‚Ø¹Ùƒ Ø§Ù„Ø­Ø§Ù„ÙŠ Ø£Ùˆ Ø®ÙŠØ§Ø± Ø§Ù„Ù…Ø­Ø§ÙØ¸Ø© Ø§Ù„Ù…ÙØ¹Ù‘Ù„.", "Ø¨Û•Ù¾ÛŽÛŒ Ø´ÙˆÛŽÙ†ÛŒ Ø¯ÛŒØ§Ø±ÛŒÚ©Ø±Ø§Ùˆ ÛŒØ§Ù† Ù¾Ú•Û†ÙØ§ÛŒÙ„Û•Ú©Û•Øª.")}
                </p>
              </div>

              {nearbyMatches.length > 0 ? (
                /* Swiper horizontal wrapper styled elegantly for mobile */
                <div className="flex gap-4 overflow-x-auto pb-3 pt-1 scrollbar-thin snap-x scroll-smooth">
                  {nearbyMatches.slice(0, 8).map((candidate) => {
                    const isFemale = candidate.gender === 'female';
                    return (
                      <div
                        key={`nearby-${candidate.id}`}
                        onClick={() => handleProfileClick(candidate)}
                        className="snap-start shrink-0 w-64 bg-white hover:bg-[#FCFBF9] border border-stone-200/80 hover:border-accent-coral/30 rounded-2xl p-4 transition-all duration-300 flex flex-col justify-between space-y-3 relative group shadow-xs hover:shadow-md cursor-pointer text-start"
                      >
                        <div className="space-y-2">
                          {/* Compact portrait with privacy constraints */}
                          <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-stone-100 flex items-center justify-center">
                            {isFemale ? (
                              <>
                                <img
                                  src={candidate.avatarUrl}
                                  alt={candidate.name}
                                  className="w-full h-full object-cover blur-md scale-110 opacity-90 select-none pointer-events-none"
                                  referrerPolicy="no-referrer"
                                />
                                <div className="absolute inset-0 bg-stone-900/10 backdrop-blur-[4px] flex flex-col items-center justify-center p-2 text-center">
                                  <div className="w-10 h-10 rounded-full bg-[#FAF7F2] border border-accent-pink/30 flex items-center justify-center text-accent-pink font-serif font-black text-xs shadow-sm">
                                    {candidate.name.charAt(0)}
                                  </div>
                                  <span className="mt-1 text-[8px] font-bold text-stone-800 bg-white/95 px-1.5 py-0.5 rounded-full shadow-inner">
                                    ðŸ”’ {txt("Photo Protected", "Ø§Ù„ØµÙˆØ±Ø© Ù…Ø­Ù…ÙŠØ©", "ÙˆÛŽÙ†Û• Ù¾Ø§Ø±ÛŽØ²Ø±Ø§ÙˆÛ•")}
                                  </span>
                                </div>
                              </>
                            ) : (
                              <>
                                <img
                                  src={candidate.avatarUrl}
                                  alt={candidate.name}
                                  className="w-full h-full object-cover grayscale-[10%] group-hover:scale-102 transition duration-300"
                                  referrerPolicy="no-referrer"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                                <span className="absolute bottom-1.5 left-1.5 text-[8px] font-mono font-extrabold text-white bg-black/45 px-1.5 py-0.5 rounded-md">
                                  {txt("Verified", "Ø­Ø³Ø§Ø¨ Ù…ÙˆØ«Ù‚", "Ù¾Ø´ØªÚ•Ø§Ø³ØªÚ©Ø±Ø§ÙˆÛ•")}
                                </span>
                              </>
                            )}

                            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse" />
                          </div>

                          {/* Candidate basic data */}
                          <div>
                            <div className="flex items-center justify-between">
                              <h5 className="font-serif font-black text-xs sm:text-sm text-warm-charcoal truncate">
                                {isFemale ? txt(candidate.name, candidate.nameAr, candidate.nameCkb) : candidate.name}
                                <span className="text-[10px] text-stone-400 font-mono"> ({candidate.age})</span>
                              </h5>
                              <span className="text-[8px] font-mono font-black text-[#40798C] bg-[#40798C]/10 px-1.5 py-0.5 rounded">
                                {candidate.compatibilityScore}%
                              </span>
                            </div>
                            <p className="text-[9.5px] font-semibold text-stone-500 truncate flex items-center gap-0.5 mt-0.5">
                              ðŸ’¼ {candidate.profession}
                            </p>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[9px] font-bold text-[#40798C]">
                          <span>ðŸ“ {getGovDisplayName(candidate.governorate)}</span>
                          <span className="text-accent-coral flex items-center gap-0.5">
                            <span>{txt("View âž”", "ØªÙØ§ØµÙŠÙ„ âž”", "Ø¨ÛŒÙ†ÛŒÙ† âž”")}</span>
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-8 text-center space-y-2 bg-[#FAF8F5] rounded-2xl border border-dashed border-[#E6DCC3]/80">
                  <Users className="w-8 h-8 text-stone-300 mx-auto" />
                  <p className="text-xs font-bold text-stone-400">
                    {txt(
                      `No active profiles registered in ${getGovDisplayName(selectedGov === 'all' ? (userProfile?.governorate || 'Baghdad') : selectedGov)} yet. Try adjusting your gender filter.`,
                      `Ù„Ø§ ÙŠÙˆØ¬Ø¯ Ø¹Ø±Ø³Ø§Ù† Ø£Ùˆ Ø¹Ø±Ø§Ø¦Ø³ Ù…Ø³Ø¬Ù„ÙˆÙ† ÙÙŠ ${getGovDisplayName(selectedGov === 'all' ? (userProfile?.governorate || 'Baghdad') : selectedGov)} Ø­Ø§Ù„ÙŠØ§Ù‹.`,
                      `Ù‡ÛŒÚ† Ú©Ø§Ù†Ø¯ÛŒØ¯ÛŽÚ© Ù„Û•Ù… Ø´ÙˆÛŽÙ†Û• Ù†ÛŒÛŒÛ•.`
                    )}
                  </p>
                </div>
              )}
            </div>

            {/* Section Header */}
            <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="inline-flex items-center space-x-1.5 rtl:space-x-reverse bg-accent-coral/10 text-accent-coral px-3.5 py-1.5 rounded-full text-[10px] sm:text-xs font-mono font-black uppercase tracking-widest">
              <MapPin className="w-3.5 h-3.5" />
              <span>{txt("Governorate Matrimonial Portal", "Ø¨ÙˆØ§Ø¨Ø© Ø§Ù„Ù…Ø­Ø§ÙØ¸Ø§Øª Ø§Ù„Ø¹Ø±Ø§Ù‚ÙŠØ© Ù„Ù„Ø²ÙˆØ§Ø¬ Ø§Ù„Ø­Ù„Ø§Ù„", "Ø¯Û•Ø±ÙˆØ§Ø²Û•ÛŒ Ù‡Ø§ÙˆØ³Û•Ø±Ú¯ÛŒØ±ÛŒ Ù¾Ø§Ø±ÛŽØ²Ú¯Ø§Ú©Ø§Ù†")}</span>
            </span>
            <h3 className="text-2xl sm:text-3.5xl font-serif font-black text-warm-charcoal tracking-tight">
              {txt("Find Serious Candidates by Governorate", "Ø§Ø¨Ø­Ø« Ø¹Ù† Ø´Ø±ÙŠÙƒ Ø§Ù„Ø¹Ù…Ø± Ø­Ø³Ø¨ Ø§Ù„Ù…Ø­Ø§ÙØ¸Ø©", "Ù‡Ø§ÙˆØ¨Û•Ø´ÛŒ Ú¯ÙˆÙ†Ø¬Ø§Ùˆ Ø¨Û•Ù¾ÛŽÛŒ Ù¾Ø§Ø±ÛŽØ²Ú¯Ø§ Ø¨Ø¯Û†Ø²Û•ÙˆÛ•")}
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 font-medium leading-relaxed">
              {txt(
                "Select any of the 19 Iraqi governorates to discover serious, verified candidates living nearby. Use our precise filters to explore compatible lifestyles.",
                "Ø§Ø®ØªØ± Ø£ÙŠ Ù…Ù† Ø§Ù„Ù…Ø­Ø§ÙØ¸Ø§Øª Ø§Ù„Ù€ Ù¡Ù© ÙÙŠ Ø§Ù„Ø¹Ø±Ø§Ù‚ Ù„Ø§Ø³ØªØ¹Ø±Ø§Ø¶ Ù…Ù„ÙØ§Øª Ø¬Ø§Ø¯Ø© ÙˆÙ…ÙˆØ«Ù‚Ø© Ù…Ù‚ÙŠÙ…Ø© Ø¨Ø§Ù„Ù‚Ø±Ø¨ Ù…Ù†ÙƒØŒ ÙˆØ§ÙƒØªØ´Ù Ù…Ø¯Ù‰ Ø§Ù„ØªÙˆØ§ÙÙ‚ Ø§Ù„Ø§Ø¬ØªÙ…Ø§Ø¹ÙŠ ÙˆØ§Ù„Ø«Ù‚Ø§ÙÙŠ.",
                "ÛŒÛ•Ú©ÛŽÚ© Ù„Û• Ù¡Ù© Ù¾Ø§Ø±ÛŽØ²Ú¯Ø§Ú©Û•ÛŒ Ø¹ÛŽØ±Ø§Ù‚ Ø¯ÛŒØ§Ø±ÛŒ Ø¨Ú©Û• Ø¨Û† Ø¯Û†Ø²ÛŒÙ†Û•ÙˆÛ•ÛŒ Ú©Û•Ø³Ø§Ù†ÛŒ Ø¬Ø¯ÛŒ Ùˆ Ù¾Ø´ØªÚ•Ø§Ø³ØªÚ©Ø±Ø§ÙˆÛ• Ú©Û• Ù„Û• Ù†Ø²ÛŒÚ©ØªÛ•ÙˆÛ• Ø¯Û•Ú˜ÛŒÙ†."
              )}
            </p>
          </div>

          {/* PORTAL INTERACTION BOX */}
          <div className="bg-white/60 backdrop-blur-md border border-[#E8DCC4] rounded-[2.5rem] p-6 sm:p-8 shadow-xl space-y-6 text-start">
            
            {/* CLEAN FILTER AREA */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end bg-[#FAF8F5] border border-[#E6DCC3] rounded-3xl p-5 sm:p-6 mb-6">
              
              {/* 1. Governorate Filter */}
              <div className="space-y-2 text-start">
                <label className="block text-xs font-mono font-extrabold text-[#9C7F59] uppercase tracking-wider">
                  ðŸ“ {txt("Governorate / Location", "Ø§Ù„Ù…Ø­Ø§ÙØ¸Ø© Ø£Ùˆ Ø§Ù„Ù…ÙˆÙ‚Ø¹", "Ù¾Ø§Ø±ÛŽØ²Ú¯Ø§ ÛŒØ§Ù† Ø´ÙˆÛŽÙ†")}
                </label>
                <div className="relative">
                  <select
                    value={selectedGov || 'all'}
                    onChange={(e) => {
                      setSelectedGov(e.target.value);
                      const name = e.target.value === 'all' 
                        ? txt("All Iraq", "ÙƒÙ„ Ø§Ù„Ø¹Ø±Ø§Ù‚", "Ù‡Û•Ù…ÙˆÙˆ Ø¹ÛŽØ±Ø§Ù‚")
                        : getGovDisplayName(e.target.value);
                      showToast(txt(`Location updated: ${name}`, `ØªÙ… ØªØ­Ø¯ÙŠØ¯ Ø§Ù„Ù…ÙˆÙ‚Ø¹: ${name}`, `Ø´ÙˆÛŽÙ† Ø¯ÛŒØ§Ø±ÛŒÚ©Ø±Ø§: ${name}`));
                    }}
                    className="w-full pl-9 pr-4 py-3 bg-white text-warm-charcoal border border-[#E6DCC3] rounded-xl text-xs sm:text-sm font-black outline-none cursor-pointer hover:border-accent-coral/30 transition shadow-inner"
                  >
                    <option value="all" className="text-warm-charcoal font-black">
                      {txt("ðŸŒ All Iraq", "ðŸŒ ÙƒÙ„ Ø§Ù„Ø¹Ø±Ø§Ù‚", "ðŸŒ Ù‡Û•Ù…ÙˆÙˆ Ø¹ÛŽØ±Ø§Ù‚")}
                    </option>
                    {GOVERNORATE_OPTIONS.map((gov) => (
                      <option key={gov.id} value={gov.id} className="text-warm-charcoal font-bold">
                        {locale === 'en' ? gov.en : locale === 'ckb' ? gov.ckb : gov.ar}
                      </option>
                    ))}
                  </select>
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-accent-coral" />
                </div>
              </div>

              {/* 2. Age Range Filter */}
              <div className="space-y-2 text-start md:col-span-2">
                <label className="block text-xs font-mono font-extrabold text-[#9C7F59] uppercase tracking-wider flex items-center justify-between">
                  <span>ðŸ‘¥ {txt("Required Age Range", "ÙØ¦Ø© Ø§Ù„Ø¹Ù…Ø± Ø§Ù„Ù…Ø·Ù„ÙˆØ¨Ø©", "ØªÛ•Ù…Û•Ù†ÛŒ Ø¯Ø§ÙˆØ§Ú©Ø±Ø§Ùˆ")}</span>
                  <span className="text-accent-coral font-sans font-extrabold bg-accent-coral/10 px-2 py-0.5 rounded-md text-[10px]">
                    {minAge} - {maxAge} {txt("years old", "Ø³Ù†Ø©", "Ø³Ø§Úµ")}
                  </span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <select
                      value={minAge}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        if (val <= maxAge) {
                          setMinAge(val);
                        } else {
                          setMinAge(val);
                          setMaxAge(Math.min(80, val + 5));
                        }
                      }}
                      className="w-full pl-8 pr-3 py-3 bg-white text-warm-charcoal border border-[#E6DCC3] rounded-xl text-xs font-black outline-none cursor-pointer hover:border-accent-coral/30 transition shadow-inner"
                    >
                      {Array.from({ length: 53 }, (_, i) => i + 18).map((age) => (
                        <option key={`min-${age}`} value={age} className="font-bold">
                          {txt(`From ${age}`, `Ù…Ù† Ø¹Ù…Ø± ${age}`, `Ù„Û• ØªÛ•Ù…Û•Ù†ÛŒ ${age}`)}
                        </option>
                      ))}
                    </select>
                    <User className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
                  </div>
                  <div className="relative">
                    <select
                      value={maxAge}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        if (val >= minAge) {
                          setMaxAge(val);
                        } else {
                          setMaxAge(val);
                          setMinAge(Math.max(18, val - 5));
                        }
                      }}
                      className="w-full pl-8 pr-3 py-3 bg-white text-warm-charcoal border border-[#E6DCC3] rounded-xl text-xs font-black outline-none cursor-pointer hover:border-accent-coral/30 transition shadow-inner"
                    >
                      {Array.from({ length: 53 }, (_, i) => i + 18).map((age) => (
                        <option key={`max-${age}`} value={age} className="font-bold">
                          {txt(`To ${age}`, `Ø¥Ù„Ù‰ Ø¹Ù…Ø± ${age}`, `ØªØ§ ØªÛ•Ù…Û•Ù†ÛŒ ${age}`)}
                        </option>
                      ))}
                    </select>
                    <User className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
                  </div>
                </div>
              </div>

              {/* 3. Gender / Match Preference Column */}
              <div className="space-y-2 text-start">
                <label className="block text-xs font-mono font-extrabold text-[#9C7F59] uppercase tracking-wider">
                  ðŸ’– {txt("I am looking for", "Ø£Ù†Ø§ Ø£Ø¨Ø­Ø« Ø¹Ù†", "Ù…Ù† Ø¯Û•Ú¯Û•Ú•ÛŽÙ… Ø¨Û•Ø¯ÙˆØ§ÛŒ")}
                </label>
                <div className="relative">
                  <select
                    value={genderPref}
                    onChange={(e) => {
                      setGenderPref(e.target.value as any);
                    }}
                    className="w-full pl-9 pr-4 py-3 bg-white text-warm-charcoal border border-[#E6DCC3] rounded-xl text-xs sm:text-sm font-black outline-none cursor-pointer hover:border-accent-coral/30 transition shadow-inner"
                  >
                    <option value="all" className="font-bold">{txt("All Candidates", "Ø§Ù„ÙƒÙ„ (Ø¹Ø±Ø³Ø§Ù† ÙˆØ¹Ø±Ø§Ø¦Ø³)", "Ù‡Û•Ù…ÙˆÙˆ Ú©Ø§Ù†Ø¯ÛŒØ¯Û•Ú©Ø§Ù†")}</option>
                    <option value="female" className="font-bold">ðŸ‘° {txt("Bride (Woman)", "Ø²ÙˆØ¬Ø© ØµØ§Ù„Ø­Ø© (Ø¹Ø±ÙˆØ³)", "Ø¨ÙˆÙˆÚ© (Ú©Ú†)")}</option>
                    <option value="male" className="font-bold">ðŸ¤µ {txt("Groom (Man)", "Ø²ÙˆØ¬ ØµØ§Ù„Ø­ (Ø¹Ø±ÙŠØ³)", "Ø²Ø§ÙˆØ§ (Ú©ÙˆÚ•)")}</option>
                  </select>
                  <Heart className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-accent-pink" />
                </div>
              </div>

            </div>

            {/* BIG SEARCH EXPLORE ACTION ROW */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-gradient-to-r from-stone-50 to-[#FCFBF9] border border-stone-150 rounded-2xl mb-6">
              <div className="text-start space-y-1">
                <span className="inline-flex items-center gap-1 text-[10px] font-mono font-extrabold text-[#40798C] bg-[#40798C]/10 px-2 py-0.5 rounded-full uppercase">
                  âš¡ {txt("Instant Live Filtering", "ØªØµÙÙŠØ© Ø­ÙŠØ© ÙˆÙÙˆØ±ÙŠØ© Ù„Ù„Ù…Ù„ÙØ§Øª", "Ù¾Ø§ÚµØ§ÙˆØªÙ†ÛŒ Ú•Ø§Ø³ØªÛ•ÙˆØ®Û†")}
                </span>
                <p className="text-xs text-stone-600 font-bold leading-snug">
                  {txt(
                    "Displaying real matches below. Click search button below to unlock deep values inside full search page.",
                    "Ù†Ø¹Ø±Ø¶ Ù„Ùƒ Ø§Ù„Ù…Ù„ÙØ§Øª Ø§Ù„Ù…ØªÙˆØ§ÙÙ‚Ø© Ù…Ø¹ Ø®ÙŠØ§Ø±Ø§ØªÙƒ Ø¨Ø§Ù„Ø£Ø³ÙÙ„ Ù…Ø¨Ø§Ø´Ø±Ø©. Ø§Ø¶ØºØ· Ù„Ù„Ø¨Ø­Ø« Ø§Ù„ÙƒØ§Ù…Ù„ Ù„Ø§Ø³ØªÙƒØ´Ø§Ù Ù…Ø±Ø´Ø­Ø§Øª Ø¥Ø¶Ø§ÙÙŠØ©.",
                    "Ù‡Ø§ÙˆØªØ§ Ú•Ø§Ø³ØªÛ•Ù‚ÛŒÙ†Û•Ú©Ø§Ù† Ù„Û• Ø®ÙˆØ§Ø±Û•ÙˆÛ• Ù¾ÛŒØ´Ø§Ù† Ø¯Û•Ø¯Ø±ÛŽÙ†. Ø¨Û† Ø¨ÛŒÙ†ÛŒÙ†ÛŒ Ù‡Û•Ù…ÙˆÙˆ ÙÙ„ØªÛ•Ø±Û•Ú©Ø§Ù† Ú©Ù„ÛŒÚ© Ø¨Ú©Û•."
                  )}
                </p>
              </div>
              
              <button
                onClick={() => {
                  // Save filters into localStorage so they pre-populate the MatchExplorerScreen perfectly
                  localStorage.setItem('home_filter_governorate', selectedGov);
                  localStorage.setItem('home_filter_minAge', String(minAge));
                  localStorage.setItem('home_filter_maxAge', String(maxAge));
                  localStorage.setItem('home_filter_gender', genderPref);
                  
                  // Notify and navigate
                  showToast(txt(
                    "ðŸ” Opening the advanced matchmaking pool with your filters...",
                    "ðŸ” Ø¬Ø§Ø±ÙŠ ÙØªØ­ Ø¨ÙˆØ§Ø¨Ø© Ø§Ù„Ø¨Ø­Ø« Ø§Ù„Ù…Ø¨Ø§Ø±Ùƒ Ø¨Ø§Ù„Ù…Ø±Ø´Ø­Ø§Øª Ø§Ù„ØªÙŠ Ø§Ø®ØªØ±ØªÙ‡Ø§...",
                    "ðŸ” Ú©Ø±Ø¯Ù†Û•ÙˆÛ•ÛŒ Ø¯Û•Ø±ÙˆØ§Ø²Û•ÛŒ Ù‡Ø§ÙˆØ³Û•Ø±Ú¯ÛŒØ±ÛŒ Ø¨Û• ÙÙ„ØªÛ•Ø±Û•Ú©Ø§Ù†ØªÛ•ÙˆÛ•..."
                  ));
                  
                  setTimeout(() => {
                    onExploreMatches();
                  }, 600);
                }}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#40798C] to-[#2F5866] hover:opacity-95 text-white font-black text-xs sm:text-sm shadow-lg shadow-[#40798C]/20 active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer shrink-0"
                id="homepage-main-search-explore-btn"
              >
                <Compass className="w-5 h-5 text-white animate-spin-slow" />
                <span>
                  {txt("Search & Explore Matches", "Ø§Ù„Ø¨Ø­Ø« ÙˆØ§Ø³ØªÙƒØ´Ø§Ù Ø§Ù„Ø¹Ø±ÙˆØ¶", "Ú¯Û•Ú•Ø§Ù† Ùˆ Ø¨ÛŒÙ†ÛŒÙ†ÛŒ Ú©Ø§Ù†Ø¯ÛŒØ¯Û•Ú©Ø§Ù†")}
                </span>
                <ArrowRight className="w-4 h-4 text-white transform rtl:rotate-180" />
              </button>
            </div>

            {/* PROFILE INCOMPLETE ALERT BANNER */}
            {isProfileIncomplete && (
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs animate-fade-in text-start mb-6" id="complete-profile-banner">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">âš ï¸</span>
                    <h4 className="text-base sm:text-lg font-serif font-black text-amber-900">
                      {txt("Complete Your Marriage Profile", "Ø£ÙƒÙ…Ù„ Ù…Ù„Ù Ø§Ù„Ø²ÙˆØ§Ø¬ Ø§Ù„Ù…Ø¨Ø§Ø±Ùƒ", "Ù¾Ú•Û†ÙØ§ÛŒÙ„ÛŒ Ù‡Ø§ÙˆØ³Û•Ø±Ú¯ÛŒØ±ÛŒÛ•Ú©Û•Øª ØªÛ•ÙˆØ§Ùˆ Ø¨Ú©Û•")}
                    </h4>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-full font-mono">
                      {txt("Onboarding Pending", "Ø§Ù„Ù…Ù„Ù Ø§Ù„Ø´Ø®ØµÙŠ Ù…Ø¹Ù„Ù‘Ù‚", "Ù¾Ú•Û†ÙØ§ÛŒÙ„ Ú†Ø§ÙˆÛ•Ú•ÙˆØ§Ù†Ú©Ø±Ø§ÙˆÛ•")}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-amber-800 font-medium leading-relaxed max-w-2xl">
                    {txt(
                      "You can search and explore matches freely. However, to express serious marital interest, send postcards, or build custom serious connections, you must complete your full marriage profile form.",
                      "ÙŠÙ…ÙƒÙ†Ùƒ Ø§Ù„Ø¨Ø­Ø« ÙˆØ§Ø³ØªÙƒØ´Ø§Ù Ø§Ù„Ø´Ø±ÙƒØ§Ø¡ Ø¨Ø­Ø±ÙŠØ© ÙƒØ§Ù…Ù„Ø©ØŒ ÙˆÙ„ÙƒÙ† Ù„Ø¥Ø±Ø³Ø§Ù„ Ø·Ù„Ø¨Ø§Øª Ø§Ù„ØªØ¹Ø§Ø±Ù Ø§Ù„Ø¬Ø§Ø¯Ø© ÙˆØ§Ù„Ø¨Ø·Ø§Ù‚Ø§Øª Ø§Ù„Ø¨Ø±ÙŠØ¯ÙŠØ© ÙˆØ¨Ø¯Ø¡ ØªÙˆØ§ØµÙ„ ÙˆÙ‚ÙˆØ±ØŒ ÙŠØ±Ø¬Ù‰ Ù…Ù„Ø¡ Ø§Ø³ØªÙ…Ø§Ø±Ø© Ù…Ù„ÙÙƒ Ø§Ù„Ø´Ø®ØµÙŠ Ø¨Ø§Ù„ÙƒØ§Ù…Ù„.",
                      "Ø¯Û•ØªÙˆØ§Ù†ÛŒØª Ú©Ø§Ù†Ø¯ÛŒØ¯Û•Ú©Ø§Ù† Ø¨Û• Ø³Û•Ø±Ø¨Û•Ø³ØªÛŒ Ø¨Ø¨ÛŒÙ†ÛŒ Ùˆ Ø¨Ú¯Û•Ú•ÛŽÛŒØªØŒ Ø¨Û•ÚµØ§Ù… Ø¨Û† Ø¯Û•Ø±Ø¨Ú•ÛŒÙ†ÛŒ Ù†ÛŒÛ•ØªÛŒ Ø¬Ø¯ÛŒ Ù‡Ø§ÙˆØ³Û•Ø±Ú¯ÛŒØ±ÛŒ ÛŒØ§Ù† Ù†Ø§Ø±Ø¯Ù†ÛŒ Ù†Ø§Ù…Û•ÛŒ Ù¾ÛŽØ´Û•Ú©ÛŒØŒ Ø¯Û•Ø¨ÛŽØª Ù¾Ú•Û†ÙØ§ÛŒÙ„ÛŒ Ø®Û†Øª Ø¨Û• ØªÛ•ÙˆØ§ÙˆÛŒ Ù¾Ú•Ø¨Ú©Û•ÛŒØªÛ•ÙˆÛ•."
                    )}
                  </p>
                </div>
                <button
                  onClick={() => setTab('onboarding')}
                  className="w-full md:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 hover:opacity-95 text-white font-black text-xs sm:text-sm shadow-md shadow-amber-600/10 active:scale-95 transition shrink-0 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>{txt("Complete Form Now", "Ø£ÙƒÙ…Ù„ Ø§Ù„Ø§Ø³ØªÙ…Ø§Ø±Ø© Ø§Ù„Ø¢Ù†", "Ø¦ÛŽØ³ØªØ§ Ù¾Ú•Û†ÙØ§ÛŒÙ„Û•Ú©Û• ØªÛ•ÙˆØ§Ùˆ Ø¨Ú©Û•")}</span>
                </button>
              </div>
            )}

            {/* RESULTS MATCHES GRID */}
            {filteredMatches.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {filteredMatches.slice(0, 8).map((candidate) => {
                  const isFemale = candidate.gender === 'female';

                  return (
                    <div
                      key={candidate.id}
                      onClick={() => handleProfileClick(candidate)}
                      className="group cursor-pointer bg-[#FCFBF9] hover:bg-white border border-[#E6DCC3]/80 hover:border-accent-coral/30 rounded-2xl sm:rounded-3xl p-4 sm:p-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between space-y-4 text-start relative overflow-hidden"
                    >
                      <div className="space-y-3">
                        {/* Avatar photo with forced privacy constraint */}
                        <div className="relative aspect-square w-full rounded-xl sm:rounded-2xl overflow-hidden shadow-inner bg-stone-100 flex items-center justify-center">
                          {isFemale ? (
                            <>
                              {/* FROSTED BLUR FEMALE PORTRAIT - strictly private constraint */}
                              <img
                                src={candidate.avatarUrl}
                                alt={candidate.name}
                                className="w-full h-full object-cover blur-lg scale-110 select-none pointer-events-none opacity-85"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute inset-0 bg-stone-900/10 backdrop-blur-[6px] flex flex-col items-center justify-center text-center p-3">
                                <div className="w-12 h-12 rounded-full bg-[#FAF7F2] border border-accent-pink/30 shadow-md flex items-center justify-center text-accent-pink font-serif font-black text-sm">
                                  {candidate.name.charAt(0)}
                                </div>
                                <span className="mt-2.5 text-[9px] font-bold text-stone-800 bg-[#FAF7F2]/90 border border-[#E8DCC4] px-2 py-1 rounded-full shadow-inner tracking-tight">
                                  ðŸ”’ {txt("Photo Protected", "Ø§Ù„ØµÙˆØ±Ø© Ù…Ø­Ù…ÙŠØ©", "ÙˆÛŽÙ†Û• Ù¾Ø§Ø±ÛŽØ²Ø±Ø§ÙˆÛ•")}
                                </span>
                              </div>
                            </>
                          ) : (
                            <>
                              {/* REALISTIC IRAQI-LOOKING MALE PORTRAITS - unmodified */}
                              <img
                                src={candidate.avatarUrl}
                                alt={candidate.name}
                                className="w-full h-full object-cover grayscale-[12%] group-hover:scale-105 transition-transform duration-500"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                              <span className="absolute bottom-2.5 left-2.5 text-[8px] sm:text-[9px] font-mono font-extrabold text-white bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-md">
                                {txt("Verified Groom", "Ø´Ø§Ø¨ Ø¬Ø§Ø¯ Ù„Ù„Ø²ÙˆØ§Ø¬", "Ø²Ø§ÙˆØ§ Ù¾Ø´ØªÚ•Ø§Ø³ØªÚ©Ø±Ø§ÙˆÛ•")}
                              </span>
                            </>
                          )}
                          
                          {/* Top floating badges */}
                          <div className="absolute top-2 right-2 flex flex-col gap-1 z-10">
                            {candidate.verified && (
                              <span className="bg-emerald-500 text-white p-1 rounded-full shadow-sm" title="Identity Verified">
                                <ShieldCheck className="w-3.5 h-3.5" />
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Name & Basic details */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-serif font-black text-sm sm:text-base text-warm-charcoal group-hover:text-[#40798C] transition-colors flex items-center gap-1">
                              <span>{isFemale ? txt(candidate.name, candidate.nameAr, candidate.nameCkb) : candidate.name}</span>
                              <span className="text-xs text-[#6B635B] font-medium font-mono">({candidate.age})</span>
                            </h4>
                            <span className="text-[10px] font-mono font-black text-[#40798C] bg-[#40798C]/10 px-2 py-0.5 rounded-md">
                              ðŸ’– {candidate.compatibilityScore}%
                            </span>
                          </div>
                          
                          {/* Profession & Education */}
                          <p className="text-[10.5px] font-extrabold text-stone-500 flex items-center gap-1 truncate">
                            <GraduationCap className="w-3.5 h-3.5 text-[#40798C] shrink-0" />
                            <span className="truncate">{candidate.profession}</span>
                          </p>
                          <p className="text-[9.5px] text-stone-400 font-semibold truncate">
                            {candidate.education}
                          </p>
                        </div>
                      </div>

                      {/* Card Footer tags */}
                      <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                        <span className="text-[8.5px] font-bold text-stone-400 font-mono tracking-wider">
                          ðŸ“ {txt(candidate.city, candidate.city, candidate.city)}
                        </span>
                        
                        <span className="text-[9.5px] font-bold text-[#40798C] group-hover:text-accent-coral flex items-center gap-0.5 font-sans">
                          <span>{txt("View Sincere Intention", "ØªÙØ§ØµÙŠÙ„ Ù†ÙŠØ© Ø§Ù„Ø²ÙˆØ§Ø¬", "Ø¨ÛŒÙ†ÛŒÙ†ÛŒ Ù…Û•Ø¨Û•Ø³Øª")}</span>
                          <ArrowRight className="w-3 h-3 transform rtl:rotate-180" />
                        </span>
                      </div>

                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-12 text-center space-y-3 bg-[#FAF8F5] rounded-3xl border border-dashed border-[#E6DCC3]/80">
                <Users className="w-10 h-10 text-stone-300 mx-auto" />
                <p className="text-xs font-bold text-stone-400">
                  {txt("No serious candidates match these categories in this governorate yet.", "Ù„Ø§ ÙŠÙˆØ¬Ø¯ Ø¹Ø±Ø³Ø§Ù† Ø£Ùˆ Ø¹Ø±Ø§Ø¦Ø³ ÙŠØ·Ø§Ø¨Ù‚ÙˆÙ† Ù‡Ø°Ø§ Ø§Ù„ØªØµÙ†ÙŠÙ ÙÙŠ Ù‡Ø°Ù‡ Ø§Ù„Ù…Ø­Ø§ÙØ¸Ø© Ø­Ø§Ù„ÙŠØ§Ù‹.", "Ú©Ø§Ù†Ø¯ÛŒØ¯ÛŽÚ© Ø¨Û† Ø¦Û•Ù… Ø¬Û†Ø±Û• Ù¾Û†Ù„ÛŽÙ†Ú©Ø±Ø¯Ù†Û• Ù„Û•Ù… Ù¾Ø§Ø±ÛŽØ²Ú¯Ø§ÛŒÛ•Ø¯Ø§ Ù†Û•Ø¯Û†Ø²Ø±Ø§ÛŒÛ•ÙˆÛ•.")}
                </p>
              </div>
            )}

            {/* CTAs banner to enter search */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-stone-100 text-xs text-stone-500 font-semibold">
              <p className="text-start leading-snug">
                ðŸ’ {txt(
                  "To protect photos and prevent casual swipe culture, only mutual, serious matches with completed profiles can initiate chaperoned discussion.",
                  "Ù„Ø­Ù…Ø§ÙŠØ© Ø§Ù„Ø®ØµÙˆØµÙŠØ© ÙˆÙ…Ù†Ø¹ Ø§Ù„Ù…Ø±Ø§Ø³Ù„Ø§Øª Ø§Ù„Ø¹Ø´ÙˆØ§Ø¦ÙŠØ© Ø§Ù„Ø¹Ø§Ø¨Ø±Ø©ØŒ ÙŠÙ…ÙƒÙ† ÙÙ‚Ø· Ù„Ù„Ù…Ù„ÙØ§Øª Ø§Ù„Ø­Ù‚ÙŠÙ‚ÙŠØ© ÙˆØ§Ù„Ù…ÙƒØªÙ…Ù„Ø© Ø§Ù„Ø¨Ø¯Ø¡ Ø¨Ø§Ù„ØªÙˆØ§ØµÙ„ Ø§Ù„ÙˆÙ‚ÙˆØ± ØªØ­Øª Ø¥Ø´Ø±Ø§Ù Ø´Ø±Ø¹ÙŠ.",
                  "Ø¨Û† Ù¾Ø§Ø±Ø§Ø³ØªÙ†ÛŒ ÙˆÛŽÙ†Û•Ú©Ø§Ù†ØŒ ØªÛ•Ù†Ù‡Ø§ Ø¦Û•Ùˆ Ú©Û•Ø³Ø§Ù†Û•ÛŒ Ù¾Ú•Û†ÙØ§ÛŒÙ„Û•Ú©Û•ÛŒØ§Ù† ØªÛ•ÙˆØ§Ùˆ Ú©Ø±Ø¯ÙˆÙˆÛ• Ø¯Û•ØªÙˆØ§Ù†Ù† Ù¾Û•ÛŒÙˆÛ•Ù†Ø¯ÛŒ Ø¨Ú©Û•Ù†."
                )}
              </p>
              <button
                onClick={onExploreMatches}
                className="w-full sm:w-auto px-6 py-3 bg-[#40798C] hover:bg-[#316070] text-white font-black text-xs rounded-xl shrink-0 transition active:scale-95 shadow-md shadow-[#40798C]/10 cursor-pointer"
              >
                {txt("Explore Compatibility Pool", "Ø§Ø³ØªÙƒØ´Ø§Ù Ù…ØµÙÙˆÙØ© Ø§Ù„ØªÙˆØ§ÙÙ‚ Ø§Ù„ÙƒØ§Ù…Ù„Ø©", "Ú¯Û•Ú•Ø§Ù† Ø¨Û•Ø¯ÙˆØ§ÛŒ Ù‡Ø§ÙˆØ´ÛŽÙˆÛ•Ú©Ø§Ù†Ø¯Ø§")}
              </button>
            </div>

          </div>

        </div>
      </section>
      ) : (
        /* Marriage CafÃ© Social Media Feed active tab */
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2 animate-fade-in" id="marriage-cafe-social-hub">
          <MarriageCafe
            locale={locale}
            triggerToast={showToast}
            onNavigateToTab={setTab}
            isAuthenticated={isAuthenticated}
            userProfileName={userProfileName}
            userProfileGovernorate={userProfile?.governorate || 'Baghdad'}
          />
        </section>
      )}

      {/* FEATURED ACTIVE CANDIDATES PORTRAITS SLIDER (CHALLENGE REQUIREMENT) */}
      <section className="bg-[#FAF7F2] border border-[#E8DCC4] rounded-[2.5rem] py-10" id="featured-active-candidates">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-start">
            <div>
              <h4 className="text-base sm:text-xl font-serif font-black text-warm-charcoal flex items-center gap-1.5">
                <UserCheck className="w-5 h-5 text-accent-coral" />
                <span>{txt("Featured Active Candidates", "Ø£Ø¹Ø¶Ø§Ø¡ Ù…ØªÙ…ÙŠØ²ÙˆÙ† ÙˆÙ†Ø´Ø·ÙˆÙ† Ø§Ù„ÙŠÙˆÙ…", "Ú©Ø§Ù†Ø¯ÛŒØ¯Û• Ú†Ø§Ù„Ø§Ú©Û• Ø¯ÛŒØ§Ø±Û•Ú©Ø§Ù†")}</span>
              </h4>
              <p className="text-[11px] sm:text-xs text-stone-500 font-medium leading-relaxed">
                {txt(
                  "These active members are looking for lifelong marriage right now. Women's photos are automatically blurred, and men are authentic Iraqi applicants.",
                  "Ù‡Ø¤Ù„Ø§Ø¡ Ø§Ù„Ø£Ø¹Ø¶Ø§Ø¡ Ù…ØªØµÙ„ÙˆÙ† ÙˆÙŠØ¨Ø­Ø«ÙˆÙ† Ø¨Ù†ÙŠØ© Ø¬Ø§Ø¯Ø© Ø¹Ù† Ø´Ø±ÙŠÙƒ Ø§Ù„Ø­ÙŠØ§Ø© Ø­Ø§Ù„ÙŠØ§Ù‹. ØµÙˆØ± Ø§Ù„Ù†Ø³Ø§Ø¡ Ù…Ø­Ù…ÙŠØ© Ø¨Ø§Ù„ØªÙ…ÙˆÙŠÙ‡ ØªÙ„Ù‚Ø§Ø¦ÙŠØ§Ù‹ØŒ ÙˆØ§Ù„Ø±Ø¬Ø§Ù„ Ù…ØªÙ‚Ø¯Ù…ÙˆÙ† Ø¹Ø±Ø§Ù‚ÙŠÙˆÙ† Ø£ØµÙŠÙ„ÙˆÙ†.",
                  "Ø¦Û•Ù… Ø¦Û•Ù†Ø¯Ø§Ù…Ø§Ù†Û• Ø¦ÛŽØ³ØªØ§ Ú†Ø§Ù„Ø§Ú©Ù† Ùˆ Ø¨Û•Ø¯ÙˆØ§ÛŒ Ù‡Ø§ÙˆØ³Û•Ø±Ú¯ÛŒØ±ÛŒ Ø¯Û•Ú¯Û•Ú•ÛŽÙ†. ÙˆÛŽÙ†Û•ÛŒ Ú©Ú†Ø§Ù† Ù„ÛŽÚµÚ©Ø±Ø§ÙˆÛ• Ø¨Û† Ù¾Ø§Ø±Ø§Ø³ØªÙ† Ùˆ Ú©ÙˆÚ•Ø§Ù†ÛŒØ´ Ú©Ø§Ù†Ø¯ÛŒØ¯ÛŒ Ú•Ø§Ø³ØªÛ•Ù‚ÛŒÙ†Û•ÛŒ Ø¹ÛŽØ±Ø§Ù‚ÛŒÙ†."
                )}
              </p>
            </div>
            <span className="text-[10px] bg-accent-coral/10 text-accent-coral px-3 py-1 rounded-full font-mono font-extrabold uppercase shrink-0">
              âš¡ {txt("Active Today", "Ù†Ø´Ø·ÙˆÙ† Ø§Ù„ÙŠÙˆÙ…", "Ø¦Û•Ù…Ú•Û† Ú†Ø§Ù„Ø§Ú© Ø¨ÙˆÙˆÙ†")}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {featuredCandidates.map((candidate) => {
              const isFemale = candidate.gender === 'female';

              return (
                <div 
                  key={candidate.id}
                  onClick={() => handleProfileClick(candidate)}
                  className="bg-white border border-stone-150 rounded-2xl p-4 flex flex-col items-center text-center space-y-3 cursor-pointer hover:shadow-lg transition duration-200 relative group"
                >
                  {/* Photo area */}
                  <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-white bg-stone-100 shadow-md">
                    {isFemale ? (
                      <>
                        <img 
                          src={candidate.avatarUrl} 
                          alt={candidate.name} 
                          className="w-full h-full object-cover blur-md scale-110 select-none pointer-events-none" 
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-stone-900/10 backdrop-blur-[4px] flex items-center justify-center">
                          <span className="text-accent-pink font-serif font-black text-xs">{candidate.name.charAt(0)}</span>
                        </div>
                      </>
                    ) : (
                      <img 
                        src={candidate.avatarUrl} 
                        alt={candidate.name} 
                        className="w-full h-full object-cover grayscale-[10%]" 
                        referrerPolicy="no-referrer"
                      />
                    )}
                    
                    {/* Live status dot */}
                    <span className="absolute bottom-1 right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" title="Online now" />
                  </div>

                  <div className="space-y-1">
                    <h5 className="font-serif font-black text-xs sm:text-sm text-warm-charcoal group-hover:text-accent-coral transition-colors flex items-center justify-center gap-1">
                      <span>{isFemale ? txt(candidate.name, candidate.nameAr, candidate.nameCkb) : candidate.name}</span>
                      <span className="text-[10px] text-stone-400">({candidate.age})</span>
                    </h5>
                    <p className="text-[9px] font-mono text-stone-500 bg-[#FAF7F2] border border-[#E8DCC4]/50 px-2 py-0.5 rounded-md inline-block">
                      ðŸ“ {txt(candidate.governorate, candidate.governorateAr, candidate.governorateCkb)}
                    </p>
                    <p className="text-[10px] font-extrabold text-stone-400 truncate max-w-[140px] mx-auto">
                      {candidate.profession}
                    </p>
                  </div>

                  <span className="text-[8.5px] uppercase font-mono font-extrabold text-[#40798C] bg-[#40798C]/10 px-2 py-1 rounded-full opacity-80 group-hover:opacity-100 transition-opacity">
                    âœ¨ {txt("Compatible", "Ù…ØªÙˆØ§ÙÙ‚", "Ù‡Ø§ÙˆØªØ§")}
                  </span>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* HOW IT WORKS */}
      <HowItWorks locale={locale} />
      
      {/* PHOTO PRIVACY PROTECTION MODULE */}
      <PhotoPrivacyModule locale={locale} />
      
      {/* TRUST AND SAFETY PRINCIPLES */}
      <TrustSafety locale={locale} />

      {/* CORE PHILOSOPHY SECTION */}
      <section className="bg-transparent py-12" id="core-philosophy">
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
              <p className="text-sm sm:text-base text-[#FDEDEC] font-medium leading-relaxed">
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
                  className="px-8 py-4 rounded-2xl bg-white text-warm-charcoal font-bold hover:bg-warm-ivory transition active:scale-95 shadow-lg shadow-black/10 text-xs sm:text-sm cursor-pointer"
                >
                  {t.philBtn}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL MEDIA STYLE SQUARE STORY VIEWER MODAL */}
      {selectedStory && (
        <div className="fixed inset-0 bg-[#1C1A17]/85 backdrop-blur-md z-[10000] flex items-center justify-center p-4 animate-fade-in">
          <div className="relative w-full max-w-sm bg-[#FAF8F5] border border-[#E8DCC4] rounded-[2rem] overflow-hidden shadow-2xl flex flex-col justify-between h-[480px]">
            
            {/* Top progress bar lines simulating Instagram/Snapchat stories */}
            <div className="absolute top-3 left-4 right-4 flex gap-1.5 z-20">
              <div className="h-1 flex-grow bg-accent-coral rounded-full overflow-hidden">
                <div className="h-full bg-white/40 w-full animate-pulse" />
              </div>
              <div className="h-1 flex-grow bg-stone-300 rounded-full" />
              <div className="h-1 flex-grow bg-stone-300 rounded-full" />
            </div>

            {/* Story Header */}
            <div className="pt-7 px-4 pb-3 bg-gradient-to-b from-[#FAF8F5] to-transparent border-b border-stone-100 flex items-center justify-between z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full p-[1.5px] bg-gradient-to-tr from-accent-coral via-accent-pink to-[#40798C]">
                  <div className="w-full h-full rounded-full overflow-hidden border border-white bg-stone-100 flex items-center justify-center">
                    {selectedStory.gender === 'female' ? (
                      <span className="text-accent-pink font-serif font-black text-xs">{selectedStory.name.charAt(0)}</span>
                    ) : (
                      <img src={selectedStory.avatarUrl} alt={selectedStory.name} className="w-full h-full object-cover" />
                    )}
                  </div>
                </div>
                <div className="text-start">
                  <div className="flex items-center gap-1.5">
                    <span className="font-serif font-black text-sm text-warm-charcoal">
                      {selectedStory.name}
                    </span>
                    <span className="text-xs text-stone-500 font-mono font-bold">({selectedStory.age})</span>
                  </div>
                  <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                    {txt("Online Now", "Ù†Ø´Ø· Ø§Ù„Ø¢Ù† Ø¨Ù†ÙŠØ© Ø¬Ø§Ø¯Ø©", "Ø¦ÛŽØ³ØªØ§ Ú†Ø§Ù„Ø§Ú©Û•")}
                  </span>
                </div>
              </div>

              {/* Close Button */}
              <button 
                onClick={() => setSelectedStory(null)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Story Content Area */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5 text-start scrollbar-thin">
              
              {/* Serious Intention Display */}
              <div className="bg-[#40798C]/5 border border-[#40798C]/15 rounded-2xl p-4 space-y-2 relative">
                <span className="absolute -top-2.5 left-4 bg-[#40798C] text-white text-[8px] font-mono font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full">
                  ðŸ’ {txt("Serious Marital Intention", "Ù†ÙŠØ© Ø§Ù„Ø²ÙˆØ§Ø¬ Ø§Ù„Ø¬Ø§Ø¯Ø©", "Ù…Û•Ø¨Û•Ø³ØªÛŒ Ù‡Ø§ÙˆØ³Û•Ø±Ú¯ÛŒØ±ÛŒ")}
                </span>
                <p className="text-xs sm:text-sm font-serif font-black text-warm-charcoal leading-relaxed pt-1 italic">
                  "{selectedStory.intention || txt("To build a pious and quiet home based on mutual consultation and respect.", "ØªØ£Ø³ÙŠØ³ Ø¨ÙŠØª ØµØ§Ù„Ø­ ÙˆÙ‚Ø§Ø¦Ù… Ø¹Ù„Ù‰ Ø§Ù„Ù…ÙˆØ¯Ø© ÙˆØ§Ù„Ø±Ø­Ù…Ø© ÙˆØ§Ù„Ø§Ø­ØªØ±Ø§Ù… Ø§Ù„Ù…ØªØ¨Ø§Ø¯Ù„.", "Ø¯Ø±ÙˆØ³ØªÚ©Ø±Ø¯Ù†ÛŒ Ø®ÛŽØ²Ø§Ù†ÛŽÚ©ÛŒ Ø¨Û•Ø®ØªÛ•ÙˆÛ•Ø± Ù„Û•Ø³Û•Ø± Ø¨Ù†Û•Ù…Ø§ÛŒ Ú•ÛŽØ².")}"
                </p>
              </div>

              {/* About Me & Hobbies */}
              <div className="space-y-3">
                <div>
                  <span className="text-[10px] font-mono font-extrabold text-[#9C7F59] uppercase tracking-wider">
                    ðŸ‘¤ {txt("About Me", "Ù†Ø¨Ø°Ø© ØªØ¹Ø±ÙŠÙÙŠØ© Ø´Ø®ØµÙŠØ©", "Ø¯Û•Ø±Ø¨Ø§Ø±Û•ÛŒ Ù…Ù†")}
                  </span>
                  <p className="text-xs text-stone-600 leading-relaxed font-semibold mt-1">
                    {selectedStory.aboutMe}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="bg-stone-50 border border-stone-100 rounded-xl p-2.5">
                    <span className="block text-[8px] font-mono font-extrabold text-[#9C7F59] uppercase">
                      ðŸ’¼ {txt("Profession", "Ø§Ù„Ù…Ù‡Ù†Ø©", "Ù¾ÛŒØ´Û•")}
                    </span>
                    <span className="text-[10.5px] font-bold text-warm-charcoal truncate block">
                      {selectedStory.profession}
                    </span>
                  </div>
                  <div className="bg-stone-50 border border-stone-100 rounded-xl p-2.5">
                    <span className="block text-[8px] font-mono font-extrabold text-[#9C7F59] uppercase">
                      ðŸ“ {txt("Location", "Ø§Ù„Ø³ÙƒÙ† ÙˆØ§Ù„Ù…ÙˆÙ‚Ø¹", "Ø´ÙˆÛŽÙ†ÛŒ Ù†ÛŒØ´ØªÛ•Ø¬ÛŽØ¨ÙˆÙˆÙ†")}
                    </span>
                    <span className="text-[10.5px] font-bold text-[#40798C] truncate block">
                      {selectedStory.city}, {getGovDisplayName(selectedStory.governorate)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Verified Badge / Privacy Guard Note */}
              <div className="bg-[#40798C]/5 border border-emerald-500/10 rounded-xl p-3 flex gap-2.5 items-start">
                <ShieldCheck className="w-4 h-4 text-[#40798C] shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="block text-[9px] font-black text-stone-800">
                    {txt("Chaperoned Protocol", "Ø¨Ø±ÙˆØªÙˆÙƒÙˆÙ„ Ø§Ù„Ø®Ø·ÙˆØ¨Ø© Ø§Ù„Ø´Ø±Ø¹ÙŠ", "Ù¾Ú•Û†ØªÛ†Ú©Û†Ù„ÛŒ Ø´Û•Ø±Ø¹ÛŒ")}
                  </span>
                  <p className="text-[9px] text-stone-500 font-medium leading-normal">
                    {txt("Profiles are strictly identity-verified. Casual messaging is blocked. Connection occurs under guardian (Wali) supervision.", "Ø§Ù„Ù…Ù„ÙØ§Øª Ù…ÙˆØ«Ù‚Ø© Ø¨Ø§Ù„ÙƒØ§Ù…Ù„ Ø¨Ø§Ù„Ù‡ÙˆÙŠØ© Ø§Ù„ÙˆØ·Ù†ÙŠØ©. Ù„Ø§ ØªÙˆØ¬Ø¯ Ø¯Ø±Ø¯Ø´Ø© Ø¹Ø´ÙˆØ§Ø¦ÙŠØ©ØŒ Ø§Ù„ØªÙˆØ§ØµÙ„ ÙŠØªÙ… Ø¨ÙˆÙ‚Ø§Ø± ÙˆØªØ­Øª Ø¥Ø´Ø±Ø§Ù Ø¹Ø§Ø¦Ù„ÙŠ.", "Ù¾Ú•Û†ÙØ§ÛŒÙ„Û•Ú©Ø§Ù† Ø¨Û• ØªÛ•ÙˆØ§ÙˆÛŒ Ù…ÙˆØ«Ù‚ Ú©Ø±Ø§ÙˆÙ†. Ú†Ø§ØªÛŒ Ø¹Ø´ÙˆØ§ÛŒÛŒ Ù‚Û•Ø¯Û•ØºÛ•ÛŒÛ•.")}
                  </p>
                </div>
              </div>

            </div>

            {/* Story Footer actions */}
            <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center gap-3">
              <button
                onClick={() => setSelectedStory(null)}
                className="flex-1 py-3 border border-[#E6DCC3] rounded-xl text-xs font-black text-stone-500 hover:bg-stone-100 transition active:scale-98 cursor-pointer"
              >
                {txt("Go Back", "Ø±Ø¬ÙˆØ¹", "Ú¯Û•Ú•Ø§Ù†Û•ÙˆÛ•")}
              </button>
              <button
                onClick={() => {
                  setSelectedStory(null);
                  if (!isAuthenticated) {
                    showToast(txt(
                      "ðŸ’ Please log in or register to request chaperoned contact.",
                      "ðŸ’ ÙŠØ±Ø¬Ù‰ ØªØ³Ø¬ÙŠÙ„ Ø§Ù„Ø¯Ø®ÙˆÙ„ Ø£Ùˆ Ø¥Ù†Ø´Ø§Ø¡ Ø­Ø³Ø§Ø¨ Ù„Ø·Ù„Ø¨ ØªÙˆØ§ØµÙ„ ÙˆÙ‚ÙˆØ± ÙˆØ¹Ø§Ø¦Ù„ÙŠ.",
                      "ðŸ’ ØªÚ©Ø§ÛŒÛ• Ø³Û•Ø±Û•ØªØ§ Ø¨Ú†Û† Ú˜ÙˆÙˆØ±Û•ÙˆÛ• Ø¨Û† Ù†Ø§Ø±Ø¯Ù†ÛŒ Ø¯Ø§ÙˆØ§Ú©Ø§Ø±ÛŒ."
                    ));
                    setTab('onboarding');
                  } else {
                    showToast(txt(
                      `ðŸ’ Intention Match request sent successfully to ${selectedStory.gender === 'female' ? selectedStory.name : selectedStory.name}'s guardian.`,
                      `ðŸ’ ØªÙ… Ø¥Ø±Ø³Ø§Ù„ Ø·Ù„Ø¨ Ù†ÙŠØ© Ø§Ù„ØªØ¹Ø§Ø±Ù Ø§Ù„Ø´Ø±Ø¹ÙŠ Ø¨Ù†Ø¬Ø§Ø­ Ø¥Ù„Ù‰ ÙˆÙ„ÙŠ Ø£Ù…Ø± Ø§Ù„Ø·Ø±Ù Ø§Ù„Ø¢Ø®Ø± Ù„Ù…Ø±Ø§Ø¬Ø¹ØªÙ‡ Ù…ØªØ¨Ø§Ø¯Ù„Ø§Ù‹.`,
                      `ðŸ’ Ø¯Ø§ÙˆØ§Ú©Ø§Ø±ÛŒÛŒÛ•Ú©Û• Ø¨Û• Ø³Û•Ø±Ú©Û•ÙˆØªÙˆÙˆÛŒÛŒ Ù†ÛŽØ±Ø¯Ø±Ø§.`
                    ));
                  }
                }}
                className="flex-2 py-3 bg-gradient-to-r from-accent-coral to-accent-pink hover:opacity-95 text-white rounded-xl text-xs font-black shadow-md shadow-accent-coral/10 transition active:scale-98 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Heart className="w-3.5 h-3.5 text-white" />
                <span>{txt("Send Serious Intention", "Ø¥Ø±Ø³Ø§Ù„ Ø±ØºØ¨Ø© Ø¬Ø§Ø¯Ø©", "Ù†Ø§Ø±Ø¯Ù†ÛŒ Ù…Û•Ø¨Û•Ø³ØªÛŒ Ø¬Ø¯ÛŒ")}</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

