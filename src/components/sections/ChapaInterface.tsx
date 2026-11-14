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
//   - Wait for a validated terminal event; never render raw model chunks.
//     Failure, timeout and malformed output render an error, not out-of-scope.
//
// The Exceptions tab from the mock is removed in v1 — fewer moving
// parts and the canned exception list was illustrative only.

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import type { ValidatedResponse } from '@/lib/chapValidation';
import { consumeChapStream } from '@/lib/chapStreamClient';
import { ChapDetermination } from './ChapDetermination';
import { answerWebsiteQuestion, WEBSITE_SUGGESTIONS, websiteGuideDemoCta, websiteGuideFollowUps, type SiteGuideTopic } from '@/lib/siteGuide';

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
  | { role: 'assistant'; status: 'email_gate'; pendingQuestion: string }
  | { role: 'assistant'; status: 'guide'; text: string; links: ReadonlyArray<{ label: string; href: string }> };

const INITIAL_GREETING =
  'Hi — I can help with IRC §6656 (failure-to-deposit penalty) questions. Ask a general educational question and I’ll share source-linked information where the limited corpus supports an answer. Do not enter payroll or personal data.';

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

function initialGuideMessages(): Msg[] {
  return [{ role: 'assistant', status: 'guide',
    text: "Welcome to PSE. Ask about our published services, Payroll Intelligence, risk estimator, or how to request a demonstration. The Website Guide uses curated public information and is free to explore.",
    links: [{ label: 'Explore services', href: '/services' }] }];
}
function initialComplianceMessages(): Msg[] {
  return [{ role: 'assistant', status: 'greeting', text: INITIAL_GREETING }];
}

