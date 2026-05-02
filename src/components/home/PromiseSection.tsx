"use client";

import { motion } from "framer-motion";
import { FileText, Clock, MessageSquare, RefreshCw, ShieldCheck, Eye } from "lucide-react";

const promises = [
  {
    icon: FileText,
    title: "Every report is written by a human",
    body: "No AI-generated filler. Each analysis is researched and written manually by a crypto market analyst.",
  },
  {
    icon: Eye,
    title: "No signals, no hype",
    body: "We don't tell you to buy or sell. We give you a clear, unbiased view of the market so you can decide for yourself.",
  },
  {
    icon: Clock,
    title: "Delivered in 24–48 hours",
    body: "We commit to a fast turnaround. If we can't meet the window, you'll be notified immediately.",
  },
  {
    icon: MessageSquare,
    title: "Your questions get answered",
    body: "Have a specific concern about the pair? Include it in your order and it will be addressed in the report.",
  },
  {
    icon: RefreshCw,
    title: "Not happy? We'll make it right",
    body: "If the analysis doesn't meet the scope you requested, reach out and we'll revise it — no hassle.",
  },
  {
    icon: ShieldCheck,
    title: "No financial advice, ever",
    body: "Our reports are educational. We're transparent about that upfront — no misleading claims about returns.",
  },
];

export default function PromiseSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00d4aa]/10 border border-[#00d4aa]/20 text-[#00d4aa] text-xs font-medium mb-4">
            Our Promise
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#e8f0f7] mb-3">
            What We Stand Behind
          </h2>
          <p className="text-[#64748b] text-sm max-w-xl mx-auto">
            We&apos;re a small, focused service. Here&apos;s exactly what you can expect — no fluff.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {promises.map(({ icon: Icon, title, body }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="bg-[#0d1821] border border-[#1a2d3d] rounded-2xl p-5 flex gap-4"
            >
              <div className="w-9 h-9 rounded-xl bg-[#00d4aa]/10 border border-[#00d4aa]/20 flex items-center justify-center shrink-0 mt-0.5">
                <Icon className="w-4 h-4 text-[#00d4aa]" />
              </div>
              <div>
                <p className="text-[#e8f0f7] text-sm font-semibold mb-1">{title}</p>
                <p className="text-[#64748b] text-xs leading-relaxed">{body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
