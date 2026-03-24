import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  try {
    // Ping Supabase health endpoint — no API key required, not affected by anon key restrictions
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/health`,
      {
        signal: AbortSignal.timeout(5000),
      }
    );

    if (res.status >= 500) throw new Error(`Supabase returned ${res.status}`);

    return NextResponse.json(
      { status: 'ok', db: 'connected', ts: new Date().toISOString() },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { status: 'error', message: 'Database unreachable' },
      { status: 503 }
    );
  }
}
