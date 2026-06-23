import React, { useState, useEffect } from 'react';
import { CommunityPost, PostComment, AppLanguage } from '../types';
import { mockApi } from '../services/mockApi';
import { 
  MessageSquare, 
  Heart, 
  AlertTriangle, 
  Filter, 
  Send, 
  Sparkles, 
  BookOpen, 
  CheckCircle, 
  HelpCircle,
  Clock,
  ShieldCheck,
  User,
  Plus
} from 'lucide-react';

interface CommunityFeedProps {
  locale: AppLanguage;
  currentEmail?: string;
  currentUserProfile: { name: string; gender: 'male' | 'female' };
  triggerToast: (msg: string) => void;
}

const CATEGORY_LABELS_EN = {
  advice: '💍 Marriage Advice',
  family: '👨‍👩‍👧 Family Approval',
  engagement: '📝 Engagement Questions',
  culture: '🗺️ Culture & Traditions',
  religion: '🕋 Religious & Respectful',
  success: '✨ Success Stories',
  daily: '📅 Daily Question'
};

const CATEGORY_LABELS_AR = {
  advice: '💍 نصائح الزواج الجاد',
  family: '👨‍👩‍👧 موافقة ومشاركة الأهل',
  engagement: '📝 أسئلة فترة الخطوبة',
  culture: '🗺️ العادات والتقاليد',
  religion: '🕋 الضوابط الشرعية والدينية',
  success: '✨ قصص نجاح ملهمة',
  daily: '📅 سؤال الزواج اليومي'
};

const CATEGORY_LABELS_CKB = {
  advice: '💍 ئامۆژگاری هاوسەرگیری',
  family: '👨‍👩‍👧 ڕەزامەندی خێزان',
  engagement: '📝 پرسیارەکانی مارەیی و نیشانە',
  culture: '🗺️ داب و نەریتی کوردی',
  religion: '🕋 پرسیارە شەرعی و ئاینییەکان',
  success: '✨ چیرۆکی سەرکەوتوو',
  daily: '📅 پرسیاری هاوسەرگیری ڕۆژانە'
};

