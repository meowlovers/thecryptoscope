"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative bg-gradient-to-br from-[#0d1821] to-[#0a1520] border border-[#1a2d3d] rounded-3xl p-12 overflow-hidden"
        >
          {/* Glow orbs */}
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#00d4aa]/8 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[#0ea5e9]/8 rounded-full blur-[80px] pointer-events-none" />

          <div className="relative">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00d4aa]/10 border border-[#00d4aa]/20 text-[#00d4aa] text-xs font-medium mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00d4aa] animate-pulse" />
              Ready to get started?
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-[#e8f0f7] mb-4">
              Stop Guessing. Start Knowing.
            </h2>
            <p className="text-[#64748b] text-lg mb-8 max-w-xl mx-auto">
              Order a professional analysis of any crypto pair for just $5.
              Your next move deserves a solid foundation.
            </p>

            <Link
              href="/order"
              className="group inline-flex items-center gap-2 px-10 py-4 rounded-xl bg-gradient-to-r from-[#00d4aa] to-[#0ea5e9] text-white font-bold text-lg hover:opacity-90 transition-all shadow-lg hover:shadow-[0_0_40px_rgba(0,212,170,0.3)]"
            >
              Order Analysis — $5
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
