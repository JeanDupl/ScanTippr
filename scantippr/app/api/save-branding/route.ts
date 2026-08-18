import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Server-side client using the service role key — bypasses RLS so this route can update any company's row
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { companyId, brand_primary, brand_light, sidebar_mode } = await request.json();

    if (!companyId) {
      return NextResponse.json({ error: 'companyId is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('companies')
      .update({
        brand_primary,
        brand_light,
        sidebar_mode,
      })
      .eq('id', companyId)
      .select()
      .single();

    if (error) {
      console.error('Supabase update error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error('save-branding route error:', err);
    return NextResponse.json({ error: 'Failed to save branding' }, { status: 500 });
  }
}