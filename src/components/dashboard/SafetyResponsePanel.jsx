import React, { useState } from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { ShieldAlert, Zap, AlertOctagon, RotateCcw, ArrowRight, CheckCircle2, Radio, Terminal } from 'lucide-react';

export const SafetyResponsePanel = () => {
  const { safetyCommand, issueSafetyCommand, commandLog, riskAnalysis } = useTelemetry();
  const [lastAckStage, setLastAckStage] = useState(4);

  const commandStages = [
    { name: 'CONTROL ROOM', label: 'Command Issued' },
    { name: 'WIRELESS RF', label: 'Packet Transmitted' },
    { name: 'STM32 NUCLEO', label: 'Interrupt Parsed' },
    { name: 'MOTOR DRIVER', label: 'PWM Cut / Throttled' },
    { name: 'VEHICLE V01', label: 'Speed Reduced' }
  ];

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
            <ShieldAlert size={18} />
          </div>
          <div>
            <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-white)' }}>
              SAFETY RESPONSE & COMMAND DISPATCH
            </h3>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
              BIDIRECTIONAL MISSION CONTROL OVERRIDE TO EMBEDDED MOTOR ACTUATOR
            </div>
          </div>
        </div>

        {/* Current Command Status Indicator */}
        <div 
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            fontWeight: 700,
            padding: '0.35rem 0.8rem',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: safetyCommand ? 'var(--status-critical-dim)' : 'var(--bg-mine-black)',
            border: `1px solid ${safetyCommand ? 'var(--status-critical-border)' : 'var(--panel-border)'}`,
            color: safetyCommand ? 'var(--status-critical)' : 'var(--text-muted)'
          }}
        >
          ACTIVE DIRECTIVE: {safetyCommand || 'NORMAL CRUISE'}
        </div>
      </div>

      {/* Conceptual Command Path Flow (Prompt Requirement!) */}
      <div 
        style={{
          backgroundColor: 'var(--bg-mine-black)',
          border: '1px solid var(--panel-border)',
          borderRadius: 'var(--radius-sm)',
          padding: '1.25rem'
        }}
      >
        <span className="system-label-subtle" style={{ display: 'block', marginBottom: '1rem' }}>
          CLOSED-LOOP COMMAND PATH // ROUND-TRIP ACKNOWLEDGMENT
        </span>

        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '0.75rem',
            position: 'relative'
          }}
          className="command-path-grid"
        >
          {commandStages.map((stage, idx) => (
            <div 
              key={stage.name}
              style={{
                backgroundColor: 'var(--bg-graphite)',
                border: `1px solid ${safetyCommand ? 'var(--accent-amber)' : 'var(--panel-border)'}`,
                borderRadius: 'var(--radius-sm)',
                padding: '0.85rem 0.6rem',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem'
              }}
            >
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--accent-amber)', fontWeight: 700 }}>
                STEP 0{idx + 1}
              </div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-white)' }}>
                {stage.name}
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                {stage.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Command Dispatch Buttons */}
      <div>
        <span className="system-label-subtle" style={{ display: 'block', marginBottom: '0.75rem' }}>
          OPERATOR & AUTONOMOUS INTERVENTION COMMANDS:
        </span>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {/* Emergency Stop Button */}
          <button
            onClick={() => issueSafetyCommand('STOP')}
            style={{
              backgroundColor: '#E05252',
              color: '#FFF',
              border: 'none',
              padding: '0.85rem 1.5rem',
              borderRadius: 'var(--radius-sm)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              fontWeight: 800,
              letterSpacing: '0.05em',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(224, 82, 82, 0.4)',
              transition: 'transform 0.15s ease'
            }}
          >
            <AlertOctagon size={18} />
            <span>DISPATCH EMERGENCY STOP</span>
          </button>

          {/* Reduce Speed Button */}
          <button
            onClick={() => issueSafetyCommand('REDUCE_SPEED')}
            style={{
              backgroundColor: 'var(--accent-amber)',
              color: '#0B0E0D',
              border: 'none',
              padding: '0.85rem 1.5rem',
              borderRadius: 'var(--radius-sm)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              fontWeight: 800,
              letterSpacing: '0.05em',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(245, 166, 35, 0.25)',
              transition: 'transform 0.15s ease'
            }}
          >
            <Zap size={18} />
            <span>FORCE SPEED GOVERNOR (8 KM/H)</span>
          </button>

          {/* Issue Advisory Button */}
          <button
            onClick={() => issueSafetyCommand('ADVISORY')}
            style={{
              backgroundColor: 'var(--bg-mine-black)',
              color: 'var(--text-white)',
              border: '1px solid var(--panel-border)',
              padding: '0.85rem 1.25rem',
              borderRadius: 'var(--radius-sm)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer'
            }}
          >
            <Radio size={16} color="#F5A623" />
            <span>TRANSMIT AUDIO/VISUAL ADVISORY</span>
          </button>

          {/* Clear / Reset Button */}
          {safetyCommand && (
            <button
              onClick={() => issueSafetyCommand(null)}
              style={{
                backgroundColor: 'transparent',
                color: 'var(--text-muted)',
                border: '1px solid var(--panel-border)',
                padding: '0.85rem 1.25rem',
                borderRadius: 'var(--radius-sm)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer'
              }}
            >
              <RotateCcw size={16} />
              <span>CLEAR DIRECTIVE / RESUME</span>
            </button>
          )}
        </div>
      </div>

      {/* Real-time Safety Command Audit Log */}
      <div 
        style={{
          backgroundColor: 'var(--bg-mine-black)',
          border: '1px solid var(--panel-border)',
          borderRadius: 'var(--radius-sm)',
          padding: '1rem',
          maxHeight: '160px',
          overflowY: 'auto'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
          <Terminal size={14} color="#95A39B" />
          <span className="system-label-subtle">COMMAND & ACTUATION AUDIT LOG:</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>
          {commandLog.map((log) => (
            <div key={log.id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'baseline' }}>
              <span style={{ color: 'var(--text-dim)' }}>[{log.time}]</span>
              <span style={{ color: log.type === 'CMD' ? 'var(--accent-amber)' : (log.type === 'ENV' ? '#4A90E2' : 'var(--text-muted)'), fontWeight: 700 }}>
                {log.type}:
              </span>
              <span style={{ color: 'var(--text-white)' }}>{log.msg}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .command-path-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
