import { Dumbbell } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-ink">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 sm:flex-row sm:px-6">
        <div className="flex items-center gap-2 font-display text-base font-bold tracking-wide">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-ink">
            <Dumbbell className="h-4 w-4" />
          </span>
          FITLOG
        </div>
        <p className="text-center text-xs text-muted sm:text-right">
          © 2026 FitLog — Workout Library. Train hard, log honest.
        </p>
      </div>
    </footer>
  );
}