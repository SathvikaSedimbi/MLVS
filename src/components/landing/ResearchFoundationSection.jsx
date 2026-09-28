import React from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { BookOpen, ArrowRight, ShieldCheck, Compass, Radio, Cpu } from 'lucide-react';

export const ResearchFoundationSection = () => {
  const { setResearchDrawerOpen } = useTelemetry();

  const areas = [
    {
      title: 'PROXIMITY & COLLISION AWARENESS',
      code: 'DOM-01',
      desc: 'Evaluating ultrasonic acoustic propagation in high-dust and fluctuating ambient humidity environments. Establishing minimum reliable detection cones.'
    },
    {
      title: 'VISIBILITY-AWARE MONITORING',
      code: 'DOM-02',
      desc: 'Quantifying Lambert-Beer optical attenuation curves via photodiode-emitter pairs under controlled fog density to generate an objective opacity index.'
    },
    {
      title: 'CONNECTED VEHICLE COMMUNICATION',
      code: 'DOM-03',
      desc: 'Low-latency broadcast topologies and packet loss characteristics over unlicensed 2.4 GHz industrial RF spectra inside pit topography.'
    },
    {
      title: 'RISK-AWARE DECISION SUPPORT',
      code: 'DOM-04',
      desc: 'Formulating kinematic Time-to-Collision (TTC) coupled with non-linear environmental visibility penalty factors for explainable decision support.'
    }
  ];

  return (
    <section 
      style={{
        padding: '5rem 2rem',
        maxWidth: 'var(--site-max-width)',
        margin: '0 auto',
        width: '100%',
        borderBottom: '1px solid var(--panel-border-subtle)'
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Label */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div className="system-label">
            <span className="status-dot amber" />
            SCIENTIFIC METHODOLOGY // THEORETICAL BASIS
          </div>

          <button
            onClick={() => setResearchDrawerOpen(true)}
            className="btn-secondary"
            style={{ padding: '0.4rem 0.9rem', fontSize: '0.72rem', gap: '0.4rem' }}
          >
            <BookOpen size={13} />
            <span>VIEW TECHNICAL FOUNDATION</span>
            <ArrowRight size={13} />
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
          RESEARCH-INFORMED. <br />
          <span style={{ color: 'var(--accent-amber)' }}>PROTOTYPE-VALIDATED.</span>
        </h2>

        <p 
          style={{
            fontSize: '1.1rem',
            color: 'var(--text-muted)',
            lineHeight: 1.6,
            maxWidth: '820px',
            marginBottom: '3rem'
          }}
        >
          Grounding sensor selection, acoustic dispersion, optical attenuation, and risk decision math in peer-reviewed mining safety principles.
        </p>

        {/* 4 Research Domains Grid */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1.75rem',
            marginBottom: '2.5rem'
          }}
          className="research-grid"
        >
          {areas.map((area) => (
            <div 
              key={area.code}
              style={{
                backgroundColor: 'var(--bg-graphite)',
                border: '1px solid var(--panel-border)',
                borderRadius: 'var(--radius-sm)',
                padding: '1.75rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--accent-amber)', fontWeight: 700 }}>
                    {area.code}
                  </span>
                  <span className="system-label-subtle">ACADEMIC FOUNDATION</span>
                </div>
                <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-white)', marginBottom: '0.5rem' }}>
                  {area.title}
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  {area.desc}
                </p>
              </div>

              <div 
                style={{
                  marginTop: '1.25rem',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid var(--panel-border-subtle)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.66rem',
                  color: 'var(--text-dim)'
                }}
              >
                STATUS: METHODOLOGY BENCHMARKED // EMPIRICAL VALIDATION ACTIVE
              </div>
            </div>
          ))}
        </div>

        {/* Action Link to Drawer */}
        <div style={{ textAlign: 'center' }}>
          <button 
            onClick={() => setResearchDrawerOpen(true)}
            className="btn-primary"
            style={{ padding: '0.85rem 1.8rem', fontSize: '0.82rem' }}
          >
            <span>VIEW TECHNICAL FOUNDATION & EQUATIONS</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .research-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};
