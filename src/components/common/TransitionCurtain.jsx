import React from 'react';
import { useTelemetry } from '../../context/TelemetryContext';

export const TransitionCurtain = () => {
  const { isTransitioning, activeView } = useTelemetry();

  if (!isTransitioning) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center pointer-events-none transition-all duration-500 ease-in-out">
      <div 
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: '#0B0E0D',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: isTransitioning ? 1 : 0,
          transition: 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Animated convergent data grid */}
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              radial-gradient(circle at center, rgba(245, 166, 35, 0.15) 0%, transparent 65%),
              linear-gradient(to right, rgba(232, 236, 233, 0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(232, 236, 233, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: '100% 100%, 30px 30px, 30px 30px',
            animation: 'pulse-amber 1.2s infinite ease-in-out'
          }}
        />

        {/* Central HUD Data Converger */}
        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
          <div 
            style={{
              width: '80px',
              height: '80px',
              border: '2px solid #F5A623',
              borderRadius: '50%',
              margin: '0 auto 1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 30px rgba(245, 166, 35, 0.3)',
              position: 'relative'
            }}
          >
            <div 
              style={{
                width: '12px',
                height: '12px',
                backgroundColor: '#F5A623',
                borderRadius: '50%',
                animation: 'pulse-amber 0.8s infinite alternate'
              }}
            />
            {/* Spinning reticle brackets */}
            <div 
              style={{
                position: 'absolute',
                inset: '-8px',
                border: '1px dashed rgba(245, 166, 35, 0.5)',
                borderRadius: '50%',
                animation: 'spin 4s linear infinite'
              }}
            />
          </div>

          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.2em', color: '#F5A623', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            {activeView === 'LANDING' ? 'INITIALIZING MISSION CONTROL LINK' : 'RETURNING TO ARCHITECTURE OVERVIEW'}
          </div>

          <div style={{ fontFamily: 'var(--font-sans)', fontSize: '1.25rem', fontWeight: 700, color: '#E8ECE9', letterSpacing: '-0.01em', marginBottom: '0.5rem' }}>
            NMDC // MINE VEHICLE SAFETY SYSTEM
          </div>

          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#95A39B' }}>
            V01 TELEMETRY BUS // LATENCY 18ms // PROTOCOL RF-2.4GHz
          </div>
        </div>

        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
};
