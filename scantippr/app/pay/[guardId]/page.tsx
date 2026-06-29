'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';

interface Guard {
  first_name: string;
  last_name: string;
  companies: { name: string };
}

export default function PayPage({ params }: { params: { guardId: string } }) {
  const [guard, setGuard] = useState<Guard | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAmount, setSelectedAmount] = useState<number>(20);
  const [customAmount, setCustomAmount] = useState<string>('');

  const tipAmounts = [10, 20, 50, 100];
  const displayAmount = customAmount ? parseInt(customAmount) : selectedAmount;

  useEffect(() => {
    async function fetchGuard() {
      const { data, error } = await supabase
        .from('guards')
        .select('first_name, last_name, companies(name)')
        .eq('id', params.guardId)
        .eq('is_active', true)
        .single();

      if (error || !data) {
        setGuard(null);
      } else {
        setGuard(data as Guard);
      }
      setLoading(false);
    }
    fetchGuard();
  }, [params.guardId]);

  if (loading) return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-500">Loading...</p>
    </main>
  );

  if (!guard) return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-500">Guard not found.</p>
    </main>
  );

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">

        {/* Guard Profile */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto mb-4 flex items-center justify-center">
            <span className="text-4xl">👤</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">
            {guard.first_name} {guard.last_name}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {guard.companies.name} • Car Guard
          </p>
        </div>

        {/* Tip Amounts */}
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

        {/* Custom Amount */}
        <input
          type="text"
          placeholder="Enter custom amount (R)"
          value={customAmount}
          onChange={(e) => { setCustomAmount(e.target.value); setSelectedAmount(0); }}
          className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 text-center text-lg mb-6 focus:outline-none focus:border-blue-500 placeholder-gray-400 text-gray-800 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />

        {/* Pay Button */}
        <button className="w-full bg-blue-500 text-white rounded-xl py-4 font-bold text-xl hover:bg-blue-600 transition-colors">
          {displayAmount ? `Tip R${displayAmount}` : 'Select an amount'}
        </button>

        {/* Footer */}
        <p className="text-center text-gray-400 text-xs mt-6">
          Powered by ScanTippr • Secure payment
        </p>

      </div>
    </main>
  );
}