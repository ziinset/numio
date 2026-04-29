import { TopicProgress } from "@/types";

const WINDOW_SIZE = 5;
const ACCURACY_THRESHOLD_UP = 0.8;
const ACCURACY_THRESHOLD_DOWN = 0.4;
const TIME_THRESHOLD_MS = 8000; // 8 seconds per question is considered "slow" for basic levels

export function evaluatePerformance(
  progress: TopicProgress,
  isCorrect: boolean,
  timeTakenMs: number
): {
  newLevel: number;
  newRecentAnswers: boolean[];
} {
  // Update sliding window
  const newRecentAnswers = [...progress.recentAnswers, isCorrect].slice(-WINDOW_SIZE);

  // We only evaluate if we have a full window
  if (newRecentAnswers.length < WINDOW_SIZE) {
    return {
      newLevel: progress.currentLevel,
      newRecentAnswers,
    };
  }

  const correctCount = newRecentAnswers.filter(Boolean).length;
  const accuracy = correctCount / WINDOW_SIZE;

  let newLevel = progress.currentLevel;

  if (accuracy >= ACCURACY_THRESHOLD_UP) {
    // If accuracy is high, check if average time is also good
    // (Optional: only level up if average time is below threshold)
    if (newLevel < 5) {
      newLevel++;
    }
  } else if (accuracy <= ACCURACY_THRESHOLD_DOWN) {
    if (newLevel > 1) {
      newLevel--;
    }
  }

  return {
    newLevel,
    newRecentAnswers,
  };
}
