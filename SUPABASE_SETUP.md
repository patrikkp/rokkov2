# Supabase Setup Guide for ROKKO

This document contains all the SQL commands and configuration needed to set up your Supabase backend for the ROKKO warranty tracker application.

## 1. Database Schema

Run the following SQL in your Supabase SQL Editor:

```sql
-- Create warranties table
CREATE TABLE warranties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  brand TEXT,
  purchase_date DATE NOT NULL,
  warranty_expires DATE NOT NULL,
  category TEXT,
  store TEXT,
  price DECIMAL(10, 2),
  serial_number TEXT,
  notes TEXT,
  receipt_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_id for RLS performance
CREATE INDEX idx_warranties_user_id ON warranties(user_id);

-- Create index on warranty_expires for sorting/filtering
CREATE INDEX idx_warranties_expires ON warranties(warranty_expires);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_warranties_updated_at
  BEFORE UPDATE ON warranties
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create warranty transfer tokens table
CREATE TABLE warranty_transfer_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  warranty_id UUID NOT NULL REFERENCES warranties(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  claimed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  claimed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on token for fast lookups
CREATE INDEX idx_transfer_tokens_token ON warranty_transfer_tokens(token);

-- Create index on warranty_id
CREATE INDEX idx_transfer_tokens_warranty_id ON warranty_transfer_tokens(warranty_id);
```

## 2. Row Level Security (RLS) Policies

**CRITICAL SECURITY REQUIREMENT**: Enable RLS and create policies to ensure users can only access their own data.

```sql
-- Enable RLS on warranties table
ALTER TABLE warranties ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view only their own warranties
CREATE POLICY "Users can view own warranties"
  ON warranties
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own warranties
CREATE POLICY "Users can insert own warranties"
  ON warranties
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update only their own warranties
CREATE POLICY "Users can update own warranties"
  ON warranties
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete only their own warranties
CREATE POLICY "Users can delete own warranties"
  ON warranties
  FOR DELETE
  USING (auth.uid() = user_id);

-- Enable RLS on warranty_transfer_tokens table
ALTER TABLE warranty_transfer_tokens ENABLE ROW LEVEL SECURITY;

-- Policy: Users can create transfer tokens for their own warranties
CREATE POLICY "Users can create transfer tokens for own warranties"
  ON warranty_transfer_tokens
  FOR INSERT
  WITH CHECK (
    auth.uid() = created_by AND
    EXISTS (
      SELECT 1 FROM warranties 
      WHERE warranties.id = warranty_id 
      AND warranties.user_id = auth.uid()
    )
  );

-- Policy: Users can view transfer tokens they created
CREATE POLICY "Users can view own transfer tokens"
  ON warranty_transfer_tokens
  FOR SELECT
  USING (auth.uid() = created_by OR auth.uid() = claimed_by);

-- Policy: Anyone authenticated can view unclaimed tokens to claim them
CREATE POLICY "Users can view unclaimed tokens"
  ON warranty_transfer_tokens
  FOR SELECT
  USING (claimed_by IS NULL AND expires_at > NOW());

-- Policy: Users can update tokens they're claiming
CREATE POLICY "Users can claim tokens"
  ON warranty_transfer_tokens
  FOR UPDATE
  USING (claimed_by IS NULL AND expires_at > NOW())
  WITH CHECK (auth.uid() = claimed_by);
```

## 3. Storage Setup

### Create Storage Bucket

1. Go to **Storage** in your Supabase dashboard
2. Click **New Bucket**
3. Name: `receipts`
4. **Public bucket**: `false` (IMPORTANT: Keep private)
5. Click **Create bucket**

### Storage RLS Policies

Run the following SQL to set up storage security:

