'use client';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get('reference');

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
          <span className="text-4xl">✅</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Thank you!</h1>
        <p className="text-gray-500 mb-6">Your tip has been sent successfully.</p>
        {reference && (
          <p className="text-xs text-gray-400 mb-6">Reference: {reference}</p>
        )}
        <p className="text-gray-400 text-sm">
          Powered by ScanTippr • Secure payment
        </p>
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}