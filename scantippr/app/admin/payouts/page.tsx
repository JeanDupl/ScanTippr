import { createClient } from '@supabase/supabase-js'
import PayoutsAdminClient from './PayoutsAdminClient'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
export const revalidate = 0

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December']

export default async function AdminPayoutsPage() {
  const [{ data: periods }, { data: companies }] = await Promise.all([
    supabase
      .from('payout_periods')
      .select('*, payout_line_items(*)')
      .order('period_year', { ascending: false })
      .order('period_month', { ascending: false }),
    supabase.from('companies').select('id, name'),
  ])

  const enriched = (periods ?? []).map(p => {
    const items = p.payout_line_items ?? []
    const gross = items.reduce((s: number, li: any) => s + (li.gross_amount ?? 0), 0)
    const fee = items.reduce((s: number, li: any) => s + (li.fee_amount ?? 0), 0)
    const net = items.reduce((s: number, li: any) => s + (li.net_amount ?? 0), 0)
    const company = (companies ?? []).find(c => c.id === p.recipient_id)
    const monthLabel = MONTH_NAMES[(p.period_month ?? 1) - 1] ?? `Month ${p.period_month}`
    const periodLabel = `${monthLabel} ${p.period_year}`
    return {
      ...p,
      gross, fee, net,
      employeeCount: items.length,
      companyName: company?.name ?? '—',
      companyId: company?.id ?? null,
      periodLabel,
    }
  })

  const years = [...new Set((periods ?? []).map(p => p.period_year))].sort((a, b) => b - a)

  return <PayoutsAdminClient periods={enriched} companies={companies ?? []} availableYears={years} />
}
