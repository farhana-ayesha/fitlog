import Link from "next/link";
import Image from "next/image";
import { Clock, Flame, Star } from "lucide-react";
import { Workout } from "@/context/PlanContext";

export default function WorkoutCard({ workout }: { workout: Workout }) {
  return (
    <Link
      href={`/workout/${workout.id}`}
      className="group flex flex-col overflow-hidden rounded-xl2 border border-line bg-surface transition hover:border-accent"
    >
      <div className="relative h-40 w-full overflow-hidden bg-surface2">
        <Image
          src={workout.image}
          alt={workout.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex flex-wrap gap-2">
          {workout.muscleGroups.slice(0, 2).map((tag) => (
            <span key={tag} className="tag-pill">
              {tag}
            </span>
          ))}
        </div>
        <h3 className="font-display text-lg font-bold uppercase tracking-wide">
          {workout.name}
        </h3>
        <p className="text-xs text-muted">{workout.equipment}</p>
        <div className="mt-auto flex items-center gap-4 border-t border-line pt-3">
          <span className="stat-chip">
            <Clock className="h-3.5 w-3.5" /> {workout.duration} min
          </span>
          <span className="stat-chip">
            <Flame className="h-3.5 w-3.5" /> {workout.caloriesBurned} kcal
          </span>
          <span className="stat-chip">
            <Star className="h-3.5 w-3.5 text-accent" /> {workout.rating}
          </span>
        </div>
      </div>
    </Link>
  );
}