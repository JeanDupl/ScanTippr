import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import DashboardShell from '../../components/dashboard/DashboardShell'

export const revalidate = 0

export default async function DashboardPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const cookieStore = await cookies()
  const userId = cookieStore.get('sb_user_id')?.value

  if (!userId) redirect('/login')

  // Get company_id from profiles
  const { data: profile } = await supabase
    .from('profiles')
    .select('company_id')
    .eq('id', userId)
    .single()

  const companyId = profile?.company_id
  if (!companyId) redirect('/login')

  const { data: company } = await supabase
    .from('companies')
    .select('*')
    .eq('id', companyId)
    .single()

  const { data: guards } = await supabase
    .from('guards')
    .select('*')
    .eq('company_id', companyId)
    .eq('is_active', true)

  const { data: transactions } = await supabase
    .from('transactions')
    .select('id, amount, currency, created_at, paystack_reference, status, guard_id')
    .eq('company_id', companyId)
    .order('created_at', { ascending: false })
    .limit(10)

  const guardMap = Object.fromEntries(
    (guards ?? []).map((g) => [g.id, `${g.first_name} ${g.last_name}`])
  )

  const totalTips = (transactions ?? [])
    .filter((tx) => tx.status === 'success')
    .reduce((sum, tx) => sum + Number(tx.amount), 0)

  return (
    <DashboardShell
      companyId={companyId}
      initialTheme={{
        primary: company?.brand_primary || '#FF5A00',
        light: company?.brand_light || '#FFF0E6',
      }}
      initialSidebarMode={company?.sidebar_mode || 'dark'}
    >
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{company?.name || 'Company Dashboard'}</h1>
          <p className="text-slate-500 text-sm mt-1">Real-time tipping performance</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Total tips collected</p>
            <p className="text-3xl font-extrabold text-slate-900 mt-2">
              R{totalTips.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Active employees</p>
            <p className="text-3xl font-extrabold text-slate-900 mt-2">{guards?.length || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Total transactions</p>
            <p className="text-3xl font-extrabold text-slate-900 mt-2">{transactions?.length || 0}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900">Recent transactions</h2>
          </div>
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold uppercase text-xs">
              <tr>
                <th className="p-4">Date</th>
                <th className="p-4">Employee</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Reference</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(transactions ?? []).map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50">
                  <td className="p-4">{new Date(tx.created_at).toLocaleDateString('en-ZA')}</td>
                  <td className="p-4 font-medium text-slate-900">{guardMap[tx.guard_id] || 'Unassigned'}</td>
                  <td className="p-4 font-semibold text-emerald-600">R{Number(tx.amount).toFixed(2)}</td>
                  <td className="p-4 text-xs font-mono text-slate-400">{tx.paystack_reference}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800">
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardShell>
  )
}