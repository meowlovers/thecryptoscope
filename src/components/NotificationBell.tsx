"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, TrendingUp, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  link: string | null;
  createdAt: string;
}

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const unread = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    fetch("/api/user/notifications")
      .then((r) => r.json())
      .then((data) => Array.isArray(data) && setNotifications(data))
      .catch(() => {});
  }, []);

  // Close on outside click
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  async function handleOpen() {
    setOpen((o) => !o);
    if (!open && unread > 0) {
      // Mark all as read
      await fetch("/api/user/notifications", { method: "PATCH" });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    }
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={handleOpen}
        className="relative flex items-center justify-center w-9 h-9 rounded-lg text-[#94a3b8] hover:text-[#e8f0f7] hover:bg-[#0d1821] transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-4 h-4" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#00d4aa] text-white text-[9px] font-bold flex items-center justify-center">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-11 w-80 bg-[#0d1821] border border-[#1a2d3d] rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#1a2d3d]">
              <p className="text-[#e8f0f7] text-sm font-semibold">Notifications</p>
              <button onClick={() => setOpen(false)} className="text-[#475569] hover:text-[#94a3b8]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="py-10 text-center">
                  <Bell className="w-6 h-6 text-[#475569] mx-auto mb-2" />
                  <p className="text-[#64748b] text-xs">No notifications yet</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      setOpen(false);
                      if (n.link) router.push(n.link);
                    }}
                    className={`px-4 py-3 border-b border-[#1a2d3d] last:border-0 cursor-pointer hover:bg-[#1a2d3d]/50 transition-colors ${!n.read ? "bg-[#00d4aa]/5" : ""}`}
                  >
                    <div className="flex gap-3 items-start">
                      <div className="w-7 h-7 rounded-lg bg-[#00d4aa]/10 border border-[#00d4aa]/20 flex items-center justify-center shrink-0 mt-0.5">
                        <TrendingUp className="w-3.5 h-3.5 text-[#00d4aa]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[#e8f0f7] text-xs font-semibold">{n.title}</p>
                        <p className="text-[#64748b] text-xs mt-0.5 leading-relaxed">{n.message}</p>
                        <p className="text-[#475569] text-[10px] mt-1">{timeAgo(n.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {notifications.length > 0 && (
              <div className="px-4 py-2.5 border-t border-[#1a2d3d]">
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="text-[#00d4aa] text-xs font-semibold hover:underline"
                >
                  Go to Dashboard →
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
