"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, X, TrendingUp, LayoutDashboard } from "lucide-react";
import { useUser, UserButton } from "@/lib/clerk-safe";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { isSignedIn } = useUser();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-[#050a0e]/95 backdrop-blur-md border-b border-[#1a2d3d]"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00d4aa] to-[#0ea5e9] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <TrendingUp className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-lg tracking-tight">
              <span className="gradient-text">TheCrypto</span>
              <span className="text-[#e8f0f7]">Scope</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "text-[#00d4aa] bg-[#00d4aa]/10"
                    : "text-[#94a3b8] hover:text-[#e8f0f7] hover:bg-[#0d1821]"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {isSignedIn ? (
              <>
                <Link
                  href="/dashboard"
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    pathname.startsWith("/dashboard")
                      ? "text-[#00d4aa] bg-[#00d4aa]/10"
                      : "text-[#94a3b8] hover:text-[#e8f0f7] hover:bg-[#0d1821]"
                  )}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <UserButton appearance={{ elements: { avatarBox: "w-8 h-8" } }} />
              </>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-[#94a3b8] hover:text-[#e8f0f7] hover:bg-[#0d1821] transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/order"
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#00d4aa] to-[#0ea5e9] text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg"
                >
                  Order Analysis
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-[#94a3b8] hover:text-[#e8f0f7] hover:bg-[#0d1821] transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-[#050a0e]/98 backdrop-blur-md border-b border-[#1a2d3d]">
          <div className="px-4 pt-2 pb-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "text-[#00d4aa] bg-[#00d4aa]/10"
                    : "text-[#94a3b8] hover:text-[#e8f0f7] hover:bg-[#0d1821]"
                )}
              >
                {link.label}
              </Link>
            ))}
            {isSignedIn && (
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-[#94a3b8] hover:text-[#e8f0f7] hover:bg-[#0d1821] transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
            )}
            <div className="pt-2 space-y-2">
              {!isSignedIn && (
                <Link
                  href="/sign-in"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center px-5 py-2.5 rounded-lg border border-[#1a2d3d] text-[#94a3b8] text-sm font-semibold hover:text-[#e8f0f7] hover:bg-[#0d1821] transition-all"
                >
                  Sign In
                </Link>
              )}
              <Link
                href="/order"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#00d4aa] to-[#0ea5e9] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Order Analysis
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
