import React, { useEffect, useState } from 'react';
import { AlertTriangle, Heart, MessageCircle, Send } from 'lucide-react';
import { AppLanguage, CommunityCategory, CommunityPost } from '../types';
import { COMMUNITY_CATEGORIES } from '../constants';
import EmptyState from '../components/EmptyState';
import { TRANSLATIONS } from '../lib/translations';
import { labelFor } from '../i18n/labels';
import { apiClient, CafeQuestion } from '../lib/apiClient';

interface CommunityScreenProps {
  locale: AppLanguage;
  posts: CommunityPost[];
  onCreatePost: (category: CommunityCategory, text: string) => Promise<void>;
  onLikePost: (id: string) => void;
  onComment: (id: string, text: string) => Promise<void>;
  onReportPost: (id: string) => void;
}

export default function CommunityScreen({
  locale,
  posts,
  onCreatePost,
  onLikePost,
  onComment,
  onReportPost
}: CommunityScreenProps) {
  const t = TRANSLATIONS[locale] || TRANSLATIONS.ar;
  const [category, setCategory] = useState<CommunityCategory>('Marriage advice');
  const [text, setText] = useState('');
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
  const [cafeQuestion, setCafeQuestion] = useState<CafeQuestion | null>(null);
  const [cafeAnswer, setCafeAnswer] = useState('');
  const [cafeAnswered, setCafeAnswered] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiClient
      .getCafeToday()
      .then((response) => {
        setCafeQuestion(response.question);
        setCafeAnswered(response.answered);
        setCafeAnswer(String(response.answer?.answer || ''));
      })
      .catch(() => {
        setCafeQuestion(null);
      });
  }, []);

  const submitPost = async () => {
    if (!text.trim()) return;
    try {
      setError(null);
      await onCreatePost(category, text.trim());
      setText('');
    } catch (err) {
      setError(t.respectfulContentError);
    }
  };

  const submitCafeAnswer = async () => {
    if (!cafeQuestion || !cafeAnswer.trim()) return;
    try {
      setError(null);
      await apiClient.submitCafeAnswer(cafeQuestion.id, cafeAnswer.trim());
      setCafeAnswered(true);
    } catch {
      setError(t.respectfulContentError);
    }
  };

  const submitComment = async (postId: string) => {
    const draft = commentDrafts[postId]?.trim();
    if (!draft) return;
    try {
      setError(null);
      await onComment(postId, draft);
      setCommentDrafts((current) => ({ ...current, [postId]: '' }));
    } catch (err) {
      setError(t.respectfulContentError);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <section className="bg-white/70 border border-white/80 rounded-[1.5rem] p-5 sm:p-6 shadow-lg shadow-stone-200/25 text-start">
        <span className="text-[10px] font-black uppercase tracking-widest text-accent-coral">{t.communityQuestions}</span>
        <h2 className="text-2xl sm:text-3xl font-serif font-black text-warm-charcoal mt-1">
          {t.communityTitle}
        </h2>
        <p className="text-sm text-[#6B635B] mt-2">
          {t.communitySub}
        </p>
      </section>

      {cafeQuestion && (
        <section className="bg-white/70 border border-accent-coral/20 rounded-[1.5rem] p-5 shadow text-start space-y-3">
          <span className="text-[10px] font-black uppercase tracking-widest text-accent-coral">{t.dailyQuestion}</span>
          <h3 className="text-base sm:text-lg font-black text-warm-charcoal leading-relaxed">
            {locale === 'ar' && cafeQuestion.question_ar ? cafeQuestion.question_ar : cafeQuestion.question}
          </h3>
          <textarea
            value={cafeAnswer}
            onChange={(event) => setCafeAnswer(event.target.value)}
            className="input-basic min-h-24"
            placeholder={t.addRespectfulAdvice}
          />
          <div className="flex justify-end">
            <button type="button" onClick={submitCafeAnswer} className="rounded-xl bg-[#40798C] text-white px-5 py-3 text-xs font-bold flex items-center gap-1.5">
              <Send className="w-4 h-4" />
              {cafeAnswered ? t.saveChanges : t.post}
            </button>
          </div>
        </section>
      )}

      <section className="bg-white/70 border border-white/80 rounded-[1.5rem] p-5 shadow text-start space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <select value={category} onChange={(event) => setCategory(event.target.value as CommunityCategory)} className="input-basic sm:max-w-[240px]">
            {COMMUNITY_CATEGORIES.map((item) => <option key={item} value={item}>{labelFor(item, t)}</option>)}
          </select>
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            className="input-basic min-h-24 flex-1"
            placeholder={t.postPlaceholder}
          />
        </div>
        {error && <p className="text-xs font-bold text-red-600">{error}</p>}
        <div className="flex justify-end">
          <button type="button" onClick={submitPost} className="rounded-xl bg-warm-charcoal text-white px-5 py-3 text-xs font-bold flex items-center gap-1.5">
            <Send className="w-4 h-4" />
            {t.post}
          </button>
        </div>
      </section>

      {posts.length === 0 ? (
        <EmptyState
          title={t.noPostsYet}
          description={t.startCommunity}
        />
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <article key={post.id} className={`bg-white/75 border rounded-[1.5rem] p-5 shadow-sm text-start space-y-4 ${post.isDailyQuestion ? 'border-accent-coral/30' : 'border-white/80'}`}>
              <div className="flex justify-between gap-3">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#40798C]">{labelFor(post.category, t)}</span>
                  <h3 className="text-sm sm:text-base font-bold text-warm-charcoal mt-1 leading-relaxed">{post.text}</h3>
                  <p className="text-[11px] text-[#6B635B] mt-1">{post.author} · {post.createdAt}</p>
                </div>
                {post.isDailyQuestion && (
                  <span className="h-fit rounded-full bg-accent-coral/10 text-accent-coral border border-accent-coral/20 px-3 py-1 text-[10px] font-black">
                    {t.dailyQuestion}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => onLikePost(post.id)} className={`rounded-xl px-3 py-2 text-xs font-bold border flex items-center gap-1.5 ${post.likedByMe ? 'bg-accent-coral text-white border-accent-coral' : 'bg-white text-warm-charcoal border-stone-200'}`}>
                  <Heart className={`w-4 h-4 ${post.likedByMe ? 'fill-white' : ''}`} />
                  {post.likes}
                </button>
                <button type="button" onClick={() => onReportPost(post.id)} className="rounded-xl px-3 py-2 text-xs font-bold border bg-white text-red-600 border-stone-200 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  {t.report}
                </button>
              </div>

              <div className="space-y-2 border-t border-stone-100 pt-3">
                <p className="text-xs font-black text-[#6B635B] flex items-center gap-1.5">
                  <MessageCircle className="w-4 h-4" />
                  {post.comments.length} {t.comments}
                </p>
                {post.comments.map((comment) => (
                  <div key={comment.id} className="rounded-xl bg-stone-50 border border-stone-100 px-3 py-2">
                    <p className="text-xs font-bold text-warm-charcoal">{comment.text}</p>
                    <p className="text-[10px] text-[#6B635B] mt-1">{comment.author} · {comment.createdAt}</p>
                  </div>
                ))}
                <div className="flex gap-2">
                  <input
                    value={commentDrafts[post.id] || ''}
                    onChange={(event) => setCommentDrafts((current) => ({ ...current, [post.id]: event.target.value }))}
                    className="input-basic"
                    placeholder={t.addRespectfulAdvice}
                  />
                  <button type="button" onClick={() => submitComment(post.id)} className="rounded-xl bg-[#40798C] text-white px-4 py-2">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
