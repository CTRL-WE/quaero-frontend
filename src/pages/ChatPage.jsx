import { useState } from 'react';
import ChatBubble from '../components/ChatBubble';

const mockMessages = [
  {
    id: 1,
    sender: 'AI',
    text: 'Before deciding whether the claim is true or false, what evidence would you want to verify first?'
  },
  {
    id: 2,
    sender: 'USER',
    text: 'I would first check who originally made the claim and whether reliable sources reported it.'
  },
  {
    id: 3,
    sender: 'AI',
    text: 'Good start. How would you judge whether a source is reliable rather than simply popular?'
  }
];

function ChatPage() {
  const [messages] = useState(mockMessages);
  const [input, setInput] = useState('');

  return (
    <div className="flex h-[calc(100vh-64px)] flex-col">
      {/* Header */}
      <div className="border-b bg-white px-4 py-3">
        <h1 className="text-lg font-semibold">AI Mentor Investigation</h1>
        <p className="text-sm text-gray-500">
          The AI will guide your reasoning through questions.
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-4 overflow-y-auto bg-gray-50 p-4">
        {messages.map((message) => (
          <ChatBubble
            key={message.id}
            sender={message.sender}
            text={message.text}
          />
        ))}
      </div>

      {/* Input */}
      <div className="border-t bg-white p-4">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your reasoning..."
            className="flex-1 rounded-xl border px-4 py-3 outline-none focus:border-blue-500"
          />
          <button
            className="rounded-xl bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;