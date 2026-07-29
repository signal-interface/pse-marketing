import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, source, estimatorInputs, estimatorTotal } = body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    // Log lead — replace with CRM/email provider integration
    // when available (ConvertKit, HubSpot, etc.)
    console.log('[lead-capture]', {
      email,
      source,
      estimatorInputs,
      estimatorTotal,
      timestamp: new Date().toISOString(),
    });

    // TODO Sprint 3b: Wire to email provider for PDF delivery
    // TODO Sprint 3b: Wire to CRM for lead routing

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
