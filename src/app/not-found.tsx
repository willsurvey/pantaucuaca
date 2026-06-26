import Link from "next/link";
import { CloudSun } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <CloudSun className="h-16 w-16 text-primary/40" aria-hidden="true" />
      <h1 className="font-[family-name:var(--font-heading)] text-4xl font-bold text-foreground">
        404
      </h1>
      <p className="max-w-md text-muted-foreground">
        Halaman yang kamu cari tidak ditemukan. Mungkin cuacanya sedang tidak bersahabat? 🌧️
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}
