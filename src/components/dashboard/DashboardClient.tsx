"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Wallet, Plus, ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, Package, TrendingUp, Download } from "lucide-react";
import AnalysisView from "./AnalysisView";

interface Transaction {
  id: string;
  type: "TOPUP" | "PURCHASE";
  amount: number;
  status: "PENDING" | "CONFIRMED" | "FAILED";
  note: string | null;
  createdAt: string;
}

interface Order {
  id: string;
  pair: string;
  analysisType: string;
  status: "PENDING" | "IN_PROGRESS" | "DELIVERED" | "CANCELLED";
  amountPaid: number;
  createdAt: string;
  pdfUrl?: string | null;
  analysisId?: string | null;
  deliveredAt?: string | null;
}

interface Props {
  balance: number;
  transactions: Transaction[];
  orders: Order[];
  email: string;
}

const ORDER_STATUS_STYLE: Record<Order["status"], string> = {
  PENDING:     "bg-yellow-400/10 text-yellow-400",
  IN_PROGRESS: "bg-blue-400/10 text-blue-400",
  DELIVERED:   "bg-emerald-400/10 text-emerald-400",
  CANCELLED:   "bg-red-400/10 text-red-400",
};

const ORDER_STATUS_LABEL: Record<Order["status"], string> = {
  PENDING:     "Pending",
  IN_PROGRESS: "In Progress",
  DELIVERED:   "Delivered",
  CANCELLED:   "Cancelled",
};

