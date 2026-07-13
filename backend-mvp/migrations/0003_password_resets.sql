CREATE TABLE IF NOT EXISTS halal_password_resets (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES halal_users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  used INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_password_resets_user ON halal_password_resets(user_id);
CREATE INDEX IF NOT EXISTS idx_password_resets_expires ON halal_password_resets(expires_at);
