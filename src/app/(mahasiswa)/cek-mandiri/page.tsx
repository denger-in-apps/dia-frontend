"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, ArrowLeft, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const PHQ9_QUESTIONS = [
  "Kurang berminat atau bergairah dalam melakukan hal-hal yang biasanya menyenangkan?",
  "Merasa murung, sedih, atau merasa putus asa?",
  "Sulit tidur atau tidur terlalu banyak?",
  "Merasa lelah atau kurang bertenaga?",
  "Kurang nafsu makan atau makan berlebihan?",
];

const GAD7_QUESTIONS = [
  "Merasa gelisah, cemas, atau sangat tegang?",
  "Tidak mampu menghentikan atau mengendalikan rasa khawatir?",
  "Terlalu mengkhawatirkan berbagai hal yang berbeda?",
  "Sulit untuk merasa rileks atau tenang?",
];

const OPTIONS = [
  { label: "Tidak pernah", points: 0 },
  { label: "Beberapa hari", points: 1 },
  { label: "Lebih dari separuh waktu", points: 2 },
  { label: "Hampir setiap hari", points: 3 },
];

export default function CekMandiriPage() {
  const [stage, setStage] = useState<"intro" | "phq9" | "gad7" | "result">("intro");
  const [phqAnswers, setPhqAnswers] = useState<number[]>([]);
  const [gadAnswers, setGadAnswers] = useState<number[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const startTest = () => {
    setPhqAnswers([]);
    setGadAnswers([]);
    setCurrentQuestionIndex(0);
    setStage("phq9");
  };

  const handleAnswer = (points: number) => {
    if (stage === "phq9") {
      const nextAnswers = [...phqAnswers, points];
      setPhqAnswers(nextAnswers);
      if (currentQuestionIndex + 1 < PHQ9_QUESTIONS.length) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setStage("gad7");
        setCurrentQuestionIndex(0);
      }
    } else if (stage === "gad7") {
      const nextAnswers = [...gadAnswers, points];
      setGadAnswers(nextAnswers);
      if (currentQuestionIndex + 1 < GAD7_QUESTIONS.length) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setStage("result");
      }
    }
  };

  const phqScore = phqAnswers.reduce((a, b) => a + b, 0);
  const gadScore = gadAnswers.reduce((a, b) => a + b, 0);
  const needsImmediateHelp = phqScore >= 10 || gadScore >= 9;

  return (
    <div className="max-w-2xl mx-auto py-6 space-y-6">
      {stage === "intro" && (
        <Card className="p-8 text-center space-y-6 bg-surface shadow-md">
          <div className="w-16 h-16 rounded-full bg-accent-lime text-brand flex items-center justify-center mx-auto">
            <Sparkles className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-serif font-black text-brand dark:text-text">
              Cek Suasana Hati Mandiri
            </h1>
            <p className="text-sm text-text-muted max-w-lg mx-auto">
              Kuesioner ini dirancang untuk membantumu merefleksikan perasaanmu selama 2 minggu terakhir. Jawabanmu sepenuhnya pribadi dan tidak disimpan di perangkatmu.
            </p>
          </div>

          <div className="p-4 bg-accent-mint/30 rounded-2xl text-xs text-brand text-left space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Penting Diketahui
            </div>
            <p className="text-text-muted">
              Ini bukan alat diagnosis medis. Hasilnya berguna sebagai acuan awal untuk memahami dirimu atau memulai sesi konseling dengan lebih terarah.
            </p>
          </div>

          <Button onClick={startTest} variant="primary" size="lg" className="w-full sm:w-auto px-8">
            Mulai Kuesioner (± 3 Menit)
          </Button>
        </Card>
      )}

      {(stage === "phq9" || stage === "gad7") && (
        <Card className="p-8 space-y-6">
          <div className="flex items-center justify-between text-xs font-semibold text-text-muted pb-2 border-b border-black/5 dark:border-white/10">
            <span>
              Bagian: {stage === "phq9" ? "Suasana Hati (PHQ)" : "Tingkat Kecemasan (GAD)"}
            </span>
            <span>
              Pertanyaan {currentQuestionIndex + 1} dari{" "}
              {stage === "phq9" ? PHQ9_QUESTIONS.length : GAD7_QUESTIONS.length}
            </span>
          </div>

          <h2 className="text-lg sm:text-xl font-medium text-text leading-relaxed">
            {stage === "phq9"
              ? PHQ9_QUESTIONS[currentQuestionIndex]
              : GAD7_QUESTIONS[currentQuestionIndex]}
          </h2>

          <div className="grid grid-cols-1 gap-2.5 pt-2">
            {OPTIONS.map((opt) => (
              <button
                key={opt.label}
                onClick={() => handleAnswer(opt.points)}
                className="p-3.5 text-left rounded-2xl border border-black/10 dark:border-white/10 hover:border-focus hover:bg-black/5 dark:hover:bg-white/5 transition-all text-sm font-medium flex items-center justify-between group"
              >
                <span>{opt.label}</span>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-brand" />
              </button>
            ))}
          </div>
        </Card>
      )}

      {stage === "result" && (
        <Card className="p-8 space-y-6 bg-surface shadow-lg text-center">
          <div className="w-16 h-16 rounded-full bg-accent-mint text-brand flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-serif font-black text-brand dark:text-text">
              Hasil Refleksi Suasana Hatimu
            </h1>
            <p className="text-xs text-text-muted italic">
              *Catatan Penting: Ini bukan diagnosis klinis. Setiap perasaan yang kamu alami adalah valid.
            </p>
          </div>

          {needsImmediateHelp && (
            <div className="p-4 rounded-2xl bg-danger/10 border border-danger/30 text-left space-y-2">
              <div className="flex items-center gap-2 text-danger font-bold text-sm">
                <AlertTriangle className="w-5 h-5" />
                <span>Kamu Sepertinya Membutuhkan Teman Bicara Segera</span>
              </div>
              <p className="text-xs text-text-muted">
                Beban yang kamu rasakan cukup berat saat ini. Sangat disarankan untuk segera terhubung dengan psikolog atau teman terdekat.
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 text-left">
            <div className="p-4 rounded-2xl bg-accent-lime/20 border border-accent-lime">
              <div className="text-xs text-text-muted">Skor Suasana Hati</div>
              <div className="text-2xl font-bold text-brand">{phqScore} Poin</div>
              <div className="text-xs text-text-muted mt-1">
                {phqScore < 5 ? "Tergolong Ringan" : phqScore < 10 ? "Perlu Perhatian" : "Beban Cukup Berat"}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-accent-lavender/20 border border-accent-lavender">
              <div className="text-xs text-text-muted">Skor Kecemasan</div>
              <div className="text-2xl font-bold text-brand">{gadScore} Poin</div>
              <div className="text-xs text-text-muted mt-1">
                {gadScore < 5 ? "Tingkat Rendah" : gadScore < 9 ? "Kecemasan Sedang" : "Kecemasan Tinggi"}
              </div>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/konseling/pesan" className="flex-1">
              <Button variant="primary" size="lg" className="w-full">
                Konsultasikan dengan Psikolog
              </Button>
            </Link>
            <Link href="/curhat" className="flex-1">
              <Button variant="outline" size="lg" className="w-full">
                Tulis Curhat Anonim
              </Button>
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
}
