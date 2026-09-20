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
        .hero-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 40px;
          align-items: center;
        }
        .dashboard-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }
        .three-col-grid, .pricing-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }
        .four-col-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
        }
        .nav-links {
          display: none;
        }
        @media (min-width: 768px) {
          .hero-grid { grid-template-columns: 1.1fr 0.9fr; gap: 48px; }
          .dashboard-grid { grid-template-columns: 240px 1fr; }
          .three-col-grid { grid-template-columns: 1fr 1fr 1fr; gap: 32px; }
          .four-col-grid { grid-template-columns: repeat(4, 1fr); gap: 24px; }
          .footer-grid { grid-template-columns: 2fr 1fr 1fr 1fr; }
          .nav-links { display: flex; gap: 32px; align-items: center; }
        }
        @media (min-width: 992px) {
          .pricing-grid { grid-template-columns: repeat(4, 1fr); gap: 24px; }
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .floating-mockup { animation: float 6s ease-in-out infinite; }
        .about-steps {
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
        }
        @media (min-width: 768px) {
          .about-steps { grid-template-columns: repeat(2, 1fr); gap: 32px; }
        }
        @media (min-width: 992px) {
          .about-steps { grid-template-columns: repeat(3, 1fr); gap: 32px; }
        }
      `}</style>

      <main style={{ fontFamily: "'Inter', 'Manrope', system-ui, sans-serif", background: '#F8FAFC', color: '#1E293B', minHeight: '100vh' }}>

        {/* Sticky Header */}
        <header style={{ position: 'sticky', top: 0, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)', borderBottom: '1px solid #E5E7EB', zIndex: 100, padding: '6px 16px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <a href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
              <img src="/ScanTippr_header.png" alt="ScanTippr Logo" style={{ width: '240px', height: 'auto', objectFit: 'contain' }} />
            </a>
            <nav className="nav-links">
              <a href="#features" style={{ textDecoration: 'none', color: '#475569', fontSize: '15px', fontWeight: 700 }}>Features</a>
              <a href="#how-it-works" style={{ textDecoration: 'none', color: '#475569', fontSize: '15px', fontWeight: 700 }}>How It Works</a>
              <a href="#about" style={{ textDecoration: 'none', color: '#475569', fontSize: '15px', fontWeight: 700 }}>About</a>
              <a href="#industries" style={{ textDecoration: 'none', color: '#475569', fontSize: '15px', fontWeight: 700 }}>Industries</a>
              <a href="#branding" style={{ textDecoration: 'none', color: '#475569', fontSize: '15px', fontWeight: 700 }}>Branding</a>
              <a href="#pricing" style={{ textDecoration: 'none', color: '#475569', fontSize: '15px', fontWeight: 700 }}>Pricing</a>
            </nav>
            <div>
              <a href="mailto:info@scantippr.co.za?subject=Demo Request" style={{ padding: '8px 16px', fontSize: '13px', borderRadius: '6px', background: '#F97316', color: '#fff', textDecoration: 'none', fontWeight: 600, boxShadow: '0 4px 12px rgba(249,115,22,0.3)', whiteSpace: 'nowrap' }}>
                Book a Demo
              </a>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section style={{ padding: '32px 0 20px 0', background: '#FFF' }}>
          <div className="responsive-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'start' }}>
            <div style={{ textAlign: 'left', marginTop: '20px' }}>
              <h1 style={{ fontSize: '52px', fontWeight: 900, color: '#000000', lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '16px' }}>
                Cashless appreciation <br />
                <span style={{ color: '#F97316' }}>for your employees.</span>
              </h1>
              <p style={{ fontSize: '18px', color: '#64748B', lineHeight: 1.6, marginBottom: '32px', maxWidth: '540px' }}>
                Let customers thank your security guards, car guards, fuel attendants and frontline staff with a simple QR scan.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-12 w-full sm:w-auto">
                <a href="mailto:info@scantippr.co.za?subject=Demo Request" style={{ background: '#111111', color: '#fff', textDecoration: 'none', padding: '14px 28px', borderRadius: '8px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%' }}>
                  Book a Demo <span>→</span>
                </a>
                <a href="#how-it-works" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px 28px', background: '#fff', color: '#F97316', border: '2px solid #F97316', borderRadius: '8px', fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}>
                  <span>▷</span> Watch Demo
                </a>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '16px', paddingTop: '32px', borderTop: '1px solid #F1F5F9', maxWidth: '540px' }}>
                {[
                  { icon: '🛡️', title: 'Secure', sub: 'Payments' },
                  { icon: '⚡', title: 'Instant', sub: 'Appreciation' },
                  { icon: '📊', title: 'Real-time', sub: 'Reporting' },
                  { icon: '📱', title: 'Easy QR', sub: 'Management' },
                ].map(f => (
                  <div key={f.title} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ fontSize: '20px' }}>{f.icon}</div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#000000', lineHeight: 1.2 }}>{f.title}<br /><span style={{ fontWeight: 500, color: '#64748B' }}>{f.sub}</span></div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '40px', display: 'flex', alignItems: 'center', gap: '32px', maxWidth: '540px' }}>
                <img src="/QR_Card.png" alt="ScanTippr Employee QR Card" style={{ width: '160px', height: 'auto', borderRadius: '12px', filter: 'drop-shadow(0 15px 30px rgba(15,41,66,0.08))' }} />
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#000000', margin: '0 0 8px 0' }}>Employee QR Card</h3>
                  <p style={{ fontSize: '15px', color: '#64748B', lineHeight: 1.6, margin: 0 }}>Every employee receives a unique branded QR code.</p>
                </div>
              </div>
            </div>
            <div className="floating-mockup" style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
              <div style={{ width: '100%', maxWidth: '350px', filter: 'drop-shadow(0 20px 35px rgba(15,41,66,0.15))' }}>
                <img src="/Cell-Phone.png" alt="ScanTippr Mobile Payment Screen" style={{ width: '100%', height: 'auto', display: 'block' }} />
              </div>
            </div>
          </div>
        </section>

        {/* Trusted By */}
        <section style={{ padding: '40px 16px', background: '#FFF', borderTop: '1px solid #E5E7EB', borderBottom: '1px solid #E5E7EB' }}>
          <div className="responsive-container" style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748B', fontWeight: 600, marginBottom: '24px' }}>
              Trusted by leading security and hospitality groups
            </h2>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '24px 48px', flexWrap: 'wrap', opacity: 0.6 }}>
              <span style={{ fontSize: '16px', fontWeight: '800', color: '#475569' }}>SENTRY SECURITY</span>
              <span style={{ fontSize: '16px', fontWeight: '800', color: '#475569' }}>PROTECT SERVICES</span>
              <span style={{ fontSize: '16px', fontWeight: '800', color: '#475569' }}>SAFEZONE CO.</span>
              <span style={{ fontSize: '16px', fontWeight: '800', color: '#475569' }}>URBAN GUARDING</span>
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
              <div style={{ background: '#FFF', padding: '32px 24px', borderRadius: '16px', border: '1px solid #E5E7EB', boxShadow: '0 10px 25px -5px rgba(15,41,66,0.05)' }}>
                <div style={{ width: '64px', height: '64px', background: 'rgba(249,115,22,0.1)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <path d="M4 8V6C4 4.89543 4.89543 4 6 4H8" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round"/>
                    <path d="M20 8V6C20 4.89543 19.1046 4 18 4H16" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round"/>
                    <path d="M4 16V18C4 19.1046 4.89543 20 6 20H8" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round"/>
                    <path d="M20 16V18C20 19.1046 19.1046 20 18 20H16" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round"/>
                    <rect x="8" y="8" width="8" height="8" rx="1.5" stroke="#000000" strokeWidth="2"/>
                    <rect x="11" y="11" width="2" height="2" fill="#000000"/>
                  </svg>
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#000000', marginBottom: '8px', textAlign: 'center' }}>1. Scan QR Code</h3>
                <p style={{ color: '#64748B', fontSize: '14px', lineHeight: '1.6', margin: 0, textAlign: 'center' }}>Customer scans the employee's unique QR code card using any native smartphone camera. No app download required.</p>
              </div>
              <div style={{ background: '#FFF', padding: '32px 24px', borderRadius: '16px', border: '1px solid #E5E7EB', boxShadow: '0 10px 25px -5px rgba(15,41,66,0.05)' }}>
                <div style={{ width: '64px', height: '64px', background: 'rgba(249,115,22,0.1)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="4" width="18" height="12" rx="2" stroke="#000000" strokeWidth="2"/>
                    <circle cx="12" cy="10" r="3" stroke="#F97316" strokeWidth="2"/>
                    <path d="M3 10H5M19 10H21" stroke="#000000" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M7 20H17" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round"/>
                    <path d="M12 17V20" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#000000', marginBottom: '8px', textAlign: 'center' }}>2. Select Amount</h3>
                <p style={{ color: '#64748B', fontSize: '14px', lineHeight: '1.6', margin: 0, textAlign: 'center' }}>Select predefined appreciation options like R20, R50, or type in a completely custom amount instantly.</p>
              </div>
              <div style={{ background: '#FFF', padding: '32px 24px', borderRadius: '16px', border: '1px solid #E5E7EB', boxShadow: '0 10px 25px -5px rgba(15,41,66,0.05)' }}>
                <div style={{ width: '64px', height: '64px', background: 'rgba(249,115,22,0.1)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="6" width="18" height="12" rx="2" stroke="#000000" strokeWidth="2"/>
                    <path d="M3 10H21" stroke="#000000" strokeWidth="2"/>
                    <path d="M7 14H9" stroke="#F97316" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M14 13.5L16.5 16L21 11" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#000000', marginBottom: '8px', textAlign: 'center' }}>3. Pay Securely</h3>
                <p style={{ color: '#64748B', fontSize: '14px', lineHeight: '1.6', margin: 0, textAlign: 'center' }}>Complete payment in seconds using Ozow — South Africa's leading instant EFT provider. Supports all major banks, instant EFT, Capitec Pay, ABSA Pay, Apple Pay, and Google Pay. No card details stored.</p>
              </div>
            </div>
          </div>
          <div style={{ maxWidth: '900px', margin: '56px auto 0 auto', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 20px 60px -10px rgba(0,0,0,0.15)', position: 'relative' }}>
            <video controls autoPlay muted loop playsInline style={{ width: '100%', height: 'auto', display: 'block' }}>
              <source src="/Scan_QR.mp4" type="video/mp4"/>
              Your browser does not support the video tag.
            </video>
          </div>
        </section>

        {/* About ScanTippr */}
        <section id="about" style={{ padding: '80px 16px', background: '#FFFFFF' }}>
          <div className="responsive-container">
            <div style={{ textAlign: 'center', marginBottom: '56px' }}>
              <span style={{ fontSize: '12px', color: '#F97316', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>About ScanTippr</span>
              <h2 style={{ fontSize: '42px', fontWeight: 900, color: '#000000', letterSpacing: '-0.02em', lineHeight: 1.1, marginTop: '8px', marginBottom: '16px' }}>Everything you need to know</h2>
              <p style={{ fontSize: '16px', color: '#64748B', maxWidth: '620px', margin: '0 auto', lineHeight: 1.7 }}>
                ScanTippr is a South African cashless appreciation platform that connects customers with the frontline workers who serve them — securely, instantly, and without cash.
              </p>
            </div>

            <div className="about-steps">
              {[
                {
                  step: '01',
                  title: 'Register Your Business',
                  body: 'Sign up as a company on ScanTippr. We add your employees to the system — name, job title, and an optional photo. Each employee gets their own unique QR code.',
                  icon: '🏢',
                },
                {
                  step: '02',
                  title: 'Deploy QR Cards',
                  body: 'We print and provide branded QR cards for each employee. Cards are displayed at the employee\'s workstation, worn on a lanyard, or placed on a table — wherever your customers interact with them.',
                  icon: '🪪',
                },
                {
                  step: '03',
                  title: 'Customers Scan & Pay',
                  body: 'A customer scans the QR code with their phone camera — no app needed. They see the employee\'s name and photo, choose an amount, and pay via Ozow instant EFT. The whole process takes under 30 seconds.',
                  icon: '📱',
                },
                {
                  step: '04',
                  title: 'Tips Accumulate',
                  body: 'Every tip is recorded in real time on your company dashboard. You can see exactly how much each employee has received, view transaction history, and download reports at any time.',
                  icon: '📊',
                },
                {
                  step: '05',
                  title: 'ScanTippr Deducts a Fee',
                  body: 'ScanTippr charges R150 per employee per month — or the total tips received if less than R150. This fee is automatically deducted at payout time. No invoices, no upfront costs.',
                  icon: '💳',
                },
                {
                  step: '06',
                  title: 'Employees Get Paid',
                  body: 'At the end of each week or month, ScanTippr initiates a payout via Ozow. The net amount — tips minus the fee — is paid directly into your company\'s bank account or each employee\'s own account, depending on your setup.',
                  icon: '🏦',
                },
              ].map(item => (
                <div key={item.step} style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                  <div style={{ flexShrink: 0, width: '52px', height: '52px', background: '#FFF7ED', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                    {item.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#F97316', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Step {item.step}</div>
                    <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#000000', margin: '0 0 8px 0' }}>{item.title}</h3>
                    <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.7, margin: 0 }}>{item.body}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Two models */}
            <div style={{ marginTop: '64px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
              <div style={{ background: '#F8FAFC', borderRadius: '16px', border: '1px solid #E5E7EB', padding: '32px 28px' }}>
                <div style={{ fontSize: '32px', marginBottom: '16px' }}>🏢</div>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#000000', margin: '0 0 10px 0' }}>Company Account</h3>
                <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.7, margin: '0 0 16px 0' }}>For businesses with multiple staff. One company registration covers all employees. Payouts go to the company bank account — the business distributes to staff.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#475569' }}>
                  <span>✓ Restaurants, bars, hotels</span>
                  <span>✓ Security companies</span>
                  <span>✓ Car washes, fuel stations</span>
                  <span>✓ Retail stores</span>
                </div>
              </div>
              <div style={{ background: '#FFF7ED', borderRadius: '16px', border: '1px solid #FED7AA', padding: '32px 28px' }}>
                <div style={{ fontSize: '32px', marginBottom: '16px' }}>👤</div>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#000000', margin: '0 0 10px 0' }}>Independent Account</h3>
                <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.7, margin: '0 0 16px 0' }}>For individual workers with no employer. Each worker has their own account and QR code. Tips are paid directly into their own bank account.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#475569' }}>
                  <span>✓ Freelance car guards</span>
                  <span>✓ Independent waiters</span>
                  <span>✓ Casual workers</span>
                  <span>✓ Any individual frontline worker</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Management Suite */}
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
                { name: 'Restaurants & Bars', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2"><path d="M12 2v20M17 5H7a2 2 0 00-2 2v3a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2z"/></svg> },
                { name: 'Hotels', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2"><path d="M3 21h18M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16M9 7h2M9 11h2M13 7h2M13 11h2"/></svg> },
                { name: 'Cleaning Services', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2"><path d="M12 22a7 7 0 100-14 7 7 0 000 14zM12 2v6M4.93 4.93l4.24 4.24M19.07 4.93l-4.24 4.24"/></svg> },
                { name: 'Retail Stores', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6zM3 6h18M16 10a4 4 0 01-8 0"/></svg> },
                { name: 'Corporate Offices', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M6 21h12M12 17v4"/></svg> },
              ].map(industry => (
                <div key={industry.name} style={{ background: '#FFF', padding: '24px 16px', borderRadius: '12px', border: '1px solid #E5E7EB', textAlign: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.01)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
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
              <h2 style={{ fontSize: '42px', fontWeight: 900, color: '#000000', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: '16px' }}>
                Your Brand. <span style={{ color: '#F97316' }}>Your Identity.</span>
              </h2>
              <div style={{ width: '48px', height: '3px', background: '#F97316', margin: '0 auto 20px auto', borderRadius: '2px' }} />
              <p style={{ fontSize: '16px', color: '#64748B', maxWidth: '560px', margin: '0 auto', lineHeight: 1.6 }}>Every enterprise can design high-end branded physical cards to match corporate design systems.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px', maxWidth: '680px', margin: '0 auto 56px auto' }}>
              <img src="/Fully_custom1.png" alt="Branded QR Cards" style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '16px' }} />
              <img src="/Fully_custom2.png" alt="Branded QR Cards" style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '16px' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '32px', maxWidth: '1100px', margin: '0 auto' }}>
              {[
                { icon: '🎨', title: 'Brand Freedom', body: 'Use your brand colours, fonts, and logo.' },
                { icon: '🖨️', title: 'High Quality Print', body: 'Premium cards that represent your brand.' },
                { icon: '📱', title: 'Smart & Scan Ready', body: 'Optimised QR codes for fast, reliable scans.' },
                { icon: '🏆', title: 'Professional Impact', body: 'Elevate brand presence with every interaction.' },
              ].map(f => (
                <div key={f.title} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{ fontSize: '28px', flexShrink: 0 }}>{f.icon}</div>
                  <div>
                    <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#000000', margin: '0 0 6px 0', textTransform: 'uppercase', letterSpacing: '0.03em' }}>{f.title}</h4>
                    <p style={{ fontSize: '14px', color: '#64748B', margin: 0, lineHeight: 1.6 }}>{f.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" style={{ padding: '60px 16px', background: '#F8FAFC', borderTop: '1px solid #E5E7EB' }}>
          <div className="responsive-container">
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '42px', fontWeight: 900, color: '#000000', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: '12px' }}>Simple, Transparent Pricing</h2>
              <p style={{ fontSize: '16px', color: '#64748B', maxWidth: '580px', margin: '0 auto 8px auto' }}>Two straightforward fees — no surprises, no invoices for the tip fee.</p>
            </div>

            {/* Fee explanation banner */}
            <div style={{ maxWidth: '860px', margin: '0 auto 40px auto', background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: '14px', padding: '20px 28px', display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <div style={{ fontSize: '24px', flexShrink: 0 }}>💡</div>
              <div>
                <p style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 700, color: '#000000' }}>How the tip fee works</p>
                <p style={{ margin: 0, fontSize: '13px', color: '#64748B', lineHeight: 1.7 }}>
                  ScanTippr charges <strong>R150 per employee per month</strong> — or the total tips received if less than R150. This fee is automatically deducted from tips at payout time. You never receive an invoice for it and pay nothing upfront. The Platform & Support Fee below is billed separately.
                </p>
              </div>
            </div>

            <div className="pricing-grid">
              {/* Starter */}
              <div style={{ background: '#FFF', padding: '28px 24px', borderRadius: '16px', border: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#64748B', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Starter</h3>
                <div style={{ fontSize: '13px', color: '#94A3B8', marginBottom: '16px' }}>1 – 9 employees</div>
                <div style={{ fontSize: '36px', fontWeight: 900, color: '#000000', marginBottom: '4px' }}>R149<span style={{ fontSize: '14px', color: '#64748B', fontWeight: 500 }}>/month</span></div>
                <div style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '24px' }}>Platform & Support Fee</div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px 0', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#475569', flex: 1 }}>
                  <li>✓ Up to 9 employees</li>
                  <li>✓ Branded QR cards</li>
                  <li>✓ Company dashboard</li>
                  <li>✓ Weekly & monthly payouts</li>
                  <li>✓ Transaction reports</li>
                </ul>
                <a href="mailto:info@scantippr.co.za?subject=Starter Plan" style={{ display: 'block', textDecoration: 'none', textAlign: 'center', padding: '11px 0', border: '2px solid #000000', color: '#000000', borderRadius: '8px', fontWeight: 600, fontSize: '13px' }}>Get Started</a>
              </div>

              {/* Growth */}
              <div style={{ background: '#FFF', padding: '28px 24px', borderRadius: '16px', border: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#64748B', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Growth</h3>
                <div style={{ fontSize: '13px', color: '#94A3B8', marginBottom: '16px' }}>10 – 49 employees</div>
                <div style={{ fontSize: '36px', fontWeight: 900, color: '#000000', marginBottom: '4px' }}>R399<span style={{ fontSize: '14px', color: '#64748B', fontWeight: 500 }}>/month</span></div>
                <div style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '24px' }}>Platform & Support Fee</div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px 0', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#475569', flex: 1 }}>
                  <li>✓ Up to 49 employees</li>
                  <li>✓ Branded QR cards</li>
                  <li>✓ Company dashboard</li>
                  <li>✓ Weekly & monthly payouts</li>
                  <li>✓ Transaction reports</li>
                  <li>✓ Priority support</li>
                </ul>
                <a href="mailto:info@scantippr.co.za?subject=Growth Plan" style={{ display: 'block', textDecoration: 'none', textAlign: 'center', padding: '11px 0', border: '2px solid #000000', color: '#000000', borderRadius: '8px', fontWeight: 600, fontSize: '13px' }}>Get Started</a>
              </div>

              {/* Professional — featured */}
              <div style={{ background: '#111111', color: '#FFF', padding: '28px 24px', borderRadius: '20px', border: '2px solid #F97316', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: '#F97316', color: '#FFF', padding: '3px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, whiteSpace: 'nowrap' }}>MOST POPULAR</div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#94A3B8', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Professional</h3>
                <div style={{ fontSize: '13px', color: '#64748B', marginBottom: '16px' }}>50 – 100 employees</div>
                <div style={{ fontSize: '36px', fontWeight: 900, color: '#FFF', marginBottom: '4px' }}>R599<span style={{ fontSize: '14px', color: '#94A3B8', fontWeight: 500 }}>/month</span></div>
                <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '24px' }}>Platform & Support Fee</div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px 0', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#94A3B8', flex: 1 }}>
                  <li style={{ color: '#FFF' }}>✓ Up to 100 employees</li>
                  <li style={{ color: '#FFF' }}>✓ Custom branded QR cards</li>
                  <li style={{ color: '#FFF' }}>✓ Full dashboard suite</li>
                  <li style={{ color: '#FFF' }}>✓ Weekly & monthly payouts</li>
                  <li style={{ color: '#FFF' }}>✓ Advanced reporting</li>
                  <li style={{ color: '#FFF' }}>✓ Dedicated support</li>
                </ul>
                <a href="mailto:info@scantippr.co.za?subject=Professional Plan" style={{ display: 'block', textDecoration: 'none', textAlign: 'center', padding: '12px 0', background: '#F97316', color: '#FFF', borderRadius: '8px', fontWeight: 700, fontSize: '13px' }}>Get Started</a>
              </div>

              {/* Enterprise */}
              <div style={{ background: '#FFF', padding: '28px 24px', borderRadius: '16px', border: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#64748B', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Enterprise</h3>
                <div style={{ fontSize: '13px', color: '#94A3B8', marginBottom: '16px' }}>101+ employees</div>
                <div style={{ fontSize: '36px', fontWeight: 900, color: '#000000', marginBottom: '4px' }}>Custom</div>
                <div style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '24px' }}>Tailored pricing</div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px 0', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#475569', flex: 1 }}>
                  <li>✓ Unlimited employees</li>
                  <li>✓ Multi-branch management</li>
                  <li>✓ Custom QR card branding</li>
                  <li>✓ Weekly & monthly payouts</li>
                  <li>✓ Custom reporting</li>
                  <li>✓ Dedicated account manager</li>
                </ul>
                <a href="mailto:info@scantippr.co.za?subject=Enterprise Enquiry" style={{ display: 'block', textDecoration: 'none', textAlign: 'center', padding: '11px 0', border: '2px solid #F97316', color: '#F97316', borderRadius: '8px', fontWeight: 600, fontSize: '13px' }}>Contact Us</a>
              </div>
            </div>

            {/* Tip fee reminder */}
            <p style={{ textAlign: 'center', fontSize: '13px', color: '#94A3B8', marginTop: '24px' }}>
              All plans include the R150/employee/month tip fee, automatically deducted from tips at payout. No separate invoice.
            </p>
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
                { q: "How does ScanTippr work?", a: "Every employee is assigned a unique, branded QR card. When a customer scans it with their phone camera, it launches a secure tipping page instantly — no app required. The customer selects an amount and pays via Ozow instant EFT. The tip is recorded in real time and paid out to the company or employee at the end of the payout period." },
                { q: "What payment methods are supported?", a: "All payments are processed by Ozow — South Africa's leading instant EFT provider. Customers can pay via instant EFT from any major South African bank, Capitec Pay, ABSA Pay, Apple Pay, and Google Pay. No card details are stored by ScanTippr." },
                { q: "How much does ScanTippr charge?", a: "There are two fees. First, a tip fee of R150 per employee per month (or the total tips if less than R150) — this is automatically deducted from tips at payout, no invoice. Second, a Platform & Support Fee based on your team size: R149/month (1–9 employees), R399/month (10–49), R599/month (50–100), or custom pricing for 101+. The platform fee is invoiced monthly." },
                { q: "How quickly do employees receive payouts?", a: "Payouts are processed weekly or monthly — you choose. ScanTippr initiates the payout via Ozow and the money is in the recipient's bank account within 1–2 business days depending on the bank." },
                { q: "Can we customise our QR cards?", a: "Yes, fully. Your company dashboard gives you control over card branding, colours, and layout. For professional and enterprise clients we can produce fully custom-designed cards matching your corporate identity." },
                { q: "Do customers need an app?", a: "No. Customers simply point their phone camera at the QR code — it opens a web page in their browser. No app download, no registration required." },
              ].map((faq, idx) => (
                <div key={idx} style={{ border: '1px solid #E5E7EB', borderRadius: '10px', padding: '16px', cursor: 'pointer' }} onClick={() => toggleFaq(idx)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#000000', margin: 0 }}>{faq.q}</h4>
                    <span style={{ fontSize: '16px', color: '#F97316', fontWeight: 'bold', flexShrink: 0, marginLeft: '12px' }}>{activeFaq === idx ? '−' : '+'}</span>
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
            <p style={{ fontSize: '16px', color: '#94A3B8', marginBottom: '32px' }}>Join leading enterprises making employee appreciation secure, structured, and modern.</p>
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
                <img src="/Midelpage-logo.png" alt="ScanTippr Logo" style={{ width: '260px', height: 'auto', objectFit: 'contain', display: 'block', marginBottom: '16px' }} />
                <p style={{ color: '#64748B', fontSize: '13px', lineHeight: '1.6', maxWidth: '240px', margin: 0 }}>Secure, cashless appreciation payments for South African frontline workers.</p>
              </div>
              <div>
                <h4 style={{ color: '#FFF', fontSize: '15px', fontWeight: 700, marginBottom: '16px' }}>Platform</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
                  <a href="#features" style={{ color: '#94A3B8', textDecoration: 'none' }}>Features</a>
                  <a href="#how-it-works" style={{ color: '#94A3B8', textDecoration: 'none' }}>How It Works</a>
                  <a href="#about" style={{ color: '#94A3B8', textDecoration: 'none' }}>About</a>
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
