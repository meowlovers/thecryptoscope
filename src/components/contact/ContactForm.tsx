"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Please enter a valid email"),
  subject: z.string().min(3, "Please enter a subject"),
  message: z.string().min(10, "Message must be at least 10 characters").max(1000, "Message too long"),
});

type FormData = z.infer<typeof schema>;

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    await new Promise((r) => setTimeout(r, 1000));
    console.log("Contact form:", data);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-14 text-center">
        <div className="w-16 h-16 rounded-full bg-[#00d4aa]/10 border border-[#00d4aa]/30 flex items-center justify-center mb-4">
          <CheckCircle className="w-8 h-8 text-[#00d4aa]" />
        </div>
        <h3 className="text-[#e8f0f7] font-bold text-xl mb-2">Message Sent!</h3>
        <p className="text-[#64748b] text-sm max-w-xs">
          Thank you for reaching out. We&apos;ll get back to you within a few hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-semibold text-[#e8f0f7] mb-2">Name</label>
          <input
            {...register("name")}
            placeholder="Your name"
            className={cn(
              "w-full bg-[#0d1821] border rounded-xl px-4 py-3 text-[#e8f0f7] placeholder-[#475569] text-sm focus:outline-none focus:ring-2 transition-all",
              errors.name
                ? "border-red-500/60 focus:ring-red-500/30"
                : "border-[#1a2d3d] focus:ring-[#00d4aa]/30 focus:border-[#00d4aa]/50"
            )}
          />
          {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#e8f0f7] mb-2">Email</label>
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
          {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#e8f0f7] mb-2">Subject</label>
        <input
          {...register("subject")}
          placeholder="What's this about?"
          className={cn(
            "w-full bg-[#0d1821] border rounded-xl px-4 py-3 text-[#e8f0f7] placeholder-[#475569] text-sm focus:outline-none focus:ring-2 transition-all",
            errors.subject
              ? "border-red-500/60 focus:ring-red-500/30"
              : "border-[#1a2d3d] focus:ring-[#00d4aa]/30 focus:border-[#00d4aa]/50"
          )}
        />
        {errors.subject && <p className="text-red-400 text-xs mt-1">{errors.subject.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#e8f0f7] mb-2">Message</label>
        <textarea
          {...register("message")}
          rows={5}
          placeholder="Describe your question or issue in detail…"
          className={cn(
            "w-full bg-[#0d1821] border rounded-xl px-4 py-3 text-[#e8f0f7] placeholder-[#475569] text-sm focus:outline-none focus:ring-2 transition-all resize-none",
            errors.message
              ? "border-red-500/60 focus:ring-red-500/30"
              : "border-[#1a2d3d] focus:ring-[#00d4aa]/30 focus:border-[#00d4aa]/50"
          )}
        />
        {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message.message}</p>}
      </div>

      <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
        Send Message
      </Button>
    </form>
  );
}
