import React, { useState } from 'react';
import { UserProfile } from '../types';
import { AppLanguage } from '../types';
import { 
  Check, 
  ArrowRight, 
  Sparkles, 
  User, 
  GraduationCap, 
  Briefcase, 
  Heart, 
  Settings, 
  ShieldCheck,
  Compass,
  Smile,
  X,
  Languages
} from 'lucide-react';

interface ProfileEditorProps {
  locale: AppLanguage;
  profile: UserProfile;
  onSave: (updatedValues: Partial<UserProfile>) => void;
  onClose: () => void;
  triggerToast: (msg: string) => void;
}

const GOVERNORATES = [
  'Baghdad', 'Basra', 'Nineveh', 'Erbil', 'Sulaymaniyah', 'Duhok', 'Kirkuk',
  'Najaf', 'Karbala', 'Babil', 'Wasit', 'Diyala', 'Anbar', 'Salah al-Din',
  'Maysan', 'Dhi Qar', 'Muthanna', 'Qadisiyah', 'Halabja'
];

const COUNTRIES = ['Iraq', 'Egypt', 'Jordan', 'Saudi Arabia', 'Kuwait', 'UAE', 'Qatar', 'Turkey', 'Iran'];

const EDUCATION_LEVELS = [
  "High School Diploma",
  "Vocational / Technical Degree",
  "Bachelor's Degree",
  "Master's Degree",
  "Doctorate Degree",
  "Other Education Track"
];

const PROFESSION_CATEGORIES = [
  "Engineering",
  "Medicine & Healthcare",
  "Education & Academia",
  "Business, Startups & Finance",
  "Technology, Software & Cyber",
  "Arts, Architecture & Design",
  "Trade & Handcrafted",
  "Homemaker / Home administrator",
  "Other Category"
];

const LANGUAGES_OPTIONS = ['Arabic', 'Kurdish', 'English', 'Turkish', 'French', 'Persian', 'Syriac'];

const WHAT_MATTERS_MOST_OPTIONS = [
  'Family First', 'Religious Commitment', 'Financial Stability', 'Mutual Respect',
  'Traditional Values', 'Modern Outlook', 'No Smoking', 'Educated Partner'
];

