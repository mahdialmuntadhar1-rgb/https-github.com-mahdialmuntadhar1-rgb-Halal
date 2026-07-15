import { MatchProfile } from '../types';

// Helper lists of culturally relevant first names for Iraqi regions
const FEMALE_ARABIC_NAMES = [
  "Noor", "Zainab", "Fatima", "Sara", "Mariam", "Safa", "Reem", "Aya", "Huda", 
  "Khadija", "Zahra", "Ruqayya", "Ghadir", "Ban", "Raghad", "Manar", "Duaa", "Kawthar",
  "Bushra", "Alaa", "Hajar", "Haya", "Kholoud", "Shahad", "Dunya", "Amina", "Nabaa",
  "Tiba", "Ola", "Sama", "Sarah", "May", "Yara", "Rania", "Salma", "Nour", "Rana",
  "Heba", "Duha", "Esraa", "Asma", "Basma", "Ghalia", "Jannat", "Layan", "Mais", "Nisreen",
  "Suhair", "Wafaa", "Sawsan", "Rasha", "Amani", "Mona", "Khulood", "Zubaida", "Yasmin",
  "Farah", "Ghada", "Sahar", "Inas", "Amira", "Dina", "Hala", "Yasmine", "Rawan", "Maya"
];

const MALE_ARABIC_NAMES = [
  "Adam", "Zaid", "Mustafa", "Ali", "Hussein", "Ahmed", "Hassan", "Yassir", "Mahmoud", 
  "Ibrahim", "Haidar", "Abbas", "Murtadha", "Sajad", "Ridha", "Amjad", "Karrar", "Muhannad",
  "Jaafar", "Yahya", "Khalid", "Muntadher", "Mahdi", "Maytham", "Raed", "Yousef", "Saif",
  "Samer", "Laith", "Fahad", "Firas", "Omer", "Bilal", "Tariq", "Zakarriya", "Adnan",
  "Waleed", "Hisham", "Bassam", "Nael", "Sarmad", "Qasim", "Rami", "Jamil", "Anas", "Louay",
  "Hani", "Saeed", "Karim", "Wassim", "Nader", "Amer", "Ghaith", "Mazen", "Ziyad", "Fadi"
];

const FEMALE_KURDISH_NAMES = [
  "Lina", "Avan", "Dilan", "Shene", "Rojin", "Tara", "Choman", "Sheno", "Berivan", "Sazan", 
  "Vian", "Naz", "Kani", "Nishtiman", "Pervin", "Renas", "Darya", "Soma", "Chnar", "Diman",
  "Hero", "Kazhal", "Nia", "Payman", "Rezhin", "Shara", "Kwestan", "Tania", "Chra", "Nian",
  "Sakar", "Triska", "Zhin", "Lozan", "Sora", "Parez", "Neshtiman", "Halala", "Helin", "Kajhal"
];

const MALE_KURDISH_NAMES = [
  "Omar", "Baran", "Karwan", "Hawar", "Ari", "Soran", "Hawkar", "Hejar", "Alan", "Zana", 
  "Sherko", "Rebin", "Saman", "Aso", "Hezo", "Kardo", "Daban", "Hiwa", "Ranj", "Shamil",
  "Goran", "Dyar", "Peshawa", "Bahman", "Bryar", "Rawand", "Dana", "Twana", "Hardy", "Zyar",
  "Heeshma", "Sarkawt", "Aram", "Rebwar", "Rizgar", "Bakhtiar", "Sardar", "Hemin", "Hawraz"
];

const FEMALE_TURKMEN_NAMES = [
  "Leyla", "Amira", "Selma", "Ayla", "Gunesh", "Sevda", "Nazli", "Shirin", "Dilara", "Aysel"
];

const MALE_TURKMEN_NAMES = [
  "Bilal", "Adnan", "Yasin", "Murat", "Sinan", "Turgut", "Kermal", "Eren", "Can", "Hakan"
];

// Family Names for complete authentic presentation
const ARABIC_FAMILY_NAMES = [
  "Al-Musawi", "Al-Saadi", "Al-Kaabi", "Al-Rubaie", "Al-Darraji", "Al-Khafaji", 
  "Al-Janabi", "Al-Shammari", "Al-Sudani", "Al-Ghazzi", "Al-Mayahi", "Al-Lami", 
  "Al-Fadhli", "Al-Zubaidi", "Al-Tai", "Al-Dulaimi", "Al-Ghazali", "Al-Askari", 
  "Al-Bayati", "Al-Temimi", "Al-Hashemi", "Al-Jubouri", "Al-Husseini", "Al-Abadi",
  "Al-Sadr", "Al-Suhail", "Al-Gharawi", "Al-Maliki", "Al-Assadi", "Al-Baldawi"
];

const KURDISH_FAMILY_NAMES = [
  "Barzani", "Talabani", "Sindi", "Soran", "Goran", "Slemani", "Hawleri", 
  "Zangana", "Sherwani", "Bradosti", "Jaff", "Dizayee", "Kooyi", "Karkuki", 
  "Pishdari", "Girdi", "Shaswar", "Chali", "Miran", "Mukri", "Baban", "Sharafani"
];

const TURKMEN_FAMILY_NAMES = [
  "Koylu", "Kirkuklu", "Tuzhurmatlu", "Demirci", "Bayatli", "Guneshli", "Sarraf", "Kasapoglu"
];

// 19 Iraqi governorates
const GOVERNORATES = [
  { name: "Baghdad", isKurdish: false, isMixed: false, defaultSect: "shiaa" },
  { name: "Basra", isKurdish: false, isMixed: false, defaultSect: "shiaa" },
  { name: "Nineveh", isKurdish: false, isMixed: true, defaultSect: "sunni" },
  { name: "Erbil", isKurdish: true, isMixed: false, defaultSect: "sunni" },
  { name: "Sulaymaniyah", isKurdish: true, isMixed: false, defaultSect: "sunni" },
  { name: "Duhok", isKurdish: true, isMixed: false, defaultSect: "sunni" },
  { name: "Kirkuk", isKurdish: false, isMixed: true, defaultSect: "sunni" },
  { name: "Diyala", isKurdish: false, isMixed: true, defaultSect: "shiaa" },
  { name: "Anbar", isKurdish: false, isMixed: false, defaultSect: "sunni" },
  { name: "Salah al-Din", isKurdish: false, isMixed: false, defaultSect: "sunni" },
  { name: "Babil", isKurdish: false, isMixed: false, defaultSect: "shiaa" },
  { name: "Karbala", isKurdish: false, isMixed: false, defaultSect: "shiaa" },
  { name: "Najaf", isKurdish: false, isMixed: false, defaultSect: "shiaa" },
  { name: "Wasit", isKurdish: false, isMixed: false, defaultSect: "shiaa" },
  { name: "Qadisiyah", isKurdish: false, isMixed: false, defaultSect: "shiaa" },
  { name: "Maysan", isKurdish: false, isMixed: false, defaultSect: "shiaa" },
  { name: "Dhi Qar", isKurdish: false, isMixed: false, defaultSect: "shiaa" },
  { name: "Muthanna", isKurdish: false, isMixed: false, defaultSect: "shiaa" },
  { name: "Halabja", isKurdish: true, isMixed: false, defaultSect: "sunni" }
];

// Unsplash stock portraits: Respectful, high-quality, diverse views
const FEMALE_AVATARS = [
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=400"
];

// Beautiful, dignified abstract/nature placeholders for highly private profiles (silhouettes / soft-focus privacy art)
const FEMALE_PRIVACY_PLACEHOLDERS = [
  "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=400", // Floral Fine Art
  "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=400", // Green Foliage
  "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=400", // Elegant Soft Calligraphy-like Wave
  "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=400", // Wildflower Field
  "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=400", // Soft ancient trees
  "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&q=80&w=400", // Misty forest lines
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=400"  // Serene sea waves
];

// Men's portraits representing varied clothes, angles, distances, and poses
const MALE_AVATARS = [
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400", // Close-up portrait
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400", // Outdoor candid
  "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400", // Office background, cheerful pose
  "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=400", // Upper body, warm outdoor
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400", // High contrast neutral portrait
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400", // Full standing pose, professional
  "https://images.unsplash.com/photo-1489980508314-941910ded1f4?auto=format&fit=crop&q=80&w=400", // Casual upper body, room backdrop
  "https://images.unsplash.com/photo-1500048993953-d23a436266cf?auto=format&fit=crop&q=80&w=400", // Sporty, farther away
  "https://images.unsplash.com/photo-1506803682981-6e718a9dd3ee?auto=format&fit=crop&q=80&w=400", // Cozy sweater, side view
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400", // Candid street walking, further crop
  "https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?auto=format&fit=crop&q=80&w=400", // Serious pose in garden
  "https://images.unsplash.com/photo-1480429370139-e0132c086e2a?auto=format&fit=crop&q=80&w=400", // Outdoors, casual marine look
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400", // Elegant corporate formal suit
  "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=400", // Standing candid, natural light
  "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=400", // Relaxed casual at home
  "https://images.unsplash.com/photo-1542156822-6924d1a71aba?auto=format&fit=crop&q=80&w=400", // Artistic framing, further distance
  "https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&q=80&w=400", // Side portrait smile
  "https://images.unsplash.com/photo-1504257400765-177778949f25?auto=format&fit=crop&q=80&w=400"  // Dynamic outdoor walking pose
];

