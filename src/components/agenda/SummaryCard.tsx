import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SummaryCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  variant: "amber" | "emerald" | "red";
  hint?: string;
}

const variantStyles = {
  amber: "bg-gradient-amber",
  emerald: "bg-gradient-emerald",
  red: "bg-gradient-red",
};

export function SummaryCard({ title, value, icon: Icon, variant, hint }: SummaryCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl p-6 text-white shadow-card transition-transform hover:-translate-y-0.5",
        variantStyles[variant]
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-white/80">
            {title}
          </p>
          <p className="mt-2 text-3xl font-bold">{value}</p>
          {hint && <p className="mt-1 text-sm text-white/80">{hint}</p>}
        </div>
        <div className="rounded-xl bg-white/20 p-3 backdrop-blur-sm">
          <Icon className="h-6 w-6" />
        </div>
      </div>
      <div className="absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-white/10" />
    </div>
  );
}
