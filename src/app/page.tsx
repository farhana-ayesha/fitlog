"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ChevronDown, Dumbbell, Loader2, Search } from "lucide-react";
import { getAllWorkouts } from "@/lib/api"
import { Workout } from "@/context/PlanContext";
import WorkoutCard from "@/components/WorkoutCard"

const SORT_OPTIONS: { value: keyof Workout; label: string }[] = [
  { value: "duration", label: "Duration" },
  { value: "caloriesBurned", label: "Calories" },
  { value: "rating", label: "Rating" },
];

export default function HomePage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<keyof Workout>("duration");
  const [query, setQuery] = useState("");

  useEffect(() => {
    let active = true;
    getAllWorkouts()
      .then((data) => {
        if (active) setWorkouts(data);
      })
      .catch(() => {
        if (active) setError("Could not load the workout library. Please try again.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const visibleWorkouts = useMemo(() => {
    const filtered = workouts.filter((w) => {
      const q = query.trim().toLowerCase();
      if (!q) return true;
      return (
        w.name.toLowerCase().includes(q) ||
        w.muscleGroups.some((tag) => tag.toLowerCase().includes(q))
      );
    });
    return [...filtered].sort(
      (a, b) => (b[sortBy] as number) - (a[sortBy] as number)
    );
  }, [workouts, sortBy, query]);

  return (
    <div>
      <section className="mx-auto max-w-6xl px-4 pt-8 sm:px-6">
        <div className="grid gap-8 rounded-xl2 border border-line bg-surface p-8 md:grid-cols-2 md:items-center md:p-12">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-accent">
              Workout Library
            </p>
            <h1 className="font-display text-4xl font-bold uppercase leading-tight tracking-tight sm:text-5xl">
              Train with intent.
              <br />
              Log every set.
            </h1>
            <p className="mt-5 max-w-md text-sm text-muted">
              FitLog is a dark, no-nonsense gym companion: pick a lift, lock
              it into today&apos;s plan, and watch the week&apos;s work add
              up.
            </p>
            <a href="#library" className="btn-primary mt-8">
              <Dumbbell className="h-4 w-4" />
              Browse Workouts
            </a>
          </div>
          
<div className="relative mx-auto h-64 w-full max-w-sm overflow-hidden rounded-xl2 sm:h-80">
 <Image
  src="/assets/banner.png"
  alt="FitLog workout illustration"
  fill
  sizes="(max-width: 768px) 100vw, 400px"
  className="object-contain"
  priority
/>
</div>

        </div>
      </section>

      <section id="library" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold uppercase tracking-wide">
              The Library
            </h2>
            <p className="mt-1 text-sm text-muted">
              Twelve lifts covering every major muscle group.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2">
              <Search className="h-4 w-4 text-muted" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name or tag"
                className="w-40 bg-transparent text-sm outline-none placeholder:text-muted"
              />
            </div>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as keyof Workout)}
                className="appearance-none rounded-full border border-line bg-surface py-2 pl-4 pr-9 text-sm font-semibold text-white outline-none"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    Sort By: {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            </div>
          </div>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center gap-3 py-24 text-muted">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
            <p className="text-sm">Loading workouts…</p>
          </div>
        )}

        {!loading && error && (
          <p className="rounded-xl2 border border-line bg-surface p-6 text-center text-sm text-muted">
            {error}
          </p>
        )}

        {!loading && !error && visibleWorkouts.length === 0 && (
  <p className="rounded-xl2 border border-line bg-surface p-6 text-center text-sm text-muted">
    No workouts match your search.
  </p>
)}

{!loading && !error && visibleWorkouts.length > 0 && (
  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
    {visibleWorkouts.map((workout) => (
      <WorkoutCard key={workout.id} workout={workout} />
    ))}
  </div>
)}
      </section>
    </div>
  );
}