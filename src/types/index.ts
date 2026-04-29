export type Topic = "addition" | "subtraction" | "multiplication" | "division";

export type GameMode = "practice" | "study";

export interface TopicProgress {
  topic: Topic;
  currentLevel: number;           // 1-5
  totalAnswered: number;
  totalCorrect: number;
  recentAnswers: boolean[];       // sliding window (last 5 or 10)
  averageTimeMs: number;          // rata-rata waktu per soal
  bestStreak: number;             // streak jawaban benar terpanjang
  lastPlayedAt: string;           // ISO date string
}

// --- Study Mode Types ---

export interface QuestionWeight {
  num1: number;
  num2: number;
  weight: number;           // 1 = normal/mastered, higher = needs more practice
  timesAnswered: number;
  timesCorrect: number;
}

export interface SubTopicProgress {
  topic: Topic;
  subTopicId: string;       // e.g., "4" for individual, "1-5" for range, "mix" for campuran
  questions: QuestionWeight[];
  totalAnswered: number;
  totalCorrect: number;
  totalWrong: number;
  lastPlayedAt: string;
}

export interface StudyProgress {
  subtopics: Record<string, SubTopicProgress>; // key = "{topic}_{id}", e.g. "multiplication_4", "multiplication_1-5"
}

// --- Main Progress ---

export interface UserProgress {
  version: number;
  topics: Record<Topic, TopicProgress>;
  achievements: Achievement[];
  study: StudyProgress;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlockedAt: string;
}

export interface Question {
  id: string;
  topic: Topic;
  level: number;
  text: string;
  num1: number;
  num2: number;
  operator: string;
  answer: number;
  options?: number[]; // For multiple choice if needed, but the requirements say numpad input
}

export interface QuizSession {
  topic: Topic;
  questions: QuestionResult[];
  startTime: string;
  endTime?: string;
}

export interface QuestionResult {
  question: Question;
  userAnswer: number;
  isCorrect: boolean;
  timeTakenMs: number;
}
