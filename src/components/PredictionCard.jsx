import React from 'react';
import { confidenceLevel } from '../utils/signalEngine';

export default function PredictionCard({ title, prediction, confidence, detail }) {
  const level = confidenceLevel(confidence);
  const colors = { high: '#00e676', medium: '#ffb300', low: '#ff5252' };
  const color = colors[level];

  return (
    <div className="pred-card" style={{ borderColor: color + '55' }}>
      <div className="pred-header">
        <span className="pred-title">{title}</span>
        <span className="pred-level" style={{ color, background: color + '18' }}>{level.toUpperCase()}</span>
      </div>
      <div className="pred-outcome" style={{ color }}>{prediction}</div>
      <div className="pred-bar-wrap">
        <div className="pred-bar-bg">
          <div className="pred-bar-fill" style={{ width: `${confidence}%`, background: color }} />
        </div>
        <span className="pred-pct" style={{ color }}>{confidence}%</span>
      </div>
      <div className="pred-detail">{detail}</div>
    </div>
  );
}
