import React, { useState } from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { Cpu, Terminal, Radio, ShieldCheck, AlertTriangle, Eye, Flame, User, Activity, ChevronDown, ChevronUp } from 'lucide-react';

export const SimulationControlBar = () => {
  const { 
    hardwareConnected,
    comPort,
    baudRate,
    packetCount,
    frontDistance,
    rearDistance,
    gasLevel,
    gasHazard,
    pirMotion,
    irObstacle,
    ldrAdc,
    ldrVolt,
    potAdc,
    potVolt,
    temperature,
    humidity,
    dht11Status,
    rawSerialLines,
    riskAnalysis
  } = useTelemetry();

  const [showTerminal, setShowTerminal] = useState(false);

  return (
    <div 
      style={{
        backgroundColor: 'rgba(17, 22, 20, 0.98)',
        border: '1px solid var(--panel-border-active)',
        borderRadius: 'var(--radius-md)',
        padding: '1.25rem 1.5rem',
        boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}
    >
      {/* Top Header: Physical Hardware Link */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div 
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: hardwareConnected ? '#35C77A' : '#F5A623',
              boxShadow: hardwareConnected ? '0 0 10px #35C77A' : 'none',
              animation: hardwareConnected ? 'pulse 1.5s infinite' : 'none'
            }}
          />
          <Cpu size={16} color="#35C77A" />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-white)', letterSpacing: '0.08em' }}>
            PHYSICAL HARDWARE LINK: STM32 NUCLEO-F446RE ({comPort} @ {baudRate} BAUD)
          </span>
          <span 
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              fontWeight: 700,
              padding: '0.15rem 0.5rem',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: hardwareConnected ? 'rgba(53, 199, 122, 0.15)' : 'rgba(245, 166, 35, 0.15)',
              border: `1px solid ${hardwareConnected ? '#35C77A' : '#F5A623'}`,
              color: hardwareConnected ? '#35C77A' : '#F5A623'
            }}
          >
            {hardwareConnected ? 'STREAMING REAL TELEMETRY' : 'AWAITING COM7 STREAM'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            FRAMES INGESTED: <strong style={{ color: 'var(--text-white)' }}>{packetCount}</strong>
          </span>

          <button
            onClick={() => setShowTerminal(!showTerminal)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: showTerminal ? 'var(--accent-amber)' : 'var(--bg-mine-black)',
              color: showTerminal ? '#0B0E0D' : 'var(--text-white)',
              border: '1px solid var(--panel-border)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.66rem',
              fontWeight: 700,
              padding: '0.35rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer'
            }}
          >
            <Terminal size={12} />
            <span>RAW STM32 SERIAL STREAM</span>
            {showTerminal ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
        </div>
      </div>

      {/* Real Hardware Sensor Values Grid */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '0.75rem'
        }}
      >
        {/* Front HC-SR04 */}
        <div style={{ backgroundColor: 'var(--bg-mine-black)', border: '1px solid var(--panel-border)', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-sm)' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
            FRONT HC-SR04
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.95rem', fontWeight: 800, color: frontDistance !== null ? (frontDistance < 30 ? 'var(--status-critical)' : 'var(--text-white)') : 'var(--text-dim)' }}>
            {frontDistance !== null ? `${frontDistance} cm` : 'NO ECHO'}
          </div>
        </div>

        {/* Rear Ultrasonic */}
        <div style={{ backgroundColor: 'var(--bg-mine-black)', border: '1px solid var(--panel-border)', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-sm)' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
            REAR ULTRASONIC
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.95rem', fontWeight: 800, color: rearDistance !== null ? (rearDistance < 30 ? 'var(--status-critical)' : 'var(--text-white)') : 'var(--text-dim)' }}>
            {rearDistance !== null ? `${rearDistance} cm` : 'NO ECHO'}
          </div>
        </div>

        {/* MQ Gas */}
        <div style={{ backgroundColor: 'var(--bg-mine-black)', border: `1px solid ${gasHazard ? 'var(--status-critical)' : 'var(--panel-border)'}`, padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-sm)' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
            MQ GAS SENSOR
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.95rem', fontWeight: 800, color: gasHazard ? 'var(--status-critical)' : '#35C77A' }}>
            {gasLevel} {gasHazard ? '(HAZARD)' : '(NORMAL)'}
          </div>
        </div>

        {/* PIR Sensor */}
        <div style={{ backgroundColor: 'var(--bg-mine-black)', border: `1px solid ${pirMotion ? 'var(--accent-amber)' : 'var(--panel-border)'}`, padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-sm)' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
            PIR MOTION
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.95rem', fontWeight: 800, color: pirMotion ? 'var(--accent-amber)' : 'var(--text-dim)' }}>
            {pirMotion ? 'MOTION' : 'NO MOTION'}
          </div>
        </div>

        {/* IR Obstacle */}
        <div style={{ backgroundColor: 'var(--bg-mine-black)', border: `1px solid ${irObstacle ? 'var(--status-critical)' : 'var(--panel-border)'}`, padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-sm)' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
            IR OBSTACLE
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.95rem', fontWeight: 800, color: irObstacle ? 'var(--status-critical)' : '#35C77A' }}>
            {irObstacle ? 'OBSTACLE' : 'CLEAR'}
          </div>
        </div>

        {/* LDR Sensor */}
        <div style={{ backgroundColor: 'var(--bg-mine-black)', border: '1px solid var(--panel-border)', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-sm)' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
            LDR PHOTOCELL
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-white)' }}>
            {ldrAdc !== null ? `${ldrAdc} / 4095` : '---'}
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-dim)' }}>
            {ldrVolt !== null ? `${ldrVolt} mV` : ''}
          </div>
        </div>

        {/* Potentiometer */}
        <div style={{ backgroundColor: 'var(--bg-mine-black)', border: '1px solid var(--panel-border)', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-sm)' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
            POTENTIOMETER
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-white)' }}>
            {potAdc !== null ? `${potAdc} / 4095` : '---'}
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-dim)' }}>
            {potVolt !== null ? `${potVolt} mV` : ''}
          </div>
        </div>

        {/* DHT11 */}
        <div style={{ backgroundColor: 'var(--bg-mine-black)', border: '1px solid var(--panel-border)', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-sm)' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
            DHT11 SENSOR
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 800, color: temperature !== null ? 'var(--text-white)' : 'var(--status-critical)' }}>
            {temperature !== null ? `${temperature}°C / ${humidity}%` : dht11Status}
          </div>
        </div>
      </div>

      {/* Collapsible Live Raw Serial Terminal */}
      {showTerminal && (
        <div 
          style={{
            backgroundColor: '#070908',
            border: '1px solid var(--panel-border-subtle)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.8rem 1rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            color: 'var(--accent-amber)',
            maxHeight: '160px',
            overflowY: 'auto',
            lineHeight: 1.5
          }}
        >
          <div style={{ color: 'var(--text-dim)', borderBottom: '1px solid #1C2320', paddingBottom: '0.3rem', marginBottom: '0.4rem' }}>
            // REAL TIME UART STREAM FROM STM32 NUCLEO USB (COM7 @ 115200 8N1):
          </div>
          {rawSerialLines && rawSerialLines.length > 0 ? (
            rawSerialLines.map((line, idx) => (
              <div key={idx} style={{ color: line.includes('HIGH') || line.includes('OBSTACLE') || line.includes('MOTION') ? 'var(--status-critical)' : 'var(--accent-amber)' }}>
                {line}
              </div>
            ))
          ) : (
            <div style={{ color: 'var(--text-dim)' }}>Listening for incoming serial packets from COM7...</div>
          )}
        </div>
      )}
    </div>
  );
};
