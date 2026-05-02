import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = { title: "Disclaimer — TheCryptoScope" };

export default function DisclaimerPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-16 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl font-bold text-[#e8f0f7] mb-3">Disclaimer</h1>
          <p className="text-[#64748b] text-sm mb-10">Last updated: January 2025</p>

          <div className="bg-[#0d1821] border border-[#1a2d3d] rounded-2xl p-6 sm:p-8">
            <p className="text-[#64748b] text-sm leading-relaxed mb-4">
              <strong className="text-[#e8f0f7]">TheCryptoScope is not a financial advisor.</strong>{" "}
              All analysis reports, commentary, and any other content produced by TheCryptoScope are
              provided for educational and informational purposes only. Nothing on this website or in
              any report constitutes financial advice, investment advice, trading advice, or any other
              sort of advice.
            </p>
            <p className="text-[#64748b] text-sm leading-relaxed mb-4">
              Cryptocurrency markets are highly volatile and speculative. Trading or investing in
              cryptocurrencies carries a high risk of financial loss. Past market behavior and
              analysis do not guarantee or predict future market movements.
            </p>
            <p className="text-[#64748b] text-sm leading-relaxed mb-4">
              TheCryptoScope does not recommend that any cryptocurrency should be bought, sold, or held.
              Each individual must conduct their own due diligence and consult with a qualified
              financial professional before making any investment decision.
            </p>
            <p className="text-[#64748b] text-sm leading-relaxed">
              By using TheCryptoScope&apos;s services, you acknowledge and accept that any action taken
              based on our analysis is at your own risk. TheCryptoScope and its team members bear no
              responsibility for any financial losses incurred as a result of using our content.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
