-- King & Carter CMS - Seed Data
-- Run this after schema.sql

-- ============================================
-- DEFAULT ADMIN USER
-- ============================================
-- Admin user should be created through Supabase Auth Dashboard
-- Then linked to admin_users table using the SQL in ADMIN_SETUP.md

-- ============================================
-- DEFAULT SERVICES
-- ============================================

INSERT INTO services (id, title, slug, tagline, hero_image, description, highlights, cta, status, display_order)
VALUES 
  (
    'private-luxury-transport',
    'Private Luxury Transport',
    'private-luxury-transport',
    'Designed for individuals and families seeking comfort, privacy, and reliability.',
    '/placeholder-hero.jpg',
    '["Our private luxury transport service offers a discreet, personalized travel experience tailored to your preferences.", "Each journey is crafted with attention to detail, ensuring a seamless experience from pickup to destination."]'::jsonb,
    '["Discreet Chauffeurs", "Premium SUVs", "Privacy-Focused Travel", "Flexible Scheduling", "Door-to-Door Service", "Refined Presentation"]'::jsonb,
    '{"text": "Travel, Thoughtfully Arranged", "buttonLabel": "Book Private Transport", "buttonUrl": "/contact"}'::jsonb,
    'published',
    1
  ),
  (
    'corporate-executive-travel',
    'Corporate Executive Travel',
    'corporate-executive-travel',
    'Professional transportation solutions for business executives and corporate events.',
    '/placeholder-hero.jpg',
    '["Reliable and punctual service designed for busy executives and corporate professionals.", "Maintain your professional image with our premium fleet and experienced chauffeurs."]'::jsonb,
    '["Executive Fleet", "Professional Chauffeurs", "Punctual Service", "Corporate Accounts", "Airport Transfers", "Meeting Transportation"]'::jsonb,
    '{"text": "Professional Transportation Excellence", "buttonLabel": "Book Corporate Service", "buttonUrl": "/contact"}'::jsonb,
    'published',
    2
  ),
  (
    'airport-hotel-transfers',
    'Airport & Hotel Transfers',
    'airport-hotel-transfers',
    'Seamless airport transfers with flight monitoring and meet and greet service.',
    '/placeholder-hero.jpg',
    '["Experience stress-free airport transfers with our premium concierge service.", "From flight monitoring to luggage assistance, we handle every detail of your journey."]'::jsonb,
    '["Flight Monitoring", "Meet & Greet Service", "Luggage Assistance", "VIP Treatment", "Real time Updates", "24/7 Availability"]'::jsonb,
    '{"text": "Seamless Airport Experience", "buttonLabel": "Book Airport Service", "buttonUrl": "/contact"}'::jsonb,
    'published',
    3
  ),
  (
    'special-engagements-events',
    'Special Engagements & Events',
    'special-engagements-events',
    'Elegant transportation for weddings, galas, and memorable occasions.',
    '/placeholder-hero.jpg',
    '["Make your special day even more memorable with our luxury transportation services.", "From weddings to galas, we provide elegant and reliable transportation for all occasions."]'::jsonb,
    '["Wedding Transportation", "Event Coordination", "Luxury Vehicles", "Special Occasion Service", "Group Transportation", "Memorable Experience"]'::jsonb,
    '{"text": "Celebrate in Style", "buttonLabel": "Book Event Transport", "buttonUrl": "/contact"}'::jsonb,
    'published',
    4
  )
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- SITE CONFIGURATION
-- ============================================

INSERT INTO site_config (key, value, description)
VALUES
  (
    'general',
    '{
      "siteName": "King & Carter Premier",
      "siteUrl": "https://kingandcarter.com",
      "companyName": "King & Carter Premier",
      "tagline": "Luxury Ground Transportation in Atlanta",
      "phone": "(770) 766-0383",
      "email": "info@kingandcarter.com",
      "address": {
        "street": "",
        "city": "Atlanta",
        "state": "GA",
        "zip": "",
        "country": "US"
      },
      "socialMedia": {
        "twitter": "@kingandcarter",
        "facebook": "",
        "instagram": "",
        "linkedin": ""
      }
    }'::jsonb,
    'General site configuration'
  ),
  (
    'seo_defaults',
    '{
      "defaultTitle": "King & Carter Premier | Luxury Ground Transportation in Atlanta",
      "defaultDescription": "Premium luxury transportation services in Atlanta, GA. Executive car service, airport transfers, corporate travel, and special event transportation. Professional chauffeurs, modern fleet, 24/7 availability.",
      "defaultKeywords": ["luxury transportation Atlanta", "executive car service Atlanta", "private chauffeur Atlanta", "luxury car service Atlanta GA"],
      "twitterHandle": "@kingandcarter",
      "ogImage": "/og-image.jpg"
    }'::jsonb,
    'Default SEO settings'
  ),
  (
    'contact',
    '{
      "email": "info@kingandcarter.com",
      "phone": "(770) 766-0383",
      "hours": "24/7 Available",
      "location": "Atlanta, Georgia",
      "address": {
        "city": "Atlanta",
        "state": "GA",
        "country": "US"
      },
      "coordinates": {
        "lat": 33.7490,
        "lng": -84.3880
      }
    }'::jsonb,
    'Contact information'
  ),
  (
    'mail',
    '{
      "resendApiKey": "",
      "fromEmail": "noreply@kingandcarter.com",
      "fromName": "King & Carter Premier",
      "toEmail": "info@kingandcarter.com",
      "replyToEmail": "",
      "enabled": false
    }'::jsonb,
    'Email configuration for contact form'
  )
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- ============================================
-- SEO SETTINGS
-- ============================================

