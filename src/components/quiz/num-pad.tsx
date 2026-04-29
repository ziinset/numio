"use client";

import { Button } from "@/components/ui/button";
import { Delete, Check } from "lucide-react";

interface NumPadProps {
  onInput: (value: string) => void;
  onDelete: () => void;
  onSubmit: () => void;
}

export function NumPad({ onInput, onDelete, onSubmit }: NumPadProps) {
  const buttons = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

  return (
    <div className="grid grid-cols-3 gap-2 w-full max-w-[300px] mx-auto">
      {buttons.map((num) => (
        <Button
          key={num}
          variant="outline"
          className="h-16 text-2xl font-bold rounded-xl hover:bg-primary/10 hover:text-primary transition-all active:scale-95"
          onClick={() => onInput(num)}
        >
          {num}
        </Button>
      ))}
      <Button
        variant="outline"
        className="h-16 text-2xl font-bold rounded-xl hover:bg-destructive/10 hover:text-destructive transition-all active:scale-95"
        onClick={onDelete}
      >
        <Delete className="h-6 w-6" />
      </Button>
      <Button
        className="h-16 text-2xl font-bold rounded-xl shadow-lg active:scale-95 transition-all"
        onClick={onSubmit}
      >
        <Check className="h-6 w-6" />
      </Button>
    </div>
  );
}
