import React, { useEffect, useMemo, useState } from 'react';
import { Download, X, Copy } from 'lucide-react';

interface FloatingInstallButtonProps {
  locale: 'en' | 'ar' | 'ckb';
}

export default function FloatingInstallButton({ locale }: FloatingInstallButtonProps) {
  const [minimized, setMinimized] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const txt = (en: string, ar: string, ckb: string) =>
    locale === 'ar' ? ar : locale === 'ckb' ? ckb : en;

  const appUrl = 'https://zawaj.kaniq.org';

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(appUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      const temp = document.createElement('input');
      temp.value = appUrl;
      document.body.appendChild(temp);
      temp.select();
      document.execCommand('copy');
      document.body.removeChild(temp);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  useEffect(() => {
    setMinimized(sessionStorage.getItem('pwa-install-minimized') === 'true');
  }, []);

    const handleInstallClick = async () => {
    await copyLink();
    setGuideOpen(true);
  };

  const handleMinimize = () => {
    sessionStorage.setItem('pwa-install-minimized', 'true');
    setMinimized(true);
    setGuideOpen(false);
  };

  const title = txt(
    'Install HALAL App',
    'تثبيت تطبيق حلال',
    'دابەزاندنی ئەپی حەڵاڵ'
  );

    const step1 = txt(
    '1. The link is copied automatically. You can also tap the link box to copy again.',
    '١. يتم نسخ الرابط تلقائياً. يمكنك أيضاً الضغط على مربع الرابط لنسخه مرة أخرى.',
    '١. لینکەکە خۆکارانە کۆپی دەکرێت. دەتوانیت جارێکی تر سندووقی لینکەکە دابگریت.'
  );

  const step2 = txt(
    '2. Paste it in Google Chrome on Android or Safari on iPhone.',
    '٢. الصقه في Google Chrome على أندرويد أو Safari على الآيفون.',
    '٢. لە Google Chrome لە ئەندرۆید یان Safari لە ئایفۆن دایبنێ.'
  );

  const step3 = txt(
    '3. Open browser menu, then tap Install App or Add to Home Screen.',
    '٣. افتح قائمة المتصفح، ثم اضغط تثبيت التطبيق أو إضافة إلى الشاشة الرئيسية.',
    '٣. مینیوی وێبگەڕ بکەرەوە، پاشان Install App یان Add to Home Screen دابگرە.'
  );

  if (minimized) return null;

  return (
    <>
      <div
        id="pwa-floating-install-container"
        className="fixed left-2 top-1/2 -translate-y-1/2 z-30 flex flex-col items-start gap-2 pointer-events-auto"
      >
        <button
          type="button"
          onClick={handleInstallClick}
          className="flex items-center gap-2 rounded-r-2xl bg-warm-charcoal/95 text-white shadow-xl border border-white/15 px-3 py-2 text-xs sm:text-sm font-bold hover:scale-105 active:scale-95 transition-transform"
          aria-label="Install App"
        >
          <Download className="w-4 h-4" />
          <span>{txt('Install', 'تثبيت', 'دابەزاندن')}</span>
        </button>

        <button
          type="button"
          onClick={handleMinimize}
          className="rounded-r-xl bg-black/60 text-white px-2 py-1 text-[10px] hover:bg-black/80"
          aria-label="Hide install button"
        >
          <X className="w-3 h-3" />
        </button>
      </div>

      {guideOpen && (
        <div className="fixed inset-x-3 bottom-4 z-50 max-w-md mx-auto rounded-2xl bg-white text-warm-charcoal shadow-2xl border border-black/10 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <h3 className="font-black text-sm mb-2">{title}</h3>

                            <button
                type="button"
                onClick={copyLink}
                className="w-full rounded-xl bg-black/5 border border-black/10 p-3 mb-3 text-sm font-black break-all text-left"
              >
                {appUrl}
              </button>

              <ol className="space-y-2 text-xs leading-relaxed opacity-85">
                <li>{step1}</li>
                <li>{step2}</li>
                <li>{step3}</li>
              </ol>
            </div>

            <button
              type="button"
              onClick={() => setGuideOpen(false)}
              className="shrink-0 rounded-full bg-black/5 hover:bg-black/10 p-1"
              aria-label="Close install guide"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={copyLink}
            className="mt-4 w-full rounded-xl bg-warm-charcoal text-white py-2 text-xs font-black flex items-center justify-center gap-2"
          >
            <Copy className="w-4 h-4" />
            {copied
              ? txt('Copied', 'تم النسخ', 'کۆپی کرا')
              : txt('Copy Link', 'نسخ الرابط', 'کۆپی کردنی لینک')}
          </button>
        </div>
      )}
    </>
  );
}

