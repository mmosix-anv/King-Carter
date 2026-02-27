const SupabaseDatabase = require('../supabase-database');

jest.mock('../supabase-database');

describe('Global Settings Routes', () => {
  let mockDb;

  beforeEach(() => {
    mockDb = {
      all: jest.fn(),
      run: jest.fn()
    };
    SupabaseDatabase.mockImplementation(() => mockDb);
    jest.clearAllMocks();
  });

  describe('Settings Data Transformation', () => {
    it('should organize settings by category', () => {
      const mockRows = [
        { key: 'general.siteTitle', value: '"My Site"', category: 'general' },
        { key: 'contact.email', value: '"contact@example.com"', category: 'contact' },
        { key: 'seo.metaTitle', value: '"SEO Title"', category: 'seo' }
      ];

      const settings = {
        general: {},
        contact: {},
        seo: {}
      };

      mockRows.forEach(row => {
        const value = JSON.parse(row.value);
        const category = row.category || 'general';
        const keyParts = row.key.split('.');
        const actualKey = keyParts.length > 1 ? keyParts[1] : row.key;
        
        if (settings[category]) {
          settings[category][actualKey] = value;
        }
      });

      expect(settings).toEqual({
        general: { siteTitle: 'My Site' },
        contact: { email: 'contact@example.com' },
        seo: { metaTitle: 'SEO Title' }
      });
    });

    it('should handle non-JSON values', () => {
      const mockRows = [
        { key: 'general.siteTitle', value: 'Plain Text', category: 'general' }
      ];

      const settings = { general: {}, contact: {}, seo: {} };

      mockRows.forEach(row => {
        try {
          const value = JSON.parse(row.value);
          settings[row.category][row.key.split('.')[1]] = value;
        } catch {
          settings[row.category][row.key.split('.')[1]] = row.value;
        }
      });

      expect(settings.general.siteTitle).toBe('Plain Text');
    });
  });

  describe('Batch Settings Update', () => {
    it('should flatten nested settings into key-value pairs', () => {
      const settingsInput = {
        general: {
          siteTitle: 'New Site Title',
          contactEmail: 'new@example.com'
        },
        seo: {
          metaTitle: 'New Meta Title'
        }
      };

      const updates = [];
      
      if (settingsInput.general) {
        Object.entries(settingsInput.general).forEach(([key, value]) => {
          updates.push({ key: `general.${key}`, value, category: 'general' });
        });
      }
      
      if (settingsInput.seo) {
        Object.entries(settingsInput.seo).forEach(([key, value]) => {
          updates.push({ key: `seo.${key}`, value, category: 'seo' });
        });
      }

      expect(updates).toHaveLength(3);
      expect(updates[0]).toEqual({ 
        key: 'general.siteTitle', 
        value: 'New Site Title', 
        category: 'general' 
      });
      expect(updates[2]).toEqual({ 
        key: 'seo.metaTitle', 
        value: 'New Meta Title', 
        category: 'seo' 
      });
    });

    it('should support backward compatible single key-value updates', () => {
      const settingsInput = {
        key: 'test.key',
        value: 'test value',
        category: 'general'
      };

      const updates = [];
      
      if (settingsInput.key && settingsInput.value !== undefined) {
        updates.push({ 
          key: settingsInput.key, 
          value: settingsInput.value, 
          category: settingsInput.category || 'general' 
        });
      }

      expect(updates).toHaveLength(1);
      expect(updates[0]).toEqual({
        key: 'test.key',
        value: 'test value',
        category: 'general'
      });
    });
  });

  describe('SQL Query Construction', () => {
    it('should construct UPSERT query for settings', () => {
      const key = 'general.siteTitle';
      const value = 'My Site';
      const category = 'general';
      const userId = 1;

      const sql = `INSERT INTO global_settings 
        (key, value, category, updated_at, updated_by) 
        VALUES ($1, $2, $3, CURRENT_TIMESTAMP, $4)
        ON CONFLICT (key) DO UPDATE SET
        value = $2, category = $3, updated_at = CURRENT_TIMESTAMP, updated_by = $4`;

      const params = [key, JSON.stringify(value), category, userId];

      expect(sql).toContain('INSERT INTO global_settings');
      expect(sql).toContain('ON CONFLICT (key) DO UPDATE SET');
      expect(params).toEqual(['general.siteTitle', '"My Site"', 'general', 1]);
    });
  });
});
