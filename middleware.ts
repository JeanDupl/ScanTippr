import { NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (
    pathname.startsWith('/login') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  if (pathname.startsWith('/admin')) {
    if (req.method === 'POST') return NextResponse.next()

    // Check cookie first
    const adminAuth = req.cookies.get('admin_auth')?.value
    if (adminAuth === process.env.ADMIN_PASSWORD) return NextResponse.next()

    // Fall back to Basic Auth header
    const authHeader = req.headers.get('authorization')
    if (authHeader) {
      const base64 = authHeader.replace('Basic ', '')
      const decoded = Buffer.from(base64, 'base64').toString('utf-8')
      const [, password] = decoded.split(':')
      if (password === process.env.ADMIN_PASSWORD) {
        const res = NextResponse.next()
        res.cookies.set('admin_auth', process.env.ADMIN_PASSWORD!, {
          httpOnly: true,
          secure: true,
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7,
          path: '/admin',
        })
        return res
      }
    }

    return new NextResponse('Unauthorized', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="ScanTippr Admin"' },
    })
  }

  if (pathname.startsWith('/dashboard')) {
    const token = req.cookies.get('sb_access_token')?.value
    const userId = req.cookies.get('sb_user_id')?.value
    if (!token || !userId) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
