import React, { useEffect } from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { HeroSection } from './HeroSection';
import { TheProblemSection } from './TheProblemSection';
import { HowMLVSHelpsSection } from './HowMLVSHelpsSection';
import { SystemFlowSection } from './SystemFlowSection';
import { PhysicalPrototypeSection } from './PhysicalPrototypeSection';
import { ControlRoomPreviewSection } from './ControlRoomPreviewSection';

export const LandingPage = () => {
  const { navigateToControlRoom } = useTelemetry();
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('motion-ready');
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -7% 0px' });
    document.querySelectorAll('.reveal-on-scroll').forEach((element) => revealObserver.observe(element));

    const hero = document.querySelector('.hero-section');
    let frame = 0;
    const updateHero = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (!hero) return;
        const progress = Math.max(0, Math.min(1, -hero.getBoundingClientRect().top / (hero.offsetHeight * 0.7)));
        hero.style.setProperty('--hero-scroll', progress.toFixed(3));
      });
    };
    window.addEventListener('scroll', updateHero, { passive: true });
    updateHero();
    return () => {
      revealObserver.disconnect();
      window.removeEventListener('scroll', updateHero);
      cancelAnimationFrame(frame);
      root.classList.remove('motion-ready');
    };
  }, []);
  return <main style={{ width: '100%', overflowX: 'hidden' }}>
    <HeroSection onEnterControlRoom={navigateToControlRoom} />
    <TheProblemSection />
    <HowMLVSHelpsSection />
    <SystemFlowSection />
    <PhysicalPrototypeSection />
    <ControlRoomPreviewSection />
  </main>;
};
