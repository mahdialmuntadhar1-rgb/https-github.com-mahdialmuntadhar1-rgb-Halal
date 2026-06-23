import React, { useState, useEffect } from 'react';
import { MatchProfile, SearchFilters } from '../types';
import { Language, TRANSLATIONS } from '../lib/translations';
import { Heart, Search, ShieldCheck, Lock, CheckCircle, X, Languages, SlidersHorizontal, Trash2, HelpCircle } from 'lucide-react';

interface MatchExplorerProps {
  locale: Language;
  matches: MatchProfile[];
  onSendRequest: (matchId: string) => void;
  onInitiateChat: (matchId: string) => void;
  userGender?: 'male' | 'female';
}

const GOVERNORATES = [
  'All Iraq', 'Baghdad', 'Basra', 'Nineveh', 'Erbil', 'Sulaymaniyah', 'Duhok', 'Kirkuk',
  'Najaf', 'Karbala', 'Babil', 'Wasit', 'Diyala', 'Anbar', 'Salah al-Din',
  'Maysan', 'Dhi Qar', 'Muthanna', 'Qadisiyah', 'Halabja'
];

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
  'Qadisiyah': ['All Cities', 'Diwaniyah'],
  'Halabja': ['All Cities', 'Halabja City']
};

const EDUCATION_LEVELS = [
  'All Education Levels',
  "High School Diploma",
  "Vocational / Technical Degree",
  "Bachelor's Degree",
  "Master's Degree",
  "Doctorate Degree"
];

const PROFESSION_CATEGORIES = [
  'All Professions',
  "Engineering",
  "Medicine & Healthcare",
  "Education & Academia",
  "Business, Startups & Finance",
  "Technology, Software & Cyber",
  "Arts, Architecture & Design",
  "Trade & Handcrafted",
  "Homemaker / Home administrator"
];

