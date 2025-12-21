import { Currency } from "./types";

export function calculateRecruitment(
  current: number,
  target: number,
  monthsRemaining = 12,
) {
  const needed = Math.max(target - current, 0);
  const perMonthRaw = monthsRemaining > 0 ? needed / monthsRemaining : needed;
  const perMonth = Math.ceil(perMonthRaw); // round up to whole people
  const perWeek = Math.ceil((perMonth / 4) * 10) / 10; // round up to nearest 0.1

  return {
    needed,
    perMonth,
    perWeek,
  };
}

export function calculateIncomeBreakdown(annual: number) {
  return {
    monthly: annual / 12,
    weekly: annual / 52,
    daily: annual / 365,
  };
}

export function calculateFiverrTargets({
  incomeGoal,
  projectCount,
  avgValue,
}: {
  incomeGoal: number;
  projectCount?: number;
  avgValue?: number;
}) {
  if (incomeGoal && projectCount) {
    const avgNeeded = incomeGoal / projectCount;
    return {
      avgNeeded: Math.ceil(avgNeeded),
      projectsNeeded: Math.ceil(projectCount),
      perMonth: Math.ceil(projectCount / 12),
      perWeek: Math.ceil(projectCount / 52),
    };
  }

  if (incomeGoal && avgValue) {
    const projectsNeeded = Math.ceil(incomeGoal / avgValue);
    return {
      avgNeeded: Math.ceil(avgValue),
      projectsNeeded,
      perMonth: Math.ceil(projectsNeeded / 12),
      perWeek: Math.ceil(projectsNeeded / 52),
    };
  }

  return null;
}

export function calculateReviewVelocity(goal: number) {
  if (!goal) return 0;
  return Math.ceil(goal / 12);
}

export function formatCurrency(amount: number | null | undefined, currency: Currency) {
  if (amount === null || amount === undefined || Number.isNaN(amount)) return "";
  return new Intl.NumberFormat(currency === "NGN" ? "en-NG" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function convertUsdToNgn(value: number | null | undefined, rate: number | null | undefined) {
  if (!value || !rate) return null;
  return value * rate;
}
