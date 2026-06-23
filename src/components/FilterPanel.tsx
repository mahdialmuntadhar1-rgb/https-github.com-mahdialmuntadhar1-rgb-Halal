import React, { useEffect } from 'react';
import { SearchFilters, AppLanguage } from '../types';
import { GOVERNORATES, SECTS, ETHNICITIES, EDUCATION_LEVELS, PROFESSION_CATEGORIES } from '../constants';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';
import { TRANSLATIONS } from '../lib/translations';

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

  const t = TRANSLATIONS[locale] || TRANSLATIONS['ar'];
  const txt = (en: string, ar: string, ckb: string) => {
    return locale === 'en' ? en : locale === 'ckb' ? ckb : ar;
  };

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
            {t.exploreTitle}
          </h2>
          <p className="text-[#6B635B] text-xs sm:text-sm font-medium mt-1">
            {t.exploreSub}
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
            <span>{showAdvancedFilters ? t.filterButtonHide : t.filterButtonShow}</span>
          </button>

          {/* Reset button */}
          <button
            onClick={handleResetFilters}
            className="flex items-center space-x-1.5 px-3 py-2.5 rounded-xl border border-white/40 bg-white/45 text-xs font-bold text-[#6B635B] hover:text-warm-charcoal transition"
          >
            <RotateCcw className="w-3.5 h-3.5 shrink-0" />
            <span>{txt('Reset', 'إعادة تعيين', 'پاککردنەوە')}</span>
          </button>

          <div className="bg-white/40 border border-white/30 px-4 py-2.5 rounded-xl text-xs text-[#6B635B] font-mono font-bold flex items-center gap-1.5 shrink-0">
            <span className="w-1.5 h-1.5 bg-[#40798C] rounded-full animate-pulse" />
            <span>{filteredCount} {txt('Portfolios', 'ملفات متوافقة', 'پڕۆفایلی گونجاو')}</span>
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
              🧭 {txt('Sort Profiles By', 'فرز الملفات حسب', 'ڕیزکردنی پڕۆفایلەکان بەپێی')}
            </label>
            <select
              value={filters.sortBy || 'compatibility'}
              onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
              className="w-full bg-white border border-white/40 p-2.5 rounded-xl text-xs text-warm-charcoal font-semibold focus:outline-none focus:ring-1 focus:ring-accent-coral shadow-sm"
            >
              <option value="compatibility">{txt('⭐️ Best Compatibility', '⭐ الأفضل توافقاً', '⭐️ باشترین گونجاوی')}</option>
              <option value="newest">{txt('🕐 Newest Members', '🕐 الأعضاء الأحدث', '🕐 نوێترین ئەندامەکان')}</option>
              <option value="closest">{txt('📍 Closest Location', '📍 الموقع الأقرب لي', '📍 نزیکترین شوێن')}</option>
              <option value="completeness">{txt('📈 Most Complete Profiles', '📈 الملفات الأكثر اكتمالاً', '📈 تەواوترین پڕۆفایلەکان')}</option>
            </select>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-[10px] font-bold text-warm-charcoal uppercase tracking-widest font-mono mb-2">
              {txt('Partner Gender', 'جنس الشريك المرتقب', 'ڕەگەزی هاوبەش')}
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
                  {g === 'all' ? txt('both', 'الكل', 'هەردووکیان') : g === 'male' ? txt('men', 'رجال', 'پیاوان') : txt('women', 'نساء', 'ژنان')}
                </button>
              ))}
            </div>
          </div>

          {/* Age range */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-[10px] font-bold text-warm-charcoal uppercase tracking-widest font-mono">
                {txt(`Age Scope (${filters.minAge} - ${filters.maxAge})`, `النطاق العمري (${filters.minAge} - ${filters.maxAge})`, `مەودای تەمەن (${filters.minAge} - ${filters.maxAge})`)}
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
              {txt('Iraqi Governorate', 'المحافظة العراقية', 'پارێزگای عێراق')}
            </label>
            <select
              value={filters.governorate}
              onChange={(e) => setFilters(prev => ({ ...prev, governorate: e.target.value }))}
              className="w-full bg-white border border-white/40 p-2.5 rounded-xl text-xs text-warm-charcoal focus:outline-none focus:ring-1 focus:ring-accent-coral shadow-sm font-semibold"
            >
              <option value="All Iraq">{txt('Across all Iraq', 'كل المحافظات', 'هەموو پارێزگاکان')}</option>
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
                🏡 {txt('City / District', 'المدينة / القضاء', 'شارۆچکە / قەزا')}
              </label>
              <select
                value={filters.city || 'All Cities'}
                onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
                className="w-full bg-white border border-white/40 p-2.5 rounded-xl text-xs text-warm-charcoal focus:outline-none shadow-sm font-semibold"
              >
                {availableCities.map((c) => (
                  <option key={c} value={c}>
                    {c === 'All Cities' ? txt('All Cities', 'كل المدن', 'هەموو شارەکان') : c}
                  </option>
                ))}
              </select>
            </div>

            {/* Religion Selection */}
            <div>
              <label className="block text-[10px] font-bold text-warm-charcoal uppercase tracking-widest font-mono mb-2">
                🕌 {txt('Religion Stance', 'الديانة', 'بۆچوونی ئایینی')}
              </label>
              <select
                value={filters.religion}
                onChange={(e) => setFilters(prev => ({ ...prev, religion: e.target.value as 'all' | 'islam' | 'non_islam', sect: 'all' }))}
                className="w-full bg-white border border-white/40 p-2.5 rounded-xl text-xs text-warm-charcoal font-semibold focus:outline-none shadow-sm"
              >
                <option value="all">{txt('Any Religion', 'أي ديانة', 'هەر ئایینێک')}</option>
                <option value="islam">{txt('Islam', 'الإسلام', 'ئیسلام')}</option>
                <option value="non_islam">{txt('Non-Islam', 'غير مسلم', 'غیر ئیسلام')}</option>
              </select>
            </div>

            {/* Islamic Sect Preference (if religion is islam or checking all) */}
            {filters.religion !== 'non_islam' && (
              <div>
                <label className="block text-[10px] font-bold text-warm-charcoal uppercase tracking-widest font-mono mb-2">
                  📿 {txt('Islamic Sect', 'المذهب', 'مەزهەب')}
                </label>
                <select
                  value={filters.sect}
                  onChange={(e) => setFilters(prev => ({ ...prev, sect: e.target.value as 'all' | 'sunni' | 'shiaa' | 'none' }))}
                  className="w-full bg-white border border-white/40 p-2.5 rounded-xl text-xs text-warm-charcoal focus:outline-none shadow-sm font-semibold"
                >
                  <option value="all">{txt('Any Sect / Tolerant', 'أي مذهب / متسامح', 'هەر مەزهەبێک / لێبوردە')}</option>
                  <option value="sunni">{txt('Sunni Only', 'سُنّي فقط', 'تەنها سوننە')}</option>
                  <option value="shiaa">{txt('Shiaa Only', 'شيعي فقط', 'تەنها شیعە')}</option>
                </select>
              </div>
            )}

            {/* Ethnicity Preference */}
            <div>
              <label className="block text-[10px] font-bold text-warm-charcoal uppercase tracking-widest font-mono mb-2">
                🌍 {txt('Ethnicity', 'القومية', 'نەتەوە')}
              </label>
              <select
                value={filters.ethnicity}
                onChange={(e) => setFilters(prev => ({ ...prev, ethnicity: e.target.value as 'all' | 'arab' | 'kurdish' | 'others' }))}
                className="w-full bg-white border border-white/40 p-2.5 rounded-xl text-xs text-warm-charcoal focus:outline-none shadow-sm font-semibold"
              >
                <option value="all">{txt('Any Ethnicity', 'أي قومية', 'هەر نەتەوەیەک')}</option>
                <option value="arab">{txt('Arab Heritage', 'قومية عربية', 'عەرەب')}</option>
                <option value="kurdish">{txt('Kurdish Heritage', 'قومية كوردية', 'کورد')}</option>
                <option value="others">{txt('Others (Turkmen, Assyrian)', 'قومية أخرى (تركماني، آشوري)', 'کەمینەکانی تر (تورکمان، ئاشووری)')}</option>
              </select>
            </div>

            {/* Academic Education Level */}
            <div>
              <label className="block text-[10px] font-bold text-warm-charcoal uppercase tracking-widest font-mono mb-2">
                🎓 {txt('Education', 'التعليم', 'ئاستی خوێندن')}
              </label>
              <select
                value={filters.education}
                onChange={(e) => setFilters(prev => ({ ...prev, education: e.target.value }))}
                className="w-full bg-white border border-white/40 p-2.5 rounded-xl text-xs text-warm-charcoal focus:outline-none shadow-sm font-semibold"
              >
                <option value="All Education Levels">{txt('All Education Levels', 'كل المستويات التعليمية', 'هەموو ئاستەکانی خوێندن')}</option>
                {EDUCATION_LEVELS.map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            {/* Profession category */}
            <div>
              <label className="block text-[10px] font-bold text-warm-charcoal uppercase tracking-widest font-mono mb-2">
                💼 {txt('Profession Category', 'فئة المهنة', 'پۆلی پیشە')}
              </label>
              <select
                value={filters.profession}
                onChange={(e) => setFilters(prev => ({ ...prev, profession: e.target.value }))}
                className="w-full bg-white border border-white/40 p-2.5 rounded-xl text-xs text-warm-charcoal focus:outline-none shadow-sm font-semibold"
              >
                <option value="All Professions">{txt('All Professions', 'كل المهن والوظائف', 'هەموو پیشەکان')}</option>
                {PROFESSION_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Marriage timeline filter */}
            <div>
              <label className="block text-[10px] font-bold text-warm-charcoal uppercase tracking-widest font-mono mb-2">
                🕒 {txt('Marriage Timeline', 'الجدول الزمني للزواج', 'ماوەی گەیشتن بە هاوسەرگیری')}
              </label>
              <select
                value={filters.timeline || 'all'}
                onChange={(e) => setFilters(prev => ({ ...prev, timeline: e.target.value }))}
                className="w-full bg-white border border-white/40 p-2.5 rounded-xl text-xs text-warm-charcoal focus:outline-none shadow-sm font-semibold"
              >
                <option value="all">{txt('Any Timeline / Flexible', 'أي وقت / مرن', 'هەر کاتێک / نەرم')}</option>
                <option value="soon">{txt('Soon / Within 6 months', 'بسرعة / خلال 6 أشهر', 'بەمنزیکانە / لە ماوەی ٦ مانگدا')}</option>
                <option value="1year">{txt('Within 1 year', 'خلال سنة واحدة', 'لە ماوەی ١ ساڵدا')}</option>
                <option value="2years">{txt('Within 1-2 years', 'خلال سنة إلى سنتين', 'لە ماوەی ١-٢ ساڵدا')}</option>
                <option value="flexible">{txt('Flexible', 'مرن وغير مستعجل', 'نەرم و بێپەلە')}</option>
              </select>
            </div>

            {/* Wants Children stance */}
            <div>
              <label className="block text-[10px] font-bold text-warm-charcoal uppercase tracking-widest font-mono mb-2">
                👶 {txt('Children Stance', 'الرغبة في الإنجاب', 'هەڵوێستی منداڵبوون')}
              </label>
              <select
                value={filters.wantsChildren}
                onChange={(e) => setFilters(prev => ({ ...prev, wantsChildren: e.target.value }))}
                className="w-full bg-white border border-white/40 p-2.5 rounded-xl text-xs text-warm-charcoal focus:outline-none shadow-sm font-semibold"
              >
                <option value="All">{txt('Any Stance', 'أي موقف', 'هەر هەڵوێستێک')}</option>
                <option value="Yes">{txt('Yes, wants children', 'نعم، يفضل إنجاب أطفال', 'بەڵێ، منداڵی دەوێت')}</option>
                <option value="No">{txt('No/Undecided', 'لا أو يفضل الانتظار', 'نەخێر/بڕیارنەدراو')}</option>
              </select>
            </div>

            {/* Smoking preference filter */}
            <div>
              <label className="block text-[10px] font-bold text-warm-charcoal uppercase tracking-widest font-mono mb-2">
                🚭 {txt('Smoking Status', 'موقف التدخين', 'دۆخی جگەرەکێشان')}
              </label>
              <select
                value={filters.smoking || 'All'}
                onChange={(e) => setFilters(prev => ({ ...prev, smoking: e.target.value }))}
                className="w-full bg-white border border-white/40 p-2.5 rounded-xl text-xs text-warm-charcoal focus:outline-none shadow-sm font-semibold"
              >
                <option value="All">{txt('Any preference', 'أي شريك', 'هەر شتێک')}</option>
                <option value="Strictly Non-smoker">{txt('Strictly Non-smoker', 'غير مدخن قطارياً', 'بە توندی جگەرەنەکێش')}</option>
              </select>
            </div>

            {/* Photo Visibility preference filter */}
            <div>
              <label className="block text-[10px] font-bold text-warm-charcoal uppercase tracking-widest font-mono mb-2">
                📸 {txt('Portrait Privacy', 'خصوصية الصورة الشخصية', 'تایبەتمەندێتی وێنە')}
              </label>
              <select
                value={filters.photoVisibility || 'All'}
                onChange={(e) => setFilters(prev => ({ ...prev, photoVisibility: e.target.value }))}
                className="w-full bg-white border border-white/40 p-2.5 rounded-xl text-xs text-warm-charcoal focus:outline-none shadow-sm font-semibold"
              >
                <option value="All">{txt('Any Portrait Preference', 'جميع خيارات الصورة', 'هەر تایبەتمەندییەکی وێنە')}</option>
                <option value="Blurred Only">{txt('Blurred / Portrait Protected', 'الصور المصانة مغطاة فقط', 'وێنەی پارێزراو/شێڵکراو')}</option>
                <option value="Visible Only">{txt('Directly Visible Portraits', 'الصور المكشوفة مباشرة', 'وێنەی پڕۆفایلی ئاشکرا')}</option>
              </select>
            </div>

            {/* Verified status (Explicitly labeled as DEMO until backend) */}
            <div className="flex flex-col justify-end pt-2">
              <label className="flex items-center space-x-2.5 rtl:space-x-reverse cursor-pointer bg-white/50 border border-white/45 px-3 py-2.5 rounded-xl text-xs font-bold text-warm-charcoal hover:bg-white transition-all select-none shadow-sm h-11">
                <input
                  id="filter-verified-only-adv"
                  type="checkbox"
                  checked={filters.verifiedOnly}
                  onChange={(e) => setFilters(prev => ({ ...prev, verifiedOnly: e.target.checked }))}
                  className="w-4 h-4 text-accent-coral border-white/40 focus:ring-accent-coral rounded cursor-pointer accent-accent-coral"
                />
                <span className="flex items-center gap-1.5 flex-wrap">
                  <span>🥇 {txt('Verified Only (Demo Validation)', 'الموثقين فقط (تأكيد تجريبي)', 'تەنها موثقەکان (تێست)')}</span>
                </span>
              </label>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
