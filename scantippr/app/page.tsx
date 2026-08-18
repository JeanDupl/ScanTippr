"use client";

import React, { useState } from 'react';

export default function Home() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <>
      <style jsx global>{`
        .responsive-container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 16px;
        }
        .hero-grid { display: grid; grid-template-columns: 1fr; gap: 40px; align-items: center; }
        .dashboard-grid { display: grid; grid-template-columns: 1fr; gap: 24px; }
        .three-col-grid, .pricing-grid { display: grid; grid-template-columns: 1fr; gap: 24px; }
        .four-col-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .footer-grid { display: grid; grid-template-columns: 1fr; gap: 32px; }
        .nav-links { display: none; }

        @media (min-width: 768px) {
          .hero-grid { grid-template-columns: 1.1fr 0.9fr; gap: 48px; }
          .dashboard-grid { grid-template-columns: 240px 1fr; }
          .three-col-grid { grid-template-columns: 1fr 1fr 1fr; gap: 32px; }
          .four-col-grid { grid-template-columns: repeat(4, 1fr); gap: 24px; }
          .footer-grid { grid-template-columns: 2fr 1fr 1fr 1fr; }
          .nav-links { display: flex; gap: 32px; align-items: center; }
        }
        @media (min-width: 992px) {
          .pricing-grid { grid-template-columns: 1fr 1.1fr 1fr; gap: 32px; }
        }

        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .floating-mockup { animation: float 6s ease-in-out infinite; }

        .hero-glow-primary {
          position: absolute; right: -80px; top: 50%; transform: translateY(-50%);
          width: 700px; height: 600px;
          background: radial-gradient(ellipse at center, rgba(249,115,22,0.28) 0%, rgba(249,115,22,0.10) 35%, transparent 70%);
          pointer-events: none; z-index: 1;
        }
        .hero-glow-secondary {
          position: absolute; right: 100px; top: 30%;
          width: 300px; height: 300px;
          background: radial-gradient(ellipse at center, rgba(249,115,22,0.15) 0%, transparent 70%);
          pointer-events: none; z-index: 1;
        }
        .hero-dot-grid {
          position: absolute; inset: 0;
          background-image: radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px);
          background-size: 28px 28px;
          pointer-events: none; z-index: 1;
        }

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.75); }
        }
        .eyebrow-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #F97316; flex-shrink: 0;
          animation: pulse-dot 2s ease-in-out infinite;
        }
      `}</style>

      <main style={{ fontFamily: "'Inter', 'Manrope', system-ui, sans-serif", background: '#F8FAFC', color: '#1E293B', minHeight: '100vh', overflowX: 'hidden' }}>

        {/* Sticky Header */}
        <header style={{ position: 'sticky', top: 0, background: 'rgba(10,10,10,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(249,115,22,0.15)', zIndex: 100, padding: '6px 16px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <a href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
              <img src="/ScanTippr_header.png" alt="ScanTippr Logo" style={{ width: '240px', height: 'auto', objectFit: 'contain' }} />
            </a>
            <nav className="nav-links">
              {['Features','How It Works','Industries','Branding','Pricing'].map((item) => (
                <a key={item} href={`#${item.toLowerCase().replace(/ /g,'-')}`} style={{ textDecoration: 'none', color: 'rgba(255,255,255,0.75)', fontSize: '15px', fontWeight: 700 }}>{item}</a>
              ))}
            </nav>
            <div>
              <a href="mailto:info@scantippr.co.za?subject=Demo Request" style={{ padding: '6px 16px', fontSize: '13px', borderRadius: '6px', background: '#F97316', color: '#fff', textDecoration: 'none', fontWeight: 600, boxShadow: '0 4px 12px rgba(249,115,22,0.4)' }}>Book a Demo</a>
            </div>
          </div>
        </header>

        {/* ───── HERO — Dark + Orange Glow ───── */}
        <section style={{ padding: '60px 0 48px 0', background: '#0a0a0a', position: 'relative', overflow: 'hidden', minHeight: '580px', display: 'flex', alignItems: 'center' }}>
          <div className="hero-dot-grid" />
          <div className="hero-glow-primary" />
          <div className="hero-glow-secondary" />

          <div className="responsive-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'center', position: 'relative', zIndex: 2 }}>

            {/* Left */}
            <div style={{ textAlign: 'left' }}>
              {/* Eyebrow */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.3)', color: '#F97316', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '5px 14px', borderRadius: '20px', marginBottom: '28px' }}>
                <span className="eyebrow-dot" />
                QR-Powered Tipping
              </div>

              <h1 style={{ fontSize: '52px', fontWeight: 900, color: '#ffffff', lineHeight: 1.08, letterSpacing: '-0.03em', marginBottom: '20px' }}>
                Cashless appreciation <br />
                <span style={{ color: '#F97316' }}>for your employees.</span>
              </h1>

              <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.65, marginBottom: '36px', maxWidth: '500px' }}>
                Let customers thank your security guards, car guards, fuel attendants and frontline staff with a simple QR scan.
              </p>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '44px' }}>
                <a href="mailto:info@scantippr.co.za?subject=Demo Request" style={{ background: '#F97316', color: '#fff', textDecoration: 'none', padding: '14px 28px', borderRadius: '8px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '15px', boxShadow: '0 0 28px rgba(249,115,22,0.45)' }}>
                  Book a Demo →
                </a>
                <a href="#how-it-works" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 28px', background: 'transparent', color: 'rgba(255,255,255,0.85)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', fontWeight: 600, textDecoration: 'none', fontSize: '15px' }}>
                  <span style={{ width: '20px', height: '20px', borderRadius: '50%', border: '1.5px solid #F97316', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', color: '#F97316', paddingLeft: '2px' }}>▷</span>
                  Watch Demo
                </a>
              </div>

              {/* Four features */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '16px', paddingTop: '32px', borderTop: '1px solid rgba(255,255,255,0.08)', maxWidth: '540px' }}>
                {[
                  { icon: '🛡️', title: 'Secure', sub: 'Payments' },
                  { icon: '⚡', title: 'Instant', sub: 'Appreciation' },
                  { icon: '📊', title: 'Real-time', sub: 'Reporting' },
                  { icon: '📱', title: 'Easy QR', sub: 'Management' },
                ].map((f) => (
                  <div key={f.title} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ fontSize: '20px' }}>{f.icon}</div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#ffffff', lineHeight: 1.2 }}>
                      {f.title}<br /><span style={{ fontWeight: 500, color: 'rgba(255,255,255,0.45)' }}>{f.sub}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* QR Card */}
              <div style={{ marginTop: '40px', display: 'flex', alignItems: 'center', gap: '24px', maxWidth: '540px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '16px 20px' }}>
                <img src="/QR_Card.png" alt="ScanTippr Employee QR Card" style={{ width: '100px', height: 'auto', borderRadius: '8px', filter: 'drop-shadow(0 8px 16px rgba(249,115,22,0.15))' }} />
                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#ffffff', margin: '0 0 6px 0' }}>Employee QR Card</h3>
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, margin: 0 }}>Every employee receives a unique branded QR code.</p>
                </div>
              </div>
            </div>

            {/* Right — Phone */}
            <div className="floating-mockup" style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
              <div style={{ width: '100%', maxWidth: '350px', filter: 'drop-shadow(0 0 40px rgba(249,115,22,0.2)) drop-shadow(0 24px 48px rgba(0,0,0,0.5))' }}>
                <img src="/Cell-Phone.png" alt="ScanTippr Mobile Payment Screen" style={{ width: '100%', height: 'auto', display: 'block' }} />
              </div>
            </div>

          </div>
        </section>
        {/* ───── END HERO ───── */}

        {/* Trusted By */}
        <section style={{ padding: '40px 16px', background: '#FFF', borderTop: '1px solid #E5E7EB', borderBottom: '1px solid #E5E7EB' }}>
          <div className="responsive-container" style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748B', fontWeight: 600, marginBottom: '24px' }}>Trusted by leading security and hospitality groups</h2>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '24px 48px', flexWrap: 'wrap', opacity: 0.6 }}>
              {['SENTRY SECURITY','PROTECT SERVICES','SAFEZONE CO.','URBAN GUARDING'].map(b => (
                <span key={b} style={{ fontSize: '16px', fontWeight: 800, color: '#475569' }}>{b}</span>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" style={{ padding: '60px 16px', background: '#F8FAFC' }}>
          <div className="responsive-container">
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <h2 style={{ fontSize: '42px', fontWeight: 900, color: '#000000', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: '12px' }}>How ScanTippr Works</h2>
              <p style={{ fontSize: '16px', color: '#64748B', maxWidth: '600px', margin: '0 auto' }}>Three simple steps to modernize appreciation without physical cash.</p>
            </div>
            <div className="three-col-grid">
              {[
                {
                  title: '1. Scan QR Code',
                  desc: "Customer scans the employee's unique QR code card using any native smartphone camera. No app download required.",
                  svg: <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M4 8V6C4 4.89543 4.89543 4 6 4H8" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round"/><path d="M20 8V6C20 4.89543 19.1046 4 18 4H16" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round"/><path d="M4 16V18C4 19.1046 4.89543 20 6 20H8" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round"/><path d="M20 16V18C20 19.1046 19.1046 20 18 20H16" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round"/><rect x="8" y="8" width="8" height="8" rx="1.5" stroke="#000000" strokeWidth="2"/><rect x="11" y="11" width="2" height="2" fill="#000000"/></svg>
                },
                {
                  title: '2. Select Amount',
                  desc: 'Select predefined appreciation options like R20, R50, or type in a completely custom amount instantly.',
                  svg: <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="12" rx="2" stroke="#000000" strokeWidth="2"/><circle cx="12" cy="10" r="3" stroke="#F97316" strokeWidth="2"/><path d="M3 10H5M19 10H21" stroke="#000000" strokeWidth="2" strokeLinecap="round"/><path d="M7 20H17" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round"/><path d="M12 17V20" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round"/></svg>
                },
                {
                  title: '3. Pay Securely',
                  desc: 'Complete checkout in seconds using secure credit/debit card gateways, Apple Pay, Google Pay, or secure instant EFT.',
                  svg: <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><rect x="3" y="6" width="18" height="12" rx="2" stroke="#000000" strokeWidth="2"/><path d="M3 10H21" stroke="#000000" strokeWidth="2"/><path d="M7 14H9" stroke="#F97316" strokeWidth="2" strokeLinecap="round"/><path d="M14 13.5L16.5 16L21 11" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                }
              ].map((step) => (
                <div key={step.title} style={{ background: '#FFF', padding: '32px 24px', borderRadius: '16px', border: '1px solid #E5E7EB', boxShadow: '0 10px 25px -5px rgba(15,41,66,0.05)' }}>
                  <div style={{ width: '64px', height: '64px', background: 'rgba(249,115,22,0.1)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', marginLeft: 'auto', marginRight: 'auto' }}>{step.svg}</div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#000000', marginBottom: '8px', textAlign: 'center' }}>{step.title}</h3>
                  <p style={{ color: '#64748B', fontSize: '14px', lineHeight: '1.6', margin: 0, textAlign: 'center' }}>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div style={{ maxWidth: '900px', margin: '56px auto 0 auto', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 20px 60px -10px rgba(0,0,0,0.15)' }}>
            <video controls autoPlay muted loop playsInline style={{ width: '100%', height: 'auto', display: 'block' }}>
              <source src="/Scan_QR.mp4" type="video/mp4" />
            </video>
          </div>
        </section>

        {/* Dashboard */}
        <section id="features" style={{ padding: '80px 0', background: '#F8FAFC' }}>
          <div className="responsive-container">
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <span style={{ fontSize: '12px', color: '#F97316', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Management Suite</span>
              <h2 style={{ fontSize: '42px', fontWeight: 900, color: '#000000', letterSpacing: '-0.02em', lineHeight: 1.1, marginTop: '8px', marginBottom: '12px' }}>Powerful Corporate Dashboard</h2>
              <p style={{ fontSize: '16px', color: '#64748B', maxWidth: '600px', margin: '0 auto' }}>Complete command over your branch locations, personnel profiles, transaction logs, and performance metrics.</p>
            </div>
            <div style={{ background: '#FFF', borderRadius: '24px', boxShadow: '0 20px 60px -20px rgba(15,41,66,0.08)', border: '1px solid #E2E8F0', overflow: 'hidden', padding: '12px' }}>
              <img src="/Dashboard.png" alt="ScanTippr Corporate Dashboard Overview" style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '16px' }} />
            </div>
          </div>
        </section>

        {/* Industries */}
        <section id="industries" style={{ padding: '60px 16px', background: '#F8FAFC' }}>
          <div className="responsive-container">
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h2 style={{ fontSize: '42px', fontWeight: 900, color: '#000000', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: '12px' }}>Perfect for Every Frontline Team</h2>
              <p style={{ fontSize: '16px', color: '#64748B' }}>Providing cashless convenience across different corporate sectors.</p>
            </div>
            <div className="four-col-grid">
              {[
                { name: 'Security Companies', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
                { name: 'Car Guards', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2"><rect x="1" y="3" width="22" height="13" rx="2"/><path d="M7 21h10M12 16v5"/></svg> },
                { name: 'Fuel Stations', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2"><path d="M3 22V2h12v20M15 6h4v4h-4M19 10l2 3v5h-4"/></svg> },
                { name: 'Restaurants', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2"><path d="M12 2v20M17 5H7a2 2 0 00-2 2v3a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2z"/></svg> },
                { name: 'Hotels', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2"><path d="M3 21h18M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16M9 7h2M9 11h2M13 7h2M13 11h2"/></svg> },
                { name: 'Cleaning Services', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2"><path d="M12 22a7 7 0 100-14 7 7 0 000 14zM12 2v6M4.93 4.93l4.24 4.24M19.07 4.93l-4.24 4.24"/></svg> },
                { name: 'Retail Stores', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6zM3 6h18M16 10a4 4 0 01-8 0"/></svg> },
                { name: 'Corporate Offices', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M6 21h12M12 17v4"/></svg> }
              ].map((industry) => (
                <div key={industry.name} style={{ background: '#FFF', padding: '24px 16px', borderRadius: '12px', border: '1px solid #E5E7EB', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', background: '#FFF7ED', borderRadius: '50%' }}>{industry.icon}</div>
                  <span style={{ fontSize: '15px', fontWeight: 700, color: '#000000' }}>{industry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Branding */}
        <section id="branding" style={{ padding: '80px 16px', background: '#FFFFFF' }}>
          <div className="responsive-container">
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}>
                <span style={{ fontSize: '20px' }}>🎨</span>
                <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: '#F97316', letterSpacing: '0.12em' }}>Fully Customisable</span>
              </div>
              <h2 style={{ fontSize: '42px', fontWeight: 900, color: '#000000', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: '16px' }}>Your Brand. <span style={{ color: '#F97316' }}>Your Identity.</span></h2>
              <div style={{ width: '48px', height: '3px', background: '#F97316', margin: '0 auto 20px auto', borderRadius: '2px' }} />
              <p style={{ fontSize: '16px', color: '#64748B', maxWidth: '560px', margin: '0 auto', lineHeight: 1.6 }}>Every enterprise can design high-end branded physical cards to match corporate design systems.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px', maxWidth: '680px', margin: '0 auto 56px auto' }}>
              <img src="/Fully_custom1.png" alt="Branded QR Cards - Protecta Security and GreenLeaf" style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '16px' }} />
              <img src="/Fully_custom2.png" alt="Branded QR Cards - Nexus Logistics and Halo Cleaning" style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '16px' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '32px', maxWidth: '1100px', margin: '0 auto' }}>
              {[
                { icon: '🎨', title: 'Brand Freedom', desc: 'Use your brand colours, fonts, and logo.' },
                { icon: '🖨️', title: 'High Quality Print', desc: 'Premium cards that represent your brand.' },
                { icon: '📱', title: 'Smart & Scan Ready', desc: 'Optimised QR codes for fast, reliable scans.' },
                { icon: '🏆', title: 'Professional Impact', desc: 'Elevate brand presence with every interaction.' },
              ].map((b) => (
                <div key={b.title} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{ fontSize: '28px', flexShrink: 0 }}>{b.icon}</div>
                  <div>
                    <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#000000', margin: '0 0 6px 0', textTransform: 'uppercase', letterSpacing: '0.03em' }}>{b.title}</h4>
                    <p style={{ fontSize: '14px', color: '#64748B', margin: 0, lineHeight: 1.6 }}>{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" style={{ padding: '60px 16px', background: '#F8FAFC', borderTop: '1px solid #E5E7EB' }}>
          <div className="responsive-container">
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h2 style={{ fontSize: '42px', fontWeight: 900, color: '#000000', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: '12px' }}>Flexible Plans For Every Team Size</h2>
              <p style={{ fontSize: '16px', color: '#64748B' }}>Scaling seamlessly from local operations to multinational enterprises.</p>
            </div>
            <div className="pricing-grid">
              <div style={{ background: '#FFF', padding: '24px', borderRadius: '16px', border: '1px solid #E5E7EB' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#000000', marginBottom: '8px' }}>Starter</h3>
                <div style={{ fontSize: '28px', fontWeight: 800, color: '#000000', marginBottom: '16px' }}>Free <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 500 }}>/ month</span></div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', display: 'flex', flexDirection: 'column', gap: '8px', color: '#475569', fontSize: '13px' }}>
                  <li>✓ Up to 10 Employees</li><li>✓ Standard QR Designs</li><li>✓ Weekly Reports</li>
                </ul>
                <a href="mailto:info@scantippr.co.za" style={{ display: 'block', textDecoration: 'none', textAlign: 'center', padding: '10px 0', border: '2px solid #000000', color: '#000000', borderRadius: '8px', fontWeight: 600, fontSize: '13px' }}>Get Started</a>
              </div>
              <div style={{ background: '#111111', color: '#FFF', padding: '32px 24px', borderRadius: '20px', border: '2px solid #F97316' }}>
                <div style={{ display: 'inline-block', background: '#F97316', color: '#FFF', padding: '2px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: 700, marginBottom: '12px' }}>MOST POPULAR</div>
                <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>Professional</h3>
                <div style={{ fontSize: '32px', fontWeight: 800, marginBottom: '16px' }}>Custom pricing</div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                  <li style={{ color: '#FFF' }}>✓ Unlimited Employees</li><li style={{ color: '#FFF' }}>✓ Custom Branding</li><li style={{ color: '#FFF' }}>✓ Live Analytics</li>
                </ul>
                <a href="mailto:info@scantippr.co.za?subject=Professional Plan Request" style={{ display: 'block', textDecoration: 'none', textAlign: 'center', padding: '12px 0', background: '#F97316', color: '#FFF', borderRadius: '8px', fontWeight: 700, fontSize: '13px' }}>Contact Sales</a>
              </div>
              <div style={{ background: '#FFF', padding: '24px', borderRadius: '16px', border: '1px solid #E5E7EB' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#000000', marginBottom: '8px' }}>Enterprise</h3>
                <div style={{ fontSize: '28px', fontWeight: 800, color: '#000000', marginBottom: '16px' }}>Tailored Pricing</div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', display: 'flex', flexDirection: 'column', gap: '8px', color: '#475569', fontSize: '13px' }}>
                  <li>✓ Multi-Branch Admin</li><li>✓ Dedicated Manager</li><li>✓ Custom API Syncs</li>
                </ul>
                <a href="mailto:info@scantippr.co.za" style={{ display: 'block', textDecoration: 'none', textAlign: 'center', padding: '10px 0', border: '2px solid #000000', color: '#000000', borderRadius: '8px', fontWeight: 600, fontSize: '13px' }}>Contact Enterprise</a>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section style={{ padding: '60px 16px', background: '#FFFFFF' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h2 style={{ fontSize: '42px', fontWeight: 900, color: '#000000', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: '12px' }}>Frequently Asked Questions</h2>
              <p style={{ fontSize: '16px', color: '#64748B' }}>Everything you need to know about setting up and running ScanTippr.</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { q: "How does ScanTippr work?", a: "Every employee is assigned a unique, high-quality branded QR card. When a customer scans it with their phone camera, it launches a secure tipping page instantly, allowing the customer to select an appreciation amount and complete payment seamlessly without registering an account." },
                { q: "How are payments securely processed?", a: "Payments are safely processed using modern secure gateways. We natively integrate with reliable providers supporting leading debit/credit networks, Apple Pay, Google Pay, and secure instant EFT options to maintain top-tier transaction compliance." },
                { q: "Can we completely customize our QR cards?", a: "Yes, fully! Your company dashboard enables complete control over card branding, logos, accent colors, corporate metadata, and layout presets to ensure every card reflects your brand identity." },
                { q: "How quickly do our employees receive payouts?", a: "Payout cycles are highly flexible. System administrators can configure automated direct settlement cycles (daily, weekly, or monthly) matching existing enterprise payroll requirements perfectly." }
              ].map((faq, idx) => (
                <div key={idx} style={{ border: '1px solid #E5E7EB', borderRadius: '10px', padding: '16px', cursor: 'pointer' }} onClick={() => toggleFaq(idx)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#000000', margin: 0 }}>{faq.q}</h4>
                    <span style={{ fontSize: '16px', color: '#F97316', fontWeight: 'bold' }}>{activeFaq === idx ? '−' : '+'}</span>
                  </div>
                  {activeFaq === idx && <p style={{ marginTop: '10px', fontSize: '13px', color: '#475569', lineHeight: '1.6', margin: '10px 0 0 0' }}>{faq.a}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ padding: '60px 16px 0 16px', background: '#111111', color: '#FFF', textAlign: 'center' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '42px', fontWeight: 900, marginBottom: '16px', letterSpacing: '-0.02em', lineHeight: 1.1 }}>Ready to modernize employee appreciation?</h2>
            <p style={{ fontSize: '16px', color: '#94A3B8', marginBottom: '32px' }}>Join leading enterprises making employee feedback secure, structured, and modern.</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <a href="mailto:info@scantippr.co.za?subject=Demo Request" style={{ padding: '14px 28px', background: '#F97316', color: '#FFF', borderRadius: '10px', fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 14px rgba(249,115,22,0.4)' }}>Book a Demo</a>
              <a href="mailto:info@scantippr.co.za" style={{ padding: '14px 28px', border: '2px solid rgba(255,255,255,0.2)', color: '#FFF', borderRadius: '10px', fontWeight: 600, textDecoration: 'none' }}>Contact Sales</a>
            </div>
          </div>
          <div style={{ marginTop: '60px', borderTop: '1px solid rgba(249,115,22,0.3)', width: '100%' }} />
        </section>

        {/* Footer */}
        <footer style={{ background: '#0a0a0a', padding: '40px 16px 24px 16px' }}>
          <div className="responsive-container">
            <div className="footer-grid" style={{ marginBottom: '32px' }}>
              <div>
                <img src="/Midelpage-logo.png" alt="ScanTippr Logo" style={{ width: '260px', height: 'auto', objectFit: 'contain', display: 'block', marginBottom: '16px', marginLeft: '0' }} />
                <p style={{ color: '#64748B', fontSize: '13px', lineHeight: '1.6', maxWidth: '240px', margin: '0' }}>Secure, corporate cashless systems empowering enterprise employee appreciation.</p>
              </div>
              <div>
                <h4 style={{ color: '#FFF', fontSize: '15px', fontWeight: 700, marginBottom: '16px' }}>Platform</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
                  <a href="#features" style={{ color: '#94A3B8', textDecoration: 'none' }}>Features</a>
                  <a href="#how-it-works" style={{ color: '#94A3B8', textDecoration: 'none' }}>How It Works</a>
                  <a href="#pricing" style={{ color: '#94A3B8', textDecoration: 'none' }}>Pricing</a>
                </div>
              </div>
              <div>
                <h4 style={{ color: '#FFF', fontSize: '15px', fontWeight: 700, marginBottom: '16px' }}>Resources</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
                  <span style={{ color: '#94A3B8' }}>Help Docs</span>
                  <span style={{ color: '#94A3B8' }}>Compliance</span>
                </div>
              </div>
              <div>
                <h4 style={{ color: '#FFF', fontSize: '15px', fontWeight: 700, marginBottom: '16px' }}>Contact</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#94A3B8' }}>
                  <span>✉️ info@scantippr.co.za</span>
                  <span>📍 South Africa</span>
                </div>
              </div>
            </div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#64748B', flexWrap: 'wrap', gap: '12px' }}>
              <span>© 2026 ScanTippr. All rights reserved.</span>
              <div style={{ display: 'flex', gap: '16px' }}>
                <span style={{ cursor: 'pointer' }}>Privacy Policy</span>
                <span style={{ cursor: 'pointer' }}>Terms of Service</span>
              </div>
            </div>
          </div>
        </footer>

      </main>
    </>
  );
}
