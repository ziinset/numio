"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Topic, Question, QuestionResult, TopicProgress } from "@/types";
import { generateQuestion } from "@/lib/question-generator";
import { evaluatePerformance } from "@/lib/adaptive-engine";
import { useProgress } from "./use-progress";
import { storage } from "@/lib/storage";

export function useQuiz(topic: Topic) {
  const { getTopicProgress, updateTopic } = useProgress();
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [sessionResults, setSessionResults] = useState<QuestionResult[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [currentStreak, setCurrentStreak] = useState(0);

  // Load first question
  useEffect(() => {
    const progress = getTopicProgress(topic);
    const question = generateQuestion(topic, progress.currentLevel);
    setCurrentQuestion(question);
    setStartTime(Date.now());
  }, [topic, getTopicProgress]);

  const submitAnswer = useCallback((userAnswer: number) => {
    if (!currentQuestion) return;

    const endTime = Date.now();
    const timeTakenMs = endTime - startTime;
    const isCorrect = userAnswer === currentQuestion.answer;

    const result: QuestionResult = {
      question: currentQuestion,
      userAnswer,
      isCorrect,
      timeTakenMs,
    };

    setSessionResults((prev) => [...prev, result]);

    // Update streak
    if (isCorrect) {
      setCurrentStreak((prev) => prev + 1);
    } else {
      setCurrentStreak(0);
    }

    // Update global progress using adaptive engine
    const currentProgress = getTopicProgress(topic);
    const { newLevel, newRecentAnswers } = evaluatePerformance(
      currentProgress,
      isCorrect,
      timeTakenMs
    );

    const totalAnswered = currentProgress.totalAnswered + 1;
    const totalCorrect = currentProgress.totalCorrect + (isCorrect ? 1 : 0);
    const averageTimeMs = (currentProgress.averageTimeMs * currentProgress.totalAnswered + timeTakenMs) / totalAnswered;
    const newStreak = isCorrect ? currentStreak + 1 : 0;
    const bestStreak = Math.max(currentProgress.bestStreak, newStreak);

    updateTopic(topic, {
      currentLevel: newLevel,
      totalAnswered,
      totalCorrect,
      recentAnswers: newRecentAnswers,
      averageTimeMs,
      bestStreak,
      lastPlayedAt: new Date().toISOString(),
    });

    // Simple Achievement Logic
    if (newStreak === 10) {
      const progress = storage.getProgress();
      const hasStreakMaster = progress.achievements.some(a => a.id === "streak-master");
      if (!hasStreakMaster) {
        progress.achievements.push({
          id: "streak-master",
          title: "Streak Master",
          description: "10 jawaban benar berturut-turut!",
          unlockedAt: new Date().toISOString()
        });
        storage.saveProgress(progress);
      }
    }

    // Generate next question
    const nextQuestion = generateQuestion(topic, newLevel);
    setCurrentQuestion(nextQuestion);
    setStartTime(Date.now());

    return result;
  }, [currentQuestion, startTime, topic, getTopicProgress, updateTopic, currentStreak]);

  const finishSession = useCallback(() => {
    setIsFinished(true);
  }, []);

  return {
    currentQuestion,
    sessionResults,
    isFinished,
    setIsFinished,
    currentStreak,
    submitAnswer,
    finishSession,
  };
}
