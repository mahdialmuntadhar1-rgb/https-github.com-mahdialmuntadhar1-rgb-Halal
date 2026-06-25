import React, { useEffect } from 'react';
import { SearchFilters, AppLanguage } from '../types';
import { GOVERNORATES, SECTS, ETHNICITIES, EDUCATION_LEVELS, PROFESSION_CATEGORIES } from '../constants';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';

interface FilterPanelProps {
  filters: SearchFilters;
  setFilters: React.Dispatch<React.SetStateAction<SearchFilters>>;
  showAdvancedFilters: boolean;
  setShowAdvancedFilters: (show: boolean) => void;
  handleResetFilters: () => void;
  filteredCount: number;
  locale: AppLanguage;
}

const GOVERNORATE_CITIES: Record<string, string[]> = {
  'All Iraq': ['All Cities'],
  'Baghdad': ['All Cities', 'Karrada', 'Mansour', 'Adhamiyah', 'Jadriya', 'Zayouna'],
  'Basra': ['All Cities', 'Basra Center', 'Zubair', 'Qurna', 'Abu Al-Khaseeb'],
  'Nineveh': ['All Cities', 'Mosul', 'Tel Kaif', 'Sinjar', 'Hamdaniya'],
  'Erbil': ['All Cities', 'Erbil Center', 'Ankawa', 'Shaqlawa', 'Koya'],
  'Sulaymaniyah': ['All Cities', 'Sulaymaniyah City', 'Chamchamal', 'Rania'],
  'Duhok': ['All Cities', 'Duhok Center', 'Zakho', 'Amedi'],
  'Kirkuk': ['All Cities', 'Kirkuk Center', 'Dakuk', 'Hawija'],
  'Najaf': ['All Cities', 'Najaf Al-Ashraf', 'Kufa District', 'Manathera'],
  'Karbala': ['All Cities', 'Karbala Center', 'Hindiyah'],
  'Babil': ['All Cities', 'Hillah', 'Al-Musayab', 'Mahaweel'],
  'Wasit': ['All Cities', 'Kut', 'Al-Suwaira'],
  'Diyala': ['All Cities', 'Baqubah', 'Muqdadiyah'],
  'Anbar': ['All Cities', 'Ramadi', 'Fallujah', 'Hit'],
  'Salah al-Din': ['All Cities', 'Tikrit', 'Samarra', 'Balad'],
  'Maysan': ['All Cities', 'Amarah'],
  'Dhi Qar': ['All Cities', 'Nasiriyah', 'Shatrah'],
  'Muthanna': ['All Cities', 'Samawah'],
  'Qadisiyah': ['All Cities', 'Diwaniyah']
};

