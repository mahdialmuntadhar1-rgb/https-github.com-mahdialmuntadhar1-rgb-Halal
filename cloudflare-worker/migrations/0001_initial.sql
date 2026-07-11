CREATE TABLE IF NOT EXISTS users (

    id TEXT PRIMARY KEY,

    email TEXT UNIQUE NOT NULL,

    phone TEXT UNIQUE,

    password_hash TEXT NOT NULL,

    password_salt TEXT NOT NULL,

    role TEXT DEFAULT 'user',

    membership TEXT DEFAULT 'free',

    email_verified INTEGER DEFAULT 0,

    phone_verified INTEGER DEFAULT 0,

    status TEXT DEFAULT 'active',

    created_at TEXT NOT NULL,

    updated_at TEXT NOT NULL

);

CREATE TABLE IF NOT EXISTS profiles (

    user_id TEXT PRIMARY KEY,

    full_name TEXT,

    gender TEXT,

    age INTEGER,

    governorate TEXT,

    city TEXT,

    country TEXT,

    religion TEXT,

    sect TEXT,

    ethnicity TEXT,

    profession TEXT,

    education TEXT,

    bio TEXT,

    languages TEXT,

    values_json TEXT,

    photo_visibility TEXT DEFAULT 'blurred',

    profile_visibility TEXT DEFAULT 'verified',

    created_at TEXT NOT NULL,

    updated_at TEXT NOT NULL,

    FOREIGN KEY(user_id) REFERENCES users(id)

);

CREATE INDEX IF NOT EXISTS idx_users_email
ON users(email);

CREATE INDEX IF NOT EXISTS idx_users_phone
ON users(phone);

CREATE INDEX IF NOT EXISTS idx_profiles_governorate
ON profiles(governorate);

CREATE INDEX IF NOT EXISTS idx_profiles_gender
ON profiles(gender);

CREATE INDEX IF NOT EXISTS idx_profiles_age
ON profiles(age);
