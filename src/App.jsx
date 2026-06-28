import React, { useState, useEffect, useRef } from 'react';
import { useDerivSocket } from './hooks/useDerivSocket';
import { analyzeForContract, getProgress } from './utils/signalEngine';
import './App.css';

const SYMBOLS = ['R_10', 'R_25', 'R_50', 'R_75', 'R_100'];

const CONTRACTS = [
  { id: 'matches', label: 'Matches', icon: '🎯' },
  { id: 'differs', label: 'Differs', icon: '❌' },
  { id: 'even_odd', label: 'Even / Odd', icon: '⚖️' },
  { id: 'over_under', label: 'Over / Under', icon: '📊' },
  { id: 'rise_fall', label: 'Rise / Fall', icon: '📈' },
];

export default function App() {
  const [symbol, setSymbol] = useState('R_10');
  const [contract, setContract] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [signal, setSignal] = useState(null);
  const [tickCount, setTickCount] = useState(0);
  const [phase, setPhase] = useState('select');
  const ticksSinceLastSignal = useRef(0);

  const { digits, status, ticks } = useDerivSocket(symbol, isAnalyzing);

  useEffect(() => {
    if (digits.length > 0) {
      setTickCount(digits.length);
      ticksSinceLastSignal.current += 1;
    }
  }, [digits]);

  useEffect(() => {
    if (!isAnalyzing || !contract || digits.length < 10) return;
    if (digits.length >= 50 || (signal && ticksSinceLastSignal.current >= 10)) {
      const result = analyzeForContract(digits, contract);
      if (result) {
        setSignal(result);
        setPhase('signal');
        ticksSinceLastSignal.current = 0;
      } else {
        setPhase('analyzing');
        setSignal(null);
      }
    }
  }, [digits, contract, isAnalyzing]);

  const handleStart = () => {
    if (!contract) return;
    setIsAnalyzing(true);
    setSignal(null);
    setTickCount(0);
    setPhase('analyzing');
    ticksSinceLastSignal.current = 0;
  };

  const handleStop = () => {
    setIsAnalyzing(false);
    setPhase('select');
    setSignal(null);
    setTickCount(0);
  };

  const handleNextSignal = () => {
    setSignal(null);
    setPhase('analyzing');
    ticksSinceLastSignal.current = 0;
  };

  const handleContractSelect = (id) => {
    setContract(id);
    setSignal(null);
    setPhase('select');
    setIsAnalyzing(false);
    setTickCount(0);
  };

  const progress = getProgress(tickCount);
  const selectedContract = CONTRACTS.find(c => c.id === contract);

  return (
    <div className="app">
      <header className="header">
        <div className="header-brand">
          <span className="header-icon">⚡</span>
          <span className="header-name">JavaBoo</span>
          <span className="header-sub">Signal Tool</span>
        </div>
        <select className="symbol-select" value={symbol} onChange={e => { setSymbol(e.target.value); handleStop(); }}>
          {SYMBOLS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </header>

      <div className="contract-bar">
        {CONTRACTS.map(c => (
          <button key={c.id} className={`contract-btn ${contract === c.id ? 'active' : ''}`} onClick={() => handleContractSelect(c.id)}>
            <span className="contract-icon">{c.icon}</span>
            <span className="contract-label">{c.label}</span>
          </button>
        ))}
      </div>

      <main className="main">
        {phase === 'select' && (
          <div className="phase-select">
            <div className="select-icon">🎯</div>
            <div className="select-title">Select a Contract Type</div>
            <div className="select-sub">Choose above then press Start</div>
            {contract && (
              <button className="btn-start" onClick={handleStart}>
                ▶ Start Analysis — {selectedContract?.label}
              </button>
            )}
          </div>
        )}

        {phase === 'analyzing' && (
          <div className="phase-analyzing">
            <div className="analyzing-label">ANALYZING MARKET</div>
            <div className="analyzing-contract">{selectedContract?.icon} {selectedContract?.label}</div>
            <div className="analyzing-symbol">{symbol}</div>
            <div className="progress-wrap">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
              <div className="progress-text">{tickCount} ticks collected</div>
            </div>
            <div className="pulse-ring"><div className="pulse-dot" /></div>
            {tickCount >= 50 && <div className="searching-text">🔍 Searching for strong pattern...</div>}
            <div className="status-row">
              <span className={`status-indicator status-${status}`}>
                {status === 'connected' ? '● LIVE' : '◌ CONNECTING'}
              </span>
              <span className="tick-feed-mini">
                {ticks.slice(0, 8).map((t, i) => (
                  <span key={i} className="mini-digit">{t.digit}</span>
                ))}
              </span>
            </div>
            <button className="btn-stop" onClick={handleStop}>⏹ Stop</button>
          </div>
        )}

        {phase === 'signal' && signal && (
          <div className="phase-signal">
            <div className="signal-badge">SIGNAL FOUND</div>
            <div className="signal-contract">{selectedContract?.icon} {selectedContract?.label}</div>
            <div className="signal-symbol">{symbol}</div>
            <div className="signal-main" style={{ color: signal.color }}>
              <div className="signal-action">{signal.signal}</div>
              <div className="signal-value">{signal.value}</div>
            </div>
            <div className="strength-wrap">
              <div className="strength-label">Signal Strength</div>
              <div className="strength-bar-bg">
                <div className="strength-bar-fill" style={{ width: `${signal.strength}%`, background: signal.color }} />
              </div>
              <div className="strength-pct" style={{ color: signal.color }}>{signal.strength}%</div>
            </div>
            <div className="signal-detail">{signal.detail}</div>
            <div className="signal-actions">
              <button className="btn-next" onClick={handleNextSignal}>🔄 Next Signal</button>
              <button className="btn-stop" onClick={handleStop}>⏹ Stop</button>
            </div>
            <div className="status-row">
              <span className="status-indicator status-connected">● LIVE</span>
              <span className="tick-count-mini">{tickCount} ticks analyzed</span>
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        JavaBoo Signal Tool · Deriv WebSocket API · For analysis only
      </footer>
    </div>
  );
}
