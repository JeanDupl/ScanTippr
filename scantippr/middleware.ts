import { NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Protect /admin with Basic Auth
  if (pathname.startsWith('/admin')) {
    if (req.method === 'POST') return NextResponse.next()
    const authHeader = req.headers.get('authorization')
    if (authHeader) {
      const base64 = authHeader.replace('Basic ', '')
      const decoded = Buffer.from(base64, 'base64').toString('utf-8')
      const [, password] = decoded.split(':')
      if (password === process.env.ADMIN_PASSWORD) return NextResponse.next()
    }
    return new NextResponse('Unauthorized', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="ScanTippr Admin"' },
    })
  }

  // Protect /dashboard
  if (pathname.startsWith('/dashboard')) {
    const token = req.cookies.get('sb_access_token')?.value
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*'],
}
