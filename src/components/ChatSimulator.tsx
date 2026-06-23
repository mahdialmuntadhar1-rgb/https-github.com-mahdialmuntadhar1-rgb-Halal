import React, { useState, useEffect } from 'react';
import { MatchProfile, Message, Conversation } from '../types';
import { Language, TRANSLATIONS } from '../lib/translations';
import { MOCK_CHATS_RESPONSES } from '../data/matches';
import { Send, Sparkles, AlertTriangle, ShieldCheck, Lock, Ban, Flag, Info, CheckCircle, MessagesSquare } from 'lucide-react';

// Exact prompts requested in Chunk 6
const EN_GUIDED_PROMPTS = [
  "What are your expectations for marriage?",
  "What does a peaceful home mean to you?",
  "How do you handle disagreements?",
  "What are your goals for the next five years?",
  "What values are most important in your future family?",
  "What are your expectations around work, study, and home life?"
];

const AR_GUIDED_PROMPTS = [
  "ما هي توقعاتك لمؤسسة الزواج؟",
  "ماذا يعني لك البيت الهادئ والمسالم؟",
  "كيف تتعامل مع الخلافات ووجهات النظر المختلفة؟",
  "ما هي أهدافك للسنوات الخمس القادمة؟",
  "ما هي القيم الأكثر أهمية في عائلتك المستقبلية؟",
  "ما هي تطلعاتك وتوقعاتك بخصوص العمل، الدراسة، والحياة المنزلية؟"
];

const CKB_GUIDED_PROMPTS = [
  "توقعاتت چییە بۆ هاوسەرگیری؟",
  "ماڵێکی ئارام لای تۆ چی دەگەیەنێت؟",
  "چۆن ڕووبەڕووی ناکۆکییەکان دەبیتەوە؟",
  "ئامانجەکانت بۆ پێنج ساڵی داهاتوو چییە؟",
  "کام بەهایانە گرنگترینن لە خێزانی داهاتووتدا؟",
  "توقعاتت چییە لەسەر کار، خوێندن و ژیانی ماڵەوە؟"
];

interface ChatSimulatorProps {
  locale: Language;
  acceptedMatches: MatchProfile[];
  conversations: Conversation[];
  onSendMessage: (matchId: string, text: string, sender: 'user' | 'match') => void;
  activeMatchId: string | null;
  setActiveMatchId: (id: string | null) => void;
}

