import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { origin } = new URL(request.url)
  const formData = await request.formData()
  const provider = formData.get('provider') as string
  
  // Use the cookies approach consistent with callback route
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ 
    cookies: () => cookieStore 
  })

  if (provider === 'google') {
    // Start OAuth flow with Google
    // redirectTo specifies where to send the user after successful Google login
    // The /auth/callback route will receive the auth code and exchange it for a session
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${origin}/auth/callback`, // After Google auth, redirect here
      },
    })

    if (error) {
      console.error('OAuth error:', error)
      return NextResponse.redirect(
        `${origin}/auth-error?error=${encodeURIComponent(error.message)}`
      )
    }

    return NextResponse.redirect(data.url)
  }

  return NextResponse.redirect(
    `${origin}/auth-error?error=${encodeURIComponent('Invalid provider')}`
  )
} 