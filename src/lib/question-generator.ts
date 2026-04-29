import { Topic, Question } from "@/types";

export function generateQuestion(topic: Topic, level: number): Question {
  const id = Math.random().toString(36).substring(2, 9);
  let num1 = 0;
  let num2 = 0;
  let answer = 0;
  let operator = "";

  // Define ranges based on level
  const ranges = [
    { min: 1, max: 10 },   // Level 1
    { min: 1, max: 25 },   // Level 2
    { min: 1, max: 50 },   // Level 3
    { min: 1, max: 100 },  // Level 4
    { min: 1, max: 500 },  // Level 5
  ];

  const range = ranges[level - 1] || ranges[ranges.length - 1];

  const getRandomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  switch (topic) {
    case "addition":
      operator = "+";
      num1 = getRandomInt(range.min, range.max);
      num2 = getRandomInt(range.min, range.max);
      answer = num1 + num2;
      break;

    case "subtraction":
      operator = "-";
      num1 = getRandomInt(range.min, range.max);
      num2 = getRandomInt(range.min, num1); // Ensure no negative results
      answer = num1 - num2;
      break;

    case "multiplication":
      operator = "×";
      // Adjust ranges for multiplication to keep it manageable
      const multMax = level === 1 ? 5 : level === 2 ? 10 : level === 3 ? 12 : level === 4 ? 20 : 50;
      num1 = getRandomInt(range.min, multMax);
      num2 = getRandomInt(range.min, 10);
      answer = num1 * num2;
      break;

    case "division":
      operator = "÷";
      // Adjust ranges for division
      const divMax = level === 1 ? 20 : level === 2 ? 50 : level === 3 ? 100 : level === 4 ? 200 : 500;
      num2 = getRandomInt(range.min, 10);
      answer = getRandomInt(1, divMax / num2);
      num1 = answer * num2; // Ensure no remainder
      break;
  }

  // Format variation: a + b = ?, a + ? = c, ? + b = c
  // For now, let's stick to a + b = ? for simplicity, but we can add variations later
  const text = `${num1} ${operator} ${num2} = ?`;

  return {
    id,
    topic,
    level,
    text,
    num1,
    num2,
    operator,
    answer,
  };
}