export function ChapaInterface() {
  const [mode, setMode] = useState<'guide' | 'compliance'>('guide');
  const [guideMessages, setGuideMessages] = useState<Msg[]>(initialGuideMessages);
  const [guideTopic, setGuideTopic] = useState<SiteGuideTopic | null>(null);
  const lastComplianceQuestionRef = useRef<string | null>(null);
  const [sessionId, setSessionId] = useState<string>('');
  const [email, setEmail] = useState<string | null>(null);
  const [messages, setMessages] = useState<Msg[]>(initialComplianceMessages);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSessionId(readSessionId());
    setEmail(readStoredEmail());
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    bottomRef.current?.scrollIntoView({ behavior: reduce ? 'instant' : 'smooth', block: 'nearest' });
  }, [messages, guideMessages, mode]);

  const askQuestion = async (question: string, overrideEmail?: string) => {
    if (!question.trim() || isStreaming || !sessionId) return;
    const rawQuestion = question.trim();
    const explain = /^(explain|elaborate|more|tell me more|details)$/i.test(rawQuestion);
    if (rawQuestion.length < 10 && (!explain || !lastComplianceQuestionRef.current)) {
      setMessages((prev) => [...prev, { role: 'assistant', status: 'error', text: 'Please enter a fuller IRC §6656 question, or ask “Explain” after an earlier question.' }]);
      return;
    }
    const requestQuestion = explain
      ? `Please explain this prior IRC §6656 topic in more detail: ${lastComplianceQuestionRef.current}`
      : rawQuestion;
    if (!explain) lastComplianceQuestionRef.current = requestQuestion;
    const effectiveEmail = overrideEmail ?? email;

    setMessages((prev) => [
      ...prev,
      { role: 'user', text: question },
      { role: 'assistant', status: 'streaming', buffer: '' },
    ]);
    setInput('');
    setIsStreaming(true);
    let terminalReceived = false;
    const requestController = new AbortController();
    const deadline = setTimeout(() => requestController.abort(), 55_000);

    try {
      const res = await fetch('/api/chap/ask', {
        method: 'POST',
        signal: requestController.signal,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          question: requestQuestion,
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

      await consumeChapStream(res.body, requestController.signal, (event) => {
        terminalReceived = true;
        if (event.type === 'final') {
          setMessages((prev) => {
            const next = [...prev];
            const last = next[next.length - 1];
            if (last && last.role === 'assistant' && last.status === 'streaming') {
              next[next.length - 1] = {
                role: 'assistant',
                status: 'done',
                response: event.response,
                buffer: '',
              };
            }
            return next;
          });
        } else {
          setMessages((prev) => {
            const next = prev.slice(0, -1);
            return [...next, {
              role: 'assistant',
              status: 'error',
              text: 'The educational answer could not be verified. Please try again or consult official sources.',
            }];
          });
        }
      });
    } catch (err) {
      console.error('[ChapaInterface] request failed:', err);
      if (terminalReceived) return; // A validated final answer must survive a late transport error.
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
      clearTimeout(deadline);
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

  // Reset only the visible conversation. Deliberately preserve sessionStorage,
  // server-side session/IP allowance, captured email and persisted lead records.
  // Disable while compliance is streaming so late responses cannot repopulate the UI.
  const newConversation = () => {
    if (isStreaming) return;
    setMode('guide');
    setGuideMessages(initialGuideMessages());
    setGuideTopic(null);
    setMessages(initialComplianceMessages());
    lastComplianceQuestionRef.current = null;
    setInput('');
  };

  const guideQuestion = (question: string) => {
    const text = question.trim();
    if (!text || text.length > 250) return;
    const answer = answerWebsiteQuestion(text, guideTopic);
    setGuideTopic(answer.topic);
    setGuideMessages((prev) => [...prev,
      { role: 'user', text },
      { role: 'assistant', status: 'guide', text: answer.text, links: answer.links },
    ]);
    setInput('');
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'guide') guideQuestion(input);
    else void askQuestion(input);
  };
  const activeMessages = mode === 'guide' ? guideMessages : messages;
  const showSuggestions = mode === 'compliance' && messages.length === 1 && messages[0].role === 'assistant' && messages[0].status === 'greeting';

  return (
    <div className="chap-interface">
      {/* Header */}
      <div className="chap-interface__header">
        <div className="chap-interface__header-left">
          <div className="chap-interface__icon" aria-label="CHAP AI assistant" role="img">
            <svg
              viewBox="0 0 32 32"
              fill="none"
              width="30"
              height="30"
              aria-hidden="true"
            >
              <rect x="5" y="8" width="22" height="20" rx="8" fill="currentColor" fillOpacity="0.14" stroke="currentColor" strokeWidth="1.5" />
              <path d="M16 4v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="16" cy="4" r="2" fill="currentColor" />
              <circle cx="12" cy="17" r="2" fill="currentColor" />
              <circle cx="20" cy="17" r="2" fill="currentColor" />
              <path d="M12 23c2.5 2 5.5 2 8 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <div className="chap-interface__name">CHAP AI</div>
            <div className="chap-interface__sub">
              Compliance, Helpdesk &amp; Automation Platform
            </div>
          </div>
        </div>
        <div className="chap-interface__header-right">
          <span className="chap-interface__badge chap-interface__badge--live">
            Educational AI
          </span>
          <span className="chap-interface__badge chap-interface__badge--kb">
            Corpus: IRC §6656
          </span>
        </div>
      </div>

      {/* Site guide runs locally; compliance mode preserves the existing gate. */}
      <div className="chap-interface__mode-switch" role="group" aria-label="CHAP Marketing information modes">
        <button type="button" aria-pressed={mode === 'guide'} className="chap-interface__mode-button" onClick={() => { setMode('guide'); setInput(''); }}>Website Guide</button>
        <button type="button" aria-pressed={mode === 'compliance'} className="chap-interface__mode-button" onClick={() => { setMode('compliance'); setInput(''); }}>Compliance Education</button>
      </div>
      {/* Status bar */}
      <div className="chap-interface__statusbar">
        <span className="chap-interface__status-pill">{mode === 'guide' ? 'Public website information' : 'Educational demo environment'}</span>
        <span className="chap-interface__status-pill">
          Informational — not legal or tax advice
        </span>
        <button type="button" className="chap-interface__reset" onClick={newConversation}
          disabled={isStreaming} aria-label="New Conversation — clear visible messages">
          New Conversation
        </button>
      </div>

      {/* Chat */}
      <div className="chap-interface__chat">
        <div className="chap-interface__messages" role="log" aria-label="CHAP Marketing conversation" aria-live="off">
          {activeMessages.map((m, i) => {
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

            if (m.status === 'guide') {
              return (
                <div key={i} className="chap-interface__msg chap-interface__msg--chap">
                  <div className="chap-interface__msg-label">PSE Website Guide</div>
                  <div className="chap-interface__msg-bubble" role={i === activeMessages.length - 1 ? "status" : undefined}>
                    {m.text}
                    {m.links.length > 0 && <div className="chap-interface__guide-links">
                      {m.links.map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}
                    </div>}
                  </div>
                  {i === 0 && mode === 'guide' && guideMessages.length === 1 && (
                    <div className="chap-interface__suggestions">
                      <div className="chap-interface__suggestions-label">Explore this website</div>
                      <div className="chap-interface__suggestions-grid">
                        {WEBSITE_SUGGESTIONS.map(q => <button key={q} type="button" className="chap-interface__suggestion" onClick={() => guideQuestion(q)}>{q}</button>)}
                      </div>
                    </div>
                  )}
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
          {mode === 'guide' && guideMessages.length > 1 && (
            <div className="chap-interface__next-steps" aria-label="Suggested next questions">
              <div className="chap-interface__suggestions-label">Continue exploring</div>
              <div className="chap-interface__suggestions-grid">
                {websiteGuideFollowUps(guideTopic).map((question) => (
                  <button key={question} type="button" className="chap-interface__suggestion"
                    onClick={() => guideQuestion(question)}>
                    {question}
                  </button>
                ))}
              </div>
              {websiteGuideDemoCta(guideTopic) && (
                <Link className="chap-interface__demo-cta" href="/#demo">
                  Explore a guided PSE demonstration
                </Link>
              )}
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <form className="chap-interface__input-row" onSubmit={handleSubmit}>
          <input
            className="chap-interface__input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            aria-label={mode === 'guide' ? 'Ask about PSE website information' : 'Ask a question about IRC §6656'}
            placeholder={mode === 'guide' ? 'Ask about PSE services or demos…' : 'Ask CHAP about an IRC §6656 scenario…'}
            disabled={mode === 'compliance' && isStreaming}
            maxLength={mode === 'guide' ? 250 : 500}
          />
          <button
            className="chap-interface__send"
            type="submit"
            disabled={!input.trim() || (mode === 'compliance' && isStreaming)}
          >
            Send
          </button>
        </form>
        <div className="chap-interface__footer-note">
          {mode === 'guide'
            ? 'Public website information only. No AI request, email gate, or subscriber enrollment.'
            : 'IRC §6656 education only. Three free questions, then a marketing email gate. Not legal or tax advice.'}
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
