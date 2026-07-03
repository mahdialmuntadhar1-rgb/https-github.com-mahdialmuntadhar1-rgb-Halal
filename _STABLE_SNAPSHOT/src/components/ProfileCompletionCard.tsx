import React, { useState } from 'react';
import { UserProfile, AppLanguage } from '../types';
import { 
  Check, 
  Camera, 
  ShieldCheck, 
  Heart, 
  Smile, 
  Home, 
  Sliders, 
  ChevronRight, 
  Sparkles, 
  X,
  UploadCloud
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ProfileCompletionCardProps {
  locale: AppLanguage;
  userProfile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
}

export default function ProfileCompletionCard({
  locale,
  userProfile,
  onUpdateProfile
}: ProfileCompletionCardProps) {
  const isEn = locale === 'en';
  const isCkb = locale === 'ckb';

  const [activeModal, setActiveModal] = useState<
    'photos' | 'verify' | 'interests' | 'personality' | 'family' | 'preferences' | null
  >(null);

  // Modal temporary state
  const [photoInput, setPhotoInput] = useState('');
  const [idName, setIdName] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(userProfile.values || []);
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);
  const [livingArrangement, setLivingArrangement] = useState('');
  const [prefSect, setPrefSect] = useState<'all' | 'sunni' | 'shiaa' | 'none'>('all');

  const txt = (en: string, ar: string, ckb: string) => {
    return isEn ? en : isCkb ? ckb : ar;
  };

  // Check completion of each section
  const hasPhotos = !!userProfile.avatarUrl;
  const isVerified = userProfile.badges?.some(b => b.toLowerCase().includes('verified'));
  const hasInterests = selectedInterests.length > 2 || (userProfile.values && userProfile.values.length > 2);
  const hasPersonality = selectedTraits.length > 1 || (localStorage.getItem('completed_personality') === 'true');
  const hasFamilyDetails = !!livingArrangement || (localStorage.getItem('completed_family') === 'true');
  const hasPreferences = !!userProfile.partnerAgeRange && userProfile.partnerAgeRange !== 'Flexible';

  // Math: 35% base + 15% (photos) + 5 * 10% = 100%
  let score = 35;
  if (hasPhotos) score += 15;
  if (isVerified) score += 10;
  if (hasInterests) score += 10;
  if (hasPersonality) score += 10;
  if (hasFamilyDetails) score += 10;
  if (hasPreferences) score += 10;

  const handleSavePhotos = () => {
    const avatarToUse = photoInput || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userProfile.name || 'avatar'}`;
    onUpdateProfile({ avatarUrl: avatarToUse });
    setActiveModal(null);
  };

  const handleSaveVerify = () => {
    const currentBadges = userProfile.badges || [];
    if (!currentBadges.includes('Verified Profile')) {
      onUpdateProfile({ badges: [...currentBadges, 'Verified Profile'] });
    }
    setActiveModal(null);
  };

  const handleSaveInterests = () => {
    onUpdateProfile({ values: selectedInterests });
    setActiveModal(null);
  };

  const handleSavePersonality = () => {
    localStorage.setItem('completed_personality', 'true');
    setActiveModal(null);
  };

  const handleSaveFamily = () => {
    localStorage.setItem('completed_family', 'true');
    onUpdateProfile({ relocation: 'Yes' });
    setActiveModal(null);
  };

  const handleSavePreferences = () => {
    onUpdateProfile({
      partnerAgeRange: '25-35',
      partnerSect: prefSect
    });
    setActiveModal(null);
  };

  const milestones = [
    {
      id: 'photos',
      title: txt("Add profile photo", "إضافة صورة شخصية", "زیادکردنی وێنەی پڕۆفایل"),
      desc: txt("Let matching partners view your avatar", "اسمح للشركاء برؤية هويتك الرمزية", "ڕێگە بدە هاوبەشە گونجاوەکان وێنەکەت ببینن"),
      icon: <Camera className="w-5 h-5" />,
      completed: hasPhotos,
      points: "+15%"
    },
    {
      id: 'verify',
      title: txt("Verify your account", "توثيق حسابك بالهوية", "پشتڕاستکردنەوەی هەژمار"),
      desc: txt("Upload simulated ID to get verified badge", "ارفع إثبات الهوية لتفعيل شارة الأمان", "ناسنامەکەت پشتڕاست بکەرەوە بۆ وەرگرتنی نیشانەی متمانە"),
      icon: <ShieldCheck className="w-5 h-5" />,
      completed: isVerified,
      points: "+10%"
    },
    {
      id: 'interests',
      title: txt("Add interests", "إضافة الاهتمامات والهوايات", "زیادکردنی خولیاکان"),
      desc: txt("Select values & interests that matter to you", "اختر القيم والهوايات التي تهتم بها", "خولیا و بەها گرنگەکانت دیاری بکە"),
      icon: <Heart className="w-5 h-5" />,
      completed: hasInterests,
      points: "+10%"
    },
    {
      id: 'personality',
      title: txt("Add personality traits", "تحديد معالم شخصيتك", "دیاریکردنی سیفەتەکانی کەسایەتی"),
      desc: txt("Describe your communication and character style", "صف أسلوبك في الحوار والتعامل", "شێوازی گفتوگۆ و کەسایەتیت بنووسە"),
      icon: <Smile className="w-5 h-5" />,
      completed: hasPersonality,
      points: "+10%"
    },
    {
      id: 'family',
      title: txt("Add family details", "بيانات السكن والعائلة", "زانیاری خێزان و سکن"),
      desc: txt("Set preferred living arrangement after marriage", "حدد نمط السكن المفضل بعد الزواج", "شێوازی نیشتەجێبوونی دڵخوازت دیاری بکە"),
      icon: <Home className="w-5 h-5" />,
      completed: hasFamilyDetails,
      points: "+10%"
    },
    {
      id: 'preferences',
      title: txt("Add marriage preferences", "تفضيلات الزواج التفصيلية", "پێوەرە وردەکانی هاوسەرگیری"),
      desc: txt("Refine your target partner expectations", "خصّص تفضيلات شريك حياتك القادم", "پێوەر و زانیاری هاوسەری دڵخوازت ڕێکبخە"),
      icon: <Sliders className="w-5 h-5" />,
      completed: hasPreferences,
      points: "+10%"
    }
  ];

  const interestOptions = ["Family first", "Prayer", "Reading", "Hiking", "Charity", "Cooking", "Islamic History", "Traveling", "Volunteering"];
  const traitsOptions = ["Calm", "Intellectual", "Humorous", "Introverted", "Cheerful", "Kind-hearted", "Ambitious", "Traditional", "Modern"];

  return (
    <div className="bg-gradient-to-br from-[#ffffff] to-[#FAF8F5] border border-stone-200/80 rounded-[2.5rem] p-6 sm:p-8 shadow-xl space-y-6 text-left" id="profile-completion-card">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
        <div className="space-y-1">
          <h4 className="text-xl font-serif font-black text-warm-charcoal flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent-coral animate-pulse" />
            <span>{txt("Complete your profile", "أكمل ملفك الشخصي", "پڕۆفایلەکەت تەواو بکە")}</span>
          </h4>
          <p className="text-stone-500 text-xs font-semibold leading-relaxed">
            {txt("Complete more information to receive better matches.", "أدخل تفاصيل إضافية للحصول على ترشيحات شركاء أكثر دقة وتوافقاً.", "زانیاری زیاتر پڕبکەرەوە بۆ وەرگرتنی هاوبەشی گونجاوتر.")}
          </p>
        </div>

        {/* Progress Circle or Indicator */}
        <div className="flex items-center gap-3 bg-stone-100/80 px-4 py-2 rounded-2xl shrink-0">
          <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="24"
                cy="24"
                r="18"
                className="stroke-stone-200"
                strokeWidth="4"
                fill="transparent"
              />
              <circle
                cx="24"
                cy="24"
                r="18"
                className="stroke-accent-coral transition-all duration-1000"
                strokeWidth="4"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 18}
                strokeDashoffset={2 * Math.PI * 18 * (1 - score / 100)}
              />
            </svg>
            <span className="absolute text-xs font-mono font-black text-warm-charcoal">{score}%</span>
          </div>
          <div>
            <span className="block text-xs font-black text-warm-charcoal font-mono">{score}% {txt("Complete", "مكتمل", "تەواوکراو")}</span>
            <span className="block text-[10px] text-stone-500 font-semibold">{txt("35% Base completed", "٣٥٪ الأساسي مكتمل", "٣٥٪ سەرەکی تەواو بووە")}</span>
          </div>
        </div>
      </div>

      {/* Grid of milestones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {milestones.map((m) => (
          <button
            key={m.id}
            onClick={() => setActiveModal(m.id as any)}
            className={`p-4 rounded-2xl border-2 text-left transition-all duration-300 flex items-center justify-between gap-4 group ${
              m.completed
                ? 'bg-emerald-500/5 border-emerald-200 text-emerald-950'
                : 'bg-white border-stone-100 hover:border-stone-200 hover:shadow-md'
            }`}
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                m.completed ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-100 text-stone-500 group-hover:bg-accent-coral/10 group-hover:text-accent-coral transition'
              }`}>
                {m.completed ? <Check className="w-5 h-5 stroke-[3px]" /> : m.icon}
              </div>
              <div className="min-w-0">
                <span className="block text-xs sm:text-sm font-black text-warm-charcoal truncate">{m.title}</span>
                <span className="block text-[10px] text-stone-400 truncate mt-0.5">{m.desc}</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg ${
                m.completed ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-500'
              }`}>
                {m.completed ? txt("Done", "مكتمل", "تەواو") : m.points}
              </span>
              <ChevronRight className="w-4 h-4 text-stone-300 group-hover:translate-x-0.5 transition" />
            </div>
          </button>
        ))}
      </div>

      {/* Interactive Accordion Modal Backdrop */}
      <AnimatePresence>
        {activeModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-warm-charcoal/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 text-left"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white rounded-[2rem] border border-stone-200 shadow-2xl p-6 max-w-md w-full relative space-y-6"
            >
              <button 
                onClick={() => setActiveModal(null)}
                className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-50 rounded-full transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* MODAL: PHOTOS */}
              {activeModal === 'photos' && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h5 className="text-lg font-serif font-black text-warm-charcoal">{txt("Add Profile Photo", "إضافة صورتك الرمزية", "زیادکردنی وێنە")}</h5>
                    <p className="text-xs text-stone-500 font-semibold">{txt("Configure a custom avatar seed or paste any image URL to personalize your presence.", "تخصيص صورتك الرمزية أو إدخال عنوان الصورة الشخصية.", "ناونیشانی وێنەکەت لێرە دابنێ بۆ ڕازاندنەوەی پڕۆفایلەکەت.")}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-stone-600 uppercase tracking-wider font-mono">{txt("Enter Avatar Theme/Seed", "اسم الأفاتار المفضل", "ناوی ئاڤاتار")}</label>
                    <input
                      type="text"
                      value={photoInput}
                      onChange={(e) => setPhotoInput(e.target.value)}
                      placeholder="e.g. Maryam, Yusuf, Grace, Sincere"
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-xs sm:text-sm font-semibold focus:outline-none"
                    />
                  </div>

                  <button
                    onClick={handleSavePhotos}
                    className="w-full py-3 bg-accent-coral hover:bg-[#ff8f66] text-white font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-accent-coral/20 transition cursor-pointer"
                  >
                    {txt("Save Avatar Profile 💖", "حفظ وتحديث الصورة 💖", "پاشەکەوتکردن 💖")}
                  </button>
                </div>
              )}

              {/* MODAL: VERIFY ACCOUNT */}
              {activeModal === 'verify' && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h5 className="text-lg font-serif font-black text-warm-charcoal">{txt("Verify Sincere Profile", "تأكيد وتوثيق الملف", "پشتڕاستکردنەوەی هەژمار")}</h5>
                    <p className="text-xs text-stone-500 font-semibold">{txt("Simulate submitting an ID name or registry entry to verify your identity.", "أدخل الاسم الكامل في البطاقة الوطنية للمحاكاة وتفعيل الشارة.", "ناوی تەواوی خۆت بنووسە بۆ چالاککردنی نیشانەی متمانە.")}</p>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-stone-600 uppercase tracking-wider font-mono">{txt("Your ID Full Name (Simulated)", "الاسم الكامل في الهوية الوطنية", "ناوی تەواو")}</label>
                    <input
                      type="text"
                      value={idName}
                      onChange={(e) => setIdName(e.target.value)}
                      placeholder="e.g. Yusuf Ahmad Al-Iraqi"
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-xs sm:text-sm font-semibold focus:outline-none"
                    />
                  </div>

                  <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-2xl flex items-start gap-2.5">
                    <UploadCloud className="w-5 h-5 text-[#40798C] shrink-0" />
                    <span className="text-[10px] text-[#6B635B] font-semibold leading-relaxed">
                      {txt("This is a safe preview sandbox simulation. No real identification documents are uploaded.", "هذا مجرد نموذج تفاعلي محاكي لحماية الخصوصية بالكامل.", "ئەمە تەنها دۆخی تاقیکارییە بۆ پاراستنی زانیارییەکانت.")}
                    </span>
                  </div>

                  <button
                    onClick={handleSaveVerify}
                    className="w-full py-3 bg-stone-900 hover:bg-stone-850 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg transition cursor-pointer"
                  >
                    {txt("Request Verification Badge 🛡️", "تفعيل شارة الأمان والتوثيق 🛡️", "داواکردنی نیشانەی متمانە 🛡️")}
                  </button>
                </div>
              )}

              {/* MODAL: INTERESTS */}
              {activeModal === 'interests' && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h5 className="text-lg font-serif font-black text-warm-charcoal">{txt("Add Values & Interests", "القيم والهوايات المفضلة", "زیادکردنی خولیا و بەهاکان")}</h5>
                    <p className="text-xs text-stone-500 font-semibold">{txt("Select at least 3 values or activities to represent your lifestyle.", "اختر ٣ قيم أو أنشطة تمثل أسلوب حياتك اليومي.", "لانی کەم ٣ بەها یان خولیا دیاری بکە کە نوێنەرایەتیت دەکەن.")}</p>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {interestOptions.map((o) => {
                      const selected = selectedInterests.includes(o);
                      return (
                        <button
                          key={o}
                          onClick={() => {
                            if (selected) {
                              setSelectedInterests(selectedInterests.filter(i => i !== o));
                            } else {
                              setSelectedInterests([...selectedInterests, o]);
                            }
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                            selected
                              ? 'bg-accent-coral/10 border-accent-coral text-accent-coral'
                              : 'bg-stone-50 border-stone-200 text-stone-600 hover:border-stone-300'
                          }`}
                        >
                          {o}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={handleSaveInterests}
                    className="w-full py-3 bg-accent-coral text-white font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-accent-coral/15 transition cursor-pointer"
                  >
                    {txt("Save Interests 💖", "حفظ وتعديل الاهتمامات 💖", "پاشەکەوتکردنی خولیاکان 💖")}
                  </button>
                </div>
              )}

              {/* MODAL: PERSONALITY */}
              {activeModal === 'personality' && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h5 className="text-lg font-serif font-black text-warm-charcoal">{txt("Add Personality Traits", "معالم وسمات الشخصية", "سمات و سيفەتەکان")}</h5>
                    <p className="text-xs text-stone-500 font-semibold">{txt("Select traits that describe your unique character style.", "اختر الصفات التي تصف طابعك الشخصي المميز.", "سیفەتەکان دیاری بکە کە نوێنەری تۆن.")}</p>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {traitsOptions.map((o) => {
                      const selected = selectedTraits.includes(o);
                      return (
                        <button
                          key={o}
                          onClick={() => {
                            if (selected) {
                              setSelectedTraits(selectedTraits.filter(i => i !== o));
                            } else {
                              setSelectedTraits([...selectedTraits, o]);
                            }
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                            selected
                              ? 'bg-accent-coral/10 border-accent-coral text-accent-coral'
                              : 'bg-stone-50 border-stone-200 text-stone-600 hover:border-stone-300'
                          }`}
                        >
                          {o}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={handleSavePersonality}
                    className="w-full py-3 bg-accent-coral text-white font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-accent-coral/15 transition cursor-pointer"
                  >
                    {txt("Save Personality Traits 💖", "حفظ السمات الشخصية 💖", "پاشەکەوتکردن 💖")}
                  </button>
                </div>
              )}

              {/* MODAL: FAMILY DETAILS */}
              {activeModal === 'family' && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h5 className="text-lg font-serif font-black text-warm-charcoal">{txt("Family & Housing Details", "نمط السكن والعيش بعد الزواج", "زانیاری خێزان و نیشتەجێبوون")}</h5>
                    <p className="text-xs text-stone-500 font-semibold">{txt("State your preferred living arrangements after marriage.", "ما هو نمط السكن المفضل والمستقبلي للزوجين؟", "شێوازی ژیانی دڵخوازی خۆت دیاری بکە.")}</p>
                  </div>

                  <div className="space-y-2">
                    {["Independent House / Flat", "Living with family", "Flexible / Open to discussion"].map((o) => (
                      <button
                        key={o}
                        type="button"
                        onClick={() => setLivingArrangement(o)}
                        className={`w-full p-3.5 rounded-xl border text-xs sm:text-sm font-bold text-left transition cursor-pointer flex items-center justify-between ${
                          livingArrangement === o
                            ? 'bg-accent-coral/10 border-accent-coral text-accent-coral'
                            : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                        }`}
                      >
                        <span>{o}</span>
                        {livingArrangement === o && <Check className="w-4.5 h-4.5" />}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleSaveFamily}
                    className="w-full py-3 bg-accent-coral text-white font-black text-xs sm:text-sm rounded-xl shadow-lg transition cursor-pointer"
                  >
                    {txt("Save Housing Parameters 🏠", "حفظ وتحديث بيانات العائلة 🏠", "پاشەکەوتکردن 🏠")}
                  </button>
                </div>
              )}

              {/* MODAL: PREFERENCES */}
              {activeModal === 'preferences' && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h5 className="text-lg font-serif font-black text-warm-charcoal">{txt("Detailed Marriage Preferences", "تفضيلات الزواج التفصيلية", "پێوەرە وردەکانی هاوسەرگیری")}</h5>
                    <p className="text-xs text-stone-500 font-semibold">{txt("Select detail requirements to filter matching candidates.", "حدد الشروط والضوابط لتصفية الشركاء المتوافقين.", "پێوەرەکان دیاری بکە بۆ دۆزینەوەی باشترین هاوبەش.")}</p>
                  </div>

                  <div className="space-y-2.5">
                    <label className="block text-[10px] font-bold text-stone-600 uppercase tracking-wider font-mono">{txt("Preferred Sect", "المذهب / المدرسة الشرعية", "مەزهەب")}</label>
                    <div className="grid grid-cols-2 gap-2">
                      {["all", "sunni", "shiaa", "none"].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setPrefSect(s as any)}
                          className={`py-2 px-3 rounded-xl border text-xs font-bold transition cursor-pointer capitalize ${
                            prefSect === s
                              ? 'bg-accent-coral/10 border-accent-coral text-accent-coral'
                              : 'bg-stone-50 border-stone-200 text-stone-600'
                          }`}
                        >
                          {s === 'all' ? 'Flexible' : s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleSavePreferences}
                    className="w-full py-3 bg-accent-coral text-white font-black text-xs sm:text-sm rounded-xl shadow-lg transition cursor-pointer"
                  >
                    {txt("Update Partner Requirements 💖", "تحديث شروط الشريك 💖", "نوێکردنەوەی پێوەرەکان 💖")}
                  </button>
                </div>
              )}

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
















