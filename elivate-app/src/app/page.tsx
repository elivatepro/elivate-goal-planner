"use client";

import Image from "next/image";
import { Suspense, useEffect, useMemo, useRef, useState, type RefObject } from "react";
import Link from "next/link";
import jsPDF from "jspdf";
import { useForm } from "react-hook-form";
import clsx from "clsx";
import { Target } from "lucide-react";
import { useGoalStore } from "@/lib/store";
import { useBrandingStore, colorThemes } from "@/store/brandingStore";
import { BrandingProvider } from "@/components/BrandingProvider";
import { isValidMemberId } from "@/lib/member-ids";
import {
  calculateIncomeBreakdown,
  calculateRecruitment,
  calculateFiverrTargets,
  calculateReviewVelocity,
  formatCurrency,
  convertUsdToNgn,
} from "@/lib/calculations";
import { Currency } from "@/lib/types";
import { YearlyPlanHTML } from "@/components/pdf/YearlyPlanHTML";
import { MonthlyPlanHTML } from "@/components/pdf/MonthlyPlanHTML";
import { GoalCardHTML } from "@/components/pdf/GoalCardHTML";
import {
  generateYearlyPlanPDF,
  generateMonthlyPlanPDF,
  generateGoalCardPDF,
  generateYearlyPlanPreview,
  generateMonthlyPlanPreview,
  generateGoalCardPreview,
} from "@/lib/pdf-generator";

const yearlySteps = [
  { key: "vision", label: "Vision" },
  { key: "network", label: "Network Marketing" },
  { key: "fiverr", label: "Fiverr" },
  { key: "growth", label: "Growth & IPAs" },
  { key: "review", label: "Review & PDF" },
];

const monthlySteps = [
  { key: "month", label: "Month Plan" },
  { key: "review", label: "Review & PDF" },
];

const minValueRule = { value: 10, message: "Minimum is 10" };
const rankOptions = [
  "Member",
  "Distributor",
  "Manager",
  "Senior Manager",
  "Executive Manager",
  "Director",
  "Emerald Director",
  "Sapphire Director",
  "Ruby Director",
  "Diamond Director",
];

async function generatePdfFromHtml(
  element: HTMLElement,
  filename: string,
  setStatus: (value: string) => void,
) {
  try {
    setStatus("Generating PDF...");

    // Dynamically import dom-to-image-more (client-side only)
    const domtoimage = await import("dom-to-image-more");

    // Use dom-to-image-more which handles modern CSS better
    const imgData = await domtoimage.toPng(element, {
      bgcolor: '#ffffff',
      quality: 1,
      cacheBust: true,
    });

    const pdfDoc = new jsPDF("p", "mm", "a4");
    const pageWidth = pdfDoc.internal.pageSize.getWidth();
    const pageHeight = pdfDoc.internal.pageSize.getHeight();

    const imgProps = pdfDoc.getImageProperties(imgData);
    const imgWidth = pageWidth;
    const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

    pdfDoc.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdfDoc.save(filename);
    setStatus("Downloaded.");
    setTimeout(() => setStatus(""), 2000);
  } catch (error) {
    console.error(error);
    setStatus("Failed to generate PDF. Try again.");
  }
}

async function generatePdfPreview(
  element: HTMLElement,
  setStatus: (value: string) => void,
): Promise<string | null> {
  try {
    setStatus("Generating preview...");

    // Dynamically import dom-to-image-more (client-side only)
    const domtoimage = await import("dom-to-image-more");

    // Use dom-to-image-more which handles modern CSS better
    const imgData = await domtoimage.toPng(element, {
      bgcolor: '#ffffff',
      quality: 1,
      cacheBust: true,
    });

    const pdfDoc = new jsPDF("p", "mm", "a4");
    const pageWidth = pdfDoc.internal.pageSize.getWidth();
    const pageHeight = pdfDoc.internal.pageSize.getHeight();

    const imgProps = pdfDoc.getImageProperties(imgData);
    const imgWidth = pageWidth;
    const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

    pdfDoc.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    const blob = pdfDoc.output("blob");
    const url = URL.createObjectURL(blob);
    setStatus("");
    return url;
  } catch (error) {
    console.error(error);
    setStatus("Failed to generate preview.");
    return null;
  }
}

function SimplePreviewModal({
  isOpen,
  onClose,
  onDownload,
  pdfUrl,
  title,
}: {
  isOpen: boolean;
  onClose: () => void;
  onDownload: () => void;
  pdfUrl: string;
  title: string;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-4xl h-[90vh] bg-white rounded-lg shadow-xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onDownload}
              className="button button-primary"
            >
              Download PDF
            </button>
            <button
              type="button"
              onClick={onClose}
              className="button button-secondary"
            >
              Close
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          <iframe
            src={pdfUrl}
            className="w-full h-full border-0"
            title="PDF Preview"
          />
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const { teamName, colorTheme } = useBrandingStore();
  const {
    memberId,
    mode,
    currentStep,
    setMemberId,
    setMode,
    setCurrentStep,
    yearly,
    calculations,
  } = useGoalStore();
  const goalCardRef = useRef<HTMLDivElement>(null);
  const brandColor = colorThemes[colorTheme];

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("elivate-theme") : null;
    if (stored === "dark") {
      setTheme("dark");
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("theme-dark", theme === "dark");
    if (typeof window !== "undefined") {
      localStorage.setItem("elivate-theme", theme);
    }
  }, [theme]);

  const stage: "gate" | "mode" | "wizard" = useMemo(() => {
    if (!memberId) return "gate";
    if (!mode) return "mode";
    return "wizard";
  }, [memberId, mode]);

  return (
    <Suspense fallback={null}>
      <BrandingProvider>
        <div className="min-h-screen bg-page px-4 py-8 sm:py-10">
          <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
            <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Link
                href="/"
                className="flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-brand rounded-md"
              >
                <div
                  className="h-12 w-12 overflow-hidden rounded-full flex items-center justify-center text-white"
                  style={{ backgroundColor: brandColor.primary }}
                >
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em]" style={{ color: brandColor.primary }}>
                    {teamName}
                  </p>
                  <p className="text-xl font-semibold text-ink">Goal Planner</p>
                </div>
              </Link>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <div className="pill">
                  <span>Stateless</span>
                  <span className="text-muted">|</span>
                  <span>PDF Ready</span>
                </div>
                <Link href="/why" className="button button-secondary hidden sm:inline-flex">
                  Why we set goals
                </Link>
                <button
                  type="button"
                  className="button button-secondary h-11 w-11 p-0 text-lg"
                  onClick={() => {
                    setTheme((prev) => (prev === "light" ? "dark" : "light"));
                  }}
                  aria-label={theme === "light" ? "Enable dark mode" : "Disable dark mode"}
                >
                  {theme === "light" ? "🌙" : "☀️"}
                </button>
              </div>
            </header>

            <div className="card p-6 sm:p-8">
              {stage === "gate" && (
                <MemberGate
                  onSuccess={(id) => {
                    setMemberId(id);
                  }}
                />
              )}

              {stage === "mode" && (
                <ModeSelect
                  onSelect={(choice) => {
                    setMode(choice);
                    setCurrentStep(0);
                  }}
                  onReset={() => setMemberId("")}
                  memberId={memberId}
                />
              )}

              {stage === "wizard" && mode === "yearly" && (
                <YearlyWizard
                  currentStep={currentStep}
                  setCurrentStep={setCurrentStep}
                  steps={yearlySteps}
                  goalCardRef={goalCardRef}
                />
              )}

              {stage === "wizard" && mode === "monthly" && (
                <MonthlyWizard
                  currentStep={currentStep}
                  setCurrentStep={setCurrentStep}
                  steps={monthlySteps}
                />
              )}
            </div>
          </div>
        </div>

      {/* Hidden goal card for HTML->PDF rendering */}
      <div
        ref={goalCardRef}
        style={{
          position: "absolute",
          top: -9999,
          left: -9999,
          width: "794px",
          padding: "32px",
          backgroundColor: "#f8fafc",
          color: "#0f172a",
          fontFamily: "'Lexend', Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <div>
            <div style={{ fontSize: 10, letterSpacing: 3, color: "#475569" }}>
              ELIVATE NETWORK
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#2A7D5F" }}>
              My 2026 Vision
            </div>
          </div>
          <div style={{ textAlign: "right", fontSize: 10, color: "#475569" }}>
            <div>Member: {memberId || "—"}</div>
            {yearly.commitment.signatureName ? <div>Signed: {yearly.commitment.signatureName}</div> : null}
            <div>Word: {yearly.vision.word || "—"}</div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: 12,
            padding: 14,
            border: "1px solid #e2e8f0",
            marginBottom: 20,
            boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
          }}
        >
          <div style={{ fontSize: 12, lineHeight: 1.5 }}>
            {yearly.vision.statement || "Describe your 2026 vision here."}
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
          <div
            style={{
              flex: 1,
              border: "1.5px solid #2A7D5F",
              borderRadius: 10,
              padding: 12,
              background: "linear-gradient(135deg,#f0fdf4,#e6fffa)",
            }}
          >
            <div style={{ fontSize: 13.5, fontWeight: 700, color: "#166534", marginBottom: 8 }}>
              🌱 Network Marketing
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 11.5 }}>
              <span style={{ color: "#475569" }}>Team</span>
              <span style={{ fontWeight: 700 }}>{yearly.networkMarketing.currentTeamSize ?? 0} → {yearly.networkMarketing.targetTeamSize ?? 0}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 11.5 }}>
              <span style={{ color: "#475569" }}>Rank</span>
              <span style={{ fontWeight: 700 }}>{yearly.networkMarketing.currentRank || "—"} → {yearly.networkMarketing.targetRank || "—"}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5 }}>
              <span style={{ color: "#475569" }}>Income</span>
              <span style={{ fontWeight: 700 }}>
                {yearly.networkMarketing.incomeGoal
                  ? formatCurrency(yearly.networkMarketing.incomeGoal, "NGN")
                  : "—"}
              </span>
            </div>
          </div>

          <div
            style={{
              flex: 1,
              border: "1.5px solid #2A7D5F",
              borderRadius: 10,
              padding: 12,
              background: "linear-gradient(135deg,#ecfeff,#f5f3ff)",
            }}
          >
            <div style={{ fontSize: 13.5, fontWeight: 700, color: "#166534", marginBottom: 8 }}>
              🎯 Fiverr Freelancing
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 11.5 }}>
              <span style={{ color: "#475569" }}>Projects</span>
              <span style={{ fontWeight: 700 }}>
                {calculations.fiverrProjectsNeeded ? Math.ceil(calculations.fiverrProjectsNeeded) : "—"}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 11.5 }}>
              <span style={{ color: "#475569" }}>Income</span>
              <span style={{ fontWeight: 700 }}>
                {yearly.fiverr.incomeGoal
                  ? formatCurrency(yearly.fiverr.incomeGoal, yearly.fiverr.currency)
                  : "—"}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5 }}>
              <span style={{ color: "#475569" }}>Level</span>
              <span style={{ fontWeight: 700 }}>{yearly.fiverr.targetLevel || "—"}</span>
            </div>
          </div>
        </div>

        <div
          style={{
            border: "1.5px solid #2A7D5F",
            borderRadius: 10,
            padding: 12,
            background: "#fff",
          }}
        >
          <div style={{ fontSize: 13.5, fontWeight: 700, color: "#166534", marginBottom: 6 }}>
            ✅ My Daily IPAs
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, fontSize: 11 }}>
            {yearly.ipas.activities.filter(Boolean).length ? (
              yearly.ipas.activities.filter(Boolean).map((ipa, idx) => (
                <span key={idx} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span>•</span>
                  <span>{ipa}</span>
                </span>
              ))
            ) : (
              <span style={{ color: "#475569" }}>Add your non-negotiables.</span>
            )}
          </div>
        </div>
      </div>
    </BrandingProvider>
  </Suspense>
  );
}

