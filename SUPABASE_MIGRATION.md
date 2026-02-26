# Supabase Migration Guide

## Steps to Complete Migration

### 1. Set up Supabase Database Schema
1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Navigate to your project: `vorjmpkirjpgeawkpfen`
3. Go to **SQL Editor**
4. Copy and paste the contents of `supabase-schema.sql`
5. Click **Run** to create all tables and initial data

### 2. Migrate Existing Data (Optional)
If you have existing data in SQLite that you want to preserve:

```bash
cd apps/api
node migrate.js
```

This will:
- Read data from your existing `cms.db` SQLite file
- Transfer all users, services, navigation links, and settings to Supabase
- Handle data type conversions automatically

### 3. Test the Migration
```bash
npm run dev
```

Your API should now connect to Supabase instead of SQLite.

## What Changed

### Database Structure
- **SQLite** → **PostgreSQL** (via Supabase)
- **JSON strings** → **JSONB columns** (better performance)
- **camelCase columns** → **snake_case columns** (PostgreSQL convention)

### API Changes
- All routes now use PostgreSQL parameter syntax (`$1, $2` instead of `?`)
- JSONB columns are handled natively (no JSON.parse needed)
- UPSERT operations use `ON CONFLICT` instead of `INSERT OR REPLACE`

### Environment Variables
All Supabase credentials are now in your `.env` file.

## Benefits
- ✅ Cloud-hosted database (no local files)
- ✅ Better performance with JSONB
- ✅ Built-in authentication system
- ✅ Real-time subscriptions available
- ✅ Automatic backups
- ✅ Scalable infrastructure

## Rollback Plan
If you need to rollback:
1. Change imports back to `./database.js` in your route files
2. Revert the SQL syntax changes
3. Your original SQLite database is preserved as `cms.db`