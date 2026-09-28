import React, { useState } from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { Sliders, TrendingUp, Info } from 'lucide-react';

export const MiningScaleSection = () => {
  const { currentProductionMTPA, setCurrentProductionMTPA, visionProductionMTPA } = useTelemetry();
  const [showConfig, setShowConfig] = useState(false);

  return (
    <section 
      id="section-mining-scale"
      style={{
        padding: '5rem 2rem',
        maxWidth: 'var(--site-max-width)',
        margin: '0 auto',
        width: '100%',
        position: 'relative',
        borderBottom: '1px solid var(--panel-border-subtle)'
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Section Label */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div className="system-label">
            <span className="status-dot amber" />
            OPERATIONAL CONTEXT // NMDC PRODUCTION SCALE
          </div>

          {/* Configurator button for SIH judges / problem statement variations */}
          <button
            onClick={() => setShowConfig(!showConfig)}
            style={{
              background: 'transparent',
              border: '1px solid var(--panel-border)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.68rem',
              padding: '0.35rem 0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              cursor: 'pointer'
            }}
          >
            <Sliders size={12} />
            <span>CONFIGURE BASELINE</span>
          </button>
        </div>

        {/* Headline */}
        <h2 
          className="heading-editorial" 
          style={{ 
            fontSize: 'clamp(2.2rem, 4vw, 3.4rem)',
            marginBottom: '1.5rem',
            color: 'var(--text-white)'
          }}
        >
          MINING AT SCALE
        </h2>

        {/* Editorial Context Quote */}
        <p 
          style={{
            fontSize: '1.25rem',
            color: 'var(--text-white)',
            lineHeight: 1.6,
            marginBottom: '3rem',
            maxWidth: '850px',
            fontWeight: 400
          }}
        >
          “As mining operations scale, connected monitoring and decision-support systems become increasingly relevant to safe and efficient vehicle operations.”
        </p>

        {/* Configurator drawer if opened */}
        {showConfig && (
          <div 
            style={{
              backgroundColor: 'var(--bg-graphite)',
              border: '1px solid var(--panel-border-active)',
              padding: '1rem 1.5rem',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Info size={16} color="#F5A623" />
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                SIH Problem Statement Baseline Customizer (Adjust baseline if your challenge prompt states 40, 44 or 45 MTPA):
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <input
                type="number"
                value={currentProductionMTPA}
                onChange={(e) => setCurrentProductionMTPA(Number(e.target.value))}
                style={{
                  backgroundColor: 'var(--bg-mine-black)',
                  border: '1px solid var(--panel-border)',
                  color: 'var(--accent-amber)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.9rem',
                  padding: '0.3rem 0.6rem',
                  borderRadius: 'var(--radius-sm)',
                  width: '80px'
                }}
              />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-white)' }}>MTPA</span>
            </div>
          </div>
        )}

        {/* Two Large Numerical Elements */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '2.5rem',
            marginBottom: '2.5rem'
          }}
          className="scale-numbers-grid"
        >
          {/* Card 1: Current Production */}
          <div 
            className="industrial-corners"
            style={{
              backgroundColor: 'var(--bg-graphite)',
              border: '1px solid var(--panel-border)',
              padding: '2.5rem 2rem',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div className="system-label-subtle" style={{ marginBottom: '0.75rem' }}>
                CURRENT METRIC
              </div>
              <div 
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'clamp(3rem, 6vw, 4.5rem)',
                  fontWeight: 800,
                  color: 'var(--text-white)',
                  lineHeight: 1,
                  marginBottom: '1rem'
                }}
              >
                {currentProductionMTPA}+ <span style={{ fontSize: '1.75rem', color: 'var(--accent-amber)' }}>MTPA</span>
              </div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-white)', letterSpacing: '0.04em' }}>
                CURRENT IRON ORE PRODUCTION
              </div>
            </div>

            <div 
              style={{
                marginTop: '1.5rem',
                paddingTop: '1rem',
                borderTop: '1px solid var(--panel-border-subtle)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                color: 'var(--text-dim)'
              }}
            >
              SOURCE: NMDC Annual Report 2024–25
            </div>
          </div>

          {/* Card 2: 2030 Vision */}
          <div 
            className="industrial-corners"
            style={{
              backgroundColor: 'var(--bg-graphite)',
              border: '1px solid var(--panel-border)',
              padding: '2.5rem 2rem',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div className="system-label-subtle" style={{ marginBottom: '0.75rem' }}>
                STRATEGIC ROADMAP
              </div>
              <div 
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'clamp(3rem, 6vw, 4.5rem)',
                  fontWeight: 800,
                  color: 'var(--accent-amber)',
                  lineHeight: 1,
                  marginBottom: '1rem'
                }}
              >
                {visionProductionMTPA} <span style={{ fontSize: '1.75rem', color: 'var(--text-white)' }}>MTPA</span>
              </div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-white)', letterSpacing: '0.04em' }}>
                2030 PRODUCTION VISION
              </div>
            </div>

            <div 
              style={{
                marginTop: '1.5rem',
                paddingTop: '1rem',
                borderTop: '1px solid var(--panel-border-subtle)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                color: 'var(--text-dim)'
              }}
            >
              LONG-TERM TARGET // INCREASED VEHICULAR HAULAGE DENSITY
            </div>
          </div>
        </div>

        {/* Technical Boundary Note */}
        <div 
          style={{
            backgroundColor: 'rgba(21, 26, 24, 0.5)',
            borderLeft: '2px solid var(--accent-amber)',
            padding: '1rem 1.25rem',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            lineHeight: 1.5
          }}
        >
          <strong style={{ color: 'var(--text-white)', fontFamily: 'var(--font-mono)' }}>SYSTEM BOUNDARY & CONTEXT:</strong> As haul truck density and dispatch frequency increase to meet national extraction targets, open-cast pit corridors face elevated blind-spot risks. This student research platform explores how embedded microcontrollers and edge telemetry can augment driver situational awareness without demanding cost-prohibitive production avionics.
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .scale-numbers-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};