const PROFESSIONS_FEMALE = [
  { title: "Clinical Pharmacist", edu: "Doctor of Pharmacy (PharmD)" },
  { title: "Elementary School Teacher", edu: "Bachelor of Education, University level" },
  { title: "Software Engineer", edu: "B.Sc. in Computer Science" },
  { title: "Architectural Preservationist", edu: "Bachelor of Architecture" },
  { title: "Pediatric Nurse Practitioner", edu: "B.Sc. in Nursing Science" },
  { title: "Human Resources Officer", edu: "BBA in Business Administration" },
  { title: "Speech & Language Therapist", edu: "B.Sc. in Speech Therapy" },
  { title: "Graphic Arts Designer", edu: "Bachelor of Fine Arts" },
  { title: "Agribusiness Supervisor", edu: "B.Sc. in Agriculture & Extension" },
  { title: "Nutrition Coach & Dietitian", edu: "B.Sc. in Clinical Nutrition" },
  { title: "Laboratory Technologist", edu: "B.Sc. in Medical Laboratory Science" },
  { title: "Secondary School English Teacher", edu: "Bachelor of Arts in English Literature" },
  { title: "Interior Designer", edu: "Bachelor of Interior Design" },
  { title: "Public Relations Specialist", edu: "B.A. in Mass Communication" },
  { title: "Dental Practitioner", edu: "Bachelor of Dental Surgery (BDS)" },
  { title: "Bank Operations Analyst", edu: "B.Sc. in Finance & Banking" },
  { title: "Civil Engineer", edu: "B.Sc. in Civil Engineering" },
  { title: "Special Education Instructor", edu: "Bachelor in Special Education Needs" }
];

const PROFESSIONS_MALE = [
  { title: "Renewable Systems Engineer", edu: "B.Sc. in Electrical Engineering" },
  { title: "Sustained Agriculture Lead", edu: "B.Sc. in Agribusiness & Soil" },
  { title: "Cardiologist Fellow", edu: "MD & Board Certification in Medicine" },
  { title: "Municipal Grid Planner", edu: "B.Sc. in Civil & Urban Engineering" },
  { title: "High School History Teacher", edu: "Bachelor of Arts & History Studies" },
  { title: "IT Solutions Developer", edu: "B.Sc. in Software Engineering" },
  { title: "Maritime Logistics Specialist", edu: "B.Sc. in Supply Chain Management" },
  { title: "Hydrology Engineer", edu: "B.Sc. in Water Resource Management" },
  { title: "Corporate Legal Analyst", edu: "Bachelor of Laws (LL.B.)" },
  { title: "Telecom Network Specialist", edu: "B.Sc. in Communications Engineering" },
  { title: "Mechanical Maintenance Supervisor", edu: "B.Sc. in Mechanical Engineering" },
  { title: "Business Consultant", edu: "Master of Business Administration (MBA)" },
  { title: "General Surgeon Resident", edu: "MD / MBChB Medicine Degree" },
  { title: "Data Center Architect", edu: "B.Sc. in Computer Engineering" },
  { title: "High School Physics Instructor", edu: "B.Sc. in Physics & Education" },
  { title: "Urban Drainage Engineer", edu: "B.Sc. in Water Engineering" },
  { title: "Financial Risk Manager", edu: "B.Sc. in Financial Sciences" },
  { title: "Petroleum Reservoir Engineer", edu: "B.Sc. in Petroleum Engineering" }
];

