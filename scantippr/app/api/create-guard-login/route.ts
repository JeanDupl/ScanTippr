import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { guardId, email, companyId } = await request.json()
    if (!guardId || !email) {
      return NextResponse.json({ error: 'guardId and email are required' }, { status: 400 })
    }

    // Create Supabase auth user and send password reset email
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      email_confirm: true,
    })

    if (authError) {
      console.error('Auth create error:', authError)
      return NextResponse.json({ error: authError.message }, { status: 500 })
    }

    const userId = authData.user.id

    // Insert profile row linking to guard
    const { error: profileError } = await supabase.from('profiles').insert({
      id: userId,
      company_id: companyId ?? null,
      role: 'individual',
      guard_id: guardId,
      full_name: email,
    })

    if (profileError) {
      console.error('Profile insert error:', profileError)
      // Clean up auth user if profile insert fails
      await supabase.auth.admin.deleteUser(userId)
      return NextResponse.json({ error: profileError.message }, { status: 500 })
    }

    // Send password reset email so guard can set their own password
    await supabase.auth.admin.generateLink({
      type: 'recovery',
      email,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('create-guard-login error:', err)
    return NextResponse.json({ error: 'Failed to create login' }, { status: 500 })
  }
}
