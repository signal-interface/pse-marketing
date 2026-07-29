'use client';

import { useState, useEffect, useRef } from 'react';

const INITIAL_MESSAGE = `Good morning. Here's your current compliance snapshot:

• 3 open exceptions require attention before the next cutoff
• 5 active jurisdictions: CA, NY, TX, WA, FL
• Compliance score: 94% (up 3% from last period)
• 128 hours to payroll cutoff

What would you like to review?`;

const SUGGESTED = [
  'Explain why exception #1042 was flagged',
  'Show supporting sources for the CA meal break rule',
  'What changes with the new CA minimum wage rate?',
  'Generate audit documentation for last payroll run',
];

const RESPONSES: Record<string, string> = {
  '1042': 'Exception #1042 — Employee worked a 6.2-hour shift without a recorded 30-minute meal break. California Labor Code §512 requires an uninterrupted 30-minute meal period for shifts exceeding 5 hours. The employee is owed a one-hour premium wage for the missed break. This exception blocks payroll until resolved or waived with written consent on file.',
  'sources': 'Supporting sources for CA meal break rule:\n• CA Labor Code §512 — meal period requirement\n• IWC Wage Order 4-2001, §11 — meal period timing\n• CA DLSE Enforcement Manual §45 — premium pay calculation\n• Donohue v. AMN Services (2021) — on-duty meal period standards',
  'minimum wage': 'Washington minimum wage effective January 1, 2026: $16.66/hour (up from $16.28). This affects 4 employees in your WA jurisdiction. CHAP AI has updated the compliance rules automatically. No exceptions generated — current rates are compliant.',
  'default': 'Audit documentation for the last payroll run has been generated. The record includes: all 22 compliance checks performed, 19 passed, 3 flagged, resolution status for each exception, and the approving reviewer. Available in the Audit Ledger.',
};

const EXCEPTIONS = [
  { id: '1042', tag: 'blocksPayroll' as const, label: 'CA Lab §512 — Meal break', detail: '3 employees, 6.2hr+ shifts', statute: 'CA Lab §512' },
  { id: '1087', tag: 'blocksPayroll' as const, label: 'CA Lab §512 — Break waiver', detail: 'Waiver not on file', statute: 'CA Lab §512' },
  { id: '2201', tag: 'advisory' as const, label: 'WA RCW 49.46 — Rate update', detail: '2026 minimum wage effective Jan 1', statute: 'WA RCW 49.46' },
];

function getResponse(text: string): string {
  if (text.includes('1042')) return RESPONSES['1042'];
  if (text.includes('sources') || text.includes('supporting')) return RESPONSES['sources'];
  if (text.includes('minimum wage') || text.includes('rate')) return RESPONSES['minimum wage'];
  return RESPONSES['default'];
}

export function ChapaInterface() {
  const [activeTab, setActiveTab] = useState<'chat' | 'exceptions'>('chat');
  const [messages, setMessages] = useState<{ role: 'chap' | 'user'; text: string }[]>([
    { role: 'chap', text: INITIAL_MESSAGE },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { role: 'user', text }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [...prev, { role: 'chap', text: getResponse(text) }]);
    }, 1200);
  };

  return (
    <div className="chap-interface">
      {/* Header */}
      <div className="chap-interface__header">
        <div className="chap-interface__header-left">
          <div className="chap-interface__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div>
            <div className="chap-interface__name">CHAP AI</div>
            <div className="chap-interface__sub">Compliance &amp; Payroll Intelligence</div>
          </div>
        </div>
        <div className="chap-interface__header-right">
          <span className="chap-interface__badge chap-interface__badge--live">AI: Live</span>
          <span className="chap-interface__badge chap-interface__badge--kb">Knowledge Base: Active</span>
        </div>
      </div>

      {/* Status bar */}
      <div className="chap-interface__statusbar">
        <span className="chap-interface__status-pill">Demo Environment</span>
        <span className="chap-interface__status-pill">Compliance Model: Production Logic</span>
        <span className="chap-interface__status-pill chap-interface__status-pill--warn">128h to cutoff</span>
      </div>

      {/* Tabs */}
      <div className="chap-interface__tabs">
        <button
          className={`chap-interface__tab${activeTab === 'chat' ? ' active' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          CHAP AI
        </button>
        <button
          className={`chap-interface__tab${activeTab === 'exceptions' ? ' active' : ''}`}
          onClick={() => setActiveTab('exceptions')}
        >
          Exceptions
          <span className="chap-interface__tab-count">3</span>
        </button>
      </div>

      {/* Chat panel */}
      {activeTab === 'chat' && (
        <div className="chap-interface__chat">
          <div className="chap-interface__messages">
            {messages.map((m, i) => (
              <div key={i} className={`chap-interface__msg chap-interface__msg--${m.role}`}>
                {m.role === 'chap' && <div className="chap-interface__msg-label">CHAP AI</div>}
                <div className="chap-interface__msg-bubble">
                  {m.text.split('\n').map((line, j) => (
                    <span key={j}>
                      {line}
                      {j < m.text.split('\n').length - 1 && <br />}
                    </span>
                  ))}
                </div>
                {m.role === 'chap' && i === 0 && (
                  <div className="chap-interface__suggestions">
                    <div className="chap-interface__suggestions-label">Suggested questions</div>
                    <div className="chap-interface__suggestions-grid">
                      {SUGGESTED.map((s, j) => (
                        <button key={j} className="chap-interface__suggestion" onClick={() => handleSend(s)}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {typing && (
              <div className="chap-interface__msg chap-interface__msg--chap">
                <div className="chap-interface__msg-label">CHAP AI</div>
                <div className="chap-interface__msg-bubble chap-interface__typing">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          <div className="chap-interface__input-row">
            <input
              className="chap-interface__input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
              placeholder="Ask CHAP about compliance, exceptions, jurisdictions..."
            />
            <button className="chap-interface__send" onClick={() => handleSend(input)}>
              Send
            </button>
          </div>
          <div className="chap-interface__footer-note">CHAP assists. You stay in control.</div>
        </div>
      )}

      {/* Exceptions panel */}
      {activeTab === 'exceptions' && (
        <div className="chap-interface__exceptions">
          {EXCEPTIONS.map((ex) => (
            <div key={ex.id} className={`chap-interface__exception chap-interface__exception--${ex.tag}`}>
              <div className="chap-interface__exception-left">
                <span className={`chap-interface__exception-badge${ex.tag === 'blocksPayroll' ? ' error' : ''}`}>
                  {ex.tag === 'blocksPayroll' ? 'Blocks Payroll' : 'Advisory'}
                </span>
                <div className="chap-interface__exception-label">{ex.label}</div>
                <div className="chap-interface__exception-detail">{ex.detail}</div>
              </div>
              <div className="chap-interface__exception-statute">{ex.statute}</div>
            </div>
          ))}
          <div className="chap-interface__exceptions-note">Payroll Director review required before cutoff.</div>
        </div>
      )}
    </div>
  );
}