export default function CommunityFeed({
  locale,
  currentEmail,
  currentUserProfile,
  triggerToast
}: CommunityFeedProps) {
  const isEn = locale === 'en';
  const isAr = locale === 'ar';
  const labels = locale === 'en' ? CATEGORY_LABELS_EN : locale === 'ckb' ? CATEGORY_LABELS_CKB : CATEGORY_LABELS_AR;

  // State Management
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Post Thread Expanders
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  
  // Comment fields state mapping (postId -> string input)
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  // New Post Submission Form Fields
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<CommunityPost['category']>('advice');

  // Load Community Posts
  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const list = await mockApi.getCommunityPosts();
      setPosts(list);
    } catch (err) {
      console.error("Failed to load community feed", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      triggerToast(isEn ? "⚠️ Please complete both the title and text details." : "⚠️ يُرجى تعبئة عنوان ونص المشاركة بالكامل.");
      return;
    }

    try {
      await mockApi.createCommunityPost(newTitle.trim(), newContent.trim(), newCategory);
      setNewTitle('');
      setNewContent('');
      setNewCategory('advice');
      setShowForm(false);
      triggerToast(isEn ? "✨ Sincere thought shared with the community database!" : "✨ تم بنجاح نشر استفسارك المحتشم في مجتمع التطبيق جزاك الله خيراً.");
      await fetchPosts();
    } catch (err) {
      triggerToast("❌ Failed to publish post.");
    }
  };

  const handleLikePost = async (postId: string) => {
    const userDisplayName = currentUserProfile.name || 'A Serious Member';
    try {
      await mockApi.likePost(postId, userDisplayName);
      await fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async (postId: string) => {
    const commentText = commentInputs[postId] || '';
    if (!commentText.trim()) return;

    try {
      const userDisplayName = currentUserProfile.name || 'Sincere Member';
      const userGender = currentUserProfile.gender;
      await mockApi.addComment(postId, commentText.trim(), userDisplayName, userGender);
      
      // Clear input
      setCommentInputs(prev => ({ ...prev, [postId]: '' }));
      triggerToast(isEn ? "✉️ Respectful response added." : "✉️ إضافة تعليقك الهادف مع الطرف الآخر بنجاح.");
      await fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReportPost = async (postId: string) => {
    if (!confirm(isEn ? "Report this post as inappropriate or unserious?" : "هل أنت متأكد من الإبلاغ عن هذه المادة لعدم ملاءمتها؟")) return;
    try {
      await mockApi.reportPost(postId);
      triggerToast(isEn ? "🛡️ Thank you. The post was flagged for admin manual audit review." : "🛡️ شكراً لتعاونك؛ تم إرسال البلاغ لمشرفي التطبيق للتدقيق المباشر.");
      await fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReportComment = async (postId: string, commentId: string) => {
    try {
      await mockApi.reportComment(postId, commentId);
      triggerToast(isEn ? "🛡️ Comment flagged for moderation." : "🛡️ تم الإبلاغ عن التعليق وتوجيهه للمشرفين.");
      await fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  // Extract custom active daily marriage question
  const dailyPost = posts.find(p => p.isDailyQuestion);
  const remainingPosts = posts.filter(p => !p.isDailyQuestion);

  // Filter posts based on category selection
  const filteredPosts = remainingPosts.filter(p => 
    selectedCategory === 'all' || p.category === selectedCategory
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 text-left text-warm-charcoal animate-fade-in" id="community-main-container">
      
      {/* Community Intro Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/45 backdrop-blur-md p-6 rounded-3xl border border-white/50 shadow-xs">
        <div>
          <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-[#40798C] bg-[#40798C]/10 px-3 py-1 rounded-full border border-[#40798C]/15">
            {isEn ? 'Courtship Advice Hub' : isAr ? 'ملتقى الخطوبة والزواج الوقور' : 'ڕاوێژکاری هاوسەرگیری'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-display font-serif mt-2 tracking-tight">
            {isEn ? 'Respectful Forum & Questions' : isAr ? 'استفسارات ومشورات الأسرة' : 'بەشی پرسیار و چارەسەرەکان'}
          </h2>
          <p className="text-xs text-stone-500 font-semibold mt-1 max-w-xl">
            {isEn 
              ? 'Join serious, marriage-centered conversations. Unserious gossip or casual dating banter is strictly prohibited here.' 
              : isAr 
                ? 'ساهم في حوارات راقية تتمحور حول ميثاق الزواج والوفاق. محادثات التسلية والعلاقات الجانبية محظورة تماماً.'
                : 'بەشداربە لە دۆزینەوەی دەرفەت و پرسیاری جدی هاوسەرگیری. هەر بابەتێکی ناڕاست قەدەغەیە.'}
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="px-5 py-3 bg-[#40798C] hover:bg-[#316070] text-white text-xs font-bold rounded-2xl flex items-center gap-1.5 shadow-md shadow-[#40798C]/10 transition-transform active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{isEn ? 'Ask Marriage Question' : isAr ? 'اطرح استفساراً جديداً' : 'پرسیارێک بکە'}</span>
        </button>
      </div>

      {/* DAILY MARRIAGE QUESTION SPOTLIGHT CARD */}
      {dailyPost && !dailyPost.isReported && (
        <div 
          className="bg-gradient-to-tr from-[#2D2A26] to-[#403932] text-white rounded-[2rem] p-6 sm:p-8 relative overflow-hidden shadow-xl border border-white/10"
          id="daily-spotlight-question-card"
        >
          {/* Decorative halo */}
          <div className="absolute top-[-20%] right-[-10%] w-48 h-48 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="space-y-4 relative z-10 text-left">
            <span className="flex items-center gap-1.5 text-[10px] font-mono font-black uppercase text-amber-400 tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{isEn ? 'A. Daily Marriage Question' : isAr ? 'أ. سؤال الزواج التفاعلي اليومي' : 'پرسیاری ڕۆژ بۆ هاوسەرگیری'}</span>
            </span>

            <div className="space-y-1">
              <h3 className="text-lg sm:text-2xl font-serif text-white font-serif italic tracking-wide">
                “{dailyPost.content}”
              </h3>
              <p className="text-[11px] text-gray-300 font-normal mt-1 leading-relaxed">
                {isEn 
                  ? 'All members are invited to share their values. Sharing answers opens compatible conversations easily.'
                  : isAr 
                    ? 'ندعو كافة المشتركين للإجابة بوقار. فهم آراء الشريك يمنح وضوحاً مسبقاً قبل اتخاذ الخطوة جزاكم الله خيراً.'
                    : 'هەموو ئەندامان بانگهێشتن بۆ وەڵامدانەوە بە ڕاستگۆیی.'}
              </p>
            </div>

            {/* Answers Expansion toggle */}
            <div className="border-t border-white/10 pt-4 flex items-center justify-between flex-wrap gap-3">
              <button
                onClick={() => setExpandedPostId(expandedPostId === dailyPost.id ? null : dailyPost.id)}
                className="text-xs font-bold text-amber-300/90 hover:text-amber-300 flex items-center gap-1.5 transition underline decoration-amber-300/30 underline-offset-4"
              >
                <MessageSquare className="w-4 h-4" />
                <span>
                  {expandedPostId === dailyPost.id ? (isEn ? 'Collapse Answers' : 'إخفاء الأجوبة') : `${isEn ? 'View Answers' : 'عرض الأجوبة'} (${dailyPost.comments.length})`}
                </span>
              </button>

              <span className="text-[10px] text-stone-400 font-mono flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{isEn ? 'Expires in 16 hours' : 'ينتهي بعد ١٦ ساعة'}</span>
              </span>
            </div>

            {/* EXPANDED ANSWERS & DISCUSSIONS */}
            {expandedPostId === dailyPost.id && (
              <div className="pt-4 space-y-4 border-t border-white/10 text-left">
                {dailyPost.comments.length === 0 ? (
                  <p className="text-xs text-stone-400 italic">No answers shared yet. Write yours below.</p>
                ) : (
                  <div className="space-y-2.5">
                    {dailyPost.comments.map(comment => (
                      <div 
                        key={comment.id}
                        className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex flex-col sm:flex-row justify-between items-start gap-2 text-xs"
                      >
                        <div className="space-y-1">
                          <p className="text-stone-300 italic font-medium leading-relaxed">“{comment.text}”</p>
                          <div className="flex items-center gap-1.5 text-stone-400 font-bold text-[10px]">
                            <User className="w-3.5 h-3.5 text-amber-400" />
                            <span>{comment.userName}</span>
                            <span className="text-stone-500">•</span>
                            <span className="capitalize">{comment.userGender === 'male' ? (isEn ? 'Male' : 'ذكر') : (isEn ? 'Female' : 'أنثى')}</span>
                          </div>
                        </div>

                        <button 
                          onClick={() => handleReportComment(dailyPost.id, comment.id)}
                          className="text-[9px] font-semibold text-stone-400 hover:text-red-400 transition ml-auto"
                          title="Report unserious response"
                        >
                          🏳️ Report
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Answer Submission Box */}
                <div className="flex gap-2 text-stone-900 mt-2">
                  <input
                    type="text"
                    value={commentInputs[dailyPost.id] || ''}
                    onChange={e => setCommentInputs(prev => ({ ...prev, [dailyPost.id]: e.target.value }))}
                    placeholder={isEn ? "Add your sincere answer here..." : "اكتب إجابتك الصادقة والهادفة هنا..."}
                    className="flex-grow bg-white border border-stone-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none"
                    onKeyDown={e => { if (e.key === 'Enter') handleAddComment(dailyPost.id); }}
                  />
                  <button
                    onClick={() => handleAddComment(dailyPost.id)}
                    className="px-4 py-2.5 bg-amber-400 hover:bg-amber-500 text-stone-900 rounded-xl font-bold text-xs flex items-center justify-center shrink-0 transition"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* NEW POST MODAL FORM CONTAINER */}
      {showForm && (
        <form 
          onSubmit={handleCreatePost}
          className="p-6 bg-white/50 backdrop-blur-xl border border-white/70 rounded-3xl space-y-4 shadow-xl text-left transition-all duration-300"
        >
          <div className="flex justify-between items-center pb-2 border-b">
            <h4 className="font-serif font-black text-warm-charcoal text-base">
              {isEn ? 'Post Sincere Question to marriage forum' : 'طرح استفسار أو مشورة شرعية'}
            </h4>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-xs text-stone-400 hover:text-warm-charcoal font-black"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Category selection */}
            <div className="sm:col-span-1 space-y-1">
              <label className="text-[10px] font-mono font-bold text-stone-500 uppercase">Topic Category</label>
              <select
                value={newCategory}
                onChange={e => setNewCategory(e.target.value as CommunityPost['category'])}
                className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-1 focus:ring-[#40798C] focus:outline-none"
              >
                <option value="advice">Marriage advice</option>
                <option value="family">Family approval</option>
                <option value="engagement">Engagement questions</option>
                <option value="culture">Culture & tradition</option>
                <option value="religion">Religious questions</option>
                <option value="success">Success stories</option>
              </select>
            </div>

            {/* Question Title input */}
            <div className="sm:col-span-2 space-y-1">
              <label className="text-[10px] font-mono font-bold text-stone-500 uppercase">Discussion Heading (Short)</label>
              <input
                type="text"
                placeholder={isEn ? "e.g. Discussing future residence with in-laws" : "العنوان بالتحديد..."}
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-1 focus:ring-[#40798C] focus:outline-none"
              />
            </div>
          </div>

          {/* Post Content input */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono font-bold text-stone-500 uppercase font-bold block">Draft your thoughts respectfully</label>
            <textarea
              rows={4}
              placeholder={isEn ? "Write details... Avoid dating words, focus on courtship metrics which families value." : "اكتب التفاصيل بوقار وافصح بالخير لمنفعة الجميع..."}
              value={newContent}
              onChange={e => setNewContent(e.target.value)}
              className="w-full bg-white border border-stone-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:ring-1 focus:ring-[#40798C] focus:outline-none"
            />
          </div>

          <div className="flex justify-between items-center text-xs text-stone-400 font-medium">
            <p className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#40798C]" />
              <span>Posts are audited manually to block inappropriate behavior.</span>
            </p>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#40798C] text-white hover:bg-[#316070] rounded-xl font-bold shadow hover:opacity-95 transition"
            >
              {isEn ? 'Publish Thought' : 'مشاركة الآن'}
            </button>
          </div>
        </form>
      )}

      {/* HORIZONTAL CATEGORY SELECTOR CHIPS */}
      <div className="space-y-2">
        <span className="text-[10px] font-mono font-bold tracking-widest text-[#6B635B] uppercase block">
          {isEn ? 'Filter Marriage Subject Areas' : 'تصنيف المواضيع المطروحة'}
        </span>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none snap-x h-12">
          {/* Chip All */}
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-xs font-bold shrink-0 transition ${
              selectedCategory === 'all'
                ? 'bg-warm-charcoal text-white shadow-sm'
                : 'bg-white/50 border border-stone-200 hover:bg-white text-stone-600'
            }`}
          >
            📋 {isEn ? 'All Topics' : 'كل المواضيع'}
          </button>
          
          {Object.entries(labels).map(([catKey, catVal]) => {
            if (catKey === 'daily') return null; // daily handled at top
            return (
              <button
                key={catKey}
                onClick={() => setSelectedCategory(catKey)}
                className={`px-4 py-2 rounded-full text-xs font-bold shrink-0 transition ${
                  selectedCategory === catKey
                    ? 'bg-[#40798C] text-white shadow-sm'
                    : 'bg-white/50 border border-stone-200 hover:bg-white text-stone-600'
                }`}
              >
                {catVal}
              </button>
            );
          })}
        </div>
      </div>

      {/* GENERAL FEED LIST */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="p-12 text-center text-stone-400 text-xs">
            {isEn ? 'Refreshing community feed...' : 'جاري تحميل المشورات الأخلاقية...'}
          </div>
        ) : filteredPosts.length === 0 ? (
          /* E. RESPECTFUL EMPTY STATE */
          <div className="bg-white/40 border border-white/50 p-12 text-center rounded-3xl space-y-4" id="community-empty-state">
            <BookOpen className="w-12 h-12 text-[#40798C] mx-auto opacity-70" />
            <h3 className="font-serif font-black text-warm-charcoal text-lg">
              {isEn ? 'Our Community is Growing' : 'محفل هادئ في انتظار استفسارك'}
            </h3>
            <p className="text-xs text-[#a2978c] max-w-sm mx-auto font-semibold leading-relaxed">
              {isEn 
                ? 'No marriage questions found in this category yet. Be the first to start a respectful conversation!' 
                : 'لم يتم العثور على أي مشاورات تحت هذا التصنيف حالياً. كن أول من يطرح استفساراً بنوايا جادة ومباركة.'}
            </p>
            <button
              onClick={() => { setSelectedCategory('all'); setShowForm(true); }}
              className="px-4 py-2.5 bg-gradient-to-br from-[#40798C] to-[#2E5968] text-white font-extrabold text-xs rounded-xl shadow-md"
            >
              {isEn ? 'Post First Question' : 'ابدأ الحوار الآن'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPosts.map(post => {
              if (post.isReported) return null; // Hide flagged content from standard feed
              
              const isPostExpanded = expandedPostId === post.id;
              const hasLiked = post.likedBy.includes(currentUserProfile.name || '');

              return (
                <div 
                  key={post.id}
                  className="bg-white/55 backdrop-blur-md border border-white/50 p-5 rounded-3xl shadow-xs hover:border-[#40798C]/25 transition duration-300"
                >
                  <div className="space-y-3.5 text-left">
                    
                    {/* Corner badge / poster metadata */}
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-mono font-black text-[#40798C] bg-[#40798C]/10 px-2.5 py-0.5 rounded-full uppercase">
                        {labels[post.category] || post.category}
                      </span>

                      <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-[#A2978C]">
                        <span>{isEn ? 'By' : 'بواسطة'} <span className="font-extrabold text-stone-600">{post.userName}</span></span>
                        <span className="bg-stone-200 w-1 h-1 rounded-full" />
                        <span className="capitalize">{post.userGender === 'male' ? (isEn ? 'Male' : 'ذكر') : (isEn ? 'Female' : 'أنثى')}</span>
                      </div>
                    </div>

                    {/* Question Content */}
                    <div>
                      <h4 className="text-sm sm:text-base font-black text-warm-charcoal tracking-tight font-serif">
                        {post.title}
                      </h4>
                      <p className="text-xs text-stone-600 leading-relaxed font-semibold mt-1.5 whitespace-pre-line">
                        {post.content}
                      </p>
                    </div>

                    {/* Meta interaction tools */}
                    <div className="border-t border-stone-200/50 pt-3 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        
                        {/* Like Button */}
                        <button
                          onClick={() => handleLikePost(post.id)}
                          className={`flex items-center gap-1 text-xs font-bold transition-all ${
                            hasLiked ? 'text-accent-coral scale-102 font-extrabold' : 'text-stone-500 hover:text-accent-coral'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${hasLiked ? 'fill-accent-coral text-accent-coral' : ''}`} />
                          <span>{post.likesCount} {isEn ? 'Likes' : 'إعجاب'}</span>
                        </button>

                        {/* Comment Trigger Button */}
                        <button
                          onClick={() => setExpandedPostId(isPostExpanded ? null : post.id)}
                          className={`flex items-center gap-1.5 text-xs font-bold transition ${
                            isPostExpanded ? 'text-[#40798C] font-extrabold' : 'text-stone-500 hover:text-warm-charcoal'
                          }`}
                        >
                          <MessageSquare className="w-4 h-4" />
                          <span>{post.comments.length} {isEn ? 'Responses' : 'آراء مضافة'}</span>
                        </button>
                      </div>

                      {/* Flag report */}
                      <button
                        onClick={() => handleReportPost(post.id)}
                        className="text-stone-400 hover:text-red-500 transition text-[10px] font-mono font-semibold flex items-center gap-1"
                        title="Flag as inappropriate"
                      >
                        <AlertTriangle className="w-3 h-3" />
                        <span>{isEn ? 'Verify / Flag' : 'إبلاغ'}</span>
                      </button>
                    </div>

                    {/* EXPANDED FEED DISCUSSIONS - RESPONSE CORNER */}
                    {isPostExpanded && (
                      <div className="pt-4 border-t border-stone-100 space-y-4 text-left">
                        
                        {/* Comments list */}
                        {post.comments.length === 0 ? (
                          <p className="text-[11px] text-stone-400 italic">
                            {isEn ? 'No respectful thoughts yet. Add one to guide the courtship!' : 'لا توجد تعليقات حتى الآن. أضف رأيك الصادق للمكاشفة بالخير!'}
                          </p>
                        ) : (
                          <div className="space-y-2.5">
                            {post.comments.map(c => {
                              if (c.isReported) return null;
                              return (
                                <div 
                                  key={c.id}
                                  className="p-3 bg-white/60 border border-stone-100 rounded-2xl text-xs space-y-1 relative"
                                >
                                  <div className="flex justify-between items-center text-[10px] font-bold text-stone-500 font-mono">
                                    <div className="flex items-center gap-1 text-[#A2978C]">
                                      <User className="w-3 h-3 text-[#40798C]" />
                                      <span className="font-extrabold text-stone-600">{c.userName}</span>
                                      <span>({c.userGender === 'male' ? (isEn ? 'Male' : 'ذكر') : (isEn ? 'Female' : 'أنثى')})</span>
                                    </div>
                                    <button 
                                      onClick={() => handleReportComment(post.id, c.id)}
                                      className="text-[9px] text-[#A2978C] hover:text-red-500 transition"
                                    >
                                      Flag
                                    </button>
                                  </div>
                                  <p className="text-stone-700 italic font-medium leading-relaxed">
                                    “{c.text}”
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Comment Submission Bar */}
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={commentInputs[post.id] || ''}
                            onChange={e => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                            placeholder={isEn ? "Add your marriage advice reply..." : "أضف كلمتك الصادقة والمحترمة..."}
                            className="flex-grow bg-white border border-stone-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#40798C]"
                            onKeyDown={e => { if (e.key === 'Enter') handleAddComment(post.id); }}
                          />
                          <button
                            onClick={() => handleAddComment(post.id)}
                            className="px-4 py-2.5 bg-[#40798C] text-white hover:bg-[#316070] rounded-xl font-bold text-xs flex items-center justify-center shrink-0 transition shadow-xs"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        </div>

                      </div>
                    )}

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
