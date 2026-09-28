import React from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { Cpu, Battery, Gauge, Eye, Thermometer, Radio, Activity, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export const VehiclePanel = () => {
  const { 
    vehicleId, 
    v01Speed, 
    battery, 
    frontDistance, 
    rearDistance,
    leftDistance, 
    rightDistance, 
    temperature, 
    humidity,
    dht11Status,
    visibilityIndex,
    gasHazard,
    gasLevel,
    pirMotion,
    irObstacle,
    ldrVolt,
    potVolt,
    v02Detected,
    v02Speed,
    v2vActive,
    setV2vActive,
    closingSpeed,
    riskAnalysis
  } = useTelemetry();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* V01 Primary Instrumented Vehicle Panel */}
      <div 
        className="industrial-corners"
        style={{
          backgroundColor: 'var(--bg-graphite)',
          border: '1px solid var(--panel-border)',
          borderRadius: 'var(--radius-md)',
          padding: '1.5rem'
        }}
      >
        {/* Panel Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
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
                color: 'var(--accent-amber)',
                fontWeight: 800,
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem'
              }}
            >
              V01
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', fontWeight: 800, color: 'var(--text-white)' }}>
                PRIMARY INSTRUMENTED VEHICLE
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                NODE: STM32 NUCLEO // ARM CORTEX-M4 // DUAL-RAIL POWER
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="status-dot safe" />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 700, color: 'var(--status-safe)' }}>
              RF TELEMETRY CONNECTED
            </span>
          </div>
        </div>

        {/* 6 Primary Telemetry Gauges Grid */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}
          className="telemetry-gauge-grid"
        >
          {/* Speed */}
          <div style={{ backgroundColor: 'var(--bg-mine-black)', border: '1px solid var(--panel-border)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
              <span className="system-label-subtle">GROUND SPEED</span>
              <Gauge size={13} color="#95A39B" />
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-white)' }}>
              {v01Speed} <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>km/h</span>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-dim)' }}>
              OPTICAL ENCODER
            </div>
          </div>

          {/* Battery */}
          <div style={{ backgroundColor: 'var(--bg-mine-black)', border: '1px solid var(--panel-border)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
              <span className="system-label-subtle">BATTERY BUS</span>
              <Battery size={13} color="#35C77A" />
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--status-safe)' }}>
              {battery} <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>%</span>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-dim)' }}>
              7.4V LI-ION DEDICATED
            </div>
          </div>

          {/* Front Distance */}
          <div style={{ backgroundColor: 'var(--bg-mine-black)', border: '1px solid var(--accent-amber)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
              <span className="system-label-subtle">FRONT HC-SR04</span>
              <span className="status-dot amber" style={{ width: '6px', height: '6px' }} />
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem', fontWeight: 800, color: frontDistance !== null && frontDistance < 40 ? 'var(--status-critical)' : 'var(--text-white)' }}>
              {frontDistance !== null ? `${frontDistance} cm` : 'NO ECHO'}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-muted)' }}>
              PRIMARY ULTRASONIC
            </div>
          </div>

          {/* Rear Distance */}
          <div style={{ backgroundColor: 'var(--bg-mine-black)', border: '1px solid var(--panel-border)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
              <span className="system-label-subtle">REAR ULTRASONIC</span>
              <Activity size={13} color="#95A39B" />
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem', fontWeight: 800, color: rearDistance !== null && rearDistance < 40 ? 'var(--status-critical)' : 'var(--text-white)' }}>
              {rearDistance !== null ? `${rearDistance} cm` : 'NO ECHO'}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-dim)' }}>
              REAR PROXIMITY SENSOR
            </div>
          </div>

          {/* Visibility Index */}
          <div style={{ backgroundColor: 'var(--bg-mine-black)', border: '1px solid var(--panel-border)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
              <span className="system-label-subtle">VISIBILITY INDEX</span>
              <Eye size={13} color="#95A39B" />
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem', fontWeight: 800, color: visibilityIndex < 40 ? 'var(--accent-amber)' : 'var(--text-white)' }}>
              {visibilityIndex}%
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-dim)' }}>
              LDR: {ldrVolt !== null ? `${ldrVolt} mV` : 'ACTIVE'}
            </div>
          </div>

          {/* Temperature */}
          <div style={{ backgroundColor: 'var(--bg-mine-black)', border: '1px solid var(--panel-border)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
              <span className="system-label-subtle">DHT11 TEMP</span>
              <Thermometer size={13} color="#95A39B" />
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: temperature !== null ? '1.4rem' : '1rem', fontWeight: 800, color: temperature !== null ? 'var(--text-white)' : 'var(--status-critical)' }}>
              {temperature !== null ? `${temperature} °C` : dht11Status}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-dim)' }}>
              {humidity !== null ? `HUMIDITY: ${humidity}%` : 'DHT11 PIN PA9'}
            </div>
          </div>
        </div>
      </div>

      {/* V02 Secondary Obstacle Vehicle Panel */}
      <div 
        style={{
          backgroundColor: 'var(--bg-graphite)',
          border: '1px solid var(--panel-border)',
          borderRadius: 'var(--radius-md)',
          padding: '1.5rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div 
              style={{
                width: '32px',
                height: '32px',
                backgroundColor: 'var(--bg-mine-black)',
                border: '1.5px solid #43534A',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-muted)',
                fontWeight: 800,
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem'
              }}
            >
              V02
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-white)' }}>
                SECONDARY TARGET VEHICLE / OBSTACLE
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                SURROGATE HAUL DUMPER IN CORRIDOR
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}>
              <span className="status-dot safe" />
              <span style={{ color: 'var(--status-safe)', fontWeight: 600 }}>ACOUSTIC ECHO ACQUIRED</span>
            </div>

            <button
              onClick={() => setV2vActive(!v2vActive)}
              style={{
                backgroundColor: v2vActive ? 'var(--status-safe-dim)' : 'var(--bg-mine-black)',
                border: `1px solid ${v2vActive ? 'var(--status-safe-border)' : 'var(--panel-border)'}`,
                color: v2vActive ? 'var(--status-safe)' : 'var(--text-dim)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.66rem',
                fontWeight: 700,
                padding: '0.3rem 0.6rem',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer'
              }}
            >
              V2V RF: {v2vActive ? 'CONNECTED' : 'DISCONNECTED'}
            </button>
          </div>
        </div>

        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1rem',
            backgroundColor: 'var(--bg-mine-black)',
            padding: '1rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--panel-border-subtle)'
          }}
          className="v02-grid"
        >
          <div>
            <span className="system-label-subtle">DETECTION METHOD</span>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-white)' }}>
              ULTRASONIC ECHO
            </div>
          </div>

          <div>
            <span className="system-label-subtle">RELATIVE BEARING</span>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-amber)' }}>
              AHEAD IN SAME LANE
            </div>
          </div>

          <div>
            <span className="system-label-subtle">V02 ESTIMATED SPEED</span>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-white)' }}>
              {v2vActive ? `${v02Speed} km/h (V2V Telemetry)` : '--- (No V2V Link)'}
            </div>
          </div>

          <div>
            <span className="system-label-subtle">CALCULATED CLOSING RATE</span>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 700, color: closingSpeed > 4 ? 'var(--accent-amber)' : 'var(--text-white)' }}>
              {closingSpeed} km/h (Δv)
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .telemetry-gauge-grid {
            grid-template-columns: 1fr 1fr !important;
          }
          .v02-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
