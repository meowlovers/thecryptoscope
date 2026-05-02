export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

function isAdmin() {
  const jar = cookies();
  return (jar as any).get("admin_session")?.value === process.env.ADMIN_SECRET;
}

// GET — list all tickets
export async function GET() {
  if (!isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const tickets = await prisma.ticket.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(tickets);
}

// PATCH — update ticket status
export async function PATCH(req: Request) {
  if (!isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, status } = await req.json();
  if (!id || !status) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const ticket = await prisma.ticket.update({
    where: { id },
    data: { status },
  });
  return NextResponse.json(ticket);
}
