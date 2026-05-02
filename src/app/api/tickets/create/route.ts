export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { name, email, subject, message } = await req.json();

  if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  const ticket = await prisma.ticket.create({
    data: { name: name.trim(), email: email.trim(), subject: subject.trim(), message: message.trim() },
  });

  return NextResponse.json({ ok: true, ticketId: ticket.id });
}
