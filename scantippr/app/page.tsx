import { Shield, Fuel, UtensilsCrossed, Car, Hotel, ShoppingCart, Plane, Truck, QrCode, Users, BarChart3, Lock, CheckCircle, Zap, Smartphone, ArrowRight } from 'lucide-react'

export default function Home() {
  return (
    <>
      <style>{`
        .hero-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; }
        .three-col { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
        .two-col { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; }
        .four-col { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
        .nav-buttons { display: flex; gap: 12px; }
        .nav-secondary { display: inline-flex; }
        @media (max-width: 768px) {
        .hero-grid { grid-template-columns: 1fr; gap: 2rem; }
        .three-col { grid-template-columns: 1fr; }
        .two-col { grid-template-columns: 1fr; }
        .four-col { grid-template-columns: repeat(2, 1fr); }
        .nav-secondary { display: none; }
        .nav-buttons { gap: 8px; }
        .hero-buttons { flex-direction: column; }
        .hero-buttons a { text-align: center; }
}
      `}</style>
      <main style={{ fontFamily: 'sans-serif', color: '#1a2b3c', background: '#fff' }}>

        {/* Nav */}
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 2rem', borderBottom: '1px solid #e0e8f0', position: 'sticky', top: 0, background: '#fff', zIndex: 50 }}>
          <span style={{ fontSize: '20px', fontWeight: 700, color: '#1a3a5c' }}>ScanTippr</span>
          <div className="nav-buttons">
            <a href="mailto:info@scantippr.co.za" className="nav-secondary" style={{ padding: '10px 20px', fontSize: '14px', borderRadius: '8px', border: '1px solid #1a3a5c', color: '#1a3a5c', textDecoration: 'none', fontWeight: 500 }}>Contact sales</a>
            <a href="mailto:info@scantippr.co.za?subject=Demo Request" style={{ padding: '10px 20px', fontSize: '14px', borderRadius: '8px', background: '#1a3a5c', color: '#fff', textDecoration: 'none', fontWeight: 500 }}>Request a demo</a>
          </div>
        </nav>

        {/* Hero - Two column */}
        <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '4rem 2rem' }} className="hero-grid">
          <div>
            <div style={{ display: 'inline-block', background: '#e6f1fb', color: '#185fa5', fontSize: '13px', padding: '4px 14px', borderRadius: '20px', marginBottom: '1.5rem', fontWeight: 500 }}>Built for South African businesses</div>
            <h1 style={{ fontSize: '40px', fontWeight: 700, color: '#1a2b3c', margin: '0 0 1.25rem', lineHeight: 1.15 }}>Turn everyday appreciation into digital payments</h1>
            <p style={{ fontSize: '17px', color: '#4a6070', margin: '0 0 1rem', lineHeight: 1.7 }}>ScanTippr helps security companies, fuel stations, and other customer-facing businesses enable secure cashless appreciation for frontline employees using unique QR codes.</p>
            <p style={{ fontSize: '15px', color: '#6b7f90', margin: '0 0 2rem', lineHeight: 1.7, fontStyle: 'italic' }}>Every day, customers want to show appreciation for exceptional service — but many no longer carry cash. ScanTippr bridges that gap.</p>
            <div className="hero-buttons" style={{ display: 'flex', gap: '12px' }}>
              <a href="mailto:info@scantippr.co.za?subject=Demo Request" style={{ padding: '14px 28px', fontSize: '15px', borderRadius: '8px', background: '#1a3a5c', color: '#fff', textDecoration: 'none', fontWeight: 600 }}>Request a demo</a>
              <a href="mailto:info@scantippr.co.za" style={{ padding: '14px 28px', fontSize: '15px', borderRadius: '8px', border: '1px solid #1a3a5c', color: '#1a3a5c', textDecoration: 'none', fontWeight: 500 }}>Contact sales</a>
            </div>
          </div>

          {/* Dashboard mockup */}
          <div style={{ background: '#f5f7fa', borderRadius: '16px', border: '1px solid #e0e8f0', padding: '1.5rem', boxShadow: '0 8px 32px rgba(26,58,92,0.10)' }}>
            <div style={{ background: '#1a3a5c', borderRadius: '10px', padding: '1rem 1.25rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#fff', fontWeight: 700, fontSize: '15px' }}>ScanTippr Admin</span>
              <div style={{ display: 'flex', gap: '6px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f57' }}></div>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#febc2e' }}></div>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#28c840' }}></div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '1rem' }}>
              {[{ label: 'Total employees', value: '24' }, { label: 'This month', value: 'R4,820' }, { label: 'Companies', value: '3' }, { label: 'Transactions', value: '142' }].map((stat) => (
                <div key={stat.label} style={{ background: '#fff', borderRadius: '8px', padding: '0.75rem 1rem', border: '1px solid #e0e8f0' }}>
                  <p style={{ fontSize: '11px', color: '#6b7f90', margin: '0 0 4px' }}>{stat.label}</p>
                  <p style={{ fontSize: '18px', fontWeight: 700, color: '#1a3a5c', margin: 0 }}>{stat.value}</p>
                </div>
              ))}
            </div>
            <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #e0e8f0', overflow: 'hidden' }}>
              <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #e0e8f0', fontSize: '12px', fontWeight: 600, color: '#1a2b3c' }}>Recent transactions</div>
              {[{ name: 'John Smith', company: 'ABC Security', amount: 'R20' }, { name: 'Sipho Ndlovu', company: 'Engen Bryanston', amount: 'R10' }, { name: 'Amanda Mokoena', company: 'Spur Sandton', amount: 'R50' }].map((tx) => (
                <div key={tx.name} style={{ padding: '0.6rem 1rem', borderBottom: '1px solid #f0f4f8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontSize: '12px', fontWeight: 600, color: '#1a2b3c', margin: 0 }}>{tx.name}</p>
                    <p style={{ fontSize: '11px', color: '#6b7f90', margin: 0 }}>{tx.company}</p>
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#1d9e75' }}>{tx.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Social proof bar */}
        <section style={{ background: '#f5f7fa', borderTop: '1px solid #e0e8f0', borderBottom: '1px solid #e0e8f0', padding: '1.5rem 2rem' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'center', gap: '2.5rem', flexWrap: 'wrap' }}>
            {['QR code technology', 'Secure online payments', 'Mobile friendly', 'Cloud based', 'Instant reporting'].map((item) => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#1a3a5c', fontWeight: 500 }}>
                <CheckCircle size={16} color="#1d9e75" /> {item}
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '5rem 2rem' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#1a2b3c', textAlign: 'center', marginBottom: '0.75rem' }}>How it works</h2>
          <p style={{ textAlign: 'center', color: '#6b7f90', fontSize: '16px', marginBottom: '3rem' }}>Three simple steps to get your team set up.</p>
          <div className="three-col">
            {[
              { num: '1', icon: <Users size={20} color="#fff" />, title: 'Create your team', body: 'Add your employees and generate a unique QR code for each one in minutes.' },
              { num: '2', icon: <QrCode size={20} color="#fff" />, title: 'Print the QR cards', body: 'Attach cards to uniforms or lanyards. Customers simply scan to pay.' },
              { num: '3', icon: <BarChart3 size={20} color="#fff" />, title: 'Receive payments', body: 'Customers choose an amount and pay securely. Every transaction is tracked automatically.' },
            ].map((step) => (
              <div key={step.num} style={{ background: '#f5f7fa', borderRadius: '12px', padding: '1.75rem', border: '1px solid #e0e8f0' }}>
                <div style={{ width: '40px', height: '40px', background: '#1a3a5c', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>{step.icon}</div>
                <p style={{ fontWeight: 600, fontSize: '15px', color: '#1a2b3c', margin: '0 0 8px' }}>{step.title}</p>
                <p style={{ fontSize: '14px', color: '#6b7f90', margin: 0, lineHeight: 1.6 }}>{step.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Industries */}
        <section style={{ background: '#f5f7fa', borderTop: '1px solid #e0e8f0', borderBottom: '1px solid #e0e8f0', padding: '5rem 2rem' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#1a2b3c', textAlign: 'center', marginBottom: '0.75rem' }}>Built for every customer-facing business</h2>
            <p style={{ textAlign: 'center', color: '#6b7f90', fontSize: '16px', marginBottom: '3rem' }}>ScanTippr works for any business with frontline employees.</p>
            <div className="four-col">
              {[
                { icon: <Shield size={28} color="#fff" />, label: 'Security companies', featured: true },
                { icon: <Fuel size={28} color="#fff" />, label: 'Fuel stations', featured: true },
                { icon: <UtensilsCrossed size={28} color="#1a3a5c" />, label: 'Restaurants' },
                { icon: <Car size={28} color="#1a3a5c" />, label: 'Car washes' },
                { icon: <Hotel size={28} color="#1a3a5c" />, label: 'Hospitality' },
                { icon: <ShoppingCart size={28} color="#1a3a5c" />, label: 'Retail' },
                { icon: <Plane size={28} color="#1a3a5c" />, label: 'Airports' },
                { icon: <Truck size={28} color="#1a3a5c" />, label: 'Logistics' },
              ].map((ind) => (
                <div key={ind.label} style={{ background: ind.featured ? '#1a3a5c' : '#fff', borderRadius: '12px', padding: '1.5rem', border: ind.featured ? 'none' : '1px solid #e0e8f0', textAlign: 'center' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>{ind.icon}</div>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: ind.featured ? '#fff' : '#1a2b3c', margin: 0 }}>{ind.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why ScanTippr */}
        <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '5rem 2rem' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#1a2b3c', textAlign: 'center', marginBottom: '0.75rem' }}>Why businesses choose ScanTippr</h2>
          <p style={{ textAlign: 'center', color: '#6b7f90', fontSize: '16px', marginBottom: '3rem' }}>Real benefits for your business and your team.</p>
          <div className="two-col">
            {[
              { icon: <Users size={20} color="#1a3a5c" />, title: 'Increase employee motivation', body: 'Give employees a modern, dignified way to receive cashless appreciation from customers.' },
              { icon: <Smartphone size={20} color="#1a3a5c" />, title: 'Improve customer experience', body: 'Customers no longer need cash. A quick scan is all it takes to show appreciation.' },
              { icon: <BarChart3 size={20} color="#1a3a5c" />, title: 'Complete visibility', body: 'Track every appreciation payment in real time. Full reporting per employee and per location.' },
              { icon: <Zap size={20} color="#1a3a5c" />, title: 'Easy setup', body: 'Generate QR codes in minutes. No hardware required. No technical knowledge needed.' },
            ].map((item) => (
              <div key={item.title} style={{ background: '#f5f7fa', borderRadius: '12px', padding: '1.75rem', border: '1px solid #e0e8f0', display: 'flex', gap: '1rem' }}>
                <div style={{ width: '40px', height: '40px', background: '#e6f1fb', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{item.icon}</div>
                <div>
                  <p style={{ fontWeight: 600, fontSize: '15px', color: '#1a2b3c', margin: '0 0 8px' }}>{item.title}</p>
                  <p style={{ fontSize: '14px', color: '#6b7f90', margin: 0, lineHeight: 1.6 }}>{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* See it in action */}
        <section style={{ background: '#f5f7fa', borderTop: '1px solid #e0e8f0', borderBottom: '1px solid #e0e8f0', padding: '5rem 2rem' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#1a2b3c', marginBottom: '0.75rem' }}>See ScanTippr in action</h2>
            <p style={{ color: '#6b7f90', fontSize: '16px', marginBottom: '3rem' }}>A seamless experience for customers and businesses alike.</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
              {[
                { icon: <Smartphone size={28} color="#1a3a5c" />, label: 'Customer scans QR code' },
                { icon: <QrCode size={28} color="#1a3a5c" />, label: 'Chooses amount and pays' },
                { icon: <CheckCircle size={28} color="#1d9e75" />, label: 'Payment confirmed instantly' },
                { icon: <BarChart3 size={28} color="#1a3a5c" />, label: 'Dashboard updates in real time' },
              ].map((step, i) => (
                <div key={step.label} style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ textAlign: 'center', padding: '1rem 1.5rem' }}>
                    <div style={{ width: '60px', height: '60px', background: '#fff', borderRadius: '16px', border: '1px solid #e0e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>{step.icon}</div>
                    <p style={{ fontSize: '13px', color: '#1a2b3c', fontWeight: 500, margin: 0, maxWidth: '110px' }}>{step.label}</p>
                  </div>
                  {i < 3 && <ArrowRight size={20} color="#b0bec5" />}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust */}
        <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '5rem 2rem' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#1a2b3c', textAlign: 'center', marginBottom: '0.75rem' }}>Secure and trusted</h2>
          <p style={{ textAlign: 'center', color: '#6b7f90', fontSize: '16px', marginBottom: '3rem' }}>Payments processed through trusted South African payment providers.</p>
          <div className="four-col">
            {[
              { icon: <Lock size={24} color="#1a3a5c" />, label: 'Secure checkout' },
              { icon: <Zap size={24} color="#1a3a5c" />, label: 'Instant confirmation' },
              { icon: <QrCode size={24} color="#1a3a5c" />, label: 'No cash required' },
              { icon: <Smartphone size={24} color="#1a3a5c" />, label: 'Mobile friendly' },
            ].map((item) => (
              <div key={item.label} style={{ background: '#f5f7fa', borderRadius: '12px', padding: '1.5rem', border: '1px solid #e0e8f0', textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>{item.icon}</div>
                <p style={{ fontSize: '13px', fontWeight: 600, color: '#1a2b3c', margin: 0 }}>{item.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section style={{ background: '#f5f7fa', borderTop: '1px solid #e0e8f0', borderBottom: '1px solid #e0e8f0', padding: '5rem 2rem' }}>
          <div style={{ maxWidth: '760px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#1a2b3c', textAlign: 'center', marginBottom: '3rem' }}>Frequently asked questions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { q: 'Do customers need an app?', a: 'No. Customers simply scan the QR code with their phone camera. No app download required.' },
                { q: 'Who receives the money?', a: "Payments are made directly to your business's registered merchant account. ScanTippr does not hold customer funds." },
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
        <footer style={{ background: '#111e29', padding: '2rem' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <span style={{ fontSize: '14px', color: '#4a6070' }}>© 2026 ScanTippr. All rights reserved.</span>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              {['Privacy policy', 'Terms', 'Contact', 'Support'].map((link) => (
                <a key={link} href="mailto:info@scantippr.co.za" style={{ fontSize: '13px', color: '#4a6070', textDecoration: 'none' }}>{link}</a>
              ))}
            </div>
          </div>
        </footer>

      </main>
    </>
  )
}