function MemberGate({ onSuccess }: { onSuccess: (id: string) => void }) {
  const { teamName } = useBrandingStore();
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!isValidMemberId(input)) {
      setError(
        "We couldn’t verify that ID. Check the code format (e.g., ELV001) or confirm with your team leader.",
      );
      return;
    }
    setError("");
    onSuccess(input.trim().toUpperCase());
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-sm font-semibold text-brand">Welcome to {teamName}</p>
        <h1 className="mt-1 text-3xl font-bold text-ink">
          Enter your Member ID to access the Goal Planner
        </h1>
        <p className="mt-2 text-muted">
          Exclusive access for {teamName} members.
        </p>
      </div>

      <form className="mt-4 flex flex-col gap-3" onSubmit={handleSubmit}>
        <label className="label" htmlFor="memberId">
          Member ID
        </label>
        <input
          id="memberId"
          name="memberId"
          className={clsx("input", error && "border-error")}
          placeholder="ELV001"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        {error && <p className="text-sm text-error">{error}</p>}
        <button type="submit" className="button button-primary w-full sm:w-fit">
          Access Goal Planner
        </button>
      </form>
    </div>
  );
}

function ModeSelect({
  onSelect,
  onReset,
  memberId,
}: {
  onSelect: (mode: "yearly" | "monthly") => void;
  onReset: () => void;
  memberId: string;
}) {
  const cards = [
    {
      mode: "yearly" as const,
      title: "Set My 2026 Yearly Goals",
      description:
        "Comprehensive planning for your network marketing and freelancing business.",
    },
    {
      mode: "monthly" as const,
      title: "Set My Monthly Goals",
      description: "Focused 30-day sprint planning with weekly breakdowns.",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted">Member ID</p>
          <p className="text-lg font-semibold text-ink">{memberId}</p>
        </div>
        <button
          className="button button-secondary"
          onClick={onReset}
          type="button"
        >
          Change Member ID
        </button>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-ink">What would you like to plan?</h2>
        <p className="mt-1 text-muted">
          Choose a path. You can restart anytime to switch modes.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {cards.map((card) => (
          <button
            key={card.mode}
            className="card flex h-full flex-col items-start gap-3 p-5 text-left transition hover:-translate-y-1 hover:shadow-lg"
            onClick={() => onSelect(card.mode)}
            type="button"
          >
            <span className="pill">
              {card.mode === "yearly" ? "Yearly" : "Monthly"}
            </span>
            <h3 className="text-xl font-semibold text-ink">{card.title}</h3>
            <p className="text-muted">{card.description}</p>
            <div className="mt-auto text-sm font-semibold text-brand">
              Start planning →
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function Stepper({
  currentStep,
  steps,
}: {
  currentStep: number;
  steps: { key: string; label: string }[];
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between text-xs sm:text-sm text-muted">
        <span className="font-medium">
          Step {currentStep + 1} of {steps.length}
        </span>
        <span className="hidden sm:inline">{steps[currentStep]?.label}</span>
      </div>
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {steps.map((step, index) => (
          <div key={step.key} className="flex flex-1 items-center gap-1.5 sm:gap-2 min-w-0">
            <div
              className={clsx(
                "h-8 w-8 sm:h-10 sm:w-10 rounded-full border-2 flex items-center justify-center text-xs sm:text-sm font-semibold shrink-0",
                index <= currentStep
                  ? "border-brand bg-brand text-white"
                  : "border-border text-muted",
              )}
            >
              {index + 1}
            </div>
            {index < steps.length - 1 && (
              <div
                className={clsx(
                  "h-0.5 sm:h-1 w-full rounded-full min-w-[20px]",
                  index < currentStep ? "bg-brand" : "bg-border",
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function YearlyWizard({
  currentStep,
  setCurrentStep,
  steps,
  goalCardRef,
}: {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  steps: { key: string; label: string }[];
  goalCardRef: RefObject<HTMLDivElement | null>;
}) {
  return (
    <div className="flex flex-col gap-6">
      <Stepper currentStep={currentStep} steps={steps} />
      {steps[currentStep]?.key === "vision" && (
        <VisionStep onNext={() => setCurrentStep(currentStep + 1)} />
      )}
      {steps[currentStep]?.key === "network" && (
        <NetworkStep
          onNext={() => setCurrentStep(currentStep + 1)}
          onBack={() => setCurrentStep(currentStep - 1)}
        />
      )}
      {steps[currentStep]?.key === "fiverr" && (
        <FiverrStep
          onNext={() => setCurrentStep(currentStep + 1)}
          onBack={() => setCurrentStep(currentStep - 1)}
        />
      )}
      {steps[currentStep]?.key === "growth" && (
        <GrowthStep
          onNext={() => setCurrentStep(currentStep + 1)}
          onBack={() => setCurrentStep(currentStep - 1)}
        />
      )}
      {steps[currentStep]?.key === "review" && (
        <YearlyReview onBack={() => setCurrentStep(currentStep - 1)} goalCardRef={goalCardRef} />
      )}
    </div>
  );
}

function VisionStep({ onNext }: { onNext: () => void }) {
  const { yearly, updateVision, setCalculations } = useGoalStore();
  type VisionForm = {
    statement: string;
    word: string;
    totalIncomeGoal: string;
    minimumGoal: string;
    realisticGoal: string;
    dreamGoal: string;
    motivation: string;
    currency: Currency;
  };
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<VisionForm>({
    defaultValues: {
      statement: yearly.vision.statement,
      word: yearly.vision.word,
      totalIncomeGoal:
        yearly.vision.totalIncomeGoal !== null
          ? String(yearly.vision.totalIncomeGoal)
          : "",
      minimumGoal:
        yearly.vision.minimumGoal !== null ? String(yearly.vision.minimumGoal) : "",
      realisticGoal:
        yearly.vision.realisticGoal !== null ? String(yearly.vision.realisticGoal) : "",
      dreamGoal:
        yearly.vision.dreamGoal !== null ? String(yearly.vision.dreamGoal) : "",
      motivation: yearly.vision.motivation,
      currency: yearly.vision.currency,
    },
  });

  const totalIncome = Number(watch("totalIncomeGoal")) || 0;
  const breakdown = totalIncome ? calculateIncomeBreakdown(Number(totalIncome)) : null;
  const incomeCurrency = watch("currency") as Currency;
  const currencyLabel = incomeCurrency === "USD" ? "Dollars" : "Naira";
  const currencySymbol = incomeCurrency === "USD" ? "$" : "₦";

  const onSubmit = (values: VisionForm) => {
    const total = values.totalIncomeGoal
      ? Number(values.totalIncomeGoal)
      : null;
    const minGoal = values.minimumGoal ? Number(values.minimumGoal) : null;
    const realGoal = values.realisticGoal ? Number(values.realisticGoal) : null;
    const dreamGoal = values.dreamGoal ? Number(values.dreamGoal) : null;
    const currency = values.currency as Currency;
    updateVision({
      statement: values.statement,
      word: values.word,
      totalIncomeGoal: dreamGoal ?? total,
      minimumGoal: minGoal,
      realisticGoal: realGoal,
      dreamGoal: dreamGoal,
      motivation: values.motivation,
      currency,
    });
    if (total) {
      setCalculations({
        nmMonthlyIncome: total / 12,
        nmWeeklyIncome: total / 52,
      });
    }
    onNext();
  };

  return (
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <p className="text-sm text-brand">Annual Vision</p>
        <h2 className="text-2xl font-semibold text-ink">
          Who are you becoming this year?
        </h2>
        <p className="text-muted">
          Anchor on the bigger picture before we dive into numbers.
        </p>
      </div>

      <div className="grid gap-4">
        <div>
          <label className="label">Annual Vision</label>
          <textarea
            className="input min-h-28 resize-y"
            placeholder="Describe your life by December 31st 2026..."
            {...register("statement", {
              required: "Annual vision is required.",
              minLength: {
                value: 400,
                message: "Please write at least 400 characters so your vision is concrete.",
              },
            })}
          />
          {errors.statement && (
            <p className="text-sm text-error">
              {errors.statement.message as string}
            </p>
          )}
          <p className="text-sm text-muted mt-1">
            Use bullet points or paragraphs. Minimum 400 characters so it’s detailed.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Word of the Year</label>
            <input
              className="input"
              placeholder="Relentless"
              {...register("word", { required: "Word of the Year is required." })}
            />
            {errors.word && (
              <p className="text-sm text-error">{errors.word.message as string}</p>
            )}
          </div>
          <div>
            <label className="label">Total Income Goal (Annual, {currencyLabel})</label>
            <div className="flex gap-2">
              <select className="input w-28" {...register("currency")}>
                <option value="NGN">NGN</option>
                <option value="USD">USD</option>
              </select>
              <input
                type="number"
                className="input"
                placeholder={
                  incomeCurrency === "USD" ? `20000 (${currencySymbol})` : `5000000 (${currencySymbol})`
                }
                min={minValueRule.value}
                {...register("totalIncomeGoal", {
                  min: minValueRule,
                  required: "Total income goal is required.",
                })}
              />
            </div>
            {errors.totalIncomeGoal && (
              <p className="text-sm text-error">
                {errors.totalIncomeGoal.message as string}
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="label">Minimum Goal (bare minimum, {currencyLabel})</label>
            <input
              type="number"
              className="input"
              placeholder={
                incomeCurrency === "USD" ? `1000 (${currencySymbol})` : `1000000 (${currencySymbol})`
              }
              min={minValueRule.value}
              {...register("minimumGoal", {
                min: minValueRule,
                required: "Minimum goal is required.",
              })}
            />
            {errors.minimumGoal && (
              <p className="text-sm text-error">{errors.minimumGoal.message as string}</p>
            )}
          </div>
          <div>
            <label className="label">Realistic Goal ({currencyLabel})</label>
            <input
              type="number"
              className="input"
              placeholder={
                incomeCurrency === "USD" ? `5000 (${currencySymbol})` : `3000000 (${currencySymbol})`
              }
              min={minValueRule.value}
              {...register("realisticGoal", {
                min: minValueRule,
                required: "Realistic goal is required.",
              })}
            />
            {errors.realisticGoal && (
              <p className="text-sm text-error">
                {errors.realisticGoal.message as string}
              </p>
            )}
          </div>
          <div>
            <label className="label">Dream Goal (Believe goal, {currencyLabel})</label>
            <input
              type="number"
              className="input"
              placeholder={
                incomeCurrency === "USD" ? `10000 (${currencySymbol})` : `8000000 (${currencySymbol})`
              }
              min={minValueRule.value}
              {...register("dreamGoal", {
                min: minValueRule,
                required: "Dream goal is required.",
              })}
            />
            {errors.dreamGoal && (
              <p className="text-sm text-error">{errors.dreamGoal.message as string}</p>
            )}
          </div>
        </div>

        <div>
          <label className="label">Motivation (strong why)</label>
          <textarea
            className="input min-h-20 resize-y"
            placeholder="What future and who are you doing this for?"
            {...register("motivation", {
              required: "Your motivation is required.",
              minLength: { value: 50, message: "Add at least 50 characters." },
            })}
          />
          {errors.motivation && (
            <p className="text-sm text-error">{errors.motivation.message as string}</p>
          )}
        </div>
      </div>

      {breakdown && (
        <div className="grid gap-4 sm:grid-cols-3">
          <CalcCard
            label="Monthly Target"
            value={formatCurrency(breakdown.monthly, incomeCurrency)}
          />
          <CalcCard
            label="Weekly Target"
            value={formatCurrency(breakdown.weekly, incomeCurrency)}
          />
          <CalcCard
            label="Daily Target"
            value={formatCurrency(breakdown.daily, incomeCurrency)}
          />
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-3">
        <CalcCard
          label="Minimum goal"
          value={
            yearly.vision.minimumGoal
              ? formatCurrency(yearly.vision.minimumGoal, incomeCurrency)
              : "Add min goal"
          }
          subtext="Bare minimum to stay on track"
        />
        <CalcCard
          label="Realistic goal"
          value={
            yearly.vision.realisticGoal
              ? formatCurrency(yearly.vision.realisticGoal, incomeCurrency)
              : "Add realistic goal"
          }
          subtext="Solid, achievable target"
        />
        <CalcCard
          label="Dream (Believe) goal"
          value={
            yearly.vision.dreamGoal
              ? formatCurrency(yearly.vision.dreamGoal, incomeCurrency)
              : "Add dream goal"
          }
          subtext="Work from this number"
        />
      </div>

      <div className="flex justify-end">
        <button type="submit" className="button button-primary">
          Continue to Network Marketing
        </button>
      </div>
    </form>
  );
}

function NetworkStep({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const { yearly, updateNetwork, setCalculations } = useGoalStore();
  type NetworkForm = {
    currentTeamSize: string;
    targetTeamSize: string;
    currentRank: string;
    targetRank: string;
    q1: string;
    q2: string;
    q3: string;
    q4: string;
    incomeGoal: string;
    why: string;
  };
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<NetworkForm>({
    defaultValues: {
      currentTeamSize:
        yearly.networkMarketing.currentTeamSize !== null
          ? String(yearly.networkMarketing.currentTeamSize)
          : "",
      targetTeamSize:
        yearly.networkMarketing.targetTeamSize !== null
          ? String(yearly.networkMarketing.targetTeamSize)
          : "",
      currentRank: yearly.networkMarketing.currentRank,
      targetRank: yearly.networkMarketing.targetRank,
      q1: yearly.networkMarketing.quarterlyRanks[0],
      q2: yearly.networkMarketing.quarterlyRanks[1],
      q3: yearly.networkMarketing.quarterlyRanks[2],
      q4: yearly.networkMarketing.quarterlyRanks[3],
      incomeGoal:
        yearly.networkMarketing.incomeGoal !== null
          ? String(yearly.networkMarketing.incomeGoal)
          : "",
      why: yearly.networkMarketing.why,
    },
  });

  const quarters: Array<keyof Pick<NetworkForm, "q1" | "q2" | "q3" | "q4">> = [
    "q1",
    "q2",
    "q3",
    "q4",
  ];

  const currentTeam = Number(watch("currentTeamSize")) || 0;
  const targetTeam = Number(watch("targetTeamSize")) || 0;
  const incomeGoal = Number(watch("incomeGoal")) || 0;

  const recruitment =
    currentTeam && targetTeam
      ? calculateRecruitment(currentTeam, targetTeam, 12)
      : null;
  const income =
    incomeGoal > 0 ? calculateIncomeBreakdown(incomeGoal) : undefined;

  const onSubmit = (values: NetworkForm) => {
    const current = values.currentTeamSize ? Number(values.currentTeamSize) : 0;
    const target = values.targetTeamSize ? Number(values.targetTeamSize) : 0;
    const incomeValue = values.incomeGoal ? Number(values.incomeGoal) : 0;

    updateNetwork({
      currentTeamSize: current,
      targetTeamSize: target,
      currentRank: values.currentRank,
      targetRank: values.targetRank,
      quarterlyRanks: [values.q1, values.q2, values.q3, values.q4],
      incomeGoal: incomeValue,
      why: values.why,
    });

    if (target && current) {
      const calc = calculateRecruitment(current, target, 12);
      setCalculations({
        recruitmentNeeded: calc.needed,
        recruitmentPerMonth: calc.perMonth,
        recruitmentPerWeek: calc.perWeek,
      });
    }

    if (incomeValue) {
      const breakdown = calculateIncomeBreakdown(incomeValue);
      setCalculations({
        nmMonthlyIncome: breakdown.monthly,
        nmWeeklyIncome: breakdown.weekly,
      });
    }
    onNext();
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-brand">Network Marketing</p>
          <h2 className="text-2xl font-semibold text-ink">Grow your team</h2>
          <p className="text-muted">
            Recruitment, rank advancement, and income breakdown.
          </p>
        </div>
        <div className="pill">Team Growth</div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Current Team Size</label>
          <input
            type="number"
            className="input"
            placeholder="10"
            min={minValueRule.value}
            {...register("currentTeamSize", {
              min: minValueRule,
              required: "Current team size is required.",
            })}
          />
          {errors.currentTeamSize && (
            <p className="text-sm text-error">
              {errors.currentTeamSize.message as string}
            </p>
          )}
        </div>
        <div>
          <label className="label">Target Team Size</label>
          <input
            type="number"
            className="input"
            placeholder="120"
            min={minValueRule.value}
            {...register("targetTeamSize", {
              min: minValueRule,
              required: "Target team size is required.",
            })}
          />
          {errors.targetTeamSize && (
            <p className="text-sm text-error">
              {errors.targetTeamSize.message as string}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Current Rank</label>
          <select
            className="input"
            {...register("currentRank", { required: "Current rank is required." })}
          >
            <option value="">Select rank</option>
            {rankOptions.map((rank) => (
              <option key={rank} value={rank}>
                {rank}
              </option>
            ))}
          </select>
          {errors.currentRank && (
            <p className="text-sm text-error">{errors.currentRank.message as string}</p>
          )}
        </div>
        <div>
          <label className="label">Target Rank</label>
          <select
            className="input"
            {...register("targetRank", { required: "Target rank is required." })}
          >
            <option value="">Select rank</option>
            {rankOptions.map((rank) => (
              <option key={rank} value={rank}>
                {rank}
              </option>
            ))}
          </select>
          {errors.targetRank && (
            <p className="text-sm text-error">{errors.targetRank.message as string}</p>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        {quarters.map((quarter) => (
          <div key={quarter}>
            <label className="label uppercase">{quarter}</label>
            <select
              className="input"
              {...register(quarter, { required: "Rank for this quarter is required." })}
            >
              <option value="">Select rank</option>
              {rankOptions.map((rank) => (
                <option key={rank} value={rank}>
                  {rank}
                </option>
              ))}
            </select>
            {errors[quarter] && (
              <p className="text-sm text-error">{errors[quarter]?.message as string}</p>
            )}
          </div>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
            <label className="label">Network Marketing Income Goal (Annual, Naira)</label>
            <input
              type="number"
              className="input"
              placeholder="5000000 (₦)"
            min={minValueRule.value}
            {...register("incomeGoal", {
              min: minValueRule,
              required: "Income goal is required.",
            })}
          />
          {errors.incomeGoal && (
            <p className="text-sm text-error">
              {errors.incomeGoal.message as string}
            </p>
          )}
        </div>
        <div>
          <label className="label">Why is this important?</label>
          <textarea
            className="input min-h-20 resize-y"
            placeholder="Go deep. Who depends on this?"
            {...register("why", {
              required: "Please explain why this matters.",
              minLength: { value: 30, message: "Use at least 30 characters." },
            })}
          />
          {errors.why && (
            <p className="text-sm text-error">{errors.why.message as string}</p>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <CalcCard
          label="Recruits needed"
          value={
            recruitment
              ? `${recruitment.needed} total / ${recruitment.perMonth} per month`
              : "Add team sizes"
          }
          subtext={
            recruitment
              ? `${recruitment.perWeek} per week to hit ${watch("targetTeamSize") || 0}`
              : undefined
          }
        />
        <CalcCard
          label="Income breakdown"
          value={
            income
              ? `${formatCurrency(income.monthly, "NGN")} per month`
              : "Add income goal"
          }
          subtext={
            income
              ? `${formatCurrency(income.weekly, "NGN")} per week`
              : undefined
          }
        />
      </div>

      <div className="flex justify-between">
        <button type="button" className="button button-secondary" onClick={onBack}>
          Back
        </button>
        <button type="submit" className="button button-primary">
          Continue to Freelancing Goals
        </button>
      </div>
    </form>
  );
}

function FiverrStep({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const { yearly, updateFiverr, setCalculations } = useGoalStore();
  type FiverrForm = {
    primarySkill: string;
    secondarySkill: string;
    learningGoals: string;
    incomeGoal: string;
    projectTarget: string;
    avgProjectValue: string;
    targetLevel: string;
    reviewsGoal: string;
    why: string;
    currency: Currency;
    exchangeToNgn: string;
  };
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FiverrForm>({
    defaultValues: {
      primarySkill: yearly.fiverr.primarySkill,
      secondarySkill: yearly.fiverr.secondarySkill,
      learningGoals: yearly.fiverr.learningGoals,
      incomeGoal:
        yearly.fiverr.incomeGoal !== null ? String(yearly.fiverr.incomeGoal) : "",
      projectTarget:
        yearly.fiverr.projectTarget !== null ? String(yearly.fiverr.projectTarget) : "",
      avgProjectValue:
        yearly.fiverr.avgProjectValue !== null ? String(yearly.fiverr.avgProjectValue) : "",
      targetLevel: yearly.fiverr.targetLevel,
      reviewsGoal:
        yearly.fiverr.reviewsGoal !== null ? String(yearly.fiverr.reviewsGoal) : "",
      why: yearly.fiverr.why,
      currency: yearly.fiverr.currency,
      exchangeToNgn:
        yearly.fiverr.exchangeToNgn !== null ? String(yearly.fiverr.exchangeToNgn) : "",
    },
  });

  const incomeGoal = Number(watch("incomeGoal")) || 0;
  const projectTarget = Number(watch("projectTarget")) || 0;
  const avgProjectValue = Number(watch("avgProjectValue")) || 0;
  const reviewsGoal = Number(watch("reviewsGoal")) || 0;
  const exchangeToNgn = 1500;
  const currency = watch("currency") as Currency;

  const fiverrCalc = incomeGoal
    ? calculateFiverrTargets({
        incomeGoal,
        projectCount: projectTarget || undefined,
        avgValue: avgProjectValue || undefined,
      })
    : null;

  const ngnValue = currency === "USD" ? convertUsdToNgn(incomeGoal, exchangeToNgn) : null;
  const reviewsPerMonth = calculateReviewVelocity(reviewsGoal || 0);

  const onSubmit = (values: FiverrForm) => {
    const income = values.incomeGoal ? Number(values.incomeGoal) : 0;
    const projects = values.projectTarget ? Number(values.projectTarget) : 0;
    const avgValue = values.avgProjectValue ? Number(values.avgProjectValue) : 0;
    const reviews = values.reviewsGoal ? Number(values.reviewsGoal) : 0;
    const exchangeRate = 1500;
    const currencyValue = values.currency as Currency;

    updateFiverr({
      primarySkill: values.primarySkill,
      secondarySkill: values.secondarySkill,
      learningGoals: values.learningGoals,
      incomeGoal: income,
      projectTarget: projects,
      avgProjectValue: avgValue,
      targetLevel: values.targetLevel,
      reviewsGoal: reviews,
      why: values.why,
      currency: currencyValue,
      exchangeToNgn: exchangeRate,
    });

    if (income && (projects || avgValue)) {
      const calc = calculateFiverrTargets({
        incomeGoal: income,
        projectCount: projects || undefined,
        avgValue: avgValue || undefined,
      });
      if (calc) {
        setCalculations({
          fiverrAvgPerProject: calc.avgNeeded,
          fiverrProjectsNeeded: calc.projectsNeeded,
          fiverrProjectsPerMonth: calc.perMonth,
          fiverrProjectsPerWeek: calc.perWeek,
          fiverrIncomeCurrency: currencyValue,
        });
      }
    }

    if (reviews) {
      setCalculations({
        reviewPerMonth: calculateReviewVelocity(reviews),
      });
    }

    onNext();
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-brand">Freelancing Online</p>
          <h2 className="text-2xl font-semibold text-ink">
            Skills pay the bills and build your future of Passive Income.
          </h2>
          <p className="text-muted">Plan income, projects, and learning to level up.</p>
        </div>
        <div className="pill">Freelance</div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Primary Skill</label>
          <input
            className="input"
            placeholder="Video editing"
            {...register("primarySkill", { required: "Primary skill is required." })}
          />
          {errors.primarySkill && (
            <p className="text-sm text-error">{errors.primarySkill.message as string}</p>
          )}
        </div>
        <div>
          <label className="label">Secondary Skill (optional)</label>
          <input className="input" placeholder="Copywriting" {...register("secondarySkill")} />
        </div>
      </div>

      <div>
        <label className="label">Skill Learning Goal</label>
        <textarea
          className="input min-h-20 resize-y"
          placeholder="What new skills will you learn this year?"
          {...register("learningGoals", {
            required: "Learning goal is required.",
          })}
        />
        {errors.learningGoals && (
          <p className="text-sm text-error">{errors.learningGoals.message as string}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Income Goal (Annual)</label>
            <div className="flex gap-2">
              <select className="input w-24" {...register("currency")}>
                <option value="USD">USD</option>
                <option value="NGN">NGN</option>
              </select>
              <input
                type="number"
                className="input"
                placeholder="20000"
                min={minValueRule.value}
                {...register("incomeGoal", {
                  min: minValueRule,
                  required: "Income goal is required.",
                })}
              />
            </div>
            {errors.incomeGoal && (
              <p className="text-sm text-error">
                {errors.incomeGoal.message as string}
            </p>
          )}
        </div>
        <div />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
            <label className="label">Target Number of Projects</label>
            <input
              type="number"
              className="input"
              placeholder="40"
              min={minValueRule.value}
              {...register("projectTarget", {
                min: minValueRule,
                required: "Target number of projects is required.",
              })}
            />
            {errors.projectTarget && (
              <p className="text-sm text-error">
                {errors.projectTarget.message as string}
              </p>
          )}
        </div>
        <div>
            <label className="label">Average Project Value</label>
            <input
              type="number"
              className="input"
              placeholder="500"
              min={minValueRule.value}
              {...register("avgProjectValue", {
                min: minValueRule,
                required: "Average project value is required.",
              })}
            />
            {errors.avgProjectValue && (
              <p className="text-sm text-error">
                {errors.avgProjectValue.message as string}
              </p>
          )}
        </div>
        <div>
            <label className="label">Target Fiverr Level</label>
            <select
              className="input"
              {...register("targetLevel", { required: "Target Fiverr level is required." })}
            >
              <option value="">Select level</option>
              <option value="New Seller">New Seller</option>
              <option value="Level 1">Level 1</option>
              <option value="Level 2">Level 2</option>
              <option value="Top Rated">Top Rated</option>
            </select>
            {errors.targetLevel && (
              <p className="text-sm text-error">{errors.targetLevel.message as string}</p>
            )}
          </div>
        </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
            <label className="label">5-Star Reviews Goal</label>
            <input
              type="number"
              className="input"
              placeholder="60"
              min={minValueRule.value}
              {...register("reviewsGoal", {
                min: minValueRule,
                required: "5-star reviews goal is required.",
              })}
            />
            {errors.reviewsGoal && (
              <p className="text-sm text-error">
                {errors.reviewsGoal.message as string}
              </p>
          )}
        </div>
        <div>
          <label className="label">Why is freelancing important?</label>
          <textarea
            className="input min-h-20 resize-y"
            placeholder="Your why keeps you consistent."
            {...register("why", {
              required: "Please add why freelancing matters to your overall goal.",
              minLength: {
                value: 60,
                message: "Use at least 60 characters (longer is great).",
              },
            })}
          />
          {errors.why && <p className="text-sm text-error">{errors.why.message as string}</p>}
          <p className="text-sm text-muted mt-1">
            Minimum 60 characters—share enough detail to keep you consistent.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <CalcCard
          label="Average per project"
          value={
            fiverrCalc
              ? formatCurrency(fiverrCalc.avgNeeded, currency)
              : "Add income + projects"
          }
          subtext={
            fiverrCalc
              ? `${Math.ceil(fiverrCalc.perMonth ?? 0)} projects per month`
              : undefined
          }
        />
        <CalcCard
          label="Projects needed"
          value={
            fiverrCalc
              ? `${Math.ceil(fiverrCalc.projectsNeeded)} total`
              : "Add income + avg value"
          }
          subtext={
            fiverrCalc ? `${Math.ceil(fiverrCalc.perWeek ?? 0)} per week` : undefined
          }
        />
        <CalcCard
          label="5-star reviews"
          value={
            reviewsGoal
              ? `${reviewsGoal} goal`
              : "Add a reviews goal to see pace"
          }
          subtext={
            reviewsGoal
              ? `${Math.ceil(reviewsPerMonth)} per month`
              : undefined
          }
        />
      </div>

      {currency === "USD" && ngnValue && (
        <div className="grid gap-4 sm:grid-cols-2">
          <CalcCard
            label="Naira equivalent"
            value={formatCurrency(ngnValue, "NGN")}
            subtext="Based on your exchange rate"
          />
        </div>
      )}

      <div className="flex justify-between">
        <button type="button" className="button button-secondary" onClick={onBack}>
          Back
        </button>
        <button type="submit" className="button button-primary">
          Continue to Growth
        </button>
      </div>
    </form>
  );
}

function GrowthStep({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const { yearly, updatePersonal, updateIpas, updateCommitment } = useGoalStore();
  type GrowthForm = {
    goals: string;
    books: string[];
    courses: string;
    events: string;
    personalWhy: string;
    ipas: string[];
    ipaWhy: string;
    gamePlan: string;
    habitPlan: string;
    habitSupport: string;
    reviewDay: string;
    partner: string;
    agreed: boolean;
    signatureName: string;
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GrowthForm>({
    defaultValues: {
      goals: yearly.personalDev.goals,
      books: yearly.personalDev.books,
      courses: yearly.personalDev.courses,
      events: yearly.personalDev.events,
      personalWhy: yearly.personalDev.why,
      ipas: yearly.ipas.activities,
      ipaWhy: yearly.ipas.why,
      gamePlan: yearly.personalDev.gamePlan,
      habitPlan: yearly.personalDev.habitPlan,
      habitSupport: yearly.ipas.habitSupport,
      reviewDay: yearly.commitment.reviewDay,
      partner: yearly.commitment.partner,
      agreed: yearly.commitment.agreed,
      signatureName: yearly.commitment.signatureName,
    },
  });

  const onSubmit = (values: GrowthForm) => {
    updatePersonal({
      goals: values.goals,
      books: values.books,
      courses: values.courses,
      events: values.events,
      why: values.personalWhy,
      gamePlan: values.gamePlan,
      habitPlan: values.habitPlan,
    });
    updateIpas({
      activities: values.ipas,
      why: values.ipaWhy,
      habitSupport: values.habitSupport,
    });
    updateCommitment({
      reviewDay: values.reviewDay,
      partner: values.partner,
      agreed: !!values.agreed,
      signatureName: values.signatureName,
    });
    onNext();
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-brand">Growth & IPAs</p>
          <h2 className="text-2xl font-semibold text-ink">
            Build your skills and daily habits
          </h2>
          <p className="text-muted">
            Clarify what you will learn and what you will do every single day.
          </p>
        </div>
        <div className="pill">Consistency</div>
      </div>

      <div>
        <label className="label">Personal Development Goal</label>
        <textarea
          className="input min-h-20 resize-y"
          placeholder="How will you grow this year?"
          {...register("goals", { required: "Personal development goal is required.", minLength: { value: 20, message: "Add at least 20 characters." } })}
        />
        {errors.goals && <p className="text-sm text-error">{errors.goals.message as string}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Books (up to 12)</label>
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <input
                key={index}
                className="input"
                placeholder={`Book ${index + 1}`}
                {...register(`books.${index}` as const, { required: "Required." })}
              />
            ))}
          </div>
          {errors.books && <p className="text-sm text-error">Please fill each book slot.</p>}
        </div>
        <div className="grid gap-3">
          <div>
            <label className="label">Courses/Training</label>
            <input
              className="input"
              {...register("courses", { required: "Courses/Training is required." })}
            />
            {errors.courses && (
              <p className="text-sm text-error">{errors.courses.message as string}</p>
            )}
          </div>
          <div>
            <label className="label">Events/Conferences</label>
            <input
              className="input"
              {...register("events", { required: "Events/Conferences are required." })}
            />
            {errors.events && (
              <p className="text-sm text-error">{errors.events.message as string}</p>
            )}
          </div>
          <div>
            <label className="label">Why (Personal Growth)</label>
            <textarea
              className="input min-h-20 resize-y"
              {...register("personalWhy", {
                required: "Why is required.",
                minLength: { value: 60, message: "Add at least 60 characters." },
              })}
            />
            {errors.personalWhy && (
              <p className="text-sm text-error">{errors.personalWhy.message as string}</p>
            )}
          </div>
          <div>
            <label className="label">Game plan activities (for your dream goal)</label>
            <textarea
              className="input min-h-20 resize-y"
              placeholder="List the activities that make the dream goal real."
              {...register("gamePlan", {
                required: "Game plan is required.",
                minLength: { value: 30, message: "Add more detail (30+ chars)." },
              })}
            />
            {errors.gamePlan && (
              <p className="text-sm text-error">{errors.gamePlan.message as string}</p>
            )}
          </div>
          <div>
            <label className="label">Habit lock (convert activity to habit)</label>
            <textarea
              className="input min-h-20 resize-y"
              placeholder="How will you set up your environment and routines to make the game plan automatic?"
              {...register("habitPlan", {
                required: "Habit lock is required.",
                minLength: { value: 30, message: "Add more detail (30+ chars)." },
              })}
            />
            {errors.habitPlan && (
              <p className="text-sm text-error">{errors.habitPlan.message as string}</p>
            )}
          </div>
        </div>
      </div>

      <div>
        <label className="label">Daily Income-Producing Activities</label>
        <p className="text-sm text-muted">
          These are your non-negotiables. Consistency beats intensity.
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {Array.from({ length: 8 }).map((_, index) => (
            <input
              key={index}
              className="input"
              placeholder={`IPA ${index + 1}`}
              {...register(`ipas.${index}` as const, { required: "Required." })}
            />
          ))}
        </div>
        {errors.ipas && <p className="text-sm text-error">Please fill all IPA slots.</p>}

        <label className="label mt-3">Why these IPAs?</label>
        <textarea
          className="input mt-1 min-h-20 resize-y"
          placeholder="Why will you keep these daily commitments?"
          {...register("ipaWhy", {
            required: "IPA why is required.",
            minLength: { value: 30, message: "Add at least 30 characters." },
          })}
        />
        {errors.ipaWhy && (
          <p className="text-sm text-error">{errors.ipaWhy.message as string}</p>
        )}

        <label className="label mt-3">Habit support</label>
        <textarea
          className="input mt-1 min-h-20 resize-y"
          placeholder="Habit support: what reminders, cues, or environment shifts keep you consistent?"
          {...register("habitSupport", {
            required: "Habit support is required.",
            minLength: { value: 20, message: "Add at least 20 characters." },
          })}
        />
        {errors.habitSupport && (
          <p className="text-sm text-error">{errors.habitSupport.message as string}</p>
        )}
      </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="label">Preferred Review Day</label>
            <select
              className="input"
              {...register("reviewDay", { required: "Review day is required." })}
            >
              <option value="">Select</option>
              <option value="1st">1st</option>
              <option value="Last Sunday">Last Sunday</option>
              <option value="15th">15th</option>
            </select>
            {errors.reviewDay && (
              <p className="text-sm text-error">{errors.reviewDay.message as string}</p>
            )}
          </div>
          <div>
            <label className="label">Accountability Partner</label>
            <input
              className="input"
              placeholder="Accountability partner name"
              {...register("partner", { required: "Accountability partner is required." })}
            />
            {errors.partner && (
              <p className="text-sm text-error">{errors.partner.message as string}</p>
            )}
          </div>
          <div className="flex items-center gap-3 pt-8">
            <input
              type="checkbox"
              className="h-5 w-5 accent-brand"
              {...register("agreed", { required: "You must commit to monthly review." })}
            />
            <span className="text-sm text-muted">
              I commit to reviewing my goals monthly.
            </span>
          </div>
          {errors.agreed && (
            <p className="text-sm text-error">{errors.agreed.message as string}</p>
          )}
        </div>

        <div>
          <label className="label">Signature Name (used on PDFs)</label>
          <input
            className="input"
            placeholder="Your full name"
            {...register("signatureName", {
              required: "Signature name is required.",
              minLength: { value: 2, message: "Add at least 2 characters." },
            })}
          />
          {errors.signatureName && (
            <p className="text-sm text-error">{errors.signatureName.message as string}</p>
          )}
        </div>

      <div className="flex justify-between">
        <button type="button" className="button button-secondary" onClick={onBack}>
          Back
        </button>
        <button type="submit" className="button button-primary">
          Review & Generate PDF
        </button>
      </div>
    </form>
  );
}

function YearlyReview({
  onBack,
  goalCardRef,
}: {
  onBack: () => void;
  goalCardRef: RefObject<HTMLDivElement | null>;
}) {
  const { yearly, calculations, memberId, reset, setCurrentStep } = useGoalStore();
  const [pdfStatus, setPdfStatus] = useState<string>("");
  const [showYearlyPreview, setShowYearlyPreview] = useState(false);
  const [showGoalCardPreview, setShowGoalCardPreview] = useState(false);
  const [yearlyPreviewUrl, setYearlyPreviewUrl] = useState<string | null>(null);
  const [goalCardPreviewUrl, setGoalCardPreviewUrl] = useState<string | null>(null);

  const yearlyPlanRef = useRef<HTMLDivElement>(null);
  const goalCardPdfRef = useRef<HTMLDivElement>(null);

  const handleStartOver = () => {
    reset();
    setCurrentStep(0);
  };

  const handleDownloadYearlyPdf = async () => {
    setPdfStatus("Generating PDF...");
    try {
      await generateYearlyPlanPDF({
        yearly,
        calculations,
        memberId: memberId || "ELV",
        signatureName: yearly.commitment.signatureName,
        year: "2026",
      });
      setPdfStatus("Downloaded.");
      setTimeout(() => setPdfStatus(""), 2000);
    } catch (error) {
      console.error("PDF generation failed", error);
      setPdfStatus("Failed to generate PDF. Try again.");
    }
  };

  const handleDownloadGoalCard = async () => {
    setPdfStatus("Generating Goal Card...");
    try {
      await generateGoalCardPDF({
        yearly,
        calculations,
        memberId: memberId || "ELV",
        signatureName: yearly.commitment.signatureName,
      });
      setPdfStatus("Downloaded.");
      setTimeout(() => setPdfStatus(""), 2000);
    } catch (error) {
      console.error("Goal Card PDF generation failed", error);
      setPdfStatus("Failed to generate PDF. Try again.");
    }
  };

  const handleShowYearlyPreview = async () => {
    setPdfStatus("Generating preview...");
    try {
      const url = await generateYearlyPlanPreview({
        yearly,
        calculations,
        memberId: memberId || "ELV",
        signatureName: yearly.commitment.signatureName,
        year: "2026",
      });
      setYearlyPreviewUrl(url);
      setShowYearlyPreview(true);
      setPdfStatus("");
    } catch (error) {
      console.error("Preview generation failed", error);
      setPdfStatus("Failed to generate preview.");
    }
  };

  const handleShowGoalCardPreview = async () => {
    setPdfStatus("Generating preview...");
    try {
      const url = await generateGoalCardPreview({
        yearly,
        calculations,
        memberId: memberId || "ELV",
        signatureName: yearly.commitment.signatureName,
      });
      setGoalCardPreviewUrl(url);
      setShowGoalCardPreview(true);
      setPdfStatus("");
    } catch (error) {
      console.error("Preview generation failed", error);
      setPdfStatus("Failed to generate preview.");
    }
  };

  const handleCloseYearlyPreview = () => {
    setShowYearlyPreview(false);
    if (yearlyPreviewUrl) {
      URL.revokeObjectURL(yearlyPreviewUrl);
      setYearlyPreviewUrl(null);
    }
  };

  const handleCloseGoalCardPreview = () => {
    setShowGoalCardPreview(false);
    if (goalCardPreviewUrl) {
      URL.revokeObjectURL(goalCardPreviewUrl);
      setGoalCardPreviewUrl(null);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-xs sm:text-sm text-brand">Review</p>
          <h2 className="text-xl sm:text-2xl font-semibold text-ink break-words">
            Confirm your plan before exporting
          </h2>
        </div>
        <div className="pill self-start">Member {memberId}</div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <SummaryCard title="Vision" items={[
          { label: "Word of the year", value: yearly.vision.word || "—" },
          { label: "Annual income goal", value: yearly.vision.totalIncomeGoal
            ? formatCurrency(yearly.vision.totalIncomeGoal, yearly.vision.currency)
            : "—" },
          { label: "Statement", value: yearly.vision.statement || "—" },
        ]} />

        <SummaryCard title="Network Marketing" items={[
          { label: "Team", value: `${yearly.networkMarketing.currentTeamSize ?? 0} → ${yearly.networkMarketing.targetTeamSize ?? 0}` },
          { label: "Ranks", value: `${yearly.networkMarketing.currentRank || "Current"} → ${yearly.networkMarketing.targetRank || "Target"}` },
          { label: "Recruitment pace", value: calculations.recruitmentPerMonth
              ? `${calculations.recruitmentPerMonth} / month (${calculations.recruitmentPerWeek} / week)`
              : "Add team sizes" },
          { label: "Income", value: calculations.nmMonthlyIncome
              ? formatCurrency(calculations.nmMonthlyIncome, "NGN")
              : "Add income goal" },
          { label: "Why", value: yearly.networkMarketing.why || "—" },
        ]} />

        <SummaryCard title="Freelancing On Fiverr" items={[
          { label: "Skills", value: [yearly.fiverr.primarySkill, yearly.fiverr.secondarySkill].filter(Boolean).join(" / ") || "—" },
          { label: "Income goal", value: yearly.fiverr.incomeGoal
              ? formatCurrency(yearly.fiverr.incomeGoal, yearly.fiverr.currency)
              : "—" },
          { label: "Projects pace", value: calculations.fiverrProjectsPerMonth
              ? `${(calculations.fiverrProjectsPerMonth ?? 0).toFixed(1)} / month`
              : "Add income + projects" },
          { label: "5-star reviews", value: yearly.fiverr.reviewsGoal ? `${yearly.fiverr.reviewsGoal} (${calculations.reviewPerMonth?.toFixed(1) ?? 0} per month)` : "—" },
          { label: "Why", value: yearly.fiverr.why || "—" },
        ]} />

        <SummaryCard title="Growth & IPAs" items={[
          { label: "Personal growth", value: yearly.personalDev.goals || "—" },
          { label: "Books", value: yearly.personalDev.books.filter(Boolean).slice(0,4).join(", ") || "—" },
          { label: "Courses / Events", value: [yearly.personalDev.courses, yearly.personalDev.events].filter(Boolean).join(" | ") || "—" },
          { label: "IPAs", value: yearly.ipas.activities.filter(Boolean).slice(0,4).join(" • ") || "—" },
          { label: "Review cadence", value: yearly.commitment.reviewDay || "—" },
        ]} />
      </div>

      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-3">
        <button type="button" className="button button-secondary w-full sm:w-auto" onClick={onBack}>
          Back
        </button>
        <button type="button" className="button button-primary w-full sm:w-auto sm:flex-1" onClick={handleShowYearlyPreview}>
          Preview & Download Plan
        </button>
        <button type="button" className="button button-secondary w-full sm:w-auto" onClick={handleShowGoalCardPreview}>
          Preview Goal Card
        </button>
        <button
          type="button"
          className="button button-secondary w-full sm:w-auto"
          onClick={handleStartOver}
        >
          Start Over
        </button>
        {pdfStatus && <span className="text-sm text-muted text-center">{pdfStatus}</span>}
      </div>

      {/* Hidden HTML templates for PDF generation */}
      <div className="hidden">
        <div ref={yearlyPlanRef}>
          <YearlyPlanHTML
            yearly={yearly}
            calculations={calculations}
            memberId={memberId}
            signatureName={yearly.commitment.signatureName}
            year="2026"
          />
        </div>
        <div ref={goalCardPdfRef}>
          <GoalCardHTML
            yearly={yearly}
            calculations={calculations}
            memberId={memberId}
            signatureName={yearly.commitment.signatureName}
          />
        </div>
      </div>

      {/* Preview Modals */}
      {showYearlyPreview && yearlyPreviewUrl && (
        <SimplePreviewModal
          isOpen={showYearlyPreview}
          onClose={handleCloseYearlyPreview}
          onDownload={handleDownloadYearlyPdf}
          pdfUrl={yearlyPreviewUrl}
          title="Yearly Plan Preview"
        />
      )}

      {showGoalCardPreview && goalCardPreviewUrl && (
        <SimplePreviewModal
          isOpen={showGoalCardPreview}
          onClose={handleCloseGoalCardPreview}
          onDownload={handleDownloadGoalCard}
          pdfUrl={goalCardPreviewUrl}
          title="Goal Card Preview"
        />
      )}
    </div>
  );
}

function MonthlyWizard({
  currentStep,
  setCurrentStep,
  steps,
}: {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  steps: { key: string; label: string }[];
}) {
  return (
    <div className="flex flex-col gap-6">
      <Stepper currentStep={currentStep} steps={steps} />
      {steps[currentStep]?.key === "month" && (
        <MonthlyStep onNext={() => setCurrentStep(currentStep + 1)} />
      )}
      {steps[currentStep]?.key === "review" && (
        <MonthlyReview onBack={() => setCurrentStep(currentStep - 1)} />
      )}
    </div>
  );
}

function MonthlyStep({ onNext }: { onNext: () => void }) {
  const { monthly, updateMonthly, setCalculations } = useGoalStore();
  type MonthlyForm = {
    month: string;
    focus: string;
    priorities: string[];
    nmRecruitment: string;
    nmIncome: string;
    nmWhy: string;
    fiverrProjects: string;
    fiverrIncome: string;
    fiverrWhy: string;
    ipas: string[];
    endVision: string;
  };
  const { register, handleSubmit, watch, formState: { errors } } = useForm<MonthlyForm>({
    defaultValues: {
      month: monthly.month,
      focus: monthly.focus,
      priorities: monthly.priorities,
      nmRecruitment:
        monthly.nmRecruitment !== null ? String(monthly.nmRecruitment) : "",
      nmIncome:
        monthly.nmIncome !== null ? String(monthly.nmIncome) : "",
      nmWhy: monthly.nmWhy,
      fiverrProjects:
        monthly.fiverrProjects !== null ? String(monthly.fiverrProjects) : "",
      fiverrIncome:
        monthly.fiverrIncome !== null ? String(monthly.fiverrIncome) : "",
      fiverrWhy: monthly.fiverrWhy,
      ipas: monthly.ipas,
      endVision: monthly.endVision,
    },
  });

  const nmRecruitment = Number(watch("nmRecruitment")) || 0;
  const nmIncome = Number(watch("nmIncome")) || 0;
  const fiverrProjects = Number(watch("fiverrProjects")) || 0;
  const fiverrIncome = Number(watch("fiverrIncome")) || 0;

  const nmWeekly = nmIncome ? nmIncome / 4 : null;
  const fiverrAvg = fiverrProjects ? fiverrIncome / fiverrProjects : null;

  const onSubmit = (values: MonthlyForm) => {
    const projectsVal = values.fiverrProjects ? Number(values.fiverrProjects) : null;
    const incomeVal = values.fiverrIncome ? Number(values.fiverrIncome) : null;
    const avgVal = projectsVal && incomeVal ? incomeVal / projectsVal : null;

    updateMonthly({
      month: values.month,
      focus: values.focus,
      priorities: [
        values.priorities[0] || "",
        values.priorities[1] || "",
        values.priorities[2] || "",
      ],
      nmRecruitment: values.nmRecruitment ? Number(values.nmRecruitment) : null,
      nmIncome: values.nmIncome ? Number(values.nmIncome) : null,
      nmWhy: values.nmWhy,
      fiverrProjects: values.fiverrProjects ? Number(values.fiverrProjects) : null,
      fiverrIncome: values.fiverrIncome ? Number(values.fiverrIncome) : null,
      fiverrWhy: values.fiverrWhy,
      ipas: values.ipas,
      endVision: values.endVision,
    });

    setCalculations({
      recruitmentPerWeek: values.nmRecruitment ? Number(values.nmRecruitment) / 4 : null,
      fiverrAvgPerProject: avgVal,
      fiverrProjectsNeeded: projectsVal,
    });
    onNext();
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <p className="text-sm text-brand">Monthly Sprint</p>
        <h2 className="text-2xl font-semibold text-ink">Plan your next 30 days</h2>
        <p className="text-muted">Keep it focused. Minimum 10, no max.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Month</label>
          <select className="input" {...register("month")}>
            <option value="">Select</option>
            {[
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ].map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Theme / Focus</label>
          <input className="input" placeholder="e.g. Outreach" {...register("focus")} />
        </div>
      </div>

      <div>
        <label className="label">Top 3 Priorities</label>
        <div className="grid gap-2 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <input
              key={index}
              className="input"
              placeholder={`Priority ${index + 1}`}
              {...register(`priorities.${index}` as const)}
            />
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-3">
          <div>
            <label className="label">Recruitment Target</label>
            <input
              type="number"
              className="input"
              placeholder="10"
              min={minValueRule.value}
              {...register("nmRecruitment", { min: minValueRule })}
            />
            {errors.nmRecruitment && (
              <p className="text-sm text-error">
                {errors.nmRecruitment.message as string}
              </p>
            )}
          </div>
          <div>
            <label className="label">NM Income Target</label>
            <input
              type="number"
              className="input"
              placeholder="500000"
              min={minValueRule.value}
              {...register("nmIncome", { min: minValueRule })}
            />
          </div>
          <textarea
            className="input min-h-16 resize-y"
            placeholder="Why"
            {...register("nmWhy")}
          />
        </div>
        <div className="grid gap-3">
          <div>
            <label className="label">Fiverr Projects to Complete</label>
            <input
              type="number"
              className="input"
              placeholder="8"
              min={minValueRule.value}
              {...register("fiverrProjects", { min: minValueRule })}
            />
          </div>
          <div>
            <label className="label">Fiverr Income Target</label>
            <input
              type="number"
              className="input"
              placeholder="2000"
              min={minValueRule.value}
              {...register("fiverrIncome", { min: minValueRule })}
            />
          </div>
          <textarea
            className="input min-h-16 resize-y"
            placeholder="Why"
            {...register("fiverrWhy")}
          />
        </div>
      </div>

      <div>
        <label className="label">Daily IPAs (up to 6)</label>
        <div className="grid gap-2 sm:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <input
              key={index}
              className="input"
              placeholder={`IPA ${index + 1}`}
              {...register(`ipas.${index}` as const)}
            />
          ))}
        </div>
      </div>

      <div>
        <label className="label">End of Month Vision</label>
        <textarea
          className="input min-h-20 resize-y"
          placeholder="By [Month] 31st, I will have..."
          {...register("endVision")}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <CalcCard
          label="Recruitment pace"
          value={
            nmRecruitment
              ? `${nmRecruitment / 4} per week`
              : "Add monthly recruitment"
          }
        />
        <CalcCard
          label="Income pace"
          value={
            nmWeekly
              ? `${formatCurrency(nmWeekly, "NGN")} per week`
              : "Add NM income"
          }
        />
        <CalcCard
          label="Fiverr avg per project"
          value={
            fiverrAvg ? formatCurrency(fiverrAvg, "USD") : "Add projects + income"
          }
        />
      </div>

      <div className="flex justify-end">
        <button type="submit" className="button button-primary">
          Review & Generate PDF
        </button>
      </div>
    </form>
  );
}

function MonthlyReview({ onBack }: { onBack: () => void }) {
  const { monthly, calculations, memberId, reset, setCurrentStep } = useGoalStore();
  const [pdfStatus, setPdfStatus] = useState<string>("");
  const [showMonthlyPreview, setShowMonthlyPreview] = useState(false);
  const [monthlyPreviewUrl, setMonthlyPreviewUrl] = useState<string | null>(null);

  const monthlyPlanRef = useRef<HTMLDivElement>(null);

  const handleDownloadMonthlyPdf = async () => {
    setPdfStatus("Generating Monthly Plan...");
    try {
      await generateMonthlyPlanPDF({
        monthly,
        calculations,
        memberId: memberId || "ELV",
      });
      setPdfStatus("Downloaded.");
      setTimeout(() => setPdfStatus(""), 2000);
    } catch (error) {
      console.error("Monthly Plan PDF generation failed", error);
      setPdfStatus("Failed to generate PDF. Try again.");
    }
  };

  const handleStartOver = () => {
    reset();
    setCurrentStep(0);
  };

  const handleShowMonthlyPreview = async () => {
    setPdfStatus("Generating preview...");
    try {
      const url = await generateMonthlyPlanPreview({
        monthly,
        calculations,
        memberId: memberId || "ELV",
      });
      setMonthlyPreviewUrl(url);
      setShowMonthlyPreview(true);
      setPdfStatus("");
    } catch (error) {
      console.error("Preview generation failed", error);
      setPdfStatus("Failed to generate preview.");
    }
  };

  const handleCloseMonthlyPreview = () => {
    setShowMonthlyPreview(false);
    if (monthlyPreviewUrl) {
      URL.revokeObjectURL(monthlyPreviewUrl);
      setMonthlyPreviewUrl(null);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-brand">Monthly Review</p>
          <h2 className="text-2xl font-semibold text-ink">
            Quick summary before exporting
          </h2>
        </div>
        <div className="pill">Member {memberId}</div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <SummaryCard title="Month" items={[
          { label: "Month", value: monthly.month || "—" },
          { label: "Focus", value: monthly.focus || "—" },
          { label: "Priorities", value: monthly.priorities.filter(Boolean).join(" • ") || "—" },
          { label: "Vision", value: monthly.endVision || "—" },
        ]} />

        <SummaryCard title="Execution" items={[
          { label: "Recruitment", value: monthly.nmRecruitment ? `${monthly.nmRecruitment} (${(calculations.recruitmentPerWeek ?? 0).toFixed(1)} / week)` : "—" },
          { label: "NM Income", value: monthly.nmIncome ? formatCurrency(monthly.nmIncome, "NGN") : "—" },
          { label: "Fiverr", value: monthly.fiverrIncome ? `${formatCurrency(monthly.fiverrIncome, "USD")} from ${monthly.fiverrProjects ?? 0} projects` : "—" },
          { label: "IPAs", value: monthly.ipas.filter(Boolean).slice(0,4).join(" • ") || "—" },
        ]} />
      </div>

      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-3">
        <button type="button" className="button button-secondary w-full sm:w-auto" onClick={onBack}>
          Back
        </button>
        <button type="button" className="button button-primary w-full sm:w-auto sm:flex-1" onClick={handleShowMonthlyPreview}>
          Preview & Download Plan
        </button>
        <button
          type="button"
          className="button button-secondary w-full sm:w-auto"
          onClick={handleStartOver}
        >
          Start Over
        </button>
        {pdfStatus && <span className="text-sm text-muted text-center">{pdfStatus}</span>}
      </div>

      {/* Hidden HTML template for PDF generation */}
      <div className="hidden">
        <div ref={monthlyPlanRef}>
          <MonthlyPlanHTML
            monthly={monthly}
            calculations={calculations}
            memberId={memberId}
          />
        </div>
      </div>

      {/* Preview Modal */}
      {showMonthlyPreview && monthlyPreviewUrl && (
        <SimplePreviewModal
          isOpen={showMonthlyPreview}
          onClose={handleCloseMonthlyPreview}
          onDownload={handleDownloadMonthlyPdf}
          pdfUrl={monthlyPreviewUrl}
          title="Monthly Plan Preview"
        />
      )}
    </div>
  );
}

function CalcCard({
  label,
  value,
  subtext,
}: {
  label: string;
  value: string;
  subtext?: string;
}) {
  return (
    <div className="rounded-xl bg-gradient-to-br from-brand to-brand-strong p-4 text-white shadow-md">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/80">
        {label}
      </p>
      <p className="mt-2 text-xl font-bold">{value}</p>
      {subtext && <p className="text-sm text-white/80">{subtext}</p>}
    </div>
  );
}

function SummaryCard({
  title,
  items,
}: {
  title: string;
  items: { label: string; value: string }[];
}) {
  return (
    <div className="card flex flex-col gap-2 p-4 sm:p-5">
      <h3 className="text-base sm:text-lg font-semibold text-ink">{title}</h3>
      <div className="space-y-2.5">
        {items.map((item) => (
          <div key={item.label} className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
            <span className="text-xs sm:text-sm text-muted shrink-0">{item.label}</span>
            <span className="text-sm sm:text-sm font-semibold text-ink break-words sm:text-right max-w-full">
              {item.value || "—"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
