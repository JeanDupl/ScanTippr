import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// POST /api/settings/bank-details
// Handles both company and individual bank detail updates

export async function POST(request: Request) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const cookieStore = await cookies()
    const userId = cookieStore.get('sb_user_id')?.value
    if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

    const { data: profile } = await supabase
      .from('profiles')
      .select('company_id, role, guard_id')
      .eq('id', userId)
      .single()

    if (!profile) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

    // Must have either a company_id or be an individual with a guard_id
    if (!profile.company_id && profile.role !== 'individual') {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
    }

    const body = await request.json()
    const { type, companyId, guardId, bank_account_number, bank_name, bank_account_holder, bank_account_type } = body

    // Validate required fields
    if (!bank_account_number || !bank_name || !bank_account_holder || !bank_account_type) {
      return NextResponse.json({ error: 'All bank detail fields are required' }, { status: 400 })
    }

    if (!/^\d+$/.test(bank_account_number.trim())) {
      return NextResponse.json({ error: 'Account number must contain digits only' }, { status: 400 })
    }

    // ── Company update ────────────────────────────────────────
    if (type === 'company') {
      if (companyId !== profile.company_id) {
        return NextResponse.json({ error: 'Unauthorised' }, { status: 403 })
      }

      const { error } = await supabase
        .from('companies')
        .update({
          bank_account_number: bank_account_number.trim(),
          bank_name:           bank_name.trim(),
          bank_account_holder: bank_account_holder.trim(),
          bank_account_type:   bank_account_type.trim(),
        })
        .eq('id', companyId)

      if (error) {
        console.error('[bank-details] company update error:', error)
        return NextResponse.json({ error: 'Failed to save bank details' }, { status: 500 })
      }

      return NextResponse.json({ success: true })
    }

    // ── Individual update ─────────────────────────────────────
    if (type === 'individual') {
      // Confirm the guard_id in the request matches the profile's guard_id
      if (!profile.guard_id || guardId !== profile.guard_id) {
        return NextResponse.json({ error: 'Unauthorised' }, { status: 403 })
      }

      const { error } = await supabase
        .from('guards')
        .update({
          bank_account_number: bank_account_number.trim(),
          bank_name:           bank_name.trim(),
          bank_account_holder: bank_account_holder.trim(),
          bank_account_type:   bank_account_type.trim(),
        })
        .eq('id', profile.guard_id)

      if (error) {
        console.error('[bank-details] guard update error:', error)
        return NextResponse.json({ error: 'Failed to save bank details' }, { status: 500 })
      }

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 })

  } catch (err) {
    console.error('[bank-details] unexpected error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
