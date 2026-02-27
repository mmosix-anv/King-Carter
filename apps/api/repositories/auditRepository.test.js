const AuditRepository = require('./auditRepository');
const SupabaseDatabase = require('../supabase-database');

// Mock the SupabaseDatabase
jest.mock('../supabase-database');

describe('AuditRepository', () => {
  let auditRepo;
  let mockPool;
  let mockQuery;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Create mock query function
    mockQuery = jest.fn();
    mockPool = {
      query: mockQuery
    };

    // Mock SupabaseDatabase instance
    SupabaseDatabase.mockImplementation(() => ({
      getPool: () => mockPool,
      close: jest.fn()
    }));

    auditRepo = new AuditRepository();
  });

  describe('recordChange', () => {
    it('should record a change with all fields', async () => {
      const changeData = {
        entityType: 'service',
        entityId: 'test-service',
        action: 'update',
        userId: 1,
        changes: { heroTitle: 'New Title' }
      };

      const mockResult = {
        rows: [{
          id: 1,
          entity_type: 'service',
          entity_id: 'test-service',
          action: 'update',
          user_id: 1,
          changes: JSON.stringify({ heroTitle: 'New Title' }),
          created_at: new Date()
        }]
      };

      mockQuery.mockResolvedValue(mockResult);

      const result = await auditRepo.recordChange(changeData);

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO audit_trail'),
        [
          'service',
          'test-service',
          'update',
          1,
          JSON.stringify({ heroTitle: 'New Title' })
        ]
      );
      expect(result).toEqual(mockResult.rows[0]);
    });

    it('should record a change without changes object', async () => {
      const changeData = {
        entityType: 'service',
        entityId: 'test-service',
        action: 'create',
        userId: 1
      };

      const mockResult = {
        rows: [{
          id: 2,
          entity_type: 'service',
          entity_id: 'test-service',
          action: 'create',
          user_id: 1,
          changes: null,
          created_at: new Date()
        }]
      };

      mockQuery.mockResolvedValue(mockResult);

      const result = await auditRepo.recordChange(changeData);

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO audit_trail'),
        [
          'service',
          'test-service',
          'create',
          1,
          null
        ]
      );
      expect(result).toEqual(mockResult.rows[0]);
    });

    it('should handle delete action', async () => {
      const changeData = {
        entityType: 'media',
        entityId: '123',
        action: 'delete',
        userId: 2
      };

      const mockResult = {
        rows: [{
          id: 3,
          entity_type: 'media',
          entity_id: '123',
          action: 'delete',
          user_id: 2,
          changes: null,
          created_at: new Date()
        }]
      };

      mockQuery.mockResolvedValue(mockResult);

      const result = await auditRepo.recordChange(changeData);

      expect(result.action).toBe('delete');
      expect(result.entity_type).toBe('media');
    });

    it('should throw error when database query fails', async () => {
      const changeData = {
        entityType: 'service',
        entityId: 'test-service',
        action: 'update',
        userId: 1
      };

      mockQuery.mockRejectedValue(new Error('Database error'));

      await expect(auditRepo.recordChange(changeData)).rejects.toThrow(
        'Failed to record audit trail: Database error'
      );
    });
  });

  describe('getHistory', () => {
    it('should retrieve audit history for an entity', async () => {
      const mockResult = {
        rows: [
          {
            id: 3,
            entity_type: 'service',
            entity_id: 'test-service',
            action: 'update',
            user_id: 1,
            changes: JSON.stringify({ heroTitle: 'Updated Title' }),
            created_at: new Date('2024-01-03')
          },
          {
            id: 2,
            entity_type: 'service',
            entity_id: 'test-service',
            action: 'update',
            user_id: 1,
            changes: JSON.stringify({ heroTagline: 'New Tagline' }),
            created_at: new Date('2024-01-02')
          },
          {
            id: 1,
            entity_type: 'service',
            entity_id: 'test-service',
            action: 'create',
            user_id: 1,
            changes: null,
            created_at: new Date('2024-01-01')
          }
        ]
      };

      mockQuery.mockResolvedValue(mockResult);

      const result = await auditRepo.getHistory('service', 'test-service');

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('SELECT'),
        ['service', 'test-service', 50]
      );
      expect(result).toHaveLength(3);
      expect(result[0].changes).toEqual({ heroTitle: 'Updated Title' });
      expect(result[1].changes).toEqual({ heroTagline: 'New Tagline' });
      expect(result[2].changes).toBeNull();
    });

    it('should respect custom limit option', async () => {
      const mockResult = { rows: [] };
      mockQuery.mockResolvedValue(mockResult);

      await auditRepo.getHistory('service', 'test-service', { limit: 10 });

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('LIMIT $3'),
        ['service', 'test-service', 10]
      );
    });

    it('should return empty array when no history exists', async () => {
      const mockResult = { rows: [] };
      mockQuery.mockResolvedValue(mockResult);

      const result = await auditRepo.getHistory('service', 'nonexistent');

      expect(result).toEqual([]);
    });

    it('should throw error when database query fails', async () => {
      mockQuery.mockRejectedValue(new Error('Database error'));

      await expect(
        auditRepo.getHistory('service', 'test-service')
      ).rejects.toThrow('Failed to fetch audit history: Database error');
    });

    it('should handle records with null changes field', async () => {
      const mockResult = {
        rows: [
          {
            id: 1,
            entity_type: 'service',
            entity_id: 'test-service',
            action: 'create',
            user_id: 1,
            changes: null,
            created_at: new Date()
          }
        ]
      };

      mockQuery.mockResolvedValue(mockResult);

      const result = await auditRepo.getHistory('service', 'test-service');

      expect(result[0].changes).toBeNull();
    });
  });

  describe('close', () => {
    it('should close database connection', () => {
      const mockClose = jest.fn();
      SupabaseDatabase.mockImplementation(() => ({
        getPool: () => mockPool,
        close: mockClose
      }));

      const repo = new AuditRepository();
      repo.close();

      expect(mockClose).toHaveBeenCalled();
    });
  });
});