// Generate structured data programmatically to guarantee 380 high quality profiles
function generateMatches(): MatchProfile[] {
  const list: MatchProfile[] = [];
  
  // Handcrafted foundational profiles to guarantee exact continuity for features & landing highlight overlays
  const customMatches: Record<string, Partial<MatchProfile>> = {
    'f1': {
      name: 'Lina Al-Jaff',
      age: 26,
      gender: 'female',
      governorate: 'Sulaymaniyah',
      ethnicity: 'kurdish',
      sect: 'sunni',
      profession: 'Elementary Arabic Teacher',
      education: 'Bachelor of Education, University of Sulaimani',
      aboutMe: 'من لینا جەفم، ٢٦ ساڵم. وەک مامۆستای قوتابخانەی بنەڕەتی کاردەکەم لە سلێمانی جوان. خوێندنەوەی کتێبی بەسوود، کالیگرافی و چاندنی گوڵ گرنگترین خولیای منن. کچێکی هێمن، ڕێزدار و بەڕوشتم.',
      intention: 'دەخوازم هاوسەرگیری لەگەڵ پیاوێکی بەڕێز و بەرپرسیار بکەم بۆ دروستکردنی خێزانێکی بەختیار و پڕ لە هێمنی و ئارامی لەسەر بنەمای لێکتێگەیشتن و ڕاوێژی دوولایەنە.',
      valuesSummary: ['Family First', 'Spiritual Devotion', 'Integrity', 'Soft-spoken'],
      photoStatus: 'blurred',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
      compatibilityScore: 94,
      dealbreakers: ['Smoking', 'Irresponsibility']
    },
    'm1': {
      name: 'Adam Al-Musawi',
      age: 29,
      gender: 'male',
      governorate: 'Baghdad',
      ethnicity: 'arab',
      sect: 'shiaa',
      profession: 'Renewable Systems Engineer',
      education: 'B.Sc. in Electrical Engineering, Baghdad University',
      aboutMe: 'أنا آدم الموسوي، أبلغ من العمر 29 عاماً، وأعمل كمهندس شبكات طاقة متجددة في بغداد. أوازن بين السعي العملي الدؤوب وحياتي الروحية، وفي وقت فراغي أحب المطالعة وبر الوالدين والمشاركة في الأنشطة الاجتماعية.',
      intention: 'مستعد لتأسيس بيت زوجي مستقر ومبارك مبني على الاحترام والمودة والرحمة، مع تقديم كامل الدعم والتقدير لشريكة عمري وتوفير حياة كريمة لها ونقاسم المسؤوليات بالشورى.',
      valuesSummary: ['Intellectual Growth', 'Financial Prudence', 'Respectful Boundaries', 'Faith'],
      photoStatus: 'visible',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
      compatibilityScore: 92,
      dealbreakers: ['Smoking', 'Dishonesty']
    },
    'f2': {
      name: 'Noor Al-Saadi',
      age: 27,
      gender: 'female',
      governorate: 'Baghdad',
      ethnicity: 'arab',
      sect: 'sunni',
      profession: 'Clinical Pharmacist',
      education: 'Doctor of Pharmacy (PharmD), College of Pharmacy',
      aboutMe: 'أنا نور السعدي، أبلغ من العمر 27 عاماً، وأعمل كطبيبة صيدلانية في بغداد الحبيبة. أهتم كثيراً بالقيم الدينية والتقاليد العراقية الأصيلة، وأقضي أوقات فراغي في القراءة الهادفة والاهتمام بالعائلة والطبخ الصحي.',
      intention: 'أرغب في تكوين أسرة مستقرة مبنية على الاحترام المتبادل والمشورة (الشورى)، مع رفيق درب يقدر طموحي العملي والتعليمي ويساندني في طاعة الله وتربية أبناء صالحين.',
      valuesSummary: ['Professional Respect', 'Empathy', 'Structured Home', 'Social Sincerity'],
      photoStatus: 'blurred',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      compatibilityScore: 89,
      dealbreakers: ['Smoking', 'Angry Temperament']
    },
    'm2': {
      name: 'Omar Barzani',
      age: 31,
      gender: 'male',
      governorate: 'Erbil',
      ethnicity: 'kurdish',
      sect: 'sunni',
      profession: 'Cardiologist',
      education: 'MD & Specialized Training in Internal Medicine',
      aboutMe: 'من عومەر بارزانیم، تەمەنم ٣١ ساڵە. پزیشکی پسپۆڕی دڵم لە شاری هەولێری دێرین. هەمیشە هاوسەنگی دەپارێزم لە نێوان کار و ئەرکە ئاینییەکانمدا. حەز بە وەرزش و گەشت لە ناو سروشتی جوانی کوردستان دەکەم.',
      intention: 'هیوادارم هاوبەشێکی ژیانی دڵسۆز و هێمن بدۆزمەوە کە ببێتە هاودەمی تەمەنم، بۆ دروستکردنی خێزانێکی بەختیار لەسەر بنەمای لێکتێگەیشتن و دابینکردنی ژیانێکی شایستە بۆی بە پاڵپشتی تەواوی من.',
      valuesSummary: ['Family Anchors', 'Patience', 'Spiritual Clarity', 'Generosity'],
      photoStatus: 'visible',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
      compatibilityScore: 96,
      dealbreakers: ['Immaturity', 'Irresponsible behavior']
    },
    'f3': {
      name: 'Sara Al-Kaabi',
      age: 25,
      gender: 'female',
      governorate: 'Najaf',
      ethnicity: 'arab',
      sect: 'shiaa',
      profession: 'Heritage Architect',
      education: 'Bachelor of Architecture, Kufa University',
      aboutMe: 'أنا سارة الكعبي، عمري 25 سنة، حاصلة على بكالوريوس الهندسة المعمارية وأعمل كمصممة صيانة تراثية في النجف الأشرف. هادئة الطباع وملتزمة بحدود الخصوصية والوقار، وأعشق الخط العربي والآثار وقضاء الوقت مع عائلتي.',
      intention: 'أتمنى الارتباط بإنسان واعي ومحترم يتفهم قيمة الأسرة ويشاركني بناء حياة كريمة، ملتزماً بالعهود والأخلاق الإسلامية والتقاليد العراقية الأصيلة لنبني بيتاً مليئاً بالهدوء والاستقرار.',
      valuesSummary: ['Culture & Wisdom', 'Fidelity', 'Aesthetic Calm', 'High Boundaries'],
      photoStatus: 'hidden',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400',
      compatibilityScore: 87,
      dealbreakers: ['Smoking', 'No family values']
    },
    'm3': {
      name: 'Zaid Al-Rubaie',
      age: 28,
      gender: 'male',
      governorate: 'Basra',
      ethnicity: 'arab',
      sect: 'shiaa',
      profession: 'Sustained Farming Startup Lead',
      education: 'B.Sc. in Agribusiness, Basra University',
      aboutMe: 'أنا زيد الربيعي، عمري 28 سنة، أعمل كمسؤول مشروع زراعي مستدام في البصرة العزيزة. شخص هادئ ومتزن، ملتزم بواجباتي الاجتماعية، وأحب الرحلات النهرية الهادئة ومطالعة الكتب التاريخية والفكرية.',
      intention: 'أسعى للارتباط بامرأة طيبة الأخلاق وقورة لنكون لبعضنا سنداً ورفيقين في الدنيا والآخرة، لتأسيس بيت مبارك ومستقر يسوده الاحترام المتبادل والمحبة العميقة مع بر والدين متبادل.',
      valuesSummary: ['Sustainability', 'Patience', 'Empathy', 'Respectful Boundaries'],
      photoStatus: 'visible',
      avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400',
      compatibilityScore: 91,
      dealbreakers: ['Vanity', 'Disrespectful language']
    },
    'f4': {
      name: 'Tara Soran',
      age: 29,
      gender: 'female',
      governorate: 'Duhok',
      ethnicity: 'kurdish',
      sect: 'sunni',
      profession: 'Software Developer & Technical Writer',
      education: 'B.Sc. in Computer Science, Duhok University',
      aboutMe: 'من تارا سۆران، تەمەنم ٢٩ ساڵە. گەشەپێدەری نەرمەکاڵام لە شاری دهۆکی ڕەنگین. کەسێکی ڕاستگۆم و ڕێز لە مەرجە بەرزە ئەخلاقییەکان و سنورە تایبەتەکان دەگرم. حەزم بە لێکۆڵینەوە، سروشت و گەشتکردنە.',
      intention: 'دەخوازم هاوسەرێکی دیندار و خاوەن ڕەوشتێکی بەرز بدۆزمەوە کە دڵسۆزی خێزان بێت، بۆ پێکەوەنانی ماڵێکی پڕ لە ئارامی و دڵخۆشی بەپێی دابونەریتی کوردی و پاراستنی حەیا و ڕێزگرتن لە یەکتر.',
      valuesSummary: ['Intellectual Honesty', 'Spiritual Anchoring', 'Humor', 'Supportive'],
      photoStatus: 'initials',
      avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=400',
      compatibilityScore: 90,
      dealbreakers: ['Angry temperament', 'No professional ambition']
    },
    'm4': {
      name: 'Mustafa Al-Janabi',
      age: 32,
      gender: 'male',
      governorate: 'Nineveh',
      ethnicity: 'arab',
      sect: 'sunni',
      profession: 'Municipal Grid Coordinator',
      education: 'B.Sc. in Engineering, University of Mosul',
      aboutMe: 'أنا مصطفى الجنابي، أبلغ من العمر 32 عاماً، وأعمل كمنسق شبكات خدمية في الموصل الحدباء. إنسان هادئ ومتزن، أهتم بالعمل التطوعي وخدمة المجتمع وبناء جيل صالح قائم على الصدق المطلق والأمانة والتضامن.',
      intention: 'أتطلع للعثور على شريكة حياة صالحة وهادئة الطباع لتكون رفيقة دربي، لبناء أسرة سعيدة قائمة على التفاهم والمشورة (الشورى) وتوفير حياة كريمة وآمنة لها بما يرضي الله تبارك وتعالى.',
      valuesSummary: ['Devotion to Elders', 'Quiet Dignity', 'Honesty', 'Reliability'],
      photoStatus: 'visible',
      avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=400',
      compatibilityScore: 91,
      dealbreakers: ['Smoking', 'Irresponsible behavior']
    },
    'm5': {
      name: 'Baran Goran',
      age: 27,
      gender: 'male',
      governorate: 'Sulaymaniyah',
      ethnicity: 'kurdish',
      sect: 'sunni',
      profession: 'Graphic Designer & Visualizer',
      education: 'Bachelor of Fine Arts, Sulaimani University',
      aboutMe: 'من باران گۆرانم، تەمەنم ٢٧ ساڵە. دیزاینەری گرافیکم لە شاری سلێمانی. کەسێکی لەسەرخۆم و حەز بە گفتوگۆی عەقڵانی دەکەم، گرنگی بە هونەری فۆتۆگرافی و گەشتی سروشت دەدەم و زۆر بە توندی بڕوام بە بەها خێزانییەکان هەیە.',
      intention: 'بەدوای هاوسەرێکی هێمن و بەڕێزدا دەگەڕێم کە ڕێزی دایک و باوک بگرێت، بۆ بنیادنانی ماڵێکی دڵخۆش و هێمن کە تێیدا ڕێزگرتن و بەزەیی دوولایەنە بڕیاردەری ژیانمان بێت بە دڵسۆزی.',
      valuesSummary: ['Artistic Appreciation', 'Serenity', 'Fidelity', 'Humility'],
      photoStatus: 'initials',
      avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400',
      compatibilityScore: 88,
      dealbreakers: ['Inconsiderateness', 'Dishonesty']
    },
    'f5': {
      name: 'Avan Talabani',
      age: 31,
      gender: 'female',
      governorate: 'Kirkuk',
      ethnicity: 'kurdish',
      sect: 'sunni',
      profession: 'Financial Inspector',
      education: 'Bachelor of Audit and Accounts, Kirkuk University',
      aboutMe: 'من ئەڤان تاڵەبانیم، تەمەنم ٣١ ساڵە. پشکنەری داراییم لە شاری کەرکوک. کەسێکی ڕاستگۆ و جدی و بەرپرسیارم، پابەندم بە ئەركە دینی و ئەخلاقییەکانم و کاتی بەتاڵم بە خوێندنەوە و هاوکاری دایکو باوکم بەسەر دەبەم.',
      intention: 'ئارەزوو دەکەم لەگەڵ مرۆڤێکی ڕێزدار و پێگەیشتوو هاوسەرگیری بکەم بۆ بنیادنانی ژیانێکی جێگیر، کە تێیدا ڕێزگرتن لە طموح و خوێندنم هەبێت و منداڵەکانمان لەسەر تەقوا و لێکتێگەیشتن پێکەوە گەورە بکەین.',
      valuesSummary: ['Logical Clarity', 'Ethical Practice', 'Spiritual Stability', 'Commitment'],
      photoStatus: 'hidden',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400',
      compatibilityScore: 85,
      dealbreakers: ['Inconsistency', 'Smoking']
    }
  };

  // Modular generator arrays for building highly realistic, unique biographies and intentions
  // -----------------------------------------------------------------------------------------
  
  // Female Arabic Bio Elements
  const FE_AR_INTRO = [
    "أنا [name]، أبلغ من العمر [age] عاماً، وأعمل كـ [profession] في مدينة [city] الجميلة.",
    "اسمي [name]، عمري [age] سنة، وأعمل في مجال [profession] في [city]، حاصلة على [education].",
    "معكم [name] ([age] عاماً)، أعمل بكل فخر كـ [profession] في [city]. إنسانة جادة وهادئة.",
    "أنا [name]، خريجة [education] وأعمل حالياً كـ [profession] في ربوع [city]."
  ];
  const FE_AR_TRAIT = [
    " أهتم كثيراً بالقيم الدينية والثقافة العراقية الأصيلة، وأحب المطالعة الهادفة وتعلم لغات جديدة والاهتمام بالعائلة.",
    " أقضي أوقات فراغي في قراءة كتب التنمية البشرية والخط العربي وتنسيق الزهور والطبخ الصحي الصافي.",
    " أنا شخصية هادئة الطباع ومتزنة، أقدر الحوار العقلاني الرصين وأحب قضاء الوقت مع والدتي ومساعدة المحتاجين.",
    " أهتم بنمط الحياة الصحي المتوازن، وأعشق التاريخ والآثار العراقية العريقة، وأسعى دوماً لتطوير مهاراتي العملية."
  ];
  const FE_AR_VALUE = [
    " وأؤمن بأن الاحترام المتبادل والستر والتقاليد الاجتماعية الطيبة هي ركيزة النجاح في الحياة والأسرة السعيدة.",
    " وأعتبر طاعة الله والبر بالوالدين أساس البركة في حياتي، وأحب أن تكون خطوطي في الحياة واضحة وصريحة للغاية.",
    " وأهتم جداً بالحفاظ على حيائي وخصوصيتي كإمرأة عراقية أصيلة، وأتطلع لتأسيس شراكة حقيقية تملؤها المودة المتبادلة.",
    " وأبحث عن هدوء النفس والاستقرار الفكري، وأرى أن البيت هو الملاذ الآمن لتربية جيل متمسك بالقيم والأخلاق."
  ];

  // Male Arabic Bio Elements
  const MA_AR_INTRO = [
    "أنا [name]، أبلغ من العمر [age] عاماً، وأعمل كـ [profession] في [city].",
    "اسمي [name]، عمري [age] سنة، حاصل على شهادة [education] وأعمل كـ [profession] في [city].",
    "معكم المهندس/الأخصائي [name] ([age] عاماً)، أعمل بجد كـ [profession] في [city] الحبيبة.",
    "أنا [name]، [age] سنة، أعمل حالياً كـ [profession] في مدينة [city]."
  ];
  const MA_AR_TRAIT = [
    " أوازن بين السعي العملي الدؤوب وحياتي الروحية، وفي وقت فراغي أحب المطالعة، ممارسة الرياضة، والبر بوالدي.",
    " أهتم بالعمل التطوعي وخدمة المجتمع المحلي، وأحب الرحلات البرية والنهرية في دجلة والفرات، والاستماع للمحاضرات الفكرية.",
    " أنا شخص متزن وهادئ، ملتزم بواجباتي الدينية والاجتماعية، وأحب القراءة في مجالات التاريخ والتخطيط الاستراتيجي.",
    " أعشق التراث العراقي الأصيل، وأمارس الخط العربي والرياضة بانتظام، وأسعى دوماً لتسخير مهاراتي لخدمة عائلتي."
  ];
  const MA_AR_VALUE = [
    " وأرى أن الصدق المطلق والأمانة هما حجر الأساس لأي علاقة إنسانية ناجحة وبخاصة الزواج الشرعي المبارك.",
    " وأهتم بالترابط الأسري وبر الوالدين، وأسعى لأن أكون سنداً حقيقياً لشريكة حياتي في كل تفاصيل الحياة الزوجية.",
    " وأؤمن بمبدأ المشورة والتفاهم في إدارة شؤون الأسرة، وأحترم طموح المرأة ودورها الإنساني والمهني الهام والمثمر.",
    " وأبحث عن الاستقرار التام والسكينة، وأتطلع لبناء بيت عامر بذكر الله ومبني على الاحترام والرحمة المتبادلة."
  ];

  // Female Kurdish Bio Elements
  const FE_KU_INTRO = [
    "من [name]م، تەمەنم [age] ساڵە و وەک [profession] لە شاری جوان و دێرینی [city] کاردەکەم.",
    "ناوم [name]ە، تەمەنم [age] ساڵە و خاوەنی بڕوانامەی [education]م و وەک [profession] لە [city] سەرقاڵم.",
    "من [name]م ([age] ساڵ)، بە شانازییەوە کاردەکەم وەک [profession] لە [city]. کچێکی هێمن و جدیم.",
    "من [name]م، دەرچووی [education]م و ئێستا وەک [profession] لە ناوچەی [city] دەستبەکارم."
  ];
  const FE_KU_TRAIT = [
    " زۆر گرنگی بە بەها ئیسلامییەکان و دابونەریتی کوردی دەدەم، حەز بە خوێندنەوەی کتێبی بەسوود و بەسەربردنی کات لەگەڵ خێزانەکەم دەکەم.",
    " لە کاتی بەتاڵمدا سەرقاڵی فێربوونی بەردەوام، کاری کالیگرافی، چاندنی گوڵ و ئامادەکردنی خواردنی تەندروستم.",
    " کەسایەتییەکی لەسەرخۆم و حەز بە گفتوگۆی عەقڵانی دەکەم، ڕێز لە دایک و باوکم دەگرم و هەوڵدەدەم هاوکاری خەڵکی بکەم.",
    " حەزم لە سروشتی کوردستان و شوێنەوارە دێرینەکانە، کاتەکانم بە خوێندنەوە و پەرەپێدانی زانیارییەکانم بەسەر دەبەم."
  ];
  const FE_KU_VALUE = [
    " بڕوام وایە کە ڕێزی دوولایەنە و پاراستنی حەیا و بەها جوانەکانی کۆمەڵگا بنەمای بەختەوەری هەر خێزانێکن.",
    " پابەندبوون بە ئەرکە ئاینییەکان و ڕێزی گەورەکان سەرچاوەی بەرەکەتن لە ژیانمدا، و حەز دەکەم هەمیشە ڕاستگۆ بم لەگەڵ دەوروبەرم.",
    " پاراستنی سنورە ئەخلاقییەکان و تایبەتمەندییەکانم وەک کچێکی کورد پێشینەی کارەکانمە و بەدوای هاوبەشێکی ڕاستەقینەدا دەگەڕێم.",
    " دەخوازم ماڵێک دروست بکەم کە پڕ بێت لە ئارامی، و بتوانین نەوەی داهاتوو بە پەروەردەیەکی جوان و بەڕەوشت گۆش بکەین."
  ];

  // Male Kurdish Bio Elements
  const MA_KU_INTRO = [
    "من [name]م، تەمەنم [age] ساڵە و وەک [profession] کاردەکەم لە شاری [city].",
    "ناوم [name]ە، تەمەنم [age] ساڵە، خاوەنی بڕوانامەی [education]م و وەک [profession] لە شاری [city] نیشتەجێم.",
    "من ئەندازیار/پزیشک [name]م ([age] ساڵ)، بە دڵسۆزییەوە کاردەکەم وەک [profession] لە [city]ی ئازیز.",
    "من [name]م، [age] ساڵە تەمەنم، وەک [profession] لە شاری [city] سەرقاڵی کارکردنم."
  ];
  const MA_KU_TRAIT = [
    " هەمیشە هاوسەنگی دەپارێزم لە نێوان کار و ئەرکە ئاینییەکانمدا، حەز بە وەرزش، گەشت لە ناو سروشت و ڕێزگرتن لە دایک و باوکم دەکەم.",
    " گرنگی بە هاوکاری کۆمەڵایەتی دەدەم، حەز دەکەم بەسەر دەریاچە و چیاکانی کوردستاندا پیاسە بکەم و گەشەی فکری بکەم.",
    " کەسێکی هێمن و لەسەرخۆم، پابەندم بە بەها ئەخلاقی و ئاینییەکان، و زۆر حەز بە خوێندنەوەی مێژوو و ئەدەبیات دەکەم.",
    " گرنگی بە وەرزش و فێربوونی زانیاری نوێ دەدەم، زۆر ڕێز لە خێزانەکەم دەگرم و هاوکاری دەکەم بۆ بەدیهێنانی ژیانێکی شایستە."
  ];
  const MA_KU_VALUE = [
    " پێم وایە ڕاستگۆیی و دڵسۆزی بنەمای هەر پەیوەندییەکی سەرکەوتوون لە ژیاندا، بەتایبەت لە هاوسەرگیرییەکی پیرۆزدا.",
    " گرنگی بە پەیوەندی خێزانی دەدەم و دەمەوێت هەمیشە پشتیوان و پاڵپشت بم بۆ هاوسەری ئایندەم لە هەموو قۆناغەکانی ژیاندا.",
    " بڕوام بە گفتوگۆ و ڕاوێژ هەیە لە بەڕێوەبردنی کاروباری ماڵەوەدا، و ڕێز لە پێشکەوتن و کار و طموحی هاوسەرم دەگرم.",
    " بەدوای سەقامگیری و هێمنیدا دەگەڕێم، و هیوادارم ماڵێک بنیاد بنێین کە تێیدا خۆشەویستی و بەزەیی و ڕێز بڕیاردەر بن."
  ];

  // Intention Elements
  // ------------------
  // Female Arabic Intention
  const FE_AR_INT_1 = [
    "أتطلع للارتباط برجل وقور ومسؤول يقدر ميثاق الزواج الغليظ، ",
    "أبحث عن شريك حياة صالح وواعي، يكون لي سنداً ورفيقاً في طاعة الله، ",
    "أرغب في الارتباط بإنسان محترم وناضج عقلياً، يشاركني بناء حياة مستقرة، ",
    "أتمنى العثور على زوج صالح متزن الأخلاق، بار بوالديه ومحب للخير، "
  ];
  const FE_AR_INT_2 = [
    "لبناء أسرة هادئة ومباركة تملأها السكينة والمودة المتبادلة بروح المشورة والشورى، ",
    "لتأسيس بيت مسلم دافئ يقدر طموحي العملي ويدعمني في طاعة الله والعمل الصالح المبارك، ",
    "لبناء شراكة أسرية متوازنة مبنية على الاحترام المتبادل والمحبة الصادقة الوفية، ",
    "لتكوين أسرة صالحة ملتزمة بالقيم العراقية الأصيلة والتعاليم الدينية الحنيفة الكريمة، "
  ];
  const FE_AR_INT_3 = [
    "ونربي معاً أبناءنا على مكارم الأخلاق والشرف وبر الوالدين.",
    "ونعبر معاً دروب الحياة بكل محبة واحترام متبادل وتفاهم تام وصادق.",
    "بما يرضي الله سبحانه وتعالى ونكون عوناً لبعضنا في الدنيا والآخرة.",
    "ونسير جنباً إلى جنب لبناء مستقبل آمن ومستقر لعائلتنا الجديدة المباركة."
  ];

  // Male Arabic Intention
  const MA_AR_INT_1 = [
    "أسعى للارتباط بزوجة وقورة وذات خلق طيب تلتزم بالقيم الدينية السامية، ",
    "أتطلع للعثور على شريكة حياة صالحة وهادئة الطباع لتكون رفيقة دربي الصالحة، ",
    "أرغب في الزواج من امرأة واعية ومحترمة نقسم معاً أفراح الحياة ومسؤولياتها بأمانة، ",
    "أبحث عن زوجة طيبة وأمينة تقدر الترابط الأسري والبر بالوالدين والأخلاق الوقورة، "
  ];
  const MA_AR_INT_2 = [
    "لتأسيس بيت مبارك ومستقر يسوده الاحترام المتبادل والمحبة العميقة المتبادلة، ",
    "لبناء أسرة سعيدة قائمة على التفاهم والمشورة (الشورى) وتوفير حياة كريمة ولائقة لها، ",
    "لتكوين أسرة هادئة ومترابطة تحافظ على العهود والستر وتقاليدنا العراقية الأصيلة، ",
    "لنسير معاً في طاعة الله ونبني عُشاً زوجياً دافئاً يسوده الأمان والوقار والهناء، "
  ];
  const MA_AR_INT_3 = [
    "مع التعهد بتقديم كامل الدعم والتقدير لطموحها ورغباتها الشخصية والمهنية المشروعة.",
    "ونربي معاً أطفالنا على حب الخير والصلاح ومكارم الأخلاق الشريفة والبر بالناس.",
    "ونكون لبعضنا سنداً حقيقياً في كل مواقف الحياة بكل إخلاص وصدق ومحبة صادقة.",
    "لبناء مستقبل مشرق ومستقر لأبنائنا مبني على الحب والأمان والتقوى والمودة."
  ];

  // Female Kurdish Intention
  const FE_KU_INT_1 = [
    "دەخوازم هاوسەرگیری لەگەڵ پیاوێکی بەڕێز و بەرپرسیار بکەم کە ڕێز لە پەیمانی هاوسەرگیری بگرێت، ",
    "بەدوای هاوبەشێکی ژیانی خوداترس و هۆشیاردا دەگەڕێم کە ببێتە پاڵپشت و هاوڕێم لە سەر دڵسۆزی، ",
    "ئارەزوو دەکەم لەگەڵ مرۆڤێکی ڕێزدار و پێگەیشتوو هاوسەرگیری بکەم بۆ بنیادنانی ژیانێکی جێگیر، ",
    "هیوادارم هاوسەرێکی دیندار و خاوەن ڕەوشتێکی بەرز بدۆزمەوە کە دڵسۆزی خێزان بێت، "
  ];
  const FE_KU_INT_2 = [
    "بۆ دروستکردنی خێزانێکی بەختیار و پڕ لە سکینە و خۆشەویستی دوولایەنە لەسەر بنەمای ڕاوێژ، ",
    "بۆ پێکەوەنانی ماڵێکی دڵخۆش کە پاڵپشتی طموحی خوێندن و کارەکەم بکات و هاوکارم بێت لە ژیاندا، ",
    "بۆ دروستکردنی هاوبەشییەکی بەهێز لەسەر بنەمای ڕێزگرتنی یەکتر و هاوسۆزی ڕاستەقینە، ",
    "بۆ بنیادنانی خێزانێکی جێگیر کە پابەند بێت بە بەها جوانەکانی کۆمەڵگای کوردی و پاراستنی حەیا، "
  ];
  const FE_KU_INT_3 = [
    "و پێکەوە منداڵەکانمان بە پەروەردەیەکی دروست و ڕەوشتی جوان گەورە بکەین بە لێکتێگەیشتن.",
    "و پێکەوە ڕووبەڕووی قۆناغەکانی ژیان ببینەوە بە خۆشەویستی و دڵسۆزی دوولایەنە لە ژیانمان.",
    "بۆ ئەوەی ببینە سەرچاوەی ئارامی بۆ یەکتر و بە بەختەوەری بژین لە ژێر سێبەری حەڵاڵدا.",
    "و پێکەوە بەرەو ئایندەیەکی گەش و پڕ لە سەقامگیری و هێمنی هەنگاو بنێین بۆ ماڵەکەمان."
  ];

  // Male Kurdish Intention
  const MA_KU_INT_1 = [
    "خوازیاری هاوسەرگیریم لەگەڵ کچێکی بەڕێز و خاوەن ئەخلاقی بەرز کە پابەندی بەها دینییەکان بێت، ",
    "هیوادارم هاوبەشێکی ژیانی دڵسۆز و هێمن بدۆزمەوە کە ببێتە هاودەمی ژیانم بە تەواوی، ",
    "دەمهوێت هاوسەرگیری لەگەڵ کچێکی پێگەیشتوو و ڕێزدار بکەم بۆ بەشکردنی بەرپرسیارێتییەکان بە یەکسانی، ",
    "بەدوای هاوسەرێکی هێمن و بەڕێزدا دەگەڕێم کە ڕێزی دایک و باوک و بەها خێزانییەکان بگرێت بە وەفا، "
  ];
  const MA_KU_INT_2 = [
    "بۆ بنیادنانی ماڵێکی ئارام و پڕ لە خۆشەویستی و بەزەیی دوولایەنە و پاراستنی مافی شەرعی، ",
    "بۆ دروستکردنی خێزانێکی بەختیار لەسەر بنەمای لێکتێگەیشتن و دابینکردنی ژیانێکی شایستە بۆی، ",
    "بۆ پێکەوەنانی خێزانێکی جێگیر کە پارێزگاری لە بەها ڕەسەنەکان و ڕێز و حەیا بکات لە ناو کۆمەڵ، ",
    "بۆ ئەوەی پێکەوە بە ڕێگای حەڵاڵدا بڕۆین و خێزانێکی بەهێز دروست بکەین بە پاڵپشتی ئاینی، "
  ];
  const MA_KU_INT_3 = [
    "لەگەڵ دڵنیاییدان لە پاڵپشتی تەواوی من بۆ بەدیهێنانی حەز و طموحە زانستی و پیشەییەکانی هاوسەرم.",
    "و پێکەوە منداڵەکانمان بە پەروەردەیەکی دروست و ڕەوشتی جوان و یەکترناسین گۆش بکەین لەسەر تەقوا.",
    "و ببینە پاڵپشتی ڕاستەقینەی یەکتر لە هەموو بارودۆخەکانی ژیاندا بە دڵسۆزی تەواوی متمانەوە.",
    "بۆ دروستکردنی پاشەڕۆژێکی گەش بۆ منداڵەکانمان لەسەر بنەمای لێکتێگەیشتن و خۆشەویستی بەردەوام."
  ];

  // -----------------------------------------------------------------------------------------

  // Generate 10 females and 10 males for each of the 19 governorates (Total = 380)
  GOVERNORATES.forEach((gov, govIdx) => {
    
    // Helper to determine the stable ID of a profile to match existing custom overrides
    const getProfileId = (gender: 'male' | 'female', indexInGov: number): string => {
      if (gov.name === 'Sulaymaniyah' && indexInGov === 0) {
        return gender === 'female' ? 'f1' : 'm5';
      }
      if (gov.name === 'Baghdad' && indexInGov === 0) {
        return gender === 'female' ? 'f2' : 'm1';
      }
      if (gov.name === 'Erbil' && indexInGov === 0 && gender === 'male') {
        return 'm2';
      }
      if (gov.name === 'Najaf' && indexInGov === 0 && gender === 'female') {
        return 'f3';
      }
      if (gov.name === 'Basra' && indexInGov === 0 && gender === 'male') {
        return 'm3';
      }
      if (gov.name === 'Duhok' && indexInGov === 0 && gender === 'female') {
        return 'f4';
      }
      if (gov.name === 'Nineveh' && indexInGov === 0 && gender === 'male') {
        return 'm4';
      }
      if (gov.name === 'Kirkuk' && indexInGov === 0 && gender === 'female') {
        return 'f5';
      }
      
      const prefix = gender === 'female' ? 'f' : 'm';
      const govShort = gov.name.replace(/\s+/g, '').toLowerCase();
      return `${prefix}_${govShort}_${indexInGov}`;
    };

    const getEthnicity = (gender: 'male' | 'female', index: number) => {
      if (gov.isKurdish) return 'kurdish';
      if (gov.name === 'Kirkuk') {
        return index % 3 === 0 ? 'kurdish' : index % 3 === 1 ? 'others' : 'arab'; // others matches Turkmen
      }
      if (gov.name === 'Diyala') {
        return index % 2 === 0 ? 'arab' : 'kurdish';
      }
      if (gov.name === 'Nineveh') {
        return index % 3 === 0 ? 'arab' : index % 3 === 1 ? 'others' : 'kurdish';
      }
      return 'arab';
    };

    const createProfile = (gender: 'male' | 'female', indexInGov: number): MatchProfile => {
      const id = getProfileId(gender, indexInGov);

      // 1. If a custom override exists, prioritize its custom values but add demo labels
      if (customMatches[id] && customMatches[id].gender === gender && customMatches[id].governorate === gov.name) {
        const customAge = customMatches[id].age!;
        const customPhotoStatus = (customMatches[id].photoStatus as any) || 'blurred';
        return {
          id,
          name: customMatches[id].name!,
          age: customAge,
          gender: customMatches[id].gender!,
          governorate: gov.name,
          city: customMatches[id].city || (gov.name === "Baghdad" ? "Karkh" : gov.name === "Erbil" ? "Soran" : gov.name),
          country: 'Iraq',
          religion: 'islam',
          sect: (customMatches[id].sect as 'sunni' | 'shiaa' | 'none') || (gov.defaultSect as any),
          ethnicity: (customMatches[id].ethnicity as 'arab' | 'kurdish' | 'others') || 'arab',
          profession: customMatches[id].profession!,
          education: customMatches[id].education!,
          intention: customMatches[id].intention,
          timeline: 'Within 6 months',
          wantsChildren: 'Yes, definitely',
          communicationPreference: customPhotoStatus === 'hidden' || customPhotoStatus === 'initials'
            ? "Safeguards family privacy; communicates via polite direct inquiries"
            : "Direct platform introductions; values respectful and highly serious boundaries",
          valuesSummary: customMatches[id].valuesSummary!,
          verified: true,
          isOnline: indexInGov % 2 === 0,
          photoStatus: customPhotoStatus,
          avatarSeed: `${id}_photo`,
          avatarUrl: customMatches[id].avatarUrl!,
          compatibilityScore: customMatches[id].compatibilityScore!,
          languages: gender === 'female' ? ['Arabic', 'English'] : ['Arabic', 'Kurdish', 'English'],
          aboutMe: customMatches[id].aboutMe!,
          dealbreakers: customMatches[id].dealbreakers || ['Smoking', 'Irresponsibility'],
          requestStatus: (id === 'f2' ? 'sent' : id === 'm2' ? 'accepted' : id === 'm3' ? 'declined' : 'none') as any,
          badges: ['Demo Verified', 'Sincere Intention', 'Demo Match'],
          maritalStatus: indexInGov === 3 ? 'Divorced (no children)' : 'Single',
          relocation: gender === 'female' ? 'Prefer to stay in the same governorate' : 'Open to relocate within Iraq',
          familyValues: gender === 'female' 
            ? 'Deeply values family consultation, parental blessing, and mutual support in Islamic marital steps.'
            : 'Values supportive environment for spouse, joint decision-making (Shura), and active participation in family ties.',
          lifestyle: gender === 'female'
            ? 'Quiet, balanced, focused on continuous growth, family harmony, and moderate religious practices.'
            : 'Sincere, career-oriented yet highly family-centric, values respectful dialogue and stable home environment.',
          preferredAgeRange: gender === 'female' 
            ? `${customAge - 1} to ${customAge + 6} years` 
            : `${Math.max(20, customAge - 6)} to ${customAge + 2} years`,
          privacyLevel: customPhotoStatus === 'hidden'
            ? 'High (Full image privacy, avatar silhouette only)'
            : customPhotoStatus === 'initials'
              ? 'Strict (Name initials only, no face photo)'
              : customPhotoStatus === 'blurred'
                ? 'Protected (Blurred image, only shared upon families request)'
                : 'Standard (Visible to verified members only)',
          isDemoProfile: true // Clearly marked internally as demo data
        };
      }

      // 2. Otherwise, generate a 100% unique, fully localized profile programmatically
      const eth = getEthnicity(gender, indexInGov);
      const isKurdishLang = gov.isKurdish || eth === 'kurdish';
      
      // Determine unique name (combining deterministic first name & family name to prevent any repetition)
      let firstName = "";
      let lastName = "";
      
      if (gender === 'female') {
        if (eth === 'kurdish') {
          firstName = FEMALE_KURDISH_NAMES[(govIdx * 7 + indexInGov * 3) % FEMALE_KURDISH_NAMES.length];
          lastName = KURDISH_FAMILY_NAMES[(govIdx * 3 + indexInGov * 5) % KURDISH_FAMILY_NAMES.length];
        } else if (eth === 'others' && gov.name === 'Kirkuk') {
          firstName = FEMALE_TURKMEN_NAMES[(govIdx * 7 + indexInGov * 3) % FEMALE_TURKMEN_NAMES.length];
          lastName = TURKMEN_FAMILY_NAMES[(govIdx * 3 + indexInGov * 5) % TURKMEN_FAMILY_NAMES.length];
        } else {
          firstName = FEMALE_ARABIC_NAMES[(govIdx * 7 + indexInGov * 3) % FEMALE_ARABIC_NAMES.length];
          lastName = ARABIC_FAMILY_NAMES[(govIdx * 3 + indexInGov * 5) % ARABIC_FAMILY_NAMES.length];
        }
      } else {
        if (eth === 'kurdish') {
          firstName = MALE_KURDISH_NAMES[(govIdx * 7 + indexInGov * 3) % MALE_KURDISH_NAMES.length];
          lastName = KURDISH_FAMILY_NAMES[(govIdx * 3 + indexInGov * 5) % KURDISH_FAMILY_NAMES.length];
        } else if (eth === 'others' && gov.name === 'Kirkuk') {
          firstName = MALE_TURKMEN_NAMES[(govIdx * 7 + indexInGov * 3) % MALE_TURKMEN_NAMES.length];
          lastName = TURKMEN_FAMILY_NAMES[(govIdx * 3 + indexInGov * 5) % TURKMEN_FAMILY_NAMES.length];
        } else {
          firstName = MALE_ARABIC_NAMES[(govIdx * 7 + indexInGov * 3) % MALE_ARABIC_NAMES.length];
          lastName = ARABIC_FAMILY_NAMES[(govIdx * 3 + indexInGov * 5) % ARABIC_FAMILY_NAMES.length];
        }
      }

      // Safeguard against duplicate custom names
      if (firstName === "Lina" && gov.name === "Sulaymaniyah") firstName = "Shene";
      if (firstName === "Adam" && gov.name === "Baghdad") firstName = "Zaid";
      if (firstName === "Noor" && gov.name === "Baghdad") firstName = "Fatima";
      if (firstName === "Omar" && gov.name === "Erbil") firstName = "Soran";
      if (firstName === "Sara" && gov.name === "Najaf") firstName = "Zahra";
      if (firstName === "Zaid" && gov.name === "Basra") firstName = "Amjad";
      if (firstName === "Tara" && gov.name === "Duhok") firstName = "Berivan";
      if (firstName === "Mustafa" && gov.name === "Nineveh") firstName = "Ahmed";

      const name = `${firstName} ${lastName}`;

      // Age between 21 and 35
      const age = 21 + ((govIdx * 11 + indexInGov * 17) % 15);
      
      // Select profession & education
      const profObj = gender === 'female'
        ? PROFESSIONS_FEMALE[(govIdx * 4 + indexInGov * 9) % PROFESSIONS_FEMALE.length]
        : PROFESSIONS_MALE[(govIdx * 4 + indexInGov * 9) % PROFESSIONS_MALE.length];

      // Assign realistic cities for all 19 governorates
      const regionalCities: Record<string, string[]> = {
        "Baghdad": ["Mansour", "Karada", "Adhamiyah", "Karkh", "Jadriya", "Ghazaliya"],
        "Basra": ["Zubair center", "Abu Al-Khaseeb", "Basra Corniche", "Qurnah", "Shatt al-Arab"],
        "Nineveh": ["Mosul Al-Aisar", "Mosul Al-Aiman", "Tal Afar", "Sinjar", "Hamdaniya"],
        "Erbil": ["Erbil City", "Soran", "Shaqlawa", "Koya", "Khabat"],
        "Sulaymaniyah": ["Slemani center", "Rania", "Kalar", "Halabja road", "Chamchamal"],
        "Duhok": ["Duhok City", "Zakho", "Semel", "Amedi"],
        "Kirkuk": ["Kirkuk center", "Daquq", "Hawija", "Panja Ali"],
        "Diyala": ["Baqubah", "Khanaqin", "Muqdadiyah", "Khalis"],
        "Anbar": ["Ramadi", "Fallujah", "Hit", "Haditha", "Ana"],
        "Salah al-Din": ["Tikrit", "Samarra", "Balad", "Dujail", "Shirqat"],
        "Babil": ["Hilla", "Hashimiyah", "Mahawil", "Musayib"],
        "Karbala": ["Karbala Center", "Hindiyah", "Al-Hurr"],
        "Najaf": ["Najaf Center", "Kufa", "Manathera"],
        "Wasit": ["Kut", "Suwayrah", "Numaniyah", "Hai"],
        "Qadisiyah": ["Diwaniyah", "Afak", "Shamiya"],
        "Maysan": ["Amarah", "Al-Maimouna", "Kahla"],
        "Dhi Qar": ["Nasiriyah", "Shatrah", "Rifai", "Suq Al-Shuyukh"],
        "Muthanna": ["Samawah", "Al-Rumaitha", "Al-Khidhir"],
        "Halabja": ["Halabja Center", "Said Sadiq", "Sirwan", "Khurmal"]
      };

      const citiesList = regionalCities[gov.name] || [gov.name];
      const city = citiesList[(govIdx + indexInGov) % citiesList.length];

      // Build unique biography deterministically
      let aboutMe = "";
      let intention = "";
      
      const introIdx = (govIdx + indexInGov) % 4;
      const traitIdx = (govIdx * 2 + indexInGov * 3) % 4;
      const valIdx = (govIdx * 3 + indexInGov * 7) % 4;

      if (isKurdishLang) {
        if (gender === 'female') {
          const introStr = FE_KU_INTRO[introIdx]
            .replace("[name]", firstName)
            .replace("[age]", String(age))
            .replace("[profession]", profObj.title)
            .replace("[city]", city)
            .replace("[education]", profObj.edu);
          aboutMe = introStr + FE_KU_TRAIT[traitIdx] + FE_KU_VALUE[valIdx];

          intention = FE_KU_INT_1[introIdx] + FE_KU_INT_2[traitIdx] + FE_KU_INT_3[valIdx];
        } else {
          const introStr = MA_KU_INTRO[introIdx]
            .replace("[name]", firstName)
            .replace("[age]", String(age))
            .replace("[profession]", profObj.title)
            .replace("[city]", city)
            .replace("[education]", profObj.edu);
          aboutMe = introStr + MA_KU_TRAIT[traitIdx] + MA_KU_VALUE[valIdx];

          intention = MA_KU_INT_1[introIdx] + MA_KU_INT_2[traitIdx] + MA_KU_INT_3[valIdx];
        }
      } else {
        if (gender === 'female') {
          const introStr = FE_AR_INTRO[introIdx]
            .replace("[name]", firstName)
            .replace("[age]", String(age))
            .replace("[profession]", profObj.title)
            .replace("[city]", city)
            .replace("[education]", profObj.edu);
          aboutMe = introStr + FE_AR_TRAIT[traitIdx] + FE_AR_VALUE[valIdx];

          intention = FE_AR_INT_1[introIdx] + FE_AR_INT_2[traitIdx] + FE_AR_INT_3[valIdx];
        } else {
          const introStr = MA_AR_INTRO[introIdx]
            .replace("[name]", firstName)
            .replace("[age]", String(age))
            .replace("[profession]", profObj.title)
            .replace("[city]", city)
            .replace("[education]", profObj.edu);
          aboutMe = introStr + MA_AR_TRAIT[traitIdx] + MA_AR_VALUE[valIdx];

          intention = MA_AR_INT_1[introIdx] + MA_AR_INT_2[traitIdx] + MA_AR_INT_3[valIdx];
        }
      }

      // Assign photographic privacy setups based on gender
      // Females: distribute blurred, initials-only, or silhouettes to guarantee high-integrity privacy
      // Males: distribute visible, blurred, or initials-only to represent varied real states
      let photoStatus: 'visible' | 'blurred' | 'hidden' | 'initials' = 'visible';
      let avatarUrl = "";

      if (gender === 'female') {
        const privacyCycle = indexInGov % 4;
        if (privacyCycle === 0) {
          photoStatus = 'blurred';
          avatarUrl = FEMALE_AVATARS[(govIdx + indexInGov) % FEMALE_AVATARS.length];
        } else if (privacyCycle === 1) {
          photoStatus = 'initials';
          avatarUrl = FEMALE_AVATARS[(govIdx + indexInGov) % FEMALE_AVATARS.length];
        } else if (privacyCycle === 2) {
          photoStatus = 'hidden';
          // Use elegant floral or nature abstract placeholder
          avatarUrl = FEMALE_PRIVACY_PLACEHOLDERS[(govIdx + indexInGov) % FEMALE_PRIVACY_PLACEHOLDERS.length];
        } else {
          // Soft blur style using the privacy placeholder image directly
          photoStatus = 'blurred';
          avatarUrl = FEMALE_PRIVACY_PLACEHOLDERS[(govIdx + indexInGov) % FEMALE_PRIVACY_PLACEHOLDERS.length];
        }
      } else {
        const privacyCycle = indexInGov % 4;
        avatarUrl = MALE_AVATARS[(govIdx + indexInGov) % MALE_AVATARS.length];
        if (privacyCycle === 0 || privacyCycle === 1) {
          photoStatus = 'visible';
        } else if (privacyCycle === 2) {
          photoStatus = 'blurred';
        } else {
          photoStatus = 'initials';
        }
      }

      const sect = gov.isKurdish ? 'sunni' : (gov.name === 'Kirkuk' && eth === 'others' ? 'sunni' : gov.defaultSect);
      const isOnline = (govIdx + indexInGov) % 3 !== 0;

      const vals = [
        ["Family Honor", "Honesty", "Spiritual Core"],
        ["Compassion", "Modesty", "Knowledge Seeking"],
        ["Respectful Boundaries", "Sincerity", "Financial Logic"],
        ["Kindness", "Faithful Engagement", "Respect for Elders"]
      ][(govIdx + indexInGov) % 4];

      const languages = eth === 'kurdish' 
        ? ['Kurdish', 'Arabic'] 
        : eth === 'others' && gov.name === 'Kirkuk' 
          ? ['Arabic', 'Kurdish', 'Turkish'] 
          : ['Arabic', 'English'];

      const maritalStatus = indexInGov === 4 
        ? (gender === 'female' ? 'Widowed' : 'Divorced (one child)') 
        : indexInGov === 7 
          ? 'Divorced (no children)' 
          : 'Single';

      const relocation = gender === 'female' 
        ? ((govIdx + indexInGov) % 2 === 0 ? 'Prefer to stay in same governorate' : 'Open to relocate within same region')
        : ((govIdx + indexInGov) % 2 === 0 ? 'Open to relocate within Iraq' : 'Prefer to live near family roots');

      const familyValues = gender === 'female'
        ? 'Values a family structure based on respect, conservative values, and joint decisions (Shura).'
        : 'Sincere dedication to supporting spouse, maintaining close bonds with parents, and providing a safe home.';

      const lifestyle = gender === 'female'
        ? 'Spiritual, quiet lifestyle, loves home decoration, calligraphy, and helping siblings.'
        : 'Active career life, values Islamic religious rituals, quiet evenings, and traditional social circles.';

      const preferredAgeRange = gender === 'female' 
        ? `${age - 1} to ${age + 6} years` 
        : `${Math.max(20, age - 6)} to ${age + 2} years`;

      const privacyLevel = photoStatus === 'hidden'
        ? 'High (Full image privacy, avatar silhouette only)'
        : photoStatus === 'initials'
          ? 'Strict (Name initials only, no face photo)'
          : photoStatus === 'blurred'
            ? 'Protected (Blurred image, only shared upon families request)'
            : 'Standard (Visible to verified members only)';

      return {
        id,
        name,
        age,
        gender,
        governorate: gov.name,
        city,
        country: "Iraq",
        religion: "islam",
        sect: sect as any,
        ethnicity: eth as any,
        profession: profObj.title,
        education: profObj.edu,
        intention,
        timeline: indexInGov % 2 === 0 ? "Within 6 months" : "Within 1 year",
        wantsChildren: "Yes, definitely",
        communicationPreference: photoStatus === 'hidden' || photoStatus === 'initials'
          ? "Safeguards family privacy; communicates via polite direct inquiries"
          : "Direct platform introductions; values respectful and highly serious boundaries",
        valuesSummary: vals,
        verified: Math.random() > 0.15,
        isOnline,
        photoStatus,
        avatarSeed: `${id}_photo`,
        avatarUrl,
        compatibilityScore: 81 + ((govIdx * 3 + indexInGov * 7) % 18),
        languages,
        aboutMe,
        dealbreakers: ['Smoking', 'Irresponsibility', 'Unseriousness'],
        requestStatus: 'none',
        badges: ['Demo Verified', 'Sincere Intention', 'Demo Match'],
        maritalStatus,
        relocation,
        familyValues,
        lifestyle,
        preferredAgeRange,
        privacyLevel,
        isDemoProfile: true // Flagged internally as demo profile
      };
    };

    // Push exactly 10 females and 10 males per governorate to guarantee full balance
    for (let i = 0; i < 10; i++) {
      list.push(createProfile('female', i));
      list.push(createProfile('male', i));
    }
  });

  return list;
}

