import { YearlyGoals, Calculations } from "@/lib/types";
import { formatCurrency } from "@/lib/calculations";

type Props = {
  yearly: YearlyGoals;
  calculations: Calculations;
  memberId: string;
  signatureName?: string;
};

export function GoalCardHTML({ yearly, calculations, memberId, signatureName }: Props) {
  const ipaList = yearly.ipas.activities.filter(Boolean).slice(0, 10);

  return (
    <div className="pdf-template bg-white w-[210mm] min-h-[297mm] mx-auto p-12 font-sans text-gray-900">
      {/* Header */}
      <div className="text-center mb-8">
        <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">ELIVATE NETWORK</p>
        <h1 className="text-3xl font-bold text-green-700 mb-2">My 2026 Vision</h1>
        <p className="text-xs text-gray-600">
          Member: {memberId || "—"} {signatureName ? `| Signed: ${signatureName}` : ""}
        </p>
        <p className="text-xs text-gray-600 mt-1">
          Word of the Year: <span className="font-bold">{yearly.vision.word || "—"}</span>
        </p>
      </div>

      {/* Vision Statement */}
      <div className="mb-8 p-5 rounded-xl bg-gray-50 border border-gray-200">
        <p className="text-sm leading-relaxed text-gray-900">
          {yearly.vision.statement || "Write your vision here."}
        </p>
      </div>

      {/* Two Columns: Network Marketing & Fiverr */}
      <div className="grid grid-cols-2 gap-5 mb-8">
        {/* Network Marketing */}
        <div className="p-5 rounded-xl bg-green-50 border-2 border-green-700">
          <h2 className="text-base font-bold text-green-700 mb-3">Network Marketing</h2>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Team</span>
              <span className="font-bold">
                {`${yearly.networkMarketing.currentTeamSize ?? 0} → ${yearly.networkMarketing.targetTeamSize ?? 0}`}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Rank</span>
              <span className="font-bold text-right">
                {`${yearly.networkMarketing.currentRank || "—"} → ${yearly.networkMarketing.targetRank || "—"}`}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Income</span>
              <span className="font-bold">
                {yearly.networkMarketing.incomeGoal
                  ? formatCurrency(yearly.networkMarketing.incomeGoal, "NGN")
                  : "—"}
              </span>
            </div>
          </div>
        </div>

        {/* Fiverr Freelancing */}
        <div className="p-5 rounded-xl bg-green-50 border-2 border-green-700">
          <h2 className="text-base font-bold text-green-700 mb-3">Fiverr Freelancing</h2>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Projects</span>
              <span className="font-bold">
                {calculations.fiverrProjectsNeeded
                  ? `${Math.ceil(calculations.fiverrProjectsNeeded)}`
                  : "—"}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Income</span>
              <span className="font-bold">
                {yearly.fiverr.incomeGoal
                  ? formatCurrency(yearly.fiverr.incomeGoal, yearly.fiverr.currency)
                  : "—"}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Level</span>
              <span className="font-bold text-right">{yearly.fiverr.targetLevel || "—"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Daily IPAs */}
      <div className="p-5 rounded-xl bg-green-50 border-2 border-green-700">
        <h2 className="text-base font-bold text-green-700 mb-3">My Daily IPAs</h2>
        <div className="space-y-2">
          {ipaList.length ? (
            ipaList.map((item, index) => (
              <p key={index} className="text-sm">• {item}</p>
            ))
          ) : (
            <p className="text-xs text-gray-500">Add your non-negotiables.</p>
          )}
        </div>
      </div>

      {/* Footer spacing */}
      <div className="mt-8 pt-5 border-t border-gray-200 text-center">
        <p className="text-xs text-gray-400">&nbsp;</p>
      </div>
    </div>
  );
}
