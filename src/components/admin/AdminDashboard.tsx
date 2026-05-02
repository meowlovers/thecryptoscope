"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp, CheckCircle, Clock,
  FileText, LogOut,
  Ticket, Mail, ChevronRight, X
} from "lucide-react";
import AnalysisEditor from "./AnalysisEditor";

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

interface TicketItem {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "OPEN" | "IN_PROGRESS" | "CLOSED";
  createdAt: Date;
}

interface Props {
  grouped: Record<string, Order[]>;
  delivered: DeliveredOrder[];
  totalPending: number;
  tickets: TicketItem[];
}

function formatDate(d: Date) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}


const TICKET_STATUS_STYLE: Record<TicketItem["status"], string> = {
  OPEN:        "bg-yellow-400/10 text-yellow-400 border border-yellow-400/20",
  IN_PROGRESS: "bg-blue-400/10 text-blue-400 border border-blue-400/20",
  CLOSED:      "bg-[#1a2d3d] text-[#64748b] border border-[#1a2d3d]",
};

function TicketCard({ ticket, onUpdate }: { ticket: TicketItem; onUpdate: (id: string, status: TicketItem["status"]) => void }) {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);

  async function setStatus(status: TicketItem["status"]) {
    setLoading(true);
    await fetch("/api/admin/tickets", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: ticket.id, status }),
    });
    onUpdate(ticket.id, status);
    setLoading(false);
  }

  return (
    <div className={`bg-[#0d1821] border rounded-2xl overflow-hidden transition-colors ${
      ticket.status === "CLOSED" ? "border-[#1a2d3d] opacity-60" : "border-[#1a2d3d] hover:border-[#00d4aa]/20"
    }`}>
      <div className="flex items-center justify-between px-5 py-4 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-[#00d4aa]/10 border border-[#00d4aa]/20 flex items-center justify-center shrink-0">
            <Mail className="w-4 h-4 text-[#00d4aa]" />
          </div>
          <div className="min-w-0">
            <p className="text-[#e8f0f7] text-sm font-semibold truncate">{ticket.subject}</p>
            <p className="text-[#475569] text-xs">{ticket.name} · {ticket.email} · {formatDate(ticket.createdAt)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-3">
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${TICKET_STATUS_STYLE[ticket.status]}`}>
            {ticket.status.replace("_", " ")}
          </span>
          {expanded ? <ChevronUp className="w-4 h-4 text-[#475569]" /> : <ChevronRight className="w-4 h-4 text-[#475569]" />}
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-t border-[#1a2d3d] px-5 py-4">
              <p className="text-[#94a3b8] text-sm leading-relaxed whitespace-pre-wrap mb-4">{ticket.message}</p>
              <div className="flex gap-2 flex-wrap">
                {ticket.status !== "IN_PROGRESS" && (
                  <button
                    onClick={() => setStatus("IN_PROGRESS")}
                    disabled={loading}
                    className="px-3 py-1.5 rounded-lg bg-blue-400/10 border border-blue-400/20 text-blue-400 text-xs font-semibold hover:bg-blue-400/20 transition-colors disabled:opacity-50"
                  >
                    Mark In Progress
                  </button>
                )}
                {ticket.status !== "CLOSED" && (
                  <button
                    onClick={() => setStatus("CLOSED")}
                    disabled={loading}
                    className="px-3 py-1.5 rounded-lg bg-[#1a2d3d] border border-[#1a2d3d] text-[#64748b] text-xs font-semibold hover:text-[#94a3b8] transition-colors disabled:opacity-50"
                  >
                    <X className="w-3 h-3 inline mr-1" />Close Ticket
                  </button>
                )}
                {ticket.status === "CLOSED" && (
                  <button
                    onClick={() => setStatus("OPEN")}
                    disabled={loading}
                    className="px-3 py-1.5 rounded-lg bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 text-xs font-semibold hover:bg-yellow-400/20 transition-colors disabled:opacity-50"
                  >
                    Reopen
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AdminDashboard({ grouped, delivered, totalPending, tickets }: Props) {
  const router = useRouter();
  const [tab, setTab] = useState<"pending" | "delivered" | "tickets">("pending");
  const [ticketList, setTicketList] = useState<TicketItem[]>(tickets);

  function handleTicketUpdate(id: string, status: TicketItem["status"]) {
    setTicketList((prev) => prev.map((t) => t.id === id ? { ...t, status } : t));
  }

  const openTickets = ticketList.filter((t) => t.status !== "CLOSED").length;
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
              <span className="gradient-text">TheCrypto</span>
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
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Pending Orders", value: totalPending, icon: Clock, color: "text-yellow-400" },
            { label: "Pairs to Deliver", value: pairs.length, icon: FileText, color: "text-[#00d4aa]" },
            { label: "Delivered Today", value: delivered.filter(d => d.deliveredAt && new Date(d.deliveredAt).toDateString() === new Date().toDateString()).length, icon: CheckCircle, color: "text-emerald-400" },
            { label: "Open Tickets", value: openTickets, icon: Ticket, color: "text-orange-400" },
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
          {(["pending", "delivered", "tickets"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                tab === t ? "bg-[#1a2d3d] text-[#e8f0f7]" : "text-[#64748b] hover:text-[#94a3b8]"
              }`}
            >
              {t === "tickets" ? "Tickets" : t}
              {t === "pending" && totalPending > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-[#00d4aa]/20 text-[#00d4aa] text-xs">{totalPending}</span>
              )}
              {t === "tickets" && openTickets > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-orange-400/20 text-orange-400 text-xs">{openTickets}</span>
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
                <AnalysisEditor key={pair} pair={pair} orders={grouped[pair]} />
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

        {/* Tickets tab */}
        {tab === "tickets" && (
          <div className="space-y-3">
            {ticketList.length === 0 ? (
              <div className="text-center py-16">
                <Ticket className="w-10 h-10 text-[#475569] mx-auto mb-3" />
                <p className="text-[#e8f0f7] font-semibold">No tickets yet</p>
                <p className="text-[#64748b] text-sm mt-1">Support tickets will appear here.</p>
              </div>
            ) : (
              ticketList.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} onUpdate={handleTicketUpdate} />
              ))
            )}
          </div>
        )}
      </div>
    </main>
  );
}