```sql
-- Policy: Users can upload to their own folder
CREATE POLICY "Users can upload own receipts"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'receipts' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy: Users can view their own receipts
CREATE POLICY "Users can view own receipts"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'receipts' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy: Users can update their own receipts
CREATE POLICY "Users can update own receipts"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'receipts' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy: Users can delete their own receipts
CREATE POLICY "Users can delete own receipts"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'receipts' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

## 4. Authentication Setup

### Email/Password Authentication

1. Go to **Authentication** → **Providers** in Supabase dashboard
2. **Email** should be enabled by default
3. Configure email templates if desired under **Authentication** → **Email Templates**

### Google OAuth Setup

1. Go to **Authentication** → **Providers**
2. Find **Google** and click to configure
3. Enable the provider
4. You'll need to create a Google OAuth app:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable Google+ API
   - Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
   - Application type: **Web application**
   - Authorized redirect URIs: Add your Supabase callback URL (shown in Supabase dashboard)
   - Copy **Client ID** and **Client Secret** to Supabase
5. Click **Save**

## 5. Security Best Practices

### ✅ Implemented Security Measures

- **RLS Enabled**: All tables have Row Level Security enabled
- **User Isolation**: Users can only access their own data via RLS policies
- **Private Storage**: Receipt bucket is private, not publicly accessible
- **Storage RLS**: Storage policies ensure users can only access their own files
- **Indexed Queries**: user_id columns are indexed for RLS performance
- **Cascade Deletes**: User data is deleted when user account is deleted
- **No service_role in Browser**: Only anon key is used client-side

### ⚠️ Important Notes

1. **Never use `service_role` key in browser code** - Only use `anon` key
2. **RLS must be enabled** on all public schema tables
3. **Test RLS policies** thoroughly before production
4. **Storage files are organized by user_id** - Files are stored as `{user_id}/{timestamp}.{ext}`
5. **File size limits** - Frontend enforces 40MB max, configure Supabase limits if needed

## 6. Environment Variables

After setting up Supabase, add these to your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Where to find these:**
- Go to **Project Settings** → **API** in Supabase dashboard
- Copy **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- Copy **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 7. Testing RLS Policies

To verify RLS is working correctly:

```sql
-- Test as authenticated user (replace with actual user_id)
SET request.jwt.claims.sub = 'user-uuid-here';

-- This should return only that user's warranties
SELECT * FROM warranties;

