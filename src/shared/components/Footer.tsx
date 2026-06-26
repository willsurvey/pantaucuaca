import { CloudSun, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background/50">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 px-4 py-6 text-center sm:flex-row sm:justify-between sm:text-left">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <CloudSun className="h-4 w-4" aria-hidden="true" />
          <span>
            PantauCuaca &mdash; Cuaca Cerdas, Hidup Lebih Mudah
          </span>
        </div>
        <p className="flex items-center gap-1 text-xs text-muted-foreground">
          Dibuat dengan <Heart className="h-3 w-3 text-red-500" aria-label="cinta" /> di Indonesia
        </p>
      </div>
    </footer>
  );
}
