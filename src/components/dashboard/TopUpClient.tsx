"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, ArrowLeft, Copy, Check, Clock, AlertCircle, Zap } from "lucide-react";
import Link from "next/link";

const AMOUNTS = [10, 25, 50, 100];

type Step = "select" | "pay" | "pending";

interface PaymentData {
  paymentId: string;
  payAddress: string;
  payAmount: number;
  payCurrency: string;
  expiresAt: string;
}

export default function TopUpClient() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("select");
  const [amount, setAmount] = useState<number>(25);
  const [custom, setCustom] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [payment, setPayment] = useState<PaymentData | null>(null);
  const [copied, setCopied] = useState<"address" | "amount" | null>(null);

  const finalAmount = custom ? parseFloat(custom) : amount;

  async function handleCreatePayment() {
    setError("");
    if (!finalAmount || finalAmount < 9) {
      setError("Minimum top-up is $9 USDT");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/topup/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: finalAmount }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong");
        setLoading(false);
        return;
      }
      setPayment(data);
      setStep("pay");
    } catch {
      setError("Network error — please try again");
    }
    setLoading(false);
  }

  function copy(text: string, key: "address" | "amount") {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    });
  }

  function handlePaid() {
    setStep("pending");
    let attempts = 0;
    const interval = setInterval(async () => {
      attempts++;
      if (attempts > 120) { clearInterval(interval); return; }
      try {
        const res = await fetch(`/api/topup/status?paymentId=${payment?.paymentId}`);
        const data = await res.json();
        if (data.status === "confirmed" || data.status === "finished") {
          clearInterval(interval);
          router.push("/dashboard?credited=1");
        }
      } catch { /* keep polling */ }
    }, 5000);
  }

  return (
    <div className="w-full max-w-md pt-8">
      <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-[#64748b] text-sm hover:text-[#94a3b8] transition-colors mb-8">
        <ArrowLeft className="w-4 h-4" /> Back to dashboard
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Wallet className="w-5 h-5 text-[#00d4aa]" />
          <h1 className="text-2xl font-bold text-[#e8f0f7]">Add Credits</h1>
        </div>
        <p className="text-[#64748b] text-sm">Credits are added instantly after payment confirmation.</p>
      </div>

      <AnimatePresence mode="wait">

        {step === "select" && (
          <motion.div key="select" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.2 }}>
            <div className="bg-[#0d1821] border border-[#1a2d3d] rounded-2xl p-6 space-y-6">
              <div>
                <p className="text-[#64748b] text-xs font-semibold uppercase tracking-wider mb-3">Select Amount (USDT)</p>
                <div className="grid grid-cols-4 gap-2">
                  {AMOUNTS.map((a) => (
                    <button
                      key={a}
                      onClick={() => { setAmount(a); setCustom(""); }}
                      className={`py-3 rounded-xl border text-sm font-bold transition-all ${
                        amount === a && !custom
                          ? "border-[#00d4aa]/60 bg-[#00d4aa]/10 text-[#00d4aa]"
                          : "border-[#1a2d3d] text-[#64748b] hover:border-[#00d4aa]/30 hover:text-[#e8f0f7]"
                      }`}
                    >
                      ${a}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[#64748b] text-xs font-semibold uppercase tracking-wider mb-2">Or enter custom amount</p>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#475569] text-sm font-bold">$</span>
                  <input
                    type="number"
                    min="9"
                    step="1"
                    value={custom}
                    onChange={(e) => { setCustom(e.target.value); setAmount(0); }}
                    placeholder="Enter amount..."
                    className="w-full bg-[#050a0e] border border-[#1a2d3d] rounded-xl pl-8 pr-16 py-3 text-[#e8f0f7] placeholder-[#475569] text-sm focus:outline-none focus:ring-2 focus:ring-[#00d4aa]/30 focus:border-[#00d4aa]/50 transition-all"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#475569] text-xs">USDT</span>
                </div>
              </div>

              <div className="bg-[#050a0e] rounded-xl p-4 flex items-center justify-between">
                <p className="text-[#64748b] text-sm">You will receive</p>
                <p className="text-[#00d4aa] font-bold text-lg font-mono">${finalAmount || "—"} credits</p>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" /> {error}
                </div>
              )}

              <button
                onClick={handleCreatePayment}
                disabled={loading || !finalAmount}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#00d4aa] to-[#0ea5e9] text-white font-semibold text-sm hover:opacity-90 transition-all disabled:opacity-40"
              >
                {loading ? "Creating payment…" : `Continue — Pay $${finalAmount || "—"} USDT`}
              </button>
            </div>
          </motion.div>
        )}

        {step === "pay" && payment && (
          <motion.div key="pay" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.2 }}>
            <div className="bg-[#0d1821] border border-[#1a2d3d] rounded-2xl p-6 space-y-5">
              <div className="flex items-center gap-2 text-[#00d4aa]">
                <Zap className="w-4 h-4" />
                <p className="text-sm font-semibold">Send exactly this amount to the address below</p>
              </div>

              {/* Network warning */}
              <div className="flex items-center gap-2.5 bg-yellow-400/10 border border-yellow-400/30 rounded-xl px-4 py-3">
                <AlertCircle className="w-4 h-4 text-yellow-400 shrink-0" />
                <p className="text-yellow-400 text-xs font-semibold">
                  Only send <span className="underline">USDT on BEP20 (BNB Smart Chain)</span>. Sending on any other network will result in permanent loss of funds.
                </p>
              </div>

              <div className="bg-[#050a0e] rounded-xl p-4">
                <p className="text-[#64748b] text-xs mb-1.5">Amount to send — <span className="text-red-400 font-semibold">send the exact amount, not less</span></p>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[#e8f0f7] font-bold text-xl font-mono">
                    {payment.payAmount} <span className="text-[#64748b] text-sm font-normal">{payment.payCurrency.toUpperCase()}</span>
                  </p>
                  <button
                    onClick={() => copy(String(payment.payAmount), "amount")}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#1a2d3d] text-xs text-[#64748b] hover:text-[#00d4aa] hover:border-[#00d4aa]/30 transition-colors"
                  >
                    {copied === "amount" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copied === "amount" ? "Copied!" : "Copy"}
                  </button>
                </div>
                <p className="text-[#475569] text-xs mt-2">Sending less than this amount will result in the payment not being confirmed.</p>
              </div>

              <div className="bg-[#050a0e] rounded-xl p-4">
                <p className="text-[#64748b] text-xs mb-1.5">Send to this address</p>
                <div className="flex items-start justify-between gap-3">
                  <code className="text-[#94a3b8] text-xs font-mono break-all leading-relaxed flex-1">
                    {payment.payAddress}
                  </code>
                  <button
                    onClick={() => copy(payment.payAddress, "address")}
                    className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#1a2d3d] text-xs text-[#64748b] hover:text-[#00d4aa] hover:border-[#00d4aa]/30 transition-colors"
                  >
                    {copied === "address" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copied === "address" ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>

              <p className="text-[#475569] text-xs flex items-start gap-1.5">
                <AlertCircle className="w-3 h-3 shrink-0 mt-0.5" />
                Send the exact amount shown. Credits are added automatically once the blockchain confirms your payment (usually 1–5 minutes).
              </p>

              <button
                onClick={handlePaid}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#00d4aa] to-[#0ea5e9] text-white font-semibold text-sm hover:opacity-90 transition-all"
              >
                I&apos;ve Sent the Payment
              </button>

              <button
                onClick={() => setStep("select")}
                className="w-full py-2 text-[#64748b] text-sm hover:text-[#94a3b8] transition-colors"
              >
                ← Go back
              </button>
            </div>
          </motion.div>
        )}

        {step === "pending" && (
          <motion.div key="pending" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
            <div className="bg-[#0d1821] border border-[#1a2d3d] rounded-2xl p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full border-4 border-[#00d4aa]/30 border-t-[#00d4aa] animate-spin mx-auto" />
              <div>
                <p className="text-[#e8f0f7] font-bold text-lg mb-1">Waiting for confirmation…</p>
                <p className="text-[#64748b] text-sm">We&apos;re monitoring the blockchain. This page will update automatically once your payment is confirmed.</p>
              </div>
              <div className="flex items-center justify-center gap-2 text-yellow-400 text-xs">
                <Clock className="w-3.5 h-3.5" />
                Usually takes 1–5 minutes
              </div>
              <Link href="/dashboard" className="block text-[#475569] text-sm hover:text-[#64748b] transition-colors pt-2">
                Go to dashboard (we&apos;ll credit you automatically)
              </Link>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
