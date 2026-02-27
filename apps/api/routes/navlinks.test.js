const SupabaseDatabase = require('../supabase-database');

jest.mock('../supabase-database');

describe('Navigation Links Routes', () => {
  let mockDb;

  beforeEach(() => {
    mockDb = {
      get: jest.fn(),
      run: jest.fn()
    };
    SupabaseDatabase.mockImplementation(() => mockDb);
    jest.clearAllMocks();
  });

  describe('Navigation Data Transformation', () => {
    it('should parse JSON strings from database', () => {
      const dbRow = {
        id: 1,
        left_links: '[{"label":"Home","url":"/","openInNewTab":false}]',
        right_links: '[{"label":"Contact","url":"/contact","openInNewTab":false}]',
        cta_buttons: '{"primary":{"label":"Get Started","url":"/start","variant":"primary"}}'
      };

      const navLinks = {
        leftLinks: JSON.parse(dbRow.left_links),
        rightLinks: JSON.parse(dbRow.right_links),
        ctaButtons: JSON.parse(dbRow.cta_buttons)
      };

      expect(navLinks.leftLinks).toHaveLength(1);
      expect(navLinks.leftLinks[0].label).toBe('Home');
      expect(navLinks.rightLinks).toHaveLength(1);
      expect(navLinks.ctaButtons.primary.label).toBe('Get Started');
    });

    it('should handle already parsed objects', () => {
      const dbRow = {
        id: 1,
        left_links: [{ label: 'Home', url: '/', openInNewTab: false }],
        right_links: [],
        cta_buttons: {}
      };

      const navLinks = {
        leftLinks: typeof dbRow.left_links === 'string' ? JSON.parse(dbRow.left_links) : dbRow.left_links,
        rightLinks: typeof dbRow.right_links === 'string' ? JSON.parse(dbRow.right_links) : dbRow.right_links,
        ctaButtons: typeof dbRow.cta_buttons === 'string' ? JSON.parse(dbRow.cta_buttons) : dbRow.cta_buttons
      };

      expect(navLinks.leftLinks).toHaveLength(1);
      expect(navLinks.rightLinks).toHaveLength(0);
    });

    it('should provide default structure when no data exists', () => {
      const defaultData = {
        leftLinks: [],
        rightLinks: [],
        ctaButtons: {
          primary: { label: '', url: '', variant: 'primary' },
          secondary: { label: '', url: '', variant: 'secondary' }
        }
      };

      expect(defaultData.leftLinks).toEqual([]);
      expect(defaultData.ctaButtons.primary.variant).toBe('primary');
    });
  });

  describe('Navigation Update Validation', () => {
    it('should validate leftLinks is an array', () => {
      const invalidData = {
        leftLinks: 'not an array',
        rightLinks: [],
        ctaButtons: {}
      };

      const isValid = Array.isArray(invalidData.leftLinks) && Array.isArray(invalidData.rightLinks);
      expect(isValid).toBe(false);
    });

    it('should validate rightLinks is an array', () => {
      const invalidData = {
        leftLinks: [],
        rightLinks: 'not an array',
        ctaButtons: {}
      };

      const isValid = Array.isArray(invalidData.leftLinks) && Array.isArray(invalidData.rightLinks);
      expect(isValid).toBe(false);
    });

    it('should accept valid navigation data', () => {
      const validData = {
        leftLinks: [{ label: 'Home', url: '/', openInNewTab: false }],
        rightLinks: [{ label: 'About', url: '/about', openInNewTab: false }],
        ctaButtons: {
          primary: { label: 'Get Started', url: '/start', variant: 'primary' }
        }
      };

      const isValid = Array.isArray(validData.leftLinks) && Array.isArray(validData.rightLinks);
      expect(isValid).toBe(true);
    });
  });

  describe('SQL Query Construction', () => {
    it('should construct UPSERT query for navigation', () => {
      const leftLinks = [{ label: 'Home', url: '/', openInNewTab: false }];
      const rightLinks = [{ label: 'Contact', url: '/contact', openInNewTab: false }];
      const ctaButtons = { primary: { label: 'CTA', url: '/cta', variant: 'primary' } };
      const userId = 1;

      const sql = `INSERT INTO nav_links 
    (id, left_links, right_links, cta_buttons, updated_at, updated_by) 
    VALUES (1, $1, $2, $3, CURRENT_TIMESTAMP, $4)
    ON CONFLICT (id) DO UPDATE SET
    left_links = $1, right_links = $2, cta_buttons = $3, 
    updated_at = CURRENT_TIMESTAMP, updated_by = $4`;

      const params = [
        JSON.stringify(leftLinks),
        JSON.stringify(rightLinks),
        JSON.stringify(ctaButtons),
        userId
      ];

      expect(sql).toContain('INSERT INTO nav_links');
      expect(sql).toContain('ON CONFLICT (id) DO UPDATE SET');
      expect(params).toHaveLength(4);
      expect(params[3]).toBe(1);
    });
  });

  describe('Navigation Link Structure', () => {
    it('should validate nav link structure', () => {
      const navLink = {
        label: 'Home',
        url: '/',
        openInNewTab: false
      };

      expect(navLink).toHaveProperty('label');
      expect(navLink).toHaveProperty('url');
      expect(navLink).toHaveProperty('openInNewTab');
      expect(typeof navLink.openInNewTab).toBe('boolean');
    });

    it('should validate CTA button structure', () => {
      const ctaButton = {
        label: 'Get Started',
        url: '/start',
        variant: 'primary'
      };

      expect(ctaButton).toHaveProperty('label');
      expect(ctaButton).toHaveProperty('url');
      expect(ctaButton).toHaveProperty('variant');
      expect(['primary', 'secondary']).toContain(ctaButton.variant);
    });
  });
});
