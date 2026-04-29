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
      <DialogContent className="sm:max-w-sm max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
            <Trophy className="h-8 w-8 text-primary" />
          </div>
          <DialogTitle className="text-center text-2xl font-bold">Sesi Selesai!</DialogTitle>
          <DialogDescription className="text-center text-lg">
            Bagus sekali! Berikut adalah ringkasan latihanmu.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-2 py-4">
          <div className="flex flex-col items-center p-3 bg-muted/30 rounded-xl">
            <CheckCircle2 className="h-4 w-4 text-green-500 mb-1" />
            <span className="text-xl font-bold">{accuracy}%</span>
            <span className="text-[10px] text-muted-foreground uppercase font-semibold">Akurasi</span>
          </div>
          <div className="flex flex-col items-center p-3 bg-muted/30 rounded-xl">
            <Clock className="h-4 w-4 text-blue-500 mb-1" />
            <span className="text-xl font-bold">{averageTime}s</span>
            <span className="text-[10px] text-muted-foreground uppercase font-semibold">Rata-rata</span>
          </div>
          <div className="flex flex-col items-center p-3 bg-muted/30 rounded-xl">
            <span className="text-xl font-bold">{correctAnswers}</span>
            <span className="text-[10px] text-muted-foreground uppercase font-semibold">Benar</span>
          </div>
          <div className="flex flex-col items-center p-3 bg-muted/30 rounded-xl">
            <span className="text-xl font-bold">{totalQuestions}</span>
            <span className="text-[10px] text-muted-foreground uppercase font-semibold">Total Soal</span>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" size="sm" className="w-full" onClick={() => window.location.reload()}>
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Ulangi
          </Button>
          <Button size="sm" className="w-full" onClick={() => window.location.href = "/"}>
            <ArrowRight className="mr-1.5 h-3.5 w-3.5" /> Selesai
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
