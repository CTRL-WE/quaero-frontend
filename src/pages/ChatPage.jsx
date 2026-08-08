import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronDown, Send } from 'lucide-react';

import ChatBubble from '../components/ChatBubble';
import ReferencePostStrip from '../components/ReferencePostStrip';
import EvidenceLocker from '../components/EvidenceLocker';
import InvestigationProgress from '../components/InvestigationProgress';
import useEvidenceLocker from '../hooks/useEvidenceLocker';
import { sendMessage } from '../services/investigationService';

/* ── Mock case presentation (will come from route/loader later) ──── */

const mockCase = {
  platform: 'TWITTER',
  mediaUrl: 'https://via.placeholder.com/800x600?text=Internal+Memo+Scan',
  mediaType: 'SCREENSHOT',
  caption:
    'THREAD: We obtained internal memos from Lakewood Health Partners showing systematic Medicare upcoding. Here\'s what we found 🧵',
};

const OPENING_MESSAGE = {
  id: 1,
  sender: 'AI',
  text: 'What evidence would you want to verify first?',
};

/* ── Component ────────────────────────────────────────────────────── */

function ChatPage() {
  const { id: caseId } = useParams();

  // ── Chat state ──
  const [messages, setMessages] = useState([OPENING_MESSAGE]);
  const [input, setInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const chatEndRef = useRef(null);

  // ── Turn tracking ──
  const turnCount = messages.filter((m) => m.sender === 'USER').length;
  const nudgeSubmission = turnCount >= 5;

  // ── Evidence locker ──
  const { evidenceItems, addEvidence, removeEvidence, serializeForSubmission } =
    useEvidenceLocker();

  // ── Navigation ──
  const navigate = useNavigate();

  const handleSubmitFindings = () => {
    navigate('/submit', {
      state: { caseId, evidenceLinks: serializeForSubmission() },
    });
  };

  // ── Mobile evidence panel toggle ──
  const [evidenceOpen, setEvidenceOpen] = useState(false);

  // Auto-scroll chat when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── Send handler ──
  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isAiTyping) return;

    const userMsg = { id: Date.now(), sender: 'USER', text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsAiTyping(true);

    try {
      const newTurnCount = turnCount + 1;
      const { reply } = await sendMessage(caseId, trimmed, newTurnCount);

      setMessages((prev) => [
        ...prev,
        { id: Date.now(), sender: 'AI', text: reply },
      ]);
    } catch (err) {
      console.error('Investigation sendMessage failed:', err);
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), sender: 'AI', text: 'Something went wrong — please try again.' },
      ]);
    } finally {
      setIsAiTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] flex-col overflow-hidden bg-halftone">
      {/* ═══════════════════════════════════════════════════════════════
          1) Reference Post Strip — pinned at top
          ═══════════════════════════════════════════════════════════ */}
      <div className="shrink-0 border-b-[3px] border-comic-ink px-3 py-2 sm:px-4 bg-comic-paper">
        <ReferencePostStrip
          platform={mockCase.platform}
          mediaUrl={mockCase.mediaUrl}
          mediaType={mockCase.mediaType}
          caption={mockCase.caption}
        />
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          Mobile-only: progress bar below strip
          ═══════════════════════════════════════════════════════════ */}
      <div className="shrink-0 px-3 pt-2 lg:hidden">
        <InvestigationProgress
          turnCount={turnCount}
          nudgeSubmission={nudgeSubmission}
        />
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          2 + 3) Two-column body: Chat (left) + Evidence Locker (right)
          On mobile: stacked vertically
          ═══════════════════════════════════════════════════════════ */}
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        {/* ────────────────────────────────────────────────────────────
            LEFT COLUMN — AI Mentor Chat
            ──────────────────────────────────────────────────────── */}
        <section className="flex min-h-0 flex-1 flex-col">
          {/* Chat messages — scrollable */}
          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4
                          scrollbar-thin scrollbar-thumb-comic-ink/10 scrollbar-track-transparent">
            {messages.map((message) => (
              <ChatBubble
                key={message.id}
                sender={message.sender}
                text={message.text}
              />
            ))}

            {/* Typing indicator — only visible while AI is thinking */}
            {isAiTyping && (
              <div className="flex justify-start">
                <div className="inline-flex items-center gap-1 rounded-lg
                                border-[3px] border-comic-ink bg-[#ece0f5] px-4 py-3">
                  <span className="h-2 w-2 rounded-full bg-comic-purple animate-bounce [animation-delay:0ms]" />
                  <span className="h-2 w-2 rounded-full bg-comic-purple animate-bounce [animation-delay:150ms]" />
                  <span className="h-2 w-2 rounded-full bg-comic-purple animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* 4) Progress bar — desktop: above input area */}
          <div className="hidden shrink-0 px-4 pt-2 lg:block">
            <InvestigationProgress
              turnCount={turnCount}
              nudgeSubmission={nudgeSubmission}
            />
          </div>

          {/* Chat input */}
          <div className="shrink-0 border-t-[3px] border-comic-ink bg-comic-paper
                          px-4 py-3">
            <div className="flex flex-wrap gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isAiTyping}
                placeholder={isAiTyping ? 'AI is thinking…' : 'Type your reasoning...'}
                className="flex-1 rounded-lg border-2 border-comic-ink/25
                           bg-white px-4 py-2.5 text-sm text-comic-ink
                           placeholder:text-comic-ink/35 outline-none transition-colors
                           focus:border-comic-blue focus:ring-1 focus:ring-comic-blue/25
                           disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={isAiTyping}
                className="shrink-0 rounded-lg border-[3px] border-comic-ink
                           bg-comic-red px-5 py-2.5 text-sm
                           font-bold text-white shadow-comic-sm comic-press
                           disabled:opacity-50 disabled:pointer-events-none"
              >
                Send
              </button>

              {nudgeSubmission && (
                <button
                  type="button"
                  onClick={handleSubmitFindings}
                  className="w-full sm:w-auto shrink-0 inline-flex items-center
                              justify-center gap-1.5 rounded-lg border-[3px] border-comic-ink
                              bg-comic-green px-4 py-2.5 text-sm font-bold text-white
                              shadow-comic-sm comic-press
                              animate-evidence-enter"
                >
                  <Send size={14} strokeWidth={2.5} />
                  Submit
                </button>
              )}
            </div>
          </div>
        </section>

        {/* ────────────────────────────────────────────────────────────
            RIGHT COLUMN — Evidence Locker (desktop sidebar)
            ──────────────────────────────────────────────────────── */}
        <aside className="hidden w-80 shrink-0 overflow-y-auto border-l-[3px]
                          border-comic-ink bg-comic-paper/50 p-3 lg:block
                          scrollbar-thin scrollbar-thumb-comic-ink/10 scrollbar-track-transparent">
          <EvidenceLocker
            evidenceItems={evidenceItems}
            onAdd={addEvidence}
            onRemove={removeEvidence}
          />
        </aside>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          Mobile-only: collapsible Evidence Locker at bottom
          ═══════════════════════════════════════════════════════════ */}
      <div className="shrink-0 border-t-[3px] border-comic-ink lg:hidden">
        <button
          type="button"
          onClick={() => setEvidenceOpen((o) => !o)}
          className="flex w-full items-center justify-between px-4 py-2.5
                     text-sm font-bold text-comic-ink bg-comic-paper
                     transition-colors hover:bg-comic-yellow/15"
        >
          <span>Evidence Locker{evidenceItems.length > 0 && ` (${evidenceItems.length})`}</span>
          <ChevronDown
            size={16}
            className={`transition-transform duration-200 ${
              evidenceOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {evidenceOpen && (
          <div className="max-h-80 overflow-y-auto px-3 pb-3 bg-comic-paper/70 animate-evidence-enter
                          scrollbar-thin scrollbar-thumb-comic-ink/10 scrollbar-track-transparent">
            <EvidenceLocker
              evidenceItems={evidenceItems}
              onAdd={addEvidence}
              onRemove={removeEvidence}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatPage;