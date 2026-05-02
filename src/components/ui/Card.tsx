import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}

export default function Card({ children, className, glow }: CardProps) {
  return (
    <div
      className={cn(
        "bg-[#0d1821] border border-[#1a2d3d] rounded-2xl p-6",
        glow && "glow-green",
        className
      )}
    >
      {children}
    </div>
  );
}
