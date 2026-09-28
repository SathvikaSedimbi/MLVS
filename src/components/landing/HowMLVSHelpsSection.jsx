import React from 'react';
import { Eye, CheckSquare, Navigation } from 'lucide-react';

export const HowMLVSHelpsSection = () => {
  const concepts = [
    {
      num: '01',
      title: 'SENSE',
      desc: 'The ultrasonic sensor checks for nearby vehicles or obstacles. The LDR senses the visibility condition.'
    },
    {
      num: '02',
      title: 'ASSESS',
      desc: 'The servo turns the sensor through left, centre and right to compare available clearance.'
    },
    {
      num: '03',
      title: 'GUIDE',
      desc: 'The OLED, buzzer and LEDs alert the driver and recommend MOVE LEFT, MOVE RIGHT or STOP.'
    }
  ];

  return (
    <section 
      id="section-how-it-works"
      style={{
        padding: '5rem 1.5rem',
        maxWidth: 'var(--site-max-width)',
        margin: '0 auto',
        borderTop: '1px solid var(--panel-border-subtle)'
      }}
    >
      <div style={{ maxWidth: '820px', marginBottom: '3rem' }}>
        <div className="system-label" style={{ marginBottom: '1rem' }}>
          <span className="status-dot amber" />
          HOW MLVS HELPS
        </div>

        <h2 
          className="heading-editorial"
          style={{
            fontSize: 'clamp(2rem, 3.8vw, 3rem)',
            marginBottom: '1.25rem'
          }}
        >
          MLVS ADDS ANOTHER LAYER <br />
          <span style={{ color: 'var(--accent-amber)' }}>OF AWARENESS.</span>
        </h2>

        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
          MLVS uses low-cost sensors to detect nearby obstacles, understand the surrounding clearance and provide an actionable recommendation to the driver.
        </p>
      </div>

      {/* 3 Simple Concepts: SENSE, ASSESS, GUIDE */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1.5rem'
        }}
        className="concepts-grid"
      >
        {concepts.map((concept) => (
          <div 
            key={concept.num}
            style={{
              backgroundColor: 'var(--bg-graphite)',
              border: '1px solid var(--panel-border)',
              borderRadius: 'var(--radius-sm)',
              padding: '2rem 1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}
          >
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-amber)' }}>
              {concept.num}
            </div>

            <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-white)' }}>
              {concept.title}
            </h3>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              {concept.desc}
            </p>
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .concepts-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};
