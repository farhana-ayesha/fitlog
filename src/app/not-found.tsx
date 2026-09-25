import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center justify-center gap-4 px-4 py-32 text-center">
      <p className="font-display text-6xl font-bold text-accent">404</p>
      <h1 className="font-display text-2xl font-bold uppercase tracking-wide">
        Page not found
      </h1>
      <p className="text-sm text-muted">
        The lift or page you&apos;re looking for doesn&apos;t exist. Head back
        to the library and keep the session moving.
      </p>
      <Link href="/" className="btn-primary mt-2">
        Go to workouts
      </Link>
    </div>
  );
}