export const dynamic = "force-dynamic";

import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const PRICES: Record<string, number> = {
  technical:    9,
  fundamental:  9,
  combined:    15,
};

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { pair, analysisType, email, notes } = await req.json();

  if (!pair || !analysisType || !email) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const price = PRICES[analysisType];
  if (!price) return NextResponse.json({ error: "Invalid analysis type" }, { status: 400 });

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { balance: true },
  });

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const currentBalance = user.balance?.amount ?? 0;
  if (currentBalance < price) {
    return NextResponse.json({ error: "Insufficient balance", required: price, balance: currentBalance }, { status: 402 });
  }

  // Deduct balance + create order + create transaction atomically
  const [, , order] = await prisma.$transaction([
    prisma.balance.update({
      where: { userId: user.id },
      data: { amount: { decrement: price } },
    }),
    prisma.transaction.create({
      data: {
        userId: user.id,
        type: "PURCHASE",
        amount: price,
        status: "CONFIRMED",
        note: `${pair} ${analysisType} analysis`,
      },
    }),
    prisma.order.create({
      data: {
        userId: user.id,
        pair,
        analysisType,
        email,
        notes: notes ?? null,
        status: "PENDING",
        amountPaid: price,
      },
    }),
  ]);

  return NextResponse.json({ orderId: order.id, amountPaid: price });
}
