'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { use } from 'react';

interface Guard {
  first_name: string;
  last_name: string;
  companies: { name: string } | { name: string }[];
}

export default function PayPage({ params }: { params: Promise<{ guardId: string }> }) {
  const { guardId } = use(params);
  const [guard, setGuard] = useState<Guard | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAmount, setSelectedAmount] = useState<number>(20);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [processing, setProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const tipAmounts = [10, 20, 50, 100];
  const displayAmount = customAmount ? parseInt(customAmount) : selectedAmount;

  useEffect(() => {
    async function fetchGuard() {
      const { data, error } = await supabase
        .from('guards')
        .select('first_name, last_name, companies(name)')
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

  async function handleTip() {
    console.log('handleTip called, displayAmount:', displayAmount);
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

      // Redirect to Paystack's hosted checkout
      window.location.href = data.authorization_url;
    } catch (err) {
      setPaymentError('Could not connect to payment service. Please try again.');
      setProcessing(false);
    }
  }

  if (loading) return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-500">Loading...</p>
    </main>
  );

  if (!guard) return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center flex-col gap-4 p-4">
      <p className="text-gray-500">Guard not found.</p>
      <p className="text-xs text-gray-400">Guard ID: {guardId}</p>
    </main>
  );

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto mb-4 flex items-center justify-center">
            <span className="text-4xl">👤</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">
            {guard.first_name} {guard.last_name}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {Array.isArray(guard.companies) ? guard.companies[0]?.name : guard.companies.name} • Car Guard
          </p>
        </div>
        <p className="text-center text-gray-600 font-medium mb-4">Choose a tip amount</p>
        <div className="grid grid-cols-2 gap-3 mb-4">
          {tipAmounts.map((amount) => (
            <button
              key={amount}
              onClick={() => { setSelectedAmount(amount); setCustomAmount(''); }}
              className={`rounded-xl py-3 font-bold text-lg transition-colors border-2 ${
                selectedAmount === amount && !customAmount
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white'
              }`}
            >
              R{amount}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Enter custom amount (R)"
          value={customAmount}
          onChange={(e) => { setCustomAmount(e.target.value); setSelectedAmount(0); }}
          className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 text-center text-lg mb-6 focus:outline-none focus:border-blue-500 placeholder-gray-400"
        />
        {paymentError && (
          <p className="text-red-500 text-sm text-center mb-4">{paymentError}</p>
        )}
        <button
          onClick={() => alert('button works')}
          disabled={!displayAmount || displayAmount <= 0 || processing}
          className="w-full bg-blue-500 text-white rounded-xl py-4 font-bold text-xl hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {processing ? 'Processing...' : displayAmount ? `Tip R${displayAmount}` : 'Select an amount'}
        </button>
        <p className="text-center text-gray-400 text-xs mt-6">
          Powered by ScanTippr • Secure payment
        </p>
      </div>
    </main>
  );
}