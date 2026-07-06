export default function Home() {
  return (
    <main style={{ fontFamily: 'sans-serif', color: '#1a2b3c', background: '#fff' }}>

      {/* Nav */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 2rem', borderBottom: '1px solid #e0e8f0', position: 'sticky', top: 0, background: '#fff', zIndex: 50 }}>
        <span style={{ fontSize: '20px', fontWeight: 700, color: '#1a3a5c' }}>ScanTippr</span>
        <div style={{ display: 'flex', gap: '12px' }}>
          <a href="mailto:info@scantippr.co.za" style={{ padding: '10px 20px', fontSize: '14px', borderRadius: '8px', border: '1px solid #1a3a5c', color: '#1a3a5c', textDecoration: 'none', fontWeight: 500 }}>Contact sales</a>
          <a href="mailto:info@scantippr.co.za?subject=Demo Request" style={{ padding: '10px 20px', fontSize: '14px', borderRadius: '8px', background: '#1a3a5c', color: '#fff', textDecoration: 'none', fontWeight: 500 }}>Request a demo</a>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth: '760px', margin: '0 auto', padding: '5rem 2rem 4rem', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', background: '#e6f1fb', color: '#185fa5', fontSize: '13px', padding: '4px 14px', borderRadius: '20px', marginBottom: '1.5rem', fontWeight: 500 }}>Built for South African businesses</div>
        <h1 style={{ fontSize: '42px', fontWeight: 700, color: '#1a2b3c', margin: '0 0 1.25rem', lineHeight: 1.15 }}>Turn everyday appreciation<br />into digital payments</h1>
        <p style={{ fontSize: '18px', color: '#4a6070', margin: '0 auto 1.5rem', lineHeight: 1.7, maxWidth: '580px' }}>ScanTippr helps security companies, fuel stations, and other customer-facing businesses enable secure cashless appreciation for frontline employees using unique QR codes. Simple for customers. Easy for businesses.</p>
        <p style={{ fontSize: '15px', color: '#6b7f90', margin: '0 auto 2.5rem', lineHeight: 1.7, maxWidth: '520px', fontStyle: 'italic' }}>Every day, customers want to show appreciation for exceptional service — but many no longer carry cash. ScanTippr helps businesses bridge that gap with a secure, digital solution that's simple for customers and easy to manage.</p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <a href="mailto:info@scantippr.co.za?subject=Demo Request" style={{ padding: '14px 28px', fontSize: '16px', borderRadius: '8px', background: '#1a3a5c', color: '#fff', textDecoration: 'none', fontWeight: 600 }}>Request a demo</a>
          <a href="mailto:info@scantippr.co.za" style={{ padding: '14px 28px', fontSize: '16px', borderRadius: '8px', border: '1px solid #1a3a5c', color: '#1a3a5c', textDecoration: 'none', fontWeight: 500 }}>Contact sales</a>
        </div>
      </section>

      {/* Social proof bar */}
      <section style={{ background: '#f5f7fa', borderTop: '1px solid #e0e8f0', borderBottom: '1px solid #e0e8f0', padding: '1.5rem 2rem' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto', display: 'flex', justifyContent: 'center', gap: '2.5rem', flexWrap: 'wrap' }}>
          {['QR code technology', 'Secure online payments', 'Mobile friendly', 'Cloud based', 'Instant reporting'].map((item) => (
            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#1a3a5c', fontWeight: 500 }}>
              <span style={{ color: '#1d9e75', fontWeight: 700 }}>✓</span> {item}
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ maxWidth: '760px', margin: '0 auto', padding: '5rem 2rem' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#1a2b3c', textAlign: 'center', marginBottom: '0.75rem' }}>How it works</h2>
        <p style={{ textAlign: 'center', color: '#6b7f90', fontSize: '16px', marginBottom: '3rem' }}>Three simple steps to get your team set up.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          {[
            { num: '1', title: 'Create your team', body: 'Add your employees and generate a unique QR code for each one in minutes.' },
            { num: '2', title: 'Print the QR cards', body: 'Attach cards to uniforms or lanyards. Customers simply scan to pay.' },
            { num: '3', title: 'Receive payments', body: 'Customers choose an amount and pay securely. Every transaction is tracked automatically.' },
          ].map((step) => (
            <div key={step.num} style={{ background: '#f5f7fa', borderRadius: '12px', padding: '1.75rem', border: '1px solid #e0e8f0' }}>
              <div style={{ width: '36px', height: '36px', background: '#1a3a5c', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', color: '#fff', fontWeight: 700, fontSize: '16px' }}>{step.num}</div>
              <p style={{ fontWeight: 600, fontSize: '15px', color: '#1a2b3c', margin: '0 0 8px' }}>{step.title}</p>
              <p style={{ fontSize: '14px', color: '#6b7f90', margin: 0, lineHeight: 1.6 }}>{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Industries */}
      <section style={{ background: '#f5f7fa', borderTop: '1px solid #e0e8f0', borderBottom: '1px solid #e0e8f0', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#1a2b3c', textAlign: 'center', marginBottom: '0.75rem' }}>Built for every customer-facing business</h2>
          <p style={{ textAlign: 'center', color: '#6b7f90', fontSize: '16px', marginBottom: '3rem' }}>ScanTippr works for any business with frontline employees.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
            {[
              { icon: '🛡', label: 'Security companies', featured: true },
              { icon: '⛽', label: 'Fuel stations', featured: true },
              { icon: '🍽', label: 'Restaurants' },
              { icon: '🚗', label: 'Car washes' },
              { icon: '🏨', label: 'Hospitality' },
              { icon: '🛒', label: 'Retail' },
              { icon: '✈', label: 'Airports' },
              { icon: '🚚', label: 'Logistics' },
            ].map((ind) => (
              <div key={ind.label} style={{ background: ind.featured ? '#1a3a5c' : '#fff', borderRadius: '12px', padding: '1.25rem', border: ind.featured ? 'none' : '1px solid #e0e8f0', textAlign: 'center' }}>
                <div style={{ fontSize: '28px', marginBottom: '8px' }}>{ind.icon}</div>
                <p style={{ fontSize: '13px', fontWeight: 600, color: ind.featured ? '#fff' : '#1a2b3c', margin: 0 }}>{ind.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why ScanTippr */}
      <section style={{ maxWidth: '760px', margin: '0 auto', padding: '5rem 2rem' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#1a2b3c', textAlign: 'center', marginBottom: '0.75rem' }}>Why businesses choose ScanTippr</h2>
        <p style={{ textAlign: 'center', color: '#6b7f90', fontSize: '16px', marginBottom: '3rem' }}>Real benefits for your business and your team.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
          {[
            { title: 'Increase employee motivation', body: 'Give employees a modern, dignified way to receive cashless appreciation from customers.' },
            { title: 'Improve customer experience', body: 'Customers no longer need cash. A quick scan is all it takes to show appreciation.' },
            { title: 'Complete visibility', body: 'Track every appreciation payment in real time. Full reporting per employee and per location.' },
            { title: 'Easy setup', body: 'Generate QR codes in minutes. No hardware required. No technical knowledge needed.' },
          ].map((item) => (
            <div key={item.title} style={{ background: '#f5f7fa', borderRadius: '12px', padding: '1.75rem', border: '1px solid #e0e8f0' }}>
              <p style={{ fontWeight: 600, fontSize: '15px', color: '#1a2b3c', margin: '0 0 8px' }}>✓ {item.title}</p>
              <p style={{ fontSize: '14px', color: '#6b7f90', margin: 0, lineHeight: 1.6 }}>{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* See it in action */}
      <section style={{ background: '#f5f7fa', borderTop: '1px solid #e0e8f0', borderBottom: '1px solid #e0e8f0', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#1a2b3c', marginBottom: '0.75rem' }}>See ScanTippr in action</h2>
          <p style={{ color: '#6b7f90', fontSize: '16px', marginBottom: '3rem' }}>A seamless experience for customers and businesses alike.</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0', flexWrap: 'wrap' }}>
            {[
              { icon: '📱', label: 'Customer scans QR code' },
              { icon: '💳', label: 'Chooses amount and pays' },
              { icon: '✅', label: 'Payment confirmed instantly' },
              { icon: '📊', label: 'Dashboard updates in real time' },
            ].map((step, i) => (
              <div key={step.label} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ textAlign: 'center', padding: '1rem' }}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>{step.icon}</div>
                  <p style={{ fontSize: '13px', color: '#1a2b3c', fontWeight: 500, margin: 0, maxWidth: '100px' }}>{step.label}</p>
                </div>
                {i < 3 && <div style={{ color: '#1a3a5c', fontSize: '20px', fontWeight: 700, padding: '0 4px' }}>→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section style={{ maxWidth: '760px', margin: '0 auto', padding: '5rem 2rem' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#1a2b3c', textAlign: 'center', marginBottom: '0.75rem' }}>Secure and trusted</h2>
        <p style={{ textAlign: 'center', color: '#6b7f90', fontSize: '16px', marginBottom: '3rem' }}>Payments processed through trusted South African payment providers.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
          {[
            { icon: '🔒', label: 'Secure checkout' },
            { icon: '⚡', label: 'Instant confirmation' },
            { icon: '📵', label: 'No cash required' },
            { icon: '📱', label: 'Mobile friendly' },
          ].map((item) => (
            <div key={item.label} style={{ background: '#f5f7fa', borderRadius: '12px', padding: '1.25rem', border: '1px solid #e0e8f0', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>{item.icon}</div>
              <p style={{ fontSize: '13px', fontWeight: 600, color: '#1a2b3c', margin: 0 }}>{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: '#f5f7fa', borderTop: '1px solid #e0e8f0', borderBottom: '1px solid #e0e8f0', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#1a2b3c', textAlign: 'center', marginBottom: '3rem' }}>Frequently asked questions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { q: 'Do customers need an app?', a: 'No. Customers simply scan the QR code with their phone camera. No app download required.' },
              { q: 'Who receives the money?', a: 'Payments are made directly to your business\'s registered merchant account. ScanTippr does not hold customer funds.' },
              { q: 'Does ScanTippr hold any funds?', a: 'No. ScanTippr is a software platform. All payments go directly to the registered business bank account.' },
              { q: 'How long does setup take?', a: 'Most businesses are set up and ready within a day. Our team will guide you through the process.' },
              { q: 'Can we add unlimited employees?', a: 'Yes. You can add as many employees as your business requires.' },
              { q: 'Which industries does ScanTippr support?', a: 'ScanTippr works for any customer-facing business — security companies, fuel stations, restaurants, car washes, hospitality, retail, and more.' },
            ].map((faq) => (
              <div key={faq.q} style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', border: '1px solid #e0e8f0' }}>
                <p style={{ fontWeight: 600, fontSize: '15px', color: '#1a2b3c', margin: '0 0 8px' }}>{faq.q}</p>
                <p style={{ fontSize: '14px', color: '#6b7f90', margin: 0, lineHeight: 1.6 }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: '#1a3a5c', padding: '5rem 2rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '32px', fontWeight: 700, color: '#fff', margin: '0 0 1rem' }}>Ready to modernise employee appreciation?</h2>
        <p style={{ fontSize: '16px', color: '#7ab3d9', margin: '0 0 2rem' }}>See how ScanTippr can work for your business.</p>
        <a href="mailto:info@scantippr.co.za?subject=Demo Request" style={{ padding: '14px 32px', fontSize: '16px', borderRadius: '8px', background: '#fff', color: '#1a3a5c', textDecoration: 'none', fontWeight: 700 }}>Request a demo</a>
      </section>

      {/* Footer */}
      <footer style={{ background: '#111e29', padding: '2rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <span style={{ fontSize: '14px', color: '#4a6070' }}>© 2026 ScanTippr. All rights reserved.</span>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {['Privacy policy', 'Terms', 'Contact', 'Support'].map((link) => (
              <a key={link} href={`mailto:info@scantippr.co.za`} style={{ fontSize: '13px', color: '#4a6070', textDecoration: 'none' }}>{link}</a>
            ))}
          </div>
        </div>
      </footer>

    </main>
  )
}