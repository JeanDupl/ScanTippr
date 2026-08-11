import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import DashboardShell from '../../../components/dashboard/DashboardShell'

export const revalidate = 0

export default async function EmployeesPage() {
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

  const { data: employees } = await supabase
    .from('guards')
    .select('*')
    .eq('company_id', companyId)
    .order('first_name', { ascending: true })

  return (
    <DashboardShell>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Employees</h1>
          <p className="text-slate-500 text-sm mt-1">All employees registered under your company</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Employee list</h2>
            <span className="text-sm text-slate-400">{employees?.length || 0} total</span>
          </div>
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold uppercase text-xs">
              <tr>
                <th className="p-4">Employee</th>
                <th className="p-4">Job Title</th>
                <th className="p-4">Location</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(employees ?? []).map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {emp.photo_url ? (
                        <img
                          src={emp.photo_url}
                          alt={emp.first_name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-xs">
                          {emp.first_name?.[0]}{emp.last_name?.[0]}
                        </div>
                      )}
                      <span className="font-medium text-slate-900">
                        {emp.first_name} {emp.last_name}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">{emp.job_title || '—'}</td>
                  <td className="p-4">{emp.location || '—'}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                      emp.is_active
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {emp.is_active ? 'Active' : 'Inactive'}
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