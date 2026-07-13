ALTER TABLE halal_profiles ADD COLUMN district TEXT;

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

INSERT OR IGNORE INTO halal_requests (id, sender_id, receiver_id, status, decided_by, decided_at, created_at, updated_at)
SELECT id, sender_id, receiver_id, status, decided_by, decided_at, created_at, updated_at
FROM halal_introduction_requests;

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

CREATE INDEX IF NOT EXISTS idx_profiles_district ON halal_profiles(district);
CREATE INDEX IF NOT EXISTS idx_requests_sender ON halal_requests(sender_id);
CREATE INDEX IF NOT EXISTS idx_requests_receiver ON halal_requests(receiver_id);
CREATE INDEX IF NOT EXISTS idx_requests_status ON halal_requests(status);
CREATE INDEX IF NOT EXISTS idx_cafe_questions_active_date ON halal_cafe_questions(active_date);
CREATE INDEX IF NOT EXISTS idx_cafe_answers_question_user ON halal_cafe_answers(question_id, user_id);

INSERT OR IGNORE INTO halal_cafe_questions (id, question, question_ar, category, active_date)
VALUES (
  'daily-intentions-001',
  'What quality matters most to you in a serious marriage conversation?',
  'ما الصفة الأهم لك في حوار زواج جاد؟',
  'daily',
  date('now')
);


