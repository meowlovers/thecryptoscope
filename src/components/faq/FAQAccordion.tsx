"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQ {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  faqs: FAQ[];
}

export default function FAQAccordion({ faqs }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {faqs.map((faq, i) => (
        <div
          key={i}
          className={cn(
            "bg-[#0d1821] border rounded-xl overflow-hidden transition-all",
            openIndex === i ? "border-[#00d4aa]/30" : "border-[#1a2d3d]"
          )}
        >
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full flex items-center justify-between px-5 py-4 text-left"
          >
            <span className="text-[#e8f0f7] text-sm font-semibold pr-4">{faq.question}</span>
            <ChevronDown
              className={cn(
                "w-4 h-4 text-[#64748b] flex-shrink-0 transition-transform duration-200",
                openIndex === i && "rotate-180 text-[#00d4aa]"
              )}
            />
          </button>
          {openIndex === i && (
            <div className="px-5 pb-5">
              <p className="text-[#64748b] text-sm leading-relaxed">{faq.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
