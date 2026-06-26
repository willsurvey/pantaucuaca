"use client";

import React, { ComponentType, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ComponentType<{ error: Error; reset: () => void }>;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // You can log the error to an error reporting service here
    console.error("Error caught by ErrorBoundary:", error, info);
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return <FallbackComponent error={this.state.error} reset={this.reset} />;
    }
    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error: Error;
  reset: () => void;
  title?: string;
}

export function DefaultErrorFallback({ error, reset, title }: ErrorFallbackProps) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-4 rounded-xl border border-destructive/20 bg-destructive/5 p-8 text-center"
      role="alert"
    >
      <AlertTriangle className="h-10 w-10 text-destructive" aria-hidden="true" />
      <h3 className="font-[family-name:var(--font-heading)] text-lg font-semibold text-foreground">
        {title || "Terjadi Kesalahan"}
      </h3>
      <p className="max-w-md text-sm text-muted-foreground">
        {error.message || "Tidak bisa memuat data. Coba lagi nanti."}
      </p>
      <button
        onClick={reset}
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        <RefreshCw className="h-4 w-4" aria-hidden="true" />
        Coba Lagi
      </button>
    </div>
  );
}

export function WeatherErrorFallback({ error, reset }: ErrorFallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-border/50 bg-card p-8 text-center" role="alert">
      <AlertTriangle className="h-10 w-10 text-amber-500" aria-hidden="true" />
      <h3 className="font-[family-name:var(--font-heading)] text-lg font-semibold text-foreground">
        Data Cuaca Tidak Tersedia
      </h3>
      <p className="max-w-md text-sm text-muted-foreground">
        {error.message.includes("404")
          ? "Kota tidak ditemukan. Periksa kembali nama kota yang dimasukkan."
          : error.message.includes("Failed to fetch")
            ? "Tidak ada koneksi internet. Periksa koneksi Anda dan coba lagi."
            : "Tidak bisa memuat data cuaca saat ini. Silakan coba lagi nanti."}
      </p>
      <button
        onClick={reset}
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        <RefreshCw className="h-4 w-4" aria-hidden="true" />
        Coba Lagi
      </button>
    </div>
  );
}

export function ChatErrorFallback({ error, reset }: ErrorFallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-border/50 bg-card p-8 text-center" role="alert">
      <AlertTriangle className="h-10 w-10 text-amber-500" aria-hidden="true" />
      <h3 className="font-[family-name:var(--font-heading)] text-lg font-semibold text-foreground">
        AI Tidak Tersedia
      </h3>
      <p className="max-w-md text-sm text-muted-foreground">
        {error.message || "Tidak bisa terhubung ke asisten AI. Silakan coba lagi nanti."}
      </p>
      <button
        onClick={reset}
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        <RefreshCw className="h-4 w-4" aria-hidden="true" />
        Coba Lagi
      </button>
    </div>
  );
}