function formatDate(d: string | Date) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function DashboardClient({ balance, transactions, orders, email }: Props) {
  const [tab, setTab] = useState<"orders" | "transactions">("orders");

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <p className="text-[#64748b] text-sm mb-1">Welcome back,</p>
        <h1 className="text-2xl font-bold text-[#e8f0f7] mb-8">{email}</h1>
      </motion.div>

      {/* Top cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {/* Balance card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }}
          className="sm:col-span-2 bg-[#0d1821] border border-[#1a2d3d] rounded-2xl p-6 flex items-center justify-between"
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Wallet className="w-4 h-4 text-[#00d4aa]" />
              <span className="text-[#64748b] text-xs font-medium uppercase tracking-wider">Credit Balance</span>
            </div>
            <p className="text-3xl font-bold text-[#e8f0f7] font-mono">
              ${balance.toFixed(2)} <span className="text-sm text-[#64748b] font-sans font-normal">USDT</span>
            </p>
            <p className="text-[#475569] text-xs mt-1">
              {balance >= 9 ? "✓ Enough for an analysis" : "Top up to order an analysis"}
            </p>
          </div>
          <Link
            href="/dashboard/topup"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00d4aa] to-[#0ea5e9] text-white text-sm font-semibold hover:opacity-90 transition-all shadow-lg"
          >
            <Plus className="w-4 h-4" />
            Add Credits
          </Link>
        </motion.div>

        {/* Quick order */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-[#0d1821] border border-[#1a2d3d] rounded-2xl p-6 flex flex-col justify-between"
        >
          <div>
            <TrendingUp className="w-5 h-5 text-[#00d4aa] mb-2" />
            <p className="text-[#e8f0f7] text-sm font-semibold">Order Analysis</p>
            <p className="text-[#64748b] text-xs mt-1">From $9 — deducted from your balance</p>
          </div>
          <Link
            href="/order"
            className="mt-4 flex items-center justify-center gap-1.5 w-full py-2 rounded-xl border border-[#1a2d3d] text-[#64748b] text-xs font-semibold hover:border-[#00d4aa]/40 hover:text-[#00d4aa] hover:bg-[#00d4aa]/5 transition-all"
          >
            Order Now
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-[#0d1821] border border-[#1a2d3d] rounded-xl w-fit mb-6">
        {(["orders", "transactions"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
              tab === t ? "bg-[#1a2d3d] text-[#e8f0f7]" : "text-[#64748b] hover:text-[#94a3b8]"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Orders tab */}
      {tab === "orders" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
          {orders.length === 0 ? (
            <EmptyState
              icon={<Package className="w-8 h-8 text-[#475569]" />}
              title="No orders yet"
              sub="Order your first analysis and it will appear here."
              action={<Link href="/order" className="text-[#00d4aa] text-sm font-semibold hover:underline">Order now →</Link>}
            />
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <div key={order.id} className="bg-[#0d1821] border border-[#1a2d3d] rounded-xl px-5 py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#00d4aa]/10 border border-[#00d4aa]/20 flex items-center justify-center shrink-0">
                      <TrendingUp className="w-4 h-4 text-[#00d4aa]" />
                    </div>
                    <div>
                      <p className="text-[#e8f0f7] text-sm font-semibold">{order.pair}</p>
                      <p className="text-[#475569] text-xs capitalize">{order.analysisType} · {formatDate(order.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${ORDER_STATUS_STYLE[order.status]}`}>
                      {ORDER_STATUS_LABEL[order.status]}
                    </span>
                    {order.status === "DELIVERED" && order.analysisId ? (
                      <AnalysisView orderId={order.id} pair={order.pair} />
                    ) : order.status === "DELIVERED" && order.pdfUrl ? (
                      <a
                        href={order.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#00d4aa]/10 border border-[#00d4aa]/30 text-[#00d4aa] text-xs font-semibold hover:bg-[#00d4aa]/20 transition-colors"
                      >
                        <Download className="w-3 h-3" /> Download
                      </a>
                    ) : (
                      <span className="text-[#64748b] text-xs font-mono">${order.amountPaid.toFixed(2)}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Transactions tab */}
      {tab === "transactions" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
          {transactions.length === 0 ? (
            <EmptyState
              icon={<Clock className="w-8 h-8 text-[#475569]" />}
              title="No transactions yet"
              sub="Add credits to get started."
              action={<Link href="/dashboard/topup" className="text-[#00d4aa] text-sm font-semibold hover:underline">Add credits →</Link>}
            />
          ) : (
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div key={tx.id} className="bg-[#0d1821] border border-[#1a2d3d] rounded-xl px-5 py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      tx.type === "PURCHASE"
                        ? "bg-red-400/10 border border-red-400/20"
                        : tx.status === "CONFIRMED"
                        ? "bg-emerald-400/10 border border-emerald-400/20"
                        : tx.status === "FAILED"
                        ? "bg-red-400/10 border border-red-400/20"
                        : "bg-yellow-400/10 border border-yellow-400/20"
                    }`}>
                      {tx.type === "PURCHASE"
                        ? <ArrowUpRight className="w-4 h-4 text-red-400" />
                        : tx.status === "CONFIRMED"
                        ? <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
                        : tx.status === "FAILED"
                        ? <ArrowDownLeft className="w-4 h-4 text-red-400" />
                        : <Clock className="w-4 h-4 text-yellow-400" />
                      }
                    </div>
                    <div>
                      <p className="text-[#e8f0f7] text-sm font-semibold">
                        {tx.type === "PURCHASE"
                          ? "Purchase"
                          : tx.status === "CONFIRMED"
                          ? "Credits Added"
                          : tx.status === "FAILED"
                          ? "Payment Failed"
                          : "Awaiting Payment"}
                      </p>
                      <p className="text-[#475569] text-xs">{tx.note ?? formatDate(tx.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {tx.status === "CONFIRMED"
                      ? <CheckCircle className="w-4 h-4 text-emerald-400" />
                      : tx.status === "PENDING"
                      ? <span className="text-[10px] font-semibold text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 px-2 py-0.5 rounded-md">PENDING</span>
                      : tx.status === "FAILED"
                      ? <span className="text-[10px] font-semibold text-red-400 bg-red-400/10 border border-red-400/20 px-2 py-0.5 rounded-md">FAILED</span>
                      : null
                    }
                    <span className={`text-sm font-mono font-semibold ${
                      tx.type === "PURCHASE"
                        ? "text-red-400"
                        : tx.status === "CONFIRMED"
                        ? "text-emerald-400"
                        : tx.status === "FAILED"
                        ? "text-red-400/50 line-through"
                        : "text-yellow-400/70"
                    }`}>
                      {tx.type === "TOPUP" ? "+" : "-"}${tx.amount.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

function EmptyState({ icon, title, sub, action }: { icon: React.ReactNode; title: string; sub: string; action: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4">{icon}</div>
      <p className="text-[#e8f0f7] font-semibold mb-1">{title}</p>
      <p className="text-[#64748b] text-sm mb-4">{sub}</p>
      {action}
    </div>
  );
}