-- This should fail (trying to access another user's data)
SELECT * FROM warranties WHERE user_id != 'user-uuid-here';
```

## 8. Monitoring & Maintenance

### Recommended Monitoring

1. **Database Performance**: Monitor query performance in Supabase dashboard
2. **Storage Usage**: Track storage consumption under Storage section
3. **Auth Metrics**: Monitor sign-ups and active users
4. **RLS Policy Performance**: Ensure indexes are being used

### Regular Maintenance

- Review and optimize indexes as data grows
- Monitor storage costs and implement cleanup policies if needed
- Regularly backup your database
- Review auth logs for suspicious activity

## 9. Troubleshooting

### Common Issues

**Issue**: "new row violates row-level security policy"
- **Solution**: Ensure user is authenticated and RLS policies are correctly set up

**Issue**: Cannot upload files to storage
- **Solution**: Verify storage RLS policies are created and bucket exists

**Issue**: Users can see other users' data
- **Solution**: RLS is not enabled or policies are incorrect - review policies above

**Issue**: Slow queries
- **Solution**: Ensure indexes on user_id columns exist

## 10. Production Checklist

Before deploying to production:

- [ ] RLS enabled on all tables
- [ ] All RLS policies created and tested
- [ ] Storage bucket created with RLS policies
- [ ] Google OAuth configured (if using)
- [ ] Email templates customized
- [ ] Environment variables set correctly
- [ ] Database backups configured
- [ ] SSL/HTTPS enforced
- [ ] Rate limiting configured (Supabase handles this)
- [ ] Monitoring set up
- [ ] Notification system configured (see section 11)

---

## 11. Notification System Setup

### 11.1 Database Schema for Notifications

Run the SQL migration to create the user_settings table:

```sql
-- Create user settings table for notification preferences
CREATE TABLE user_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reminder_enabled BOOLEAN DEFAULT false,
  reminder_days INTEGER DEFAULT 7,
  locale TEXT DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create index on user_id for performance
CREATE INDEX idx_user_settings_user_id ON user_settings(user_id);

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_user_settings_updated_at
  BEFORE UPDATE ON user_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view only their own settings
CREATE POLICY "Users can view own settings"
  ON user_settings
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own settings
CREATE POLICY "Users can insert own settings"
  ON user_settings
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update only their own settings
CREATE POLICY "Users can update own settings"
  ON user_settings
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create function to auto-create user settings on signup
CREATE OR REPLACE FUNCTION create_user_settings()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_settings (user_id, reminder_enabled, reminder_days, locale)
  VALUES (NEW.id, false, 7, 'en')
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-create settings when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_settings();
```

### 11.2 Email Service Setup (Resend)

1. **Create a Resend account** at https://resend.com
2. **Get your API key** from the Resend dashboard
3. **Verify your domain** or use the default `onboarding@resend.dev` for testing
4. **Add environment variables** to your `.env.local`:

```env
RESEND_API_KEY=re_your_api_key_here
FROM_EMAIL=noreply@yourdomain.com
APP_URL=https://your-app-url.com
```

5. **Add secrets to Supabase** (for Edge Function):
   - Go to **Project Settings** → **Edge Functions**
   - Add the following secrets:
     - `RESEND_API_KEY` - Your Resend API key
     - `APP_URL` - Your app URL (e.g., https://rokkonew.com)

### 11.3 Deploy the Edge Function

1. **Install Supabase CLI** if not already installed:
   ```bash
   npm install -g supabase
   ```

2. **Login to Supabase**:
   ```bash
   supabase login
   ```

3. **Link your project**:
   ```bash
   supabase link --project-ref your-project-ref
   ```

4. **Deploy the function**:
   ```bash
   supabase functions deploy send-reminders
   ```

### 11.4 Set Up Cron Job

To run the reminder function daily, you need to set up a cron job. Options:

**Option A: Using a third-party service (recommended for free tier)**
- Use cron-job.org, EasyCron, or similar
- Set up a daily HTTP request to your Edge Function URL with authorization header

**Option B: Using pg_cron (if available on your Supabase plan)**
```sql
-- Enable pg_cron extension (if available)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule the function to run daily at 9 AM
SELECT cron.schedule(
  'send-warranty-reminders',
  '0 9 * * *',
  $$
  SELECT net.http_post(
    url:='https://your-project-ref.supabase.co/functions/v1/send-reminders',
    headers:='{"Authorization": "Bearer your-service-role-key"}'::jsonb
  );
  $$
);
```

**Option C: Using a Vercel Cron Job (if deploying to Vercel)**
Add to `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/cron/send-reminders",
      "schedule": "0 9 * * *"
    }
  ]
}
```

Then create `app/api/cron/send-reminders/route.ts`:
```typescript
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  // Call the Supabase Edge Function
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send-reminders`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      },
    }
  )

  const result = await response.json()
  return NextResponse.json(result)
}
```

### 11.5 Testing Notifications

1. **Enable reminders** in your ROKKO app settings (`/app/settings`)
2. **Add a warranty** with an expiration date within your reminder window
3. **Manually trigger the Edge Function** for testing:
   ```bash
   curl -X POST \
     https://your-project-ref.supabase.co/functions/v1/send-reminders \
     -H "Authorization: Bearer your-service-role-key"
   ```
4. **Check your email** for the reminder

### 11.6 Troubleshooting Notifications

**Issue**: Emails not being sent
- Check that `RESEND_API_KEY` is set correctly in Edge Function secrets
- Verify that `FROM_EMAIL` domain is verified in Resend (or use onboarding@resend.dev)
- Check Edge Function logs in Supabase dashboard

**Issue**: Users not receiving reminders
- Verify `user_settings` table has correct `reminder_enabled` and `reminder_days` values
- Check that the cron job is running
- Verify warranties have correct `warranty_expires` dates

**Issue**: Edge Function deployment fails
- Ensure you have the Supabase CLI installed and logged in
- Check that your project is linked correctly
- Verify you have the correct permissions

---

**Security is critical.** Never skip RLS setup. All data access must go through RLS policies to ensure proper user isolation.
