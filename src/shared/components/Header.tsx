"use client";

import { CloudSun, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/shared/lib/utils";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="/" className="flex items-center gap-2" aria-label="PantauCuaca Home">
          <CloudSun className="h-8 w-8 text-primary" aria-hidden="true" />
          <span className="font-[family-name:var(--font-heading)] text-xl font-bold text-foreground">
            PantauCuaca
          </span>
        </a>

        <nav className="hidden items-center gap-6 sm:flex" aria-label="Main navigation">
          <a
            href="#weather"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Cuaca
          </a>
          <a
            href="#recommendations"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Rekomendasi
          </a>
          <a
            href="#chat"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Tanya AI
          </a>
        </nav>

        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-muted sm:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Tutup menu" : "Buka menu"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-border/50 sm:hidden"
            aria-label="Mobile navigation"
          >
            <div className="flex flex-col gap-2 px-4 py-4">
              {[
                { href: "#weather", label: "Cuaca" },
                { href: "#recommendations", label: "Rekomendasi" },
                { href: "#chat", label: "Tanya AI" },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground",
                    "transition-colors hover:bg-muted hover:text-foreground"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
