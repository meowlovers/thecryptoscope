"use client";

import { useState, useEffect } from "react";
import { X, Loader2, TrendingUp, ZoomIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Section =
  | { type: "heading"; content: string }
  | { type: "text"; content: string }
  | { type: "image"; url: string; caption?: string };

interface Analysis {
  id: string;
  pair: string;
  sections: Section[];
  createdAt: string;
}

interface Props {
  orderId: string;
  pair: string;
  autoOpen?: boolean;
}

export default function AnalysisView({ orderId, pair, autoOpen = false }: Props) {
  const [open, setOpen] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  // Auto-open if triggered from notification link
  useEffect(() => {
    if (autoOpen) openAnalysis();
  }, [autoOpen]);

  async function openAnalysis() {
    setOpen(true);
    if (analysis) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/analysis?orderId=${orderId}`);
      const data = await res.json();
      if (res.ok) setAnalysis(data);
      else setError("Could not load analysis.");
    } catch {
      setError("Network error.");
    }
    setLoading(false);
  }

  return (
    <>
      <button
        onClick={openAnalysis}
        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#00d4aa]/10 border border-[#00d4aa]/30 text-[#00d4aa] text-xs font-semibold hover:bg-[#00d4aa]/20 transition-colors"
      >
        <TrendingUp className="w-3 h-3" /> View Analysis
      </button>

      {/* Analysis Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 backdrop-blur-sm p-4 pt-8 overflow-y-auto"
            onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.97 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-2xl bg-[#0d1821] border border-[#1a2d3d] rounded-2xl shadow-2xl mb-8"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#1a2d3d] sticky top-0 bg-[#0d1821] rounded-t-2xl z-10">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#00d4aa]/10 border border-[#00d4aa]/20 flex items-center justify-center">
                    <TrendingUp className="w-3.5 h-3.5 text-[#00d4aa]" />
                  </div>
                  <div>
                    <p className="text-[#e8f0f7] font-bold text-sm">{pair} Analysis</p>
                    {analysis && (
                      <p className="text-[#475569] text-xs">
                        {new Date(analysis.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-[#475569] hover:text-[#e8f0f7] hover:bg-[#1a2d3d] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Content */}
              <div className="px-6 py-6">
                {loading && (
                  <div className="flex flex-col items-center justify-center py-16 gap-3">
                    <Loader2 className="w-8 h-8 text-[#00d4aa] animate-spin" />
                    <p className="text-[#64748b] text-sm">Loading your analysis…</p>
                  </div>
                )}

                {error && (
                  <p className="text-red-400 text-sm text-center py-8">{error}</p>
                )}

                {analysis && (
                  <div className="space-y-5">
                    {(analysis.sections as Section[]).map((section, i) => {
                      if (section.type === "heading") {
                        return (
                          <h2 key={i} className="text-[#e8f0f7] font-bold text-lg border-b border-[#1a2d3d] pb-2">
                            {section.content}
                          </h2>
                        );
                      }
                      if (section.type === "text") {
                        return (
                          <p key={i} className="text-[#94a3b8] text-sm leading-relaxed whitespace-pre-wrap">
                            {section.content}
                          </p>
                        );
                      }
                      if (section.type === "image") {
                        return (
                          <div key={i} className="rounded-xl overflow-hidden border border-[#1a2d3d]">
                            <div
                              className="relative group cursor-zoom-in"
                              onClick={() => setLightboxUrl(section.url)}
                            >
                              <img
                                src={section.url}
                                alt={section.caption ?? "Chart"}
                                className="w-full object-contain"
                              />
                              {/* Zoom hint overlay */}
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 rounded-full p-2">
                                  <ZoomIn className="w-5 h-5 text-white" />
                                </div>
                              </div>
                            </div>
                            {section.caption && (
                              <p className="text-[#475569] text-xs text-center py-2 bg-[#050a0e]">
                                {section.caption}
                              </p>
                            )}
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fullscreen Image Lightbox */}
      <AnimatePresence>
        {lightboxUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 cursor-zoom-out"
            onClick={() => setLightboxUrl(null)}
          >
            <button
              onClick={() => setLightboxUrl(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
            <motion.img
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              src={lightboxUrl}
              alt="Full size chart"
              className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
