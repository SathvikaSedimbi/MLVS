import React from 'react';
import { ArrowLeft } from 'lucide-react';

export const ControlRoomPlaceholder = ({ onBack }) => <main className="control-placeholder">
  <div className="control-placeholder-inner">
    <div className="system-label"><span className="status-dot amber" /> MLVS</div>
    <h1 className="heading-editorial">CONTROL ROOM</h1>
    <p>Live vehicle monitoring interface coming next.</p>
    <button onClick={onBack} className="btn-secondary"><ArrowLeft size={15} /> BACK TO MLVS</button>
  </div>
</main>;
