/**
 * Translation Dictionary for HALAL Matchmaking
 * Languages: English (en), Arabic (ar), Kurdish Sorani (ckb)
 */

export type Language = 'en' | 'ar' | 'ckb';

export interface Translations {
  dir: 'ltr' | 'rtl';
  brand: string;
  slogan: string;
  tagline: string;
  marriageOnly: string;
  guestProfile: string;
  welcome: string;
  completeScore: string;
  editDetails: string;
  onboardNow: string;

  // Tabs
  overview: string;
  onboarding: string;
  explore: string;
  chat: string;

  // Hero Section
  heroTitle: string;
  heroSub: string;
  iamMan: string;
  iamManDesc: string;
  iamWoman: string;
  iamWomanDesc: string;
  respectPortrayal: string;
  protectedOptions: string;
  startBtn: string;
  exploreMatchesBtn: string;

  // How It Works
  howItWorksTitle: string;
  howItWorksSub: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;

  // Photo Privacy
  privacyTitle: string;
  privacySub: string;
  rule1Title: string;
  rule1Desc: string;
  rule2Title: string;
  rule2Desc: string;
  rule3Title: string;
  rule3Desc: string;

  // Trust & Safety
  safetyTitle: string;
  safetySub: string;
  pledgeTitle: string;
  pledgeDesc: string;
  verificationTitle: string;
  verificationDesc: string;
  privacyLockedTitle: string;
  privacyLockedDesc: string;

  // Philosophy
  philTitle: string;
  philSub: string;
  philDesc: string;
  philPoint1: string;
  philPoint2: string;
  philPoint3: string;
  philPoint4: string;
  philBtn: string;

  // Onboarding Wizard
  wizardTitle: string;
  wizardSub: string;
  stepNum: string;
  nextStep: string;
  prevStep: string;
  completeOnboard: string;
  fullName: string;
  enterName: string;
  age: string;
  gender: string;
  governorate: string;
  cityDistrict: string;
  profession: string;
  education: string;
  languagesSpoken: string;
  marriageGoal: string;
  courtshipTimeline: string;
  wantsChildren: string;
  communicationPreference: string;
  photoPrivacySettings: string;
  valuesPrompt: string;

  // Match Explorer
  exploreTitle: string;
  exploreSub: string;
  filterButtonHide: string;
  filterButtonShow: string;
  compatibleCount: string;
  genderPref: string;
  ageSpectrum: string;
  educationLevel: string;
  professionCat: string;
  seriousnessLevel: string;
  courtshipValues: string;
  wantsKidsFilter: string;
  smokePref: string;
  photoVisibilityState: string;
  verifiedOnly: string;
  resetParams: string;
  noMatchesTitle: string;
  noMatchesDesc: string;
  noMatchesResetBtn: string;
  compatibilityBadge: string;
  portraitProtected: string;
  photoUnlockPrompt: string;
  sendRequest: string;
  requestPending: string;
  requestPendingSub: string;
  mutuallyConnected: string;
  viewDossier: string;
  closeDossier: string;
  bioOverview: string;
  absoluteDealbreakers: string;
  languagesText: string;

  // Chat Simulator
  chatTitle: string;
  chatSub: string;
  privacyConsole: string;
  privacyConsoleDesc: string;
  privateChatNotice: string;
  chatMutualAgreement: string;
  consentConfirmed: string;
  typeMessage: string;
  sendBtn: string;
  noConnectedMatches: string;
  noConnectedMatchesDesc: string;
  noActiveConversation: string;
  noActiveConversationDesc: string;
  safetyNotice: string;

  // Footer
  footerDesc: string;
  footerPledgeTitle: string;
  footerPledgeDesc: string;
  copyright: string;
  privacyPolicy: string;
  terms: string;
  idVerify: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    dir: 'ltr',
    brand: 'HALAL',
    slogan: 'Serious intentions • Respectful connections',
    tagline: 'MARRIAGE ONLY',
    marriageOnly: 'MARRIAGE ONLY',
    guestProfile: 'Guest Profile',
    welcome: 'Welcome',
    completeScore: 'Complete',
    editDetails: 'Edit Details',
    onboardNow: 'Onboard Now',

    overview: 'Overview',
    onboarding: 'Onboarding',
    explore: 'Match Explorer',
    chat: 'Guided Chat',

    heroTitle: 'Genuine Iraqi Marital Matchmaking',
    heroSub: 'A dignified, values-first platform designed for individuals seeking a lifelong, sincere household. Zero casual swiping, total photo security command, and absolute integrity.',
    iamMan: 'I am a man',
    iamManDesc: 'Sincere intentions to identify a partner of intellectual harmony, values, and mutual care.',
    iamWoman: 'I am a woman',
    iamWomanDesc: 'Full photo control, user-controlled privacy, and secure compatibility algorithms designed for your comfort and dignity.',
    respectPortrayal: 'Respectful portrayal',
    protectedOptions: 'Protected options',
    startBtn: 'Start Matching with Sincerity',
    exploreMatchesBtn: 'Explore Sincere Matches Direct',

