import React, { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Location from "expo-location";

import { colors, spacing, urgencyMeta, shadow } from "@/src/theme";
import { api } from "@/src/api";
import WorldHeatmap from "@/src/components/WorldHeatmap";

const URGENCY_OPTIONS = ["all", "low", "medium", "high", "critical"] as const;

export default function MapScreen() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLoc, setUserLoc] = useState<{ lat: number; lng: number } | null>(null);
  const [filter, setFilter] = useState<(typeof URGENCY_OPTIONS)[number]>("all");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await api.listReports(filter !== "all" ? { urgency: filter } : {});
      setReports(r.items || []);
    } finally { setLoading(false); }
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
          setUserLoc({ lat: loc.coords.latitude, lng: loc.coords.longitude });
        }
      } catch {}
    })();
  }, []);

  return (
    <View style={styles.container} testID="map-screen">
      <WorldHeatmap
        reports={reports}
        userLoc={userLoc}
        onReportPress={(id) => router.push(`/report/${id}`)}
      />

      <SafeAreaView style={styles.headerSafe} edges={["top"]} pointerEvents="box-none">
        <View style={styles.headerRow} pointerEvents="box-none">
          <View style={styles.titleChip} testID="map-header">
            <Text style={styles.titleEmoji}>🌍</Text>
            <View>
              <Text style={styles.titleText}>Planet pulse</Text>
              <Text style={styles.titleSub}>{loading ? "Scanning…" : `${reports.length} active signals`}</Text>
            </View>
          </View>
          <TouchableOpacity testID="map-refresh" style={styles.iconBtn} onPress={load}>
            <Feather name="refresh-cw" size={18} color="#0F2D1A" />
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
          {URGENCY_OPTIONS.map((u) => {
            const active = filter === u;
            const c = u === "all" ? "#fff" : urgencyMeta[u].color;
            return (
              <TouchableOpacity
                key={u}
                testID={`urgency-chip-${u}`}
                onPress={() => setFilter(u)}
                style={[styles.chip, active && { backgroundColor: c, borderColor: c }]}
                activeOpacity={0.85}
              >
                <Text style={[styles.chipText, active && { color: u === "all" ? colors.text : "#fff" }]}>
                  {u === "all" ? "All" : urgencyMeta[u].label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </SafeAreaView>

      {loading && (
        <View style={styles.loaderPill} testID="map-loading">
          <ActivityIndicator color={colors.primary} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B1F1A" },
  headerSafe: { position: "absolute", top: 0, left: 0, right: 0 },
  headerRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: spacing.lg, paddingTop: spacing.sm, gap: 12 },
  titleChip: {
    flex: 1, flexDirection: "row", gap: 10, alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.95)", paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: 999, ...shadow.card,
  },
  titleEmoji: { fontSize: 22 },
  titleText: { fontWeight: "900", fontSize: 15, color: colors.text },
  titleSub: { fontSize: 11, color: colors.textMuted, fontWeight: "700" },
  iconBtn: {
    width: 44, height: 44, borderRadius: 999, backgroundColor: "#fff",
    alignItems: "center", justifyContent: "center", ...shadow.card,
  },
  chipsRow: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, gap: 8 },
  chip: {
    height: 36, paddingHorizontal: 16,
    backgroundColor: "rgba(255,255,255,0.95)", borderRadius: 999,
    borderWidth: 2, borderColor: "transparent",
    alignItems: "center", justifyContent: "center",
    flexShrink: 0, ...shadow.card,
  },
  chipText: { fontWeight: "800", fontSize: 13, color: colors.text },
  loaderPill: {
    position: "absolute", bottom: 110, alignSelf: "center",
    backgroundColor: "#fff", paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 999, ...shadow.card,
  },
});
