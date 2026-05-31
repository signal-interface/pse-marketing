// generateReport.ts
// Client-side PDF generation using jsPDF
// Runs entirely in the browser — no server, no email provider required
// Called from ComplianceEstimator.tsx on button click

import type { EstimatorOutputs } from '@/lib/estimator';
import { formatCurrency } from '@/lib/estimator';

// Dynamic import — prevents Next.js SSR errors
// jsPDF only works in browser context
async function getJsPDF() {
  const { default: jsPDF } = await import('jspdf');
  return jsPDF;
}

type JsPDFClass = Awaited<ReturnType<typeof getJsPDF>>;
type JsPDFDoc = InstanceType<JsPDFClass>;

const NAVY   = '#0f1c2e';
const STEEL  = '#4a6580';
const ACCENT = '#1e5fa8';
const ICE    = '#e8f0f8';
const WHITE  = '#ffffff';
const MUTED  = '#7a97b0';

function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

function setFill(doc: JsPDFDoc, hex: string) {
  doc.setFillColor(...hexToRgb(hex));
}

function setTextColor(doc: JsPDFDoc, hex: string) {
  doc.setTextColor(...hexToRgb(hex));
}

function setDrawColor(doc: JsPDFDoc, hex: string) {
  doc.setDrawColor(...hexToRgb(hex));
}

const INDUSTRY_LABELS: Record<string, string> = {
  healthcare:     'Healthcare',
  transportation: 'Transportation & Logistics',
  retail:         'Retail & Hospitality',
  manufacturing:  'Manufacturing',
  staffing:       'Staffing & Workforce',
  financial:      'Financial Services',
  real_estate:    'Real Estate & Property',
  other:          'Other',
};

