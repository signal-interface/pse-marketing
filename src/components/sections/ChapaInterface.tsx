'use client';

// CHAP AI widget — live version.
//
// Refactored from a canned-response mock into a real streaming client
// of POST /api/chap/ask. The visual shell (classes, JSX structure,
// status bar, typing dots, suggestions, input row) is preserved — what
// changed is the data source.
//
// Behaviors:
//   - sessionId persists in sessionStorage across page reloads in the
//     same tab. No cross-tab sharing (by design — limits apply per tab).
//   - After 3 questions without email, the server returns 429 +
//     email_required. We render an inline email-gate form in the chat
//     and re-fire the original question once the email is accepted.
//   - Rate-limit hard caps render a polite bubble pointing at /#demo.
//   - While streaming, raw text accumulates in a bubble. On the final
//     SSE event, if validation succeeded we swap in the structured
//     ChapDetermination component; if validation failed (null), we
//     render an out-of-scope block.
//
// The Exceptions tab from the mock is removed in v1 — fewer moving
// parts and the canned exception list was illustrative only.

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import type { ValidatedResponse } from '@/lib/chapValidation';
import { ChapDetermination } from './ChapDetermination';

type Msg =
  | { role: 'user'; text: string }
  | { role: 'assistant'; status: 'greeting'; text: string }
  | { role: 'assistant'; status: 'streaming'; buffer: string }
  | {
      role: 'assistant';
      status: 'done';
      response: ValidatedResponse | null;
      buffer: string;
    }
  | { role: 'assistant'; status: 'error'; text: string }
  | { role: 'assistant'; status: 'rate_limited'; text: string }
  | { role: 'assistant'; status: 'email_gate'; pendingQuestion: string };

const INITIAL_GREETING =
  'Hi — I can help with IRC §6656 (failure-to-deposit penalty) questions. Describe your situation and I’ll return a determination with citations to the primary source.';

const SUGGESTED_QUESTIONS = [
  'What triggers an IRC §6656 deposit penalty?',
  'Do I qualify for first-time depositor relief under IRC §6656(c)?',
  'How is the four-tier §6656(b) penalty calculated?',
  'What counts as reasonable cause for penalty abatement?',
];

