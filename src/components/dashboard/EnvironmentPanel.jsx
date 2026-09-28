import React from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { Eye, CloudRain, Thermometer, Wind, Compass, AlertTriangle, Layers } from 'lucide-react';

export const EnvironmentPanel = () => {
  const { 
    visibilityIndex, 
    setVisibilityIndex, 
    temperature, 
    applyScenario, 
    riskAnalysis 
  } = useTelemetry();

  // Speed of sound calculation for current temperature
  const soundSpeed = (331.3 * Math.sqrt(1 + temperature / 273.15)).toFixed(1);

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
            <CloudRain size={18} />
          </div>
          <div>
            <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-white)' }}>
              ENVIRONMENTAL CONDITIONS & OPTICAL ATTENUATION
            </h3>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
              LDR/LED TRANSMITTANCE SAMPLING & ACOUSTIC MEDIUM CALIBRATION
            </div>
          </div>
        </div>

        <span className="system-label-subtle">
          CHAMBER CALIBRATION: ACTIVE
        </span>
      </div>

      {/* Main Environmental Gauges */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1.25rem'
        }}
        className="env-grid"
      >
        {/* Optical Opacity */}
        <div style={{ backgroundColor: 'var(--bg-mine-black)', border: '1px solid var(--panel-border)', borderRadius: 'var(--radius-sm)', padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span className="system-label-subtle">OPTICAL VISIBILITY INDEX</span>
            <Eye size={14} color="#F5A623" />
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '2.4rem', fontWeight: 800, color: visibilityIndex < 40 ? 'var(--accent-amber)' : 'var(--text-white)' }}>
            {visibilityIndex}%
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
            Extinction Coeff α: {((100 - visibilityIndex) * 0.042).toFixed(2)} m⁻¹
          </div>
        </div>

        {/* Ambient Temperature & Sound Velocity */}
        <div style={{ backgroundColor: 'var(--bg-mine-black)', border: '1px solid var(--panel-border)', borderRadius: 'var(--radius-sm)', padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span className="system-label-subtle">AMBIENT TEMPERATURE</span>
            <Thermometer size={14} color="#95A39B" />
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '2.4rem', fontWeight: 800, color: 'var(--text-white)' }}>
            {temperature} <span style={{ fontSize: '1rem', color: 'var(--text-dim)' }}>°C</span>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--status-safe)', marginTop: '0.4rem' }}>
            Calibrated Sound Velocity: {soundSpeed} m/s
          </div>
        </div>

        {/* Atmospheric State */}
        <div style={{ backgroundColor: 'var(--bg-mine-black)', border: '1px solid var(--panel-border)', borderRadius: 'var(--radius-sm)', padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span className="system-label-subtle">ATMOSPHERIC PROFILE</span>
            <Wind size={14} color="#95A39B" />
          </div>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: '1.25rem', fontWeight: 800, color: visibilityIndex < 35 ? 'var(--status-critical)' : (visibilityIndex < 60 ? 'var(--accent-amber)' : 'var(--text-white)'), marginTop: '0.3rem' }}>
            {visibilityIndex < 35 ? 'MONSOONAL FOG' : (visibilityIndex < 60 ? 'FUGITIVE DUST' : 'NORMAL DAYLIGHT')}
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-dim)', marginTop: '0.5rem' }}>
            RISK IMPACT: {visibilityIndex < 40 ? '+30% TTC PENALTY' : 'NORMAL BUFFER'}
          </div>
        </div>
      </div>

      {/* Interactive Fog Density Adjustment */}
      <div 
        style={{
          backgroundColor: 'var(--bg-mine-black)',
          border: '1px solid var(--panel-border)',
          borderRadius: 'var(--radius-sm)',
          padding: '1.25rem'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <span className="system-label-subtle">CHAMBER ULTRASONIC FOG GENERATOR SIMULATOR:</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--accent-amber)', fontWeight: 700 }}>
            {visibilityIndex}% CLEARANCE
          </span>
        </div>

        <input 
          type="range"
          min="12"
          max="95"
          value={visibilityIndex}
          onChange={(e) => setVisibilityIndex(Number(e.target.value))}
          style={{ width: '100%', accentColor: '#F5A623', cursor: 'pointer', marginBottom: '0.5rem' }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-dim)' }}>
          <span>12% (Extreme Ingress)</span>
          <span>50% (Moderate Haze)</span>
          <span>95% (Clear Atmosphere)</span>
        </div>
      </div>

      {/* Preset Weather Conditions Buttons */}
      <div>
        <span className="system-label-subtle" style={{ display: 'block', marginBottom: '0.6rem' }}>
          APPLY TESTBED ATMOSPHERIC PRESETS:
        </span>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => applyScenario('FOG_CORRIDOR')}
            className="btn-secondary"
            style={{ padding: '0.5rem 1rem', fontSize: '0.72rem' }}
          >
            MONSOON DOWNPOUR & FOG (28% VIS)
          </button>
          <button
            onClick={() => applyScenario('CLEAR_ROAD')}
            className="btn-secondary"
            style={{ padding: '0.5rem 1rem', fontSize: '0.72rem' }}
          >
            CLEAR PIT CORRIDOR (88% VIS)
          </button>
          <button
            onClick={() => applyScenario('CRITICAL_HAZARD')}
            className="btn-secondary"
            style={{ padding: '0.5rem 1rem', fontSize: '0.72rem' }}
          >
            SUDDEN FOG & CLOSE OBSTACLE (22% VIS / 24CM)
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .env-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
