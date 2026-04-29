"use client";

import { useState, useCallback, useEffect } from "react";
import { Topic, Question, QuestionResult, SubTopicProgress } from "@/types";
import { generateSubTopicQuestions, pickWeightedQuestion, getSubTopicQuestionPair } from "@/lib/subtopic-generator";
import { updateQuestionWeight, getMasteredCount } from "@/lib/study-engine";
import { storage } from "@/lib/storage";

export function useStudy(topic: Topic, subTopicId: string) {
  const [subTopicProgress, setSubTopicProgress] = useState<SubTopicProgress | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [sessionResults, setSessionResults] = useState<QuestionResult[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null);

  // Initialize sub-topic progress
  useEffect(() => {
    let progress = storage.getSubTopicProgress(topic, subTopicId);

    if (!progress) {
      // First time playing this sub-topic — initialize question pool
      progress = {
        topic,
        subTopicId,
        questions: generateSubTopicQuestions(topic, subTopicId),
        totalAnswered: 0,
        totalCorrect: 0,
        totalWrong: 0,
        lastPlayedAt: new Date().toISOString(),
      };
      storage.saveSubTopicProgress(progress);
    }

    setSubTopicProgress(progress);

    // Generate first question
    const question = pickWeightedQuestion(progress);
    setCurrentQuestion(question);
    setStartTime(Date.now());
  }, [topic, subTopicId]);

  const submitAnswer = useCallback((userAnswer: number) => {
    if (!currentQuestion || !subTopicProgress) return null;

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
    setLastAnswerCorrect(isCorrect);

    // Find which question in the pool matches the displayed question
    const matchingQ = subTopicProgress.questions.find((q) => {
      const { displayNum1, displayNum2, answer } = getSubTopicQuestionPair(topic, q.num1, q.num2);
      return displayNum1 === currentQuestion.num1 && displayNum2 === currentQuestion.num2 && answer === currentQuestion.answer;
    });

    if (matchingQ) {
      // Update weight in the sub-topic progress
      const updatedProgress = updateQuestionWeight(
        subTopicProgress,
        matchingQ.num1,
        matchingQ.num2,
        isCorrect
      );

      setSubTopicProgress(updatedProgress);
      storage.saveSubTopicProgress(updatedProgress);

      // Generate next question from updated pool
      const nextQuestion = pickWeightedQuestion(updatedProgress);
      setCurrentQuestion(nextQuestion);
    }

    setStartTime(Date.now());
    return result;
  }, [currentQuestion, subTopicProgress, startTime, topic, subTopicId]);

  const finishSession = useCallback(() => {
    setIsFinished(true);
  }, []);

  const masteredCount = subTopicProgress ? getMasteredCount(subTopicProgress) : 0;
  const totalQuestions = subTopicProgress ? subTopicProgress.questions.length : 0;

  return {
    currentQuestion,
    sessionResults,
    isFinished,
    setIsFinished,
    lastAnswerCorrect,
    submitAnswer,
    finishSession,
    subTopicProgress,
    masteredCount,
    totalQuestions,
  };
}
