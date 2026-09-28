import React from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { Radio, AlertTriangle, ShieldCheck, Compass, User, Flame, ArrowUpRight, ArrowUpLeft, AlertOctagon, Terminal } from 'lucide-react';

export const TacticalCorridorRadar = () => {
  const { 
    frontDistance, 
    leftDistance, 
    rightDistance, 
    visibilityIndex, 
    v01Speed, 
    v2vActive,
    riskAnalysis,
    hardwareConnected,
    isSimulatingLive,
    comPort,
    pirMotion,
    irObstacle,
    gasHazard,
    ttc,
    oledDownlink
  } = useTelemetry();

  // Map frontDistance (18 - 250cm) to pixel coordinates (e.g. Y: 290 down to 80)
  const normalizedY = Math.max(70, Math.min(280, 310 - (frontDistance * 1.5)));

  const stateColor = riskAnalysis.state === 'CRITICAL' 
    ? 'var(--status-critical)' 
    : (riskAnalysis.state === 'WARNING' ? 'var(--accent-amber)' : 'var(--status-safe)');

  const ttcDisplay = ttc !== null && ttc !== undefined ? `${ttc}s` : '---';

  return (
    <div 
      className="industrial-corners"
      style={{
        backgroundColor: 'var(--bg-graphite)',
        border: `1px solid ${riskAnalysis.state === 'CRITICAL' ? 'var(--status-critical-border)' : 'var(--panel-border)'}`,
        borderRadius: 'var(--radius-md)',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: '480px',
        position: 'relative'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Radio size={16} color="#F5A623" />
          <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-white)' }}>
            TACTICAL RADAR & DIGITAL TWIN HAUL CORRIDOR
          </h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          {/* Hardware Connection Indicator */}
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.66rem',
              padding: '0.2rem 0.55rem',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--bg-mine-black)',
              border: `1px solid ${hardwareConnected ? 'var(--status-safe)' : 'var(--panel-border)'}`,
              color: hardwareConnected ? 'var(--status-safe)' : 'var(--text-muted)'
            }}
          >
            <span className={`status-dot ${hardwareConnected ? 'safe' : 'amber'}`} style={{ width: '6px', height: '6px' }} />
            <span>{hardwareConnected ? `STM32 ${comPort} LIVE` : (isSimulatingLive ? 'SIMULATED' : 'WAITING HARDWARE')}</span>
          </div>

          <span 
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.66rem',
              fontWeight: 700,
              padding: '0.2rem 0.55rem',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--bg-mine-black)',
              border: `1px solid ${stateColor}`,
              color: stateColor
            }}
          >
            ZONE: {riskAnalysis.state || 'NORMAL'}
          </span>
        </div>
      </div>

      {/* 2D Corridor Canvas/SVG Container */}
      <div 
        style={{
          flex: 1,
          backgroundColor: 'var(--bg-mine-black)',
          border: '1px solid var(--panel-border)',
          borderRadius: 'var(--radius-sm)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '340px'
        }}
      >
        {/* Dynamic Fog Shroud Layer (reactive to LDR visibility) */}
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(160, 180, 170, 0.12)',
            backdropFilter: `blur(${Math.max(0, (100 - visibilityIndex) / 22)}px)`,
            opacity: Math.max(0.05, (100 - visibilityIndex) / 100),
            pointerEvents: 'none',
            zIndex: 1,
            transition: 'all 0.3s ease'
          }}
        />

        {/* SVG Top-down corridor simulation */}
        <svg 
          viewBox="0 0 400 360" 
          style={{ width: '100%', height: '100%', maxHeight: '380px', position: 'relative', zIndex: 2 }}
        >
          {/* Grid lines */}
          <defs>
            <pattern id="radar-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(232, 236, 233, 0.04)" strokeWidth="1" />
            </pattern>

            <linearGradient id="front-beam" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#F5A623" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#F5A623" stopOpacity="0.02" />
            </linearGradient>

            <linearGradient id="left-beam" x1="1" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#95A39B" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#95A39B" stopOpacity="0.02" />
            </linearGradient>

            <linearGradient id="right-beam" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="#95A39B" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#95A39B" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          <rect width="400" height="360" fill="url(#radar-grid)" />

          {/* Haul road corridor berm boundaries */}
          <line x1="80" y1="0" x2="80" y2="360" stroke="#232C28" strokeWidth="2" strokeDasharray="6 4" />
          <line x1="320" y1="0" x2="320" y2="360" stroke="#232C28" strokeWidth="2" strokeDasharray="6 4" />
          <line x1="200" y1="0" x2="200" y2="360" stroke="rgba(232, 236, 233, 0.08)" strokeWidth="1" strokeDasharray="10 8" />

          {/* Distance threshold concentric markers */}
          <circle cx="200" cy="310" r="60" fill="none" stroke="rgba(224, 82, 82, 0.3)" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="200" cy="310" r="120" fill="none" stroke="rgba(245, 166, 35, 0.3)" strokeWidth="1" strokeDasharray="4 4" />
          <circle cx="200" cy="310" r="200" fill="none" stroke="rgba(232, 236, 233, 0.1)" strokeWidth="1" />

          <text x="210" y="255" fill="rgba(224, 82, 82, 0.7)" fontSize="9" fontFamily="monospace">30cm STOP</text>
          <text x="210" y="195" fill="rgba(245, 166, 35, 0.7)" fontSize="9" fontFamily="monospace">60cm ADVISORY</text>
          <text x="210" y="115" fill="rgba(232, 236, 233, 0.4)" fontSize="9" fontFamily="monospace">100cm BUFFER</text>

          {/* V01 Ultrasonic Beams */}
          <polygon points="190,305 210,305 260,110 140,110" fill="url(#front-beam)" />
          <polygon points="178,315 178,335 90,270 115,240" fill="url(#left-beam)" />
          <polygon points="222,315 222,335 310,270 285,240" fill="url(#right-beam)" />

          {/* Active Echo Wave Arcs */}
          <path d="M 180,260 Q 200,250 220,260" fill="none" stroke="#F5A623" strokeWidth="1.5" opacity="0.8" />
          <path d="M 165,210 Q 200,195 235,210" fill="none" stroke="#F5A623" strokeWidth="1.2" opacity="0.6" />
          <path d="M 150,160 Q 200,140 250,160" fill="none" stroke="#F5A623" strokeWidth="1" opacity="0.4" />

          {/* IR Near-Field Obstacle Detection Barrier */}
          {irObstacle && (
            <g transform="translate(200, 275)">
              <rect x="-35" y="-6" width="70" height="12" rx="3" fill="rgba(224, 82, 82, 0.3)" stroke="#E05252" strokeWidth="1.5" />
              <text x="0" y="3" textAnchor="middle" fill="#E05252" fontSize="7" fontWeight="bold" fontFamily="monospace">
                IR BLIND-SPOT BARRIER
              </text>
            </g>
          )}

          {/* PIR Personnel Detection Indicator */}
          {pirMotion && (
            <g transform="translate(130, 230)">
              <circle cx="0" cy="0" r="14" fill="rgba(245, 166, 35, 0.25)" stroke="#F5A623" strokeWidth="1.5">
                <animate attributeName="r" values="10;18;10" dur="1s" repeatCount="indefinite" />
              </circle>
              <circle cx="0" cy="-3" r="4" fill="#F5A623" />
              <path d="M -5,9 Q 0,4 5,9" stroke="#F5A623" strokeWidth="2" fill="none" />
              <text x="0" y="18" textAnchor="middle" fill="#F5A623" fontSize="7" fontFamily="monospace" fontWeight="bold">
                PERSONNEL
              </text>
            </g>
          )}

          {/* MQ Toxic Gas Cloud Indicator */}
          {gasHazard && (
            <g transform="translate(280, 160)">
              <circle cx="0" cy="0" r="28" fill="rgba(224, 82, 82, 0.2)" stroke="#E05252" strokeWidth="1.2" strokeDasharray="3 3">
                <animate attributeName="r" values="22;32;22" dur="1.5s" repeatCount="indefinite" />
              </circle>
              <text x="0" y="-4" textAnchor="middle" fill="#E05252" fontSize="8" fontWeight="bold" fontFamily="monospace">GAS HAZARD</text>
              <text x="0" y="8" textAnchor="middle" fill="#E8ECE9" fontSize="7" fontFamily="monospace">MQ SENSOR HIGH</text>
            </g>
          )}

          {/* Target Obstacle / Haul Vehicle V02 (Reactive to HC-SR04) */}
          <g transform={`translate(200, ${normalizedY})`}>
            {frontDistance < 45 && (
              <circle cx="0" cy="0" r="28" fill="none" stroke={stateColor} strokeWidth="1.5" opacity="0.6">
                <animate attributeName="r" values="22;32;22" dur="1.2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.8;0.2;0.8" dur="1.2s" repeatCount="indefinite" />
              </circle>
            )}

            {/* V02 Vehicle Body */}
            <rect x="-24" y="-16" width="48" height="32" rx="4" fill="#1C2320" stroke={stateColor} strokeWidth="1.5" />
            <text x="0" y="4" textAnchor="middle" fill="#E8ECE9" fontSize="10" fontWeight="bold" fontFamily="monospace">V02</text>
            <text x="0" y="-22" textAnchor="middle" fill="#95A39B" fontSize="8" fontFamily="monospace">
              DIST: {frontDistance !== null && frontDistance !== undefined ? `${frontDistance}cm` : 'NO ECHO'}
            </text>

            {v2vActive && (
              <circle cx="16" cy="-10" r="3" fill="#35C77A" />
            )}
          </g>

          {/* Primary Lead Vehicle V01 */}
          <g transform="translate(200, 320)">
            <rect x="-24" y="-18" width="48" height="36" rx="4" fill="#151A18" stroke="#F5A623" strokeWidth="2" />
            <text x="0" y="3" textAnchor="middle" fill="#E8ECE9" fontSize="11" fontWeight="bold" fontFamily="monospace">V01</text>
            <text x="0" y="28" textAnchor="middle" fill="#F5A623" fontSize="8" fontFamily="monospace">
              {v01Speed} km/h
            </text>

            {/* Ultrasonic sensor points */}
            <circle cx="0" cy="-18" r="3" fill="#F5A623" />
            <circle cx="-24" cy="0" r="2.5" fill="#95A39B" />
            <circle cx="24" cy="0" r="2.5" fill="#95A39B" />
          </g>

          {/* Dynamic Safe Path Steering Vector */}
          {riskAnalysis.safe_path && riskAnalysis.safe_path !== 'STOP' && (
            <g transform="translate(200, 270)">
              {riskAnalysis.safe_path === 'BEAR_LEFT' ? (
                <path d="M 0,0 L -25,-30" stroke="#35C77A" strokeWidth="2.5" markerEnd="url(#arrow)" strokeDasharray="4 2" />
              ) : riskAnalysis.safe_path === 'BEAR_RIGHT' ? (
                <path d="M 0,0 L 25,-30" stroke="#35C77A" strokeWidth="2.5" strokeDasharray="4 2" />
              ) : (
                <path d="M 0,0 L 0,-35" stroke="#35C77A" strokeWidth="2" strokeDasharray="4 2" />
              )}
            </g>
          )}
        </svg>

        {/* Live Overlay HUD readouts */}
        <div 
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            backgroundColor: 'rgba(11, 14, 13, 0.88)',
            border: '1px solid var(--panel-border)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.4rem 0.75rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
            color: 'var(--text-muted)',
            zIndex: 5
          }}
        >
          <div>HC-SR04 FRONT: {frontDistance !== null && frontDistance !== undefined ? `${frontDistance} cm (${(frontDistance/100).toFixed(2)}m)` : 'NO ECHO'}</div>
          <div style={{ color: 'var(--accent-amber)' }}>SAFE PATH: {riskAnalysis.safe_path || 'CLEAR'}</div>
        </div>

        <div 
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            backgroundColor: 'rgba(11, 14, 13, 0.88)',
            border: '1px solid var(--panel-border)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.4rem 0.75rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
            textAlign: 'right',
            zIndex: 5
          }}
        >
          <div style={{ color: 'var(--text-white)' }}>KINEMATIC TTC: {ttcDisplay}</div>
          <div style={{ color: 'var(--text-muted)' }}>OPTICAL ATTEN: {100 - visibilityIndex}%</div>
        </div>
      </div>

      {/* OLED Downlink Stream Preview Bar */}
      <div 
        style={{
          marginTop: '1rem',
          backgroundColor: 'var(--bg-mine-black)',
          border: '1px solid var(--panel-border)',
          borderRadius: 'var(--radius-sm)',
          padding: '0.6rem 0.9rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Terminal size={14} color="#F5A623" />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-dim)' }}>
            STM32 OLED DOWNLINK:
          </span>
          <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--accent-amber)' }}>
            {oledDownlink}
          </code>
        </div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--status-safe)' }}>
          {hardwareConnected ? 'TRANSMITTING VIA COM7' : 'LOCAL BUFFER'}
        </span>
      </div>
    </div>
  );
};
