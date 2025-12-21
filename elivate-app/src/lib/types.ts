export type Mode = "yearly" | "monthly";
export type Currency = "NGN" | "USD";

export interface VisionGoals {
  statement: string;
  word: string;
  totalIncomeGoal: number | null;
  minimumGoal: number | null;
  realisticGoal: number | null;
  dreamGoal: number | null;
  motivation: string;
  currency: Currency;
}

export interface NetworkMarketingGoals {
  currentTeamSize: number | null;
  targetTeamSize: number | null;
  currentRank: string;
  targetRank: string;
  quarterlyRanks: [string, string, string, string];
  incomeGoal: number | null;
  why: string;
}

export interface FiverrGoals {
  primarySkill: string;
  secondarySkill: string;
  learningGoals: string;
  incomeGoal: number | null;
  projectTarget: number | null;
  avgProjectValue: number | null;
  targetLevel: string;
  reviewsGoal: number | null;
  why: string;
  currency: Currency;
  exchangeToNgn: number | null;
}

export interface PersonalDevelopmentGoals {
  goals: string;
  books: string[];
  courses: string;
  events: string;
  why: string;
  gamePlan: string;
  habitPlan: string;
}

export interface DailyIpas {
  activities: string[];
  why: string;
  habitSupport: string;
}

export interface Commitment {
  reviewDay: string;
  partner: string;
  agreed: boolean;
  signatureName: string;
}

export interface YearlyGoals {
  vision: VisionGoals;
  networkMarketing: NetworkMarketingGoals;
  fiverr: FiverrGoals;
  personalDev: PersonalDevelopmentGoals;
  ipas: DailyIpas;
  commitment: Commitment;
}

export interface MonthlyGoals {
  month: string;
  focus: string;
  priorities: [string, string, string];
  nmRecruitment: number | null;
  nmIncome: number | null;
  nmWhy: string;
  fiverrProjects: number | null;
  fiverrIncome: number | null;
  fiverrWhy: string;
  ipas: string[];
  endVision: string;
}

export interface Calculations {
  recruitmentNeeded: number | null;
  recruitmentPerMonth: number | null;
  recruitmentPerWeek: number | null;
  nmMonthlyIncome: number | null;
  nmWeeklyIncome: number | null;
  fiverrAvgPerProject: number | null;
  fiverrProjectsNeeded: number | null;
  fiverrProjectsPerMonth: number | null;
  fiverrProjectsPerWeek: number | null;
  fiverrIncomeCurrency: Currency;
  reviewPerMonth: number | null;
}

export interface GoalState {
  memberId: string;
  mode: Mode | null;
  currentStep: number;
  yearly: YearlyGoals;
  monthly: MonthlyGoals;
  calculations: Calculations;
}
