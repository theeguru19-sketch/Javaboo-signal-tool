export function analyzeForContract(digits, contractType) {
  if (!digits || digits.length < 10) return null;
  const recent = digits.slice(-50);
  const total = recent.length;
  switch (contractType) {
    case 'matches': return analyzeMatches(recent, total);
    case 'differs': return analyzeDiffers(recent, total);
    case 'even_odd': return analyzeEvenOdd(recent, total);
    case 'over_under': return analyzeOverUnder(recent, total);
    case 'rise_fall': return analyzeRiseFall(recent, total);
    default: return null;
  }
}

function analyzeMatches(digits, total) {
  const freq = Array(10).fill(0);
  digits.forEach(d => freq[d]++);
  const sorted = freq
    .map((count, digit) => ({ digit, count, pct: Math.round((count / total) * 100) }))
    .sort((a, b) => b.count - a.count);
  const top = sorted[0];
  const second = sorted[1];
  const dominance = top.count - second.count;
  const strength = Math.min(Math.round((dominance / total) * 100 * 3.5), 99);
  const isStrong = dominance >= 2 && top.pct >= 14;
  if (!isStrong) return null;
  return {
    signal: 'PLAY MATCHES',
    value: `DIGIT ${top.digit}`,
    digit: top.digit,
    strength,
    detail: `Digit ${top.digit} appeared ${top.count}x out of ${total} ticks (${top.pct}%)`,
    color: strengthColor(strength),
  };
}

function analyzeDiffers(digits, total) {
  const freq = Array(10).fill(0);
  digits.forEach(d => freq[d]++);
  const sorted = freq
    .map((count, digit) => ({ digit, count, pct: Math.round((count / total) * 100) }))
    .sort((a, b) => a.count - b.count);
  const weakest = sorted[0];
  const strength = Math.min(Math.round(((total - weakest.count) / total) * 100), 99);
  const isStrong = weakest.pct <= 6;
  if (!isStrong) return null;
  return {
    signal: 'PLAY DIFFERS',
    value: `AVOID ${weakest.digit}`,
    digit: weakest.digit,
    strength,
    detail: `Digit ${weakest.digit} only appeared ${weakest.count}x — least likely next`,
    color: strengthColor(strength),
  };
}

function analyzeEvenOdd(digits, total) {
  const evenCount = digits.filter(d => d % 2 === 0).length;
  const oddCount = total - evenCount;
  const evenPct = Math.round((evenCount / total) * 100);
  const oddPct = 100 - evenPct;
  const dominant = evenPct >= oddPct ? 'EVEN' : 'ODD';
  const dominantPct = Math.max(evenPct, oddPct);
  const strength = Math.min(Math.round((dominantPct - 50) * 4), 99);
  const isStrong = Math.abs(evenPct - oddPct) >= 12;
  if (!isStrong) return null;
  return {
    signal: 'PLAY EVEN/ODD',
    value: dominant,
    strength,
    detail: `Even ${evenPct}% · Odd ${oddPct}% — ${dominant} is dominant`,
    color: strengthColor(strength),
  };
}

function analyzeOverUnder(digits, total) {
  const overCount = digits.filter(d => d > 4).length;
  const underCount = total - overCount;
  const overPct = Math.round((overCount / total) * 100);
  const underPct = 100 - overPct;
  const dominant = overPct >= underPct ? 'OVER 4' : 'UNDER 5';
  const dominantPct = Math.max(overPct, underPct);
  const strength = Math.min(Math.round((dominantPct - 50) * 4), 99);
  const isStrong = Math.abs(overPct - underPct) >= 12;
  if (!isStrong) return null;
  return {
    signal: 'PLAY OVER/UNDER',
    value: dominant,
    strength,
    detail: `Over ${overPct}% · Under ${underPct}% — ${dominant} is dominant`,
    color: strengthColor(strength),
  };
}

function analyzeRiseFall(digits, total) {
  let rises = 0, falls = 0;
  for (let i = 1; i < digits.length; i++) {
    if (digits[i] > digits[i - 1]) rises++;
    else if (digits[i] < digits[i - 1]) falls++;
  }
  const moveTotal = rises + falls || 1;
  const risePct = Math.round((rises / moveTotal) * 100);
  const fallPct = 100 - risePct;
  const dominant = risePct >= fallPct ? 'RISE' : 'FALL';
  const dominantPct = Math.max(risePct, fallPct);
  const strength = Math.min(Math.round((dominantPct - 50) * 4), 99);
  const isStrong = Math.abs(risePct - fallPct) >= 12;
  if (!isStrong) return null;
  return {
    signal: 'PLAY RISE/FALL',
    value: dominant,
    strength,
    detail: `Rise ${risePct}% · Fall ${fallPct}% — ${dominant} trend detected`,
    color: strengthColor(strength),
  };
}

function strengthColor(strength) {
  if (strength >= 65) return '#00e676';
  if (strength >= 45) return '#ffb300';
  return '#ff7043';
}

export function getProgress(tickCount) {
  return Math.min(Math.round((tickCount / 50) * 100), 100);
}
