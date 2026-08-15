import React from 'react';
import { AppLanguage } from '../types';
import { 
  ShieldCheck, 
  Lock, 
  AlertTriangle, 
  Users, 
  MessageCircle, 
  Camera, 
  X, 
  Check, 
  HelpCircle,
  Shield,
  UserCheck,
  Flag,
  Activity
} from 'lucide-react';

interface TrustPrivacyScreenProps {
  locale: AppLanguage;
  onBackToOverview: () => void;
}

export default function TrustPrivacyScreen({ locale, onBackToOverview }: TrustPrivacyScreenProps) {
  const isAr = locale === 'ar';
  const isCkb = locale === 'ckb';
  const isEn = locale === 'en';

  const t = {
    title: isAr 
      ? 'مركز الأمان والموثوقية العائلية' 
      : isCkb 
        ? 'سەنتەری متمانە و پارێزبەندی خێزانی' 
        : 'Trust, Safety & Privacy Center',
    sub: isAr
      ? 'معايير واضحة وصادقة بنيت خصيصاً لحماية كرامتكم وسلامة تواصلكم تماشياً مع عادات المجتمع العراقي الكريم.'
      : isCkb
        ? 'پێوەرە ڕوون و ڕاستگۆکان کە تایبەت دروستکراون بۆ پاراستنی کەرامەت و بەهاکانی هاوسەرگیری.'
        : 'Transparent guidelines built to protect your coordination dignity, aligned with community values and absolute honesty.',
    badge: isAr ? 'تصميم يحفظ الخصوصية' : isCkb ? 'بۆ پاراستنی نهێنی دروستکراوە' : 'Designed for Privacy',
  };

  const principles = [
    {
      icon: <Users className="w-6 h-6 text-accent-coral" />,
      title: isAr ? 'مجتمع يركز على الزواج فقط' : isCkb ? 'کۆمەڵگەی تەنها کۆنکریت لەسەر هاوسەرگیری' : 'Marriage-Focused Community',
      desc: isAr
        ? 'تم تصميم كل تفاصيل المنصة خصيصاً للباحثين عن الزواج الجاد لتسليط الضوء على المسؤولية وبناء الأسرة وتجنب علاقات التعارف العشوائي أو التسلية.'
        : isCkb
          ? 'تەواوی پلاتفۆرمەکە بە شێوازێک داڕێژراوە کە تەنها بۆ هاوسەرگیری جدی گونجاو بێت و دوور بێت لە کات بەسەربردن.'
          : 'Every element is shaped for serious individuals actively seeking marital milestones. Casual dating, flirting, or commercial spam are strictly discouraged in our flow design.',
      status: isAr ? 'مدمج في التدفق التعريفي' : isCkb ? 'لەنێو پڕۆسەی ناساندنەکەیە' : 'Privacy controls built into the product flow'
    },
    {
      icon: <Lock className="w-6 h-6 text-[#40798C]" />,
      title: isAr ? 'ملفات تعريفية بخصوصية مصانة' : isCkb ? 'پڕۆفایلی تەواو نهێنی' : 'Private Profiles',
      desc: isAr
        ? 'لا تظهر تفاصيل التواصل الشخصي أو وسائل التعريف مباشرة على الملأ. يتم حجب بيانات الاتصال تلقائياً لحفظ كرامتكم ودرجة الحشمة.'
        : isCkb
          ? 'هیچ زانیارییەکی پەیوەندیکردنی ڕاستەوخۆ بە ئاشکرا پیشان نادرێت بۆ پاراستنی نهێنی و شکۆی خێزانی.'
          : 'Sensitive biographical parameters remain gated. Personal contact handles are kept completely away from generic public listings to foster initial respect.',
      status: isAr ? 'مدمج في تدفق العرض' : isCkb ? 'لە ژێر دەسەڵاتی بەکارهێنەرە' : 'Privacy controls built into the product flow'
    },
    {
      icon: <MessageCircle className="w-6 h-6 text-purple-600" />,
      title: isAr ? 'شروط التوافق الثنائي لبدء المحادثة' : isCkb ? 'ڕەزامەندی دوولایەنە بۆ گفتوگۆ' : 'Mutual Match Required for Chat',
      desc: isAr
        ? 'لا يمكن لأي عضو إرسال رسائل عشوائية أو غير مرغوبة للآخر. تنشط غرفة الحوار الخاصة فقط عندما يقبل الطرفان طلب التعارف بالرضا التام.'
        : isCkb
          ? 'هیچ کەسێک ناتوانێت بە بێ ڕەزامەندی پێشوەختە نامە بنێرێت. ژووری گفتوگۆ تەنها کاتێک دەستپێدەکات کە هەردوولا ڕازی بن.'
          : 'Unsolicited reach-outs and spam are blocked. Private interaction channels are unlocked only when both partners approve a mutual marriage inquiry.',
      status: isAr ? 'مدمج في تدفق المحادثات' : isCkb ? 'لەنێو ژووری گفتوگۆی ئەپەکەدایە' : 'Privacy controls built into the product flow'
    },
    {
      icon: <Camera className="w-6 h-6 text-pink-600" />,
      title: isAr ? 'تحكم مرن بالصورة الشخصية' : isCkb ? 'کۆنترۆڵی پاراستنی وێنە' : 'Photo Control Settings',
      desc: isAr
        ? 'يتم تمويه صور السيدات افتراضياً لحمايتهن. تملك المرأة كامل الصلاحيات لتحديد الفئات القابلة للاطلاع على الصورة الشخصية أو نزع التمويه.'
        : isCkb
          ? 'وێنەکان لێڵ دەمێننەوە بۆ پاراستنی حەیا و کەرامەت. تەنها خۆت دەتوانیت دیاری بکەیت کێ وێنەکە ببینێت.'
          : 'Portraits of women are blurred by default under our custody settings. Users maintain full control to reveal their portraits exclusively to authenticated and accepted matches.',
      status: isAr ? 'تحكم تفاعلي مدمج' : isCkb ? 'کۆنترۆڵی دەستی متبادل' : 'Privacy controls built into the product flow'
    }
  ];

  const futurePlans = [
    {
      icon: <UserCheck className="w-6 h-6 text-emerald-600" />,
      title: isAr ? 'نظام التحقق المدني والهوياتي القانوني' : isCkb ? 'سیستەمی نوێی ناساندنی یاسایی' : 'Civil Identity Verification Framework',
      desc: isAr
        ? 'مخطط لربط التطبيق بقاعدة بيانات البطاقة الوطنية الموحدة أو المستندات الرسمية للتحقق من العمر والهوية والمنشأ فور ربط النظام بالخلفية البرمجية لقاعدة البيانات.'
        : isCkb
          ? 'پلان هەیە بۆ بەستنەوەی ئەپەکە بە پاسپۆرت یان ناسنامەی نیشتمانی بۆ نەهێشتنی پڕۆفایلی ساختە کاتێک سێرڤەر چالاک بوو.'
          : 'Designed for strict future civil validation using ministerial registry integrations or ID snapshots. This will ensure single-account integrity per citizen.',
      status: isAr ? 'مخطط للتطوير مع تفعيل قاعدة البيانات' : isCkb ? 'پلانی بۆ دانراوە لەگەڵ سێرڤەر' : 'Backend verification planned'
    },
    {
      icon: <Flag className="w-6 h-6 text-amber-600" />,
      title: isAr ? 'أدوات التبليغ التلقائي والحظر الكامل' : isCkb ? 'ئامرازەکانی بلۆککردن و ڕاپۆرتکردن' : 'Automated Block & Report Infrastructure',
      desc: isAr
        ? 'يتم اختبار أدوات تقديم التقارير وحظر الحسابات المسيئة محلياً في نسخة العرض الحالية. سيتم تطبيق الحظر الدائم والعقوبات الإدارية تلقائياً بمجرد إتمام خوادم التخزين الحية.'
        : isCkb
          ? 'ئامرازەکانی ڕاپۆرتکردن و تۆمارکردنی سەرپێچی لەسەر سێرڤەر و بلۆککردنی هەمیشەیی پۆڵ پۆڵ کار دەکات بێت کاتێک سێرڤەر بەسترایەوە.'
          : 'Integrated interface layouts for immediate reporting of unserious actions or behavior. Actionable lifetime database bans and review board queues are scheduled.',
      status: isAr ? 'مخطط للتطوير النهائي' : isCkb ? 'پلانی بۆ دانراوە بۆ بەردەستبوونی سێرڤەر' : 'Report and block tools planned'
    },
    {
      icon: <Shield className="w-6 h-6 text-[#40798C]" />,
      title: isAr ? 'بروتوكولات حماية وتشفير قواعد البيانات' : isCkb ? 'پاراستنی پێشکەوتووی داتا لەسەر سێرڤەر' : 'Durable Data Protection Policies',
      desc: isAr
        ? 'صممت سياسة أمان البيانات المستقبلية لتتوافق مع معايير الأمان المتقدمة. سيتم حماية وتشفير تخزين البيانات الشخصية بالكامل فور دمج قاعدة البيانات السحابية الحية.'
        : isCkb
          ? 'پاراستنی زانیارییەکانت لەسەر سێرڤەری سحاب چالاک دەبێت بە کۆدکردنی پێشکەوتوو بۆ نەهێشتنی دزەکردنی نهێنییەکانتان.'
          : 'Full relational security schema, transactional safeguards, and access policies designed to keep every interaction private, active with our upcoming database node deployment.',
      status: isAr ? 'مستعد للتطبيق مع قواعد البيانات' : isCkb ? 'تەواوکاری جێگیر لەگەڵ جێبەجێبوونی سێرڤەر' : 'Data protection will be implemented with backend'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10" id="trust-privacy-center-v3">
      
      {/* Top Breadcrumb and action bar */}
      <div className="flex justify-between items-center pb-4 border-b border-stone-200/50">
        <button
          onClick={onBackToOverview}
          className="text-xs font-bold text-[#6B635B] hover:text-warm-charcoal flex items-center gap-1.5 transition"
        >
          ✕ {isAr ? 'إغلاق والعودة للرئيسية' : isCkb ? 'داخستن و گەڕانەوە' : 'Close and Back'}
        </button>
        <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full font-mono font-bold uppercase">
          {t.badge}
        </span>
      </div>

      {/* Header Info */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-serif font-black text-warm-charcoal flex items-center justify-center gap-2">
          <ShieldCheck className="w-8 h-8 text-accent-coral" />
          <span>{t.title}</span>
        </h2>
        <p className="text-xs sm:text-sm text-[#6B635B] font-semibold leading-relaxed">
          {t.sub}
        </p>
      </div>

      {/* Honest Warning Warning Box */}
      <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 max-w-3xl mx-auto text-left rtl:text-right flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1.5">
          <p className="text-xs font-bold text-amber-800">
            {isAr ? 'تنويه الأمان الشفاف' : isCkb ? 'تێبینی چاودێری متمانەی ڕوون' : 'App Transparency & Disclaimer Notice'}
          </p>
          <p className="text-[11px] text-[#6B635B] font-medium leading-relaxed">
            {isEn && (
              "Matching, introductions, chat, report, and block use the live HALAL API. We do not claim members are government-ID verified, that screenshots are blocked, or that we can prevent all abuse. Involve family and keep conversations respectful."
            )}
            {isAr && (
              "المطابقة وطلبات التعارف والمحادثة والإبلاغ والحظر تعمل عبر واجهة حلال الفعلية. لا ندّعي أن الأعضاء موثّقون بهوية حكومية، أو أن لقطات الشاشة ممنوعة، أو أن النظام يمنع كل إساءة. أشرك العائلة وحافظ على الاحترام."
            )}
            {isCkb && (
              "هاوتاکردن و داواکاری و گفتوگۆ و ڕاپۆرت و بلۆک لە ڕێگەی APIی ڕاستەقینەی حەڵاڵەوە کاردەکەن. ئێمە ناڵێین ئەندامان بە ناسنامەی حکومی پشتڕاستکراونەتەوە یان وێنەگرتنی شاشە قەدەغەیە. گفتوگۆکان بە ڕێز و بە بەشداری خێزان ئەنجام بدەن."
            )}
          </p>
        </div>
      </div>

      {/* SECTION A: Privacy Built Into Flow */}
      <div className="space-y-6 pt-2">
        <div className="text-left rtl:text-right border-l-4 border-accent-coral pl-3 rtl:border-l-0 rtl:border-r-4 rtl:pr-3">
          <h3 className="font-serif font-black text-warm-charcoal text-lg">
            {isAr ? '١. أدوات حماية الخصوصية المفعلة في واجهة التطبيق' : isCkb ? '١. ڕێبەرە متبادلە چالاکراوەکان لەناو ئەپەکەدا' : '1. Privacy Controls Built into the Product Flow'}
          </h3>
          <p className="text-[#6B635B] text-xs font-semibold mt-0.5">
            {isAr ? 'الآليات المدمجة حالياً ضمن تدفق الاستخدام للتجربة والتحقق:' : isCkb ? 'ئەو تایبەتمەندییانەی ئێستا بە شێوەی کارا دروستکراون بۆ ناساندن:' : 'Security behaviors active within the client experience:'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {principles.map((p, idx) => (
            <div key={idx} className="bg-white/40 backdrop-blur-sm border border-white/50 p-6 rounded-[2rem] flex flex-col justify-between text-left rtl:text-right shadow-sm">
              <div className="space-y-3">
                <div className="w-10 h-10 bg-white rounded-xl border border-stone-200/60 flex items-center justify-center">
                  {p.icon}
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-warm-charcoal">{p.title}</h4>
                <p className="text-[11px] text-[#6B635B] leading-relaxed font-semibold">{p.desc}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-stone-200/30 flex items-center gap-1.5 text-[9px] font-mono font-bold text-[#40798C] uppercase">
                <Check className="w-4 h-4 text-[#40798C]" />
                <span>{p.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION B: Planned Backend Protections */}
      <div className="space-y-6 pt-4">
        <div className="text-left rtl:text-right border-l-4 border-emerald-600 pl-3 rtl:border-l-0 rtl:border-r-4 rtl:pr-3">
          <h3 className="font-serif font-black text-warm-charcoal text-lg">
            {isAr ? '٢. بروتوكولات الأمان المخطط لتنفيذها مع خادم البيانات' : isCkb ? '٢. سیستەمە ئاسایشییە پلاندارێژراوەکان لەگەڵ بەستنەوەی سێرڤەر' : '2. Advanced Protections Planned for Backend Integration'}
          </h3>
          <p className="text-[#6B635B] text-xs font-semibold mt-0.5">
            {isAr ? 'الخدمات التي ستدخل حيز التنفيذ بمجرد الاتصال بخوادم التخزين الحية للإنتاج:' : isCkb ? 'ئەو کارانەی چالاک دەبن کاتێک سێرڤەری گشتی بەسترایەوە:' : 'Durable safety layers activated upon deployment of cloud database schemas:'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {futurePlans.map((p, idx) => (
            <div key={idx} className="bg-stone-50 border border-stone-200/70 p-6 rounded-3xl flex flex-col justify-between text-left rtl:text-right shadow-inner">
              <div className="space-y-3">
                <div className="w-10 h-10 bg-white rounded-xl border border-stone-200/50 flex items-center justify-center text-stone-500">
                  {p.icon}
                </div>
                <h4 className="text-xs font-bold text-warm-charcoal">{p.title}</h4>
                <p className="text-[11px] text-[#6B635B] leading-relaxed font-semibold">{p.desc}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-stone-200/50 flex items-center gap-1.5 text-[9px] font-mono font-bold text-amber-700 uppercase">
                <Activity className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                <span>{p.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER PLEDGE OF INTEGRITY */}
      <div className="p-6 sm:p-8 rounded-[2rem] bg-[#40798C]/5 border border-[#40798C]/15 text-center space-y-4 max-w-4xl mx-auto">
        <p className="text-xs font-mono font-bold tracking-widest text-[#40798C] uppercase">
          {isAr ? 'الاحترام والوقار • ميثاق الشرف' : isCkb ? 'ڕێزگرتن و بەڵێنامە • متمانە' : 'DIGNITY, VALUES & MARRIAGE ASSURANCE'}
        </p>
        <p className="text-xs text-[#6B635B] max-w-2xl mx-auto leading-relaxed font-semibold">
          {isEn && "Our community thrives on transparent values. We require everyone to participate honestly, avoid profile spam, and approach every interaction with the high moral standards expected in marriage foundations."}
          {isAr && "تزدهر منصتنا بالقيم الطاهرة والاحترام المتبادل. نطلب من جميع الأعضاء المشاركة بوقار تام، والابتعاد عن التسلية، والمحافظة على النوايا الخالصة لبناء أسرة عراقية صالحة."}
          {isCkb && "کۆمەڵگەکەمان لەسەر بەهای ڕاستگۆیی ڕاوەستاوە. تکایە بە نیازی جدییەوە بەشداری بکەن و ڕێز لە کۆنترۆڵە ڕەوشتییەکان بگرن بۆ بنیادنانی خێزانێکی تەندروست."}
        </p>
      </div>

    </div>
  );
}
