import React from 'react';

interface MainTabsProps {
  activeTab: 'explore' | 'cafe';
  onTabChange: (tab: 'explore' | 'cafe') => void;
  locale: 'en' | 'ar' | 'ckb';
}

export default function MainTabs({ activeTab, onTabChange, locale }: MainTabsProps) {
  const labels = {
    explore: {
      en: 'Explore Partners',
      ar: 'استكشاف الشركاء',
      ckb: 'هاوبەشەکان بگەڕێ'
    },
    cafe: {
      en: 'Marriage Cafe',
      ar: 'قهوة الزواج',
      ckb: 'قەھوەی هاوسەرگیری'
    }
  };

  const isRTL = locale === 'ar' || locale === 'ckb';

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      <div className="bg-pure-white border border-cool-gray rounded-2xl p-1.5 flex gap-1.5 shadow-card-soft">
        <button
          onClick={() => onTabChange('explore')}
          className={`flex-1 py-3 px-4 rounded-xl font-black text-sm sm:text-base transition-all duration-300 ${
            activeTab === 'explore'
              ? 'bg-gradient-to-r from-neon-pink to-neon-purple text-white shadow-neon-glow'
              : 'text-dark-gray hover:bg-soft-lavender hover:text-neon-purple'
          }`}
        >
          {labels.explore[locale]}
        </button>
        <button
          onClick={() => onTabChange('cafe')}
          className={`flex-1 py-3 px-4 rounded-xl font-black text-sm sm:text-base transition-all duration-300 ${
            activeTab === 'cafe'
              ? 'bg-gradient-to-r from-neon-pink to-neon-purple text-white shadow-neon-glow'
              : 'text-dark-gray hover:bg-soft-lavender hover:text-neon-purple'
          }`}
        >
          {labels.cafe[locale]}
        </button>
      </div>
    </div>
  );
}
