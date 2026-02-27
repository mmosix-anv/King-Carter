# Migration Guide: Services Table Extension

## Overview

This migration extends the `services` table to support:
1. **Draft/Published Workflow** (Requirement 13.1)
2. **Audit Trail** (Requirements 15.1, 15.2, 15.3)

## Changes Made

### Database Schema Changes

#### New Columns Added to `services` Table:

| Column | Type | Default | Description | Requirement |
|--------|------|---------|-------------|-------------|
| `status` | VARCHAR(20) | 'published' | Service status: 'draft' or 'published' | 13.1 |
| `created_at` | TIMESTAMP | CURRENT_TIMESTAMP | When the service was created | 15.1 |
| `created_by` | INTEGER | NULL | User ID who created the service | 15.3 |
| `updated_by` | INTEGER | NULL | User ID who last updated the service | 15.2, 15.3 |

**Note:** The `updated_at` column already existed in the schema.

### API Changes

#### GET /api/services
**Response now includes:**
```json
{
  "data": {
    "service-id": {
      "id": "service-id",
      "heroTitle": "...",
      "status": "published",
      "createdAt": "2024-01-01T00:00:00Z",
      "createdBy": 1,
      "updatedAt": "2024-01-02T00:00:00Z",
      "updatedBy": 1
    }
  }
}
```

#### POST /api/services (Protected)
**Request body now accepts:**
```json
{
  "id": "service-id",
  "heroTitle": "...",
  "status": "draft",
  // ... other fields
}
```

**Behavior:**
- Creates new service: Sets `created_by` and `created_at` automatically
- Updates existing service: Updates `updated_by` and `updated_at` automatically
- Default status is 'draft' if not specified

## Backward Compatibility

### Existing Data
- All existing services are automatically set to `status = 'published'`
- Existing services will have `NULL` values for `created_by` and `updated_by`
- This ensures existing services remain visible on the frontend

### Frontend Compatibility
- Frontend can continue to work without changes
- New fields are optional in API responses
- Services without status are treated as 'published'

## Running the Migration

### Step 1: Backup Your Database
```bash
# Always backup before running migrations!
# Use Supabase dashboard or pg_dump
```

### Step 2: Run the Migration

**Option A: Using Migration Runner**
```bash
cd apps/api
node run-migration.js migrations/001_extend_services_table.sql
```

**Option B: Supabase Dashboard**
1. Open Supabase SQL Editor
2. Copy contents of `migrations/001_extend_services_table.sql`
3. Execute the SQL

### Step 3: Verify the Migration

```bash
cd apps/api
npm test migrations/001_extend_services_table.test.js
```

### Step 4: Update Application Code

The API routes have been updated to handle the new fields. No additional code changes are required.

## Testing the Changes

### Test Draft/Published Workflow

```bash
# Create a draft service
curl -X POST http://localhost:3001/api/services \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "test-service",
    "heroTitle": "Test Service",
    "status": "draft",
    "description": [],
    "highlights": [],
    "images": [],
    "cta": {}
  }'

# Verify it was created with audit trail
curl http://localhost:3001/api/services/test-service
```

### Test Audit Trail

```bash
# Update the service
curl -X POST http://localhost:3001/api/services \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "test-service",
    "heroTitle": "Updated Test Service",
    "status": "published"
  }'

# Check that updated_by and updated_at were set
curl http://localhost:3001/api/services/test-service
```

## Rollback Instructions

If you need to rollback this migration:

```sql
-- WARNING: This will delete all data in these columns!
ALTER TABLE services DROP COLUMN IF EXISTS status;
ALTER TABLE services DROP COLUMN IF EXISTS created_at;
ALTER TABLE services DROP COLUMN IF EXISTS created_by;
ALTER TABLE services DROP COLUMN IF EXISTS updated_by;
```

## Next Steps

After running this migration:

1. **Frontend Updates**: Update admin panel to support draft/published workflow
2. **Frontend Filtering**: Filter services by status on public pages (only show 'published')
3. **Admin UI**: Display audit trail information in admin interface
4. **Testing**: Test the complete workflow end-to-end

## Troubleshooting

### Migration Fails with "column already exists"
This is safe to ignore. The migration uses `IF NOT EXISTS` to handle this case.

### Foreign Key Constraint Errors
Ensure the `users` table exists before running this migration.

### Services Not Showing on Frontend
Check that services have `status = 'published'`. Update the frontend to filter by status:
```javascript
const publishedServices = Object.values(services).filter(s => s.status === 'published');
```

## Support

For issues or questions:
1. Check the migration test results
2. Review the migration SQL file
3. Check Supabase logs for detailed error messages
