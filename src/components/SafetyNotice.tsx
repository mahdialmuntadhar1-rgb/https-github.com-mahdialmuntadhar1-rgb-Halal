import React from 'react';
import { ShieldAlert, Info, Heart } from 'lucide-react';

interface SafetyNoticeProps {
  type?: 'info' | 'warning' | 'pledge';
  message: string;
}

export default function SafetyNotice({ type = 'info', message }: SafetyNoticeProps) {
  const isPledge = type === 'pledge';
  const isWarning = type === 'warning';

  return (
    <div 
      className={`p-4 rounded-2xl flex items-start space-x-3 text-start border transition ${
        isPledge 
          ? 'bg-gradient-to-r from-emerald-500/10 to-emerald-600/5 border-emerald-500/20 text-[#2E7D32]' 
          : isWarning
            ? 'bg-accent-coral/10 border-accent-coral/20 text-accent-coral'
            : 'bg-[#40798C]/10 border-[#40798C]/20 text-[#40798C]'
      }`}
      id="safety-notice"
    >
      <div className="shrink-0 mt-0.5">
        {isPledge ? (
          <Heart className="w-5 h-5 text-[#2E7D32]" />
        ) : isWarning ? (
          <ShieldAlert className="w-5 h-5 text-accent-coral" />
        ) : (
          <Info className="w-5 h-5 text-[#40798C]" />
        )}
      </div>
      <div className="space-y-1">
        <p className="text-xs font-bold uppercase tracking-wider font-mono">
          {isPledge ? 'Marriage Dignity Assurance' : isWarning ? 'Strict Safety Notice' : 'Respect Standard Info'}
        </p>
        <p className="text-xs font-medium leading-relaxed opacity-95">
          {message}
        </p>
      </div>
    </div>
  );
}

