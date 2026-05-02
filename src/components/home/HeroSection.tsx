"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import FloatingCoins from "./FloatingCoins";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Floating crypto coins */}
      <FloatingCoins />

      {/* Radial gradient blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#00d4aa]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-[#0ea5e9]/5 blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-16 pb-20">
        {/* Top badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00d4aa]/10 border border-[#00d4aa]/20 text-[#00d4aa] text-sm font-medium mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#00d4aa] animate-pulse" />
          Starting at $9 · Delivered in 24–48h
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
        >
          <span className="gradient-text">The Sharpest View</span>
          <br />
          <span className="text-[#e8f0f7]">in Crypto.</span>
        </motion.h1>

        {/* One-liner */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-[#64748b] text-base sm:text-lg max-w-md mx-auto mb-10"
        >
          Expert analysis on any crypto pair — no signals, no noise.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/order"
            className="group flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#00d4aa] to-[#0ea5e9] text-white font-semibold text-base hover:opacity-90 transition-all shadow-lg hover:shadow-[0_0_32px_rgba(0,212,170,0.25)]"
          >
            Order Analysis Now
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="#how-it-works"
            className="flex items-center gap-2 px-8 py-4 rounded-xl border border-[#1a2d3d] text-[#94a3b8] font-semibold text-base hover:border-[#00d4aa]/40 hover:text-[#e8f0f7] transition-all"
          >
            How It Works
          </Link>
        </motion.div>
      </div>

      {/* Decorative bottom line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#1a2d3d] to-transparent" />
    </section>
  );
}
