import { Loader2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
}

const sizeMap = { sm: "h-4 w-4", md: "h-6 w-6", lg: "h-8 w-8" } as const;

export function LoadingSpinner({
  size = "md",
  className,
  label = "Memuat...",
}: LoadingSpinnerProps) {
  return (
    <div className={cn("flex items-center justify-center gap-2", className)} role="status" aria-label={label}>
      <Loader2 className={cn("animate-spin text-primary", sizeMap[size])} aria-hidden="true" />
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  );
}

export function SkeletonPulse({ className }: { className?: string }) {
  return (
    <div
      className={cn("animate-pulse rounded-xl bg-muted", className)}
      aria-hidden="true"
    />
  );
}

export function WeatherCardSkeleton() {
  return (
    <div className="space-y-4 rounded-xl border border-border/50 bg-card p-6" aria-hidden="true">
      <div className="flex items-center justify-between">
        <SkeletonPulse className="h-8 w-32" />
        <SkeletonPulse className="h-12 w-12 rounded-full" />
      </div>
      <SkeletonPulse className="h-16 w-24" />
      <SkeletonPulse className="h-4 w-48" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonPulse key={i} className="h-16 w-full" />
        ))}
      </div>
    </div>
  );
}

export function HourlyForecastSkeleton() {
  return (
    <div className="flex gap-3 overflow-hidden" aria-hidden="true">
      {Array.from({ length: 6 }).map((_, i) => (
        <SkeletonPulse key={i} className="h-24 w-20 shrink-0 rounded-xl" />
      ))}
    </div>
  );
}

export function DailyForecastSkeleton() {
  return (
    <div className="space-y-2" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <SkeletonPulse key={i} className="h-14 w-full rounded-xl" />
      ))}
    </div>
  );
}

export function ChatSkeleton() {
  return (
    <div className="flex h-96 items-center justify-center rounded-xl border border-border/50 bg-card" aria-hidden="true">
      <LoadingSpinner label="Memuat chat..." />
    </div>
  );
}
