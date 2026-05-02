import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms of Service — TheChartScope",
};

export default function TermsPage() {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content:
        "By accessing or using TheChartScope's services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.",
    },
    {
      title: "2. Service Description",
      content:
        "TheChartScope provides professional cryptocurrency market analysis reports for educational and informational purposes only. We do not provide financial advice, trading signals, or investment recommendations. Our analysis is intended to help users understand market conditions, not to direct trading decisions.",
    },
    {
      title: "3. Not Financial Advice",
      content:
        "All content provided by TheChartScope, including analysis reports, commentary, and any other materials, is for informational purposes only and does not constitute financial, investment, legal, or tax advice. Always consult a qualified financial professional before making investment decisions.",
    },
    {
      title: "4. Payment & Delivery",
      content:
        "Payment of $5 USD equivalent in cryptocurrency is required before analysis begins. Delivery is within 24–48 hours of payment confirmation. Due to the nature of digital work, all sales are final once the analysis has been delivered.",
    },
    {
      title: "5. No Refund Policy",
      content:
        "All payments are non-refundable once the analysis report has been delivered to your email. If you have not received your report within 48 hours of confirmed payment, contact our support team for resolution.",
    },
    {
      title: "6. Limitation of Liability",
      content:
        "TheChartScope and its analysts are not liable for any financial losses, damages, or decisions made based on our analysis. Cryptocurrency trading involves substantial risk of loss, and past market analysis does not predict future market movements.",
    },
    {
      title: "7. Intellectual Property",
      content:
        "All analysis reports and content produced by TheChartScope are proprietary. You may use reports for personal research only. Redistribution, resale, or public sharing of reports without express written permission is prohibited.",
    },
  ];

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-16 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl font-bold text-[#e8f0f7] mb-3">Terms of Service</h1>
          <p className="text-[#64748b] text-sm mb-10">Last updated: January 2025</p>

          <div className="space-y-8">
            {sections.map((s) => (
              <div key={s.title}>
                <h2 className="text-[#e8f0f7] font-semibold text-base mb-2">{s.title}</h2>
                <p className="text-[#64748b] text-sm leading-relaxed">{s.content}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
