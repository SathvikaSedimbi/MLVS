import React from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { 
  Brain, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Gauge, 
  Activity, 
  Compass, 
  Eye, 
  Flame, 
  User, 
  Cpu, 
  ArrowRight,
  Radio
} from 'lucide-react';

export const RiskEnginePanel = () => {
  const { 
    frontDistance, 
    rearDistance,
    visibilityIndex, 
    v01Speed, 
    closingSpeed, 
    ttc, 
    riskAnalysis,
    gasHazard,
    gasLevel,
    pirMotion,
    irObstacle,
    potVolt,
    potAdc,
    ldrVolt
  } = useTelemetry();

  // 1. Obstacle Presence Determination
  const obstaclePresent = (frontDistance !== null && frontDistance < 150) || irObstacle;
  
  // 2. Risk Level (High/Low based on obstacle presence & hazard inputs)
  const isCritical = riskAnalysis.risk_level === 'CRITICAL' || (frontDistance !== null && frontDistance < 35) || irObstacle;
  const isHighRisk = obstaclePresent || isCritical || riskAnalysis.risk_level === 'HIGH';
  const riskStatus = isCritical ? 'CRITICAL' : (isHighRisk ? 'HIGH' : 'LOW');
  
  const riskThemeColor = isCritical ? '#E05252' : (isHighRisk ? '#F5A623' : '#35C77A');
  const riskThemeBg = isCritical ? 'rgba(224, 82, 82, 0.12)' : (isHighRisk ? 'rgba(245, 166, 35, 0.12)' : 'rgba(53, 199, 122, 0.12)');
  const riskBorderColor = isCritical ? 'rgba(224, 82, 82, 0.35)' : (isHighRisk ? 'rgba(245, 166, 35, 0.35)' : 'rgba(53, 199, 122, 0.35)');

  // 3. TTC Based on Ground Speed
  // Formula: TTC = Distance (m) / Ground Speed (m/s)
  const groundSpeedMps = v01Speed > 0 ? (v01Speed / 3.6) : 0;
  const distMeters = frontDistance !== null ? (frontDistance / 100.0) : null;
  
  let ttcGroundSpeedSec = null;
  if (distMeters !== null && groundSpeedMps > 0.1) {
    ttcGroundSpeedSec = (distMeters / groundSpeedMps).toFixed(2);
  }

  // 4. Action & Safe Path
  const recommendedAction = isCritical ? 'EMERGENCY STOP' : (isHighRisk ? 'REDUCE SPEED 50%' : 'MAINTAIN SAFE SPEED');
  const safePath = isCritical ? 'STOP IMMEDIATELY' : (isHighRisk ? 'BEAR LEFT (AVOID OBSTACLE)' : 'CLEAR CORRIDOR');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      
      {/* 1. Header Banner */}
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'var(--bg-graphite)',
          border: '1px solid var(--panel-border)',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem 1.5rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div 
            style={{
              width: '40px',
              height: '40px',
              backgroundColor: 'var(--bg-mine-black)',
              border: `1.5px solid ${riskThemeColor}`,
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: riskThemeColor
            }}
          >
            <Brain size={22} />
          </div>
          <div>
            <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-white)' }}>
              AUTOMATED SAFETY RISK ENGINE
            </h2>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              REAL-TIME SENSOR FUSION & GROUND-SPEED KINEMATIC TTC EVALUATOR
            </div>
          </div>
        </div>

        {/* Master Risk Badge */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            backgroundColor: riskThemeBg,
            border: `1.5px solid ${riskThemeColor}`,
            padding: '0.5rem 1.25rem',
            borderRadius: 'var(--radius-sm)'
          }}
        >
          <span 
            style={{ 
              width: '10px', 
              height: '10px', 
              borderRadius: '50%', 
              backgroundColor: riskThemeColor,
              boxShadow: `0 0 10px ${riskThemeColor}` 
            }} 
          />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', fontWeight: 900, color: riskThemeColor, letterSpacing: '0.05em' }}>
            OVERALL RISK: {riskStatus}
          </span>
        </div>
      </div>

      {/* 2. Primary 4-Card Outputs Grid */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.25rem'
        }}
      >
        {/* Card 1: RISK LEVEL (HIGH/LOW based on obstacle presence) */}
        <div 
          style={{
            backgroundColor: 'var(--bg-graphite)',
            border: `1px solid ${riskBorderColor}`,
            borderRadius: 'var(--radius-md)',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>
              01 // RISK EVALUATION
            </span>
            {isHighRisk ? <AlertTriangle size={18} color={riskThemeColor} /> : <ShieldCheck size={18} color="#35C77A" />}
          </div>

          <div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: '2rem', fontWeight: 900, color: riskThemeColor, lineHeight: 1.1 }}>
              RISK = {riskStatus}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.5rem' }}>
              DETERMINATION: <strong style={{ color: 'var(--text-white)' }}>
                {obstaclePresent ? 'OBSTACLE DETECTED IN PATH' : 'CORRIDOR CLEAR (NO OBSTACLE)'}
              </strong>
            </div>
          </div>

          <div 
            style={{
              marginTop: '1rem',
              padding: '0.4rem 0.65rem',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--bg-mine-black)',
              border: '1px solid var(--panel-border-subtle)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.68rem',
              color: 'var(--text-muted)'
            }}
          >
            RULE: Obstacle Presence &rarr; <span style={{ color: riskThemeColor, fontWeight: 700 }}>{riskStatus} RISK</span>
          </div>
        </div>

        {/* Card 2: TTC (Based on Ground Speed) */}
        <div 
          style={{
            backgroundColor: 'var(--bg-graphite)',
            border: '1px solid var(--panel-border)',
            borderRadius: 'var(--radius-md)',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>
              02 // KINEMATIC TTC
            </span>
            <Activity size={18} color="#64DCFF" />
          </div>

          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '2rem', fontWeight: 900, color: ttcGroundSpeedSec && parseFloat(ttcGroundSpeedSec) < 2.0 ? '#E05252' : '#64DCFF', lineHeight: 1.1 }}>
              {ttcGroundSpeedSec !== null ? `${ttcGroundSpeedSec} s` : (v01Speed <= 0.5 ? 'STATIONARY' : 'SAFE / NO ECHO')}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '0.5rem' }}>
              CALCULATION: <strong style={{ color: '#64DCFF' }}>TTC = Distance &divide; Ground Speed</strong>
            </div>
          </div>

          <div 
            style={{
              marginTop: '1rem',
              padding: '0.4rem 0.65rem',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--bg-mine-black)',
              border: '1px solid var(--panel-border-subtle)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.68rem',
              color: 'var(--text-muted)',
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <span>Dist: {distMeters !== null ? `${distMeters.toFixed(2)}m` : '--'}</span>
            <span>&divide;</span>
            <span>Speed: {groundSpeedMps.toFixed(2)} m/s ({v01Speed.toFixed(1)} km/h)</span>
          </div>
        </div>

        {/* Card 3: Obstacle Presence Sensor Readout */}
        <div 
          style={{
            backgroundColor: 'var(--bg-graphite)',
            border: '1px solid var(--panel-border)',
            borderRadius: 'var(--radius-md)',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>
              03 // OBSTACLE PRESENCE
            </span>
            <Eye size={18} color={obstaclePresent ? '#E05252' : '#35C77A'} />
          </div>

          <div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: '1.4rem', fontWeight: 800, color: obstaclePresent ? '#E05252' : '#35C77A', lineHeight: 1.2 }}>
              {obstaclePresent ? 'OBSTACLE DETECTED' : 'CORRIDOR CLEAR'}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.5rem' }}>
              FRONT DISTANCE: <strong style={{ color: 'var(--text-white)' }}>
                {frontDistance !== null ? `${frontDistance} cm` : 'NO ECHO'}
              </strong>
            </div>
          </div>

          <div 
            style={{
              marginTop: '1rem',
              padding: '0.4rem 0.65rem',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--bg-mine-black)',
              border: '1px solid var(--panel-border-subtle)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.68rem',
              color: 'var(--text-muted)',
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <span>NEAR IR: <strong style={{ color: irObstacle ? '#E05252' : '#35C77A' }}>{irObstacle ? 'OBSTACLE' : 'CLEAR'}</strong></span>
            <span>REAR: <strong style={{ color: 'var(--text-white)' }}>{rearDistance !== null ? `${rearDistance}cm` : 'NO ECHO'}</strong></span>
          </div>
        </div>

        {/* Card 4: Vehicle Ground Speed (Throttle Input) */}
        <div 
          style={{
            backgroundColor: 'var(--bg-graphite)',
            border: '1px solid var(--panel-border)',
            borderRadius: 'var(--radius-md)',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>
              04 // VEHICLE GROUND SPEED
            </span>
            <Gauge size={18} color="#F5A623" />
          </div>

          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '2rem', fontWeight: 900, color: 'var(--text-white)', lineHeight: 1.1 }}>
              {v01Speed.toFixed(1)} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>km/h</span>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '0.5rem' }}>
              THROTTLE INPUT: <strong style={{ color: '#F5A623' }}>PA4 / ADC2_IN4 (0-30 km/h)</strong>
            </div>
          </div>

          <div 
            style={{
              marginTop: '1rem',
              padding: '0.4rem 0.65rem',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--bg-mine-black)',
              border: '1px solid var(--panel-border-subtle)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.68rem',
              color: 'var(--text-muted)',
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <span>ADC: {potAdc !== null ? `${potAdc} / 4095` : '--'}</span>
            <span>Volt: {potVolt !== null ? `${potVolt} mV` : '--'}</span>
          </div>
        </div>
      </div>

      {/* 3. Safety Guidance & Path Advisory Section */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.25rem'
        }}
      >
        {/* Recommended Driver Action */}
        <div 
          style={{
            backgroundColor: 'var(--bg-graphite)',
            border: `1px solid ${riskBorderColor}`,
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700 }}>
              RECOMMENDED SAFETY ACTION
            </span>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2rem', fontWeight: 900, color: riskThemeColor, marginTop: '0.25rem' }}>
              {recommendedAction}
            </div>
          </div>
          <div 
            style={{
              padding: '0.4rem 0.8rem',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: riskThemeBg,
              border: `1px solid ${riskThemeColor}`,
              color: riskThemeColor,
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              fontWeight: 800
            }}
          >
            {isHighRisk ? 'BRAKE / REDUCE SPEED' : 'PROCEED SAFELY'}
          </div>
        </div>

        {/* Recommended Safe Steering Vector */}
        <div 
          style={{
            backgroundColor: 'var(--bg-graphite)',
            border: '1px solid var(--panel-border)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700 }}>
              COLLISION AVOIDANCE PATH
            </span>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2rem', fontWeight: 900, color: '#64DCFF', marginTop: '0.25rem' }}>
              {safePath}
            </div>
          </div>
          <Compass size={24} color="#64DCFF" />
        </div>
      </div>

      {/* 4. Multi-Factor Environmental & Personnel Health Matrix */}
      <div 
        style={{
          backgroundColor: 'var(--bg-graphite)',
          border: '1px solid var(--panel-border)',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem 1.5rem'
        }}
      >
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, display: 'block', marginBottom: '1rem' }}>
          SECONDARY HAZARD SENSORS (ENVIRONMENTAL FUSION)
        </span>

        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem'
          }}
        >
          {/* LDR Visibility */}
          <div style={{ backgroundColor: 'var(--bg-mine-black)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--panel-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <Eye size={14} color="#64DCFF" />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)' }}>OPTICAL VISIBILITY</span>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', fontWeight: 800, color: visibilityIndex < 40 ? '#F5A623' : '#35C77A' }}>
              {visibilityIndex.toFixed(1)}%
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
              LDR: {ldrVolt !== null ? `${ldrVolt} mV` : '--'}
            </div>
          </div>

          {/* MQ Gas Hazard */}
          <div style={{ backgroundColor: 'var(--bg-mine-black)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--panel-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <Flame size={14} color={gasHazard ? '#E05252' : '#35C77A'} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)' }}>MQ GAS HAZARD</span>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', fontWeight: 800, color: gasHazard ? '#E05252' : '#35C77A' }}>
              {gasHazard ? 'HAZARDOUS' : 'NORMAL'}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
              MQ Level: {gasLevel || 'LOW'}
            </div>
          </div>

          {/* PIR Personnel Motion */}
          <div style={{ backgroundColor: 'var(--bg-mine-black)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--panel-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <User size={14} color={pirMotion ? '#F5A623' : '#35C77A'} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)' }}>PERSONNEL DETECTION</span>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', fontWeight: 800, color: pirMotion ? '#F5A623' : '#35C77A' }}>
              {pirMotion ? 'MOTION IN HAUL ROAD' : 'CLEAR CORRIDOR'}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
              PIR Sensor PB0
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
