import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const experienceSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  companyName: z.string().min(2, 'Company name is required'),
  role: z.string().min(2, 'Role is required'),
  experience: z
    .string()
    .min(50, 'Experience detail must be at least 50 characters'),
  tags: z.array(z.string()).optional(),
  original_link: z.string().url().optional().or(z.literal('')),
  outcome: z.string().optional(),
  difficulty: z.string().optional(),
});

export async function POST(request: Request) {
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

  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const result = experienceSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation Error', details: result.error.errors },
        { status: 400 }
      );
    }

    const {
      title,
      companyName,
      role,
      experience,
      tags,
      original_link,
      outcome,
      difficulty,
    } = result.data;

    // Check if company exists, if not create it (or handle logical linking)
    // For now simplistic approach:

    // First, find or create company
    let companyId;
    const { data: companyData, error: companyError } = await supabase
      .from('companies')
      .select('id')
      .ilike('company_name', companyName)
      .single();

    if (companyData) {
      companyId = companyData.id;
    } else {
      // Create new company
      const { data: newCompany, error: createError } = await supabase
        .from('companies')
        .insert({ company_name: companyName })
        .select('id')
        .single();

      if (createError) throw createError;
      companyId = newCompany.id;
    }

    const { data: insertData, error: insertError } = await supabase
      .from('experiences')
      .insert({
        title,
        company_name: companyName,
        company_id: companyId,
        role,
        detail_experience: experience,
        tags: tags || [],
        user_id: user.id,
        verification_status: 'pending', // Always pending initially
        original_link,
        status: outcome,
        // storing difficulty in metadata or specific column if exists, assuming metadata for now if column missing
        // or just append to description? The table didn't have difficulty column in audit list.
        // Audit listed: title, role, original_link, summary, status, detail_experience, company_id, location, user_id, company_name, verification_status.
        // No difficulty column. I will put it in summary or detail_experience prefix.
        metadata: { difficulty },
      })
      .select()
      .single();

    if (insertError) {
      console.error('Insert Error:', insertError);
      throw insertError;
    }

    return NextResponse.json({ success: true, data: insertData });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: error.message },
      { status: 500 }
    );
  }
}
