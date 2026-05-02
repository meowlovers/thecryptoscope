export const dynamic = "force-dynamic";

import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: {
      balance: true,
      transactions: { orderBy: { createdAt: "desc" }, take: 20 },
      orders: { orderBy: { createdAt: "desc" }, take: 20 },
    },
  });

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  return NextResponse.json({
    balance: user.balance?.amount ?? 0,
    transactions: user.transactions,
    orders: user.orders,
  });
}
