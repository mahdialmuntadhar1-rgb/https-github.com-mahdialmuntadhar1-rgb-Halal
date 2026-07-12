import React, { useState } from 'react';
import { UserProfile, AppLanguage } from '../types';
import { apiClient } from '../services/apiClient';
import { GOVERNORATE_OPTIONS } from '../screens/LandingScreen';
import { 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  User, 
  Lock, 
  MapPin, 
  Mail, 
  Heart,
  Eye,
  EyeOff,
  CheckCircle,
  Briefcase,
  GraduationCap,
  Users
} from 'lucide-react';

interface OnboardingWizardProps {
  locale: AppLanguage;
  onComplete: (profile: UserProfile) => void;
  initialProfile: UserProfile;
}

export default function OnboardingWizard({ locale, onComplete, initialProfile }: OnboardingWizardProps) {
  const isEn = locale === 'en';
  const isCkb = locale === 'ckb';

  // 1 to 4 steps, then 'success'
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 'success'>(1);
  
  // STEP 1: Choose Role (ðŸ‘° Bride / ðŸ‘¨ Groom)
  // Bride -> Female, Groom -> Male
  const [role, setRole] = useState<'bride' | 'groom'>(() => {
    return initialProfile?.gender === 'female' ? 'bride' : 'groom';
  });

  React.useEffect(() => {
    if (initialProfile?.gender) {
      setRole(initialProfile.gender === 'female' ? 'bride' : 'groom');
    }
  }, [initialProfile?.gender]);

  // STEP 2: Essential Information
  const [name, setName] = useState(initialProfile?.name || '');
  const [age, setAge] = useState<number>(initialProfile?.age || 25);
  const [governorate, setGovernorate] = useState(initialProfile?.governorate || 'Baghdad');
  const [district, setDistrict] = useState(initialProfile?.city || '');
  const [maritalStatus, setMaritalStatus] = useState(initialProfile?.maritalStatus || 'Single');
  const [education, setEducation] = useState(initialProfile?.education || 'Bachelor Degree');
  const [occupation, setOccupation] = useState(initialProfile?.profession || '');

  // STEP 3: Looking For
  const [prefAgeRange, setPrefAgeRange] = useState<string>('25-35');
  const [prefGov, setPrefGov] = useState<string>('Baghdad');
  const [isSeriousOnly, setIsSeriousOnly] = useState<boolean>(true);

  // STEP 4: Account Credentials (if unregistered)
  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Optional Photo / Emoji Avatar State
  const [photoType, setPhotoType] = useState<'skip' | 'emoji' | 'initials' | 'upload'>('emoji');
  const [selectedEmoji, setSelectedEmoji] = useState<string>('ðŸ‘¤');
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState<string>('');

  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const txt = (en: string, ar: string, ckb: string) => {
    return isEn ? en : isCkb ? ckb : ar;
  };

  const validateStep2 = () => {
    const errs: string[] = [];
    if (!name.trim()) {
      errs.push(txt("First name is required.", "Ø§Ù„Ø§Ø³Ù… Ø§Ù„Ø£ÙˆÙ„ Ù…Ø·Ù„ÙˆØ¨.", "Ù†Ø§ÙˆÛŒ ÛŒÛ•Ú©Û•Ù… Ù¾ÛŽÙˆÛŒØ³ØªÛ•."));
    }
    if (age < 18 || age > 75) {
      errs.push(txt("Age must be between 18 and 75.", "ÙŠØ¬Ø¨ Ø£Ù† ÙŠÙƒÙˆÙ† Ø§Ù„Ø¹Ù…Ø± Ø¨ÙŠÙ† Ù¡Ù¨ Ùˆ Ù§Ù¥ Ø¹Ø§Ù…Ø§Ù‹.", "ØªÛ•Ù…Û•Ù† Ø¯Û•Ø¨ÛŽØª Ù„Û• Ù†ÛŽÙˆØ§Ù† Ù¡Ù¨ Ø¨Û† Ù§Ù¥ Ø³Ø§Úµ Ø¨ÛŽØª."));
    }
    if (!district.trim()) {
      errs.push(txt("District / Neighborhood is required.", "Ø§Ù„Ù‚Ø¶Ø§Ø¡ / Ø§Ù„Ø­ÙŠ Ù…Ø·Ù„ÙˆØ¨.", "Ù‚Û•Ø²Ø§ ÛŒØ§Ù† Ú¯Û•Ú•Û•Ú© Ù¾ÛŽÙˆÛŒØ³ØªÛ•."));
    }
    if (!occupation.trim()) {
      errs.push(txt("Occupation / Job is required.", "Ø§Ù„Ù…Ù‡Ù†Ø© / Ø§Ù„Ø¹Ù…Ù„ Ù…Ø·Ù„ÙˆØ¨.", "Ù¾ÛŒØ´Û• Ù¾ÛŽÙˆÛŒØ³ØªÛ•."));
    }
    setErrors(errs);
    return errs.length === 0;
  };

  const validateStep3 = () => {
    const errs: string[] = [];
    if (!isSeriousOnly) {
      errs.push(txt("You must confirm you are seeking a serious marriage.", "ÙŠØ¬Ø¨ Ø¹Ù„ÙŠÙƒ ØªØ£ÙƒÙŠØ¯ Ø±ØºØ¨ØªÙƒ Ø¨Ø§Ù„Ø²ÙˆØ§Ø¬ Ø§Ù„Ø¬Ø§Ø¯ ÙÙ‚Ø·.", "Ø¯Û•Ø¨ÛŽØª Ù¾Ø´ØªÚ•Ø§Ø³ØªÛŒ Ø¨Ú©Û•ÛŒØªÛ•ÙˆÛ• Ú©Û• ØªÛ•Ù†Ù‡Ø§ Ø¨Û•Ø¯ÙˆØ§ÛŒ Ù‡Ø§ÙˆØ³Û•Ø±Ú¯ÛŒØ±ÛŒ Ø¬Ø¯Ø¯ÛŒØ¯Ø§ Ø¯Û•Ú¯Û•Ú•ÛŽÛŒØª."));
    }
    setErrors(errs);
    return errs.length === 0;
  };

  const validateStep4 = () => {
    // If they are already authenticated, they can proceed without register
    const isMockOrRealToken = localStorage.getItem('halal_token');
    if (isMockOrRealToken) return true;

    const errs: string[] = [];
    if (!contact.trim()) {
      errs.push(txt("Phone number or email is required.", "Ø±Ù‚Ù… Ø§Ù„Ù‡Ø§ØªÙ Ø£Ùˆ Ø§Ù„Ø¨Ø±ÙŠØ¯ Ø§Ù„Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠ Ù…Ø·Ù„ÙˆØ¨.", "Ú˜Ù…Ø§Ø±Û•ÛŒ Ù…Û†Ø¨Ø§ÛŒÙ„ ÛŒØ§Ù† Ø¦ÛŒÙ…Û•ÛŒÚµ Ù¾ÛŽÙˆÛŒØ³ØªÛ•."));
    }
    if (password.length < 6) {
      errs.push(txt("Password must be at least 6 characters.", "ÙŠØ¬Ø¨ Ø£Ù† ØªÙƒÙˆÙ† ÙƒÙ„Ù…Ø© Ø§Ù„Ù…Ø±ÙˆØ± Ù¦ Ø£Ø­Ø±Ù Ø¹Ù„Ù‰ Ø§Ù„Ø£Ù‚Ù„.", "ÙˆØ´Û•ÛŒ ØªÛŽÙ¾Û•Ú• Ø¯Û•Ø¨ÛŽØª Ù„Ø§Ù†ÛŒ Ú©Û•Ù… Ù¦ Ù¾ÛŒØª Ø¨ÛŽØª."));
    }
    setErrors(errs);
    return errs.length === 0;
  };

  const handleNext = () => {
    setErrors([]);
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (validateStep2()) {
        setStep(3);
      }
    } else if (step === 3) {
      if (validateStep3()) {
        // If already authenticated, skip registration credentials step and go straight to success!
        const hasToken = localStorage.getItem('halal_token');
        if (hasToken) {
          handleSaveAndFinish();
        } else {
          setStep(4);
        }
      }
    }
  };

  const handleBack = () => {
    setErrors([]);
    if (step === 2) {
      setStep(1);
    } else if (step === 3) {
      setStep(2);
    } else if (step === 4) {
      setStep(3);
    }
  };

  const handleSaveAndFinish = async () => {
    setIsLoading(true);
    setErrors([]);

    try {
      const finalGender = role === 'bride' ? 'female' : 'male';
      
      let finalAvatarUrl = "";
      let finalPhotoStatus: 'blurred' | 'hidden' | 'initials' | 'visible' = 'visible';

      if (photoType === 'emoji') {
        finalAvatarUrl = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100%25' height='100%25' fill='%23FAF5EE'/><text y='70' x='50' font-size='60' text-anchor='middle'>${selectedEmoji}</text></svg>`;
        finalPhotoStatus = 'visible';
      } else if (photoType === 'initials') {
        finalAvatarUrl = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100%25' height='100%25' fill='%23E8F0F2'/><text y='65' x='50' font-size='48' font-family='serif' font-weight='bold' fill='%2340798C' text-anchor='middle'>${name ? name.charAt(0).toUpperCase() : '?'}</text></svg>`;
        finalPhotoStatus = 'initials';
      } else if (photoType === 'upload' && uploadedPhotoUrl) {
        finalAvatarUrl = uploadedPhotoUrl;
        finalPhotoStatus = 'blurred';
      } else {
        finalAvatarUrl = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100%25' height='100%25' fill='%23FAF5EE'/><text y='70' x='50' font-size='60' text-anchor='middle'>ðŸ‘¤</text></svg>`;
        finalPhotoStatus = 'hidden';
      }

      const partialProfile: Partial<UserProfile> = {
        name,
        age,
        gender: finalGender,
        governorate,
        city: district,
        maritalStatus,
        education,
        profession: occupation,
        partnerAgeRange: prefAgeRange,
        partnerGovernorate: prefGov,
        photoPrivacy: finalGender === 'female' ? 'hidden_by_default' : 'visible',
        badges: ['Serious for marriage'],
        timeline: 'Within 1 year',
        wantsChildren: 'Yes',
        avatarUrl: finalAvatarUrl,
        photoStatus: finalPhotoStatus
      };

      await apiClient.updateCurrentUserProfile(partialProfile);
      setStep('success');
    } catch (err: any) {
      setErrors([err.message || txt("Failed to update profile.", "ÙØ´Ù„ ØªØ­Ø¯ÙŠØ« Ø§Ù„Ù…Ù„Ù Ø§Ù„Ø´Ø®ØµÙŠ.", "ØªÛ†Ù…Ø§Ø±Ú©Ø±Ø¯Ù† Ø³Û•Ø±Ú©Û•ÙˆØªÙˆÙˆ Ù†Û•Ø¨ÙˆÙˆ.")]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterAndSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep4()) return;

    setIsLoading(true);
    setErrors([]);

    const emailToUse = contact.includes('@') ? contact : `${contact.replace(/\s+/g, '')}@halal.me`;
    const finalGender = role === 'bride' ? 'female' : 'male';

    try {
      // 1. Call Register
      const authResponse = await apiClient.register(name, governorate, district, emailToUse, undefined, password, age);
      
      let finalAvatarUrl = "";
      let finalPhotoStatus: 'blurred' | 'hidden' | 'initials' | 'visible' = 'visible';

      if (photoType === 'emoji') {
        finalAvatarUrl = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100%25' height='100%25' fill='%23FAF5EE'/><text y='70' x='50' font-size='60' text-anchor='middle'>${selectedEmoji}</text></svg>`;
        finalPhotoStatus = 'visible';
      } else if (photoType === 'initials') {
        finalAvatarUrl = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100%25' height='100%25' fill='%23E8F0F2'/><text y='65' x='50' font-size='48' font-family='serif' font-weight='bold' fill='%2340798C' text-anchor='middle'>${name ? name.charAt(0).toUpperCase() : '?'}</text></svg>`;
        finalPhotoStatus = 'initials';
      } else if (photoType === 'upload' && uploadedPhotoUrl) {
        finalAvatarUrl = uploadedPhotoUrl;
        finalPhotoStatus = 'blurred';
      } else {
        finalAvatarUrl = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100%25' height='100%25' fill='%23FAF5EE'/><text y='70' x='50' font-size='60' text-anchor='middle'>ðŸ‘¤</text></svg>`;
        finalPhotoStatus = 'hidden';
      }

      // 2. Build final Profile structure
      const finalProfile: UserProfile = {
        name,
        age,
        gender: finalGender,
        country: 'Iraq',
        governorate,
        city: district,
        religion: 'islam',
        ethnicity: 'arab',
        languages: ['Arabic'],
        photoPrivacy: finalGender === 'female' ? 'hidden_by_default' : 'visible',
        education,
        profession: occupation,
        maritalStatus,
        partnerAgeRange: prefAgeRange,
        partnerGovernorate: prefGov,
        badges: ['Serious for marriage'],
        values: ['Family First', 'Mutual Respect'],
        timeline: 'Within 1 year',
        wantsChildren: 'Yes',
        relocation: 'Yes',
        communicationPreference: 'Prefers private respectful correspondence',
        avatarUrl: finalAvatarUrl,
        photoStatus: finalPhotoStatus
      };

      // 3. Update profile with basic details
      await apiClient.updateCurrentUserProfile(finalProfile);

      // 4. Save token
      if (authResponse.token) {
        localStorage.setItem('halal_token', authResponse.token);
      }

      setStep('success');
    } catch (err: any) {
      setErrors([err.message || txt("Registration failed.", "ÙØ´Ù„ Ø§Ù„ØªØ³Ø¬ÙŠÙ„. ÙŠØ±Ø¬Ù‰ Ø§Ù„Ù…Ø­Ø§ÙˆÙ„Ø© Ù…Ø±Ø© Ø£Ø®Ø±Ù‰.", "ØªÛ†Ù…Ø§Ø±Ú©Ø±Ø¯Ù† Ø³Û•Ø±Ú©Û•ÙˆØªÙˆÙˆ Ù†Û•Ø¨ÙˆÙˆ.")]);
    } finally {
      setIsLoading(false);
    }
  };

  // UI calculations
  const progressPercent = step === 1 ? 25 : step === 2 ? 50 : step === 3 ? 75 : 100;

  return (
    <div className="max-w-xl mx-auto px-4" id="onboarding-wizard">
      
      {/* Progress indicators */}
      {step !== 'success' && (
        <div className="mb-8 space-y-3">
          <div className="flex justify-between items-center text-xs font-mono font-black text-[#6B635B] uppercase tracking-wider">
            <span>{txt(`Step ${step} of 4`, `Ø§Ù„Ø®Ø·ÙˆØ© ${step} Ù…Ù† Ù¤`, `Ù‡Û•Ù†Ú¯Ø§ÙˆÛŒ ${step} Ù„Û• Ù¤`)}</span>
            <span className="text-accent-coral">{progressPercent}%</span>
          </div>
          <div className="w-full bg-stone-200/60 h-2 rounded-full overflow-hidden shadow-inner">
            <div 
              className="bg-gradient-to-r from-accent-coral to-accent-pink h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Errors list */}
      {errors.length > 0 && (
        <div className="mb-6 p-4 bg-rose-50 border-l-4 border-rose-500 rounded-2xl text-left space-y-1">
          {errors.map((err, i) => (
            <p key={i} className="text-xs text-rose-800 font-bold">{err}</p>
          ))}
        </div>
      )}

      {/* STEP 1: Choose Role (Bride / Groom) */}
      {step === 1 && (
        <div className="space-y-6 text-center animate-fade-in" id="wizard-step-1">
          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-serif font-black text-warm-charcoal font-display">
              {txt("Choose Your Role", "Ø§Ø®ØªØ± Ø­Ø³Ø§Ø¨Ùƒ", "Ú•Û†ÚµÛŒ Ø®Û†Øª Ø¯ÛŒØ§Ø±ÛŒ Ø¨Ú©Û•")}
            </h3>
            <p className="text-stone-500 text-xs sm:text-sm font-medium">
              {txt(
                "Please select if you are a Bride or a Groom to begin your search.",
                "ÙŠØ±Ø¬Ù‰ ØªØ­Ø¯ÙŠØ¯ Ù…Ø§ Ø¥Ø°Ø§ ÙƒÙ†Øª Ø¹Ø±ÙˆØ³Ø§Ù‹ Ø£Ùˆ Ø¹Ø±ÙŠØ³Ø§Ù‹ Ù„Ø¨Ø¯Ø¡ Ø§Ù„Ø¨Ø­Ø« ÙˆØ§Ù„ØªØ¹Ø§Ø±Ù Ø§Ù„Ø¬Ø§Ø¯.",
                "ØªÚ©Ø§ÛŒÛ• Ø¯ÛŒØ§Ø±ÛŒ Ø¨Ú©Û• Ú©Û• Ø¦Ø§ÛŒØ§ Ø¨ÙˆÙˆÚ©ÛŒØª ÛŒØ§Ù† Ø²Ø§ÙˆØ§ Ø¨Û† Ø¯Û•Ø³ØªÙ¾ÛŽÚ©Ø±Ø¯Ù†ÛŒ Ú¯Û•Ú•Ø§Ù†."
              )}
            </p>
          </div>

          {/* Cards Container */}
          <div className="grid grid-cols-2 gap-3 sm:gap-5 pt-4">
            
            {/* Card 1: Bride */}
            <button
              type="button"
              onClick={() => { setRole('bride'); }}
              className={`p-4 sm:p-8 rounded-2xl sm:rounded-[2rem] border-2 text-center transition-all duration-300 cursor-pointer group flex flex-col items-center justify-center space-y-2 sm:space-y-4 relative overflow-hidden ${
                role === 'bride'
                  ? 'bg-gradient-to-br from-pink-550 to-pink-500 border-accent-pink text-white shadow-2xl scale-[1.02]'
                  : 'bg-white border-stone-200 hover:border-accent-pink/60 text-warm-charcoal shadow-md hover:shadow-lg'
              }`}
              style={role === 'bride' ? { background: 'linear-gradient(135deg, #EC4899, #DB2777)' } : {}}
            >
              <div className="w-12 h-12 sm:w-20 sm:h-20 rounded-full bg-pink-100 flex items-center justify-center text-2xl sm:text-4xl shadow-inner group-hover:scale-110 transition duration-300">
                ðŸ‘°
              </div>
              <div className="space-y-0.5 sm:space-y-1">
                <span className="block text-sm sm:text-xl font-serif font-black tracking-tight">
                  {txt("Bride", "Ø§Ù„Ø¹Ø±ÙˆØ³ ðŸ‘°", "Ø¨ÙˆÙˆÚ© ðŸ‘°")}
                </span>
                <span className={`block text-[9px] sm:text-xs font-bold uppercase tracking-wider ${role === 'bride' ? 'text-pink-100' : 'text-stone-500'}`}>
                  {txt("Seeking a Husband", "ØªØ¨Ø­Ø« Ø¹Ù† Ø²ÙˆØ¬", "Ø¨Û† Ù‡Ø§ÙˆØ³Û•Ø±Ú¯ÛŒØ±ÛŒ")}
                </span>
              </div>
              {role === 'bride' && (
                <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-white text-pink-600 p-1 rounded-full shadow-md">
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 stroke-[3px]" />
                </div>
              )}
            </button>

            {/* Card 2: Groom */}
            <button
              type="button"
              onClick={() => { setRole('groom'); }}
              className={`p-4 sm:p-8 rounded-2xl sm:rounded-[2rem] border-2 text-center transition-all duration-300 cursor-pointer group flex flex-col items-center justify-center space-y-2 sm:space-y-4 relative overflow-hidden ${
                role === 'groom'
                  ? 'bg-gradient-to-br from-stone-900 to-stone-800 border-stone-900 text-white shadow-2xl scale-[1.02]'
                  : 'bg-white border-stone-200 hover:border-stone-400 text-warm-charcoal shadow-md hover:shadow-lg'
              }`}
            >
              <div className="w-12 h-12 sm:w-20 sm:h-20 rounded-full bg-sky-100 flex items-center justify-center text-2xl sm:text-4xl shadow-inner group-hover:scale-110 transition duration-300">
                ðŸ‘¨
              </div>
              <div className="space-y-0.5 sm:space-y-1">
                <span className="block text-sm sm:text-xl font-serif font-black tracking-tight">
                  {txt("Groom", "Ø§Ù„Ø¹Ø±ÙŠØ³ ðŸ‘¨", "Ø²Ø§ÙˆØ§ ðŸ‘¨")}
                </span>
                <span className={`block text-[9px] sm:text-xs font-bold uppercase tracking-wider ${role === 'groom' ? 'text-sky-300' : 'text-stone-500'}`}>
                  {txt("Seeking a Wife", "ÙŠØ¨Ø­Ø« Ø¹Ù† Ø²ÙˆØ¬Ø©", "Ø¨Û† Ù‡Ø§ÙˆØ³Û•Ø±Ú¯ÛŒØ±ÛŒ")}
                </span>
              </div>
              {role === 'groom' && (
                <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-white text-stone-950 p-1 rounded-full shadow-md">
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 stroke-[3px]" />
                </div>
              )}
            </button>

          </div>

          {/* Respectful Matchmaking Role Policy Explanation */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-center space-y-1 max-w-lg mx-auto" id="onboarding-role-notice">
            <p className="text-xs sm:text-sm font-black text-warm-charcoal flex items-center justify-center gap-1.5">
              <span>{role === 'groom' ? 'ðŸ¤µ' : 'ðŸ‘°'}</span>
              <span>
                {role === 'groom' 
                  ? txt("We will show you suitable women for marriage.", "Ø³ÙˆÙ Ù†Ù‚ÙˆÙ… Ø¨Ø¹Ø±Ø¶ Ø§Ù„Ù†Ø³Ø§Ø¡ ÙˆØ§Ù„Ø¹Ø±Ø§Ø¦Ø³ Ø§Ù„ØµØ§Ù„Ø­Ø§Øª Ù„Ù„Ø²ÙˆØ§Ø¬ Ø§Ù„Ø´Ø±Ø¹ÙŠ Ù„Ùƒ.", "Ø¦ÛŽÙ…Û• Ú©Ú†Ø§Ù†ÛŒ Ø´ÛŒØ§Ùˆ Ø¨Û† Ù‡Ø§ÙˆØ³Û•Ø±Ú¯ÛŒØ±ÛŒ Ø´Û•Ø±Ø¹ÛŒ Ø¨Û• ØªÛ† Ù¾ÛŒØ´Ø§Ù† Ø¯Û•Ø¯Û•ÛŒÙ†.")
                  : txt("We will show you suitable men for marriage.", "Ø³ÙˆÙ Ù†Ù‚ÙˆÙ… Ø¨Ø¹Ø±Ø¶ Ø§Ù„Ø±Ø¬Ø§Ù„ Ø§Ù„Ø¹Ø±Ø³Ø§Ù† Ø§Ù„ØµØ§Ù„Ø­ÙŠÙ† Ù„Ù„Ø²ÙˆØ§Ø¬ Ø§Ù„Ø´Ø±Ø¹ÙŠ Ù„Ùƒ.", "Ø¦ÛŽÙ…Û• Ù¾ÛŒØ§ÙˆØ§Ù†ÛŒ Ø´ÛŒØ§Ùˆ Ø¨Û† Ù‡Ø§ÙˆØ³Û•Ø±Ú¯ÛŒØ±ÛŒ Ø´Û•Ø±Ø¹ÛŒ Ø¨Û• ØªÛ† Ù¾ÛŒØ´Ø§Ù† Ø¯Û•Ø¯Û•ÛŒÙ†.")}
              </span>
            </p>
            <p className="text-[10px] sm:text-xs text-stone-500 font-medium leading-relaxed">
              {role === 'groom'
                ? txt("Our system aligns with respectful, Islamic traditions (Zawaj). Selecting Groom means you are searching for a serious matrimonial bride.", "ÙŠØªÙ…Ø§Ø´Ù‰ Ù†Ø¸Ø§Ù…Ù†Ø§ Ù…Ø¹ ØªÙ‚Ø§Ù„ÙŠØ¯ Ø§Ù„Ø²ÙˆØ§Ø¬ Ø§Ù„Ø¥Ø³Ù„Ø§Ù…ÙŠ Ø§Ù„Ø´Ø±Ø¹ÙŠ Ø§Ù„Ù†Ø¨ÙŠÙ„. Ø§Ø®ØªÙŠØ§Ø±Ùƒ Ù„Ù€ (Ø§Ù„Ø¹Ø±ÙŠØ³) ÙŠØ¹Ù†ÙŠ Ø£Ù†Ùƒ ØªØ¨Ø­Ø« Ø¹Ù† Ø²ÙˆØ¬Ø© ØµØ§Ù„Ø­Ø© Ù„ØªØ£Ø³ÙŠØ³ Ø£Ø³Ø±Ø© ÙƒØ±ÙŠÙ…Ø©.", "Ø³ÛŒØ³ØªÛ•Ù…Û•Ú©Û•Ù…Ø§Ù† Ù„Û•Ú¯Û•Úµ Ø¯Ø§Ø¨ÙˆÙ†Û•Ø±ÛŒØªÛŒ Ù‡Ø§ÙˆØ³Û•Ø±Ú¯ÛŒØ±ÛŒ Ø´Û•Ø±Ø¹ÛŒ Ø¦ÛŒØ³Ù„Ø§Ù…ÛŒØ¯Ø§ Ø¯Û•Ú¯ÙˆÙ†Ø¬ÛŽØª. Ø¯ÛŒØ§Ø±ÛŒÚ©Ø±Ø¯Ù†ÛŒ (Ø²Ø§ÙˆØ§) ÙˆØ§ØªÛ• ØªÛ† Ø¨Û•Ø¯ÙˆØ§ÛŒ Ù‡Ø§ÙˆØ³Û•Ø±ÛŽÚ©ÛŒ Ø´ÛŒØ§ÙˆØ¯Ø§ Ø¯Û•Ú¯Û•Ú•ÛŽÛŒØª.")
                : txt("Our system aligns with respectful, Islamic traditions (Zawaj). Selecting Bride means you are searching for a serious matrimonial groom.", "ÙŠØªÙ…Ø§Ø´Ù‰ Ù†Ø¸Ø§Ù…Ù†Ø§ Ù…Ø¹ ØªÙ‚Ø§Ù„ÙŠØ¯ Ø§Ù„Ø²ÙˆØ§Ø¬ Ø§Ù„Ø¥Ø³Ù„Ø§Ù…ÙŠ Ø§Ù„Ø´Ø±Ø¹ÙŠ Ø§Ù„Ù†Ø¨ÙŠÙ„. Ø§Ø®ØªÙŠØ§Ø±ÙƒÙ Ù„Ù€ (Ø§Ù„Ø¹Ø±ÙˆØ³) ÙŠØ¹Ù†ÙŠ Ø£Ù†ÙƒÙ ØªØ¨Ø­Ø«ÙŠÙ† Ø¹Ù† Ø´Ø±ÙŠÙƒ Ø­ÙŠØ§Ø© ØµØ§Ù„Ø­ ÙˆØ²ÙˆØ¬ Ù…Ù„ØªØ²Ù….", "Ø³ÛŒØ³ØªÛ•Ù…Û•Ú©Û•Ù…Ø§Ù† Ù„Û•Ú¯Û•Úµ Ø¯Ø§Ø¨ÙˆÙ†Û•Ø±ÛŒØªÛŒ Ù‡Ø§ÙˆØ³Û•Ø±Ú¯ÛŒØ±ÛŒ Ø´Û•Ø±Ø¹ÛŒ Ø¦ÛŒØ³Ù„Ø§Ù…ÛŒØ¯Ø§ Ø¯Û•Ú¯ÙˆÙ†Ø¬ÛŽØª. Ø¯ÛŒØ§Ø±ÛŒÚ©Ø±Ø¯Ù†ÛŒ (Ø¨ÙˆÙˆÚ©) ÙˆØ§ØªÛ• ØªÛ† Ø¨Û•Ø¯ÙˆØ§ÛŒ Ù‡Ø§ÙˆØ³Û•Ø±ÛŽÚ©ÛŒ Ø´ÛŒØ§ÙˆØ¯Ø§ Ø¯Û•Ú¯Û•Ú•ÛŽÛŒØª.")}
            </p>
          </div>

          <div className="pt-6">
            <button
              type="button"
              onClick={handleNext}
              className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-accent-coral text-white hover:bg-[#ff8f66] font-black text-sm transition cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-accent-coral/20 mx-auto"
            >
              <span>{txt("Next: Essential Info", "Ø§Ù„ØªØ§Ù„ÙŠ: Ø§Ù„Ø¨ÙŠØ§Ù†Ø§Øª Ø§Ù„Ø£Ø³Ø§Ø³ÙŠØ©", "Ø¯Ø§Ù‡Ø§ØªÙˆÙˆ: Ø²Ø§Ù†ÛŒØ§Ø±ÛŒ Ø³Û•Ø±Û•Ú©ÛŒ")}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Essential Information */}
      {step === 2 && (
        <div className="bg-white/70 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/60 shadow-xl space-y-6 text-left animate-fade-in" id="wizard-step-2">
          
          <div className="text-center space-y-1">
            <h4 className="text-2xl font-serif font-black text-warm-charcoal font-display">
              {txt("Essential Information", "Ø¨ÙŠØ§Ù†Ø§ØªÙƒ Ø§Ù„Ø£Ø³Ø§Ø³ÙŠØ©", "Ø²Ø§Ù†ÛŒØ§Ø±ÛŒÛŒÛ• Ø³Û•Ø±Û•Ú©ÛŒÛŒÛ•Ú©Ø§Ù†")}
            </h4>
            <p className="text-stone-500 text-xs sm:text-sm font-semibold">
              {txt("Only the fields absolutely required to produce the first matches.", "Ø§Ù„Ø­Ù‚ÙˆÙ„ Ø§Ù„Ù…Ø·Ù„ÙˆØ¨Ø© ÙÙ‚Ø· Ù„Ø¨Ù†Ø§Ø¡ Ø£ÙˆÙ„ ØªÙˆØ§ÙÙ‚ Ø³Ø±ÙŠØ¹ ÙˆØªØµÙØ­ Ø§Ù„Ø´Ø±ÙƒØ§Ø¡.", "ØªÛ•Ù†Ù‡Ø§ Ø¦Û•Ùˆ Ø²Ø§Ù†ÛŒØ§Ø±ÛŒÛŒØ§Ù†Û•ÛŒ Ø²Û†Ø± Ù¾ÛŽÙˆÛŒØ³ØªÙ† Ø¨Û† ÛŒÛ•Ú©Û•Ù… Ú¯ÙˆÙ†Ø¬Ø§Ù†Ø¯Ù†.")}
            </p>
          </div>

          <div className="space-y-4">
            
            {/* First Name */}
            <div>
              <label className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-1.5 font-mono">
                {txt("First Name", "Ø§Ù„Ø§Ø³Ù… Ø§Ù„Ø£ÙˆÙ„", "Ù†Ø§ÙˆÛŒ ÛŒÛ•Ú©Û•Ù…")}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <User className="w-4.5 h-4.5" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={txt("e.g. Yusuf, Maryam", "Ù…Ø«Ø§Ù„: ÙŠÙˆØ³ÙØŒ Ù…Ø±ÙŠÙ…", "Ø¨Û† Ù†Ù…ÙˆÙˆÙ†Û•: ÛŒÙˆØ³ÙØŒ Ù…Ø±ÛŒÛ•Ù…")}
                  className="block w-full pl-10 pr-4 py-3 bg-white border border-stone-200 rounded-xl text-warm-charcoal placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-accent-coral focus:border-accent-coral text-sm font-semibold transition"
                />
              </div>
            </div>

            {/* Age selector */}
            <div>
              <label className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-1.5 font-mono">
                {txt("Date of Birth / Age", "ØªØ§Ø±ÙŠØ® Ø§Ù„Ù…ÙŠÙ„Ø§Ø¯ / Ø§Ù„Ø¹Ù…Ø±", "ØªÛ•Ù…Û•Ù† / Ø¨Û•Ø±ÙˆØ§Ø±ÛŒ Ù„Û•Ø¯Ø§ÛŒÚ©Ø¨ÙˆÙˆÙ†")}
              </label>
              <select
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value) || 25)}
                className="block w-full px-4 py-3 bg-white border border-stone-200 rounded-xl text-warm-charcoal focus:outline-none focus:ring-1 focus:ring-accent-coral focus:border-accent-coral text-sm font-semibold transition"
              >
                {Array.from({ length: 58 }, (_, i) => i + 18).map((a) => (
                  <option key={a} value={a}>{a} {txt("Years old", "Ø³Ù†Ø©", "Ø³Ø§Úµ")}</option>
                ))}
              </select>
            </div>

            {/* Governorate and District */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-1.5 font-mono">
                  {txt("Governorate", "Ø§Ù„Ù…Ø­Ø§ÙØ¸Ø©", "Ù¾Ø§Ø±ÛŽØ²Ú¯Ø§")}
                </label>
                <select
                  value={governorate}
                  onChange={(e) => setGovernorate(e.target.value)}
                  className="block w-full px-4 py-3 bg-white border border-stone-200 rounded-xl text-warm-charcoal focus:outline-none focus:ring-1 focus:ring-accent-coral focus:border-accent-coral text-sm font-semibold transition"
                >
                  {GOVERNORATE_OPTIONS.map((gov) => (
                    <option key={gov.id} value={gov.id}>
                      {isEn ? gov.en : isCkb ? gov.ckb : gov.ar}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-1.5 font-mono">
                  {txt("District / Town", "Ø§Ù„Ù‚Ø¶Ø§Ø¡ / Ø§Ù„Ù…Ù†Ø·Ù‚Ø©", "Ù‚Û•Ø²Ø§ / Ù†Ø§ÙˆÚ†Û•")}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <MapPin className="w-4.5 h-4.5" />
                  </div>
                  <input
                    type="text"
                    required
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder={txt("e.g. Karrada, Sarchinar", "Ù…Ø«Ø§Ù„: Ø§Ù„ÙƒØ±Ø§Ø¯Ø©ØŒ Ø§Ù„Ù…Ù†ØµÙˆØ±ØŒ Ø³Ø±Ø¬Ù†Ø§Ø±", "Ø¨Û† Ù†Ù…ÙˆÙˆÙ†Û•: Ú©Û•Ø±Ø§Ø¯Û•ØŒ Ø³Û•Ø±Ú†Ù†Ø§Ø±")}
                    className="block w-full pl-10 pr-4 py-3 bg-white border border-stone-200 rounded-xl text-warm-charcoal placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-accent-coral focus:border-accent-coral text-sm font-semibold transition"
                  />
                </div>
              </div>
            </div>

            {/* Marital Status and Education */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-1.5 font-mono">
                  {txt("Marital Status", "Ø§Ù„Ø­Ø§Ù„Ø© Ø§Ù„Ø§Ø¬ØªÙ…Ø§Ø¹ÙŠØ©", "Ø¨Ø§Ø±ÛŒ Ø®ÛŽØ²Ø§Ù†ÛŒ")}
                </label>
                <select
                  value={maritalStatus}
                  onChange={(e) => setMaritalStatus(e.target.value)}
                  className="block w-full px-4 py-3 bg-white border border-stone-200 rounded-xl text-warm-charcoal focus:outline-none focus:ring-1 focus:ring-accent-coral focus:border-accent-coral text-sm font-semibold transition"
                >
                  <option value="Single">{txt("Single", "Ø£Ø¹Ø²Ø¨ / Ø¹Ø²Ø¨Ø§Ø¡", "Ø³Û•ÚµØª")}</option>
                  <option value="Divorced">{txt("Divorced", "Ù…Ø·Ù„Ù‚ / Ù…Ø·Ù„Ù‚Ø©", "Ø¬ÛŒØ§Ø¨ÙˆÙˆÛ•ØªÛ•ÙˆÛ•")}</option>
                  <option value="Widowed">{txt("Widowed", "Ø£Ø±Ù…Ù„ / Ø£Ø±Ù…Ù„Ø©", "Ù‡Ø§ÙˆØ³Û•Ø± Ù…Ø±Ø¯ÙˆÙˆ")}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-1.5 font-mono">
                  {txt("Education", "Ø§Ù„ØªØ­ØµÙŠÙ„ Ø§Ù„Ø¯Ø±Ø§Ø³ÙŠ", "Ø¦Ø§Ø³ØªÛŒ Ø®ÙˆÛŽÙ†Ø¯Ù†")}
                </label>
                <select
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  className="block w-full px-4 py-3 bg-white border border-stone-200 rounded-xl text-warm-charcoal focus:outline-none focus:ring-1 focus:ring-accent-coral focus:border-accent-coral text-sm font-semibold transition"
                >
                  <option value="High School">{txt("High School", "Ø¥Ø¹Ø¯Ø§Ø¯ÙŠØ© / Ø«Ø§Ù†ÙˆÙŠØ©", "Ø¦Ø§Ù…Ø§Ø¯Û•ÛŒÛŒ")}</option>
                  <option value="Diploma">{txt("Diploma / Institute", "Ø¯Ø¨Ù„ÙˆÙ… / Ù…Ø¹Ù‡Ø¯", "Ø¯Ø¨Ù„Û†Ù…")}</option>
                  <option value="Bachelor Degree">{txt("Bachelor Degree", "Ø¨ÙƒØ§Ù„ÙˆØ±ÙŠÙˆØ³ / Ø¬Ø§Ù…Ø¹Ø©", "Ø¨Û•Ú©Ø§Ù„Û†Ø±ÛŒÛ†Ø³")}</option>
                  <option value="Master Degree">{txt("Master Degree", "Ù…Ø§Ø¬Ø³ØªÙŠØ±", "Ù…Ø§Ø³ØªÛ•Ø±")}</option>
                  <option value="PhD">{txt("PhD / Doctorate", "Ø¯ÙƒØªÙˆØ±Ø§Ù‡", "Ø¯Ú©ØªÛ†Ø±Ø§")}</option>
                </select>
              </div>
            </div>

            {/* Occupation */}
            <div>
              <label className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-1.5 font-mono">
                {txt("Occupation / Profession", "Ø§Ù„Ù…Ù‡Ù†Ø© / Ø§Ù„Ø¹Ù…Ù„", "Ú©Ø§Ø± / Ù¾ÛŒØ´Û•")}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Briefcase className="w-4.5 h-4.5" />
                </div>
                <input
                  type="text"
                  required
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  placeholder={txt("e.g. Software Engineer, Teacher, Business", "Ù…Ø«Ø§Ù„: Ù…Ù‡Ù†Ø¯Ø³ØŒ Ù…Ø¹Ù„Ù…ØŒ Ø·Ø¨ÙŠØ¨ØŒ Ø¹Ù…Ù„ Ø­Ø±", "Ø¨Û† Ù†Ù…ÙˆÙˆÙ†Û•: Ø¦Û•Ù†Ø¯Ø§Ø²ÛŒØ§Ø±ØŒ Ù…Ø§Ù…Û†Ø³ØªØ§")}
                  className="block w-full pl-10 pr-4 py-3 bg-white border border-stone-200 rounded-xl text-warm-charcoal placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-accent-coral focus:border-accent-coral text-sm font-semibold transition"
                />
              </div>
            </div>

            {/* PHOTO / EMOJI AVATAR SELECTION */}
            <div className="border-t border-dashed border-stone-200/80 pt-4 space-y-3.5">
              <label className="block text-xs font-black text-[#40798C] uppercase tracking-wider font-mono">
                âœ¨ {txt("Profile Photo / Avatar (Optional)", "Ø§Ù„ØµÙˆØ±Ø© Ø§Ù„Ø´Ø®ØµÙŠØ© / Ø§Ù„ØµÙˆØ±Ø© Ø§Ù„Ø±Ù…Ø²ÙŠØ© (Ø§Ø®ØªÙŠØ§Ø±ÙŠ)", "ÙˆÛŽÙ†Û•ÛŒ Ù¾Ú•Û†ÙØ§ÛŒÙ„ ÛŒØ§Ù† Ø¦Ø§Ú¤Ø§ØªØ§Ø± (Ø¦Ø§Ø±Û•Ø²ÙˆÙˆÙ…Û•Ù†Ø¯Ø§Ù†Û•)")}
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setPhotoType('emoji')}
                  className={`p-3 rounded-xl border text-center transition cursor-pointer ${
                    photoType === 'emoji'
                      ? 'bg-accent-coral/10 border-accent-coral text-accent-coral font-bold'
                      : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
                  }`}
                >
                  <span className="block text-lg mb-1">ðŸŒ¸</span>
                  <span className="text-[10px] block font-semibold">{txt("Use Emoji", "ØµÙˆØ±Ø© ØªØ¹Ø¨ÙŠØ±ÙŠØ©", "Ø¨Û•Ú©Ø§Ø±Ú¾ÛŽÙ†Ø§Ù†ÛŒ Ø¦ÛŒÙ…Û†Ø¬ÛŒ")}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPhotoType('initials')}
                  className={`p-3 rounded-xl border text-center transition cursor-pointer ${
                    photoType === 'initials'
                      ? 'bg-accent-coral/10 border-accent-coral text-accent-coral font-bold'
                      : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
                  }`}
                >
                  <span className="block text-lg font-serif font-black text-stone-700 mb-1">
                    {name ? name.charAt(0).toUpperCase() : '?'}
                  </span>
                  <span className="text-[10px] block font-semibold">{txt("Use Initials", "Ø§Ø³ØªØ®Ø¯Ù… Ø§Ù„Ø­Ø±ÙˆÙ Ø§Ù„Ø£ÙˆÙ„Ù‰", "Ù¾ÛŒØªÛ•Ú©Ø§Ù†ÛŒ Ø³Û•Ø±Û•ØªØ§")}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPhotoType('upload')}
                  className={`p-3 rounded-xl border text-center transition cursor-pointer ${
                    photoType === 'upload'
                      ? 'bg-accent-coral/10 border-accent-coral text-accent-coral font-bold'
                      : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
                  }`}
                >
                  <span className="block text-lg mb-1">ðŸ“¸</span>
                  <span className="text-[10px] block font-semibold">{txt("Upload Photo", "Ø±ÙØ¹ ØµÙˆØ±Ø©", "Ø¨Ø§Ø±Ú©Ø±Ø¯Ù†ÛŒ ÙˆÛŽÙ†Û•")}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPhotoType('skip')}
                  className={`p-3 rounded-xl border text-center transition cursor-pointer ${
                    photoType === 'skip'
                      ? 'bg-accent-coral/10 border-accent-coral text-accent-coral font-bold'
                      : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
                  }`}
                >
                  <span className="block text-lg mb-1">ðŸ‘¤</span>
                  <span className="text-[10px] block font-semibold">{txt("Skip For Now", "ØªØ®Ø·ÙŠ Ø§Ù„Ø¢Ù†", "ØªÛŽÙ¾Û•Ú•Ø§Ù†Ø¯Ù†ÛŒ Ø¦ÛŽØ³ØªØ§")}</span>
                </button>
              </div>

              {/* Emoji Options */}
              {photoType === 'emoji' && (
                <div className="bg-[#FCFAF7] p-3 rounded-2xl border border-stone-200 text-center space-y-2">
                  <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">
                    {txt("Choose Your Avatar Icon", "Ø§Ø®ØªØ± Ø£ÙŠÙ‚ÙˆÙ†ØªÙƒ Ø§Ù„Ø®Ø§ØµØ©", "Ø¦Ø§ÛŒÚ©Û†Ù†ÛŒ Ø®Û†Øª Ù‡Û•ÚµØ¨Ú˜ÛŽØ±Û•")}
                  </span>
                  <div className="flex justify-center gap-2 flex-wrap">
                    {['ðŸ‘¤', 'ðŸŒ¸', 'ðŸ•Šï¸', 'ðŸ’', 'ðŸ¤', 'ðŸ§•', 'ðŸ‘¨â€ðŸ’¼'].map((emojiItem) => (
                      <button
                        key={emojiItem}
                        type="button"
                        onClick={() => setSelectedEmoji(emojiItem)}
                        className={`w-10 h-10 rounded-full text-xl flex items-center justify-center transition cursor-pointer border ${
                          selectedEmoji === emojiItem
                            ? 'bg-accent-coral border-accent-coral text-white scale-110 shadow-md'
                            : 'bg-white border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        {emojiItem}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Photo Upload Simulation */}
              {photoType === 'upload' && (
                <div className="bg-[#FCFAF7] p-4 rounded-2xl border border-dashed border-stone-300/80 text-center space-y-2">
                  <div className="flex flex-col items-center justify-center py-2">
                    <span className="text-2xl mb-1">ðŸ“¤</span>
                    <span className="text-[11px] font-bold text-stone-600">
                      {txt("Select or drag a file to upload", "Ø§Ø¶ØºØ· Ù„ØªØ­Ø¯ÙŠØ¯ ØµÙˆØ±Ø© Ø£Ùˆ Ø§Ø³Ø­Ø¨Ù‡Ø§ Ù‡Ù†Ø§", "ÙˆÛŽÙ†Û•Ú©Û•Øª Ù„ÛŽØ±Û• Ø¨Ø§Ø±Ø¨Ú©Û•")}
                    </span>
                    <span className="text-[10px] text-stone-400 font-medium leading-relaxed mt-1 block">
                      {txt("âœ“ Will be BLURRED by default to respect your privacy", "âœ“ Ø³ØªÙƒÙˆÙ† Ù…Ù…ÙˆÙ‡Ø© ØªÙ„Ù‚Ø§Ø¦ÙŠØ§Ù‹ Ù„Ù„Ø­ÙØ§Ø¸ Ø¹Ù„Ù‰ Ø®ØµÙˆØµÙŠØªÙƒ Ø§Ù„ÙˆÙ‚ÙˆØ±Ø©", "âœ“ Ø¨Û• Ø´ÛŽÙˆÛ•ÛŒÛ•Ú©ÛŒ Ø®Û†Ú©Ø§Ø± Ù„ÛŽÚµ Ø¯Û•Ú©Ø±ÛŽØª Ø¨Û† Ù¾Ø§Ø±Ø§Ø³ØªÙ†ÛŒ ØªØ§ÛŒØ¨Û•ØªÙ…Û•Ù†Ø¯ÛŽØªÛŒ")}
                    </span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setUploadedPhotoUrl(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="text-xs text-stone-500 font-semibold block mx-auto cursor-pointer"
                  />
                  {uploadedPhotoUrl && (
                    <div className="mt-2 flex flex-col items-center">
                      <span className="text-[9px] font-bold uppercase text-[#40798C] mb-1">Preview (Blurred)</span>
                      <img
                        src={uploadedPhotoUrl}
                        alt="Preview"
                        className="w-16 h-16 object-cover rounded-xl filter blur-md border border-[#E3D6C0]"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>

          {/* Navigation */}
          <div className="flex gap-3 pt-4 border-t border-dashed border-stone-200">
            <button
              type="button"
              onClick={handleBack}
              className="flex-1 py-3.5 px-4 rounded-xl border border-stone-200 hover:bg-stone-50 font-bold text-xs sm:text-sm text-stone-700 transition cursor-pointer flex items-center justify-center gap-1"
            >
              <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
              <span>{txt("Back", "Ø±Ø¬ÙˆØ¹", "Ú¯Û•Ú•Ø§Ù†Û•ÙˆÛ•")}</span>
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="flex-1.5 py-3.5 px-4 rounded-xl bg-accent-coral text-white hover:bg-[#ff8f66] font-black text-xs sm:text-sm transition cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-accent-coral/15"
            >
              <span>{txt("Next Step", "Ø§Ù„Ø®Ø·ÙˆØ© Ø§Ù„ØªØ§Ù„ÙŠØ©", "Ù‡Û•Ù†Ú¯Ø§ÙˆÛŒ Ø¯Ø§Ù‡Ø§ØªÙˆÙˆ")}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>

        </div>
      )}

      {/* STEP 3: Looking For */}
      {step === 3 && (
        <div className="bg-white/70 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/60 shadow-xl space-y-6 text-left animate-fade-in" id="wizard-step-3">
          
          <div className="text-center space-y-1">
            <h4 className="text-2xl font-serif font-black text-warm-charcoal font-display">
              {txt("What are you looking for?", "Ù…Ø§ Ø§Ù„Ø°ÙŠ ØªØ¨Ø­Ø« Ø¹Ù†Ù‡ØŸ", "Ø¨Û•Ø¯ÙˆØ§ÛŒ Ú†ÛŒØ¯Ø§ Ø¯Û•Ú¯Û•Ú•ÛŽÛŒØªØŸ")}
            </h4>
            <p className="text-stone-500 text-xs sm:text-sm font-semibold">
              {txt("Define basic partner criteria to narrow down matches.", "Ø­Ø¯Ø¯ Ø§Ù„Ø´Ø±ÙˆØ· Ø§Ù„Ø£Ø³Ø§Ø³ÙŠØ© Ù„Ù„Ø´Ø±ÙŠÙƒ Ù„ØªØµÙÙŠØ© Ø§Ù„ØªÙˆØ§ÙÙ‚ Ø§Ù„ÙÙˆØ±ÙŠ.", "Ù¾ÛŽÙˆÛ•Ø±Û• Ø³Û•Ø±Û•Ú©ÛŒÛŒÛ•Ú©Ø§Ù†ÛŒ Ù‡Ø§ÙˆØ¨Û•Ø´Û•Ú©Û•Øª Ø¯ÛŒØ§Ø±ÛŒ Ø¨Ú©Û•.")}
            </p>
          </div>

          <div className="space-y-4">
            
            {/* Preferred Age Range */}
            <div>
              <label className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-1.5 font-mono">
                {txt("Preferred Partner Age Range", "Ø§Ù„Ø¹Ù…Ø± Ø§Ù„Ù…ÙØ¶Ù„ Ù„Ù„Ø´Ø±ÙŠÙƒ", "ØªÛ•Ù…Û•Ù†ÛŒ Ø¯ÚµØ®ÙˆØ§Ø²ÛŒ Ù‡Ø§ÙˆØ¨Û•Ø´")}
              </label>
              <select
                value={prefAgeRange}
                onChange={(e) => setPrefAgeRange(e.target.value)}
                className="block w-full px-4 py-3 bg-white border border-stone-200 rounded-xl text-warm-charcoal focus:outline-none focus:ring-1 focus:ring-accent-coral focus:border-accent-coral text-sm font-semibold transition"
              >
                <option value="18-25">{txt("18 - 25 years old", "Ù¡Ù¨ Ø¥Ù„Ù‰ Ù¢Ù¥ Ø³Ù†Ø©", "Ù¡Ù¨ Ø¨Û† Ù¢Ù¥ Ø³Ø§Úµ")}</option>
                <option value="25-35">{txt("25 - 35 years old", "Ù¢Ù¥ Ø¥Ù„Ù‰ Ù£Ù¥ Ø³Ù†Ø©", "Ù¢Ù¥ Ø¨Û† Ù£Ù¥ Ø³Ø§Úµ")}</option>
                <option value="35-45">{txt("35 - 45 years old", "Ù£Ù¥ Ø¥Ù„Ù‰ Ù¤Ù¥ Ø³Ù†Ø©", "Ù£Ù¥ Ø¨Û† Ù¤Ù¥ Ø³Ø§Úµ")}</option>
                <option value="45+">{txt("45+ years old", "Ù¤Ù¥ Ø³Ù†Ø© ÙÙ…Ø§ ÙÙˆÙ‚", "Ù¤Ù¥ Ø³Ø§Úµ Ø¨Û•Ø±Û•Ùˆ Ø³Û•Ø±Û•ÙˆÛ•")}</option>
                <option value="Flexible">{txt("Flexible", "Ù…Ø±Ù† / Ø£ÙŠ Ø¹Ù…Ø±", "Ú¯ÙˆÙ†Ø¬Ø§Ùˆ")}</option>
              </select>
            </div>

            {/* Preferred Governorate */}
            <div>
              <label className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-1.5 font-mono">
                {txt("Preferred Partner Governorate", "Ù…Ø­Ø§ÙØ¸Ø© Ø§Ù„Ø´Ø±ÙŠÙƒ Ø§Ù„Ù…ÙØ¶Ù„Ø©", "Ù¾Ø§Ø±ÛŽØ²Ú¯Ø§ÛŒ Ø¯ÚµØ®ÙˆØ§Ø²ÛŒ Ù‡Ø§ÙˆØ¨Û•Ø´")}
              </label>
              <select
                value={prefGov}
                onChange={(e) => setPrefGov(e.target.value)}
                className="block w-full px-4 py-3 bg-white border border-stone-200 rounded-xl text-warm-charcoal focus:outline-none focus:ring-1 focus:ring-accent-coral focus:border-accent-coral text-sm font-semibold transition"
              >
                <option value="Any">{txt("Any Governorate / Flexible", "Ø£ÙŠ Ù…Ø­Ø§ÙØ¸Ø© / Ù…Ø±Ù†", "Ù‡Û•Ø± Ù¾Ø§Ø±ÛŽØ²Ú¯Ø§ÛŒÛ•Ú©")}</option>
                {GOVERNORATE_OPTIONS.map((gov) => (
                  <option key={gov.id} value={gov.id}>
                    {isEn ? gov.en : isCkb ? gov.ckb : gov.ar}
                  </option>
                ))}
              </select>
            </div>

            {/* Serious Marriage Only Confirmation Card */}
            <div 
              onClick={() => setIsSeriousOnly(!isSeriousOnly)}
              className={`p-4 rounded-2xl border-2 transition-all duration-300 cursor-pointer flex items-center justify-between gap-3 ${
                isSeriousOnly 
                  ? 'bg-emerald-500/10 border-emerald-500 text-emerald-900 shadow-md' 
                  : 'bg-white border-stone-200 text-[#6B635B]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isSeriousOnly ? 'bg-emerald-500 text-white' : 'bg-stone-100'}`}>
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h5 className="text-xs sm:text-sm font-extrabold">
                    {txt("Seeking Serious Halal Marriage Only", "Ø§Ù„Ø²ÙˆØ§Ø¬ Ø§Ù„Ø¬Ø§Ø¯ Ø¹Ù„Ù‰ ÙƒØªØ§Ø¨ Ø§Ù„Ù„Ù‡ ÙˆØ³Ù†ØªÙ‡ ÙÙ‚Ø·", "ØªÛ•Ù†Ù‡Ø§ Ú¯Û•Ú•Ø§Ù† Ø¨Û•Ø¯ÙˆØ§ÛŒ Ù‡Ø§ÙˆØ³Û•Ø±Ú¯ÛŒØ±ÛŒ Ø´Û•Ø±Ø¹ÛŒ")}
                  </h5>
                  <p className="text-[10px] sm:text-xs opacity-85 font-medium leading-normal mt-0.5">
                    {txt("No casual chat. Complete commitment to safe & ethical courtship.", "Ù…ÙŠØ«Ø§Ù‚ Ø´Ø±Ù Ø¨Ø¹Ø¯Ù… Ø§Ù„Ù…Ø­Ø§Ø¯Ø«Ø§Øª ØºÙŠØ± Ø§Ù„Ù‡Ø§Ø¯ÙØ© ÙˆØ§Ù„Ø§Ù„ØªØ²Ø§Ù… Ø§Ù„Ø£Ø®Ù„Ø§Ù‚ÙŠ Ø§Ù„ÙƒØ§Ù…Ù„.", "Ø¨Û•ÚµÛŽÙ†Ù†Ø§Ù…Û• Ø¨Û† Ø¦Û•Ù†Ø¬Ø§Ù…Ø¯Ø§Ù†ÛŒ Ù¾Û•ÛŒÙˆÛ•Ù†Ø¯ÛŒ Ù‡Û†Ø´ÛŒØ§Ø± Ùˆ Ø´Û•Ø±Ø¹ÛŒ.")}
                  </p>
                </div>
              </div>
              <div className="shrink-0">
                <input 
                  type="checkbox" 
                  checked={isSeriousOnly}
                  onChange={() => {}}
                  className="w-4 h-4 rounded accent-emerald-500 cursor-pointer"
                />
              </div>
            </div>

          </div>

          {/* Navigation */}
          <div className="flex gap-3 pt-4 border-t border-dashed border-stone-200">
            <button
              type="button"
              onClick={handleBack}
              className="flex-1 py-3.5 px-4 rounded-xl border border-stone-200 hover:bg-stone-50 font-bold text-xs sm:text-sm text-stone-700 transition cursor-pointer flex items-center justify-center gap-1"
            >
              <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
              <span>{txt("Back", "Ø±Ø¬ÙˆØ¹", "Ú¯Û•Ú•Ø§Ù†Û•ÙˆÛ•")}</span>
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="flex-1.5 py-3.5 px-4 rounded-xl bg-accent-coral text-white hover:bg-[#ff8f66] font-black text-xs sm:text-sm transition cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-accent-coral/15"
            >
              <span>{txt("Next Step", "Ø§Ù„Ø®Ø·ÙˆØ© Ø§Ù„ØªØ§Ù„ÙŠØ©", "Ù‡Û•Ù†Ú¯Ø§ÙˆÛŒ Ø¯Ø§Ù‡Ø§ØªÙˆÙˆ")}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>

        </div>
      )}

      {/* STEP 4: Account Credentials (register fallback) */}
      {step === 4 && (
        <form 
          onSubmit={handleRegisterAndSubmit} 
          className="bg-white/70 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/60 shadow-xl space-y-6 text-left animate-fade-in" 
          id="wizard-step-4"
        >
          <div className="text-center space-y-1">
            <h4 className="text-2xl font-serif font-black text-warm-charcoal font-display">
              {txt("Secure your account", "ØªØ£Ù…ÙŠÙ† ÙˆØ­ÙØ¸ Ø­Ø³Ø§Ø¨Ùƒ", "Ù‡Û•Ú˜Ù…Ø§Ø±Û•Ú©Û•Øª Ù¾Ø§Ø±ÛŽØ²Ø±Ø§Ùˆ Ø¨Ú©Û•")}
            </h4>
            <p className="text-stone-500 text-xs sm:text-sm font-semibold">
              {txt("Provide your phone or email. No public disclosure, absolute respect.", "Ø£Ø¯Ø®Ù„ ÙˆØ³ÙŠÙ„Ø© Ø§ØªØµØ§Ù„ Ø¢Ù…Ù†Ø©. Ø§Ù„Ø®ØµÙˆØµÙŠØ© Ù…Ø¶Ù…ÙˆÙ†Ø© Ù¡Ù Ù Ùª.", "Ú˜Ù…Ø§Ø±Û•ÛŒ Ù…Û†Ø¨Ø§ÛŒÙ„ ÛŒØ§Ù† Ø¦ÛŒÙ…Û•ÛŒÚµÛ•Ú©Û•Øª Ø¨Ù†ÙˆÙˆØ³Û•. ØªÛ•ÙˆØ§Ùˆ Ù¾Ø§Ø±ÛŽØ²Ø±Ø§ÙˆÛ•.")}
            </p>
          </div>

          <div className="space-y-4">
            {/* Phone or email input */}
            <div>
              <label className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-1.5 font-mono">
                {txt("Phone or Email Address", "Ø±Ù‚Ù… Ø§Ù„Ù‡Ø§ØªÙ Ø£Ùˆ Ø§Ù„Ø¨Ø±ÙŠØ¯ Ø§Ù„Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠ", "Ú˜Ù…Ø§Ø±Û•ÛŒ Ù…Û†Ø¨Ø§ÛŒÙ„ ÛŒØ§Ù† Ù†Ø§ÙˆÙ†ÛŒØ´Ø§Ù†ÛŒ Ø¦ÛŒÙ…Û•ÛŒÚµ")}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Mail className="w-4.5 h-4.5" />
                </div>
                <input
                  type="text"
                  required
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder={txt("e.g. 0770XXXXXXX or email@example.com", "Ù…Ø«Ø§Ù„: Ù Ù§Ù§Ù XXXXXXX Ø£Ùˆ Ø§Ù„Ø¨Ø±ÙŠØ¯ Ø§Ù„Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠ", "Ù†Ù…ÙˆÙˆÙ†Û•: Ù Ù§Ù§Ù XXXXXXX ÛŒØ§Ù† Ø¦ÛŒÙ…Û•ÛŒÚµ")}
                  className="block w-full pl-10 pr-4 py-3 bg-white border border-stone-200 rounded-xl text-warm-charcoal placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-accent-coral focus:border-accent-coral text-sm font-semibold transition"
                />
              </div>
            </div>

            {/* Password input */}
            <div>
              <label className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-1.5 font-mono">
                {txt("Choose a Shield Password", "ÙƒÙ„Ù…Ø© Ø§Ù„Ù…Ø±ÙˆØ± Ø§Ù„Ø¢Ù…Ù†Ø©", "ÙˆØ´Û•ÛŒ ØªÛŽÙ¾Û•Ú•ÛŒ Ù†ÙˆÛŽ")}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Lock className="w-4.5 h-4.5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                  className="block w-full pl-10 pr-10 py-3 bg-white border border-stone-200 rounded-xl text-warm-charcoal placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-accent-coral focus:border-accent-coral text-sm font-semibold transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Navigation and Submit */}
          <div className="flex gap-3 pt-4 border-t border-dashed border-stone-200">
            <button
              type="button"
              onClick={handleBack}
              disabled={isLoading}
              className="flex-1 py-3.5 px-4 rounded-xl border border-stone-200 hover:bg-stone-50 font-bold text-xs sm:text-sm text-stone-700 transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1"
            >
              <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
              <span>{txt("Back", "Ø±Ø¬ÙˆØ¹", "Ú¯Û•Ú•Ø§Ù†Û•ÙˆÛ•")}</span>
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1.5 py-3.5 px-4 rounded-xl bg-gradient-to-r from-accent-coral to-accent-pink text-white font-black text-xs sm:text-sm transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-accent-coral/20"
            >
              {isLoading ? (
                <span className="flex items-center space-x-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{txt("Securing...", "Ø¬Ø§Ø±ÙŠ Ø§Ù„Ø­ÙØ¸...", "Ø¬ÛŽØ¨Û•Ø¬ÛŽ Ø¯Û•Ú©Ø±ÛŽØª...")}</span>
                </span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{txt("Sign Up & Join", "Ø¥Ù†Ø´Ø§Ø¡ Ø§Ù„Ø­Ø³Ø§Ø¨ ÙˆØ§Ù„Ø§Ù†Ø¶Ù…Ø§Ù…", "Ø¯Ø±ÙˆØ³ØªÚ©Ø±Ø¯Ù†ÛŒ Ù‡Û•Ú˜Ù…Ø§Ø±")}</span>
                </>
              )}
            </button>
          </div>

        </form>
      )}

      {/* SUCCESS SCREEN: Shows profile ready at 35% completion */}
      {step === 'success' && (
        <div className="bg-white/95 backdrop-blur-md rounded-[2.5rem] p-8 sm:p-12 border border-white/60 shadow-2xl text-center space-y-8 animate-fade-in" id="wizard-step-success">
          
          <div className="mx-auto w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center shadow-lg text-5xl animate-bounce">
            ðŸŽ‰
          </div>

          <div className="space-y-4">
            <h3 className="text-3xl font-serif font-black text-warm-charcoal font-display leading-tight">
              {txt("Your profile is ready!", "Ù…Ù„ÙÙƒ Ø§Ù„Ø´Ø®ØµÙŠ Ø¬Ø§Ù‡Ø² Ù„Ù„ØªØ¹Ø§Ø±Ù!", "Ù¾Ú•Û†ÙØ§ÛŒÙ„Û•Ú©Û•Øª Ø¦Ø§Ù…Ø§Ø¯Û•ÛŒÛ•!")}
            </h3>
            
            {/* Progress Completion Display: 35% */}
            <div className="bg-stone-50 border border-stone-200/60 rounded-3xl p-5 max-w-sm mx-auto space-y-2.5">
              <div className="flex justify-between items-center text-xs font-mono font-black text-stone-600 uppercase tracking-wider">
                <span>{txt("Profile Completion", "Ù†Ø³Ø¨Ø© Ø¥ÙƒÙ…Ø§Ù„ Ø§Ù„Ù…Ù„Ù Ø§Ù„Ø´Ø®ØµÙŠ", "Ú•ÛŽÚ˜Û•ÛŒ ØªÛ•ÙˆØ§ÙˆØ¨ÙˆÙˆÙ†ÛŒ Ù¾Ú•Û†ÙØ§ÛŒÙ„")}</span>
                <span className="text-accent-coral text-sm font-black">35%</span>
              </div>
              <div className="w-full bg-stone-200/80 h-3 rounded-full overflow-hidden shadow-inner">
                <div 
                  className="bg-gradient-to-r from-accent-coral to-accent-pink h-full rounded-full transition-all duration-1000"
                  style={{ width: '35%' }}
                />
              </div>
              <p className="text-[11px] text-[#8C8075] font-semibold leading-relaxed">
                {txt("Complete optional milestones later inside the app to raise compatibility scores!", "Ø£ÙƒÙ…Ù„ Ø¨Ù‚ÙŠØ© Ø§Ù„Ø¨ÙŠØ§Ù†Ø§Øª Ù„Ø§Ø­Ù‚Ø§Ù‹ Ø¯Ø§Ø®Ù„ Ø§Ù„ØªØ·Ø¨ÙŠÙ‚ Ù„Ø²ÙŠØ§Ø¯Ø© Ù†Ø³Ø¨Ø© Ø§Ù„Ù…Ø·Ø§Ø¨Ù‚Ø© ÙˆØ§Ù„ØªÙˆØ§ÙÙ‚!", "Ø²Ø§Ù†ÛŒØ§Ø±ÛŒ Ø²ÛŒØ§ØªØ± Ø¯ÙˆØ§ØªØ± Ù„Û• Ù†Ø§Ùˆ Ø¦Û•Ù¾Û•Ú©Û• Ù¾Ú•Ø¨Ú©Û•Ø±Û•ÙˆÛ• Ø¨Û† Ø²ÛŒØ§Ø¯Ø¨ÙˆÙˆÙ†ÛŒ Ú¯ÙˆÙ†Ø¬Ø§Ù†Ø¯Ù†!")}
              </p>
            </div>
          </div>

          {/* Action CTA Button */}
          <button
            type="button"
            onClick={() => {
              apiClient.getCurrentUser().then(onComplete).catch(() => {
                onComplete({
                  name,
                  age,
                  gender: role === 'bride' ? 'female' : 'male',
                  country: 'Iraq',
                  governorate,
                  city: district,
                  religion: 'islam',
                  ethnicity: 'arab',
                  languages: ['Arabic'],
                  photoPrivacy: role === 'bride' ? 'hidden_by_default' : 'visible',
                  education,
                  profession: occupation,
                  maritalStatus,
                  partnerAgeRange: prefAgeRange,
                  partnerGovernorate: prefGov,
                  badges: ['Serious for marriage'],
                  values: ['Family First', 'Mutual Respect'],
                  timeline: 'Within 1 year',
                  wantsChildren: 'Yes',
                  relocation: 'Yes',
                  communicationPreference: 'Prefers private respectful correspondence'
                });
              });
            }}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#40798C] to-[#2D5866] hover:opacity-95 text-white font-black text-sm sm:text-base transition duration-300 active:scale-95 shadow-xl shadow-[#40798C]/20 flex items-center justify-center gap-2 cursor-pointer"
            id="start-exploring-btn"
          >
            <Heart className="w-5 h-5 fill-white" />
            <span>{txt("Start Discovering", "Ø§Ø¨Ø¯Ø£ Ø§Ù„Ø§Ø³ØªÙƒØ´Ø§Ù Ø§Ù„Ø¢Ù†", "Ø¯Û•Ø³ØªÙ¾ÛŽÚ©Ø±Ø¯Ù†ÛŒ Ú¯Û•Ú•Ø§Ù†")}</span>
          </button>

        </div>
      )}

    </div>
  );
}

