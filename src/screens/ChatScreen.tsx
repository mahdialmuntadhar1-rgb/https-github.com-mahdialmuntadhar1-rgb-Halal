import React from 'react';
import { AppLanguage, MatchProfile, Conversation } from '../types';
import ChatSimulator from '../components/ChatSimulator';

interface ChatScreenProps {
  locale: AppLanguage;
  acceptedMatches: MatchProfile[];
  conversations: Conversation[];
  onSendMessage: (matchId: string, text: string) => void;
  activeMatchId: string | null;
  setActiveMatchId: (id: string | null) => void;
}

export default function ChatScreen({
  locale,
  acceptedMatches,
  conversations,
  onSendMessage,
  activeMatchId,
  setActiveMatchId
}: ChatScreenProps) {
  return (
    <div className="py-4 animate-fade-in" id="chat-screen">
      <ChatSimulator
        locale={locale}
        acceptedMatches={acceptedMatches}
        conversations={conversations}
        onSendMessage={onSendMessage}
        activeMatchId={activeMatchId}
        setActiveMatchId={setActiveMatchId}
      />
    </div>
  );
}
