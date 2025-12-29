import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="sticky bottom-0 z-50 w-full border-t border-indigo-500/20 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/50 dark:via-purple-950/50 dark:to-pink-950/50 backdrop-blur-md supports-backdrop-filter:bg-gradient-to-r supports-backdrop-filter:from-indigo-50/95 supports-backdrop-filter:via-purple-50/95 supports-backdrop-filter:to-pink-50/95 dark:supports-backdrop-filter:from-indigo-950/80 dark:supports-backdrop-filter:via-purple-950/80 dark:supports-backdrop-filter:to-pink-950/80">
      <div className="container flex h-10 items-center justify-center px-4">
        <p className="text-xs flex items-center gap-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
          Made with <Heart className="h-3 w-3 fill-pink-500 text-pink-500 animate-pulse" /> in Dublin
        </p>
      </div>
    </footer>
  );
}

