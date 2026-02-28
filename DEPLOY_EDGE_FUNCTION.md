# Deploy Edge Function - Quick Guide

## The CORS Error You're Seeing

```
Access to fetch at 'https://vorjmpkirjpgeawkpfen.supabase.co/functions/v1/send-contact-email' 
from origin 'https://dev.kingandcarter.com' has been blocked by CORS policy
```

This means the Edge Function hasn't been deployed to Supabase yet.

## Deploy Now

Run these commands in your terminal:

```bash
# 1. Login to Supabase (you'll be prompted to authenticate in browser)
supabase login

# 2. Link to your project
supabase link --project-ref vorjmpkirjpgeawkpfen

# 3. Deploy both functions
supabase functions deploy send-contact-email
supabase functions deploy subscribe-newsletter
```

## What This Does

- Uploads the Edge Functions to Supabase:
  - `send-contact-email`: Handles contact form submissions
    - Creates contact in Resend audience
    - Sends notification email to admin
    - Logs submission to database
  - `subscribe-newsletter`: Handles newsletter subscriptions
    - Creates contact in Resend audience
    - Sends welcome email to subscriber
    - Sends notification email to admin
    - Stores subscriber in database
- Makes them available at:
  - `https://vorjmpkirjpgeawkpfen.supabase.co/functions/v1/send-contact-email`
  - `https://vorjmpkirjpgeawkpfen.supabase.co/functions/v1/subscribe-newsletter`
- Enables CORS so your website can call them

## After Deployment

1. The contact form will work immediately
2. The newsletter subscription on Experience page will work
3. Test both by:
   - Submitting the contact form
   - Subscribing to newsletter on /experience page
4. Check submissions in admin panel:
   - Contact: `/admin/contact-submissions`
   - Newsletter: `/admin/newsletter`

## Verify Deployment

Check if the function is deployed:

```bash
supabase functions list
```

You should see `send-contact-email` in the list.

## View Logs

If something goes wrong, check the logs:

```bash
supabase functions logs send-contact-email
```

## Common Issues

### "supabase: command not found"

Install Supabase CLI:

```bash
npm install -g supabase
```

### "Project not linked"

Make sure you ran the link command:

```bash
supabase link --project-ref vorjmpkirjpgeawkpfen
```

### "Authentication required"

Run login again:

```bash
supabase login
```

## Environment Variables

The Edge Function automatically has access to:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

These are set automatically by Supabase, you don't need to configure them.

## Next Steps

After deploying:
1. Configure mail settings in admin panel (`/admin/settings` > Mail tab)
2. Add your Resend API key
3. Test the contact form
