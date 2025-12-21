import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { Calculations, MonthlyGoals } from "@/lib/types";
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
    border: "1 solid #E5E7EB",
    borderRadius: 12,
    backgroundColor: "#f8fafc",
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
  list: { marginTop: 8, paddingLeft: 0 },
  listItem: {
    fontSize: 10,
    marginBottom: 4,
    lineHeight: 1.5,
  },
});

type Props = {
  monthly: MonthlyGoals;
  calculations: Calculations;
  memberId: string;
};

const Row = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

export function MonthlyPlanDoc({ monthly, calculations, memberId }: Props) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Elivate Network</Text>
            <Text style={styles.meta}>Monthly Goal Plan</Text>
          </View>
          <View style={{ alignItems: "flex-end", gap: 2 }}>
            <Text style={styles.meta}>Member ID: {memberId || "—"}</Text>
            <Text style={styles.meta}>{monthly.month || "Month"}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <Row label="Month" value={monthly.month || "—"} />
          <Row label="Theme / Focus" value={monthly.focus || "—"} />
          <Row
            label="Priorities"
            value={monthly.priorities.filter(Boolean).join(" • ") || "—"}
          />
          <Row label="End Vision" value={monthly.endVision || "—"} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Network Marketing</Text>
          <Row
            label="Recruitment Target"
            value={
              monthly.nmRecruitment
                ? `${monthly.nmRecruitment} (${(calculations.recruitmentPerWeek ?? 0).toFixed(1)} / week)`
                : "—"
            }
          />
          <Row
            label="Income Target"
            value={
              monthly.nmIncome ? formatCurrency(monthly.nmIncome, "NGN") : "—"
            }
          />
          <Row label="Why" value={monthly.nmWhy || "—"} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fiverr</Text>
          <Row
            label="Projects"
            value={
              monthly.fiverrProjects
                ? `${monthly.fiverrProjects} projects`
                : "—"
            }
          />
          <Row
            label="Income Target"
            value={
              monthly.fiverrIncome
                ? formatCurrency(monthly.fiverrIncome, "USD")
                : "—"
            }
          />
          <Row
            label="Avg per Project"
            value={
              calculations.fiverrAvgPerProject
                ? formatCurrency(calculations.fiverrAvgPerProject, "USD")
                : "—"
            }
          />
          <Row label="Why" value={monthly.fiverrWhy || "—"} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily IPAs</Text>
          <View style={styles.list}>
            {monthly.ipas.filter(Boolean).length ? (
              monthly.ipas.filter(Boolean).map((ipa, index) => (
                <View key={index} style={{ flexDirection: "row", gap: 4 }}>
                  <Text style={styles.listItem}>•</Text>
                  <Text style={[styles.listItem, { flex: 1 }]}>{ipa}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.listItem}>—</Text>
            )}
          </View>
        </View>
      </Page>
    </Document>
  );
}
