"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/clerk-safe";
import { Info, Wallet, AlertCircle, LogIn } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";

const popularPairs = [
  "BTCUSDT", "ETHUSDT", "SOLUSDT", "BNBUSDT", "XRPUSDT",
  "ADAUSDT", "DOGEUSDT", "AVAXUSDT", "DOTUSDT", "MATICUSDT",
];

const analysisTypes = [
  {
    id: "technical",
    label: "Technical Analysis",
    price: 9,
    description: "Chart patterns, indicators, support/resistance, trend analysis",
  },
  {
    id: "fundamental",
    label: "Fundamental Analysis",
    price: 9,
    description: "Project fundamentals, tokenomics, adoption, macro context",
  },
  {
    id: "combined",
    label: "Combined Analysis",
    price: 15,
    description: "Full technical + fundamental + sentiment in one comprehensive report",
  },
];

const cryptoPayments = [
  { id: "usdt", label: "USDT (TRC-20 / ERC-20)", symbol: "₮" },
  { id: "btc", label: "Bitcoin (BTC)", symbol: "₿" },
  { id: "eth", label: "Ethereum (ETH)", symbol: "Ξ" },
  { id: "bnb", label: "BNB (BSC)", symbol: "BNB" },
];

const schema = z.object({
  pair: z.string().min(2, "Please enter a trading pair"),
  analysisType: z.enum(["technical", "fundamental", "combined"]),
  email: z.string().email("Please enter a valid email address"),
  notes: z.string().max(500, "Notes must be under 500 characters").optional(),
  paymentMethod: z.enum(["usdt", "btc", "eth", "bnb"]).optional(),
});

type FormData = z.infer<typeof schema>;

interface OrderFormProps {
  prefilledPair?: string;
}