export async function generateComplianceReport(results: EstimatorOutputs): Promise<void> {
  const jsPDF = await getJsPDF();
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const PW = 210; // A4 width mm
  const PH = 297; // A4 height mm
  const ML = 20;  // margin left
  const MR = 20;  // margin right
  const CW = PW - ML - MR; // content width
  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  // ── PAGE 1 ──────────────────────────────────────────────

  // Header bar
  setFill(doc, NAVY);
  doc.rect(0, 0, PW, 28, 'F');

  // PSE wordmark
  setTextColor(doc, WHITE);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('PAYROLL SYNERGY EXPERTS', ML, 12);

  // Tagline
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  setTextColor(doc, '#6b8caa');
  doc.text('Audit-first payroll intelligence for multi-state employers.', ML, 18);

  // Report label (right)
  setTextColor(doc, '#6b8caa');
  doc.setFontSize(7);
  doc.text('COMPLIANCE RISK REPORT', PW - MR, 12, { align: 'right' });
  doc.text(date, PW - MR, 18, { align: 'right' });

  // Accent line under header
  setFill(doc, ACCENT);
  doc.rect(0, 28, PW, 1.5, 'F');

  // Report title
  let y = 46;
  setTextColor(doc, NAVY);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Compliance Risk Exposure Estimate', ML, y);

  y += 8;
  setTextColor(doc, STEEL);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  const subtitle = `${results.inputs.employees.toLocaleString()} employees · ` +
    `${results.inputs.states} state${results.inputs.states !== 1 ? 's' : ''} · ` +
    `${INDUSTRY_LABELS[results.inputs.industry] ?? 'Other'}`;
  doc.text(subtitle, ML, y);

  // Divider
  y += 6;
  setDrawColor(doc, ICE);
  doc.setLineWidth(0.5);
  doc.line(ML, y, PW - MR, y);

  // Total exposure card
  y += 10;
  setFill(doc, NAVY);
  doc.roundedRect(ML, y, CW, 32, 3, 3, 'F');

  setTextColor(doc, '#6b8caa');
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text('ESTIMATED ANNUAL EXPOSURE', ML + 8, y + 9);

  setTextColor(doc, WHITE);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text(formatCurrency(results.totalAnnualExposure), ML + 8, y + 22);

  setTextColor(doc, '#6b8caa');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.text(
    'Across deposit penalties, wage & hour exposure, compliance staffing, and error correction',
    ML + 8, y + 29
  );

  // Breakdown section
  y += 42;
  setTextColor(doc, NAVY);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Exposure Breakdown', ML, y);

  y += 6;
  setDrawColor(doc, ICE);
  doc.line(ML, y, PW - MR, y);

  const breakdown = [
    {
      name: 'Deposit Penalty Exposure',
      value: results.depositPenaltyExposure,
      source: 'IRC §6656',
      desc: 'Four-tier IRS penalty on late or incorrect tax deposits, escalating from 2% to 15%.',
    },
    {
      name: 'Wage & Hour Back-Pay Exposure',
      value: results.wageHourExposure,
      source: 'DOL WHD FY2023',
      desc: 'Estimated DOL back-wage liability based on $1,296 avg recovery per affected employee.',
    },
    {
      name: 'Compliance Staff Time Cost',
      value: results.complianceTimeCost,
      source: 'EY 2024',
      desc: '120 hrs/yr average time lost to compliance resolution, scaled by headcount and states. Staff time valued at $26/hr blended rate (BLS OES May 2024, Financial Clerks median $48,650, SOC 43-3000).',
    },
    {
      name: 'Error Correction Cost',
      value: results.errorCorrectionCost,
      source: 'EY / IRS',
      desc: '15 errors per payroll run at $291/error, scaled by employee count and error rate.',
    },
  ];

  for (let idx = 0; idx < breakdown.length; idx++) {
    const item = breakdown[idx];
    y += 8;

    // Row background on alternating items
    if (idx % 2 === 0) {
      setFill(doc, '#f8fafc');
      doc.rect(ML, y - 4, CW, 18, 'F');
    }

    // Source badge
    setFill(doc, '#e8f0f8');
    doc.roundedRect(ML, y - 2, 28, 5, 1, 1, 'F');
    setTextColor(doc, ACCENT);
    doc.setFontSize(6);
    doc.setFont('helvetica', 'bold');
    doc.text(item.source, ML + 14, y + 1.5, { align: 'center' });

    // Name
    setTextColor(doc, NAVY);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(item.name, ML + 32, y + 1);

    // Value (right aligned)
    doc.setFontSize(11);
    doc.text(formatCurrency(item.value), PW - MR, y + 1, { align: 'right' });

    // Description
    y += 6;
    setTextColor(doc, STEEL);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.text(item.desc, ML + 32, y, { maxWidth: CW - 32 - 30 });

    y += 4;
    setDrawColor(doc, ICE);
    doc.setLineWidth(0.3);
    doc.line(ML, y + 2, PW - MR, y + 2);
  }

  // Total line
  y += 10;
  setFill(doc, NAVY);
  doc.rect(ML, y, CW, 10, 'F');
  setTextColor(doc, WHITE);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Total estimated annual exposure', ML + 4, y + 7);
  doc.setFontSize(12);
  doc.text(formatCurrency(results.totalAnnualExposure), PW - MR, y + 7, { align: 'right' });

  // ── PAGE 2 ──────────────────────────────────────────────
  doc.addPage();

  // Header bar (repeat)
  setFill(doc, NAVY);
  doc.rect(0, 0, PW, 28, 'F');
  setTextColor(doc, WHITE);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('PAYROLL SYNERGY EXPERTS', ML, 12);
  setTextColor(doc, '#6b8caa');
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text('Compliance Risk Report — continued', PW - MR, 12, { align: 'right' });
  setFill(doc, ACCENT);
  doc.rect(0, 28, PW, 1.5, 'F');

  y = 46;

  // Methodology section
  setTextColor(doc, NAVY);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Methodology & Data Sources', ML, y);

  y += 6;
  setDrawColor(doc, ICE);
  doc.line(ML, y, PW - MR, y);
  y += 8;

  const methodology = [
    {
      label: 'Deposit Penalty Exposure',
      text:
        'Based on IRC §6656 four-tier penalty structure. Assumes a 33% employer ' +
        'error rate (IRS/EY) applied to estimated quarterly deposit obligations scaled by ' +
        'employee count. Industry and state multipliers applied from DOL enforcement data.',
      source: 'IRC §6656(b)(1); IRS Notice 746 (Rev. 12-2024)',
    },
    {
      label: 'Wage & Hour Exposure',
      text:
        'Based on DOL WHD FY2023 recovery of $212M for 163,000 workers ($1,296 per affected ' +
        'employee). Applied to headcount × error rate × industry risk × 0.25 investigation ' +
        'probability factor.',
      source: 'DOL WHD FY2023 Statistical Release',
    },
    {
      label: 'Compliance Staff Time Cost',
      text:
        'EY research: average employer spends 120 hours/year resolving compliance issues ' +
        '(29 hrs litigation + 91 hrs compliance management). Scaled logarithmically by ' +
        'employee count and linearly by state count at 8% per additional state.',
      source: 'Ernst & Young Global Payroll Operations Survey, 2024; BLS OES May 2024 (SOC 43-3000, Financial Clerks median annual wage $48,650)',
    },
    {
      label: 'Error Correction Cost',
      text:
        'EY: average 15 corrections per payroll run at $291 per error. Applied to 26 ' +
        'biweekly runs/year × 33% employer error rate × headcount scaling factor.',
      source: 'EY Payroll Operations Survey 2024; IRS employer compliance study',
    },
  ];

  for (const item of methodology) {
    setTextColor(doc, NAVY);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.text(item.label, ML, y);

    y += 5;
    setTextColor(doc, STEEL);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(item.text, CW);
    doc.text(lines, ML, y);
    y += lines.length * 4;

    setTextColor(doc, ACCENT);
    doc.setFontSize(7);
    doc.text(`Source: ${item.source}`, ML, y);

    y += 8;
    setDrawColor(doc, ICE);
    doc.setLineWidth(0.3);
    doc.line(ML, y, PW - MR, y);
    y += 6;
  }

  // Disclaimer
  y += 4;
  setFill(doc, '#f8fafc');
  doc.roundedRect(ML, y, CW, 22, 2, 2, 'F');
  setTextColor(doc, MUTED);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  const disclaimer =
    'IMPORTANT DISCLAIMER: These estimates are based on industry benchmark data and ' +
    'statistical averages. They do not represent guaranteed outcomes or actual PSE client ' +
    'results. Actual compliance exposure varies by payroll structure, historical error rate, ' +
    'jurisdictional requirements, and remediation practices. This report is provided for ' +
    'informational purposes only and does not constitute legal, tax, or financial advice.';
  const dLines = doc.splitTextToSize(disclaimer, CW - 8);
  doc.text(dLines, ML + 4, y + 6);

  // CTA section
  y += 30;
  setFill(doc, NAVY);
  doc.roundedRect(ML, y, CW, 36, 3, 3, 'F');

  setTextColor(doc, WHITE);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('See how PSE addresses each exposure area.', ML + 8, y + 11);

  setTextColor(doc, '#6b8caa');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(
    'PSE\'s CHAP AI validates every payroll run against federal and state\n' +
    'statutory requirements before payroll commits — addressing deposit\n' +
    'timing, overtime, meal break, and classification compliance automatically.',
    ML + 8, y + 18
  );

  setFill(doc, ACCENT);
  doc.roundedRect(ML + 8, y + 27, 50, 7, 1.5, 1.5, 'F');
  setTextColor(doc, WHITE);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('payrollsynergyexperts.com/demo', ML + 33, y + 31.5, { align: 'center' });

  // Footer
  setFill(doc, NAVY);
  doc.rect(0, PH - 14, PW, 14, 'F');
  setTextColor(doc, '#6b8caa');
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'normal');
  doc.text(
    '\u00A9 2026 Payroll Synergy Experts \u00B7 payrollsynergyexperts.com \u00B7 info@payrollsynergyexperts.com',
    PW / 2, PH - 6, { align: 'center' }
  );

  // Page numbers
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    setTextColor(doc, '#4a6580');
    doc.setFontSize(6.5);
    doc.text(`Page ${i} of ${pageCount}`, PW - MR, PH - 6, { align: 'right' });
  }

  // Save
  const filename = `PSE-Compliance-Risk-Report-${
    results.inputs.employees
  }ee-${results.inputs.states}states.pdf`;
  doc.save(filename);
}
