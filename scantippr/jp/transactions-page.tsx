import { createClient } from '@supabase/supabase-js'
import TransactionsClient from './TransactionsClient'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
export const revalidate = 0

export default async function TransactionsPage() {
  const [{ data: transactions }, { data: guards }, { data: companies }] = await Promise.all([
    supabase.from('transactions').select('*').order('created_at', { ascending: false }).limit(500),
    supabase.from('guards').select('id, first_name, last_name, company_id'),
    supabase.from('companies').select('id, name'),
  ])

  return (
    <TransactionsClient
      transactions={transactions ?? []}
      guards={guards ?? []}
      companies={companies ?? []}
    />
  )
}
