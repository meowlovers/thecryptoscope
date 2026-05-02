import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminLogin from "@/components/admin/AdminLogin";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (token === process.env.ADMIN_PASSWORD) redirect("/admin/dashboard");

  return <AdminLogin />;
}
