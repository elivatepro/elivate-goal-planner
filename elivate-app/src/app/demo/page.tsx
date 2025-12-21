"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useGoalStore } from "@/lib/store";
import {
  calculateFiverrTargets,
  calculateIncomeBreakdown,
  calculateRecruitment,
  calculateReviewVelocity,
} from "@/lib/calculations";

export default function DemoPage() {
  const {
    setMemberId,
    setMode,
    setCurrentStep,
    updateVision,
    updateNetwork,
    updateFiverr,
    updatePersonal,
    updateIpas,
    updateCommitment,
    setCalculations,
  } = useGoalStore();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Vision
    updateVision({
      statement:
        "Live a calm, abundant life with family time daily, building leaders and earning from both Network Marketing and Freelancing. I start each morning with gratitude, planning, and outreach, then invest two focused blocks into my team and two focused blocks into freelancing delivery. I mentor new leaders weekly, host monthly trainings, and publish valuable content twice a week to attract the right people. I keep my evenings device-light so I can be present with family. I measure my progress every Sunday and adjust my weekly plan to stay aligned with my 2026 dream goal. I protect my focus time, automate routine tasks, and delegate where possible so I can stay in my zone of genius. I remind myself daily why this matters: freedom, impact, and stability for my family and everyone who trusts me to lead.",
      word: "Unstoppable",
      totalIncomeGoal: 5000000,
      minimumGoal: 1500000,
      realisticGoal: 3000000,
      dreamGoal: 8000000,
      motivation: "Provide stability for my family, build leaders, and create freedom.",
      currency: "NGN",
    });

    // Network Marketing
    updateNetwork({
      currentTeamSize: 10,
      targetTeamSize: 40,
      currentRank: "Senior Manager",
      targetRank: "Emerald Director",
      quarterlyRanks: ["Executive Manager", "Director", "Emerald Director", "Diamond Director"],
      incomeGoal: 5000000,
      why: "Grow a strong team and unlock higher ranks together.",
    });

    // Fiverr
    updateFiverr({
      primarySkill: "Software Development",
      secondarySkill: "CRM Management",
      learningGoals: "Learn Next.js, polish UI/UX, deepen API integrations.",
      incomeGoal: 30000,
      projectTarget: 40,
      avgProjectValue: 1000,
      targetLevel: "Level 2",
      reviewsGoal: 50,
      why: "Create consistent freelance revenue to fund family goals.",
      currency: "USD",
      exchangeToNgn: 1500,
    });

    // Personal
    updatePersonal({
      goals: "Read, learn, and ship projects weekly to stay sharp and helpful.",
      books: [
        "Think And Grow Rich",
        "The 360 Degree Leader",
        "Atomic Habits",
        "The Inspiration Code",
        "Deep Work",
        "The Personal MBA",
        "",
        "",
        "",
        "",
        "",
        "",
      ],
      courses: "Senior Manager Trainings",
      events: "School Events",
      why: "Stay ahead, teach the team, and lead by example.",
      gamePlan: "Daily coding, weekly content, monthly delivery.",
      habitPlan: "Time-block mornings, no distractions, weekly reviews.",
    });

    // IPAs
    updateIpas({
      activities: [
        "Read Books",
        "Attend Training",
        "Listen to Podcasts",
        "Set Goals",
        "Reach out to 5 prospects",
        "Deliver 1 freelance milestone",
        "Study 30 mins",
        "Daily review",
      ],
      why: "Consistency compounds results.",
      habitSupport: "Calendar blocks, alarms, and accountability partner check-ins.",
    });

    // Commitment
    updateCommitment({
      reviewDay: "1st",
      partner: "My Sponsor",
      agreed: true,
      signatureName: "Boko Isaac",
    });

    // Calculations
    const recruit = calculateRecruitment(10, 40, 12);
    const incomeNM = calculateIncomeBreakdown(5000000);
    const fiverCalc = calculateFiverrTargets({
      incomeGoal: 30000,
      projectCount: 40,
      avgValue: 1000,
    });
    const reviewPace = calculateReviewVelocity(50);

    setCalculations({
      recruitmentNeeded: recruit.needed,
      recruitmentPerMonth: recruit.perMonth,
      recruitmentPerWeek: recruit.perWeek,
      nmMonthlyIncome: incomeNM.monthly,
      nmWeeklyIncome: incomeNM.weekly,
      fiverrAvgPerProject: fiverCalc?.avgNeeded ?? null,
      fiverrProjectsNeeded: fiverCalc?.projectsNeeded ?? null,
      fiverrProjectsPerMonth: fiverCalc?.perMonth ?? null,
      fiverrProjectsPerWeek: fiverCalc?.perWeek ?? null,
      fiverrIncomeCurrency: "USD",
      reviewPerMonth: reviewPace,
    });

    setMemberId("ELVTEST");
    setMode("yearly");
    setCurrentStep(0);
    setLoaded(true);
  }, [
    setMemberId,
    setMode,
    setCurrentStep,
    updateVision,
    updateNetwork,
    updateFiverr,
    updatePersonal,
    updateIpas,
    updateCommitment,
    setCalculations,
  ]);

  return (
    <div className="min-h-screen bg-page px-4 py-10 flex flex-col items-center justify-center gap-4">
      <div className="card w-full max-w-2xl p-6 flex flex-col gap-4 text-center">
        <h1 className="text-2xl font-bold text-ink">Demo Data Loader</h1>
        <p className="text-muted">
          This page pre-fills the planner with sample data for quick testing.
        </p>
        <p className="text-sm text-brand">
          {loaded ? "Sample data loaded. Open the planner to see it." : "Loading sample data..."}
        </p>
        <div className="flex justify-center gap-3">
          <Link href="/" className="button button-primary">
            Open Planner
          </Link>
        </div>
      </div>
    </div>
  );
}
