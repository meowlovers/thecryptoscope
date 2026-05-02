import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import Link from "next/link";
import { TrendingUp } from "lucide-react";

export default function SignInPage() {
  return (
    <main className="min-h-screen bg-[#050a0e] flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#00d4aa]/5 blur-[120px] pointer-events-none" />

      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 mb-8 group">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00d4aa] to-[#0ea5e9] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
          <TrendingUp className="w-5 h-5 text-white" strokeWidth={2.5} />
        </div>
        <span className="font-bold text-xl tracking-tight">
          <span className="bg-gradient-to-r from-[#00d4aa] to-[#0ea5e9] bg-clip-text text-transparent">TheChart</span>
          <span className="text-[#e8f0f7]">Scope</span>
        </span>
      </Link>

      <SignIn
        appearance={{
          baseTheme: dark,
          variables: {
            colorPrimary: "#00d4aa",
            colorBackground: "#0d1821",
            colorText: "#e8f0f7",
            colorTextSecondary: "#94a3b8",
            colorInputBackground: "#050a0e",
            colorInputText: "#e8f0f7",
            colorNeutral: "#94a3b8",
            borderRadius: "12px",
          },
          elements: {
            rootBox: "w-full max-w-md",
            card: "border border-[#1a2d3d] shadow-2xl",
            formButtonPrimary: "bg-gradient-to-r from-[#00d4aa] to-[#0ea5e9] hover:opacity-90 transition-opacity",
            footerActionLink: "text-[#00d4aa] hover:text-[#00d4aa]/80",
            formResendCodeLink: "text-[#00d4aa]",
            identityPreviewEditButton: "text-[#00d4aa]",
          },
        }}
      />

      <p className="text-[#475569] text-xs mt-6">
        Don&apos;t have an account?{" "}
        <Link href="/sign-up" className="text-[#00d4aa] hover:underline font-medium">
          Sign up free
        </Link>
      </p>
    </main>
  );
}
