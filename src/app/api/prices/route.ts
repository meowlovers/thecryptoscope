export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

const COINGECKO_IDS = [
  "bitcoin", "ethereum", "solana",
  "binancecoin", "ripple", "cardano",
  "dogecoin", "avalanche-2",
];

const COIN_META: Record<string, { symbol: string; ticker: string; color: string }> = {
  bitcoin:      { symbol: "BTCUSDT",  ticker: "BTC",  color: "#f7931a" },
  ethereum:     { symbol: "ETHUSDT",  ticker: "ETH",  color: "#627eea" },
  solana:       { symbol: "SOLUSDT",  ticker: "SOL",  color: "#9945ff" },
  binancecoin:  { symbol: "BNBUSDT",  ticker: "BNB",  color: "#f3ba2f" },
  ripple:       { symbol: "XRPUSDT",  ticker: "XRP",  color: "#00aae4" },
  cardano:      { symbol: "ADAUSDT",  ticker: "ADA",  color: "#0033ad" },
  dogecoin:     { symbol: "DOGEUSDT", ticker: "DOGE", color: "#c2a633" },
  "avalanche-2":{ symbol: "AVAXUSDT", ticker: "AVAX", color: "#e84142" },
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
    const ids = COINGECKO_IDS.join(",");
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&per_page=8&page=1&sparkline=false&price_change_percentage=24h`,
      {
        headers: { "Accept": "application/json" },
        next: { revalidate: 30 },
      }
    );

    if (!res.ok) throw new Error(`CoinGecko API error: ${res.status}`);

    const raw = await res.json();

    const coins: CoinPrice[] = raw
      .filter((item: { id: string }) => COIN_META[item.id])
      .map((item: {
        id: string;
        name: string;
        current_price: number;
        price_change_percentage_24h: number;
        high_24h: number;
        low_24h: number;
        total_volume: number;
      }) => ({
        symbol: COIN_META[item.id].symbol,
        name: item.name,
        ticker: COIN_META[item.id].ticker,
        color: COIN_META[item.id].color,
        price: item.current_price,
        change24h: item.price_change_percentage_24h ?? 0,
        high24h: item.high_24h,
        low24h: item.low_24h,
        volume24h: item.total_volume,
      }))
      .sort((a: CoinPrice, b: CoinPrice) =>
        COINGECKO_IDS.indexOf(
          Object.keys(COIN_META).find(k => COIN_META[k].ticker === a.ticker) ?? ""
        ) -
        COINGECKO_IDS.indexOf(
          Object.keys(COIN_META).find(k => COIN_META[k].ticker === b.ticker) ?? ""
        )
      );

    return NextResponse.json({ coins, updatedAt: Date.now() });
  } catch (err) {
    console.error("Price fetch failed:", err);
    return NextResponse.json({ error: "Failed to fetch prices" }, { status: 502 });
  }
}
