# Setting Up Google OAuth in Supabase

This guide will walk you through the process of setting up Google OAuth authentication for your Supabase project.

## Step 1: Create a Google OAuth Application

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" and select "OAuth client ID"
5. Configure the OAuth consent screen if prompted:
   - Add your app name, user support email, and developer contact information
   - Add the necessary scopes (email, profile)
   - Add test users if you're in testing mode
6. For the OAuth client ID:
   - Select "Web application" as the application type
   - Add a name for your OAuth client
   - Add authorized JavaScript origins:
     - `https://[YOUR_PROJECT_ID].supabase.co` (replace with your Supabase project URL)
   - Add authorized redirect URIs:
     - `https://[YOUR_PROJECT_ID].supabase.co/auth/v1/callback`
7. Click "Create" and note down your Client ID and Client Secret

## Step 2: Configure Supabase Authentication

1. Log in to your [Supabase Dashboard](https://app.supabase.io/)
2. Select your project
3. Navigate to "Authentication" > "Providers"
4. Find "Google" in the list of providers and click on it
5. Toggle the "Enable" switch to turn on Google authentication
6. Enter your Google Client ID and Client Secret from Step 1
7. Click "Save" to apply the changes

## Step 3: Update Your Application

1. Make sure your application's redirect URL is correctly set in your Supabase project settings
2. For local development, add `http://localhost:3000` to the "Additional Redirect URLs" in your Supabase Authentication settings
3. Ensure your application is using the correct Supabase URL and anon key in your environment variables

## Step 4: Test Your OAuth Integration

1. Run your application
2. Navigate to the login or signup page
3. Click the "Sign in with Google" button
4. You should be redirected to Google's login page
5. After successful authentication, you should be redirected back to your application

## Troubleshooting

- **404 Errors**: Ensure your redirect URLs are correctly configured in both Google Cloud Console and Supabase
- **Authentication Failures**: Check that your Client ID and Client Secret are correctly entered in Supabase
- **Redirect Issues**: Verify that your application's redirect URL is included in the allowed redirect URLs in Supabase

## Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Next.js with Supabase Auth](https://supabase.com/docs/guides/auth/auth-helpers/nextjs) 