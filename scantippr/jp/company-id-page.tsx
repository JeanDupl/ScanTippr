import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import CompanyProfileClient from './CompanyProfileClient'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
export const revalidate = 0

export default async function CompanyProfilePage({ params, searchParams }: { params: { id: string }, searchParams: { tab?: string } }) {
  const { data: company } = await supabase
    .from('companies')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!company) notFound()

  const firstOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()

  const [{ data: guards }, { data: transactions }, { data: payoutPeriods }] = await Promise.all([
    supabase.from('guards').select('*').eq('company_id', params.id).order('first_name'),
    supabase.from('transactions').select('*').eq('company_id', params.id).order('created_at', { ascending: false }),
    supabase.from('payout_periods').select('*, payout_line_items(*)').eq('company_id', params.id).order('period_month', { ascending: false }).limit(12),
  ])

  const completedTx = (transactions ?? []).filter(tx => tx.payment_status === 'complete')
  const totalDonations = completedTx.reduce((s, tx) => s + (tx.amount ?? 0), 0)
  const thisMonthDonations = completedTx.filter(tx => tx.created_at >= firstOfMonth).reduce((s, tx) => s + (tx.amount ?? 0), 0)

  return (
    <CompanyProfileClient
      company={company}
      guards={guards ?? []}
      transactions={transactions ?? []}
      payoutPeriods={payoutPeriods ?? []}
      totalDonations={totalDonations}
      thisMonthDonations={thisMonthDonations}
      initialTab={searchParams.tab ?? 'overview'}
    />
  )
}