export const INITIAL_MATCHES: MatchProfile[] = generateMatches();

export const MOCK_GUIDED_PROMPTS = [
  'What does a peaceful married life look like to you?',
  'What values matter most in your future home?',
  'How do you prefer to manage communication and privacy in courtship?',
  'What kind of partner do you admire most?',
  'What are your expectations for balancing career and family life?',
  'What are your goals for the next five years spiritually and professionally?'
];

export const MOCK_CHATS_RESPONSES: Record<string, string[]> = {
  'f1': [
    'سڵاو، ئەسەلامو عەلەیکوم. بۆ من، ماڵێکی پڕ لە ئارامی شوێنێکە کە تێیدا ڕێز، دڵسۆزی و قسەی خۆش بەکاربهێنین. بەها ئاینییەکان بنەمای ژیانی ئێمە دەبن پێکەوە لە سلێمانی.',
    'بڕوام وایە پشتیوانی دایک و باوک و خێزان بەرەکەتێکی گەورەیە، لە کاتێکدا هەمیشە سنورێکی ڕێزدار بۆ ژیانی تایبەتی خۆمان بپارێزین.',
    'خوازیارم پەیوەندیمان هەمیشە بە ڕێزەوە بەردەوام بێت و پێکەوە بەرەو هاوسەرگیرییەکی پیرۆز هەنگاو بنێین.'
  ],
  'f2': [
    'السلام عليكم ورحمة الله. أعتقد أن الشورى والمشورة المتبادلة هي أساس نجاح الحياة الزوجية واستمرارها. الحوار الهادئ يحل أي معضلة قبل أن تكبر.',
    'في عملي الصيدلاني، نؤمن دائماً بأن الوقاية خير من العلاج. في الزواج أيضاً، الصراحة والوضوح منذ البداية يقيان بيتنا من أي سوء تفاهم.',
    'عائلتي تدعمني كثيراً في طموحي الأكاديمي، وسيكونون سعداء بمعرفة أن شريك حياتي المستقبلي يقدر دور المرأة ويرعاها بالاحترام والوقار.'
  ],
  'f3': [
    'السلام عليكم ورحمة الله. الأمانة والاستقرار الفكري هما الأهم. بيتنا يجب أن يتأسس مثل العمارة التاريخية التراثية في النجف؛ متين البنيان، مليء بالوقار والسكينة.',
    'أبحث عن الاستقرار الهادئ، وجلسات المساء المليئة بتبادل الرأي الصادق والمطالعة، وتربية أبنائنا على حب الخير والصلاح وبر الأهل.',
    'يسعدني جداً اهتمامك بالجانب التراثي والقيمي. أفضل دائماً الحفاظ على الخصوصية والستر حتى يكتب الله لنا التوفيق والقبول.'
  ],
  'f4': [
    'سڵاو و ڕێز، ئەسەلامو عەلەیکوم. ڕاستگۆیی بنەمای متمانەیە. تێگەیشتن لە ئامانجەکانی یەکتر، پلانەکانی ژیان و دابینکردنی پێداویستییەکان بە یارمەتی یەکتر، ماڵێکی بەهێز دروست دەکات.',
    'باوەڕم وایە پاراستنی بەهاکانمان و گۆشکردنی منداڵەکانمان لەسەر تەقوا، پارێزگاری لە متمانە و خۆشەویستیمان دەکات لە هەموو بارودۆخێکدا.',
    'سوپاس بۆ پەیامە بەڕێزەکەت. بەرنامەی حەڵاڵ بەڕاستی ستانداردێکی بەرز و پڕ لە ڕێز بۆ پەیوەندی هاوسەرگیری دروست دەکات.'
  ],
  'f5': [
    'سڵاو و ڕێز. ڕاستگۆیی و دڵسۆزی کلیلی هەموو دەرگایەکی داخراون. ئەگەر متمانەی تەواو لە نێوانماندا هەبێت، هەر بڕیارێک یان گواستنەوەیەک ئاسان دەبێت.',
    'من زۆر حەزم لە گفتوگۆی بنیاتنەرە و پێم وایە بەرەکەت لە پێکەوەبوون و ڕێزگرتن لە دایک و باوکدایە پێش هەر شتێکی تر.',
    'خۆشحاڵ دەبم گەر گفتوگۆکانمان لە چوارچێوەی یاسایی و خێزانیدا بەردەوام بن کاتێک هەست دەکەین هاوشانی یەکترین لە بەهاکاندا.'
  ],
  'm1': [
    'وعليكم السلام ورحمة الله وبركاته. أقدر كثيراً تواصلك الراقي والجاد. غايتي الأولى هي تأسيس بيت مسلم عامر بالمودة والرحمة ومبني على أسس قوية.',
    'عائلتي تلعب دوراً كبيراً في حياتي، وبرهم هو طاعتي الأولى. وأتطلع لشريكة حياة تكون ابنة وصديقة لهم وتحافظ معنا على خصوصيتنا التامة.',
    'دعنا نستمر في تبادل الآراء الصادقة وتوضيح الرؤى حول الحياة المشتركة والواجبات عبر هذه البوابة الموثوقة بكل أمان وستر.'
  ],
  'm2': [
    'سڵاو و ئەسەلامو عەلەیکوم. لە پزیشکی دڵدا، گوێگرتنی قووڵ فێربووم. پشوودرێژی و متمانە کلیلی سەرکەوتنن. دەمەوێت ماڵێکی پڕ لە سۆز پێکەوە دروست بکەین لە هەولێر.',
    'کۆبوونەوەی خێزانی و مێواندۆستی بەشێکی گرنگە لە کلتوری ئێمە، و هیوادارم هاوسەرەکەم بە خۆشەویستییەوە بەشدار بێت لەم بۆنانەدا.',
    'سوپاس بۆ متمانەکەت. بەرنامەی حەڵاڵ هەلی نایاب و شەرعی بە گەنجان دەبەخشێت بۆ ئەوەی دوور لە ڕیکلام و خراپەکاری هاوسەری گونجاو بدۆزنەوە.'
  ],
  'm3': [
    'وعليكم السلام ورحمة الله. الصبر والصدق المطلق هما صفتان أعتز بهما كثيراً. في البصرة، نتعلم العطاء المتدفق، وأسعى لبناء حياة كريمة ومستقرة معك.',
    'أتطلع لتربية أبنائنا على القيم الطيبة، والخط العربي التراثي، والعمل الدؤوب الصالح النافع لمجتمعهم.',
    'دعنا نناقش تطلعاتنا والتزاماتنا بوضوح تام، فغايتي هي زواج مستقر وصادق يخلو من الضبابية أو المجاملة الزائفة.'
  ]
};