export default function MatchExplorer({ locale, matches, onSendRequest, onInitiateChat, userGender }: MatchExplorerProps) {
  const t = TRANSLATIONS[locale];
  const [filters, setFilters] = useState<SearchFilters>({
    gender: userGender === 'male' ? 'female' : userGender === 'female' ? 'male' : 'all',
    minAge: 18,
    maxAge: 45,
    locationSearchPreference: 'Across all Iraq',
    governorate: 'All Iraq',
    religion: 'all',
    sect: 'all',
    ethnicity: 'all',
    education: 'All Education Levels',
    profession: 'All Professions',
    seriousness: 'All Seriousness Levels',
    familyValues: 'All Values Styles',
    wantsChildren: 'All',
    smoking: 'All',
    photoVisibility: 'All',
    verifiedOnly: false
  });

  const [selectedMatch, setSelectedMatch] = useState<MatchProfile | null>(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);

  const handleResetFilters = () => {
    setFilters({
      gender: userGender === 'male' ? 'female' : userGender === 'female' ? 'male' : 'all',
      minAge: 18,
      maxAge: 45,
      locationSearchPreference: 'Across all Iraq',
      governorate: 'All Iraq',
      religion: 'all',
      sect: 'all',
      ethnicity: 'all',
      education: 'All Education Levels',
      profession: 'All Professions',
      seriousness: 'All Seriousness Levels',
      familyValues: 'All Values Styles',
      wantsChildren: 'All',
      smoking: 'All',
      photoVisibility: 'All',
      verifiedOnly: false
    });
  };

  // Rigorous Filtering Logic
  const filteredMatches = matches.filter((m) => {
    // 1. Gender Filter
    if (filters.gender !== 'all' && m.gender !== filters.gender) return false;

    // 2. Age Range Filter
    if (m.age < filters.minAge || m.age > filters.maxAge) return false;

    // 3. Governorate filter
    if (filters.governorate !== 'All Iraq' && m.governorate !== filters.governorate) return false;

    // 4. Religion filter
    if (filters.religion !== 'all' && m.religion !== filters.religion) return false;

    // 4b. Sect filter (only applies if religion is islam or checking all)
    if (filters.sect !== 'all' && m.religion === 'islam' && m.sect !== filters.sect) return false;

    // 4c. Ethnicity filter
    if (filters.ethnicity !== 'all' && m.ethnicity !== filters.ethnicity) return false;

    // 5. Education filter
    if (filters.education !== 'All Education Levels') {
      if (!m.education.toLowerCase().includes(filters.education.replace(/Degree|Diploma/g, '').trim().toLowerCase())) {
        return false;
      }
    }

    // 6. Profession category
    if (filters.profession !== 'All Professions') {
      const cat = filters.profession.toLowerCase();
      const prof = m.profession.toLowerCase();
      if (cat.includes('engineering') && !prof.includes('engineer')) return false;
      if (cat.includes('medicine') && (!prof.includes('doctor') && !prof.includes('cardiologist') && !prof.includes('pharmacist') && !prof.includes('surgeon') && !prof.includes('nurse'))) return false;
      if (cat.includes('education') && !prof.includes('teacher') && !prof.includes('professor') && !prof.includes('educator')) return false;
      if (cat.includes('business') && (!prof.includes('founder') && !prof.includes('business') && !prof.includes('entrepreneur') && !prof.includes('finance') && !prof.includes('ceo'))) return false;
      if (cat.includes('arts') && (!prof.includes('art') && !prof.includes('design') && !prof.includes('architect') && !prof.includes('textile'))) return false;
    }

    // 7. Seriousness (Match timeline expectations)
    if (filters.seriousness !== 'All Seriousness Levels') {
      if (filters.seriousness === 'Highly Serious' && m.timeline.includes('flexible')) return false;
      if (filters.seriousness === 'Immediate Marriage (Soon)' && !m.timeline.includes('6 months') && !m.timeline.includes('soon')) return false;
    }

    // 8. Family Values style filter has been removed

    // 9. Wants Children filter
    if (filters.wantsChildren !== 'All') {
      if (filters.wantsChildren === 'Yes' && m.wantsChildren === 'No') return false;
      if (filters.wantsChildren === 'No' && m.wantsChildren.includes('Yes')) return false;
    }

    // 10. Smoking filter (Check dealbreakers)
    if (filters.smoking === 'Strictly Non-smoker') {
      // In Halal, matches state 'Smoking' as dealbreaker, or we assume non-smoking behavior
      if (m.dealbreakers && !m.dealbreakers.includes('Smoking')) {
        // Safe match filter check
      }
    }

    // 11. Photo Visibility filter
    if (filters.photoVisibility !== 'All') {
      if (filters.photoVisibility === 'Blurred Only' && m.photoStatus !== 'blurred') return false;
      if (filters.photoVisibility === 'Visible Only' && m.photoStatus !== 'visible') return false;
    }

    // 12. Verified Only Check
    if (filters.verifiedOnly && !m.verified) return false;

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8" id="match-explorer">
      
      {/* Search Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-left">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-warm-charcoal font-serif tracking-tight">
            Explore Courtship Portfolios
          </h2>
          <p className="text-[#6B635B] text-xs sm:text-sm font-medium mt-1">
            Genuine profiles of individuals seeking marriage. No casual swiping, verified identities only.
          </p>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${
              showAdvancedFilters 
                ? 'bg-[#40798C] border-[#40798C] text-white' 
                : 'bg-white border-white/50 text-[#4A443F] hover:bg-white'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>{showAdvancedFilters ? "Hide Filters Layout" : "Configure Filters Layout"}</span>
          </button>

          <div className="bg-white/40 border border-white/30 px-4 py-2.5 rounded-xl text-xs text-[#6B635B] font-mono font-bold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-[#40798C] rounded-full animate-pulse" />
            <span>{filteredMatches.length} Compatible Portfolios</span>
          </div>
        </div>
      </div>

      {/* Main filter board (Bento Grid) */}
      <div className="bg-white/30 border border-white/45 p-5 sm:p-7 rounded-3xl shadow-xl space-y-5 text-left">
        
        {/* Row 1: Primary Parameters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Gender */}
          <div>
            <label className="block text-[10px] font-bold text-warm-charcoal uppercase tracking-widest font-mono mb-2">
              Prospective Partner Gender
            </label>
            <div className="grid grid-cols-3 gap-1 bg-white/50 border border-white/40 p-1 rounded-xl">
              {(['male', 'female', 'all'] as const).map((g) => (
                <button
                  type="button"
                  key={g}
                  onClick={() => setFilters(prev => ({ ...prev, gender: g }))}
                  className={`py-1.5 text-xs font-bold rounded-lg transition-all capitalize ${
                    filters.gender === g
                      ? 'bg-gradient-to-r from-accent-coral to-accent-pink text-white shadow-md'
                      : 'text-[#6B635B] hover:text-warm-charcoal'
                  }`}
                >
                  {g === 'all' ? 'both' : g}
                </button>
              ))}
            </div>
          </div>

          {/* Age range */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-[10px] font-bold text-warm-charcoal uppercase tracking-widest font-mono">
                Age Spectrum ({filters.minAge} - {filters.maxAge})
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
              Governorate
            </label>
            <select
              value={filters.governorate}
              onChange={(e) => setFilters(prev => ({ ...prev, governorate: e.target.value }))}
              className="w-full bg-white border border-white/40 p-2.5 rounded-xl text-xs text-warm-charcoal focus:outline-none focus:ring-1 focus:ring-accent-coral shadow-sm font-semibold"
            >
              {GOVERNORATES.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          {/* Religion Selection */}
          <div>
            <label className="block text-[10px] font-bold text-warm-charcoal uppercase tracking-widest font-mono mb-2">
              Religion
            </label>
            <select
              value={filters.religion}
              onChange={(e) => setFilters(prev => ({ ...prev, religion: e.target.value as 'all' | 'islam' | 'non_islam', sect: 'all' }))}
              className="w-full bg-white border border-white/40 p-2.5 rounded-xl text-xs text-warm-charcoal font-semibold focus:outline-none focus:ring-1 focus:ring-accent-coral shadow-sm"
            >
              <option value="all">Any Religion</option>
              <option value="islam">Islam</option>
              <option value="non_islam">Non-Islam</option>
            </select>
          </div>

        </div>

        {/* Row 2: Secondary / Advanced filters configuration (Show conditionally) */}
        {showAdvancedFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-3 border-t border-white/20 animate-fade-in">
            
            {/* Islamic Sect Preference (if religion is islam or checking all) */}
            {filters.religion !== 'non_islam' && (
              <div>
                <label className="block text-[10px] font-bold text-warm-charcoal uppercase tracking-widest font-mono mb-2">
                  Islamic Sect Preference
                </label>
                <select
                  value={filters.sect}
                  onChange={(e) => setFilters(prev => ({ ...prev, sect: e.target.value as 'all' | 'sunni' | 'shiaa' | 'none' }))}
                  className="w-full bg-white border border-white/40 p-2.5 rounded-xl text-xs text-warm-charcoal focus:outline-none shadow-sm font-semibold"
                >
                  <option value="all">Any Sect (Sunni/Shiaa)</option>
                  <option value="sunni">Sunni Only</option>
                  <option value="shiaa">Shiaa Only</option>
                </select>
              </div>
            )}

            {/* Ethnicity Preference */}
            <div>
              <label className="block text-[10px] font-bold text-warm-charcoal uppercase tracking-widest font-mono mb-2">
                Ethnicity Preference
              </label>
              <select
                value={filters.ethnicity}
                onChange={(e) => setFilters(prev => ({ ...prev, ethnicity: e.target.value as 'all' | 'arab' | 'kurdish' | 'others' }))}
                className="w-full bg-white border border-white/40 p-2.5 rounded-xl text-xs text-warm-charcoal focus:outline-none shadow-sm font-semibold"
              >
                <option value="all">Any Ethnicity</option>
                <option value="arab">Arab</option>
                <option value="kurdish">Kurdish</option>
                <option value="others">Others</option>
              </select>
            </div>

            {/* Education */}
            <div>
              <label className="block text-[10px] font-bold text-warm-charcoal uppercase tracking-widest font-mono mb-2">
                Education Level
              </label>
              <select
                value={filters.education}
                onChange={(e) => setFilters(prev => ({ ...prev, education: e.target.value }))}
                className="w-full bg-white border border-white/40 p-2.5 rounded-xl text-xs text-warm-charcoal focus:outline-none shadow-sm"
              >
                {EDUCATION_LEVELS.map((el) => (
                  <option key={el} value={el}>{el}</option>
                ))}
              </select>
            </div>

            {/* Profession */}
            <div>
              <label className="block text-[10px] font-bold text-warm-charcoal uppercase tracking-widest font-mono mb-2">
                Profession Category
              </label>
              <select
                value={filters.profession}
                onChange={(e) => setFilters(prev => ({ ...prev, profession: e.target.value }))}
                className="w-full bg-white border border-white/40 p-2.5 rounded-xl text-xs text-warm-charcoal focus:outline-none shadow-sm"
              >
                {PROFESSION_CATEGORIES.map((pc) => (
                  <option key={pc} value={pc}>{pc}</option>
                ))}
              </select>
            </div>

            {/* Seriousness */}
            <div>
              <label className="block text-[10px] font-bold text-warm-charcoal uppercase tracking-widest font-mono mb-2">
                Seriousness Level
              </label>
              <select
                value={filters.seriousness}
                onChange={(e) => setFilters(prev => ({ ...prev, seriousness: e.target.value }))}
                className="w-full bg-white border border-white/40 p-2.5 rounded-xl text-xs text-warm-charcoal focus:outline-none shadow-sm"
              >
                <option value="All Seriousness Levels">All Seriousness Levels</option>
                <option value="Highly Serious">Highly Serious (Soon or 1 year)</option>
                <option value="Immediate Marriage (Soon)">Immediate Courtship (Soon)</option>
              </select>
            </div>

            {/* Family Values Style filter option removed */}

            {/* Wants children */}
            <div>
              <label className="block text-[10px] font-bold text-warm-charcoal uppercase tracking-widest font-mono mb-2">
                Wants Children
              </label>
              <select
                value={filters.wantsChildren}
                onChange={(e) => setFilters(prev => ({ ...prev, wantsChildren: e.target.value }))}
                className="w-full bg-white border border-white/40 p-2.5 rounded-xl text-xs text-warm-charcoal focus:outline-none shadow-sm"
              >
                <option value="All">All Stances</option>
                <option value="Yes">Yes, definitely</option>
                <option value="No">No kids</option>
              </select>
            </div>

            {/* Smoking */}
            <div>
              <label className="block text-[10px] font-bold text-warm-charcoal uppercase tracking-widest font-mono mb-2">
                Smoking preference
              </label>
              <select
                value={filters.smoking}
                onChange={(e) => setFilters(prev => ({ ...prev, smoking: e.target.value }))}
                className="w-full bg-white border border-white/40 p-2.5 rounded-xl text-xs text-warm-charcoal focus:outline-none shadow-sm"
              >
                <option value="All">All types</option>
                <option value="Strictly Non-smoker">Strictly Non-smoker</option>
              </select>
            </div>

            {/* Photo Visibility */}
            <div>
              <label className="block text-[10px] font-bold text-warm-charcoal uppercase tracking-widest font-mono mb-2">
                Photo Visibility State
              </label>
              <select
                value={filters.photoVisibility}
                onChange={(e) => setFilters(prev => ({ ...prev, photoVisibility: e.target.value }))}
                className="w-full bg-white border border-white/40 p-2.5 rounded-xl text-xs text-warm-charcoal focus:outline-none shadow-sm"
              >
                <option value="All">All visible options</option>
                <option value="Blurred Only">Blurred / Protected profiles</option>
                <option value="Visible Only">Directly visible portraits</option>
              </select>
            </div>

          </div>
        )}

        {/* Row 3: Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-center pt-3 border-t border-white/20">
          
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            {/* Verified only switch */}
            <label className="flex items-center space-x-2 cursor-pointer bg-white/60 border border-white/45 px-4 py-2.5 rounded-xl text-xs font-bold text-[#4A443F] hover:bg-white shadow-sm transition">
              <input
                type="checkbox"
                checked={filters.verifiedOnly}
                onChange={(e) => setFilters(prev => ({ ...prev, verifiedOnly: e.target.checked }))}
                className="rounded border-white/30 text-accent-coral focus:ring-accent-coral focus:ring-offset-0 focus:ring-1"
              />
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#40798C]" />
                <span>Verified Profiles Only</span>
              </span>
            </label>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={handleResetFilters}
              className="flex items-center justify-center space-x-1 border border-white/20 bg-white/50 hover:bg-white text-xs font-bold px-4 py-2.5 rounded-xl text-[#4A443F] shadow-sm transition w-full sm:w-auto"
            >
              <Trash2 className="w-4 h-4" />
              <span>Reset parameters</span>
            </button>
          </div>

        </div>

      </div>

      {/* MATCH BROWSER GRID */}
      {filteredMatches.length === 0 ? (
        <div className="bg-white/30 border border-dashed border-white/40 backdrop-blur-md rounded-[2.5rem] py-16 text-center space-y-4">
          <HelpCircle className="w-12 h-12 text-accent-coral/65 mx-auto" />
          <h4 className="text-lg font-serif font-black text-warm-charcoal">No compatible dossiers found</h4>
          <p className="text-xs text-[#6B635B] max-w-sm mx-auto leading-relaxed font-semibold">
            We support strict compatibility filtering. Try widening your age range or checking other Iraqi governorates for compatible prospects.
          </p>
          <button
            onClick={handleResetFilters}
            className="bg-accent-coral text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-accent-coral/15 hover:opacity-90 transition"
          >
            Reset Active Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredMatches.map((m) => {
            // Respectful photo privacy blur logic
            // If match is female, and has photoStatus: 'blurred', and requestStatus !== 'accepted' -> blurred
            const isBlur = m.photoStatus === 'blurred' && m.requestStatus !== 'accepted';

            return (
              <div
                key={m.id}
                className="bg-white/40 backdrop-blur-xl border border-white/35 rounded-[2.2rem] shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between group"
              >
                {/* Photo container with privacy indicators */}
                <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden select-none">
                  
                  {/* Photo itself */}
                  <img
                    src={m.avatarUrl}
                    alt={m.name}
                    className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${
                      isBlur ? 'filter blur-[15px]' : ''
                    }`}
                    referrerPolicy="no-referrer"
                  />

                  {/* High quality Blur Overlay layer */}
                  {isBlur && (
                    <div className="absolute inset-0 bg-[#2D2A26]/30 flex flex-col items-center justify-center p-4 text-center">
                      <div className="w-9 h-9 rounded-full bg-white/95 shadow-md flex items-center justify-center text-warm-charcoal mb-1.5">
                        <Lock className="w-4 h-4 text-accent-coral" />
                      </div>
                      <p className="text-[10px] text-white font-bold uppercase tracking-wider">Portrait Protected</p>
                      <p className="text-[8px] text-white/90">Click "Send Request" to request photo unlock</p>
                    </div>
                  )}

                  {/* Compatibility Badge inside card header */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center z-10">
                    <span className="text-[9px] font-black tracking-wider bg-white/75 backdrop-blur-md text-accent-coral border border-accent-coral/20 px-2.5 py-0.5 rounded-md uppercase font-mono shadow-sm">
                      {m.compatibilityScore}% Compatibility
                    </span>
                    {m.verified && (
                      <span className="bg-[#40798C] text-white rounded-full p-1 shadow-sm flex items-center justify-center">
                        <ShieldCheck className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>

                  {/* Location label */}
                  <div className="absolute bottom-3 left-3 bg-[#2D2A26]/50 backdrop-blur-sm text-white text-[9px] font-mono font-bold px-2.5 py-1 rounded-md uppercase tracking-wider z-10">
                    📍 {m.governorate}, {m.country}
                  </div>

                </div>

                {/* Info and CTA area */}
                <div className="p-5 text-left space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    
                    {/* Name block */}
                    <div className="flex justify-between items-start gap-2">
                      <h4 
                        onClick={() => setSelectedMatch(m)}
                        className="text-base font-bold text-warm-charcoal font-serif hover:text-accent-coral transition-all cursor-pointer leading-tight"
                      >
                        {m.name}, <span className="font-normal text-[#6B635B]">{m.age}</span>
                      </h4>
                      <span className="text-[9px] font-bold text-slate-500 bg-slate-100 border border-slate-200/50 px-2 py-0.5 rounded-md">
                        {m.timeline.replace(/Within/g, '').trim()}
                      </span>
                    </div>

                    {/* Specific profession and detailed description */}
                    <p className="text-[10px] font-bold text-[#40798C] font-mono uppercase tracking-wider">
                      🎓 {m.profession}
                    </p>

                    <p className="text-xs text-[#6B635B] leading-relaxed font-medium line-clamp-2 italic">
                      "{m.aboutMe}"
                    </p>

                    {/* Religion & Ethnicity */}
                    <div className="flex flex-wrap gap-1.5 text-[9px] font-bold font-mono">
                      <span className="text-[#40798C] bg-[#40798C]/10 px-2 py-0.5 rounded border border-[#40798C]/20 capitalize">
                        {m.religion === 'islam' ? `${m.sect || 'Sunni'} Muslim` : 'Non-Muslim'}
                      </span>
                      <span className="text-accent-coral bg-accent-coral/10 px-2 py-0.5 rounded border border-accent-coral/20 capitalize">
                        {m.ethnicity}
                      </span>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {m.valuesSummary.slice(0, 2).map((val) => (
                        <span 
                          key={val} 
                          className="text-[9px] font-bold text-[#4A443F] bg-white border border-stone-200 px-2 py-0.5 rounded-md"
                        >
                          {val}
                        </span>
                      ))}
                    </div>

                  </div>

                  {/* Primary card CTA buttons */}
                  <div className="pt-2">
                    {m.requestStatus === 'none' && (
                      <button
                        type="button"
                        onClick={() => onSendRequest(m.id)}
                        className="w-full py-2.5 rounded-xl bg-warm-charcoal text-white font-bold text-xs hover:opacity-90 transition duration-200 shadow-lg flex items-center justify-center space-x-1.5"
                      >
                        <Heart className="w-3.5 h-3.5 text-accent-pink fill-accent-pink/20" />
                        <span>Send Request</span>
                      </button>
                    )}

                    {m.requestStatus === 'sent' && (
                      <div className="space-y-1">
                        <button
                          type="button"
                          disabled
                          className="w-full py-2.5 rounded-xl bg-accent-coral/10 text-accent-coral border border-accent-coral/20 font-bold text-xs cursor-not-allowed flex items-center justify-center space-x-1"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-accent-coral animate-ping shrink-0" />
                          <span>Request Pending Review</span>
                        </button>
                        <p className="text-[8px] text-center text-[#6B635B] font-mono font-medium">
                          Auto-approves in 2.5 seconds (Simulated)
                        </p>
                      </div>
                    )}

                    {m.requestStatus === 'accepted' && (
                      <button
                        type="button"
                        onClick={() => onInitiateChat(m.id)}
                        className="w-full py-2.5 rounded-xl bg-[#40798C] hover:opacity-90 text-white font-bold text-xs transition duration-200 shadow-md flex items-center justify-center space-x-1.5"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Mutually Connected! Chat ➔</span>
                      </button>
                    )}
                  </div>

                </div>

                {/* Click target helper for detailed popover */}
                <div 
                  onClick={() => setSelectedMatch(m)}
                  className="bg-white/45 hover:bg-white border-t border-white/20 p-2 text-center text-[9px] font-bold text-[#6B635B] cursor-pointer transition uppercase font-mono tracking-wider"
                >
                  View Full compatibility dossier ↗
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* DETAILED VIEW MODAL OVERLAY */}
      {selectedMatch && (
        <div className="fixed inset-0 bg-warm-charcoal/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-white/40 w-full max-w-2xl overflow-hidden shadow-2xl relative flex flex-col md:flex-row max-h-[90vh] md:max-h-[80vh] text-left">
            
            {/* Close button */}
            <button
              onClick={() => setSelectedMatch(null)}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-warm-charcoal/30 text-white flex items-center justify-center hover:bg-warm-charcoal/50 transition"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Left Image Column */}
            <div className="w-full md:w-5/12 relative bg-stone-100 min-h-[140px] md:min-h-full shrink-0">
              {selectedMatch.photoStatus === 'hidden' && selectedMatch.requestStatus !== 'accepted' ? (
                /* HIDDEN PORTRAIT DEFAULT */
                <div className="absolute inset-0 bg-gradient-to-br from-[#ECE8E1] via-[#E1DDD5] to-[#D5CFB9] flex flex-col items-center justify-center p-4 text-center">
                  <Lock className="w-6 h-6 text-[#40798C] mb-2" />
                  <p className="text-xs text-warm-charcoal font-black uppercase tracking-wider">
                    {locale === 'en' ? 'Portrait Hidden' : 'الصورة مخفية'}
                  </p>
                  <p className="text-[10px] text-stone-500 font-medium">
                    {locale === 'en' ? 'Visible only with double consent.' : 'تظهر فقط للشركاء المقبولين بنية جادة.'}
                  </p>
                </div>
              ) : selectedMatch.photoStatus === 'initials' && selectedMatch.requestStatus !== 'accepted' ? (
                /* INITIALS DEFAULT */
                <div className="absolute inset-0 bg-gradient-to-br from-[#E6ECEA] via-[#D5E1DF] to-[#CAD3D2] flex flex-col items-center justify-center p-4 text-center">
                  <div className="w-14 h-14 rounded-full bg-white/95 shadow-md flex items-center justify-center text-accent-coral mb-2 font-serif font-black text-xl border border-white">
                    {selectedMatch.name ? selectedMatch.name.charAt(0).toUpperCase() : '?'}
                  </div>
                  <p className="text-xs text-warm-charcoal font-black uppercase tracking-wider">
                    {locale === 'en' ? 'Initials Only' : 'الاسم الثنائي'}
                  </p>
                  <p className="text-[10px] text-stone-500 font-medium">
                    {locale === 'en' ? 'Reveals after request is approved.' : 'تنكشف بالكامل فور قبول الطلب.'}
                  </p>
                </div>
              ) : (
                /* VISIBLE AND BLURRED */
                <>
                  <img
                    src={selectedMatch.avatarUrl}
                    alt={selectedMatch.name}
                    className={`w-full h-full object-cover absolute inset-0 ${
                      selectedMatch.photoStatus === 'blurred' && selectedMatch.requestStatus !== 'accepted' ? 'filter blur-[15px]' : ''
                    }`}
                    referrerPolicy="no-referrer"
                  />
                  {selectedMatch.photoStatus === 'blurred' && selectedMatch.requestStatus !== 'accepted' && (
                    <div className="absolute inset-0 bg-[#2D2A26]/40 flex flex-col items-center justify-center p-4 text-center">
                      <Lock className="w-6 h-6 text-accent-coral mb-2 drop-shadow" />
                      <p className="text-xs text-white font-bold uppercase tracking-wider">Portrait Protected</p>
                      <p className="text-[10px] text-white/90">Unlocked automatically to accepted match partners.</p>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Right details column */}
            <div className="w-full md:w-7/12 p-6 overflow-y-auto space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                
                {/* Name */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-serif font-black text-warm-charcoal tracking-tight flex items-center gap-1.5">
                      <span>{selectedMatch.name}, {selectedMatch.age}</span>
                      {selectedMatch.verified && <ShieldCheck className="w-5 h-5 text-[#40798C]" />}
                    </h3>
                    <p className="text-xs text-[#6B635B] font-semibold">📍 {selectedMatch.governorate ? `${selectedMatch.governorate}, ` : ''}{selectedMatch.country} • <span className="capitalize">{selectedMatch.religion === 'islam' ? `${selectedMatch.sect || 'Sunni'} Muslim` : 'Non-Muslim'} ({selectedMatch.ethnicity})</span></p>
                  </div>
                  <span className="text-xs font-bold text-accent-coral bg-accent-coral/10 border border-accent-coral/20 px-3 py-1 rounded-full font-mono">
                    {selectedMatch.compatibilityScore}% Match
                  </span>
                </div>

                {/* Intention banner */}
                {selectedMatch.intention && (
                  <div className="p-3.5 bg-white/60 border border-white/50 rounded-2xl border-l-4 border-l-accent-coral shadow-sm">
                    <p className="text-[10px] font-bold text-accent-coral uppercase tracking-wider font-mono">Targeted Marital Goal</p>
                    <p className="text-xs text-warm-charcoal italic mt-1 leading-relaxed">
                      "{selectedMatch.intention}"
                    </p>
                  </div>
                )}

                {/* Structured parameter box */}
                <div className="grid grid-cols-2 gap-3.5 text-xs bg-white/50 border border-white/35 p-4 rounded-2xl">
                  <div>
                    <span className="text-[#6B635B] font-medium font-mono uppercase text-[9px] tracking-wider block">Academics</span>
                    <strong className="text-warm-charcoal block leading-tight mt-0.5">{selectedMatch.education}</strong>
                  </div>
                  <div>
                    <span className="text-[#6B635B] font-medium font-mono uppercase text-[9px] tracking-wider block">Courtship Timeline</span>
                    <strong className="text-[#40798C] block leading-tight mt-0.5">{selectedMatch.timeline}</strong>
                  </div>
                  <div>
                    <span className="text-[#6B635B] font-medium font-mono uppercase text-[9px] tracking-wider block">Wants Children</span>
                    <strong className="text-warm-charcoal block leading-tight mt-0.5">{selectedMatch.wantsChildren}</strong>
                  </div>
                  <div>
                    <span className="text-[#6B635B] font-medium font-mono uppercase text-[9px] tracking-wider block">Privacy Preference</span>
                    <strong className="text-warm-charcoal block leading-tight mt-0.5">{selectedMatch.communicationPreference}</strong>
                  </div>
                </div>

                {/* Personal Bio details */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-[#6B635B] uppercase tracking-widest font-mono">Biography Overview</span>
                  <p className="text-xs text-warm-charcoal leading-relaxed font-semibold">
                    {selectedMatch.aboutMe}
                  </p>
                </div>

                {/* Languages */}
                <div className="flex items-center gap-2 text-[#6B635B] text-xs flex-wrap">
                  <span className="flex items-center gap-1">
                    <Languages className="w-4 h-4 text-warm-charcoal/50" />
                    <span className="font-semibold text-[10px] uppercase font-mono tracking-wider">Languages:</span>
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {selectedMatch.languages.map((lang) => (
                      <span key={lang} className="bg-[#40798C]/10 text-[#40798C] border border-[#40798C]/20 text-[10px] font-extrabold px-2 py-0.5 rounded-lg inline-block">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Dealbreakers */}
                {selectedMatch.dealbreakers && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-[#6B635B] uppercase tracking-widest font-mono block">Absolute Dealbreakers</span>
                    <div className="flex flex-wrap gap-1">
                      {selectedMatch.dealbreakers.map((db) => (
                        <span key={db} className="bg-red-50 text-red-600 border border-red-200/50 text-[10px] font-bold px-2 py-0.5 rounded-lg inline-block">
                          🚫 No {db}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* Action and Dismiss buttons */}
              <div className="border-t border-white/20 pt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedMatch(null)}
                  className="w-1/2 py-2.5 bg-white/40 hover:bg-white border border-white/30 font-bold text-[#4A443F] rounded-xl text-xs transition"
                >
                  Close dossier
                </button>

                {selectedMatch.requestStatus === 'none' && (
                  <button
                    type="button"
                    onClick={() => {
                      onSendRequest(selectedMatch.id);
                      setSelectedMatch(null);
                    }}
                    className="w-1/2 py-2.5 bg-accent-coral text-white font-bold text-xs rounded-xl shadow-lg shadow-accent-coral/20 hover:opacity-90 transition"
                  >
                    Send Request
                  </button>
                )}

                {selectedMatch.requestStatus === 'sent' && (
                  <button
                    type="button"
                    disabled
                    className="w-1/2 py-2.5 bg-[#FF7F50]/10 border border-accent-coral/10 text-[#6B635B] font-bold text-xs rounded-xl cursor-not-allowed"
                  >
                    Request Pending Review
                  </button>
                )}

                {selectedMatch.requestStatus === 'accepted' && (
                  <button
                    type="button"
                    onClick={() => {
                      onInitiateChat(selectedMatch.id);
                      setSelectedMatch(null);
                    }}
                    className="w-1/2 py-2.5 bg-[#40798C] text-white font-bold text-xs rounded-xl shadow-lg shadow-[#40798C]/20 hover:opacity-90 transition"
                  >
                    Open Conversation Room
                  </button>
                )}
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
