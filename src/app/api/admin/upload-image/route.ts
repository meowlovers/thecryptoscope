export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase-admin";

async function isAdmin() {
  const cookieStore = await cookies();
  return cookieStore.get("admin_token")?.value === process.env.ADMIN_PASSWORD;
}

export async function POST(req: Request) {
  if (!await isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("image") as File;
  if (!file) return NextResponse.json({ error: "No image provided" }, { status: 400 });

  const ext = file.name.split(".").pop() ?? "jpg";
  const fileName = `charts/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const { error } = await supabaseAdmin.storage
    .from("analyses")
    .upload(fileName, buffer, { contentType: file.type, upsert: true });

  if (error) return NextResponse.json({ error: "Upload failed" }, { status: 500 });

  const { data } = supabaseAdmin.storage.from("analyses").getPublicUrl(fileName);
  return NextResponse.json({ url: data.publicUrl });
}
