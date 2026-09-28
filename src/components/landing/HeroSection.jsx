import React from 'react';
import { ArrowRight } from 'lucide-react';

export const HeroSection = ({ onEnterControlRoom }) => {
  return (
    <section className="hero-section" 
      style={{
        paddingTop: 'calc(var(--header-height) + 3rem)',
        paddingBottom: '4rem',
        maxWidth: 'var(--site-max-width)',
        margin: '0 auto',
        paddingLeft: '1.5rem',
        paddingRight: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem'
      }}
    >
      {/* Top Header Text */}
      <div className="hero-copy" style={{ maxWidth: '1100px' }}>
        {/* Small Label */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div className="system-label hero-identity" style={{ marginBottom: '0.3rem' }}>
            <span className="status-dot amber" />
            MLVS
          </div>
          <div className="hero-fullname" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
            MINE LOW-VISIBILITY SUPPORT SYSTEM
          </div>
        </div>

        {/* Headline */}
        <h1 
          className="heading-editorial hero-headline"
          style={{
            fontSize: 'clamp(2.6rem, 6vw, 5rem)',
            lineHeight: 1.05,
            marginBottom: '1.25rem'
          }}
        >
          <span className="hero-line hero-line-one">WHEN VISIBILITY DROPS,</span>
          <span className="hero-line hero-line-two" style={{ color: 'var(--accent-amber)' }}>AWARENESS MATTERS.</span>
        </h1>

        {/* Supporting Text */}
        <p 
          className="hero-support"
          style={{
            fontSize: '1.15rem',
            color: 'var(--text-muted)',
            lineHeight: 1.6,
            maxWidth: '600px',
            marginBottom: '2rem'
          }}
        >
          Driver-assistance for safer vehicle movement in<br className="desktop-break" /> fog and low-visibility conditions.
        </p>

        {/* Buttons */}
        <div className="hero-action" style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <button 
            onClick={onEnterControlRoom}
            className="btn-primary"
            style={{ padding: '0.85rem 1.8rem' }}
          >
            <span>ENTER CONTROL ROOM</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>

      {/* Prominent Hero Video Integration */}
      <div className="hero-video-shell"
        style={{
          position: 'relative',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          backgroundColor: 'var(--bg-graphite)',
          border: '1px solid var(--panel-border)',
          width: '100%'
        }}
      >
        {/* Subtle Video Label Header */}
        <div 
          style={{
            padding: '0.6rem 1rem',
            backgroundColor: 'rgba(21, 26, 24, 0.95)',
            borderBottom: '1px solid var(--panel-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--accent-amber)', letterSpacing: '0.08em' }}>
            SYSTEM CONCEPT VISUALIZATION
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-dim)' }}>
            20-SECOND OPERATIONAL SCENARIO
          </span>
        </div>

        {/* 20-second Hero Video */}
        <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', backgroundColor: '#000' }}>
          <video
            src="/nmdc-safety-hero.mp4"
            autoPlay
            muted
            loop
            playsInline
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block'
            }}
          />
        </div>
      </div>
    </section>
  );
};
