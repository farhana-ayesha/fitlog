"use client";

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import Image from "next/image";
import { Bookmark, ListPlus, Loader2 } from "lucide-react";
import { getWorkoutById } from "@/lib/api";
import { usePlan, Workout } from "@/context/PlanContext";
import { useToast } from "@/context/ToastContext";

export default function WorkoutDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFoundFlag, setNotFoundFlag] = useState(false);
  const { addToPlan, addToSaved, isInPlan, isInSaved, isPlanFull, planCap } =
    usePlan();
  const { showToast } = useToast();

  useEffect(() => {
    let active = true;
    getWorkoutById(id)
      .then((data) => {
        if (!active) return;
        if (!data) setNotFoundFlag(true);
        else setWorkout(data);
      })
      .catch(() => {
        if (active) setNotFoundFlag(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-32 text-muted">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
        <p className="text-sm">Loading workout…</p>
      </div>
    );
  }

  if (notFoundFlag || !workout) {
    notFound();
  }

  const numericId = Number(id);
  const alreadyInPlan = isInPlan(numericId);
  const alreadyInSaved = isInSaved(numericId);

  function handleAddToPlan() {
    if (alreadyInPlan || !workout) return;
    if (isPlanFull) {
      showToast(`Plan is full (max ${planCap} lifts)`);
      return;
    }
    addToPlan(workout);
    showToast("Added to today's plan");
  }

  function handleSave() {
    if (alreadyInSaved || !workout) return;
    addToSaved(workout);
    showToast("Saved for later");
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="grid gap-10 md:grid-cols-2">
        <div className="relative h-72 w-full overflow-hidden rounded-xl2 border border-line bg-surface sm:h-96">
          <Image
            src={workout!.image}
            alt={workout!.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        </div>

        <div>
          <div className="mb-3 flex flex-wrap gap-2">
            {workout!.muscleGroups.map((tag) => (
              <span key={tag} className="tag-pill">
                {tag}
              </span>
            ))}
          </div>
          <h1 className="font-display text-3xl font-bold uppercase tracking-wide sm:text-4xl">
            {workout!.name}
          </h1>
          <p className="mt-4 text-sm text-muted">{workout!.description}</p>

          <dl className="mt-6 divide-y divide-line rounded-xl2 border border-line bg-surface text-sm">
            {[
              ["Equipment", workout!.equipment],
              ["Difficulty", workout!.difficulty],
              ["Sets", workout!.sets],
              ["Reps", workout!.reps],
              ["Duration", `${workout!.duration} min`],
              ["Calories", `${workout!.caloriesBurned} kcal`],
              ["Rating", workout!.rating],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between px-4 py-3">
                <dt className="font-semibold uppercase tracking-wide text-muted">
                  {label}
                </dt>
                <dd className="font-semibold">{value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8">
            <h2 className="mb-3 font-display text-lg font-bold uppercase tracking-wide">
              Instructions
            </h2>
            <ol className="space-y-3">
              {workout!.instructions.map((step, i) => (
                <li key={i} className="flex gap-3 text-sm text-muted">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface2 text-xs font-bold text-accent">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={handleAddToPlan}
              disabled={alreadyInPlan || isPlanFull}
              className="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ListPlus className="h-4 w-4" />
              {alreadyInPlan ? "Already in plan" : "Add to today's plan"}
            </button>
            <button
              onClick={handleSave}
              disabled={alreadyInSaved}
              className="btn-secondary disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Bookmark className="h-4 w-4" />
              {alreadyInSaved ? "Saved" : "Save for later"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}