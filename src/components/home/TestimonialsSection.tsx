"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Alex K.",
    role: "Crypto Trader, 4 years",
    content:
      "Incredibly thorough. The BTCUSDT analysis I received covered every angle — structure, levels, macro context. Worth every dollar and more.",
    rating: 5,
    pair: "BTCUSDT",
  },
  {
    name: "Maria S.",
    role: "DeFi Investor",
    content:
      "I was skeptical at first, but the quality blew me away. The ETH fundamental analysis gave me clarity I couldn't find anywhere else at this price.",
    rating: 5,
    pair: "ETHUSDT",
  },
  {
    name: "Daniel R.",
    role: "Portfolio Manager",
    content:
      "Clean, well-structured, and detailed. The combined analysis for SOL was exactly what I needed before making a major position decision.",
    rating: 5,
    pair: "SOLUSDT",
  },
  {
    name: "Priya M.",
    role: "Independent Trader",
    content:
      "Fast delivery, professional tone, no fluff. The analysis covered multiple timeframes and explained the reasoning behind each observation.",
    rating: 5,
    pair: "BNBUSDT",
  },
  {
    name: "James T.",
    role: "Crypto Enthusiast",
    content:
      "I've bought analysis services for $50+ and gotten less than this. At $9, TheChartScope is an absolute steal. Already ordered three times.",
    rating: 5,
    pair: "ADAUSDT",
  },
  {
    name: "Chen W.",
    role: "Swing Trader",
    content:
      "The on-chain and sentiment section was eye-opening. I use this to build my own thesis, not to copy trades. TheChartScope perfectly supports that.",
    rating: 5,
    pair: "DOTUSDT",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#050a0e] via-[#060b10] to-[#050a0e] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00d4aa]/10 border border-[#00d4aa]/20 text-[#00d4aa] text-xs font-medium mb-4"
          >
            Testimonials
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold text-[#e8f0f7] mb-4"
          >
            What Our Clients Say
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-[#64748b] text-lg max-w-xl mx-auto"
          >
            Hundreds of traders trust TheChartScope for their market research.
          </motion.p>
        </div>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="break-inside-avoid bg-[#0d1821] border border-[#1a2d3d] rounded-2xl p-6 hover:border-[#00d4aa]/20 transition-colors"
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, s) => (
                  <Star key={s} className="w-4 h-4 fill-[#00d4aa] text-[#00d4aa]" />
                ))}
              </div>

              <p className="text-[#94a3b8] text-sm leading-relaxed mb-5">&ldquo;{t.content}&rdquo;</p>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#e8f0f7] text-sm font-semibold">{t.name}</p>
                  <p className="text-[#64748b] text-xs">{t.role}</p>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-[#0ea5e9]/10 text-[#0ea5e9] text-xs font-mono border border-[#0ea5e9]/15">
                  {t.pair}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
