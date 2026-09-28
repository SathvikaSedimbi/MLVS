import React from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Radio, 
  Eye, 
  Flame, 
  User, 
  Gauge, 
  Activity, 
  ArrowUp, 
  ArrowLeft, 
  ArrowRight, 
  Octagon, 
  Terminal,
  Cpu
} from 'lucide-react';

export const ModernDigitalDisplay = () => {
  const {
    hardwareConnected,
    comPort,
    baudRate,
    packetCount,
    vehicleId,
    v01Speed,
    frontDistance,
    rearDistance,
    visibilityIndex,
    gasHazard,
    gasLevel,
    pirMotion,
    irObstacle,
    ldrVolt,
    potVolt,
    temperature,
    humidity,
    dht11Status,
    ttc,
    riskAnalysis,
    oledDownlink,
    oledHardwareStatus,
    oledI2cAddr
  } = useTelemetry();

  // Normalize distance for radar SVG Y coordinate (20cm to 250cm -> Y: 260 to 70)
  const dist = frontDistance !== null && frontDistance !== undefined ? frontDistance : 150;
  const radarY = Math.max(70, Math.min(270, 290 - (dist * 1.5)));

  // Risk color theme
  const isCritical = riskAnalysis.risk_level === 'CRITICAL' || (frontDistance !== null && frontDistance < 30) || gasHazard || irObstacle;
  const isWarning = !isCritical && (riskAnalysis.risk_level === 'HIGH' || riskAnalysis.risk_level === 'MEDIUM' || (frontDistance !== null && frontDistance < 60));
  
  const themeColor = isCritical ? '#E05252' : (isWarning ? '#F5A623' : '#35C77A');
  const themeBg = isCritical ? 'rgba(224, 82, 82, 0.12)' : (isWarning ? 'rgba(245, 166, 35, 0.12)' : 'rgba(53, 199, 122, 0.12)');
  const statusTitle = isCritical ? 'CRITICAL HAZARD DETECTED' : (isWarning ? 'ELEVATED CAUTION' : 'CORRIDOR CLEAR');
  const actionText = isCritical ? 'EMERGENCY STOP' : (isWarning ? 'REDUCE SPEED 50%' : 'MAINTAIN SAFE SPEED');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      
      {/* 1. Streamlined Top Mission Bar */}
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'var(--bg-graphite)',
          border: `1px solid ${isCritical ? '#E05252' : 'var(--panel-border)'}`,
          borderRadius: 'var(--radius-md)',
          padding: '1rem 1.5rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div 
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: hardwareConnected ? '#35C77A' : '#F5A623',
              boxShadow: hardwareConnected ? '0 0 12px #35C77A' : 'none'
            }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-white)' }}>
                VEHICLE {vehicleId}
              </span>
              <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>//</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: hardwareConnected ? '#35C77A' : '#F5A623' }}>
                STM32 NUCLEO {comPort} @ {baudRate} BAUD
              </span>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
              LIVE SENSOR STREAM // {packetCount} PACKETS INGESTED
            </div>
          </div>
        </div>

        {/* Action Callout Badge */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            backgroundColor: themeBg,
            border: `1.5px solid ${themeColor}`,
            padding: '0.5rem 1.25rem',
            borderRadius: 'var(--radius-sm)'
          }}
        >
          {isCritical ? <Octagon size={18} color="#E05252" /> : (isWarning ? <AlertTriangle size={18} color="#F5A623" /> : <ShieldCheck size={18} color="#35C77A" />)}
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', fontWeight: 700, color: themeColor, letterSpacing: '0.08em' }}>
              {statusTitle}
            </div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', fontWeight: 800, color: 'var(--text-white)' }}>
              {actionText}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Hero Interactive Digital Twin & Onboard OLED Display (2-Column Grid) */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(500px, 1.4fr) minmax(360px, 1fr)',
          gap: '1.5rem'
        }}
        className="hero-digital-grid"
      >
        {/* Left Column: Modern Tactical Haul Corridor (Digital Twin) */}
        <div 
          className="industrial-corners"
          style={{
            backgroundColor: 'var(--bg-graphite)',
            border: `1px solid ${isCritical ? 'rgba(224, 82, 82, 0.4)' : 'var(--panel-border)'}`,
            borderRadius: 'var(--radius-md)',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            minHeight: '440px',
            position: 'relative'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Radio size={16} color="#F5A623" />
              <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', fontWeight: 700, color: 'var(--text-white)' }}>
                HAUL ROAD DIGITAL TWIN & RADAR
              </h3>
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
              REAL ACOUSTIC & IR FUSION
            </span>
          </div>

          {/* Radar Screen Area */}
          <div 
            style={{
              flex: 1,
              backgroundColor: '#090C0B',
              border: '1px solid #1C2420',
              borderRadius: 'var(--radius-sm)',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '340px'
            }}
          >
            {/* Optical Fog Density Layer (reactive to real LDR) */}
            <div 
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(180, 200, 190, 0.08)',
                backdropFilter: `blur(${Math.max(0, (100 - visibilityIndex) / 25)}px)`,
                opacity: Math.max(0.05, (100 - visibilityIndex) / 100),
                pointerEvents: 'none',
                zIndex: 1
              }}
            />

            {/* SVG Corridor */}
            <svg viewBox="0 0 420 360" style={{ width: '100%', height: '100%', maxHeight: '360px', zIndex: 2 }}>
              <defs>
                <pattern id="radar-dots" width="24" height="24" patternUnits="userSpaceOnUse">
                  <circle cx="12" cy="12" r="1" fill="rgba(232, 236, 233, 0.06)" />
                </pattern>
                <linearGradient id="beamGrad" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%" stopColor="#F5A623" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#F5A623" stopOpacity="0.02" />
                </linearGradient>
              </defs>

              <rect width="420" height="360" fill="url(#radar-dots)" />

              {/* Corridor Road Boundaries */}
              <line x1="90" y1="0" x2="90" y2="360" stroke="#25302A" strokeWidth="2.5" strokeDasharray="8 6" />
              <line x1="330" y1="0" x2="330" y2="360" stroke="#25302A" strokeWidth="2.5" strokeDasharray="8 6" />
              <line x1="210" y1="0" x2="210" y2="360" stroke="rgba(232, 236, 233, 0.08)" strokeWidth="1.5" strokeDasharray="12 10" />

              {/* Distance Concentric Circles */}
              <circle cx="210" cy="310" r="55" fill="none" stroke="rgba(224, 82, 82, 0.35)" strokeWidth="1" strokeDasharray="4 4" />
              <circle cx="210" cy="310" r="115" fill="none" stroke="rgba(245, 166, 35, 0.3)" strokeWidth="1" strokeDasharray="4 4" />
              <circle cx="210" cy="310" r="190" fill="none" stroke="rgba(232, 236, 233, 0.12)" strokeWidth="1" />

              <text x="218" y="260" fill="rgba(224, 82, 82, 0.8)" fontSize="8.5" fontFamily="monospace">30cm CRITICAL</text>
              <text x="218" y="200" fill="rgba(245, 166, 35, 0.8)" fontSize="8.5" fontFamily="monospace">60cm CAUTION</text>

              {/* Ultrasonic Beam Projection */}
              <polygon points="200,305 220,305 270,110 150,110" fill="url(#beamGrad)" />

              {/* Pulsing Acoustic Echo Wave */}
              {frontDistance !== null && (
                <path d="M 185,255 Q 210,245 235,255" fill="none" stroke="#F5A623" strokeWidth="1.5" opacity="0.8">
                  <animate attributeName="opacity" values="0.8;0.2;0.8" dur="1s" repeatCount="indefinite" />
                </path>
              )}

              {/* Detected Obstacle (Reactive to real HC-SR04) */}
              {frontDistance !== null ? (
                <g transform={`translate(210, ${radarY})`}>
                  {/* Pulsing ring if critical proximity */}
                  {frontDistance < 40 && (
                    <circle cx="0" cy="0" r="26" fill="none" stroke={themeColor} strokeWidth="1.5" opacity="0.7">
                      <animate attributeName="r" values="20;30;20" dur="1.2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.8;0.2;0.8" dur="1.2s" repeatCount="indefinite" />
                    </circle>
                  )}
                  <rect x="-24" y="-15" width="48" height="30" rx="4" fill="#171D1A" stroke={themeColor} strokeWidth="2" />
                  <text x="0" y="3" textAnchor="middle" fill="#E8ECE9" fontSize="9" fontWeight="bold" fontFamily="monospace">
                    OBSTACLE
                  </text>
                  <text x="0" y="-20" textAnchor="middle" fill={themeColor} fontSize="9" fontWeight="bold" fontFamily="monospace">
                    {frontDistance} cm
                  </text>
                </g>
              ) : (
                <g transform="translate(210, 140)">
                  <text x="0" y="0" textAnchor="middle" fill="#5A6660" fontSize="10" fontFamily="monospace">
                    CORRIDOR AHEAD CLEAR (NO ECHO)
                  </text>
                </g>
              )}

              {/* IR Near-Field Barrier Alert */}
              {irObstacle && (
                <g transform="translate(210, 275)">
                  <rect x="-42" y="-6" width="84" height="13" rx="3" fill="rgba(224, 82, 82, 0.35)" stroke="#E05252" strokeWidth="1.5" />
                  <text x="0" y="3.5" textAnchor="middle" fill="#E05252" fontSize="7.5" fontWeight="bold" fontFamily="monospace">
                    IR BLIND-SPOT BARRIER
                  </text>
                </g>
              )}

              {/* PIR Personnel Indicator */}
              {pirMotion && (
                <g transform="translate(130, 225)">
                  <circle cx="0" cy="0" r="14" fill="rgba(245, 166, 35, 0.25)" stroke="#F5A623" strokeWidth="1.5">
                    <animate attributeName="r" values="10;17;10" dur="1s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="0" cy="-3" r="3.5" fill="#F5A623" />
                  <path d="M -4,7 Q 0,3 4,7" stroke="#F5A623" strokeWidth="2" fill="none" />
                  <text x="0" y="18" textAnchor="middle" fill="#F5A623" fontSize="7.5" fontFamily="monospace" fontWeight="bold">
                    PERSONNEL
                  </text>
                </g>
              )}

              {/* Gas Hazard Indicator */}
              {gasHazard && (
                <g transform="translate(290, 160)">
                  <circle cx="0" cy="0" r="26" fill="rgba(224, 82, 82, 0.2)" stroke="#E05252" strokeWidth="1.2" strokeDasharray="3 3">
                    <animate attributeName="r" values="22;30;22" dur="1.5s" repeatCount="indefinite" />
                  </circle>
                  <text x="0" y="-3" textAnchor="middle" fill="#E05252" fontSize="7.5" fontWeight="bold" fontFamily="monospace">GAS HAZARD</text>
                  <text x="0" y="9" textAnchor="middle" fill="#E8ECE9" fontSize="7" fontFamily="monospace">MQ HIGH</text>
                </g>
              )}

              {/* Primary Instrumented Vehicle V-01 */}
              <g transform="translate(210, 320)">
                <rect x="-26" y="-18" width="52" height="36" rx="4" fill="#151A18" stroke="#F5A623" strokeWidth="2" />
                <text x="0" y="3" textAnchor="middle" fill="#E8ECE9" fontSize="11" fontWeight="bold" fontFamily="monospace">V01</text>
                <text x="0" y="27" textAnchor="middle" fill="#F5A623" fontSize="8" fontFamily="monospace">
                  {v01Speed} km/h
                </text>
                {/* Ultrasonic sensor points */}
                <circle cx="0" cy="-18" r="3" fill="#F5A623" />
                <circle cx="0" cy="18" r="3" fill="#95A39B" />
              </g>
            </svg>

            {/* In-Radar HUD Overlay */}
            <div 
              style={{
                position: 'absolute',
                bottom: '10px',
                left: '12px',
                backgroundColor: 'rgba(9, 12, 11, 0.85)',
                border: '1px solid #1C2420',
                borderRadius: 'var(--radius-sm)',
                padding: '0.35rem 0.65rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.68rem',
                color: 'var(--text-muted)'
              }}
            >
              FRONT: <strong style={{ color: 'var(--text-white)' }}>{frontDistance !== null ? `${frontDistance} cm` : 'NO ECHO'}</strong> | REAR: <strong style={{ color: 'var(--text-white)' }}>{rearDistance !== null ? `${rearDistance} cm` : 'NO ECHO'}</strong>
            </div>

            <div 
              style={{
                position: 'absolute',
                top: '10px',
                right: '12px',
                backgroundColor: 'rgba(9, 12, 11, 0.85)',
                border: '1px solid #1C2420',
                borderRadius: 'var(--radius-sm)',
                padding: '0.35rem 0.65rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.68rem',
                color: 'var(--text-muted)'
              }}
            >
              VISIBILITY: <strong style={{ color: 'var(--text-white)' }}>{visibilityIndex}%</strong>
            </div>
          </div>
        </div>

        {/* Right Column: Authentic Onboard OLED Screen Simulator */}
        <div 
          className="industrial-corners"
          style={{
            backgroundColor: 'var(--bg-graphite)',
            border: '1px solid var(--panel-border)',
            borderRadius: 'var(--radius-md)',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Cpu size={16} color="#35C77A" />
              <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', fontWeight: 700, color: 'var(--text-white)' }}>
                ONBOARD OLED COCKPIT DISPLAY
              </h3>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span 
                style={{ 
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontFamily: 'var(--font-mono)', 
                  fontSize: '0.65rem', 
                  color: oledHardwareStatus === 'ACTIVE' ? '#35C77A' : '#E05252',
                  backgroundColor: oledHardwareStatus === 'ACTIVE' ? 'rgba(53, 199, 122, 0.15)' : 'rgba(224, 82, 82, 0.15)',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '100px',
                  border: `1px solid ${oledHardwareStatus === 'ACTIVE' ? 'rgba(53, 199, 122, 0.3)' : 'rgba(224, 82, 82, 0.3)'}`
                }}
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: oledHardwareStatus === 'ACTIVE' ? '#35C77A' : '#E05252' }} />
                PHYSICAL OLED: {oledHardwareStatus === 'ACTIVE' ? `LIVE (${oledI2cAddr})` : 'CHECK WIRING'}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#95A39B' }}>
                PB8/PB9 I2C1
              </span>
            </div>
          </div>

          {/* Authentic High-Tech OLED Bezel */}
          <div 
            style={{
              backgroundColor: '#050706',
              border: '4px solid #141A17',
              borderRadius: '8px',
              padding: '1.25rem',
              boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.9), 0 4px 15px rgba(0, 0, 0, 0.6)',
              minHeight: '180px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative'
            }}
          >
            {/* Glass reflection gradient */}
            <div 
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '40%',
                background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 100%)',
                pointerEvents: 'none'
              }}
            />

            {/* Screen Header Line */}
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(100, 220, 255, 0.2)', paddingBottom: '0.35rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#64DCFF', fontWeight: 700, letterSpacing: '0.05em' }}>
                NMDC MLVS v1.0
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#64DCFF' }}>
                {vehicleId}
              </span>
            </div>

            {/* Screen Body */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', margin: '0.6rem 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#95A39B' }}>DIST FRONT:</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', fontWeight: 800, color: frontDistance !== null && frontDistance < 40 ? '#FF5555' : '#64DCFF' }}>
                  {frontDistance !== null ? `${frontDistance} cm` : 'NO ECHO'}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#95A39B' }}>DIST REAR:</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', fontWeight: 700, color: '#64DCFF' }}>
                  {rearDistance !== null ? `${rearDistance} cm` : 'NO ECHO'}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#95A39B' }}>GAS / PIR:</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, color: gasHazard ? '#FF5555' : '#64DCFF' }}>
                  {gasLevel} / {pirMotion ? 'MOTION' : 'CLEAR'}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#95A39B' }}>IR SENSOR:</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, color: irObstacle ? '#FF5555' : '#64DCFF' }}>
                  {irObstacle ? 'OBSTACLE' : 'CLEAR'}
                </span>
              </div>
            </div>

            {/* Screen Footer Action Banner */}
            <div 
              style={{
                backgroundColor: isCritical ? '#FF5555' : (isWarning ? '#F5A623' : '#64DCFF'),
                color: '#050706',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem',
                fontWeight: 900,
                textAlign: 'center',
                padding: '0.25rem',
                borderRadius: '2px',
                letterSpacing: '0.06em'
              }}
            >
              ACTION: {actionText}
            </div>
          </div>

          {/* OLED Downlink Serial Command Stream */}
          <div 
            style={{
              backgroundColor: 'var(--bg-mine-black)',
              border: '1px solid var(--panel-border)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.75rem 1rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
              <Terminal size={12} color="#F5A623" />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                STM32 SERIAL DOWNLINK FRAME (COM7 TX):
              </span>
            </div>
            <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent-amber)', wordBreak: 'break-all' }}>
              {oledDownlink.trim()}
            </code>
          </div>
        </div>
      </div>

      {/* 3. Clean Digital Sensor Gauges (Row of 6 High-Impact Cards) */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: '1rem'
        }}
      >
        {/* Front HC-SR04 */}
        <div style={{ backgroundColor: 'var(--bg-graphite)', border: `1px solid ${frontDistance !== null && frontDistance < 40 ? 'var(--status-critical)' : 'var(--panel-border)'}`, borderRadius: 'var(--radius-sm)', padding: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)' }}>FRONT HC-SR04</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-dim)' }}>PA8 / PB10</span>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem', fontWeight: 800, color: frontDistance !== null && frontDistance < 40 ? 'var(--status-critical)' : 'var(--text-white)' }}>
            {frontDistance !== null ? `${frontDistance} cm` : 'NO ECHO'}
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
            ACOUSTIC DISTANCE
          </div>
        </div>

        {/* Rear Ultrasonic */}
        <div style={{ backgroundColor: 'var(--bg-graphite)', border: '1px solid var(--panel-border)', borderRadius: 'var(--radius-sm)', padding: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)' }}>REAR HC-SR04</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-dim)' }}>PC7 / PB4</span>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem', fontWeight: 800, color: rearDistance !== null && rearDistance < 40 ? 'var(--status-critical)' : 'var(--text-white)' }}>
            {rearDistance !== null ? `${rearDistance} cm` : 'NO ECHO'}
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
            REAR PROXIMITY
          </div>
        </div>

        {/* MQ Gas Sensor */}
        <div style={{ backgroundColor: 'var(--bg-graphite)', border: `1px solid ${gasHazard ? 'var(--status-critical)' : 'var(--panel-border)'}`, borderRadius: 'var(--radius-sm)', padding: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)' }}>MQ GAS HAZARD</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-dim)' }}>PC0</span>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 800, color: gasHazard ? 'var(--status-critical)' : '#35C77A' }}>
            {gasLevel} {gasHazard ? '(HAZARD)' : '(NORMAL)'}
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
            TOXIC GAS / SMOKE
          </div>
        </div>

        {/* PIR Personnel */}
        <div style={{ backgroundColor: 'var(--bg-graphite)', border: `1px solid ${pirMotion ? 'var(--accent-amber)' : 'var(--panel-border)'}`, borderRadius: 'var(--radius-sm)', padding: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)' }}>PIR MOTION</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-dim)' }}>PB0</span>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 800, color: pirMotion ? 'var(--accent-amber)' : 'var(--text-dim)' }}>
            {pirMotion ? 'MOTION' : 'CLEAR'}
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
            PERSONNEL DETECTION
          </div>
        </div>

        {/* IR Obstacle */}
        <div style={{ backgroundColor: 'var(--bg-graphite)', border: `1px solid ${irObstacle ? 'var(--status-critical)' : 'var(--panel-border)'}`, borderRadius: 'var(--radius-sm)', padding: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)' }}>IR OBSTACLE</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-dim)' }}>PB1</span>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 800, color: irObstacle ? 'var(--status-critical)' : '#35C77A' }}>
            {irObstacle ? 'OBSTACLE' : 'CLEAR'}
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
            BLIND-SPOT BARRIER
          </div>
        </div>

        {/* LDR / Environment */}
        <div style={{ backgroundColor: 'var(--bg-graphite)', border: '1px solid var(--panel-border)', borderRadius: 'var(--radius-sm)', padding: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)' }}>VISIBILITY (LDR)</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-dim)' }}>PA4 ADC</span>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem', fontWeight: 800, color: visibilityIndex < 40 ? 'var(--accent-amber)' : 'var(--text-white)' }}>
            {visibilityIndex}%
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
            LDR: {ldrVolt !== null ? `${ldrVolt} mV` : 'OK'}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 980px) {
          .hero-digital-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
