'use server'

import { createClient } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function addCompany(formData: FormData) {
  const name = formData.get('name') as string
  const subaccount = formData.get('subaccount') as string

  if (!name?.trim()) return

  await supabase.from('companies').insert({
    name: name.trim(),
    paystack_subaccount_code: subaccount?.trim() || null,
  })

  redirect('/admin')
}

export async function addGuard(formData: FormData) {
  const firstName = formData.get('firstName') as string
  const lastName = formData.get('lastName') as string
  const companyId = formData.get('companyId') as string

  if (!firstName?.trim() || !lastName?.trim() || !companyId) return

  await supabase.from('guards').insert({
    first_name: firstName.trim(),
    last_name: lastName.trim(),
    company_id: companyId,
    is_active: true,
  })

  redirect('/admin')
}