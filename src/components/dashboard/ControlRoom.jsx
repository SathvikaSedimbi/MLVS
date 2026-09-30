import React from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { TacticalCorridorRadar } from './TacticalCorridorRadar';
import { VehiclePanel } from './VehiclePanel';
import { RiskEnginePanel } from './RiskEnginePanel';
import { SafetyResponsePanel } from './SafetyResponsePanel';
import { EnvironmentPanel } from './EnvironmentPanel';
import { CommunicationHealthPanel } from './CommunicationHealthPanel';
import { SimulationControlBar } from './SimulationControlBar';
import { ModernDigitalDisplay } from './ModernDigitalDisplay';
import { 
  LayoutDashboard, 
  CloudRain, 
  Brain, 
  Radio, 
  Activity, 
  ArrowLeft, 
  ShieldAlert,
  Sliders,
  CheckCircle2,
  Eye
} from 'lucide-react';

export const ControlRoom = () => {
  const { 
    activeDashboardTab, 
    setActiveDashboardTab, 
    navigateToLanding,
    riskAnalysis 
  } = useTelemetry();

  const tabs = [
    { id: 'OVERVIEW', label: 'DIGITAL COCKPIT', icon: LayoutDashboard },
    { id: 'RISK_ENGINE', label: 'RISK ENGINE', icon: Brain },
    { id: 'DIGITAL_TWIN', label: 'TACTICAL RADAR', icon: Eye },
    { id: 'SYSTEM_HEALTH', label: 'DIAGNOSTICS & COMMS', icon: Activity }
  ];

  return (
    <div 
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-mine-black)',
        color: 'var(--text-white)',
        paddingTop: 'calc(var(--header-height) + 1.5rem)',
        paddingBottom: '4rem',
        paddingLeft: '2rem',
        paddingRight: '2rem'
      }}
    >
      <div style={{ maxWidth: 'var(--site-max-width)', margin: '0 auto' }}>
        {/* Control Room Top Mission Bar */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.5rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid var(--panel-border)',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
              <span className="status-dot amber" />
              <span className="system-label">
                NMDC // MINE VEHICLE SAFETY & OPERATIONS CONTROL ROOM
              </span>
            </div>
            <h1 
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '1.8rem',
                fontWeight: 800,
                color: 'var(--text-white)',
                letterSpacing: '-0.02em'
              }}
            >
              MISSION CONTROL DASHBOARD
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Direct Return Button */}
            <button
              onClick={navigateToLanding}
              className="btn-secondary"
              style={{ padding: '0.6rem 1.2rem', fontSize: '0.75rem', gap: '0.5rem' }}
            >
              <ArrowLeft size={14} />
              <span>RETURN TO OVERVIEW</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar (Section 17 Requirement) */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1.5rem',
            overflowX: 'auto',
            paddingBottom: '0.5rem'
          }}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeDashboardTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveDashboardTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: isActive ? 'var(--bg-graphite)' : 'transparent',
                  border: `1px solid ${isActive ? 'var(--accent-amber)' : 'var(--panel-border-subtle)'}`,
                  color: isActive ? 'var(--accent-amber)' : 'var(--text-muted)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  padding: '0.6rem 1.1rem',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap'
                }}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Tab Views */}
        {activeDashboardTab === 'OVERVIEW' && (
          <ModernDigitalDisplay />
        )}

        {activeDashboardTab === 'RISK_ENGINE' && (
          <RiskEnginePanel />
        )}

        {activeDashboardTab === 'DIGITAL_TWIN' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(480px, 1.3fr) minmax(360px, 1fr)', gap: '1.75rem' }} className="tab-split-grid">
            <TacticalCorridorRadar />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              <SafetyResponsePanel />
              <VehiclePanel />
            </div>
          </div>
        )}

        {activeDashboardTab === 'SYSTEM_HEALTH' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            <SimulationControlBar />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.75rem' }} className="tab-split-grid">
              <CommunicationHealthPanel />
              <SafetyResponsePanel />
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 980px) {
          .overview-top-grid,
          .overview-bottom-grid,
          .overview-tertiary-grid,
          .tab-split-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
