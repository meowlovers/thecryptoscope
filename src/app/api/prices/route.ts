export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

const SYMBOLS = [
  "BTCUSDT", "ETHUSDT", "SOLUSDT",
  "BNBUSDT", "XRPUSDT", "ADAUSDT",
  "DOGEUSDT", "AVAXUSDT",
];

const COIN_META: Record<string, { name: string; ticker: string; color: string }> = {
  BTCUSDT:  { name: "Bitcoin",   ticker: "BTC",  color: "#f7931a" },
  ETHUSDT:  { name: "Ethereum",  ticker: "ETH",  color: "#627eea" },
  SOLUSDT:  { name: "Solana",    ticker: "SOL",  color: "#9945ff" },
  BNBUSDT:  { name: "BNB",       ticker: "BNB",  color: "#f3ba2f" },
  XRPUSDT:  { name: "XRP",       ticker: "XRP",  color: "#00aae4" },
  ADAUSDT:  { name: "Cardano",   ticker: "ADA",  color: "#0033ad" },
  DOGEUSDT: { name: "Dogecoin",  ticker: "DOGE", color: "#c2a633" },
  AVAXUSDT: { name: "Avalanche", ticker: "AVAX", color: "#e84142" },
  LTCUSDT:   { name: "Litecoin",  ticker: "LTC",   color: "#bfbbbb" },
};

export interface CoinPrice {
  symbol: string;
  name: string;
  ticker: string;
  color: string;
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
}

export async function GET() {
  try {
    const symbolsParam = encodeURIComponent(JSON.stringify(SYMBOLS));
    const res = await fetch(
      `https://api.binance.com/api/v3/ticker/24hr?symbols=${symbolsParam}`,
      { next: { revalidate: 30 } }
    );

    if (!res.ok) throw new Error(`Binance API error: ${res.status}`);

    const raw = await res.json();

    const coins: CoinPrice[] = raw
      .filter((item: { symbol: string }) => COIN_META[item.symbol])
      .map((item: {
        symbol: string;
        lastPrice: string;
        priceChangePercent: string;
        highPrice: string;
        lowPrice: string;
        quoteVolume: string;
      }) => ({
        symbol: item.symbol,
        ...COIN_META[item.symbol],
        price: parseFloat(item.lastPrice),
        change24h: parseFloat(item.priceChangePercent),
        high24h: parseFloat(item.highPrice),
        low24h: parseFloat(item.lowPrice),
        volume24h: parseFloat(item.quoteVolume),
      }))
      .sort((a: CoinPrice, b: CoinPrice) =>
        SYMBOLS.indexOf(a.symbol) - SYMBOLS.indexOf(b.symbol)
      );

    return NextResponse.json({ coins, updatedAt: Date.now() });
  } catch (err) {
    console.error("Price fetch failed:", err);
    return NextResponse.json({ error: "Failed to fetch prices" }, { status: 502 });
  }
}
