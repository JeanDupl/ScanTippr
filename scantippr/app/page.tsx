"use client";

import React, { useState } from 'react';

export default function Home() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <>
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
          padding: '12px 24px'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <a href="/" style={{ display: 'flex', alignItems: 'center', width: '140px', textDecoration: 'none' }}>
              <img 
                src="/logo-footer.png" 
                alt="ScanTippr Logo" 
                style={{ width: '100%', height: 'auto', objectFit: 'contain' }} 
              />
            </a>

            <nav style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
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
                  padding: '10px 20px', 
                  fontSize: '14px', 
                  borderRadius: '8px', 
                  background: '#12C7B5', 
                  color: '#fff', 
                  textDecoration: 'none', 
                  fontWeight: 600,
                  transition: 'background 0.2s ease',
                  boxShadow: '0 4px 12px rgba(18, 199, 181, 0.2)'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#0fa193'}
                onMouseOut={(e) => e.currentTarget.style.background = '#12C7B5'}
              >
                Book a Demo
              </a>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section style={{ padding: '80px 24px', background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '48px', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: '56px', fontWeight: 800, color: '#0F2942', lineHeight: '1.1', marginBottom: '24px', letterSpacing: '-0.02em' }}>
                Cashless appreciation <br />
                <span style={{ color: '#12C7B5' }}>for your employees.</span>
              </h1>
              <p style={{ fontSize: '18px', color: '#475569', lineHeight: '1.6', marginBottom: '40px', maxWidth: '540px' }}>
                Let customers thank your security guards, car guards, fuel attendants and frontline staff with a simple QR scan.
              </p>
              
              <div style={{ display: 'flex', gap: '16px', marginBottom: '48px' }}>
                <a href="mailto:info@scantippr.co.za?subject=Demo Request" style={{
                  padding: '16px 32px',
                  background: '#0F2942',
                  color: '#FFF',
                  borderRadius: '12px',
                  fontWeight: 600,
                  textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(15, 41, 66, 0.2)'
                }}>
                  Book a Demo
                </a>
                <a href="#how-it-works" style={{
                  padding: '16px 32px',
                  background: '#FFF',
                  color: '#0F2942',
                  border: '2px solid #E5E7EB',
                  borderRadius: '12px',
                  fontWeight: 600,
                  textDecoration: 'none'
                }}>
                  Watch Demo
                </a>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 24px', maxWidth: '450px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontWeight: 500, fontSize: '15px' }}>
                  <span style={{ color: '#12C7B5', fontSize: '18px' }}>✓</span> Secure Payments
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontWeight: 500, fontSize: '15px' }}>
                  <span style={{ color: '#12C7B5', fontSize: '18px' }}>✓</span> Instant Appreciation
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontWeight: 500, fontSize: '15px' }}>
                  <span style={{ color: '#12C7B5', fontSize: '18px' }}>✓</span> Real-time Reporting
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontWeight: 500, fontSize: '15px' }}>
                  <span style={{ color: '#12C7B5', fontSize: '18px' }}>✓</span> QR Management
                </div>
              </div>
            </div>

            {/* Interactive Phone Mockup */}
            <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
              <div style={{
                width: '320px',
                background: '#FFF',
                borderRadius: '40px',
                border: '12px solid #0F2942',
                boxShadow: '0 25px 50px -12px rgba(15, 41, 66, 0.25)',
                padding: '24px',
                fontFamily: "system-ui, sans-serif"
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#94A3B8', marginBottom: '24px', fontWeight: 600 }}>
                  <span>9:41</span>
                  <span>📶 🔋</span>
                </div>

                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                  <img 
                    src="/ChatGPT Image Jul 12, 2026, 07_47_07 PM" 
                    alt="Mike Johnson" 
                    style={{ width: '88px', height: '88px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #12C7B5', marginBottom: '12px' }} 
                  />
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0F2942', margin: '0 0 4px 0' }}>Mike Johnson</h3>
                  <p style={{ fontSize: '13px', color: '#64748B', margin: 0, fontWeight: 500 }}>Sentry Security Guard</p>
                </div>

                <div style={{ background: '#F8FAFC', borderRadius: '16px', padding: '16px', textAlign: 'center', marginBottom: '24px' }}>
                  <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Choose Amount</span>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginTop: '12px' }}>
                    {['R20', 'R50', 'R100'].map((amt) => (
                      <button key={amt} style={{ background: '#FFF', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '10px 0', fontWeight: 600, color: '#0F2942', fontSize: '14px', cursor: 'pointer' }}>
                        {amt}
                      </button>
                    ))}
                  </div>
                  <input type="text" placeholder="Custom Amount (R)" style={{ width: '100%', marginTop: '12px', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '10px', fontSize: '13px', textAlign: 'center' }} />
                </div>

                <button style={{ width: '100%', background: '#12C7B5', color: '#FFF', border: 'none', borderRadius: '12px', padding: '14px', fontWeight: 600, fontSize: '15px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(18, 199, 181, 0.2)' }}>
                  Continue to Pay
                </button>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '20px' }}>
                  <span style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 500 }}>Secured by</span>
                  <img src="/logo-footer.png" alt="ScanTippr" style={{ height: '14px', width: 'auto' }} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trusted By Section */}
        <section style={{ padding: '60px 24px', background: '#FFF', borderTop: '1px solid #E5E7EB', borderBottom: '1px solid #E5E7EB' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748B', fontWeight: 600, marginBottom: '32px' }}>
              Trusted by leading security and hospitality groups
            </h2>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '64px', flexWrap: 'wrap', opacity: 0.6 }}>
              <span style={{ fontSize: '20px', fontWeight: '800', color: '#475569' }}>SENTRY SECURITY</span>
              <span style={{ fontSize: '20px', fontWeight: '800', color: '#475569' }}>PROTECT SERVICES</span>
              <span style={{ fontSize: '20px', fontWeight: '800', color: '#475569' }}>SAFEZONE CO.</span>
              <span style={{ fontSize: '20px', fontWeight: '800', color: '#475569' }}>URBAN GUARDING</span>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" style={{ padding: '100px 24px', background: '#F8FAFC' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <h2 style={{ fontSize: '36px', fontWeight: 800, color: '#0F2942', marginBottom: '16px' }}>How ScanTippr Works</h2>
              <p style={{ fontSize: '18px', color: '#64748B', maxWidth: '600px', margin: '0 auto' }}>Three simple steps to modernize appreciation without physical cash.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '32px' }}>
              {/* Step 1 */}
              <div style={{ background: '#FFF', padding: '40px', borderRadius: '20px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                <div style={{ width: '56px', height: '56px', background: 'rgba(18, 199, 181, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', color: '#12C7B5', marginBottom: '24px', fontWeight: 'bold' }}>
                  1
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#0F2942', marginBottom: '12px' }}>Scan</h3>
                <p style={{ color: '#64748B', lineHeight: '1.6' }}>Customer scans the employee's unique QR code using any native smartphone camera.</p>
              </div>

              {/* Step 2 */}
              <div style={{ background: '#FFF', padding: '40px', borderRadius: '20px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                <div style={{ width: '56px', height: '56px', background: 'rgba(18, 199, 181, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', color: '#12C7B5', marginBottom: '24px', fontWeight: 'bold' }}>
                  2
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#0F2942', marginBottom: '12px' }}>Choose Amount</h3>
                <p style={{ color: '#64748B', lineHeight: '1.6' }}>Select predefined options like R10, R20, R50, or type in any customized custom amount instantly.</p>
              </div>

              {/* Step 3 */}
              <div style={{ background: '#FFF', padding: '40px', borderRadius: '20px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                <div style={{ width: '56px', height: '56px', background: 'rgba(18, 199, 181, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', color: '#12C7B5', marginBottom: '24px', fontWeight: 'bold' }}>
                  3
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#0F2942', marginBottom: '12px' }}>Pay Securely</h3>
                <p style={{ color: '#64748B', lineHeight: '1.6' }}>Complete transaction securely using card gateways, Apple Pay, Google Pay, or secure instant EFT.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Powerful Dashboard Preview */}
        <section style={{ padding: '100px 24px', background: '#FFFFFF', borderTop: '1px solid #E5E7EB' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#12C7B5', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Management Suite</span>
              <h2 style={{ fontSize: '36px', fontWeight: 800, color: '#0F2942', marginTop: '12px', marginBottom: '16px' }}>Powerful Corporate Dashboard</h2>
              <p style={{ fontSize: '18px', color: '#64748B', maxWidth: '600px', margin: '0 auto' }}>Complete command over your branch locations, personnel profiles, transaction logs, and performance metrics.</p>
            </div>

            {/* Simulated Desktop Dashboard Mockup */}
            <div style={{
              background: '#0F2942',
              borderRadius: '24px',
              padding: '24px',
              boxShadow: '0 30px 60px -15px rgba(15, 41, 66, 0.3)',
              color: '#FFF',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '24px', minHeight: '450px' }}>
                {/* Sidebar */}
                <div style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: '16px', padding: '20px' }}>
                  <img src="/logo-footer.png" alt="ScanTippr" style={{ width: '110px', marginBottom: '40px' }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ background: 'rgba(18, 199, 181, 0.15)', color: '#12C7B5', padding: '10px 16px', borderRadius: '8px', fontWeight: 600, fontSize: '14px' }}>📊 Dashboard</div>
                    <div style={{ color: '#94A3B8', padding: '10px 16px', fontSize: '14px' }}>🏢 Companies</div>
                    <div style={{ color: '#94A3B8', padding: '10px 16px', fontSize: '14px' }}>👥 Employees</div>
                    <div style={{ color: '#94A3B8', padding: '10px 16px', fontSize: '14px' }}>💳 Transactions</div>
                    <div style={{ color: '#94A3B8', padding: '10px 16px', fontSize: '14px' }}>📈 Analytics</div>
                    <div style={{ color: '#94A3B8', padding: '10px 16px', fontSize: '14px' }}>⚙️ Settings</div>
                  </div>
                </div>

                {/* Main Panel */}
                <div style={{ background: '#F8FAFC', borderRadius: '16px', padding: '24px', color: '#0F2942' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Performance Metrics</h3>
                    <span style={{ fontSize: '13px', color: '#64748B', fontWeight: 500 }}>System Live • Bloemfontein HQ</span>
                  </div>

                  {/* Summary Cards */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                    <div style={{ background: '#FFF', padding: '20px', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
                      <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>TOTAL APPRECIATION</span>
                      <div style={{ fontSize: '24px', fontWeight: 800, color: '#0F2942', marginTop: '8px' }}>R25,430.00</div>
                    </div>
                    <div style={{ background: '#FFF', padding: '20px', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
                      <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>ACTIVE PERSONNEL</span>
                      <div style={{ fontSize: '24px', fontWeight: 800, color: '#0F2942', marginTop: '8px' }}>532</div>
                    </div>
                    <div style={{ background: '#FFF', padding: '20px', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
                      <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>CUSTOMER SCANS</span>
                      <div style={{ fontSize: '24px', fontWeight: 800, color: '#0F2942', marginTop: '8px' }}>1,248</div>
                    </div>
                  </div>

                  {/* Dynamic Table Preview */}
                  <div style={{ background: '#FFF', borderRadius: '12px', padding: '16px', border: '1px solid #E5E7EB' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '16px' }}>Recent Appreciations</h4>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #F1F5F9', fontSize: '13px' }}>
                      <span style={{ fontWeight: 600 }}>Mike Johnson (Sentry Sec)</span>
                      <span style={{ color: '#12C7B5', fontWeight: 700 }}>+R50.00</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #F1F5F9', fontSize: '13px' }}>
                      <span style={{ fontWeight: 600 }}>Sarah Williams (SafeZone)</span>
                      <span style={{ color: '#12C7B5', fontWeight: 700 }}>+R100.00</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Perfect For Every Industry */}
        <section id="industries" style={{ padding: '100px 24px', background: '#F8FAFC' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <h2 style={{ fontSize: '36px', fontWeight: 800, color: '#0F2942', marginBottom: '16px' }}>Perfect for Every Frontline Team</h2>
              <p style={{ fontSize: '18px', color: '#64748B' }}>Providing cashless convenience across different corporate sectors.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
              {['Security Companies', 'Car Guards', 'Fuel Stations', 'Restaurants', 'Hotels', 'Cleaning Services', 'Retail Stores', 'Corporate Offices'].map((industry) => (
                <div key={industry} style={{ background: '#FFF', padding: '24px', borderRadius: '16px', border: '1px solid #E5E7EB', textAlign: 'center', transition: 'all 0.2s', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                  <div style={{ fontSize: '28px', marginBottom: '12px' }}>🔒</div>
                  <span style={{ fontSize: '16px', fontWeight: 700, color: '#0F2942' }}>{industry}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Company Branding & Customizable Cards */}
        <section id="branding" style={{ padding: '100px 24px', background: '#FFFFFF' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#12C7B5', textTransform: 'uppercase', letterSpacing: '0.1em' }}>White-Label Capabilities</span>
              <h2 style={{ fontSize: '36px', fontWeight: 800, color: '#0F2942', marginTop: '12px', marginBottom: '16px' }}>Your Brand. Your Identity.</h2>
              <p style={{ fontSize: '18px', color: '#64748B' }}>Every enterprise can design high-end branded physical cards to match corporate design systems.</p>
            </div>

            {/* Custom Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
              {/* Blue Card */}
              <div style={{ background: '#0F2942', color: '#FFF', padding: '32px 24px', borderRadius: '20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#12C7B5', marginBottom: '16px' }}>SENTRY SECURITY</span>
                <img src="/ChatGPT Image Jul 12, 2026, 07_42_57 PM" alt="QR" style={{ width: '120px', height: '120px', background: '#FFF', padding: '10px', borderRadius: '12px', marginBottom: '16px' }} />
                <span style={{ fontWeight: 600 }}>Thank you!</span>
              </div>

              {/* Green Card */}
              <div style={{ background: '#0F5B46', color: '#FFF', padding: '32px 24px', borderRadius: '20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#4ADE80', marginBottom: '16px' }}>GREEN FIELD STATIONS</span>
                <img src="/ChatGPT Image Jul 12, 2026, 07_42_57 PM" alt="QR" style={{ width: '120px', height: '120px', background: '#FFF', padding: '10px', borderRadius: '12px', marginBottom: '16px' }} />
                <span style={{ fontWeight: 600 }}>Appreciation Portal</span>
              </div>

              {/* Orange Card */}
              <div style={{ background: '#C2410C', color: '#FFF', padding: '32px 24px', borderRadius: '20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#FB923C', marginBottom: '16px' }}>CITY GUARD TEAM</span>
                <img src="/ChatGPT Image Jul 12, 2026, 07_42_57 PM" alt="QR" style={{ width: '120px', height: '120px', background: '#FFF', padding: '10px', borderRadius: '12px', marginBottom: '16px' }} />
                <span style={{ fontWeight: 600 }}>Scan to Support</span>
              </div>

              {/* Red Card */}
              <div style={{ background: '#991B1B', color: '#FFF', padding: '32px 24px', borderRadius: '20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#F87171', marginBottom: '16px' }}>PREMIER HOTELS</span>
                <img src="/ChatGPT Image Jul 12, 2026, 07_42_57 PM" alt="QR" style={{ width: '120px', height: '120px', background: '#FFF', padding: '10px', borderRadius: '12px', marginBottom: '16px' }} />
                <span style={{ fontWeight: 600 }}>Thank Our Team</span>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" style={{ padding: '100px 24px', background: '#F8FAFC', borderTop: '1px solid #E5E7EB' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <h2 style={{ fontSize: '36px', fontWeight: 800, color: '#0F2942', marginBottom: '16px' }}>Flexible Plans For Every Team Size</h2>
              <p style={{ fontSize: '18px', color: '#64748B' }}>Scaling seamlessly from local operations to multinational enterprises.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr 1fr', gap: '32px', alignItems: 'center' }}>
              {/* Starter */}
              <div style={{ background: '#FFF', padding: '40px', borderRadius: '20px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#0F2942', marginBottom: '8px' }}>Starter</h3>
                <div style={{ fontSize: '32px', fontWeight: 800, color: '#0F2942', marginBottom: '24px' }}>Free <span style={{ fontSize: '14px', color: '#64748B', fontWeight: 500 }}>/ month</span></div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', display: 'flex', flexDirection: 'column', gap: '12px', color: '#475569' }}>
                  <li>✓ Up to 10 Employees</li>
                  <li>✓ Standard QR Card Designs</li>
                  <li>✓ Weekly Transaction Reports</li>
                  <li>✓ Next-Day Payout Settlement</li>
                </ul>
                <a href="mailto:info@scantippr.co.za" style={{ display: 'block', textTransform: 'none', textDecoration: 'none', textAlign: 'center', padding: '12px 0', border: '2px solid #0F2942', color: '#0F2942', borderRadius: '10px', fontWeight: 600 }}>Get Started</a>
              </div>

              {/* Professional (Highlighted) */}
              <div style={{ background: '#0F2942', color: '#FFF', padding: '48px', borderRadius: '24px', boxShadow: '0 20px 40px -10px rgba(15, 41, 66, 0.3)', border: '2px solid #12C7B5', transform: 'scale(1.05)' }}>
                <div style={{ display: 'inline-block', background: '#12C7B5', color: '#0F2942', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, marginBottom: '16px' }}>MOST POPULAR</div>
                <h3 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Professional</h3>
                <div style={{ fontSize: '36px', fontWeight: 800, marginBottom: '24px' }}>Custom pricing <span style={{ fontSize: '14px', color: '#94A3B8', fontWeight: 500 }}>/ branch</span></div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', display: 'flex', flexDirection: 'column', gap: '12px', color: '#94A3B8' }}>
                  <li style={{ color: '#FFF' }}>✓ Unlimited Employees</li>
                  <li style={{ color: '#FFF' }}>✓ Custom Branding & White-Labeling</li>
                  <li style={{ color: '#FFF' }}>✓ Advanced Live Analytics & Dashboards</li>
                  <li style={{ color: '#FFF' }}>✓ Priority Instant Support SLA</li>
                </ul>
                <a href="mailto:info@scantippr.co.za?subject=Professional Plan Request" style={{ display: 'block', textDecoration: 'none', textAlign: 'center', padding: '14px 0', background: '#12C7B5', color: '#0F2942', borderRadius: '10px', fontWeight: 700, boxShadow: '0 4px 12px rgba(18, 199, 181, 0.3)' }}>Contact Sales</a>
              </div>

              {/* Enterprise */}
              <div style={{ background: '#FFF', padding: '40px', borderRadius: '20px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#0F2942', marginBottom: '8px' }}>Enterprise</h3>
                <div style={{ fontSize: '32px', fontWeight: 800, color: '#0F2942', marginBottom: '24px' }}>Tailored <span style={{ fontSize: '14px', color: '#64748B', fontWeight: 500 }}>/ volume</span></div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', display: 'flex', flexDirection: 'column', gap: '12px', color: '#475569' }}>
                  <li>✓ Multi-Branch Infrastructure</li>
                  <li>✓ Dedicated System Account Manager</li>
                  <li>✓ Integrated Custom Payroll Syncing API</li>
                  <li>✓ Strict Custom Security Integrations</li>
                </ul>
                <a href="mailto:info@scantippr.co.za" style={{ display: 'block', textDecoration: 'none', textAlign: 'center', padding: '12px 0', border: '2px solid #0F2942', color: '#0F2942', borderRadius: '10px', fontWeight: 600 }}>Contact Enterprise</a>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs Accordion */}
        <section style={{ padding: '100px 24px', background: '#FFFFFF' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <h2 style={{ fontSize: '36px', fontWeight: 800, color: '#0F2942', marginBottom: '16px' }}>Frequently Asked Questions</h2>
              <p style={{ fontSize: '18px', color: '#64748B' }}>Everything you need to know about setting up and running ScanTippr.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { q: "How does ScanTippr work?", a: "Every employee is assigned a unique, high-quality branded QR card. When a customer scans it with their phone camera, it launches a secure tipping page instantly, allowing the customer to select an appreciation amount and complete payment seamlessly without registering an account." },
                { q: "How are payments securely processed?", a: "Payments are safely processed using modern secure gateways. We natively integrate with reliable providers supporting leading debit/credit networks, Apple Pay, Google Pay, and secure instant EFT options to maintain top-tier transaction compliance." },
                { q: "Can we completely customize our QR cards?", a: "Yes, fully! Your company dashboard enables complete control over card branding, logos, accent colors, corporate metadata, and layout presets to ensure every card reflects your brand identity." },
                { q: "How quickly do our employees receive payouts?", a: "Payout cycles are highly flexible. System administrators can configure automated direct settlement cycles (daily, weekly, or monthly) matching existing enterprise payroll requirements perfectly." },
                { q: "Can we configure and manage multiple branches?", a: "Yes, ScanTippr supports robust multi-tenant organization models. You can easily partition departments, branches, locations, and direct supervisors while retaining top-level centralized reporting across the company." }
              ].map((faq, idx) => (
                <div key={idx} style={{ border: '1px solid #E5E7EB', borderRadius: '12px', padding: '20px', cursor: 'pointer' }} onClick={() => toggleFaq(idx)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#0F2942', margin: 0 }}>{faq.q}</h4>
                    <span style={{ fontSize: '18px', color: '#12C7B5', fontWeight: 'bold' }}>{activeFaq === idx ? '−' : '+'}</span>
                  </div>
                  {activeFaq === idx && (
                    <p style={{ marginTop: '12px', fontSize: '15px', color: '#475569', lineHeight: '1.6', margin: '12px 0 0 0' }}>{faq.a}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section style={{ padding: '100px 24px', background: '#0F2942', color: '#FFF', textAlign: 'center' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '42px', fontWeight: 800, marginBottom: '24px' }}>Ready to modernize employee appreciation?</h2>
            <p style={{ fontSize: '18px', color: '#94A3B8', marginBottom: '40px' }}>Join leading enterprises making employee feedback secure, structured, and modern.</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
              <a href="mailto:info@scantippr.co.za?subject=Demo Request" style={{
                padding: '16px 32px',
                background: '#12C7B5',
                color: '#0F2942',
                borderRadius: '12px',
                fontWeight: 700,
                textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(18, 199, 181, 0.4)'
              }}>
                Book a Demo
              </a>
              <a href="mailto:info@scantippr.co.za" style={{
                padding: '16px 32px',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                color: '#FFF',
                borderRadius: '12px',
                fontWeight: 600,
                textDecoration: 'none'
              }}>
                Contact Sales
              </a>
            </div>
          </div>
        </section>

        {/* Global Footer */}
        <footer style={{ background: '#111e29', padding: '4rem 2rem 2rem 2rem' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '48px', marginBottom: '48px' }}>
              <div>
                {/* Footer Logo Pill */}
                <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '1.5rem' }}>
                  <div style={{ 
                    background: '#ffffff', 
                    padding: '8px 18px', 
                    borderRadius: '8px', 
                    display: 'inline-flex', 
                    alignItems: 'center',
                    width: '140px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}>
                    <img 
                      src="/logo-main" 
                      alt="ScanTippr Logo" 
                      style={{ width: '100%', height: 'auto', objectFit: 'contain' }} 
                    />
                  </div>
                </div>
                <p style={{ color: '#94A3B8', fontSize: '14px', lineHeight: '1.6', maxWidth: '240px' }}>
                  Secure, corporate cashless systems empowering enterprise employee appreciation.
                </p>
              </div>

              <div>
                <h4 style={{ color: '#FFF', fontSize: '15px', fontWeight: 700, marginBottom: '20px' }}>Platform</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
                  <a href="#features" style={{ color: '#94A3B8', textDecoration: 'none' }}>Features</a>
                  <a href="#how-it-works" style={{ color: '#94A3B8', textDecoration: 'none' }}>How It Works</a>
                  <a href="#pricing" style={{ color: '#94A3B8', textDecoration: 'none' }}>Pricing</a>
                </div>
              </div>

              <div>
                <h4 style={{ color: '#FFF', fontSize: '15px', fontWeight: 700, marginBottom: '20px' }}>Resources</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
                  <span style={{ color: '#94A3B8' }}>Help Docs</span>
                  <span style={{ color: '#94A3B8' }}>Compliance</span>
                  <span style={{ color: '#94A3B8' }}>Integrations</span>
                </div>
              </div>

              <div>
                <h4 style={{ color: '#FFF', fontSize: '15px', fontWeight: 700, marginBottom: '20px' }}>Contact</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: '#94A3B8' }}>
                  <span>✉️ info@scantippr.co.za</span>
                  <span>📞 +27 12 345 6789</span>
                  <span>📍 South Africa</span>
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: '#64748B' }}>
              <span>© 2026 ScanTippr. All rights reserved.</span>
              <div style={{ display: 'flex', gap: '24px' }}>
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