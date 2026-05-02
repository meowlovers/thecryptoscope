export const dynamic = "force-dynamic";

import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { amount } = await req.json();
  if (!amount || amount < 10) {
    return NextResponse.json({ error: "Minimum top-up is $10 USDT" }, { status: 400 });
  }

  // Find user in DB
  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  // Create NOWPayments payment
  const npRes = await fetch("https://api.nowpayments.io/v1/payment", {
    method: "POST",
    headers: {
      "x-api-key": process.env.NOWPAYMENTS_API_KEY!,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      price_amount: amount,
      price_currency: "usd",
      pay_currency: "usdtbsc",           // USDT on BEP20 (BSC)
      ipn_callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/topup/webhook`,
      order_id: user.id,                // our internal user id
      order_description: `TheChartScope credit top-up — ${amount} USDT`,
    }),
  });

  if (!npRes.ok) {
    const err = await npRes.text();
    console.error("NOWPayments error:", err);
    return NextResponse.json({ error: "Payment provider error" }, { status: 502 });
  }

  const payment = await npRes.json();

  // Create a pending transaction in DB
  await prisma.transaction.create({
    data: {
      userId: user.id,
      type: "TOPUP",
      amount,
      status: "PENDING",
      paymentId: String(payment.payment_id),
      note: `Top-up via NOWPayments`,
    },
  });

  return NextResponse.json({
    paymentId: payment.payment_id,
    payAddress: payment.pay_address,
    payAmount: payment.pay_amount,
    payCurrency: payment.pay_currency,
    expiresAt: payment.expiration_estimate_date,
  });
}
