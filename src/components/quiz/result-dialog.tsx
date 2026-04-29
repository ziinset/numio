"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QuestionResult } from "@/types";
import { Trophy, Clock, CheckCircle2, XCircle, ArrowRight, RotateCcw } from "lucide-react";

interface ResultDialogProps {
  isOpen: boolean;
  onClose: () => void;
  results: QuestionResult[];
  topic: string;
}

export function ResultDialog({ isOpen, onClose, results, topic }: ResultDialogProps) {
  const totalQuestions = results.length;
  const correctAnswers = results.filter((r) => r.isCorrect).length;
  const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
  const averageTime = totalQuestions > 0 
    ? Math.round(results.reduce((acc, r) => acc + r.timeTakenMs, 0) / totalQuestions / 100) / 10 
    : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
            <Trophy className="h-8 w-8 text-primary" />
          </div>
          <DialogTitle className="text-center text-2xl font-bold">Sesi Selesai!</DialogTitle>
          <DialogDescription className="text-center text-lg">
            Bagus sekali! Berikut adalah ringkasan latihanmu.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-6">
          <div className="flex flex-col items-center p-4 bg-muted/30 rounded-2xl">
            <CheckCircle2 className="h-5 w-5 text-green-500 mb-1" />
            <span className="text-2xl font-bold">{accuracy}%</span>
            <span className="text-xs text-muted-foreground uppercase font-semibold">Akurasi</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-muted/30 rounded-2xl">
            <Clock className="h-5 w-5 text-blue-500 mb-1" />
            <span className="text-2xl font-bold">{averageTime}s</span>
            <span className="text-xs text-muted-foreground uppercase font-semibold">Rata-rata</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-muted/30 rounded-2xl">
            <span className="text-2xl font-bold">{correctAnswers}</span>
            <span className="text-xs text-muted-foreground uppercase font-semibold">Benar</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-muted/30 rounded-2xl">
            <span className="text-2xl font-bold">{totalQuestions}</span>
            <span className="text-xs text-muted-foreground uppercase font-semibold">Total Soal</span>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" className="w-full" onClick={() => window.location.reload()}>
            <RotateCcw className="mr-2 h-4 w-4" /> Ulangi
          </Button>
          <Button className="w-full" onClick={() => window.location.href = "/"}>
            <ArrowRight className="mr-2 h-4 w-4" /> Selesai
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
