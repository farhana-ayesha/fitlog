import { ReactNode } from "react";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "../components/Footer"
import { PlanProvider } from "@/context/PlanContext";
import { ToastProvider } from "../context/ToastContext"

export const metadata = {
  title: "FitLog — Workout Library",
  description:
    "FitLog is a dark, no-nonsense gym companion: pick a lift, lock it into today's plan, and watch the week's work add up.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-ink text-white">
        <PlanProvider>
          <ToastProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </ToastProvider>
        </PlanProvider>
      </body>
    </html>
  );
}