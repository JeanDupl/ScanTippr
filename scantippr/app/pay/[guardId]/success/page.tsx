'use client';
import { useSearchParams, useParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { supabase } from '../../../../lib/supabase';
import { Check, X, Copy, CheckSquare, Lock } from 'lucide-react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const params = useParams();
  const guardId = params.guardId as string;
  const reference = searchParams.get('reference');
  const status = searchParams.get('status');
  const cancelled = status === 'cancelled';

  const [copied, setCopied] = useState(false);
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

  // Truncate reference for beautiful UI display (e.g., TIP-1388ef51)
  const displayReference = reference 
    ? (reference.length > 12 ? reference.slice(0, 12) : reference) 
    : '';

  const handleCopy = () => {
    if (reference) {
      navigator.clipboard.writeText(reference);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f1f5f9', padding: '1rem', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '24px',
        padding: '2.5rem 2rem',
        maxWidth: '420px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        border: '1px solid #e2e8f0'
      }}>
        
        {/* Status Icon Indicator */}
        <div style={{
          width: '72px',
          height: '72px',
          background: cancelled ? '#fef2f2' : '#e6fbf2',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem',
          border: cancelled ? '2px solid #fecaca' : '2px solid #a7f3d0'
        }}>
          {cancelled ? (
            <X size={36} color="#ef4444" strokeWidth={3} />
          ) : (
            <Check size={36} color="#10b981" strokeWidth={3} />
          )}
        </div>

        {/* Dynamic Header */}
        <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#1a3a5c', margin: '0 0 1rem', letterSpacing: '-0.5px' }}>
          {cancelled ? 'Payment cancelled' : 'Thank you!'}
        </h2>

        {/* Dynamic Detail Text */}
        {cancelled ? (
          <p style={{ fontSize: '16px', color: '#64748b', lineHeight: '1.6', margin: '0 0 2rem' }}>
            Your transaction was not completed. No funds were transferred.
          </p>
        ) : (
          <>
            {guard && (
              <p style={{ fontSize: '16px', color: '#4a6070', lineHeight: '1.6', margin: '0 0 1.5rem' }}>
                Your appreciation was sent to <strong style={{ color: '#1a2b3c', fontWeight: 700 }}>{guard.first_name} {guard.last_name}</strong>
                {company?.name ? <> <br />from <span style={{ color: '#185fa5', fontWeight: 600 }}>{company.name}</span></> : ''}.
              </p>
            )}
            
            {/* Brand Slogan Integration */}
            <p style={{ fontSize: '15px', color: '#10b981', fontWeight: 600, margin: '0 0 2rem', background: '#f0fdf4', padding: '8px 16px', borderRadius: '30px', display: 'inline-block' }}>
              Your cashless appreciation makes a real impact.
            </p>
          </>
        )}

        {/* Copyable Reference Box (Hidden if payment is cancelled or no ref exists) */}
        {reference && !cancelled && (
          <div style={{ 
            background: '#f8fafc', 
            borderRadius: '12px', 
            padding: '10px 14px', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            border: '1px solid #e2e8f0',
            marginBottom: '2rem'
          }}>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>
              Ref: <span style={{ fontFamily: 'monospace', fontSize: '13px', color: '#334155', fontWeight: 600 }}>{displayReference}</span>
            </span>
            <button 
              onClick={handleCopy}
              style={{ 
                background: 'none', 
                border: 'none', 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                color: copied ? '#10b981' : '#94a3b8',
                transition: 'color 0.2s'
              }}
              title="Copy full reference"
            >
              {copied ? <CheckSquare size={16} /> : <Copy size={16} />}
            </button>
          </div>
        )}

        {/* Security / Compliance Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', borderTop: '1px solid #f1f5f9', paddingTop: '1.25rem' }}>
          <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 500 }}>Powered by</span>
          <span style={{ fontSize: '13px', fontWeight: 800, color: '#1a3a5c', letterSpacing: '-0.3px' }}>Scan<span style={{ color: '#185fa5' }}>Tippr</span></span>
          <span style={{ color: '#cbd5e1', fontSize: '12px' }}>•</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#64748b' }}>
            <Lock size={12} color="#64748b" />
            <span style={{ fontSize: '12px', fontWeight: 500 }}>Secure Payment</span>
          </div>
        </div>

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