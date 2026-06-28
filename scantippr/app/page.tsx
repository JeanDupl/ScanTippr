'use client';
import { useState } from 'react';

export default function Home() {
  const [selectedAmount, setSelectedAmount] = useState<number>(20);
  const [customAmount, setCustomAmount] = useState<string>('');

  const tipAmounts = [10, 20, 50, 100];
  const displayAmount = customAmount ? parseInt(customAmount) : selectedAmount;

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">

        {/* Guard Profile */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto mb-4 flex items-center justify-center">
            <span className="text-4xl">👤</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">John Smith</h1>
          <p className="text-gray-500 text-sm mt-1">ABC Security • Car Guard</p>
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
          type="number"
          placeholder="Enter custom amount (R)"
          value={customAmount}
          onChange={(e) => { setCustomAmount(e.target.value); setSelectedAmount(0); }}
          className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 text-center text-lg mb-6 focus:outline-none focus:border-blue-500 placeholder-gray-400"
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