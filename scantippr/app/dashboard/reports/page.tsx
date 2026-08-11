import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import DashboardShell from '../../../components/dashboard/DashboardShell'

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
    .select('id, amount, currency, created_at, paystack_reference, status, guard_id')
    .eq('company_id', companyId)
    .eq('status', 'success')
    .order('created_at', { ascending: false })
    .limit(100)

  const { data: employees } = await supabase
    .from('guards')
    .select('id, first_name, last_name, location')
    .eq('company_id', companyId)

  const guardMap = Object.fromEntries(
    (employees ?? []).map((g) => [g.id, `${g.first_name} ${g.last_name}`])
  )

  const locationMap = Object.fromEntries(
    (employees ?? []).map((g) => [g.id, g.location || '—'])
  )

  const totalTips = (transactions ?? []).reduce((sum, tx) => sum + Number(tx.amount), 0)

  return (
    <DashboardShell>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
          <p className="text-slate-500 text-sm mt-1">All successful transactions for your company</p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Total tips collected</p>
            <p className="text-3xl font-extrabold text-slate-900 mt-2">
              R{totalTips.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Total transactions</p>
            <p className="text-3xl font-extrabold text-slate-900 mt-2">{transactions?.length || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Average tip</p>
            <p className="text-3xl font-extrabold text-slate-900 mt-2">
              R{transactions?.length
                ? (totalTips / transactions.length).toLocaleString('en-ZA', { minimumFractionDigits: 2 })
                : '0.00'}
            </p>
          </div>
        </div>

        {/* Transactions table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900">Transaction history</h2>
          </div>
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold uppercase text-xs">
              <tr>
                <th className="p-4">Date</th>
                <th className="p-4">Employee</th>
                <th className="p-4">Location</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Reference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(transactions ?? []).map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50">
                  <td className="p-4">{new Date(tx.created_at).toLocaleDateString('en-ZA')}</td>
                  <td className="p-4 font-medium text-slate-900">{guardMap[tx.guard_id] || '—'}</td>
                  <td className="p-4">{locationMap[tx.guard_id] || '—'}</td>
                  <td className="p-4 font-semibold text-emerald-600">
                    R{Number(tx.amount).toFixed(2)}
                  </td>
                  <td className="p-4 text-xs font-mono text-slate-400">{tx.paystack_reference}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!transactions || transactions.length === 0) && (
            <div className="p-8 text-center text-slate-400 text-sm">No transactions found.</div>
          )}
        </div>
      </div>
    </DashboardShell>
  )
}