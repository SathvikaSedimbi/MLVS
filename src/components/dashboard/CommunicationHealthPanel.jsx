import React, { useState } from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { Radio, Wifi, Cpu, Database, CheckCircle2, ShieldCheck, Terminal, RefreshCw, Sliders } from 'lucide-react';

export const CommunicationHealthPanel = () => {
  const { 
    vehicleId, 
    v01Speed, 
    frontDistance, 
    leftDistance, 
    rightDistance, 
    visibilityIndex, 
    temperature, 
    battery, 
    v2vActive,
    sensorHealth,
    isSimulatingLive,
    setIsSimulatingLive
  } = useTelemetry();

  const [activeSubTab, setActiveSubTab] = useState('DIAGNOSTICS'); // 'DIAGNOSTICS' | 'PAYLOAD'

  // Generate simulated raw JSON telemetry packet matching Section 21 Data Model
  const samplePayload = JSON.stringify({
    vehicleId: 'V01',
    timestamp: new Date().toISOString(),
    speed: v01Speed,
    frontDistance: frontDistance,
    leftDistance: leftDistance,
    rightDistance: rightDistance,
    temperature: temperature,
    visibilityIndex: visibilityIndex,
    battery: battery,
    vehicleStatus: frontDistance < 30 ? 'CRITICAL' : (frontDistance < 55 ? 'WARNING' : 'NORMAL'),
    vehicle2Detected: true,
    v2vStatus: v2vActive ? 'CONNECTED' : 'STANDBY',
    sensorHealth: sensorHealth,
    riskState: frontDistance < 30 ? 'CRITICAL' : (frontDistance < 55 ? 'WARNING' : 'NORMAL')
  }, null, 2);

  return (
    <div 
      className="industrial-corners"
      style={{
        backgroundColor: 'var(--bg-graphite)',
        border: '1px solid var(--panel-border)',
        borderRadius: 'var(--radius-md)',
        padding: '1.75rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div 
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: 'var(--bg-mine-black)',
              border: '1.5px solid var(--accent-amber)',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-amber)'
            }}
          >
            <Radio size={18} />
          </div>
          <div>
            <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-white)' }}>
              COMMUNICATION BUS & SYSTEM HEALTH
            </h3>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
              RF 2.4 GHz TELEMETRY LINK & SERIAL JSON INGEST HARNESS
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setActiveSubTab('DIAGNOSTICS')}
            style={{
              background: activeSubTab === 'DIAGNOSTICS' ? 'var(--accent-amber)' : 'var(--bg-mine-black)',
              color: activeSubTab === 'DIAGNOSTICS' ? '#0B0E0D' : 'var(--text-muted)',
              border: '1px solid var(--panel-border)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.66rem',
              fontWeight: 700,
              padding: '0.35rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer'
            }}
          >
            LINK METRICS
          </button>
          <button
            onClick={() => setActiveSubTab('PAYLOAD')}
            style={{
              background: activeSubTab === 'PAYLOAD' ? 'var(--accent-amber)' : 'var(--bg-mine-black)',
              color: activeSubTab === 'PAYLOAD' ? '#0B0E0D' : 'var(--text-muted)',
              border: '1px solid var(--panel-border)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.66rem',
              fontWeight: 700,
              padding: '0.35rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer'
            }}
          >
            RAW HARDWARE PAYLOAD
          </button>
        </div>
      </div>

      {activeSubTab === 'DIAGNOSTICS' ? (
        <>
          {/* RF Link Metrics Grid */}
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '1rem'
            }}
            className="link-metrics-grid"
          >
            <div style={{ backgroundColor: 'var(--bg-mine-black)', border: '1px solid var(--panel-border)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
              <span className="system-label-subtle">PACKET RATE</span>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-white)', marginTop: '0.3rem' }}>
                20 <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Hz</span>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--status-safe)' }}>
                NOMINAL UPDATE FREQ
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-mine-black)', border: '1px solid var(--panel-border)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
              <span className="system-label-subtle">ROUND-TRIP LATENCY</span>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-white)', marginTop: '0.3rem' }}>
                18 <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>ms</span>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--status-safe)' }}>
                REAL-TIME THRESHOLD PASS
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-mine-black)', border: '1px solid var(--panel-border)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
              <span className="system-label-subtle">CARRIER RSSI</span>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-amber)', marginTop: '0.3rem' }}>
                -58 <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>dBm</span>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-muted)' }}>
                EXCELLENT SIGNAL STRENGTH
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-mine-black)', border: '1px solid var(--panel-border)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
              <span className="system-label-subtle">PACKET INTEGRITY</span>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', fontWeight: 800, color: '#35C77A', marginTop: '0.3rem' }}>
                100 <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>%</span>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--status-safe)' }}>
                0 DROPPED FRAMES (CRC-16)
              </div>
            </div>
          </div>

          {/* Subsystem Readiness Checklist */}
          <div 
            style={{
              backgroundColor: 'var(--bg-mine-black)',
              border: '1px solid var(--panel-border)',
              borderRadius: 'var(--radius-sm)',
              padding: '1.25rem'
            }}
          >
            <span className="system-label-subtle" style={{ display: 'block', marginBottom: '0.75rem' }}>
              HARDWARE SUBSYSTEM STATUS INTEGRITY AUDIT:
            </span>

            <div 
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '0.75rem'
              }}
              className="audit-grid"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-white)' }}>
                <CheckCircle2 size={15} color="#35C77A" />
                <span>STM32 Nucleo UART Bridge: ACTIVE (115200 8N1)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-white)' }}>
                <CheckCircle2 size={15} color="#35C77A" />
                <span>Ultrasonic Transducers (Front, Left, Right): CALIBRATED</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-white)' }}>
                <CheckCircle2 size={15} color="#35C77A" />
                <span>LDR/LED Fog Transmittance ADC: ONLINE</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-white)' }}>
                <CheckCircle2 size={15} color="#35C77A" />
                <span>Dual H-Bridge Motor Driver PWM: ENGAGED</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* RAW Payload View (Section 21 Data Model demonstration) */
        <div 
          style={{
            backgroundColor: 'var(--bg-mine-black)',
            border: '1px solid var(--panel-border)',
            borderRadius: 'var(--radius-sm)',
            padding: '1.25rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Terminal size={14} color="#F5A623" />
              <span className="system-label-subtle">LIVE TELEMETRY JSON SPECIFICATION (SECTION 21):</span>
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--status-safe)' }}>
              COMPLIANT DATA SCHEMA
            </span>
          </div>

          <pre 
            style={{
              backgroundColor: '#070908',
              border: '1px solid var(--panel-border-subtle)',
              padding: '1rem',
              borderRadius: 'var(--radius-sm)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'var(--accent-amber)',
              overflowX: 'auto',
              maxHeight: '280px',
              lineHeight: 1.4
            }}
          >
            {samplePayload}
          </pre>

          <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Note: This exact JSON packet format is ready to be directly mapped from STM32 serial input or WebSerial API when physical hardware is connected.
          </div>
        </div>
      )}

      {/* Simulator Switch */}
      <div 
        style={{
          borderTop: '1px solid var(--panel-border-subtle)',
          paddingTop: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <RefreshCw size={14} color="#95A39B" />
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Background Telemetry Jitter Generator:
          </span>
        </div>

        <button
          onClick={() => setIsSimulatingLive(!isSimulatingLive)}
          style={{
            backgroundColor: isSimulatingLive ? 'var(--status-safe-dim)' : 'var(--bg-mine-black)',
            border: `1px solid ${isSimulatingLive ? 'var(--status-safe-border)' : 'var(--panel-border)'}`,
            color: isSimulatingLive ? 'var(--status-safe)' : 'var(--text-dim)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.68rem',
            fontWeight: 700,
            padding: '0.35rem 0.8rem',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer'
          }}
        >
          {isSimulatingLive ? 'LIVE JITTER: ACTIVE' : 'LIVE JITTER: PAUSED'}
        </button>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .link-metrics-grid {
            grid-template-columns: 1fr 1fr !important;
          }
          .audit-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
