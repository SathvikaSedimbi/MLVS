import React, { useState } from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { Radio, Activity, ShieldCheck, AlertTriangle, ArrowRight, Zap, RefreshCw } from 'lucide-react';

export const ScenarioInteractive = () => {
  const { 
    frontDistance, 
    setFrontDistance, 
    visibilityIndex, 
    setVisibilityIndex, 
    v01Speed, 
    riskAnalysis,
    applyScenario
  } = useTelemetry();

  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { label: 'V01', desc: 'Instrumented lead vehicle navigating haul ramp' },
    { label: 'SENSE', desc: 'Ultrasonic echo sweeps + Optical LDR attenuation' },
    { label: 'COMMUNICATE', desc: 'RF packet transmission: dist, speed, optical index' },
    { label: 'ASSESS', desc: 'Risk engine calculates TTC and closing delta' },
    { label: 'RESPOND', desc: 'Advisory or automated deceleration command' }
  ];

  return (
    <section 
      id="section-scenario"
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
            OPERATIONAL SCENARIO // V01 TO V02 ENCOUNTER
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => applyScenario('FOG_CORRIDOR')}
              style={{
                background: 'var(--bg-graphite)',
                border: '1px solid var(--panel-border)',
                color: 'var(--text-muted)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.66rem',
                padding: '0.3rem 0.6rem',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer'
              }}
            >
              PRESET: MONSOON FOG
            </button>
            <button
              onClick={() => applyScenario('CLEAR_ROAD')}
              style={{
                background: 'var(--bg-graphite)',
                border: '1px solid var(--panel-border)',
                color: 'var(--text-muted)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.66rem',
                padding: '0.3rem 0.6rem',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer'
              }}
            >
              PRESET: CLEAR ROAD
            </button>
          </div>
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
          THE SCENARIO: <span style={{ color: 'var(--accent-amber)' }}>V01 & V02</span>
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
          Vehicle V01 moves through low-visibility terrain while V02 is ahead in the haul corridor.
          Onboard ultrasonic and optical systems register proximity and atmospheric opacity, transmitting telemetry to the risk engine to generate an immediate safety response.
        </p>

        {/* Interactive Tactical 2D Scenario Canvas Container */}
        <div 
          className="industrial-corners"
          style={{
            backgroundColor: 'var(--bg-graphite)',
            border: `1px solid ${riskAnalysis.state === 'CRITICAL' ? 'var(--status-critical-border)' : 'var(--panel-border)'}`,
            borderRadius: 'var(--radius-md)',
            padding: '2rem',
            marginBottom: '2rem',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Top Corridor Legend */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-white)' }}>
                <span style={{ width: '12px', height: '12px', backgroundColor: 'var(--accent-amber)', borderRadius: '2px' }} />
                <span>V01 (INSTRUMENTED NUCLEO NODE)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                <span style={{ width: '12px', height: '12px', backgroundColor: '#3A4740', borderRadius: '2px' }} />
                <span>V02 (HAUL TRUCK / OBSTACLE)</span>
              </div>
            </div>

            <div 
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                fontWeight: 700,
                color: riskAnalysis.state === 'CRITICAL' ? 'var(--status-critical)' : (riskAnalysis.state === 'WARNING' ? 'var(--accent-amber)' : 'var(--status-safe)'),
                backgroundColor: 'var(--bg-mine-black)',
                padding: '0.3rem 0.8rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--panel-border)'
              }}
            >
              STATE: {riskAnalysis.state} // TTC: {riskAnalysis.thresholds ? '1.8s' : 'NOMINAL'}
            </div>
          </div>

          {/* Visual Haul Corridor Representation */}
          <div 
            style={{
              position: 'relative',
              height: '180px',
              backgroundColor: 'var(--bg-mine-black)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--panel-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 4rem',
              overflow: 'hidden',
              backgroundImage: `
                linear-gradient(to right, rgba(232, 236, 233, 0.03) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(232, 236, 233, 0.03) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }}
          >
            {/* Fog Overlay layer modulated by visibilityIndex */}
            <div 
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(180, 195, 185, 0.12)',
                backdropFilter: `blur(${Math.max(0, (100 - visibilityIndex) / 16)}px)`,
                opacity: (100 - visibilityIndex) / 100,
                pointerEvents: 'none',
                transition: 'all 0.3s ease'
              }}
            />

            {/* V01 Vehicle Representation */}
            <div 
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                zIndex: 2,
                position: 'relative'
              }}
            >
              <div 
                style={{
                  width: '64px',
                  height: '42px',
                  backgroundColor: 'var(--bg-graphite)',
                  border: '2px solid var(--accent-amber)',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 20px rgba(245, 166, 35, 0.3)',
                  position: 'relative'
                }}
              >
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-white)' }}>
                  V01
                </span>
                {/* Ultrasonic ping emitter */}
                <div 
                  style={{
                    position: 'absolute',
                    right: '-6px',
                    width: '6px',
                    height: '16px',
                    backgroundColor: 'var(--accent-amber)',
                    borderRadius: '2px'
                  }}
                />
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.64rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                {v01Speed} km/h
              </span>
            </div>

            {/* Ultrasonic Wave Cones & Data Packet Stream between V01 & V02 */}
            <div 
              style={{
                flex: 1,
                position: 'relative',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 1rem'
              }}
            >
              {/* Ultrasonic Echo Lines */}
              <div 
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {/* Concentric Ultrasonic Arc representations */}
                <div 
                  style={{
                    width: '100%',
                    height: '2px',
                    backgroundColor: 'var(--accent-amber)',
                    opacity: 0.4,
                    position: 'relative'
                  }}
                >
                  <div 
                    style={{
                      position: 'absolute',
                      top: '-4px',
                      left: '20%',
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--accent-amber)',
                      boxShadow: '0 0 10px #F5A623',
                      animation: 'pulse-amber 1.5s infinite ease-in-out'
                    }}
                  />
                </div>
              </div>

              {/* Distance Readout Bubble */}
              <div 
                style={{
                  position: 'relative',
                  zIndex: 3,
                  backgroundColor: 'var(--bg-graphite)',
                  border: `1px solid ${frontDistance < 40 ? 'var(--status-critical)' : 'var(--accent-amber)'}`,
                  padding: '0.35rem 0.9rem',
                  borderRadius: '20px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: frontDistance < 40 ? 'var(--status-critical)' : 'var(--text-white)',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.5)'
                }}
              >
                ECHO DIST: {frontDistance} cm
              </div>
            </div>

            {/* V02 Vehicle Representation */}
            <div 
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                zIndex: 2,
                position: 'relative'
              }}
            >
              <div 
                style={{
                  width: '64px',
                  height: '42px',
                  backgroundColor: '#202824',
                  border: '1.5px solid #43534A',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}
              >
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)' }}>
                  V02
                </span>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.64rem', color: 'var(--text-dim)', marginTop: '0.4rem' }}>
                OBSTACLE NODE
              </span>
            </div>
          </div>

          {/* Interactive Sliders for Evaluators to Test Reaction */}
          <div 
            style={{
              marginTop: '1.5rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1.5rem',
              paddingTop: '1rem',
              borderTop: '1px solid var(--panel-border-subtle)'
            }}
            className="sliders-grid"
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span className="system-label-subtle">PROXIMITY (ULTRASONIC ECHO)</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent-amber)', fontWeight: 700 }}>
                  {frontDistance} cm
                </span>
              </div>
              <input
                type="range"
                min="18"
                max="110"
                value={frontDistance}
                onChange={(e) => setFrontDistance(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#F5A623', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-dim)' }}>
                <span>18cm (Critical)</span>
                <span>110cm (Clear)</span>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span className="system-label-subtle">OPTICAL OPACITY (LDR / LED FOG)</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent-amber)', fontWeight: 700 }}>
                  {visibilityIndex}%
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="95"
                value={visibilityIndex}
                onChange={(e) => setVisibilityIndex(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#F5A623', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-dim)' }}>
                <span>10% (Dense Monsoon Fog)</span>
                <span>95% (Clear Sky)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Flow Stages: V01 -> SENSE -> COMMUNICATE -> ASSESS -> RESPOND */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '1rem',
            position: 'relative'
          }}
          className="flow-stages-grid"
        >
          {steps.map((st, i) => (
            <div 
              key={st.label}
              style={{
                backgroundColor: 'var(--bg-graphite)',
                border: '1px solid var(--panel-border)',
                borderRadius: 'var(--radius-sm)',
                padding: '1.25rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--accent-amber)', fontWeight: 700 }}>
                  STAGE 0{i + 1}
                </span>
                {i < steps.length - 1 && <ArrowRight size={13} color="#95A39B" />}
              </div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-white)' }}>
                {st.label}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                {st.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .flow-stages-grid {
            grid-template-columns: 1fr !important;
          }
          .sliders-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};
