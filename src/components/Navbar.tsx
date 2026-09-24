"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePlan } from "../context/PlanContext"
import Image from "next/image"

const NAV_ITEMS = [
  { href: "/#library", label: "Workouts" },
  { href: "/my-plan", label: "My Plan" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { plan, saved } = usePlan();

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-ink/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">

       <Link href="/" className="flex items-center gap-2 font-display text-lg font-bold">
  <Image src="/assets/logo.png" alt="FitLog logo" width={32} height={32} className="rounded-lg" />
  FITLOG
</Link> 
        <nav className="hidden gap-2 md:flex">
          {NAV_ITEMS.map(({ href, label }) => {
            const active = href === "/my-plan" ? pathname === href : pathname === "/";
            return (
              <Link
                key={label}
                href={href}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                  active ? "bg-surface2 text-accent" : "text-white/70 hover:text-white"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-5">
          <Counter href="/my-plan" label="Plan" count={plan.length} filled />
          <Counter href="/my-plan" label="Saved" count={saved.length} />
        </div>
      </div>
    </header>
  );
}

type CounterProps = {
  href: string;
  label: string;
  count: number;
  filled?: boolean;
};

function Counter({ href, label, count, filled = false }: CounterProps) {
  return (
    <Link href={href} className="flex items-center gap-2 text-sm font-semibold">
      {label}
      <span
        className={`grid h-6 min-w-6 place-items-center rounded-full px-1 text-xs font-bold ${
          filled ? "bg-accent text-ink" : "border border-line text-white"
        }`}
      >
        {count}
      </span>
    </Link>
  );
}