# Database Migrations

This directory contains SQL migration files for the Supabase database schema.

## Migration Files

### 001_extend_services_table.sql
Extends the services table with:
- `status` column for draft/published workflow (Requirement 13.1)
- `created_at` column for tracking creation timestamp (Requirement 15.1)
- `created_by` column for tracking creator user ID (Requirement 15.3)
- `updated_by` column for tracking last modifier user ID (Requirement 15.2, 15.3)

**Backward Compatibility:**
- Existing services are automatically set to 'published' status
- Existing services will have NULL values for created_by and updated_by
- New services should populate these fields when created/updated

## Running Migrations

### Option 1: Using the Migration Runner (Recommended)

```bash
# From the apps/api directory
node run-migration.js migrations/001_extend_services_table.sql
```

### Option 2: Manual Execution in Supabase Dashboard

1. Log in to your Supabase dashboard
2. Navigate to the SQL Editor
3. Copy the contents of the migration file
4. Paste and execute in the SQL Editor

## Migration Best Practices

1. **Always backup your database** before running migrations
2. **Test migrations** on a development/staging environment first
3. **Review the migration SQL** before executing
4. **Check for data compatibility** - ensure existing data works with new schema
5. **Document breaking changes** in the migration file comments

## Rollback

If you need to rollback a migration, you'll need to manually create a rollback script. For the services table extension:

```sql
-- Rollback for 001_extend_services_table.sql
ALTER TABLE services DROP COLUMN IF EXISTS status;
ALTER TABLE services DROP COLUMN IF EXISTS created_at;
ALTER TABLE services DROP COLUMN IF EXISTS created_by;
ALTER TABLE services DROP COLUMN IF EXISTS updated_by;
```

**Warning:** Rollback will delete the data in these columns permanently.

## Creating New Migrations

1. Create a new SQL file with a sequential number: `00X_description.sql`
2. Add comments documenting:
   - What the migration does
   - Which requirements it addresses
   - Any backward compatibility considerations
3. Test the migration on a development database
4. Document the migration in this README
