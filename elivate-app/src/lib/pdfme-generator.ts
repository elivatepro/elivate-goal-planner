import { generate } from "@pdfme/generator";
import { BLANK_PDF, DEFAULT_FONT_NAME, getDefaultFont } from "@pdfme/common";
import type { Template, Schema } from "@pdfme/common";
import type { Calculations, YearlyGoals } from "./types";
import { formatCurrency } from "./calculations";

type PlanInput = {
  [key: string]: string;
};

const fonts = getDefaultFont();
const defaultFontName = Object.keys(fonts)[0] || DEFAULT_FONT_NAME;

function buildTemplate(schemas: Schema[], width = 595, height = 842): Template {
  return {
    width,
    height,
    // pdfme expects schemas as Schema[][]; cast to relax strict typing.
    schemas: [schemas] as any,
    basePdf: BLANK_PDF,
  } as unknown as Template;
}

function textField(
  id: string,
  x: number,
  y: number,
  width: number,
  height: number,
  fontSize = 11,
  align: "left" | "center" | "right" = "left",
  color = "#0f172a",
  fontName = defaultFontName,
) {
  return {
    id,
    name: id,
    type: "text",
    position: { x, y },
    width,
    height,
    fontSize,
    fontColor: color,
    alignment: align,
    fontName,
    lineHeight: 1.4,
  } as Schema;
}

function makePlanSchemas() {
  const marginX = 36;
  const contentWidth = 523;
  let y = 24;
  const fields: Schema[] = [];

  fields.push(textField("title", marginX, y, contentWidth, 20, 20, "center", "#2A7D5F"));
  y += 24;
  fields.push(textField("meta", marginX, y, contentWidth, 14, 10, "center", "#475569"));
  y += 24;

  fields.push(textField("visionTitle", marginX, y, contentWidth, 16, 13, "left", "#166534"));
  y += 18;
  fields.push(textField("vision", marginX, y, contentWidth, 80, 11));
  y += 84;

  fields.push(textField("visionMoney", marginX, y, contentWidth, 14, 11));
  y += 16;

  fields.push(textField("motivationTitle", marginX, y, contentWidth, 16, 13, "left", "#166534"));
  y += 18;
  fields.push(textField("motivation", marginX, y, contentWidth, 60, 11));
  y += 64;

  fields.push(textField("networkTitle", marginX, y, contentWidth, 16, 13, "left", "#166534"));
  y += 18;
  fields.push(textField("network", marginX, y, contentWidth, 60, 11));
  y += 64;

  fields.push(textField("fiverrTitle", marginX, y, contentWidth, 16, 13, "left", "#166534"));
  y += 18;
  fields.push(textField("fiverr", marginX, y, contentWidth, 60, 11));
  y += 64;

  fields.push(textField("personalTitle", marginX, y, contentWidth, 16, 13, "left", "#166534"));
  y += 18;
  fields.push(textField("personal", marginX, y, contentWidth, 60, 11));
  y += 64;

  fields.push(textField("ipasTitle", marginX, y, contentWidth, 16, 13, "left", "#166534"));
  y += 18;
  fields.push(textField("ipas", marginX, y, contentWidth, 60, 11));
  y += 64;

  fields.push(textField("commitTitle", marginX, y, contentWidth, 16, 13, "left", "#166534"));
  y += 18;
  fields.push(textField("commit", marginX, y, contentWidth, 40, 11));

  return fields;
}

