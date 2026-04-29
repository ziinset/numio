import { Topic, Question, QuestionWeight, SubTopicProgress } from "@/types";

// --- Sub-topic item definition ---

export interface SubTopicItem {
  id: string;            // "1", "2", ..., "1-5", "6-10", "mix"
  label: string;         // Display label, e.g. "Perkalian 4", "Perkalian 1-5", "Campuran"
  numbers: number[];     // The operand numbers included in this sub-topic
  type: "individual" | "range" | "mixed";
}

/**
 * Get the structured list of sub-topics for a topic.
 * Multiplication & Division get extra composite sub-topics (1-5, 6-10, Campuran).
 * Addition & Subtraction only get individual sub-topics.
 */
export function getSubTopicItems(topic: Topic): SubTopicItem[] {
  const topicLabel = getTopicLabel(topic);
  const start = topic === "division" ? 2 : 1;
  const end = 10;

  // Individual sub-topics
  const individuals: SubTopicItem[] = [];
  for (let i = start; i <= end; i++) {
    individuals.push({
      id: String(i),
      label: `${topicLabel} ${i}`,
      numbers: [i],
      type: "individual",
    });
  }

  // Only multiplication & division get composite sub-topics
  if (topic === "multiplication" || topic === "division") {
    const rangeStart = topic === "division" ? 2 : 1;

    const composites: SubTopicItem[] = [
      {
        id: `${rangeStart}-5`,
        label: `${topicLabel} ${rangeStart}-5`,
        numbers: Array.from({ length: 5 - rangeStart + 1 }, (_, i) => rangeStart + i),
        type: "range",
      },
      {
        id: "6-10",
        label: `${topicLabel} 6-10`,
        numbers: [6, 7, 8, 9, 10],
        type: "range",
      },
      {
        id: "mix",
        label: "Campuran",
        numbers: Array.from({ length: end - rangeStart + 1 }, (_, i) => rangeStart + i),
        type: "mixed",
      },
    ];

    return [...individuals, ...composites];
  }

  return individuals;
}

/**
 * Generate the pool of all possible question combinations for a sub-topic.
 * For composite sub-topics (range/mixed), generates questions for ALL included numbers.
 */
export function generateSubTopicQuestions(topic: Topic, subTopicId: string): QuestionWeight[] {
  const items = getSubTopicItems(topic);
  const item = items.find((i) => i.id === subTopicId);
  if (!item) return [];

  const questions: QuestionWeight[] = [];
  const secondOperandRange = 10;

  for (const num of item.numbers) {
    for (let i = 1; i <= secondOperandRange; i++) {
      questions.push({
        num1: num,
        num2: i,
        weight: 1,
        timesAnswered: 0,
        timesCorrect: 0,
      });
    }
  }

  return questions;
}

/**
 * Get the operator string for a given topic.
 */
function getOperator(topic: Topic): string {
  switch (topic) {
    case "addition": return "+";
    case "subtraction": return "-";
    case "multiplication": return "×";
    case "division": return "÷";
  }
}

/**
 * Format the question display values based on topic.
 * For subtraction: (num1 + num2) - num1 = num2
 * For division: (num1 * num2) ÷ num1 = num2
 */
export function getSubTopicQuestionPair(topic: Topic, num1: number, num2: number): {
  displayNum1: number;
  displayNum2: number;
  answer: number;
} {
  switch (topic) {
    case "addition":
      return {
        displayNum1: num1,
        displayNum2: num2,
        answer: num1 + num2,
      };
    case "subtraction":
      const subTotal = num1 + num2;
      return {
        displayNum1: subTotal,
        displayNum2: num1,
        answer: num2,
      };
    case "multiplication":
      return {
        displayNum1: num1,
        displayNum2: num2,
        answer: num1 * num2,
      };
    case "division":
      const dividend = num1 * num2;
      return {
        displayNum1: dividend,
        displayNum2: num1,
        answer: num2,
      };
  }
}

/**
 * Pick the next question from the sub-topic pool using weighted random selection.
 * Questions with higher weight have a higher chance of being selected.
 */
export function pickWeightedQuestion(subTopicProgress: SubTopicProgress): Question {
  const { topic, questions } = subTopicProgress;

  // Weighted random: sum all weights, pick a random number, iterate
  const totalWeight = questions.reduce((sum, q) => sum + q.weight, 0);
  let rand = Math.random() * totalWeight;

  let selected = questions[0];
  for (const q of questions) {
    rand -= q.weight;
    if (rand <= 0) {
      selected = q;
      break;
    }
  }

  const { displayNum1, displayNum2, answer } = getSubTopicQuestionPair(
    topic, selected.num1, selected.num2
  );

  const operator = getOperator(topic);
  const id = Math.random().toString(36).substring(2, 9);

  return {
    id,
    topic,
    level: 0, // not applicable in study mode
    text: `${displayNum1} ${operator} ${displayNum2} = ?`,
    num1: displayNum1,
    num2: displayNum2,
    operator,
    answer,
  };
}

/**
 * Get a localized label for the topic.
 */
export function getTopicLabel(topic: Topic): string {
  switch (topic) {
    case "addition": return "Penjumlahan";
    case "subtraction": return "Pengurangan";
    case "multiplication": return "Perkalian";
    case "division": return "Pembagian";
  }
}

/**
 * Get the display label for a sub-topic by its ID.
 */
export function getSubTopicLabel(topic: Topic, subTopicId: string): string {
  const items = getSubTopicItems(topic);
  const item = items.find((i) => i.id === subTopicId);
  return item?.label || `${getTopicLabel(topic)} ${subTopicId}`;
}
