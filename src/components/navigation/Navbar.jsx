import React, { useEffect, useState } from 'react';
import { ArrowRight, Shield } from 'lucide-react';

export const Navbar = ({ onEnterControlRoom }) => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24);
    update();
    window.addEventListener('scroll', update, { passive: true });
    const targets = ['section-problem', 'section-how-it-works', 'section-prototype']
      .map((id) => document.getElementById(id)).filter(Boolean);
    const observer = new IntersectionObserver((entries) => {
      const current = entries.filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (current) setActiveSection(current.target.id);
    }, { rootMargin: '-25% 0px -60% 0px', threshold: [0, 0.2, 0.5] });
    targets.forEach((target) => observer.observe(target));
    return () => { window.removeEventListener('scroll', update); observer.disconnect(); };
  }, []);
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={scrolled ? 'site-nav is-scrolled' : 'site-nav'}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 'var(--header-height)',
        zIndex: 100
      }}
    >
      <div 
        style={{
          maxWidth: 'var(--site-max-width)',
          margin: '0 auto',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1.5rem'
        }}
      >
        {/* Project Identity */}
        <div 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer' }}
        >
          <div 
            style={{
              width: '28px',
              height: '28px',
              backgroundColor: 'var(--bg-graphite)',
              border: '1px solid var(--accent-amber)',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-amber)'
            }}
          >
            <Shield size={16} />
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-white)' }}>
              MLVS
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
              // MINE LOW-VISIBILITY SUPPORT SYSTEM
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }} className="nav-links">
          <button 
            onClick={() => scrollTo('section-problem')}
            className={activeSection === 'section-problem' ? 'nav-link active' : 'nav-link'}
          >
            SYSTEM
          </button>
          <button 
            onClick={() => scrollTo('section-how-it-works')}
            className={activeSection === 'section-how-it-works' ? 'nav-link active' : 'nav-link'}
          >
            HOW IT WORKS
          </button>
          <button 
            onClick={() => scrollTo('section-prototype')}
            className={activeSection === 'section-prototype' ? 'nav-link active' : 'nav-link'}
          >
            PROTOTYPE
          </button>

          <button 
            onClick={onEnterControlRoom}
            className="btn-primary"
            style={{ padding: '0.55rem 1.1rem', fontSize: '0.74rem' }}
          >
            <span>CONTROL ROOM</span>
            <ArrowRight size={13} />
          </button>
        </nav>
      </div>
    </header>
  );
};
