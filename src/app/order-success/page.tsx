import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CheckCircle, Clock, Mail, ArrowRight, BarChart2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Order Confirmed — TheChartScope",
  description: "Your analysis order has been confirmed. Expect delivery within 24–48 hours.",
};

interface PageProps {
  searchParams: Promise<{ pair?: string; email?: string; type?: string }>;
}

export default async function OrderSuccessPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const pair = params.pair ?? "BTCUSDT";
  const email = params.email ?? "your email";
  const type = params.type ?? "combined";
  const typeLabel =
    type === "technical"
      ? "Technical Analysis"
      : type === "fundamental"
      ? "Fundamental Analysis"
      : "Combined Analysis";

  const orderId = `EC-${Date.now().toString(36).toUpperCase().slice(-6)}`;

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-16 pb-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          {/* Success icon */}
          <div className="relative inline-flex mb-8">
            <div className="absolute inset-0 rounded-full bg-[#00d4aa]/20 blur-xl" />
            <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-[#00d4aa]/20 to-[#0ea5e9]/10 border border-[#00d4aa]/30 flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-[#00d4aa]" />
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-[#e8f0f7] mb-3">
            Order Confirmed!
          </h1>
          <p className="text-[#64748b] text-base mb-10 max-w-md mx-auto">
            Payment received. Our analysts are on it. Your report will arrive at{" "}
            <strong className="text-[#e8f0f7]">{decodeURIComponent(email)}</strong>{" "}
            within 24–48 hours.
          </p>

          {/* Order details card */}
          <div className="bg-[#0d1821] border border-[#1a2d3d] rounded-2xl p-6 mb-6 text-left">
            <div className="flex items-center justify-between mb-6">
              <p className="text-[#64748b] text-xs font-semibold uppercase tracking-wider">
                Order Details
              </p>
              <span className="text-[#00d4aa] text-xs font-mono bg-[#00d4aa]/10 px-2.5 py-1 rounded-lg border border-[#00d4aa]/20">
                {orderId}
              </span>
            </div>

            <div className="space-y-4">
              {[
                { icon: BarChart2, label: "Trading Pair", value: decodeURIComponent(pair), mono: true },
                { icon: CheckCircle, label: "Analysis Type", value: typeLabel, mono: false },
                { icon: Mail, label: "Delivery Email", value: decodeURIComponent(email), mono: false },
                { icon: Clock, label: "Expected Delivery", value: "Within 24–48 hours", mono: false },
              ].map(({ icon: Icon, label, value, mono }) => (
                <div key={label} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#00d4aa]/10 border border-[#00d4aa]/15 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-[#00d4aa]" />
                  </div>
                  <div>
                    <p className="text-[#64748b] text-xs">{label}</p>
                    <p className={`text-[#e8f0f7] text-sm font-semibold mt-0.5 ${mono ? "font-mono" : ""}`}>
                      {value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* What happens next */}
          <div className="bg-[#0d1821] border border-[#1a2d3d] rounded-2xl p-6 mb-8 text-left">
            <p className="text-[#e8f0f7] font-semibold text-sm mb-4">What happens next?</p>
            <div className="space-y-4">
              {[
                {
                  step: "1",
                  title: "Payment Verification",
                  description: "We verify your transaction on the blockchain (usually within minutes).",
                },
                {
                  step: "2",
                  title: "Analysis Begins",
                  description: `Our team starts the ${typeLabel.toLowerCase()} of ${decodeURIComponent(pair)} immediately.`,
                },
                {
                  step: "3",
                  title: "Report Delivered",
                  description: "A detailed, professional PDF report lands in your inbox within 24–48 hours.",
                },
              ].map(({ step, title, description }) => (
                <div key={step} className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#00d4aa] to-[#0ea5e9] flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
                    {step}
                  </div>
                  <div>
                    <p className="text-[#e8f0f7] text-sm font-semibold">{title}</p>
                    <p className="text-[#64748b] text-xs mt-0.5 leading-relaxed">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/order"
              className="group flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#00d4aa] to-[#0ea5e9] text-white font-semibold text-sm hover:opacity-90 transition-all shadow-lg"
            >
              Order Another Analysis
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/"
              className="flex items-center justify-center px-6 py-3 rounded-xl border border-[#1a2d3d] text-[#94a3b8] font-semibold text-sm hover:bg-[#0d1821] hover:text-[#e8f0f7] transition-all"
            >
              Back to Home
            </Link>
          </div>

          <p className="text-[#475569] text-xs mt-6">
            Questions? Contact us at{" "}
            <Link href="/contact" className="text-[#00d4aa] hover:underline">
              support@thechartscope.com
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
