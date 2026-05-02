export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createHmac } from "crypto";
import { prisma } from "@/lib/prisma";

// NOWPayments sends a POST with HMAC-SHA512 signature in the header
export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-nowpayments-sig");

  // Verify signature
  const secret = process.env.NOWPAYMENTS_IPN_SECRET!;
  const hmac = createHmac("sha512", secret)
    .update(
      // NOWPayments signs the body sorted by keys
      JSON.stringify(JSON.parse(rawBody), Object.keys(JSON.parse(rawBody)).sort())
    )
    .digest("hex");

  if (hmac !== signature) {
    console.warn("NOWPayments webhook: invalid signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const data = JSON.parse(rawBody);
  const { payment_id, payment_status, price_amount, order_id: userId } = data;

  // Only act on confirmed/finished payments
  if (!["finished", "confirmed"].includes(payment_status)) {
    return NextResponse.json({ ok: true });
  }

  // Find the pending transaction
  const tx = await prisma.transaction.findFirst({
    where: { paymentId: String(payment_id), status: "PENDING" },
  });

  if (!tx) return NextResponse.json({ ok: true }); // already processed or not found

  // Mark transaction confirmed + add to balance atomically
  await prisma.$transaction([
    prisma.transaction.update({
      where: { id: tx.id },
      data: { status: "CONFIRMED" },
    }),
    prisma.balance.upsert({
      where: { userId },
      update: { amount: { increment: price_amount } },
      create: { userId, amount: price_amount },
    }),
  ]);

  console.log(`✅ Credited $${price_amount} to user ${userId}`);
  return NextResponse.json({ ok: true });
}
