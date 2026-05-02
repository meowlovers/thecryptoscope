"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, ArrowRight, RefreshCw, Search } from "lucide-react";
import type { CoinPrice } from "@/app/api/prices/route";

function formatPrice(price: number): string {
  if (price >= 10000) return price.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  if (price >= 1000) return price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (price >= 1) return price.toFixed(4);
  return price.toFixed(6);
}

function formatVolume(vol: number): string {
  if (vol >= 1e9) return `$${(vol / 1e9).toFixed(2)}B`;
  if (vol >= 1e6) return `$${(vol / 1e6).toFixed(0)}M`;
  return `$${vol.toFixed(0)}`;
}

function PriceBar({ high, low, price }: { high: number; low: number; price: number }) {
  const range = high - low;
  const pct = range > 0 ? ((price - low) / range) * 100 : 50;
  return (
    <div className="flex items-center gap-1.5 mt-2">
      <span className="text-[#475569] text-[9px]">${formatPrice(low)}</span>
      <div className="flex-1 h-1 rounded-full bg-[#1a2d3d] relative overflow-hidden">
        <div className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#00d4aa]/40 to-[#00d4aa]" style={{ width: `${pct}%` }} />
        <div className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow" style={{ left: `calc(${pct}% - 4px)` }} />
      </div>
      <span className="text-[#475569] text-[9px]">${formatPrice(high)}</span>
    </div>
  );
}