export default function FilterPanel({
  filters,
  setFilters,
  showAdvancedFilters,
  setShowAdvancedFilters,
  handleResetFilters,
  filteredCount,
  locale
}: FilterPanelProps) {

  const handleGenderToggle = (g: 'male' | 'female' | 'all') => {
    setFilters(prev => ({ ...prev, gender: g }));
  };

  // Keep city in tab sync
  useEffect(() => {
    if (filters.governorate) {
      setFilters(prev => ({ ...prev, city: 'All Cities' }));
    }
  }, [filters.governorate, setFilters]);

  const activeGovernorate = filters.governorate || 'All Iraq';
  const availableCities = GOVERNORATE_CITIES[activeGovernorate] || ['All Cities'];

  return (
    <div className="space-y-6" id="filter-panel">
      {/* Search Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-left">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-warm-charcoal font-serif tracking-tight">
            {locale === 'en' ? 'Explore Courtship Portfolios' : 'استعراض الشركاء المحتملين'}
          </h2>
          <p className="text-[#6B635B] text-xs sm:text-sm font-medium mt-1">
            {locale === 'en'
              ? 'Genuine profiles seeking marriage. No swipe tricks, verified portfolios only.'
              : 'ملفات جادة وحقيقية تسعى للزواج على سنة الله ورسوله، بدون ألاعيب التمرير العشوائي.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Advanced toggle button */}
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${
              showAdvancedFilters
                ? 'bg-[#40798C] border-[#40798C] text-white animate-pulse'
                : 'bg-white border-white/50 text-[#4A443F] hover:bg-white'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4 shrink-0" />
            <span>{showAdvancedFilters ? (locale === 'en' ? "Hide Advanced Filters" : "إخفاء الفلاتر المتقدمة") : (locale === 'en' ? "Advanced Filters" : "الفلاتر المتقدمة")}</span>
          </button>

          {/* Reset button */}
          <button
            onClick={handleResetFilters}
            className="flex items-center space-x-1.5 px-3 py-2.5 rounded-xl border border-white/40 bg-white/45 text-xs font-bold text-[#6B635B] hover:text-warm-charcoal transition"
          >
            <RotateCcw className="w-3.5 h-3.5 shrink-0" />
            <span>{locale === 'en' ? 'Reset' : 'إعادة تعيين'}</span>
          </button>

          <div className="bg-white/40 border border-white/30 px-4 py-2.5 rounded-xl text-xs text-[#6B635B] font-mono font-bold flex items-center gap-1.5 shrink-0">
            <span className="w-1.5 h-1.5 bg-[#40798C] rounded-full animate-pulse" />
            <span>{filteredCount} {locale === 'en' ? 'Portfolios' : 'ملفات متوافقة'}</span>
          </div>
        </div>
      </div>

      {/* Main filter board */}
      <div className="bg-white/30 border border-white/45 p-5 sm:p-7 rounded-3xl shadow-xl space-y-5 text-left">

        {/* Row 1: Primary Parameters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          {/* Sort By Option (High visibility requested!) */}
          <div>
            <label className="block text-[10px] font-bold text-accent-coral uppercase tracking-widest font-mono mb-2">
              🧭 {locale === 'en' ? 'Sort Profiles By' : 'فرز الملفات حسب'}
            </label>
            <select
              value={filters.sortBy || 'compatibility'}
              onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
              className="w-full bg-white border border-white/40 p-2.5 rounded-xl text-xs text-warm-charcoal font-semibold focus:outline-none focus:ring-1 focus:ring-accent-coral shadow-sm"
            >
              <option value="compatibility">{locale === 'en' ? '⭐️ Best Compatibility' : '⭐ الأفضل توافقاً'}</option>
              <option value="newest">{locale === 'en' ? '🕐 Newest Members' : '🕐 الأعضاء الأحدث'}</option>
              <option value="closest">{locale === 'en' ? '📍 Closest Location' : '📍 الموقع الأقرب لي'}</option>
              <option value="completeness">{locale === 'en' ? '📈 Most Complete Profiles' : '📈 الملفات الأكثر اكتمالاً'}</option>
            </select>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-[10px] font-bold text-warm-charcoal uppercase tracking-widest font-mono mb-2">
              {locale === 'en' ? 'Partner Gender' : 'جنس الشريك المرتقب'}
            </label>
            <div className="grid grid-cols-3 gap-1 bg-white/50 border border-white/40 p-1 rounded-xl">
              {(['male', 'female', 'all'] as const).map((g) => (
                <button
                  type="button"
                  key={g}
                  onClick={() => handleGenderToggle(g)}
                  className={`py-1.5 text-xs font-bold rounded-lg transition-all capitalize ${
                    filters.gender === g
                      ? 'bg-gradient-to-br from-accent-coral to-accent-pink text-white shadow-md'
                      : 'text-[#6B635B] hover:text-warm-charcoal'
                  }`}
                >
                  {g === 'all' ? (locale === 'en' ? 'both' : 'الكل') : g === 'male' ? (locale === 'en' ? 'men' : 'رجال') : (locale === 'en' ? 'women' : 'نساء')}
                </button>
              ))}
            </div>
          </div>

          {/* Age range */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-[10px] font-bold text-warm-charcoal uppercase tracking-widest font-mono">
                {locale === 'en' ? `Age Scope (${filters.minAge} - ${filters.maxAge})` : `النطاق العمري (${filters.minAge} - ${filters.maxAge})`}
              </label>
            </div>
            <div className="flex items-center space-x-3 bg-white/60 p-2 border border-white/30 rounded-xl">
              <input
                type="range"
                min="18"
                max="60"
                value={filters.minAge}
                onChange={(e) => setFilters(prev => ({ ...prev, minAge: Math.min(prev.maxAge - 2, parseInt(e.target.value) || 18) }))}
                className="accent-accent-coral flex-1 h-1.5 rounded-full cursor-pointer bg-stone-200"
              />
              <input
                type="range"
                min="18"
                max="60"
                value={filters.maxAge}
                onChange={(e) => setFilters(prev => ({ ...prev, maxAge: Math.max(prev.minAge + 2, parseInt(e.target.value) || 60) }))}
                className="accent-accent-coral flex-1 h-1.5 rounded-full cursor-pointer bg-stone-200"
              />
            </div>
          </div>

          {/* Iraq Governorate */}
          <div>
            <label className="block text-[10px] font-bold text-warm-charcoal uppercase tracking-widest font-mono mb-2">
              {locale === 'en' ? 'Iraqi Governorate' : 'المحافظة العراقية'}
            </label>
            <select
              value={filters.governorate}
              onChange={(e) => setFilters(prev => ({ ...prev, governorate: e.target.value }))}
              className="w-full bg-white border border-white/40 p-2.5 rounded-xl text-xs text-warm-charcoal focus:outline-none focus:ring-1 focus:ring-accent-coral shadow-sm font-semibold"
            >
              <option value="All Iraq">{locale === 'en' ? 'Across all Iraq' : 'كل المحافظات'}</option>
              {GOVERNORATES.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Row 2: Secondary / Advanced filters configuration (Show always or conditionally) */}
        {showAdvancedFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-white/20 animate-fade-in text-left">

            {/* Iraq City Option (Dynamically dependent on selected governorate) */}
            <div>
              <label className="block text-[10px] font-bold text-warm-charcoal uppercase tracking-widest font-mono mb-2">
                🏡 {locale === 'en' ? 'City / District' : 'المدينة / القضاء'}
              </label>
              <select
                value={filters.city || 'All Cities'}
                onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
                className="w-full bg-white border border-white/40 p-2.5 rounded-xl text-xs text-warm-charcoal focus:outline-none shadow-sm font-semibold"
              >
                {availableCities.map((c) => (
                  <option key={c} value={c}>
                    {c === 'All Cities' ? (locale === 'en' ? 'All Cities' : 'كل المدن') : c}
                  </option>
                ))}
              </select>
            </div>

            {/* Religion Selection */}
            <div>
              <label className="block text-[10px] font-bold text-warm-charcoal uppercase tracking-widest font-mono mb-2">
                🕌 {locale === 'en' ? 'Religion Stance' : 'الديانة'}
              </label>
              <select
                value={filters.religion}
                onChange={(e) => setFilters(prev => ({ ...prev, religion: e.target.value as 'all' | 'islam' | 'non_islam', sect: 'all' }))}
                className="w-full bg-white border border-white/40 p-2.5 rounded-xl text-xs text-warm-charcoal font-semibold focus:outline-none shadow-sm"
              >
                <option value="all">{locale === 'en' ? 'Any Religion' : 'أي ديانة'}</option>
                <option value="islam">{locale === 'en' ? 'Islam' : 'الإسلام'}</option>
                <option value="non_islam">{locale === 'en' ? 'Non-Islam' : 'غير مسلم'}</option>
              </select>
            </div>

            {/* Islamic Sect Preference (if religion is islam or checking all) */}
            {filters.religion !== 'non_islam' && (
              <div>
                <label className="block text-[10px] font-bold text-warm-charcoal uppercase tracking-widest font-mono mb-2">
                  📿 {locale === 'en' ? 'Islamic Sect' : 'المذهب'}
                </label>
                <select
                  value={filters.sect}
                  onChange={(e) => setFilters(prev => ({ ...prev, sect: e.target.value as 'all' | 'sunni' | 'shiaa' | 'none' }))}
                  className="w-full bg-white border border-white/40 p-2.5 rounded-xl text-xs text-warm-charcoal focus:outline-none shadow-sm font-semibold"
                >
                  <option value="all">{locale === 'en' ? 'Any Sect / Tolerant' : 'أي مذهب / متسامح'}</option>
                  <option value="sunni">{locale === 'en' ? 'Sunni Only' : 'سُنّي فقط'}</option>
                  <option value="shiaa">{locale === 'en' ? 'Shiaa Only' : 'شيعي فقط'}</option>
                </select>
              </div>
            )}

            {/* Ethnicity Preference */}
            <div>
              <label className="block text-[10px] font-bold text-warm-charcoal uppercase tracking-widest font-mono mb-2">
                🌍 {locale === 'en' ? 'Ethnicity' : 'القومية'}
              </label>
              <select
                value={filters.ethnicity}
                onChange={(e) => setFilters(prev => ({ ...prev, ethnicity: e.target.value as 'all' | 'arab' | 'kurdish' | 'others' }))}
                className="w-full bg-white border border-white/40 p-2.5 rounded-xl text-xs text-warm-charcoal focus:outline-none shadow-sm font-semibold"
              >
                <option value="all">{locale === 'en' ? 'Any Ethnicity' : 'أي قومية'}</option>
                <option value="arab">{locale === 'en' ? 'Arab Heritage' : 'قومية عربية'}</option>
                <option value="kurdish">{locale === 'en' ? 'Kurdish Heritage' : 'قومية كوردية'}</option>
                <option value="others">{locale === 'en' ? 'Others (Turkmen, Assyrian)' : 'قومية أخرى (تركماني، آشوري)'}</option>
              </select>
            </div>

            {/* Academic Education Level */}
            <div>
              <label className="block text-[10px] font-bold text-warm-charcoal uppercase tracking-widest font-mono mb-2">
                🎓 {locale === 'en' ? 'Education' : 'التعليم'}
              </label>
              <select
                value={filters.education}
                onChange={(e) => setFilters(prev => ({ ...prev, education: e.target.value }))}
                className="w-full bg-white border border-white/40 p-2.5 rounded-xl text-xs text-warm-charcoal focus:outline-none shadow-sm font-semibold"
              >
                <option value="All Education Levels">{locale === 'en' ? 'All Education Levels' : 'كل المستويات التعليمية'}</option>
                {EDUCATION_LEVELS.map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            {/* Profession category */}
            <div>
              <label className="block text-[10px] font-bold text-warm-charcoal uppercase tracking-widest font-mono mb-2">
                💼 {locale === 'en' ? 'Profession Category' : 'فئة المهنة'}
              </label>
              <select
                value={filters.profession}
                onChange={(e) => setFilters(prev => ({ ...prev, profession: e.target.value }))}
                className="w-full bg-white border border-white/40 p-2.5 rounded-xl text-xs text-warm-charcoal focus:outline-none shadow-sm font-semibold"
              >
                <option value="All Professions">{locale === 'en' ? 'All Professions' : 'كل المهن والوظائف'}</option>
                {PROFESSION_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Marriage timeline filter */}
            <div>
              <label className="block text-[10px] font-bold text-warm-charcoal uppercase tracking-widest font-mono mb-2">
                🕒 {locale === 'en' ? 'Marriage Timeline' : 'الجدول الزمني للزواج'}
              </label>
              <select
                value={filters.timeline || 'all'}
                onChange={(e) => setFilters(prev => ({ ...prev, timeline: e.target.value }))}
                className="w-full bg-white border border-white/40 p-2.5 rounded-xl text-xs text-warm-charcoal focus:outline-none shadow-sm font-semibold"
              >
                <option value="all">{locale === 'en' ? 'Any Timeline / Flexible' : 'أي وقت / مرن'}</option>
                <option value="soon">{locale === 'en' ? 'Soon / Within 6 months' : 'بسرعة / خلال 6 أشهر'}</option>
                <option value="1year">{locale === 'en' ? 'Within 1 year' : 'خلال سنة واحدة'}</option>
                <option value="2years">{locale === 'en' ? 'Within 1-2 years' : 'خلال سنة إلى سنتين'}</option>
                <option value="flexible">{locale === 'en' ? 'Flexible' : 'مرن وغير مستعجل'}</option>
              </select>
            </div>

            {/* Wants Children stance */}
            <div>
              <label className="block text-[10px] font-bold text-warm-charcoal uppercase tracking-widest font-mono mb-2">
                👶 {locale === 'en' ? 'Children Stance' : 'الرغبة في الإنجاب'}
              </label>
              <select
                value={filters.wantsChildren}
                onChange={(e) => setFilters(prev => ({ ...prev, wantsChildren: e.target.value }))}
                className="w-full bg-white border border-white/40 p-2.5 rounded-xl text-xs text-warm-charcoal focus:outline-none shadow-sm font-semibold"
              >
                <option value="All">{locale === 'en' ? 'Any Stance' : 'أي موقف'}</option>
                <option value="Yes">{locale === 'en' ? 'Yes, wants children' : 'نعم، يفضل إنجاب أطفال'}</option>
                <option value="No">{locale === 'en' ? 'No/Undecided' : 'لا أو يفضل الانتظار'}</option>
              </select>
            </div>

            {/* Smoking preference filter */}
            <div>
              <label className="block text-[10px] font-bold text-warm-charcoal uppercase tracking-widest font-mono mb-2">
                🚭 {locale === 'en' ? 'Smoking Status' : 'موقف التدخين'}
              </label>
              <select
                value={filters.smoking || 'All'}
                onChange={(e) => setFilters(prev => ({ ...prev, smoking: e.target.value }))}
                className="w-full bg-white border border-white/40 p-2.5 rounded-xl text-xs text-warm-charcoal focus:outline-none shadow-sm font-semibold"
              >
                <option value="All">{locale === 'en' ? 'Any preference' : 'أي شريك'}</option>
                <option value="Strictly Non-smoker">{locale === 'en' ? 'Strictly Non-smoker' : 'غير مدخن قطارياً'}</option>
              </select>
            </div>

            {/* Photo Visibility preference filter */}
            <div>
              <label className="block text-[10px] font-bold text-warm-charcoal uppercase tracking-widest font-mono mb-2">
                📸 {locale === 'en' ? 'Portrait Privacy' : 'خصوصية الصورة الشخصية'}
              </label>
              <select
                value={filters.photoVisibility || 'All'}
                onChange={(e) => setFilters(prev => ({ ...prev, photoVisibility: e.target.value }))}
                className="w-full bg-white border border-white/40 p-2.5 rounded-xl text-xs text-warm-charcoal focus:outline-none shadow-sm font-semibold"
              >
                <option value="All">{locale === 'en' ? 'Any Portrait Preference' : 'جميع خيارات الصورة'}</option>
                <option value="Blurred Only">{locale === 'en' ? 'Blurred / Portrait Protected' : 'الصور المصانة مغطاة فقط'}</option>
                <option value="Visible Only">{locale === 'en' ? 'Directly Visible Portraits' : 'الصور المكشوفة مباشرة'}</option>
              </select>
            </div>

            {/* Verified status (Explicitly labeled as DEMO until backend) */}
            <div className="flex flex-col justify-end pt-2">
              <label className="flex items-center space-x-2.5 rtl:space-x-reverse cursor-pointer bg-white/50 border border-white/45 px-3 py-2.5 rounded-xl text-xs font-bold text-warm-charcoal hover:bg-white transition-all select-none shadow-sm h-11">
                <input
                  id="filter-verified-only-adv"
                  type="chekuox"
                  checked={filters.verifiedOnly}
                  onChange={(e) => setFilters(prev => ({ ...prev, verifiedOnly: e.target.checked }))}
                  className="w-4 h-4 text-accent-coral border-white/40 focus:ring-accent-coral rounded cursor-pointer accent-accent-coral"
                />
                <span className="flex items-center gap-1.5 flex-wrap">
                  <span>🥇 {locale === 'en' ? 'Verified Only (Demo Validation)' : 'الموثقين فقط (تأكيد تجريبي)'}</span>
                </span>
              </label>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
