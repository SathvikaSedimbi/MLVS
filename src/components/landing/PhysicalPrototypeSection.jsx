import React, { useState } from 'react';

const components = ['STM32', 'HC-SR04', 'SERVO', 'LDR', 'OLED', 'BUZZER'];

export const PhysicalPrototypeSection = () => {
  const [activeComponent, setActiveComponent] = useState(null);
  const clear = () => setActiveComponent(null);
  return <section id="section-prototype" className="content-section">
  <div className="section-heading reveal-on-scroll">
    <div className="system-label section-kicker"><span className="status-dot amber" /> PHYSICAL PROTOTYPE</div>
    <h2 className="heading-editorial section-title">A SMALL-SCALE<br /><span className="text-accent">CONTROLLED TEST.</span></h2>
    <p>A scaled vehicle setup demonstrates how the sensor scans for clearance in a controlled fog or mist environment.</p>
  </div>
  <div className="prototype-layout prototype-assembly reveal-on-scroll" data-active-component={activeComponent || ''}>
    <div className="prototype-panel">
      <h3>VEHICLE 1 · MLVS</h3>
      <p>The HC-SR04 is mounted on an SG90 servo to scan left, centre and right. The system compares the available clearance and shows a recommendation on the OLED, with buzzer and LED alerts.</p>
      <div className="prototype-schematic" aria-label="Simple engineering diagram of the MLVS prototype hardware">
        <svg viewBox="0 0 620 250" role="img" aria-labelledby="prototype-diagram-title">
          <title id="prototype-diagram-title">MLVS prototype components connected to the STM32</title>
          <path className="chassis-outline" d="M170 91 H222 L241 109 H376 L398 91 H444 V177 H170 Z" />
          <circle className="chassis-wheel" cx="218" cy="181" r="13" /><circle className="chassis-wheel" cx="396" cy="181" r="13" />
          <path className="schematic-wire wire-stm32" pathLength="1" d="M310 112 L310 54 L105 54 L105 75" />
          <path className="schematic-wire wire-ultrasonic" pathLength="1" d="M354 124 L480 124 L480 66" />
          <path className="schematic-wire wire-servo" pathLength="1" d="M354 145 L520 145 L520 196" />
          <path className="schematic-wire wire-ldr" pathLength="1" d="M266 124 L140 124 L140 66" />
          <path className="schematic-wire wire-oled" pathLength="1" d="M266 145 L80 145 L80 190" />
          <path className="schematic-wire wire-buzzer" pathLength="1" d="M310 170 L310 211" />
          <rect className="schematic-module module-stm32" x="266" y="105" width="88" height="68" rx="2" />
          <text x="310" y="143" textAnchor="middle">STM32</text>
          <g className="schematic-module module-ldr"><rect x="79" y="27" width="52" height="39" rx="2" /><text x="105" y="51" textAnchor="middle">LDR</text></g>
          <g className="schematic-module module-ultrasonic"><rect x="450" y="27" width="60" height="39" rx="2" /><text x="480" y="51" textAnchor="middle">HC-SR04</text></g>
          <g className="schematic-module module-oled"><rect x="50" y="190" width="60" height="39" rx="2" /><text x="80" y="214" textAnchor="middle">OLED</text></g>
          <g className="schematic-module module-servo"><rect x="490" y="196" width="60" height="39" rx="2" /><text x="520" y="220" textAnchor="middle">SG90</text></g>
          <g className="schematic-module module-buzzer"><rect x="280" y="211" width="60" height="32" rx="2" /><text x="310" y="231" textAnchor="middle">BUZZER</text></g>
          <text className="chassis-caption" x="307" y="199" textAnchor="middle">VEHICLE 1 · SCALED PROTOTYPE</text>
        </svg>
      </div>
      <ul className="hardware-list" aria-label="Prototype components">
        {components.map((part, index) => <li key={part} style={{ '--component-delay': `${index * 70}ms` }}>
          <button type="button" className={activeComponent === part ? 'component-label active' : 'component-label'} onMouseEnter={() => setActiveComponent(part)} onMouseLeave={clear} onFocus={() => setActiveComponent(part)} onBlur={clear}>{part}</button>
        </li>)}
      </ul>
      <div className="schematic-state" aria-live="polite">{activeComponent ? `${activeComponent} · CONNECTION HIGHLIGHTED` : 'SELECT A LABEL TO TRACE ITS CONNECTION'}</div>
    </div>
    <div className="prototype-side">
      <div className="prototype-panel"><h3>VEHICLE 2</h3><p>An approaching or opposing vehicle scenario for the scaled demonstration.</p></div>
      <div className="prototype-panel"><h3>TEST ENVIRONMENT</h3><p>Controlled fog or mist · transparent enclosure · scaled vehicles</p></div>
      <div className="clearance-example" aria-label="Example clearance check">
        <div><span>LEFT</span><strong className="safe-text">CLEAR</strong></div>
        <div><span>CENTRE</span><strong className="caution-text">LIMITED</strong></div>
        <div><span>RIGHT</span><strong className="critical-text">BLOCKED</strong></div>
        <b>RECOMMENDATION: MOVE LEFT</b>
      </div>
    </div>
  </div>
</section>;
};