function readSessionId(): string {
  if (typeof window === 'undefined') return '';
  const existing = window.sessionStorage.getItem('chap_session_id');
  if (existing) return existing;
  const fresh =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `sess-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  window.sessionStorage.setItem('chap_session_id', fresh);
  return fresh;
}

function readStoredEmail(): string | null {
  if (typeof window === 'undefined') return null;
  return window.sessionStorage.getItem('chap_email');
}

function writeStoredEmail(email: string): void {
  if (typeof window === 'undefined') return;
  window.sessionStorage.setItem('chap_email', email);
}

interface SseEvent {
  type: 'chunk' | 'final' | 'error';
  text?: string;
  response?: ValidatedResponse | null;
}

function parseSseLine(line: string): SseEvent | '[DONE]' | null {
  const trimmed = line.trim();
  if (!trimmed.startsWith('data:')) return null;
  const payload = trimmed.slice(5).trim();
  if (payload === '[DONE]') return '[DONE]';
  try {
    return JSON.parse(payload) as SseEvent;
  } catch {
    return null;
  }
}

export function ChapaInterface() {
  const [sessionId, setSessionId] = useState<string>('');
  const [email, setEmail] = useState<string | null>(null);
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'assistant', status: 'greeting', text: INITIAL_GREETING },
  ]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSessionId(readSessionId());
    setEmail(readStoredEmail());
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const askQuestion = async (question: string, overrideEmail?: string) => {
    if (!question.trim() || isStreaming || !sessionId) return;

    const effectiveEmail = overrideEmail ?? email;

    setMessages((prev) => [
      ...prev,
      { role: 'user', text: question },
      { role: 'assistant', status: 'streaming', buffer: '' },
    ]);
    setInput('');
    setIsStreaming(true);

    try {
      const res = await fetch('/api/chap/ask', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          question,
          sessionId,
          email: effectiveEmail ?? undefined,
        }),
      });

      if (!res.ok) {
        let errorCode = 'unknown';
        try {
          const j = (await res.json()) as { error?: string };
          if (j.error) errorCode = j.error;
        } catch {
          // ignore
        }

        setMessages((prev) => {
          const next = prev.slice(0, -1); // drop streaming placeholder
          if (errorCode === 'email_required') {
            return [
              ...next,
              { role: 'assistant', status: 'email_gate', pendingQuestion: question },
            ];
          }
          if (errorCode === 'rate_limit') {
            return [
              ...next,
              {
                role: 'assistant',
                status: 'rate_limited',
                text:
                  'You’ve reached the daily question limit for this session. If you’d like to go deeper, request a demo and we’ll walk through your scenario with a human.',
              },
            ];
          }
          return [
            ...next,
            {
              role: 'assistant',
              status: 'error',
              text: 'Something went wrong on our side. Please try again in a moment.',
            },
          ];
        });
        setIsStreaming(false);
        return;
      }

      if (!res.body) {
        throw new Error('no response body');
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let sseBuffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        sseBuffer += decoder.decode(value, { stream: true });

        let sepIdx = sseBuffer.indexOf('\n\n');
        while (sepIdx !== -1) {
          const rawEvent = sseBuffer.slice(0, sepIdx);
          sseBuffer = sseBuffer.slice(sepIdx + 2);
          sepIdx = sseBuffer.indexOf('\n\n');

          const event = parseSseLine(rawEvent);
          if (event === null) continue;
          if (event === '[DONE]') continue;

          if (event.type === 'chunk' && typeof event.text === 'string') {
            const delta = event.text;
            setMessages((prev) => {
              const next = [...prev];
              const last = next[next.length - 1];
              if (last && last.role === 'assistant' && last.status === 'streaming') {
                next[next.length - 1] = { ...last, buffer: last.buffer + delta };
              }
              return next;
            });
          } else if (event.type === 'final') {
            const finalResponse = event.response ?? null;
            setMessages((prev) => {
              const next = [...prev];
              const last = next[next.length - 1];
              if (last && last.role === 'assistant' && last.status === 'streaming') {
                next[next.length - 1] = {
                  role: 'assistant',
                  status: 'done',
                  response: finalResponse,
                  buffer: last.buffer,
                };
              }
              return next;
            });
          } else if (event.type === 'error') {
            setMessages((prev) => {
              const next = prev.slice(0, -1);
              return [
                ...next,
                {
                  role: 'assistant',
                  status: 'error',
                  text: 'The model stream failed. Please try asking again.',
                },
              ];
            });
          }
        }
      }
    } catch (err) {
      console.error('[ChapaInterface] request failed:', err);
      setMessages((prev) => {
        const next = prev.slice(0, -1);
        return [
          ...next,
          {
            role: 'assistant',
            status: 'error',
            text: 'We couldn’t reach the CHAP service. Check your connection and try again.',
          },
        ];
      });
    } finally {
      setIsStreaming(false);
    }
  };

  const submitEmailGate = async (gateEmail: string, pendingQuestion: string): Promise<boolean> => {
    if (!gateEmail.trim()) return false;
    try {
      const res = await fetch('/api/lead-capture', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          email: gateEmail,
          sessionId,
          firstQuestion: pendingQuestion,
        }),
      });
      if (!res.ok) return false;
      const result = (await res.json()) as { success?: boolean; captured?: boolean };
      if (result.success !== true || result.captured !== true) return false;
    } catch {
      // Fail closed; do not unlock extended questions on a failed capture.
      return false;
    }
    writeStoredEmail(gateEmail);
    setEmail(gateEmail);
    setMessages((prev) => prev.filter((m) => !(m.role === 'assistant' && m.status === 'email_gate')));
    void askQuestion(pendingQuestion, gateEmail);
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void askQuestion(input);
  };

  const showSuggestions =
    messages.length === 1 && messages[0].role === 'assistant' && messages[0].status === 'greeting';

  return (
    <div className="chap-interface">
      {/* Header */}
      <div className="chap-interface__header">
        <div className="chap-interface__header-left">
          <div className="chap-interface__icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              width="14"
              height="14"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div>
            <div className="chap-interface__name">CHAP AI</div>
            <div className="chap-interface__sub">
              Compliance &amp; Payroll Intelligence
            </div>
          </div>
        </div>
        <div className="chap-interface__header-right">
          <span className="chap-interface__badge chap-interface__badge--live">
            AI: Live
          </span>
          <span className="chap-interface__badge chap-interface__badge--kb">
            Corpus: IRC §6656
          </span>
        </div>
      </div>

      {/* Status bar */}
      <div className="chap-interface__statusbar">
        <span className="chap-interface__status-pill">Demo Environment</span>
        <span className="chap-interface__status-pill">
          Informational — not legal or tax advice
        </span>
      </div>

      {/* Chat */}
      <div className="chap-interface__chat">
        <div className="chap-interface__messages">
          {messages.map((m, i) => {
            if (m.role === 'user') {
              return (
                <div
                  key={i}
                  className="chap-interface__msg chap-interface__msg--user"
                >
                  <div className="chap-interface__msg-bubble">{m.text}</div>
                </div>
              );
            }

            if (m.status === 'greeting') {
              return (
                <div
                  key={i}
                  className="chap-interface__msg chap-interface__msg--chap"
                >
                  <div className="chap-interface__msg-label">CHAP AI</div>
                  <div className="chap-interface__msg-bubble">{m.text}</div>
                  {showSuggestions && (
                    <div className="chap-interface__suggestions">
                      <div className="chap-interface__suggestions-label">
                        Suggested questions
                      </div>
                      <div className="chap-interface__suggestions-grid">
                        {SUGGESTED_QUESTIONS.map((s, j) => (
                          <button
                            key={j}
                            type="button"
                            className="chap-interface__suggestion"
                            onClick={() => void askQuestion(s)}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            if (m.status === 'streaming') {
              return (
                <div
                  key={i}
                  className="chap-interface__msg chap-interface__msg--chap"
                >
                  <div className="chap-interface__msg-label">CHAP AI</div>
                  {m.buffer.length === 0 ? (
                    <div className="chap-interface__msg-bubble chap-interface__typing">
                      <span />
                      <span />
                      <span />
                    </div>
                  ) : (
                    <div className="chap-interface__msg-bubble">{m.buffer}</div>
                  )}
                </div>
              );
            }

            if (m.status === 'done') {
              return (
                <div
                  key={i}
                  className="chap-interface__msg chap-interface__msg--chap"
                >
                  <div className="chap-interface__msg-label">CHAP AI</div>
                  <ChapDetermination response={m.response} />
                </div>
              );
            }

            if (m.status === 'rate_limited' || m.status === 'error') {
              return (
                <div
                  key={i}
                  className="chap-interface__msg chap-interface__msg--chap"
                >
                  <div className="chap-interface__msg-label">CHAP AI</div>
                  <div className="chap-interface__msg-bubble">
                    {m.text}
                    {m.status === 'rate_limited' && (
                      <>
                        {' '}
                        <Link
                          href="/#demo"
                          style={{ color: '#5ba3f5', textDecoration: 'underline' }}
                        >
                          Request a demo
                        </Link>
                        .
                      </>
                    )}
                  </div>
                </div>
              );
            }

            if (m.status === 'email_gate') {
              return (
                <EmailGate
                  key={i}
                  pendingQuestion={m.pendingQuestion}
                  onSubmit={submitEmailGate}
                />
              );
            }

            return null;
          })}
          <div ref={bottomRef} />
        </div>

        <form className="chap-interface__input-row" onSubmit={handleSubmit}>
          <input
            className="chap-interface__input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask CHAP about an IRC §6656 scenario…"
            disabled={isStreaming}
            maxLength={500}
          />
          <button
            className="chap-interface__send"
            type="submit"
            disabled={isStreaming || input.trim().length < 10}
          >
            Send
          </button>
        </form>
        <div className="chap-interface__footer-note">
          CHAP assists. You stay in control. Informational only — not legal or tax advice.
        </div>
      </div>
    </div>
  );
}

function EmailGate(props: {
  pendingQuestion: string;
  onSubmit: (email: string, pendingQuestion: string) => Promise<boolean>;
}) {
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  return (
    <div className="chap-interface__msg chap-interface__msg--chap">
      <div className="chap-interface__msg-label">CHAP AI</div>
      <div className="chap-interface__msg-bubble">
        <p style={{ margin: '0 0 0.75rem' }}>
          You&apos;ve used your free questions. Share your work email and I&apos;ll
          keep answering.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const v = value.trim();
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
              setError('Please enter a valid work email.');
              return;
            }
            setError(null);
            setBusy(true);
            void props.onSubmit(v, props.pendingQuestion)
              .then((ok) => {
                if (!ok) setError('We could not save your email. Please try again later.');
              })
              .catch(() => setError('We could not save your email. Please try again later.'))
              .finally(() => setBusy(false));
          }}
          style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}
        >
          <input
            type="email"
            className="chap-interface__input"
            style={{ flex: 1, minWidth: 180 }}
            placeholder="you@company.com"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoFocus
            required
          />
          <button type="submit" className="chap-interface__send" disabled={busy}>
            Continue
          </button>
        </form>
        {error && (
          <div style={{ color: '#ef4444', fontSize: '0.7rem', marginTop: '0.5rem' }}>
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
