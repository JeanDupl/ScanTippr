"use client";

import React, { useState } from 'react';

export default function Home() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <>
      {/* Global CSS for seamless responsiveness */}
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
          .hero-grid {
            grid-template-columns: 1.1fr 0.9fr;
            gap: 48px;
          }
          .dashboard-grid {
            grid-template-columns: 240px 1fr;
          }
          .three-col-grid {
            grid-template-columns: 1fr 1fr 1fr;
            gap: 32px;
          }
          .four-col-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 24px;
          }
          .footer-grid {
            grid-template-columns: 2fr 1fr 1fr 1fr;
          }
          .nav-links {
            display: flex;
            gap: 32px;
            align-items: center;
          }
        }

        @media (min-width: 992px) {
          .pricing-grid {
            grid-template-columns: 1fr 1.1fr 1fr;
            gap: 32px;
          }
        }

        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .floating-mockup {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>

      <main style={{ 
        fontFamily: "'Inter', 'Manrope', system-ui, sans-serif", 
        background: '#F8FAFC', 
        color: '#1E293B',
        minHeight: '100vh',
        overflowX: 'hidden'
      }}>
        
        {/* Sticky Header */}
        <header style={{
          position: 'sticky',
          top: 0,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid #E5E7EB',
          zIndex: 100,
          padding: '12px 16px'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <a href="/" style={{ display: 'flex', alignItems: 'center', width: '220px', textDecoration: 'none' }}>
              <img 
                src="/Midel-logo.png" 
                alt="ScanTippr Logo" 
                style={{ width: '100%', height: 'auto', objectFit: 'contain' }} 
              />
            </a>

            <nav className="nav-links">
              <a href="#features" style={{ textDecoration: 'none', color: '#475569', fontSize: '14px', fontWeight: 500 }}>Features</a>
              <a href="#how-it-works" style={{ textDecoration: 'none', color: '#475569', fontSize: '14px', fontWeight: 500 }}>How It Works</a>
              <a href="#industries" style={{ textDecoration: 'none', color: '#475569', fontSize: '14px', fontWeight: 500 }}>Industries</a>
              <a href="#branding" style={{ textDecoration: 'none', color: '#475569', fontSize: '14px', fontWeight: 500 }}>Branding</a>
              <a href="#pricing" style={{ textDecoration: 'none', color: '#475569', fontSize: '14px', fontWeight: 500 }}>Pricing</a>
            </nav>

            <div>
              <a 
                href="mailto:info@scantippr.co.za?subject=Demo Request" 
                style={{ 
                  padding: '10px 16px', 
                  fontSize: '13px', 
                  borderRadius: '6px', 
                  background: '#12C7B5', 
                  color: '#fff', 
                  textDecoration: 'none', 
                  fontWeight: 600,
                  boxShadow: '0 4px 12px rgba(18, 199, 181, 0.2)'
                }}
              >
                Book a Demo
              </a>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section style={{ padding: '60px 16px', background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)' }}>
          <div className="responsive-container hero-grid">
            <div>
              <h1 style={{ fontSize: '42px', fontWeight: 800, color: '#0F2942', lineHeight: '1.15', marginBottom: '16px', letterSpacing: '-0.02em' }}>
                Cashless appreciation <br />
                <span style={{ color: '#12C7B5' }}>for your employees.</span>
              </h1>
              <p style={{ fontSize: '16px', color: '#475569', lineHeight: '1.6', marginBottom: '32px', maxWidth: '540px' }}>
                Let customers thank your security guards, car guards, fuel attendants and frontline staff with a simple QR scan.
              </p>
              
              <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap' }}>
                <a href="mailto:info@scantippr.co.za?subject=Demo Request" style={{
                  padding: '14px 28px',
                  background: '#0F2942',
                  color: '#FFF',
                  borderRadius: '10px',
                  fontWeight: 600,
                  textDecoration: 'none',
                  textAlign: 'center',
                  flex: '1 1 auto',
                  boxShadow: '0 4px 14px rgba(15, 41, 66, 0.2)'
                }}>
                  Book a Demo
                </a>
                <a href="#how-it-works" style={{
                  padding: '14px 28px',
                  background: '#FFF',
                  color: '#0F2942',
                  border: '2px solid #E5E7EB',
                  borderRadius: '10px',
                  fontWeight: 600,
                  textAlign: 'center',
                  flex: '1 1 auto',
                  textDecoration: 'none'
                }}>
                  Watch Demo
                </a>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 16px', maxWidth: '450px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontWeight: 500, fontSize: '14px' }}>
                  <span style={{ color: '#12C7B5', fontSize: '16px' }}>✓</span> Secure Payments
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontWeight: 500, fontSize: '14px' }}>
                  <span style={{ color: '#12C7B5', fontSize: '16px' }}>✓</span> Instant Appreciation
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontWeight: 500, fontSize: '14px' }}>
                  <span style={{ color: '#12C7B5', fontSize: '16px' }}>✓</span> Real-time Reporting
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontWeight: 500, fontSize: '14px' }}>
                  <span style={{ color: '#12C7B5', fontSize: '16px' }}>✓</span> QR Management
                </div>
              </div>
            </div>

            {/* Phone Mockup */}
            <div className="floating-mockup" style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
              <div style={{
                width: '100%',
                maxWidth: '300px',
                background: '#FFF',
                borderRadius: '32px',
                border: '8px solid #0F2942',
                boxShadow: '0 25px 50px -12px rgba(15, 41, 66, 0.15)',
                padding: '20px',
                fontFamily: "system-ui, sans-serif"
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94A3B8', marginBottom: '16px', fontWeight: 600 }}>
                  <span>9:41</span>
                  <span>📶 🔋</span>
                </div>

                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                  <img 
                    src="/Pay-screen.png" 
                    alt="Mike Johnson" 
                    style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #12C7B5', marginBottom: '8px' }} 
                  />
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0F2942', margin: '0 0 2px 0' }}>Mike Johnson</h3>
                  <p style={{ fontSize: '12px', color: '#64748B', margin: 0, fontWeight: 500 }}>Sentry Security Guard</p>
                </div>

                <div style={{ background: '#F8FAFC', borderRadius: '12px', padding: '12px', textAlign: 'center', marginBottom: '16px' }}>
                  <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Choose Amount</span>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', marginTop: '8px' }}>
                    {['R20', 'R50', 'R100'].map((amt) => (
                      <button key={amt} style={{ background: '#FFF', border: '1px solid #E5E7EB', borderRadius: '6px', padding: '8px 0', fontWeight: 600, color: '#0F2942', fontSize: '13px' }}>
                        {amt}
                      </button>
                    ))}
                  </div>
                </div>

                <button style={{ width: '100%', background: '#12C7B5', color: '#FFF', border: 'none', borderRadius: '8px', padding: '12px', fontWeight: 600, fontSize: '14px' }}>
                  Continue to Pay
                </button>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '16px' }}>
                  <span style={{ fontSize: '9px', color: '#94A3B8', fontWeight: 500 }}>Secured by</span>
                  <img src="/Midel-logo.png" alt="ScanTippr" style={{ height: '14px', width: 'auto', objectFit: 'contain' }} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trusted By Section */}
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
              <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#0F2942', marginBottom: '12px' }}>How ScanTippr Works</h2>
              <p style={{ fontSize: '16px', color: '#64748B', maxWidth: '600px', margin: '0 auto' }}>Three simple steps to modernize appreciation without physical cash.</p>
            </div>

            <div className="three-col-grid">
              {/* Step 1 - Scan */}
              <div style={{ background: '#FFF', padding: '32px 24px', borderRadius: '16px', border: '1px solid #E5E7EB', boxShadow: '0 10px 25px -5px rgba(15, 41, 66, 0.05)' }}>
                {/* Fixed snake_case typo here: changed justify_content to justifyContent */}
                <div style={{ width: '64px', height: '64px', background: 'rgba(18, 199, 181, 0.1)', borderRadius: '14px', display: 'flex', alignItems: 'center', marginBottom: '20px', marginLeft: 'auto', marginRight: 'auto', justifyContent: 'center' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 8V6C4 4.89543 4.89543 4 6 4H8" stroke="#12C7B5" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M20 8V6C20 4.89543 19.1046 4 18 4H16" stroke="#12C7B5" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M4 16V18C4 19.1046 4.89543 20 6 20H8" stroke="#12C7B5" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M20 16V18C20 19.1046 19.1046 20 18 20H16" stroke="#12C7B5" strokeWidth="2.5" strokeLinecap="round" />
                    <rect x="8" y="8" width="8" height="8" rx="1.5" stroke="#0F2942" strokeWidth="2" />
                    <rect x="11" y="11" width="2" height="2" fill="#0F2942" />
                  </svg>
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0F2942', marginBottom: '8px', textAlign: 'center' }}>1. Scan QR Code</h3>
                <p style={{ color: '#64748B', fontSize: '14px', lineHeight: '1.6', margin: 0, textAlign: 'center' }}>
                  Customer scans the employee's unique QR code card using any native smartphone camera. No app download required.
                </p>
              </div>

              {/* Step 2 - Choose Amount */}
              <div style={{ background: '#FFF', padding: '32px 24px', borderRadius: '16px', border: '1px solid #E5E7EB', boxShadow: '0 10px 25px -5px rgba(15, 41, 66, 0.05)' }}>
                <div style={{ width: '64px', height: '64px', background: 'rgba(18, 199, 181, 0.1)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', marginLeft: 'auto', marginRight: 'auto' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="4" width="18" height="12" rx="2" stroke="#0F2942" strokeWidth="2" />
                    <circle cx="12" cy="10" r="3" stroke="#12C7B5" strokeWidth="2" />
                    <path d="M3 10H5M19 10H21" stroke="#0F2942" strokeWidth="2" strokeLinecap="round" />
                    <path d="M7 20H17" stroke="#12C7B5" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M12 17V20" stroke="#12C7B5" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0F2942', marginBottom: '8px', textAlign: 'center' }}>2. Select Amount</h3>
                <p style={{ color: '#64748B', fontSize: '14px', lineHeight: '1.6', margin: 0, textAlign: 'center' }}>
                  Select predefined appreciation options like R20, R50, or type in a completely custom amount instantly.
                </p>
              </div>

              {/* Step 3 - Secure Payment */}
              <div style={{ background: '#FFF', padding: '32px 24px', borderRadius: '16px', border: '1px solid #E5E7EB', boxShadow: '0 10px 25px -5px rgba(15, 41, 66, 0.05)' }}>
                <div style={{ width: '64px', height: '64px', background: 'rgba(18, 199, 181, 0.1)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', marginLeft: 'auto', marginRight: 'auto' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="6" width="18" height="12" rx="2" stroke="#0F2942" strokeWidth="2" />
                    <path d="M3 10H21" stroke="#0F2942" strokeWidth="2" />
                    <path d="M7 14H9" stroke="#12C7B5" strokeWidth="2" strokeLinecap="round" />
                    <path d="M14 13.5L16.5 16L21 11" stroke="#12C7B5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0F2942', marginBottom: '8px', textAlign: 'center' }}>3. Pay Securely</h3>
                <p style={{ color: '#64748B', fontSize: '14px', lineHeight: '1.6', margin: 0, textAlign: 'center' }}>
                  Complete checkout in seconds using secure credit/debit card gateways, Apple Pay, Google Pay, or secure instant EFT.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Powerful Dashboard Preview */}
        <section style={{ padding: '60px 16px', background: '#FFFFFF', borderTop: '1px solid #E5E7EB', overflowX: 'hidden' }}>
          <div className="responsive-container">
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#12C7B5', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Management Suite</span>
              <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#0F2942', marginTop: '8px', marginBottom: '12px' }}>Powerful Corporate Dashboard</h2>
              <p style={{ fontSize: '16px', color: '#64748B', maxWidth: '600px', margin: '0 auto' }}>Complete command over your branch locations, personnel profiles, transaction logs, and performance metrics.</p>
            </div>

            {/* Dashboard Container Layout */}
            <div style={{
              background: '#0F2942',
              borderRadius: '20px',
              padding: '16px',
              boxShadow: '0 30px 60px -15px rgba(15, 41, 66, 0.3)',
              color: '#FFF',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              overflowX: 'hidden'
            }}>
              <div className="dashboard-grid">
                {/* Sidebar */}
                <div style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: '12px', padding: '16px' }}>
                  <div style={{ background: '#FFF', padding: '6px', borderRadius: '6px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src="/Midel-logo.png" alt="ScanTippr" style={{ width: '100%', maxHeight: '32px', objectFit: 'contain' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ background: 'rgba(18, 199, 181, 0.15)', color: '#12C7B5', padding: '8px 12px', borderRadius: '6px', fontWeight: 600, fontSize: '12px' }}>📊 Dashboard</div>
                    <div style={{ color: '#94A3B8', padding: '8px 12px', fontSize: '12px' }}>🏢 Companies</div>
                    <div style={{ color: '#94A3B8', padding: '8px 12px', fontSize: '12px' }}>👥 Employees</div>
                  </div>
                </div>

                {/* Main Panel */}
                <div style={{ background: '#F8FAFC', borderRadius: '12px', padding: '16px', color: '#0F2942' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Performance Metrics</h3>
                    <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 500 }}>System Live • HQ</span>
                  </div>

                  {/* Metrics Row */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ background: '#FFF', padding: '14px', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
                      <span style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>APPRECIATION</span>
                      <div style={{ fontSize: '18px', fontWeight: 800, color: '#0F2942', marginTop: '4px' }}>R25,430.00</div>
                    </div>
                    <div style={{ background: '#FFF', padding: '14px', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
                      <span style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>ACTIVE STAFF</span>
                      <div style={{ fontSize: '18px', fontWeight: 800, color: '#0F2942', marginTop: '4px' }}>532</div>
                    </div>
                  </div>

                  {/* Transaction Table */}
                  <div style={{ background: '#FFF', borderRadius: '8px', padding: '12px', border: '1px solid #E5E7EB' }}>
                    <h4 style={{ fontSize: '12px', fontWeight: 700, marginBottom: '12px' }}>Recent Appreciations</h4>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F1F5F9', fontSize: '12px' }}>
                      <span style={{ fontWeight: 600 }}>Mike Johnson</span>
                      <span style={{ color: '#12C7B5', fontWeight: 700 }}>+R50.00</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F1F5F9', fontSize: '12px' }}>
                      <span style={{ fontWeight: 600 }}>Sarah Williams</span>
                      <span style={{ color: '#12C7B5', fontWeight: 700 }}>+R100.00</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Perfect For Every Industry */}
        <section id="industries" style={{ padding: '60px 16px', background: '#F8FAFC' }}>
          <div className="responsive-container">
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#0F2942', marginBottom: '12px' }}>Perfect for Every Frontline Team</h2>
              <p style={{ fontSize: '16px', color: '#64748B' }}>Providing cashless convenience across different corporate sectors.</p>
            </div>

            <div className="four-col-grid">
              {[
                { name: 'Security Companies', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#12C7B5" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
                { name: 'Car Guards', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#12C7B5" strokeWidth="2"><rect x="1" y="3" width="22" height="13" rx="2"/><path d="M7 21h10M12 16v5"/></svg> },
                { name: 'Fuel Stations', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#12C7B5" strokeWidth="2"><path d="M3 22V2h12v20M15 6h4v4h-4M19 10l2 3v5h-4"/></svg> },
                { name: 'Restaurants', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#12C7B5" strokeWidth="2"><path d="M12 2v20M17 5H7a2 2 0 00-2 2v3a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2z"/></svg> },
                { name: 'Hotels', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#12C7B5" strokeWidth="2"><path d="M3 21h18M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16M9 7h2M9 11h2M13 7h2M13 11h2"/></svg> },
                { name: 'Cleaning Services', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#12C7B5" strokeWidth="2"><path d="M12 22a7 7 0 100-14 7 7 0 000 14zM12 2v6M4.93 4.93l4.24 4.24M19.07 4.93l-4.24 4.24"/></svg> },
                { name: 'Retail Stores', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#12C7B5" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6zM3 6h18M16 10a4 4 0 01-8 0"/></svg> },
                { name: 'Corporate Offices', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#12C7B5" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M6 21h12M12 17v4"/></svg> }
              ].map((industry) => (
                <div key={industry.name} style={{ background: '#FFF', padding: '24px 16px', borderRadius: '12px', border: '1px solid #E5E7EB', textAlign: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.01)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', background: '#F1F5F9', borderRadius: '50%' }}>
                    {industry.icon}
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#0F2942' }}>{industry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Company Branding & Customizable Cards */}
        <section id="branding" style={{ padding: '60px 16px', background: '#FFFFFF' }}>
          <div className="responsive-container">
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#12C7B5', textTransform: 'uppercase', letterSpacing: '0.1em' }}>White-Label Capabilities</span>
              <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#0F2942', marginTop: '8px', marginBottom: '12px' }}>Your Brand. Your Identity.</h2>
              <p style={{ fontSize: '16px', color: '#64748B' }}>Every enterprise can design high-end branded physical cards to match corporate design systems.</p>
            </div>

            <div className="four-col-grid">
              {/* Blue Card */}
              {/* FIXED: changed justify_content: 'center' to justifyContent: 'center' */}
              <div style={{ background: '#0F2942', color: '#FFF', padding: '24px 16px', borderRadius: '16px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#12C7B5', marginBottom: '16px', letterSpacing: '0.05em' }}>SENTRY SECURITY</span>
                <div style={{ background: '#FFF', padding: '12px', borderRadius: '12px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="84" height="84" viewBox="0 0 24 24" fill="none" stroke="#0F2942" strokeWidth="2">
                    <rect x="2" y="2" width="6" height="6"/><rect x="16" y="2" width="6" height="6"/><rect x="2" y="16" width="6" height="6"/>
                    <path d="M10 2h4v4h-4zm0 8h4v4h-4zm6 0h4v4h-4zM2 10h4v4H2zm8 6h4v4h-4zm6 0h4v4h-4z"/>
                  </svg>
                </div>
                <span style={{ fontWeight: 600, fontSize: '13px' }}>Thank you!</span>
              </div>

              {/* Green Card */}
              {/* FIXED: changed justify_content: 'center' to justifyContent: 'center' */}
              <div style={{ background: '#0F5B46', color: '#FFF', padding: '24px 16px', borderRadius: '16px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#4ADE80', marginBottom: '16px', letterSpacing: '0.05em' }}>GREEN FIELD STATIONS</span>
                <div style={{ background: '#FFF', padding: '12px', borderRadius: '12px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="84" height="84" viewBox="0 0 24 24" fill="none" stroke="#0F5B46" strokeWidth="2">
                    <rect x="2" y="2" width="6" height="6"/><rect x="16" y="2" width="6" height="6"/><rect x="2" y="16" width="6" height="6"/>
                    <path d="M10 2h4v4h-4zm0 8h4v4h-4zm6 0h4v4h-4zM2 10h4v4H2zm8 6h4v4h-4zm6 0h4v4h-4z"/>
                  </svg>
                </div>
                <span style={{ fontWeight: 600, fontSize: '13px' }}>Appreciation Portal</span>
              </div>

              {/* Orange Card */}
              {/* FIXED: changed justify_content: 'center' to justifyContent: 'center' */}
              <div style={{ background: '#C2410C', color: '#FFF', padding: '24px 16px', borderRadius: '16px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#FB923C', marginBottom: '16px', letterSpacing: '0.05em' }}>CITY GUARD TEAM</span>
                <div style={{ background: '#FFF', padding: '12px', borderRadius: '12px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="84" height="84" viewBox="0 0 24 24" fill="none" stroke="#C2410C" strokeWidth="2">
                    <rect x="2" y="2" width="6" height="6"/><rect x="16" y="2" width="6" height="6"/><rect x="2" y="16" width="6" height="6"/>
                    <path d="M10 2h4v4h-4zm0 8h4v4h-4zm6 0h4v4h-4zM2 10h4v4H2zm8 6h4v4h-4zm6 0h4v4h-4z"/>
                  </svg>
                </div>
                <span style={{ fontWeight: 600, fontSize: '13px' }}>Scan to Support</span>
              </div>

              {/* Red Card */}
              {/* FIXED: changed justify_content: 'center' to justifyContent: 'center' */}
              <div style={{ background: '#991B1B', color: '#FFF', padding: '24px 16px', borderRadius: '16px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#F87171', marginBottom: '16px', letterSpacing: '0.05em' }}>PREMIER HOTELS</span>
                <div style={{ background: '#FFF', padding: '12px', borderRadius: '12px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="84" height="84" viewBox="0 0 24 24" fill="none" stroke="#991B1B" strokeWidth="2">
                    <rect x="2" y="2" width="6" height="6"/><rect x="16" y="2" width="6" height="6"/><rect x="2" y="16" width="6" height="6"/>
                    <path d="M10 2h4v4h-4zm0 8h4v4h-4zm6 0h4v4h-4zM2 10h4v4H2zm8 6h4v4h-4zm6 0h4v4h-4z"/>
                  </svg>
                </div>
                <span style={{ fontWeight: 600, fontSize: '13px' }}>Thank Our Team</span>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" style={{ padding: '60px 16px', background: '#F8FAFC', borderTop: '1px solid #E5E7EB' }}>
          <div className="responsive-container">
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#0F2942', marginBottom: '12px' }}>Flexible Plans For Every Team Size</h2>
              <p style={{ fontSize: '16px', color: '#64748B' }}>Scaling seamlessly from local operations to multinational enterprises.</p>
            </div>

            <div className="pricing-grid">
              {/* Starter Plan */}
              <div style={{ background: '#FFF', padding: '24px', borderRadius: '16px', border: '1px solid #E5E7EB' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0F2942', marginBottom: '8px' }}>Starter</h3>
                <div style={{ fontSize: '28px', fontWeight: 800, color: '#0F2942', marginBottom: '16px' }}>Free <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 500 }}>/ month</span></div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', display: 'flex', flexDirection: 'column', gap: '8px', color: '#475569', fontSize: '13px' }}>
                  <li>✓ Up to 10 Employees</li>
                  <li>✓ Standard QR Designs</li>
                  <li>✓ Weekly Reports</li>
                </ul>
                <a href="mailto:info@scantippr.co.za" style={{ display: 'block', textDecoration: 'none', textAlign: 'center', padding: '10px 0', border: '2px solid #0F2942', color: '#0F2942', borderRadius: '8px', fontWeight: 600, fontSize: '13px' }}>Get Started</a>
              </div>

              {/* Professional Plan */}
              <div style={{ background: '#0F2942', color: '#FFF', padding: '32px 24px', borderRadius: '20px', border: '2px solid #12C7B5' }}>
                <div style={{ display: 'inline-block', background: '#12C7B5', color: '#0F2942', padding: '2px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: 700, marginBottom: '12px' }}>MOST POPULAR</div>
                <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>Professional</h3>
                <div style={{ fontSize: '32px', fontWeight: 800, marginBottom: '16px' }}>Custom pricing</div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', display: 'flex', flexDirection: 'column', gap: '8px', color: '#94A3B8', fontSize: '13px' }}>
                  <li style={{ color: '#FFF' }}>✓ Unlimited Employees</li>
                  <li style={{ color: '#FFF' }}>✓ Custom Branding</li>
                  <li style={{ color: '#FFF' }}>✓ Live Analytics</li>
                </ul>
                <a href="mailto:info@scantippr.co.za?subject=Professional Plan Request" style={{ display: 'block', textDecoration: 'none', textAlign: 'center', padding: '12px 0', background: '#12C7B5', color: '#0F2942', borderRadius: '8px', fontWeight: 700, fontSize: '13px' }}>Contact Sales</a>
              </div>

              {/* Enterprise Plan */}
              <div style={{ background: '#FFF', padding: '24px', borderRadius: '16px', border: '1px solid #E5E7EB' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0F2942', marginBottom: '8px' }}>Enterprise</h3>
                <div style={{ fontSize: '28px', fontWeight: 800, color: '#0F2942', marginBottom: '16px' }}>Tailored Pricing</div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', display: 'flex', flexDirection: 'column', gap: '8px', color: '#475569', fontSize: '13px' }}>
                  <li>✓ Multi-Branch Admin</li>
                  <li>✓ Dedicated Manager</li>
                  <li>✓ Custom API Syncs</li>
                </ul>
                <a href="mailto:info@scantippr.co.za" style={{ display: 'block', textDecoration: 'none', textAlign: 'center', padding: '10px 0', border: '2px solid #0F2942', color: '#0F2942', borderRadius: '8px', fontWeight: 600, fontSize: '13px' }}>Contact Enterprise</a>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section style={{ padding: '60px 16px', background: '#FFFFFF' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#0F2942', marginBottom: '12px' }}>Frequently Asked Questions</h2>
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
                    <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#0F2942', margin: 0 }}>{faq.q}</h4>
                    <span style={{ fontSize: '16px', color: '#12C7B5', fontWeight: 'bold' }}>{activeFaq === idx ? '−' : '+'}</span>
                  </div>
                  {activeFaq === idx && (
                    <p style={{ marginTop: '10px', fontSize: '13px', color: '#475569', lineHeight: '1.6', margin: '10px 0 0 0' }}>{faq.a}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section style={{ padding: '60px 16px', background: '#0F2942', color: '#FFF', textAlign: 'center' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '16px' }}>Ready to modernize employee appreciation?</h2>
            <p style={{ fontSize: '16px', color: '#94A3B8', marginBottom: '32px' }}>Join leading enterprises making employee feedback secure, structured, and modern.</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <a href="mailto:info@scantippr.co.za?subject=Demo Request" style={{
                padding: '14px 28px',
                background: '#12C7B5',
                color: '#0F2942',
                borderRadius: '10px',
                fontWeight: 700,
                textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(18, 199, 181, 0.4)'
              }}>
                Book a Demo
              </a>
              <a href="mailto:info@scantippr.co.za" style={{
                padding: '14px 28px',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                color: '#FFF',
                borderRadius: '10px',
                fontWeight: 600,
                textDecoration: 'none'
              }}>
                Contact Sales
              </a>
            </div>
          </div>
        </section>

        {/* Global Footer */}
        <footer style={{ background: '#111e29', padding: '40px 16px 24px 16px' }}>
          <div className="responsive-container">
            <div className="footer-grid" style={{ marginBottom: '32px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ 
                    background: '#ffffff', 
                    padding: '6px 14px', 
                    borderRadius: '8px', 
                    display: 'inline-flex', 
                    alignItems: 'center',
                    width: '180px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}>
                    <img 
                      src="/Midel-logo.png" 
                      alt="ScanTippr Logo" 
                      style={{ width: '100%', height: 'auto', objectFit: 'contain' }} 
                    />
                  </div>
                </div>
                <p style={{ color: '#94A3B8', fontSize: '13px', lineHeight: '1.6', maxWidth: '240px' }}>
                  Secure, corporate cashless systems empowering enterprise employee appreciation.
                </p>
              </div>

              <div>
                <h4 style={{ color: '#FFF', fontSize: '14px', fontWeight: 700, marginBottom: '16px' }}>Platform</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
                  <a href="#features" style={{ color: '#94A3B8', textDecoration: 'none' }}>Features</a>
                  <a href="#how-it-works" style={{ color: '#94A3B8', textDecoration: 'none' }}>How It Works</a>
                  <a href="#pricing" style={{ color: '#94A3B8', textDecoration: 'none' }}>Pricing</a>
                </div>
              </div>

              <div>
                <h4 style={{ color: '#FFF', fontSize: '14px', fontWeight: 700, marginBottom: '16px' }}>Resources</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
                  <span style={{ color: '#94A3B8' }}>Help Docs</span>
                  <span style={{ color: '#94A3B8' }}>Compliance</span>
                </div>
              </div>

              <div>
                <h4 style={{ color: '#FFF', fontSize: '14px', fontWeight: 700, marginBottom: '16px' }}>Contact</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#94A3B8' }}>
                  <span>✉️ info@scantippr.co.za</span>
                  <span>📍 South Africa</span>
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#64748B', flexWrap: 'wrap', gap: '12px' }}>
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