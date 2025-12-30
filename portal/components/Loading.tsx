"use client";

import { cn } from "@/lib/utils";
import { Spinner } from "./ui/spinner";

interface LoadingProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  text?: string;
}

const spinnerSizeClasses = {
  sm: "size-8",
  md: "size-16",
  lg: "size-24",
};

export function Loading({ className, size = "md", text }: LoadingProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-2", className)}>
      <Spinner className={spinnerSizeClasses[size]} aria-label="Loading" />
      {text && (
        <p className="text-sm text-muted-foreground">{text}</p>
      )}
    </div>
  );
}

