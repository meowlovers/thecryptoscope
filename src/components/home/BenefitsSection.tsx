"use client";

import { motion } from "framer-motion";
import {
  Brain,
  Target,
  Clock,
  Globe,
  ShieldCheck,
  Layers,
} from "lucide-react";

const benefits = [
  {
    icon: Brain,
    title: "Deep Expert Research",
    description:
      "Each report is crafted by experienced analysts who study market structure, trends, volume, and on-chain data.",
  },
  {
    icon: Target,
    title: "No Signals, Just Clarity",
    description:
      "We don't tell you what to buy or sell. We give you the full picture so you can make your own educated decisions.",
  },
  {
    icon: Clock,
    title: "Fast Turnaround",
    description:
      "Receive your detailed analysis within 24–48 hours of payment confirmation. No waiting weeks for answers.",
  },
  {
    icon: Globe,
    title: "Any Trading Pair",
    description:
      "From Bitcoin and Ethereum to obscure altcoins — if it trades, we can analyze it.",
  },
  {
    icon: ShieldCheck,
    title: "Private & Secure",
    description:
      "Your email and order details are kept strictly confidential. We never share customer data.",
  },
  {
    icon: Layers,
    title: "Combined Analysis",
    description:
      "Get technical charts, fundamental macro context, and sentiment analysis all in one comprehensive report.",
  },
];

export default function BenefitsSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050a0e] via-[#070e14] to-[#050a0e] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00d4aa]/10 border border-[#00d4aa]/20 text-[#00d4aa] text-xs font-medium mb-4"
          >
            Why TheChartScope
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold text-[#e8f0f7] mb-4"
          >
            Built for Serious Traders & Investors
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-[#64748b] text-lg max-w-xl mx-auto"
          >
            Everything you need to understand a market — none of what you don't.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group bg-[#0d1821] border border-[#1a2d3d] rounded-2xl p-6 hover:border-[#00d4aa]/30 hover:bg-[#0d1e2b] transition-all duration-300"
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#00d4aa]/15 to-[#0ea5e9]/10 border border-[#00d4aa]/15 flex items-center justify-center mb-4 group-hover:border-[#00d4aa]/30 transition-colors">
                <item.icon className="w-5 h-5 text-[#00d4aa]" />
              </div>
              <h3 className="text-[#e8f0f7] font-semibold text-base mb-2">
                {item.title}
              </h3>
              <p className="text-[#64748b] text-sm leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
