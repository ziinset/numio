"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Topic } from "@/types";
import { BookOpen, Dumbbell, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface ModeSelectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  topic: Topic;
  topicTitle: string;
}

const modes = [
  {
    id: "practice" as const,
    title: "Mode Latihan",
    description: "Uji kemampuanmu dengan soal adaptif. Tingkat kesulitan akan menyesuaikan secara otomatis.",
    icon: Dumbbell,
    color: "text-blue-500",
    bg: "bg-blue-50 dark:bg-blue-950/30",
    border: "border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600",
    hoverBg: "hover:bg-blue-50/80 dark:hover:bg-blue-950/50",
  },
  {
    id: "study" as const,
    title: "Mode Belajar",
    description: "Belajar bertahap per sub-materi. Soal yang salah akan muncul lebih sering sampai kamu hafal.",
    icon: BookOpen,
    color: "text-emerald-500",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    border: "border-emerald-200 dark:border-emerald-800 hover:border-emerald-400 dark:hover:border-emerald-600",
    hoverBg: "hover:bg-emerald-50/80 dark:hover:bg-emerald-950/50",
  },
];

export function ModeSelectDialog({ isOpen, onClose, topic, topicTitle }: ModeSelectDialogProps) {
  const router = useRouter();

  const handleSelect = (mode: "practice" | "study") => {
    onClose();
    if (mode === "practice") {
      router.push(`/learn?topic=${topic}`);
    } else {
      router.push(`/learn/study?topic=${topic}`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-bold">
            {topicTitle}
          </DialogTitle>
          <DialogDescription className="text-center text-sm">
            Pilih mode yang ingin kamu gunakan.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-2 py-2">
          {modes.map((mode) => {
            const Icon = mode.icon;
            return (
              <button
                key={mode.id}
                onClick={() => handleSelect(mode.id)}
                className={cn(
                  "flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-all cursor-pointer",
                  "active:scale-[0.98]",
                  mode.border,
                  mode.hoverBg,
                )}
              >
                <div className={cn("p-2.5 rounded-lg shrink-0", mode.bg, mode.color)}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm">{mode.title}</h3>
                  <p className="text-xs text-muted-foreground leading-snug">
                    {mode.description}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground/50 shrink-0" />
              </button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
