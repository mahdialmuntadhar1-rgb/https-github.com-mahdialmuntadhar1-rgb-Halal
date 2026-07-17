import React, { useState, useEffect, useRef } from 'react';
import { CommunityPost, PostComment, AppLanguage, UserProfile } from '../types';
import { apiClient } from '../services/apiClient';
import { 
  Coffee, Send, Heart, MessageSquare, Share2, Image as ImageIcon, 
  Trash2, Check, X, ShieldAlert, AlertCircle, Bookmark, Sparkles, Filter, 
  Flame, Lock, CheckCircle2, ThumbsUp, HelpCircle
} from 'lucide-react';

interface MarriageCafeFeedProps {
  locale: AppLanguage;
  userProfile: UserProfile;
  triggerToast?: (msg: string) => void;
}

export default function MarriageCafeFeed({ locale, userProfile, triggerToast: externalTriggerToast }: MarriageCafeFeedProps) {
  const isEn = locale === 'en';
  const isCkb = locale === 'ckb';

  const txt = (en: string, ar: string, ckb: string) => {
    return isEn ? en : isCkb ? ckb : ar;
  };

  const isAdmin = userProfile?.role === 'admin' || 
                  userProfile?.email?.toLowerCase() === 'shkar9441@gmail.com' || 
                  userProfile?.email?.toLowerCase() === 'safaribosafar@gmail.com';

  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [localToast, setLocalToast] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    if (externalTriggerToast) {
      externalTriggerToast(msg);
    }
    setLocalToast(msg);
    setTimeout(() => setLocalToast(null), 4000);
  };

  // Form states
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<CommunityPost['category']>('advice');
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // New social media form states (Instagram/Facebook style)
  const [postType, setPostType] = useState<'standard' | 'photo' | 'opinion' | 'poll'>('standard');
  const [opinionColor, setOpinionColor] = useState<string>('from-rose-500 to-orange-500');
  const [pollOptionsInputs, setPollOptionsInputs] = useState<string[]>(['', '']);

  // Feed control states
  const [adminViewFilter, setAdminViewFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const allPosts = await apiClient.getCommunityPosts();
      setPosts(allPosts);
    } catch (err) {
      console.error(err);
      triggerToast(txt("Failed to load café conversations.", "تعذر تحميل منشورات المقهى.", "بارکردنی پۆستەکانی کافێ سەرکەوتوو نەبوو."));
    } finally {
      setLoading(false);
    }
  };

  // Client-side image compression
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      triggerToast(txt("Please select a valid image file.", "يُرجى اختيار ملف صورة صالح.", "تکایە وێنەیەکی دروست هەڵبژێرە."));
      return;
    }

    setIsCompressing(true);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH || height > MAX_HEIGHT) {
          if (width > height) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          } else {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setAttachedImage(event.target?.result as string);
          setIsCompressing(false);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        // Compress as JPEG with 0.65 quality to ensure rapid server transfer
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.65);
        setAttachedImage(compressedBase64);
        setIsCompressing(false);
        triggerToast(txt("📸 Image compressed and preview generated!", "📸 تم ضغط الصورة وتوليد المعاينة بنجاح!", "📸 وێنەکە بە سەرکەوتووی کەمکرایەوە!"));
      };
      img.onerror = () => {
        setIsCompressing(false);
        triggerToast("Failed to load image for compression.");
      };
    };
    reader.onerror = () => {
      setIsCompressing(false);
      triggerToast("Failed to read image file.");
    };
  };

  const removeAttachedImage = () => {
    setAttachedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();

    let finalTitle = newTitle.trim();
    let finalContent = newContent.trim();

    if (postType === 'opinion') {
      if (!finalContent) {
        triggerToast(txt("⚠️ Please write your opinion text.", "⚠️ يُرجى كتابة رأيك أو فكرتك أولاً.", "⚠️ تکایە دەقی بۆچوونەکەت بنووسە."));
        return;
      }
      finalTitle = finalContent.slice(0, 45) + (finalContent.length > 45 ? '...' : '');
    } else if (postType === 'poll') {
      if (!finalTitle) {
        triggerToast(txt("⚠️ Please write your poll question in the Headline field.", "⚠️ يُرجى كتابة سؤال الاستطلاع في حقل العنوان.", "⚠️ تکایە پرسیاری ڕاپرسییەکە لە حەقڵی سەردێڕ بنووسە."));
        return;
      }
      const validOptions = pollOptionsInputs.filter(opt => opt.trim() !== '');
      if (validOptions.length < 2) {
        triggerToast(txt("⚠️ Please add at least 2 options for your poll.", "⚠️ يُرجى إضافة خيارين على الأقل للاستطلاع.", "⚠️ تکایە لانی کەم ٢ بژاردە بنووسە."));
        return;
      }
    } else {
      if (!finalTitle || !finalContent) {
        triggerToast(txt("⚠️ Please add a title and write your post content.", "⚠️ يُرجى ملء عنوان ونص المنشور بالكامل.", "⚠️ تکایە ناونیشان و ناوەڕۆک بنووسە."));
        return;
      }
    }

    setSubmitting(true);
    try {
      const status = isAdmin ? 'approved' : 'pending';
      const validPollOptions = postType === 'poll' ? pollOptionsInputs.filter(opt => opt.trim() !== '') : undefined;

      await apiClient.createCommunityPost(
        finalTitle,
        finalContent,
        newCategory,
        false, // not a daily question
        postType === 'photo' ? (attachedImage || undefined) : undefined,
        status,
        postType,
        postType === 'opinion' ? opinionColor : undefined,
        validPollOptions
      );

      setNewTitle('');
      setNewContent('');
      setNewCategory('advice');
      setAttachedImage(null);
      setPollOptionsInputs(['', '']);
      if (fileInputRef.current) fileInputRef.current.value = '';

      if (isAdmin) {
        triggerToast(txt("✨ Post published instantly as Admin!", "✨ تم نشر المشاركة فوراً بصفتك مشرفاً!", "✨ پۆستەکە بڵاوکرایەوە وەک سەرپەرشتیار!"));
      } else {
        triggerToast(txt("⏳ Post submitted! It is now pending administrator review.", "⏳ تم إرسال منشورك! وهو الآن قيد مراجعة الإدارة والتدقيق.", "⏳ پۆستەکەت نێردرا! ئێستا چاوەڕوانی پەسەندکردنی سەرپەرشتیارە."));
      }

      await fetchPosts();
    } catch (err) {
      console.error(err);
      triggerToast("❌ Failed to submit post.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleVote = async (postId: string, optionText: string) => {
    const userName = userProfile.name || 'Sincere Member';
    try {
      const updatedPost = await apiClient.voteInPoll(postId, optionText, userName);
      setPosts(prev => prev.map(p => p.id === postId ? updatedPost : p));
      triggerToast(txt("📊 Vote registered!", "📊 تم تسجيل تصويتك العائلي بنجاح!", "📊 دەنگەکەت تۆمارکرا!"));
    } catch (err) {
      console.error(err);
    }
  };

  const handleLike = async (postId: string) => {
    const userName = userProfile.name || 'Sincere Member';
    try {
      await apiClient.likePost(postId, userName);
      // Fast UI refresh
      setPosts(prev => prev.map(p => {
        if (p.id === postId) {
          const isLiked = p.likedBy.includes(userName);
          const newLikedBy = isLiked ? p.likedBy.filter(u => u !== userName) : [...p.likedBy, userName];
          return {
            ...p,
            likedBy: newLikedBy,
            likesCount: isLiked ? p.likesCount - 1 : p.likesCount + 1
          };
        }
        return p;
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async (postId: string) => {
    const commentText = commentInputs[postId] || '';
    if (!commentText.trim()) return;

    try {
      const userName = userProfile.name || 'Sincere Member';
      const userGender = userProfile.gender || 'male';
      const comment = await apiClient.addComment(postId, commentText.trim(), userName, userGender);

      setCommentInputs(prev => ({ ...prev, [postId]: '' }));
      triggerToast(txt("✉️ Comment added!", "✉️ تم إضافة تعليقك العائلي بنجاح!", "✉️ کۆمێنتەکەت زیادکرا!"));
      
      // Fast state refresh
      setPosts(prev => prev.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            comments: [...(p.comments || []), comment]
          };
        }
        return p;
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = (post: CommunityPost) => {
    const shareText = `"${post.title}" - shared from Halal Zawaj Iraqi Marriage Café. Join serious marriage discussions.`;
    navigator.clipboard.writeText(shareText);
    triggerToast(txt("📋 Text link copied! Share it with family members.", "📋 تم نسخ رابط النص! يمكنك مشاركته مع أفراد عائلتك.", "📋 دەقەکە کۆپی کرا! دەتوانیت لەگەڵ خێزانەکەتدا بەشی بکەیت."));
  };

  // Administrative actions
  const handleUpdateStatus = async (postId: string, status: 'approved' | 'hidden' | 'rejected' | 'pending') => {
    try {
      const success = await apiClient.updatePostStatus(postId, status);
      if (success) {
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, status } : p));
        triggerToast(`Post status updated to: ${status}`);
      }
    } catch (err) {
      console.error(err);
      triggerToast("Failed to update status.");
    }
  };

  const handleToggleFeature = async (postId: string) => {
    try {
      const success = await apiClient.toggleFeaturePost(postId);
      if (success) {
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, isFeatured: !p.isFeatured } : p));
        triggerToast("Post featured status toggled!");
      }
    } catch (err) {
      console.error(err);
      triggerToast("Failed to toggle featured status.");
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm(txt("Delete this post permanently?", "هل أنت متأكد من حذف هذا المنشور نهائياً؟", "دڵنیای لە سڕینەوەی ئەم پۆستە؟"))) return;
    try {
      const success = await apiClient.deletePost(postId);
      if (success) {
        setPosts(prev => prev.filter(p => p.id !== postId));
        triggerToast(txt("Post deleted successfully.", "تم حذف المنشور بنجاح.", "پۆستەکە بە سەرکەوتووی سڕایەوە."));
      }
    } catch (err) {
      console.error(err);
      triggerToast("Failed to delete post.");
    }
  };

  // Filtering Logic
  const filteredPosts = posts.filter(post => {
    // 1. Category filter
    if (categoryFilter !== 'all' && post.category !== categoryFilter) {
      return false;
    }

    // 2. Admin filters vs Normal member filters
    if (isAdmin) {
      if (adminViewFilter === 'pending') return post.status === 'pending';
      if (adminViewFilter === 'approved') return post.status === 'approved' || !post.status;
      if (adminViewFilter === 'rejected') return post.status === 'rejected';
      return post.status !== 'hidden'; // show everything else except manually hidden
    } else {
      // Normal users: Only approved posts OR their own posts (even if pending)
      const isMyPost = post.userName === userProfile.name;
      const isApproved = post.status === 'approved' || !post.status; // legacy posts without status are approved
      return (isApproved || isMyPost) && post.status !== 'hidden' && post.status !== 'rejected';
    }
  });

  // Sort featured posts to the absolute top
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (a.isFeatured && !b.isFeatured) return -1;
    if (!a.isFeatured && b.isFeatured) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const categories = [
    { value: 'all', label: txt("All Topics", "كل المواضيع", "هەموو بابەتەکان") },
    { value: 'advice', label: txt("Matrimonial Advice", "نصائح الزواج", "ڕاوێژی هاوسەرگیری") },
    { value: 'family', label: txt("Family & Parents", "الأهل والعائلة", "خێزان و دایکوباوک") },
    { value: 'engagement', label: txt("Engagement Step", "فترة الخطوبة", "ماوەی دەزگیرانداری") },
    { value: 'religion', label: txt("Islamic Ethics", "الآداب الشرعية", "ئادابە شەرعییەکان") },
    { value: 'success', label: txt("Success Stories", "قصص نجاح", "چیرۆکی سەرکەوتن") },
  ];

  return (
    <div className="space-y-8 animate-fade-in text-start" id="marriage-cafe-feed-component">
      
      {/* 1. COFFEE LOUNGE MOTTO BANNER */}
      <div className="bg-[#F6F3EC] border border-[#E1D4BB] rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 justify-between">
        <div className="flex items-start gap-4">
          <div className="bg-[#40798C]/10 p-3.5 rounded-2xl border border-[#40798C]/15 shrink-0">
            <Coffee className="w-7 h-7 text-[#40798C] animate-pulse" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl font-serif font-black text-warm-charcoal tracking-tight">
              {txt("Iraqi Marriage Café", "كافيه الزواج العراقي وقور", "کافێی هاوسەرگیری عێراقی")}
            </h3>
            <p className="text-xs text-stone-500 font-semibold leading-relaxed max-w-xl">
              {txt(
                "Welcome to a secure, respectful community. Discuss traditional Iraqi matching, ask engagement questions, and share beautiful marriage advice. Unserious banter or direct flirting is strictly moderated.",
                "مرحباً بك في ملتقى محتشم ومحفوظ. ناقش تقاليد الزواج العراقي، واطرح أسئلة الخطوبة بمباركة الأهل. تمنع الإدارة أي محاولات تسلية أو مغازلة خارج إطار الزواج.",
                "بەخێربێن بۆ کۆڕی هاوسەرگیری عێراقی. گفتوگۆ بکە لەسەر دابونەریت و بنەما شەرعییەکان بەڕێزەوە."
              )}
            </p>
          </div>
        </div>
      </div>

      {/* 2. ADMIN MODERATION CONTROL BAR (Admin Exclusive) */}
      {isAdmin && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-2 text-amber-900 font-black text-xs font-mono">
            <ShieldAlert className="w-4 h-4 text-amber-700" />
            <span>🛡️ ADMIN MODERATION INTERFACE</span>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <button
              onClick={() => setAdminViewFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                adminViewFilter === 'all' ? 'bg-amber-800 text-white' : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-800'
              }`}
            >
              All Active ({posts.length})
            </button>
            <button
              onClick={() => setAdminViewFilter('pending')}
              className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1 ${
                adminViewFilter === 'pending' ? 'bg-amber-800 text-white' : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-800'
              }`}
            >
              ⏳ Pending ({posts.filter(p => p.status === 'pending').length})
            </button>
            <button
              onClick={() => setAdminViewFilter('approved')}
              className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1 ${
                adminViewFilter === 'approved' ? 'bg-amber-800 text-white' : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-800'
              }`}
            >
              ✅ Approved ({posts.filter(p => p.status === 'approved' || !p.status).length})
            </button>
            <button
              onClick={() => setAdminViewFilter('rejected')}
              className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1 ${
                adminViewFilter === 'rejected' ? 'bg-amber-800 text-white' : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-800'
              }`}
            >
              ❌ Rejected ({posts.filter(p => p.status === 'rejected').length})
            </button>
          </div>
        </div>
      )}

      {/* 3. POST COMPOSER */}
      <div className="bg-[#FAF9F5] border border-[#E6DCC3] rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
        <h4 className="font-serif font-black text-sm sm:text-base text-warm-charcoal flex items-center gap-2 border-b border-stone-100 pb-2.5">
          <Sparkles className="w-4.5 h-4.5 text-[#40798C]" />
          <span>{txt("Share to Marriage Café", "انشر في مقهى الزواج الوقور", "لە کافێی هاوسەرگیری بڵاوی بکەرەوە")}</span>
        </h4>

        {/* Dynamic Post Type Tab Selector */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => {
              setPostType('standard');
              removeAttachedImage();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              postType === 'standard' ? 'bg-[#40798C] text-white shadow-xs' : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
            }`}
          >
            <span>💬</span>
            <span>{txt("Standard", "موضوع للنقاش", "گفتوگۆ")}</span>
          </button>
          <button
            type="button"
            onClick={() => setPostType('photo')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              postType === 'photo' ? 'bg-[#40798C] text-white shadow-xs' : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>{txt("Photo & Caption", "صورة وتعليق", "وێنە و نووسین")}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setPostType('opinion');
              removeAttachedImage();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              postType === 'opinion' ? 'bg-[#40798C] text-white shadow-xs' : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
            }`}
          >
            <span>✍️</span>
            <span>{txt("Write Opinion", "طرح رأي/فكرة", "بۆچوون")}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setPostType('poll');
              removeAttachedImage();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              postType === 'poll' ? 'bg-[#40798C] text-white shadow-xs' : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
            }`}
          >
            <span>📊</span>
            <span>{txt("Create Poll", "استطلاع رأي", "ڕاپرسی")}</span>
          </button>
        </div>

        <form onSubmit={handleCreatePost} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            
            {/* Topic category */}
            <div className="md:col-span-4 space-y-1.5">
              <label className="text-[10px] uppercase font-bold tracking-wider text-stone-500">
                {txt("Topic Category", "تصنيف الموضوع", "بابەتی گفتوگۆ")}
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as CommunityPost['category'])}
                className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#40798C]"
              >
                {categories.filter(c => c.value !== 'all').map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            {/* Title / Question Field */}
            {postType !== 'opinion' && (
              <div className="md:col-span-8 space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-stone-500">
                  {postType === 'poll' 
                    ? txt("Poll Question", "سؤال الاستطلاع", "پرسیاری ڕاپرسی")
                    : txt("Post Headline", "عنوان المشاركة", "سەردێڕی بابەتەکە")}
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder={postType === 'poll' 
                    ? txt("What's your stance on...?", "ما هو رأيكم الشرعي والعائلي في...؟", "بۆچوونتان چییە لەسەر...؟")
                    : txt("e.g., Traditional family salon meeting etiquette?", "مثال: آداب النظرة الشرعية في صالون العائلة؟", "بۆ نموونە، ئادابەکانی بینینی شەرعی؟")}
                  className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#40798C]"
                  maxLength={90}
                />
              </div>
            )}
          </div>

          {/* Type-Specific Content Areas */}
          {postType === 'opinion' ? (
            /* OPINION WRITER (Facebook-Style with Gradient presets) */
            <div className="space-y-3">
              <label className="text-[10px] uppercase font-bold tracking-wider text-stone-500 block">
                {txt("Your opinion in beautiful visual", "اكتب رأيك بقالب ملون جذاب", "بۆچوونەکەت بنووسە بە شێوازێکی جوان")}
              </label>
              <div className={`rounded-2xl p-6 bg-gradient-to-br ${opinionColor} text-white flex flex-col justify-center min-h-[140px] shadow-inner relative transition-all duration-300`}>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder={txt("Write your sincere personal opinion here...", "اكتب رأيك الصادق أو نصيحتك للشباب هنا ليظهر كبطاقة ملونة جميلة...", "بۆچوونی ڕاستگۆیانەی خۆت لێرە بنووسە...")}
                  className="w-full bg-transparent text-white placeholder-white/70 text-center font-serif font-black text-sm sm:text-base focus:outline-none resize-none h-24 border-none"
                  maxLength={250}
                />
              </div>
              
              {/* Preset Selector */}
              <div className="flex items-center gap-2.5 pt-1.5">
                <span className="text-[10px] text-stone-500 font-bold">{txt("Theme:", "القالب:", "بابەت:")}</span>
                <div className="flex gap-2">
                  {[
                    'from-rose-500 to-orange-500',
                    'from-cyan-500 to-blue-500',
                    'from-emerald-500 to-teal-600',
                    'from-indigo-500 to-purple-600',
                    'from-amber-400 to-rose-600',
                    'from-stone-700 to-stone-900'
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setOpinionColor(preset)}
                      className={`w-6 h-6 rounded-full bg-gradient-to-br ${preset} border-2 ${
                        opinionColor === preset ? 'border-warm-charcoal scale-110' : 'border-transparent'
                      } cursor-pointer transition`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : postType === 'poll' ? (
            /* POLL WRITER (Dynamic option lists) */
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-stone-500 block">
                  {txt("Optional Poll Description", "شرح تفصيلي اختياري للاستطلاع", "نووسینی ڕوونکردنەوەی ناچاری")}
                </label>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder={txt("Provide additional context for this poll (optional)...", "اكتب سياقاً أو خلفية عائلية ميسرة لهذا الاستبيان...", "ڕوونکردنەوە بنووسە بۆ ئەم ڕاپرسییە (ئارەزوومەندانە)...")}
                  className="w-full bg-white border border-stone-200 rounded-xl p-3 text-xs font-semibold focus:outline-none focus:border-[#40798C] h-16 resize-none"
                  maxLength={500}
                />
              </div>

              {/* Dynamic Option Inputs */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-wider text-stone-500 block">
                  {txt("Poll Choices (Min 2, Max 4)", "خيارات التصويت (2 على الأقل، 4 كحد أقصى)", "بۆژاردەکانی دەنگدان (لانی کەم ٢، زۆرترین ٤)")}
                </label>
                {pollOptionsInputs.map((option, index) => (
                  <div key={`input-${index}`} className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#40798C] w-4">{index + 1}.</span>
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => {
                        const next = [...pollOptionsInputs];
                        next[index] = e.target.value;
                        setPollOptionsInputs(next);
                      }}
                      placeholder={txt(`Choice ${index + 1}`, `الخيار ${index + 1}`, `بژاردەی ${index + 1}`)}
                      className="flex-1 bg-white border border-stone-200 rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none focus:border-[#40798C]"
                      maxLength={40}
                    />
                    {pollOptionsInputs.length > 2 && (
                      <button
                        type="button"
                        onClick={() => {
                          setPollOptionsInputs(pollOptionsInputs.filter((_, i) => i !== index));
                        }}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                
                {pollOptionsInputs.length < 4 && (
                  <button
                    type="button"
                    onClick={() => setPollOptionsInputs([...pollOptionsInputs, ''])}
                    className="mt-1 text-xs font-black text-[#40798C] hover:text-[#316070] flex items-center gap-1 cursor-pointer"
                  >
                    <span>➕</span>
                    <span>{txt("Add Option", "إضافة خيار آخر", "بژاردەیەکی تر زیاد بکە")}</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* STANDARD OR PHOTO WRITER */
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold tracking-wider text-stone-500">
                {postType === 'photo' 
                  ? txt("Photo Caption", "التعليق المرفق مع الصورة", "ژێرنووسی وێنە")
                  : txt("Detail description", "شرح التفاصيل والأسئلة", "ناوەڕۆکی بابەتەکە")}
              </label>
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder={postType === 'photo'
                  ? txt("Write a short caption for your photo...", "اكتب شرحاً أو تعليقاً وقوراً ومناسباً للصورة المرفقة...", "شرحێکی کورت بنووسە بۆ وێنەکەت...")
                  : txt("Write your thoughts with high dignity and respect...", "اكتب تفاصيل استفسارك بكل احترام ووقار ليجيبك الأعضاء...", "ناوەڕۆک بنووسە بەوپەڕی ڕێزەوە...")}
                className="w-full bg-white border border-stone-200 rounded-xl p-3 text-xs font-semibold focus:outline-none focus:border-[#40798C] h-24 resize-none"
                maxLength={1000}
              />
            </div>
          )}

          {/* Client-side image upload/preview for photo posts */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-stone-100 pt-4">
            
            {/* Image attachment only for standard/photo types */}
            <div className="flex items-center gap-3">
              {(postType === 'photo' || postType === 'standard') && (
                <>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-white hover:bg-stone-50 border border-stone-200 rounded-xl text-stone-700 text-xs font-bold flex items-center gap-2 active:scale-95 transition cursor-pointer"
                    disabled={isCompressing}
                  >
                    <ImageIcon className="w-4 h-4 text-stone-600" />
                    <span>
                      {isCompressing 
                        ? txt("Compressing...", "جاري الضغط...", "کەمکردنەوەی قەبارە...") 
                        : txt("Select Image", "اختيار صورة", "وێنە هەڵبژێرە")}
                    </span>
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />

                  {attachedImage && (
                    <span className="text-[10px] text-emerald-700 font-mono font-bold bg-emerald-50 border border-emerald-200/50 px-2 py-0.5 rounded-md flex items-center gap-1 shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" /> JPEG (Compressed)
                    </span>
                  )}
                </>
              )}
            </div>

            {/* Post button */}
            <button
              type="submit"
              disabled={submitting || isCompressing || (postType === 'photo' && !attachedImage)}
              className="w-full sm:w-auto px-6 py-2.5 bg-[#40798C] hover:bg-[#316070] text-white text-xs font-black rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-[#40798C]/15 cursor-pointer disabled:opacity-50 disabled:pointer-events-none transition"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? txt("Submitting...", "جاري الإرسال...", "دەنێردرێت...") : txt("Submit for Approval", "إرسال للتدقيق والنشر", "ناردن بۆ پەسەندکردن")}</span>
            </button>
          </div>

          {/* Image preview with close handler */}
          {attachedImage && (
            <div className="relative w-40 h-40 rounded-2xl overflow-hidden border border-stone-200/80 mt-2 group shadow-sm bg-stone-50">
              <img src={attachedImage} alt="Attachment Preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={removeAttachedImage}
                className="absolute top-1.5 right-1.5 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-full transition shadow-md cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </form>
      </div>

      {/* 4. FILTER CATEGORY CHIPS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        <Filter className="w-4 h-4 text-stone-400 shrink-0" />
        <div className="flex gap-1.5">
          {categories.map(c => (
            <button
              key={c.value}
              onClick={() => setCategoryFilter(c.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border transition duration-200 ${
                categoryFilter === c.value
                  ? 'bg-stone-900 border-stone-950 text-white'
                  : 'bg-white hover:bg-stone-50 border-stone-200 text-stone-600'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* 5. POSTS LIST */}
      {loading ? (
        <div className="text-center py-12 text-stone-500 font-semibold font-mono flex items-center justify-center gap-2">
          <div className="w-4 h-4 rounded-full border-2 border-stone-400 border-t-transparent animate-spin" />
          <span>{txt("Loading café discussions...", "جاري تحميل محتويات المقهى...", "بارکردنی ناوەڕۆکی کافێ...")}</span>
        </div>
      ) : sortedPosts.length === 0 ? (
        <div className="bg-white border border-stone-200 rounded-3xl p-12 text-center text-stone-500 space-y-3">
          <AlertCircle className="w-10 h-10 text-stone-400 mx-auto" />
          <h5 className="font-serif font-black text-base text-warm-charcoal">
            {txt("No posts found under this category", "لا توجد منشورات في هذا التصنيف حالياً", "هیچ بابەتێک نەدۆزرایەوە لەم بەشەدا")}
          </h5>
          <p className="text-xs max-w-sm mx-auto">
            {txt("Be the first to share a dignified marriage thought or ask a traditional courtship question!", "كن الأول في إثراء المقهى بنصيحة زواج وقورة أو استفسار عائلي محتشم!", "یەکەم کەس بە بۆ بڵاوکردنەوەی بۆچوونی شەرعی!")}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedPosts.map(post => {
            const hasLiked = post.likedBy.includes(userProfile.name || 'Sincere Member');
            const isMyPost = post.userName === userProfile.name;
            const isPending = post.status === 'pending';

            return (
              <div 
                key={post.id}
                className={`bg-white rounded-3xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between p-5 sm:p-6 ${
                  post.isFeatured 
                    ? 'border-amber-400 ring-1 ring-amber-100 shadow-amber-50/50 shadow-md' 
                    : isPending
                      ? 'border-dashed border-amber-300 bg-amber-50/15'
                      : 'border-stone-200 hover:border-stone-300 hover:shadow-md'
                }`}
              >
                
                {/* TOP HIGHLIGHT FLAGS */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-stone-100 border border-stone-200 text-stone-600 font-extrabold px-2.5 py-0.5 rounded-md uppercase font-mono tracking-wider">
                      {txt(
                        categories.find(c => c.value === post.category)?.label || post.category,
                        categories.find(c => c.value === post.category)?.label || post.category,
                        categories.find(c => c.value === post.category)?.label || post.category
                      )}
                    </span>

                    {post.isFeatured && (
                      <span className="text-[10px] bg-amber-100 border border-amber-200 text-amber-800 font-extrabold px-2.5 py-0.5 rounded-md flex items-center gap-1 animate-pulse">
                        📌 {txt("Featured Discussion", "منشور مميز ومثبت", "بابەتی جێگیرکراو")}
                      </span>
                    )}

                    {isPending && (
                      <span className="text-[10px] bg-amber-50 border border-amber-200 text-amber-800 font-extrabold px-2.5 py-0.5 rounded-md flex items-center gap-1">
                        ⏳ {txt("Pending Review", "قيد التدقيق والقبول", "چاوەڕوانی پێداچوونەوە")}
                      </span>
                    )}
                  </div>

                  <span className="text-[10px] text-stone-400 font-mono font-bold">
                    {new Date(post.createdAt).toLocaleDateString(locale === 'ar' ? 'ar-IQ' : undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>

                 {/* POST CONTENT */}
                <div className="space-y-3 text-start">
                  {post.postType === 'opinion' ? (
                    /* OPINION BG GRAPHIC (Facebook/Instagram Style) */
                    <div className={`rounded-2xl p-6 bg-gradient-to-br ${post.opinionColor || 'from-rose-500 to-orange-500'} text-white text-center font-serif font-black text-sm sm:text-base shadow-inner flex items-center justify-center min-h-[140px] relative overflow-hidden px-4 w-full`}>
                      <div className="absolute top-[-20%] right-[-20%] w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                      <p className="relative z-10 leading-relaxed whitespace-pre-line text-white">
                        {post.content}
                      </p>
                    </div>
                  ) : post.postType === 'poll' ? (
                    /* INTERACTIVE POLL POST (Instagram/Twitter Style) */
                    <div className="space-y-3 w-full">
                      <h4 className="text-base sm:text-lg font-serif font-black text-warm-charcoal leading-tight">
                        {post.title}
                      </h4>
                      {post.content && (
                        <p className="text-xs text-stone-600 leading-relaxed whitespace-pre-line mb-2">
                          {post.content}
                        </p>
                      )}
                      
                      {/* Poll Options List with Vote Percentages */}
                      <div className="space-y-2 max-w-md w-full">
                        {(() => {
                          const votes = (post.pollVotes || {}) as Record<string, string[]>;
                          const totalVotes = Object.values(votes).reduce((sum, v) => sum + ((v as string[])?.length || 0), 0);
                          const userVotedFor = Object.keys(votes).find(opt => votes[opt]?.includes(userProfile.name || ''));

                          return (post.pollOptions || []).map((option) => {
                            const optionVoters = votes[option] || [];
                            const percent = totalVotes > 0 ? Math.round((optionVoters.length / totalVotes) * 100) : 0;
                            const isMyVote = userVotedFor === option;

                            return (
                              <button
                                key={`opt-${option}`}
                                type="button"
                                onClick={() => handleVote(post.id, option)}
                                className={`w-full relative rounded-xl border p-3 text-xs font-black transition flex items-center justify-between overflow-hidden cursor-pointer ${
                                  isMyVote
                                    ? 'border-emerald-500 text-emerald-900 bg-emerald-50/20'
                                    : 'border-stone-200 text-stone-700 hover:border-[#40798C] bg-stone-50/50 hover:bg-stone-50'
                                }`}
                              >
                                {/* Animated background bar */}
                                <div 
                                  className={`absolute top-0 left-0 bottom-0 transition-all duration-500 ${
                                    isMyVote ? 'bg-emerald-500/15' : 'bg-[#40798C]/10'
                                  }`}
                                  style={{ width: `${percent}%` }}
                                />

                                <span className="relative z-10 flex items-center gap-1.5 truncate">
                                  {isMyVote && <span className="text-emerald-600">✓</span>}
                                  <span>{option}</span>
                                </span>

                                <span className="relative z-10 text-[10px] text-stone-500 font-mono">
                                  {optionVoters.length} {txt("votes", "صوت", "دەنگ")} ({percent}%)
                                </span>
                              </button>
                            );
                          });
                        })()}
                        
                        {/* Total indicator */}
                        {(() => {
                          const votes = (post.pollVotes || {}) as Record<string, string[]>;
                          const totalVotes = Object.values(votes).reduce((sum, v) => sum + ((v as string[])?.length || 0), 0);
                          return (
                            <p className="text-[10px] text-stone-400 font-bold font-mono">
                              📊 {totalVotes} {txt("total anonymous votes", "إجمالي الأصوات العائلية", "کۆی گشتی دەنگەکان")}
                            </p>
                          );
                        })()}
                      </div>
                    </div>
                  ) : (
                    /* STANDARD OR PHOTO POST */
                    <>
                      <h4 className="text-base sm:text-lg font-serif font-black text-warm-charcoal leading-tight">
                        {post.title}
                      </h4>
                      
                      <p className="text-xs sm:text-[13px] text-stone-600 font-medium leading-relaxed whitespace-pre-line">
                        {post.content}
                      </p>

                      {post.image && (
                        <div className="rounded-2xl overflow-hidden border border-stone-200 bg-stone-50 max-h-96 w-full sm:max-w-xl mt-3">
                          <img src={post.image} alt="Attachment" className="w-full h-full object-contain" />
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* USER PROFILE INFO ROW */}
                <div className="flex items-center justify-between border-t border-stone-100 pt-4 mt-4">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-serif font-black ${
                      post.userGender === 'female' 
                        ? 'bg-rose-100 text-rose-800 border border-rose-200/50' 
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200/50'
                    }`}>
                      {post.userName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-serif font-black text-warm-charcoal">
                          {post.userName}
                        </span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold ${
                          post.userGender === 'female'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200/30'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200/30'
                        }`}>
                          {post.userGender === 'female' ? txt("Sister", "أخت", "خوشک") : txt("Brother", "أخ", "برا")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* LIKE, COMMENT, SHARE PANEL */}
                  <div className="flex items-center gap-1 sm:gap-2">
                    {/* Like */}
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                        hasLiked 
                          ? 'bg-rose-50 text-rose-700 border border-rose-200/40' 
                          : 'bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-500'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-rose-600 text-rose-600' : ''}`} />
                      <span>{post.likesCount}</span>
                    </button>

                    {/* Comments toggle */}
                    <button
                      onClick={() => setExpandedComments(prev => ({ ...prev, [post.id]: !prev[post.id] }))}
                      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                        expandedComments[post.id]
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/40'
                          : 'bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-500'
                      }`}
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{post.comments?.length || 0}</span>
                    </button>

                    {/* Share */}
                    <button
                      onClick={() => handleShare(post)}
                      className="p-1.5 rounded-lg bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-500 transition cursor-pointer"
                      title="Share this thought"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* ADMIN EXCLUSIVE ACTION FOOTER */}
                {isAdmin && (
                  <div className="border-t border-dashed border-stone-200 pt-4 mt-4 bg-stone-50/50 -mx-5 -mb-5 p-5 flex flex-wrap gap-2 items-center justify-between">
                    <span className="text-[9px] font-mono font-black text-stone-500 flex items-center gap-1">
                      🛡️ MODERATION: <span className="uppercase text-stone-700 font-bold bg-white px-1.5 py-0.5 rounded border border-stone-200">{post.status || 'approved'}</span>
                    </span>

                    <div className="flex flex-wrap gap-1.5">
                      {isPending && (
                        <button
                          onClick={() => handleUpdateStatus(post.id, 'approved')}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded-md flex items-center gap-0.5 shadow-sm transition"
                        >
                          <Check className="w-3 h-3" /> Approve
                        </button>
                      )}

                      {isPending && (
                        <button
                          onClick={() => handleUpdateStatus(post.id, 'rejected')}
                          className="px-2.5 py-1 bg-stone-200 hover:bg-stone-300 text-stone-700 text-[10px] font-bold rounded-md flex items-center gap-0.5 transition"
                        >
                          <X className="w-3 h-3" /> Reject
                        </button>
                      )}

                      {!isPending && post.status !== 'hidden' && (
                        <button
                          onClick={() => handleUpdateStatus(post.id, 'hidden')}
                          className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 text-[10px] font-bold rounded-md flex items-center gap-0.5 transition border border-stone-200"
                        >
                          Hide Post
                        </button>
                      )}

                      {!isPending && post.status === 'hidden' && (
                        <button
                          onClick={() => handleUpdateStatus(post.id, 'approved')}
                          className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 text-[10px] font-bold rounded-md flex items-center gap-0.5 transition border border-stone-200"
                        >
                          Unhide Post
                        </button>
                      )}

                      <button
                        onClick={() => handleToggleFeature(post.id)}
                        className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition ${
                          post.isFeatured
                            ? 'bg-amber-600 text-white hover:bg-amber-700'
                            : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200/60'
                        }`}
                      >
                        {post.isFeatured ? "★ Unfeature" : "☆ Feature"}
                      </button>

                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="p-1 text-rose-600 hover:bg-rose-50 rounded-md transition"
                        title="Delete permanently"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* EXPANDED COMMENTS SECTION */}
                {expandedComments[post.id] && (
                  <div className="border-t border-stone-100 pt-4 mt-4 space-y-4">
                    <h5 className="text-[11px] uppercase font-bold tracking-wider text-stone-500">
                      {txt("Matrimonial Responses", "الردود العائلية المشروعة", "وەڵامە شەرعییەکان")}
                    </h5>

                    {/* Comments list */}
                    <div className="space-y-2.5 max-h-60 overflow-y-auto">
                      {(post.comments || []).length === 0 ? (
                        <p className="text-stone-400 text-xs italic py-2">
                          {txt("No comments yet. Be the first to reply respectfully.", "لا توجد ردود بعد. كن الأول في الرد بوقار ونوايا شريفة.", "هیچ وەڵامێک نییە.")}
                        </p>
                      ) : (
                        (post.comments || []).map(comm => (
                          <div 
                            key={comm.id}
                            className={`p-3 rounded-2xl border ${
                              comm.userGender === 'female'
                                ? 'bg-rose-50/10 border-rose-100'
                                : 'bg-emerald-50/10 border-emerald-100'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-serif font-black text-warm-charcoal">
                                  {comm.userName}
                                </span>
                                <span className={`text-[8px] px-1 rounded font-black ${
                                  comm.userGender === 'female'
                                    ? 'bg-rose-100/45 text-rose-800'
                                    : 'bg-emerald-100/45 text-emerald-800'
                                }`}>
                                  {comm.userGender === 'female' ? txt("Sister", "أخت", "خوشک") : txt("Brother", "أخ", "برا")}
                                </span>
                              </div>
                              <span className="text-[9px] text-stone-400">
                                {new Date(comm.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-xs text-stone-600 leading-relaxed font-semibold">
                              {comm.text}
                            </p>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Comment Composer */}
                    <div className="flex items-center gap-2 pt-2 border-t border-stone-100">
                      <input
                        type="text"
                        value={commentInputs[post.id] || ''}
                        onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                        placeholder={txt("Write a dignified matrimonial reply...", "اكتب رداً وقوراً ينم عن نية طيبة...", "وەڵامێکی بەڕێز بنووسە...")}
                        className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#40798C]"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleAddComment(post.id);
                          }
                        }}
                      />
                      <button
                        onClick={() => handleAddComment(post.id)}
                        className="p-2 bg-[#40798C] hover:bg-[#316070] text-white rounded-xl transition cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Elegant Toast overlay notifications */}
      {localToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#22201E] text-[#F6F3EC] border border-stone-800/80 px-4.5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 max-w-xs sm:max-w-sm animate-fade-in font-sans">
          <Sparkles className="w-4.5 h-4.5 text-amber-400 shrink-0 animate-pulse" />
          <span className="text-xs font-bold leading-snug">{localToast}</span>
        </div>
      )}
    </div>
  );
}
