DROP TABLE IF EXISTS access_logs;
CREATE TABLE access_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ip TEXT,
  country TEXT,
  user_agent TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS rate_limits;
CREATE TABLE rate_limits (
  ip TEXT PRIMARY KEY,
  count INTEGER DEFAULT 1,
  expires_at INTEGER
);
