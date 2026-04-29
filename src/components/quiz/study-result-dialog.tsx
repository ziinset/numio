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
import { Progress } from "@/components/ui/progress";
import { QuestionResult, SubTopicProgress } from "@/types";
import { getMasteredCount, getStrugglingQuestions, getMasteryPercentage } from "@/lib/study-engine";
import { getTopicLabel, getSubTopicQuestionPair, getSubTopicLabel } from "@/lib/subtopic-generator";
import { BookOpen, ArrowRight, RotateCcw, CheckCircle2, AlertTriangle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface StudyResultDialogProps {
  isOpen: boolean;
  onClose: () => void;
  results: QuestionResult[];
  subTopicProgress: SubTopicProgress | null;
}

export function StudyResultDialog({ isOpen, onClose, results, subTopicProgress }: StudyResultDialogProps) {
  if (!subTopicProgress) return null;

  const totalQuestions = subTopicProgress.questions.length;
  const mastered = getMasteredCount(subTopicProgress);
  const masteryPercent = getMasteryPercentage(subTopicProgress);
  const struggling = getStrugglingQuestions(subTopicProgress, 3);

  const sessionCorrect = results.filter((r) => r.isCorrect).length;
  const sessionTotal = results.length;
  const sessionAccuracy = sessionTotal > 0 ? Math.round((sessionCorrect / sessionTotal) * 100) : 0;

  const operator = results[0]?.question.operator || "";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="mx-auto bg-emerald-100 dark:bg-emerald-900/30 p-2.5 rounded-full w-fit mb-2">
            <BookOpen className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <DialogTitle className="text-center text-lg font-bold">
            Sesi Belajar Selesai!
          </DialogTitle>
          <DialogDescription className="text-center text-sm">
            {getSubTopicLabel(subTopicProgress.topic, subTopicProgress.subTopicId)}
          </DialogDescription>
        </DialogHeader>

        {/* Mastery Overview */}
        <div className="space-y-3">
          <div className="bg-muted/30 p-4 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Penguasaan Sub-Materi</span>
              <span className="font-bold text-sm">{masteryPercent}%</span>
            </div>
            <Progress value={masteryPercent} className="h-2" />
            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                {mastered}/{totalQuestions} dikuasai
              </span>
              <span>Sesi: {sessionCorrect}/{sessionTotal} benar</span>
            </div>
          </div>

          {/* Struggling questions */}
          {struggling.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <AlertTriangle className="h-3 w-3 text-amber-500" />
                Perlu dilatih lagi:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {struggling.map((q) => {
                  const { displayNum1, displayNum2 } = getSubTopicQuestionPair(
                    subTopicProgress.topic, q.num1, q.num2
                  );
                  return (
                    <span
                      key={`${q.num1}-${q.num2}`}
                      className="px-2 py-1 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 rounded-md text-xs font-bold border border-amber-200 dark:border-amber-800"
                    >
                      {displayNum1} {operator} {displayNum2}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Motivational message */}
          <div className={cn(
            "p-3 rounded-xl text-center text-xs font-medium",
            masteryPercent >= 100
              ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300"
              : "bg-primary/5 text-primary"
          )}>
            <Sparkles className="h-3.5 w-3.5 inline-block mr-1" />
            {masteryPercent >= 100
              ? "Luar biasa! Semua soal dikuasai! 🎉"
              : masteryPercent >= 70
                ? "Hampir sampai! Terus latihan! 💪"
                : sessionAccuracy >= 50
                  ? "Bagus! Kamu semakin mahir! 📈"
                  : "Latihan membuat sempurna! 🔁"
            }
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" size="sm" className="w-full" onClick={() => window.location.reload()}>
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Latihan Lagi
          </Button>
          <Button size="sm" className="w-full" onClick={() => window.location.href = `/learn/study?topic=${subTopicProgress.topic}`}>
            <ArrowRight className="mr-1.5 h-3.5 w-3.5" /> Sub-Materi Lain
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
