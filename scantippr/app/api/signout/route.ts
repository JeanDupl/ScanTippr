import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const response = NextResponse.redirect(new URL('/login', request.url), { status: 303 })
  response.cookies.set('sb_access_token', '', { maxAge: 0, path: '/' })
  response.cookies.set('sb_user_id', '', { maxAge: 0, path: '/' })
  return response
}
