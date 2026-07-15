import React from 'react';
import { Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';

interface PrivacyBadgeProps {
  status: 'visible' | 'blurred' | 'hidden' | 'unlocked';
}

export default function PrivacyBadge({ status }: PrivacyBadgeProps) {
  return (
    <div className="inline-flex" id="privacy-badge">
      {status === 'visible' && (
        <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 uppercase tracking-wider">
          <Eye className="w-3.5 h-3.5" />
          <span>Visible Photo</span>
        </span>
      )}
      {status === 'blurred' && (
        <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#9333EA]/15 text-accent-coral border border-accent-coral/20 uppercase tracking-wider">
          <Lock className="w-3.5 h-3.5 animate-pulse" />
          <span>Blurred (Unlocked on Match)</span>
        </span>
      )}
      {status === 'hidden' && (
        <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-gray-500/10 text-gray-600 border border-gray-500/20 uppercase tracking-wider">
          <EyeOff className="w-3.5 h-3.5" />
          <span>Hidden by default</span>
        </span>
      )}
      {status === 'unlocked' && (
        <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600 border border-blue-500/20 uppercase tracking-wider animate-bounce">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Mutual Contact Unlocked</span>
        </span>
      )}
    </div>
  );
}
