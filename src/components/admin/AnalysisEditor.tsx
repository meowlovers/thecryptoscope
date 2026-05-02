"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Trash2, Image, AlignLeft, Type, Send,
  CheckCircle, AlertCircle, GripVertical, X, Loader2
} from "lucide-react";

type Section =
  | { id: string; type: "heading"; content: string }
  | { id: string; type: "text"; content: string }
  | { id: string; type: "image"; url: string; caption: string };

interface Order {
  id: string;
  pair: string;
  analysisType: string;
  email: string;
  notes: string | null;
  amountPaid: number;
}

function uid() {
  return Math.random().toString(36).slice(2);
}

export default function AnalysisEditor({ pair, orders }: { pair: string; orders: Order[] }) {
  const router = useRouter();
  const [sections, setSections] = useState<Section[]>([
    { id: uid(), type: "heading", content: "" },
    { id: uid(), type: "text", content: "" },
  ]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pendingImageId = useRef<string | null>(null);

  function addSection(type: Section["type"]) {
    const newSection: Section =
      type === "heading" ? { id: uid(), type: "heading", content: "" }
      : type === "text"  ? { id: uid(), type: "text", content: "" }
      :                    { id: uid(), type: "image", url: "", caption: "" };
    setSections((s) => [...s, newSection]);
  }

  function updateSection(id: string, patch: Partial<Section>) {
    setSections((s) => s.map((sec) => sec.id === id ? { ...sec, ...patch } as Section : sec));
  }

  function removeSection(id: string) {
    setSections((s) => s.filter((sec) => sec.id !== id));
  }

  async function handleImageUpload(id: string, file: File) {
    setUploading(id);
    const fd = new FormData();
    fd.append("image", file);
    try {
      const res = await fetch("/api/admin/upload-image", { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok) updateSection(id, { url: data.url } as Partial<Section>);
      else setError("Image upload failed");
    } catch {
      setError("Image upload failed");
    }
    setUploading(null);
  }

  async function handleDeliver() {
    const filled = sections.filter((s) =>
      s.type === "image" ? s.url : s.content.trim()
    );
    if (filled.length === 0) { setError("Add at least one section with content."); return; }
    setError("");
    setLoading(true);

    const res = await fetch("/api/admin/deliver", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pair,
        orderIds: orders.map((o) => o.id),
        sections: filled.map(({ id: _id, ...rest }) => rest),
      }),
    });
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
      <div className="bg-emerald-400/5 border border-emerald-400/20 rounded-2xl p-6 flex items-center gap-3">
        <CheckCircle className="w-6 h-6 text-emerald-400 shrink-0" />
        <div>
          <p className="text-emerald-400 font-semibold">{pair} analysis delivered!</p>
          <p className="text-[#64748b] text-xs">Sent to {orders.length} customer{orders.length > 1 ? "s" : ""} with notification</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0d1821] border border-[#1a2d3d] rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#1a2d3d]">
        <div>
          <p className="text-[#e8f0f7] font-bold">{pair}</p>
          <button
            onClick={() => setShowOrders(!showOrders)}
            className="text-[#475569] text-xs hover:text-[#94a3b8] transition-colors"
          >
            {orders.length} order{orders.length > 1 ? "s" : ""} — click to view
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#00d4aa]/10 text-[#00d4aa] border border-[#00d4aa]/20">
            {sections.filter(s => s.type === "image" ? (s as any).url : (s as any).content?.trim()).length} sections
          </span>
        </div>
      </div>

      {/* Order list (collapsible) */}
      <AnimatePresence>
        {showOrders && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
            className="overflow-hidden border-b border-[#1a2d3d]"
          >
            <div className="divide-y divide-[#1a2d3d]">
              {orders.map((o) => (
                <div key={o.id} className="px-5 py-3 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[#e8f0f7] text-sm font-medium">{o.email}</p>
                    <p className="text-[#475569] text-xs capitalize">{o.analysisType} · ${o.amountPaid}</p>
                    {o.notes && <p className="text-[#64748b] text-xs italic mt-0.5">"{o.notes}"</p>}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Editor */}
      <div className="p-5 space-y-3">
        {sections.map((section, i) => (
          <div key={section.id} className="group flex gap-2 items-start">
            <div className="mt-2 text-[#1a2d3d] cursor-grab">
              <GripVertical className="w-4 h-4" />
            </div>
            <div className="flex-1">
              {section.type === "heading" && (
                <input
                  value={section.content}
                  onChange={(e) => updateSection(section.id, { content: e.target.value })}
                  placeholder="Section heading (e.g. Technical Overview)"
                  className="w-full bg-[#050a0e] border border-[#1a2d3d] rounded-xl px-4 py-2.5 text-[#e8f0f7] font-semibold text-base placeholder-[#475569] focus:outline-none focus:border-[#00d4aa]/50 transition-colors"
                />
              )}
              {section.type === "text" && (
                <textarea
                  value={section.content}
                  onChange={(e) => updateSection(section.id, { content: e.target.value })}
                  placeholder="Write your analysis here..."
                  rows={4}
                  className="w-full bg-[#050a0e] border border-[#1a2d3d] rounded-xl px-4 py-2.5 text-[#94a3b8] text-sm placeholder-[#475569] focus:outline-none focus:border-[#00d4aa]/50 transition-colors resize-y"
                />
              )}
              {section.type === "image" && (
                <div className="border border-dashed border-[#1a2d3d] rounded-xl overflow-hidden">
                  {section.url ? (
                    <div className="relative">
                      <img src={section.url} alt="chart" className="w-full rounded-t-xl object-contain max-h-64" />
                      <button
                        onClick={() => updateSection(section.id, { url: "" } as Partial<Section>)}
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500/80 flex items-center justify-center hover:bg-red-500 transition-colors"
                      >
                        <X className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        pendingImageId.current = section.id;
                        fileInputRef.current?.click();
                      }}
                      className="w-full flex flex-col items-center justify-center py-8 text-[#475569] hover:text-[#94a3b8] hover:bg-[#0d1821] transition-colors"
                    >
                      {uploading === section.id ? (
                        <Loader2 className="w-6 h-6 animate-spin mb-2" />
                      ) : (
                        <Image className="w-6 h-6 mb-2" />
                      )}
                      <span className="text-sm">{uploading === section.id ? "Uploading…" : "Click to upload chart image"}</span>
                    </button>
                  )}
                  <input
                    value={section.caption}
                    onChange={(e) => updateSection(section.id, { caption: e.target.value } as Partial<Section>)}
                    placeholder="Image caption (optional)"
                    className="w-full bg-[#050a0e] border-t border-[#1a2d3d] px-4 py-2 text-[#64748b] text-xs placeholder-[#475569] focus:outline-none"
                  />
                </div>
              )}
            </div>
            <button
              onClick={() => removeSection(section.id)}
              className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity text-[#475569] hover:text-red-400"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file && pendingImageId.current) {
              handleImageUpload(pendingImageId.current, file);
              pendingImageId.current = null;
            }
            e.target.value = "";
          }}
        />

        {/* Add section buttons */}
        <div className="flex gap-2 pt-1">
          <button
            onClick={() => addSection("heading")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#1a2d3d] text-[#64748b] text-xs font-medium hover:border-[#00d4aa]/30 hover:text-[#00d4aa] transition-colors"
          >
            <Type className="w-3.5 h-3.5" /> Heading
          </button>
          <button
            onClick={() => addSection("text")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#1a2d3d] text-[#64748b] text-xs font-medium hover:border-[#00d4aa]/30 hover:text-[#00d4aa] transition-colors"
          >
            <AlignLeft className="w-3.5 h-3.5" /> Text
          </button>
          <button
            onClick={() => addSection("image")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#1a2d3d] text-[#64748b] text-xs font-medium hover:border-[#00d4aa]/30 hover:text-[#00d4aa] transition-colors"
          >
            <Image className="w-3.5 h-3.5" /> Image
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-400 text-xs">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {error}
          </div>
        )}

        {/* Deliver button */}
        <button
          onClick={handleDeliver}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#00d4aa] to-[#0ea5e9] text-white text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-40 mt-2"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          {loading ? "Delivering…" : `Deliver to ${orders.length} customer${orders.length > 1 ? "s" : ""}`}
        </button>
      </div>
    </div>
  );
}
