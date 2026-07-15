import { createClient } from '@supabase/supabase-js'
import CollapsibleSection from './CollapsibleSection'
import CollapsibleCompany from './CollapsibleCompany'
import CollapsibleTransactions from './CollapsibleTransactions'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export const revalidate = 0

export default async function AdminPage() {
  const { data: companies } = await supabase
    .from('companies')
    .select('*, guards(id, first_name, last_name, job_title, is_active)')

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
          + Add employee
        </a>
        <a href="/admin/reports" style={{
          padding: '10px 20px',
          background: '#1a3a5c',
          color: '#fff',
          borderRadius: '8px',
          textDecoration: 'none',
          fontSize: '14px',
          fontWeight: 600,
        }}>
          Reports
        </a>
      </div>

      <CollapsibleSection title="Companies and Employees">
        <div className="grid gap-4">
          {companies?.map((company) => (
            <CollapsibleCompany key={company.id} company={company} />
          ))}
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Recent Transactions">
        <div className="grid gap-4">
          {companiesList?.map((company) => {
            const companyTransactions = transactions?.filter(tx => tx.company_id === company.id) ?? []
            if (companyTransactions.length === 0) return null
            return (
              <CollapsibleTransactions
                key={company.id}
                companyName={company.name}
                transactions={companyTransactions}
                guards={guards ?? []}
              />
            )
          })}
        </div>
      </CollapsibleSection>

    </main>
  )
}