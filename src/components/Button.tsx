import React from 'react';
import { useLanguage } from '../i18n/LanguageProvider';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'danger';
  isLoading?: boolean;
  children?: React.ReactNode;
  className?: string;
  id?: string;
}

export default function Button({ children, variant = 'primary', isLoading, className = '', id, ...props }: ButtonProps) {
  const { t } = useLanguage();
  const baseStyle = "px-6 py-3 rounded-2xl font-bold text-sm transition-all active:scale-95 duration-200 flex items-center justify-center space-x-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-warm-charcoal text-white hover:opacity-95 focus:ring-warm-charcoal shadow-md shadow-warm-charcoal/10",
    secondary: "bg-white/60 border border-white/40 text-warm-charcoal hover:bg-white/80 focus:ring-gray-300 shadow-sm",
    accent: "bg-gradient-to-br from-accent-coral to-accent-pink text-white hover:opacity-90 focus:ring-accent-coral shadow-lg shadow-accent-coral/20",
    danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 shadow-md shadow-red-500/10"
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${isLoading ? 'opacity-70 pointer-events-none' : ''} ${className}`}
      disabled={isLoading}
      id={id || "ui-button"}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>{t.loading}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