export default function ChatSimulator({
  locale,
  acceptedMatches,
  conversations,
  onSendMessage,
  activeMatchId,
  setActiveMatchId,
}: ChatSimulatorProps) {
  const t = TRANSLATIONS[locale];
  
  const txt = (en: string, ar: string, ckb: string) => {
    return locale === 'en' ? en : locale === 'ckb' ? ckb : ar;
  };
  
  const [typedMessage, setTypedMessage] = useState<string>('');
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');
  
  // Local list of blocked matches so block feels real and functional
  const [blockedMatchIds, setBlockedMatchIds] = useState<string[]>([]);
  const [showBlockModal, setShowBlockModal] = useState<boolean>(false);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [reportReason, setReportReason] = useState<string>('unserious');
  const [reportDetails, setReportDetails] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filter out blocked matches from connections list
  const activeConnections = acceptedMatches.filter(m => !blockedMatchIds.includes(m.id));

  // Set first active connection if none selected
  useEffect(() => {
    if ((!activeMatchId || blockedMatchIds.includes(activeMatchId)) && activeConnections.length > 0) {
      setActiveMatchId(activeConnections[0].id);
    }
  }, [activeConnections, activeMatchId, blockedMatchIds, setActiveMatchId]);

  const activeMatch = activeConnections.find(m => m.id === activeMatchId);
  const activeConversation = conversations.find(c => c.matchId === activeMatchId) || { matchId: '', messages: [] };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const currentPrompts = locale === 'ar' 
    ? AR_GUIDED_PROMPTS 
    : locale === 'ckb' 
      ? CKB_GUIDED_PROMPTS 
      : EN_GUIDED_PROMPTS;

  const handleSendPrompt = (promptText: string) => {
    if (!activeMatchId) return;

    // Send user message
    onSendMessage(activeMatchId, promptText, 'user');

    // Simulate response with serious-toned timeout matching their profile
    setTimeout(() => {
      const possibleAnswers = MOCK_CHATS_RESPONSES[activeMatchId] || [];
      const currentMsgCount = activeConversation.messages.filter(m => m.sender === 'match').length;
      
      let answer = possibleAnswers[currentMsgCount % possibleAnswers.length];
      if (!answer) {
        if (locale === 'ar') {
          answer = "أقدر هذا السؤال الجاد والمحترم. هذه الرؤية هامة جداً لضمان توافق البيئة الأسرية ودعم كل منا للآخر في رضا ومودة.";
        } else if (locale === 'ckb') {
          answer = "سوپاس بۆ پرسیارە گرنگ و جدییەکەت. ئەم گفتوگۆیە بەردی بناغەیە بۆ ڕوونبوونەوەی تێڕوانینی هەردوولامان بۆ هاوسەرگیری.";
        } else {
          answer = "Thank you for asking. I believe having transparent expectations early on helps us evaluate compatibility. Building a peaceful home is my highest commitment.";
        }
      }
      
      onSendMessage(activeMatchId, answer, 'match');
    }, 1300);
  };

  const handleSendFreestyle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim() || !activeMatchId) return;

    const textToSend = typedMessage;
    onSendMessage(activeMatchId, textToSend, 'user');
    setTypedMessage('');

    setTimeout(() => {
      let reply = '';
      if (locale === 'ar') {
        reply = "أشكرك على رسالتك الواضحة والصادقة. هذا يعبر عن نضج وتفكير مسؤول. ما تطلعاتك بالنسبة للخطوات الشرعية والرسمية القادمة للتعارف؟";
      } else if (locale === 'ckb') {
        reply = "من پێزانینم هەیە بۆ پەیامە ڕاستگۆیانەکەت. ئەم تێڕوانینە هاوشێوەیە لەگەڵ هیوای مندا. هەنگاوەکانی داهاتوومان بەرەو هاوسەرگیری چۆن دەبینیت؟";
      } else {
        reply = "I appreciate your authentic message. That sounds aligned with my overall expectations. What do you see as our next steps towards formal marriage?";
      }
      onSendMessage(activeMatchId, reply, 'match');
    }, 1600);
  };

  const handleConfirmBlock = () => {
    if (!activeMatchId) return;
    const blockedName = activeMatch ? activeMatch.name : "Member";
    setBlockedMatchIds(prev => [...prev, activeMatchId]);
    setShowBlockModal(false);
    
    const feedback = locale === 'ar'
      ? `Demo: تم حظر ${blockedName} محلياً بنجاح. لن يظهر هذا الملف في قائمة اتصالاتك.`
      : locale === 'ckb'
        ? `پیشاندان: ${blockedName} بلۆک کرا. ئەم پڕۆفایلە چیتر نابینیت.`
        : `Demo: ${blockedName} has been blocked and removed from your connection list.`;
    
    triggerToast(feedback);
    setActiveMatchId(null);
    setMobileView('list');
  };

  const handleSendReport = (e: React.FormEvent) => {
    e.preventDefault();
    setShowReportModal(false);
    
    const reportedName = activeMatch ? activeMatch.name : "Member";
    const feedback = locale === 'ar'
      ? `Demo: تم إرسال البلاغ بخصوص ${reportedName} بنجاح إلى فريق مراجعة حلال لإجراء التحقيق الهوياتي.`
      : locale === 'ckb'
        ? `پیشاندان: ڕاپۆرتەکە لەسەر ${reportedName} نێردرا بۆ لێکۆڵینەوە.`
        : `Demo: Report for ${reportedName} successfully submitted to review board. Thank you for keeping the courtship environment secure.`;
    
    triggerToast(feedback);
    setReportDetails('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-6" id="chat-simulator-v2">
      
      {/* Simulation Feedback Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-4 left-4 sm:left-auto sm:right-6 bg-stone-900 border border-stone-800 text-white text-xs font-bold px-4 py-3.5 rounded-xl shadow-2xl flex items-center gap-2 z-50 animate-bounce duration-500 max-w-sm">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {activeConnections.length === 0 ? (
        <div className="bg-white/40 backdrop-blur-xl border border-white/30 rounded-[2.5rem] p-10 text-center space-y-6 shadow-2xl relative z-10">
          <div className="w-16 h-16 bg-accent-coral/15 rounded-2xl flex items-center justify-center mx-auto text-accent-coral shadow-inner">
            <MessagesSquare className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-serif font-black text-warm-charcoal font-display">
              {txt('No Private Chats Unlocked Yet', 'لم يتم إلغاء قفل أي محادثات خاصة بعد', 'هیچ گفتوگۆیەکی تایبەت هێشتا نەکراوەتەوە')}
            </h3>
            <p className="text-[#6B635B] text-sm max-w-lg mx-auto leading-relaxed">
              {txt(
                'To begin talking, browse portfolios in the Match Explorer and click "Send Marriage Request". Once the request is mutually accepted, communication is unlocked in absolute privacy!',
                'لبدء الحوار العائلي، يرجى تصفح الملفات في مستكشف الشركاء والنقر على "إرسال طلب تعارف للزواج". حالما يتم القبول المتبادل بوقار، يتم فتح المحادثة الخاصة.',
                'بۆ دەستپێکردنی گفتوگۆ، بڕۆ پڕۆفایلەکان لە دۆزەرەوەی هاوبەشەکان ببینە و کرتە بکە لەسەر "ناردنی داواکاری هاوسەرگیری". کاتێک داواکارییەکە لەلایەن هەردوولاوە پەسەندکرا، گفتوگۆ لە پارێزگاریی و متمانەی تەواودا دەکرێتەوە!'
              )}
            </p>
          </div>
          
          <div className="p-4 bg-[#40798C]/5 border border-[#40798C]/15 rounded-2xl max-w-md mx-auto text-left text-xs text-[#6B635B] space-y-2">
            <p className="font-bold text-accent-coral">⭐ Connection Simulation Tip:</p>
            <p className="font-medium">
              Click the **Match Explorer** tab above, choose any compatible profile (e.g. Lina or Sara or Zaid), and send a request. We\'ve built in automated simulation approval so you can immediately return here to preview the private conversation!
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white/30 backdrop-blur-xl border border-white/45 rounded-[2rem] shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[620px] max-h-[750px] items-stretch relative z-10">
          
          {/* LEFT PANEL: Accepted Serious Connections */}
          <div className={`${mobileView === 'list' ? 'flex' : 'hidden md:flex'} md:col-span-4 border-r border-[#A2978C]/15 flex flex-col justify-between bg-white/15 h-full`}>
            <div>
              <div className="p-4 border-b border-white/25 bg-white/30">
                <h4 className="text-xs font-mono font-bold text-[#6B635B] tracking-widest uppercase">
                  {txt('COURTSHIP CONNECTIONS', 'قنوات التعارف المقبولة', 'پەیوەندییەکانی هاوسەرگیری')}
                </h4>
                <p className="text-[10px] text-[#A2978C] font-semibold mt-0.5">
                  {txt('Mutual intent accepted • Chat active', 'تم القبول المتبادل • المحادثة مفعلة', 'نیازی دوولایەنە پەسەندکرا • گفتوگۆ چالاکە')}
                </p>
              </div>

              <div className="divide-y divide-white/10 overflow-y-auto max-h-[500px]">
                {activeConnections.map((m) => {
                  const isActive = m.id === activeMatchId;
                  const lastMessage = conversations.find(c => c.matchId === m.id)?.messages.slice(-1)[0];

                  return (
                    <button
                      key={m.id}
                      onClick={() => {
                        setActiveMatchId(m.id);
                        setMobileView('chat');
                      }}
                      className={`w-full p-4 text-left rtl:text-right transition-all flex items-center gap-3 w-full border-b border-light-beige/25 focus:outline-none ${
                        isActive ? 'bg-white/70 border-l-4 border-l-accent-coral' : 'hover:bg-white/30'
                      }`}
                    >
                      <img
                        src={m.avatarUrl}
                        alt={m.name}
                        className="w-11 h-11 rounded-full object-cover border-2 border-white/50 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                          <h5 className="font-bold text-warm-charcoal text-xs sm:text-sm truncate flex items-center gap-1">
                            <span>{m.name}, {m.age}</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          </h5>
                          <span className="text-[9px] text-accent-coral font-mono font-bold">{m.compatibilityScore}%</span>
                        </div>
                        <p className="text-[11px] text-[#6B635B] truncate mt-0.5 italic font-medium">
                          {lastMessage ? lastMessage.text : txt('Conversation started', 'بدأت المحادثة', 'گفتوگۆ دەستی پێکرد')}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Verification and respect footer bar inside connection manager */}
            <div className="p-4 bg-white/20 border-t border-white/15 text-[#6B635B] text-[10px] space-y-1.5">
              <div className="flex items-center gap-1 text-warm-charcoal font-bold">
                <Lock className="w-3.5 h-3.5 text-accent-coral shrink-0" />
                <span>{txt('Direct Connection Integrity', 'صيانة الاتصال المباشر', 'پاراستنی پەیوەندی ڕاستەوخۆ')}</span>
              </div>
              <p className="font-semibold leading-relaxed">
                {txt(
                  'Abusive scripts, unserious behaviors and spam trigger automatic review bans. Communicate with honor.',
                  'الألفاظ الجارحة، انعدام الجدية أو محاولات الإزعاج تفعّل الحظر والمراجعة من قبل الإدارة.',
                  'زمان و ڕەفتاری نەشیاو، بێجدییەت و نامەی بێزارکەر دەبنە هۆی بلۆککردن و پێداچوونەوەی ئۆتۆماتیکی لەلایەن بەڕێوبەرایەتییەوە. بە ڕێزەوە گفتوگۆ بکە.'
                )}
              </p>
            </div>
          </div>

          {/* RIGHT PANEL: Chat Workspace */}
          <div className={`${mobileView === 'chat' && activeMatch ? 'flex' : 'hidden md:flex'} md:col-span-8 flex flex-col justify-between bg-white/25 h-full relative`}>
            {activeMatch ? (
              <>
                {/* Chat window Header Info with report and block buttons */}
                <div className="p-4 bg-white/40 backdrop-blur-md border-b border-white/20 flex justify-between items-center shadow-sm">
                  <div className="flex items-center gap-2.5 sm:gap-3 text-left rtl:text-right">
                    <button
                      type="button"
                      onClick={() => setMobileView('list')}
                      className="md:hidden flex items-center justify-center p-1.5 rounded-xl bg-warm-charcoal/5 hover:bg-warm-charcoal/10 text-warm-charcoal transition shrink-0"
                      title="Back to list"
                    >
                      <span className="rtl:rotate-180 block text-xs font-bold">←</span>
                    </button>
                    <img
                      src={activeMatch.avatarUrl}
                      alt={activeMatch.name}
                      className="w-10 h-10 rounded-full object-cover border border-white/30 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-serif font-black text-warm-charcoal text-sm">{activeMatch.name}</h4>
                        <span className="text-[8px] bg-[#40798C] text-white font-mono font-bold px-1.5 py-0.5 rounded-full uppercase scale-90">
                          {txt('Direct Match', 'ثنائي متوافق', 'هاوبەشی ڕاستەوخۆ')}
                        </span>
                      </div>
                      <p className="text-[10px] text-[#6B635B] font-semibold leading-none mt-1">
                        {activeMatch.profession} • {activeMatch.governorate}
                      </p>
                    </div>
                  </div>

                  {/* Safety management buttons (Block & Report placeholders) */}
                  <div className="flex items-center gap-1.5">
                    
                    {/* Block User Button */}
                    <button
                      type="button"
                      onClick={() => setShowBlockModal(true)}
                      className="p-2 rounded-xl text-stone-500 hover:text-red-600 hover:bg-stone-100/50 transition duration-150"
                      title={txt('Block this partner', 'حظر هذا الشريك', 'بلۆککردنی ئەم هاوبەشە')}
                    >
                      <Ban className="w-4.5 h-4.5" />
                    </button>

                    {/* Report User Button */}
                    <button
                      type="button"
                      onClick={() => setShowReportModal(true)}
                      className="p-2 rounded-xl text-stone-500 hover:text-amber-600 hover:bg-stone-100/50 transition duration-150"
                      title={txt('Report violation', 'أبلغ عن مخالفة', 'ڕاپۆرتکردنی سەرپێچی')}
                    >
                      <Flag className="w-4.5 h-4.5" />
                    </button>

                  </div>
                </div>

                {/* CRITICAL Safety banner requested exactly in Chunk 6 */}
                <div className="bg-[#40798C]/10 py-3 px-4 text-xs text-warm-charcoal border-b border-stone-200/50 flex items-start gap-2 text-left rtl:text-right">
                  <Info className="w-4 h-4 text-[#40798C] shrink-0 mt-0.5" />
                  <p className="font-semibold leading-normal">
                    {locale === 'en' 
                      ? "Private respectful chat. Only mutual matches can message each other. Keep communication honest, serious, and marriage-focused."
                      : locale === 'ckb'
                        ? "چاتی تایبەتی بەڕێز. تەنها ئەو کەسانەی قبوڵکردنی یەکلاکهرەوەیان هەیە دەتوانن نامە گۆڕینەوە بکەن. ئامانجمان ڕاستگۆیی و نیازپاکی خێزانییە."
                        : "محادثة خاصة ومحترمة. يمكن فقط للأعضاء المتوافقين بشكل متبادل تبادل الرسائل. يرجى الحفاظ على الصدق، والجدية، والتركيز على الزواج في تواصلكما."}
                  </p>
                </div>

                {/* Dialogue stream messages layout */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[380px] min-h-[300px]">
                  {activeConversation.messages.length === 0 ? (
                    <div className="text-center py-10 space-y-2">
                      <p className="text-[#6B635B] text-xs font-bold">
                        {txt('Initialize discussion with an expectation check', 'ابدأ الحوار بسؤال جاد حول البناء الأسري الكريـم', 'دەستپێکردنی گفتوگۆ بە پشکنینی هاوشێوەیی بۆچوونەکان')}
                      </p>
                      <p className="text-[10px] text-[#A2978C] max-w-sm mx-auto font-medium">
                        {txt('Select any of the guided questions below to check alignment.', 'انقر على أي من الأسئلة المتخصصة أدناه لقياس مدى التطابق.', 'یەکێک لە پرسیارە ئاراستەکراوەکانی خوارەوە هەڵبژێرە بۆ پشکنینی هاوتەریبی.')}
                      </p>
                    </div>
                  ) : (
                    activeConversation.messages.map((m) => {
                      const isUser = m.sender === 'user';
                      return (
                        <div
                          key={m.id}
                          className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs sm:max-w-md p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                              isUser
                                ? 'bg-gradient-to-br from-[#40798C] to-[#2E5968] text-white rounded-br-none shadow-md animate-slide-in'
                                : 'bg-white/80 border border-stone-200/50 text-warm-charcoal rounded-bl-none shadow-sm text-left rtl:text-right'
                            }`}
                          >
                            <p className="font-semibold">{m.text}</p>
                            <p className={`text-[8px] mt-1.5 font-mono text-right ${isUser ? 'text-stone-200' : 'text-[#6B635B] font-bold'}`}>
                              {m.timestamp}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* GUIDED RESPECTFUL DISCUSSIONS DRAWER */}
                <div className="bg-white/35 border-t border-[#A2978C]/15 p-4 space-y-2 text-left rtl:text-right">
                  <p className="text-[9px] font-bold text-accent-coral uppercase tracking-wider flex items-center gap-1 font-mono">
                    <Sparkles className="w-3.5 h-3.5 text-accent-coral fill-accent-coral shrink-0" />
                    <span>{txt('GUIDED VALUE QUESTIONS', 'أسئلة معايير التوافق والزواج الموصى بها', 'پرسیارە ئاراستەکراوەکانی هاوسەرگیری')}</span>
                  </p>
                  
                  <div className="flex flex-nowrap md:flex-wrap overflow-x-auto gap-2 pb-1.5 scrollbar-none scroll-smooth">
                    {currentPrompts.map((prompt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendPrompt(prompt)}
                        className="bg-white/70 hover:bg-white text-warm-charcoal border border-stone-200/80 rounded-xl px-3.5 py-2 text-xs text-left rtl:text-right font-bold shrink-0 max-w-[230px] md:max-w-none hover:border-[#40798C] hover:text-[#40798C] transition-all shadow-sm"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Chat message input action bar */}
                <form onSubmit={handleSendFreestyle} className="p-4 bg-white/50 border-t border-stone-200/60 flex gap-3 items-center">
                  <input
                    type="text"
                    value={typedMessage}
                    onChange={(e) => setTypedMessage(e.target.value)}
                    placeholder={txt("Write your respectful response...", "أكتب رسالة وقورة وبناءة...", "وەڵامێکی بەڕێز بنووسە...")}
                    className="flex-1 bg-white border border-stone-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-warm-charcoal font-semibold focus:outline-none focus:ring-1 focus:ring-accent-coral"
                  />
                  <button
                    type="submit"
                    className="p-3.5 rounded-xl bg-accent-coral hover:opacity-90 text-white transition font-bold shadow-md shadow-accent-coral/20 shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center p-10 text-[#6B635B] text-xs font-bold text-center">
                {txt(
                  'Select an active marriage connection from the sidebar to dialogue.', 
                  'يرجى اختيار أحد الشركاء المتطابقين في القائمة الجانبية لبدء حوار بناء.',
                  'پەیوەندییەکی هاوسەرگیری چالاک لە لیستەکە هەڵبژێرە بۆ گفتوگۆکردن.'
                )}
              </div>
            )}
          </div>

        </div>
      )}

      {/* MODAL 1: Block confirmation dialogue */}
      {showBlockModal && activeMatch && (
        <div className="fixed inset-0 bg-[#2D2A26]/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-sm w-full p-6 sm:p-7 rounded-3xl border border-stone-200 shadow-2xl space-y-4 animate-fade-in text-left rtl:text-right">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <Ban className="w-6 h-6" />
            </div>
            <div className="space-y-1.5 text-center">
              <h4 className="text-lg font-serif font-black text-warm-charcoal">
                {txt(`Block ${activeMatch.name}?`, `حظر ${activeMatch.name}؟`, `بلۆککردنی ${activeMatch.name}؟`)}
              </h4>
              <p className="text-xs text-[#6B635B] leading-relaxed font-semibold">
                {txt(
                  'Are you sure you want to block this user? They will be permanently removed from your active connections and matches.',
                  'هل أنت متأكد من رغبتك في حظر هذا الشريك؟ سيتم حجب ملفه بالكامل وتطهير قنوات التعارف معه.',
                  'تۆ دڵنیایت لە بلۆککردنی ئەم بەکارهێنەرە؟ بە شێوازێکی هەمیشەیی لە پەیوەندییە چالاکەکانت لادەبرێت.'
                )}
              </p>
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowBlockModal(false)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-[#4A443F] font-bold text-xs rounded-xl transition"
              >
                {txt('Cancel', 'إلغاء', 'پاشگەزبوونەوە')}
              </button>
              <button
                type="button"
                onClick={handleConfirmBlock}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition shadow-lg shadow-red-600/15"
              >
                {txt('Yes, Block User', 'نعم، قم بالحظر', 'بەڵێ، بلۆکی بکە')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Report User dialogue */}
      {showReportModal && activeMatch && (
        <div className="fixed inset-0 bg-[#2D2A26]/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-md w-full p-6 rounded-3xl border border-stone-200 shadow-2xl space-y-4 animate-fade-in text-left rtl:text-right">
            <div className="flex justify-between items-center pb-3 border-b border-stone-150">
              <h4 className="text-sm sm:text-base font-serif font-black text-warm-charcoal flex items-center gap-1.5">
                <Flag className="w-4.5 h-4.5 text-amber-500 fill-amber-500" />
                <span>{txt(`Report ${activeMatch.name}`, `تقديم بلاغ ضد ${activeMatch.name}`, `ڕاپۆرتکردن لەسەر ${activeMatch.name}`)}</span>
              </h4>
              <button 
                onClick={() => setShowReportModal(false)}
                className="text-stone-400 hover:text-stone-600 font-extrabold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendReport} className="space-y-4">
              
              <div className="space-y-1.5">
                <label className="block text-[10px] font-mono font-bold text-[#6B635B] uppercase tracking-wide">
                  {txt('Reason for Reporting', 'سبب البلاغ المباشر', 'هۆکاری ڕاپۆرتکردن')}
                </label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 p-2.5 rounded-xl text-xs text-warm-charcoal font-semibold focus:outline-none"
                  required
                >
                  <option value="unserious">{txt('Unserious / Casual player', 'غير جاد / يتسلى بملء الأوقات', 'بێجدی / تەنها بۆ کاتبەسەربردن یاری دەکات')}</option>
                  <option value="harassment">{txt('Harassment or Impolite speech', 'إساءة استخدام أو ألفاظ غير لائقة', 'بێزارکردن یان قسەی نەشیاو')}</option>
                  <option value="fake_profile">{txt('Fake identity / Catfish', 'هوية مزورة أو كاذبة للتحقق', 'ناسنامەی ساختە')}</option>
                  <option value="commercial">{txt('Commercial or spam advertise', 'إعلان تجاري أو طلبات خارجية', 'ڕیکلامی بازرگانی یان بێزارکەر')}</option>
                  <option value="other">{txt('Other policy violation', 'أخرى تشكل خرقاً للقواعد', 'سەرپێچی تری یاساکان')}</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-mono font-bold text-[#6B635B] uppercase tracking-wide">
                  {txt('Details and evidence (Required)', 'التفاصيل والوقائع والملاحظات (هام للتأكيد)', 'وردەکارییەکان و بەڵگەکان (پێویستە)')}
                </label>
                <textarea
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  required
                  rows={3}
                  className="w-full bg-stone-50 border border-stone-200 p-3 rounded-xl text-xs text-warm-charcoal font-semibold focus:outline-none focus:ring-1 focus:ring-accent-coral"
                  placeholder={txt("Please outline specific statements or actions that violate marriage intention rules...", "يرجى ذكر الوقائع والعبارات التي تمت كتابتها وتخالف ميثاق الشرف للخطوبة...", "تکایە دەستنیشانی ئەو دەستەواژە یان ڕەفتارە تایبەتانە بکە کە یاساکانی خواستی هاوسەرگیری دەشکێنن...")}
                />
              </div>

              {/* Simulation warning notice inside report */}
              <div className="p-3 bg-stone-50 rounded-xl text-[10px] text-stone-500 font-mono">
                Notice: All reports are cross-checked against standard government ID verification rules. 
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-[#4A443F] font-bold text-xs rounded-xl transition"
                >
                  {txt('Close', 'إغلاق', 'داخستن')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-accent-coral hover:bg-opacity-95 text-white font-bold text-xs rounded-xl shadow-lg shadow-accent-coral/15"
                >
                  {txt('Submit Report for Review', 'إرسال البلاغ للتدقيق', 'ناردنی ڕاپۆرت بۆ پێداچوونەوە')}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
