'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { use } from 'react';

interface Guard {
  first_name: string;
  last_name: string;
  job_title: string | null;
  photo_url: string | null;
  companies: { name: string; logo_url: string | null } | { name: string; logo_url: string | null }[];
}

export default function PayPage({ params }: { params: Promise<{ guardId: string }> }) {
  const { guardId } = use(params);
  const [guard, setGuard] = useState<Guard | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAmount, setSelectedAmount] = useState<number>(20);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [processing, setProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const amounts = [10, 20, 50, 100];
  const displayAmount = customAmount ? parseInt(customAmount) : selectedAmount;

  useEffect(() => {
    async function fetchGuard() {
      const { data, error } = await supabase
        .from('guards')
        .select('first_name, last_name, job_title, photo_url, companies(name, logo_url)')
        .eq('id', guardId)
        .eq('is_active', true)
        .limit(1);
      if (error || !data || data.length === 0) {
        setGuard(null);
      } else {
        setGuard(data[0] as unknown as Guard);
      }
      setLoading(false);
    }
    fetchGuard();
  }, [guardId]);

  async function handlePayment() {
    if (!displayAmount || displayAmount <= 0) return;
    setProcessing(true);
    setPaymentError(null);

    try {
      const res = await fetch('/api/initiate-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guardId, amount: displayAmount }),
      });

      const data = await res.json();

      if (!res.ok) {
        setPaymentError(data.error || 'Something went wrong. Please try again.');
        setProcessing(false);
        return;
      }

      window.location.href = data.authorization_url;
    } catch (err) {
      setPaymentError('Could not connect to payment service. Please try again.');
      setProcessing(false);
    }
  }

  if (loading) return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-2 sm:p-4">
      <p className="text-gray-500">Loading...</p>
    </main>
  );

  if (!guard) return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center flex-col gap-4 p-2 sm:p-4">
      <p className="text-gray-500">Employee not found.</p>
    </main>
  );

  const company = Array.isArray(guard.companies) ? guard.companies[0] : guard.companies;

  return (
    <main className="min-h-screen bg-white sm:bg-gray-50 flex items-center justify-center p-2 sm:p-4" style={{ colorScheme: 'light' }}>
      {/* 1. Moved logo up on mobile by changing pt-3 to pt-1 */}
      <div className="bg-white rounded-2xl shadow-lg pt-1 px-5 pb-5 w-full max-w-sm">

        {/* Company logo */}
        {company?.logo_url && (
          /* 2. Increased bottom space from mb-2 to mb-6 */
          <div className="flex justify-center mb-6">
            <img
              src={company.logo_url}
              alt={company.name}
              style={{ height: '60px', objectFit: 'contain' }}
            />
          </div>
        )}

        {/* Guard photo and info */}
        <div className="text-center mb-4">
          {/* 3. Added border and shadow to make the photo pop off the white page background */}
          <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden bg-gray-100 flex items-center justify-center border-4 border-gray-100 shadow-sm">
            {guard.photo_url ? (
              <img
                src={guard.photo_url}
                alt={`${guard.first_name} ${guard.last_name}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-4xl text-gray-400 font-bold">
                {guard.first_name[0]}{guard.last_name[0]}
              </span>
            )}
          </div>
          
          <h1 className="text-2xl font-bold text-gray-800 mb-1">
            {guard.first_name} {guard.last_name}
          </h1>
          
          {/* 4. Polished visual hierarchy for Company and Job Title */}
          <p className="text-gray-600 font-medium text-sm">{company?.name}</p>
          {guard.job_title && (
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mt-0.5">{guard.job_title}</p>
          )}
        </div>

        {/* Amount selection */}
        <p className="text-center text-gray-600 font-medium mb-3">Show your appreciation.</p>
        <div className="grid grid-cols-2 gap-3 mb-4">
          {amounts.map((amount) => (
            <button
              key={amount}
              onClick={() => { setSelectedAmount(amount); setCustomAmount(''); }}
              /* 5. Added transition and scale interaction (active:scale-[0.98]) */
              className={`rounded-xl py-3 font-bold text-lg transition-all duration-150 active:scale-[0.98] border-2 ${
                selectedAmount === amount && !customAmount
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white'
              }`}
            >
              R{amount}
            </button>
          ))}
        </div>

        {/* 6. Customized Input wrapper with stationary currency prefix */}
        <div className="relative mb-3">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-lg pointer-events-none">
            R
          </span>
          <input
            type="number"
            placeholder="Custom amount"
            value={customAmount}
            onChange={(e) => { setCustomAmount(e.target.value); setSelectedAmount(0); }}
            className="w-full border-2 border-gray-200 rounded-xl py-3 pl-10 pr-4 text-left text-lg focus:outline-none focus:border-blue-500 placeholder-gray-400 font-semibold transition-all duration-150"
          />
        </div>

        {paymentError && (
          <p className="text-red-500 text-sm text-center mb-4">{paymentError}</p>
        )}

        {/* 7. Added transition and scale interaction to main action button */}
        <button
          onClick={handlePayment}
          disabled={!displayAmount || displayAmount <= 0 || processing}
          className="w-full bg-blue-500 text-white rounded-xl py-4 font-bold text-xl hover:bg-blue-600 transition-all duration-150 active:scale-[0.98] disabled:scale-100 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {processing ? 'Processing...' : displayAmount ? `Send R${displayAmount}` : 'Select an amount'}
        </button>

        {/* 8. Polished and highlighted secure badge banner */}
        <div className="mt-5 pt-4 border-t border-gray-100 text-center">
          <div className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-xs font-medium mb-3">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Secure Payment - Directly supports this employee.
          </div>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Powered by ScanTippr</p>
        </div>
      </div>
    </main>
  );
}