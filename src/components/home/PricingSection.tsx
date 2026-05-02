"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";

const plans = [
  {
    name: "Technical",
    price: 9,
    description: "Chart-focused deep dive",
    features: [
      "Multi-timeframe chart analysis",
      "Key support & resistance levels",
      "Trend direction & momentum",
      "Volume profile & market structure",
      "Delivered in 24–48 hours",
    ],
    highlight: false,
  },
  {
    name: "Combined",
    price: 15,
    description: "The complete picture",
    features: [
      "Full technical analysis",
      "Full fundamental analysis",
      "Sentiment & on-chain highlights",
      "Macro context & outlook",
      "Specific questions answered",
      "Delivered in 24–48 hours",
    ],
    highlight: true,
  },
  {
    name: "Fundamental",
    price: 9,
    description: "Project & macro analysis",
    features: [
      "Tokenomics & project overview",
      "Fundamental context & macro",
      "Adoption & on-chain metrics",
      "Risk assessment",
      "Delivered in 24–48 hours",
    ],
    highlight: false,
  },
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
            Pay Only for What You Need.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-[#64748b] text-lg max-w-xl mx-auto"
          >
            No subscriptions. No hidden fees. One report, one payment.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative"
            >
              {plan.highlight && (
                <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-[#00d4aa]/40 to-[#0ea5e9]/20 blur-sm" />
              )}
              <div className={`relative bg-[#0d1821] border rounded-2xl p-6 overflow-hidden h-full flex flex-col ${
                plan.highlight ? "border-[#00d4aa]/40" : "border-[#1a2d3d]"
              }`}>
                {plan.highlight && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00d4aa] to-[#0ea5e9]" />
                )}

                {plan.highlight && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00d4aa]/10 border border-[#00d4aa]/20 text-[#00d4aa] text-xs font-medium mb-4 w-fit">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00d4aa]" />
                    Most Popular
                  </div>
                )}

                <p className="text-[#e8f0f7] font-bold text-lg mb-1">{plan.name}</p>
                <p className="text-[#475569] text-xs mb-4">{plan.description}</p>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-[#e8f0f7]">${plan.price}</span>
                  <span className="text-[#64748b] text-sm ml-2">per report</span>
                </div>

                <ul className="space-y-2.5 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-[#00d4aa]/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5 text-[#00d4aa]" />
                      </div>
                      <span className="text-[#94a3b8] text-sm">{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/order"
                  className={`group flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm transition-all ${
                    plan.highlight
                      ? "bg-gradient-to-r from-[#00d4aa] to-[#0ea5e9] text-white hover:opacity-90 shadow-lg"
                      : "border border-[#1a2d3d] text-[#64748b] hover:border-[#00d4aa]/40 hover:text-[#00d4aa] hover:bg-[#00d4aa]/5"
                  }`}
                >
                  Order Now — ${plan.price}
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <p className="text-[#475569] text-xs text-center mt-8">
          Accepts USDT · BTC · ETH · and more
        </p>
      </div>
    </section>
  );
}
