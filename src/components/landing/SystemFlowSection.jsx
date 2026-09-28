import React from 'react';

const steps = [
  ['01', 'LOW VISIBILITY'],
  ['02', 'SENSOR DETECTION'],
  ['03', 'VEHICLE / OBSTACLE DETECTED'],
  ['04', 'CLEARANCE CHECK'],
  ['05', 'DRIVER ALERT'],
  ['06', 'DRIVER DECIDES'],
];

export const SystemFlowSection = () => <section id="section-how-it-works" className="content-section">
  <div className="section-heading reveal-on-scroll">
    <div className="system-label section-kicker"><span className="status-dot amber" /> SYSTEM FLOW</div>
    <h2 className="heading-editorial section-title">FROM DETECTION<br /><span className="text-accent">TO DRIVER GUIDANCE.</span></h2>
    <p>The sensor checks the path and available clearance, then alerts the driver with a simple direction or stop recommendation.</p>
  </div>
  <ol className="flow-list flow-sequence reveal-on-scroll">
    {steps.map(([number, title]) => <li className="flow-stage" key={number}>
      <span className="flow-number">{number}</span><span>{title}</span>
    </li>)}
  </ol>
  <p className="driver-note">MLVS supports the driver. The driver makes the final decision.</p>
</section>;
