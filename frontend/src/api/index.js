export async function checkHealth() {
  const r = await fetch('/api/health');
  return r.json();
}

export async function transcribeFile(file) {
  const fd = new FormData();
  fd.append('audio', file);
  const r = await fetch('/api/transcribe', { method: 'POST', body: fd });
  const d = await r.json();
  if (!r.ok) throw new Error(d.error || `Error ${r.status}`);
  return d.transcript;
}

export async function transcribeBlob(blob, mimeType) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const r = await fetch('/api/transcribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ audioBase64: reader.result, mimeType }),
        });
        const d = await r.json();
        if (!r.ok) throw new Error(d.error || `Error ${r.status}`);
        resolve(d.transcript);
      } catch (e) { reject(e); }
    };
    reader.onerror = () => reject(new Error('Read error'));
    reader.readAsDataURL(blob);
  });
}

export async function analyzeTranscript(transcript) {
  const r = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ transcript }),
  });
  const d = await r.json();
  if (!r.ok) throw new Error(d.error || `Error ${r.status}`);
  return d;
}

export async function compareStocks(transcript) {
  const r = await fetch('/api/compare', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ transcript }),
  });
  const d = await r.json();
  if (!r.ok) throw new Error(d.error || `Error ${r.status}`);
  return d;
}

export async function getPortfolio() {
  const r = await fetch('/api/portfolio');
  const d = await r.json();
  if (!r.ok) throw new Error(d.error || `Error ${r.status}`);
  return d;
}

// Returns true when the query is a comparison / portfolio query
export function isCompareQuery(text) {
  const t = text.toLowerCase();
  return (
    t.includes('compar') ||
    t.includes(' vs ') ||
    t.includes(' versus ') ||
    t.includes('better than') ||
    t.includes('which stock') ||
    t.includes('which is better') ||
    t.includes('portfolio') ||
    t.includes('our holding') ||
    t.includes('our stock') ||
    t.includes('enam') ||
    t.includes('top performer') ||
    t.includes('best performer') ||
    t.includes('worst performer') ||
    t.includes('rank') ||
    (t.includes('and') && (t.includes('between') || t.includes('switch') || t.includes('choose')))
  );
}
