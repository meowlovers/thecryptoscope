import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

async function isAdmin() {
  const cookieStore = await cookies();
  return cookieStore.get("admin_token")?.value === process.env.ADMIN_PASSWORD;
}

export async function GET() {
  if (!await isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const orders = await prisma.order.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      pair: true,
      analysisType: true,
      email: true,
      notes: true,
      amountPaid: true,
      createdAt: true,
      status: true,
    },
  });

  // Group by pair
  const grouped: Record<string, typeof orders> = {};
  for (const order of orders) {
    if (!grouped[order.pair]) grouped[order.pair] = [];
    grouped[order.pair].push(order);
  }

  return NextResponse.json({ grouped, total: orders.length });
}
