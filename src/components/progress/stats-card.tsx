"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Topic, TopicProgress } from "@/types";
import { Plus, Minus, X, Divide, Target, Zap, Award } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  progress: TopicProgress;
}

const icons = {
  addition: Plus,
  subtraction: Minus,
  multiplication: X,
  division: Divide,
};

const labels = {
  addition: "Penjumlahan",
  subtraction: "Pengurangan",
  multiplication: "Perkalian",
  division: "Pembagian",
};

export function StatsCard({ progress }: StatsCardProps) {
  const Icon = icons[progress.topic];
  const accuracy = progress.totalAnswered > 0 
    ? Math.round((progress.totalCorrect / progress.totalAnswered) * 100) 
    : 0;

  return (
    <Card className="overflow-hidden border-2">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row h-full">
          {/* Side Header */}
          <div className="bg-muted/30 p-6 flex flex-col items-center justify-center border-b sm:border-b-0 sm:border-r w-full sm:w-48 text-center">
            <div className="p-3 rounded-2xl bg-background shadow-sm mb-3">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-bold text-lg">{labels[progress.topic]}</h3>
            <div className="mt-2 px-3 py-1 bg-primary text-primary-foreground text-xs font-black rounded-full uppercase tracking-widest">
              Level {progress.currentLevel}
            </div>
          </div>
          
          {/* Stats Grid */}
          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0">
            <div className="p-6 flex flex-col items-center justify-center">
              <Target className="h-5 w-5 text-muted-foreground mb-2" />
              <span className="text-2xl font-black">{accuracy}%</span>
              <span className="text-xs text-muted-foreground uppercase font-semibold">Akurasi</span>
            </div>
            <div className="p-6 flex flex-col items-center justify-center">
              <Zap className="h-5 w-5 text-muted-foreground mb-2" />
              <span className="text-2xl font-black">{progress.totalAnswered}</span>
              <span className="text-xs text-muted-foreground uppercase font-semibold">Total Soal</span>
            </div>
            <div className="p-6 flex flex-col items-center justify-center">
              <Award className="h-5 w-5 text-muted-foreground mb-2" />
              <span className="text-2xl font-black">{progress.bestStreak}</span>
              <span className="text-xs text-muted-foreground uppercase font-semibold">Streak Terbaik</span>
            </div>
            <div className="p-6 flex flex-col items-center justify-center">
              <div className="h-5 w-5 text-muted-foreground mb-2 flex items-center justify-center">
                <span className="text-xs font-bold">ms</span>
              </div>
              <span className="text-2xl font-black">{Math.round(progress.averageTimeMs / 1000)}s</span>
              <span className="text-xs text-muted-foreground uppercase font-semibold">Rerata Waktu</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
