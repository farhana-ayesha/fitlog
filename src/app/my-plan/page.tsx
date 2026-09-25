"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle,
  ChevronDown,
  Clock,
  Flame,
  Search,
  Star,
  X,
} from "lucide-react";
import { usePlan, Workout } from "@/context/PlanContext";
import { useToast } from "@/context/ToastContext";

type TabKey = "plan" | "saved";

const TABS: { key: TabKey; label: string }[] = [
  { key: "plan", label: "Today's Plan" },
  { key: "saved", label: "Saved" },
];

const SORT_OPTIONS: { value: keyof Workout; label: string }[] = [
  { value: "duration", label: "Duration" },
  { value: "caloriesBurned", label: "Calories" },
  { value: "rating", label: "Rating" },
];

export default function MyPlanPage() {
  const { plan, saved, hydrated, removeFromPlan, removeFromSaved, markDone } =
    usePlan();
  const { showToast } = useToast();
  const [tab, setTab] = useState<TabKey>("plan");
  const [sortBy, setSortBy] = useState<keyof Workout>("duration");
  const [query, setQuery] = useState("");

  const list: Workout[] = useMemo(() => {
    const source = tab === "plan" ? plan : saved;
    const q = query.trim().toLowerCase();
    const filtered = q
      ? source.filter(
          (w) =>
            w.name.toLowerCase().includes(q) ||
            w.muscleGroups.some((tag) => tag.toLowerCase().includes(q))
        )
      : source;
    return [...filtered].sort(
      (a, b) => (b[sortBy] as number) - (a[sortBy] as number)
    );
  }, [tab, plan, saved, sortBy, query]);

  const metrics = useMemo(() => {
    return list.reduce(
      (acc, w) => ({
        exercises: acc.exercises + 1,
        minutes: acc.minutes + w.duration,
        calories: acc.calories + w.caloriesBurned,
      }),
      { exercises: 0, minutes: 0, calories: 0 }
    );
  }, [list]);

  function handleRemove(id: number) {
    if (tab === "plan") {
      removeFromPlan(id);
      showToast("Removed from plan");
    } else {
      removeFromSaved(id);
      showToast("Removed from saved");
    }
  }

  function handleDone(id: number) {
    markDone(id);
    showToast("Marked as done");
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold uppercase tracking-wide sm:text-4xl">
        My Plan
      </h1>
      <p className="mt-2 text-sm text-muted">
        Cap of five lifts for today. Finish them, then load more.
      </p>

      <div className="mt-8 grid grid-cols-3 gap-3 sm:gap-4">
        {[
          ["Exercises", metrics.exercises],
          ["Minutes", metrics.minutes],
          ["Calories", metrics.calories],
        ].map(([label, value]) => (
          <div
            key={label}
            className="rounded-xl2 border border-line bg-surface px-4 py-5 text-center"
          >
            <p className="font-display text-3xl font-bold text-accent">
              {value}
            </p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-muted">
              {label}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col gap-4 border-b border-line pb-0 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-3 text-sm font-bold uppercase tracking-wide transition ${
                tab === t.key
                  ? "border-b-2 border-accent text-accent"
                  : "text-muted hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="mb-3 flex flex-col gap-3 sm:mb-0 sm:flex-row sm:items-center">
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

      <div className="mt-6">
        {!hydrated && (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted">
            <p className="text-sm">Loading workouts…</p>
          </div>
        )}

        {hydrated && list.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 rounded-xl2 border border-line bg-surface py-16 text-center">
            <p className="font-display text-xl font-bold uppercase tracking-wide">
              Nothing here yet
            </p>
            <p className="max-w-xs text-sm text-muted">
              {query
                ? "No matches for that search."
                : "Browse the library and add a lift to get today moving."}
            </p>
            <Link href="/" className="btn-primary mt-2">
              Go to workouts
            </Link>
          </div>
        )}

        {hydrated && list.length > 0 && (
          <ul className="space-y-3">
            {list.map((w) => (
              <li
                key={w.id}
                className="flex flex-col gap-4 rounded-xl2 border border-line bg-surface p-4 sm:flex-row sm:items-center"
              >
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-surface2">
                  <Image src={w.image} alt={w.name} fill className="object-cover" />
                </div>

                <div className="flex-1">
                  <p
                    className={`font-display text-base font-bold uppercase tracking-wide ${
                      w.done ? "text-muted line-through" : ""
                    }`}
                  >
                    {w.name}
                  </p>
                  <p className="text-xs text-muted">{w.equipment}</p>
                  <div className="mt-2 flex items-center gap-4">
                    <span className="stat-chip">
                      <Clock className="h-3.5 w-3.5" /> {w.duration} min
                    </span>
                    <span className="stat-chip">
                      <Flame className="h-3.5 w-3.5" /> {w.caloriesBurned} kcal
                    </span>
                    <span className="stat-chip">
                      <Star className="h-3.5 w-3.5 text-accent" /> {w.rating}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/workout/${w.id}`}
                    className="rounded-full border border-line px-4 py-2 text-xs font-bold uppercase tracking-wide text-white transition hover:border-accent hover:text-accent"
                  >
                    View Details
                  </Link>

                  {tab === "plan" && (
                    <button
                      onClick={() => handleDone(w.id)}
                      title="Mark as Done"
                      className={`flex h-9 w-9 items-center justify-center rounded-full border transition ${
                        w.done
                          ? "border-accent text-accent"
                          : "border-line text-white hover:border-accent hover:text-accent"
                      }`}
                    >
                      <CheckCircle className="h-4 w-4" />
                    </button>
                  )}

                  <button
                    onClick={() => handleRemove(w.id)}
                    title="Remove"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-white transition hover:border-red-400 hover:text-red-400"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}