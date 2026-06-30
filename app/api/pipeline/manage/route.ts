import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const getSupabaseAdmin = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
};

export async function POST(request: Request) {
  const supabase = getSupabaseAdmin();
  const genAI = process.env.GEMINI_API_KEY
    ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    : null;
  if (!supabase || !genAI)
    return NextResponse.json({ error: 'Missing config' }, { status: 500 });

  const { id, action } = await request.json();
  if (!id || !action)
    return NextResponse.json(
      { error: 'id and action required' },
      { status: 400 }
    );

  // action: 'process' | 'approve' | 'reject' | 'publish'
  if (action === 'approve') {
    await supabase
      .from('captured_content')
      .update({ status: 'approved' })
      .eq('id', id);
    return NextResponse.json({ success: true, message: 'Approved' });
  }

  if (action === 'reject') {
    await supabase
      .from('captured_content')
      .update({ status: 'rejected' })
      .eq('id', id);
    return NextResponse.json({ success: true, message: 'Rejected' });
  }

  if (action === 'publish') {
    await supabase
      .from('captured_content')
      .update({ status: 'published', published_at: new Date().toISOString() })
      .eq('id', id);
    return NextResponse.json({ success: true, message: 'Published' });
  }

  if (action === 'process') {
    const { data: item, error } = await supabase
      .from('captured_content')
      .select('*')
      .eq('id', id)
      .single();
    if (error || !item)
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });

    await supabase
      .from('captured_content')
      .update({ status: 'processing' })
      .eq('id', id);

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const content = item.raw_content || '';
    const prompt = `You are a senior technical editor for Frontend Junction, a frontend engineering interview blog.

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

2. If score >= 7, rewrite as a polished third-person case study in Markdown:
   - STRICT THIRD PERSON ("The candidate was asked..." never "I was asked...")
   - Preserve ALL factual details. Do NOT invent anything.
   - Use these REQUIRED sections:

     ## Overview
     Brief intro: company, role, total rounds, outcome (if known).

     ## Role & Compensation Details
     - **Position**: role title
     - **Location**: city / remote
     - **Experience Required**: if mentioned
     - **CTC / Stipend**: if mentioned
     - **Outcome**: Selected / Rejected / Pending

     ## Interview Process Summary
     Bullet list of all rounds with type and duration if available.

     ## Round-by-Round Breakdown
     One ### sub-section per round:
     - Round name & type (e.g., ### Round 1 — DSA Coding)
     - Difficulty tag: \`Easy\` / \`Medium\` / \`Hard\`
     - Numbered list of questions asked (verbatim if possible)
     - What the interviewer focused on
     - Tips for this specific round

     ## Key Technical Topics Covered
     Categorised bullets: JavaScript/TypeScript, React/Framework, CSS/Layout, System Design, DSA, Behavioral.

     ## Preparation Tips
     3-5 concrete, actionable tips from this experience.

     ## Verdict
     Outcome, overall difficulty (1–5), and whether the candidate recommends the role/company.

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
  "content": "full markdown starting from ## Overview (empty string if score < 7)",
  "rounds": [{"name": "string", "type": "coding|machine-coding|system-design|conceptual|behavioral|hr", "difficulty": "easy|medium|hard"}],
  "topics": ["react", "javascript", ...],
  "questions": [{"question": "string", "type": "machine-coding|dsa|system-design|conceptual|behavioral", "difficulty": "easy|medium|hard", "topics": ["string"]}]
}`;

    try {
      const result = await model.generateContent(prompt);
      const { parseAIJson } = await import('@/lib/parse-ai-json');
      const parsed = parseAIJson(result.response.text());

      const now = new Date().toISOString();
      let status: string;
      // If item was already published, keep it published regardless of score re-evaluation
      if (item.status === 'published') status = 'published';
      else if (parsed.score >= 8) status = 'published';
      else if (parsed.score >= 7) status = 'review';
      else status = 'rejected';

      // Preserve existing slug for already-published items to avoid breaking URLs
      const slug =
        item.status === 'published' && item.slug ? item.slug : parsed.slug;

      await supabase
        .from('captured_content')
        .update({
          ai_processed: true,
          status,
          quality_score: parsed.score,
          processed_content: parsed.content || null,
          slug,
          company: parsed.company_name,
          role: parsed.role,
          level: parsed.level,
          outcome: parsed.outcome,
          rounds: parsed.rounds || [],
          topics: parsed.topics || [],
          summary: parsed.summary,
          processed_at: now,
          ...(status === 'published' && !item.published_at
            ? { published_at: now }
            : {}),
        })
        .eq('id', id);

      // Insert questions
      if (parsed.questions?.length && parsed.company_name) {
        for (const q of parsed.questions) {
          const normalized = q.question.toLowerCase().trim();
          const { data: existing } = await supabase
            .from('question_bank')
            .select('id, frequency, source_experience_ids')
            .eq('company', parsed.company_name)
            .eq('question', normalized)
            .limit(1);

          if (existing?.length) {
            const ids = Array.from(
              new Set([...(existing[0].source_experience_ids || []), id])
            );
            await supabase
              .from('question_bank')
              .update({
                frequency: existing[0].frequency + 1,
                source_experience_ids: ids,
                last_seen_at: now,
              })
              .eq('id', existing[0].id);
          } else {
            await supabase.from('question_bank').insert({
              company: parsed.company_name,
              question: normalized,
              type: q.type,
              difficulty: q.difficulty,
              topics: q.topics || [],
              frequency: 1,
              source_experience_ids: [id],
            });
          }
        }
      }

      return NextResponse.json({
        success: true,
        score: parsed.score,
        status,
        company: parsed.company_name,
        slug: parsed.slug,
      });
    } catch (e: any) {
      await supabase
        .from('captured_content')
        .update({ status: 'queued' })
        .eq('id', id);
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
  }

  return NextResponse.json(
    { error: 'Invalid action. Use: process, approve, reject, publish' },
    { status: 400 }
  );
}
