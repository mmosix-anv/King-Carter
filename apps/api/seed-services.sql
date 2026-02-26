-- Seed services data for King & Carter Premier
INSERT INTO services (id, hero_title, hero_tagline, hero_image, description, highlights, images, cta, updated_at) VALUES 
(
  'private-luxury-transport',
  'Private Luxury Transport',
  'Designed for individuals and families seeking comfort, privacy, and reliability.',
  '/image/mltqxr0s-tvy6qwy.png',
  '["Our private luxury transport service offers a discreet, personalized travel experience tailored to your preferences.", "Each journey is crafted with attention to detail, ensuring a seamless experience from pickup to destination.", "We understand that privacy and comfort are paramount. Our fleet of premium SUVs and sedans offers spacious interiors.", "Whether you''re traveling for business, pleasure, or family occasions, our private luxury transport service delivers reliability.", "Trust King & Carter Premier to provide a refined, thoughtful approach to private travel."]',
  '["Discreet Chauffeurs", "Premium SUVs", "Privacy-Focused Travel", "Flexible Scheduling", "Door-to-Door Service", "Refined Presentation"]',
  '["/image/mltqxr0s-tvy6qwy.png", "/image/mltqxr0s-0ykx36e.png", "/image/mltqxr0s-5bj4l8e.png", "/image/mltqxr0s-koo2o1u.png", "/image/mltqxr0s-hynsmyb.png", "/image/mltqxr0s-3fog7d9.png", "/image/mltqxr0s-ch5rmk1.png"]',
  '{"text": "Travel, Thoughtfully Arranged", "buttonLabel": "Book Private Transport"}',
  NOW()
),
(
  'corporate-executive-travel',
  'Corporate & Executive Travel',
  'Professional transportation solutions for business leaders and corporate teams.',
  '/image/mltqxr0s-0ykx36e.png',
  '["Our corporate and executive travel service is designed for business professionals who demand reliability.", "From airport transfers to multi-city business trips, our experienced chauffeurs ensure you arrive on time.", "We offer flexible corporate accounts, priority scheduling, and dedicated account management.", "Our commitment to discretion and professionalism means your business conversations remain private.", "Partner with King & Carter Premier for corporate travel that enhances productivity."]',
  '["Punctual & Reliable Service", "Executive Fleet Vehicles", "Corporate Account Management", "Mobile Office Environment", "Professional Chauffeurs", "Flexible Scheduling", "Confidential & Discreet", "Priority Booking"]',
  '["/image/mltqxr0s-tvy6qwy.png", "/image/mltqxr0s-0ykx36e.png", "/image/mltqxr0s-5bj4l8e.png", "/image/mltqxr0s-koo2o1u.png", "/image/mltqxr0s-hynsmyb.png", "/image/mltqxr0s-3fog7d9.png", "/image/mltqxr0s-ch5rmk1.png"]',
  '{"text": "Elevate Your Business Travel", "buttonLabel": "Book Corporate Service"}',
  NOW()
),
(
  'airport-hotel-transfers',
  'Airport & Hotel Transfers',
  'Seamless, punctual transfers for stress-free arrivals and departures.',
  '/image/mltqxr0s-5bj4l8e.png',
  '["Our airport and hotel transfer service eliminates the stress of travel logistics.", "From the moment you book, we handle every detail.", "We understand that travel can be unpredictable.", "For hotel transfers, we provide prompt, reliable service that respects your schedule.", "Experience the difference of professional airport and hotel transfer service."]',
  '["Flight Monitoring", "Meet & Greet Service", "24/7 Availability", "Luggage Assistance", "All Major Airports", "Hotel Coordination", "Flexible Pickup Windows", "Professional Drivers"]',
  '["/image/mltqxr0s-tvy6qwy.png", "/image/mltqxr0s-0ykx36e.png", "/image/mltqxr0s-5bj4l8e.png", "/image/mltqxr0s-koo2o1u.png", "/image/mltqxr0s-hynsmyb.png", "/image/mltqxr0s-3fog7d9.png", "/image/mltqxr0s-ch5rmk1.png"]',
  '{"text": "Arrive in Comfort and Style", "buttonLabel": "Book Airport Transfer"}',
  NOW()
),
(
  'special-engagements-events',
  'Special Engagements & Events',
  'Elegant transportation for weddings, galas, and memorable occasions.',
  '/image/mltqxr0s-koo2o1u.png',
  '["Your special occasions deserve transportation that matches their significance.", "From weddings to galas, corporate events to milestone celebrations, we provide elegant transportation.", "Our chauffeurs understand the importance of timing and presentation for special events.", "We work closely with event planners, venues, and coordinators to ensure seamless transportation.", "Make your special occasion truly unforgettable with transportation that reflects the elegance of your event."]',
  '["Wedding Transportation", "Gala & Black-Tie Events", "Corporate Functions", "Anniversary Celebrations", "Impeccably Presented Fleet", "Event Coordination", "Flexible Scheduling", "Professional Chauffeurs"]',
  '["/image/mltqxr0s-tvy6qwy.png", "/image/mltqxr0s-0ykx36e.png", "/image/mltqxr0s-5bj4l8e.png", "/image/mltqxr0s-koo2o1u.png", "/image/mltqxr0s-hynsmyb.png", "/image/mltqxr0s-3fog7d9.png", "/image/mltqxr0s-ch5rmk1.png"]',
  '{"text": "Make Your Occasion Unforgettable", "buttonLabel": "Book Event Transportation"}',
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  hero_title = EXCLUDED.hero_title,
  hero_tagline = EXCLUDED.hero_tagline,
  hero_image = EXCLUDED.hero_image,
  description = EXCLUDED.description,
  highlights = EXCLUDED.highlights,
  images = EXCLUDED.images,
  cta = EXCLUDED.cta,
  updated_at = EXCLUDED.updated_at;