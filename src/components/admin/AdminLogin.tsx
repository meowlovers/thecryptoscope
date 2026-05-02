"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TrendingUp, Lock, Eye, EyeOff } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/admin/dashboard");
    } else {
      setError("Wrong password");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#050a0e] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00d4aa] to-[#0ea5e9] flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-bold text-xl">
            <span className="gradient-text">TheCrypto</span>
            <span className="text-[#e8f0f7]">Scope</span>
          </span>
        </div>

        <div className="bg-[#0d1821] border border-[#1a2d3d] rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-[#00d4aa]/10 border border-[#00d4aa]/20 flex items-center justify-center">
              <Lock className="w-4 h-4 text-[#00d4aa]" />
            </div>
            <div>
              <p className="text-[#e8f0f7] font-bold">Admin Panel</p>
              <p className="text-[#475569] text-xs">Restricted access</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full bg-[#050a0e] border border-[#1a2d3d] rounded-xl px-4 py-3 text-[#e8f0f7] placeholder-[#334155] text-sm focus:outline-none focus:ring-2 focus:ring-[#00d4aa]/30 focus:border-[#00d4aa]/50 transition-all pr-10"
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#475569] hover:text-[#94a3b8]"
              >
                {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && <p className="text-red-400 text-xs">{error}</p>}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00d4aa] to-[#0ea5e9] text-white text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-40"
            >
              {loading ? "Verifying…" : "Enter"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
