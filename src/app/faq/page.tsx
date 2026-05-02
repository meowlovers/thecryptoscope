import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FAQAccordion from "@/components/faq/FAQAccordion";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "FAQ — TheCryptoScope",
  description: "Frequently asked questions about TheCryptoScope's crypto market analysis service.",
};

const faqCategories = [
  {
    category: "About the Service",
    faqs: [
      {
        question: "What exactly does TheCryptoScope provide?",
        answer:
          "TheCryptoScope provides professional, in-depth market analysis of cryptocurrency trading pairs. Each report covers technical chart analysis (patterns, indicators, support/resistance), fundamental context, and sentiment. We do NOT provide trading signals or financial advice — only thorough, educational analysis.",
      },
      {
        question: "Is this financial advice?",
        answer:
          "No. TheCryptoScope's reports are for educational and informational purposes only. Nothing in our analysis constitutes financial, investment, or trading advice. Always conduct your own research and consult a qualified financial advisor before making investment decisions.",
      },
      {
        question: "Do you guarantee profits or specific outcomes?",
        answer:
          "Absolutely not. Cryptocurrency markets are highly volatile and unpredictable. Our analysis can help you understand the market better, but no analysis — from us or anyone — can guarantee future prices or outcomes.",
      },
      {
        question: "What trading pairs can I request analysis for?",
        answer:
          "We can analyze any actively traded cryptocurrency pair. Popular requests include BTCUSDT, ETHUSDT, SOLUSDT, BNBUSDT, XRPUSDT, ADAUSDT, and many more. If a pair is actively listed on major exchanges, we can analyze it.",
      },
    ],
  },
  {
    category: "Orders & Delivery",
    faqs: [
      {
        question: "How do I place an order?",
        answer:
          "Click 'Order Analysis' from the homepage or navigation menu. Fill in the form with your trading pair, analysis type, and email. Then complete the cryptocurrency payment (from $9). That's it — we take it from there.",
      },
      {
        question: "How long does delivery take?",
        answer:
          "We commit to delivering every analysis within 24–48 hours of payment confirmation. In practice, most orders are delivered faster — often within 12–24 hours. Complex or niche altcoin analyses may take slightly longer.",
      },
      {
        question: "How will I receive my analysis?",
        answer:
          "Your analysis will be delivered directly to the email address you provided during checkout. You'll receive a detailed PDF report with charts, commentary, and findings.",
      },
      {
        question: "Can I request a specific focus area?",
        answer:
          "Yes. During the order process, you can include notes or specific questions in the 'Additional Notes' field. For example: 'Is this a good accumulation zone?', 'What are the key levels to watch this week?', or 'What does the on-chain data suggest?'",
      },
    ],
  },
  {
    category: "Payment",
    faqs: [
      {
        question: "How much does one analysis cost?",
        answer:
          "Analysis starts from $9 USD equivalent, paid in cryptocurrency. Technical and Fundamental analyses are $9, Combined is $15. There are no subscriptions, no hidden fees, and no recurring charges. You pay per analysis, when you need one.",
      },
      {
        question: "What cryptocurrencies do you accept?",
        answer:
          "We currently accept USDT (TRC-20 and ERC-20), Bitcoin (BTC), Ethereum (ETH), and BNB (BSC). Additional payment options may be added in the future.",
      },
      {
        question: "Is my payment secure?",
        answer:
          "Yes. All payments are made directly on the blockchain — we never handle your private keys or store payment credentials. Crypto payments are inherently secure, transparent, and borderless.",
      },
      {
        question: "Can I get a refund?",
        answer:
          "Due to the nature of digital analysis work, we do not offer refunds once an analysis has been completed and delivered. If you have not received your report within 48 hours of confirmed payment, please contact our support team.",
      },
    ],
  },
  {
    category: "Analysis Quality",
    faqs: [
      {
        question: "Who writes the analysis reports?",
        answer:
          "All reports are written by our team of experienced crypto traders and analysts — not automated tools or AI. Each analyst has years of hands-on trading experience and deep expertise in their specialization.",
      },
      {
        question: "What's the difference between Technical, Fundamental, and Combined analysis?",
        answer:
          "Technical Analysis focuses on price charts, patterns, indicators, and market structure. Fundamental Analysis examines the project's underlying value, tokenomics, adoption, and macro context. Combined Analysis delivers both in a single comprehensive report, plus sentiment data — this is our most popular option.",
      },
      {
        question: "Do you cover multiple timeframes?",
        answer:
          "Yes. Our technical analysis covers multiple timeframes — from shorter-term (15-minute, 1-hour) intraday views to the weekly or monthly macro picture. The exact timeframes covered will be noted in your report.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-16 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00d4aa]/10 border border-[#00d4aa]/20 text-[#00d4aa] text-xs font-medium mb-4">
              FAQ
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#e8f0f7] mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-[#64748b] text-base max-w-xl mx-auto">
              Everything you need to know about TheCryptoScope and our analysis service.
              Can&apos;t find your answer?{" "}
              <Link href="/contact" className="text-[#00d4aa] hover:underline">
                Contact us
              </Link>
              .
            </p>
          </div>

          {/* FAQ Categories */}
          <div className="space-y-10">
            {faqCategories.map((cat) => (
              <div key={cat.category}>
                <h2 className="text-[#e8f0f7] font-bold text-lg mb-4 flex items-center gap-2">
                  <div className="w-1 h-5 rounded-full bg-gradient-to-b from-[#00d4aa] to-[#0ea5e9]" />
                  {cat.category}
                </h2>
                <FAQAccordion faqs={cat.faqs} />
              </div>
            ))}
          </div>

          {/* Still have questions */}
          <div className="mt-14 bg-[#0d1821] border border-[#1a2d3d] rounded-2xl p-8 text-center">
            <h3 className="text-[#e8f0f7] font-bold text-lg mb-2">
              Still have questions?
            </h3>
            <p className="text-[#64748b] text-sm mb-6">
              Our team is available to help. Reach out and we&apos;ll get back to you within a few hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/contact"
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-[#1a2d3d] text-[#94a3b8] font-semibold text-sm hover:bg-[#1a2d3d] hover:text-[#e8f0f7] transition-all"
              >
                Contact Support
              </Link>
              <Link
                href="/order"
                className="group flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#00d4aa] to-[#0ea5e9] text-white font-semibold text-sm hover:opacity-90 transition-all shadow-lg"
              >
                Order Analysis — from $9
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
