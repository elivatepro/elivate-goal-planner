import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { Calculations, MonthlyGoals, Currency } from "@/lib/types";

type Props = {
  monthly: MonthlyGoals;
  calculations: Calculations;
  memberId: string;
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
  whiteBox: {
    backgroundColor: "#ffffff",
    borderRadius: 6,
    padding: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginTop: 8,
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
});

export function MonthlyPlanPDF({ monthly, calculations, memberId, teamName = "Elivate Network" }: Props) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>{teamName}</Text>
            <Text style={styles.headerSubtitle}>Monthly Goal Plan</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.headerRightText}>Member ID: {memberId || "—"}</Text>
            <Text style={styles.headerRightText}>{monthly.month || "Month"}</Text>
          </View>
        </View>

        {/* Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Month</Text>
            <Text style={styles.rowValue}>{monthly.month || "—"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Theme / Focus</Text>
            <Text style={styles.rowValue}>{monthly.focus || "—"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Priorities</Text>
            <Text style={styles.rowValue}>
              {monthly.priorities.filter(Boolean).join(" • ") || "—"}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>End Vision</Text>
            <Text style={styles.rowValue}>{monthly.endVision || "—"}</Text>
          </View>
        </View>

        {/* Network Marketing */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Network Marketing</Text>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Recruitment Target</Text>
            <Text style={styles.rowValue}>
              {monthly.nmRecruitment
                ? `${monthly.nmRecruitment} (${(calculations.recruitmentPerWeek ?? 0).toFixed(1)} / week)`
                : "—"}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Income Target</Text>
            <Text style={styles.rowValue}>
              {formatCurrencyForPDF(monthly.nmIncome, "NGN")}
            </Text>
          </View>
          <View style={styles.whiteBox}>
            <Text style={styles.whiteBoxLabel}>Why</Text>
            <Text style={styles.whiteBoxText}>{monthly.nmWhy || "—"}</Text>
          </View>
        </View>

        {/* Fiverr Freelancing */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fiverr Freelancing</Text>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Projects</Text>
            <Text style={styles.rowValue}>
              {monthly.fiverrProjects ? `${monthly.fiverrProjects} projects` : "—"}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Income Target</Text>
            <Text style={styles.rowValue}>
              {formatCurrencyForPDF(monthly.fiverrIncome, "USD")}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Avg per Project</Text>
            <Text style={styles.rowValue}>
              {formatCurrencyForPDF(calculations.fiverrAvgPerProject, "USD")}
            </Text>
          </View>
          <View style={styles.whiteBox}>
            <Text style={styles.whiteBoxLabel}>Why</Text>
            <Text style={styles.whiteBoxText}>{monthly.fiverrWhy || "—"}</Text>
          </View>
        </View>

        {/* Daily IPAs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily IPAs</Text>
          <View>
            {monthly.ipas.filter(Boolean).length ? (
              monthly.ipas
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
        </View>
      </Page>
    </Document>
  );
}
