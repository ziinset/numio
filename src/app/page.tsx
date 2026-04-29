"use client";

import { useProgress } from "@/hooks/use-progress";
import { TopicCard } from "@/components/quiz/topic-card";
import { Button } from "@/components/ui/button";
import { Calculator, Sparkles, TrendingUp, Trophy } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const { progress } = useProgress();

  const topics = [
    {
      id: "addition",
      title: "Penjumlahan",
      description: "Belajar menjumlahkan angka dari yang termudah sampai menantang.",
    },
    {
      id: "subtraction",
      title: "Pengurangan",
      description: "Latih kemampuan pengurangan kamu dengan soal-soal adaptif.",
    },
    {
      id: "multiplication",
      title: "Perkalian",
      description: "Hafalkan dan kuasai perkalian dengan metode yang seru.",
    },
    {
      id: "division",
      title: "Pembagian",
      description: "Pahami konsep pembagian tanpa sisa dengan bertahap.",
    },
  ];

  if (!progress) return <div className="flex items-center justify-center min-h-[50vh]">Memuat data...</div>;

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="text-center mb-16 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold mb-6">
          <Sparkles className="h-4 w-4" />
          <span>Matematika jadi lebih seru!</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">
          Kuasai Matematika dengan <span className="text-primary">Cara Pintar.</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
          Numio menyesuaikan tingkat kesulitan soal secara otomatis berdasarkan kemampuanmu. 
          Tanpa ribet, langsung belajar!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="text-lg px-8 h-14 rounded-2xl shadow-xl" asChild>
            <Link href="/learn?topic=addition">Mulai Belajar Sekarang</Link>
          </Button>
          <Button size="lg" variant="outline" className="text-lg px-8 h-14 rounded-2xl" asChild>
            <Link href="/progress">Lihat Progress Saya</Link>
          </Button>
        </div>
      </section>

      {/* Stats Summary (if any) */}
      {progress.topics.addition.totalAnswered > 0 && (
        <section className="mb-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-muted/30 p-6 rounded-3xl border flex items-center gap-4">
            <div className="bg-background p-3 rounded-2xl shadow-sm text-primary">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Total Soal</p>
              <p className="text-2xl font-bold">
                {Object.values(progress.topics).reduce((acc, t) => acc + t.totalAnswered, 0)}
              </p>
            </div>
          </div>
          <div className="bg-muted/30 p-6 rounded-3xl border flex items-center gap-4">
            <div className="bg-background p-3 rounded-2xl shadow-sm text-green-500">
              <Trophy className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Total Benar</p>
              <p className="text-2xl font-bold">
                {Object.values(progress.topics).reduce((acc, t) => acc + t.totalCorrect, 0)}
              </p>
            </div>
          </div>
          <div className="bg-muted/30 p-6 rounded-3xl border flex items-center gap-4">
            <div className="bg-background p-3 rounded-2xl shadow-sm text-amber-500">
              <Calculator className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Level Tertinggi</p>
              <p className="text-2xl font-bold">
                Level {Math.max(...Object.values(progress.topics).map(t => t.currentLevel))}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Topic Grid */}
      <section>
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Pilih Topik</h2>
            <p className="text-muted-foreground">Pilih materi yang ingin kamu pelajari hari ini.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {topics.map((topic) => (
            <TopicCard
              key={topic.id}
              topic={topic.id as any}
              title={topic.title}
              description={topic.description}
              progress={progress.topics[topic.id as keyof typeof progress.topics]}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
