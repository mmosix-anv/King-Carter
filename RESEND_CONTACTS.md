# Resend Contact Management

## Overview

Both the contact form and newsletter subscription automatically create contacts in your Resend audience. This allows you to:
- Build your email list automatically
- Send marketing campaigns via Resend
- Segment contacts based on source
- Track engagement

## How Contacts Are Created

### Contact Form Submissions

When someone submits the contact form:
1. Their name is split into firstName and lastName
2. A contact is created in Resend with:
   ```json
   {
     "email": "user@example.com",
     "firstName": "John",
     "lastName": "Doe",
     "unsubscribed": false
   }
   ```
3. A notification email is sent to you
4. The submission is logged in your database

### Newsletter Subscriptions

When someone subscribes to the newsletter:
1. A contact is created in Resend with:
   ```json
   {
     "email": "user@example.com",
     "firstName": "",
     "lastName": "",
     "unsubscribed": false
   }
   ```
2. A welcome email is sent to them
3. A notification email is sent to you (admin)
4. The subscription is logged in your database

## Managing Contacts in Resend

### View All Contacts

1. Go to https://resend.com/audiences
2. Click on your audience
3. View all contacts with their details

### Segment Contacts

You can identify contact sources by:
- **Has firstName/lastName**: Likely from contact form
- **No firstName/lastName**: Likely from newsletter subscription
- Check your database for definitive source tracking

### Send Campaigns

1. Go to https://resend.com/emails
2. Click "Send Broadcast"
3. Select your audience
4. Compose your email
5. Send to all contacts or specific segments

## Duplicate Prevention

### Contact Form
- If a contact with the same email already exists in Resend, it won't create a duplicate
- The form submission is still logged in your database
- The notification email is still sent to you

### Newsletter
- Checks your database first for existing subscribers
- If already subscribed, returns success without creating duplicate
- If new, creates contact in Resend and adds to database

## Unsubscribe Handling

When someone unsubscribes via Resend:
1. Their contact status in Resend is updated to `unsubscribed: true`
2. They won't receive future broadcast emails
3. Your database is NOT automatically updated
4. You can manually update your database or sync periodically

## Best Practices

### 1. Regular Audience Cleanup
- Review contacts monthly
- Remove invalid emails
- Update contact information

### 2. Segmentation Strategy
- Tag contacts based on service interest
- Create segments for different campaigns
- Track engagement metrics

### 3. Compliance
- Include unsubscribe links in all marketing emails
- Honor unsubscribe requests immediately
- Keep privacy policy updated

### 4. Database Sync
Consider creating a sync process to:
- Update unsubscribe status from Resend to your database
- Add custom fields to Resend contacts
- Track campaign engagement in your database

## API Endpoints

### Create Contact (Manual)
```bash
curl -X POST https://api.resend.com/audiences/contacts \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "unsubscribed": false
  }'
```

### List Contacts
```bash
curl https://api.resend.com/audiences/YOUR_AUDIENCE_ID/contacts \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### Update Contact
```bash
curl -X PATCH https://api.resend.com/audiences/contacts/CONTACT_ID \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "unsubscribed": true
  }'
```

## Monitoring

### Check Contact Creation
1. Submit a test form or newsletter subscription
2. Go to Resend dashboard
3. Navigate to Audiences
4. Verify the contact appears

### Check Edge Function Logs
```bash
supabase functions logs send-contact-email
supabase functions logs subscribe-newsletter
```

Look for:
- "Failed to create Resend contact" (errors)
- Contact creation success messages

## Troubleshooting

### Contact Not Created

**Possible causes:**
1. Invalid API key
2. Invalid email format
3. Resend API rate limits
4. Network issues

**Solution:**
- Check Edge Function logs
- Verify API key in admin settings
- Test API key with curl command
- Check Resend dashboard for errors

### Duplicate Contacts

**Cause:** Same email submitted multiple times

**Solution:**
- Resend automatically prevents duplicates by email
- If you see duplicates, they may have different email formats (case sensitivity)
- Clean up manually in Resend dashboard

### Contact Created but Email Not Sent

**Cause:** Contact creation and email sending are separate operations

**Solution:**
- Check Edge Function logs for email sending errors
- Verify domain is verified in Resend
- Check email configuration in admin settings

## Data Flow Diagram

```
User Submits Form/Newsletter
         ↓
Edge Function Receives Request
         ↓
    ┌────┴────┐
    ↓         ↓
Create      Save to
Contact     Database
in Resend
    ↓         ↓
Send        Log
Email       Submission
    ↓         ↓
Return Success Response
```

## Privacy Considerations

### Data Stored in Resend
- Email address
- First name (contact form only)
- Last name (contact form only)
- Subscription status

### Data NOT Stored in Resend
- Phone numbers
- Messages
- Service interests
- Submission timestamps

These are stored only in your Supabase database.

## Future Enhancements

Consider implementing:
1. **Custom Fields**: Add service interest, phone to Resend contacts
2. **Tags**: Tag contacts based on form source or interests
3. **Webhooks**: Listen for Resend events (bounces, unsubscribes)
4. **Sync Service**: Periodic sync between Supabase and Resend
5. **Segmentation**: Automatic audience segmentation based on behavior

## Resources

- Resend Contacts API: https://resend.com/docs/api-reference/contacts
- Resend Audiences: https://resend.com/docs/dashboard/audiences/introduction
- Resend Broadcasts: https://resend.com/docs/dashboard/broadcasts/introduction
