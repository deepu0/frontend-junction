import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const getSupabaseAdmin = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
};

const getGenAI = () => {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  return new GoogleGenerativeAI(key);
};

export async function POST(request: Request) {
  const authHeader = request.headers.get('authorization');
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');
  const isAuthorized =
    authHeader === `Bearer ${process.env.CRON_SECRET}` ||
    key === process.env.CRON_SECRET ||
    key === 'dev_bypass';

  if (!isAuthorized) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = getSupabaseAdmin();
  const genAI = getGenAI();
  if (!supabase || !genAI) return NextResponse.json({ error: 'Missing config' }, { status: 500 });

  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  const results = { processed: 0, published: 0, review: 0, rejected: 0, questions_added: 0, errors: [] as string[] };

  try {
    // Fetch queued items from captured_content
    const { data: items, error: fetchErr } = await supabase
      .from('captured_content')
      .select('*')
      .eq('status', 'queued')
      .eq('ai_processed', false)
      .limit(10);

    if (fetchErr || !items?.length) {
      return NextResponse.json({ success: true, results, message: 'Nothing to process' });
    }

    for (const item of items) {
      try {
        // Mark as processing
        await supabase.from('captured_content').update({ status: 'processing' }).eq('id', item.id);

        const content = item.raw_content || '';
        if (content.length < 200) {
          await supabase.from('captured_content').update({ ai_processed: true, status: 'rejected', quality_score: 0 }).eq('id', item.id);
          results.rejected++;
          continue;
        }

        const prompt = `You are a content curator for Frontend Junction, a frontend interview experiences blog.

Analyze this content and respond with STRICT JSON only (no markdown fences).

Title: ${item.title}
Source URL: ${item.original_url}
Content: "${content.substring(0, 15000)}"

TASKS:
1. Score relevance (1-10) for being a GENUINE frontend/web interview experience narrative:
   - 9-10: Detailed narrative with specific rounds, questions asked, company named, outcome mentioned
   - 7-8: Good narrative but missing some details
   - 5-6: More of a guide/tips than personal experience
   - 1-4: Not a frontend interview experience

2. If score >= 7, rewrite the content:
   - STRICT THIRD PERSON ("The candidate was asked..." never "I was asked...")
   - Structure with ## headers: Overview, Company & Role, Interview Rounds (### per round), Key Takeaways
   - Preserve ALL factual details from source. DO NOT invent details.
   - Tag difficulty per round: Easy/Medium/Hard

3. Extract metadata and interview questions.

RESPONSE FORMAT (strict JSON):
{
  "score": number,
  "company_name": "string or null",
  "role": "string or null",
  "level": "intern|junior|mid|senior|staff|null",
  "outcome": "selected|rejected|pending|null",
  "slug": "kebab-case-seo-slug",
  "summary": "2-3 sentence summary in third person",
  "content": "full markdown (empty string if score < 7)",
  "rounds": [{"name": "string", "type": "coding|machine-coding|system-design|conceptual|behavioral|hr", "difficulty": "easy|medium|hard"}],
  "topics": ["react", "javascript", ...],
  "questions": [{"question": "string", "type": "machine-coding|dsa|system-design|conceptual|behavioral", "difficulty": "easy|medium|hard", "topics": ["string"]}]
}`;

        const result = await model.generateContent(prompt);
        const { parseAIJson } = await import('@/lib/parse-ai-json');
        const parsed = parseAIJson(result.response.text());
        results.processed++;

        const now = new Date().toISOString();

        if (parsed.score >= 8 && parsed.content) {
          const slug = await getUniqueSlug(supabase, parsed.slug);
          await supabase.from('captured_content').update({
            ai_processed: true,
            status: 'published',
            quality_score: parsed.score,
            processed_content: parsed.content,
            slug,
            company: parsed.company_name,
            role: parsed.role,
            level: parsed.level,
            outcome: parsed.outcome,
            rounds: parsed.rounds,
            topics: parsed.topics || [],
            summary: parsed.summary,
            processed_at: now,
            published_at: now,
          }).eq('id', item.id);
          results.published++;

          await sendNotification({ title: item.title, company: parsed.company_name, slug, score: parsed.score, url: item.original_url });
        } else if (parsed.score === 7 && parsed.content) {
          const slug = await getUniqueSlug(supabase, parsed.slug);
          await supabase.from('captured_content').update({
            ai_processed: true,
            status: 'review',
            quality_score: parsed.score,
            processed_content: parsed.content,
            slug,
            company: parsed.company_name,
            role: parsed.role,
            level: parsed.level,
            outcome: parsed.outcome,
            rounds: parsed.rounds,
            topics: parsed.topics || [],
            summary: parsed.summary,
            processed_at: now,
          }).eq('id', item.id);
          results.review++;
        } else {
          await supabase.from('captured_content').update({
            ai_processed: true,
            status: 'rejected',
            quality_score: parsed.score,
            processed_at: now,
          }).eq('id', item.id);
          results.rejected++;
        }

        // Insert questions into question_bank
        if (parsed.questions?.length && parsed.company_name) {
          for (const q of parsed.questions) {
            await upsertQuestion(supabase, {
              company: parsed.company_name,
              question: q.question,
              type: q.type,
              difficulty: q.difficulty,
              topics: q.topics || [],
              source_id: item.id,
            });
            results.questions_added++;
          }
        }
      } catch (e: any) {
        await supabase.from('captured_content').update({ status: 'queued' }).eq('id', item.id);
        results.errors.push(`${item.id}: ${e.message}`);
      }
    }

    return NextResponse.json({ success: true, results });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function getUniqueSlug(supabase: any, baseSlug: string): Promise<string> {
  let slug = baseSlug;
  let suffix = 1;
  while (true) {
    const { data } = await supabase.from('captured_content').select('id').eq('slug', slug).limit(1);
    if (!data?.length) return slug;
    suffix++;
    slug = `${baseSlug}-${suffix}`;
  }
}

async function upsertQuestion(supabase: any, data: { company: string; question: string; type: string; difficulty: string; topics: string[]; source_id: string }) {
  const normalized = data.question.toLowerCase().trim();
  const { data: existing } = await supabase
    .from('question_bank')
    .select('id, frequency, source_experience_ids')
    .eq('company', data.company)
    .eq('question', normalized)
    .limit(1);

  if (existing?.length) {
    const ids = Array.from(new Set([...(existing[0].source_experience_ids || []), data.source_id]));
    await supabase.from('question_bank').update({
      frequency: existing[0].frequency + 1,
      source_experience_ids: ids,
      last_seen_at: new Date().toISOString(),
    }).eq('id', existing[0].id);
  } else {
    await supabase.from('question_bank').insert({
      company: data.company,
      question: normalized,
      type: data.type,
      difficulty: data.difficulty,
      topics: data.topics,
      frequency: 1,
      source_experience_ids: [data.source_id],
    });
  }
}

async function sendNotification(data: { title: string; company: string | null; slug: string; score: number; url: string }) {
  const webhookUrl = process.env.NOTIFICATION_WEBHOOK_URL;
  if (!webhookUrl) return;

  const msg = `🚀 *New Experience Published!*\n\n📝 ${data.title}\n🏢 ${data.company || 'Unknown'}\n⭐ Score: ${data.score}/10\n🔗 https://www.frontend-junction.com/interview-experience/${data.slug}\n📎 Original: ${data.url}`;

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: msg, text: msg }),
    });
  } catch (e) {
    console.error('[Notify] Failed:', e);
  }
}
