"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Topic } from "@/types";
import { SubTopicSelect } from "@/components/quiz/subtopic-select";

function StudyContent() {
  const searchParams = useSearchParams();
  const topicParam = searchParams.get("topic") as Topic;
  const topic = (["addition", "subtraction", "multiplication", "division"].includes(topicParam)
    ? topicParam
    : "multiplication") as Topic;

  return <SubTopicSelect topic={topic} />;
}

export default function StudyPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[50vh]">Memuat...</div>}>
      <StudyContent />
    </Suspense>
  );
}
