import React from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { ShieldAlert, ArrowUp, BookOpen } from 'lucide-react';

export const Footer = () => {
  const { navigateToControlRoom, setResearchDrawerOpen } = useTelemetry();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer 
      style={{
        backgroundColor: 'var(--bg-mine-black)',
        borderTop: '1px solid var(--panel-border)',
        padding: '4rem 2rem 3rem',
        position: 'relative'
      }}
    >
      <div 
        style={{
          maxWidth: 'var(--site-max-width)',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '3rem'
        }}
      >
        <div 
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '2rem'
          }}
        >
          {/* Left Column: Brand & SIH Notice */}
          <div style={{ maxWidth: '480px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <div 
                style={{
                  width: '28px',
                  height: '28px',
                  backgroundColor: 'var(--bg-graphite)',
                  border: '1px solid var(--accent-amber)',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-amber)'
                }}
              >
                <ShieldAlert size={16} />
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-white)' }}>
                NMDC // MINE VEHICLE SAFETY & OPERATIONS MANAGEMENT SYSTEM
              </span>
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1rem' }}>
              Smart India Hackathon (SIH) prototype inspired by the NMDC mine-vehicle safety problem statement. 
              Demonstrating connected edge sensing, real-time wireless telemetry, and risk-aware decision support for low-visibility haul operations.
            </p>

            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-dim)' }}>
              PROTOTYPE CLASSIFICATION: EMBEDDED RESEARCH PROOF-OF-CONCEPT
            </div>
          </div>

          {/* Right Column: Quick Links & Actions */}
          <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
            <div>
              <div className="system-label-subtle" style={{ marginBottom: '0.75rem' }}>
                ARCHITECTURE
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem' }}>
                <li><a href="#section-mining-scale" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Mining at Scale</a></li>
                <li><a href="#section-problem" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>The Problem</a></li>
                <li><a href="#section-scenario" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>V01 & V02 Scenario</a></li>
                <li><a href="#section-architecture" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>System Data Flow</a></li>
                <li><a href="#section-prototype" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Physical Hardware</a></li>
              </ul>
            </div>

            <div>
              <div className="system-label-subtle" style={{ marginBottom: '0.75rem' }}>
                OPERATIONS
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem' }}>
                <li>
                  <button 
                    onClick={navigateToControlRoom} 
                    style={{ background: 'none', border: 'none', color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', textAlign: 'left', padding: 0 }}
                  >
                    ENTER CONTROL ROOM →
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setResearchDrawerOpen(true)} 
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer', textAlign: 'left', padding: 0 }}
                  >
                    Technical Foundation
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar with return-to-top */}
        <div 
          style={{
            borderTop: '1px solid var(--panel-border-subtle)',
            paddingTop: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.68rem',
            color: 'var(--text-dim)'
          }}
        >
          <div>
            © {new Date().getFullYear()} NMDC MINE VEHICLE SAFETY SYSTEM // SIH RESEARCH PROTOTYPE
          </div>

          <button 
            onClick={scrollToTop}
            style={{
              background: 'var(--bg-graphite)',
              border: '1px solid var(--panel-border)',
              color: 'var(--text-muted)',
              padding: '0.4rem 0.8rem',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.68rem'
            }}
          >
            <span>RETURN TO TOP</span>
            <ArrowUp size={12} />
          </button>
        </div>
      </div>
    </footer>
  );
};
