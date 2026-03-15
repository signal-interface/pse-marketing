'use client';

const industries = [
  { icon: 'pulse',   name: 'Healthcare',                sub: '#1 in DOL back-wage recovery' },
  { icon: 'truck',   name: 'Transportation & Logistics', sub: 'High overtime exposure' },
  { icon: 'home',    name: 'Real Estate & Property',     sub: 'Multi-state classification risk' },
  { icon: 'cart',    name: 'Retail & Hospitality',       sub: 'Tip & minimum wage violations' },
  { icon: 'dollar',  name: 'Financial Services',         sub: 'IRC §6656 deposit exposure' },
  { icon: 'box',     name: 'Manufacturing',              sub: 'Multi-state, shift-work complexity' },
  { icon: 'users',   name: 'Staffing & Workforce',       sub: 'Worker classification risk' },
  { icon: 'headset', name: 'Home Health & Care',         sub: 'FLSA exemption complexity' },
];

const icons: Record<string, React.ReactNode> = {
  pulse:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
  truck:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
  home:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  cart:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>,
  dollar:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
  box:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>,
  users:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
  headset: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0118 0v6"/><path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z"/></svg>,
};

const allItems = [...industries, ...industries];

export function IndustryBar() {
  return (
    <section className="pse-logo-bar" aria-label="Industries with highest payroll compliance exposure">
      <p className="pse-industry-wedge-line">ADP processes your payroll. UKG tracks your time. Dayforce manages your workforce. <strong>None of them govern the output.</strong></p>
      <p className="pse-logo-bar__label">Built for payroll teams in compliance-intensive industries</p>
      <div className="pse-logo-bar__wrapper">
        <div className="pse-logo-bar__track">
          {allItems.map((item, i) => (
            <div key={i} className="pse-logo-item" aria-hidden={i >= industries.length ? 'true' : undefined}>
              <div className="pse-logo-item__icon">{icons[item.icon]}</div>
              <div>
                <div className="pse-logo-item__name">{item.name}</div>
                <div className="pse-logo-item__sub">{item.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
