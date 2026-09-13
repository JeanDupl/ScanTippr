import { createClient } from '@supabase/supabase-js'
import PayoutsAdminClient from './PayoutsAdminClient'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
export const revalidate = 0

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December']

export default async function AdminPayoutsPage() {
  const [{ data: periods }, { data: companies }, { data: independents }] = await Promise.all([
    supabase
      .from('payout_periods')
      .select('*, payout_line_items(*)')
      .order('period_year', { ascending: false })
      .order('period_month', { ascending: false }),
    supabase.from('companies').select('id, name'),
    supabase
      .from('guards')
      .select('id, first_name, last_name, job_title')
      .is('company_id', null)
      .order('first_name'),
  ])

  const enriched = (periods ?? []).map(p => {
    const items = p.payout_line_items ?? []
    const gross = items.reduce((s: number, li: any) => s + (li.gross_amount ?? 0), 0)
    const fee = items.reduce((s: number, li: any) => s + (li.fee_amount ?? 0), 0)
    const net = items.reduce((s: number, li: any) => s + (li.net_amount ?? 0), 0)
    const monthLabel = MONTH_NAMES[(p.period_month ?? 1) - 1] ?? `Month ${p.period_month}`
    const periodLabel = `${monthLabel} ${p.period_year}`

    if (p.recipient_type === 'company') {
      const company = (companies ?? []).find(c => c.id === p.recipient_id)
      return {
        ...p,
        gross, fee, net,
        employeeCount: items.length,
        recipientName: company?.name ?? '—',
        recipientId: company?.id ?? null,
        periodLabel,
      }
    } else {
      // guard / individual
      const guard = (independents ?? []).find(g => g.id === p.recipient_id)
      const guardName = guard
        ? `${guard.first_name} ${guard.last_name}`
        : '—'
      return {
        ...p,
        gross, fee, net,
        employeeCount: items.length,
        recipientName: guardName,
        recipientId: guard?.id ?? null,
        periodLabel,
      }
    }
  })

  const years = [...new Set((periods ?? []).map(p => p.period_year))].sort((a, b) => b - a)

  return (
    <PayoutsAdminClient
      periods={enriched}
      companies={companies ?? []}
      independents={independents ?? []}
      availableYears={years}
    />
  )
}