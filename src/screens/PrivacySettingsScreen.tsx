import React, { useState } from 'react';
import { AppLanguage, UserProfile } from '../types';
import { 
  Shield, 
  Eye, 
  Lock, 
  Mail, 
  Users, 
  Check, 
  Bell, 
  AlertOctagon, 
  HelpCircle, 
  Settings, 
  Ban, 
  FileText, 
  ToggleLeft, 
  ToggleRight 
} from 'lucide-react';

interface PrivacySettingsScreenProps {
  locale: AppLanguage;
  profile: UserProfile;
  onUpdatePrivacy: (updated: Partial<UserProfile>) => void;
  triggerToast: (msg: string) => void;
}

export default function PrivacySettingsScreen({
  locale,
  profile,
  onUpdatePrivacy,
  triggerToast
}: PrivacySettingsScreenProps) {
  
  // Local state for notification toggles to simulate real switches
  const [notifyRequest, setNotifyRequest] = useState<boolean>(true);
  const [notifyAccepted, setNotifyAccepted] = useState<boolean>(true);
  const [notifyMessage, setNotifyMessage] = useState<boolean>(true);
  const [notifyViews, setNotifyViews] = useState<boolean>(false);

  // Local state for custom settings
  const [hideProfile, setHideProfile] = useState<boolean>(false);
  const [whoCanSend, setWhoCanSend] = useState<'all' | 'same_govt' | 'same_sect'>('all');
  const [whoCanMessage, setWhoCanMessage] = useState<'accepted_only' | 'all_verified'>('accepted_only');
  const [blockSearchTerm, setBlockSearchTerm] = useState('');

  // Photo / Contact mode triggers
  const handlePhotoPrivacyChange = (v: UserProfile['photoPrivacy']) => {
    onUpdatePrivacy({ photoPrivacy: v });
    triggerToast(locale === 'en' ? `Photo privacy set to: ${v.replace(/_/g, ' ')}` : 'تم تحديد خيار حماية الصورة الشخصية بنجاح');
  };

  const handleContactModeChange = (v: string) => {
    onUpdatePrivacy({ privateContactMode: v });
    triggerToast(locale === 'en' ? `Privacy standard set to: ${v}` : 'تم تحديث معايير الخصوصية والاتصال');
  };

  const handleWhoCanSendChange = (val: 'all' | 'same_govt' | 'same_sect') => {
    setWhoCanSend(val);
    triggerToast(locale === 'en' ? `Request permissions restricted to: ${val}` : 'تم تحديد صلاحية إرسال طلبات التعارف');
  };

  const handleWhoCanMessageChange = (val: 'accepted_only' | 'all_verified') => {
    setWhoCanMessage(val);
    triggerToast(locale === 'en' ? `Messaging restricted to: ${val}` : 'تم تعيين صلاحيات كتابة الرسائل الخاصة');
  };

  const handleHideProfileToggle = () => {
    const newState = !hideProfile;
    setHideProfile(newState);
    triggerToast(
      locale === 'en'
        ? (newState ? "🔒 Profile Hidden. You will not appear in the Match Explorer results." : "🔓 Profile Visible. Other verified partners can now search your dossier.")
        : (newState ? "🔒 الملف الشخصي محجوب الآن. لن تظهر في مستكشف وعمليات فرز الشركاء." : "🔓 الملف الشخصي مرئي الآن للأعضاء الآخرين الموثقين.")
    );
  };

  const handleAddBlockMock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blockSearchTerm.trim()) return;
    triggerToast(
      locale === 'en'
        ? `To block a member, open their profile or chat and use Block. Blocks are saved on your account.`
        : `لحظر عضو، افتح ملفه أو المحادثة واستخدم الحظر. يتم حفظ الحظر في حسابك.`
    );
    setBlockSearchTerm('');
  };

  // Guidelines set for serious marital intent
  const communityGuidelines = [
    {
      title: locale === 'en' ? "Focus purely on marriage" : "التركيز المطلق على الزواج والقران",
      text: locale === 'en' 
        ? "We enforce zero-tolerance policy for unserious flirting, casual friendships, or business advertisement." 
        : "يُمنع منعاً باتاً العلاقات العابرة، الفضول، تجربة المنصة بغرض التسلية، أو الترويج لأي نشاط تجاري."
    },
    {
      title: locale === 'en' ? "Dignified disclosure choices" : "الاحترام المتبادل لخيارات الخصوصية",
      text: locale === 'en' 
        ? "Many Iraqi ladies protect portraits using standard blur layers. Respect this boundary until connection is mutually validated." 
        : "تحترم المنصة رغبة السيدات في تمويه الصورة الشخصية. لا تطلب نزع التمويه قبل إتمام القبول المتبادل بوقار."
    },
    {
      title: locale === 'en' ? "Honest background specifications" : "الوضوح المطلق في تفاصيل السجل المدني",
      text: locale === 'en' 
        ? "Any misrepresentation of age, governorate, education level, or former marital status triggers life-time account termination." 
        : "تزوير العمر، المحافظة، الحالة الاجتماعية، والمذهب يؤدي إلى الحظر النهائي من المنصة فور التبليغ والتحقق."
    },
    {
      title: locale === 'en' ? "No external social handle spam" : "عدم إدراج الحسابات الخارجية في النصوص العامة",
      text: locale === 'en' 
        ? "Do not share Snapchat, Instagram, or WhatsApp handles in your profile header. Keep messages inside protective chat rooms until families coordinate."
        : "يُمنع نشر حسابات سناپ شات، إنستغرام أو أرقام الهواتف الشخصية في التعريف العام؛ بهدف مصون غرف التواصل."
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 text-left animate-fade-in" id="privacy-settings-screen-v2">
      
      {/* Header and Intro */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-warm-charcoal font-serif tracking-tight flex items-center gap-2">
            <Shield className="w-8 h-8 text-accent-coral" />
            <span>{locale === 'en' ? 'Identity & Privacy Shield' : 'إعدادات السرية والخصوصية'}</span>
          </h2>
          <p className="text-[#6B635B] text-xs sm:text-sm font-medium mt-1">
            {locale === 'en'
              ? 'We honor your customs, family values, and traditions. Adjust security masking, message limits, alerts, and guidelines.'
              : 'نحن نحترم عاداتك، خصوصيتك العائلية، وقيم مجتمعنا العراقي الكريم. خصص خيارات الخصوصية والتحذيرات بوقار.'}
          </p>
        </div>

        {/* Status Indicator */}
        <div className="bg-stone-100 border border-stone-200/80 px-4 py-2 rounded-2xl text-[10px] sm:text-xs font-mono font-bold text-[#6B635B] flex items-center gap-1.5 shrink-0">
          <Settings className="w-4 h-4 text-[#40798C] animate-spin" />
          <span>{locale === 'en' ? 'Privacy settings' : 'إعدادات الخصوصية'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN (7 Cols): Advanced Privacy Settings & Notifications */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* SECTION 1: MASTER PRIVACY LIMITS */}
          <div className="bg-white/40 backdrop-blur-xl border border-white/55 p-6 sm:p-8 rounded-[2rem] shadow-xl space-y-6">
            <h3 className="font-serif font-black text-warm-charcoal text-base flex items-center gap-2 pb-2 border-b border-stone-200/50">
              <Eye className="w-5 h-5 text-[#40798C]" />
              <span>{locale === 'en' ? 'Dignified Visibility Controls' : 'صيانة الظهور والحجاب الرقمي'}</span>
            </h3>

            {/* Profile Visibility Hide profile master switch */}
            <div className="p-4 rounded-2xl bg-white/60 border border-white/40 flex justify-between items-center">
              <div className="text-left space-y-0.5">
                <p className="text-xs font-bold text-warm-charcoal">
                  🔒 {locale === 'en' ? 'Temporarily Hide Courtship Profile' : 'حجب الملف التعريفي مؤقتاً'}
                </p>
                <p className="text-[10px] text-[#6B635B] font-semibold leading-normal">
                  {locale === 'en' 
                    ? 'Hide your dossier from Match Explorer. Direct mutual matches can still message you.' 
                    : 'إخفاء حسابك بالكامل من بوابات التصفح؛ ستبقى قنوات الاتصال المقبولة مسبقاً مفعلة للحديث.'}
                </p>
              </div>

              <button
                type="button"
                onClick={handleHideProfileToggle}
                className="text-[#40798C] focus:outline-none shrink-0"
              >
                {hideProfile ? (
                  <ToggleRight className="w-10 h-10 text-accent-coral" />
                ) : (
                  <ToggleLeft className="w-10 h-10 text-stone-300" />
                )}
              </button>
            </div>

            {/* Photo privacy masking standard inside config card */}
            <div className="space-y-3">
              <p className="text-xs font-bold text-[#6B635B] uppercase tracking-wider font-mono">
                📸 {locale === 'en' ? 'Portrait Masking Level' : 'درجة تغطية وحماية الصورة الشخصية'}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {[
                  { id: 'visible', title: locale === 'en' ? 'Always Visible portrait' : 'رؤية مباشرة', desc: locale === 'en' ? 'Show face directly to verified members.' : 'إتاحة صورتي بكامل الوضوح للموثقين.' },
                  { id: 'blurred', title: locale === 'en' ? 'High-Fidelity Blur mask' : 'تمويه الحشمة والوقار', desc: locale === 'en' ? 'Blurred by default. Unlocks for accepted connections.' : 'تمويه الصورة تلقائياً؛ لا تُكشف إلا لمن يتم القبول المتبادل معه.' },
                  { id: 'initials', title: locale === 'en' ? 'Traditional Calligraphy badge' : 'شارات الخط والأيقونات', desc: locale === 'en' ? 'Hide fully, render elegant initials.' : 'استبدال الصورة تماماً بأيقونة كلاسيكية تليق بوقارك.' },
                  { id: 'mutual_approval', title: locale === 'en' ? 'By-Request Unlock' : 'الفتح بموجب تصريح خاص', desc: locale === 'en' ? 'Require manual permissions to view.' : 'إخفاء الصورة حتى لو تم القبول المتبادل لحين طلب الإذن.' }
                ].map((opt) => {
                  const isActive = profile.photoPrivacy === opt.id;
                  return (
                    <button
                      type="button"
                      key={opt.id}
                      onClick={() => handlePhotoPrivacyChange(opt.id as any)}
                      className={`p-3.5 text-left rounded-xl border text-xs tracking-tight transition-all font-semibold flex flex-col space-y-1 ${
                        isActive
                          ? 'bg-[#40798C]/15 border-[#40798C] text-warm-charcoal shadow-inner'
                          : 'bg-white border-stone-200/65 text-stone-500 hover:bg-stone-50'
                      }`}
                    >
                      <span className="flex justify-between items-center w-full">
                        <span className="font-bold">{opt.title}</span>
                        {isActive && <Check className="w-4 h-4 text-[#40798C]" />}
                      </span>
                      <span className="text-[10px] text-[#6B635B] leading-relaxed font-semibold">{opt.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Interaction permissions settings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-stone-200/50">
              
              {/* Who can send requests option */}
              <div className="space-y-2">
                <label className="block text-[10px] font-mono font-bold text-[#6B635B] uppercase tracking-wide">
                  Who can send me introduction requests?
                </label>
                <select
                  value={whoCanSend}
                  onChange={(e) => handleWhoCanSendChange(e.target.value as any)}
                  className="w-full bg-white border border-stone-200 p-2.5 rounded-xl text-xs text-warm-charcoal font-semibold focus:outline-none"
                >
                  <option value="all">{locale === 'en' ? 'All Verified Iraqi Members' : 'جميع الأعضاء الحقيقيين'}</option>
                  <option value="same_govt">{locale === 'en' ? 'Same Governorate Only' : 'محافظتي الجغرافية فقط'}</option>
                  <option value="same_sect">{locale === 'en' ? 'Sect/Traditional compatible members' : 'المتوافقين مذهبياً وثقافياً'}</option>
                </select>
              </div>

              {/* Who can message me */}
              <div className="space-y-2">
                <label className="block text-[10px] font-mono font-bold text-[#6B635B] uppercase tracking-wide">
                  Who can open chat dialogues with me?
                </label>
                <select
                  value={whoCanMessage}
                  onChange={(e) => handleWhoCanMessageChange(e.target.value as any)}
                  className="w-full bg-white border border-stone-200 p-2.5 rounded-xl text-xs text-warm-charcoal font-semibold focus:outline-none"
                >
                  <option value="accepted_only">{locale === 'en' ? 'Accepted Marital Contacts Only' : 'الشركاء المقبولين متبادلاً فقط'}</option>
                  <option value="all_verified">{locale === 'en' ? 'All Verified Profiles (Open Room)' : 'أي ملف موثق مباشرة (غرف عامة)'}</option>
                </select>
              </div>

            </div>

          </div>

          {/* SECTION 2: DYNAMIC NOTIFICATION PREFERENCES */}
          <div className="bg-white/40 backdrop-blur-xl border border-white/55 p-6 sm:p-8 rounded-[2rem] shadow-xl space-y-6">
            <h3 className="font-serif font-black text-warm-charcoal text-base flex items-center gap-2 pb-2 border-b border-stone-200/50">
              <Bell className="w-5 h-5 text-accent-coral" />
              <span>{locale === 'en' ? 'Notification Alert Parameters' : 'تنيهات الهاتف والرسائل الفورية'}</span>
            </h3>

            <div className="space-y-4">
              
              {/* Alert 1 */}
              <div className="flex justify-between items-center py-1">
                <div>
                  <p className="text-xs font-bold text-warm-charcoal">{locale === 'en' ? 'New Courtship Request Alerts' : 'تلقي طلبات خطوبة جديدة'}</p>
                  <p className="text-[10px] text-[#6B635B] font-semibold mt-0.5">{locale === 'en' ? 'Instant SMS & secure app notifications.' : 'إرسال رسائل قصيرة وتنبيه للمحمول عند وصول مهتم جديد.'}</p>
                </div>
                <button 
                  onClick={() => { setNotifyRequest(!notifyRequest); triggerToast(locale === 'en' ? "Preferences updated" : "تم تعديل خيارات التنبيه"); }}
                  className="text-[#40798C] focus:outline-none"
                >
                  {notifyRequest ? <ToggleRight className="w-10 h-10 text-[#40798C]" /> : <ToggleLeft className="w-10 h-10 text-stone-300" />}
                </button>
              </div>

              {/* Alert 2 */}
              <div className="flex justify-between items-center py-1 border-t border-stone-100 pt-3">
                <div>
                  <p className="text-xs font-bold text-warm-charcoal">{locale === 'en' ? 'Request Accepted Notification' : 'تنبيه قبول الطلب المتبادل'}</p>
                  <p className="text-[10px] text-[#6B635B] font-semibold mt-0.5">{locale === 'en' ? 'Know immediately when a target profile approves your intent.' : 'معرفة موافقة الطرف الآخر على مباردة التعارف فوراً.'}</p>
                </div>
                <button 
                  onClick={() => { setNotifyAccepted(!notifyAccepted); triggerToast(locale === 'en' ? "Preferences updated" : "تم تعديل خيارات التنبيه"); }}
                  className="text-[#40798C] focus:outline-none"
                >
                  {notifyAccepted ? <ToggleRight className="w-10 h-10 text-[#40798C]" /> : <ToggleLeft className="w-10 h-10 text-stone-300" />}
                </button>
              </div>

              {/* Alert 3 */}
              <div className="flex justify-between items-center py-1 border-t border-stone-100 pt-3">
                <div>
                  <p className="text-xs font-bold text-warm-charcoal">{locale === 'en' ? 'Direct Messages (Private Chat) bubble' : 'إشعارات الرسائل الخاصة في المحادثة'}</p>
                  <p className="text-[10px] text-[#6B635B] font-semibold mt-0.5">{locale === 'en' ? 'Alerts for secure messages received in matched chats.' : 'الحصول على إشعار فوري عند كتابة الطرف الآخر.'}</p>
                </div>
                <button 
                  onClick={() => { setNotifyMessage(!notifyMessage); triggerToast(locale === 'en' ? "Preferences updated" : "تم تعديل خيارات التنبيه"); }}
                  className="text-[#40798C] focus:outline-none"
                >
                  {notifyMessage ? <ToggleRight className="w-10 h-10 text-[#40798C]" /> : <ToggleLeft className="w-10 h-10 text-stone-300" />}
                </button>
              </div>

              {/* Alert 4: Profile views placeholder */}
              <div className="flex justify-between items-center py-1 border-t border-stone-100 pt-3 opacity-80">
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <p className="text-xs font-bold text-warm-charcoal">{locale === 'en' ? 'Dossier Profile Views Alerts' : 'تنبيهات بمشاهدة الملف الشخصي'}</p>
                    <span className="text-[8px] bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded font-mono font-bold uppercase">Coming soon</span>
                  </div>
                  <p className="text-[10px] text-[#6B635B] font-semibold mt-0.5">{locale === 'en' ? 'Receive summary of verified partners who visited your portfolio.' : 'تحديثات أسبوعية بالملفات التي تصفحت بياناتك.'}</p>
                </div>
                <button 
                  onClick={() => { setNotifyViews(!notifyViews); triggerToast(locale === 'en' ? "Profile view alerts are not available yet." : "تنبيهات مشاهدة الملف غير متاحة حالياً."); }}
                  className="text-[#40798C] focus:outline-none"
                >
                  {notifyViews ? <ToggleRight className="w-10 h-10 text-[#40798C]" /> : <ToggleLeft className="w-10 h-10 text-stone-300" />}
                </button>
              </div>

            </div>
          </div>

        </div>

        {/* RIGHT COLUMN (5 Cols): Safety Block/Report Lists & Guidelines */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Safety: Block & Report Placeholders */}
          <div className="bg-white/40 backdrop-blur-xl border border-white/55 p-6 sm:p-8 rounded-[2rem] shadow-xl space-y-4">
            <h3 className="font-serif font-black text-warm-charcoal text-base flex items-center gap-2 pb-2 border-b border-stone-200/50">
              <Ban className="w-4.5 h-4.5 text-red-600" />
              <span>{locale === 'en' ? 'Blocked Users' : 'قائمة الحظر والأمان'}</span>
            </h3>

            <p className="text-[11px] text-[#6B635B] leading-relaxed font-semibold">
              {locale === 'en' 
                ? 'Need to block or report a specific unserious account? You can do so directly from their profile card or chat header. Review policy below:'
                : 'هل واجهتك إساءة أو عدم جدية؟ يمكنك اتخاذ قرار الحظر أو التبليغ مباشرة من شريط المحادثة الفتحة لقمع التجاوزات.'}
            </p>

            {/* Block list mock form */}
            <form onSubmit={handleAddBlockMock} className="space-y-2 pt-2 text-left">
              <label className="block text-[9px] font-mono font-bold text-[#6B635B] uppercase tracking-wider">
                {locale === 'en' ? 'Block member by Username / ID' : 'إضافة مستخدم لقائمة الحظر المباشر'}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={blockSearchTerm}
                  onChange={(e) => setBlockSearchTerm(e.target.value)}
                  placeholder="e.g. AmberDossier"
                  className="flex-1 bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs text-warm-charcoal font-semibold focus:outline-none focus:ring-1 focus:ring-accent-coral"
                />
                <button
                  type="submit"
                  className="px-3 bg-warm-charcoal text-white font-bold text-xs rounded-xl hover:bg-stone-800 transition shadow"
                >
                  {locale === 'en' ? 'Block' : 'حظر'}
                </button>
              </div>
              <p className="text-[9px] text-[#A2978C] font-mono leading-relaxed mt-1">
                {locale === 'en'
                  ? 'Blocks are saved on your account when you block someone from their profile or chat.'
                  : 'يتم حفظ الحظر في حسابك عند حظر شخص من ملفه أو من المحادثة.'}
              </p>
            </form>
          </div>

          {/* Safety Reminders: Community Guidelines */}
          <div className="bg-white/40 backdrop-blur-xl border border-white/55 p-6 sm:p-8 rounded-[2rem] shadow-xl space-y-4">
            <h3 className="font-serif font-black text-warm-charcoal text-base flex items-center gap-2 pb-2 border-b border-stone-200/50">
              <AlertOctagon className="w-4.5 h-4.5 text-amber-500 fill-amber-500 text-stone-900" />
              <span>{locale === 'en' ? 'Community Guidelines' : 'ميثاق الشرف والضوابط الشرعية'}</span>
            </h3>

            <div className="space-y-4">
              {communityGuidelines.map((g, idx) => (
                <div key={idx} className="space-y-1 text-left">
                  <p className="text-xs font-bold text-warm-charcoal">
                    {idx + 1}. {g.title}
                  </p>
                  <p className="text-[10px] text-[#6B635B] leading-relaxed font-semibold">
                    {g.text}
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
