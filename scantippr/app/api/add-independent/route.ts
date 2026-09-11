import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { first_name, last_name, job_title, email, phone, photo_url } = await request.json()
    if (!first_name || !last_name || !email) {
      return NextResponse.json({ error: 'first_name, last_name and email are required' }, { status: 400 })
    }

    const id = crypto.randomUUID()

    const { error } = await supabase.from('guards').insert({
      id,
      first_name,
      last_name,
      job_title: job_title || null,
      email,
      phone: phone || null,
      photo_url: photo_url || null,
      company_id: null,
      is_active: true,
    })

    if (error) {
      console.error('Insert error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, id })
  } catch (err) {
    console.error('add-independent error:', err)
    return NextResponse.json({ error: 'Failed to create independent' }, { status: 500 })
  }
}
