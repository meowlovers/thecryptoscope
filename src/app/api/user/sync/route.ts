export const dynamic = "force-dynamic";

import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Called after sign-in to ensure user exists in our DB
export async function POST() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const clerkUser = await currentUser();
  if (!clerkUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const email = clerkUser.emailAddresses[0]?.emailAddress ?? "";

  // Upsert user
  const user = await prisma.user.upsert({
    where: { clerkId: userId },
    update: { email },
    create: {
      clerkId: userId,
      email,
      balance: { create: { amount: 0 } },
    },
    include: { balance: true },
  });

  return NextResponse.json({ user });
}