export async function generatePlanPdfWithPdfme({
  yearly,
  calculations,
  memberId,
}: {
  yearly: YearlyGoals;
  calculations: Calculations;
  memberId: string;
}) {
  const schemas = makePlanSchemas();
  const annualVisionIncome =
    yearly.vision.dreamGoal ?? yearly.vision.totalIncomeGoal ?? null;
  const monthlyVisionIncome = annualVisionIncome ? annualVisionIncome / 12 : null;

  const planText: PlanInput = {
    title: "My 2026 Goal Plan",
    meta: `Member: ${memberId || "—"} | Signed: ${yearly.commitment.signatureName || "—"} | Word: ${yearly.vision.word || "—"}`,
    visionTitle: "Annual Vision",
    vision: yearly.vision.statement || "—",
    visionMoney: `Income: ${yearly.vision.dreamGoal ? formatCurrency(yearly.vision.dreamGoal, yearly.vision.currency) : "—"} | Min/Real/Dream: ${yearly.vision.minimumGoal || "—"} / ${yearly.vision.realisticGoal || "—"} / ${yearly.vision.dreamGoal || "—"} | Monthly: ${monthlyVisionIncome ? formatCurrency(monthlyVisionIncome, yearly.vision.currency) : "—"}`,
    motivationTitle: "Motivation",
    motivation: yearly.vision.motivation || "—",
    networkTitle: "Network Marketing",
    network: `Team: ${yearly.networkMarketing.currentTeamSize ?? "—"} -> ${yearly.networkMarketing.targetTeamSize ?? "—"} | Rank: ${yearly.networkMarketing.currentRank || "—"} -> ${yearly.networkMarketing.targetRank || "—"} | Pace: ${calculations.recruitmentPerMonth ?? "—"}/mo (${calculations.recruitmentPerWeek ?? "—"}/wk) | Income: ${yearly.networkMarketing.incomeGoal ? formatCurrency(yearly.networkMarketing.incomeGoal, "NGN") : "—"} | Why: ${yearly.networkMarketing.why || "—"}`,
    fiverrTitle: "Fiverr Freelancing",
    fiverr: `Skills: ${[yearly.fiverr.primarySkill, yearly.fiverr.secondarySkill].filter(Boolean).join(" / ") || "—"} | Income: ${
      yearly.fiverr.incomeGoal ? formatCurrency(yearly.fiverr.incomeGoal, yearly.fiverr.currency) : "—"
    } | Projects: ${calculations.fiverrProjectsNeeded ?? "—"} (per mo: ${calculations.fiverrProjectsPerMonth ?? "—"}) | Avg: ${
      calculations.fiverrAvgPerProject ? formatCurrency(calculations.fiverrAvgPerProject, yearly.fiverr.currency) : "—"
    } | Reviews: ${yearly.fiverr.reviewsGoal || "—"} (${calculations.reviewPerMonth ?? "—"}/mo) | Why: ${yearly.fiverr.why || "—"}`,
    personalTitle: "Personal Development",
    personal: `Goal: ${yearly.personalDev.goals || "—"} | Books: ${yearly.personalDev.books.filter(Boolean).join(", ") || "—"} | Courses: ${
      yearly.personalDev.courses || "—"
    } | Events: ${yearly.personalDev.events || "—"} | Why: ${yearly.personalDev.why || "—"} | Game plan: ${
      yearly.personalDev.gamePlan || "—"
    } | Habit lock: ${yearly.personalDev.habitPlan || "—"}`,
    ipasTitle: "Daily IPAs",
    ipas: `Activities: ${yearly.ipas.activities.filter(Boolean).join(" • ") || "—"} | Why: ${yearly.ipas.why || "—"} | Habit support: ${
      yearly.ipas.habitSupport || "—"
    }`,
    commitTitle: "Commitment",
    commit: `Review: ${yearly.commitment.reviewDay || "—"} | Partner: ${yearly.commitment.partner || "—"} | Agreed: ${
      yearly.commitment.agreed ? "Yes" : "No"
    }`,
  };

  const template = buildTemplate(schemas);
  const pdf = await generate({
    template,
    inputs: [planText],
    options: { font: fonts },
  });

  const blob = new Blob([pdf as unknown as BlobPart], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `Elivate-Plan-${yearly.commitment.signatureName || memberId || "Plan"}.pdf`;
  link.click();
  URL.revokeObjectURL(url);
}
