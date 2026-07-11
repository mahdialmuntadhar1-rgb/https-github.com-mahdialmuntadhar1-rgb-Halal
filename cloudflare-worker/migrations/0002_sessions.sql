CREATE TABLE IF NOT EXISTS sessions (

    id TEXT PRIMARY KEY,

    user_id TEXT NOT NULL,

    token_hash TEXT NOT NULL,

    expires_at TEXT NOT NULL,

    created_at TEXT NOT NULL,

    ip_address TEXT,

    user_agent TEXT,

    FOREIGN KEY(user_id) REFERENCES users(id)

);

CREATE INDEX IF NOT EXISTS idx_sessions_user
ON sessions(user_id);

CREATE INDEX IF NOT EXISTS idx_sessions_token
ON sessions(token_hash);
