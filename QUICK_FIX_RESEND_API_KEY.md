# Quick Fix: Resend API Key Permissions

## The Error You're Seeing

```
"This API key is restricted to only send emails"
```

## What This Means

Your current Resend API key has **"Sending access"** only. To create contacts in Resend, you need **"Full Access"** permissions.

## How to Fix (5 minutes)

### Step 1: Create New API Key in Resend

1. Go to https://resend.com/api-keys
2. Click **"Create API Key"**
3. Name: `King & Carter - Full Access`
4. **Important**: Select **"Full Access"** (not "Sending access")
5. Click "Create"
6. Copy the API key (starts with `re_...`)

### Step 2: Update API Key in Admin Panel

1. Go to your admin panel: https://dev.kingandcarter.com/admin/login
2. Navigate to **Settings** > **Mail** tab
3. Paste the new API key in the **"Resend API Key"** field
4. Click **"Save Mail Settings"**

### Step 3: Test

1. Go to https://dev.kingandcarter.com/experience
2. Enter an email in the "Stay Informed" section
3. Click "Notify Me"
4. You should receive:
   - Welcome email (to the subscriber)
   - Notification email (to info@kingandcarter.com)
5. Check Resend dashboard to see the contact created

## What Happens Now

With Full Access API key:
- ✅ Emails are sent
- ✅ Contacts are created in Resend audience
- ✅ You can send broadcast emails to your audience
- ✅ Contact management features work

## API Key Permissions Comparison

### Sending Access (Current - Limited)
- ✅ Send emails
- ❌ Create contacts
- ❌ Manage audiences
- ❌ View contact lists

### Full Access (Needed)
- ✅ Send emails
- ✅ Create contacts
- ✅ Manage audiences
- ✅ View contact lists
- ✅ All Resend features

## Important Notes

1. **You cannot change permissions on an existing API key** - you must create a new one
2. **Keep your old API key** until you've confirmed the new one works
3. **The functions still work** even if contact creation fails - emails are still sent
4. **Contact creation is optional** but recommended for building your email list

## After Fixing

Once you update the API key:
- Contact form submissions will create contacts in Resend
- Newsletter subscriptions will create contacts in Resend
- You can send broadcast emails to all contacts via Resend dashboard
- No code changes needed - just the API key update

## Still Having Issues?

Check the Edge Function logs:
```bash
supabase functions logs subscribe-newsletter --tail
```

You should see successful contact creation instead of the error message.
