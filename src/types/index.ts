export type Topic = "addition" | "subtraction" | "multiplication" | "division";

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

export interface UserProgress {
  version: number;
  topics: Record<Topic, TopicProgress>;
  achievements: Achievement[];
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
