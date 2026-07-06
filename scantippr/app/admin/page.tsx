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
  .select('*')
  .order('created_at', { ascending: false })
  .limit(20)

const { data: guards } = await supabase
  .from('guards')
  .select('id, first_name, last_name')

const { data: companiesList } = await supabase
  .from('companies')
  .select('id, name')

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

      <CollapsibleSection title="Recent Transactions">
  <div className="grid gap-4">
    {companiesList?.map((company) => {
      const companyTransactions = transactions?.filter(tx => tx.company_id === company.id) ?? []
      if (companyTransactions.length === 0) return null
      return (
        <div key={company.id} className="bg-white rounded-xl shadow overflow-hidden">
          <div className="px-6 py-3 bg-gray-50 border-b">
            <h3 className="font-semibold text-gray-700">{company.name}</h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Guard</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Reference</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {companyTransactions.map((tx) => (
                <tr key={tx.id} className="border-t">
                  <td className="px-6 py-3 text-gray-500">
                    {new Date(tx.created_at).toLocaleDateString('en-ZA')}
                  </td>
                  <td className="px-6 py-3">
                    {guards?.find(g => g.id === tx.guard_id)?.first_name} {guards?.find(g => g.id === tx.guard_id)?.last_name}
                  </td>
                  <td className="px-6 py-3 font-medium text-green-600">R{tx.amount}</td>
    </main>
  )
}