INSERT INTO seo_settings (page_type, page_identifier, title, description, keywords, meta_robots)
VALUES
  (
    'home',
    NULL,
    'Luxury Ground Transportation Atlanta | King & Carter Premier',
    'Experience premium ground transportation in Atlanta. Professional chauffeurs, luxury vehicles, and exceptional service for executives, families, and special events. Book your ride today.',
    ARRAY['luxury transportation Atlanta', 'executive car service', 'private chauffeur Atlanta', 'premium ground transportation'],
    'index, follow'
  ),
  (
    'about',
    NULL,
    'About King & Carter Premier | Atlanta Luxury Transportation',
    'Learn about King & Carter Premier, Atlanta''s premier luxury ground transportation service. Our commitment to excellence, professionalism, and refined service.',
    ARRAY['about King Carter', 'luxury transportation company Atlanta', 'premium car service Atlanta'],
    'index, follow'
  ),
  (
    'contact',
    NULL,
    'Contact Us | Book Luxury Transportation in Atlanta',
    'Contact King & Carter Premier for luxury transportation in Atlanta. Request a quote, book a ride, or inquire about our premium car services. Available 24/7.',
    ARRAY['contact luxury car service Atlanta', 'book transportation Atlanta', 'request quote car service'],
    'index, follow'
  )
ON CONFLICT (page_type, page_identifier) DO NOTHING;

-- ============================================
-- FLEET VEHICLES
-- ============================================

INSERT INTO fleet_vehicles (id, name, category, description, passengers, luggage, amenities, image, status, display_order)
VALUES
  (
    'suburban',
    '2026 Chevrolet Suburban',
    'Executive SUV',
    'Generous space meets quiet composure. The Suburban delivers a commanding presence paired with the kind of interior comfort that makes every mile feel unhurried — ideal for executive groups and seamless airport transfers.',
    '6',
    'Up to 6',
    '["Complimentary Wi-Fi", "Bottled Water", "Climate Control", "Privacy Windows"]'::jsonb,
    '/images/fleet-suburban.jpg',
    'published',
    1
  ),
  (
    'escalade',
    '2026 Cadillac Escalade',
    'Executive SUV',
    'The definitive luxury SUV. With its signature lighting and whisper-quiet cabin, the Escalade cocoons passengers in handcrafted comfort — transforming every journey into a first-class experience.',
    '6',
    'Up to 6',
    '["Complimentary Wi-Fi", "Bottled Water", "Climate Control", "Privacy Windows"]'::jsonb,
    '/images/fleet-escalade-ext.jpg',
    'published',
    2
  ),
  (
    'maybach',
    '2026 Mercedes-Maybach S-Class',
    'Ultra-Luxury Sedan',
    'The pinnacle of chauffeured luxury. An extended wheelbase creates a rear cabin of extraordinary space and serenity, where reclining executive seats and hand-finished materials transform every journey into a private retreat.',
    '3',
    '3',
    '["Executive Seats with Calf Rests", "Complimentary Wi-Fi", "Bottled Water", "Rear Privacy Partition"]'::jsonb,
    '/images/fleet-maybach.webp',
    'published',
    3
  ),
  (
    'sprinter',
    'Mercedes-Benz Executive Sprinter',
    'Executive Coach',
    'Group travel, redefined. A bespoke cabin designed for comfort and productivity — whether coordinating a corporate delegation or hosting a private celebration, every guest travels with distinction.',
    '12',
    '10–12',
    '["Flat-Screen TVs", "Dining Tables", "Complimentary Wi-Fi", "Privacy Partition"]'::jsonb,
    '/images/fleet-sprinter.jpg',
    'published',
    4
  ),
  (
    'ghost',
    'Rolls-Royce Ghost',
    'Ultra-Luxury Sedan',
    'The art of simplicity. Extraordinary presence delivered with absolute discretion — the handcrafted interior wraps passengers in an atmosphere of calm, unhurried elegance that makes every journey feel effortless.',
    '3',
    '3',
    '["Complimentary Wi-Fi", "Bottled Water", "Handcrafted Interior", "Rear Privacy Curtains"]'::jsonb,
    '/images/fleet-ghost.jpg',
    'published',
    5
  ),
  (
    'cullinan',
    'Rolls-Royce Cullinan',
    'Ultra-Luxury SUV',
    'Uncompromising luxury meets extraordinary capability. An elevated seating position, whisper-quiet cabin, and effortless power create a sanctuary that moves with purpose — whether navigating city streets or venturing beyond.',
    '4',
    '4',
    '["Complimentary Wi-Fi", "Bottled Water", "Handcrafted Interior", "Panoramic Views"]'::jsonb,
    '/images/fleet-cullinan.jpg',
    'published',
    6
  )
ON CONFLICT (id) DO NOTHING;
