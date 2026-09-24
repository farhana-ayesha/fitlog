import { Workout } from "@/context/PlanContext";

const BASE_URL = "https://api.abcz.workers.dev/api/fitlog";

export async function getAllWorkouts(): Promise<Workout[]> {
  const res = await fetch(BASE_URL, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load workouts");
  return res.json();
}

export async function getWorkoutById(id: string | number): Promise<Workout> {
  const res = await fetch(`${BASE_URL}/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load workout");
  const data = await res.json();
  return Array.isArray(data) ? data[0] : data;
}