import React, { useState, useEffect } from 'react';
import { MatchProfile, Message, Conversation } from '../types';
import { Language, TRANSLATIONS } from '../lib/translations';
import { MOCK_GUIDED_PROMPTS, MOCK_CHATS_RESPONSES } from '../data/matches';
import { Send, Sparkles, ShieldAlert, Heart, Lock, Check, SendIcon, DownloadCloud, AlertCircle } from 'lucide-react';

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
  
  const [typedMessage, setTypedMessage] = useState<string>('');
  const [showWaliPopup, setShowWaliPopup] = useState<boolean>(false);

  // Set first accepted match active if none is active
  useEffect(() => {
    if (!activeMatchId && acceptedMatches.length > 0) {
      setActiveMatchId(acceptedMatches[0].id);
    }
  }, [acceptedMatches, activeMatchId, setActiveMatchId]);

  const activeMatch = acceptedMatches.find(m => m.id === activeMatchId);
  const activeConversation = conversations.find(c => c.matchId === activeMatchId) || { matchId: '', messages: [] };

  const handleSendPrompt = (promptText: string) => {
    if (!activeMatchId) return;

    // Send user message
    onSendMessage(activeMatchId, promptText, 'user');

    // Simulate response with timeout
    setTimeout(() => {
      // Find preset response list
      const possibleAnswers = MOCK_CHATS_RESPONSES[activeMatchId] || [];
      // Pick based on prompt or length of conversation
      const currentMsgCount = activeConversation.messages.filter(m => m.sender === 'match').length;
      const answer = possibleAnswers[currentMsgCount % possibleAnswers.length] || 
                     `Thank you for asking. I believe having transparent intentions early on helps us evaluate compatibility. Let’s consult each other’s values.`;
      
      onSendMessage(activeMatchId, answer, 'match');
    }, 1200);
  };

  const handleSendFreestyle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim() || !activeMatchId) return;

    const textToSend = typedMessage;
    onSendMessage(activeMatchId, textToSend, 'user');
    setTypedMessage('');

    setTimeout(() => {
      onSendMessage(
        activeMatchId,
        `I appreciate your authentic message. That sounds wonderful and aligned with my overall expectations. What do you feel about involving our families?`,
        'match'
      );
    }, 1500);
  };

  const handleExportTranscript = () => {
    setShowWaliPopup(true);
    setTimeout(() => setShowWaliPopup(false), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="chat-simulator">
      
      {acceptedMatches.length === 0 ? (
        <div className="bg-white/40 backdrop-blur-xl border border-white/30 rounded-[2.5rem] p-10 text-center space-y-6 shadow-2xl relative z-10">
          <div className="w-16 h-16 bg-accent-coral/15 rounded-2xl flex items-center justify-center mx-auto text-accent-coral shadow-inner">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-serif font-black text-warm-charcoal font-display">No Secure Chats Unlocked Yet</h3>
            <p className="text-[#6B635B] text-sm max-w-lg mx-auto leading-relaxed">
              To start talking, browse profiles in the <strong>Match Explorer</strong>, click <strong>Send Respectful Request</strong>. 
              Once mutual interest is accepted, the portrait is automatically unblurred and the secure chat environment opens!
            </p>
          </div>
          
          <div className="p-4 bg-white/55 border border-white/40 rounded-2xl max-w-md mx-auto text-left text-xs text-[#6B635B] space-y-1">
            <p className="font-bold text-accent-coral">⭐ Pro-Tip for Simulator:</p>
            <p className="font-medium">
              Click "Browse matches" at the top, and send requests to <strong>Lina</strong> or <strong>Sara</strong>. We've built in a 2.5-second auto-approval simulator!
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white/40 backdrop-blur-xl border border-white/30 rounded-[2rem] shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[600px] max-h-[700px] items-stretch relative z-10">
          
          {/* LEFT COLUMN: Accepted connections list */}
          <div className="md:col-span-4 border-r border-white/20 flex flex-col justify-between bg-white/10">
            <div>
              <div className="p-4 border-b border-white/20 bg-white/30 backdrop-blur-md">
                <h4 className="text-xs font-bold text-[#6B635B] font-mono tracking-widest uppercase">My Connections</h4>
                <p className="text-[10px] text-[#C3BFB9]/85 font-medium">Mutual approval & photo unlocked</p>
              </div>

              <div className="divide-y divide-white/10 overflow-y-auto">
                {acceptedMatches.map((m) => {
                  const isActive = m.id === activeMatchId;
                  const lastMessage = conversations.find(c => c.matchId === m.id)?.messages.slice(-1)[0];

                  return (
                    <button
                      key={m.id}
                      onClick={() => setActiveMatchId(m.id)}
                      className={`w-full p-4 text-left transition-all flex items-center space-x-3.5 focus:outline-none ${
                        isActive ? 'bg-white/60 border-l-4 border-accent-coral' : 'hover:bg-white/25'
                      }`}
                    >
                      <img
                        src={m.avatarUrl}
                        alt={m.name}
                        className="w-11 h-11 rounded-full object-cover border border-white/30 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                          <h5 className="font-bold text-warm-charcoal text-xs sm:text-sm truncate flex items-center gap-1">
                            <span>{m.name}</span>
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          </h5>
                          <span className="text-[9px] text-[#6B635B] font-bold uppercase">{m.compatibilityScore}%</span>
                        </div>
                        <p className="text-[11px] text-[#6B635B] truncate mt-0.5">
                          {lastMessage ? lastMessage.text : `Joined conversation`}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom info banner */}
            <div className="p-4 bg-white/20 border-t border-white/10 text-[#6B635B] text-[10px] space-y-1 font-medium">
              <p className="font-bold text-warm-charcoal flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-accent-coral" />
                Dignity Assured
              </p>
              <p>Swear words & abusive behaviors are automatically flagged. Conversations must be pure and sincere.</p>
            </div>
          </div>

          {/* RIGHT COLUMN: Chat screen area */}
          <div className="md:col-span-8 flex flex-col justify-between bg-white/25 h-full relative">
            {activeMatch ? (
              <>
                {/* Chat header info */}
                <div className="p-4 bg-white/40 backdrop-blur-md border-b border-white/15 flex justify-between items-center shadow-sm">
                  <div className="flex items-center space-x-3.5 text-left">
                    <img
                      src={activeMatch.avatarUrl}
                      alt={activeMatch.name}
                      className="w-10 h-10 rounded-full object-cover border border-white/30"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <h4 className="font-serif font-bold text-warm-charcoal text-sm">{activeMatch.name}</h4>
                        <span className="text-[9px] bg-[#40798C]/15 text-[#40798C] font-bold px-1.5 py-0.5 rounded-full">
                          Unlocked
                        </span>
                      </div>
                      <p className="text-[10px] text-[#6B635B] font-semibold leading-none">{activeMatch.profession} • {activeMatch.governorate} • <span className="capitalize">{activeMatch.religion === 'islam' ? `${activeMatch.sect || 'Sunni'} Muslim` : 'Non-Muslim'} ({activeMatch.ethnicity})</span></p>
                    </div>
                  </div>

                  {/* Share button with Elder wali */}
                  <button
                    onClick={handleExportTranscript}
                    className="p-2 sm:px-3.5 sm:py-2 rounded-xl border border-white/30 text-xs font-bold text-warm-charcoal bg-white/40 hover:bg-white/60 flex items-center gap-1.5 transition"
                  >
                    <DownloadCloud className="w-4 h-4 text-[#6B635B]" />
                    <span className="hidden sm:inline">Export to Wali (Guardian)</span>
                  </button>
                </div>

                {/* Sincere reminder bar */}
                <div className="bg-[#FF7F50]/10 py-2.5 px-4 text-[11px] text-accent-coral border-b border-[#FF7F50]/15 flex items-start space-x-2 text-left">
                  <AlertCircle className="w-4 h-4 text-accent-coral shrink-0 mt-0.5" />
                  <p>
                    <strong>Ground Rules:</strong> Keep conversational goals targeted at marriage validation. Use the guided prompts below to ask meaningful compatibility questions.
                  </p>
                </div>

                {/* Message logs view */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[350px] min-h-[300px]">
                  {activeConversation.messages.length === 0 ? (
                    <div className="text-center py-10 space-y-2">
                      <p className="text-[#6B635B] text-xs font-semibold">Start the conservation with a sincere question.</p>
                      <p className="text-[11px] text-[#C3BFB9] max-w-sm mx-auto">Use the quick Icebreaker Prompts below to get deep insights instantly.</p>
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
                                ? 'bg-gradient-to-br from-accent-coral to-accent-pink text-white rounded-br-none shadow-lg shadow-accent-coral/15 animate-slide-in'
                                : 'bg-white/70 backdrop-blur-sm border border-white/40 text-warm-charcoal rounded-bl-none shadow-sm text-left'
                            }`}
                          >
                            <p className="font-semibold">{m.text}</p>
                            <p className={`text-[8px] mt-1.5 font-mono text-right ${isUser ? 'text-white/85' : 'text-[#6B635B]'}`}>
                              {m.timestamp}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* GUIDED PROMPTS SUB-DRAWER */}
                <div className="bg-white/30 border-t border-white/10 p-4 space-y-2 text-left">
                  <p className="text-[9px] font-bold text-[#6B635B] uppercase tracking-wider flex items-center gap-1 font-mono">
                    <Sparkles className="w-3.5 h-3.5 text-accent-coral fill-accent-coral" />
                    VALUES & EXPECTATIONS ICEBREAKERS
                  </p>
                  
                  <div className="flex flex-nowrap md:flex-wrap overflow-x-auto gap-2 pb-1.5 scrollbar-none">
                    {MOCK_GUIDED_PROMPTS.map((prompt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendPrompt(prompt)}
                        className="bg-white/55 hover:bg-white/80 text-warm-charcoal border border-white/30 rounded-xl px-3.5 py-1.5 text-xs text-left font-medium shrink-0 max-w-[210px] md:max-w-none hover:border-accent-coral hover:text-accent-coral transition shadow-sm"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message input bar */}
                <form onSubmit={handleSendFreestyle} className="p-4 bg-white/40 backdrop-blur-md border-t border-white/15 flex space-x-3 items-center">
                  <input
                    type="text"
                    value={typedMessage}
                    onChange={(e) => setTypedMessage(e.target.value)}
                    placeholder="Type a respectful message..."
                    className="flex-1 bg-white/50 border border-white/20 rounded-xl px-4 py-3 text-xs sm:text-sm text-warm-charcoal focus:outline-none focus:ring-1 focus:ring-accent-coral"
                  />
                  <button
                    type="submit"
                    className="p-3.5 rounded-xl bg-accent-coral hover:opacity-90 text-white transition font-bold shadow-md shadow-accent-coral/20"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center p-10 text-[#6B635B] text-xs font-semibold">
                Select a mutual partner from the left Connections panel to begin conversation.
              </div>
            )}

            {/* Wali popups confirmation */}
            {showWaliPopup && (
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-warm-charcoal text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-2xl border border-white/15 flex items-center gap-1.5 animate-bounce z-45">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Transcript successfully exported to your elder!</span>
              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
}
