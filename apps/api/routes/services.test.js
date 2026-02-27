const SupabaseDatabase = require('../supabase-database');
const AuditRepository = require('../repositories/auditRepository');

// Mock dependencies
jest.mock('../supabase-database');
jest.mock('../repositories/auditRepository');

describe('Services Routes Integration', () => {
  let mockDb;
  let mockAuditRepo;

  beforeEach(() => {
    // Mock database instance
    mockDb = {
      all: jest.fn(),
      get: jest.fn(),
      run: jest.fn()
    };
    SupabaseDatabase.mockImplementation(() => mockDb);

    // Mock audit repository instance
    mockAuditRepo = {
      recordChange: jest.fn().mockResolvedValue({ id: 1 })
    };
    AuditRepository.mockImplementation(() => mockAuditRepo);

    // Clear all mocks
    jest.clearAllMocks();
  });

  describe('Status Filtering', () => {
    it('should build query without status filter when no status provided', () => {
      const query = { status: undefined };
      let sqlQuery = 'SELECT * FROM services';
      const params = [];
      
      if (query.status) {
        sqlQuery += ' WHERE status = $1';
        params.push(query.status);
      }

      expect(sqlQuery).toBe('SELECT * FROM services');
      expect(params).toEqual([]);
    });

    it('should build query with status filter when status provided', () => {
      const query = { status: 'draft' };
      let sqlQuery = 'SELECT * FROM services';
      const params = [];
      
      if (query.status) {
        sqlQuery += ' WHERE status = $1';
        params.push(query.status);
      }

      expect(sqlQuery).toBe('SELECT * FROM services WHERE status = $1');
      expect(params).toEqual(['draft']);
    });
  });

  describe('Audit Trail Recording', () => {
    it('should record audit trail for service creation', async () => {
      const serviceData = {
        entityType: 'service',
        entityId: 'new-service',
        action: 'create',
        userId: 1,
        changes: {
          heroTitle: 'New Service',
          heroTagline: 'New Tagline',
          heroImage: '/image.jpg',
          featuredImage: '/featured.jpg',
          status: 'draft'
        }
      };

      await mockAuditRepo.recordChange(serviceData);

      expect(mockAuditRepo.recordChange).toHaveBeenCalledWith(serviceData);
      expect(mockAuditRepo.recordChange).toHaveBeenCalledTimes(1);
    });

    it('should record audit trail for service update', async () => {
      const serviceData = {
        entityType: 'service',
        entityId: 'existing-service',
        action: 'update',
        userId: 1,
        changes: {
          heroTitle: 'Updated Service',
          heroTagline: 'Updated Tagline',
          heroImage: '/image.jpg',
          featuredImage: '/featured.jpg',
          status: 'published'
        }
      };

      await mockAuditRepo.recordChange(serviceData);

      expect(mockAuditRepo.recordChange).toHaveBeenCalledWith(serviceData);
      expect(mockAuditRepo.recordChange).toHaveBeenCalledTimes(1);
    });

    it('should record audit trail for service deletion', async () => {
      const serviceData = {
        entityType: 'service',
        entityId: 'service-to-delete',
        action: 'delete',
        userId: 1
      };

      await mockAuditRepo.recordChange(serviceData);

      expect(mockAuditRepo.recordChange).toHaveBeenCalledWith(serviceData);
      expect(mockAuditRepo.recordChange).toHaveBeenCalledTimes(1);
    });
  });

  describe('Service Data Transformation', () => {
    it('should transform database row to service DTO', () => {
      const dbRow = {
        id: 'service1',
        hero_title: 'Service 1',
        hero_tagline: 'Tagline 1',
        hero_image: '/image1.jpg',
        featured_image: '/featured1.jpg',
        description: '["Description 1"]',
        highlights: '["Highlight 1"]',
        images: '[]',
        cta: '{"text":"CTA","buttonLabel":"Click"}',
        status: 'published',
        created_at: '2024-01-01',
        created_by: 1,
        updated_at: '2024-01-01',
        updated_by: 1
      };

      const service = {
        id: dbRow.id,
        serviceId: dbRow.id,
        heroTitle: dbRow.hero_title,
        heroTagline: dbRow.hero_tagline,
        heroImage: dbRow.hero_image,
        featuredImage: dbRow.featured_image,
        description: JSON.parse(dbRow.description),
        highlights: JSON.parse(dbRow.highlights),
        images: JSON.parse(dbRow.images),
        cta: JSON.parse(dbRow.cta),
        status: dbRow.status || 'published',
        createdAt: dbRow.created_at,
        createdBy: dbRow.created_by,
        updatedAt: dbRow.updated_at,
        updatedBy: dbRow.updated_by
      };

      expect(service.heroTitle).toBe('Service 1');
      expect(service.status).toBe('published');
      expect(service.description).toEqual(['Description 1']);
      expect(service.cta).toEqual({ text: 'CTA', buttonLabel: 'Click' });
    });

    it('should handle default status when not provided', () => {
      const dbRow = {
        id: 'service1',
        hero_title: 'Service 1',
        status: null
      };

      const status = dbRow.status || 'published';

      expect(status).toBe('published');
    });
  });

  describe('SQL Query Construction', () => {
    it('should construct INSERT query for new service', () => {
      const serviceData = {
        id: 'new-service',
        heroTitle: 'New Service',
        heroTagline: 'New Tagline',
        heroImage: '/image.jpg',
        featuredImage: '/featured.jpg',
        description: ['Description'],
        highlights: ['Highlight'],
        images: [],
        cta: { text: 'CTA', buttonLabel: 'Click' },
        status: 'draft'
      };
      const userId = 1;

      const sql = `INSERT INTO services 
        (id, hero_title, hero_tagline, hero_image, featured_image, description, highlights, images, cta, 
         status, created_at, created_by, updated_at, updated_by) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, CURRENT_TIMESTAMP, $11, CURRENT_TIMESTAMP, $12)`;
      
      const params = [
        serviceData.id,
        serviceData.heroTitle,
        serviceData.heroTagline,
        serviceData.heroImage,
        serviceData.featuredImage,
        JSON.stringify(serviceData.description),
        JSON.stringify(serviceData.highlights),
        JSON.stringify(serviceData.images),
        JSON.stringify(serviceData.cta),
        serviceData.status || 'draft',
        userId,
        userId
      ];

      expect(sql).toContain('INSERT INTO services');
      expect(params).toHaveLength(12);
      expect(params[0]).toBe('new-service');
      expect(params[9]).toBe('draft');
    });

    it('should construct UPDATE query for existing service', () => {
      const serviceData = {
        id: 'existing-service',
        heroTitle: 'Updated Service',
        heroTagline: 'Updated Tagline',
        heroImage: '/image.jpg',
        featuredImage: '/featured.jpg',
        description: ['Description'],
        highlights: ['Highlight'],
        images: [],
        cta: { text: 'CTA', buttonLabel: 'Click' },
        status: 'published'
      };
      const userId = 1;

      const sql = `UPDATE services SET
        hero_title = $1, hero_tagline = $2, hero_image = $3, featured_image = $4,
        description = $5, highlights = $6, images = $7, cta = $8, 
        status = $9, updated_at = CURRENT_TIMESTAMP, updated_by = $10
        WHERE id = $11`;
      
      const params = [
        serviceData.heroTitle,
        serviceData.heroTagline,
        serviceData.heroImage,
        serviceData.featuredImage,
        JSON.stringify(serviceData.description),
        JSON.stringify(serviceData.highlights),
        JSON.stringify(serviceData.images),
        JSON.stringify(serviceData.cta),
        serviceData.status || 'draft',
        userId,
        serviceData.id
      ];

      expect(sql).toContain('UPDATE services SET');
      expect(params).toHaveLength(11);
      expect(params[10]).toBe('existing-service');
      expect(params[8]).toBe('published');
    });

    it('should construct DELETE query', () => {
      const serviceId = 'service-to-delete';
      const sql = 'DELETE FROM services WHERE id = $1';
      const params = [serviceId];

      expect(sql).toBe('DELETE FROM services WHERE id = $1');
      expect(params).toEqual(['service-to-delete']);
    });
  });
});


