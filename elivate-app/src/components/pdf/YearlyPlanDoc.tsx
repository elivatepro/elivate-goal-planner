import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { Calculations, YearlyGoals } from "@/lib/types";
import { formatCurrency } from "@/lib/calculations";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#0f172a",
    lineHeight: 1.5,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    borderBottom: "2 solid #2A7D5F",
    paddingBottom: 12,
  },
  title: { fontSize: 20, fontWeight: "bold", color: "#2A7D5F" },
  meta: { fontSize: 9, color: "#64748b" },
  section: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#f8fafc",
    border: "1 solid #e2e8f0",
  },
  sectionTitle: { fontSize: 13, fontWeight: "bold", color: "#2A7D5F", marginBottom: 10 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    gap: 12,
  },
  label: {
    color: "#64748b",
    fontSize: 9,
    flex: 1,
  },
  value: {
    fontWeight: "bold",
    fontSize: 10,
    color: "#0f172a",
    flex: 1,
    textAlign: "right",
  },
  textBlock: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 12,
    border: "1 solid #e2e8f0",
    marginTop: 8,
  },
  textBlockLabel: {
    fontSize: 9,
    color: "#64748b",
    marginBottom: 6,
  },
  textBlockContent: {
    fontSize: 10,
    lineHeight: 1.6,
    color: "#0f172a",
  },
  list: { marginTop: 8, paddingLeft: 0 },
  listItem: {
    fontSize: 10,
    marginBottom: 4,
    lineHeight: 1.5,
  },
  twoCol: { flexDirection: "row", gap: 16, marginBottom: 16 },
  col: { flex: 1, minWidth: 0 },
});

type Props = {
  yearly: YearlyGoals;
  calculations: Calculations;
  memberId: string;
  signatureName?: string;
  year?: string;
};

const Row = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const TextBlock = ({ label, value }: { label: string; value?: string | null }) => (
  <View style={styles.textBlock}>
    <Text style={styles.textBlockLabel}>{label}</Text>
    <Text style={styles.textBlockContent}>{value || "—"}</Text>
  </View>
);

