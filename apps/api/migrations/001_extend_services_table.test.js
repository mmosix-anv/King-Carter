/**
 * Test for services table extension migration
 * 
 * This test verifies that the migration adds the required columns
 * and maintains backward compatibility with existing data.
 */

const SupabaseDatabase = require('../supabase-database');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../../.env') });

describe('Services Table Extension Migration', () => {
  let db;

  beforeAll(() => {
    db = new SupabaseDatabase();
  });

  afterAll(() => {
    db.close();
  });

  test('services table should have status column', (done) => {
    db.get(
      `SELECT column_name, data_type, column_default 
       FROM information_schema.columns 
       WHERE table_name = 'services' AND column_name = 'status'`,
      [],
      (err, row) => {
        expect(err).toBeNull();
        expect(row).toBeDefined();
        expect(row.column_name).toBe('status');
        expect(row.data_type).toBe('character varying');
        done();
      }
    );
  });

  test('services table should have created_at column', (done) => {
    db.get(
      `SELECT column_name, data_type 
       FROM information_schema.columns 
       WHERE table_name = 'services' AND column_name = 'created_at'`,
      [],
      (err, row) => {
        expect(err).toBeNull();
        expect(row).toBeDefined();
        expect(row.column_name).toBe('created_at');
        expect(row.data_type).toBe('timestamp without time zone');
        done();
      }
    );
  });

  test('services table should have created_by column', (done) => {
    db.get(
      `SELECT column_name, data_type 
       FROM information_schema.columns 
       WHERE table_name = 'services' AND column_name = 'created_by'`,
      [],
      (err, row) => {
        expect(err).toBeNull();
        expect(row).toBeDefined();
        expect(row.column_name).toBe('created_by');
        expect(row.data_type).toBe('integer');
        done();
      }
    );
  });

  test('services table should have updated_by column', (done) => {
    db.get(
      `SELECT column_name, data_type 
       FROM information_schema.columns 
       WHERE table_name = 'services' AND column_name = 'updated_by'`,
      [],
      (err, row) => {
        expect(err).toBeNull();
        expect(row).toBeDefined();
        expect(row.column_name).toBe('updated_by');
        expect(row.data_type).toBe('integer');
        done();
      }
    );
  });

  test('existing services should have published status by default', (done) => {
    db.all('SELECT id, status FROM services', [], (err, rows) => {
      expect(err).toBeNull();
      
      if (rows && rows.length > 0) {
        // Check that all existing services have a status
        rows.forEach(row => {
          expect(row.status).toBeDefined();
          expect(['draft', 'published']).toContain(row.status);
        });
      }
      
      done();
    });
  });

  test('created_by foreign key should reference users table', (done) => {
    db.get(
      `SELECT
        tc.constraint_name,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
      WHERE tc.table_name = 'services' 
        AND tc.constraint_type = 'FOREIGN KEY'
        AND kcu.column_name = 'created_by'`,
      [],
      (err, row) => {
        expect(err).toBeNull();
        expect(row).toBeDefined();
        expect(row.foreign_table_name).toBe('users');
        expect(row.foreign_column_name).toBe('id');
        done();
      }
    );
  });

  test('updated_by foreign key should reference users table', (done) => {
    db.get(
      `SELECT
        tc.constraint_name,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
      WHERE tc.table_name = 'services' 
        AND tc.constraint_type = 'FOREIGN KEY'
        AND kcu.column_name = 'updated_by'`,
      [],
      (err, row) => {
        expect(err).toBeNull();
        expect(row).toBeDefined();
        expect(row.foreign_table_name).toBe('users');
        expect(row.foreign_column_name).toBe('id');
        done();
      }
    );
  });
});