export default function ProfileEditor({ locale, profile, onSave, onClose, triggerToast }: ProfileEditorProps) {
  const isEn = locale === 'en';
  const isAr = locale === 'ar';
  
  const [activeSection, setActiveSection] = useState<'basic' | 'professional' | 'religious' | 'intention' | 'partner'>('basic');
  const [editedProfile, setEditedProfile] = useState<UserProfile>({ ...profile });

  const updateField = (fields: Partial<UserProfile>) => {
    setEditedProfile((prev) => ({ ...prev, ...fields }));
  };

  const handleSave = () => {
    onSave(editedProfile);
    triggerToast(
      isEn 
        ? "✨ Profile settings updated successfully!" 
        : isAr 
          ? "✨ تم تحديث تفاصيل ملفك التعريفي بنجاح!" 
          : "✨ زانیارییەکانی پڕۆفایلەکەت بە سەرکەوتوویی نوێکرانەوە!"
    );
    onClose();
  };

  const toggleLanguage = (lang: string) => {
    const active = editedProfile.languages || [];
    const fresh = active.includes(lang)
      ? active.filter(it => it !== lang)
      : [...active, lang];
    updateField({ languages: fresh });
  };

  const toggleValue = (val: string) => {
    const active = editedProfile.values || [];
    const fresh = active.includes(val)
      ? active.filter(it => it !== val)
      : [...active, val];
    updateField({ values: fresh });
  };

  const toggleBadge = (badge: string) => {
    const active = editedProfile.badges || [];
    const fresh = active.includes(badge)
      ? active.filter(it => it !== badge)
      : [...active, badge];
    updateField({ badges: fresh });
  };

  const sections = [
    { id: 'basic', label: isEn ? 'Identity' : 'الهوية الأساسية', icon: User },
    { id: 'professional', label: isEn ? 'Education & Job' : 'الدراسة والعمل', icon: GraduationCap },
    { id: 'religious', label: isEn ? 'Faith & Origin' : 'العقيدة والقومية', icon: ShieldCheck },
    { id: 'intention', label: isEn ? 'Values & Intentions' : 'القيم والزواج', icon: Heart },
    { id: 'partner', label: isEn ? 'Partner Criteria' : 'مواصفات الشريك', icon: Compass }
  ] as const;

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-[2.5rem] border border-white/60 p-6 sm:p-10 shadow-2xl space-y-8 text-start animate-fade-in relative" id="profile-editor-container">
      
      {/* Header Row */}
      <div className="flex justify-between items-center border-b border-stone-200 pb-5">
        <div>
          <h3 className="text-xl sm:text-2xl font-serif font-black text-warm-charcoal font-display">
            {isEn ? 'Edit Complete Dossier Settings' : 'تعديل المعايير والملف بالكامل'}
          </h3>
          <p className="text-xs text-[#6B635B] font-medium mt-1">
            {isEn ? 'Manage all high-seriousness questions and partner alignment filters.' : 'تحديث كافة المواصفات والأسئلة الخاصة بالارتباط وتصفية الشركاء.'}
          </p>
        </div>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-stone-100 rounded-full text-[#6B635B] transition active:scale-90"
          id="close-editor-btn"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="flex overflow-x-auto scrollbar-none border-b border-stone-200/60 pb-2 -mx-2 px-2 gap-1.5 sm:gap-3">
        {sections.map((sect) => {
          const Icon = sect.icon;
          const isActive = activeSection === sect.id;
          return (
            <button
              key={sect.id}
              onClick={() => setActiveSection(sect.id)}
              className={`flex items-center space-x-1.5 rtl:space-x-reverse px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                isActive 
                  ? 'bg-[#40798C] text-white shadow-md' 
                  : 'bg-stone-100/70 hover:bg-stone-200/50 text-[#6B635B]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{sect.label}</span>
            </button>
          );
        })}
      </div>

      {/* Section Content Rendering */}
      <div className="space-y-6 pt-2">
        
        {/* Tab 1: Basic Identity */}
        {activeSection === 'basic' && (
          <div className="space-y-5 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-black text-warm-charcoal uppercase tracking-wider mb-2 font-mono">
                  {isEn ? 'Display Name / Pseudonym' : 'اسم العرض المستعار'}
                </label>
                <input
                  type="text"
                  value={editedProfile.name}
                  onChange={(e) => updateField({ name: e.target.value })}
                  className="w-full bg-white border border-stone-200 p-3 rounded-xl text-warm-charcoal focus:outline-none focus:ring-1 focus:ring-[#40798C] text-sm font-semibold shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-warm-charcoal uppercase tracking-wider mb-2 font-mono">
                  {isEn ? 'Age' : 'العمر'}
                </label>
                <select
                  value={editedProfile.age}
                  onChange={(e) => updateField({ age: parseInt(e.target.value) || 25 })}
                  className="w-full bg-white border border-stone-200 p-3 rounded-xl text-warm-charcoal focus:outline-none focus:ring-1 focus:ring-[#40798C] text-sm font-semibold shadow-sm"
                >
                  {Array.from({ length: 43 }, (_, i) => i + 18).map((a) => (
                    <option key={a} value={a}>{a} {isEn ? 'Years' : 'عاماً'}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-black text-warm-charcoal uppercase tracking-wider mb-2 font-mono">
                  {isEn ? 'Country' : 'البلد'}
                </label>
                <select
                  value={editedProfile.country}
                  onChange={(e) => updateField({ country: e.target.value })}
                  className="w-full bg-white border border-stone-200 p-3 rounded-xl text-warm-charcoal focus:outline-none focus:ring-1 focus:ring-[#40798C] text-sm font-semibold shadow-sm"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-warm-charcoal uppercase tracking-wider mb-2 font-mono">
                  {isEn ? 'Governorate' : 'المحافظة'}
                </label>
                <select
                  value={editedProfile.governorate}
                  onChange={(e) => updateField({ governorate: e.target.value })}
                  className="w-full bg-white border border-stone-200 p-3 rounded-xl text-warm-charcoal focus:outline-none focus:ring-1 focus:ring-[#40798C] text-sm font-semibold shadow-sm"
                >
                  {GOVERNORATES.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-warm-charcoal uppercase tracking-wider mb-2 font-mono">
                  {isEn ? 'City / Area' : 'المنطقة أو الحي'}
                </label>
                <input
                  type="text"
                  value={editedProfile.city || ''}
                  onChange={(e) => updateField({ city: e.target.value })}
                  className="w-full bg-white border border-stone-200 p-3 rounded-xl text-warm-charcoal focus:outline-none focus:ring-1 focus:ring-[#40798C] text-sm font-semibold shadow-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-warm-charcoal uppercase tracking-wider mb-2 font-mono">
                {isEn ? 'Spoken Languages' : 'اللغات التي تتحدثها'}
              </label>
              <div className="flex flex-wrap gap-2">
                {LANGUAGES_OPTIONS.map((lang) => {
                  const selected = (editedProfile.languages || []).includes(lang);
                  return (
                    <button
                      type="button"
                      key={lang}
                      onClick={() => toggleLanguage(lang)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
                        selected
                          ? 'bg-[#40798C] border-[#40798C] text-white shadow-sm'
                          : 'bg-white border-stone-200 text-warm-charcoal hover:bg-stone-50'
                      }`}
                    >
                      {lang}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Professional and Education details */}
        {activeSection === 'professional' && (
          <div className="space-y-5 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-black text-warm-charcoal uppercase tracking-wider mb-2 font-mono">
                  {isEn ? 'Education Level' : 'المستوى التعليمي والشهادة'}
                </label>
                <select
                  value={editedProfile.education}
                  onChange={(e) => updateField({ education: e.target.value })}
                  className="w-full bg-white border border-stone-200 p-3 rounded-xl text-warm-charcoal focus:outline-none focus:ring-1 focus:ring-[#40798C] text-sm font-semibold shadow-sm"
                >
                  {EDUCATION_LEVELS.map((el) => (
                    <option key={el} value={el}>{el}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-warm-charcoal uppercase tracking-wider mb-2 font-mono">
                  {isEn ? 'Marital Status' : 'الحالة الاجتماعية'}
                </label>
                <select
                  value={editedProfile.maritalStatus || 'Single'}
                  onChange={(e) => updateField({ maritalStatus: e.target.value })}
                  className="w-full bg-white border border-stone-200 p-3 rounded-xl text-warm-charcoal focus:outline-none focus:ring-1 focus:ring-[#40798C] text-sm font-semibold shadow-sm"
                >
                  <option value="Single">{isEn ? 'Single' : 'أعزب / عزباء'}</option>
                  <option value="Divorced">{isEn ? 'Divorced' : 'مطلق / مطلقة'}</option>
                  <option value="Widowed">{isEn ? 'Widowed' : 'أرمل / أرملة'}</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-black text-warm-charcoal uppercase tracking-wider mb-2 font-mono">
                  {isEn ? 'Profession Sector' : 'قطاع العمل'}
                </label>
                <select
                  value={editedProfile.professionCategory || 'Engineering'}
                  onChange={(e) => updateField({ professionCategory: e.target.value })}
                  className="w-full bg-white border border-stone-200 p-3 rounded-xl text-warm-charcoal focus:outline-none focus:ring-1 focus:ring-[#40798C] text-sm font-semibold shadow-sm"
                >
                  {PROFESSION_CATEGORIES.map((pc) => (
                    <option key={pc} value={pc}>{pc}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-warm-charcoal uppercase tracking-wider mb-2 font-mono">
                  {isEn ? 'Specific Role Title' : 'العنوان الوظيفي التفصيلي'}
                </label>
                <input
                  type="text"
                  value={editedProfile.profession}
                  onChange={(e) => updateField({ profession: e.target.value })}
                  className="w-full bg-white border border-stone-200 p-3 rounded-xl text-warm-charcoal focus:outline-none focus:ring-1 focus:ring-[#40798C] text-sm font-semibold shadow-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Religion and Ethnicity */}
        {activeSection === 'religious' && (
          <div className="space-y-5 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-black text-warm-charcoal uppercase tracking-wider mb-2 font-mono">
                  {isEn ? 'Religion' : 'الديانة'}
                </label>
                <select
                  value={editedProfile.religion}
                  onChange={(e) => updateField({ religion: e.target.value as 'islam' | 'non_islam' })}
                  className="w-full bg-white border border-stone-200 p-3 rounded-xl text-warm-charcoal focus:outline-none focus:ring-1 focus:ring-[#40798C] text-sm font-semibold shadow-sm"
                >
                  <option value="islam">{isEn ? 'Islam' : 'الإسلام'}</option>
                  <option value="non_islam">{isEn ? 'Non-Islam' : 'ديانات أخرى'}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-warm-charcoal uppercase tracking-wider mb-2 font-mono">
                  {isEn ? 'Sect' : 'المذهب'}
                </label>
                <select
                  value={editedProfile.sect || 'sunni'}
                  onChange={(e) => updateField({ sect: e.target.value as 'sunni' | 'shiaa' | 'none' })}
                  className="w-full bg-white border border-stone-200 p-3 rounded-xl text-warm-charcoal focus:outline-none focus:ring-1 focus:ring-[#40798C] text-sm font-semibold shadow-sm"
                >
                  <option value="sunni">{isEn ? 'Sunni' : 'سني'}</option>
                  <option value="shiaa">{isEn ? 'Shiaa' : 'شيعي'}</option>
                  <option value="none">{isEn ? 'Undisclosed' : 'لا أرغب في الذكر حالياً'}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-warm-charcoal uppercase tracking-wider mb-2 font-mono">
                  {isEn ? 'Ethnicity' : 'القومية'}
                </label>
                <select
                  value={editedProfile.ethnicity}
                  onChange={(e) => updateField({ ethnicity: e.target.value as 'arab' | 'kurdish' | 'others' })}
                  className="w-full bg-white border border-stone-200 p-3 rounded-xl text-warm-charcoal focus:outline-none focus:ring-1 focus:ring-[#40798C] text-sm font-semibold shadow-sm"
                >
                  <option value="arab">{isEn ? 'Arab' : 'عربي / عربية'}</option>
                  <option value="kurdish">{isEn ? 'Kurdish' : 'كردي / كوردية'}</option>
                  <option value="others">{isEn ? 'Others' : 'قوميات أخرى'}</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Values, Badges and marriage plans */}
        {activeSection === 'intention' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-black text-warm-charcoal uppercase tracking-wider mb-2 font-mono">
                  {isEn ? 'Marriage Timeline' : 'الجدول الزمني للارتباط'}
                </label>
                <select
                  value={editedProfile.timeline || 'Within 1 year'}
                  onChange={(e) => updateField({ timeline: e.target.value })}
                  className="w-full bg-white border border-stone-200 p-3 rounded-xl text-warm-charcoal focus:outline-none focus:ring-1 focus:ring-[#40798C] text-sm font-semibold shadow-sm"
                >
                  <option value="As soon as suitable">{isEn ? "As soon as suitable" : "حال توفر النصيب والارتياح"}</option>
                  <option value="Within 3 months">{isEn ? "Within 3 months" : "في غضون ٣ أشهر"}</option>
                  <option value="Within 6 months">{isEn ? "Within 6 months" : "في غضون ٦ أشهر"}</option>
                  <option value="Within 1 year">{isEn ? "Within 1 year" : "في غضون سنة"}</option>
                  <option value="Flexible">{isEn ? "Flexible" : "مرن ومتريث"}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-warm-charcoal uppercase tracking-wider mb-2 font-mono">
                  {isEn ? 'Children Attitude' : 'النظرة لإنجاب الأطفال'}
                </label>
                <select
                  value={editedProfile.wantsChildren || 'Yes'}
                  onChange={(e) => updateField({ wantsChildren: e.target.value })}
                  className="w-full bg-white border border-stone-200 p-3 rounded-xl text-warm-charcoal focus:outline-none focus:ring-1 focus:ring-[#40798C] text-sm font-semibold shadow-sm"
                >
                  <option value="Yes">{isEn ? "Yes, definitely" : "نعم، رغبة بالذرية الصالحة"}</option>
                  <option value="No">{isEn ? "No" : "لا أرغب حالياً"}</option>
                  <option value="Discuss later">{isEn ? "Discuss later" : "تأجيل النقاش لما بعد التوافق"}</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-black text-warm-charcoal uppercase tracking-wider mb-2 font-mono">
                  {isEn ? 'Relocation Option' : 'الاستعداد للانتقال وتغيير السكن'}
                </label>
                <select
                  value={editedProfile.relocation || 'Yes'}
                  onChange={(e) => updateField({ relocation: e.target.value })}
                  className="w-full bg-white border border-stone-200 p-3 rounded-xl text-warm-charcoal focus:outline-none focus:ring-1 focus:ring-[#40798C] text-sm font-semibold shadow-sm"
                >
                  <option value="Yes">{isEn ? "Yes, negotiable" : "نعم، قابل للتفاهم"}</option>
                  <option value="No">{isEn ? "No, prefers current town" : "لا، أفضل البقاء ببلدتي"}</option>
                  <option value="Inside Iraq only">{isEn ? "Inside Iraq only" : "داخل العراق فقط"}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-warm-charcoal uppercase tracking-wider mb-2 font-mono">
                  {isEn ? 'Communication Style' : 'شروط ونمط التواصل'}
                </label>
                <select
                  value={editedProfile.communicationPreference || 'Prefers private respectful correspondence'}
                  onChange={(e) => updateField({ communicationPreference: e.target.value })}
                  className="w-full bg-white border border-stone-200 p-3 rounded-xl text-warm-charcoal focus:outline-none focus:ring-1 focus:ring-[#40798C] text-sm font-semibold shadow-sm"
                >
                  <option value="Prefers private respectful correspondence">{isEn ? "Private respectful correspondence" : "دردشة جدية ثنائية ذات هدف وقور"}</option>
                  <option value="Family-guided parameters">{isEn ? "Family involved" : "شروط وقورة بموازين العرف العراقي"}</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-warm-charcoal uppercase tracking-wider mb-3 font-mono">
                {isEn ? 'What matters most in marriage? (Multi-select)' : 'ما هي المرتكزات والقيم الأهم بالنسبة لك؟'}
              </label>
              <div className="flex flex-wrap gap-2">
                {WHAT_MATTERS_MOST_OPTIONS.map((val) => {
                  const selected = (editedProfile.values || []).includes(val);
                  return (
                    <button
                      type="button"
                      key={val}
                      onClick={() => toggleValue(val)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                        selected
                          ? 'bg-[#40798C] border-[#40798C] text-white shadow-sm'
                          : 'bg-white border-stone-200 text-[#6B635B] hover:bg-stone-50'
                      }`}
                    >
                      {val}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-black text-warm-charcoal uppercase tracking-wider font-mono">
                {isEn ? '🛡️ Serious Intention Badges' : '🛡️ شارات ونوايا الارتباط الجاد'}
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'Serious for marriage', en: 'Serious for marriage', ar: '💍 جاد للزواج الفعلي' },
                  { key: 'Family involved', en: 'Family involved', ar: '👨‍👩‍👧 الأهل على علم بالمشاركة' },
                  { key: 'Ready for engagement', en: 'Ready for engagement', ar: '📝 مستعد للخطوبة الفورية' },
                  { key: 'Private profile', en: 'Private profile', ar: '🔒 ملف تعريفي متحفظ وخاص' }
                ].map((badge) => {
                  const isSelected = (editedProfile.badges || []).includes(badge.key);
                  return (
                    <button
                      type="button"
                      key={badge.key}
                      onClick={() => toggleBadge(badge.key)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition duration-200 ${
                        isSelected
                          ? 'bg-[#40798C] border-[#40798C] text-white shadow-md'
                          : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      <span>{isEn ? badge.en : badge.ar}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Partner Expectations / Compatibility Criteria */}
        {activeSection === 'partner' && (
          <div className="space-y-5 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-black text-warm-charcoal uppercase tracking-wider mb-2 font-mono">
                  {isEn ? 'Preferred Spouse Age Range' : 'الفئة العمرية المقبولة في الطرف الآخر'}
                </label>
                <select
                  value={editedProfile.partnerAgeRange || '25-30'}
                  onChange={(e) => updateField({ partnerAgeRange: e.target.value })}
                  className="w-full bg-white border border-stone-200 p-3 rounded-xl text-warm-charcoal focus:outline-none focus:ring-1 focus:ring-[#40798C] text-sm font-semibold shadow-sm"
                >
                  <option value="18-24">{isEn ? '18-24 Years' : 'من ١٨ إلى ٢٤ عاماً'}</option>
                  <option value="25-30">{isEn ? '25-30 Years' : 'من ٢٥ إلى ٣٠ عاماً'}</option>
                  <option value="31-35">{isEn ? '31-35 Years' : 'من ٣١ إلى ٣٥ عاماً'}</option>
                  <option value="36-40">{isEn ? '36-40 Years' : 'من ٣٦ إلى ٤٠ عاماً'}</option>
                  <option value="Any suitable age">{isEn ? 'Any Suitable Age' : 'لا مشكلة، حسب التوافق'}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-warm-charcoal uppercase tracking-wider mb-2 font-mono">
                  {isEn ? 'Location Search Preference' : 'الأولوية الجغرافية للبحث والتصفية'}
                </label>
                <select
                  value={editedProfile.locationSearchPreference || 'Across all Iraq'}
                  onChange={(e) => updateField({ locationSearchPreference: e.target.value })}
                  className="w-full bg-white border border-stone-200 p-3 rounded-xl text-warm-charcoal focus:outline-none focus:ring-1 focus:ring-[#40798C] text-sm font-semibold shadow-sm"
                >
                  <option value="Same Governorate">{isEn ? 'Same Governorate Only' : 'نفس المحافظة فقط'}</option>
                  <option value="Across all Iraq">{isEn ? 'Across all Iraq' : 'في كل محافظات العراق'}</option>
                  <option value="Global matches">{isEn ? 'Global matches' : 'مغتربين أو خارج العراق'}</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-black text-warm-charcoal uppercase tracking-wider mb-2 font-mono">
                  {isEn ? 'Partner Education' : 'التحصيل الدراسي المطلوب للشريك'}
                </label>
                <select
                  value={editedProfile.partnerEducation || "Bachelor's Degree"}
                  onChange={(e) => updateField({ partnerEducation: e.target.value })}
                  className="w-full bg-white border border-stone-200 p-3 rounded-xl text-warm-charcoal focus:outline-none focus:ring-1 focus:ring-[#40798C] text-sm font-semibold shadow-sm"
                >
                  <option value="High School Diploma">{isEn ? "High School or above" : "إعدادية فما فوق"}</option>
                  <option value="Bachelor's Degree">{isEn ? "Bachelor's Degree or above" : "جامعي فما فوق"}</option>
                  <option value="Master's Degree">{isEn ? "Master's/PhD or above" : "دراسات عليا فما فوق"}</option>
                  <option value="Any level">{isEn ? "Any education level" : "لا يهم التحصيل، الأهم الأخلاق"}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-warm-charcoal uppercase tracking-wider mb-2 font-mono">
                  {isEn ? 'Partner Profession Style' : 'طبيعة عمل الشريك'}
                </label>
                <input
                  type="text"
                  value={editedProfile.partnerProfession || 'Any Profession'}
                  onChange={(e) => updateField({ partnerProfession: e.target.value })}
                  placeholder={isEn ? "e.g. Healthcare, Engineering, or doesn't matter" : "مثال: قطاع طبي، هندسي، أو لا يهم"}
                  className="w-full bg-white border border-stone-200 p-3 rounded-xl text-warm-charcoal focus:outline-none focus:ring-1 focus:ring-[#40798C] text-sm font-semibold shadow-sm"
                />
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Footer Save Button */}
      <div className="flex justify-end gap-3 pt-6 border-t border-stone-200/60">
        <button
          onClick={onClose}
          className="px-6 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-[#6B635B] font-bold text-xs sm:text-sm transition cursor-pointer"
        >
          {isEn ? 'Discard Changes' : 'تراجع'}
        </button>
        <button
          onClick={handleSave}
          className="px-6 py-3 rounded-xl bg-accent-coral hover:bg-[#ff8f66] text-white font-black text-xs sm:text-sm shadow-xl shadow-accent-coral/10 hover:shadow-accent-coral/20 active:scale-95 transition cursor-pointer flex items-center gap-1.5"
          id="save-profile-btn"
        >
          <Check className="w-4 h-4" />
          <span>{isEn ? 'Save Parameters' : 'حفظ التحديثات'}</span>
        </button>
      </div>

    </div>
  );
}
