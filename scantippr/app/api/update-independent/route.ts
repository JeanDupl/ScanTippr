import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const body = await request.json()
    const { guardId, first_name, last_name, job_title, phone, email, photo_url } = body
    if (!guardId) return NextResponse.json({ error: "guardId is required" }, { status: 400 })
    const { error } = await supabase
      .from("guards")
      .update({
        first_name: first_name?.trim(),
        last_name: last_name?.trim(),
        job_title: job_title?.trim() || null,
        phone: phone?.trim() || null,
        email: email?.trim() || null,
        photo_url: photo_url || null,
      })
      .eq("id", guardId)
      .is("company_id", null)
    if (error) return NextResponse.json({ error: "Failed to update" }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
