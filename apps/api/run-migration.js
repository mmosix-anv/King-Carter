#!/usr/bin/env node

/**
 * Migration Runner for Supabase Database
 * 
 * This script runs SQL migration files against the Supabase database.
 * Usage: node run-migration.js <migration-file>
 * Example: node run-migration.js migrations/001_extend_services_table.sql
 */

const fs = require('fs');
const path = require('path');
const SupabaseDatabase = require('./supabase-database');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

class MigrationRunner {
  constructor() {
    this.db = new SupabaseDatabase();
  }

  async runMigration(migrationFile) {
    try {
      console.log(`Running migration: ${migrationFile}`);
      
      // Read the migration file
      const migrationPath = path.join(__dirname, migrationFile);
      if (!fs.existsSync(migrationPath)) {
        throw new Error(`Migration file not found: ${migrationPath}`);
      }

      const sql = fs.readFileSync(migrationPath, 'utf8');
      
      // Split SQL statements by semicolon (simple approach)
      // Note: This won't handle semicolons inside strings properly, but works for most migrations
      const statements = sql
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

      console.log(`Found ${statements.length} SQL statements to execute`);

      // Execute each statement
      for (let i = 0; i < statements.length; i++) {
        const statement = statements[i];
        console.log(`\nExecuting statement ${i + 1}/${statements.length}...`);
        
        try {
          await this.executeStatement(statement);
          console.log(`✓ Statement ${i + 1} executed successfully`);
        } catch (error) {
          console.error(`✗ Statement ${i + 1} failed:`, error.message);
          throw error;
        }
      }

      console.log('\n✓ Migration completed successfully!');
      
    } catch (error) {
      console.error('\n✗ Migration failed:', error.message);
      throw error;
    } finally {
      this.db.close();
    }
  }

  executeStatement(sql) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, [], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}

// Run migration if called directly
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error('Usage: node run-migration.js <migration-file>');
    console.error('Example: node run-migration.js migrations/001_extend_services_table.sql');
    process.exit(1);
  }

  const migrationFile = args[0];
  const runner = new MigrationRunner();
  
  runner.runMigration(migrationFile)
    .then(() => {
      console.log('\nMigration process completed.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\nMigration process failed:', error);
      process.exit(1);
    });
}

module.exports = MigrationRunner;
