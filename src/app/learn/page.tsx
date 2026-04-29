"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuiz } from "@/hooks/use-quiz";
import { Topic } from "@/types";
import { QuizCard } from "@/components/quiz/quiz-card";
import { NumPad } from "@/components/quiz/num-pad";
import { ResultDialog } from "@/components/quiz/result-dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, X } from "lucide-react";
import Link from "next/link";

function LearnContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const topicParam = searchParams.get("topic") as Topic;
  const topic = (["addition", "subtraction", "multiplication", "division"].includes(topicParam) 
    ? topicParam 
    : "addition") as Topic;

  const {
    currentQuestion,
    sessionResults,
    isFinished,
    setIsFinished,
    currentStreak,
    submitAnswer,
    finishSession,
  } = useQuiz(topic);

  const [userInput, setUserInput] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInput = (val: string) => {
    if (isSubmitting) return;
    if (userInput.length < 10) {
      setUserInput((prev) => prev + val);
    }
  };

  const handleDelete = () => {
    if (isSubmitting) return;
    setUserInput((prev) => prev.slice(0, -1));
  };

  const handleSubmit = async () => {
    if (isSubmitting || !userInput) return;
    
    setIsSubmitting(true);
    const result = submitAnswer(parseInt(userInput));
    
    if (result) {
      setFeedback(result.isCorrect ? "correct" : "incorrect");
      
      // Show feedback for a moment then clear and go to next question
      setTimeout(() => {
        setFeedback(null);
        setUserInput("");
        setIsSubmitting(false);
      }, result.isCorrect ? 600 : 1500);
    }
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFinished) return;
      if (e.key >= "0" && e.key <= "9") handleInput(e.key);
      if (e.key === "Backspace") handleDelete();
      if (e.key === "Enter") handleSubmit();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [userInput, isSubmitting, isFinished]);

  if (!currentQuestion) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  const progressValue = Math.min((sessionResults.length / 10) * 100, 100);

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/">
            <X className="h-6 w-6" />
          </Link>
        </Button>
        <div className="flex-1 mx-6">
          <Progress value={progressValue} className="h-2" />
        </div>
        <Button variant="outline" size="sm" onClick={finishSession}>
          Selesai
        </Button>
      </div>

      {/* Main Quiz Area */}
      <div className="flex-1 flex flex-col justify-center items-center gap-8">
        <QuizCard 
          question={currentQuestion} 
          userInput={userInput} 
          feedback={feedback}
          streak={currentStreak}
        />
        
        <div className="w-full">
          <NumPad 
            onInput={handleInput} 
            onDelete={handleDelete} 
            onSubmit={handleSubmit} 
          />
        </div>
      </div>

      <ResultDialog 
        isOpen={isFinished} 
        onClose={() => setIsFinished(false)}
        results={sessionResults}
        topic={topic}
      />
    </div>
  );
}

export default function LearnPage() {
  return (
    <Suspense fallback={<div>Loading page...</div>}>
      <LearnContent />
    </Suspense>
  );
}
