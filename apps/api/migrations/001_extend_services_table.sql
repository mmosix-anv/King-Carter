-- Migration: Extend services table with status and audit trail fields
-- Requirements: 13.1, 15.1, 15.2, 15.3
-- Description: Adds draft/published workflow and audit trail support to services table

-- Add status column for draft/published workflow (Requirement 13.1)
ALTER TABLE services 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'published';

-- Add audit trail columns (Requirements 15.1, 15.2, 15.3)
ALTER TABLE services 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE services 
ADD COLUMN IF NOT EXISTS created_by INTEGER REFERENCES users(id);

ALTER TABLE services 
ADD COLUMN IF NOT EXISTS updated_by INTEGER REFERENCES users(id);

-- Add comment to document the status field values
COMMENT ON COLUMN services.status IS 'Service status: draft or published. Only published services are displayed on the frontend.';

-- Add comment to document audit trail fields
COMMENT ON COLUMN services.created_at IS 'Timestamp when the service was first created';
COMMENT ON COLUMN services.created_by IS 'User ID of the administrator who created the service';
COMMENT ON COLUMN services.updated_by IS 'User ID of the administrator who last updated the service';

-- Update existing services to have default values
-- Set all existing services to 'published' status to maintain backward compatibility
UPDATE services 
SET status = 'published' 
WHERE status IS NULL;

-- Note: created_by and updated_by will remain NULL for existing records
-- This maintains backward compatibility while allowing new records to track creators
