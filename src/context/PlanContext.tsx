"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Workout = {
  id: number;
  name: string;
  image: string;
  muscleGroups: string[];
  equipment: string;
  difficulty: string;
  duration: number;
  caloriesBurned: number;
  sets: number;
  reps: string;
  rating: number;
  description: string;
  instructions: string[];
  done?: boolean;
};

type PlanContextType = {
  plan: Workout[];
  saved: Workout[];
  hydrated: boolean;
  isInPlan: (id: number) => boolean;
  isInSaved: (id: number) => boolean;
  isPlanFull: boolean;
  planCap: number;
  addToPlan: (workout: Workout) => boolean;
  addToSaved: (workout: Workout) => boolean;
  removeFromPlan: (id: number) => void;
  removeFromSaved: (id: number) => void;
  markDone: (id: number) => void;
};

const PlanContext = createContext<PlanContextType | null>(null);
const PLAN_KEY = "fitlog:plan";
const SAVED_KEY = "fitlog:saved";
const PLAN_CAP = 5;

function safeRead(key: string): Workout[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function PlanProvider({ children }: { children: ReactNode }) {
  const [plan, setPlan] = useState<Workout[]>([]);
  const [saved, setSaved] = useState<Workout[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
  // eslint-disable-next-line react-hooks/set-state-in-effect
  setPlan(safeRead(PLAN_KEY));
  setSaved(safeRead(SAVED_KEY));
  setHydrated(true);
}, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(PLAN_KEY, JSON.stringify(plan));
  }, [plan, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(SAVED_KEY, JSON.stringify(saved));
  }, [saved, hydrated]);

  const isInPlan = (id: number) => plan.some((w) => w.id === id);
  const isInSaved = (id: number) => saved.some((w) => w.id === id);
  const isPlanFull = plan.length >= PLAN_CAP;

  function addToPlan(workout: Workout) {
    if (isInPlan(workout.id) || isPlanFull) return false;
    setPlan((prev) => [...prev, { ...workout, done: false }]);
    return true;
  }

  function addToSaved(workout: Workout) {
    if (isInSaved(workout.id)) return false;
    setSaved((prev) => [...prev, workout]);
    return true;
  }

  function removeFromPlan(id: number) {
    setPlan((prev) => prev.filter((w) => w.id !== id));
  }

  function removeFromSaved(id: number) {
    setSaved((prev) => prev.filter((w) => w.id !== id));
  }

  function markDone(id: number) {
    setPlan((prev) =>
      prev.map((w) => (w.id === id ? { ...w, done: !w.done } : w))
    );
  }

  return (
    <PlanContext.Provider
      value={{
        plan,
        saved,
        hydrated,
        isInPlan,
        isInSaved,
        isPlanFull,
        planCap: PLAN_CAP,
        addToPlan,
        addToSaved,
        removeFromPlan,
        removeFromSaved,
        markDone,
      }}
    >
      {children}
    </PlanContext.Provider>
  );
}

export function usePlan() {
  const ctx = useContext(PlanContext);
  if (!ctx) throw new Error("usePlan must be used within PlanProvider");
  return ctx;
}