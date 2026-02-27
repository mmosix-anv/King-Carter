const SupabaseDatabase = require('../supabase-database');

/**
 * AuditRepository handles database operations for audit trail records
 * Tracks changes to content entities for accountability and history tracking
 */
class AuditRepository {
  constructor() {
    this.db = new SupabaseDatabase();
  }

  /**
   * Record a change to an entity in the audit trail
   * @param {Object} changeData - Change information
   * @param {string} changeData.entityType - Type of entity (e.g., 'service', 'media', 'settings')
   * @param {string} changeData.entityId - ID of the entity that was changed
   * @param {string} changeData.action - Action performed ('create', 'update', 'delete')
   * @param {number} changeData.userId - User ID who made the change
   * @param {Object} changeData.changes - Object containing changed fields (optional)
   * @returns {Promise<Object>} Created audit trail record with id
   */
  async recordChange(changeData) {
    const {
      entityType,
      entityId,
      action,
      userId,
      changes = null
    } = changeData;

    const query = `
      INSERT INTO audit_trail (
        entity_type,
        entity_id,
        action,
        user_id,
        changes,
        created_at
      )
      VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
      RETURNING *
    `;

    const params = [
      entityType,
      entityId,
      action,
      userId,
      changes ? JSON.stringify(changes) : null
    ];

    try {
      const result = await this.db.getPool().query(query, params);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to record audit trail: ${error.message}`);
    }
  }

  /**
   * Get audit history for a specific entity
   * @param {string} entityType - Type of entity (e.g., 'service', 'media', 'settings')
   * @param {string} entityId - ID of the entity
   * @param {Object} options - Query options
   * @param {number} options.limit - Maximum number of records to return (default: 50)
   * @returns {Promise<Array>} Array of audit trail records ordered by most recent first
   */
  async getHistory(entityType, entityId, options = {}) {
    const { limit = 50 } = options;

    const query = `
      SELECT 
        id,
        entity_type,
        entity_id,
        action,
        user_id,
        changes,
        created_at
      FROM audit_trail
      WHERE entity_type = $1 AND entity_id = $2
      ORDER BY created_at DESC
      LIMIT $3
    `;

    const params = [entityType, entityId, limit];

    try {
      const result = await this.db.getPool().query(query, params);
      
      // Parse JSON changes field for each record
      return result.rows.map(row => ({
        ...row,
        changes: row.changes ? JSON.parse(row.changes) : null
      }));
    } catch (error) {
      throw new Error(`Failed to fetch audit history: ${error.message}`);
    }
  }

  /**
   * Close database connection
   */
  close() {
    this.db.close();
  }
}

module.exports = AuditRepository;
