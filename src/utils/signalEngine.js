export function analyzeDigits(digits) {
  if (!digits || digits.length < 5) return null;
  const recent = digits.slice(-50);
  const freq = Array(10).fill(0);
  recent.forEach(d => freq[d]++);
  const total = recent.length;
  const digitMatch = freq
    .map((count, digit) => ({ digit, count, pct: Math.round((count / total) * 100) }))
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 3);
  const evenCount = recent.filter(d => d % 2 === 0).length;
  const oddCount = total - evenCount;
  const evenPct = Math.round((evenCount / total) * 100);
  const oddPct = 100 - evenPct;
  const evenOdd = { prediction: evenPct >= oddPct ? 'Even' : 'Odd', confidence: Math.max(evenPct, oddPct), evenPct, oddPct };
  const overCount = recent.filter(d => d > 4).length;
  const overPct = Math.round((overCount / total) * 100);
  const underPct = 100 - overPct;
  const overUnder = { prediction: overPct >= underPct ? 'Over' : 'Under', confidence: Math.max(overPct, underPct), overPct, underPct };
  let rises = 0, falls = 0;
  for (let i = 1; i < recent.length; i++) {
    if (recent[i] > recent[i - 1]) rises++;
    else if (recent[i] < recent[i - 1]) falls++;
  }
  const moveTotal = rises + falls || 1;
  const risePct = Math.round((rises / moveTotal) * 100);
  const fallPct = 100 - risePct;
  const riseFall = { prediction: risePct >= fallPct ? 'Rise' : 'Fall', confidence: Math.max(risePct, fallPct), risePct, fallPct };
  return { digitMatch, evenOdd, overUnder, riseFall, sampleSize: total };
}

export function confidenceLevel(pct) {
  if (pct >= 60) return 'high';
  if (pct >= 45) return 'medium';
  return 'low';
}
