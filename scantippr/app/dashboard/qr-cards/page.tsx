import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import DashboardShell from '../../../components/dashboard/DashboardShell'
import QRCardsClient from '../../../components/dashboard/QRCardsClient'

export const revalidate = 0

export default async function QRCardsPage() {
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

  const { data: company } = await supabase
    .from('companies')
    .select('name')
    .eq('id', companyId)
    .single()

  const { data: employees } = await supabase
    .from('guards')
    .select('id, first_name, last_name, job_title, location, is_active')
    .eq('company_id', companyId)
    .eq('is_active', true)
    .order('first_name', { ascending: true })

  return (
    <DashboardShell>
      <QRCardsClient employees={employees ?? []} companyName={company?.name ?? 'Company'} />
    </DashboardShell>
  )
}