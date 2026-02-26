-- Supabase Schema Migration
-- Run this in your Supabase SQL Editor

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Services table
CREATE TABLE IF NOT EXISTS services (
  id VARCHAR(255) PRIMARY KEY,
  hero_title VARCHAR(255) NOT NULL,
  hero_tagline TEXT,
  hero_image VARCHAR(255),
  featured_image VARCHAR(255),
  description JSONB,
  highlights JSONB,
  images JSONB,
  cta JSONB,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Navigation links table
CREATE TABLE IF NOT EXISTS nav_links (
  id SERIAL PRIMARY KEY,
  left_links JSONB,
  right_links JSONB,
  cta_buttons JSONB,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Global settings table
CREATE TABLE IF NOT EXISTS global_settings (
  key VARCHAR(255) PRIMARY KEY,
  value TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin user (password: admin123)
INSERT INTO users (username, password) 
VALUES ('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi')
ON CONFLICT (username) DO NOTHING;

-- Insert default service data
INSERT INTO services (id, hero_title, hero_tagline, hero_image, featured_image, description, highlights, images, cta)
VALUES 
  ('private-luxury-transport',
   'Private Luxury Transport',
   'Designed for individuals and families seeking comfort, privacy, and reliability.',
   '/image/mltqxr0s-tvy6qwy.png',
   '/image/mltqxr0s-tvy6qwy.png',
   '["Our private luxury transport service offers a discreet, personalized travel experience tailored to your preferences.", "Each journey is crafted with attention to detail, ensuring a seamless experience from pickup to destination."]'::jsonb,
   '["Discreet Chauffeurs", "Premium SUVs", "Privacy-Focused Travel", "Flexible Scheduling", "Door-to-Door Service", "Refined Presentation"]'::jsonb,
   '["/image/mltqxr0s-tvy6qwy.png", "/image/mltqxr0s-0ykx36e.png"]'::jsonb,
   '{"text": "Travel, Thoughtfully Arranged", "buttonLabel": "Book Private Transport"}'::jsonb),
  
  ('corporate-executive-transport',
   'Corporate Executive Transport',
   'Professional transportation solutions for business executives and corporate events.',
   '/image/mltqxr0s-tvy6qwy.png',
   '/image/mltqxr0s-tvy6qwy.png',
   '["Reliable and punctual service designed for busy executives and corporate professionals.", "Maintain your professional image with our premium fleet and experienced chauffeurs."]'::jsonb,
   '["Executive Fleet", "Professional Chauffeurs", "Punctual Service", "Corporate Accounts", "Airport Transfers", "Meeting Transportation"]'::jsonb,
   '["/image/mltqxr0s-tvy6qwy.png", "/image/mltqxr0s-0ykx36e.png"]'::jsonb,
   '{"text": "Professional Transportation Excellence", "buttonLabel": "Book Corporate Service"}'::jsonb),
   
  ('special-events-transport',
   'Special Events Transport',
   'Elegant transportation for weddings, galas, and memorable occasions.',
   '/image/mltqxr0s-tvy6qwy.png',
   '/image/mltqxr0s-tvy6qwy.png',
   '["Make your special day even more memorable with our luxury transportation services.", "From weddings to galas, we provide elegant and reliable transportation for all occasions."]'::jsonb,
   '["Wedding Transportation", "Event Coordination", "Luxury Vehicles", "Special Occasion Service", "Group Transportation", "Memorable Experience"]'::jsonb,
   '["/image/mltqxr0s-tvy6qwy.png", "/image/mltqxr0s-0ykx36e.png"]'::jsonb,
   '{"text": "Celebrate in Style", "buttonLabel": "Book Event Transport"}'::jsonb),
   
  ('airport-concierge-service',
   'Airport Concierge Service',
   'Premium airport transfers with meet-and-greet and luggage assistance.',
   '/image/mltqxr0s-tvy6qwy.png',
   '/image/mltqxr0s-tvy6qwy.png',
   '["Experience seamless airport transfers with our premium concierge service.", "From flight monitoring to luggage assistance, we handle every detail of your journey."]'::jsonb,
   '["Flight Monitoring", "Meet & Greet Service", "Luggage Assistance", "VIP Treatment", "Real-time Updates", "Stress-free Travel"]'::jsonb,
   '["/image/mltqxr0s-tvy6qwy.png", "/image/mltqxr0s-0ykx36e.png"]'::jsonb,
   '{"text": "Seamless Airport Experience", "buttonLabel": "Book Airport Service"}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Insert default navigation data
INSERT INTO nav_links (id, left_links, right_links, cta_buttons)
VALUES (
  1,
  '[{"label": "Services", "url": "/services", "openInNewTab": false}, {"label": "About Us", "url": "/about", "openInNewTab": false}]'::jsonb,
  '[{"label": "Experience", "url": "/experience", "openInNewTab": false}, {"label": "Contact", "url": "/contact", "openInNewTab": false}]'::jsonb,
  '{"primary": {"label": "Become a member", "url": "/membership", "variant": "primary"}, "secondary": {"label": "Login", "url": "/login", "variant": "secondary"}}'::jsonb
) ON CONFLICT (id) DO NOTHING;