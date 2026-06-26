"use client";

import { motion } from "framer-motion";
import { cn } from "@/shared/lib/utils";

interface WeatherBackgroundProps {
  gradient: string;
  children: React.ReactNode;
}

export function WeatherBackground({ gradient, children }: WeatherBackgroundProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className={cn(
        "relative min-h-[300px] rounded-2xl bg-gradient-to-br p-1",
        gradient
      )}
    >
      <div className="rounded-xl bg-card/90 backdrop-blur-sm">
        {children}
      </div>
    </motion.div>
  );
}
