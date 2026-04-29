"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useStudy } from "@/hooks/use-study";
import { Topic } from "@/types";
import { QuizCard } from "@/components/quiz/quiz-card";
import { NumPad } from "@/components/quiz/num-pad";
import { StudyResultDialog } from "@/components/quiz/study-result-dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { X, BookOpen } from "lucide-react";
import Link from "next/link";
import { getSubTopicLabel } from "@/lib/subtopic-generator";

function StudySessionContent() {
  const searchParams = useSearchParams();
  const topicParam = searchParams.get("topic") as Topic;
  const topic = (["addition", "subtraction", "multiplication", "division"].includes(topicParam)
    ? topicParam
    : "multiplication") as Topic;
  const subTopicId = searchParams.get("sub") || "1";

  const {
    currentQuestion,
    sessionResults,
    isFinished,
    setIsFinished,
    submitAnswer,
    finishSession,
    subTopicProgress,
    masteredCount,
    totalQuestions,
  } = useStudy(topic, subTopicId);

  const [userInput, setUserInput] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subTopicLabel = getSubTopicLabel(topic, subTopicId);

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

      // Show feedback — longer for incorrect so user can see the correct answer
      setTimeout(() => {
        setFeedback(null);
        setUserInput("");
        setIsSubmitting(false);
      }, result.isCorrect ? 600 : 2000);
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

  const masteryPercent = totalQuestions > 0 ? Math.round((masteredCount / totalQuestions) * 100) : 0;

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/learn/study?topic=${topic}`}>
            <X className="h-6 w-6" />
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 font-bold">
            <BookOpen className="h-3 w-3 mr-1" />
            Mode Belajar
          </Badge>
        </div>
        <Button variant="outline" size="sm" onClick={finishSession}>
          Selesai
        </Button>
      </div>

      {/* Sub-topic info */}
      <div className="mb-6 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-bold">{subTopicLabel}</span>
          <span className="text-muted-foreground">{masteredCount}/{totalQuestions} dikuasai</span>
        </div>
        <Progress value={masteryPercent} className="h-2" />
      </div>

      {/* Main Quiz Area */}
      <div className="flex-1 flex flex-col justify-center items-center gap-8">
        <QuizCard
          question={currentQuestion}
          userInput={userInput}
          feedback={feedback}
          streak={0}
          hideStreak
          showStudyBadge
        />

        <div className="w-full">
          <NumPad
            onInput={handleInput}
            onDelete={handleDelete}
            onSubmit={handleSubmit}
          />
        </div>
      </div>

      <StudyResultDialog
        isOpen={isFinished}
        onClose={() => setIsFinished(false)}
        results={sessionResults}
        subTopicProgress={subTopicProgress}
      />
    </div>
  );
}

export default function StudySessionPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Memuat sesi belajar...</div>}>
      <StudySessionContent />
    </Suspense>
  );
}
