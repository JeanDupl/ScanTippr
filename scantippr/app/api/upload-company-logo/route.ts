import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const { fileName, base64, mimeType } = await request.json()
    if (!fileName || !base64) return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    const buffer = Buffer.from(base64, "base64")
    const { error } = await supabase.storage
      .from("guard-photos")
      .upload(fileName, buffer, { upsert: true, contentType: mimeType || "image/png" })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    const { data } = supabase.storage.from("guard-photos").getPublicUrl(fileName)
    return NextResponse.json({ publicUrl: data.publicUrl })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
