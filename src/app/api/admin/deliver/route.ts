import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

async function isAdmin() {
  const cookieStore = await cookies();
  return cookieStore.get("admin_token")?.value === process.env.ADMIN_PASSWORD;
}

export async function POST(req: Request) {
  if (!await isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("pdf") as File;
  const pair = formData.get("pair") as string;
  const orderIds = JSON.parse(formData.get("orderIds") as string) as string[];

  if (!file || !pair || !orderIds?.length) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Upload PDF to Supabase Storage
  const fileName = `${pair}-${Date.now()}.pdf`;
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const { error: uploadError } = await supabaseAdmin.storage
    .from("analyses")
    .upload(fileName, buffer, { contentType: "application/pdf", upsert: true });

  if (uploadError) {
    console.error("Upload error:", uploadError);
    return NextResponse.json({ error: "PDF upload failed" }, { status: 500 });
  }

  // Get public URL
  const { data: urlData } = supabaseAdmin.storage
    .from("analyses")
    .getPublicUrl(fileName);

  const pdfUrl = urlData.publicUrl;

  // Mark all orders as delivered
  await prisma.order.updateMany({
    where: { id: { in: orderIds } },
    data: {
      status: "DELIVERED",
      pdfUrl,
      deliveredAt: new Date(),
    },
  });

  return NextResponse.json({ ok: true, pdfUrl, delivered: orderIds.length });
}
