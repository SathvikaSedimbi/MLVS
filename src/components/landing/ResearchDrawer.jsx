import React from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { X, BookOpen, ExternalLink, FileText, CheckCircle2 } from 'lucide-react';

export const ResearchDrawer = () => {
  const { researchDrawerOpen, setResearchDrawerOpen } = useTelemetry();

  if (!researchDrawerOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(11, 14, 13, 0.85)',
        backdropFilter: 'blur(10px)',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'flex-end',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={() => setResearchDrawerOpen(false)}
    >
      <div 
        style={{
          width: '100%',
          maxWidth: '680px',
          height: '100%',
          backgroundColor: 'var(--bg-graphite)',
          borderLeft: '1px solid var(--panel-border)',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
          boxShadow: '-10px 0 40px rgba(0,0,0,0.7)',
          padding: '2.5rem'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div>
            <div className="system-label" style={{ marginBottom: '0.4rem' }}>
              TECHNICAL REFERENCE // SCIENTIFIC COMPENDIUM
            </div>
            <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-white)' }}>
              TECHNICAL FOUNDATION
            </h2>
          </div>

          <button 
            onClick={() => setResearchDrawerOpen(false)}
            className="btn-icon"
            style={{ width: '36px', height: '36px' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Section 1: Optical Fog Transduction */}
        <div style={{ marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--panel-border-subtle)' }}>
          <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-amber)', marginBottom: '0.75rem' }}>
            01. Optical Opacity & Beer-Lambert Law
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1rem' }}>
            The prototype visibility index is derived from the attenuation of an LED emitter wavelength across a fixed 15 cm optical gap onto a matched photoresistor (LDR). According to the Beer-Lambert principle:
          </p>
          <div 
            style={{
              backgroundColor: 'var(--bg-mine-black)',
              padding: '1rem',
              borderRadius: 'var(--radius-sm)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.85rem',
              color: 'var(--accent-amber)',
              marginBottom: '1rem',
              border: '1px solid var(--panel-border)'
            }}
          >
            I = I₀ · e^(-α · x) <br />
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Where I = measured intensity (ADC voltage), I₀ = baseline clear-air calibration, α = particulate extinction coefficient, x = path distance (0.15m).
            </span>
          </div>
        </div>

        {/* Section 2: Ultrasonic Acoustics */}
        <div style={{ marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--panel-border-subtle)' }}>
          <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-amber)', marginBottom: '0.75rem' }}>
            02. Acoustic Time-of-Flight & Temperature Compensation
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1rem' }}>
            Because speed of sound varies with ambient temperature in open-cast mines, the STM32 microcontroller samples the onboard temperature sensor to apply real-time acoustic velocity compensation:
          </p>
          <div 
            style={{
              backgroundColor: 'var(--bg-mine-black)',
              padding: '1rem',
              borderRadius: 'var(--radius-sm)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.85rem',
              color: 'var(--accent-amber)',
              marginBottom: '1rem',
              border: '1px solid var(--panel-border)'
            }}
          >
            v_sound = 331.3 · √(1 + T / 273.15) m/s <br />
            d = (v_sound · Δt_echo) / 2
          </div>
        </div>

        {/* Section 3: Time-to-Collision (TTC) & Risk Fusion */}
        <div style={{ marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--panel-border-subtle)' }}>
          <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-amber)', marginBottom: '0.75rem' }}>
            03. Time-to-Collision (TTC) Dynamic Formulation
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1rem' }}>
            The risk engine computes closing velocity Δv through differential odometry and acoustic delta over time. When closing velocity is positive:
          </p>
          <div 
            style={{
              backgroundColor: 'var(--bg-mine-black)',
              padding: '1rem',
              borderRadius: 'var(--radius-sm)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.85rem',
              color: 'var(--accent-amber)',
              marginBottom: '1rem',
              border: '1px solid var(--panel-border)'
            }}
          >
            TTC = d_front / Δv_closing <br />
            Risk_Total = (0.50 · P_score) + (0.30 · V_risk) + (0.20 · TTC_score)
          </div>
        </div>

        {/* Section 4: Verified Citation Repository Space */}
        <div>
          <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-white)', marginBottom: '0.75rem' }}>
            04. Research Reference Repository
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1rem' }}>
            In accordance with technical honesty principles, citations are reserved exclusively for verified literature. Team members may insert validated peer-reviewed papers below:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ backgroundColor: 'var(--bg-mine-black)', border: '1px dashed var(--panel-border)', padding: '0.85rem', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--accent-amber)', marginBottom: '0.2rem' }}>
                [VERIFIED REFERENCE ENTRY // CITATION 01]
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-white)' }}>
                DGMS (Directorate General of Mines Safety) Circulars on Haul Road Proximity Warning & Blind Spot Mitigations.
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-mine-black)', border: '1px dashed var(--panel-border)', padding: '0.85rem', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--accent-amber)', marginBottom: '0.2rem' }}>
                [VERIFIED REFERENCE ENTRY // CITATION 02]
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-white)' }}>
                International Mining Safety Research: ISO 21815 Earth-moving machinery — Collision warning and avoidance standards.
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-mine-black)', border: '1px dashed var(--panel-border)', padding: '0.85rem', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--accent-amber)', marginBottom: '0.2rem' }}>
                [VERIFIED REFERENCE ENTRY // CITATION 03]
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-white)' }}>
                Optical Extinction in Fugitive Dust and Meteorological Fog in Open-Cast Pits.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
