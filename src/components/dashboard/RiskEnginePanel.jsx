import React from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { Brain, ShieldAlert, AlertTriangle, CheckCircle2, Sliders, Info, Compass } from 'lucide-react';

export const RiskEnginePanel = () => {
  const { 
    frontDistance, 
    visibilityIndex, 
    v01Speed, 
    closingSpeed, 
    ttc, 
    riskAnalysis,
    v2vActive,
    sensorHealth 
  } = useTelemetry();

  const stateColor = riskAnalysis.state === 'CRITICAL' ? 'var(--status-critical)' : (riskAnalysis.state === 'WARNING' ? 'var(--accent-amber)' : 'var(--status-safe)');

  return (
    <div 
      className="industrial-corners"
      style={{
        backgroundColor: 'var(--bg-graphite)',
        border: `1px solid ${riskAnalysis.state === 'CRITICAL' ? 'var(--status-critical-border)' : 'var(--panel-border)'}`,
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
              border: `1.5px solid ${stateColor}`,
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: stateColor
            }}
          >
            <Brain size={18} />
          </div>
          <div>
            <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-white)' }}>
              DYNAMIC MULTI-FACTOR RISK ENGINE
            </h3>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
              TRANSPARENT FACTOR DECOMPOSITION & KINEMATIC TTC FUSION
            </div>
          </div>
        </div>

        {/* Master State Badge */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            backgroundColor: 'var(--bg-mine-black)',
            border: `1.5px solid ${stateColor}`,
            padding: '0.45rem 1rem',
            borderRadius: 'var(--radius-sm)'
          }}
        >
          <span className={`status-dot ${riskAnalysis.state === 'CRITICAL' ? 'critical' : (riskAnalysis.state === 'WARNING' ? 'amber' : 'safe')}`} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 800, color: stateColor, letterSpacing: '0.08em' }}>
            RISK STATE: {riskAnalysis.state} [{riskAnalysis.score}/100]
          </span>
        </div>
      </div>

      {/* Human-Explainable Causal Chain (The prompt's explicit requirement!) */}
      <div 
        style={{
          backgroundColor: 'var(--bg-mine-black)',
          border: '1px solid var(--panel-border)',
          borderRadius: 'var(--radius-sm)',
          padding: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'center' }}>
            <span className="system-label-subtle">ATMOSPHERIC FACTOR</span>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 700, color: visibilityIndex < 40 ? 'var(--accent-amber)' : 'var(--text-white)' }}>
              {visibilityIndex < 40 ? 'LOW VISIBILITY' : 'CLEAR OPTICAL'} ({visibilityIndex}%)
            </div>
          </div>

          <span style={{ color: 'var(--accent-amber)', fontWeight: 800 }}>+</span>

          <div style={{ textAlign: 'center' }}>
            <span className="system-label-subtle">KINEMATICS</span>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 700, color: closingSpeed > 4 ? 'var(--accent-amber)' : 'var(--text-white)' }}>
              {closingSpeed > 4 ? 'HIGH CLOSING RATE' : 'STABLE DELTA'} (Δ{closingSpeed} km/h)
            </div>
          </div>

          <span style={{ color: 'var(--accent-amber)', fontWeight: 800 }}>+</span>

          <div style={{ textAlign: 'center' }}>
            <span className="system-label-subtle">PROXIMITY MARGIN</span>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 700, color: frontDistance < 45 ? 'var(--status-critical)' : 'var(--text-white)' }}>
              {frontDistance < 45 ? 'REDUCED DISTANCE' : 'NORMAL CLEARANCE'} ({frontDistance} cm)
            </div>
          </div>

          <span style={{ color: stateColor, fontWeight: 800 }}>➔</span>

          <div 
            style={{
              padding: '0.3rem 0.8rem',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: riskAnalysis.state === 'CRITICAL' ? 'var(--status-critical-dim)' : (riskAnalysis.state === 'WARNING' ? 'var(--accent-amber-dim)' : 'var(--status-safe-dim)'),
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              fontWeight: 800,
              color: stateColor
            }}
          >
            {riskAnalysis.state === 'CRITICAL' ? 'CRITICAL COLLISION RISK' : (riskAnalysis.state === 'WARNING' ? 'ELEVATED RISK LEVEL' : 'SAFE OPERATIONAL STATE')}
          </div>
        </div>
      </div>

      {/* Audit & Classification Category Badges (MEASURED, CALCULATED, CALIBRATED, PROTOTYPE THRESHOLD) */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1rem'
        }}
        className="factor-cards-grid"
      >
        {/* Measured Input */}
        <div style={{ backgroundColor: 'var(--bg-mine-black)', border: '1px solid var(--panel-border)', borderRadius: 'var(--radius-sm)', padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', fontWeight: 700, color: '#35C77A', backgroundColor: 'rgba(53,199,122,0.1)', padding: '0.15rem 0.4rem', borderRadius: '2px' }}>
              MEASURED
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-dim)' }}>RAW ADC / ECHO</span>
          </div>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-white)' }}>
            ECHO DELAY & ADC VOLT
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent-amber)', marginTop: '0.3rem' }}>
            Echo: {frontDistance}cm // LDR: {visibilityIndex}%
          </div>
        </div>

        {/* Calculated Kinematics */}
        <div style={{ backgroundColor: 'var(--bg-mine-black)', border: '1px solid var(--panel-border)', borderRadius: 'var(--radius-sm)', padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', fontWeight: 700, color: '#F5A623', backgroundColor: 'rgba(245,166,35,0.1)', padding: '0.15rem 0.4rem', borderRadius: '2px' }}>
              CALCULATED
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-dim)' }}>DERIVED TTC</span>
          </div>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-white)' }}>
            TIME-TO-COLLISION (TTC)
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: ttc < 2.0 ? 'var(--status-critical)' : 'var(--text-white)', marginTop: '0.3rem' }}>
            {ttc} SECONDS (at {closingSpeed} km/h closing)
          </div>
        </div>

        {/* Calibrated Factors */}
        <div style={{ backgroundColor: 'var(--bg-mine-black)', border: '1px solid var(--panel-border)', borderRadius: 'var(--radius-sm)', padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', fontWeight: 700, color: '#4A90E2', backgroundColor: 'rgba(74,144,226,0.1)', padding: '0.15rem 0.4rem', borderRadius: '2px' }}>
              CALIBRATED
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-dim)' }}>BASELINE ZERO</span>
          </div>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-white)' }}>
            CLEAR-AIR ZERO BASELINE
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
            I₀ Ref: 3.30V ADC @ 25°C
          </div>
        </div>

        {/* Prototype Thresholds */}
        <div style={{ backgroundColor: 'var(--bg-mine-black)', border: '1px solid var(--panel-border)', borderRadius: 'var(--radius-sm)', padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', fontWeight: 700, color: '#E05252', backgroundColor: 'rgba(224,82,82,0.1)', padding: '0.15rem 0.4rem', borderRadius: '2px' }}>
              PROTOTYPE THRESHOLD
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-dim)' }}>TESTBED RULES</span>
          </div>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-white)' }}>
            BENCH MARGINS
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '0.3rem' }}>
            Stop &lt; 30cm // Advisory &lt; 60cm
          </div>
        </div>
      </div>

      {/* Factor Contribution Breakdown Progress Bars */}
      <div 
        style={{
          backgroundColor: 'var(--bg-mine-black)',
          border: '1px solid var(--panel-border-subtle)',
          borderRadius: 'var(--radius-sm)',
          padding: '1.25rem'
        }}
      >
        <span className="system-label-subtle" style={{ display: 'block', marginBottom: '1rem' }}>
          RISK FACTOR WEIGHT CONTRIBUTION RATIO
        </span>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', marginBottom: '0.3rem' }}>
              <span style={{ color: 'var(--text-white)' }}>PROXIMITY FACTOR (ULTRASONIC ECHO)</span>
              <span style={{ color: 'var(--accent-amber)', fontWeight: 700 }}>{riskAnalysis.proximityContrib}%</span>
            </div>
            <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--bg-graphite)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: `${riskAnalysis.proximityContrib}%`, height: '100%', backgroundColor: 'var(--accent-amber)', transition: 'width 0.3s ease' }} />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', marginBottom: '0.3rem' }}>
              <span style={{ color: 'var(--text-white)' }}>VISIBILITY COEFFICIENT (OPTICAL ATTENUATION)</span>
              <span style={{ color: '#4A90E2', fontWeight: 700 }}>{riskAnalysis.visibilityContrib}%</span>
            </div>
            <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--bg-graphite)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: `${riskAnalysis.visibilityContrib}%`, height: '100%', backgroundColor: '#4A90E2', transition: 'width 0.3s ease' }} />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', marginBottom: '0.3rem' }}>
              <span style={{ color: 'var(--text-white)' }}>CLOSING VELOCITY & TTC PENALTY</span>
              <span style={{ color: '#E05252', fontWeight: 700 }}>{riskAnalysis.speedContrib}%</span>
            </div>
            <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--bg-graphite)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: `${riskAnalysis.speedContrib}%`, height: '100%', backgroundColor: '#E05252', transition: 'width 0.3s ease' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Required Disclaimer: Do NOT present demo thresholds as official mining standards */}
      <div 
        style={{
          borderLeft: '2px solid var(--accent-amber)',
          paddingLeft: '0.75rem',
          fontSize: '0.75rem',
          color: 'var(--text-dim)',
          fontFamily: 'var(--font-sans)',
          lineHeight: 1.4
        }}
      >
        <strong style={{ color: 'var(--text-muted)' }}>MANDATORY STANDARDS NOTICE:</strong> These configured threshold boundaries (30cm / 60cm / 1.5s TTC) represent physical benchtop scaling parameters for our 1:10 prototype testbed. They are not official DGMS or statutory mining vehicle safety standards.
      </div>

      <style>{`
        @media (max-width: 860px) {
          .factor-cards-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
