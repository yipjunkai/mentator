import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const requestUrl = new URL(request.url)
  const formData = await request.formData()
  const provider = formData.get('provider') as string
  const cookieStore = cookies()
  
  const supabase = createRouteHandlerClient({ 
    cookies: () => cookieStore 
  })

  if (provider === 'google') {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${requestUrl.origin}/auth/callback`,
      },
    })

    if (error) {
      console.error('OAuth error:', error)
      return NextResponse.redirect(
        `${requestUrl.origin}/auth-error?error=${encodeURIComponent(error.message)}`
      )
    }

    return NextResponse.redirect(data.url)
  }

  return NextResponse.redirect(
    `${requestUrl.origin}/auth-error?error=${encodeURIComponent('Invalid provider')}`
  )
} 