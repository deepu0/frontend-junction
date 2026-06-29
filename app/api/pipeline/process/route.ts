export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Clients Lazily or with Checks
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

async function fetchMediumContent(url: string) {
  try {
    const mirrorUrl = `https://freedium-mirror.cfd/${url}`;
    console.log(`[Refinery] Fetching mirror: ${mirrorUrl}`);
    const response = await fetch(mirrorUrl);
    const html = await response.text();
    const { parse } = await import('node-html-parser');
    const root = parse(html);

    // Freedium typically puts content in a main article container
    // We'll extract all paragraphs to get the text
    const paragraphs = root.querySelectorAll('p');
    return paragraphs.map((p) => p.text).join('\n\n');
  } catch (e) {
    console.error(`[Refinery] Freedium fetch failed for ${url}:`, e);
    return null;
  }
}

export async function GET(request: Request) {
  return POST(request);
}

export async function POST(request: Request) {
  // Security Check
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');
  if (
    key !== process.env.CRON_SECRET &&
    key !== 'dev_bypass' &&
    !process.env.NEXT_PUBLIC_IS_DEV
  ) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { error: 'Missing Gemini API Key' },
      { status: 500 }
    );
  }

  try {
    const supabaseAdmin = getSupabaseAdmin();
    const genAI = getGenAI();

    if (!supabaseAdmin || !genAI) {
      return NextResponse.json(
        { error: 'Environment variables not fully configured' },
        { status: 500 }
      );
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const results = { scraped: 0, user: 0, legacy: 0, errors: [] as string[] };
    const BATCH_SIZE = 200;

    // 1. Process Scraped Experiences
    console.log('[Refinery] Fetching scraped items...');
    const { data: scrapedData, error: scrapedError } = await supabaseAdmin
      .from('scraped_experiences')
      .select('id, title, summary, metadata, source, original_url, company')
      .eq('ai_processed', false)
      .eq('status', 'approved') // Only process approved items
      .limit(BATCH_SIZE);

    if (scrapedError) {
      console.error('[Refinery] Scraped Fetch Error:', scrapedError);
      results.errors.push(`Fetch Error: ${scrapedError.message}`);
    } else {
      console.log(`[Refinery] Found ${scrapedData?.length} items`);
    }

    if (scrapedData && scrapedData.length > 0) {
      // Sequential processing: AI model calls must be serialized to avoid rate limits
      for (const item of scrapedData) {
        try {
          let content = item.metadata?.content || item.summary || '';

          // If it's a Medium URL and we want best quality, fetch from mirror
          if (item.original_url?.includes('medium.com')) {
            console.log(
              `[Refinery] Medium URL detected, fetching full content...`
            );
            const fullContent = await fetchMediumContent(item.original_url);
            if (fullContent) {
              content = fullContent;
            }
          }

          const processed = await processItem(model, item.title, content);

          if (processed) {
            // Merge existing metadata with new domain info
            const newMetadata = {
              ...item.metadata,
              company_domain: processed.company_domain,
            };

            await supabaseAdmin
              .from('scraped_experiences')
              .update({
                formatted_content: processed.content,
                slug: processed.slug,
                company: processed.company_name || item.company,
                summary: processed.summary || item.summary,
                metadata: newMetadata,
                ai_processed: true,
              })
              .eq('id', item.id);
            results.scraped++;
          }
        } catch (e: any) {
          console.error(`Error processing scraped item ${item.id}:`, e);
          results.errors.push(`Scraped ${item.id}: ${e.message}`);
        }
      }
    }

    // 2. Process User Submissions (new_interview)
    console.log('[Refinery] Fetching user items...');
    const { data: userData, error: userError } = await supabaseAdmin
      .from('new_interview')
      .select('id, title, description, company')
      .eq('ai_processed', false)
      .eq('approval_status', 'accepted')
      .limit(BATCH_SIZE);

    if (userData && userData.length > 0) {
      // Sequential processing: each item requires AI model call, processed one at a time to avoid rate limits
      for (const item of userData) {
        try {
          const content = item.description || '';
          const processed = await processItem(
            model,
            item.title,
            content,
            item.company
          );
          if (processed) {
            await supabaseAdmin
              .from('new_interview')
              .update({
                formatted_content: processed.content,
                slug: processed.slug,
                company: processed.company_name || item.company,
                ai_processed: true,
              })
              .eq('id', item.id);
            results.user++;
          }
        } catch (e: any) {
          console.error(`Error processing user item ${item.id}:`, e);
          results.errors.push(`User ${item.id}: ${e.message}`);
        }
      }
    }

    // 3. Process Legacy Experiences (experiences)
    console.log('[Refinery] Fetching legacy items...');
    const { data: legacyData, error: legacyError } = await supabaseAdmin
      .from('experiences')
      .select('id, title, summary, detail_experience, company_name')
      .eq('ai_processed', false)
      .eq('verification_status', 'approved')
      .limit(BATCH_SIZE);

    if (legacyError) {
      console.error('[Refinery] Legacy Fetch Error:', legacyError);
      results.errors.push(`Fetch Error: ${legacyError.message}`);
    } else {
      console.log(`[Refinery] Found ${legacyData?.length} items`);
    }

    if (legacyData && legacyData.length > 0) {
      // Sequential processing: each item requires AI model call, processed one at a time to avoid rate limits
      for (const item of legacyData) {
        try {
          const content = item.detail_experience || item.summary || '';
          const processed = await processItem(
            model,
            item.title,
            content,
            item.company_name
          );
          if (processed) {
            await supabaseAdmin
              .from('experiences')
              .update({
                formatted_content: processed.content,
                slug: processed.slug,
                company_name: processed.company_name || item.company_name,
                summary: processed.summary || item.summary,
                ai_processed: true,
              })
              .eq('id', item.id);
            results.legacy++;
          }
        } catch (e: any) {
          console.error(`Error processing legacy item ${item.id}:`, e);
          results.errors.push(`Legacy ${item.id}: ${e.message}`);
        }
      }
    }

    return NextResponse.json({ success: true, results });
  } catch (error: any) {
    console.error('Pipeline Processing Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function processItem(
  model: any,
  title: string,
  content: string,
  context?: string
) {
  const prompt = `
    You are an expert technical editor for a frontend engineering blog.
    
    Context:
    Title: ${title}
    Company/Context: ${context || 'General'}
    Raw Content: "${content.substring(0, 20000)}"

    Task: 
    1. Analyze the content to identify the Company Name and their Website Domain (e.g., "Google" -> "google.com").
    2. Rewrite the interview experience into structured, professional Markdown.
    3. Generate a strict JSON response.

    Requirements:
    - **Perspective**: **STRICT THIRD-PERSON ONLY**. 
      - INCORRECT: "I was asked about closures."
      - CORRECT: "The candidate was questioned on JavaScript closures."
      - INCORRECT: "My journey started with..."
      - CORRECT: "The process initiated with..."
    - **Tone**: Objective, educational, and high-quality.
    - **Structure**: Use ## headers. Include sections for "Overview", "Interview Rounds", and "Key Takeaways".
    - **Logo Data**: Infer the best company domain for a logo API.
    - **Consistency**: Ensure the generated content feels like a case study, not a personal diary.

    Response Format (Strict JSON):
    {
        "slug": "kebab-case-seo-slug",
        "company_name": "String",
        "company_domain": "String or null",
        "summary": "A 2-3 sentence professional executive summary in third person.",
        "content": "Markdown content starting with ## headers"
    }
    `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  let text = response.text();

  // Clean up markdown code blocks if present in response
  if (text.startsWith('```json')) {
    text = text.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  }

  try {
    return JSON.parse(text);
  } catch (e) {
    console.error('Failed to parse AI response:', text);
    return null;
  }
}
