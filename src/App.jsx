import React, { useState, useEffect } from 'react';
import { useDerivSocket } from './hooks/useDerivSocket';
import { analyzeDigits } from './utils/signalEngine';
import TickFeed from './components/TickFeed';
import SignalPanel from './components/SignalPanel';
import ManualInput from './components/ManualInput';
import './App.css';

const SYMBOLS = ['R_10', 'R_25', 'R_50', 'R_75', 'R_100'];

export default function App() {
  const [symbol, setSymbol] = useState('R_10');
  const [isLive, setIsLive] = useState(false);
  const [mode, setMode] = useState('live');
  const [manualDigits, setManualDigits] = useState([]);

  const { ticks, digits: liveDigits, status } = useDerivSocket(symbol, isLive && mode === 'live');

  const activeDigits = mode === 'live' ? liveDigits : manualDigits;
  const analysis = analyzeDigits(activeDigits);

  useEffect(() => {
    if (mode === 'live' && liveDigits.length >= 5) {}
  }, [liveDigits, mode]);

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <span className="logo">⚡ JavaBoo</span>
          <span className="logo-sub">Signal Tool</span>
        </div>
        <div className="header-right">
          <select
            className="symbol-select"
            value={symbol}
            onChange={e => setSymbol(e.target.value)}
          >
            {SYMBOLS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </header>

      <div className="mode-bar">
        <button
          className={`mode-btn ${mode === 'live' ? 'active' : ''}`}
          onClick={() => setMode('live')}
        >
          Live Feed
        </button>
        <button
          className={`mode-btn ${mode === 'manual' ? 'active' : ''}`}
          onClick={() => { setMode('manual'); setIsLive(false); }}
        >
          Manual Input
        </button>
        {mode === 'live' && (
          <button
            className={`live-toggle ${isLive ? 'live-on' : 'live-off'}`}
            onClick={() => setIsLive(v => !v)}
          >
            {isLive ? '⏹ Stop' : '▶ Start Live'}
          </button>
        )}
      </div>

      <main className="app-main">
        <div className="left-col">
          {mode === 'live' ? (
            <TickFeed ticks={ticks} status={status} digits={liveDigits} />
          ) : (
            <ManualInput onDigits={setManualDigits} />
          )}
        </div>
        <div className="right-col">
          <SignalPanel analysis={analysis} />
        </div>
      </main>

      <footer className="app-footer">
        JavaBoo Signal Tool · Powered by Deriv WebSocket API · For analysis purposes only
      </footer>
    </div>
  );
}
