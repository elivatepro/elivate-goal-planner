import { create } from "zustand";
import {
  Calculations,
  Commitment,
  DailyIpas,
  FiverrGoals,
  GoalState,
  Mode,
  MonthlyGoals,
  NetworkMarketingGoals,
  PersonalDevelopmentGoals,
  VisionGoals,
  YearlyGoals,
} from "./types";

const defaultVision: VisionGoals = {
  statement: "",
  word: "",
  totalIncomeGoal: null,
  minimumGoal: null,
  realisticGoal: null,
  dreamGoal: null,
  motivation: "",
  currency: "NGN",
};

const defaultNetwork: NetworkMarketingGoals = {
  currentTeamSize: null,
  targetTeamSize: null,
  currentRank: "",
  targetRank: "",
  quarterlyRanks: ["", "", "", ""],
  incomeGoal: null,
  why: "",
};

const defaultFiverr: FiverrGoals = {
  primarySkill: "",
  secondarySkill: "",
  learningGoals: "",
  incomeGoal: null,
  projectTarget: null,
  avgProjectValue: null,
  targetLevel: "",
  reviewsGoal: null,
  why: "",
  currency: "USD",
  exchangeToNgn: null,
};

const defaultPersonal: PersonalDevelopmentGoals = {
  goals: "",
  books: Array.from({ length: 12 }, () => ""),
  courses: "",
  events: "",
  why: "",
  gamePlan: "",
  habitPlan: "",
};

const defaultIpas: DailyIpas = {
  activities: Array.from({ length: 8 }, () => ""),
  why: "",
  habitSupport: "",
};

const defaultCommitment: Commitment = {
  reviewDay: "",
  partner: "",
  agreed: false,
  signatureName: "",
};

const defaultYearly: YearlyGoals = {
  vision: defaultVision,
  networkMarketing: defaultNetwork,
  fiverr: defaultFiverr,
  personalDev: defaultPersonal,
  ipas: defaultIpas,
  commitment: defaultCommitment,
};

const defaultMonthly: MonthlyGoals = {
  month: "",
  focus: "",
  priorities: ["", "", ""],
  nmRecruitment: null,
  nmIncome: null,
  nmWhy: "",
  fiverrProjects: null,
  fiverrIncome: null,
  fiverrWhy: "",
  ipas: Array.from({ length: 6 }, () => ""),
  endVision: "",
};

const defaultCalculations: Calculations = {
  recruitmentNeeded: null,
  recruitmentPerMonth: null,
  recruitmentPerWeek: null,
  nmMonthlyIncome: null,
  nmWeeklyIncome: null,
  fiverrAvgPerProject: null,
  fiverrProjectsNeeded: null,
  fiverrProjectsPerMonth: null,
  fiverrProjectsPerWeek: null,
  fiverrIncomeCurrency: "USD",
  reviewPerMonth: null,
};

interface GoalStore extends GoalState {
  setMemberId: (memberId: string) => void;
  setMode: (mode: Mode) => void;
  setCurrentStep: (step: number) => void;
  updateVision: (vision: Partial<VisionGoals>) => void;
  updateNetwork: (network: Partial<NetworkMarketingGoals>) => void;
  updateFiverr: (fiverr: Partial<FiverrGoals>) => void;
  updatePersonal: (personal: Partial<PersonalDevelopmentGoals>) => void;
  updateIpas: (ipas: Partial<DailyIpas>) => void;
  updateCommitment: (commitment: Partial<Commitment>) => void;
  updateMonthly: (monthly: Partial<MonthlyGoals>) => void;
  setCalculations: (calculations: Partial<Calculations>) => void;
  reset: () => void;
}

export const useGoalStore = create<GoalStore>((set) => ({
  memberId: "",
  mode: null,
  currentStep: 0,
  yearly: defaultYearly,
  monthly: defaultMonthly,
  calculations: defaultCalculations,

  setMemberId: (memberId) => set({ memberId }),
  setMode: (mode) => set({ mode, currentStep: 0 }),
  setCurrentStep: (currentStep) => set({ currentStep }),

  updateVision: (vision) =>
    set((state) => ({
      yearly: { ...state.yearly, vision: { ...state.yearly.vision, ...vision } },
    })),

  updateNetwork: (network) =>
    set((state) => ({
      yearly: {
        ...state.yearly,
        networkMarketing: { ...state.yearly.networkMarketing, ...network },
      },
    })),

  updateFiverr: (fiverr) =>
    set((state) => ({
      yearly: { ...state.yearly, fiverr: { ...state.yearly.fiverr, ...fiverr } },
    })),

  updatePersonal: (personal) =>
    set((state) => ({
      yearly: {
        ...state.yearly,
        personalDev: { ...state.yearly.personalDev, ...personal },
      },
    })),

  updateIpas: (ipas) =>
    set((state) => ({
      yearly: { ...state.yearly, ipas: { ...state.yearly.ipas, ...ipas } },
    })),

  updateCommitment: (commitment) =>
    set((state) => ({
      yearly: {
        ...state.yearly,
        commitment: { ...state.yearly.commitment, ...commitment },
      },
    })),

  updateMonthly: (monthly) =>
    set((state) => ({
      monthly: { ...state.monthly, ...monthly },
    })),

  setCalculations: (calculations) =>
    set((state) => ({
      calculations: { ...state.calculations, ...calculations },
    })),

  reset: () =>
    set({
      memberId: "",
      mode: null,
      currentStep: 0,
      yearly: defaultYearly,
      monthly: defaultMonthly,
      calculations: defaultCalculations,
    }),
}));
