import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import DashboardShell from '../../../components/dashboard/DashboardShell'
import PayoutsClient from '../../../components/dashboard/PayoutsClient'

export const revalidate = 0

export default async function PaymentsPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const cookieStore = await cookies()
  const userId = cookieStore.get('sb_user_id')?.value
  if (!userId) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('company_id, role, guard_id')
    .eq('id', userId)
    .single()

  const companyId = profile?.company_id
  const role = profile?.role ?? 'company'
  const guardId = profile?.guard_id
  if (!companyId && role !== 'individual') redirect('/login')

  let company = null
  let guards = null
  let guard = null

  if (role === 'individual' && guardId) {
    const { data: g } = await supabase.from('guards').select('*').eq('id', guardId).single()
    guard = g
    guards = g ? [g] : []
  } else {
    const [{ data: co }, { data: g }] = await Promise.all([
      supabase.from('companies').select('name, brand_primary, brand_light, sidebar_mode, bank_account_number, bank_name, bank_account_holder, bank_account_type').eq('id', companyId).single(),
      supabase.from('guards').select('id, first_name, last_name').eq('company_id', companyId).eq('is_active', true),
    ])
    company = co
    guards = g
  }

  // Fetch payout periods for this company
  const { data: payoutPeriods } = await supabase
    .from('payout_periods')
    .select('*')
    .eq('recipient_type', 'company')
    .eq('recipient_id', companyId)
    .order('period_year', { ascending: false })
    .order('period_month', { ascending: false })

  // Fetch line items for all periods
  const periodIds = (payoutPeriods ?? []).map((p) => p.id)
  const { data: lineItems } = periodIds.length > 0
    ? await supabase
        .from('payout_line_items')
        .select('*')
        .in('payout_period_id', periodIds)
        .order('guard_name', { ascending: true })
    : { data: [] }

  // Count unpaid completed transactions (for the "ready to pay out" indicator)
  const now = new Date()
  const currentMonth = now.getMonth() + 1
  const currentYear  = now.getFullYear()

  const { count: unpaidCount } = await supabase
    .from('transactions')
    .select('id', { count: 'exact', head: true })
    .eq('company_id', companyId)
    .eq('payment_status', 'completed')
    .eq('payout_status', 'unpaid')

  const displayName = role === 'individual' && guard
    ? `${guard.first_name} ${guard.last_name}`
    : company?.name ?? ''

  return (
    <DashboardShell
      companyId={companyId ?? ''}
      companyName={displayName}
      initialTheme={{
        primary: company?.brand_primary || '#FF5A00',
        light: company?.brand_light || '#FFF0E6',
      }}
      initialSidebarMode={company?.sidebar_mode || 'dark'}
    >
      <PayoutsClient
        companyId={companyId ?? ''}
        companyName={displayName}
        hasBankDetails={role === 'individual'
          ? !!(guard?.bank_account_number && guard?.bank_name)
          : !!(company?.bank_account_number && company?.bank_name)}
        payoutPeriods={payoutPeriods ?? []}
        lineItems={lineItems ?? []}
        unpaidTransactionCount={unpaidCount ?? 0}
        currentMonth={currentMonth}
        currentYear={currentYear}
      />
    </DashboardShell>
  )
}
