import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="sticky bottom-0 z-50 w-full flex justify-center items-center h-10 bg-white border-t shadow-sm">
      <p className="text-xs flex items-center gap-1">
        Made with <Heart className="h-3 w-3 fill-red-500 text-red-500" /> in Dublin
      </p>
    </footer>
  );
}

