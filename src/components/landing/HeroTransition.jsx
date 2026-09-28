import React, { useState, useEffect } from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { Radio, ArrowDown, Cpu, Network, ShieldCheck } from 'lucide-react';

export const HeroTransition = () => {
  const { frontDistance, visibilityIndex, v01Speed } = useTelemetry();
  const [pulseIndex, setPulseIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPulseIndex((prev) => (prev + 1) % 4);
    }, 1200);
    return () => clearInterval(timer);
  }, []);

  const pipelineStages = [
    { id: '01', title: 'ONBOARD SENSING', desc: 'Ultrasonic echo + LDR attenuation', val: `${frontDistance} cm | ${visibilityIndex}% Vis` },
    { id: '02', title: 'STM32 NUCLEO MCU', desc: 'Hardware interrupt sampling & ADC', val: '100 Hz Sampling' },
    { id: '03', title: 'WIRELESS TELEMETRY', desc: '2.4 GHz RF / ESP packet broadcast', val: 'Payload: 32 bytes' },
    { id: '04', title: 'CONTROL ROOM INGEST', desc: 'Real-time situational awareness engine', val: 'Latency: 18 ms' }
  ];

  return (
    <div 
      style={{
        position: 'relative',
        padding: '3rem 2rem 4rem',
        maxWidth: 'var(--site-max-width)',
        margin: '0 auto',
        width: '100%',
        overflow: 'hidden'
      }}
    >
      {/* Central Visual Data Flow Bridge */}
      <div 
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative'
        }}
      >
        {/* Animated Data Stream Line */}
        <div 
          style={{
            width: '2px',
            height: '70px',
            background: 'linear-gradient(to bottom, #F5A623, rgba(245, 166, 35, 0.2))',
            position: 'relative'
          }}
        >
          <div 
            style={{
              position: 'absolute',
              top: '0',
              left: '-3px',
              width: '8px',
              height: '8px',
              backgroundColor: '#F5A623',
              borderRadius: '50%',
              boxShadow: '0 0 12px #F5A623',
              animation: 'data-flow 2s infinite ease-in-out'
            }}
          />
        </div>

        {/* Transition Continuity Header Badge */}
        <div 
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.6rem',
            backgroundColor: 'var(--bg-graphite)',
            border: '1px solid var(--panel-border-active)',
            padding: '0.4rem 1rem',
            borderRadius: '20px',
            boxShadow: '0 0 20px rgba(245, 166, 35, 0.1)',
            marginBottom: '2rem',
            zIndex: 2
          }}
        >
          <span className="status-dot amber" />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-amber)', letterSpacing: '0.12em' }}>
            CONTINUOUS DATA STREAM // V01 TO CONTROL ROOM
          </span>
        </div>

        {/* 4-Stage Horizontal Pipeline Visualizer */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1.25rem',
            width: '100%',
            maxWidth: '1100px',
            position: 'relative'
          }}
          className="pipeline-grid"
        >
          {/* Connecting line behind stages */}
          <div 
            style={{
              position: 'absolute',
              top: '24px',
              left: '10%',
              right: '10%',
              height: '1px',
              backgroundColor: 'var(--panel-border)',
              zIndex: 0
            }}
          />

          {pipelineStages.map((stage, idx) => {
            const isActive = pulseIndex === idx;
            return (
              <div 
                key={stage.id}
                style={{
                  position: 'relative',
                  zIndex: 1,
                  backgroundColor: isActive ? 'var(--bg-graphite-light)' : 'var(--bg-graphite)',
                  border: `1px solid ${isActive ? 'var(--accent-amber)' : 'var(--panel-border)'}`,
                  borderRadius: 'var(--radius-sm)',
                  padding: '1.2rem 1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  transition: 'all 0.3s ease',
                  boxShadow: isActive ? '0 0 25px rgba(245, 166, 35, 0.15)' : 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', fontWeight: 700, color: isActive ? 'var(--accent-amber)' : 'var(--text-dim)' }}>
                    PHASE {stage.id}
                  </span>
                  <span className={`status-dot ${isActive ? 'amber' : 'safe'}`} style={{ width: '6px', height: '6px' }} />
                </div>

                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-white)', letterSpacing: '0.02em' }}>
                  {stage.title}
                </div>

                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  {stage.desc}
                </div>

                <div 
                  style={{
                    marginTop: '0.4rem',
                    paddingTop: '0.5rem',
                    borderTop: '1px solid var(--panel-border-subtle)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.68rem',
                    color: isActive ? 'var(--accent-amber)' : 'var(--text-dim)',
                    fontWeight: 600
                  }}
                >
                  {stage.val}
                </div>
              </div>
            );
          })}
        </div>

        {/* Downward connecting amber trace into Section 8 */}
        <div 
          style={{
            width: '1px',
            height: '45px',
            background: 'linear-gradient(to bottom, var(--panel-border), var(--accent-amber))',
            marginTop: '2rem'
          }}
        />
      </div>

      <style>{`
        @media (max-width: 860px) {
          .pipeline-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 520px) {
          .pipeline-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
