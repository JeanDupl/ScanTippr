import { Shield, Fuel, UtensilsCrossed, Car, Hotel, ShoppingCart, Plane, Truck, QrCode, Users, BarChart3, Lock, CheckCircle, Zap, Smartphone, ArrowRight } from 'lucide-react'
import Image from 'next/image'

export default function Home() {
  return (
    <>
      <style>{`
        /* --- Responsive CSS Grid System --- */
        .hero-grid { 
          display: grid; 
          grid-template-columns: 1.1fr 0.9fr; 
          gap: 4rem; 
          align-items: center; 
        }
        .three-col { 
          display: grid; 
          grid-template-columns: repeat(3, 1fr); 
          gap: 1.75rem; 
        }
        .two-col { 
          display: grid; 
          grid-template-columns: repeat(2, 1fr); 
          gap: 1.75rem; 
        }
        .four-col { 
          display: grid; 
          grid-template-columns: repeat(4, 1fr); 
          gap: 1.25rem; 
        }
        .nav-buttons { 
          display: flex; 
          gap: 12px; 
        }
        .nav-secondary { 
          display: inline-flex; 
        }

        /* --- Mobile Responsiveness Adjustments --- */
        @media (max-width: 968px) {
          .hero-grid { 
            grid-template-columns: 1fr; 
            gap: 3rem; 
            text-align: center;
          }
          .hero-buttons { 
            justify-content: center; 
          }
          .four-col { 
            grid-template-columns: repeat(2, 1fr); 
          }
        }

        @media (max-width: 768px) {
          .three-col { grid-template-columns: 1fr; }
          .two-col { grid-template-columns: 1fr; }
          .nav-secondary { display: none; }
          .hero-buttons { flex-direction: column; }
          .hero-buttons a { text-align: center; }
          .hero-badge { text-align: center; }
          
          /* Adjust "See in Action" flow for mobile */
          .flow-container {
            flex-direction: column;
            gap: 1.5rem;
          }
          .flow-arrow {
            transform: rotate(90deg);
            margin: 0.5rem 0;
          }
        }
      `}</style>

      <main style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: '#1a2b3c', background: '#fff' }}>

       {/* Navigation Bar */}
          <nav style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: '12px 16px', 
            borderBottom: '1px solid #1e293b', 
            position: 'sticky', 
            top: 0, 
            background: '#111e29', 
            zIndex: 50 
          }}>
            <a href="/" style={{ display: 'flex', alignItems: 'center', width: '130px', textDecoration: 'none' }}>
              <img 
                src="/logo-main" 
                alt="ScanTippr Logo" 
                style={{ 
                  width: '100%', 
                  height: 'auto', 
                  objectFit: 'contain' 
                }} 
              />
            </a>
            
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <a 
                href="mailto:info@scantippr.co.za?subject=Demo Request" 
                style={{ 
                  padding: '10px 16px', 
                  fontSize: '13px', 
                  borderRadius: '6px', 
                  background: '#1aa39a', 
                  color: '#fff', 
                  textDecoration: 'none', 
                  fontWeight: 600,
                  whiteSpace: 'nowrap'
                }}
              >
                Request a demo
              </a>
            </div>
          </nav>
        {/* Hero Section */}
        <section style={{ maxWidth: '1150px', margin: '0 auto', padding: '5rem 2rem' }} className="hero-grid">
          <div>
            <div className="hero-badge" style={{ marginBottom: '1.5rem' }}>
              <span style={{ display: 'inline-block', background: '#e6f6f5', color: '#1aa39a', fontSize: '13px', padding: '6px 16px', borderRadius: '20px', fontWeight: 600 }}>Built for South African businesses</span>
            </div>
            <h1 style={{ fontSize: '42px', fontWeight: 800, color: '#1a2b3c', margin: '0 0 1.25rem', lineHeight: 1.15, letterSpacing: '-0.02em' }}>
              Turn everyday appreciation into digital payments
            </h1>
            <p style={{ fontSize: '18px', color: '#4a6070', margin: '0 0 1rem', lineHeight: 1.7 }}>
              ScanTippr helps security companies, fuel stations, and other customer-facing businesses enable secure cashless appreciation for frontline employees using unique QR codes.
            </p>
            <p style={{ fontSize: '15px', color: '#708494', margin: '0 0 2.5rem', lineHeight: 1.7, fontStyle: 'italic' }}>
              Every day, customers want to show appreciation for exceptional service — but many no longer carry cash. ScanTippr bridges that gap.
            </p>
            <div className="hero-buttons" style={{ display: 'flex', gap: '14px' }}>
              <a href="mailto:info@scantippr.co.za?subject=Demo Request" style={{ padding: '14px 30px', fontSize: '15px', borderRadius: '8px', background: '#1a3a5c', color: '#fff', textDecoration: 'none', fontWeight: 600, boxShadow: '0 4px 12px rgba(26,58,92,0.15)' }}>Request a demo</a>
              <a href="mailto:info@scantippr.co.za" style={{ padding: '14px 30px', fontSize: '15px', borderRadius: '8px', border: '1px solid #1a3a5c', color: '#1a3a5c', textDecoration: 'none', fontWeight: 600 }}>Contact sales</a>
            </div>
          </div>

          {/* Interactive Live-Dashboard Mockup */}
          <div style={{ background: '#f8fafc', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '1.75rem', boxShadow: '0 12px 40px rgba(26,58,92,0.08)' }}>
            <div style={{ background: '#1a3a5c', borderRadius: '12px', padding: '1rem 1.25rem', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#fff', fontWeight: 700, fontSize: '15px', letterSpacing: '0.02em' }}>ScanTippr Dashboard</span>
              <div style={{ display: 'flex', gap: '6px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f57' }}></div>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#febc2e' }}></div>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#28c840' }}></div>
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '1.25rem' }}>
              {[
                { label: 'Total employees', value: '24' }, 
                { label: 'This month', value: 'R4,820' }, 
                { label: 'Active Companies', value: '3' }, 
                { label: 'Transactions', value: '142' }
              ].map((stat) => (
                <div key={stat.label} style={{ background: '#fff', borderRadius: '10px', padding: '1rem', border: '1px solid #edf2f7' }}>
                  <p style={{ fontSize: '11px', color: '#718096', margin: '0 0 4px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.03em' }}>{stat.label}</p>
                  <p style={{ fontSize: '20px', fontWeight: 800, color: '#1a3a5c', margin: 0 }}>{stat.value}</p>
                </div>
              ))}
            </div>
            
            <div style={{ background: '#fff', borderRadius: '10px', border: '1px solid #edf2f7', overflow: 'hidden' }}>
              <div style={{ padding: '0.85rem 1.25rem', borderBottom: '1px solid #edf2f7', fontSize: '13px', fontWeight: 700, color: '#1a2b3c', background: '#fcfdfe' }}>Recent transactions</div>
              {[
                { name: 'John Smith', company: 'ABC Security', amount: 'R20' }, 
                { name: 'Sipho Ndlovu', company: 'Engen Bryanston', amount: 'R10' }, 
                { name: 'Amanda Mokoena', company: 'Spur Sandton', amount: 'R50' }
              ].map((tx) => (
                <div key={tx.name} style={{ padding: '0.75rem 1.25rem', borderBottom: '1px solid #f7fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontSize: '12.5px', fontWeight: 700, color: '#2d3748', margin: 0 }}>{tx.name}</p>
                    <p style={{ fontSize: '11px', color: '#718096', margin: 0 }}>{tx.company}</p>
                  </div>
                  {/* Brand Teal applied to monetary success indicators */}
                  <span style={{ fontSize: '14px', fontWeight: 800, color: '#1aa39a' }}>{tx.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Feature/Trust Strip */}
        <section style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', padding: '1.75rem 2rem' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap' }}>
            {['QR code technology', 'Secure online payments', 'Mobile friendly', 'Cloud based', 'Instant reporting'].map((item) => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#1a3a5c', fontWeight: 600 }}>
                {/* Brand teal checkmarks */}
                <CheckCircle size={18} color="#1aa39a" style={{ flexShrink: 0 }} /> {item}
              </div>
            ))}
          </div>
        </section>

        {/* How it Works Section */}
        <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '6rem 2rem' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#1a2b3c', textAlign: 'center', marginBottom: '0.75rem', letterSpacing: '-0.01em' }}>How it works</h2>
          <p style={{ textAlign: 'center', color: '#6b7f90', fontSize: '17px', marginBottom: '3.5rem' }}>Three simple steps to get your team set up.</p>
          <div className="three-col">
            {[
              { num: '1', icon: <Users size={22} color="#fff" />, title: 'Create your team', body: 'Add your employees and generate a unique QR code for each one in minutes.' },
              { num: '2', icon: <QrCode size={22} color="#fff" />, title: 'Print the QR cards', body: 'Attach cards to uniforms or lanyards. Customers simply scan to pay.' },
              { num: '3', icon: <BarChart3 size={22} color="#fff" />, title: 'Receive payments', body: 'Customers choose an amount and pay securely. Every transaction is tracked automatically.' },
            ].map((step) => (
              <div key={step.num} style={{ background: '#f8fafc', borderRadius: '16px', padding: '2rem', border: '1px solid #e2e8f0', transition: 'transform 0.2s' }}>
                <div style={{ width: '46px', height: '46px', background: '#1a3a5c', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>{step.icon}</div>
                <p style={{ fontWeight: 700, fontSize: '17px', color: '#1a2b3c', margin: '0 0 10px' }}>{step.title}</p>
                <p style={{ fontSize: '14.5px', color: '#5a6e7f', margin: 0, lineHeight: 1.65 }}>{step.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Targeted Industries Grid */}
        <section style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', padding: '6rem 2rem' }}>
          <div style={{ maxWidth: '1150px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#1a2b3c', textAlign: 'center', marginBottom: '0.75rem', letterSpacing: '-0.01em' }}>Built for every customer-facing business</h2>
            <p style={{ textAlign: 'center', color: '#6b7f90', fontSize: '17px', marginBottom: '3.5rem' }}>ScanTippr works for any business with frontline employees.</p>
            <div className="four-col">
              {[
                { icon: <Shield size={30} color="#fff" />, label: 'Security companies', featured: true },
                { icon: <Fuel size={30} color="#fff" />, label: 'Fuel stations', featured: true },
                { icon: <UtensilsCrossed size={30} color="#1a3a5c" />, label: 'Restaurants' },
                { icon: <Car size={30} color="#1a3a5c" />, label: 'Car washes' },
                { icon: <Hotel size={30} color="#1a3a5c" />, label: 'Hospitality' },
                { icon: <ShoppingCart size={30} color="#1a3a5c" />, label: 'Retail' },
                { icon: <Plane size={30} color="#1a3a5c" />, label: 'Airports' },
                { icon: <Truck size={30} color="#1a3a5c" />, label: 'Logistics' },
              ].map((ind) => (
                <div key={ind.label} style={{ background: ind.featured ? '#1a3a5c' : '#fff', borderRadius: '16px', padding: '1.75rem 1.5rem', border: ind.featured ? 'none' : '1px solid #e2e8f0', textAlign: 'center', boxShadow: ind.featured ? '0 8px 24px rgba(26,58,92,0.15)' : 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>{ind.icon}</div>
                  <p style={{ fontSize: '14px', fontWeight: 700, color: ind.featured ? '#fff' : '#1a2b3c', margin: 0 }}>{ind.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why ScanTippr Value Proposition */}
        <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '6rem 2rem' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#1a2b3c', textAlign: 'center', marginBottom: '0.75rem', letterSpacing: '-0.01em' }}>Why businesses choose ScanTippr</h2>
          <p style={{ textAlign: 'center', color: '#6b7f90', fontSize: '17px', marginBottom: '3.5rem' }}>Real benefits for your business and your team.</p>
          <div className="two-col">
            {[
              { icon: <Users size={22} color="#1a3a5c" />, title: 'Increase employee motivation', body: 'Give employees a modern, dignified way to receive cashless appreciation from customers.' },
              { icon: <Smartphone size={22} color="#1a3a5c" />, title: 'Improve customer experience', body: 'Customers no longer need cash. A quick scan is all it takes to show appreciation.' },
              { icon: <BarChart3 size={22} color="#1a3a5c" />, title: 'Complete visibility', body: 'Track every appreciation payment in real time. Full reporting per employee and per location.' },
              { icon: <Zap size={22} color="#1a3a5c" />, title: 'Easy setup', body: 'Generate QR codes in minutes. No hardware required. No technical knowledge needed.' },
            ].map((item) => (
              <div key={item.title} style={{ background: '#f8fafc', borderRadius: '16px', padding: '2rem', border: '1px solid #e2e8f0', display: 'flex', gap: '1.25rem' }}>
                <div style={{ width: '44px', height: '44px', background: '#e6f1fb', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{item.icon}</div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: '16px', color: '#1a2b3c', margin: '0 0 8px' }}>{item.title}</p>
                  <p style={{ fontSize: '14.5px', color: '#5a6e7f', margin: 0, lineHeight: 1.65 }}>{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Horizontal Experience Flow - Optimized for Mobile wrapping */}
        <section style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', padding: '6rem 2rem' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#1a2b3c', marginBottom: '0.75rem', letterSpacing: '-0.01em' }}>See ScanTippr in action</h2>
            <p style={{ color: '#6b7f90', fontSize: '17px', marginBottom: '4rem' }}>A seamless experience for customers and businesses alike.</p>
            <div className="flow-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
              {[
                { icon: <Smartphone size={28} color="#1a3a5c" />, label: 'Customer scans QR code' },
                { icon: <QrCode size={28} color="#1a3a5c" />, label: 'Chooses amount and pays' },
                { icon: <CheckCircle size={28} color="#1aa39a" />, label: 'Payment confirmed instantly' },
                { icon: <BarChart3 size={28} color="#1a3a5c" />, label: 'Dashboard updates in real time' },
              ].map((step, i) => (
                <div key={step.label} style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ textAlign: 'center', padding: '1rem 1.5rem' }}>
                    <div style={{ width: '64px', height: '64px', background: '#fff', borderRadius: '18px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>{step.icon}</div>
                    <p style={{ fontSize: '13.5px', color: '#1a2b3c', fontWeight: 600, margin: 0, maxWidth: '120px', lineHeight: 1.4 }}>{step.label}</p>
                  </div>
                  {i < 3 && <div className="flow-arrow"><ArrowRight size={22} color="#b0bec5" /></div>}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Factors */}
        <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '6rem 2rem' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#1a2b3c', textAlign: 'center', marginBottom: '0.75rem', letterSpacing: '-0.01em' }}>Secure and trusted</h2>
          <p style={{ textAlign: 'center', color: '#6b7f90', fontSize: '17px', marginBottom: '3.5rem' }}>Payments processed through trusted South African payment providers.</p>
          <div className="four-col">
            {[
              { icon: <Lock size={26} color="#1a3a5c" />, label: 'Secure checkout' },
              { icon: <Zap size={26} color="#1a3a5c" />, label: 'Instant confirmation' },
              { icon: <QrCode size={26} color="#1a3a5c" />, label: 'No cash required' },
              { icon: <Smartphone size={26} color="#1a3a5c" />, label: 'Mobile friendly' },
            ].map((item) => (
              <div key={item.label} style={{ background: '#f8fafc', borderRadius: '16px', padding: '1.75rem', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>{item.icon}</div>
                <p style={{ fontSize: '14px', fontWeight: 700, color: '#1a2b3c', margin: 0 }}>{item.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQs */}
        <section style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', padding: '6rem 2rem' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#1a2b3c', textAlign: 'center', marginBottom: '3.5rem', letterSpacing: '-0.01em' }}>Frequently asked questions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {[
                { q: 'Do customers need an app?', a: 'No. Customers simply scan the QR code with their phone camera. No app download required.' },
                { q: 'Who receives the money?', a: "Payments are made directly to your business's registered merchant account. ScanTippr does not hold customer funds." },
                { q: 'Does ScanTippr hold any funds?', a: 'No. ScanTippr is a software platform. All payments go directly to the registered business bank account.' },
                { q: 'How long does setup take?', a: 'Most businesses are set up and ready within a day. Our team will guide you through the process.' },
                { q: 'Can we add unlimited employees?', a: 'Yes. You can add as many employees as your business requires.' },
                { q: 'Which industries does ScanTippr support?', a: 'ScanTippr works for any customer-facing business — security companies, fuel stations, restaurants, car washes, hospitality, retail, and more.' },
              ].map((faq) => (
                <div key={faq.q} style={{ background: '#fff', borderRadius: '14px', padding: '1.75rem', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.01)' }}>
                  <p style={{ fontWeight: 700, fontSize: '16px', color: '#1a2b3c', margin: '0 0 10px' }}>{faq.q}</p>
                  <p style={{ fontSize: '14.5px', color: '#5a6e7f', margin: 0, lineHeight: 1.65 }}>{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Conversion CTA (Vibrant Teal Highlighted Action) */}
        <section style={{ background: '#1a3a5c', padding: '6rem 2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 800, color: '#fff', margin: '0 0 1rem', letterSpacing: '-0.01em' }}>Ready to modernise employee appreciation?</h2>
          <p style={{ fontSize: '17px', color: '#a3d1f0', margin: '0 0 2.5rem', maxWidth: '600px', marginInline: 'auto' }}>See how ScanTippr can work for your business.</p>
          <a href="mailto:info@scantippr.co.za?subject=Demo Request" style={{ display: 'inline-block', padding: '15px 36px', fontSize: '16px', borderRadius: '8px', background: '#1aa39a', color: '#fff', textDecoration: 'none', fontWeight: 700, boxShadow: '0 4px 14px rgba(26,163,154,0.3)', transition: 'transform 0.2s' }}>Request a demo</a>
        </section>

        {/* Footer */}
        <footer style={{ background: '#111e29', padding: '3rem 2rem' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
              <Image src="/logo-footer.png" alt="ScanTippr Logo" width={180} height={50} style={{ objectFit: 'contain' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', borderTop: '1px solid #1a2b3c', paddingTop: '1.5rem' }}>
              <span style={{ fontSize: '14px', color: '#4a6070' }}>© 2026 ScanTippr. All rights reserved.</span>
              <div style={{ display: 'flex', gap: '1.75rem' }}>
                {['Privacy policy', 'Terms', 'Contact', 'Support'].map((link) => (
                  <a key={link} href="mailto:info@scantippr.co.za" style={{ fontSize: '13.5px', color: '#4a6070', textDecoration: 'none', transition: 'color 0.2s' }}>{link}</a>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  )
}