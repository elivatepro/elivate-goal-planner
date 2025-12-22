import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { Calculations, YearlyGoals, Currency } from "@/lib/types";

type Props = {
  yearly: YearlyGoals;
  calculations: Calculations;
  memberId: string;
  signatureName?: string;
  year?: string;
};

// PDF-safe currency formatter (avoids special symbols not in Lexend font)
function formatCurrencyForPDF(amount: number | null | undefined, currency: Currency) {
  if (amount === null || amount === undefined || Number.isNaN(amount)) return "—";
  const formatted = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(amount);
  return currency === "NGN" ? `NGN ${formatted}` : `$${formatted}`;
}

// Register Lexend font from CDN
Font.register({
  family: 'Lexend',
  fonts: [
    {
      src: 'https://cdn.jsdelivr.net/npm/@fontsource/lexend@5.0.0/files/lexend-latin-400-normal.woff',
      fontWeight: 400,
    },
    {
      src: 'https://cdn.jsdelivr.net/npm/@fontsource/lexend@5.0.0/files/lexend-latin-600-normal.woff',
      fontWeight: 600,
    },
    {
      src: 'https://cdn.jsdelivr.net/npm/@fontsource/lexend@5.0.0/files/lexend-latin-700-normal.woff',
      fontWeight: 700,
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Lexend",
    fontSize: 11,
    color: "#0f172a",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingBottom: 12,
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#15803d",
  },
  headerLeft: {
    flexDirection: "column",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#15803d",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 10,
    color: "#475569",
  },
  headerRight: {
    flexDirection: "column",
    alignItems: "flex-end",
    fontSize: 9,
    color: "#475569",
  },
  headerRightText: {
    marginBottom: 2,
  },
  section: {
    marginBottom: 16,
    padding: 14,
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#15803d",
    marginBottom: 10,
  },
  sectionText: {
    fontSize: 10,
    lineHeight: 1.5,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
    fontSize: 9,
  },
  rowLabel: {
    color: "#475569",
  },
  rowValue: {
    fontWeight: "bold",
    textAlign: "right",
    maxWidth: "60%",
  },
  twoColumns: {
    flexDirection: "row",
    gap: 14,
    marginBottom: 16,
  },
  column: {
    flex: 1,
    padding: 14,
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  whiteBox: {
    backgroundColor: "#ffffff",
    borderRadius: 6,
    padding: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 10,
  },
  whiteBoxLabel: {
    fontSize: 9,
    color: "#475569",
    marginBottom: 4,
  },
  whiteBoxText: {
    fontSize: 10,
    lineHeight: 1.5,
  },
  listItem: {
    fontSize: 10,
    marginBottom: 3,
    lineHeight: 1.4,
  },
  quarterlyRanks: {
    marginTop: 8,
  },
  quarterlyRankLabel: {
    fontSize: 9,
    color: "#475569",
    marginBottom: 6,
  },
});

export function YearlyPlanPDF({
  yearly,
  calculations,
  memberId,
  signatureName,
  year = "2026",
}: Props) {
  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        {/* Header */}
        <View style={styles.header} fixed>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Elivate Network</Text>
            <Text style={styles.headerSubtitle}>Goal Plan {year}</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.headerRightText}>Member ID: {memberId || "—"}</Text>
            {signatureName && <Text style={styles.headerRightText}>Signed: {signatureName}</Text>}
            <Text style={styles.headerRightText}>Word: {yearly.vision.word || "—"}</Text>
          </View>
        </View>

        {/* Annual Vision */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Annual Vision</Text>
          <Text style={styles.sectionText}>{yearly.vision.statement || "—"}</Text>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Total Income Goal</Text>
            <Text style={styles.rowValue}>
              {yearly.vision.dreamGoal
                ? formatCurrencyForPDF(yearly.vision.dreamGoal, yearly.vision.currency)
                : formatCurrencyForPDF(yearly.vision.totalIncomeGoal, yearly.vision.currency)}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Minimum / Realistic / Dream</Text>
            <Text style={styles.rowValue}>
              {[
                formatCurrencyForPDF(yearly.vision.minimumGoal, yearly.vision.currency),
                formatCurrencyForPDF(yearly.vision.realisticGoal, yearly.vision.currency),
                formatCurrencyForPDF(yearly.vision.dreamGoal, yearly.vision.currency),
              ].join(" | ")}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Monthly Target</Text>
            <Text style={styles.rowValue}>
              {formatCurrencyForPDF(calculations.nmMonthlyIncome, yearly.vision.currency)}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Weekly Target</Text>
            <Text style={styles.rowValue}>
              {formatCurrencyForPDF(calculations.nmWeeklyIncome, yearly.vision.currency)}
            </Text>
          </View>
        </View>

        {/* Motivation */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Motivation</Text>
          <Text style={styles.sectionText}>{yearly.vision.motivation || "—"}</Text>
        </View>

        {/* Network Marketing & Fiverr - Two Columns */}
        <View style={styles.twoColumns}>
          {/* Network Marketing */}
          <View style={styles.column}>
            <Text style={styles.sectionTitle}>Network Marketing</Text>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Team Size</Text>
              <Text style={styles.rowValue}>
                {yearly.networkMarketing.currentTeamSize ?? 0} {"->"} {yearly.networkMarketing.targetTeamSize ?? 0}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Rank</Text>
              <Text style={styles.rowValue}>
                {yearly.networkMarketing.currentRank || "Current"} {"->"} {yearly.networkMarketing.targetRank || "Target"}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Recruitment Pace</Text>
              <Text style={styles.rowValue}>
                {calculations.recruitmentPerMonth
                  ? `${calculations.recruitmentPerMonth}/mo (${calculations.recruitmentPerWeek}/wk)`
                  : "Add targets"}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Income Goal</Text>
              <Text style={styles.rowValue}>
                {formatCurrencyForPDF(yearly.networkMarketing.incomeGoal, "NGN")}
              </Text>
            </View>
            <View style={styles.whiteBox}>
              <Text style={styles.whiteBoxLabel}>Why</Text>
              <Text style={styles.whiteBoxText}>{yearly.networkMarketing.why || "—"}</Text>
            </View>
            <View style={styles.quarterlyRanks}>
              <Text style={styles.quarterlyRankLabel}>Quarterly Ranks</Text>
              {yearly.networkMarketing.quarterlyRanks.map((rank, index) => (
                <Text key={index} style={styles.listItem}>
                  Q{index + 1}: {rank || "—"}
                </Text>
              ))}
            </View>
          </View>

          {/* Fiverr Freelancing */}
          <View style={styles.column}>
            <Text style={styles.sectionTitle}>Fiverr Freelancing</Text>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Skills</Text>
              <Text style={styles.rowValue}>
                {[yearly.fiverr.primarySkill, yearly.fiverr.secondarySkill].filter(Boolean).join(" / ") ||
                  "—"}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Income Goal</Text>
              <Text style={styles.rowValue}>
                {formatCurrencyForPDF(yearly.fiverr.incomeGoal, yearly.fiverr.currency)}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Projects Pace</Text>
              <Text style={styles.rowValue}>
                {calculations.fiverrProjectsPerMonth
                  ? `${Math.ceil(calculations.fiverrProjectsPerMonth)}/month`
                  : "Add goal"}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Avg per Project</Text>
              <Text style={styles.rowValue}>
                {formatCurrencyForPDF(calculations.fiverrAvgPerProject, yearly.fiverr.currency)}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>5-Star Reviews</Text>
              <Text style={styles.rowValue}>
                {yearly.fiverr.reviewsGoal
                  ? `${yearly.fiverr.reviewsGoal} (${Math.ceil(calculations.reviewPerMonth ?? 0)}/mo)`
                  : "—"}
              </Text>
            </View>
            <View style={styles.whiteBox}>
              <Text style={styles.whiteBoxLabel}>Why</Text>
              <Text style={styles.whiteBoxText}>{yearly.fiverr.why || "—"}</Text>
            </View>
          </View>
        </View>

        {/* Personal Development */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Development</Text>
          <View style={styles.whiteBox}>
            <Text style={styles.whiteBoxLabel}>Goal</Text>
            <Text style={styles.whiteBoxText}>{yearly.personalDev.goals || "—"}</Text>
          </View>
          <Text style={styles.quarterlyRankLabel}>Books</Text>
          <View style={{ marginBottom: 10 }}>
            {yearly.personalDev.books.filter(Boolean).length ? (
              yearly.personalDev.books
                .filter(Boolean)
                .map((book, index) => (
                  <Text key={index} style={styles.listItem}>
                    {"\u2022"} {book}
                  </Text>
                ))
            ) : (
              <Text style={styles.listItem}>—</Text>
            )}
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Courses/Training</Text>
            <Text style={styles.rowValue}>{yearly.personalDev.courses || "—"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Events/Conferences</Text>
            <Text style={styles.rowValue}>{yearly.personalDev.events || "—"}</Text>
          </View>
          <View style={styles.whiteBox}>
            <Text style={styles.whiteBoxLabel}>Why</Text>
            <Text style={styles.whiteBoxText}>{yearly.personalDev.why || "—"}</Text>
          </View>
          <View style={styles.whiteBox}>
            <Text style={styles.whiteBoxLabel}>Game plan activities</Text>
            <Text style={styles.whiteBoxText}>{yearly.personalDev.gamePlan || "—"}</Text>
          </View>
          <View style={styles.whiteBox}>
            <Text style={styles.whiteBoxLabel}>Habit lock</Text>
            <Text style={styles.whiteBoxText}>{yearly.personalDev.habitPlan || "—"}</Text>
          </View>
        </View>

        {/* Daily IPAs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily IPAs</Text>
          <View style={{ marginBottom: 10 }}>
            {yearly.ipas.activities.filter(Boolean).length ? (
              yearly.ipas.activities
                .filter(Boolean)
                .map((ipa, index) => (
                  <Text key={index} style={styles.listItem}>
                    {"\u2022"} {ipa}
                  </Text>
                ))
            ) : (
              <Text style={styles.listItem}>—</Text>
            )}
          </View>
          <View style={styles.whiteBox}>
            <Text style={styles.whiteBoxLabel}>Why</Text>
            <Text style={styles.whiteBoxText}>{yearly.ipas.why || "—"}</Text>
          </View>
          <View style={styles.whiteBox}>
            <Text style={styles.whiteBoxLabel}>Habit support</Text>
            <Text style={styles.whiteBoxText}>{yearly.ipas.habitSupport || "—"}</Text>
          </View>
        </View>

        {/* Commitment */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Commitment</Text>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Review Day</Text>
            <Text style={styles.rowValue}>{yearly.commitment.reviewDay || "—"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Accountability Partner</Text>
            <Text style={styles.rowValue}>{yearly.commitment.partner || "—"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Agreed to review monthly</Text>
            <Text style={styles.rowValue}>{yearly.commitment.agreed ? "Yes" : "No"}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
