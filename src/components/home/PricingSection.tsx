"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";

const features = [
  "Technical chart analysis (multi-timeframe)",
  "Key support & resistance levels",
  "Trend direction & momentum assessment",
  "Volume profile & market structure",
  "Fundamental context & macro overview",
  "Sentiment & on-chain highlights",
  "Specific questions answered (optional)",
  "Delivered in 24–48 hours",
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0ea5e9]/10 border border-[#0ea5e9]/20 text-[#0ea5e9] text-xs font-medium mb-4"
          >
            Simple Pricing
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold text-[#e8f0f7] mb-4"
          >
            One Price. Full Analysis.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-[#64748b] text-lg max-w-xl mx-auto"
          >
            No subscriptions. No tiers. Pay only for what you need.
          </motion.p>
        </div>

        <div className="flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative w-full max-w-md"
          >
            {/* Glow ring */}
            <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-[#00d4aa]/40 to-[#0ea5e9]/20 blur-sm" />

            <div className="relative bg-[#0d1821] border border-[#1a2d3d] rounded-2xl p-8 overflow-hidden">
              {/* Top accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00d4aa] to-[#0ea5e9]" />

              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00d4aa]/10 border border-[#00d4aa]/20 text-[#00d4aa] text-xs font-medium mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00d4aa]" />
                Most Popular
              </div>

              {/* Price */}
              <div className="mb-2">
                <span className="text-5xl font-bold text-[#e8f0f7]">$5</span>
                <span className="text-[#64748b] text-base ml-2">per analysis</span>
              </div>
              <p className="text-[#64748b] text-sm mb-8">
                Full report for any trading pair. Pay once, receive once.
              </p>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#00d4aa]/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-[#00d4aa]" />
                    </div>
                    <span className="text-[#94a3b8] text-sm">{f}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href="/order"
                className="group flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-gradient-to-r from-[#00d4aa] to-[#0ea5e9] text-white font-semibold text-base hover:opacity-90 transition-all shadow-lg hover:shadow-[0_0_32px_rgba(0,212,170,0.25)]"
              >
                Order Now — $5
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <p className="text-[#475569] text-xs text-center mt-4">
                Accepts USDT · BTC · ETH · and more
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
