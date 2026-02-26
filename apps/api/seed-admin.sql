-- Insert default admin user
-- Password: admin123 (hashed with bcrypt)
INSERT INTO users (id, username, password, created_at) VALUES 
(
  1,
  'admin',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  NOW()
)
ON CONFLICT (username) DO UPDATE SET
  password = EXCLUDED.password;