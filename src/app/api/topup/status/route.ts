export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const paymentId = searchParams.get("paymentId");

  if (!paymentId) {
    return NextResponse.json({ error: "Missing paymentId" }, { status: 400 });
  }

  const res = await fetch(`https://api.nowpayments.io/v1/payment/${paymentId}`, {
    headers: {
      "x-api-key": process.env.NOWPAYMENTS_API_KEY!,
    },
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to fetch payment status" }, { status: 502 });
  }

  const data = await res.json();
  return NextResponse.json({ status: data.payment_status });
}
