import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AdminDashboard from "@/components/admin/AdminDashboard";

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (token !== process.env.ADMIN_PASSWORD) redirect("/admin");

  // Fetch all pending orders
  const orders = await prisma.order.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      pair: true,
      analysisType: true,
      email: true,
      notes: true,
      amountPaid: true,
      createdAt: true,
    },
  });

  // Group by pair
  const grouped: Record<string, typeof orders> = {};
  for (const order of orders) {
    if (!grouped[order.pair]) grouped[order.pair] = [];
    grouped[order.pair].push(order);
  }

  // Recent delivered orders
  const delivered = await prisma.order.findMany({
    where: { status: "DELIVERED" },
    orderBy: { deliveredAt: "desc" },
    take: 20,
    select: {
      id: true,
      pair: true,
      email: true,
      pdfUrl: true,
      deliveredAt: true,
      amountPaid: true,
    },
  });

  // Support tickets
  const tickets = await prisma.ticket.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <AdminDashboard grouped={grouped} delivered={delivered} totalPending={orders.length} tickets={tickets} />;
}
