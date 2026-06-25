import React from 'react';

export default function TickFeed({ ticks, status, digits }) {
  const digitColors = ['#ff5252','#ff7043','#ffb300','#c6ff00','#69f0ae',
                       '#40c4ff','#448aff','#e040fb','#f48fb1','#80cbc4'];
  return (
    <div className="tick-feed">
      <div className="feed-header">
        <span className="feed-title">Live Ticks</span>
        <span className={`status-dot status-${status}`}>
          {status === 'connected' ? '● LIVE' : status === 'connecting' ? '◌ CONNECTING' : status === 'error' ? '✕ ERROR' : '○ OFF'}
        </span>
      </div>
      {ticks.length === 0 ? (
        <div className="feed-empty">
          {status === 'connected' ? 'Waiting for ticks...' : 'Start live feed or enter digits manually'}
        </div>
      ) : (
        <div className="tick-list">
          {ticks.slice(0, 20).map((tick, i) => (
            <div key={i} className="tick-row">
              <span className="tick-time">{tick.time}</span>
              <span className="tick-price">{tick.price}</span>
              <span className="tick-digit" style={{ color: digitColors[tick.digit], borderColor: digitColors[tick.digit] }}>
                {tick.digit}
              </span>
            </div>
          ))}
        </div>
      )}
      {digits.length > 0 && (
        <div className="digit-strip">
          {digits.slice(-20).map((d, i) => (
            <span key={i} className="digit-bubble" style={{ background: digitColors[d] + '33', color: digitColors[d] }}>
              {d}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
