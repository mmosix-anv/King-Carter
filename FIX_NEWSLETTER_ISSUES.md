# Fix Newsletter Issues

## Issue 1: Subscribers Not Showing in Admin Portal

### Cause
The `newsletter_subscribers` table might not exist in your Supabase database yet.

### Fix
1. Go to https://supabase.com/dashboard/project/vorjmpkirjpgeawkpfen/sql/new
2. Copy the entire content from `CREATE_NEWSLETTER_TABLE.sql`
3. Paste it into the SQL Editor
4. Click "Run"
5. Verify the table was created (you should see the table structure at the bottom)

### Verify
1. Go to https://supabase.com/dashboard/project/vorjmpkirjpgeawkpfen/editor
2. Look for `newsletter_subscribers` table in the left sidebar
3. Click on it to see the data
4. You should see your test subscription

## Issue 2: Contacts Not Created in Resend

### Cause
The Resend API endpoint was incorrect. Changed from:
- ❌ `https://api.resend.com/audiences/contacts` (requires audience ID)
- ✅ `https://api.resend.com/contacts` (creates in default audience)

Also, the field names were wrong:
- ❌ `firstName`, `lastName`
- ✅ `first_name`, `last_name`

### Fix
1. Redeploy both Edge Functions with the updated code:

#### Update `subscribe-newsletter` function:
1. Go to https://supabase.com/dashboard/project/vorjmpkirjpgeawkpfen/functions
2. Click on `subscribe-newsletter`
3. Replace the code with the updated version from `supabase/functions/subscribe-newsletter/index.ts`
4. Click "Deploy"

#### Update `send-contact-email` function:
1. Click on `send-contact-email`
2. Replace the code with the updated version from `supabase/functions/send-contact-email/index.ts`
3. Click "Deploy"

### Verify
1. Submit a new test subscription
2. Check Resend dashboard: https://resend.com/contacts
3. You should see the new contact appear

## Issue 3: Admin Portal Not Loading Subscribers

### Possible Causes
1. Table doesn't exist (see Issue 1)
2. RLS policies blocking access
3. Browser cache

### Fix
1. Make sure you ran the SQL from Issue 1
2. Hard refresh the admin page (Ctrl+Shift+R or Cmd+Shift+R)
3. Check browser console for errors
4. Try logging out and back in to admin

## Testing Checklist

After applying all fixes:

### Test Newsletter Subscription
1. Go to `/experience` page
2. Enter a test email
3. Click "Notify Me"
4. Check:
   - ✅ Success message appears
   - ✅ Welcome email received
   - ✅ Admin notification received at info@kingandcarter.com
   - ✅ Subscriber appears in `/admin/newsletter`
   - ✅ Contact appears in Resend dashboard

### Test Membership Waitlist
1. Go to `/become-a-member` page
2. Enter a test email
3. Click "Join Waitlist"
4. Check same items as above
5. Verify source shows as "membership_waitlist" in admin

### Test Contact Form
1. Go to `/contact` page
2. Fill out and submit form
3. Check:
   - ✅ Success message appears
   - ✅ Notification email received
   - ✅ Submission appears in `/admin/contact-submissions`
   - ✅ Contact appears in Resend dashboard (with name)

## Debugging

### Check Edge Function Logs
```bash
# Newsletter function
supabase functions logs subscribe-newsletter --tail

# Contact form function
supabase functions logs send-contact-email --tail
```

Look for:
- "Resend contact created:" (success)
- "Failed to create Resend contact:" (error with details)

### Check Database Directly
1. Go to https://supabase.com/dashboard/project/vorjmpkirjpgeawkpfen/editor
2. Click on `newsletter_subscribers` table
3. You should see all subscriptions with:
   - email
   - source (experience_page or membership_waitlist)
   - status (active)
   - subscribed_at (timestamp)

### Check Resend Dashboard
1. Go to https://resend.com/contacts
2. Filter by recent contacts
3. You should see contacts with:
   - Email address
   - Created timestamp
   - Unsubscribed: false

## Common Errors

### "relation newsletter_subscribers does not exist"
**Solution**: Run the SQL from `CREATE_NEWSLETTER_TABLE.sql`

### "Failed to create Resend contact: 401"
**Solution**: Check your Resend API key has "Full Access" permissions

### "Failed to create Resend contact: 422"
**Solution**: Email format is invalid or contact already exists

### Subscribers in database but not in admin portal
**Solution**: 
1. Check RLS policies (run the SQL again)
2. Hard refresh browser
3. Check browser console for errors

## Summary

After applying all fixes:
1. ✅ Newsletter table created in Supabase
2. ✅ RLS policies allow admin access
3. ✅ Edge Functions use correct Resend API
4. ✅ Contacts created in Resend default audience
5. ✅ Admin portal shows all subscribers
6. ✅ Source tracking works (experience_page vs membership_waitlist)
