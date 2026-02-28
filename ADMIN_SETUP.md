# King & Carter Admin Portal Setup

## Overview

This admin portal provides a complete CMS for managing the King & Carter website, including:

- **Services Management**: Create and edit dynamic service pages
- **Media Library**: Upload and manage images with Supabase Storage
- **Site Configuration**: Manage general settings, contact info
- **SEO Settings**: Configure SEO metadata for all pages

## Database Setup

### 1. Run Schema Migration

In your Supabase SQL Editor, run the following files in order:

```bash
# 1. Create tables and structure
apps/web/supabase/schema.sql

# 2. Seed initial data
apps/web/supabase/seed.sql
```

### 2. Configure Storage Bucket

In Supabase Dashboard:

1. Go to **Storage** → **Create new bucket**
2. Name: `media`
3. Set as **Public bucket**
4. Enable **File size limit**: 10MB
5. Allowed MIME types: `image/*`

### 3. Set up Supabase Authentication

#### A. Enable Email Authentication

In Supabase Dashboard:

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider
3. Disable **Confirm email** (for development)
   - Or configure SMTP for production email verification

#### B. Create Admin User in Supabase Auth

In Supabase Dashboard:

1. Go to **Authentication** → **Users**
2. Click **Add user** → **Create new user**
3. Enter:
   - Email: `admin@kingandcarter.com`
   - Password: `admin123` (or your preferred password)
   - Auto Confirm User: **Yes** (check this box)
4. Click **Create user**

#### C. Create Admin User Record in Database

After creating the auth user, run this SQL to create the corresponding admin_users record:

```sql
-- Get the auth user ID first
SELECT id, email FROM auth.users WHERE email = 'admin@kingandcarter.com';

-- Then insert into admin_users (replace 'USER_ID_HERE' with the actual UUID from above)
INSERT INTO admin_users (id, email, password_hash, full_name, role, is_active)
VALUES (
  'USER_ID_HERE'::uuid,  -- Replace with actual user ID from auth.users
  'admin@kingandcarter.com',
  '',  -- Not needed when using Supabase Auth
  'Admin User',
  'admin',
  true
);
```

**Or use this combined query:**

```sql
INSERT INTO admin_users (id, email, password_hash, full_name, role, is_active)
SELECT 
  id,
  email,
  '',
  'Admin User',
  'admin',
  true
FROM auth.users 
WHERE email = 'admin@kingandcarter.com'
ON CONFLICT (id) DO NOTHING;
```

**Note:** The authentication is simplified for demo purposes. The password is hardcoded as `admin123` in the AdminContext. For production, implement proper password hashing verification using Supabase Edge Functions or a backend API.

## Environment Variables

Ensure these are set in your `.env` file:

```env
VITE_PUBLIC_SUPABASE_URL=your_supabase_url
VITE_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## Quick Setup Steps

1. **Run schema.sql** in Supabase SQL Editor
2. **Run seed.sql** in Supabase SQL Editor
3. **Create media bucket** in Supabase Storage (public, 10MB limit)
4. **Enable Email Auth** in Supabase Dashboard (Authentication → Providers)
5. **Create admin user** in Supabase Dashboard (Authentication → Users)
   - Email: `admin@kingandcarter.com`
   - Password: your choice
   - Auto Confirm: Yes
6. **Link auth user to admin_users table** using the SQL query in step 3C above
7. **Login** at `/admin/login`

## Default Login

After completing the setup above:

```
Email: admin@kingandcarter.com
Password: (the password you set in Supabase Auth)
```

**⚠️ Important Security Notes:**
- Change the default password after first login
- Enable email confirmation in production
- Set up proper SMTP for password resets
- Consider enabling 2FA for admin accounts

## Admin Routes

- `/admin/login` - Login page
- `/admin/dashboard` - Overview and stats
- `/admin/services` - Manage services
- `/admin/services/new` - Create new service
- `/admin/services/:id` - Edit service
- `/admin/media` - Media library
- `/admin/settings` - Site configuration

## Features

### Services Management

- Create/edit/delete service pages
- Dynamic slug generation
- Hero image management
- Multiple description paragraphs
- Highlight lists
- Call-to-action configuration
- Status management (draft/published/archived)
- Display order control

### Media Library

- Upload multiple images
- Automatic Supabase Storage integration
- Copy public URLs
- Delete files
- Image preview

### Site Settings

Three configuration tabs:

1. **General**: Site name, URL, company info
2. **SEO Defaults**: Default meta tags, keywords
3. **Contact**: Email, phone, hours

### SEO Management

- Page-specific SEO settings
- Meta titles and descriptions
- Keywords management
- Open Graph configuration
- Structured data support

## Database Schema

### Tables

- `admin_users` - Admin authentication
- `services` - Service pages content
- `media` - Media library files
- `site_config` - Site-wide settings
- `seo_settings` - SEO metadata
- `audit_log` - Activity tracking

### Key Features

- UUID primary keys
- Automatic timestamps
- Row Level Security (RLS)
- Audit logging
- JSONB for flexible data

## Development

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build
```

## Security Notes

1. Change default admin password immediately
2. Configure RLS policies for production
3. Set up proper CORS in Supabase
4. Enable email confirmation for production
5. Use environment variables for sensitive data
6. Regular database backups

## Troubleshooting

### Can't login?

1. Check Supabase auth is enabled
2. Verify user exists in `admin_users` table
3. Check environment variables
4. Look at browser console for errors

### Images not uploading?

1. Verify `media` bucket exists and is public
2. Check file size limits
3. Verify MIME types are allowed
4. Check storage quota

### Services not saving?

1. Check RLS policies
2. Verify user is authenticated
3. Check browser console for errors
4. Verify database connection

## Next Steps

1. Run schema and seed migrations
2. Create storage bucket
3. Set up admin user
4. Login and test
5. Upload media files
6. Create first service
7. Configure site settings
8. Update SEO settings

## Support

For issues or questions, check:
- Supabase documentation
- Browser console errors
- Network tab for API calls
- Database logs in Supabase
