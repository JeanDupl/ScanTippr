import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import EmployeeProfileClient from './EmployeeProfileClient'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
export const revalidate = 0

export default async function EmployeeProfilePage({ params }: { params: { id: string } }) {
  const { data: guard } = await supabase
    .from('guards').select('*').eq('id', params.id).single()
  if (!guard) notFound()

  const [{ data: company }, { data: transactions }] = await Promise.all([
    supabase.from('companies').select('id, name').eq('id', guard.company_id).single(),
    supabase.from('transactions').select('*').eq('guard_id', params.id).order('created_at', { ascending: false }),
  ])

  const firstOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()
  const completedTx = (transactions ?? []).filter(tx => tx.payment_status === 'complete')
  const totalDonations = completedTx.reduce((s, tx) => s + (tx.amount ?? 0), 0)
  const thisMonth = completedTx.filter(tx => tx.created_at >= firstOfMonth).reduce((s, tx) => s + (tx.amount ?? 0), 0)
  const fee = Math.min(150, totalDonations)
  const net = totalDonations - fee

  return (
    <EmployeeProfileClient
      guard={guard}
      company={company}
      transactions={transactions ?? []}
      totalDonations={totalDonations}
      thisMonth={thisMonth}
      fee={fee}
      net={net}
    />
  )
}
