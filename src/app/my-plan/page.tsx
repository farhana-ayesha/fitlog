"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle, Clock, Flame, Star, X } from "lucide-react";
import { usePlan, Workout } from "@/context/PlanContext";
import { useToast } from "@/context/ToastContext";

type TabKey = "plan" | "saved";

const TABS: { key: TabKey; label: string }[] = [
  { key: "plan", label: "Today's Plan" },
  { key: "saved", label: "Saved" },
];

export default function MyPlanPage() {
  const { plan, saved, hydrated, removeFromPlan, removeFromSaved, markDone } =
    usePlan();
  const { showToast } = useToast();
  const [tab, setTab] = useState<TabKey>("plan");

  // যেই ট্যাব সিলেক্টেড, সেই লিস্টটাই দেখাবো
  const list: Workout[] = tab === "plan" ? plan : saved;

  const metrics = useMemo(() => {
    return plan.reduce(
      (acc, w) => ({
        exercises: acc.exercises + 1,
        minutes: acc.minutes + w.duration,
        calories: acc.calories + w.caloriesBurned,
      }),
      { exercises: 0, minutes: 0, calories: 0 }
    );
  }, [plan]);

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

      {/* মেট্রিক্স সামারি — শুধু Today's Plan থেকে হিসাব হয় */}
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

      {/* Today's Plan / Saved ট্যাব */}
      <div className="mt-8 flex gap-2 border-b border-line">
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
              Browse the library and add a lift to get today moving.
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

                  {/* Mark as Done শুধু Today's Plan ট্যাবে দরকার, Saved-এ না */}
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