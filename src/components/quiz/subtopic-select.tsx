"use client";

import { Topic, SubTopicProgress } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { storage } from "@/lib/storage";
import { getSubTopicItems, getTopicLabel, SubTopicItem } from "@/lib/subtopic-generator";
import { getMasteryPercentage } from "@/lib/study-engine";
import { ChevronLeft, CheckCircle2, Layers, Shuffle } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";

interface SubTopicSelectProps {
  topic: Topic;
}

export function SubTopicSelect({ topic }: SubTopicSelectProps) {
  const router = useRouter();
  const [progressMap, setProgressMap] = useState<Record<string, SubTopicProgress | null>>({});
  const allItems = useMemo(() => getSubTopicItems(topic), [topic]);
  const topicLabel = getTopicLabel(topic);

  const individuals = allItems.filter((i) => i.type === "individual");
  const composites = allItems.filter((i) => i.type === "range" || i.type === "mixed");

  useEffect(() => {
    const map: Record<string, SubTopicProgress | null> = {};
    for (const item of allItems) {
      map[`${topic}_${item.id}`] = storage.getSubTopicProgress(topic, item.id);
    }
    setProgressMap(map);
  }, [topic, allItems]);

  const getStatus = (item: SubTopicItem): "new" | "in-progress" | "mastered" => {
    const progress = progressMap[`${topic}_${item.id}`];
    if (!progress) return "new";
    const mastery = getMasteryPercentage(progress);
    if (mastery >= 100) return "mastered";
    return "in-progress";
  };

  const getMastery = (item: SubTopicItem): number => {
    const progress = progressMap[`${topic}_${item.id}`];
    if (!progress) return 0;
    return getMasteryPercentage(progress);
  };

  const getAnsweredCount = (item: SubTopicItem): number => {
    const progress = progressMap[`${topic}_${item.id}`];
    return progress?.totalAnswered || 0;
  };

  const getTotalQuestions = (item: SubTopicItem): number => {
    // Each number has 10 questions (×1 through ×10)
    return item.numbers.length * 10;
  };

  const renderCard = (item: SubTopicItem) => {
    const status = getStatus(item);
    const mastery = getMastery(item);
    const answered = getAnsweredCount(item);
    const total = getTotalQuestions(item);
    const isComposite = item.type !== "individual";

    return (
      <button
        key={item.id}
        onClick={() => router.push(`/learn/study/session?topic=${topic}&sub=${item.id}`)}
        className="text-left focus:outline-none group w-full"
      >
        <Card className={cn(
          "h-full transition-all cursor-pointer overflow-hidden active:scale-[0.97]",
          "hover:shadow-lg hover:border-primary/30",
          status === "mastered" && "border-emerald-300 dark:border-emerald-700 bg-emerald-50/30 dark:bg-emerald-950/10"
        )}>
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div className={cn(
                "rounded-xl flex items-center justify-center font-black",
                isComposite ? "h-12 px-3 text-sm gap-1.5" : "h-12 w-12 text-xl",
                status === "mastered"
                  ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400"
                  : status === "in-progress"
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground"
              )}>
                {item.type === "mixed" ? (
                  <><Shuffle className="h-4 w-4" /></>
                ) : item.type === "range" ? (
                  <><Layers className="h-4 w-4" /> {item.id}</>
                ) : (
                  item.id
                )}
              </div>
              {status === "mastered" && (
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              )}
              {status === "new" && (
                <Badge variant="outline" className="text-[10px] uppercase tracking-wider font-bold opacity-60">
                  Baru
                </Badge>
              )}
            </div>

            <h3 className="font-bold text-sm mb-1">
              {item.label}
            </h3>

            {status !== "new" ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Penguasaan</span>
                  <span className="font-bold">{mastery}%</span>
                </div>
                <Progress value={mastery} className="h-1.5" />
                <p className="text-[11px] text-muted-foreground">
                  {answered} soal dijawab
                </p>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground mt-1">
                {isComposite ? `${total} soal` : "Belum pernah dicoba"}
              </p>
            )}
          </CardContent>
        </Card>
      </button>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => router.push("/")}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-black tracking-tight">
            {topicLabel}
          </h1>
          <p className="text-muted-foreground">
            Pilih sub-materi yang ingin kamu pelajari.
          </p>
        </div>
      </div>

      {/* Individual Sub-topics */}
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          Sub-Materi Individual
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {individuals.map(renderCard)}
        </div>
      </div>

      {/* Composite Sub-topics (only for multiplication & division) */}
      {composites.length > 0 && (
        <>
          <Separator className="my-8" />
          <div>
            <h2 className="text-lg font-bold mb-2 flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" />
              Sub-Materi Gabungan
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Latihan gabungan dari beberapa sub-materi sekaligus.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {composites.map(renderCard)}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
