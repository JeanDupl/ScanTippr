import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import DashboardShell from '../../../components/dashboard/DashboardShell'
import ReportsClient from '../../../components/dashboard/ReportsClient'

export const revalidate = 0

export default async function ReportsPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const cookieStore = await cookies()
  const userId = cookieStore.get('sb_user_id')?.value
  if (!userId) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('company_id')
    .eq('id', userId)
    .single()

  const companyId = profile?.company_id
  if (!companyId) redirect('/login')

  const { data: transactions } = await supabase
    .from('transactions')
    .select('id, amount, currency, created_at, status, guard_id, ozow_payment_id')
    .eq('company_id', companyId)
    .eq('status', 'success')
    .order('created_at', { ascending: false })
    .limit(100)

  const { data: company } = await supabase
    .from('companies')
    .select('name, brand_primary, brand_light, sidebar_mode')
    .eq('id', companyId)
    .single()

  const { data: employees } = await supabase
    .from('guards')
    .select('id, first_name, last_name, location')
    .eq('company_id', companyId)

  return (
    <DashboardShell
      companyId={companyId}
      initialTheme={{
        primary: company?.brand_primary || '#FF5A00',
        light: company?.brand_light || '#FFF0E6',
      }}
      initialSidebarMode={company?.sidebar_mode || 'dark'}
    >
      <ReportsClient transactions={transactions ?? []} employees={employees ?? []} companyName={company?.name ?? 'Company'} />
    </DashboardShell>
  )
}