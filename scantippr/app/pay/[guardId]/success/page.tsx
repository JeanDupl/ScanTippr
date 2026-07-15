'use client';
import { useSearchParams, useParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { supabase } from '../../../../lib/supabase';

function SuccessContent() {
  const searchParams = useSearchParams();
  const params = useParams();
  const guardId = params.guardId as string;
  const reference = searchParams.get('reference');
  const status = searchParams.get('status');
  const cancelled = status === 'cancelled';

  const [guard, setGuard] = useState<{ first_name: string; last_name: string; companies: { name: string } } | null>(null);

  useEffect(() => {
    async function fetchGuard() {
      const { data } = await supabase
        .from('guards')
        .select('first_name, last_name, companies(name)')
        .eq('id', guardId)
        .maybeSingle();
      if (data) setGuard(data as any);
    }
    if (!cancelled) fetchGuard();
  }, [guardId, cancelled]);

  const company = guard?.companies as any;

  return (
    <main className="min-h-screen bg-white sm:bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm text-center">
        <div className={`w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center ${cancelled ? 'bg-red-100' : 'bg-green-100'}`}>
          <span className="text-4xl">{cancelled ? '❌' : '✅'}</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          {cancelled ? 'Payment cancelled' : 'Thank you!'}
        </h1>
        {!cancelled && guard && (
          <p className="text-gray-600 mb-1">
            Your appreciation was sent to <strong>{guard.first_name} {guard.last_name}</strong>
            {company?.name ? ` from ${company.name}` : ''}.
          </p>
        )}
        <p className="text-gray-500 mb-6">
          {cancelled
            ? 'Your payment was not completed.'
            : 'Your support makes a real difference.'}
        </p>
        {reference && !cancelled && (
          <p className="text-xs text-gray-400 mb-6">Reference: {reference}</p>
        )}
        <p className="text-gray-400 text-sm">Powered by ScanTippr • Secure payment</p>
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