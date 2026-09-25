# FitLog — Workout Library

FitLog is a workout tracking app built for the B14-A6-Fit Log assignment. The idea is simple: browse a library of lifts, pick the ones you want to do today, and track your progress as you go. It has a dark, minimal look and works across phone, tablet, and desktop.

## Technologies Used

- Next.js (App Router) for routing and rendering
- React for the UI and state management
- TypeScript for type safety
- Tailwind CSS for styling
- lucide-react for icons
- Browser localStorage to keep your plan and saved list across page reloads

## Features

1. A responsive workout library that pulls all 12 lifts from the FitLog API and lays them out in a grid that adjusts from desktop down to mobile.
2. A detail page for every workout showing equipment, difficulty, sets, reps, duration, calories, and step-by-step instructions.
3. Add any lift to today's plan (capped at five) or save it for later, with the navbar badges and toast messages updating right away.
4. A My Plan page with live totals for exercises, minutes, and calories, separate tabs for today's plan and saved lifts, and options to mark a lift done or remove it.
5. Search and sort, both in the main library and on the My Plan page, so you can filter by name or muscle group and order by duration, calories, or rating.
6. Your plan and saved lists stick around after a refresh thanks to localStorage, and any broken or unknown link takes you to a proper 404 page instead of an error.

## Getting Started

```bash
npm install
npm run dev
```

Then open http://localhost:3000 in your browser.

## Build

```bash
npm run build
npm start
```

## Deployment

The app has been deployed and every page reloads cleanly with no console errors. It doesn't need any environment variables — it talks directly to the public FitLog API:

https://api.abcz.workers.dev/api/fitlog
https://api.abcz.workers.dev/api/fitlog/:id

## Submission

- Live Link: https://fitlog-gules-nu.vercel.app/
- GitHub Repository Link: https://github.com/farhana-ayesha/fitlog
