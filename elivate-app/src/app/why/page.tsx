"use client";

import Link from "next/link";

const reasons = [
  "Goals give you a clear direction and daily target.",
  "They prove you care about your vision enough to write it down.",
  "A written goal creates a path you can follow and measure.",
];

const goalTypes = [
  {
    title: "Believe Goal (Dream/Maximum)",
    points: [
      "Set between the 15th of the current month and the 1st of the next.",
      "What you would achieve if everything goes right—no excuses.",
      "This is your maximum result; work from this number.",
    ],
  },
  {
    title: "Affirmation Goal (Reality Report)",
    points: [
      "Set on the 15th after 30 days of work on your Believe goal.",
      "What your current time, resources, and effort have earned you.",
      "A clear report of the results from sowing for 30 days.",
    ],
  },
];

const smart = ["Specific", "Measurable", "Achievable", "Realistic", "Time-bound"];

export default function WhyPage() {
  return (
    <div className="min-h-screen bg-page px-4 py-10">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <header className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">
              Elivate Network
            </p>
            <h1 className="text-3xl font-bold text-ink">Why We Set Goals</h1>
            <p className="text-muted">
              Clarity, belief, and action — distilled from our training notes.
            </p>
          </div>
          <Link href="/" className="button button-secondary">
            Back to Planner
          </Link>
        </header>

        <section className="card p-6 sm:p-8">
          <h2 className="text-2xl font-semibold text-ink">Why set goals</h2>
          <p className="text-muted">Clarity, motivation, and a path you can measure.</p>
          <ul className="mt-4 space-y-2 text-ink">
            {reasons.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="text-brand">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {goalTypes.map((block) => (
            <div key={block.title} className="card p-6">
              <h3 className="text-xl font-semibold text-ink">{block.title}</h3>
              <ul className="mt-3 space-y-2 text-muted">
                {block.points.map((point) => (
                  <li key={point} className="flex gap-3">
                    <span className="text-brand">–</span>
                    <span className="text-ink">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section className="card p-6 sm:p-8">
          <h3 className="text-xl font-semibold text-ink">SMART Checklist</h3>
          <p className="text-muted">Use this to pressure-test every goal.</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-5">
            {smart.map((item) => (
              <div
                key={item}
                className="rounded-lg border border-border bg-card px-4 py-3 text-center text-ink"
              >
                <p className="text-sm font-semibold">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="card p-6 sm:p-8">
          <h3 className="text-xl font-semibold text-ink">Break it down</h3>
          <p className="text-muted">
            The first test of commitment is breaking your goal into weekly and daily actions.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <span className="pill">Weekly targets</span>
            <span className="pill">Daily IPAs</span>
            <span className="pill">Progress check on the 15th</span>
          </div>
        </section>
      </div>
    </div>
  );
}
