import { createClient } from '@supabase/supabase-js'
import EmployeesClient from './EmployeesClient'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
export const revalidate = 0

export default async function EmployeesPage() {
  const [{ data: guards }, { data: companies }, { data: transactions }] = await Promise.all([
    supabase.from('guards').select('*').order('first_name'),
    supabase.from('companies').select('id, name'),
    supabase.from('transactions').select('guard_id, amount, payment_status'),
  ])

  const enriched = (guards ?? []).map(g => {
    const gtx = (transactions ?? []).filter(tx => tx.guard_id === g.id && tx.payment_status === 'complete')
    const totalDonations = gtx.reduce((s, tx) => s + (tx.amount ?? 0), 0)
    const company = (companies ?? []).find(c => c.id === g.company_id)
    return { ...g, totalDonations, companyName: company?.name ?? '—' }
  })

  return <EmployeesClient guards={enriched} companies={companies ?? []} />
}
