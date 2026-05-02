import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TopUpClient from "@/components/dashboard/TopUpClient";

export default async function TopUpPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-16 pb-20 flex items-start justify-center px-4">
        <TopUpClient />
      </main>
      <Footer />
    </>
  );
}
