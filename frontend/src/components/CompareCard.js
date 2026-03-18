import { useState } from 'react';
import {
  TrendingUp, TrendingDown, Minus, Trophy, Database,
  ChevronDown, ChevronUp, Copy, Check, Briefcase,
} from 'lucide-react';
import { Chip, Bar, sig } from './ds';

/* ─── small helpers ────────────────────────────────────────────────── */
function pct(val) {
  if (val == null) return null;
  const n = Number(val);
  return `${n >= 0 ? '+' : ''}${n.toFixed(1)}%`;
}

function ChangeTag({ value, positive }) {
  if (!value || value === '—') return <span style={{ color: 'var(--ink-4)', fontSize: 12 }}>—</span>;
  return (
    <span style={{
      fontSize: 12, fontWeight: 700,
      color: positive ? 'var(--bull)' : 'var(--bear)',
      display: 'inline-flex', alignItems: 'center', gap: 2,
    }}>
      {positive ? <TrendingUp size={11} strokeWidth={2.5} /> : <TrendingDown size={11} strokeWidth={2.5} />}
      {value}
    </span>
  );
}

function RankBadge({ rank }) {
  const colors = ['#f59e0b', '#6b7280', '#b45309'];
  const c = colors[rank - 1] || 'var(--ink-4)';
  return (
    <div style={{
      width: 22, height: 22, borderRadius: '50%',
      background: c, color: '#fff',
      fontSize: 11, fontWeight: 800,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      {rank}
    </div>
  );
}

/* ─── Single stock column card ─────────────────────────────────────── */
function StockColumn({ item, isWinner }) {
  const sc        = sig.color(item.signal || 'NEUTRAL');
  const SIcon     = item.signal === 'BULLISH' ? TrendingUp : item.signal === 'BEARISH' ? TrendingDown : Minus;
  const signalTone= item.signal === 'BULLISH' ? 'bull' : item.signal === 'BEARISH' ? 'bear' : 'flat';
  const recTone   = ['BUY','ACCUMULATE'].includes(item.recommendation) ? 'bull' : item.recommendation === 'SELL' ? 'bear' : 'flat';

  return (
    <div style={{
      flex: 1,
      background: 'var(--white)',
      border: `1.5px solid ${isWinner ? 'var(--accent)' : 'var(--rule)'}`,
      borderRadius: 14,
      overflow: 'hidden',
      minWidth: 0,
      transition: 'box-shadow 0.15s',
      boxShadow: isWinner ? '0 4px 20px rgba(13,148,136,0.12)' : '0 1px 3px rgba(0,0,0,0.04)',
    }}>

      {/* Header */}
      <div style={{
        padding: '12px 14px 10px',
        background: sig.bg(item.signal || 'NEUTRAL'),
        borderBottom: `1px solid ${sig.rule(item.signal || 'NEUTRAL')}`,
      }}>
        {/* Row 1: rank + ticker + exchange */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
          {item.rank && <RankBadge rank={item.rank} />}
          <span style={{ fontFamily: 'var(--f-data)', fontSize: 18, fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.01em' }}>
            {item.ticker}
          </span>
          <span style={{ fontSize: 11, color: 'var(--ink-4)' }}>{item.exchange}</span>
        </div>

        {/* Row 2: company name */}
        <p style={{ fontSize: 11, color: 'var(--ink-3)', margin: '0 0 8px', lineHeight: 1.4 }}>
          {item.companyName}
        </p>

        {/* Row 3: price + change */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 8 }}>
          <span style={{ fontFamily: 'var(--f-data)', fontSize: 20, fontWeight: 700, color: 'var(--ink)' }}>
            {item.price}
          </span>
          <ChangeTag value={item.change} positive={item.changePositive} />
        </div>

        {/* Row 4: signal chips + badges — all inline, no overlap */}
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'center' }}>
          {item.signal && <Chip tone={signalTone}><SIcon size={9} style={{ marginRight: 2 }} />{item.signal}</Chip>}
          {item.recommendation && <Chip tone={recTone}>{item.recommendation}</Chip>}
          {isWinner && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 3,
              padding: '2px 7px', borderRadius: 8,
              background: 'var(--accent)', fontSize: 9.5, fontWeight: 700, color: '#fff',
            }}>
              <Trophy size={9} /> TOP PICK
            </span>
          )}
          {item.isPortfolioStock && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 3,
              padding: '2px 7px', borderRadius: 8,
              background: '#7c3aed18', border: '1px solid #7c3aed40',
              fontSize: 9.5, fontWeight: 700, color: '#7c3aed',
            }}>
              <Briefcase size={9} /> ENAM HOLDS
            </span>
          )}
        </div>
      </div>

      {/* Score bar */}
      {item.score != null && (
        <div style={{ padding: '8px 14px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
            <span style={{ fontSize: 10, color: 'var(--ink-4)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>ENAM Score</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: sc, fontFamily: 'var(--f-data)' }}>{item.score}/100</span>
          </div>
          <Bar value={item.score} color={sc} h={5} />
        </div>
      )}

      {/* Verdict */}
      {item.oneLineVerdict && (
        <p style={{ padding: '6px 14px 0', fontSize: 11.5, color: 'var(--ink-2)', lineHeight: 1.5, fontStyle: 'italic', margin: 0 }}>
          "{item.oneLineVerdict}"
        </p>
      )}

      {/* Key metrics */}
      <div style={{ padding: '10px 14px 12px' }}>
        {[
          { label: 'P/E Ratio',     value: item.peRatio },
          { label: 'Market Cap',    value: item.marketCap },
          { label: '52W High',      value: item.weekHigh52,  color: 'var(--bull)' },
          { label: '52W Low',       value: item.weekLow52,   color: 'var(--bear)' },
          { label: 'Div. Yield',    value: item.dividendYield },
          { label: 'Beta',          value: item.beta },
          { label: 'EPS',           value: item.eps },
        ].filter(m => m.value && m.value !== 'N/A').map((m, i) => (
          <div key={i} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '5px 0', borderBottom: '1px solid var(--rule)',
            fontSize: 12,
          }}>
            <span style={{ color: 'var(--ink-3)' }}>{m.label}</span>
            <span style={{ fontFamily: 'var(--f-data)', fontWeight: 600, color: m.color || 'var(--ink)' }}>
              {m.value}
            </span>
          </div>
        ))}

        {/* ENAM-specific metrics */}
        {item.isPortfolioStock && item.avgBuyPrice && (
          <div style={{ padding: '5px 0', borderBottom: '1px solid var(--rule)', display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
            <span style={{ color: 'var(--ink-3)' }}>ENAM Avg Buy</span>
            <span style={{ fontFamily: 'var(--f-data)', fontWeight: 600, color: 'var(--ink)' }}>{item.avgBuyPrice}</span>
          </div>
        )}
        {item.unrealizedGain && (
          <div style={{ padding: '5px 0', borderBottom: '1px solid var(--rule)', display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
            <span style={{ color: 'var(--ink-3)' }}>Unrealised Gain</span>
            <span style={{
              fontFamily: 'var(--f-data)', fontWeight: 700,
              color: item.unrealizedGainPositive ? 'var(--bull)' : 'var(--bear)',
            }}>
              {item.unrealizedGainPositive ? '+' : ''}{item.unrealizedGainPct?.toFixed(1)}%
            </span>
          </div>
        )}
        {item.allocation && (
          <div style={{ padding: '5px 0', display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
            <span style={{ color: 'var(--ink-3)' }}>Portfolio Wt.</span>
            <span style={{ fontFamily: 'var(--f-data)', fontWeight: 600, color: '#7c3aed' }}>{item.allocation}</span>
          </div>
        )}
        {item.targetPrice && (
          <div style={{ padding: '5px 0', display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
            <span style={{ color: 'var(--ink-3)' }}>ENAM Target</span>
            <span style={{ fontFamily: 'var(--f-data)', fontWeight: 600, color: 'var(--accent)' }}>{item.targetPrice}</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Key table row ─────────────────────────────────────────────────── */
function KeyTableRow({ metric, values, tickers }) {
  return (
    <tr>
      <td style={{ padding: '7px 12px', fontSize: 12, color: 'var(--ink-3)', fontWeight: 600, borderBottom: '1px solid var(--rule)', width: 130 }}>
        {metric}
      </td>
      {tickers.map(t => (
        <td key={t} style={{
          padding: '7px 12px', fontSize: 12, fontFamily: 'var(--f-data)',
          fontWeight: 600, color: 'var(--ink)', borderBottom: '1px solid var(--rule)',
          textAlign: 'center',
        }}>
          {values?.[t] || '—'}
        </td>
      ))}
    </tr>
  );
}

/* ─── Main CompareCard ──────────────────────────────────────────────── */
export default function CompareCard({ r }) {
  const [showTable, setShowTable]   = useState(false);
  const [copied,    setCopied]      = useState(false);

  const tickers = (r.items || []).map(i => i.ticker);
  const winner  = r.winner?.ticker;

  const copy = () => {
    const text = `${r.headline}\n\n${r.comparisonNarrative}\n\nRecommendation: ${r.recommendation}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Headline */}
      <div style={{ fontSize: 14, color: 'var(--ink)', lineHeight: 1.75, fontWeight: 500 }}>
        {r.headline}
      </div>

      {/* Quick action */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <button
          onClick={copy}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '5px 12px', fontSize: 12, fontWeight: 500,
            background: copied ? 'var(--bull-bg)' : 'var(--white)',
            border: `1px solid ${copied ? 'var(--bull-rule)' : 'var(--rule)'}`,
            borderRadius: 20, cursor: 'pointer',
            color: copied ? 'var(--bull)' : 'var(--ink-3)',
            fontFamily: 'var(--f-ui)', transition: 'all 0.15s',
          }}
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? 'Copied' : 'Copy analysis'}
        </button>
      </div>

      {/* Stock columns */}
      <div style={{
        display: 'flex', gap: 10, flexWrap: 'wrap',
        alignItems: 'flex-start',
      }}>
        {(r.items || [])
          .sort((a, b) => (a.rank || 99) - (b.rank || 99))
          .map(item => (
            <StockColumn
              key={item.ticker}
              item={item}
              isWinner={item.ticker === winner}
            />
          ))}
      </div>

      {/* Comparison narrative */}
      {r.comparisonNarrative && (
        <div style={{
          padding: '14px 16px',
          background: 'var(--white)',
          border: '1px solid var(--rule)',
          borderRadius: 12,
          fontSize: 13.5, color: 'var(--ink)', lineHeight: 1.8,
        }}>
          {r.comparisonNarrative}
        </div>
      )}

      {/* Recommendation box */}
      {r.recommendation && (
        <div style={{
          padding: '12px 16px',
          background: 'var(--bull-bg)',
          border: '1px solid var(--bull-rule)',
          borderLeft: '3px solid var(--bull)',
          borderRadius: 10,
          fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.7,
        }}>
          <span style={{ fontWeight: 700, color: 'var(--bull)', marginRight: 6 }}>ENAM Recommendation:</span>
          {r.recommendation}
        </div>
      )}

      {/* Key comparison table toggle */}
      {r.keyTable?.length > 0 && (
        <div style={{
          background: 'var(--white)',
          border: '1px solid var(--rule)',
          borderRadius: 12,
          overflow: 'hidden',
        }}>
          <button
            onClick={() => setShowTable(p => !p)}
            style={{
              width: '100%', padding: '10px 16px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: 500, color: 'var(--ink-3)',
              fontFamily: 'var(--f-ui)',
            }}
          >
            <span>Side-by-side comparison table</span>
            {showTable ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>

          {showTable && (
            <div style={{ overflowX: 'auto', borderTop: '1px solid var(--rule)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--card)' }}>
                    <th style={{ padding: '8px 12px', fontSize: 11, fontWeight: 700, color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'left', width: 130 }}>
                      Metric
                    </th>
                    {tickers.map(t => (
                      <th key={t} style={{
                        padding: '8px 12px', fontSize: 12, fontWeight: 700,
                        color: t === winner ? 'var(--accent)' : 'var(--ink)',
                        textAlign: 'center', fontFamily: 'var(--f-data)',
                      }}>
                        {t}{t === winner ? ' 🏆' : ''}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {r.keyTable.map((row, i) => (
                    <KeyTableRow key={i} metric={row.metric} values={row.values} tickers={tickers} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Data source footer */}
      <div style={{
        padding: '8px 14px',
        background: 'var(--card)',
        border: '1px solid var(--rule)',
        borderRadius: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 6,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: 'var(--ink-4)' }}>
          <Database size={11} strokeWidth={2} />
          <span>
            Source: <strong style={{ color: 'var(--ink-3)' }}>{r.dataSource}</strong>
            {r.dataSource?.includes('live') && (
              <span style={{
                marginLeft: 6, padding: '1px 6px', borderRadius: 10,
                background: 'var(--bull-bg)', color: 'var(--bull)',
                fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase',
                border: '1px solid var(--bull-rule)',
              }}>
                Live
              </span>
            )}
          </span>
        </div>
        {r.lastUpdated && (
          <span style={{ fontSize: 10.5, color: 'var(--ink-5)', fontFamily: 'var(--f-data)' }}>
            {r.lastUpdated}
          </span>
        )}
      </div>
    </div>
  );
}
