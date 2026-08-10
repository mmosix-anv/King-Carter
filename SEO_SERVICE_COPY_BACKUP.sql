-- Current live values, captured 2026-08-10 03:44, before SEO_SERVICE_COPY.sql
-- Run these to restore the previous service page copy.

UPDATE services SET
  tagline = 'Designed for individuals and families seeking comfort, privacy, and reliability.',
  description = ARRAY[
    'Our private luxury transport service offers a discreet, personalized travel experience tailored to your preferences.',
    'Each journey is crafted with attention to detail, ensuring a seamless experience from pickup to destination.'
  ]
WHERE slug = 'private-luxury-transport';

UPDATE services SET
  tagline = 'Professional transportation solutions for business executives and corporate events.',
  description = ARRAY[
    'Reliable and punctual service designed for busy executives and corporate professionals.',
    'Maintain your professional image with our premium fleet and experienced chauffeurs.'
  ]
WHERE slug = 'corporate-executive-travel';

UPDATE services SET
  tagline = 'Seamless airport transfers with flight monitoring and meet-and-greet service.',
  description = ARRAY[
    'Experience stress-free airport transfers with our premium concierge service.',
    'From flight monitoring to luggage assistance, we handle every detail of your journey.'
  ]
WHERE slug = 'airport-hotel-transfers';

UPDATE services SET
  tagline = 'Elegant transportation for weddings, galas, and memorable occasions.',
  description = ARRAY[
    'Make your special day even more memorable with our luxury transportation services.',
    'From weddings to galas, we provide elegant and reliable transportation for all occasions.'
  ]
WHERE slug = 'special-engagements-events';

