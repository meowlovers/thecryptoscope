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

  const { pair, orderIds, sections } = await req.json();

  if (!pair || !orderIds?.length || !sections?.length) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Create the analysis record
  const analysis = await prisma.analysis.create({
    data: { pair, sections },
  });

  // Get all user IDs for these orders (to create notifications)
  const orders = await prisma.order.findMany({
    where: { id: { in: orderIds } },
    select: { id: true, userId: true, pair: true, analysisType: true },
  });

  // Mark all orders as delivered and link the analysis
  await prisma.order.updateMany({
    where: { id: { in: orderIds } },
    data: {
      status: "DELIVERED",
      analysisId: analysis.id,
      deliveredAt: new Date(),
    },
  });

  // Create a notification for each affected user
  await prisma.notification.createMany({
    data: orders.map((o) => ({
      userId: o.userId,
      title: `Your ${o.pair} analysis is ready`,
      message: `Your ${o.analysisType} analysis for ${o.pair} has been delivered. View it in your dashboard.`,
      link: "/dashboard",
    })),
  });

  return NextResponse.json({ ok: true, analysisId: analysis.id, delivered: orderIds.length });
}
