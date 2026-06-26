"use client";

import { motion } from "framer-motion";
import { Shirt, Activity, Lightbulb, AlertTriangle } from "lucide-react";
import type { CurrentWeather } from "@/features/weather/types/weather";
import { cn } from "@/shared/lib/utils";

interface RecommendationCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  items: string[];
  colorClass?: string;
  delay?: number;
}

export function RecommendationCard({
  icon: Icon,
  title,
  items,
  colorClass = "text-primary",
  delay = 0,
}: RecommendationCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="rounded-xl border border-border/50 bg-card p-4 shadow-card"
    >
      <div className="mb-3 flex items-center gap-2">
        <Icon className={cn("h-5 w-5", colorClass)} aria-hidden="true" />
        <h4 className="font-[family-name:var(--font-heading)] text-sm font-semibold text-foreground">
          {title}
        </h4>
      </div>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="text-sm text-muted-foreground">
            • {item}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

interface SmartRecommendationsProps {
  weather: CurrentWeather;
  className?: string;
}

function getOutfitRecommendations(weather: CurrentWeather): string[] {
  const { temp, humidity, main } = weather;
  const items: string[] = [];

  if (temp >= 35) {
    items.push("Pakaian tipis dan longgar, bahan katun atau linen");
    items.push("Topi dan kacamata hitap untuk perlindungan UV");
  } else if (temp >= 28) {
    items.push("Kaus dan celana ringan, bahan menyerap keringat");
    items.push("Bawa jaket tipis untuk ruang AC");
  } else if (temp >= 22) {
    items.push("Kemeja tipis atau kaos lengan panjang");
    items.push("Celana panjang atau rok dengan bahan nyaman");
  } else if (temp >= 15) {
    items.push("Jaket atau sweater ringan");
    items.push("Celana panjang, bawa syal untuk malam hari");
  } else {
    items.push("Jaket tebal dan pakaian berlapis");
    items.push("Syal, sarung tangan, dan topi hangat");
  }

  if (humidity >= 80) {
    items.push("Pilih bahan yang tidak menempel saat berkeringat");
  }

  if (main === "Rain" || main === "Drizzle") {
    items.push("Bawa payung dan pertimbangkan waterproof jacket");
  }

  if (main === "Thunderstorm") {
    items.push("Hindari payung logam, gunakan raincoat");
  }

  return items;
}

function getActivityRecommendations(weather: CurrentWeather): string[] {
  const { temp, main, wind_speed } = weather;
  const items: string[] = [];

  if (main === "Clear" && temp >= 22 && temp <= 32) {
    items.push("✅ Bagus untuk jogging, cycling, atau jalan santai");
    items.push("✅ Waktu ideal untuk aktivitas outdoor pagi atau sore");
  } else if (main === "Clear" && temp > 32) {
    items.push("⚠️ Terlalu panas untuk outdoor intens, pilih indoor");
    items.push("✅ Berenang atau aktivitas air sangat direkomendasikan");
  } else if (main === "Rain" || main === "Drizzle") {
    items.push("❌ Hindari aktivitas outdoor yang tidak tahan air");
    items.push("✅ Cocok untuk gym indoor, yoga, atau nonton film");
  } else if (main === "Thunderstorm") {
    items.push("❌ Tetap di dalam ruangan untuk keselamatan");
    items.push("✅ Manfaatkan waktu untuk aktivitas indoor produktif");
  } else if (main === "Clouds") {
    items.push("✅ Cuaca berawan cocok untuk outdoor tanpa paparan sinar langsung");
    items.push("✅ Foto outdoor hasilnya bagus di pencahayaan mendung");
  } else {
    items.push("✅ Aktivitas ringan outdoor masih bisa dilakukan");
  }

  if (wind_speed > 30) {
    items.push("⚠️ Angin kencang, hindari cycling atau olahraga ringan");
  }

  return items;
}

function getHealthInsights(weather: CurrentWeather): string[] {
  const { temp, humidity, feels_like } = weather;
  const items: string[] = [];

  if (temp >= 35 || feels_like >= 40) {
    items.push("🌡️ Risiko heatstroke tinggi. Minum air minimal 3 liter/hari");
    items.push("🧴 Gunakan sunscreen SPF 50+, hindari sinar matahari 10:00-15:00");
  } else if (temp >= 30) {
    items.push("💧 Tetap terhidrasi, minum air setiap 30 menit saat outdoor");
    items.push("🧴 Gunakan sunscreen SPF 30+");
  } else if (temp >= 20) {
    items.push("💧 Cuaca nyaman, jaga asupan air tetap teratur");
  } else {
    items.push("🧥 Jaga tubuh tetap hangat, hindari kedinginan berlebihan");
  }

  if (humidity >= 85) {
    items.push("💦 Kelembapan tinggi, tubuh lebih sulit mendingin. Kurangi aktivitas intens");
  } else if (humidity <= 30) {
    items.push("🏜️ Udara sangat kering, gunakan pelembap kulit dan banyak minum");
  }

  if (Math.abs(feels_like - temp) > 5) {
    items.push(
      `⚠️ Suhu terasa ${feels_like > temp ? "lebih panas" : "lebih dingin"} dari aktual (${Math.round(feels_like)}°C vs ${Math.round(temp)}°C). Berhati-hatilah`
    );
  }

  return items;
}

export function SmartRecommendations({ weather, className }: SmartRecommendationsProps) {
  const outfits = getOutfitRecommendations(weather);
  const activities = getActivityRecommendations(weather);
  const health = getHealthInsights(weather);

  return (
    <section className={cn("space-y-3", className)} id="recommendations" aria-label="Rekomendasi cerdas">
      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-[family-name:var(--font-heading)] text-lg font-semibold text-foreground"
      >
        Rekomendasi Untukmu
      </motion.h3>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <RecommendationCard
          icon={Shirt}
          title="👕 Outfit"
          items={outfits}
          colorClass="text-sky-500"
          delay={0}
        />
        <RecommendationCard
          icon={Activity}
          title="🏃 Aktivitas"
          items={activities}
          colorClass="text-emerald-500"
          delay={0.1}
        />
        <RecommendationCard
          icon={Lightbulb}
          title="💡 Tips Kesehatan"
          items={health}
          colorClass="text-amber-500"
          delay={0.2}
        />
      </div>
    </section>
  );
}