export default function OrderForm({ prefilledPair = "" }: OrderFormProps) {
  const router = useRouter();
  const { isSignedIn, user } = useUser();
  const [step, setStep] = useState<"form" | "payment" | "processing">("form");
  const [pairInput, setPairInput] = useState(prefilledPair);
  const [showDropdown, setShowDropdown] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [orderError, setOrderError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { analysisType: "combined", paymentMethod: "usdt", pair: prefilledPair },
  });

  const selectedType = watch("analysisType");
  const selectedPayment = watch("paymentMethod") ?? "usdt";
  const pairValue = watch("pair");

  const currentPrice = analysisTypes.find((t) => t.id === selectedType)?.price ?? 5;

  // Fetch balance for signed-in users
  useEffect(() => {
    if (!isSignedIn) return;
    setBalanceLoading(true);
    fetch("/api/user/balance")
      .then((r) => r.json())
      .then((d) => setBalance(d.balance ?? 0))
      .catch(() => setBalance(null))
      .finally(() => setBalanceLoading(false));
  }, [isSignedIn]);

  // Pre-fill email from Clerk
  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      setValue("email", user.primaryEmailAddress.emailAddress);
    }
  }, [user, setValue]);

  const filteredPairs = popularPairs.filter((p) =>
    p.toLowerCase().includes(pairInput.toLowerCase())
  );

  async function onSubmit(data: FormData) {
    setOrderError("");
    if (isSignedIn) {
      // Balance flow
      if (balance !== null && balance < currentPrice) {
        setOrderError(`Insufficient balance. You need $${currentPrice} but have $${balance.toFixed(2)}.`);
        return;
      }
      setStep("processing");
      try {
        const res = await fetch("/api/orders/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pair: data.pair,
            analysisType: data.analysisType,
            email: data.email,
            notes: data.notes,
          }),
        });
        const json = await res.json();
        if (!res.ok) {
          setOrderError(json.error ?? "Something went wrong");
          setStep("form");
          return;
        }
        router.push(
          `/order-success?pair=${encodeURIComponent(data.pair)}&email=${encodeURIComponent(data.email)}&type=${data.analysisType}`
        );
      } catch {
        setOrderError("Network error — please try again");
        setStep("form");
      }
    } else {
      // Manual crypto payment flow
      setStep("payment");
    }
  }

  function handleFakePayment() {
    setStep("processing");
    setTimeout(() => {
      router.push(
        `/order-success?pair=${encodeURIComponent(pairValue)}&email=${encodeURIComponent(watch("email"))}&type=${watch("analysisType")}`
      );
    }, 2500);
  }

  if (step === "payment") {
    return (
      <PaymentStep
        onConfirm={handleFakePayment}
        onBack={() => setStep("form")}
        pair={pairValue}
        analysisType={selectedType}
        selectedPayment={selectedPayment}
        paymentOptions={cryptoPayments}
        onSelectPayment={(id) => setValue("paymentMethod", id as FormData["paymentMethod"])}
        price={currentPrice}
      />
    );
  }

  if (step === "processing") {
    return <ProcessingStep />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

      {/* Balance banner for signed-in users */}
      {isSignedIn && (
        <div className={cn(
          "flex items-center justify-between rounded-xl px-4 py-3 border",
          balance !== null && balance >= currentPrice
            ? "bg-emerald-400/5 border-emerald-400/20"
            : "bg-yellow-400/5 border-yellow-400/20"
        )}>
          <div className="flex items-center gap-2.5">
            <Wallet className={cn("w-4 h-4", balance !== null && balance >= currentPrice ? "text-emerald-400" : "text-yellow-400")} />
            <div>
              <p className="text-[#e8f0f7] text-sm font-semibold">
                {balanceLoading ? "Loading balance…" : `Balance: $${(balance ?? 0).toFixed(2)} USDT`}
              </p>
              <p className="text-[#64748b] text-xs">
                {balance !== null && balance >= currentPrice
                  ? "✓ Ready to order — will be deducted on confirm"
                  : `Need $${currentPrice} — top up your account first`}
              </p>
            </div>
          </div>
          {balance !== null && balance < currentPrice && (
            <Link
              href="/dashboard/topup"
              className="shrink-0 px-3 py-1.5 rounded-lg bg-[#00d4aa]/10 border border-[#00d4aa]/30 text-[#00d4aa] text-xs font-semibold hover:bg-[#00d4aa]/20 transition-colors"
            >
              Add Credits
            </Link>
          )}
        </div>
      )}

      {/* Not signed in nudge */}
      {!isSignedIn && (
        <div className="flex items-center gap-3 bg-[#0d1821] border border-[#1a2d3d] rounded-xl px-4 py-3">
          <LogIn className="w-4 h-4 text-[#00d4aa] shrink-0" />
          <p className="text-[#64748b] text-xs">
            <Link href="/sign-in" className="text-[#00d4aa] font-semibold hover:underline">Sign in</Link>
            {" "}to use your credit balance and track orders — or continue as guest with crypto payment.
          </p>
        </div>
      )}

      {/* Trading Pair */}
      <div>
        <label className="block text-sm font-semibold text-[#e8f0f7] mb-2">
          Trading Pair <span className="text-[#00d4aa]">*</span>
        </label>
        <div className="relative">
          <input
            {...register("pair")}
            value={pairInput}
            onChange={(e) => {
              setPairInput(e.target.value.toUpperCase());
              setValue("pair", e.target.value.toUpperCase());
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
            placeholder="e.g. BTCUSDT, ETHUSDT, SOLUSDT..."
            className={cn(
              "w-full bg-[#0d1821] border rounded-xl px-4 py-3 text-[#e8f0f7] placeholder-[#475569] text-sm font-mono focus:outline-none focus:ring-2 transition-all",
              errors.pair
                ? "border-red-500/60 focus:ring-red-500/30"
                : "border-[#1a2d3d] focus:ring-[#00d4aa]/30 focus:border-[#00d4aa]/50"
            )}
          />
          {showDropdown && pairInput && filteredPairs.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-[#0d1821] border border-[#1a2d3d] rounded-xl overflow-hidden z-20 shadow-xl">
              {filteredPairs.slice(0, 6).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => { setPairInput(p); setValue("pair", p); setShowDropdown(false); }}
                  className="w-full text-left px-4 py-2.5 text-sm font-mono text-[#94a3b8] hover:bg-[#1a2d3d] hover:text-[#00d4aa] transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>
          )}
          {showDropdown && !pairInput && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-[#0d1821] border border-[#1a2d3d] rounded-xl overflow-hidden z-20 shadow-xl">
              <p className="px-4 py-2 text-xs text-[#475569]">Popular pairs</p>
              {popularPairs.slice(0, 8).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => { setPairInput(p); setValue("pair", p); setShowDropdown(false); }}
                  className="w-full text-left px-4 py-2.5 text-sm font-mono text-[#94a3b8] hover:bg-[#1a2d3d] hover:text-[#00d4aa] transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
        {errors.pair && <p className="text-red-400 text-xs mt-1.5">{errors.pair.message}</p>}
        <p className="text-[#475569] text-xs mt-1.5">You can enter any trading pair — we analyze all major and minor altcoins.</p>
      </div>

      {/* Analysis Type */}
      <div>
        <label className="block text-sm font-semibold text-[#e8f0f7] mb-3">
          Analysis Type <span className="text-[#00d4aa]">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {analysisTypes.map((type) => (
            <button
              key={type.id}
              type="button"
              onClick={() => setValue("analysisType", type.id as FormData["analysisType"])}
              className={cn(
                "relative text-left p-4 rounded-xl border transition-all",
                selectedType === type.id
                  ? "border-[#00d4aa]/60 bg-[#00d4aa]/5"
                  : "border-[#1a2d3d] bg-[#0d1821] hover:border-[#1a2d3d]/80 hover:bg-[#0d1e2b]"
              )}
            >
              {selectedType === type.id && (
                <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-[#00d4aa] flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
              <p className={cn("text-sm font-semibold mb-1", selectedType === type.id ? "text-[#00d4aa]" : "text-[#e8f0f7]")}>
                {type.label}
              </p>
              <p className="text-[#64748b] text-xs leading-relaxed mb-2">{type.description}</p>
              <p className={cn("text-xs font-bold", selectedType === type.id ? "text-[#00d4aa]" : "text-[#475569]")}>
                ${type.price}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-semibold text-[#e8f0f7] mb-2">
          Email Address <span className="text-[#00d4aa]">*</span>
        </label>
        <input
          {...register("email")}
          type="email"
          placeholder="you@example.com"
          className={cn(
            "w-full bg-[#0d1821] border rounded-xl px-4 py-3 text-[#e8f0f7] placeholder-[#475569] text-sm focus:outline-none focus:ring-2 transition-all",
            errors.email
              ? "border-red-500/60 focus:ring-red-500/30"
              : "border-[#1a2d3d] focus:ring-[#00d4aa]/30 focus:border-[#00d4aa]/50"
          )}
        />
        {errors.email && <p className="text-red-400 text-xs mt-1.5">{errors.email.message}</p>}
        <p className="text-[#475569] text-xs mt-1.5 flex items-center gap-1">
          <Info className="w-3 h-3" />
          Your analysis will be delivered to this address within 24–48 hours.
        </p>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-semibold text-[#e8f0f7] mb-2">
          Additional Notes <span className="text-[#475569] font-normal">(optional)</span>
        </label>
        <textarea
          {...register("notes")}
          rows={3}
          placeholder="Any specific questions or areas you'd like us to focus on?"
          className="w-full bg-[#0d1821] border border-[#1a2d3d] rounded-xl px-4 py-3 text-[#e8f0f7] placeholder-[#475569] text-sm focus:outline-none focus:ring-2 focus:ring-[#00d4aa]/30 focus:border-[#00d4aa]/50 transition-all resize-none"
        />
      </div>

      {/* Payment method — only for guests */}
      {!isSignedIn && (
        <div>
          <label className="block text-sm font-semibold text-[#e8f0f7] mb-3">
            Payment Method <span className="text-[#00d4aa]">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {cryptoPayments.map((method) => (
              <button
                key={method.id}
                type="button"
                onClick={() => setValue("paymentMethod", method.id as FormData["paymentMethod"])}
                className={cn(
                  "relative text-center p-3 rounded-xl border transition-all",
                  selectedPayment === method.id
                    ? "border-[#00d4aa]/60 bg-[#00d4aa]/5"
                    : "border-[#1a2d3d] bg-[#0d1821] hover:border-[#1a2d3d]/80"
                )}
              >
                <p className={cn("text-lg font-bold mb-0.5", selectedPayment === method.id ? "text-[#00d4aa]" : "text-[#e8f0f7]")}>
                  {method.symbol}
                </p>
                <p className="text-[#64748b] text-xs">{method.id.toUpperCase()}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Error */}
      {orderError && (
        <div className="flex items-center gap-2 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" /> {orderError}
        </div>
      )}

      {/* Price + Submit */}
      <div className="pt-2">
        <div className="flex items-center justify-between bg-[#0d1821] border border-[#1a2d3d] rounded-xl px-5 py-4 mb-4">
          <div>
            <p className="text-[#64748b] text-sm">Total due</p>
            <p className="text-[#e8f0f7] font-bold text-xl">${currentPrice}.00 USD</p>
          </div>
          <div className="text-right">
            {isSignedIn
              ? <p className="text-[#00d4aa] text-sm font-semibold">Paid from balance</p>
              : <p className="text-[#00d4aa] text-sm font-semibold">Paid in {selectedPayment.toUpperCase()}</p>
            }
          </div>
        </div>

        <Button type="submit" size="lg" className="w-full">
          {isSignedIn ? `Confirm Order — $${currentPrice}` : "Continue to Payment"}
        </Button>

        <p className="text-[#475569] text-xs text-center mt-3">
          By continuing, you agree to our Terms of Service. No refunds on completed analyses.
        </p>
      </div>
    </form>
  );
}

/* ─── Payment Step (guest flow) ─── */

const fakeAddresses: Record<string, string> = {
  usdt: "TRx9Aa8bCd2EfGhIjKlMnOpQrStUvWxYz",
  btc:  "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
  eth:  "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
  bnb:  "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
};

function PaymentStep({
  onConfirm, onBack, pair, analysisType, selectedPayment, paymentOptions, onSelectPayment, price,
}: {
  onConfirm: () => void;
  onBack: () => void;
  pair: string;
  analysisType: string;
  selectedPayment: string;
  paymentOptions: { id: string; label: string; symbol: string }[];
  onSelectPayment: (id: string) => void;
  price: number;
}) {
  const [copied, setCopied] = useState<string | null>(null);

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    });
  }

  return (
    <div className="space-y-6">
      <div className="bg-[#0d1821] border border-[#1a2d3d] rounded-xl p-5">
        <p className="text-[#64748b] text-xs font-semibold uppercase tracking-wider mb-3">Order Summary</p>
        <div className="space-y-2">
          {[
            { label: "Trading Pair", value: pair },
            { label: "Analysis Type", value: analysisType.charAt(0).toUpperCase() + analysisType.slice(1) + " Analysis" },
            { label: "Price", value: `$${price}.00 USD` },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between">
              <span className="text-[#64748b] text-sm">{label}</span>
              <span className={cn("text-sm font-semibold", label === "Price" ? "text-[#00d4aa]" : "text-[#e8f0f7] font-mono")}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-[#e8f0f7] mb-3">Select Payment Network</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
          {paymentOptions.map((m) => (
            <button key={m.id} onClick={() => onSelectPayment(m.id)}
              className={cn("text-center p-2.5 rounded-lg border text-xs transition-all",
                selectedPayment === m.id ? "border-[#00d4aa]/60 bg-[#00d4aa]/5 text-[#00d4aa]" : "border-[#1a2d3d] text-[#64748b] hover:border-[#1a2d3d]/80"
              )}>
              {m.id.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="bg-[#0d1821] border border-[#1a2d3d] rounded-xl p-4 mb-4">
          <p className="text-[#64748b] text-xs mb-1.5">Send to this address</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-[#94a3b8] text-xs font-mono break-all leading-relaxed">
              {fakeAddresses[selectedPayment]}
            </code>
            <button onClick={() => copy(fakeAddresses[selectedPayment], "addr")}
              className="flex-shrink-0 text-xs text-[#64748b] hover:text-[#00d4aa] border border-[#1a2d3d] rounded-lg px-3 py-1.5 transition-colors">
              {copied === "addr" ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
        <p className="text-[#475569] text-xs flex items-start gap-1.5">
          <Info className="w-3 h-3 flex-shrink-0 mt-0.5" />
          After sending, click &quot;I&apos;ve Paid&quot; below. We will verify the transaction and begin your analysis.
        </p>
      </div>

      <div className="flex gap-3">
        <button onClick={onBack} className="flex-1 py-3 rounded-xl border border-[#1a2d3d] text-[#94a3b8] text-sm font-semibold hover:bg-[#0d1821] transition-colors">
          ← Back
        </button>
        <Button onClick={onConfirm} className="flex-[2]" size="lg">
          I&apos;ve Paid — Confirm Order
        </Button>
      </div>
    </div>
  );
}

function ProcessingStep() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-full border-4 border-[#00d4aa]/30 border-t-[#00d4aa] animate-spin mb-6" />
      <h3 className="text-[#e8f0f7] font-bold text-xl mb-2">Processing Order…</h3>
      <p className="text-[#64748b] text-sm max-w-xs">
        Placing your order. This will only take a moment.
      </p>
    </div>
  );
}
