import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname.startsWith('/admin')) {
    const authHeader = req.headers.get('authorization')

    if (authHeader) {
      const base64 = authHeader.replace('Basic ', '')
      const decoded = Buffer.from(base64, 'base64').toString('utf-8')
      const [, password] = decoded.split(':')

      if (password === process.env.ADMIN_PASSWORD) {
        return NextResponse.next()
      }
    }

    return new NextResponse('Unauthorized', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="ScanTippr Admin"',
      },
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}