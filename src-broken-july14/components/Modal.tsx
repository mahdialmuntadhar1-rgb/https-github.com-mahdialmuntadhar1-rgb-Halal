import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-warm-charcoal/40 backdrop-blur-md animate-fade-in" id="ui-modal">
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="w-full max-w-xl bg-warm-ivory border border-white/60 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl relative z-10 space-y-6 max-h-[85vh] overflow-y-auto text-start animate-scale-up">
        {/* Header bar */}
        <div className="flex justify-between items-center border-b border-white/10 pb-4">
          <h3 className="text-xl font-serif font-black text-warm-charcoal font-display">{title}</h3>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/60 hover:bg-white border border-white/40 text-[#6B635B] hover:text-warm-charcoal transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content body */}
        <div className="space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
}
