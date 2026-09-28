import React from 'react';
import { TelemetryProvider, useTelemetry } from './context/TelemetryContext';
import { Navbar } from './components/navigation/Navbar';
import { LandingPage } from './components/landing/LandingPage';
import { ControlRoom } from './components/dashboard/ControlRoom';

const MainContent = () => {
  const { activeView, navigateToControlRoom } = useTelemetry();

  return (
    <div className="tech-grid-bg" style={{ minHeight: '100vh', position: 'relative' }}>
      {activeView === 'LANDING' ? (
        <>
          <Navbar onEnterControlRoom={navigateToControlRoom} />
          <LandingPage />
        </>
      ) : (
        <ControlRoom />
      )}
    </div>
  );
};

export const App = () => {
  return (
    <TelemetryProvider>
      <MainContent />
    </TelemetryProvider>
  );
};

export default App;
