import React, { useState } from 'react';
import { Cpu, Radio, ShieldCheck, ArrowRight, ArrowDown, Activity, AlertCircle, Database, Check } from 'lucide-react';

export const ArchitectureSection = () => {
  const [activePath, setActivePath] = useState('ALL'); // 'PRIMARY' | 'V2V' | 'ALL'

  return (
    <section 
      id="section-architecture"
      style={{
        padding: '5rem 2rem',
        maxWidth: 'var(--site-max-width)',
        margin: '0 auto',
        width: '100%',
        borderBottom: '1px solid var(--panel-border-subtle)'
      }}
    >
      <div style={{ maxWidth: '1150px', margin: '0 auto' }}>
        {/* Label */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div className="system-label">
            <span className="status-dot amber" />
            SYSTEM ARCHITECTURE // END-TO-END DATA FLOW
          </div>

          {/* Path Filters */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setActivePath('ALL')}
              style={{
                background: activePath === 'ALL' ? 'var(--accent-amber)' : 'var(--bg-graphite)',
                color: activePath === 'ALL' ? '#0B0E0D' : 'var(--text-muted)',
                border: '1px solid var(--panel-border)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.66rem',
                fontWeight: 700,
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer'
              }}
            >
              FULL ARCHITECTURE
            </button>
            <button
              onClick={() => setActivePath('PRIMARY')}
              style={{
                background: activePath === 'PRIMARY' ? 'var(--accent-amber)' : 'var(--bg-graphite)',
                color: activePath === 'PRIMARY' ? '#0B0E0D' : 'var(--text-muted)',
                border: '1px solid var(--panel-border)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.66rem',
                fontWeight: 700,
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer'
              }}
            >
              PRIMARY LOOP ONLY
            </button>
            <button
              onClick={() => setActivePath('V2V')}
              style={{
                background: activePath === 'V2V' ? 'var(--accent-amber)' : 'var(--bg-graphite)',
                color: activePath === 'V2V' ? '#0B0E0D' : 'var(--text-muted)',
                border: '1px solid var(--panel-border)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.66rem',
                fontWeight: 700,
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer'
              }}
            >
              V2V PATH ONLY
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
          CONNECTED DATA ARCHITECTURE
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
          Telemetry flows from vehicle-mounted sensors into edge microcontrollers, broadcasts over RF wireless telemetry to the mission control engine, and completes the loop through validated safety commands.
        </p>

        {/* Critical Technical Distinction Banner */}
        <div 
          style={{
            backgroundColor: 'rgba(21, 26, 24, 0.8)',
            border: '1px solid var(--panel-border)',
            borderRadius: 'var(--radius-sm)',
            padding: '1rem 1.25rem',
            marginBottom: '2.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}
        >
          <div style={{ color: 'var(--accent-amber)' }}>
            <AlertCircle size={20} />
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            <strong style={{ color: 'var(--text-white)', fontFamily: 'var(--font-mono)' }}>CRITICAL TECHNICAL DISTINCTION:</strong> Ultrasonic sensing measures physical acoustic reflections from physical obstacles (such as rocks, berms, or uninstrumented haulers) via speed-of-sound time-of-flight. In contrast, <strong>V2V (Vehicle-to-Vehicle)</strong> is an active digital RF telemetry protocol transmitting vehicle state frames between independent microcontrollers. Ultrasonic detection does NOT constitute V2V communication.
          </div>
        </div>

        {/* Interactive Architecture Flow Diagram */}
        <div 
          className="industrial-corners"
          style={{
            backgroundColor: 'var(--bg-graphite)',
            border: '1px solid var(--panel-border)',
            borderRadius: 'var(--radius-md)',
            padding: '2.5rem',
            position: 'relative'
          }}
        >
          {/* Primary Flow Grid */}
          <div style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <span className="status-dot amber" />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-amber)', letterSpacing: '0.12em' }}>
                PRIMARY TELEMETRY & COMMAND LOOP
              </span>
            </div>

            {/* 8-Stage Sequential Flow Container */}
            <div 
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '1.25rem',
                position: 'relative'
              }}
              className="arch-grid"
            >
              {/* Row 1: Forward Telemetry Flow */}
              <div 
                style={{
                  backgroundColor: 'var(--bg-mine-black)',
                  border: '1px solid var(--panel-border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}
              >
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--accent-amber)', fontWeight: 700 }}>
                  01 // PHYSICAL NODE
                </div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-white)' }}>
                  VEHICLE 1 (V01)
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Lead test vehicle navigating haulage corridor
                </div>
              </div>

              <div 
                style={{
                  backgroundColor: 'var(--bg-mine-black)',
                  border: '1px solid var(--panel-border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}
              >
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--accent-amber)', fontWeight: 700 }}>
                  02 // TRANSDUCTION
                </div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-white)' }}>
                  SENSOR CLUSTER
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Front/Side Ultrasonic, LDR/LED Fog Pair, Wheel Encoder
                </div>
              </div>

              <div 
                style={{
                  backgroundColor: 'var(--bg-mine-black)',
                  border: '1px solid var(--accent-amber)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  boxShadow: '0 0 20px rgba(245, 166, 35, 0.1)'
                }}
              >
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--accent-amber)', fontWeight: 700 }}>
                  03 // EDGE COMPUTE
                </div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-white)' }}>
                  STM32 CONTROLLER
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  ARM Cortex-M core executing interrupt sampling & packetization
                </div>
              </div>

              <div 
                style={{
                  backgroundColor: 'var(--bg-mine-black)',
                  border: '1px solid var(--panel-border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}
              >
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--accent-amber)', fontWeight: 700 }}>
                  04 // TRANSPORT
                </div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-white)' }}>
                  WIRELESS RF / ESP
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  2.4 GHz digital packet broadcast (18ms latency)
                </div>
              </div>

              {/* Row 2: Ingest, Engine, and Return Safety Command Loop */}
              <div 
                style={{
                  backgroundColor: 'var(--bg-mine-black)',
                  border: '1px solid var(--panel-border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}
              >
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--accent-amber)', fontWeight: 700 }}>
                  05 // INGEST & VIS
                </div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-white)' }}>
                  CONTROL ROOM
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Web mission console parsing spatial radar & telemetry
                </div>
              </div>

              <div 
                style={{
                  backgroundColor: 'var(--bg-mine-black)',
                  border: '1px solid var(--accent-amber)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  boxShadow: '0 0 20px rgba(245, 166, 35, 0.1)'
                }}
              >
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--accent-amber)', fontWeight: 700 }}>
                  06 // INFERENCE
                </div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-white)' }}>
                  RISK ENGINE
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  TTC, closing velocity, and optical opacity decision matrix
                </div>
              </div>

              <div 
                style={{
                  backgroundColor: 'var(--bg-mine-black)',
                  border: '1px solid var(--panel-border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}
              >
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--accent-amber)', fontWeight: 700 }}>
                  07 // ACTUATION CMD
                </div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-white)' }}>
                  SAFETY COMMAND
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Advisory warning, speed reduction throttle, or stop
                </div>
              </div>

              <div 
                style={{
                  backgroundColor: 'var(--bg-mine-black)',
                  border: '1px solid var(--panel-border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}
              >
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--accent-amber)', fontWeight: 700 }}>
                  08 // EXECUTION
                </div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-white)' }}>
                  MOTOR DRIVER (V01)
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  H-Bridge PWM cutoff or speed governor executed
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Flow: Optional V2V Subsystem */}
          <div 
            style={{
              paddingTop: '2rem',
              borderTop: '1px solid var(--panel-border-subtle)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <span className="status-dot safe" />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 700, color: 'var(--status-safe)', letterSpacing: '0.12em' }}>
                SECONDARY V2V COMMUNICATION PATH (OPTIONAL MULTI-NODE EXTENSION)
              </span>
            </div>

            <div 
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '1.25rem'
              }}
              className="arch-grid"
            >
              <div style={{ backgroundColor: 'var(--bg-mine-black)', border: '1px solid var(--panel-border)', borderRadius: 'var(--radius-sm)', padding: '1rem' }}>
                <span className="system-label-subtle">NODE 02</span>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-white)' }}>VEHICLE 2 (V02)</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Obstacle / trailing hauler</div>
              </div>

              <div style={{ backgroundColor: 'var(--bg-mine-black)', border: '1px solid var(--panel-border)', borderRadius: 'var(--radius-sm)', padding: '1rem' }}>
                <span className="system-label-subtle">CONTROLLER 02</span>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-white)' }}>SECOND CONTROLLER</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Independent node telemetry</div>
              </div>

              <div style={{ backgroundColor: 'var(--bg-mine-black)', border: '1px solid var(--panel-border)', borderRadius: 'var(--radius-sm)', padding: '1rem' }}>
                <span className="system-label-subtle">RF LINK</span>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-white)' }}>WIRELESS BEACON</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Inter-vehicle state broadcast</div>
              </div>

              <div style={{ backgroundColor: 'var(--bg-mine-black)', border: '1px solid var(--panel-border)', borderRadius: 'var(--radius-sm)', padding: '1rem' }}>
                <span className="system-label-subtle">RECEIVER</span>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-white)' }}>VEHICLE 1 RX BUFFER</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Decodes relative V02 vector</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .arch-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 520px) {
          .arch-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};
