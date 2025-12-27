import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="sticky bottom-0 z-50 w-full border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-center px-4">
        <p className="text-sm text-muted-foreground flex items-center gap-1">
          Made with <Heart className="h-4 w-4 fill-red-500 text-red-500" /> in Dublin
        </p>
      </div>
    </footer>
  );
}

