import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { parse } from 'node-html-parser';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    // Security: Require active session to prevent quota abuse
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // 1. Fetch the URL content
    const response = await fetch(url);
    const html = await response.text();

    // 2. Simple parsing to get readable text
    const root = parse(html);

    // Remove script and style tags to reduce noise
    root
      .querySelectorAll('script, style, nav, footer, header')
      .forEach((el: any) => el.remove());

    // Get text content and clean it up
    const rawText = root.textContent || '';
    const cleanText = rawText.replace(/\s+/g, ' ').trim().slice(0, 10000); // Limit to 10k chars for prompt safety

    if (cleanText.length < 100) {
      return NextResponse.json(
        { error: 'Could not extract enough content from the URL' },
        { status: 400 }
      );
    }

    // 3. Call Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
      You are a professional tech career expert. I will provide you with the text content extracted from an interview experience blog post/page. 
      Please extract and summarize the experience into a clear, structured summary of 2-3 paragraphs. 
      
      Focus on:
      - Interview rounds and what they covered
      - Key technical topics or specific questions mentioned
      - Any final advice or takeaways mentioned by the candidate
      
      The summary should be professional, insightful, and directly helpful for other frontend developers.
      
      CONTENT:
      ${cleanText}
    `;

    const result = await model.generateContent(prompt);
    const summary = result.response.text();

    return NextResponse.json({ summary });
  } catch (error: any) {
    console.error('Summarization Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
