import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// POST /api/settings/bank-details
// Server-side only — bank details never pass through the client
// Uses service role to write, but validates the user owns the record first

export async function POST(request: Request) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Verify the user is authenticated
    const cookieStore = await cookies()
    const userId = cookieStore.get('sb_user_id')?.value
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
    }

    // Get their profile to confirm company ownership
    const { data: profile } = await supabase
      .from('profiles')
      .select('company_id')
      .eq('id', userId)
      .single()

    if (!profile?.company_id) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
    }

    const body = await request.json()
    const {
      type,
      companyId,
      bank_account_number,
      bank_name,
      bank_account_holder,
      bank_account_type,
    } = body

    // Validate the user owns the company they're trying to update
    if (type === 'company') {
      if (companyId !== profile.company_id) {
        return NextResponse.json({ error: 'Unauthorised' }, { status: 403 })
      }

      // Validate required fields
      if (!bank_account_number || !bank_name || !bank_account_holder || !bank_account_type) {
        return NextResponse.json(
          { error: 'All bank detail fields are required' },
          { status: 400 }
        )
      }

      // Validate account number is numeric only
      if (!/^\d+$/.test(bank_account_number.trim())) {
        return NextResponse.json(
          { error: 'Account number must contain digits only' },
          { status: 400 }
        )
      }

      const { error } = await supabase
        .from('companies')
        .update({
          bank_account_number: bank_account_number.trim(),
          bank_name: bank_name.trim(),
          bank_account_holder: bank_account_holder.trim(),
          bank_account_type: bank_account_type.trim(),
        })
        .eq('id', companyId)

      if (error) {
        console.error('[bank-details] company update error:', error)
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
