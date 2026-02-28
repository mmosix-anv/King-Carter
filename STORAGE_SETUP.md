# Supabase Storage Setup Guide

## The 400 Error Issue

If you're getting a 400 error when uploading images, it means the storage bucket doesn't exist or isn't configured properly.

## Step by Step Setup

### 1. Create the Storage Bucket

1. Go to your Supabase Dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **"New bucket"** or **"Create a new bucket"**
4. Configure the bucket:
   - **Name**: `media` (must be exactly this)
   - **Public bucket**: ✅ **YES** (check this box)
   - **File size limit**: 10 MB (10485760 bytes)
   - **Allowed MIME types**: Leave empty or add: `image/*`

5. Click **"Create bucket"**

### 2. Set Bucket Policies (Important!)

After creating the bucket, you need to set up policies:

1. Click on the `media` bucket
2. Go to **"Policies"** tab
3. Click **"New Policy"**

#### Policy 1: Public Read Access

```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'media' );
```

Or use the UI:
- Policy name: `Public Access`
- Allowed operation: `SELECT`
- Target roles: `public`
- USING expression: `bucket_id = 'media'`

#### Policy 2: Authenticated Upload

```sql
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'media' 
  AND auth.role() = 'authenticated'
);
```

Or use the UI:
- Policy name: `Authenticated users can upload`
- Allowed operation: `INSERT`
- Target roles: `authenticated`
- WITH CHECK expression: `bucket_id = 'media'`

#### Policy 3: Authenticated Delete

```sql
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'media' 
  AND auth.role() = 'authenticated'
);
```

### 3. Verify Setup

Test the bucket by:

1. Go to Storage → media bucket
2. Try uploading a file manually through the Supabase UI
3. If successful, the admin portal should work

### 4. Alternative: Quick Setup via SQL

Run this in the Supabase SQL Editor:

```sql
-- Create bucket (if using SQL)
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- Set policies
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'media' );

CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'media' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'media' 
  AND auth.role() = 'authenticated'
);
```

## Common Issues

### Issue: "Bucket not found"
**Solution**: Make sure the bucket name is exactly `media` (lowercase)

### Issue: "Access denied"
**Solution**: Check that:
- Bucket is set to **public**
- Policies are created correctly
- You're logged in as an authenticated user

### Issue: "File too large"
**Solution**: 
- Check file size limit in bucket settings
- Default is 10MB, increase if needed

### Issue: Images upload but don't display
**Solution**:
- Verify bucket is set to **public**
- Check the public URL is correct
- Verify CORS settings if accessing from different domain

## Testing

After setup, test by:

1. Login to admin at `/admin/login`
2. Go to Media Library (`/admin/media`)
3. Try uploading an image
4. Check if it appears in the grid
5. Try using it in a service

## Need Help?

Check the browser console for detailed error messages. The error will tell you:
- If bucket doesn't exist
- If permissions are wrong
- If file is too large
- If MIME type is not allowed
