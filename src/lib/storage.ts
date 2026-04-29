import { UserProgress, Topic, TopicProgress } from "@/types";

const STORAGE_KEY = "numio_data";
const CURRENT_VERSION = 1;

const DEFAULT_TOPIC_PROGRESS = (topic: Topic): TopicProgress => ({
  topic,
  currentLevel: 1,
  totalAnswered: 0,
  totalCorrect: 0,
  recentAnswers: [],
  averageTimeMs: 0,
  bestStreak: 0,
  lastPlayedAt: new Date().toISOString(),
});

const DEFAULT_PROGRESS: UserProgress = {
  version: CURRENT_VERSION,
  topics: {
    addition: DEFAULT_TOPIC_PROGRESS("addition"),
    subtraction: DEFAULT_TOPIC_PROGRESS("subtraction"),
    multiplication: DEFAULT_TOPIC_PROGRESS("multiplication"),
    division: DEFAULT_TOPIC_PROGRESS("division"),
  },
  achievements: [],
};

export const storage = {
  saveProgress: (progress: UserProgress): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  },

  getProgress: (): UserProgress => {
    if (typeof window === "undefined") return DEFAULT_PROGRESS;
    
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return DEFAULT_PROGRESS;

    try {
      const parsed = JSON.parse(data) as UserProgress;
      
      // Simple migration check
      if (parsed.version < CURRENT_VERSION) {
        // Handle migration here if needed
        return { ...DEFAULT_PROGRESS, ...parsed, version: CURRENT_VERSION };
      }
      
      return parsed;
    } catch (e) {
      console.error("Failed to parse local storage data", e);
      return DEFAULT_PROGRESS;
    }
  },

  updateTopicProgress: (topic: Topic, update: Partial<TopicProgress>): void => {
    const progress = storage.getProgress();
    progress.topics[topic] = {
      ...progress.topics[topic],
      ...update,
    };
    storage.saveProgress(progress);
  },

  resetProgress: (): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEY);
  }
};
