import { Mic, Paperclip } from 'lucide-react';
import { Avatar, Callout } from './ds';
import ResultCard from './ResultCard';
import CompareCard from './CompareCard';
import Pipeline from './Pipeline';

export default function MessageBubble({ message, stage }) {
  const isComparison = message.data?.type === 'comparison';

  if (message.role === 'user') {
    return (
      <div style={{
        display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-start',
        gap: 10, animation: 'up 0.2s ease',
        width: '100%', padding: '0 24px',
      }}>
        <div style={{ maxWidth: '68%', minWidth: 0, paddingTop: 4, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-3)', marginBottom: 4, letterSpacing: '0.01em' }}>You</p>
          <div style={{
            background: 'var(--accent)',
            borderRadius: '14px 2px 14px 14px',
            padding: '11px 15px',
            fontSize: 14, color: '#fff', lineHeight: 1.65,
            wordBreak: 'break-word',
          }}>
            {message.content}
          </div>
          {(message.type === 'audio-record' || message.type === 'audio-upload') && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 4,
              marginTop: 4, fontSize: 11, color: 'var(--ink-4)',
            }}>
              {message.type === 'audio-record'
                ? <><Mic size={11} strokeWidth={2} /> Transcribed from recording</>
                : <><Paperclip size={11} strokeWidth={2} /> Transcribed from audio file</>}
            </div>
          )}
        </div>
        <Avatar role="user" size={30} />
      </div>
    );
  }

  if (message.role === 'assistant') {
    return (
      <div style={{
        display: 'flex', gap: 12, animation: 'up 0.2s ease',
        /* Comparison cards need full width; single-stock stays readable at 780 */
        maxWidth: isComparison ? '100%' : 780,
        width: '100%',
        margin: '0 auto',
        padding: isComparison ? '0 20px' : '0 24px',
      }}>
        <Avatar role="assistant" size={30} />
        <div style={{ flex: 1, minWidth: 0, paddingTop: 4, overflow: 'hidden' }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-3)', marginBottom: 8, letterSpacing: '0.01em' }}>
            ENAM Research
          </p>
          {message.loading && <Pipeline stage={stage} />}
          {message.error && !message.loading && (
            <Callout type="error">{message.error}</Callout>
          )}
          {message.data && !message.loading && (
            isComparison
              ? <CompareCard r={message.data} />
              : <ResultCard r={message.data} />
          )}
        </div>
      </div>
    );
  }

  return null;
}
