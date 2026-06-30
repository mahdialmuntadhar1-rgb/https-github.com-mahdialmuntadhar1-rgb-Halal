import React, { useState, useEffect } from 'react';
import { AppLanguage } from '../types';
import { Download, Share2, PlusSquare, X, Monitor, Smartphone } from 'lucide-react';

interface FloatingInstallButtonProps {
  locale: AppLanguage;
}

export default function FloatingInstallButton({ locale }: FloatingInstallButtonProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const [showGuide, setShowGuide] = useState<boolean>(false);
  const [guideTab, setGuideTab] = useState<'ios' | 'android' | 'desktop'>('android');
  const [isMinimized, setIsMinimized] = useState<boolean>(() => {
    return sessionStorage.getItem('pwa-install-minimized') === 'true';
  });

  useEffect(() => {
    // Check if already running in standalone mode (installed)
    const checkStandalone = () => {
      const isStandaloneMedia = window.matchMedia('(display-mode: standalone)').matches;
      const isIOSStandalone = (window.navigator as any).standalone === true;
      setIsStandalone(isStandaloneMedia || isIOSStandalone);
    };

    // Detect if device is iOS (iPhone/iPad)
    const detectIOS = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isApple = /iphone|ipad|ipod/.test(userAgent) || (userAgent.includes('mac') && hasTouch);
      setIsIOS(isApple);
      if (isApple) {
        setGuideTab('ios');
      } else if (!hasTouch) {
        setGuideTab('desktop');
      } else {
        setGuideTab('android');
      }
    };

    checkStandalone();
    detectIOS();

    // Listen for the PWA install prompt
    const handleBeforeInstallPrompt = (e: any) => {
      // Prevent Chrome from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Also listen to appinstalled event
    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsStandalone(true);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        // Show the native install prompt if available
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          console.log('User accepted the install prompt');
          setIsStandalone(true);
        }
        setDeferredPrompt(null);
      } catch (err) {
        console.error('Error triggering PWA prompt:', err);
        setShowGuide(true);
      }
    } else {
      // Show the manual install guide with relevant tab selected
      setShowGuide(true);
    }
  };

  const handleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMinimized(true);
    sessionStorage.setItem('pwa-install-minimized', 'true');
  };

  // Do not render anything if already installed
  if (isStandalone) return null;

  // Translation helpers
  const txt = (en: string, ar: string, ckb: string) => {
    return locale === 'en' ? en : locale === 'ckb' ? ckb : ar;
  };

  const buttonText = txt('Install', 'تثبيت', 'دابەزاندن');

  return (
    <>
      {/* FLOATING INSTALL BUTTON - FIXED LEFT MIDDLE */}
      <div 
        className="fixed left-2 sm:left-4 top-1/2 -translate-y-1/2 z-[9999] pointer-events-auto flex items-center gap-1.5"
        id="pwa-floating-install-container"
      >
        {isMinimized ? (
          <button
            onClick={handleInstallClick}
            className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-emerald-600 to-[#40798C] text-white hover:opacity-95 rounded-full shadow-lg shadow-[#40798C]/30 border border-emerald-400/40 transition-all active:scale-95 cursor-pointer relative group"
            title={buttonText}
            aria-label="Install App"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            {/* Tooltip on hover */}
            <span className="absolute left-12 scale-0 group-hover:scale-100 transition-all duration-150 bg-stone-900/90 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg whitespace-nowrap shadow-md">
              {buttonText}
            </span>
          </button>
        ) : (
          <div className="flex items-center bg-gradient-to-r from-emerald-600 to-[#40798C] p-0.5 rounded-full shadow-lg shadow-[#40798C]/30 border border-emerald-400/40">
            <button
              onClick={handleInstallClick}
              className="flex items-center gap-1.5 text-white hover:opacity-95 px-3 py-2 rounded-full transition-all active:scale-95 pointer-events-auto cursor-pointer"
              aria-label="Install App"
            >
              <div className="bg-white/20 p-1 rounded-full text-white shrink-0">
                <Download className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
              <span className="text-[11px] font-extrabold tracking-wide px-0.5">
                {buttonText}
              </span>
            </button>
            {/* Minimal close button to collapse it */}
            <button
              onClick={handleMinimize}
              className="p-1 hover:bg-white/15 text-white/80 hover:text-white rounded-full transition duration-150 mr-1 ml-0.5 rtl:ml-1 rtl:mr-0.5 cursor-pointer"
              title={txt('Minimize', 'تصغير', 'بچوکردنەوە')}
            >
              <X className="w-3 h-3 stroke-[2.5]" />
            </button>
          </div>
        )}
      </div>

      {/* DETAILED PWA INSTALLATION GUIDE MODAL */}
      {showGuide && (
        <div 
          className="fixed inset-0 bg-warm-charcoal/80 backdrop-blur-md z-[10000] flex items-center justify-center p-4 animate-fadeIn"
          id="pwa-install-guide-modal"
        >
          <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-md w-full relative border border-stone-200 shadow-2xl text-start">
            <button 
              onClick={() => setShowGuide(false)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-600 rounded-full hover:bg-stone-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-3 mb-5">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-[#40798C] rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-[#40798C]/20">
                <Download className="w-6 h-6 text-white" />
              </div>

              <h3 className="text-lg sm:text-xl font-serif font-black text-warm-charcoal">
                {txt('Download Zawaj Al Araqi App', 'تنزيل تطبيق الزواج العراقي', 'دابەزاندنی ئەپی زەواج')}
              </h3>
              
              <p className="text-xs text-[#6B635B] font-medium leading-relaxed">
                {txt(
                  'Add our safe and secure Shari\'a marriage platform directly to your home screen for high speed, offline compatibility, and instant match alerts.',
                  'أضف منصة زواج الشرعية والآمنة مباشرة إلى شاشتك الرئيسية للوصول السريع والتوافق في وضع عدم الاتصال وتنبيهات القبول الفورية.',
                  'ئەم سەکۆ شەرعی و پارێزراوەی هاوسەرگیرییە ڕاستەوخۆ بخەرە سەر شاشەی مۆبایلەکەت بۆ خێرایی زیاتر و ئاگادارکردنەوەی هاوتاییەکان.'
                )}
              </p>
            </div>

            {/* Platform Selection Tabs */}
            <div className="flex bg-stone-100 p-1 rounded-xl mb-4 gap-1">
              <button
                onClick={() => setGuideTab('android')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-1 text-xs font-bold rounded-lg transition-all ${
                  guideTab === 'android' ? 'bg-white text-emerald-800 shadow-sm' : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>{txt('Android', 'أندرويد', 'ئەندرۆید')}</span>
              </button>
              <button
                onClick={() => setGuideTab('ios')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-1 text-xs font-bold rounded-lg transition-all ${
                  guideTab === 'ios' ? 'bg-white text-emerald-800 shadow-sm' : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <span className="text-[14px] leading-none"></span>
                <span>{txt('iOS', 'آيفون', 'ئایفۆن')}</span>
              </button>
              <button
                onClick={() => setGuideTab('desktop')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-1 text-xs font-bold rounded-lg transition-all ${
                  guideTab === 'desktop' ? 'bg-white text-emerald-800 shadow-sm' : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>{txt('Desktop', 'كمبيوتر', 'کۆمپیوتەر')}</span>
              </button>
            </div>

            {/* TAB CONTENT: ANDROID */}
            {guideTab === 'android' && (
              <div className="space-y-3.5 bg-stone-50 p-4 rounded-2xl border border-stone-200/50">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-emerald-500/10 text-emerald-700 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    1
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-warm-charcoal">
                      {txt('Open Chrome Menu', 'افتح قائمة الكروم', 'مینیوی Chrome بکەرەوە')}
                    </p>
                    <p className="text-[11px] text-[#6B635B]">
                      {txt('Tap the three dots (⋮) in the top-right or bottom-right corner.', 'اضغط على النقاط الثلاث (⋮) في زاوية المتصفح.', 'سێ خاڵەکە (⋮) لە گۆشەی سەرەوە یان خوارەوەی وێبگەڕەکەت دابگرە.')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-emerald-500/10 text-emerald-700 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    2
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-warm-charcoal">
                      {txt('Tap "Install App" or "Add to Home Screen"', 'اضغط على "تثبيت التطبيق" أو "الإضافة للشاشة"', 'دابگرە "Install app" یان "Add to Home screen"')}
                    </p>
                    <p className="text-[11px] text-[#6B635B]">
                      {txt('Confirm the dialog prompt to complete the installation.', 'أكد عملية التثبيت لإضافة التطبيق لشاشتك فورًا.', 'پشتڕاستی بکەرەوە بۆ تەواوکردنی دابەزاندنەکە.')}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: IOS */}
            {guideTab === 'ios' && (
              <div className="space-y-3.5 bg-stone-50 p-4 rounded-2xl border border-stone-200/50">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-emerald-500/10 text-emerald-700 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    1
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-warm-charcoal flex items-center gap-1.5">
                      {txt('Tap the Share button', 'اضغط على زر المشاركة', 'دوگمەی هاوبەشکردن (Share) دابگرە')}
                      <Share2 className="w-3.5 h-3.5 text-blue-500 inline shrink-0" />
                    </p>
                    <p className="text-[11px] text-[#6B635B]">
                      {txt('Located at the bottom of your Safari browser.', 'الموجود في الشريط السفلي لمتصفح سفاري (Safari).', 'کە لە خوارەوەی وێبگەڕی Safari دایە.')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-emerald-500/10 text-emerald-700 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    2
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-warm-charcoal flex items-center gap-1.5">
                      {txt('Select "Add to Home Screen"', 'اختر "إضافة إلى الشاشة الرئيسية"', 'دیاری بکە "Add to Home Screen"')}
                      <PlusSquare className="w-3.5 h-3.5 text-stone-600 inline shrink-0" />
                    </p>
                    <p className="text-[11px] text-[#6B635B]">
                      {txt('Scroll down the menu to find and select this option.', 'قم بالتمرير لأسفل القائمة واختيار هذا الخيار التثبيتي.', 'بڕۆ خوارەوەی مینیوەکە بۆ دۆزینەوەی ئەم بژاردەیە.')}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: DESKTOP */}
            {guideTab === 'desktop' && (
              <div className="space-y-3.5 bg-stone-50 p-4 rounded-2xl border border-stone-200/50">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-emerald-500/10 text-emerald-700 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    1
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-warm-charcoal">
                      {txt('Look at the Address Bar', 'انظر إلى شريط العنوان', 'سەیری شریتی ناونیشان بکە')}
                    </p>
                    <p className="text-[11px] text-[#6B635B]">
                      {txt('Click the "Install" computer-icon (or circle plus) on the right side of your URL bar.', 'انقر على أيقونة شاشة الكمبيوتر (أو علامة زائد) في يمين شريط العنوان.', 'کلیک لەسەر ئایکۆنی کۆمپیوتەر یان پڵەس بکە لە لای ڕاستی ناونیشانی سەرەوە.')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-emerald-500/10 text-emerald-700 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    2
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-warm-charcoal">
                      {txt('Using Browser Menu', 'من خلال قائمة المتصفح', 'بەکارهێنانی مینیوی وێبگەڕ')}
                    </p>
                    <p className="text-[11px] text-[#6B635B]">
                      {txt('Alternatively, open browser menu (⋮), choose "Save and share", then click "Install page".', 'بدلاً من ذلك، افتح القائمة (⋮) واختر "حفظ ومشاركة" ثم انقر "تثبيت الصفحة".', 'یان مینیو بکەرەوە (⋮) و بڕۆ بەشی "Save and share" و "Install page" دیاری بکە.')}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowGuide(false)}
              className="mt-5 w-full bg-gradient-to-r from-emerald-600 to-[#40798C] hover:opacity-90 text-white font-bold text-xs py-3 rounded-xl transition shadow-md"
            >
              {txt('Got it, thanks', 'موافق، شكرًا لك', 'تێگەیشتم، سوپاس')}
            </button>
          </div>
        </div>
      )}
    </>
  );
}



