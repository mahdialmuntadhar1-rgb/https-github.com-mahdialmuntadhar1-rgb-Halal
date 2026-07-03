import React from 'react';
import { Search, Compass } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export default function EmptyState({ title, description, actionText, onAction }: EmptyStateProps) {
  return (
    <div className="bg-white/40 backdrop-blur-xl border border-white/30 rounded-[2.5rem] p-10 text-center space-y-6 shadow-2xl relative z-10 w-full max-w-lg mx-auto py-16" id="empty-state">
      <div className="w-16 h-16 bg-[#40798C]/10 rounded-2xl flex items-center justify-center mx-auto text-[#40798C] shadow-inner animate-pulse">
        <Compass className="w-8 h-8" />
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-serif font-black text-warm-charcoal font-display">{title}</h3>
        <p className="text-[#6B635B] text-sm leading-relaxed max-w-sm mx-auto font-medium">
          {description}
        </p>
      </div>
      
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-6 py-2.5 rounded-xl bg-accent-coral text-white font-bold text-xs hover:opacity-90 active:scale-95 transition"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
















