"use client";

import { motion } from "framer-motion";
import { ListChecks, CreditCard, Mail, BarChart3 } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: ListChecks,
    title: "Choose Your Pair",
    description:
      "Select any cryptocurrency trading pair you want analyzed — BTCUSDT, ETHUSDT, SOLUSDT, or any altcoin on the market.",
  },
  {
    step: "02",
    icon: CreditCard,
    title: "Pay Securely in Crypto",
    description:
      "Pay from $9 in USDT, BTC, ETH, or other supported cryptocurrencies. Fast, borderless, and fully secure.",
  },
  {
    step: "03",
    icon: BarChart3,
    title: "We Analyze",
    description:
      "Our analysts perform deep technical and fundamental research, studying charts, on-chain data, market structure, and key indicators.",
  },
  {
    step: "04",
    icon: Mail,
    title: "Receive Your Report",
    description:
      "A comprehensive analysis report lands in your inbox within 24–48 hours, ready to inform your next move.",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0ea5e9]/10 border border-[#0ea5e9]/20 text-[#0ea5e9] text-xs font-medium mb-4"
          >
            Simple Process
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold text-[#e8f0f7] mb-4"
          >
            How TheChartScope Works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-[#64748b] text-lg max-w-xl mx-auto"
          >
            From order to inbox in four simple steps. Professional analysis, zero hassle.
          </motion.p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative group"
            >
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[calc(100%-0px)] w-full h-px bg-gradient-to-r from-[#1a2d3d] to-transparent z-0" />
              )}

              <div className="relative z-10 bg-[#0d1821] border border-[#1a2d3d] rounded-2xl p-6 h-full group-hover:border-[#00d4aa]/30 transition-colors">
                {/* Step number */}
                <span className="text-[#00d4aa]/30 text-5xl font-bold absolute top-4 right-5 select-none">
                  {item.step}
                </span>

                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00d4aa]/20 to-[#0ea5e9]/10 border border-[#00d4aa]/20 flex items-center justify-center mb-4">
                  <item.icon className="w-5 h-5 text-[#00d4aa]" />
                </div>

                <h3 className="text-[#e8f0f7] font-semibold text-base mb-2">
                  {item.title}
                </h3>
                <p className="text-[#64748b] text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
