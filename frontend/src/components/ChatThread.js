import { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import WelcomeScreen from './WelcomeScreen';

export default function ChatThread({ messages, stage, onSampleClick }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, stage]);

  if (messages.length === 0) {
    return (
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <WelcomeScreen onSampleClick={onSampleClick} />
      </div>
    );
  }

  const lastMsg = messages[messages.length - 1];
  const loadingMsgId = lastMsg?.loading ? lastMsg.id : null;

  return (
    <div style={{
      flex: 1, overflowY: 'auto',
      paddingTop: 28, paddingBottom: 140,
      paddingLeft: 0, paddingRight: 0,
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28, width: '100%' }}>
        {messages.map(msg => (
          <MessageBubble
            key={msg.id}
            message={msg}
            stage={msg.id === loadingMsgId ? stage : -1}
          />
        ))}
      </div>
      <div ref={bottomRef} />
    </div>
  );
}
