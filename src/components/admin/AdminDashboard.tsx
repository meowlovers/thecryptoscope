"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp, Upload, Send, CheckCircle, Clock,
  FileText, LogOut, ChevronDown, ChevronUp, AlertCircle
} from "lucide-react";

interface Order {
  id: string;
  pair: string;
  analysisType: string;
  email: string;
  notes: string | null;
  amountPaid: number;
  createdAt: Date;
}

interface DeliveredOrder {
  id: string;
  pair: string;
  email: string;
  pdfUrl: string | null;
  deliveredAt: Date | null;
  amountPaid: number;
}

interface Props {
  grouped: Record<string, Order[]>;
  delivered: DeliveredOrder[];
  totalPending: number;
}

function formatDate(d: Date) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

function PairCard({ pair, orders }: { pair: string; orders: Order[] }) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleDeliver() {
    if (!file) { setError("Please select a PDF first"); return; }
    setError("");
    setLoading(true);

    const formData = new FormData();
    formData.append("pdf", file);
    formData.append("pair", pair);
    formData.append("orderIds", JSON.stringify(orders.map((o) => o.id)));

    const res = await fetch("/api/admin/deliver", { method: "POST", body: formData });
    const data = await res.json();

    if (res.ok) {
      setSuccess(true);
      setTimeout(() => router.refresh(), 1500);
    } else {
      setError(data.error ?? "Something went wrong");
    }
    setLoading(false);
  }

  if (success) {
    return (
      <div className="bg-emerald-400/5 border border-emerald-400/20 rounded-2xl p-5 flex items-center gap-3">
        <CheckCircle className="w-6 h-6 text-emerald-400" />
        <div>
          <p className="text-emerald-400 font-semibold">{pair} — Delivered!</p>
          <p className="text-[#64748b] text-xs">PDF sent to {orders.length} customer{orders.length > 1 ? "s" : ""}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0d1821] border border-[#1a2d3d] rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#00d4aa]/10 border border-[#00d4aa]/20 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-[#00d4aa]" />
          </div>
          <div>
            <p className="text-[#e8f0f7] font-bold">{pair}</p>
            <p className="text-[#475569] text-xs">{orders.length} pending order{orders.length > 1 ? "s" : ""}</p>
          </div>
        </div>
        <button onClick={() => setExpanded(!expanded)} className="text-[#475569] hover:text-[#94a3b8] transition-colors">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Order list */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-t border-[#1a2d3d] divide-y divide-[#1a2d3d]">
              {orders.map((order) => (
                <div key={order.id} className="px-5 py-3 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[#e8f0f7] text-sm font-medium">{order.email}</p>
                    <p className="text-[#475569] text-xs capitalize">{order.analysisType} · {formatDate(order.createdAt)}</p>
                    {order.notes && (
                      <p className="text-[#64748b] text-xs mt-1 italic">"{order.notes}"</p>
                    )}
                  </div>
                  <span className="text-[#00d4aa] text-xs font-mono shrink-0">${order.amountPaid}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload + Send */}
      <div className="border-t border-[#1a2d3d] px-5 py-4 space-y-3">
        <input
          ref={fileRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={(e) => { setFile(e.target.files?.[0] ?? null); setError(""); }}
        />

        <button
          onClick={() => fileRef.current?.click()}
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-all ${
            file
              ? "border-[#00d4aa]/40 bg-[#00d4aa]/5 text-[#00d4aa]"
              : "border-[#1a2d3d] text-[#64748b] hover:border-[#00d4aa]/30 hover:text-[#e8f0f7]"
          }`}
        >
          <Upload className="w-4 h-4" />
          {file ? file.name : `Upload ${pair} Analysis PDF`}
        </button>

        {error && (
          <div className="flex items-center gap-2 text-red-400 text-xs">
            <AlertCircle className="w-3.5 h-3.5" /> {error}
          </div>
        )}

        <button
          onClick={handleDeliver}
          disabled={loading || !file}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-[#00d4aa] to-[#0ea5e9] text-white text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-40"
        >
          <Send className="w-4 h-4" />
          {loading ? "Delivering…" : `Send to ${orders.length} customer${orders.length > 1 ? "s" : ""}`}
        </button>
      </div>
    </div>
  );
}

export default function AdminDashboard({ grouped, delivered, totalPending }: Props) {
  const router = useRouter();
  const [tab, setTab] = useState<"pending" | "delivered">("pending");
  const pairs = Object.keys(grouped);

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
  }

  return (
    <main className="min-h-screen bg-[#050a0e]">
      {/* Top bar */}
      <div className="border-b border-[#1a2d3d] bg-[#0d1821]/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#00d4aa] to-[#0ea5e9] flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-sm">
              <span className="gradient-text">TheChart</span>
              <span className="text-[#e8f0f7]">Scope</span>
              <span className="text-[#475569] ml-2">Admin</span>
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-[#64748b] text-xs hover:text-red-400 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: "Pending Orders", value: totalPending, icon: Clock, color: "text-yellow-400" },
            { label: "Pairs to Deliver", value: pairs.length, icon: FileText, color: "text-[#00d4aa]" },
            { label: "Delivered Today", value: delivered.filter(d => d.deliveredAt && new Date(d.deliveredAt).toDateString() === new Date().toDateString()).length, icon: CheckCircle, color: "text-emerald-400" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-[#0d1821] border border-[#1a2d3d] rounded-xl p-4">
              <Icon className={`w-4 h-4 ${color} mb-2`} />
              <p className="text-[#e8f0f7] text-2xl font-bold">{value}</p>
              <p className="text-[#475569] text-xs">{label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-[#0d1821] border border-[#1a2d3d] rounded-xl w-fit mb-6">
          {(["pending", "delivered"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                tab === t ? "bg-[#1a2d3d] text-[#e8f0f7]" : "text-[#64748b] hover:text-[#94a3b8]"
              }`}
            >
              {t} {t === "pending" && totalPending > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-[#00d4aa]/20 text-[#00d4aa] text-xs">{totalPending}</span>
              )}
            </button>
          ))}
        </div>

        {/* Pending tab */}
        {tab === "pending" && (
          <div className="space-y-4">
            {pairs.length === 0 ? (
              <div className="text-center py-16">
                <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
                <p className="text-[#e8f0f7] font-semibold">All caught up!</p>
                <p className="text-[#64748b] text-sm mt-1">No pending orders right now.</p>
              </div>
            ) : (
              pairs.map((pair) => (
                <PairCard key={pair} pair={pair} orders={grouped[pair]} />
              ))
            )}
          </div>
        )}

        {/* Delivered tab */}
        {tab === "delivered" && (
          <div className="space-y-3">
            {delivered.length === 0 ? (
              <div className="text-center py-16">
                <FileText className="w-10 h-10 text-[#475569] mx-auto mb-3" />
                <p className="text-[#e8f0f7] font-semibold">No deliveries yet</p>
              </div>
            ) : (
              delivered.map((order) => (
                <div key={order.id} className="bg-[#0d1821] border border-[#1a2d3d] rounded-xl px-5 py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <p className="text-[#e8f0f7] text-sm font-semibold">{order.pair}</p>
                      <p className="text-[#475569] text-xs">{order.email} · {order.deliveredAt ? formatDate(order.deliveredAt) : ""}</p>
                    </div>
                  </div>
                  {order.pdfUrl && (
                    <a
                      href={order.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 text-xs text-[#00d4aa] hover:underline"
                    >
                      View PDF
                    </a>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </main>
  );
}
