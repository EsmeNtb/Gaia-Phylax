import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";

import { useAuth } from "@/src/auth";
import { api } from "@/src/api";
import { colors, spacing, shadow } from "@/src/theme";

export default function Profile() {
  const { user, signOut, refresh } = useAuth();
  const [myReports, setMyReports] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setRefreshing(true);
    try {
      await refresh();
      const r = await api.listReports();
      setMyReports((r.items || []).filter((x: any) => x.user_id === user?.user_id));
    } finally { setRefreshing(false); }
  }, [refresh, user?.user_id]);

  useEffect(() => { load(); }, [load]);

  if (!user) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <View style={styles.empty}><Text>Not signed in.</Text></View>
      </SafeAreaView>
    );
  }

  const initials = (user.name || user.email).slice(0, 2).toUpperCase();

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={load} tintColor={colors.primary} />}
      >
        <View style={styles.header}>
          <View style={styles.avatar}><Text style={styles.avatarText}>{initials}</Text></View>
          <Text style={styles.name} testID="profile-name">{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>

        <View style={styles.statsRow}>
          <Stat label="Eco Points" value={user.points.toString()} emoji="🌿" />
          <Stat label="Level" value={`L${user.level}`} emoji="⭐" />
          <Stat label="Pets" value={user.unlocked_pets.length.toString()} emoji="🐾" />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>My contributions</Text>
          <Text style={styles.cardSub}>{myReports.length} reports submitted</Text>
          {myReports.slice(0, 6).map((r) => (
            <TouchableOpacity key={r.report_id} style={styles.contribRow} onPress={() => router.push(`/report/${r.report_id}`)} testID={`contrib-${r.report_id}`}>
              <View style={[styles.dot, { backgroundColor: r.urgency === "critical" ? colors.danger : r.urgency === "high" ? "#FB923C" : r.urgency === "medium" ? "#FACC15" : colors.primary }]} />
              <Text style={styles.contribTitle} numberOfLines={1}>{r.title}</Text>
              <Feather name="chevron-right" size={18} color={colors.textFaint} />
            </TouchableOpacity>
          ))}
          {myReports.length === 0 && <Text style={styles.cardSub}>No reports yet — go save the planet 🌍</Text>}
        </View>

        <TouchableOpacity testID="profile-logout" style={styles.logout} onPress={async () => { await signOut(); router.replace("/(auth)/welcome"); }}>
          <Feather name="log-out" size={18} color={colors.danger} />
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>
        <View style={{ height: 140 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({ label, value, emoji }: { label: string; value: string; emoji: string }) {
  return (
    <View style={styles.stat}>
      <Text style={{ fontSize: 24 }}>{emoji}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.xl, gap: spacing.lg },
  header: { alignItems: "center", gap: 8, paddingTop: spacing.md },
  avatar: { width: 92, height: 92, borderRadius: 46, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center", ...shadow.float },
  avatarText: { color: "#fff", fontSize: 32, fontWeight: "900" },
  name: { fontSize: 24, fontWeight: "900", color: colors.text, marginTop: 6 },
  email: { fontSize: 13, color: colors.textMuted, fontWeight: "700" },
  statsRow: { flexDirection: "row", gap: 12 },
  stat: { flex: 1, backgroundColor: "#fff", borderRadius: 22, padding: 18, alignItems: "center", gap: 4, ...shadow.card },
  statValue: { fontSize: 22, fontWeight: "900", color: colors.text },
  statLabel: { fontSize: 11, fontWeight: "800", color: colors.textMuted, textTransform: "uppercase", letterSpacing: 0.5 },
  card: { backgroundColor: "#fff", borderRadius: 24, padding: 18, gap: 10, ...shadow.card },
  cardTitle: { fontSize: 18, fontWeight: "900", color: colors.text },
  cardSub: { fontSize: 13, color: colors.textMuted },
  contribRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 10, borderTopWidth: 1, borderTopColor: colors.border },
  dot: { width: 10, height: 10, borderRadius: 5 },
  contribTitle: { flex: 1, fontWeight: "800", color: colors.text },
  logout: { flexDirection: "row", gap: 8, alignItems: "center", justifyContent: "center", padding: 16, backgroundColor: "#fff", borderRadius: 999, ...shadow.card },
  logoutText: { color: colors.danger, fontWeight: "900" },
  empty: { flex: 1, alignItems: "center", justifyContent: "center" },
});
