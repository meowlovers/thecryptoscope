"use client";

import { motion } from "framer-motion";

const coins = [
  { symbol: "₿", label: "BTC", color: "#f7931a", size: 52, x: "8%",  y: "18%", delay: 0,    duration: 6 },
  { symbol: "Ξ", label: "ETH", color: "#627eea", size: 46, x: "88%", y: "14%", delay: 1.2,  duration: 7 },
  { symbol: "✕", label: "XRP", color: "#00aae4", size: 38, x: "75%", y: "65%", delay: 0.5,  duration: 8 },
  { symbol: "◎", label: "SOL", color: "#9945ff", size: 42, x: "15%", y: "72%", delay: 2,    duration: 6.5 },
  { symbol: "♦", label: "BNB", color: "#f3ba2f", size: 36, x: "55%", y: "80%", delay: 0.8,  duration: 7.5 },
  { symbol: "▲", label: "ADA", color: "#0033ad", size: 34, x: "92%", y: "50%", delay: 1.5,  duration: 9 },
  { symbol: "◈", label: "DOT", color: "#e6007a", size: 32, x: "3%",  y: "45%", delay: 2.5,  duration: 7 },
  { symbol: "⬡", label: "AVAX", color: "#e84142", size: 30, x: "42%", y: "88%", delay: 0.3, duration: 8.5 },
  { symbol: "Ł", label: "LTC", color: "#bfbbbb", size: 28, x: "68%", y: "22%", delay: 1.8,  duration: 6 },
  { symbol: "Ð", label: "DOGE", color: "#c2a633", size: 30, x: "28%", y: "10%", delay: 3,   duration: 9 },
];

export default function FloatingCoins() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none hidden sm:block" aria-hidden>
      {coins.map((coin) => (
        <motion.div
          key={coin.label}
          className="absolute flex flex-col items-center gap-1"
          style={{ left: coin.x, top: coin.y }}
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: [0, 0.18, 0.18, 0],
            y: [20, -10, -30, -60],
          }}
          transition={{
            duration: coin.duration,
            delay: coin.delay,
            repeat: Infinity,
            repeatDelay: 1.5,
            ease: "easeInOut",
          }}
        >
          {/* Coin circle */}
          <motion.div
            className="rounded-full flex items-center justify-center font-bold border"
            style={{
              width: coin.size,
              height: coin.size,
              fontSize: coin.size * 0.38,
              color: coin.color,
              borderColor: coin.color + "44",
              backgroundColor: coin.color + "12",
              boxShadow: `0 0 ${coin.size * 0.5}px ${coin.color}22`,
            }}
            animate={{ rotate: [0, 8, -8, 0] }}
            transition={{
              duration: coin.duration * 0.8,
              delay: coin.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {coin.symbol}
          </motion.div>

          {/* Ticker label */}
          <span
            className="text-[10px] font-semibold tracking-widest"
            style={{ color: coin.color + "88" }}
          >
            {coin.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