export function YearlyPlanDoc({
  yearly,
  calculations,
  memberId,
  signatureName,
  year = "2026",
}: Props) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Elivate Network</Text>
            <Text>Goal Plan {year}</Text>
          </View>
          <View style={{ alignItems: "flex-end", gap: 2 }}>
            <Text style={styles.meta}>Member ID: {memberId || "—"}</Text>
            {signatureName ? <Text style={styles.meta}>Signed: {signatureName}</Text> : null}
            <Text style={styles.meta}>Word: {yearly.vision.word || "—"}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Annual Vision</Text>
          <Text style={styles.textBlockContent}>{yearly.vision.statement || "—"}</Text>
          <Row
            label="Total Income Goal"
            value={
              yearly.vision.dreamGoal
                ? formatCurrency(yearly.vision.dreamGoal, yearly.vision.currency)
                : yearly.vision.totalIncomeGoal
                  ? formatCurrency(yearly.vision.totalIncomeGoal, yearly.vision.currency)
                  : "—"
            }
          />
          <Row
            label="Minimum / Realistic / Dream"
            value={[
              yearly.vision.minimumGoal
                ? formatCurrency(yearly.vision.minimumGoal, yearly.vision.currency)
                : "—",
              yearly.vision.realisticGoal
                ? formatCurrency(yearly.vision.realisticGoal, yearly.vision.currency)
                : "—",
              yearly.vision.dreamGoal
                ? formatCurrency(yearly.vision.dreamGoal, yearly.vision.currency)
                : "—",
            ].join(" | ")}
          />
          <Row
            label="Monthly Target"
            value={
              calculations.nmMonthlyIncome
                ? formatCurrency(calculations.nmMonthlyIncome, yearly.vision.currency)
                : "—"
            }
          />
          <Row
            label="Weekly Target"
            value={
              calculations.nmWeeklyIncome
                ? formatCurrency(calculations.nmWeeklyIncome, yearly.vision.currency)
                : "—"
            }
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Motivation</Text>
          <Text style={styles.textBlockContent}>{yearly.vision.motivation || "—"}</Text>
        </View>

        <View style={styles.twoCol}>
          <View style={[styles.section, styles.col]}>
            <Text style={styles.sectionTitle}>Network Marketing</Text>
            <Row
              label="Team Size"
              value={`${yearly.networkMarketing.currentTeamSize ?? 0} → ${yearly.networkMarketing.targetTeamSize ?? 0}`}
            />
            <Row
              label="Rank"
              value={`${yearly.networkMarketing.currentRank || "Current"} → ${yearly.networkMarketing.targetRank || "Target"}`}
            />
            <Row
              label="Recruitment Pace"
              value={
                calculations.recruitmentPerMonth
                  ? `${calculations.recruitmentPerMonth} / month (${calculations.recruitmentPerWeek} / week)`
                  : "Add targets"
              }
            />
            <Row
              label="Income Goal"
              value={
                yearly.networkMarketing.incomeGoal
                  ? formatCurrency(yearly.networkMarketing.incomeGoal, "NGN")
                  : "—"
              }
            />
            <TextBlock label="Why" value={yearly.networkMarketing.why} />
            <Text style={[styles.textBlockLabel, { marginTop: 12 }]}>Quarterly Ranks</Text>
            <View style={styles.list}>
              {yearly.networkMarketing.quarterlyRanks.map((rank, index) => (
                <Text key={index} style={styles.listItem}>
                  Q{index + 1}: {rank || "—"}
                </Text>
              ))}
            </View>
          </View>

          <View style={[styles.section, styles.col]}>
            <Text style={styles.sectionTitle}>Fiverr Freelancing</Text>
            <Row
              label="Skills"
              value={[yearly.fiverr.primarySkill, yearly.fiverr.secondarySkill].filter(Boolean).join(" / ") || "—"}
            />
            <Row
              label="Income Goal"
              value={
                yearly.fiverr.incomeGoal
                  ? formatCurrency(yearly.fiverr.incomeGoal, yearly.fiverr.currency)
                  : "—"
              }
            />
            <Row
              label="Projects Pace"
              value={
                calculations.fiverrProjectsPerMonth
                  ? `${Math.ceil(calculations.fiverrProjectsPerMonth ?? 0)} / month`
                  : "Add goal + projects"
              }
            />
            <Row
              label="Avg per Project"
              value={
                calculations.fiverrAvgPerProject
                  ? formatCurrency(calculations.fiverrAvgPerProject, yearly.fiverr.currency)
                  : "—"
              }
            />
            <Row
              label="5-Star Reviews"
              value={
                yearly.fiverr.reviewsGoal
                  ? `${yearly.fiverr.reviewsGoal} (${Math.ceil(calculations.reviewPerMonth ?? 0)} / month)`
                  : "—"
              }
            />
            <TextBlock label="Why" value={yearly.fiverr.why} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Development</Text>
          <TextBlock label="Goal" value={yearly.personalDev.goals} />
          <Text style={[styles.textBlockLabel, { marginTop: 12 }]}>Books</Text>
          <View style={styles.list}>
            {yearly.personalDev.books.filter(Boolean).length ? (
              yearly.personalDev.books.filter(Boolean).map((book, index) => (
                <View key={index} style={{ flexDirection: "row", gap: 4 }}>
                  <Text style={styles.listItem}>•</Text>
                  <Text style={[styles.listItem, { flex: 1 }]}>{book}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.listItem}>—</Text>
            )}
          </View>
          <Row label="Courses/Training" value={yearly.personalDev.courses || "—"} />
          <Row label="Events/Conferences" value={yearly.personalDev.events || "—"} />
          <TextBlock label="Why" value={yearly.personalDev.why} />
          <TextBlock label="Game plan activities" value={yearly.personalDev.gamePlan} />
          <TextBlock label="Habit lock" value={yearly.personalDev.habitPlan} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily IPAs</Text>
          <View style={styles.list}>
            {yearly.ipas.activities.filter(Boolean).length ? (
              yearly.ipas.activities.filter(Boolean).map((ipa, index) => (
                <View key={index} style={{ flexDirection: "row", gap: 4 }}>
                  <Text style={styles.listItem}>•</Text>
                  <Text style={[styles.listItem, { flex: 1 }]}>{ipa}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.listItem}>—</Text>
            )}
          </View>
          <TextBlock label="Why" value={yearly.ipas.why} />
          <TextBlock label="Habit support" value={yearly.ipas.habitSupport} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Commitment</Text>
          <Row label="Review Day" value={yearly.commitment.reviewDay || "—"} />
          <Row label="Accountability Partner" value={yearly.commitment.partner || "—"} />
          <Row label="Agreed to review monthly" value={yearly.commitment.agreed ? "Yes" : "No"} />
        </View>
      </Page>
    </Document>
  );
}
