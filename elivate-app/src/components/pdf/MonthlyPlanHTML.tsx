import { Calculations, MonthlyGoals } from "@/lib/types";
import { formatCurrency } from "@/lib/calculations";

type Props = {
  monthly: MonthlyGoals;
  calculations: Calculations;
  memberId: string;
};

export function MonthlyPlanHTML({ monthly, calculations, memberId }: Props) {
  return (
    <div className="pdf-template bg-white w-[210mm] min-h-[297mm] mx-auto p-12 font-sans text-gray-900">
      {/* Header */}
      <div className="flex justify-between items-start pb-4 mb-6 border-b-2 border-green-700">
        <div>
          <h1 className="text-2xl font-bold text-green-700">Elivate Network</h1>
          <p className="text-sm text-gray-600">Monthly Goal Plan</p>
        </div>
        <div className="text-right text-xs text-gray-600 space-y-0.5">
          <p>Member ID: {memberId || "—"}</p>
          <p>{monthly.month || "Month"}</p>
        </div>
      </div>

      {/* Overview */}
      <div className="mb-5 p-5 rounded-xl bg-gray-50 border border-gray-200">
        <h2 className="text-base font-bold text-green-700 mb-3">Overview</h2>
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-gray-600">Month</span>
            <span className="font-bold">{monthly.month || "—"}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-600">Theme / Focus</span>
            <span className="font-bold text-right">{monthly.focus || "—"}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-600">Priorities</span>
            <span className="font-bold text-right">
              {monthly.priorities.filter(Boolean).join(" • ") || "—"}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-600">End Vision</span>
            <span className="font-bold text-right">{monthly.endVision || "—"}</span>
          </div>
        </div>
      </div>

      {/* Network Marketing */}
      <div className="mb-5 p-5 rounded-xl bg-gray-50 border border-gray-200">
        <h2 className="text-base font-bold text-green-700 mb-3">Network Marketing</h2>
        <div className="space-y-2 mb-3">
          <div className="flex justify-between text-xs">
            <span className="text-gray-600">Recruitment Target</span>
            <span className="font-bold">
              {monthly.nmRecruitment
                ? `${monthly.nmRecruitment} (${(calculations.recruitmentPerWeek ?? 0).toFixed(1)} / week)`
                : "—"}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-600">Income Target</span>
            <span className="font-bold">
              {monthly.nmIncome ? formatCurrency(monthly.nmIncome, "NGN") : "—"}
            </span>
          </div>
        </div>
        <div className="bg-white rounded-lg p-3 border border-gray-200">
          <p className="text-xs text-gray-600 mb-1.5">Why</p>
          <p className="text-sm leading-relaxed">{monthly.nmWhy || "—"}</p>
        </div>
      </div>

      {/* Fiverr Freelancing */}
      <div className="mb-5 p-5 rounded-xl bg-gray-50 border border-gray-200">
        <h2 className="text-base font-bold text-green-700 mb-3">Fiverr Freelancing</h2>
        <div className="space-y-2 mb-3">
          <div className="flex justify-between text-xs">
            <span className="text-gray-600">Projects</span>
            <span className="font-bold">
              {monthly.fiverrProjects ? `${monthly.fiverrProjects} projects` : "—"}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-600">Income Target</span>
            <span className="font-bold">
              {monthly.fiverrIncome ? formatCurrency(monthly.fiverrIncome, "USD") : "—"}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-600">Avg per Project</span>
            <span className="font-bold">
              {calculations.fiverrAvgPerProject
                ? formatCurrency(calculations.fiverrAvgPerProject, "USD")
                : "—"}
            </span>
          </div>
        </div>
        <div className="bg-white rounded-lg p-3 border border-gray-200">
          <p className="text-xs text-gray-600 mb-1.5">Why</p>
          <p className="text-sm leading-relaxed">{monthly.fiverrWhy || "—"}</p>
        </div>
      </div>

      {/* Daily IPAs */}
      <div className="p-5 rounded-xl bg-gray-50 border border-gray-200">
        <h2 className="text-base font-bold text-green-700 mb-3">Daily IPAs</h2>
        <div className="space-y-1">
          {monthly.ipas.filter(Boolean).length ? (
            monthly.ipas.filter(Boolean).map((ipa, index) => (
              <p key={index} className="text-sm">• {ipa}</p>
            ))
          ) : (
            <p className="text-sm">—</p>
          )}
        </div>
      </div>
    </div>
  );
}
