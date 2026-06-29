import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, x-capture-key',
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

const getSupabaseAdmin = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
};

function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function isValidUrl(str: string): boolean {
  try { const u = new URL(str); return u.protocol === 'http:' || u.protocol === 'https:'; } catch { return false; }
}

export async function POST(request: Request) {
  const captureKey = request.headers.get('x-capture-key');
  if (captureKey !== (process.env.CAPTURE_SECRET || 'fj-capture-2026')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders });
  }

  try {
    const body = await request.json();
    const { url, title, content, source } = body;

    if (!url || !content) return NextResponse.json({ error: 'url and content required' }, { status: 400, headers: corsHeaders });
    if (!isValidUrl(url)) return NextResponse.json({ error: 'Invalid URL' }, { status: 400, headers: corsHeaders });

    const cleanContent = stripHtml(content);
    if (cleanContent.length < 200) return NextResponse.json({ error: 'Content too short (min 200 chars)' }, { status: 400, headers: corsHeaders });

    const supabase = getSupabaseAdmin();
    if (!supabase) return NextResponse.json({ error: 'DB not configured' }, { status: 500, headers: corsHeaders });

    const { error } = await supabase
      .from('captured_content')
      .upsert({
        title: (title || 'Untitled').substring(0, 500),
        original_url: url,
        raw_content: cleanContent.substring(0, 50000),
        source: source || 'extension',
        status: 'queued',
        ai_processed: false,
      }, { onConflict: 'original_url', ignoreDuplicates: true });

    if (error) {
      if (error.code === '23505') return NextResponse.json({ success: true, message: 'Already captured' }, { headers: corsHeaders });
      return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
    }

    return NextResponse.json({ success: true, message: 'Captured! Will be processed soon.' }, { headers: corsHeaders });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Invalid request' }, { status: 400, headers: corsHeaders });
  }
}
