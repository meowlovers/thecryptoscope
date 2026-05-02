import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import OrderForm from "@/components/order/OrderForm";
import { ShieldCheck, Clock, BarChart2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Order Analysis — TheChartScope",
  description:
    "Request a professional technical or fundamental analysis of any cryptocurrency trading pair. From $9, delivered in 24–48 hours.",
};

interface PageProps {
  searchParams: Promise<{ pair?: string }>;
}

export default async function OrderPage({ searchParams }: PageProps) {
  const { pair } = await searchParams;
  const prefilledPair = pair ? decodeURIComponent(pair).toUpperCase() : "";

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-16 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00d4aa]/10 border border-[#00d4aa]/20 text-[#00d4aa] text-xs font-medium mb-4">
              Quick & Easy
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#e8f0f7] mb-4">
              {prefilledPair
                ? <>Order <span className="gradient-text">{prefilledPair}</span> Analysis</>
                : "Order Your Analysis"}
            </h1>
            <p className="text-[#64748b] text-base max-w-xl mx-auto">
              Fill in the details below, pay from $9 in crypto, and receive a
              comprehensive market analysis report in your inbox within 24–48 hours.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <div className="bg-[#0d1821] border border-[#1a2d3d] rounded-2xl p-6 sm:p-8">
                <OrderForm prefilledPair={prefilledPair} />
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Trust signals */}
              <div className="bg-[#0d1821] border border-[#1a2d3d] rounded-2xl p-5">
                <p className="text-[#e8f0f7] font-semibold text-sm mb-4">
                  Why trust TheChartScope?
                </p>
                <div className="space-y-4">
                  {[
                    {
                      icon: ShieldCheck,
                      title: "Verified Analysts",
                      text: "Every report is produced by experienced crypto market analysts.",
                    },
                    {
                      icon: Clock,
                      title: "24–48h Delivery",
                      text: "We commit to fast turnaround without sacrificing depth.",
                    },
                    {
                      icon: BarChart2,
                      title: "Professional Quality",
                      text: "Institutional-grade analysis — multi-timeframe, multi-factor.",
                    },
                  ].map(({ icon: Icon, title, text }) => (
                    <div key={title} className="flex gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#00d4aa]/10 border border-[#00d4aa]/20 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-[#00d4aa]" />
                      </div>
                      <div>
                        <p className="text-[#e8f0f7] text-xs font-semibold">{title}</p>
                        <p className="text-[#64748b] text-xs mt-0.5 leading-relaxed">{text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* What you get */}
              <div className="bg-[#0d1821] border border-[#1a2d3d] rounded-2xl p-5">
                <p className="text-[#e8f0f7] font-semibold text-sm mb-3">
                  What&apos;s included
                </p>
                <ul className="space-y-2">
                  {[
                    "Multi-timeframe chart analysis",
                    "Support & resistance mapping",
                    "Trend & momentum overview",
                    "Volume & market structure",
                    "Fundamental context",
                    "Sentiment snapshot",
                    "Answers to your questions",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-xs text-[#64748b]">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#00d4aa]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Disclaimer */}
              <div className="bg-[#0d1821] border border-[#1a2d3d] rounded-xl p-4">
                <p className="text-[#475569] text-xs leading-relaxed">
                  <strong className="text-[#64748b]">Disclaimer:</strong> TheChartScope
                  provides educational market analysis only. This is not financial
                  advice. Always do your own research before making investment decisions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
