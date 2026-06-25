import React, { useState } from 'react';

export default function ManualInput({ onDigits }) {
  const [raw, setRaw] = useState('');
  const [error, setError] = useState('');

  const handleAnalyze = () => {
    const parts = raw.split(/[\s,]+/).filter(Boolean);
    const digits = parts.map(Number);
    if (digits.some(d => isNaN(d) || d < 0 || d > 9)) {
      setError('Enter digits 0–9 only, separated by commas or spaces.');
      return;
    }
    if (digits.length < 5) {
      setError('Enter at least 5 digits.');
      return;
    }
    setError('');
    onDigits(digits);
  };

  const handleClear = () => {
    setRaw('');
    setError('');
    onDigits([]);
  };

  return (
    <div className="manual-input">
      <div className="manual-header">Manual Digit Input</div>
      <textarea
        className="manual-textarea"
        placeholder="Paste last digits here e.g: 3, 7, 2, 9, 1, 4, 5, 8, 0, 6 ..."
        value={raw}
        onChange={e => setRaw(e.target.value)}
        rows={3}
      />
      {error && <div className="manual-error">{error}</div>}
      <div className="manual-actions">
        <button className="btn-analyze" onClick={handleAnalyze}>Analyze</button>
        <button className="btn-clear" onClick={handleClear}>Clear</button>
      </div>
    </div>
  );
}