function CoinCard({ coin, index }: { coin: CoinPrice; index: number }) {
  const isPositive = coin.change24h >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group bg-[#0d1821] border border-[#1a2d3d] rounded-2xl p-5 hover:border-[#00d4aa]/30 hover:bg-[#0d1e2b] transition-all duration-200"
    >
      {/* Header row */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 overflow-hidden"
            style={{
              backgroundColor: coin.color + "18",
              border: `1px solid ${coin.color}35`,
              boxShadow: `0 0 12px ${coin.color}15`,
            }}
          >
            <img
              src={`https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/svg/color/${coin.ticker.toLowerCase()}.svg`}
              alt={coin.ticker}
              width={24}
              height={24}
              onError={(e) => {
                const target = e.currentTarget;
                target.style.display = "none";
                const parent = target.parentElement;
                if (parent) {
                  parent.style.color = coin.color;
                  parent.style.fontSize = "14px";
                  parent.style.fontWeight = "900";
                  parent.textContent = coin.ticker.slice(0, 1);
                }
              }}
            />
          </div>
          <div>
            <p className="text-[#e8f0f7] text-sm font-bold leading-tight">{coin.ticker}</p>
            <p className="text-[#475569] text-[10px]">{coin.name}</p>
          </div>
        </div>

        {/* 24h change badge */}
        <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold ${
          isPositive ? "bg-emerald-400/10 text-emerald-400" : "bg-red-400/10 text-red-400"
        }`}>
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {isPositive ? "+" : ""}{coin.change24h.toFixed(2)}%
        </div>
      </div>

      {/* Price */}
      <p className="text-[#e8f0f7] text-xl font-bold font-mono mb-0.5">
        ${formatPrice(coin.price)}
      </p>
      <p className="text-[#475569] text-[10px] mb-2">
        24h Vol: <span className="text-[#64748b]">{formatVolume(coin.volume24h)}</span>
      </p>

      {/* Price range bar */}
      <PriceBar high={coin.high24h} low={coin.low24h} price={coin.price} />

      {/* Analyze button */}
      <Link
        href={`/order?pair=${coin.symbol}`}
        className="mt-4 flex items-center justify-center gap-1.5 w-full py-2 rounded-xl border border-[#1a2d3d] text-[#64748b] text-xs font-semibold hover:border-[#00d4aa]/40 hover:text-[#00d4aa] hover:bg-[#00d4aa]/5 transition-all"
      >
        Analyze {coin.ticker}
        <ArrowRight className="w-3 h-3" />
      </Link>
    </motion.div>
  );
}

function CardSkeleton() {
  return (
    <div className="bg-[#0d1821] border border-[#1a2d3d] rounded-2xl p-5 animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#1a2d3d]" />
          <div>
            <div className="w-10 h-3.5 rounded bg-[#1a2d3d] mb-1" />
            <div className="w-16 h-2.5 rounded bg-[#1a2d3d]" />
          </div>
        </div>
        <div className="w-14 h-6 rounded-lg bg-[#1a2d3d]" />
      </div>
      <div className="w-28 h-6 rounded bg-[#1a2d3d] mb-1" />
      <div className="w-20 h-2.5 rounded bg-[#1a2d3d] mb-3" />
      <div className="w-full h-1 rounded-full bg-[#1a2d3d]" />
    </div>
  );
}

function OtherCard({ index }: { index: number }) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const pair = value.trim().toUpperCase();
    if (pair.length < 2) { setError(true); return; }
    setError(false);
    router.push(`/order?pair=${encodeURIComponent(pair)}`);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="bg-[#0d1821] border border-dashed border-[#1a2d3d] rounded-2xl p-5 flex flex-col justify-between hover:border-[#00d4aa]/30 transition-all duration-200"
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#00d4aa]/10 border border-[#00d4aa]/20">
          <Search className="w-4 h-4 text-[#00d4aa]" />
        </div>
        <div>
          <p className="text-[#e8f0f7] text-sm font-bold leading-tight">Other</p>
          <p className="text-[#475569] text-[10px]">Any trading pair</p>
        </div>
      </div>

      <p className="text-[#64748b] text-xs leading-relaxed mb-4">
        Don&apos;t see your coin? Enter any pair listed on Binance and we&apos;ll analyze it.
      </p>

      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          value={value}
          onChange={(e) => { setValue(e.target.value.toUpperCase()); setError(false); }}
          placeholder="e.g. PEPEUSDT, SUIUSDT…"
          className={`w-full bg-[#050a0e] border rounded-xl px-3 py-2.5 text-[#e8f0f7] placeholder-[#334155] text-xs font-mono focus:outline-none focus:ring-2 transition-all ${
            error
              ? "border-red-500/50 focus:ring-red-500/20"
              : "border-[#1a2d3d] focus:ring-[#00d4aa]/30 focus:border-[#00d4aa]/50"
          }`}
        />
        {error && (
          <p className="text-red-400 text-[10px]">Please enter a valid pair</p>
        )}
        <button
          type="submit"
          className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-gradient-to-r from-[#00d4aa] to-[#0ea5e9] text-white text-xs font-semibold hover:opacity-90 transition-all"
        >
          Analyze This Pair
          <ArrowRight className="w-3 h-3" />
        </button>
      </form>
    </motion.div>
  );
}

export default function MarketOverview() {
  const [coins, setCoins] = useState<CoinPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchPrices = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const res = await fetch("/api/prices");
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setCoins(data.coins ?? []);
      setLastUpdated(new Date());
    } catch {
      // keep existing data
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchPrices();
    const id = setInterval(() => fetchPrices(), 30_000);
    return () => clearInterval(id);
  }, [fetchPrices]);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">Live Market</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#e8f0f7]">
              Top Cryptocurrencies
            </h2>
            <p className="text-[#64748b] text-sm mt-1">
              Real-time prices via Binance · auto-updates every 30s
            </p>
          </div>

          <div className="flex items-center gap-3">
            {lastUpdated && (
              <span className="text-[#475569] text-xs">
                Updated {lastUpdated.toLocaleTimeString()}
              </span>
            )}
            <button
              onClick={() => fetchPrices(true)}
              disabled={refreshing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#1a2d3d] text-[#64748b] text-xs hover:border-[#00d4aa]/40 hover:text-[#00d4aa] transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Coin grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading
            ? Array.from({ length: 9 }).map((_, i) => <CardSkeleton key={i} />)
            : <>
                {coins.map((coin, i) => <CoinCard key={coin.symbol} coin={coin} index={i} />)}
                <OtherCard index={coins.length} />
              </>
          }
        </div>

        {/* Bottom CTA */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-center mt-10"
          >
            <p className="text-[#64748b] text-sm mb-4">
              Want a deep analysis of any of these coins?
            </p>
            <Link
              href="/order"
              className="group inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-[#00d4aa] to-[#0ea5e9] text-white font-semibold text-sm hover:opacity-90 transition-all shadow-lg hover:shadow-[0_0_24px_rgba(0,212,170,0.25)]"
            >
              Order Analysis — from $9
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
