// Web stub for the native map component. Renders a simple list-style fallback.
import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { colors, categories, urgencyMeta, shadow, spacing } from "@/src/theme";

export default function WebReportsMap({
  reports,
  userLoc,
  onMarkerPress,
}: {
  reports: any[];
  userLoc: { lat: number; lng: number } | null;
  onMarkerPress: (id: string) => void;
}) {
  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: "#DCFCE7" }]} testID="web-map-fallback">
      <View style={styles.grid}>
        {[...Array(20)].map((_, i) => (
          <View key={i} style={[styles.gridLine, { top: `${i * 5}%` }]} />
        ))}
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.heroChip}>
          <Feather name="map-pin" size={16} color={colors.primaryDark} />
          <Text style={styles.heroText}>Live map available on iOS / Android. List preview here.</Text>
        </View>
        {userLoc && (
          <View style={styles.userCard}>
            <Text style={{ fontWeight: "800" }}>📍 You: {userLoc.lat.toFixed(3)}, {userLoc.lng.toFixed(3)}</Text>
          </View>
        )}
        {reports.map((r) => (
          <TouchableOpacity
            key={r.report_id}
            testID={`web-report-${r.report_id}`}
            style={styles.card}
            onPress={() => onMarkerPress(r.report_id)}
          >
            <View style={[styles.marker, { backgroundColor: urgencyMeta[r.urgency]?.color || colors.primary }]}>
              <Text style={styles.markerEmoji}>{categories[r.category]?.emoji || "📍"}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{r.title}</Text>
              <Text style={styles.cardSub}>
                {categories[r.category]?.label} • {r.latitude.toFixed(3)}, {r.longitude.toFixed(3)}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
        {reports.length === 0 && (
          <View style={styles.empty}>
            <Text style={{ fontSize: 36 }}>🌍</Text>
            <Text style={styles.emptyTitle}>No reports yet</Text>
            <Text style={styles.emptySub}>Tap the green + to submit the first one.</Text>
          </View>
        )}
        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { ...StyleSheet.absoluteFillObject, opacity: 0.4 },
  gridLine: { position: "absolute", left: 0, right: 0, height: 1, backgroundColor: "#86EFAC" },
  scroll: { padding: spacing.lg, paddingTop: 140, gap: 12 },
  heroChip: {
    flexDirection: "row", gap: 8, alignItems: "center",
    backgroundColor: "#FEF3C7", paddingHorizontal: 14, paddingVertical: 10, borderRadius: 16,
  },
  heroText: { color: "#92400E", fontSize: 12, fontWeight: "700", flex: 1 },
  userCard: { backgroundColor: "#fff", padding: 14, borderRadius: 16, ...shadow.card },
  card: { flexDirection: "row", gap: 12, alignItems: "center", backgroundColor: "#fff", padding: 14, borderRadius: 20, ...shadow.card },
  marker: {
    width: 44, height: 44, borderRadius: 22, borderWidth: 3, borderColor: "#fff",
    alignItems: "center", justifyContent: "center",
  },
  markerEmoji: { fontSize: 20 },
  cardTitle: { fontWeight: "900", fontSize: 14, color: colors.text },
  cardSub: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  empty: { alignItems: "center", gap: 6, paddingVertical: 60 },
  emptyTitle: { fontSize: 18, fontWeight: "900", color: colors.text },
  emptySub: { fontSize: 13, color: colors.textMuted, textAlign: "center", paddingHorizontal: 40 },
});
