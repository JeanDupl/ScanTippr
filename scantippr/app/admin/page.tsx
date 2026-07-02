cat > scantippr/app/admin/page.tsx << 'EOF'
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function AdminPage() {
  const { data: companies } = await supabase
    .from('companies')
    .select('*, guards(id, first_name, last_name, is_active)');

  const { data: transactions } = await supabase
    .from('transactions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20);

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">ScanTippr Admin</h1>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Companies and Guards</h2>
        <div className="grid gap-4">
          {companies?.map((company) => (
            <div key={company.id} className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3">{company.name}</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b">
                    <th className="pb-2">Guard ID</th>
                    <th className="pb-2">Name</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2">QR Code</th>
                  </tr>
                </thead>
                <tbody>
                  {company.guards?.map((guard: any) => (
                    <tr key={guard.id} className="border-b last:border-0">
                      <td className="py-2 text-gray-500">{guard.id}</td>
                      <td className="py-2 font-medium">{guard.first_name} {guard.last_name}</td>
                      <td className="py-2">
                        <span className={guard.is_active ? 'px-2 py-1 rounded-full text-xs bg-green-100 text-green-700' : 'px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-500'}>
                          {guard.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-2">
                        <a href={'/api/qr/' + guard.id} target="_blank" className="text-blue-500 hover:underline text-xs">
                          Download QR
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Transactions</h2>
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left text-gray-500">
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Guard</th>
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
                  <td className="px-6 py-3">{tx.guard_id}</td>
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
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                    No transactions yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
EOF