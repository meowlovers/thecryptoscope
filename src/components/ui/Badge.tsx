import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "green" | "blue" | "muted";
  className?: string;
}

export default function Badge({ children, variant = "green", className }: BadgeProps) {
  const variants = {
    green: "bg-[#00d4aa]/10 text-[#00d4aa] border border-[#00d4aa]/20",
    blue: "bg-[#0ea5e9]/10 text-[#0ea5e9] border border-[#0ea5e9]/20",
    muted: "bg-[#1a2d3d] text-[#64748b] border border-[#1a2d3d]",
  };

  return (
    <span className={cn("inline-flex items-center px-3 py-1 rounded-full text-xs font-medium", variants[variant], className)}>
      {children}
    </span>
  );
}
