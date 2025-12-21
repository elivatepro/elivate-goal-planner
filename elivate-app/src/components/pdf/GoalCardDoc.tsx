import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { YearlyGoals, Calculations } from "@/lib/types";
import { formatCurrency } from "@/lib/calculations";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
    color: "#0f172a",
    lineHeight: 1.4,
  },
  header: { alignItems: "center", marginBottom: 24 },
  title: { fontSize: 24, fontWeight: "bold", color: "#2A7D5F", marginTop: 8 },
  tagline: { fontSize: 9, letterSpacing: 2, color: "#64748b", textTransform: "uppercase" },
  topMeta: { fontSize: 9, color: "#64748b", marginTop: 4 },
  visionBox: {
    border: "1 solid #E2E8F0",
    borderRadius: 12,
    padding: 16,
    backgroundColor: "#F8FAFC",
    marginTop: 8,
    marginBottom: 24,
  },
  visionText: {
    fontSize: 11,
    lineHeight: 1.6,
    color: "#0f172a",
    textAlign: "left",
  },
  panelRow: { flexDirection: "row", gap: 16, marginBottom: 16 },
  panel: {
    border: "1.5 solid #2A7D5F",
    borderRadius: 12,
    padding: 16,
    flex: 1,
    backgroundColor: "#f7fdf9",
  },
  panelTitle: { fontSize: 14, fontWeight: "bold", color: "#2A7D5F", marginBottom: 12 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8, gap: 8 },
  label: {
    fontSize: 10,
    color: "#64748b",
    flex: 1,
  },
  value: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#0f172a",
    flex: 1,
    textAlign: "right",
  },
  list: {
    marginTop: 8,
    flexDirection: "column",
    gap: 6,
  },
  bullet: {
    fontSize: 10,
    lineHeight: 1.5,
    color: "#0f172a",
  },
  footer: {
    marginTop: 24,
    paddingTop: 16,
    borderTop: "1 solid #E2E8F0",
    alignItems: "center",
    gap: 4,
  },
});

type Props = {
  yearly: YearlyGoals;
  calculations: Calculations;
  memberId: string;
  signatureName?: string;
};

const Row = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

export function GoalCardDoc({ yearly, calculations, memberId, signatureName }: Props) {
  const ipaList = yearly.ipas.activities.filter(Boolean).slice(0, 10);
  const nameLine = signatureName ? `${signatureName}` : "";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.tagline}>ELIVATE NETWORK</Text>
          <Text style={styles.title}>My 2026 Vision</Text>
          <Text style={styles.topMeta}>
            Member: {memberId || "—"} {nameLine ? `| Signed: ${nameLine}` : ""}
          </Text>
          <Text style={styles.topMeta}>Word of the Year: {yearly.vision.word || "—"}</Text>
          <View style={styles.visionBox}>
            <Text style={styles.visionText}>
              {yearly.vision.statement || "Write your vision here."}
            </Text>
          </View>
        </View>

        <View style={styles.panelRow}>
          <View style={styles.panel}>
            <Text style={styles.panelTitle}>Network Marketing</Text>
            <Row
              label="Team"
              value={`${yearly.networkMarketing.currentTeamSize ?? 0} → ${yearly.networkMarketing.targetTeamSize ?? 0}`}
            />
            <Row
              label="Rank"
              value={`${yearly.networkMarketing.currentRank || "—"} → ${yearly.networkMarketing.targetRank || "—"}`}
            />
            <Row
              label="Income"
              value={
                yearly.networkMarketing.incomeGoal
                  ? formatCurrency(yearly.networkMarketing.incomeGoal, "NGN")
                  : "—"
              }
            />
          </View>

          <View style={styles.panel}>
            <Text style={styles.panelTitle}>Fiverr Freelancing</Text>
            <Row
              label="Projects"
              value={
                calculations.fiverrProjectsNeeded
                  ? `${Math.ceil(calculations.fiverrProjectsNeeded)}`
                  : "—"
              }
            />
            <Row
              label="Income"
              value={
                yearly.fiverr.incomeGoal
                  ? formatCurrency(yearly.fiverr.incomeGoal, yearly.fiverr.currency)
                  : "—"
              }
            />
            <Row label="Level" value={yearly.fiverr.targetLevel || "—"} />
          </View>
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>My Daily IPAs</Text>
          <View style={styles.list}>
            {ipaList.length ? (
              ipaList.map((item, index) => (
                <View key={index} style={{ flexDirection: "row", gap: 4 }}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={[styles.bullet, { flex: 1 }]}>{item}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.label}>Add your non-negotiables.</Text>
            )}
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.label}></Text>
        </View>
      </Page>
    </Document>
  );
}
