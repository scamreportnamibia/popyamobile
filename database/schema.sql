-- Database schema for Popya Mobile App

-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'user',
  avatar_url TEXT,
  user_code VARCHAR(50) UNIQUE,
  phone VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_verified BOOLEAN DEFAULT FALSE,
  last_login TIMESTAMP WITH TIME ZONE
);

-- User profiles table
CREATE TABLE user_profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  bio TEXT,
  location VARCHAR(255),
  date_of_birth DATE,
  gender VARCHAR(50),
  notifications_enabled BOOLEAN DEFAULT TRUE,
  dark_mode_enabled BOOLEAN DEFAULT FALSE,
  language VARCHAR(50) DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Expert profiles table
CREATE TABLE expert_profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  specialization VARCHAR(255),
  institution VARCHAR(255),
  qualification VARCHAR(255),
  years_of_experience INTEGER,
  license_number VARCHAR(255),
  is_verified BOOLEAN DEFAULT FALSE,
  verification_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Expert expertise areas
CREATE TABLE expert_expertise_areas (
  id SERIAL PRIMARY KEY,
  expert_profile_id INTEGER REFERENCES expert_profiles(id) ON DELETE CASCADE,
  expertise_area VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Mood entries
CREATE TABLE mood_entries (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  mood_value INTEGER NOT NULL, -- 1-5 scale
  mood_emoji VARCHAR(10),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Diary entries
CREATE TABLE diary_entries (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255),
  content TEXT NOT NULL,
  mood_id INTEGER REFERENCES mood_entries(id),
  is_private BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Support groups
CREATE TABLE support_groups (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  is_private BOOLEAN DEFAULT FALSE,
  created_by INTEGER REFERENCES users(id),
  max_members INTEGER DEFAULT 50,
  meeting_frequency VARCHAR(100),
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Group members
CREATE TABLE group_members (
  id SERIAL PRIMARY KEY,
  group_id INTEGER REFERENCES support_groups(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'member', -- 'admin', 'moderator', 'member'
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(group_id, user_id)
);

-- Events
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  location VARCHAR(255),
  is_virtual BOOLEAN DEFAULT FALSE,
  meeting_link TEXT,
  is_free BOOLEAN DEFAULT TRUE,
  price DECIMAL(10, 2),
  max_attendees INTEGER,
  image_url TEXT,
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Event attendees
CREATE TABLE event_attendees (
  id SERIAL PRIMARY KEY,
  event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'registered', -- 'registered', 'attended', 'cancelled'
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(event_id, user_id)
);

-- Chat messages
CREATE TABLE chat_messages (
  id SERIAL PRIMARY KEY,
  sender_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  recipient_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  group_id INTEGER REFERENCES support_groups(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Call sessions
CREATE TABLE call_sessions (
  id SERIAL PRIMARY KEY,
  caller_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  recipient_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  duration INTEGER, -- in seconds
  call_type VARCHAR(50), -- 'audio', 'video'
  status VARCHAR(50), -- 'completed', 'missed', 'rejected'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Call transcripts
CREATE TABLE call_transcripts (
  id SERIAL PRIMARY KEY,
  call_id INTEGER REFERENCES call_sessions(id) ON DELETE CASCADE,
  transcript TEXT,
  sentiment VARCHAR(50),
  keywords TEXT[],
  risk_level VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Reports
CREATE TABLE reports (
  id SERIAL PRIMARY KEY,
  reporter_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  reported_user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  problem_category VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  location_region VARCHAR(100),
  location_town VARCHAR(100),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  status VARCHAR(50) DEFAULT 'new', -- 'new', 'inProgress', 'resolved'
  risk_level VARCHAR(50) DEFAULT 'low', -- 'low', 'medium', 'high'
  assigned_to INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Advertisements
CREATE TABLE advertisements (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  image_url TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'scheduled', -- 'active', 'scheduled', 'expired'
  clicks INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Notifications
CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'message', 'reminder', 'diary', 'inactivity', 'system'
  is_read BOOLEAN DEFAULT FALSE,
  data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Mental health resources
CREATE TABLE mental_health_resources (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content TEXT,
  category VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'contact', 'article', 'video', 'exercise'
  url TEXT,
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_mood_entries_user_id ON mood_entries(user_id);
CREATE INDEX idx_diary_entries_user_id ON diary_entries(user_id);
CREATE INDEX idx_group_members_group_id ON group_members(group_id);
CREATE INDEX idx_group_members_user_id ON group_members(user_id);
CREATE INDEX idx_event_attendees_event_id ON event_attendees(event_id);
CREATE INDEX idx_event_attendees_user_id ON event_attendees(user_id);
CREATE INDEX idx_chat_messages_sender_id ON chat_messages(sender_id);
CREATE INDEX idx_chat_messages_recipient_id ON chat_messages(recipient_id);
CREATE INDEX idx_chat_messages_group_id ON chat_messages(group_id);
CREATE INDEX idx_call_sessions_caller_id ON call_sessions(caller_id);
CREATE INDEX idx_call_sessions_recipient_id ON call_sessions(recipient_id);
CREATE INDEX idx_reports_reporter_id ON reports(reporter_id);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update the updated_at column
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_expert_profiles_updated_at BEFORE UPDATE ON expert_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_diary_entries_updated_at BEFORE UPDATE ON diary_entries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_support_groups_updated_at BEFORE UPDATE ON support_groups FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reports_updated_at BEFORE UPDATE ON reports FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_advertisements_updated_at BEFORE UPDATE ON advertisements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_mental_health_resources_updated_at BEFORE UPDATE ON mental_health_resources FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing
INSERT INTO users (name, email, password_hash, role, user_code, is_verified)
VALUES 
('Super Admin', 'admin@popya.com', '$2a$10$XDCXMOYlrqpxL4KlmQW3Z.9Pq.VXBn1L9CJcJJQiWJMFrZDGmhKPe', 'super_admin', '12345', true),
('Dr. Sarah Johnson', 'expert@popya.com', '$2a$10$XDCXMOYlrqpxL4KlmQW3Z.9Pq.VXBn1L9CJcJJQiWJMFrZDGmhKPe', 'expert', '23456', true),
('John Doe', 'user@popya.com', '$2a$10$XDCXMOYlrqpxL4KlmQW3Z.9Pq.VXBn1L9CJcJJQiWJMFrZDGmhKPe', 'user', '34567', true);

-- Insert expert profile
INSERT INTO expert_profiles (user_id, specialization, institution, qualification, years_of_experience, license_number, is_verified)
VALUES 
(2, 'Clinical Psychology', 'Windhoek Central Hospital', 'Ph.D. in Clinical Psychology', 8, 'PSY12345', true);

-- Insert expert expertise areas
INSERT INTO expert_expertise_areas (expert_profile_id, expertise_area)
VALUES 
(1, 'Anxiety & Depression'),
(1, 'Trauma Recovery');

-- Insert support groups
INSERT INTO support_groups (name, description, category, created_by, meeting_frequency, image_url)
VALUES 
('Anxiety Support Group', 'A safe space to discuss anxiety and coping strategies', 'Anxiety', 2, 'Weekly', '/placeholder.svg?height=200&width=200'),
('Youth Mental Health', 'Support group for young adults dealing with mental health challenges', 'Youth', 2, 'Bi-weekly', '/placeholder.svg?height=200&width=200'),
('Women''s Mental Health', 'A group focused on women''s mental health issues', 'Women', 2, 'Weekly', '/placeholder.svg?height=200&width=200');

-- Insert events
INSERT INTO events (title, description, start_time, end_time, is_virtual, is_free, max_attendees, created_by, image_url)
VALUES 
('Anxiety Management Workshop', 'Learn practical techniques to manage anxiety', '2025-06-15 14:00:00+00', '2025-06-15 16:00:00+00', true, true, 50, 2, '/placeholder.svg?height=200&width=200'),
('Stress Relief Techniques', 'Discover effective stress relief methods', '2025-06-22 15:00:00+00', '2025-06-22 16:30:00+00', true, true, 30, 2, '/placeholder.svg?height=200&width=200'),
('Mental Health Awareness Day', 'Join us for a day of mental health awareness activities', '2025-07-10 10:00:00+00', '2025-07-10 17:00:00+00', false, true, 100, 2, '/placeholder.svg?height=200&width=200');

-- Insert mental health resources
INSERT INTO mental_health_resources (title, description, content, category, type, created_by)
VALUES 
('Mindfulness Meditation', 'A simple 5-minute mindfulness practice to reduce anxiety and stress', 'Find a quiet place to sit comfortably. Close your eyes and focus on your breath. Notice the sensation of breathing in and out. When your mind wanders, gently bring your attention back to your breath. Continue for 5 minutes.', 'anxiety', 'exercise', 2),
('Grounding Technique', 'A 5-4-3-2-1 grounding exercise for managing panic and anxiety', 'Name 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste. This helps bring you back to the present moment.', 'anxiety', 'exercise', 2),
('Sleep Hygiene Tips', 'Practical tips for improving sleep quality and mental health', 'Maintain a regular sleep schedule. Avoid screens before bed. Create a comfortable sleep environment. Limit caffeine and alcohol. Practice relaxation techniques before bedtime.', 'sleep', 'article', 2);
