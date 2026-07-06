import { createClient } from '@supabase/supabase-js'
import CollapsibleSection from './CollapsibleSection'
import CollapsibleCompany from './CollapsibleCompany'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function AdminPage() {
  const { data: companies } = await supabase
    .from('companies')
    .select('*, guards(id, first_name, last_name, is_active)')

  const { data: transactions } = await supabase
    .from('transactions')
    .select('*, guards(first_name, last_name), companies(name)')
    .order('created_at', { ascending: false })
    .limit(20)

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">ScanTippr Admin</h1>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '2rem' }}>
        <a href="/admin/add-company" style={{
          padding: '10px 20px',
          background: '#1a3a5c',
          color: '#fff',
          borderRadius: '8px',
          textDecoration: 'none',
          fontSize: '14px',
          fontWeight: 600,
        }}>
          + Add company
        </a>
        <a href="/admin/add-guard" style={{
          padding: '10px 20px',
          background: '#1a3a5c',
          color: '#fff',
          borderRadius: '8px',
          textDecoration: 'none',
          fontSize: '14px',
          fontWeight: 600,
        }}>
          + Add guard
        </a>
      </div>

      <CollapsibleSection title="Companies and Guards">
        <div className="grid gap-4">
          {companies?.map((company) => (
            <CollapsibleCompany key={company.id} company={company} />
          ))}
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Recent Transactions">
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left text-gray-500">
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Guard</th>
                <th className="px-6 py-3">Company</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Reference</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions && transactions.length > 0 ? transactions.map((tx) => (
                <tr key={tx.id} className="border-t">
                  <td className="px-6 py-3 text-gray-500">
                    {new Date(tx.created_at).toLocaleDateString('en-ZA')}
                  </td>
                  <td className="px-6 py-3">{(tx.guards as any)?.first_name} {(tx.guards as any)?.last_name}</td>
                  <td className="px-6 py-3 text-gray-500">{(tx.companies as any)?.name}</td>
                  <td className="px-6 py-3 font-medium text-green-600">R{tx.amount}</td>
                  <td className="px-6 py-3 text-gray-400 text-xs">{tx.paystack_reference}</td>
                  <td className="px-6 py-3">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                      {tx.status}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                    No transactions yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CollapsibleSection>
    </main>
  )
}