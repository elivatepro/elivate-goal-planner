import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { YearlyGoals, Calculations } from "@/lib/types";
import { Currency } from "@/lib/types";

type Props = {
  yearly: YearlyGoals;
  calculations: Calculations;
  memberId: string;
  signatureName?: string;
  teamName?: string;
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
    alignItems: "center",
    marginBottom: 24,
  },
  headerLabel: {
    fontSize: 8,
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#15803d",
    marginBottom: 6,
  },
  headerMeta: {
    fontSize: 9,
    color: "#475569",
    marginBottom: 2,
  },
  wordOfYear: {
    fontSize: 9,
    color: "#475569",
    marginTop: 3,
  },
  wordValue: {
    fontWeight: "bold",
  },
  visionBox: {
    marginBottom: 24,
    padding: 14,
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  visionText: {
    fontSize: 10,
    lineHeight: 1.5,
  },
  twoColumns: {
    flexDirection: "row",
    gap: 14,
    marginBottom: 24,
  },
  goalCard: {
    flex: 1,
    padding: 14,
    backgroundColor: "#f0fdf4",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#15803d",
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#15803d",
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
  },
  ipaBox: {
    padding: 14,
    backgroundColor: "#f0fdf4",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#15803d",
  },
  ipaTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#15803d",
    marginBottom: 10,
  },
  ipaItem: {
    fontSize: 10,
    marginBottom: 6,
    lineHeight: 1.4,
  },
  ipaPlaceholder: {
    fontSize: 9,
    color: "#6b7280",
  },
  footer: {
    marginTop: 24,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    alignItems: "center",
  },
  footerText: {
    fontSize: 9,
    color: "#9ca3af",
  },
});

export function GoalCardPDF({ yearly, calculations, memberId, signatureName, teamName = "ELIVATE NETWORK" }: Props) {
  const ipaList = yearly.ipas.activities.filter(Boolean).slice(0, 10);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerLabel}>{teamName.toUpperCase()}</Text>
          <Text style={styles.headerTitle}>My 2026 Vision</Text>
          <Text style={styles.headerMeta}>
            Member: {memberId || "—"} {signatureName ? `| Signed: ${signatureName}` : ""}
          </Text>
          <Text style={styles.wordOfYear}>
            Word of the Year: <Text style={styles.wordValue}>{yearly.vision.word || "—"}</Text>
          </Text>
        </View>

        {/* Vision Statement */}
        <View style={styles.visionBox}>
          <Text style={styles.visionText}>
            {yearly.vision.statement || "Write your vision here."}
          </Text>
        </View>

        {/* Two Columns: Network Marketing & Fiverr */}
        <View style={styles.twoColumns}>
          {/* Network Marketing */}
          <View style={styles.goalCard}>
            <Text style={styles.cardTitle}>Network Marketing</Text>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Team</Text>
              <Text style={styles.rowValue}>
                {yearly.networkMarketing.currentTeamSize ?? 0} {"->"} {yearly.networkMarketing.targetTeamSize ?? 0}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Rank</Text>
              <Text style={styles.rowValue}>
                {yearly.networkMarketing.currentRank || "—"} {"->"} {yearly.networkMarketing.targetRank || "—"}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Income</Text>
              <Text style={styles.rowValue}>
                {formatCurrencyForPDF(yearly.networkMarketing.incomeGoal, "NGN")}
              </Text>
            </View>
          </View>

          {/* Fiverr Freelancing */}
          <View style={styles.goalCard}>
            <Text style={styles.cardTitle}>Fiverr Freelancing</Text>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Projects</Text>
              <Text style={styles.rowValue}>
                {calculations.fiverrProjectsNeeded
                  ? `${Math.ceil(calculations.fiverrProjectsNeeded)}`
                  : "—"}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Income</Text>
              <Text style={styles.rowValue}>
                {formatCurrencyForPDF(yearly.fiverr.incomeGoal, yearly.fiverr.currency)}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Level</Text>
              <Text style={styles.rowValue}>{yearly.fiverr.targetLevel || "—"}</Text>
            </View>
          </View>
        </View>

        {/* Daily IPAs */}
        <View style={styles.ipaBox}>
          <Text style={styles.ipaTitle}>My Daily IPAs</Text>
          <View>
            {ipaList.length ? (
              ipaList.map((item, index) => (
                <Text key={index} style={styles.ipaItem}>
                  {"\u2022"} {item}
                </Text>
              ))
            ) : (
              <Text style={styles.ipaPlaceholder}>Add your non-negotiables.</Text>
            )}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>&nbsp;</Text>
        </View>
      </Page>
    </Document>
  );
}
