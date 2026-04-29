"use client";

import { useState, useEffect, useCallback } from "react";
import { UserProgress, Topic, TopicProgress } from "@/types";
import { storage } from "@/lib/storage";

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress | null>(null);

  // Load initial progress
  useEffect(() => {
    setProgress(storage.getProgress());
  }, []);

  const updateTopic = useCallback((topic: Topic, update: Partial<TopicProgress>) => {
    storage.updateTopicProgress(topic, update);
    // Trigger re-render by loading fresh data
    setProgress(storage.getProgress());
  }, []);

  const reset = useCallback(() => {
    storage.resetProgress();
    setProgress(storage.getProgress());
  }, []);

  const getTopicProgress = useCallback((topic: Topic): TopicProgress => {
    if (!progress) {
      // Fallback if not loaded yet
      return {
        topic,
        currentLevel: 1,
        totalAnswered: 0,
        totalCorrect: 0,
        recentAnswers: [],
        averageTimeMs: 0,
        bestStreak: 0,
        lastPlayedAt: new Date().toISOString(),
      };
    }
    return progress.topics[topic];
  }, [progress]);

  return {
    progress,
    updateTopic,
    getTopicProgress,
    reset,
  };
}
