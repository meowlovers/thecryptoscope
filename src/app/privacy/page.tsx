import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = { title: "Privacy Policy — TheChartScope" };

export default function PrivacyPage() {
  const sections = [
    {
      title: "Information We Collect",
      content:
        "We collect only the information necessary to fulfill your order: your email address and the trading pair you request. We do not collect personal identification documents, payment credentials, or sensitive personal information beyond what you voluntarily provide.",
    },
    {
      title: "How We Use Your Information",
      content:
        "Your email address is used solely to deliver your analysis report and, if you opt in, send relevant service updates. We do not sell, trade, or share your personal information with third parties for marketing purposes.",
    },
    {
      title: "Payment Data",
      content:
        "Payments are made directly on the blockchain. We record transaction hashes for order verification but do not store private keys, wallet credentials, or personal financial data. All blockchain transactions are public by nature.",
    },
    {
      title: "Data Retention",
      content:
        "We retain your email and order details for up to 12 months to handle any support requests or disputes. After this period, data is deleted from our systems.",
    },
    {
      title: "Your Rights",
      content:
        "You have the right to request access to, correction of, or deletion of your personal data held by TheChartScope. Contact us at privacy@thechartscope.com to exercise these rights.",
    },
  ];

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-16 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl font-bold text-[#e8f0f7] mb-3">Privacy Policy</h1>
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
