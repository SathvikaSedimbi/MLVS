import React from 'react';
import { Eye, Radio, Brain, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const SolutionPillars = () => {
  const pillars = [
    {
      num: '01',
      title: 'SENSE',
      tagline: 'Proximity, Vehicle-State & Environmental Sensing',
      desc: 'Multimodal edge sensor array acquiring environmental opacity (LDR/LED optical attenuation pair) alongside spatial proximity sweeps (ultrasonic transducers on front and lateral sectors) and wheel encoder telemetry for calibrated ground speed.',
      metrics: [
        { label: 'PROXIMITY RANGE', val: '20 cm – 400 cm' },
        { label: 'ENVIRONMENT', val: 'Optical Fog Index' },
        { label: 'ODOMETRY', val: 'Optical Wheel Encoder' }
      ]
    },
    {
      num: '02',
      title: 'COMMUNICATE',
      tagline: 'Edge Telemetry & Inter-Vehicle Data Flow',
      desc: 'Microcontroller encodes packetized vehicle frames (ID, speed, three-axis distance, optical index, battery state) and broadcasts across 2.4 GHz wireless RF channels to the central Control Room hub, with optional V2V beacon reception from nearby nodes.',
      metrics: [
        { label: 'TELEMETRY BUS', val: 'RF 2.4 GHz / ESP' },
        { label: 'UPDATE RATE', val: '20 Hz Packet Cycle' },
        { label: 'V2V STATUS', val: 'Node-to-Node Telemetry' }
      ]
    },
    {
      num: '03',
      title: 'ASSESS',
      tagline: 'Multi-Factor Dynamic Risk Engine',
      desc: 'Rather than relying on isolated threshold alarms, the Risk Engine fuses proximity echo margins, closing rate (Δd/Δt), dynamic Time-to-Collision (TTC), and the real-time visibility coefficient into an explainable, auditable hazard classification.',
      metrics: [
        { label: 'ALGORITHM', val: 'Fused Proximity-Visibility' },
        { label: 'TTC METRIC', val: 'Kinematic Time-to-Collision' },
        { label: 'TRANSPARENCY', val: 'Factorized Explainability' }
      ]
    },
    {
      num: '04',
      title: 'RESPOND',
      tagline: 'Tiered Safety Intervention & Feedback Loop',
      desc: 'Depending on the severity tier, the system initiates cabin advisory alerts, issues proactive speed-governor throttling commands, or triggers prototype emergency motor cutoffs via the onboard motor driver to prevent imminent impact.',
      metrics: [
        { label: 'LEVEL 1', val: 'Cabin Visual & Audio Warning' },
        { label: 'LEVEL 2', val: 'Automated Speed Throttling' },
        { label: 'LEVEL 3', val: 'Direct Motor Cutoff Command' }
      ]
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
        {/* Section Label */}
        <div className="system-label" style={{ marginBottom: '1.25rem' }}>
          <span className="status-dot amber" />
          SYSTEM SOLUTION // SENSING TO ACTUATION PIPELINE
        </div>

        {/* Headline */}
        <h2 
          className="heading-editorial" 
          style={{ 
            fontSize: 'clamp(2.2rem, 4vw, 3.6rem)',
            marginBottom: '1.5rem',
            lineHeight: 1.08
          }}
        >
          FROM SENSING <br />
          <span style={{ color: 'var(--accent-amber)' }}>TO SAFETY RESPONSE.</span>
        </h2>

        <p 
          style={{
            fontSize: '1.15rem',
            color: 'var(--text-muted)',
            lineHeight: 1.6,
            maxWidth: '780px',
            marginBottom: '3.5rem'
          }}
        >
          A unified, deterministic safety architecture engineered to close the feedback loop between physical mine conditions and machine intervention.
        </p>

        {/* Editorial Four Pillars Layout */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '2.5rem'
          }}
          className="pillars-grid"
        >
          {pillars.map((pillar) => (
            <div 
              key={pillar.num}
              className="industrial-corners"
              style={{
                backgroundColor: 'var(--bg-graphite)',
                border: '1px solid var(--panel-border)',
                borderRadius: 'var(--radius-md)',
                padding: '2.5rem 2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'border-color 0.2s ease'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span 
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '1.8rem',
                      fontWeight: 800,
                      color: 'var(--accent-amber)',
                      lineHeight: 1
                    }}
                  >
                    {pillar.num}
                  </span>
                  <span className="system-label-subtle">
                    CORE DISCIPLINE
                  </span>
                </div>

                <h3 
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '1.4rem',
                    fontWeight: 800,
                    color: 'var(--text-white)',
                    marginBottom: '0.4rem',
                    letterSpacing: '-0.01em'
                  }}
                >
                  {pillar.title}
                </h3>

                <div 
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    color: 'var(--accent-amber)',
                    marginBottom: '1rem',
                    fontWeight: 600
                  }}
                >
                  {pillar.tagline}
                </div>

                <p 
                  style={{
                    fontSize: '0.88rem',
                    color: 'var(--text-muted)',
                    lineHeight: 1.6,
                    marginBottom: '1.75rem'
                  }}
                >
                  {pillar.desc}
                </p>
              </div>

              {/* Technical Specifications Strip */}
              <div 
                style={{
                  borderTop: '1px solid var(--panel-border-subtle)',
                  paddingTop: '1.25rem',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '0.75rem'
                }}
              >
                {pillar.metrics.map((m) => (
                  <div key={m.label}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-dim)', marginBottom: '0.2rem' }}>
                      {m.label}
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-white)' }}>
                      {m.val}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .pillars-grid {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
        }
      `}</style>
    </section>
  );
};
