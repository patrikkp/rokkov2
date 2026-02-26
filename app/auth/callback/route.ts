import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // Sometimes Supabase uses token_hash and type (signup, invite, magiclink) instead of code
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type')
  const next = searchParams.get('next') ?? '/app'
  const errorDescription = searchParams.get('error_description')

  // If Supabase redirected back with a known error (e.g. token expired)
  if (errorDescription) {
    console.error('Supabase Auth Error from callback:', errorDescription)
    return NextResponse.redirect(`${origin}/auth?error=confirmation_failed`)
  }

  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch (error) {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing user sessions.
          }
        },
      },
    }
  )

  // Scenario 1: PKCE Flow (code exchange)
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    } else {
      console.error('Code exchange failed:', error.message)
    }
  } 
  // Scenario 2: Token Hash Flow (often used in Magic Links & Email Confirmations if PKCE fails or is differently configured)
  else if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type: type as any,
      token_hash,
    })
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    } else {
      console.error('Token hash verification failed:', error.message)
    }
  }

  // If we reach here, neither code nor token_hash worked, or they were missing
  return NextResponse.redirect(`${origin}/auth?error=confirmation_failed`)
}
