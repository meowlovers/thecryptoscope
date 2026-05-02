import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DashboardClient from "@/components/dashboard/DashboardClient";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses[0]?.emailAddress ?? "";

  // Upsert user in our DB on every dashboard visit
  const user = await prisma.user.upsert({
    where: { clerkId: userId },
    update: { email },
    create: {
      clerkId: userId,
      email,
      balance: { create: { amount: 0 } },
    },
    include: {
      balance: true,
      transactions: { orderBy: { createdAt: "desc" }, take: 20 },
      orders: {
        orderBy: { createdAt: "desc" },
        take: 20,
        select: {
          id: true, pair: true, analysisType: true,
          status: true, amountPaid: true, createdAt: true,
          pdfUrl: true, analysisId: true, deliveredAt: true,
        }
      },
    },
  });

  // Serialize Date objects → strings so they can be passed to client components
  const orders = user.orders.map((o) => ({
    ...o,
    createdAt: o.createdAt.toISOString(),
    deliveredAt: o.deliveredAt ? o.deliveredAt.toISOString() : null,
  }));

  const transactions = user.transactions.map((t) => ({
    ...t,
    createdAt: t.createdAt.toISOString(),
  }));

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-16 pb-20">
        <DashboardClient
          balance={user.balance?.amount ?? 0}
          transactions={transactions}
          orders={orders}
          email={email}
        />
      </main>
      <Footer />
    </>
  );
}
