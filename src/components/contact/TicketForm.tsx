"use client";

import { useState } from "react";
import { Send, CheckCircle, Ticket } from "lucide-react";

export default function TicketForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/tickets/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Something went wrong."); return; }
      setSuccess(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-14 h-14 rounded-2xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center mb-4">
          <CheckCircle className="w-7 h-7 text-emerald-400" />
        </div>
        <h3 className="text-[#e8f0f7] font-bold text-lg mb-2">Ticket Submitted!</h3>
        <p className="text-[#64748b] text-sm max-w-xs">
          We received your message and will get back to you at <span className="text-[#00d4aa]">{form.email}</span> as soon as possible.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-lg bg-[#00d4aa]/10 border border-[#00d4aa]/20 flex items-center justify-center">
          <Ticket className="w-4 h-4 text-[#00d4aa]" />
        </div>
        <h2 className="text-[#e8f0f7] font-bold text-lg">Open a Support Ticket</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[#94a3b8] text-xs font-medium mb-1.5">Name</label>
          <input
            type="text"
            placeholder="Your name"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            className="w-full bg-[#050a0e] border border-[#1a2d3d] rounded-xl px-4 py-2.5 text-[#e8f0f7] text-sm placeholder-[#475569] focus:outline-none focus:border-[#00d4aa]/50 transition-colors"
          />
        </div>
        <div>
          <label className="block text-[#94a3b8] text-xs font-medium mb-1.5">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            className="w-full bg-[#050a0e] border border-[#1a2d3d] rounded-xl px-4 py-2.5 text-[#e8f0f7] text-sm placeholder-[#475569] focus:outline-none focus:border-[#00d4aa]/50 transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-[#94a3b8] text-xs font-medium mb-1.5">Subject</label>
        <input
          type="text"
          placeholder="What's this about?"
          value={form.subject}
          onChange={(e) => set("subject", e.target.value)}
          className="w-full bg-[#050a0e] border border-[#1a2d3d] rounded-xl px-4 py-2.5 text-[#e8f0f7] text-sm placeholder-[#475569] focus:outline-none focus:border-[#00d4aa]/50 transition-colors"
        />
      </div>

      <div>
        <label className="block text-[#94a3b8] text-xs font-medium mb-1.5">Message</label>
        <textarea
          rows={5}
          placeholder="Describe your question or issue in detail..."
          value={form.message}
          onChange={(e) => set("message", e.target.value)}
          className="w-full bg-[#050a0e] border border-[#1a2d3d] rounded-xl px-4 py-2.5 text-[#e8f0f7] text-sm placeholder-[#475569] focus:outline-none focus:border-[#00d4aa]/50 transition-colors resize-none"
        />
      </div>

      {error && (
        <p className="text-red-400 text-xs">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#00d4aa] to-[#0ea5e9] text-white text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-50"
      >
        <Send className="w-4 h-4" />
        {loading ? "Submitting…" : "Submit Ticket"}
      </button>
    </form>
  );
}
