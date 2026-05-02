import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TicketForm from "@/components/contact/TicketForm";
import { Mail, Clock, MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact — TheCryptoScope",
  description: "Get in touch with the TheCryptoScope team for support or inquiries.",
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-16 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00d4aa]/10 border border-[#00d4aa]/20 text-[#00d4aa] text-xs font-medium mb-4">
              Get In Touch
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#e8f0f7] mb-4">
              Contact & Support
            </h1>
            <p className="text-[#64748b] text-base max-w-xl mx-auto">
              Have a question about your order, our service, or anything else?
              We&apos;re here to help. Expect a response within a few hours.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact info */}
            <div className="space-y-5">
              {[
                {
                  icon: Mail,
                  title: "Email Support",
                  value: "support@thecryptoscope.com",
                  sub: "We respond within 2–4 hours",
                },
                {
                  icon: MessageCircle,
                  title: "Telegram",
                  value: "@TheCryptoScopeSupport",
                  sub: "For quick questions & order updates",
                },
                {
                  icon: Clock,
                  title: "Support Hours",
                  value: "24 / 7",
                  sub: "We operate across all time zones",
                },
              ].map(({ icon: Icon, title, value, sub }) => (
                <div
                  key={title}
                  className="bg-[#0d1821] border border-[#1a2d3d] rounded-2xl p-5 flex gap-4 items-start"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#00d4aa]/10 border border-[#00d4aa]/15 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-[#00d4aa]" />
                  </div>
                  <div>
                    <p className="text-[#64748b] text-xs">{title}</p>
                    <p className="text-[#e8f0f7] font-semibold text-sm mt-0.5">{value}</p>
                    <p className="text-[#475569] text-xs mt-0.5">{sub}</p>
                  </div>
                </div>
              ))}

              {/* Missing analysis notice */}
              <div className="bg-[#0ea5e9]/5 border border-[#0ea5e9]/20 rounded-2xl p-5">
                <p className="text-[#0ea5e9] text-xs font-semibold mb-1">
                  Haven&apos;t received your report?
                </p>
                <p className="text-[#64748b] text-xs leading-relaxed">
                  If it&apos;s been more than 48 hours since your confirmed payment,
                  please contact us with your order ID and payment transaction hash.
                  We&apos;ll resolve it immediately.
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              <div className="bg-[#0d1821] border border-[#1a2d3d] rounded-2xl p-6 sm:p-8">
                <TicketForm />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
