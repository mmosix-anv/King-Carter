const { createClient } = require('@supabase/supabase-js');
const { Pool } = require('pg');

class SupabaseDatabase {
  constructor() {
    // Supabase client for auth and realtime features
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Direct PostgreSQL connection for complex queries
    this.pool = new Pool({
      connectionString: process.env.POSTGRES_URL_NON_POOLING,
      ssl: {
        rejectUnauthorized: false
      }
    });
  }

  // Get PostgreSQL pool for direct queries
  getPool() {
    return this.pool;
  }

  // Get Supabase client
  getSupabase() {
    return this.supabase;
  }

  // Helper method to execute queries with callback style (for compatibility)
  query(sql, params = [], callback) {
    this.pool.query(sql, params)
      .then(result => callback(null, result.rows))
      .catch(err => callback(err));
  }

  // Get single row (compatible with sqlite3 db.get)
  get(sql, params = [], callback) {
    this.pool.query(sql, params)
      .then(result => callback(null, result.rows[0] || null))
      .catch(err => callback(err));
  }

  // Get all rows (compatible with sqlite3 db.all)
  all(sql, params = [], callback) {
    this.pool.query(sql, params)
      .then(result => callback(null, result.rows))
      .catch(err => callback(err));
  }

  // Run query (compatible with sqlite3 db.run)
  run(sql, params = [], callback) {
    this.pool.query(sql, params)
      .then(result => {
        if (callback) callback.call({ changes: result.rowCount }, null);
      })
      .catch(err => {
        if (callback) callback(err);
      });
  }

  // Close connection
  close() {
    this.pool.end();
  }
}

module.exports = SupabaseDatabase;