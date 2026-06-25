import React, { useState } from 'react';
import { Heart, Lock, Mail, ShieldCheck } from 'lucide-react';
import { AppLanguage, SessionUser } from '../types';
import { TRANSLATIONS } from '../lib/translations';

interface AuthScreenProps {
  locale: AppLanguage;
  onLogin: (email: string, password: string) => Promise<SessionUser>;
  onRegister: (email: string, password: string) => Promise<SessionUser>;
}

export default function AuthScreen({ locale, onLogin, onRegister }: AuthScreenProps) {
  const t = TRANSLATIONS[locale] || TRANSLATIONS.ar;
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!email.includes('@')) {
      setError(t.invalidEmail || 'Invalid email');
      return;
    }

    if (password.length < 10) {
      setError('Password must be at least 10 characters.');
      return;
    }

    if (mode === 'register' && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (mode === 'register') {
        await onRegister(email.trim(), password);
      } else {
        await onLogin(email.trim(), password);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : mode === 'register' ? t.registrationFailed : t.loginFailed);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div dir={t.dir} lang={locale} className="bg-warm-ivory min-h-screen text-warm-charcoal flex items-center justify-center px-4 py-10">
      <main className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 items-center">
        <section className="text-start space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/70 border border-white px-3 py-2 text-xs font-black text-accent-coral">
            <Heart className="w-4 h-4 fill-accent-coral/20" />
            {t.marriageOnly}
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl font-serif font-black tracking-tight text-warm-charcoal">
              {t.brand}
            </h1>
            <p className="text-base sm:text-lg text-[#6B635B] max-w-xl font-semibold leading-relaxed">
              Serious marriage introductions with private profiles, mutual requests, and respectful guided chat.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl">
            {[
              'JWT-backed sessions',
              'Private photo controls',
              'Mutual request chat',
            ].map((item) => (
              <div key={item} className="rounded-2xl bg-white/65 border border-white/80 p-4 text-xs font-bold text-[#6B635B]">
                <ShieldCheck className="w-4 h-4 text-[#40798C] mb-2" />
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[1.5rem] bg-white/80 border border-white/90 shadow-xl shadow-stone-200/40 p-5 sm:p-6 text-start">
          <div className="flex rounded-xl bg-stone-100 p-1 mb-6">
            {(['login', 'register'] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setMode(item);
                  setError(null);
                }}
                className={`flex-1 rounded-lg py-2 text-xs font-black ${
                  mode === item ? 'bg-white text-warm-charcoal shadow-sm' : 'text-[#6B635B]'
                }`}
              >
                {item === 'login' ? t.login : t.register}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="space-y-4">
            <label className="block space-y-1.5">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#6B635B]">{t.email}</span>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B635B]" />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="input-basic ps-10"
                  placeholder="name@example.com"
                  autoComplete="email"
                  required
                />
              </div>
            </label>

            <label className="block space-y-1.5">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#6B635B]">{t.password}</span>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B635B]" />
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="input-basic ps-10"
                  placeholder="At least 10 characters"
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  required
                />
              </div>
            </label>

            {mode === 'register' && (
              <label className="block space-y-1.5">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#6B635B]">{t.confirmPassword}</span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="input-basic"
                  autoComplete="new-password"
                  required
                />
              </label>
            )}

            {error && (
              <div className="rounded-xl border border-red-100 bg-red-50 text-red-700 p-3 text-xs font-bold">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-warm-charcoal text-white px-5 py-3 text-sm font-black disabled:opacity-60"
            >
              {isSubmitting ? t.loading : mode === 'login' ? t.login : t.createAccount}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
