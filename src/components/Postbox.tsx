import React, { useState, useEffect, useCallback } from 'react';
import { AppLanguage, UserProfile, MatchProfile } from '../types';
import { 
  Mail, Calendar, MapPin, Briefcase, GraduationCap, Check, X, 
  Inbox, Sparkles, Send, ShieldCheck, Heart, RotateCcw, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { apiClient } from '../services/apiClient';

interface PostboxProps {
  locale: AppLanguage;
  userProfile: UserProfile;
  matches: MatchProfile[];
  onAcceptRequest: (matchId: string) => void | Promise<void>;
  onDeclineRequest: (matchId: string) => void | Promise<void>;
  triggerToast: (msg: string) => void;
  onNavigateToTab?: (tab: any) => void;
}

interface PostcardData {
  id: string;
  matchId: string;
  senderName: string;
  senderAge: number;
  senderGender: 'male' | 'female';
  senderProfession: string;
  senderEducation: string;
  senderDistrict: string;
  senderGovernorate: string;
  senderEmail: string;
  senderPhone: string;
  senderPhoto: string;
  messageEn: string;
  messageAr: string;
  messageCkb: string;
  stampUrl: string;
  createdAt: string;
  status: 'pending' | 'accepted' | 'declined';
}

const HONEST_MESSAGE = {
  en: 'Assalamu Alaikum. I would like to request a respectful introduction for the purpose of marriage, in accordance with Islamic values and with family guidance.',
  ar: 'السلام عليكم. أرغب في طلب تعارف محترم بغرض الزواج، وفق القيم الإسلامية وبتوجيه من الأهل.',
  ckb: 'ئەسەلامو عەلەیکوم. دەمەوێت داوای ناساندنێکی ڕێزدار بکەم بۆ مەبەستی هاوسەرگیری، بەپێی بەها ئیسلامییەکان و لە ژێر ڕێنمایی خێزان.',
};

const STAMP_URL = 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=80&fit=crop&q=80';

export default function Postbox({ 
  locale, 
  userProfile, 
  matches, 
  onAcceptRequest, 
  onDeclineRequest,
  triggerToast,
  onNavigateToTab
}: PostboxProps) {
  const isEn = locale === 'en';
  const isCkb = locale === 'ckb';

  const txt = (en: string, ar: string, ckb: string) => {
    return isEn ? en : isCkb ? ckb : ar;
  };

  const [postcards, setPostcards] = useState<PostcardData[]>([]);
  const [selectedPostcard, setSelectedPostcard] = useState<PostcardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isActing, setIsActing] = useState(false);

  const loadPostcards = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const myId = String((userProfile as any).id || (userProfile as any).user_id || '');
      const myEmail = (userProfile.email || '').toLowerCase();
      const requests = await apiClient.getIntroductionRequests();

      const incoming = requests.filter((r: any) => {
        const receiverId = r.receiver_id || r.receiverId;
        const receiverEmail = String(r.receiver_email || r.receiverEmail || '').toLowerCase();
        if (myId && receiverId === myId) return true;
        if (myEmail && receiverEmail && receiverEmail === myEmail) return true;
        return false;
      });

      const notShared = isEn ? 'Not shared yet' : isCkb ? 'هێشتا هاوبەش نەکراوە' : 'غير مذكور بعد';
      const memberLabel = isEn ? 'Member' : isCkb ? 'ئەندام' : 'عضو';

      const items: PostcardData[] = incoming.map((r: any) => {
        const senderId = String(r.sender_id || r.senderId || '');
        const match = matches.find((m) => m.id === senderId);
        const statusRaw = String(r.status || 'pending');
        const status: PostcardData['status'] =
          statusRaw === 'accepted' ? 'accepted' : statusRaw === 'declined' ? 'declined' : 'pending';

        return {
          id: String(r.id),
          matchId: senderId,
          senderName: r.sender_name || r.senderName || match?.name || memberLabel,
          senderAge: match?.age || 0,
          senderGender: (match?.gender || 'male') as 'male' | 'female',
          senderProfession: match?.profession || notShared,
          senderEducation: match?.education || notShared,
          senderDistrict: match?.city || match?.district || '',
          senderGovernorate: match?.governorate || '',
          // Never invent contact fields — only real API email after accept; no fake phones
          senderEmail: status === 'accepted' ? String(r.sender_email || r.senderEmail || '') : '',
          senderPhone: '',
          senderPhoto: match?.avatarUrl || '',
          messageEn: HONEST_MESSAGE.en,
          messageAr: HONEST_MESSAGE.ar,
          messageCkb: HONEST_MESSAGE.ckb,
          stampUrl: STAMP_URL,
          createdAt: r.created_at || r.createdAt || new Date().toISOString(),
          status,
        };
      });

      setPostcards(items);
      setSelectedPostcard((prev) => {
        if (!prev) return items.find((p) => p.status === 'pending') || items[0] || null;
        return items.find((p) => p.id === prev.id) || items.find((p) => p.status === 'pending') || items[0] || null;
      });
    } catch (err: any) {
      console.error('Failed to load introduction postbox', err);
      setLoadError(err?.message || 'Failed to load postbox');
      setPostcards([]);
    } finally {
      setIsLoading(false);
    }
  }, [matches, userProfile, isEn, isCkb]);

  useEffect(() => {
    loadPostcards();
  }, [loadPostcards]);

  const handleAccept = async (postcard: PostcardData) => {
    if (isActing) return;
    setIsActing(true);
    try {
      await Promise.resolve(onAcceptRequest(postcard.matchId));
      await loadPostcards();
      triggerToast(
        txt(
          `💍 Accepted introduction from ${postcard.senderName}. You can continue in Private Chat.`,
          `💍 تم قبول طلب التعارف من ${postcard.senderName}. يمكنك المتابعة في المحادثة الخاصة.`,
          `💍 داواکاری ناساندن لەلایەن ${postcard.senderName} قبوڵ کرا. دەتوانیت لە گفتوگۆی تایبەت بەردەوام بیت.`
        )
      );
      if (onNavigateToTab) onNavigateToTab('chat');
    } catch (err: any) {
      triggerToast(err?.message || txt('Could not accept request.', 'تعذر قبول الطلب.', 'نەتوانرا داواکاری قبوڵ بکرێت.'));
    } finally {
      setIsActing(false);
    }
  };

  const handleDecline = async (postcard: PostcardData) => {
    if (isActing) return;
    setIsActing(true);
    try {
      await Promise.resolve(onDeclineRequest(postcard.matchId));
      await loadPostcards();
      triggerToast(
        txt(
          `✉️ Declined request from ${postcard.senderName} with respect.`,
          `✉️ تم الاعتذار عن الطلب من ${postcard.senderName} بكل احترام.`,
          `✉️ داواکارییەکەی ${postcard.senderName} بە ڕێزەوە ڕەتکرایەوە.`
        )
      );
    } catch (err: any) {
      triggerToast(err?.message || txt('Could not decline request.', 'تعذر رفض الطلب.', 'نەتوانرا داواکاری ڕەت بکرێتەوە.'));
    } finally {
      setIsActing(false);
    }
  };

  const formatDate = (isoStr: string) => {
    try {
      const date = new Date(isoStr);
      return date.toLocaleDateString(isEn ? 'en-US' : 'ar-IQ', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return isoStr;
    }
  };

  const notSharedLabel = txt('Not shared yet', 'غير مذكور بعد', 'هێشتا هاوبەش نەکراوە');

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 text-start" id="postcards-tab-view">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-stone-200 pb-5">
        <div>
          <span className="inline-flex items-center gap-1.5 bg-[#40798C]/10 text-[#40798C] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            <Inbox className="w-4 h-4" />
            <span>{txt('Postbox (Postcards)', 'صندوق البريد الوقور', 'سندوقی پۆستە')}</span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-warm-charcoal font-serif tracking-tight">
            {txt('Your Received Postcards', 'البطاقات البريدية المستلمة', 'پۆستکارتە وەرگیراوەکانت')}
          </h2>
          <p className="text-[#6B635B] text-xs sm:text-sm font-medium mt-1">
            {txt(
              'Only real introduction requests appear here. Empty means no proposals yet — dignity over noise.',
              'تظهر هنا فقط طلبات التعارف الحقيقية. الصندوق الفارغ يعني عدم وجود طلبات بعد — الكرامة قبل الامتلاء الزائف.',
              'تەنها داواکارییە ڕاستەقینەکانی ناساندن لێرە دەردەکەون. بەتاڵی واتە هێشتا داواکاری نییە — ڕێز لە بری پڕکردنەوەی درۆ.'
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => loadPostcards()}
            disabled={isLoading}
            className="flex items-center gap-1.5 bg-stone-100 hover:bg-stone-200 text-warm-charcoal font-bold text-xs px-3.5 py-2.5 rounded-xl transition"
          >
            <RotateCcw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{txt('Refresh', 'تحديث', 'نوێکردنەوە')}</span>
          </button>
          {onNavigateToTab && (
            <button
              onClick={() => onNavigateToTab('explore')}
              className="flex items-center gap-1.5 bg-warm-charcoal hover:bg-stone-800 text-white font-bold text-xs px-4.5 py-2.5 rounded-xl transition shadow-md"
            >
              <Send className="w-4 h-4" />
              <span>{txt('Send a Postcard', 'أرسل بطاقة بريدية للغير', 'ناردنی پۆستکارت')}</span>
            </button>
          )}
        </div>
      </div>

      {loadError && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-2xl p-4 text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{loadError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-sm font-bold text-warm-charcoal uppercase tracking-wider font-mono flex items-center gap-1.5">
            <span>{txt('Incoming Mailbox', 'الرسائل الواردة', 'نامە هاتووەکان')}</span>
            <span className="bg-accent-coral/10 text-accent-coral px-2.5 py-0.5 rounded-full text-xs font-black">
              {postcards.filter(p => p.status === 'pending').length} {txt('New', 'جديد', 'نوێ')}
            </span>
          </h3>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
            {isLoading && (
              <div className="p-8 text-center bg-stone-50 border border-stone-200 rounded-3xl text-xs text-stone-500 font-bold">
                {txt('Loading real introduction requests…', 'جاري تحميل طلبات التعارف الحقيقية…', 'داواکارییە ڕاستەقینەکان باردەکرێن…')}
              </div>
            )}

            {!isLoading && postcards.map((p) => {
              const isActive = selectedPostcard?.id === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPostcard(p)}
                  className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer text-start relative overflow-hidden flex items-center gap-4 ${
                    isActive 
                      ? 'bg-slate-900 border-accent-pink shadow-[0_0_15px_rgba(255,20,147,0.4)] scale-[1.01] ring-1 ring-accent-pink text-white' 
                      : 'bg-slate-950/90 border-purple-500/30 hover:border-accent-pink hover:bg-slate-900 shadow-xs text-stone-200'
                  }`}
                >
                  <div className={`absolute top-0 right-0 w-2.5 h-full ${
                    p.status === 'accepted' ? 'bg-emerald-500' : p.status === 'declined' ? 'bg-stone-500' : 'bg-accent-pink'
                  }`} />

                  <div className="relative shrink-0">
                    {p.senderPhoto ? (
                      <img 
                        src={p.senderPhoto} 
                        alt={p.senderName} 
                        className={`w-12 h-12 rounded-full object-cover border-2 ${isActive ? 'border-accent-pink' : 'border-purple-500/40'}`}
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold border-2 ${isActive ? 'border-accent-pink bg-fuchsia-900 text-white' : 'border-purple-500/40 bg-slate-800 text-stone-300'}`}>
                        {(p.senderName || '?').charAt(0)}
                      </div>
                    )}
                    {p.status === 'accepted' && (
                      <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-0.5 rounded-full border border-white">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex justify-between items-baseline gap-2">
                      <h4 className={`text-sm font-black truncate ${isActive ? 'text-white' : 'text-stone-100'}`}>{p.senderName}</h4>
                      <span className="text-[10px] text-stone-400 shrink-0 font-mono">{formatDate(p.createdAt)}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-stone-400">
                      {p.senderAge > 0 && <span>{p.senderAge} {txt('yrs', 'سنة', 'ساڵ')}</span>}
                      {(p.senderDistrict || p.senderGovernorate) && (
                        <>
                          {p.senderAge > 0 && <span>•</span>}
                          <span>{[p.senderDistrict, p.senderGovernorate].filter(Boolean).join(', ')}</span>
                        </>
                      )}
                    </div>

                    <p className="text-[11px] text-stone-300 italic truncate mt-1">
                      "{locale === 'en' ? p.messageEn : locale === 'ckb' ? p.messageCkb : p.messageAr}"
                    </p>
                  </div>
                </div>
              );
            })}

            {!isLoading && postcards.length === 0 && (
              <div className="p-8 text-center bg-stone-50 border border-dashed border-stone-200 rounded-3xl space-y-3">
                <Inbox className="w-8 h-8 text-stone-300 mx-auto" />
                <p className="text-xs text-stone-500 font-bold">{txt('Your postbox is currently empty.', 'صندوق البريد الخاص بك فارغ حالياً.', 'سندوقی پۆستەکەت لە ئێستادا بەتاڵە.')}</p>
                <p className="text-[11px] text-stone-400 font-medium">
                  {txt(
                    'When someone sends a real introduction request, it will appear here.',
                    'عندما يرسل أحدهم طلب تعارف حقيقي، سيظهر هنا.',
                    'کاتێک کەسێک داواکاری ناساندنی ڕاستەقینە بنێرێت، لێرە دەردەکەوێت.'
                  )}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {selectedPostcard ? (
              <motion.div
                key={selectedPostcard.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="p-[2px] bg-gradient-to-tr from-accent-coral via-accent-pink to-purple-600 rounded-[2.5rem] shadow-[0_0_30px_rgba(255,20,147,0.35)]" id="expanded-postcard-card">
                  <div 
                    className="bg-slate-950/95 backdrop-blur-md rounded-[2.4rem] p-6 sm:p-8 relative overflow-hidden flex flex-col md:flex-row gap-6 md:gap-8 justify-between text-start"
                    style={{ backgroundImage: 'radial-gradient(rgba(147, 51, 234, 0.15) 1px, transparent 0)', backgroundSize: '24px 24px' }}
                  >
                    <div className="absolute inset-2 border border-purple-500/20 rounded-[2rem] pointer-events-none" />
                    
                    <div className="flex-1 space-y-5 relative z-10">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono font-bold text-accent-pink uppercase tracking-wider block">
                          ✉️ {txt('HALAL MARRIAGE INTENTION GREETING', 'ميثاق طلب التعارف الشرعي', 'پەیامی هاوسەرگیری حەڵاڵ')}
                        </span>
                        <h3 className="text-2xl font-serif font-black text-white tracking-tight">
                          {txt('Letter of Proposal', 'رسالة الخطوبة والمودة', 'نامەی داواکاری')}
                        </h3>
                        <p className="text-[10px] text-stone-400 font-mono">
                          {txt('Received on', 'تاريخ الاستلام', 'وەرگیرا لە')}: {formatDate(selectedPostcard.createdAt)}
                        </p>
                      </div>

                      <div className="bg-slate-900 border border-purple-500/30 p-5 rounded-2xl shadow-inner text-stone-100 text-[13.5px] leading-relaxed font-serif italic relative">
                        <div className="absolute top-2 left-2 text-purple-900/40 text-4xl select-none font-serif">“</div>
                        <p className="relative z-10 pl-3">
                          {locale === 'en' 
                            ? selectedPostcard.messageEn 
                            : locale === 'ckb' 
                              ? selectedPostcard.messageCkb 
                              : selectedPostcard.messageAr}
                        </p>
                      </div>

                      <div className="bg-slate-900/60 p-4 rounded-2xl border border-purple-500/20 space-y-3 text-xs">
                        <h4 className="font-bold text-accent-pink uppercase tracking-wider text-[10px] font-mono border-b border-purple-500/20 pb-1.5">
                          👤 {txt('About the Sender', 'تفاصيل عن مرسل البطاقة', 'دەربارەی ناردکار')}
                        </h4>
                        <div className="grid grid-cols-2 gap-3 font-medium text-stone-300">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-accent-pink shrink-0" />
                            <span><strong>{txt('Age', 'العمر', 'تەمەن')}:</strong> {selectedPostcard.senderAge > 0 ? `${selectedPostcard.senderAge} ${txt('Years Old', 'سنة', 'ساڵ')}` : notSharedLabel}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-accent-pink shrink-0" />
                            <span className="truncate"><strong>{txt('Profession', 'المهنة', 'پیشە')}:</strong> {selectedPostcard.senderProfession}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-accent-pink shrink-0" />
                            <span className="truncate"><strong>{txt('Lives in', 'مكان الإقامة', 'شوێنی ژیان')}:</strong> {[selectedPostcard.senderDistrict, selectedPostcard.senderGovernorate].filter(Boolean).join(', ') || notSharedLabel}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <GraduationCap className="w-4 h-4 text-accent-pink shrink-0" />
                            <span className="truncate"><strong>{txt('Education', 'التعليم', 'خوێندن')}:</strong> {selectedPostcard.senderEducation}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="hidden md:block w-px bg-dashed bg-purple-500/20 h-auto my-4 self-stretch relative">
                      <span className="absolute top-1/2 -translate-y-1/2 -left-1 text-[9px] text-accent-pink bg-slate-950 px-1 font-mono">POST</span>
                    </div>

                    <div className="w-full md:w-56 shrink-0 flex flex-col justify-between items-center md:items-end gap-6 relative z-10">
                      <div className="flex justify-between items-start w-full gap-4">
                        <div className="w-16 h-16 rounded-full border-2 border-dashed border-accent-pink/40 flex items-center justify-center text-center text-[8px] font-mono font-bold text-accent-pink/60 rotate-12">
                          <div>
                            <div>ZAWAJ</div>
                            <div className="border-y border-accent-pink/30 my-0.5">IRAQ</div>
                            <div>POSTAL</div>
                          </div>
                        </div>

                        <div className="w-14 h-16 border-2 border-accent-pink p-0.5 bg-slate-900 shadow-md rotate-[-6deg] relative overflow-hidden">
                          <img 
                            src={selectedPostcard.stampUrl} 
                            alt="Stamp" 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-0.5 right-0.5 bg-accent-pink text-[6px] text-white font-mono px-1 font-black rounded-xs">
                            250 f
                          </div>
                        </div>
                      </div>

                      <div className="text-center w-full space-y-2 mt-2">
                        <div className="relative inline-block">
                          {selectedPostcard.senderPhoto ? (
                            <img 
                              src={selectedPostcard.senderPhoto} 
                              alt={selectedPostcard.senderName} 
                              className="w-24 h-24 rounded-full object-cover mx-auto border-3 border-accent-pink shadow-[0_0_15px_rgba(255,20,147,0.4)]"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-24 h-24 rounded-full mx-auto border-3 border-accent-pink bg-slate-800 text-white flex items-center justify-center text-3xl font-serif font-black">
                              {(selectedPostcard.senderName || '?').charAt(0)}
                            </div>
                          )}
                          <span className="absolute bottom-1 right-2 bg-emerald-500 text-white p-1 rounded-full border-2 border-white shadow-md">
                            <ShieldCheck className="w-4 h-4" />
                          </span>
                        </div>
                        <div>
                          <h4 className="text-base font-serif font-black text-white">{selectedPostcard.senderName}</h4>
                          <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">
                            {selectedPostcard.senderGender === 'female' ? txt('Bride Prospect', 'عروسة محتملة', 'بووکی ئامادەکراو') : txt('Groom Prospect', 'عريس محتمل', 'زاوای ئامادەکراو')}
                          </p>
                        </div>
                      </div>

                      <div className="w-full mt-4">
                        {selectedPostcard.status === 'accepted' ? (
                          <div className="bg-emerald-950/50 border border-emerald-500/30 p-3 rounded-2xl text-xs space-y-2 text-emerald-300 animate-fade-in font-semibold">
                            <p className="font-bold text-[9px] font-mono text-emerald-400 uppercase tracking-widest border-b border-emerald-500/20 pb-1">
                              🔓 {txt('CHAT UNLOCKED', 'المحادثة مفعلة', 'گفتوگۆ چالاکە')}
                            </p>
                            {selectedPostcard.senderEmail ? (
                              <div className="flex items-center gap-2 truncate">
                                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                                <span>{selectedPostcard.senderEmail}</span>
                              </div>
                            ) : null}
                            <p className="text-[10px] leading-relaxed text-emerald-200/80 font-medium">
                              {txt(
                                'Continue respectfully in Private Chat. Contact details are not invented by the app.',
                                'تابعي التواصل باحترام عبر المحادثة الخاصة. التطبيق لا يخترع بيانات اتصال.',
                                'بە ڕێزەوە لە گفتوگۆی تایبەت بەردەوام بە. ئەپلیکەیشن زانیاری پەیوەندی دروست ناکات.'
                              )}
                            </p>
                            {onNavigateToTab && (
                              <button
                                type="button"
                                onClick={() => onNavigateToTab('chat')}
                                className="w-full mt-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] py-2 rounded-xl"
                              >
                                {txt('Open Private Chat', 'فتح المحادثة الخاصة', 'کردنەوەی گفتوگۆی تایبەت')}
                              </button>
                            )}
                          </div>
                        ) : selectedPostcard.status === 'declined' ? (
                          <div className="bg-slate-900 border border-stone-800 p-3 rounded-2xl text-xs text-center text-stone-400 font-semibold font-mono">
                            🚫 {txt('PROPOSAL DECLINED', 'تم الاعتذار عن الطلب', 'داواکاری ڕەتکرایەوە')}
                          </div>
                        ) : (
                          <div className="bg-[#9333EA]/10 border border-[#9333EA]/20 p-3.5 rounded-2xl text-xs text-center text-fuchsia-300 font-semibold space-y-1">
                            <p className="font-bold text-[9px] font-mono uppercase tracking-wider text-accent-pink">
                              🔒 {txt('CONTACT LOCKED', 'بيانات الاتصال محمية', 'پەیوەندی پارێزراوە')}
                            </p>
                            <p className="text-[10px] leading-relaxed text-stone-400 font-medium">
                              {txt('Accept to unlock Private Chat. The app never invents phone numbers.', 'اقبل الطلب لتفعيل المحادثة الخاصة. التطبيق لا يخترع أرقام هاتف.', 'قبوڵ بکە بۆ چالاککردنی گفتوگۆی تایبەت. ئەپلیکەیشن ژمارەی مۆبایل دروست ناکات.')}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {selectedPostcard.status === 'pending' && (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      disabled={isActing}
                      onClick={() => handleAccept(selectedPostcard)}
                      className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white font-bold text-sm py-3.5 rounded-2xl transition shadow-lg"
                    >
                      <Heart className="w-4 h-4 fill-white" />
                      <span>{txt('Accept Respectfully', 'قبول بكل احترام', 'قبوڵکردن بە ڕێزەوە')}</span>
                    </button>
                    <button
                      type="button"
                      disabled={isActing}
                      onClick={() => handleDecline(selectedPostcard)}
                      className="flex-1 flex items-center justify-center gap-2 bg-stone-200 hover:bg-stone-300 disabled:opacity-60 text-warm-charcoal font-bold text-sm py-3.5 rounded-2xl transition"
                    >
                      <X className="w-4 h-4" />
                      <span>{txt('Decline with Dignity', 'اعتذار وقور', 'ڕەتکردنەوە بە ڕێز')}</span>
                    </button>
                  </div>
                )}

                {selectedPostcard.status === 'accepted' && onNavigateToTab && (
                  <button
                    type="button"
                    onClick={() => onNavigateToTab('chat')}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#FF4FD8] to-[#9D4DFF] text-white font-bold text-sm py-3.5 rounded-2xl transition shadow-lg"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{txt('Continue in Private Chat', 'المتابعة في المحادثة الخاصة', 'بەردەوامبوون لە گفتوگۆی تایبەت')}</span>
                  </button>
                )}
              </motion.div>
            ) : (
              !isLoading && (
                <div className="h-full min-h-[320px] flex items-center justify-center bg-stone-50 border border-dashed border-stone-200 rounded-[2rem] p-8 text-center">
                  <div className="space-y-3 max-w-sm">
                    <Inbox className="w-10 h-10 text-stone-300 mx-auto" />
                    <p className="text-sm font-bold text-stone-600">
                      {txt('Select a postcard to review', 'اختر بطاقة لمراجعتها', 'پۆستکارتێک هەڵبژێرە بۆ پێداچوونەوە')}
                    </p>
                  </div>
                </div>
              )
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
