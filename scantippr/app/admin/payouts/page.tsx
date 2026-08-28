import { createClient } from '@supabase/supabase-js'
import PayoutsAdminClient from './PayoutsAdminClient'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
export const revalidate = 0

export default async function AdminPayoutsPage() {
  const [{ data: periods }, { data: companies }] = await Promise.all([
    supabase
      .from('payout_periods')
      .select('*, payout_line_items(*)')
      .order('period_month', { ascending: false }),
    supabase.from('companies').select('id, name'),
  ])

  const enriched = (periods ?? []).map(p => {
    const items = p.payout_line_items ?? []
    const gross = items.reduce((s: number, li: any) => s + (li.gross_amount ?? 0), 0)
    const fee = items.reduce((s: number, li: any) => s + (li.fee_amount ?? 0), 0)
    const net = items.reduce((s: number, li: any) => s + (li.net_amount ?? 0), 0)
    const company = (companies ?? []).find(c => c.id === p.company_id)
    return { ...p, gross, fee, net, employeeCount: items.length, companyName: company?.name ?? '—' }
  })

  return <PayoutsAdminClient periods={enriched} companies={companies ?? []} />
}
