CREATE TABLE IF NOT EXISTS halal_users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('member', 'admin')),
  verified INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS halal_profiles (
  user_id TEXT PRIMARY KEY REFERENCES halal_users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  gender TEXT CHECK (gender IN ('male', 'female')),
  birth_year INTEGER,
  country TEXT NOT NULL DEFAULT 'Iraq',
  governorate TEXT,
  district TEXT,
  city TEXT,
  religion TEXT NOT NULL DEFAULT 'islam' CHECK (religion IN ('islam', 'non_islam')),
  sect TEXT DEFAULT 'sunni' CHECK (sect IN ('sunni', 'shiaa', 'none')),
  ethnicity TEXT NOT NULL DEFAULT 'arab' CHECK (ethnicity IN ('arab', 'kurdish', 'others')),
  marital_status TEXT,
  education TEXT,
  occupation TEXT,
  bio TEXT,
  intention TEXT NOT NULL DEFAULT 'Serious for marriage',
  timeline TEXT NOT NULL DEFAULT 'Within 1 year',
  wants_children TEXT NOT NULL DEFAULT 'Open to discussion',
  communication_preference TEXT NOT NULL DEFAULT 'Respectful platform communication only',
  photo_url TEXT,
  photo_visibility TEXT NOT NULL DEFAULT 'private' CHECK (photo_visibility IN ('public', 'private', 'blurred', 'initials', 'hidden')),
  hidden_by_admin INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS halal_preferences (
  user_id TEXT PRIMARY KEY REFERENCES halal_users(id) ON DELETE CASCADE,
  partner_min_age INTEGER DEFAULT 18,
  partner_max_age INTEGER DEFAULT 45,
  partner_gender TEXT CHECK (partner_gender IN ('male', 'female', 'all')),
  partner_governorate TEXT,
  partner_religion TEXT,
  partner_sect TEXT,
  partner_ethnicity TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS halal_saved_profiles (
  user_id TEXT NOT NULL REFERENCES halal_users(id) ON DELETE CASCADE,
  saved_user_id TEXT NOT NULL REFERENCES halal_users(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, saved_user_id)
);

CREATE TABLE IF NOT EXISTS halal_requests (
  id TEXT PRIMARY KEY,
  sender_id TEXT NOT NULL REFERENCES halal_users(id) ON DELETE CASCADE,
  receiver_id TEXT NOT NULL REFERENCES halal_users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  decided_by TEXT REFERENCES halal_users(id),
  decided_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (sender_id, receiver_id)
);

CREATE TABLE IF NOT EXISTS halal_introduction_requests (
  id TEXT PRIMARY KEY,
  sender_id TEXT NOT NULL REFERENCES halal_users(id) ON DELETE CASCADE,
  receiver_id TEXT NOT NULL REFERENCES halal_users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  decided_by TEXT REFERENCES halal_users(id),
  decided_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (sender_id, receiver_id)
);

CREATE TABLE IF NOT EXISTS halal_conversations (
  id TEXT PRIMARY KEY,
  request_id TEXT NOT NULL UNIQUE REFERENCES halal_requests(id) ON DELETE CASCADE,
  user_one_id TEXT NOT NULL REFERENCES halal_users(id) ON DELETE CASCADE,
  user_two_id TEXT NOT NULL REFERENCES halal_users(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS halal_cafe_questions (
  id TEXT PRIMARY KEY,
  question TEXT NOT NULL,
  question_ar TEXT,
  category TEXT NOT NULL DEFAULT 'daily',
  active_date TEXT NOT NULL DEFAULT (date('now')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS halal_cafe_answers (
  id TEXT PRIMARY KEY,
  question_id TEXT NOT NULL REFERENCES halal_cafe_questions(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES halal_users(id) ON DELETE CASCADE,
  answer TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (question_id, user_id)
);

CREATE TABLE IF NOT EXISTS halal_messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL REFERENCES halal_conversations(id) ON DELETE CASCADE,
  sender_id TEXT NOT NULL REFERENCES halal_users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS halal_hero_images (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  alt_text TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS halal_reports (
  id TEXT PRIMARY KEY,
  reporter_id TEXT NOT NULL REFERENCES halal_users(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL CHECK (target_type IN ('profile', 'post', 'message')),
  target_id TEXT NOT NULL,
  reason TEXT NOT NULL DEFAULT 'Reported by member',
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'resolved')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  resolved_at TEXT
);

CREATE TABLE IF NOT EXISTS halal_blocks (
  blocker_id TEXT NOT NULL REFERENCES halal_users(id) ON DELETE CASCADE,
  blocked_user_id TEXT NOT NULL REFERENCES halal_users(id) ON DELETE CASCADE,
  reason TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (blocker_id, blocked_user_id)
);

CREATE INDEX IF NOT EXISTS idx_profiles_gender ON halal_profiles(gender);
CREATE INDEX IF NOT EXISTS idx_profiles_age ON halal_profiles(birth_year);
CREATE INDEX IF NOT EXISTS idx_profiles_birth_year ON halal_profiles(birth_year);
CREATE INDEX IF NOT EXISTS idx_profiles_governorate ON halal_profiles(governorate);
CREATE INDEX IF NOT EXISTS idx_profiles_district ON halal_profiles(district);
CREATE INDEX IF NOT EXISTS idx_profiles_religion ON halal_profiles(religion);
CREATE INDEX IF NOT EXISTS idx_profiles_sect ON halal_profiles(sect);
CREATE INDEX IF NOT EXISTS idx_profiles_ethnicity ON halal_profiles(ethnicity);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON halal_profiles(created_at);
CREATE INDEX IF NOT EXISTS idx_users_verified ON halal_users(verified);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON halal_users(created_at);
CREATE INDEX IF NOT EXISTS idx_requests_sender ON halal_requests(sender_id);
CREATE INDEX IF NOT EXISTS idx_requests_receiver ON halal_requests(receiver_id);
CREATE INDEX IF NOT EXISTS idx_requests_status ON halal_requests(status);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_created ON halal_messages(conversation_id, created_at);
CREATE INDEX IF NOT EXISTS idx_hero_images_active_order ON halal_hero_images(active, sort_order);
CREATE INDEX IF NOT EXISTS idx_cafe_questions_active_date ON halal_cafe_questions(active_date);
CREATE INDEX IF NOT EXISTS idx_cafe_answers_question_user ON halal_cafe_answers(question_id, user_id);

INSERT OR IGNORE INTO halal_cafe_questions (id, question, question_ar, category, active_date)
VALUES (
  'daily-intentions-001',
  'What quality matters most to you in a serious marriage conversation?',
  'ما الصفة الأهم لديك في حوار زواج جاد؟',
  'daily',
  date('now')
);


