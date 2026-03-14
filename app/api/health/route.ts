import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  try {
    // Ping Supabase REST API — checks DB reachability without needing RLS access
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/`,
      {
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
        },
        // Short timeout so we fail fast if DB is unreachable
        signal: AbortSignal.timeout(5000),
      }
    );

    if (!res.ok) throw new Error(`Supabase returned ${res.status}`);

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
