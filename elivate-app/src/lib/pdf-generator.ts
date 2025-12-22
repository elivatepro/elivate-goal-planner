import { pdf } from "@react-pdf/renderer";
import type { ReactElement } from "react";
import type { Calculations, YearlyGoals, MonthlyGoals } from "./types";

/**
 * Generate PDF blob from a react-pdf Document component
 */
async function generatePDFBlob(documentComponent: ReactElement): Promise<Blob> {
  return await pdf(documentComponent as any).toBlob();
}

/**
 * Generate and download a PDF from a react-pdf Document component
 */
async function generateAndDownloadPDF(
  documentComponent: ReactElement,
  filename: string
) {
  try {
    // Generate the PDF blob
    const blob = await generatePDFBlob(documentComponent);

    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();

    // Cleanup
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("PDF generation failed:", error);
    throw new Error("Failed to generate PDF. Please try again.");
  }
}

/**
 * Generate a preview URL for a PDF document
 */
async function generatePDFPreview(documentComponent: ReactElement): Promise<string> {
  try {
    const blob = await generatePDFBlob(documentComponent);
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error("PDF preview generation failed:", error);
    throw new Error("Failed to generate PDF preview. Please try again.");
  }
}

/**
 * Generate Yearly Plan PDF
 */
export async function generateYearlyPlanPDF({
  yearly,
  calculations,
  memberId,
  signatureName,
  year = "2026",
  teamName = "Elivate Network",
}: {
  yearly: YearlyGoals;
  calculations: Calculations;
  memberId: string;
  signatureName?: string;
  year?: string;
  teamName?: string;
}) {
  // Dynamic import to avoid SSR issues
  const { YearlyPlanPDF } = await import("@/components/pdf/YearlyPlanPDF");
  const { createElement } = await import("react");

  const safeName = (signatureName || memberId || "Plan").replace(/[^a-zA-Z0-9]/g, "-");
  const safeTeamName = teamName.replace(/[^a-zA-Z0-9]/g, "-");
  const filename = `${safeTeamName}-Yearly-Plan-${safeName}.pdf`;
  const document = createElement(YearlyPlanPDF, {
    yearly,
    calculations,
    memberId,
    signatureName,
    year,
    teamName,
  });

  await generateAndDownloadPDF(document, filename);
}

/**
 * Generate Monthly Plan PDF
 */
export async function generateMonthlyPlanPDF({
  monthly,
  calculations,
  memberId,
  teamName = "Elivate Network",
}: {
  monthly: MonthlyGoals;
  calculations: Calculations;
  memberId: string;
  teamName?: string;
}) {
  // Dynamic import to avoid SSR issues
  const { MonthlyPlanPDF } = await import("@/components/pdf/MonthlyPlanPDF");
  const { createElement } = await import("react");

  const safeName = `${monthly.month || "Month"}-${memberId || "Plan"}`.replace(/[^a-zA-Z0-9]/g, "-");
  const safeTeamName = teamName.replace(/[^a-zA-Z0-9]/g, "-");
  const filename = `${safeTeamName}-Monthly-Plan-${safeName}.pdf`;
  const document = createElement(MonthlyPlanPDF, {
    monthly,
    calculations,
    memberId,
    teamName,
  });

  await generateAndDownloadPDF(document, filename);
}

/**
 * Generate Goal Card PDF
 */
export async function generateGoalCardPDF({
  yearly,
  calculations,
  memberId,
  signatureName,
  teamName = "Elivate Network",
}: {
  yearly: YearlyGoals;
  calculations: Calculations;
  memberId: string;
  signatureName?: string;
  teamName?: string;
}) {
  // Dynamic import to avoid SSR issues
  const { GoalCardPDF } = await import("@/components/pdf/GoalCardPDF");
  const { createElement } = await import("react");

  const safeName = (signatureName || memberId || "Card").replace(/[^a-zA-Z0-9]/g, "-");
  const safeTeamName = teamName.replace(/[^a-zA-Z0-9]/g, "-");
  const filename = `${safeTeamName}-Goal-Card-${safeName}.pdf`;
  const document = createElement(GoalCardPDF, {
    yearly,
    calculations,
    memberId,
    signatureName,
    teamName,
  });

  await generateAndDownloadPDF(document, filename);
}

/**
 * Generate Yearly Plan PDF Preview URL
 */
export async function generateYearlyPlanPreview({
  yearly,
  calculations,
  memberId,
  signatureName,
  year = "2026",
  teamName = "Elivate Network",
}: {
  yearly: YearlyGoals;
  calculations: Calculations;
  memberId: string;
  signatureName?: string;
  year?: string;
  teamName?: string;
}): Promise<string> {
  const { YearlyPlanPDF } = await import("@/components/pdf/YearlyPlanPDF");
  const { createElement } = await import("react");

  const document = createElement(YearlyPlanPDF, {
    yearly,
    calculations,
    memberId,
    signatureName,
    year,
    teamName,
  });

  return await generatePDFPreview(document);
}

/**
 * Generate Monthly Plan PDF Preview URL
 */
export async function generateMonthlyPlanPreview({
  monthly,
  calculations,
  memberId,
  teamName = "Elivate Network",
}: {
  monthly: MonthlyGoals;
  calculations: Calculations;
  memberId: string;
  teamName?: string;
}): Promise<string> {
  const { MonthlyPlanPDF } = await import("@/components/pdf/MonthlyPlanPDF");
  const { createElement } = await import("react");

  const document = createElement(MonthlyPlanPDF, {
    monthly,
    calculations,
    memberId,
    teamName,
  });

  return await generatePDFPreview(document);
}

/**
 * Generate Goal Card PDF Preview URL
 */
export async function generateGoalCardPreview({
  yearly,
  calculations,
  memberId,
  signatureName,
  teamName = "Elivate Network",
}: {
  yearly: YearlyGoals;
  calculations: Calculations;
  memberId: string;
  signatureName?: string;
  teamName?: string;
}): Promise<string> {
  const { GoalCardPDF } = await import("@/components/pdf/GoalCardPDF");
  const { createElement } = await import("react");

  const document = createElement(GoalCardPDF, {
    yearly,
    calculations,
    memberId,
    signatureName,
    teamName,
  });

  return await generatePDFPreview(document);
}
