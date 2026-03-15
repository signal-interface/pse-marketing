'use client';

import { useEffect, useState, useCallback } from 'react';

const scanLines = [
  { delay: 0,    type: 'cmd',     text: 'chap-ai scan --pre-run --employee-count 247 --states CA,TX,NY,FL,WA' },
  { delay: 400,  type: 'info',    text: 'Initializing compliance ruleset v4.2.1...' },
  { delay: 800,  type: 'info',    text: 'Loading 247 employee records across 5 states...' },
  { delay: 1200, type: 'info',    text: 'Running federal statutory checks (FLSA, IRC)...' },
  { delay: 1800, type: 'ok',      text: '✓  FLSA §207        Overtime                   247/247 passed' },
  { delay: 2100, type: 'ok',      text: '✓  IRC §6656        Deposit schedule            On time' },
  { delay: 2400, type: 'ok',      text: '✓  FLSA §206        Minimum wage               247/247 passed' },
  { delay: 2700, type: 'info',    text: 'Running California state checks (38 employees)...' },
  { delay: 3100, type: 'warn',    text: '⚠  CA Lab §512      Meal break                 3 violations' },
  { delay: 3200, type: 'warn',    text: '   └─ EE #1042: 6.2hr shift, no 30-min break recorded' },
  { delay: 3300, type: 'warn',    text: '   └─ EE #1087: Break waiver not on file' },
  { delay: 3400, type: 'warn',    text: '   └─ EE #1203: Second meal period required at 10hrs' },
  { delay: 3700, type: 'ok',      text: '✓  IWC Order 4      Split shift premium        Compliant' },
  { delay: 4000, type: 'ok',      text: '✓  CA Lab §246      Sick leave accrual         Compliant' },
  { delay: 4300, type: 'info',    text: 'Running Texas, New York, Florida, Washington checks...' },
  { delay: 4700, type: 'ok',      text: '✓  TX, FL            No state income tax        N/A' },
  { delay: 5000, type: 'ok',      text: '✓  NY Lab §195       Wage notice                Compliant' },
  { delay: 5300, type: 'ok',      text: '✓  WA RCW 49.46     Minimum wage (2026 rate)   Compliant' },
  { delay: 5700, type: 'divider', text: '─────────────────────────────────────────────────────────' },
  { delay: 5800, type: 'summary', text: 'Scan complete  ·  22 checks  ·  19 passed  ·  3 violations' },
  { delay: 6000, type: 'action',  text: 'Payroll BLOCKED pending resolution of CA Lab §512 violations' },
];

export function ChapaTerminal() {
  const [visibleCount, setVisibleCount] = useState(0);
  const [runKey, setRunKey] = useState(0);

  const reset = useCallback(() => {
    setVisibleCount(0);
    setRunKey((k) => k + 1);
  }, []);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    scanLines.forEach((line, i) => {
      timers.push(setTimeout(() => setVisibleCount(i + 1), line.delay));
    });
    return () => timers.forEach(clearTimeout);
  }, [runKey]);

  const done = visibleCount >= scanLines.length;

  return (
    <div className="chap-terminal-wrap">
      <div className="chap-terminal-bar">
        <span className="chap-terminal-dot chap-terminal-dot-r" />
        <span className="chap-terminal-dot chap-terminal-dot-a" />
        <span className="chap-terminal-dot chap-terminal-dot-g" />
        <span className="chap-terminal-title">chap-ai — pre-run scan</span>
      </div>
      <div className="chap-terminal-body">
        {scanLines.slice(0, visibleCount).map((line, i) => (
          <div key={`${runKey}-${i}`} className={`chap-terminal-line-${line.type}`}>
            {line.text}
          </div>
        ))}
        {!done && <span className="chap-terminal-cursor" />}
      </div>
      {done && (
        <button className="chap-terminal-rerun" onClick={reset}>
          ↻ Re-run scan
        </button>
      )}
    </div>
  );
}
