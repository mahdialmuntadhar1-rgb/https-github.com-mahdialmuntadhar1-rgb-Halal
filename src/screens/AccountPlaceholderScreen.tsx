import React, { useState } from 'react';
import { AppLanguage } from '../types';
import { 
  Shield, 
  CreditCard, 
  Key, 
  CheckCircle, 
  Smartphone, 
  Award, 
  AlertTriangle, 
  UserPlus, 
  Lock, 
  Mail, 
  FileCheck, 
  Smartphone as PhoneIcon,
  Sparkles,
  HelpCircle,
  Eye,
  Check
} from 'lucide-react';

interface AccountPlaceholderScreenProps {
  locale: AppLanguage;
  userName: string;
  triggerToast: (msg: string) => void;
}

export default function AccountPlaceholderScreen({
  locale,
  userName,
  triggerToast
}: AccountPlaceholderScreenProps) {
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');
  const [authMethod, setAuthMethod] = useState<'phone' | 'email'>('phone');
  
  // Form fields
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  
  // Verification states
  const [idSubmitted, setIdSubmitted] = useState<boolean>(false);
  const [civilVerified, setCivilVerified] = useState<boolean>(true); // For current demo profile
  const [smsVerified, setSmsVerified] = useState<boolean>(true);
  const [profileAudited, setProfileAudited] = useState<boolean>(false);
  
  // Premium state
  const [tier, setTier] = useState<'standard' | 'premium'>('standard');

  const handleDemoAuthClick = (e: React.FormEvent) => {
    e.preventDefault();
    const action = authTab === 'login' ? 'Login' : 'Registration';
    const method = authMethod === 'phone' ? 'Phone Verification' : 'Email Secure Route';
    
    // Clear warning about backend requirement
    triggerToast(
      locale === 'en' 
        ? `⚠️ Sandbox Demo: ${action} via ${method} simulated. Backend database connection is required for live accounts.` 
        : `⚠️ محاكاة تجريبية: تم إرسال طلب ${action === 'Login' ? 'تسجيل الدخول' : 'إنشاء الحساب'} عبر ${authMethod === 'phone' ? 'الهاتف' : 'البريد'}. الاتصال بقاعدة البيانات مطلوب للإنتاج.`
    );
  };

  const handleIdSubmitDemo = () => {
    setIdSubmitted(true);
    triggerToast(
      locale === 'en' 
        ? "📄 Demo: Identity files uploaded successfully. Profile analysis is pending." 
        : "📄 تجريبية: تم رفع مستندات الهوية بنجاح. المراجعة الحكومية معلقة لحين توفر قاعدة البيانات."
    );
  };

  const handleUpgrade = () => {
    setTier('premium');
    triggerToast(locale === 'en' ? '✨ Upgraded to Zawaj Al Araqi Premium successfully!' : '✨ تم الترقية إلى الحساب الممتاز بنجاح!');
  };

  const pledges = [
    {
      title: locale === 'en' ? 'Serious Intention Only' : 'نية الزواج الجادة فقط',
      desc: locale === 'en' ? 'Commitment to pure, marriage-focused communications only.' : 'الالتزام التام بالحديث الهادف للخطوبة الشرعية والزواج فقط.',
    },
    {
      title: locale === 'en' ? 'Truthful Profile Dossier' : 'الصدق في البيانات الشخصية',
      desc: locale === 'en' ? 'Assure all age, background, and marital state details are completely honest.' : 'التعهد بصحة كافة البيانات المدخلة؛ مثل العمر، الحالة الاجتماعية، والسكن.',
    },
    {
      title: locale === 'en' ? 'Dignified & Safe Conduct' : 'الاحترام والوقار في التعامل',
      desc: locale === 'en' ? 'Respectful conduct with zero offensive or casual hookup behavior.' : 'اتباع السلوك الراقي في الغرفة الخاصة وتجنب أي محادثة عابرة أو مبتذلة.',
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 text-left animate-fade-in" id="account-placeholder-screen">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-warm-charcoal font-serif tracking-tight flex items-center gap-2">
            <Shield className="w-8 h-8 text-[#40798C]" />
            <span>{locale === 'en' ? 'Account & Security Center' : 'إدارة الحساب وموثوقية الهوية'}</span>
          </h2>
          <p className="text-[#6B635B] text-xs sm:text-sm font-medium mt-1">
            {locale === 'en'
              ? 'Preview login authentication portals, legal verification badge tracking, and premium plan limits.'
              : 'استعرض بوابات تسجيل الدخول التجريبية، تتبع شارات التدقيق القانوني، وحدود الباقة الممتازة.'}
          </p>
        </div>

        {/* Global Backend Disclaimer Badge */}
        <div className="bg-amber-50 border border-amber-200 text-amber-800 text-[10px] sm:text-xs font-mono font-bold px-4 py-2 rounded-2xl flex items-center gap-2 shadow-sm shrink-0">
          <AlertTriangle className="w-4.5 h-4.5 text-accent-coral animate-pulse" />
          <span>{locale === 'en' ? 'NOTICE: Backend connection required for live auth' : 'ملاحظة: الاتصال بخادم قاعدة البيانات مطلوب للحسابات الحية'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN (7 Cols): Mock Sign-In & Verification Placeholders */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* MODULE 1: AUTHENTICATION PLACEHOLDER PORTAL */}
          <div className="bg-white/40 backdrop-blur-xl border border-white/55 p-6 sm:p-8 rounded-[2rem] shadow-xl space-y-6">
            <div className="flex justify-between items-center pb-2 border-b border-stone-200/50">
              <h3 className="font-serif font-black text-warm-charcoal text-base flex items-center gap-2">
                <Lock className="w-4.5 h-4.5 text-[#40798C]" />
                <span>{locale === 'en' ? 'Secure Authentication Sandbox' : 'بوابة تسجيل الدخول التجريبية'}</span>
              </h3>
              <span className="text-[9px] bg-amber-500/10 text-amber-600 font-mono font-bold px-2 py-0.5 rounded border border-amber-200">
                Mock Portal
              </span>
            </div>

            {/* Login vs Register Toggles */}
            <div className="grid grid-cols-2 gap-1.5 bg-stone-100 p-1 rounded-xl">
              <button
                onClick={() => setAuthTab('login')}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  authTab === 'login'
                    ? 'bg-white text-warm-charcoal shadow-sm'
                    : 'text-[#6B635B] hover:text-warm-charcoal'
                }`}
              >
                🔑 {locale === 'en' ? 'Sign In / Account Access' : 'تسجيل الدخول'}
              </button>
              <button
                onClick={() => setAuthTab('register')}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  authTab === 'register'
                    ? 'bg-white text-warm-charcoal shadow-sm'
                    : 'text-[#6B635B] hover:text-warm-charcoal'
                }`}
              >
                👤 {locale === 'en' ? 'Register Courtship Identity' : 'إنشاء حساب جديد'}
              </button>
            </div>

            <form onSubmit={handleDemoAuthClick} className="space-y-4">
              
              {/* Method toggles */}
              <div className="flex gap-4">
                <label className="flex items-center gap-1.5 text-xs font-bold text-warm-charcoal cursor-pointer">
                  <input
                    type="radio"
                    name="authMethod"
                    checked={authMethod === 'phone'}
                    onChange={() => setAuthMethod('phone')}
                    className="accent-accent-coral"
                  />
                  <span>📞 {locale === 'en' ? 'Iraqi Mobile Number' : 'رقم الهاتف العراقي'}</span>
                </label>
                <label className="flex items-center gap-1.5 text-xs font-bold text-warm-charcoal cursor-pointer">
                  <input
                    type="radio"
                    name="authMethod"
                    checked={authMethod === 'email'}
                    onChange={() => setAuthMethod('email')}
                    className="accent-accent-coral"
                  />
                  <span>✉️ {locale === 'en' ? 'Secured Email Address' : 'البريد الإلكتروني الآمن'}</span>
                </label>
              </div>

              {/* Form Input fields */}
              {authMethod === 'phone' ? (
                <div className="space-y-1 text-left">
                  <label className="block text-[10px] font-mono font-bold text-[#6B635B] uppercase tracking-wide">
                    {locale === 'en' ? 'Iraqi Mobile (+964 Zain/Asiacell)' : 'رقم الهاتف (كورك / زين / آسيا سيل)'}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-stone-400 font-mono font-bold">
                      +964
                    </span>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="770 000 0000"
                      className="w-full bg-white border border-stone-200 rounded-xl pl-16 pr-4 py-3 text-xs sm:text-sm text-warm-charcoal font-semibold focus:outline-none focus:ring-1 focus:ring-[#40798C] placeholder-stone-300"
                    />
                  </div>
                  <p className="text-[10px] text-[#A2978C] font-semibold">
                    {locale === 'en' ? 'We will simulate sending a 6-digit verification code.' : 'سنقوم بمحاكاة إرسال رمز تأكيد هاتف مؤلف من 6 أرقام.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-1 text-left">
                  <label className="block text-[10px] font-mono font-bold text-[#6B635B] uppercase tracking-wide">
                    {locale === 'en' ? 'Secure Email Address' : 'البريد الإلكتروني الموثق'}
                  </label>
                  <input
                    type="email"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-warm-charcoal font-semibold focus:outline-none focus:ring-1 focus:ring-[#40798C] placeholder-stone-300"
                  />
                </div>
              )}

              {/* Secure Password input */}
              <div className="space-y-1 text-left">
                <label className="block text-[10px] font-mono font-bold text-[#6B635B] uppercase tracking-wide">
                  {locale === 'en' ? 'Passphrase / PIN Code' : 'كلمة المرور / الرمز السري الآمن'}
                </label>
                <input
                  type="password"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-warm-charcoal font-semibold focus:outline-none focus:ring-1 focus:ring-[#40798C] placeholder-stone-300"
                />
              </div>

              {/* Submit CTA button */}
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-br from-[#40798C] to-[#2E5968] text-white font-bold text-xs sm:text-sm rounded-xl hover:opacity-95 transition-all shadow-md flex items-center justify-center gap-1.5"
              >
                <span>{authTab === 'login' ? (locale === 'en' ? 'Login Secure Sandbox' : 'تسجيل دخول تجريبي مسموح') : (locale === 'en' ? 'Create Demo Identity' : 'إنشاء الهوية التجريبية')}</span>
              </button>
            </form>
          </div>

          {/* MODULE 2: VERIFICATION SYSTEM PLACEHOLDERS */}
          <div className="bg-white/40 backdrop-blur-xl border border-white/55 p-6 sm:p-8 rounded-[2rem] shadow-xl space-y-6">
            <div className="space-y-1">
              <h3 className="font-serif font-black text-warm-charcoal text-base flex items-center gap-2">
                <Award className="w-5 h-5 text-accent-coral" />
                <span>{locale === 'en' ? 'ID & Civic Registry Verification hub' : 'تراخيص التحقق وشارات الموثوقية'}</span>
              </h3>
              <p className="text-xs text-[#6B635B] font-semibold leading-relaxed">
                {locale === 'en'
                  ? 'We verify identities to guarantee real intent. See active security stages scheduled for future product releases.'
                  : 'نقوم بالتحقق للمحافظة على المودة الجادة والوقار الطاهر في الخدمة. استعرض مستويات الأمان القادمة:'}
              </p>
            </div>

            {/* Clear Warning About Real Verification */}
            <div className="p-3 bg-stone-50 border border-stone-200 rounded-2xl text-[11px] text-stone-600 font-semibold leading-relaxed">
              <strong>🔒 Demo Notice: </strong>
              {locale === 'en'
                ? "This interface demonstrates verification architecture. No actual personal civil status information or government ID databases are accessed or stored. We do not claim users are verified for real."
                : "هذه الواجهة تستعرض نظام الموثوقية فقط لتقييم تجربة الاستخدام. لا يتم تخزين أو مشاركة أي وثائق مدنية حقيقية مع جهة حكومية فعلياً."}
            </div>

            <div className="space-y-4 pt-1">
              
              {/* Iraq Civil Status Verification Card Details */}
              <div className="p-4 rounded-2xl bg-white/60 border border-white/40 flex justify-between items-start sm:items-center flex-col sm:flex-row gap-3">
                <div className="flex items-start gap-3 text-left">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${civilVerified ? 'bg-emerald-50 text-emerald-600' : 'bg-stone-100 text-stone-400'}`}>
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-warm-charcoal">
                      {locale === 'en' ? 'Ministry of Interior ID Validation' : 'تدقيق البطاقة الوطنية الموحدة'}
                    </h4>
                    <p className="text-[10px] text-[#6B635B] leading-relaxed font-semibold mt-0.5">
                      {locale === 'en' 
                        ? 'Checks names & age against civic registers for complete safety.' 
                        : 'مقارنة البيانات المدخلة مع السجلات المدنية للتأكد من الموثوقية بالكامل.'}
                    </p>
                    <span className="text-[9px] text-[#A2978C] font-mono mt-1 block">Status: Coming soon to live production</span>
                  </div>
                </div>

                <span className="text-[9px] bg-amber-500/10 text-amber-600 border border-amber-200 font-extrabold px-3 py-1 rounded-full uppercase shrink-0 font-mono">
                  Simulated
                </span>
              </div>

              {/* Iraqi Mobile Phone Verification Card Details */}
              <div className="p-4 rounded-2xl bg-white/60 border border-white/40 flex justify-between items-start sm:items-center flex-col sm:flex-row gap-3">
                <div className="flex items-start gap-3 text-left">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${smsVerified ? 'bg-emerald-50 text-emerald-600' : 'bg-stone-100 text-stone-400'}`}>
                    <PhoneIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-warm-charcoal">
                      {locale === 'en' ? 'Linked SIM Card (+964 SMS Node)' : 'توثيق شريحة الاتصال العراقية (+964)'}
                    </h4>
                    <p className="text-[10px] text-[#6B635B] leading-relaxed font-semibold mt-0.5">
                      {locale === 'en' 
                        ? 'Requires valid cell validation for one-account per-citizen integrity.' 
                        : 'يتطلب تأكيداً هاتفياً حياً لمنع الحسابات الوهمية المتكررة.'}
                    </p>
                    <span className="text-[9px] text-[#A2978C] font-mono mt-1 block">Status: In-Review / Simulated</span>
                  </div>
                </div>

                <span className="text-[9px] bg-amber-500/10 text-amber-600 border border-amber-200 font-extrabold px-3 py-1 rounded-full uppercase shrink-0 font-mono">
                  Simulated
                </span>
              </div>

              {/* Live Profile Manual Audit Review (Agent Verification) */}
              <div className="p-4 rounded-2xl bg-white/60 border border-white/40 flex justify-between items-start sm:items-center flex-col sm:flex-row gap-3">
                <div className="flex items-start gap-3 text-left">
                  <div className="w-9 h-9 bg-accent-pink/15 text-accent-pink rounded-xl flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-warm-charcoal">
                      {locale === 'en' ? 'Serious Profile Manual Review' : 'المراجعة البشرية واليدوية للملفات'}
                    </h4>
                    <p className="text-[10px] text-[#6B635B] leading-relaxed font-semibold mt-0.5">
                      {locale === 'en' 
                        ? 'Live agents inspect texts, objectives, and pictures to ensure they meet marriage guidelines.' 
                        : 'يقوم موظفون حقيقيون بمراجعة الأهداف والعبارات للتأكد من ملاءمتها لقيم التعارف المحتشم.'}
                    </p>
                    <span className="text-[9px] text-[#A2978C] font-mono mt-1 block">Status: Coming soon / Pending live agents</span>
                  </div>
                </div>

                {idSubmitted ? (
                  <span className="text-[9px] bg-[#40798C]/15 text-[#40798C] border border-[#40798C]/20 font-extrabold px-3 py-1 rounded-full uppercase shrink-0">
                    Submitted
                  </span>
                ) : (
                  <button
                    onClick={handleIdSubmitDemo}
                    className="px-3 py-1.5 bg-accent-coral text-white font-bold text-[9px] rounded-lg shadow hover:opacity-90 transition shrink-0"
                  >
                    {locale === 'en' ? 'Submit Identity Details' : 'رفع إثبات تجريبي'}
                  </button>
                )}
              </div>

            </div>
          </div>

        </div>

        {/* RIGHT COLUMN (5 Cols): Subscription and Pledges */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Subscription Card */}
          <div className="bg-white/40 backdrop-blur-xl border border-white/55 p-6 sm:p-8 rounded-[2rem] shadow-xl space-y-4">
            <h3 className="font-serif font-black text-warm-charcoal text-base flex items-center gap-2">
              <CreditCard className="w-4.5 h-4.5 text-[#40798C]" />
              <span>{locale === 'en' ? 'Courtship Premium Subscriptions' : 'الاشتراكات وباقات العضوية'}</span>
            </h3>
            
            <div className="p-5 rounded-2xl bg-gradient-to-br from-warm-charcoal to-stone-800 text-white flex justify-between items-center shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl transform translate-x-1/2 -translate-y-1/2" />
              <div className="space-y-1.5 relative z-10 text-left">
                <p className="text-[9px] text-accent-pink uppercase tracking-widest font-mono font-black">
                  {locale === 'en' ? 'ACTIVE TIER LEVEL' : 'مستوى العضوية الحالي'}
                </p>
                <p className="text-lg font-black capitalize">
                  {tier === 'premium' ? '👑 Zawaj Al Araqi Premium' : '😊 Standard Member'}
                </p>
                <p className="text-[10px] text-gray-300 font-semibold leading-relaxed">
                  {tier === 'premium' 
                    ? 'Unlimited introduction requests with safe protection' 
                    : 'Limited to 2 proposals per day'}
                </p>
              </div>

              {tier === 'standard' && (
                <button
                  type="button"
                  onClick={handleUpgrade}
                  className="px-3 py-2 rounded-xl bg-gradient-to-br from-accent-coral to-accent-pink text-white font-extrabold text-[10px] uppercase shadow-md relative z-10 active:scale-95 transition"
                >
                  {locale === 'en' ? 'Upgrade' : 'ترقية'}
                </button>
              )}
            </div>
          </div>

          {/* Pledge Module */}
          <div className="bg-white/40 backdrop-blur-xl border border-white/55 p-6 sm:p-8 rounded-[2rem] shadow-xl space-y-4">
            <h4 className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#40798C] flex items-center gap-2 pb-2 border-b border-stone-200/50">
              <Shield className="w-4.5 h-4.5 text-[#40798C]" />
              <span>{locale === 'en' ? 'Ethical Pledges & Guardrails' : 'ميثاق الشرف الأخلاقي ومسؤولية البناء'}</span>
            </h4>
            
            <div className="space-y-4">
              {pledges.map((p, idx) => (
                <div key={idx} className="space-y-1 text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-[#40798C] rounded-full shrink-0 animate-ping" />
                    <p className="font-bold text-warm-charcoal text-xs">{p.title}</p>
                  </div>
                  <p className="text-[#6B635B] text-[11px] leading-relaxed pl-3 rtl:pl-0 rtl:pr-3 font-semibold">
                    {p.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

