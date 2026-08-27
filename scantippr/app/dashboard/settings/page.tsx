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

  // Get profile → determines company_id and role
  const { data: profile } = await supabase
    .from('profiles')
    .select('company_id, role, full_name')
    .eq('id', userId)
    .single()

  const companyId = profile?.company_id
  if (!companyId) redirect('/login')

  const { data: company } = await supabase
    .from('companies')
    .select('*')
    .eq('id', companyId)
    .single()

  // Check if this user is also a guard (individual-managed account)
  const { data: guard } = await supabase
    .from('guards')
    .select('*')
    .eq('company_id', companyId)
    .eq('is_active', true)
    .limit(1)
    .maybeSingle()

  // Determine account type:
  // company-managed  → company has multiple guards OR guard has a company_id set by admin
  // individual       → guard signed up directly (company is their own solo entity)
  const { data: guardCount } = await supabase
    .from('guards')
    .select('id', { count: 'exact', head: true })
    .eq('company_id', companyId)
    .eq('is_active', true)

  return (
    <DashboardShell
      companyId={companyId}
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
          companyId={companyId}
          companyName={company?.name || ''}
          initialCompanyBank={{
            bank_account_number: company?.bank_account_number || '',
            bank_name: company?.bank_name || '',
            bank_account_holder: company?.bank_account_holder || '',
            bank_account_type: company?.bank_account_type || '',
          }}
        />
      </div>
    </DashboardShell>
  )
}
