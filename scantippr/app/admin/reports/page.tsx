import { createClient } from '@supabase/supabase-js'
import ReportsClient from './ReportsClient'

export const revalidate = 0

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function ReportsPage() {
  const { data: transactions } = await supabase
    .from('transactions')
    .select('*')
    .order('created_at', { ascending: false })

  const { data: guards } = await supabase
    .from('guards')
    .select('id, first_name, last_name, job_title, company_id')

  const { data: companies } = await supabase
    .from('companies')
    .select('id, name')

  return (
    <ReportsClient
      transactions={transactions ?? []}
      guards={guards ?? []}
      companies={companies ?? []}
    />
  )
}