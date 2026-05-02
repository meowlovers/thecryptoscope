import Link from "next/link";
import { TrendingUp, X, Send, Globe } from "lucide-react";

const footerLinks = {
  Services: [
    { label: "Order Analysis", href: "/order" },
    { label: "Pricing", href: "/#pricing" },
    { label: "How It Works", href: "/#how-it-works" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
  ],
  Legal: [
    { label: "Terms of Service", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Disclaimer", href: "/disclaimer" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-[#1a2d3d] bg-[#050a0e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-2 group w-fit">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00d4aa] to-[#0ea5e9] flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-bold text-lg tracking-tight">
                <span className="gradient-text">TheChart</span>
                <span className="text-[#e8f0f7]">Scope</span>
              </span>
            </Link>
            <p className="text-[#00d4aa]/60 text-xs font-medium italic mb-4">
              The Sharpest View in Crypto
            </p>
            <p className="text-[#64748b] text-sm leading-relaxed max-w-xs">
              Professional cryptocurrency market analysis. No signals, no noise —
              just deep, actionable insights delivered to your inbox.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-[#0d1821] border border-[#1a2d3d] flex items-center justify-center text-[#64748b] hover:text-[#00d4aa] hover:border-[#00d4aa]/40 transition-colors"
                aria-label="X / Twitter"
              >
                <X className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-[#0d1821] border border-[#1a2d3d] flex items-center justify-center text-[#64748b] hover:text-[#00d4aa] hover:border-[#00d4aa]/40 transition-colors"
                aria-label="Telegram"
              >
                <Send className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-[#0d1821] border border-[#1a2d3d] flex items-center justify-center text-[#64748b] hover:text-[#00d4aa] hover:border-[#00d4aa]/40 transition-colors"
                aria-label="Website"
              >
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h3 className="text-[#e8f0f7] text-sm font-semibold mb-4">{group}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[#64748b] text-sm hover:text-[#00d4aa] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-[#1a2d3d] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[#64748b] text-sm">
            © {new Date().getFullYear()} TheChartScope. All rights reserved.
          </p>
          <p className="text-[#475569] text-xs text-center sm:text-right max-w-md">
            TheChartScope provides market analysis for informational purposes only.
            This is not financial advice. Always do your own research.
          </p>
        </div>
      </div>
    </footer>
  );
}
