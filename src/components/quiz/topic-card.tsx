"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Topic, TopicProgress } from "@/types";
import { Plus, Minus, X, Divide, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface TopicCardProps {
  topic: Topic;
  title: string;
  description: string;
  progress: TopicProgress;
  onClick: () => void;
}

const icons = {
  addition: { icon: Plus, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/20", border: "border-blue-100 dark:border-blue-900/50" },
  subtraction: { icon: Minus, color: "text-red-500", bg: "bg-red-50 dark:bg-red-950/20", border: "border-red-100 dark:border-red-900/50" },
  multiplication: { icon: X, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-950/20", border: "border-amber-100 dark:border-amber-900/50" },
  division: { icon: Divide, color: "text-green-500", bg: "bg-green-50 dark:bg-green-950/20", border: "border-green-100 dark:border-green-900/50" },
};

export function TopicCard({ topic, title, description, progress, onClick }: TopicCardProps) {
  const { icon: Icon, color, bg, border } = icons[topic];
  
  const accuracy = progress.totalAnswered > 0 
    ? Math.round((progress.totalCorrect / progress.totalAnswered) * 100) 
    : 0;

  return (
    <button onClick={onClick} className="text-left w-full focus:outline-none">
      <Card className="group h-full overflow-hidden transition-all hover:shadow-lg hover:border-primary/20 active:scale-[0.98] cursor-pointer">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className={cn("p-2 rounded-xl border", bg, color, border)}>
              <Icon className="h-6 w-6" />
            </div>
            <Badge variant="secondary" className="font-bold">
              Level {progress.currentLevel}
            </Badge>
          </div>
          <CardTitle className="mt-4 text-xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex flex-col">
              <span className="text-muted-foreground font-medium">Akurasi</span>
              <span className="font-bold text-lg">{accuracy}%</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-muted-foreground font-medium">Total Soal</span>
              <span className="font-bold text-lg">{progress.totalAnswered}</span>
            </div>
          </div>
          <div className="mt-6 flex items-center text-primary font-bold text-sm group-hover:translate-x-1 transition-transform">
            Pilih Mode <ChevronRight className="ml-1 h-4 w-4" />
          </div>
        </CardContent>
      </Card>
    </button>
  );
}
