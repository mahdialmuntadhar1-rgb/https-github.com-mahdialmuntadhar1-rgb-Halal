import React, { useEffect, useState } from 'react';
import { SearchFilters, AppLanguage } from '../types';
import { GOVERNORATES, EDUCATION_LEVELS, PROFESSION_CATEGORIES } from '../constants';
import { INITIAL_MATCHES } from '../data/matches';
import { SlidersHorizontal, RotateCcw, Filter, ChevronDown, ChevronUp } from 'lucide-react';

interface FilterPanelProps {
  filters: SearchFilters;
  setFilters: React.Dispatch<React.SetStateAction<SearchFilters>>;
  showAdvancedFilters: boolean;
  setShowAdvancedFilters: (show: boolean) => void;
  handleResetFilters: () => void;
  filteredCount: number;
  locale: AppLanguage;
  userGender?: 'male' | 'female';
  hideHeader?: boolean;
}

export default function FilterPanel({
  filters,
  setFilters,
  showAdvancedFilters,
  setShowAdvancedFilters,
  handleResetFilters,
  filteredCount,
  locale,
  userGender,
  hideHeader = false
}: FilterPanelProps) {

  const [expandedMore, setExpandedMore] = useState(false);

  const isEn = locale === 'en';
  const isCkb = locale === 'ckb';
  const txt = (en: string, ar: string, ckb: string) => {
    return isEn ? en : isCkb ? ckb : ar;
  };

  // Full coverage of all 19 Iraqi governorates as per rules
  const govPills = [
    { label: txt("All Iraq", "كل العراق", "هەموو عێراق"), value: "All Iraq" },
    { label: txt("Baghdad", "بغداد", "بەغداد"), value: "Baghdad" },
    { label: txt("Erbil", "أربيل", "هەولێر"), value: "Erbil" },
    { label: txt("Sulaymaniyah", "السليمانية", "سلێمانی"), value: "Sulaymaniyah" },
    { label: txt("Duhok", "دهوك", "دهۆک"), value: "Duhok" },
    { label: txt("Halabja", "حلبجة", "هەڵەبجە"), value: "Halabja" },
    { label: txt("Kirkuk", "كركوك", "کەرکوک"), value: "Kirkuk" },
    { label: txt("Nineveh (Mosul)", "نينوى (الموصل)", "نەینەوا (مووسڵ)"), value: "Nineveh" },
    { label: txt("Basra", "البصرة", "بەسرە"), value: "Basra" },
    { label: txt("Najaf", "النجف", "نەجەف"), value: "Najaf" },
    { label: txt("Karbala", "كربلاء", "کەربەلا"), value: "Karbala" },
    { label: txt("Babel", "بابل", "بابل"), value: "Babil" },
    { label: txt("Anbar", "الأنبار", "ئەنبار"), value: "Anbar" },
    { label: txt("Diyala", "ديالى", "دیالە"), value: "Diyala" },
    { label: txt("Salah al-Din", "صلاح الدين", "سەڵاحەدین"), value: "Salah al-Din" },
    { label: txt("Wasit", "واسط", "واسیت"), value: "Wasit" },
    { label: txt("Maysan", "ميسان", "میسان"), value: "Maysan" },
    { label: txt("Dhi Qar", "ذي قار", "زیقار"), value: "Dhi Qar" },
    { label: txt("Muthanna", "المثنى", "موتەنا"), value: "Muthanna" },
    { label: txt("Qadisiyah", "القادسية", "قادسیە"), value: "Qadisiyah" }
  ];

  // Helper to dynamically count profiles in each governorate based on initial database and filtered gender
  const countForGov = (govValue: string) => {
    let pool = INITIAL_MATCHES;
    if (filters.gender && filters.gender !== 'all') {
      pool = pool.filter(m => m.gender === filters.gender);
    }
    
    if (govValue === 'All Iraq') {
      return pool.length;
    }
    
    const target = govValue.toLowerCase();
    return pool.filter(m => {
      const current = m.governorate?.toLowerCase() || '';
      if (target === 'nineveh' || target === 'mosul') {
        return current === 'nineveh' || current === 'mosul';
      }
      return current === target;
    }).length;
  };

  const genderPills = [
    { label: txt("All Genders", "جميع الأجناس", "هەردوو ڕەگەز"), value: "all" },
    { label: txt("Brother (Male)", "أخ (ذكر)", "برا (نێر)"), value: "male" },
    { label: txt("Sister (Female)", "أخت (أنثى)", "خوشک (مێ)"), value: "female" },
  ];

  return (
    <div className="space-y-6 text-start" id="filter-panel-mockup">
      {!hideHeader && (
        <>
          {/* Subtitle above header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div className="space-y-1">
              <span className="text-[10px] tracking-[0.2em] font-extrabold text-[#9c9389] uppercase block font-sans">
                {txt("HALAL ZAWAJ HALAL MATCHING", "زواج حلال توافق حلال", "هاوسەرگیری حەڵاڵ گونجانی حەڵاڵ")}
              </span>
              <h2 className="text-2xl sm:text-3.5xl font-black text-[#22201E] font-serif tracking-tight">
                {txt("Recommended Partners", "الشركاء الموصى بهم", "هاوبەشە پێشنیارکراوەکان")}
              </h2>
            </div>

            {/* Hide/Show Filters Button */}
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex items-center gap-2 bg-white border border-[#DDD9D2] hover:bg-stone-50 text-[#4E4B45] text-xs font-bold rounded-xl px-4 py-2.5 transition duration-200 shadow-sm"
            >
              <Filter className="w-3.5 h-3.5 text-[#6B635B]" />
              <span>
                {showAdvancedFilters 
                  ? txt("Hide Filters", "إخفاء الفلاتر", "شاردنەوەی پاڵاوەکان") 
                  : txt("Show Filters", "إظهار الفلاتر", "پیشاندانی پاڵاوەکان")}
              </span>
            </button>
          </div>

          {/* Description below Title */}
          <p className="text-stone-500 text-xs sm:text-[13px] font-medium leading-relaxed max-w-3xl">
            {txt(
              "These verified profiles correspond to your religious, family, and educational goals. Select \"View Profile\" to understand their full biography before initiating any formal contact.",
              "تتطابق هذه الملفات الشخصية الموثقة مع أهدافك الدينية والعائلية والتعليمية. اختر \"عرض الملف الشخصي\" لفهم سيرتهم الذاتية الكاملة قبل بدء أي اتصال رسمي.",
              "ئەم پڕۆفایلە پشتڕاستکراوانە لەگەڵ ئامانجە ئاینی و خێزانی و پەروەردەییەکانت دەگونجێن. \"بینینی پڕۆفایل\" دیاریبکە بۆ تێگەیشتن لە ژیاننامەی تەواویان پێش دەستپێکردنی هەر پەیوەندییەکی فەرمی."
            )}
          </p>
        </>
      )}

      {/* Primary filter panel (The beige mockup card) */}
      {showAdvancedFilters && (
        <div className="bg-[#FAF9F5] border border-[#EBE6DC] rounded-3xl p-6 sm:p-7 shadow-sm space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left: Filter by Governorate */}
            <div className="lg:col-span-8 space-y-3">
              <span className="text-[10px] tracking-wider font-extrabold text-[#7E776F] uppercase block">
                {txt("FILTER BY GOVERNORATE", "تصفية حسب المحافظة", "پاڵاوکردن بەپێی پارێزگا")}
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-[160px] overflow-y-auto p-1 bg-stone-50/50 rounded-2xl border border-stone-200/40">
                {govPills.map((p) => {
                  const isSelected = filters.governorate === p.value;
                  const count = countForGov(p.value);
                  return (
                    <button
                      key={p.value}
                      onClick={() => setFilters(prev => ({ ...prev, governorate: p.value }))}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border transition duration-150 cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-[#0B5C43] text-white border-transparent shadow-xs hover:bg-[#094d38]'
                          : 'bg-white border-[#E4DDD3] text-[#4E4B45] hover:bg-stone-50 hover:border-[#DDD6C9]'
                      }`}
                    >
                      <span>{p.label}</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-mono ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-500'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right: Gender */}
            <div className="lg:col-span-4 space-y-3">
              <span className="text-[10px] tracking-wider font-extrabold text-[#7E776F] uppercase block">
                {txt("GENDER", "الجنس", "ڕەگەز")}
              </span>
              {userGender ? (
                <div className="bg-[#FAF8F5] border border-[#E6DCC3] rounded-xl px-4 py-2.5 text-xs font-semibold text-[#0B5C43] flex items-center gap-1.5 shadow-sm">
                  <span>💍</span>
                  <span>
                    {userGender === 'male'
                      ? txt("Auto-matching: Showing brides only", "مطابقة تلقائية: يتم عرض العرائس فقط", "گونجاندنی خۆکار: تەنها کچان پیشان دەدرێن")
                      : txt("Auto-matching: Showing grooms only", "مطابقة تلقائية: يتم عرض العرسان فقط", "گونجاندنی خۆکار: تەنها کوڕان پیشان دەدرێن")}
                  </span>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {genderPills.map((p) => {
                    const isSelected = filters.gender === p.value;
                    return (
                      <button
                        key={p.value}
                        type="button"
                        onClick={() => setFilters(prev => ({ ...prev, gender: p.value as any }))}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition duration-200 cursor-pointer ${
                          isSelected
                            ? 'bg-[#0B5C43] text-white border-transparent shadow-sm hover:bg-[#094d38]'
                            : 'bg-white border-[#E4DDD3] text-[#4E4B45] hover:bg-stone-50 hover:border-[#DDD6C9]'
                        }`}
                      >
                        {p.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

          {/* Advanced / Sort & Secondary filters accordion */}
          <div className="pt-4 border-t border-[#EDE9E0] flex flex-col sm:flex-row justify-between items-center gap-4">
            
            {/* Show/Hide Advanced button */}
            <button
              type="button"
              onClick={() => setExpandedMore(!expandedMore)}
              className="flex items-center gap-1.5 text-xs font-bold text-[#6B635B] hover:text-[#0B5C43] transition-colors"
            >
              <span>{expandedMore ? txt("Hide Advanced Filters", "إخفاء الفلاتر المتقدمة", "شاردنەوەی پاڵاوە پێشکەوتووەکان") : txt("Show Advanced Filters", "إظهار الفلاتر المتقدمة", "پیشاندانی پاڵاوە پێشکەوتووەکان")}</span>
              {expandedMore ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {/* Reset & Status details */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleResetFilters}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#DDD9D2] hover:bg-stone-50 text-xs font-bold text-[#6B635B] transition"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{txt("Reset", "إعادة تعيين", "پاککردنەوە")}</span>
              </button>

              <span className="text-[11px] font-mono text-stone-500 font-bold bg-[#FAF9F5] px-2.5 py-1 rounded-md">
                {filteredCount} {txt("Compatible Profiles", "ملفات مطابقة", "پڕۆفایلی گونجاو")}
              </span>
            </div>
          </div>

          {/* Collapsible advanced filter inputs */}
          {expandedMore && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-[#EDE9E0] animate-fade-in">
              
              {/* Sort Order */}
              <div>
                <label className="block text-[10px] font-bold text-[#7E776F] uppercase tracking-wider mb-2">
                  🧭 {txt('Sort Profiles By', 'فرز الملفات حسب', 'ڕیزکردنی پڕۆفایلەکان بەپێی')}
                </label>
                <select
                  value={filters.sortBy || 'compatibility'}
                  onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                  className="w-full bg-white border border-[#E4DDD3] p-2.5 rounded-xl text-xs text-warm-charcoal font-semibold focus:outline-none focus:ring-1 focus:ring-[#0B5C43]"
                >
                  <option value="compatibility">{txt('⭐️ Best Compatibility', '⭐ الأفضل توافقاً', '⭐️ باشترین گونجاوی')}</option>
                  <option value="newest">{txt('🕐 Newest Members', '🕐 الأعضاء الأحدث', '🕐 نوێترین ئەندامەکان')}</option>
                  <option value="closest">{txt('📍 Closest Location', '📍 الموقع الأقرب لي', '📍 نزیکترین شوێن')}</option>
                  <option value="completeness">{txt('📈 Most Complete Profiles', '📈 الملفات الأكثر اكتمالاً', '📈 تەواوترین پڕۆفایلەکان')}</option>
                </select>
              </div>

              {/* Age Scope */}
              <div>
                <label className="block text-[10px] font-bold text-[#7E776F] uppercase tracking-wider mb-2">
                  🎂 {txt(`Age Scope (${filters.minAge} - ${filters.maxAge})`, `النطاق العمري (${filters.minAge} - ${filters.maxAge})`, `مەودای تەمەن (${filters.minAge} - ${filters.maxAge})`)}
                </label>
                <div className="flex items-center space-x-3 bg-white p-2 border border-[#E4DDD3] rounded-xl">
                  <input
                    type="range"
                    min="18"
                    max="60"
                    value={filters.minAge}
                    onChange={(e) => setFilters(prev => ({ ...prev, minAge: Math.min(prev.maxAge - 2, parseInt(e.target.value) || 18) }))}
                    className="accent-[#0B5C43] flex-1 h-1 rounded-full cursor-pointer bg-stone-200"
                  />
                  <input
                    type="range"
                    min="18"
                    max="60"
                    value={filters.maxAge}
                    onChange={(e) => setFilters(prev => ({ ...prev, maxAge: Math.max(prev.minAge + 2, parseInt(e.target.value) || 60) }))}
                    className="accent-[#0B5C43] flex-1 h-1 rounded-full cursor-pointer bg-stone-200"
                  />
                </div>
              </div>

              {/* Academic Education Level */}
              <div>
                <label className="block text-[10px] font-bold text-[#7E776F] uppercase tracking-wider mb-2">
                  🎓 {txt('Education', 'التعليم', 'ئاستی خوێندن')}
                </label>
                <select
                  value={filters.education}
                  onChange={(e) => setFilters(prev => ({ ...prev, education: e.target.value }))}
                  className="w-full bg-white border border-[#E4DDD3] p-2.5 rounded-xl text-xs text-warm-charcoal focus:outline-none focus:ring-1 focus:ring-[#0B5C43] font-semibold"
                >
                  <option value="All Education Levels">{txt('All Education Levels', 'كل المستويات التعليمية', 'هەموو ئاستەکانی خوێندن')}</option>
                  {EDUCATION_LEVELS.map((level) => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              {/* Profession category */}
              <div>
                <label className="block text-[10px] font-bold text-[#7E776F] uppercase tracking-wider mb-2">
                  💼 {txt('Profession Category', 'فئة المهنة', 'پۆلی پیشە')}
                </label>
                <select
                  value={filters.profession}
                  onChange={(e) => setFilters(prev => ({ ...prev, profession: e.target.value }))}
                  className="w-full bg-white border border-[#E4DDD3] p-2.5 rounded-xl text-xs text-warm-charcoal focus:outline-none focus:ring-1 focus:ring-[#0B5C43] font-semibold"
                >
                  <option value="All Professions">{txt('All Professions', 'كل المهن والوظائف', 'هەموو پیشەکان')}</option>
                  {PROFESSION_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

            </div>
          )}
        </div>
      )}
    </div>
  );
}
