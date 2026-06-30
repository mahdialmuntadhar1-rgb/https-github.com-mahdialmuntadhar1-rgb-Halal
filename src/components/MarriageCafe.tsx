import React, { ChangeEvent, useMemo, useState } from 'react';
import { AppLanguage } from '../types';
import {
  BadgeCheck,
  Camera,
  Heart,
  ImagePlus,
  MessageCircle,
  Send,
  Share2,
  Sparkles,
  X
} from 'lucide-react';

interface MarriageCafeProps {
  locale: AppLanguage;
  triggerToast: (msg: string) => void;
  onNavigateToTab?: (tab: any) => void;
}

interface CafeComment {
  id: string;
  name: string;
  text: string;
}

interface CafePost {
  id: string;
  author: string;
  role: string;
  avatar: string;
  time: string;
  imageUrl: string;
  caption: string;
  likes: number;
  comments: CafeComment[];
  isOfficial?: boolean;
}

const makeVisualCard = (title: string, subtitle: string, accent = '#FF2E96') => {
  const svg = `
  <svg width="1200" height="1400" viewBox="0 0 1200 1400" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1200" y2="1400" gradientUnits="userSpaceOnUse">
        <stop stop-color="#FFF7FE"/>
        <stop offset="0.45" stop-color="#F8F5FF"/>
        <stop offset="1" stop-color="#FFEAF8"/>
      </linearGradient>
      <linearGradient id="neon" x1="80" y1="80" x2="1120" y2="1320" gradientUnits="userSpaceOnUse">
        <stop stop-color="#FF2E96"/>
        <stop offset="0.5" stop-color="#B829DD"/>
        <stop offset="1" stop-color="#8B5CF6"/>
      </linearGradient>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="32" result="blur"/>
        <feColorMatrix in="blur" type="matrix" values="1 0 0 0 1 0 0 0 0 0.18 0 0 1 0 0.7 0 0 0 0.45 0"/>
        <feBlend in="SourceGraphic"/>
      </filter>
    </defs>
    <rect width="1200" height="1400" rx="80" fill="url(#bg)"/>
    <circle cx="1050" cy="160" r="260" fill="#FF2E96" opacity="0.13"/>
    <circle cx="120" cy="1220" r="340" fill="#8B5CF6" opacity="0.15"/>
    <rect x="90" y="95" width="1020" height="1210" rx="70" fill="white" opacity="0.82" stroke="url(#neon)" stroke-width="8"/>
    <rect x="145" y="155" width="910" height="1090" rx="54" fill="#FFFFFF" stroke="#F2D7FF" stroke-width="3"/>
    <circle cx="600" cy="435" r="170" fill="url(#neon)" opacity="0.18" filter="url(#glow)"/>
    <path d="M425 520C425 424 503 346 600 346C697 346 775 424 775 520C775 616 600 762 600 762C600 762 425 616 425 520Z" fill="url(#neon)" filter="url(#glow)"/>
    <circle cx="545" cy="505" r="26" fill="white" opacity="0.92"/>
    <circle cx="655" cy="505" r="26" fill="white" opacity="0.92"/>
    <text x="600" y="915" text-anchor="middle" font-family="Arial, sans-serif" font-size="70" font-weight="900" fill="#1E1E2F">Zawaj Al Araqi</text>
    <text x="600" y="1008" text-anchor="middle" font-family="Arial, sans-serif" font-size="48" font-weight="800" fill="${accent}">${title}</text>
    <foreignObject x="210" y="1045" width="780" height="150">
      <div xmlns="http://www.w3.org/1999/xhtml" style="font-family:Arial,sans-serif;font-size:34px;font-weight:700;color:#4A455A;text-align:center;line-height:1.35;">
        ${subtitle}
      </div>
    </foreignObject>
    <rect x="360" y="1190" width="480" height="18" rx="9" fill="url(#neon)" opacity="0.85"/>
  </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error('Could not read image file.'));
    reader.onload = () => {
      const image = new Image();

      image.onerror = () => reject(new Error('Could not load selected image.'));
      image.onload = () => {
        const maxSize = 1280;
        const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
        const width = Math.round(image.width * scale);
        const height = Math.round(image.height * scale);

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext('2d');
        if (!context) {
          reject(new Error('Image compression is not supported in this browser.'));
          return;
        }

        context.drawImage(image, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.78);
        resolve(compressedDataUrl);
      };

      image.src = String(reader.result);
    };

    reader.readAsDataURL(file);
  });
};

export default function MarriageCafe({ locale, triggerToast }: MarriageCafeProps) {
  const isEn = locale === 'en';
  const isCkb = locale === 'ckb';

  const txt = (en: string, ar: string, ckb: string) => {
    return isEn ? en : isCkb ? ckb : ar;
  };

  const initialPosts = useMemo<CafePost[]>(
    () => [
      {
        id: 'official-design-1',
        author: txt('Zawaj Al Araqi', 'الزواج العراقي', 'Zawaj Al Araqi'),
        role: txt('Official design', 'تصميم رسمي', 'دیزاینی فەرمی'),
        avatar: 'ز',
        time: txt('Pinned post', 'منشور مثبت', 'بابەتی جێگیرکراو'),
        imageUrl: makeVisualCard(
          'Official Design',
          'A respectful platform for serious marriage, privacy, and family values.',
          '#FF2E96'
        ),
        caption: txt(
          'Official design from Zawaj Al Araqi — serious marriage with privacy and respect.',
          'تصميم رسمي من الزواج العراقي — زواج جاد بخصوصية واحترام.',
          'دیزاینی فەرمی بۆ هاوسەرگیریی جدی بە ڕێز و تایبەتمەندی.'
        ),
        likes: 248,
        isOfficial: true,
        comments: [
          { id: 'c1', name: txt('Sara', 'سارة', 'سارا'), text: txt('Beautiful and respectful.', 'تصميم جميل ومحترم.', 'جوان و ڕێزلێگیراوە.') }
        ]
      },
      {
        id: 'announcement-1',
        author: txt('Platform Admin', 'إدارة المنصة', 'بەڕێوەبەری پلاتفۆرم'),
        role: txt('Announcement', 'إعلان', 'ئاگاداری'),
        avatar: 'A',
        time: txt('Today', 'اليوم', 'ئەمڕۆ'),
        imageUrl: makeVisualCard(
          'New Feature',
          'Marriage Cafe is now a visual community feed for posts, designs, and announcements.',
          '#B829DD'
        ),
        caption: txt(
          'Marriage Cafe is being prepared as a visual feed for designs, announcements, and respectful posts.',
          'مقهى الزواج أصبح مساحة مرئية للمنشورات والتصاميم والإعلانات المحترمة.',
          'چایخانەی هاوسەرگیری دەبێتە فیدێکی وێنەیی بۆ دیزاین و ئاگادارییەکان.'
        ),
        likes: 192,
        isOfficial: true,
        comments: [
          { id: 'c2', name: txt('Omar', 'عمر', 'عومەر'), text: txt('This feels easier to browse.', 'أصبح التصفح أسهل.', 'گەڕان تێیدا ئاسانترە.') }
        ]
      },
      {
        id: 'guidance-1',
        author: txt('Marriage Guidance', 'إرشادات الزواج', 'ڕێنمایی هاوسەرگیری'),
        role: txt('Guidance', 'إرشاد', 'ڕێنمایی'),
        avatar: 'G',
        time: txt('2 hours ago', 'قبل ساعتين', '٢ کاتژمێر پێش ئێستا'),
        imageUrl: makeVisualCard(
          'Respect First',
          'Clear intention, privacy, family values, and calm communication.',
          '#8B5CF6'
        ),
        caption: txt(
          'A good beginning starts with clear intention and respectful communication.',
          'البداية الصحيحة تبدأ بنية واضحة وتواصل محترم.',
          'دەستپێکی باش بە نیازی ڕوون و گفتوگۆی ڕێزلێنانە دەست پێدەکات.'
        ),
        likes: 167,
        isOfficial: true,
        comments: [
          { id: 'c3', name: txt('Noor', 'نور', 'نوور'), text: txt('Very important reminder.', 'تذكير مهم جدًا.', 'بیرخستنەوەیەکی گرنگە.') }
        ]
      },
      {
        id: 'user-1',
        author: txt('Ahmed from Baghdad', 'أحمد من بغداد', 'ئەحمەد لە بەغداد'),
        role: txt('Member post', 'منشور عضو', 'بابەتی ئەندام'),
        avatar: 'أ',
        time: txt('4 hours ago', 'قبل ٤ ساعات', '٤ کاتژمێر پێش ئێستا'),
        imageUrl: makeVisualCard(
          'Family Values',
          'Respect, patience, and honesty are the foundation of a stable home.',
          '#FF2E96'
        ),
        caption: txt(
          'Respect and patience are more important than perfect words.',
          'الاحترام والصبر أهم من الكلام المثالي.',
          'ڕێز و ئارامگرتن گرنگترن لە قسەی تەواو.'
        ),
        likes: 89,
        comments: [
          { id: 'c4', name: txt('Mina', 'مينا', 'مینا'), text: txt('True words.', 'كلام صحيح.', 'قسەی ڕاستە.') }
        ]
      }
    ],
    [locale]
  );

  const [posts, setPosts] = useState<CafePost[]>(initialPosts);
  const [caption, setCaption] = useState('');
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [isCompressing, setIsCompressing] = useState(false);
  const [likedPostIds, setLikedPostIds] = useState<string[]>([]);

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      triggerToast(txt('Please choose an image file.', 'يرجى اختيار ملف صورة.', 'تکایە فایلی وێنە هەڵبژێرە.'));
      return;
    }

    try {
      setIsCompressing(true);
      const compressed = await compressImage(file);
      setSelectedImage(compressed);
      triggerToast(txt('Image compressed and ready.', 'تم ضغط الصورة وهي جاهزة.', 'وێنەکە بچووک کرایەوە و ئامادەیە.'));
    } catch (error) {
      console.error(error);
      triggerToast(txt('Image compression failed. Please try another image.', 'فشل ضغط الصورة. جرّب صورة أخرى.', 'کەمکردنەوەی قەبارەی وێنە سەرکەوتوو نەبوو.'));
    } finally {
      setIsCompressing(false);
      event.target.value = '';
    }
  };

  const handleCreatePost = () => {
    const cleanCaption = caption.trim();

    if (!cleanCaption && !selectedImage) {
      triggerToast(txt('Add a caption or image first.', 'أضف نصًا أو صورة أولاً.', 'سەرەتا دەق یان وێنە زیاد بکە.'));
      return;
    }

    const imageForPost =
      selectedImage ||
      makeVisualCard(
        'Community Post',
        cleanCaption || 'A respectful post from the Zawaj Al Araqi community.',
        '#B829DD'
      );

    const newPost: CafePost = {
      id: `post-${Date.now()}`,
      author: txt('You', 'أنت', 'تۆ'),
      role: txt('New post', 'منشور جديد', 'بابەتی نوێ'),
      avatar: txt('Y', 'أ', 'ت'),
      time: txt('Just now', 'الآن', 'ئێستا'),
      imageUrl: imageForPost,
      caption:
        cleanCaption ||
        txt(
          'A respectful visual post shared with the community.',
          'منشور مرئي محترم تمت مشاركته مع المجتمع.',
          'بابەتێکی وێنەیی ڕێزلێگیراو هاوبەشکرا.'
        ),
      likes: 0,
      comments: []
    };

    setPosts((current) => [newPost, ...current]);
    setCaption('');
    setSelectedImage('');
    triggerToast(txt('Post added to Marriage Cafe.', 'تمت إضافة المنشور إلى مقهى الزواج.', 'بابەتەکە زیادکرا بۆ چایخانەی هاوسەرگیری.'));
  };

  const handleLike = (postId: string) => {
    const alreadyLiked = likedPostIds.includes(postId);

    setLikedPostIds((current) =>
      alreadyLiked ? current.filter((id) => id !== postId) : [...current, postId]
    );

    setPosts((current) =>
      current.map((post) =>
        post.id === postId
          ? { ...post, likes: alreadyLiked ? Math.max(0, post.likes - 1) : post.likes + 1 }
          : post
      )
    );
  };

  return (
    <section id="marriage-cafe-section" className="space-y-8">
      <div className="rounded-[2rem] border border-[#F2D7FF] bg-white/85 p-4 shadow-xl shadow-[#B829DD]/10 backdrop-blur-md sm:p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF2E96] via-[#B829DD] to-[#8B5CF6] text-lg font-black text-white shadow-lg shadow-[#FF2E96]/25">
            <Camera className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-[#B829DD]">
              {txt('Marriage Cafe', 'مقهى الزواج', 'چایخانەی هاوسەرگیری')}
            </p>
            <h3 className="text-xl font-black text-[#1E1E2F] sm:text-2xl">
              {txt('Share a visual post', 'شارك منشورًا مرئيًا', 'بابەتێکی وێنەیی هاوبەش بکە')}
            </h3>
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-[#F3D9FF] bg-[#FBF7FF] p-4">
          <div className="flex gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#FF2E96] to-[#8B5CF6] font-black text-white">
              {txt('Y', 'أ', 'ت')}
            </div>

            <div className="flex-1 space-y-3">
              <textarea
                value={caption}
                onChange={(event) => setCaption(event.target.value)}
                rows={3}
                className="w-full resize-none rounded-2xl border border-[#E9CCFF] bg-white px-4 py-3 text-sm font-semibold text-[#1E1E2F] outline-none transition focus:border-[#FF2E96] focus:ring-4 focus:ring-[#FF2E96]/10"
                placeholder={txt(
                  'Share a respectful post, advice, announcement, or design…',
                  'شارك منشورًا محترمًا، نصيحة، إعلانًا، أو تصميمًا...',
                  'بابەتێکی ڕێزلێگیراو، ئامۆژگاری، ئاگاداری یان دیزاین هاوبەش بکە...'
                )}
              />

              {selectedImage && (
                <div className="relative overflow-hidden rounded-2xl border border-[#F2D7FF] bg-white">
                  <img src={selectedImage} alt="Selected post preview" className="max-h-[360px] w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setSelectedImage('')}
                    className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#1E1E2F] shadow-lg transition hover:scale-105"
                    aria-label="Remove selected image"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#E9CCFF] bg-white px-4 py-2 text-xs font-black text-[#B829DD] shadow-sm transition hover:border-[#FF2E96] hover:text-[#FF2E96]">
                    <ImagePlus className="h-4 w-4" />
                    <span>{isCompressing ? txt('Compressing image…', 'جاري ضغط الصورة...', 'وێنەکە بچووک دەکرێتەوە...') : txt('Upload image', 'رفع صورة', 'وێنە باربکە')}</span>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>

                  <span className="text-[11px] font-bold text-[#6F6A7A]">
                    {txt('Images are compressed before posting.', 'يتم ضغط الصور قبل النشر.', 'وێنەکان پێش بڵاوکردنەوە بچووک دەکرێنەوە.')}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleCreatePost}
                  disabled={isCompressing}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#FF2E96] via-[#B829DD] to-[#8B5CF6] px-6 py-3 text-sm font-black text-white shadow-lg shadow-[#B829DD]/25 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Send className="h-4 w-4" />
                  <span>{txt('Post', 'نشر', 'بڵاوکردنەوە')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {posts.map((post) => {
          const liked = likedPostIds.includes(post.id);

          return (
            <article
              key={post.id}
              className="overflow-hidden rounded-[2rem] border border-[#F2D7FF] bg-white shadow-xl shadow-[#B829DD]/10 transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#FF2E96]/15"
            >
              <header className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#FF2E96] via-[#B829DD] to-[#8B5CF6] text-sm font-black text-white">
                    {post.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-black text-[#1E1E2F]">{post.author}</h4>
                      {post.isOfficial && <BadgeCheck className="h-4 w-4 fill-[#FF2E96] text-white" />}
                    </div>
                    <p className="text-[11px] font-bold text-[#7B728C]">
                      {post.role} · {post.time}
                    </p>
                  </div>
                </div>

                {post.isOfficial && (
                  <span className="rounded-full bg-[#FF2E96]/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#FF2E96]">
                    {txt('Official', 'رسمي', 'فەرمی')}
                  </span>
                )}
              </header>

              <div className="bg-[#F8F5FF]">
                <img src={post.imageUrl} alt={post.caption} className="aspect-[4/5] w-full object-cover" />
              </div>

              <div className="space-y-4 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center gap-1.5 text-sm font-black transition ${
                        liked ? 'text-[#FF2E96]' : 'text-[#1E1E2F] hover:text-[#FF2E96]'
                      }`}
                    >
                      <Heart className={`h-5 w-5 ${liked ? 'fill-[#FF2E96]' : ''}`} />
                      <span>{post.likes}</span>
                    </button>

                    <button type="button" className="flex items-center gap-1.5 text-sm font-black text-[#1E1E2F] transition hover:text-[#B829DD]">
                      <MessageCircle className="h-5 w-5" />
                      <span>{post.comments.length}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => triggerToast(txt('Share option prepared.', 'خيار المشاركة جاهز.', 'هەڵبژاردەی هاوبەشکردن ئامادەیە.'))}
                      className="flex items-center gap-1.5 text-sm font-black text-[#1E1E2F] transition hover:text-[#8B5CF6]"
                    >
                      <Share2 className="h-5 w-5" />
                      <span>{txt('Share', 'مشاركة', 'هاوبەشکردن')}</span>
                    </button>
                  </div>

                  <Sparkles className="h-5 w-5 text-[#B829DD]" />
                </div>

                <p className="text-sm font-semibold leading-relaxed text-[#1E1E2F]">
                  <span className="font-black">{post.author}</span> {post.caption}
                </p>

                {post.comments.length > 0 && (
                  <div className="rounded-2xl bg-[#F8F5FF] p-3">
                    {post.comments.slice(0, 2).map((comment) => (
                      <p key={comment.id} className="text-xs font-semibold text-[#4A455A]">
                        <span className="font-black text-[#1E1E2F]">{comment.name}</span> {comment.text}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
