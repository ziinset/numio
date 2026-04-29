"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Question } from "@/types";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen } from "lucide-react";

interface QuizCardProps {
  question: Question;
  userInput: string;
  feedback: "correct" | "incorrect" | null;
  streak: number;
  hideStreak?: boolean;
  showStudyBadge?: boolean;
}

export function QuizCard({ question, userInput, feedback, streak, hideStreak, showStudyBadge }: QuizCardProps) {
  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden border-2 shadow-xl">
      <CardHeader className="bg-muted/30 pb-4">
        <div className="flex justify-between items-center">
          {showStudyBadge ? (
            <Badge variant="outline" className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800">
              <BookOpen className="h-3 w-3 mr-1" />
              Belajar
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-background">
              Level {question.level}
            </Badge>
          )}
          {!hideStreak && (
            <div className="flex items-center gap-1.5 text-orange-500 font-bold">
              <span className="text-sm">🔥 {streak}</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-8 pb-10 px-6 flex flex-col items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center w-full"
          >
            <div className="text-5xl font-bold mb-8 tracking-tight">
              {question.text.split("=")[0]}
              <span className="text-primary">=</span>
            </div>
            
            <div 
              className={cn(
                "h-20 flex items-center justify-center text-6xl font-black rounded-2xl transition-all border-b-4",
                feedback === "correct" ? "bg-green-50 text-green-600 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-800" :
                feedback === "incorrect" ? "bg-red-50 text-red-600 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800" :
                "bg-muted/20 text-foreground border-muted-foreground/10"
              )}
            >
              {userInput || <span className="text-muted-foreground/30 text-4xl">?</span>}
            </div>
          </motion.div>
        </AnimatePresence>

        {feedback === "incorrect" && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="mt-4 text-sm font-medium text-muted-foreground"
          >
            Jawaban benar: <span className="text-foreground font-bold">{question.answer}</span>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
