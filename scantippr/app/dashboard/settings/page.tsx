import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import DashboardShell from '../../../components/dashboard/DashboardShell'
import BankDetailsForm from '../../../components/dashboard/BankDetailsForm'

export const revalidate = 0

export default async function SettingsPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const cookieStore = await cookies()
  const userId = cookieStore.get('sb_user_id')?.value
  if (!userId) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('company_id, role, guard_id, full_name')
    .eq('id', userId)
    .single()

  const companyId = profile?.company_id
  const role = profile?.role ?? 'company'
  const guardId = profile?.guard_id
  if (!companyId && role !== 'individual') redirect('/login')

  let company = null
  let guard = null

  if (role === 'individual' && guardId) {
    const { data: g } = await supabase.from('guards').select('*').eq('id', guardId).single()
    guard = g
  } else {
    const { data: co } = await supabase.from('companies').select('*').eq('id', companyId).single()
    company = co
  }

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
      <div className="space-y-8 max-w-2xl">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage your bank details and payout preferences
          </p>
        </div>

        <BankDetailsForm
          companyId={companyId ?? ''}
          companyName={displayName}
          isIndividual={role === 'individual'}
          initialCompanyBank={{
            bank_account_number: (role === 'individual' ? guard?.bank_account_number : company?.bank_account_number) || '',
            bank_name: (role === 'individual' ? guard?.bank_name : company?.bank_name) || '',
            bank_account_holder: (role === 'individual' ? guard?.bank_account_holder : company?.bank_account_holder) || '',
            bank_account_type: (role === 'individual' ? guard?.bank_account_type : company?.bank_account_type) || '',
          }}
        />
      </div>
    </DashboardShell>
  )
}
