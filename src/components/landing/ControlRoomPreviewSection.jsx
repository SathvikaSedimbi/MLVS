import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useTelemetry } from '../../context/TelemetryContext';

export const ControlRoomPreviewSection = () => {
  const { navigateToControlRoom } = useTelemetry();
  return <>
    <section className="control-cta reveal-on-scroll">
      <div className="system-label"><span className="status-dot amber" /> MLVS</div>
      <h2 className="heading-editorial">SEE THE CONTROL ROOM</h2>
      <p>A simple preview page for the next stage of the prototype.</p>
      <button onClick={navigateToControlRoom} className="btn-primary">ENTER CONTROL ROOM → <ArrowRight size={15} /></button>
    </section>
    <footer className="site-footer">MLVS · Mine Low-Visibility Support System · Driver assistance, with the driver in control.</footer>
  </>;
};
