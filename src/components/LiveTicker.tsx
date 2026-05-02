"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { CoinPrice } from "@/app/api/prices/route";
import { TrendingUp, TrendingDown } from "lucide-react";

function formatPrice(price: number): string {
  if (price >= 1000) return price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (price >= 1) return price.toLocaleString("en-US", { minimumFractionDigits: 4, maximumFractionDigits: 4 });
  return price.toLocaleString("en-US", { minimumFractionDigits: 5, maximumFractionDigits: 6 });
}

function formatVolume(vol: number): string {
  if (vol >= 1e9) return `$${(vol / 1e9).toFixed(1)}B`;
  if (vol >= 1e6) return `$${(vol / 1e6).toFixed(0)}M`;
  return `$${vol.toFixed(0)}`;
}

function CoinItem({ coin }: { coin: CoinPrice }) {
  const isPositive = coin.change24h >= 0;
  return (
    <div className="flex items-center gap-2.5 px-5 border-r border-[#1a2d3d] shrink-0 h-10">
      {/* Coin badge */}
      <div
        className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black shrink-0"
        style={{ backgroundColor: coin.color + "22", color: coin.color, border: `1px solid ${coin.color}44` }}
      >
        {coin.ticker.slice(0, 1)}
      </div>

      {/* Ticker */}
      <span className="text-[#94a3b8] text-xs font-semibold">{coin.ticker}</span>

      {/* Price */}
      <span className="text-[#e8f0f7] text-xs font-mono font-semibold">
        ${formatPrice(coin.price)}
      </span>

      {/* 24h change */}
      <span
        className={`flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-md ${
          isPositive
            ? "text-emerald-400 bg-emerald-400/10"
            : "text-red-400 bg-red-400/10"
        }`}
      >
        {isPositive
          ? <TrendingUp className="w-2.5 h-2.5" />
          : <TrendingDown className="w-2.5 h-2.5" />}
        {isPositive ? "+" : ""}{coin.change24h.toFixed(2)}%
      </span>

      {/* Volume */}
      <span className="text-[#475569] text-[10px] hidden sm:block">
        Vol {formatVolume(coin.volume24h)}
      </span>
    </div>
  );
}

function TickerSkeleton() {
  return (
    <div className="flex items-center gap-6 px-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex items-center gap-2 px-4 shrink-0">
          <div className="w-5 h-5 rounded-full bg-[#1a2d3d] animate-pulse" />
          <div className="w-10 h-3 rounded bg-[#1a2d3d] animate-pulse" />
          <div className="w-16 h-3 rounded bg-[#1a2d3d] animate-pulse" />
          <div className="w-12 h-4 rounded bg-[#1a2d3d] animate-pulse" />
        </div>
      ))}
    </div>
  );
}

export default function LiveTicker() {
  const [coins, setCoins] = useState<CoinPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchPrices = useCallback(async () => {
    try {
      const res = await fetch("/api/prices");
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setCoins(data.coins ?? []);
      setLastUpdated(data.updatedAt);
    } catch {
      // silently fail — keep showing last data
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrices();
    intervalRef.current = setInterval(fetchPrices, 30_000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [fetchPrices]);

  const secondsSince = lastUpdated ? Math.floor((Date.now() - lastUpdated) / 1000) : null;

  return (
    <div className="w-full h-10 bg-[#070d14] border-b border-[#1a2d3d] overflow-hidden flex items-center">
      {/* Left label */}
      <div className="flex items-center gap-2 px-3 shrink-0 border-r border-[#1a2d3d] h-full bg-[#0d1821]">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
        <span className="text-[#64748b] text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap">
          Live
        </span>
      </div>

      {/* Scrolling content */}
      <div
        className="flex-1 overflow-hidden relative"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {loading ? (
          <TickerSkeleton />
        ) : (
          <div
            className="flex items-center ticker-scroll"
            style={{ animationPlayState: paused ? "paused" : "running" }}
          >
            {/* Duplicate items for seamless infinite loop */}
            {[...coins, ...coins].map((coin, i) => (
              <CoinItem key={`${coin.symbol}-${i}`} coin={coin} />
            ))}
          </div>
        )}
      </div>

      {/* Right: last updated */}
      <div className="px-3 shrink-0 border-l border-[#1a2d3d] h-full flex items-center bg-[#0d1821]">
        <span className="text-[#475569] text-[10px] whitespace-nowrap">
          {secondsSince !== null ? `${secondsSince}s ago` : "—"}
        </span>
      </div>
    </div>
  );
}
