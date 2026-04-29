"use client";

import { useProgress } from "@/hooks/use-progress";
import { StatsCard } from "@/components/progress/stats-card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Trash2, TrendingUp, Award, Calendar, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProgressPage() {
  const { progress, reset } = useProgress();

  if (!progress) return <div className="flex items-center justify-center min-h-[50vh]">Memuat data...</div>;

  const totalAnswered = Object.values(progress.topics).reduce((acc, t) => acc + t.totalAnswered, 0);
  const totalCorrect = Object.values(progress.topics).reduce((acc, t) => acc + t.totalCorrect, 0);
  const globalAccuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">Progress Belajar</h1>
          <p className="text-muted-foreground">Lacak pencapaian dan statistik belajarmu di sini.</p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20 rounded-xl">
              <Trash2 className="mr-2 h-4 w-4" /> Reset Semua Data
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <div className="mx-auto bg-red-100 p-3 rounded-full w-fit mb-4">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <DialogTitle className="text-center">Hapus Semua Progress?</DialogTitle>
              <DialogDescription className="text-center">
                Tindakan ini tidak dapat dibatalkan. Semua statistik dan level akan kembali ke awal.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:gap-0">
              <DialogClose asChild>
                <Button variant="ghost">Batal</Button>
              </DialogClose>
              <Button variant="destructive" onClick={reset}>Ya, Hapus Sekarang</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Global Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="bg-primary text-primary-foreground border-none shadow-xl rounded-3xl overflow-hidden">
          <CardContent className="p-8">
            <TrendingUp className="h-8 w-8 mb-4 opacity-50" />
            <p className="text-primary-foreground/70 font-medium uppercase tracking-widest text-xs mb-1">Akurasi Global</p>
            <p className="text-5xl font-black">{globalAccuracy}%</p>
          </CardContent>
        </Card>
        <Card className="bg-background border-2 rounded-3xl">
          <CardContent className="p-8">
            <Award className="h-8 w-8 mb-4 text-amber-500 opacity-50" />
            <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs mb-1">Total Benar</p>
            <p className="text-5xl font-black">{totalCorrect}</p>
          </CardContent>
        </Card>
        <Card className="bg-background border-2 rounded-3xl">
          <CardContent className="p-8">
            <Calendar className="h-8 w-8 mb-4 text-blue-500 opacity-50" />
            <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs mb-1">Total Soal</p>
            <p className="text-5xl font-black">{totalAnswered}</p>
          </CardContent>
        </Card>
      </div>

      {/* Topic Stats */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">Statistik Per Topik</h2>
        {Object.values(progress.topics).map((topicProgress) => (
          <StatsCard key={topicProgress.topic} progress={topicProgress} />
        ))}
      </div>

      {/* Achievements Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold tracking-tight mb-6">Pencapaian</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {progress.achievements.length > 0 ? (
            progress.achievements.map((achievement) => (
              <div key={achievement.id} className="bg-primary/5 border-2 border-primary/20 p-6 rounded-3xl flex flex-col items-center justify-center text-center animate-in zoom-in duration-500">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                  <Award className="h-8 w-8" />
                </div>
                <h3 className="font-bold text-lg leading-tight mb-1">{achievement.title}</h3>
                <p className="text-xs text-muted-foreground">{achievement.description}</p>
                <span className="mt-3 text-[10px] uppercase tracking-widest font-black opacity-40">DIBUKA!</span>
              </div>
            ))
          ) : (
            <div className="col-span-full py-12 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center text-muted-foreground opacity-50">
              <Award className="h-12 w-12 mb-4" />
              <p>Belum ada pencapaian. Teruslah berlatih!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