    howItWorksTitle: 'A Structured, Honorable Journey',
    howItWorksSub: 'We avoid modern swiping loops. HALAL guides you through a clear, values-aligned marital process.',
    step1Title: '1. Establish Sincere Parameters',
    step1Desc: 'Formulate an authentic, detailed profile centering your lifecycle goals, family style, timeline, and photo privacy settings.',
    step2Title: '2. Values-Based Matching',
    step2Desc: 'Explore profiles across Iraqi governorates filtered precisely by compatibility index, educational background, and shared vision.',
    step3Title: '3. Secure, Respectful Courtship',
    step3Desc: 'Initiate interaction with photo-unlock options and private, respectful conversation rooms built for serious prospects.',

    privacyTitle: 'Absolute Portrait Command',
    privacySub: 'Traditional boundaries dictate comfort. We make sure you control who views your introduction portraits.',
    rule1Title: 'Control Visibility Settings',
    rule1Desc: 'Keep your pictures completely private, visible to all, or blurred of default. Women specify their comfort profile.',
    rule2Title: 'Request-Based Portrait Decoupling',
    rule2Desc: 'Prospects must issue an introduction request. Your portrait is completely protected until you grant mutual interest.',
    rule3Title: 'Respect Enforced by Design',
    rule3Desc: 'Screenshots are prohibited. Our user community guarantees authentic intentions to secure high respect and safety.',

    safetyTitle: 'Trust & Protection Standards',
    safetySub: 'We enforce stringent guidelines to guarantee safety and compliance with Islamic and traditional ethics.',
    pledgeTitle: 'The Courtship Pledge',
    pledgeDesc: 'Every user commits to direct communication with absolute honesty, active communication, and respectful responses.',
    verificationTitle: 'Strict ID Validation',
    verificationDesc: 'All verified profiles are vetted against standard citizenship IDs to eliminate catfishing and assure serious interest.',
    privacyLockedTitle: 'Data Privacy Shielding',
    privacyLockedDesc: 'We never sell your personal information. Your contact channels remain hidden unless you choose to share them.',

    philTitle: 'Where Serious Intentions Find Dignified Partners',
    philSub: 'Our Philosophy',
    philDesc: 'We developed HALAL because modern courtship apps treat humans like endless catalog items to be swiped. By starting with private expectations, respecting women\'s photo comfort default, and providing guided spiritual parameters, we pave a dignified route to stable family foundation.',
    philPoint1: 'Designed with cultural respect and local context',
    philPoint2: 'Zero Swiping. Matching strictly on values',
    philPoint3: 'Women completely command profile views',
    philPoint4: 'User-controlled privacy bounds and absolute secrecy',
    philBtn: 'Start Your Free Validation Onboarding',

    wizardTitle: 'Guided Onboarding',
    wizardSub: 'Fill the 6 values-first parameters below to complete your introduction. No fluff, only purpose.',
    stepNum: 'Step',
    nextStep: 'Next Step',
    prevStep: 'Back',
    completeOnboard: 'Complete Onboarding',
    fullName: 'Full Name',
    enterName: 'Enter your name',
    age: 'Age',
    gender: 'Gender',
    governorate: 'Governorate',
    cityDistrict: 'District / City Center',
    profession: 'Profession',
    education: 'Education Level',
    languagesSpoken: 'Languages Spoken (comma separated)',
    marriageGoal: 'Marital & Lifetime Intentions',
    courtshipTimeline: 'Target Courtship Timeline',
    wantsChildren: 'Stance on Having Children',
    communicationPreference: 'Privacy & Communication Preferences',
    photoPrivacySettings: 'Photo Visibility Preference',
    valuesPrompt: 'Select your Core Values & Traits (At least 2)',

    exploreTitle: 'Explore Courtship Portfolios',
    exploreSub: 'Genuine profiles of individuals seeking marriage. No casual swiping, verified identities only.',
    filterButtonHide: 'Hide Filters Layout',
    filterButtonShow: 'Configure Filters Layout',
    compatibleCount: 'Compatible Portfolios',
    genderPref: 'Prospective Partner Gender',
    ageSpectrum: 'Age Spectrum',
    educationLevel: 'Education Level',
    professionCat: 'Profession Category',
    seriousnessLevel: 'Seriousness Level',
    courtshipValues: 'Communication Style Preference',
    wantsKidsFilter: 'Wants Children',
    smokePref: 'Smoking Preference',
    photoVisibilityState: 'Photo Visibility State',
    verifiedOnly: 'Verified Profiles Only',
    resetParams: 'Reset Parameters',
    noMatchesTitle: 'No compatible dossiers found',
    noMatchesDesc: 'We support strict compatibility filtering. Try widening your age range or checking other Iraqi governorates for compatible prospects.',
    noMatchesResetBtn: 'Reset Active Filters',
    compatibilityBadge: 'Compatibility',
    portraitProtected: 'Portrait Protected',
    photoUnlockPrompt: 'Send Request to request photo unlock',
    sendRequest: 'Send Request',
    requestPending: 'Request Pending Review',
    requestPendingSub: 'Auto-approves in 2.5 seconds (Simulated)',
    mutuallyConnected: 'Mutually Connected! Chat ➔',
    viewDossier: 'View Full compatibility dossier ↗',
    closeDossier: 'Close dossier',
    bioOverview: 'Biography Overview',
    absoluteDealbreakers: 'Absolute Dealbreakers',
    languagesText: 'Languages:',

