# Resend Email Setup Guide

This guide walks you through setting up Resend for contact form email notifications.

## Prerequisites

1. A Resend account (sign up at https://resend.com)
2. A verified domain in Resend
3. Supabase CLI installed (`npm install -g supabase`)

## Step 1: Get Resend API Key

1. Go to https://resend.com/api-keys
2. Create a new API key with **Full Access** permissions (not just "Sending access")
   - Click "Create API Key"
   - Name it something like "King & Carter - Full Access"
   - Select **"Full Access"** (this allows both sending emails AND managing contacts)
   - Copy the API key (starts with `re_...`)

**Important**: If you already have an API key with only "Sending access", you need to create a new one with "Full Access" permissions to enable contact management.

## Step 1.5: Set Up Audience (Optional but Recommended)

Resend will automatically create contacts in your default audience. To organize contacts better:

1. Go to https://resend.com/audiences
2. Create an audience (e.g., "King & Carter Contacts")
3. Note: The Edge Functions will automatically add contacts to your Resend audience
4. You can segment contacts later based on:
   - Contact form submissions (will have firstName and lastName)
   - Newsletter subscribers (from Experience page)

## Step 2: Deploy the Edge Function

The contact form uses a Supabase Edge Function to send emails. You MUST deploy it before the contact form will work:

```bash
# Login to Supabase (if not already logged in)
supabase login

# Link your project (replace YOUR_PROJECT_REF with your actual project reference)
# You can find this in your Supabase dashboard URL: https://supabase.com/dashboard/project/YOUR_PROJECT_REF
supabase link --project-ref vorjmpkirjpgeawkpfen

# Deploy the function
supabase functions deploy send-contact-email
```

**Important**: The function will not work until you deploy it. The CORS error you're seeing means the function hasn't been deployed yet.

## Step 3: Configure Mail Settings in Admin

1. Log in to your admin portal at `/admin/login`
2. Navigate to Settings > Mail tab
3. Configure the following:

   - **Enable Email Notifications**: Toggle ON
   - **Resend API Key**: Paste your API key from Step 1
   - **From Email**: Must be from your verified domain (e.g., `noreply@yourdomain.com`)
   - **From Name**: Display name for emails (e.g., `King & Carter Premier`)
   - **To Email**: Where submissions will be sent (e.g., `contact@yourdomain.com`)
   - **Reply To Email**: Optional, where replies should go

4. Click "Save Mail Settings"

## Step 4: Verify Domain in Resend

1. Go to https://resend.com/domains
2. Add your domain
3. Add the DNS records provided by Resend to your domain registrar
4. Wait for verification (usually takes a few minutes)

## Step 5: Test the Contact Form

1. Go to your website's contact page
2. Fill out and submit the form
3. Check your "To Email" inbox for the notification
4. Check the admin portal at `/admin/contact-submissions` to see the logged submission
5. Check Resend dashboard at https://resend.com/audiences to see the new contact

## Step 6: Test Newsletter Subscription

1. Go to `/experience` page
2. Enter an email in the "Stay Informed" section
3. Check the subscriber's inbox for the welcome message
4. Check info@kingandcarter.com (or your configured admin email) for the notification
5. Check the admin portal at `/admin/newsletter` to see the subscriber
6. Check Resend dashboard to see the contact added

## Troubleshooting

### Email not sending

1. Check that the Edge Function is deployed:
   ```bash
   supabase functions list
   ```

2. Check Edge Function logs:
   ```bash
   supabase functions logs send-contact-email
   ```

3. Verify your Resend API key is correct
4. Ensure your domain is verified in Resend
5. Check that "From Email" uses your verified domain

### "This API key is restricted to only send emails" error

**Cause**: Your Resend API key has "Sending access" only, not "Full Access"

**Solution**:
1. Go to https://resend.com/api-keys
2. Create a NEW API key with **"Full Access"** permissions
3. Update the API key in your admin settings (`/admin/settings` > Mail tab)
4. Save the settings
5. Test again

**Note**: You cannot change permissions on an existing API key - you must create a new one.

### Contact form submission fails

1. Check browser console for errors
2. Verify the Edge Function URL is correct
3. Check that the `contact_submissions` table exists in your database

### Submissions not appearing in admin

1. Verify the `contact_submissions` table has the correct schema
2. Check Row Level Security (RLS) policies allow admin users to read submissions

## Database Schema

The contact form uses two tables:

### contact_submissions
Stores all form submissions:
```sql
CREATE TABLE contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### site_config
Stores mail configuration (key: 'mail'):
```json
{
  "enabled": true,
  "resendApiKey": "re_...",
  "fromEmail": "noreply@yourdomain.com",
  "fromName": "King & Carter Premier",
  "toEmail": "contact@yourdomain.com",
  "replyToEmail": "contact@yourdomain.com"
}
```

## Security Notes

- The Resend API key is stored in the database and only accessible to admin users
- Contact submissions are logged even if email sending fails
- The Edge Function validates all inputs before sending
- RLS policies protect sensitive data

## Next Steps

- Set up email templates in Resend for branded emails
- Configure email notifications for new submissions
- Add auto responder emails to users who submit the form
- Monitor email delivery rates in Resend dashboard
