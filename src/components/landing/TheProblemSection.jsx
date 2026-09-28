import React from 'react';
import { ArrowRight } from 'lucide-react';

export const TheProblemSection = () => {
  const steps = [
    { title: 'FOG', desc: 'Dense fog or heavy dust descends on the haul road.' },
    { title: 'LOW VISIBILITY', desc: 'Driver sight distance drops significantly.' },
    { title: 'LESS AWARENESS', desc: 'Harder to judge distance to nearby vehicles.' },
    { title: 'VEHICLE RISK', desc: 'Collision probability rises; operations slow or stop.' }
  ];

  return (
    <section 
      id="section-problem"
      style={{
        padding: '5rem 1.5rem',
        maxWidth: 'var(--site-max-width)',
        margin: '0 auto',
        borderTop: '1px solid var(--panel-border-subtle)'
      }}
    >
      <div className="problem-heading reveal-on-scroll" style={{ maxWidth: '820px', marginBottom: '2rem' }}>
        <div className="system-label section-kicker" style={{ marginBottom: '1rem' }}>
          <span className="status-dot amber" />
          THE PROBLEM
        </div>

        <h2 
          className="heading-editorial section-title"
          style={{
            fontSize: 'clamp(2rem, 3.8vw, 3rem)',
            marginBottom: '1.25rem'
          }}
        >
          WHEN VISIBILITY DROPS, <br />
          <span style={{ color: 'var(--accent-amber)' }}>THE DRIVER SEES LESS.</span>
        </h2>

        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
          Dense fog and poor visibility make it harder for mine-vehicle drivers to identify nearby vehicles and obstacles. 
          This can increase collision risk and force vehicles to slow down or stop.
        </p>
      </div>

      <div className="visibility-demo reveal-on-scroll" aria-label="Illustration of visibility decreasing in fog">
        <div className="visibility-caption"><span>CLEAR VISIBILITY</span><span>LOW VISIBILITY</span></div>
        <div className="visibility-segments" aria-hidden="true">{Array.from({ length: 20 }, (_, i) => <span className="visibility-segment" key={i} />)}</div>
      </div>

      {/* Simple 4-Step Sequence: FOG -> LOW VISIBILITY -> LESS AWARENESS -> VEHICLE RISK */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1.25rem'
        }}
        className="problem-steps-grid"
      >
        {steps.map((step, idx) => (
          <div className="problem-step"
            key={step.title}
            style={{
              backgroundColor: 'var(--bg-graphite)',
              border: `1px solid ${idx === 3 ? 'var(--status-critical)' : 'var(--panel-border)'}`,
              borderRadius: 'var(--radius-sm)',
              padding: '1.5rem 1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--accent-amber)', fontWeight: 700 }}>
                0{idx + 1}
              </span>
              {idx < 3 && <ArrowRight size={14} color="#95A39B" className="step-arrow" />}
            </div>

            <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', fontWeight: 800, color: idx === 3 ? 'var(--status-critical)' : 'var(--text-white)' }}>
              {step.title}
            </h3>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              {step.desc}
            </p>
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .problem-steps-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 480px) {
          .problem-steps-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};