    chatTitle: 'Private Connection Rooms',
    chatSub: 'A respectful, private dialogue space. Serious intentions and respectful language are encouraged through built-in guides.',
    privacyConsole: 'Privacy & Communication Preferences',
    privacyConsoleDesc: 'Designed for privacy. Controls are built directly into the client-side experience flow.',
    privateChatNotice: 'Private introduction request',
    chatMutualAgreement: 'Introductions and communication remain strictly between both of you.',
    consentConfirmed: 'Mutual match required for chat.',
    typeMessage: 'Type a modern, respectful message...',
    sendBtn: 'Send',
    noConnectedMatches: 'No connected matches yet',
    noConnectedMatchesDesc: 'Go to the Match Explorer, find compatible partners, and send an introduction request. Once accepted, your chat room activates!',
    noActiveConversation: 'No Active Conversation Dialed',
    noActiveConversationDesc: 'Select an approved partner from the roster sidebar to start a guided, dignified dialogue.',
    safetyNotice: '🔒 Chats are private and respectful. Only you and your mutual match can see this conversation.',

    footerDesc: 'Modern matchmaking designed for serious individuals who respect traditional principles, mutual growth, and lifelong marital commitment.',
    footerPledgeTitle: 'Dignity Pledge',
    footerPledgeDesc: 'By interacting on HALAL, you agree to always be authentic, clear about your marriage timelines, polite in decline decisions, and committed to honorable dialogue.',
    copyright: '© 2026 HALAL Matchmaking Inc. Designed for serious intentions.',
    privacyPolicy: 'Privacy Policy',
    terms: 'Terms of Service',
    idVerify: 'ID Verification Guide'
  },
  ar: {
    dir: 'rtl',
    brand: 'حلال',
    slogan: 'نوايا جادة • تواصل محترم',
    tagline: 'للزواج فقط',
    marriageOnly: 'للزواج فقط',
    guestProfile: 'ملف زائر',
    welcome: 'مرحباً بك',
    completeScore: 'مكتمل',
    editDetails: 'تعديل البيانات',
    onboardNow: 'أكمل بياناتك الآن',

    overview: 'الرئيسية',
    onboarding: 'خطوات التسجيل',
    explore: 'استكشاف الشركاء',
    chat: 'المحادثة الموجهة',

    heroTitle: 'خطوبة وزواج جاد في العراق للمحافظة على القيم',
    heroSub: 'منصة كريمة تركز على القيم والمبادئ، مصممة خصيصاً للراغبين في بناء أسرة صالحة ومستقرة. لا يوجد تمرير عشوائي، حماية كاملة لخصوصية الصور، وشفافية مطلقة.',
    iamMan: 'أنا رجل',
    iamManDesc: 'أسعى بجدية للعثور على شريكة حياة تناسب قيمي وتطلعاتي الفكرية، يسود بيننا الود والاحترام المتبادل.',
    iamWoman: 'أنا امرأة',
    iamWomanDesc: 'تحكم كامل في ظهور الصور، خيارات خصوصية متكاملة تحت تحكمك، وخوارزميات توافق متطورة صُممت للحفاظ على راحتك وكرامتك أولاً.',
    respectPortrayal: 'تجسيد محترم للأشخاص',
    protectedOptions: 'خيارات حماية معززة',
    startBtn: 'ابدأ البحث بنوايا صادقة',
    exploreMatchesBtn: 'استشكف شركاء التوافق مباشرة',

    howItWorksTitle: 'رحلة منظمة ومشرفة',
    howItWorksSub: 'نبتعد تماماً عن أسلوب التعارف العشوائي. نوجهك بأسلوب ميسر عبر خطوات واضحة ومبنية على التوافق القيمي الأخلاقي.',
    step1Title: '١. تحديد معايير واضحة',
    step1Desc: 'أنشئ ملفاً شخصياً حقيقياً ومفصلاً يركز على أهدافك الحياتية، وتفضيلات الخصوصية والتواصل، والجدول الزمني للزواج، وخصوصية صورك.',
    step2Title: '٢. البحث القائم على التوافق',
    step2Desc: 'استكشف الملفات الشخصية في مختلف المحافظات العراقية المصفاة بدقة حسب نسبة التوافق، المؤهلات العلمية، والرؤية المشتركة.',
    step3Title: '٣. تواصل آمن ومحترم',
    step3Desc: 'ابدأ التواصل مع خيارات طلب فتح الصور ومحادثات خاصة وآمنة تماماً تتيح لكما التعارف بجدية وفي إطار من الوقار والخصوصية المتبادلة.',

    privacyTitle: 'تحكم مطلق في خصوصية الصور',
    privacySub: 'الحدود التقليدية تحدد راحتك. نحن نضمن لك السيطرة الكاملة على من يحق له مشاهدة صورك التعريفية.',
    rule1Title: 'تخصيص إعدادات الظهور',
    rule1Desc: 'أبقِ صورك مغلقة بالكامل، أو ظاهرة للجميع، أو مموهة بشكل افتراضي. نتيح خيارات خصوصية مخصصة للنساء خصوصاً.',
    rule2Title: 'إظهار الصور عند الطلب فقط',
    rule2Desc: 'يجب على المهتمين إرسال طلب تواصل رسمي أولاً. لن تظهر صورتك إلا بعد قبولك المتبادل واطمئنانك.',
    rule3Title: 'احترام مفروض في التصميم',
    rule3Desc: 'يُمنع التقاط لقطات الشاشة للصور. يلتزم جميع أعضائنا بنوايا جادة ومصداقية تضمن بيئة آمنة وراقية للجميع.',

    safetyTitle: 'معايير الأمان والثقة في المنصة',
    safetySub: 'نطبق قواعد صارمة لضمان السلامة والالتزام بالأخلاق والقيم التقليدية والإسلامية.',
    pledgeTitle: 'تعهد المصداقية والجدية',
    pledgeDesc: 'يلتزم كل مشترك بالحديث الصادق، والاستجابة الفعالة، والرد المحترم سواء بالقبول أو الرفض اللطيف.',
    verificationTitle: 'التحقق الصارم من الهوية',
    verificationDesc: 'نطالب بالتحقق من البطاقة الوطنية أو هوية الأحوال المدنية للقضاء على الحسابات الوهمية والتأكد من جدية النوايا.',
    privacyLockedTitle: 'تشفير وحماية البيانات',
    privacyLockedDesc: 'نحن لا نبيع في أي حال من الأحوال بياناتك الشخصية. تبقى طرق الاتصال بك مخفية حتى تقرر أنت مشاركتها بمحض إرادتك.',

    philTitle: 'حيث تلتقي النوايا الصادقة في إطار من الوقار والكرامة',
    philSub: 'فلسفتنا وغايتنا',
    philDesc: 'لقد قمنا بتطوير "حلال" لأن تطبيقات التعارف المعاصرة تعامل الإنسان كسلعة في كتالوج بلا نهاية. من خلال البدء بتحديد التوقعات التفصيلية، واحترام رغبة النساء في حماية الخصوصية بشكل افتراضي، وتوفير آليات تواصل جادة، فإننا نمهد طريقاً شريفاً لتأسيس أسرة عراقية مستقرة.',
    philPoint1: 'مصمم مع الاحترام التام للثقافة والقيم العراقية الرصينة',
    philPoint2: 'بدون تمرير عشوائي. توافق مبني كلياً على القيم الثنائية',
    philPoint3: 'تحكم مطلق للمرأة في الخواص وجوانب الخصوصية',
    philPoint4: 'خصوصية متكاملة وتحكم كامل بقنوات التواصل والبيانات دون أي تدخل خارجي',
    philBtn: 'ابدأ خطوات الدخول والتسجيل المجاني',

    wizardTitle: 'خطوات التسجيل المستنير',
    wizardSub: 'يرجى إكمال المعايير الستة الموجهة أدناه لتأكيد غايتك بشكل سليم. غايتنا الوضوح والبعد عن الشكليات.',
    stepNum: 'الخطوة',
    nextStep: 'الخطوة التالية',
    prevStep: 'السابق',
    completeOnboard: 'إكمال وتأكيد التسجيل',
    fullName: 'الاسم الكامل',
    enterName: 'أدخل اسمك الكريم هنا',
    age: 'العمر',
    gender: 'الجنس',
    governorate: 'المحافظة',
    cityDistrict: 'القضاء / المنطقة أو المركز',
    profession: 'المهنة / طبيعة العمل',
    education: 'المستوى التعليمي',
    languagesSpoken: 'اللغات التي تتحدثها (افصل بينها بفاصلة)',
    marriageGoal: 'سقف التطلعات والأمنيات لبيت الزوجية والمستقبل',
    courtshipTimeline: 'الجدول الزمني المرتجى للخطوبة والإكليل',
    wantsChildren: 'الموقف من الإنجاب وتكوين البنين',
    communicationPreference: 'الخصوصية وتفضيلات التواصل المتبادل',
    photoPrivacySettings: 'الرغبة في خصوصية وظهور صورتك الشخصية',
    valuesPrompt: 'اختر أهم القيم والصفات التي تمثلك (اختر ٢ على الأقل)',

    exploreTitle: 'تصفح ملفات الخطوبة الأخلاقية',
    exploreSub: 'ملفات تعريفية جادة وصادقة لأشخاص يطمحون لبناء بيت كريم. لا وجود للتسلية والعبث، جميع الملفات موثقة.',
    filterButtonHide: 'إخفاء لوحة الفلترة',
    filterButtonShow: 'تعديل لوحة الفلترة والبحث',
    compatibleCount: 'ملفات توافق متطابقة',
    genderPref: 'جنس شريك الحياة المطلوب',
    ageSpectrum: 'مستوى الأعمار المستهدفة',
    educationLevel: 'المستوى الأكاديمي والتعليمي',
    professionCat: 'تصنيف مجالات العمل والمهن',
    seriousnessLevel: 'مستوى الجدية والالتزام بالوقت',
    courtshipValues: 'أسلوب وتفضيلات التواصل المفضلة',
    wantsKidsFilter: 'موقف الرغبة بالأطفال',
    smokePref: 'موقفه من التدخين والأركيلة',
    photoVisibilityState: 'حالة ظهور وحجب الصورة',
    verifiedOnly: 'الملفات الموثقة بالهوية فقط',
    resetParams: 'إعادة تعيين المعايير',
    noMatchesTitle: 'لا توجد نتائج متطابقة للأسف',
    noMatchesDesc: 'تصميمنا يعتمد معايير صارمة للمصداقية والتوافق. نقترح توسيع نطاق البحث في العمر أو البحث في محافظات عراقية أخرى لتوفيق النصيب.',
    noMatchesResetBtn: 'مسح فلاتر البحث النشطة',
    compatibilityBadge: 'نسبة التوافق',
    portraitProtected: 'الصورة محجوبة للخصوصية',
    photoUnlockPrompt: 'انقر على "إرسال طلب" لطلب رؤية الصورة بشكل آمن',
    sendRequest: 'إرسال طلب تواصل',
    requestPending: 'الطلب قيد المراجعة والقبول',
    requestPendingSub: 'تتم الموافقة التلقائية خلال ٢.٥ ثانية (محاكاة)',
    mutuallyConnected: 'تم التوافق والاتصال المتبادل! المحادثة ➔',
    viewDossier: 'عرض ملف التوافق الشامل والكامل ↗',
    closeDossier: 'إغلاق الملف والعودة',
    bioOverview: 'لمحة عامة وسيرة ذاتية',
    absoluteDealbreakers: 'أبرز الخطوط الحمراء والرفض المطلق',
    languagesText: 'اللغات المنطوقة:',

    chatTitle: 'غرفة المحادثة الخاصة والتواصل',
    chatSub: 'مساحة حوار وقورة ومبنية للخصوصية تركز على تشجيع الخطاب البناء.',
    privacyConsole: 'تفضيلات الخصوصية والتواصل الموجه',
    privacyConsoleDesc: 'مصمم خصيصاً للخصوصية؛ ميزات التحكم بالخصوصية مدمجة كلياً في تجربة الطرفين.',
    privateChatNotice: 'طلب تواصل وتعريف خاص ومحمي',
    chatMutualAgreement: 'المراسلات والتفاصيل تعريفيّة تخضع لإشرافكم واختياراتكم المتبادلة.',
    consentConfirmed: 'يتطلب توافق ثنائي متبادل لبدء الحوار.',
    typeMessage: 'اكتب رسالة محترمة وبناءة تناقش مستقبلكما...',
    sendBtn: 'إرسال',
    noConnectedMatches: 'لا يوجد شركاء توافق متصلين حتى الآن',
    noConnectedMatchesDesc: 'تفضل بزيارة صفحة "استكشاف الشركاء" للبحث عن من يطابق قيمك، ثم أرسل طلب تواصل. حالما يقبلون، ستفتح الغرفة فوراً!',
    noActiveConversation: 'لم يتم تفعيل أي محادثة جارية',
    noActiveConversationDesc: 'الرجاء اختيار أحد الشركاء المقبولين من القائمة الجانبية لبدء حوار وقور يهدف لتأسيس حياة سعيدة.',
    safetyNotice: '🔒 مصمم لحفظ الخصوصية؛ المحادثات ثنائية وخيار حظر التطفل مبرمج في واجهة التطبيق.',

    footerDesc: 'حلال مصمم للأشخاص الجادين الباحثين عن الزواج في إطار من الخصوصية، الكرامة، والاحترام المتبادل والمستقبل الواعد.',
    footerPledgeTitle: 'ميثاق الشرف الأخلاقي',
    footerPledgeDesc: 'باستخدامك لمنصة "حلال"، تتعهد أمام الله والجميع بالصدق التام، والبعد عن التسلية، وعدم تضييع الأوقات، والاعتذار المهذب والراقي في حال انعدام النصيب.',
    copyright: '© ٢٠٢٦ منصة حلال للزواج السعيد. بني بوعي تام وصوناً للكرامة.',
    privacyPolicy: 'سياسة الخصوصية',
    terms: 'شروط واستخدام الخدمة',
    idVerify: 'دليل توثيق الهوية والبطاقات'
  },
  ckb: {
    dir: 'rtl',
    brand: 'حەڵاڵ',
    slogan: 'نیاز و مەبەستی جدی • پەیوەندی بەڕێزەوە',
    tagline: 'تەنها بۆ هاوسەرگیری',
    marriageOnly: 'تەنها بۆ هاوسەرگیری',
    guestProfile: 'پڕۆفایلی میوان',
    welcome: 'بەخێربێیت',
    completeScore: 'تەواوکراوە',
    editDetails: 'دەستکاری زانیارییەکان',
    onboardNow: 'زانیارییەکانت بنووسە',

    overview: 'ڕووتەختی سەرەکی',
    onboarding: 'هەنگاوەکانی ناو تۆمارکردن',
    explore: 'دۆزینەوەی شەریک',
    chat: 'چاتی ڕێبەریکراو',

    heroTitle: 'هاوسەرگیری و خوازبێنی جدی لە عێراق بە پاراستنی بەهاکان',
    heroSub: 'پلاتفۆرمێکی بەڕێز و بەهادار، بە تایبەتی بۆ ئەو کەسانە دروستکراوە کە سەرگەرمی پێکهێنانی خێزانێکی بەختەوەر و سەرکەوتوون. بێ ڕاکێشانی بێسەرووبەر، پاراستنی تەواوی وێنەکان، و ڕوونی ڕەها.',
    iamMan: 'من پیاوم',
    iamManDesc: 'بە جدییەوە لە هەوڵی دۆزینەوەی هاوبەشێکم کە بگونجێت لەگەڵ بیرکردنەوە و بەهاکانمدا، بە خۆشەویستی و ڕێزەوە.',
    iamWoman: 'من ئافرەتم',
    iamWomanDesc: 'کۆنترۆڵی ڕەهای وێنەکان، بژاردەی گرنگی تایبەتگیری بە تەواوی لە ژێر دەسەڵاتت، و سیستمێکی هاوتاکردنی پێشکەوتوو بۆ پاراستنی کەرامەتت.',
    respectPortrayal: 'پیشاندانی شیاو و بەڕێز',
    protectedOptions: 'بژاردەی پاراستنی بەهێز',
    startBtn: 'بە نیازی پاکەوە دەست پێبکە',
    exploreMatchesBtn: 'دۆزینەوەی ڕاستەوخۆی هاوبەشی گونجاو',

    howItWorksTitle: 'گەشتێکی ڕێکخراو و بەڕێز',
    howItWorksSub: 'بە تەواوی دوور دەکەوینەوە لە پەیوەندی بێ بنەما و عەشوائی. ڕێگریت دەکەین بەرەو هەنگاوگەلێکی ڕوون و بەهادار.',
    step1Title: '١. دیاریکردنی پێوەرەکان',
    step1Desc: 'پڕۆفایلێکی ڕاستەقینە و ورد دروست بکە کە تیشک بخاتە سەر ئامانجەکانی ژیانت، خواستی تایبەتمەندێتی و پەیوەندیکردن، کاتی هاوسەرگیری، و نیشاندانی وێنەکەت.',
    step2Title: '٢. هاوتاکردن لەسەر بنەمای بەهاکان',
    step2Desc: 'پڕۆفایلی گونجاو لەسەرانسەری پارێزگاکانی عێراقدا بدۆزەرەوە، پاڵێوراو بە وردی لەسەر بنەمای زانستی و هاوبەشی بەهاکان.',
    step3Title: '٣. پەیوەندییەکی ئارام و پارێزراو',
    step3Desc: 'دەستپێکردنی پەیوەندی بە ناردنی داواکاری بۆ بینینی وێنەکان و ژووری گفتوگۆی تایبەتی و پارێزراو بۆ پێکهێنانی خێزان.',

    privacyTitle: 'کۆنترۆڵی کامڵی وێنەکان',
    privacySub: 'دابونەریت و ئاسودەیی تۆ هێڵی سوورمانە. ئێمە کۆنترۆڵکردنی وێنەکانت دەسپێرین بە دەستی خۆتەوە.',
    rule1Title: 'تایبەتمەندکردنی وێنە',
    rule1Desc: 'دەتوانیت وێنەکانت بە شێوەیەکی ناچالاک بهێڵیتەوە، یان نیشانی بدەیت، یان شێل بکەیت بە شێوەیەکی سەرەکی بە تایبەت بۆ خانمان.',
    rule2Title: 'نیشاندان تەنها لەسەر داخوازی',
    rule2Desc: 'پێویستە لایەنی بەرامبەر سەرەتا داخوازی پەیوەندی بنێرێت. وێنەکەت تەنها دوای قبوڵکردنی یەکلاکەرەوەی خۆت نیشان دەدرێت.',
    rule3Title: 'ڕێزگرتنێکی بەسەپێنراو لە سیستمدا',
    rule3Desc: 'گرتنی وێنەی سەر ڕوونما (سکشۆت) قەدەغەیە. ئەندامانمان بەڵێن دەدەن بە لێپرسراوێتی و ڕاستگۆییەوە کاربکەن.',

    safetyTitle: 'پێوەرەکانی متمانە و پاراستن',
    safetySub: 'یاسای جدی بەکاردەهێنین بۆ دڵنیابوون لە پاراستنی بەها کلتوری و ئیسلامییەکان.',
    pledgeTitle: 'بەڵێننامەی پێبەندبوون بە ڕازیبوون',
    pledgeDesc: 'هەموو ئەندامێک بەڵێن دەدات بە ڕاستگۆیی ڕەها و وەڵامدانەوەی شیاو و بەخشینی وەڵامی ڕێزدارانە لە کاتی گونجان یان نەگونجاندا.',
    verificationTitle: 'سەلماندنی ناسنامە بە گرنگییەوە',
    verificationDesc: 'دڵنیابوون لە ڕاستی ناسنامە عێراقیەکان تا حساباتی بێبایەخ قەدەغە بکەین.',
    privacyLockedTitle: 'پاراستن و پارێزگاری زانیاریەکان',
    privacyLockedDesc: 'ئێمە بەهیچ شێوەیەک زانیارییەکانت نافرۆشینەوە. هۆکارەکانی پەیوەندیکردنت بە شاراوەیی دەمێننەوە مەگەر خۆت ڕازی بیت.',

    philTitle: 'لەو شوێنەی کە مەبەستی جدی لە چوارچێوەیەکی پڕ کەرامەتدا بەدی دێت',
    philSub: 'فەلسەفە و پەیامی ئێمە',
    philDesc: 'ئێمە ئەپی "حەڵاڵ"مان دروستکرد چونکە ئەپەکانی تری ناسیاوی تەنها وەک کات بەسەربردن سەیری مرۆڤ دەکەن. لێرە بە دیاریکردنی زانیاری ورد، ڕێزگرتن لە تایبەتمەندی ئافرەتان، و دروستکردنی کەرەستەی دروستی پەیوەندیکردن، ڕێگەیەکی شەرەفمەندانە دەکشێنین بۆ پێکهێنانی خێزانێکی جێگیر.',
    philPoint1: 'دیزاین کراوە بە ڕێزگرتنی تەواو لە کلتور و دابونەریتی عێراقی',
    philPoint2: 'بێ بوونی پێوەرە گێژکەرەکان. گونجان تەنها لەسەر بناغەی بەهاکانە',
    philPoint3: 'کۆنترۆڵی ڕەهای ئافرەتان بەسەر بەشی تایبەتمەندێتی',
    philPoint4: 'کۆنترۆڵی جدی لەسەر تایبەتمەندێتی و ڕێگری لە هەر چاودێرییەکی دەرەکی',
    philBtn: 'دەست بکە بە تۆمارکردنی ناوی بێبەرامبەر',

    wizardTitle: 'هەنگاوەکانی تۆمارکردنی ناو بە ڕێبەرایەتی',
    wizardSub: 'تکایە ٦ پێوەری گرنگی لای خوارەوە پڕبکەرەوە تا مەبەستەکانت ڕوون بکەیتەوە. کارمان ڕوونکردنەوە و دوورکەوتنەوەیە لە کات بەسەربردن.',
    stepNum: 'هەنگاوی',
    nextStep: 'هەنگاوی داهاتوو',
    prevStep: 'پێشوو',
    completeOnboard: 'کۆتاییهێنان بە تۆمارکردن',
    fullName: 'ناوی تەواو',
    enterName: 'ناوت لێرە بنووسە',
    age: 'تەمەن',
    gender: 'ڕەگەز',
    governorate: 'پارێزگا',
    cityDistrict: 'قەزا یان ناحیە یان سەنتەر',
    profession: 'پیشه / جۆری کار',
    education: 'ئاستی خوێندن',
    languagesSpoken: 'ئەو زمانانەی قسەی پێدەکەیت (بە کۆما جیایان بکەرەوە)',
    marriageGoal: 'ئاوات و تێڕوانینەکانت بۆ هاوسەرگیری و پاشەڕۆژ',
    courtshipTimeline: 'ماوەی خوازراو بۆ گەیشتن بە هاوسەرگیری',
    wantsChildren: 'بۆچوون لەسەر منداڵبوون',
    communicationPreference: 'تایبەتمەندێتی و خواستی پەيوەندیکردنی دوولایەنە',
    photoPrivacySettings: 'خواستی نیشاندانی وێنەی سەرەکیت',
    valuesPrompt: 'بەها و سیفاتە گرنگەکانی خۆت هەڵبژێرە (کەمترین ٢ بەها)',

    exploreTitle: 'گەڕان بەدوای پڕۆفایلە ڕاستەقینەکاندا',
    exploreSub: 'پڕۆفایلی جدی بۆ ئەو کەسانەی هیوای دروستکردنی خێزانیان هەیە. بێ بوونی یاری و لادان، هەموو پڕۆفایلەکان موثقن.',
    filterButtonHide: 'شاردنەوەی بەشی پاڵاوتن',
    filterButtonShow: 'تەواوکاری و گۆڕینی بەشی پاڵاوتن',
    compatibleCount: 'پڕۆفایلی گونجاوی دۆزراوە',
    genderPref: 'ڕەگەزی هاوبەش',
    ageSpectrum: 'مەودای تەمەنی شیاو',
    educationLevel: 'ئاستی خوێندەواری',
    professionCat: 'پۆلێنکردنی کارەکان',
    seriousnessLevel: 'ئاستی جدیات و کات بەسەربردن',
    courtshipValues: 'خواستی پەیوەندیکردنی تایبەت',
    wantsKidsFilter: 'خواستی منداڵبوون',
    smokePref: 'کێشانی جگەرە یان نێرگەلە',
    photoVisibilityState: 'دۆخی نیشاندانی وێنەکان',
    verifiedOnly: 'تەنها پڕۆفایلە موثقەکان',
    resetParams: 'پێوەرەکان سەرەتا بکەرەوە',
    noMatchesTitle: 'بەداخەوە هیچ پڕۆفایلێک نەدۆزرایەوە',
    noMatchesDesc: 'سیستمەکەمان پشت بە پاڵاوتنی جدی دەبەستێت. پێشنیار دەکەین تەمەن یان شوێن فراوانتر بکەیت تا هاوبەشی گونجاو بدۆزیتەوە.',
    noMatchesResetBtn: 'پاککردنەوەی فلتەرەکان',
    compatibilityBadge: 'گونجاوی پێوانەیی',
    portraitProtected: 'وێنەکە پارێزراوە',
    photoUnlockPrompt: 'کلیک بکە لەسەر "ناردنی داخوازی" بۆ بینینی وێنەکە به ئارامی',
    sendRequest: 'ناردنی داواکاری پەیوەندی',
    requestPending: 'داواکاریەکە لە ژێر چاودێریدایە',
    requestPendingSub: 'پەسەندکردنی خۆکار لە ٢.٥ چرکەدا دەبێت (محاکاة)',
    mutuallyConnected: 'هاوتا بوون دروستبوو! چات بکە ➔',
    viewDossier: 'پیشندانی زانیاری تەواوی پڕۆفایلەکە ↗',
    closeDossier: 'داخستن و گەڕانەوە',
    bioOverview: 'ژیاننامە و سەرنجی گشتی',
    absoluteDealbreakers: 'هێڵە سوورەکان و نەگونجانی ڕەها',
    languagesText: 'زمانەکان:',

    chatTitle: 'ژووری گفتوگۆی تایبەتی و پەیوەندی متمانە',
    chatSub: 'ژوورێکی گفتوگۆی تایبەت و ڕێزگرتن کە بۆ پاراستنی نهێنی و هاندانی گفتوگۆی جدی دروستکراوە.',
    privacyConsole: 'تایبەتمەندێتی و ئاسایشی پەیوەندیکردن',
    privacyConsoleDesc: 'تایبەتمەندییەکان بە شێوازی لۆکاڵی بۆ پاراستنی نهێنی تۆ دروستکراون پێش بەستنەوەی سێرڤەر.',
    privateChatNotice: 'داواکاری ناساندنی تایبەت و پارێزرا',
    chatMutualAgreement: 'گفتوگۆ تەنها لە نێوان خۆتان و کەسی گونجاودا دەمێنێتەوە بە خواستی خۆتان.',
    consentConfirmed: 'ڕەزامەندی دوولایەنە پێویستە بۆ دەستپێکردنی چات.',
    typeMessage: 'پەیامێکی کورت و بەڕێز بنووسە لەسەر داهاتووتان...',
    sendBtn: 'ناردن',
    noConnectedMatches: 'تاکو ئێستا هیچ هاوبەشێکی گونجاو نادۆزراوەتەوە',
    noConnectedMatchesDesc: 'تکایە بچۆ بەشی دۆزینەوەی شەریک تا داواکاری بنێریت. کاتێک بە دەم وەڵامەکەتەوە دێن ژوورەکە بە دەستبەجێ چالاک دەبێت.',
    noActiveConversation: 'گفتوگۆیەکی چالاک نییە',
    noActiveConversationDesc: 'تکایە یەکێک لە هاوبەشەکان هەڵبژێرە لەم لایەوە تا گفتوگۆیەکی شیاو و بەپلان دەست پێبکەن.',
    safetyNotice: '🔒 نەخشەی تایبەت بۆ پاراستنی نهێنی لەناو بەرنامەکەدا بەکار دێت.',

    footerDesc: 'هاوسەرگیری جدی بە مەبەستی پێکەوە گرێدانی دڵ و مێشکی بەشداربووان بۆ دروستکردنی پەیوەندییەکی هاوسەری هاوبەش لەسەر بناغەی ڕێز و خۆشەویستی بێ چاودێری دەرەکی.',
    footerPledgeTitle: 'بەڵێننامەی بەهادار و کەرامەت',
    footerPledgeDesc: 'بە بەکارهێنانی "حەڵاڵ"، بەڵێن دەدەیت لەبەردەم خوا و ویژدانی خۆتدا بە تەواوی ڕاستگۆ بیت، دووربکەویتەوە لە گاڵتەجاڕی، و داوای لێبوردنی بەڕێز بکەیت لە کاتی نەگونجاندا.',
    copyright: '© ٢٠٢٦ پلاتفۆرمی حەڵاڵ بۆ هاوسەرگیری بەختەوەر. بە تەواوی بۆ پاراستنی کەرامەت دروستکراوە .',
    privacyPolicy: 'یاسای پاراستنی نهێنی',
    terms: 'مەرجەکانی بەکارهێنان',
    idVerify: 'ڕێبەری سەلماندنی ناسنامە'
  }
};
