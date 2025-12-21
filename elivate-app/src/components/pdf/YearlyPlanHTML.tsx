import { Calculations, YearlyGoals } from "@/lib/types";
import { formatCurrency } from "@/lib/calculations";

type Props = {
  yearly: YearlyGoals;
  calculations: Calculations;
  memberId: string;
  signatureName?: string;
  year?: string;
};

export function YearlyPlanHTML({
  yearly,
  calculations,
  memberId,
  signatureName,
  year = "2026",
}: Props) {
  return (
    <div className="pdf-template bg-white w-[210mm] min-h-[297mm] mx-auto p-12 font-sans text-gray-900">
      {/* Header */}
      <div className="flex justify-between items-start pb-4 mb-6 border-b-2 border-green-700">
        <div>
          <h1 className="text-2xl font-bold text-green-700">Elivate Network</h1>
          <p className="text-sm text-gray-600">Goal Plan {year}</p>
        </div>
        <div className="text-right text-xs text-gray-600 space-y-0.5">
          <p>Member ID: {memberId || "—"}</p>
          {signatureName && <p>Signed: {signatureName}</p>}
          <p>Word: {yearly.vision.word || "—"}</p>
        </div>
      </div>

      {/* Annual Vision */}
      <div className="mb-5 p-5 rounded-xl bg-gray-50 border border-gray-200">
        <h2 className="text-base font-bold text-green-700 mb-3">Annual Vision</h2>
        <p className="text-sm mb-3 leading-relaxed">{yearly.vision.statement || "—"}</p>
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-gray-600">Total Income Goal</span>
            <span className="font-bold">
              {yearly.vision.dreamGoal
                ? formatCurrency(yearly.vision.dreamGoal, yearly.vision.currency)
                : yearly.vision.totalIncomeGoal
                  ? formatCurrency(yearly.vision.totalIncomeGoal, yearly.vision.currency)
                  : "—"}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-600">Minimum / Realistic / Dream</span>
            <span className="font-bold text-right">
              {[
                yearly.vision.minimumGoal ? formatCurrency(yearly.vision.minimumGoal, yearly.vision.currency) : "—",
                yearly.vision.realisticGoal ? formatCurrency(yearly.vision.realisticGoal, yearly.vision.currency) : "—",
                yearly.vision.dreamGoal ? formatCurrency(yearly.vision.dreamGoal, yearly.vision.currency) : "—",
              ].join(" | ")}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-600">Monthly Target</span>
            <span className="font-bold">
              {calculations.nmMonthlyIncome ? formatCurrency(calculations.nmMonthlyIncome, yearly.vision.currency) : "—"}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-600">Weekly Target</span>
            <span className="font-bold">
              {calculations.nmWeeklyIncome ? formatCurrency(calculations.nmWeeklyIncome, yearly.vision.currency) : "—"}
            </span>
          </div>
        </div>
      </div>

      {/* Motivation */}
      <div className="mb-5 p-5 rounded-xl bg-gray-50 border border-gray-200">
        <h2 className="text-base font-bold text-green-700 mb-3">Motivation</h2>
        <p className="text-sm leading-relaxed">{yearly.vision.motivation || "—"}</p>
      </div>

      {/* Two Columns: Network Marketing & Fiverr */}
      <div className="grid grid-cols-2 gap-5 mb-5">
        {/* Network Marketing */}
        <div className="p-5 rounded-xl bg-gray-50 border border-gray-200">
          <h2 className="text-base font-bold text-green-700 mb-3">Network Marketing</h2>
          <div className="space-y-2 mb-3">
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Team Size</span>
              <span className="font-bold">{`${yearly.networkMarketing.currentTeamSize ?? 0} → ${yearly.networkMarketing.targetTeamSize ?? 0}`}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Rank</span>
              <span className="font-bold text-right">{`${yearly.networkMarketing.currentRank || "Current"} → ${yearly.networkMarketing.targetRank || "Target"}`}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Recruitment Pace</span>
              <span className="font-bold text-right">
                {calculations.recruitmentPerMonth
                  ? `${calculations.recruitmentPerMonth}/mo (${calculations.recruitmentPerWeek}/wk)`
                  : "Add targets"}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Income Goal</span>
              <span className="font-bold">
                {yearly.networkMarketing.incomeGoal ? formatCurrency(yearly.networkMarketing.incomeGoal, "NGN") : "—"}
              </span>
            </div>
          </div>
          <div className="bg-white rounded-lg p-3 border border-gray-200 mb-3">
            <p className="text-xs text-gray-600 mb-1.5">Why</p>
            <p className="text-sm leading-relaxed">{yearly.networkMarketing.why || "—"}</p>
          </div>
          <p className="text-xs text-gray-600 mb-2">Quarterly Ranks</p>
          <div className="space-y-1">
            {yearly.networkMarketing.quarterlyRanks.map((rank, index) => (
              <p key={index} className="text-sm">
                Q{index + 1}: {rank || "—"}
              </p>
            ))}
          </div>
        </div>

        {/* Fiverr Freelancing */}
        <div className="p-5 rounded-xl bg-gray-50 border border-gray-200">
          <h2 className="text-base font-bold text-green-700 mb-3">Fiverr Freelancing</h2>
          <div className="space-y-2 mb-3">
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Skills</span>
              <span className="font-bold text-right">
                {[yearly.fiverr.primarySkill, yearly.fiverr.secondarySkill].filter(Boolean).join(" / ") || "—"}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Income Goal</span>
              <span className="font-bold">
                {yearly.fiverr.incomeGoal ? formatCurrency(yearly.fiverr.incomeGoal, yearly.fiverr.currency) : "—"}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Projects Pace</span>
              <span className="font-bold text-right">
                {calculations.fiverrProjectsPerMonth
                  ? `${Math.ceil(calculations.fiverrProjectsPerMonth)}/month`
                  : "Add goal"}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Avg per Project</span>
              <span className="font-bold">
                {calculations.fiverrAvgPerProject ? formatCurrency(calculations.fiverrAvgPerProject, yearly.fiverr.currency) : "—"}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">5-Star Reviews</span>
              <span className="font-bold text-right">
                {yearly.fiverr.reviewsGoal ? `${yearly.fiverr.reviewsGoal} (${Math.ceil(calculations.reviewPerMonth ?? 0)}/mo)` : "—"}
              </span>
            </div>
          </div>
          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <p className="text-xs text-gray-600 mb-1.5">Why</p>
            <p className="text-sm leading-relaxed">{yearly.fiverr.why || "—"}</p>
          </div>
        </div>
      </div>

      {/* Personal Development */}
      <div className="mb-5 p-5 rounded-xl bg-gray-50 border border-gray-200">
        <h2 className="text-base font-bold text-green-700 mb-3">Personal Development</h2>
        <div className="bg-white rounded-lg p-3 border border-gray-200 mb-3">
          <p className="text-xs text-gray-600 mb-1.5">Goal</p>
          <p className="text-sm leading-relaxed">{yearly.personalDev.goals || "—"}</p>
        </div>
        <p className="text-xs text-gray-600 mb-2">Books</p>
        <div className="mb-3 space-y-1">
          {yearly.personalDev.books.filter(Boolean).length ? (
            yearly.personalDev.books.filter(Boolean).map((book, index) => (
              <p key={index} className="text-sm">• {book}</p>
            ))
          ) : (
            <p className="text-sm">—</p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="flex justify-between text-xs">
            <span className="text-gray-600">Courses/Training</span>
            <span className="font-bold text-right">{yearly.personalDev.courses || "—"}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-600">Events/Conferences</span>
            <span className="font-bold text-right">{yearly.personalDev.events || "—"}</span>
          </div>
        </div>
        <div className="bg-white rounded-lg p-3 border border-gray-200 mb-2">
          <p className="text-xs text-gray-600 mb-1.5">Why</p>
          <p className="text-sm leading-relaxed">{yearly.personalDev.why || "—"}</p>
        </div>
        <div className="bg-white rounded-lg p-3 border border-gray-200 mb-2">
          <p className="text-xs text-gray-600 mb-1.5">Game plan activities</p>
          <p className="text-sm leading-relaxed">{yearly.personalDev.gamePlan || "—"}</p>
        </div>
        <div className="bg-white rounded-lg p-3 border border-gray-200">
          <p className="text-xs text-gray-600 mb-1.5">Habit lock</p>
          <p className="text-sm leading-relaxed">{yearly.personalDev.habitPlan || "—"}</p>
        </div>
      </div>

      {/* Daily IPAs */}
      <div className="mb-5 p-5 rounded-xl bg-gray-50 border border-gray-200">
        <h2 className="text-base font-bold text-green-700 mb-3">Daily IPAs</h2>
        <div className="mb-3 space-y-1">
          {yearly.ipas.activities.filter(Boolean).length ? (
            yearly.ipas.activities.filter(Boolean).map((ipa, index) => (
              <p key={index} className="text-sm">• {ipa}</p>
            ))
          ) : (
            <p className="text-sm">—</p>
          )}
        </div>
        <div className="bg-white rounded-lg p-3 border border-gray-200 mb-2">
          <p className="text-xs text-gray-600 mb-1.5">Why</p>
          <p className="text-sm leading-relaxed">{yearly.ipas.why || "—"}</p>
        </div>
        <div className="bg-white rounded-lg p-3 border border-gray-200">
          <p className="text-xs text-gray-600 mb-1.5">Habit support</p>
          <p className="text-sm leading-relaxed">{yearly.ipas.habitSupport || "—"}</p>
        </div>
      </div>

      {/* Commitment */}
      <div className="p-5 rounded-xl bg-gray-50 border border-gray-200">
        <h2 className="text-base font-bold text-green-700 mb-3">Commitment</h2>
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-gray-600">Review Day</span>
            <span className="font-bold">{yearly.commitment.reviewDay || "—"}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-600">Accountability Partner</span>
            <span className="font-bold text-right">{yearly.commitment.partner || "—"}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-600">Agreed to review monthly</span>
            <span className="font-bold">{yearly.commitment.agreed ? "Yes" : "No"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
