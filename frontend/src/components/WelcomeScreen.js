import { TrendingUp, ArrowRight, BarChart3, Mic, Paperclip, GitCompare, Briefcase } from 'lucide-react';

const SAMPLES = [
  { text: 'Compare BAJFINANCE and HDFCBANK with KOTAKBANK — which has the best risk-reward?', icon: GitCompare, tag: 'Compare' },
  { text: 'How is our INFY holding vs HCLTECH and WIPRO? Which IT stock should we accumulate?', icon: Briefcase, tag: 'Portfolio' },
  { text: 'Client wants to invest ₹10 lakh — compare SUNPHARMA, DRREDDY, and TITAN', icon: GitCompare, tag: 'Compare' },
  { text: 'Should my client buy TCS at current levels? 3-year horizon.', icon: TrendingUp, tag: 'Analyse' },
  { text: 'Which performs better: TATAMOTORS or MARUTI for a 2-year horizon?', icon: GitCompare, tag: 'Compare' },
  { text: 'Compare MSFT and GOOGL with our TCS and INFY for US-India diversification', icon: BarChart3, tag: 'Compare' },
];

const TAG_COLORS = {
  'Compare':   { bg: 'var(--info-bg)',    c: 'var(--info)',   b: 'var(--info-rule)' },
  'Portfolio': { bg: '#7c3aed18',          c: '#7c3aed',       b: '#7c3aed30'        },
  'Analyse':   { bg: 'var(--bull-bg)',    c: 'var(--bull)',   b: 'var(--bull-rule)' },
};

export default function WelcomeScreen({ onSampleClick }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', height: '100%', minHeight: 400,
      padding: '40px 20px', animation: 'in 0.5s ease',
    }}>
      {/* Logo */}
      <div style={{
        width: 56, height: 56, borderRadius: 16,
        background: 'linear-gradient(135deg, #0d9488, #2563eb)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 20, boxShadow: '0 8px 32px rgba(13, 148, 136, 0.2)',
      }}>
        <TrendingUp size={28} color="#fff" strokeWidth={2} />
      </div>

      <h1 style={{
        fontSize: 24, fontWeight: 700, color: 'var(--ink)',
        marginBottom: 4, fontFamily: 'var(--f-ui)',
        letterSpacing: '-0.02em',
      }}>
        ENAM Research Terminal
      </h1>
      <p style={{
        fontSize: 13, color: 'var(--ink-4)', marginBottom: 6,
        fontWeight: 500, letterSpacing: '0.02em', textTransform: 'uppercase',
      }}>
        ENAM AMC · Portfolio Management Services
      </p>
      <p style={{
        fontSize: 14, color: 'var(--ink-3)', marginBottom: 32,
        textAlign: 'center', maxWidth: 460, lineHeight: 1.7,
      }}>
        AI-powered equity analysis with live market data. Compare ENAM portfolio
        stocks against external options, analyse individual stocks, or ask via voice.
      </p>

      {/* Capability pills */}
      <div style={{
        display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap',
        justifyContent: 'center',
      }}>
        {[
          { icon: GitCompare,  label: 'Stock comparison'  },
          { icon: Briefcase,   label: 'ENAM portfolio'    },
          { icon: TrendingUp,  label: 'Live market data'  },
          { icon: Mic,         label: 'Voice input'       },
          { icon: Paperclip,   label: 'Audio upload'      },
          { icon: BarChart3,   label: 'AI analysis'       },
        ].map(({ icon: Icon, label }, i) => (
          <span key={i} style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '5px 13px', borderRadius: 20,
            background: 'var(--white)', border: '1px solid var(--rule)',
            fontSize: 12, color: 'var(--ink-3)', fontWeight: 500,
          }}>
            <Icon size={12} strokeWidth={2} color="var(--accent)" />
            {label}
          </span>
        ))}
      </div>

      {/* Sample prompts */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: 10, maxWidth: 700, width: '100%',
      }}>
        {SAMPLES.map(({ text, icon: Icon, tag }, i) => {
          const tc = TAG_COLORS[tag] || TAG_COLORS['Analyse'];
          return (
            <button
              key={i}
              onClick={() => onSampleClick(text)}
              style={{
                padding: '12px 14px',
                background: 'var(--white)',
                border: '1px solid var(--rule)',
                borderRadius: 12, cursor: 'pointer',
                textAlign: 'left', fontSize: 12.5, color: 'var(--ink-2)',
                lineHeight: 1.5, fontFamily: 'var(--f-ui)',
                transition: 'all 0.15s',
                display: 'flex', flexDirection: 'column', gap: 8,
                boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--accent)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(13,148,136,0.1)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--rule)';
                e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.04)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <Icon size={14} color="var(--accent)" strokeWidth={2} style={{ flexShrink: 0, marginTop: 1 }} />
                <span style={{ flex: 1 }}>{text}</span>
              </div>
              <span style={{
                alignSelf: 'flex-start',
                padding: '1px 7px', borderRadius: 8,
                fontSize: 10, fontWeight: 700, letterSpacing: '0.04em',
                background: tc.bg, color: tc.c, border: `1px solid ${tc.b}`,
              }}>
                {tag}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
