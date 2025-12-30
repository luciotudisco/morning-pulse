"use client";

import { cn } from "@/lib/utils";
import { AnimatedCircularProgressBar } from "@/components/ui/animated-circular-progress-bar";
import { useEffect, useState } from "react";

interface LoadingProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  text?: string;
}

const sizeClasses = {
  sm: "scale-75",
  md: "",
  lg: "scale-125",
};

export function Loading({ className, size = "md", text }: LoadingProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          return 0;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={cn("flex flex-col items-center justify-center gap-2", className)}>
      <div className={cn(sizeClasses[size])} aria-label="Loading">
        <AnimatedCircularProgressBar
          value={progress}
          gaugePrimaryColor="currentColor"
          gaugeSecondaryColor="currentColor"
          className="opacity-50"
        />
      </div>
      {text && (
        <p className="text-sm text-muted-foreground">{text}</p>
      )}
    </div>
  );
}

