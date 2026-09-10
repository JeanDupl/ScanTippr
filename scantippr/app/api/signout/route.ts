import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_SITE_URL!))
  response.cookies.set('sb_access_token', '', { maxAge: 0, path: '/' })
  response.cookies.set('sb_user_id', '', { maxAge: 0, path: '/' })
  return response
}
