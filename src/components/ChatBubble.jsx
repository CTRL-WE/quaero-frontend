import { SpeechBubble } from './comic';

function ChatBubble({ sender, text }) {
  const isUser = sender === 'USER';

  return (
    <div className={`flex items-end gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full
                    border-2 border-comic-ink text-[11px] font-bold uppercase
                    ${isUser
                      ? 'bg-comic-yellow text-comic-ink'
                      : 'bg-comic-purple text-white'
                    }`}
      >
        {isUser ? '🔍' : '🕵️'}
      </div>

      {/* Bubble */}
      <SpeechBubble variant={isUser ? 'user' : 'ai'}>
        {text}
      </SpeechBubble>
    </div>
  );
}

export default ChatBubble;