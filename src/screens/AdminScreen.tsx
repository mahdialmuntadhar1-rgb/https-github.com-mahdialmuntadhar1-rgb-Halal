import React, { useState, useEffect } from 'react';
import { Language } from '../lib/translations';

interface AdminScreenProps {
  locale: Language;
}

export default function AdminScreen({ locale }: AdminScreenProps) {
  const [activeSection, setActiveSection] = useState<'hero' | 'users' | 'settings'>('hero');
  
  
  // Hero Editor State
  const [heroSlides, setHeroSlides] = useState(() => {
    const saved = localStorage.getItem('halal_hero_config');
    return saved ? JSON.parse(saved) : [
      { imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200', title: { ar: 'ابدأ طريقاً جاداً نحو الزواج', en: 'Find a Serious Path to Marriage', ckb: 'ڕێگایەکی جدی بۆ هاوسەرگیری' }, subtitle: { ar: 'تواصل كريم ومحترم', en: 'Dignified matchmaking', ckb: 'پەیوەندی بەهادار' } },
      { imageUrl: 'https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?auto=format&fit=crop&q=80&w=1200', title: { ar: 'ميثاق غليظ', en: 'Sacred Covenant', ckb: 'پەیمانێکی پیرۆز' }, subtitle: { ar: 'مبني على الثقة', en: 'Built on trust', ckb: 'لەسەر متمانە' } },
      { imageUrl: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=1200', title: { ar: 'حماية الصور', en: 'Photo Protection', ckb: 'پاراستنی وێنە' }, subtitle: { ar: 'خصوصية تامة', en: 'Full privacy', ckb: 'تایبەتی تەواو' } },
    ];
  });

  const updateSlide = (index: number, field: string, lang: string, value: string) => {
    const updated = [...heroSlides];
    if (field === 'imageUrl') {
      updated[index] = { ...updated[index], imageUrl: value };
    } else {
      updated[index] = { ...updated[index], [field]: { ...updated[index][field], [lang]: value } };
    }
    setHeroSlides(updated);
    localStorage.setItem('halal_hero_config', JSON.stringify(updated));
  };

  const addSlide = () => {
    const newSlide = {
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=1200',
      title: { ar: 'عنوان جديد', en: 'New Title', ckb: 'سەردێرێکی نوێ' },
      subtitle: { ar: 'وصف جديد', en: 'New Description', ckb: 'پەسنی نوێ' }
    };
    const updated = [...heroSlides, newSlide];
    setHeroSlides(updated);
    localStorage.setItem('halal_hero_config', JSON.stringify(updated));
  };

  const removeSlide = (index: number) => {
    const updated = heroSlides.filter((_, i) => i !== index);
    setHeroSlides(updated);
    localStorage.setItem('halal_hero_config', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">لوحة التحكم</h1>

          {/* Admin Section Tabs */}
          <div className="flex gap-2 mb-6">
            {[
              { id: 'hero', label: '🖼️ Hero', labelAr: 'الهيرو' },
              { id: 'users', label: '👥 Users', labelAr: 'المستخدمين' },
              { id: 'settings', label: '⚙️ Settings', labelAr: 'الإعدادات' }
            ].map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id as any)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all
                  ${activeSection === section.id
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-rose-300'
                  }`}
              >
                {locale === 'ar' ? section.labelAr : section.label}
              </button>
            ))}
          </div>

      
      {/* Hero Editor Section */}
      {activeSection === 'hero' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">🖼️ تعديل Hero Carousel</h2>
            <button
              onClick={addSlide}
              className="px-4 py-2 rounded-lg bg-rose-600 text-white text-sm font-bold hover:bg-rose-700 transition-colors"
            >
              + إضافة شريحة
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {heroSlides.map((slide, i) => (
              <div key={i} className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-500">شريحة {i + 1}</span>
                  <button
                    onClick={() => removeSlide(i)}
                    className="text-red-500 hover:text-red-700 text-xs font-bold"
                  >
                    🗑️ حذف
                  </button>
                </div>
                
                <img src={slide.imageUrl} alt="" className="w-full h-32 object-cover rounded-lg mb-3 border border-slate-100" />
                
                <label className="block text-xs font-bold text-slate-600 mb-1">رابط الصورة</label>
                <input
                  value={slide.imageUrl}
                  onChange={e => updateSlide(i, 'imageUrl', '', e.target.value)}
                  className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 mb-3 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  placeholder="https://images.unsplash.com/..."
                />
                
                {['ar', 'en', 'ckb'].map((lang) => (
                  <div key={lang} className="mb-2">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                      {lang === 'ar' ? '🇸🇦 العربية' : lang === 'ckb' ? '🇮🇶 کوردی' : '🇬🇧 English'}
                    </label>
                    <input
                      value={slide.title[lang] || ''}
                      onChange={e => updateSlide(i, 'title', lang, e.target.value)}
                      className="w-full text-sm px-3 py-1.5 rounded-lg border border-slate-300 mb-1 focus:ring-2 focus:ring-rose-500"
                      placeholder="العنوان..."
                    />
                    <input
                      value={slide.subtitle[lang] || ''}
                      onChange={e => updateSlide(i, 'subtitle', lang, e.target.value)}
                      className="w-full text-sm px-3 py-1.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-rose-500"
                      placeholder="الوصف..."
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
          
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
            <p className="text-sm text-amber-800 font-medium">💡 تعديلاتك تُحفظ تلقائياً في المتصفح. انسخ الكود أدناه والصقه في heroConfig.ts لتحديث التطبيق:</p>
            <pre className="mt-2 p-3 rounded-lg bg-slate-900 text-green-400 text-xs overflow-x-auto font-mono">
              {JSON.stringify(heroSlides, null, 2)}
            </pre>
          </div>
        </div>
      )}

          <div>Other sections coming soon...</div>
    </div>
  );
}
