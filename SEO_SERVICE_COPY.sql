-- ============================================================================
-- King & Carter — on-page SEO copy for the four service pages
-- Source: "On-Page SEO Copy Instructions" (final), pages 1–5.
--
-- Service page copy lives in the `services` table, not in the codebase, so these
-- pages are updated here rather than in a deploy.
--
--   tagline      -> the short preview under each card on the homepage AND the
--                   line under the H1 on the service page hero
--   description  -> the body paragraphs on the service page
--   sections     -> headed content blocks below the description
--
-- STATUS: APPLIED to the live database on 2026-08-10. This file is the record of
-- what was run. Rollback for tagline/description: SEO_SERVICE_COPY_BACKUP.sql
--
-- NOTE ON TAGLINES: the copy doc's homepage preview sentences run 155-187 chars.
-- At that length they fill the whole service card on mobile and bury the image,
-- which the doc's own instruction to preserve imagery and visual hierarchy rules
-- out. Taglines below are trimmed to ~90-110 chars with the primary keyword kept
-- at the front; the full preview wording survives verbatim in `description`.
-- ============================================================================


-- ─── PART 1 — taglines and body copy (no schema change) ─────────────────────

-- Page 2 — Private Luxury Transportation
UPDATE services SET
  tagline = 'Private car service in Atlanta designed around your schedule, preferences and destination.',
  description = ARRAY[
    'King & Carter provides private car and chauffeur service throughout Atlanta for individuals seeking a more personal approach to transportation. Each journey is coordinated around your schedule and preferences, combining professional chauffeurs, premium vehicles, discretion and personalized hospitality.',
    'For clients who prefer greater flexibility, hourly chauffeured service provides the convenience of having a professional driver and vehicle available throughout your itinerary.'
  ]
WHERE slug = 'private-luxury-transport';


-- Page 3 — Corporate & Executive Transportation
-- Its three headed sub-sections are in Part 2.
UPDATE services SET
  tagline = 'Corporate and executive transportation in Atlanta for business travelers, executives and organizations.',
  description = ARRAY[
    'King & Carter provides corporate and executive transportation throughout Atlanta for business travelers, executives, corporate teams and organizations requiring dependable, discreet and professionally coordinated ground transportation.',
    'From airport arrivals and hotel transfers to meetings, conferences, dinners and multi-stop itineraries, each journey is coordinated around your schedule with professional chauffeurs, premium vehicles and an intentional approach to hospitality.'
  ]
WHERE slug = 'corporate-executive-travel';


-- Page 4 — Airport & Hotel Transfers
UPDATE services SET
  tagline = 'Private Atlanta airport car service connecting ATL with hotels, residences and destinations across the city.',
  description = ARRAY[
    'King & Carter provides private airport car service to and from Hartsfield-Jackson Atlanta International Airport, hotels, residences and destinations throughout the Atlanta area. Each transfer is coordinated around your itinerary with professional chauffeurs, flight monitoring, luggage assistance and personalized service designed to make your arrival or departure seamless.'
  ]
WHERE slug = 'airport-hotel-transfers';


-- Page 5 — Special Engagements & Events
UPDATE services SET
  tagline = 'Luxury event transportation in Atlanta for private celebrations, corporate engagements and special occasions.',
  description = ARRAY[
    'King & Carter provides luxury event transportation throughout Atlanta for private celebrations, corporate engagements, concerts, sporting events, weddings, dinners and special occasions.',
    'From individual chauffeured SUVs to transportation for multiple guests, each engagement is coordinated around your itinerary, timing and transportation needs, allowing you and your guests to focus on the occasion.',
    'Transportation can be arranged by transfer or by the hour, providing the flexibility to keep your chauffeur and vehicle available as your itinerary develops.'
  ]
WHERE slug = 'special-engagements-events';


-- ─── PART 2 — headed content blocks ─────────────────────────────────────────
-- The copy doc asks for these as "concise card/content blocks" with their own
-- headings. `description` is a flat text[] with no headings, so a `sections`
-- column was added. It is rendered by ServicePage.tsx and editable under
-- Content Sections in the admin service editor.

ALTER TABLE services ADD COLUMN IF NOT EXISTS sections jsonb DEFAULT '[]'::jsonb;

UPDATE services SET sections = '[
  {
    "heading": "Designed Around the Business Day",
    "body": [
      "Whether traveling between the airport, hotel, office, meeting or corporate engagement, King & Carter provides private executive car service designed around the pace and expectations of business travel.",
      "Transportation can be arranged by individual transfer or by the hour, providing the flexibility to accommodate meetings, schedule changes and multi-stop itineraries throughout Atlanta."
    ]
  },
  {
    "heading": "A Consistent Experience for Your Organization",
    "body": [
      "King & Carter supports companies and organizations with professional transportation for executives, clients, guests and corporate teams.",
      "From individual travelers to coordinated group transportation, our goal is to provide a consistent experience from arrival through departure while allowing your team to focus on business rather than transportation logistics."
    ]
  },
  {
    "heading": "Meetings, Conferences & Corporate Events",
    "body": [
      "For meetings, conferences, dinners and corporate engagements, King & Carter can coordinate executive SUVs and group transportation between ATL, hotels, offices, meeting locations, restaurants and event venues throughout Atlanta."
    ]
  }
]'::jsonb
WHERE slug = 'corporate-executive-travel';

UPDATE services SET sections = '[
  {
    "heading": "Arriving in Atlanta",
    "body": [
      "Your airport experience begins before you land. King & Carter monitors your flight and coordinates your pickup based on your actual arrival time. Your chauffeur will assist with luggage and provide comfortable, discreet transportation from ATL to your hotel, residence, meeting or next destination."
    ]
  },
  {
    "heading": "Departing Atlanta",
    "body": [
      "For departures, King & Carter coordinates your pickup around your flight schedule, departure location and anticipated travel time to Hartsfield-Jackson Atlanta International Airport, helping create a smooth transition from your hotel, residence or meeting to ATL."
    ]
  },
  {
    "heading": "Hotel Transportation",
    "body": [
      "King & Carter provides private transportation between Atlanta hotels, the airport, business districts, restaurants, event venues and other destinations, giving business and leisure travelers a consistent chauffeured transportation experience throughout their stay."
    ]
  }
]'::jsonb
WHERE slug = 'airport-hotel-transfers';
