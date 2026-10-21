import Link from "next/link";
import { Sparkles, MessageSquareHeart, Users, CalendarHeart, ShieldCheck, ArrowRight, Heart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function BerandaPage() {
  const options = [
    {
      title: "Cek Mandiri",
      badge: "Langkah Pertama",
      bgClass: "bg-accent-lime",
      textClass: "text-brand",
      description: "Pahami suasana hatimu dengan kuesioner singkat PHQ-9 & GAD-7 secara pribadi.",
      icon: Sparkles,
      href: "/cek-mandiri",
    },
    {
      title: "Curhat Anonim",
      badge: "Tanpa Identitas",
      bgClass: "bg-surface border-2 border-black/5 dark:border-white/10",
      textClass: "text-text",
      description: "Ungkapkan isi hati tanpa takut dihakimi. Dibalas ramah oleh psikolog kampus.",
      icon: MessageSquareHeart,
      href: "/curhat",
    },
    {
      title: "Circle Komunitas",
      badge: "Teman Sebaya",
      bgClass: "bg-accent-lavender",
      textClass: "text-brand",
      description: "Temukan teman dengan minat atau keresahan serupa dalam ruang berbagi yang aman.",
      icon: Users,
      href: "/circle",
    },
    {
      title: "Booking Konseling",
      badge: "Bantuan Intensif",
      bgClass: "bg-accent-mint",
      textClass: "text-brand",
      description: "Jadwalkan sesi privat 1-on-1 dengan psikolog profesional (chat, suara, tatap muka).",
      icon: CalendarHeart,
      href: "/konseling",
    },
  ];

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="text-center max-w-2xl mx-auto pt-6 space-y-4">
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-surface border border-black/5 dark:border-white/10 text-xs font-semibold text-text-muted">
          <Heart className="w-3.5 h-3.5 text-brand" />
          <span>Ruang Aman & Rahasia Mahasiswa</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif font-black tracking-tight leading-tight text-brand dark:text-text">
          Di sini, kamu didengar sebelum semuanya <span className="italic font-normal">terasa berat</span>.
        </h1>
        <p className="text-sm sm:text-base text-text-muted">
          Pilih langkah yang paling nyaman untukmu hari ini. Mulai dari yang paling sederhana tanpa tekanan.
        </p>
      </section>

      {/* Gradual Options Cards Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-4xl mx-auto">
        {options.map((opt) => {
          const Icon = opt.icon;
          return (
            <Link key={opt.title} href={opt.href} className="group">
              <Card
                className={`h-full transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-lg ${opt.bgClass}`}
              >
                <div className="flex flex-col justify-between h-full space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider opacity-75">
                        {opt.badge}
                      </span>
                      <Icon className="w-6 h-6 opacity-80" />
                    </div>
                    <h2 className="text-2xl font-serif font-bold tracking-tight">
                      {opt.title}
                    </h2>
                    <p className="text-xs sm:text-sm opacity-90 leading-relaxed">
                      {opt.description}
                    </p>
                  </div>
                  <div className="pt-2 flex items-center gap-1 text-xs font-bold group-hover:gap-2 transition-all">
                    <span>Mulai sekarang</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </section>

      {/* Trust & Privacy Notice */}
      <section className="max-w-2xl mx-auto text-center p-6 rounded-3xl bg-surface/50 border border-black/5 dark:border-white/5 space-y-2">
        <div className="flex items-center justify-center gap-2 text-xs font-semibold text-brand dark:text-text">
          <ShieldCheck className="w-4 h-4" />
          <span>Privasi & Keamanan Data Terjamin</span>
        </div>
        <p className="text-xs text-text-muted">
          Sesi konseling terenkripsi secara menyeluruh (End-to-End Encryption). Identitas curhat dirahasiakan, dan data pribadi tidak dibagikan ke pihak luar tanpa persetujuanmu.
        </p>
      </section>
    </div>
  );
}
