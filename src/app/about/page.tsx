import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { TrendingUp, Target, Eye, Users, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us — TheChartScope",
  description:
    "Learn about TheChartScope's team, methodology, and mission to deliver institutional-grade crypto analysis to everyone.",
};

const values = [
  {
    icon: Target,
    title: "Precision Over Noise",
    description:
      "We cut through the noise of crypto Twitter and YouTube hype. Every word in our reports is there for a reason.",
  },
  {
    icon: Eye,
    title: "Transparency",
    description:
      "We show our reasoning. You'll understand not just what we found, but why it matters for your specific pair.",
  },
  {
    icon: Users,
    title: "Trader-First",
    description:
      "Our team are active traders themselves. We write analysis the way we'd want to receive it — practical and direct.",
  },
  {
    icon: TrendingUp,
    title: "Continuous Improvement",
    description:
      "Markets evolve. Our methodology evolves too. We constantly refine our analysis framework to stay ahead.",
  },
];

const methodology = [
  {
    phase: "Technical Analysis",
    items: [
      "Multi-timeframe chart review (15m → Weekly)",
      "Trend structure & market phases (Wyckoff, Elliott)",
      "Key support & resistance zones",
      "Volume profile analysis",
      "Momentum indicators (RSI, MACD, Stochastic)",
      "Moving average confluence",
    ],
  },
  {
    phase: "Fundamental Analysis",
    items: [
      "Project fundamentals & use case assessment",
      "Tokenomics & supply dynamics",
      "On-chain metrics (active addresses, transaction volume)",
      "Developer activity & GitHub commits",
      "Ecosystem partnerships & adoption",
      "Macroeconomic crypto context",
    ],
  },
  {
    phase: "Sentiment & Context",
    items: [
      "Market-wide sentiment indicators",
      "Fear & Greed index context",
      "Social media sentiment snapshot",
      "Derivatives market data (funding rates, OI)",
      "Whale wallet tracking (where available)",
      "Upcoming catalysts & risk events",
    ],
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-16 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00d4aa]/10 border border-[#00d4aa]/20 text-[#00d4aa] text-xs font-medium mb-4">
              Our Story
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#e8f0f7] mb-6">
              Analysis You Can Actually Trust
            </h1>
            <p className="text-[#64748b] text-lg max-w-2xl mx-auto leading-relaxed">
              TheChartScope was founded by a group of professional traders and analysts
              frustrated by the sea of low-quality, signal-pumping services in the
              crypto space. We believe serious market participants deserve serious
              research — at an accessible price.
            </p>
          </div>

          {/* Mission */}
          <div className="relative bg-gradient-to-br from-[#0d1821] to-[#0a1520] border border-[#1a2d3d] rounded-2xl p-8 sm:p-10 mb-16 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00d4aa] to-[#0ea5e9]" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#00d4aa]/5 rounded-full blur-[80px] pointer-events-none" />
            <div className="relative">
              <p className="text-[#00d4aa] text-xs font-semibold uppercase tracking-wider mb-3">Our Mission</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#e8f0f7] mb-4">
                Democratize Professional Crypto Research
              </h2>
              <p className="text-[#64748b] text-base leading-relaxed max-w-2xl">
                Institutional-grade research has historically been reserved for hedge funds
                and high-net-worth investors. TheChartScope changes that. From just $9, any
                trader — from beginner to professional — can access the same depth of
                analysis that institutional desks use to make decisions.
              </p>
            </div>
          </div>

          {/* Values */}
          <div className="mb-20">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#e8f0f7]">Our Core Values</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {values.map((v) => (
                <div
                  key={v.title}
                  className="bg-[#0d1821] border border-[#1a2d3d] rounded-2xl p-6 hover:border-[#00d4aa]/20 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#00d4aa]/10 border border-[#00d4aa]/20 flex items-center justify-center mb-4">
                    <v.icon className="w-5 h-5 text-[#00d4aa]" />
                  </div>
                  <h3 className="text-[#e8f0f7] font-semibold text-base mb-2">{v.title}</h3>
                  <p className="text-[#64748b] text-sm leading-relaxed">{v.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Methodology */}
          <div className="mb-20">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0ea5e9]/10 border border-[#0ea5e9]/20 text-[#0ea5e9] text-xs font-medium mb-3">
                Our Process
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#e8f0f7]">
                How We Build Every Report
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {methodology.map((section, i) => (
                <div
                  key={section.phase}
                  className="bg-[#0d1821] border border-[#1a2d3d] rounded-2xl p-6"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-6 h-6 rounded-full bg-gradient-to-br from-[#00d4aa] to-[#0ea5e9] text-white text-xs font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <h3 className="text-[#e8f0f7] font-semibold text-sm">{section.phase}</h3>
                  </div>
                  <ul className="space-y-2">
                    {section.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-xs text-[#64748b]">
                        <div className="w-1 h-1 rounded-full bg-[#00d4aa] flex-shrink-0 mt-1.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Team */}
          <div className="mb-16">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#e8f0f7]">The Team</h2>
              <p className="text-[#64748b] mt-2 max-w-lg mx-auto">
                TheChartScope is a small, focused team of professional traders and analysts
                operating across multiple time zones.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                {
                  initials: "AK",
                  name: "Alex K.",
                  role: "Lead Technical Analyst",
                  bio: "8+ years in crypto markets. Former quant at a European prop trading firm. Specializes in BTC, ETH, and macro cycles.",
                },
                {
                  initials: "SR",
                  name: "Sofia R.",
                  role: "Fundamental & On-Chain Analyst",
                  bio: "Background in DeFi protocol analysis and blockchain data science. Previously contributed to multiple on-chain research platforms.",
                },
                {
                  initials: "JL",
                  name: "James L.",
                  role: "Altcoin Specialist",
                  bio: "5 years covering mid-cap and small-cap altcoins. Deep expertise in tokenomics modeling and ecosystem growth analysis.",
                },
              ].map((member) => (
                <div
                  key={member.name}
                  className="bg-[#0d1821] border border-[#1a2d3d] rounded-2xl p-6 hover:border-[#00d4aa]/20 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00d4aa]/20 to-[#0ea5e9]/10 border border-[#00d4aa]/20 flex items-center justify-center text-[#00d4aa] font-bold text-base mb-4">
                    {member.initials}
                  </div>
                  <p className="text-[#e8f0f7] font-semibold text-sm">{member.name}</p>
                  <p className="text-[#0ea5e9] text-xs mb-2">{member.role}</p>
                  <p className="text-[#64748b] text-xs leading-relaxed">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link
              href="/order"
              className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#00d4aa] to-[#0ea5e9] text-white font-semibold hover:opacity-90 transition-all shadow-lg"
            >
              Order Your Analysis
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
