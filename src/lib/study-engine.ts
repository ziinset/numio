import { SubTopicProgress, QuestionWeight } from "@/types";

const WEIGHT_INCREASE = 3;    // How much to increase weight on wrong answer
const WEIGHT_DECREASE = 1;    // How much to decrease weight on correct answer
const MIN_WEIGHT = 1;         // Minimum weight (mastered)
const MAX_WEIGHT = 10;        // Cap weight to prevent extreme skewing

/**
 * Update the weight of a specific question after the user answers it.
 * - Wrong answer → increase weight (appears more often)
 * - Correct answer → decrease weight gradually
 */
export function updateQuestionWeight(
  subTopicProgress: SubTopicProgress,
  num1: number,
  num2: number,
  isCorrect: boolean
): SubTopicProgress {
  const updatedQuestions = subTopicProgress.questions.map((q) => {
    if (q.num1 === num1 && q.num2 === num2) {
      const newWeight = isCorrect
        ? Math.max(MIN_WEIGHT, q.weight - WEIGHT_DECREASE)
        : Math.min(MAX_WEIGHT, q.weight + WEIGHT_INCREASE);

      return {
        ...q,
        weight: newWeight,
        timesAnswered: q.timesAnswered + 1,
        timesCorrect: q.timesCorrect + (isCorrect ? 1 : 0),
      };
    }
    return q;
  });

  return {
    ...subTopicProgress,
    questions: updatedQuestions,
    totalAnswered: subTopicProgress.totalAnswered + 1,
    totalCorrect: subTopicProgress.totalCorrect + (isCorrect ? 1 : 0),
    totalWrong: subTopicProgress.totalWrong + (isCorrect ? 0 : 1),
    lastPlayedAt: new Date().toISOString(),
  };
}

/**
 * Calculate how many questions in a sub-topic are "mastered" (weight = MIN_WEIGHT and answered at least once).
 */
export function getMasteredCount(subTopicProgress: SubTopicProgress): number {
  return subTopicProgress.questions.filter(
    (q) => q.weight <= MIN_WEIGHT && q.timesAnswered > 0
  ).length;
}

/**
 * Get the questions that the user struggles with the most (highest weight).
 */
export function getStrugglingQuestions(subTopicProgress: SubTopicProgress, limit: number = 3): QuestionWeight[] {
  return [...subTopicProgress.questions]
    .filter((q) => q.weight > MIN_WEIGHT)
    .sort((a, b) => b.weight - a.weight)
    .slice(0, limit);
}

/**
 * Calculate the mastery percentage for a sub-topic.
 */
export function getMasteryPercentage(subTopicProgress: SubTopicProgress): number {
  const total = subTopicProgress.questions.length;
  if (total === 0) return 0;
  const mastered = getMasteredCount(subTopicProgress);
  return Math.round((mastered / total) * 100);
}
