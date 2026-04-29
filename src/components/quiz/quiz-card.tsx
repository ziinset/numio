"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Question } from "@/types";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface QuizCardProps {
  question: Question;
  userInput: string;
  feedback: "correct" | "incorrect" | null;
  streak: number;
}

export function QuizCard({ question, userInput, feedback, streak }: QuizCardProps) {
  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden border-2 shadow-xl">
      <CardHeader className="bg-muted/30 pb-4">
        <div className="flex justify-between items-center">
          <Badge variant="outline" className="bg-background">
            Level {question.level}
          </Badge>
          <div className="flex items-center gap-1.5 text-orange-500 font-bold">
            <span className="text-sm">🔥 {streak}</span>
          </div>
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
                feedback === "correct" ? "bg-green-50 text-green-600 border-green-200" :
                feedback === "incorrect" ? "bg-red-50 text-red-600 border-red-200" :
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
