import React from 'react';

interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({ message = 'Loading compatibility profiles...' }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 space-y-4 w-full" id="loading-state">
      <div className="flex space-x-2">
        <div className="w-3 h-3 bg-accent-coral rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-3 h-3 bg-accent-pink rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-3 h-3 bg-[#40798C] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
      <p className="text-xs font-mono tracking-widest text-[#6B635B] font-bold uppercase shrink-0">
        {message}
      </p>
    </div>
  );
}
