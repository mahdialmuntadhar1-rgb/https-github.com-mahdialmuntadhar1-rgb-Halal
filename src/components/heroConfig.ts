import { Language } from '../lib/translations';

export interface CarouselSlide {
  imageUrl: string;
  title: Record<Language, string>;
  subtitle: Record<Language, string>;
}

// ============================================
// EDIT BELOW TO CHANGE HERO CAROUSEL IMAGES
// ============================================
// Replace the URLs with your own Unsplash or image URLs
// Format: https://images.unsplash.com/photo-XXXXXXXX?auto=format&fit=crop&q=80&w=1200

export const CAROUSEL_SLIDES: CarouselSlide[] = [
  {
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200',
    title: {
      en: 'Find a Serious Path to Marriage',
      ar: 'ابدأ طريقاً جاداً نحو الزواج',
      ckb: 'ڕێگایەکی جدی بۆ هاوسەرگیری دەست پێ بکە'
    },
    subtitle: {
      en: 'Dignified, values-first marital matchmaking with complete command over photo security.',
      ar: 'تواصل كريم ومحترم يسعى لبناء عائلة مستقرة مبنية على المودة والرحمة والالتزام.',
      ckb: 'پەیوەندی بەهادار و بەڕێز بۆ پێکهێنانی خێزانێکی بەختەور و جێگیر.'
    }
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?auto=format&fit=crop&q=80&w=1200',
    title: {
      en: 'A Sacred Covenant of Trust',
      ar: 'ميثاق غليظ مبني على الثقة والاحترام',
      ckb: 'پەیمانێکی پیرۆز لەسەر متمانە و ڕێزگرتن'
    },
    subtitle: {
      en: 'Every single profile is verified for absolute seriousness and marital intentions.',
      ar: 'كل ملف شخصي يتم توثيقه لضمان الجدية التامة والالتزام بالقيم الأصيلة.',
      ckb: 'هەموو پرۆفایلەکان پشتڕاست دەکرێنەوە بۆ دڵنیابوون لە جدیبوونی تەواو.'
    }
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=1200',
    title: {
      en: 'Dignified Photo Protection',
      ar: 'حماية الصور باحترام تام',
      ckb: 'پاراستنی وێنە بە ڕێزێکی تەواو'
    },
    subtitle: {
      en: 'Women photos are automatically blurred. Men photos are visible. Full privacy control.',
      ar: 'صور النساء محمية بالتمويه تلقائياً. صور الرجال مرئية. تحكم كامل بالخصوصية.',
      ckb: 'وێنەی ژنان خۆکارانە شاردراونەتەوە. وێنەی پیاوان دەردەکەون. کۆنترۆلی تەواوی تایبەتی.'
    }
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1519225421980-715cb0202128?auto=format&fit=crop&q=80&w=1200',
    title: {
      en: 'Sincere Matches, Shared Goals',
      ar: 'توافق حقيقي وأهداف مشتركة',
      ckb: 'هاوشێوەیی ڕاستەقینە و ئامانجی هاوبەش'
    },
    subtitle: {
      en: 'Connect with individuals who share your religious values, life goals, and family vision.',
      ar: 'تواصل مع أشخاص يشاركونك قيمك الدينية وأهدافك الحياتية ورؤيتك العائلية.',
      ckb: 'پەیوەندی بە کەسانیەوە بکە کە هاوبەشن لە بەها ئاینییەکان و ئامانجەکانی ژیانت و بینینی خێزان.'
    }
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=1200',
    title: {
      en: 'Blessed Halal Union',
      ar: 'زواج حلال مبارك',
      ckb: 'هاوسەرگیریەکی حەڵاڵی پیرۆز'
    },
    subtitle: {
      en: 'Begin your journey toward a blessed, halal marriage built on faith and mutual respect.',
      ar: 'ابدأ رحلتك نحو زواج حلال مبارك مبني على الإيمان والاحترام المتبادل.',
      ckb: 'گەشتەکەت دەست پێ بکە بەرەو هاوسەرگیریەکی حەڵاڵی پیرۆز کە لەسەر باوەڕ و ڕێزگرتنی هەبەش بنیات نراوە.'
    }
  }
];

// ============================================
// GENDER SELECTION IMAGES
// ============================================
export const GENDER_IMAGES = {
  male: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
  female: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400'
};

// ============================================
// HOW TO EDIT:
// 1. Find images on unsplash.com
// 2. Click the image → Download free → Copy the URL
// 3. Replace the imageUrl above
// 4. Change title/subtitle text as needed
// 5. Rebuild: npm run build
// 6. Deploy: npx wrangler pages deploy dist
// ============================================
