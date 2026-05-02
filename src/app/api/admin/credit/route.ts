export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

async function isAdmin() {
  const cookieStore = await cookies();
  return cookieStore.get("admin_token")?.value === process.env.ADMIN_PASSWORD;
}

export async function POST(req: Request) {
  if (!await isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { email, amount } = await req.json();
  if (!email || !amount || amount <= 0) {
    return NextResponse.json({ error: "Invalid fields" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  // Add balance + create a transaction record
  await prisma.$transaction([
    prisma.balance.upsert({
      where: { userId: user.id },
      update: { amount: { increment: amount } },
      create: { userId: user.id, amount },
    }),
    prisma.transaction.create({
      data: {
        userId: user.id,
        type: "TOPUP",
        amount,
        status: "CONFIRMED",
        note: "Manual credit by admin",
      },
    }),
  ]);

  return NextResponse.json({ ok: true });
}
