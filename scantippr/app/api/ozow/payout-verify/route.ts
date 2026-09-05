import { createClient } from '@supabase/supabase-js'
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
export async function POST(request: Request) {
  let body: any
  try {
    body = await request.json()
  } catch {
    return Response.json({ IsVerified: false, Reason: 'Invalid JSON' }, { status: 400 })
  }
  console.log('[payout-verify] Received:', JSON.stringify(body, null, 2))
  // TEMP: force cancellation for Test 6
  return Response.json({ PayoutId: body.PayoutId, IsVerified: false, AccountNumberDecryptionKey: '', Reason: 'Test 6 cancellation' })
}
