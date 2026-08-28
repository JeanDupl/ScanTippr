import { createClient } from '@supabase/supabase-js'
import CompaniesClient from './CompaniesClient'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
export const revalidate = 0

export default async function CompaniesPage() {
  const { data: companies } = await supabase
    .from('companies')
    .select('id, name, logo_url, created_at')
    .order('name')

  const { data: guards } = await supabase
    .from('guards')
    .select('id, company_id, is_active')

  const { data: transactions } = await supabase
    .from('transactions')
    .select('company_id, amount, created_at, payment_status')

  const firstOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()

  const enriched = (companies ?? []).map(c => {
    const companyGuards = (guards ?? []).filter(g => g.company_id === c.id)
    const activeEmployees = companyGuards.filter(g => g.is_active).length
    const companyTx = (transactions ?? []).filter(tx => tx.company_id === c.id && tx.payment_status === 'complete')
    const totalDonations = companyTx.reduce((s, tx) => s + (tx.amount ?? 0), 0)
    const thisMonth = companyTx.filter(tx => tx.created_at >= firstOfMonth).reduce((s, tx) => s + (tx.amount ?? 0), 0)
    return { ...c, activeEmployees, totalEmployees: companyGuards.length, totalDonations, thisMonth }
  })

  return <CompaniesClient companies={enriched} />
}
