import React from 'react';
import PredictionCard from './PredictionCard';

export default function SignalPanel({ analysis }) {
  if (!analysis) {
    return (
      <div className="signal-panel">
        <div className="signal-empty">Need at least 5 digits to generate signals</div>
      </div>
    );
  }
  const { digitMatch, evenOdd, overUnder, riseFall, sampleSize } = analysis;
  return (
    <div className="signal-panel">
      <div className="panel-header">
        <span className="panel-title">Signal Predictions</span>
        <span className="sample-size">Sample: {sampleSize} ticks</span>
      </div>
      <div className="cards-grid">
        <PredictionCard
          title="Digit Match"
          prediction={`Digit ${digitMatch[0].digit}`}
          confidence={digitMatch[0].pct}
          detail={`Top 3: ${digitMatch.map(d => `${d.digit}(${d.pct}%)`).join(' · ')}`}
        />
        <PredictionCard
          title="Even / Odd"
          prediction={evenOdd.prediction}
          confidence={evenOdd.confidence}
          detail={`Even ${evenOdd.evenPct}% · Odd ${evenOdd.oddPct}%`}
        />
        <PredictionCard
          title="Over / Under"
          prediction={`${overUnder.prediction} 4`}
          confidence={overUnder.confidence}
          detail={`Over ${overUnder.overPct}% · Under ${overUnder.underPct}%`}
        />
        <PredictionCard
          title="Rise / Fall"
          prediction={riseFall.prediction}
          confidence={riseFall.confidence}
          detail={`Rise ${riseFall.risePct}% · Fall ${riseFall.fallPct}%`}
        />
      </div>
      <div className="digit-freq">
        <div className="freq-title">Digit Frequency (last {sampleSize} ticks)</div>
        <div className="freq-bars">
          {Array(10).fill(0).map((_, d) => {
            const found = digitMatch.find(x => x.digit === d);
            const pct = found ? found.pct : 0;
            return (
              <div key={d} className="freq-col">
                <div className="freq-bar-wrap">
                  <div className="freq-bar-fill" style={{ height: `${pct * 2}px`, background: pct > 15 ? '#00e676' : '#444' }} />
                </div>
                <span className="freq-label">{d}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
