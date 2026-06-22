import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from "react-native-reanimated";

import { api } from "@/src/api";
import { useAuth } from "@/src/auth";
import { colors, spacing, shadow } from "@/src/theme";

type Pet = {
  pet_id: string; name: string; emoji: string; biome: string;
  unlock_points: number; color: string; description: string;
  unlocked: boolean; is_active: boolean;
  status: { happiness: number; hunger: number; mood: string } | null;
};

export default function Pets() {
  const { user, refresh } = useAuth();
  const [data, setData] = useState<{ items: Pet[]; points: number; level: number; active_pet_id?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionPet, setActionPet] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await api.myPets();
      setData(r);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const onActivate = async (id: string) => {
    setActionPet(id);
    try {
      await api.activatePet(id);
      await load();
      await refresh();
    } finally { setActionPet(null); }
  };
  const onFeed = async (id: string) => {
    setActionPet(id);
    try { await api.feedPet(id); await load(); } finally { setActionPet(null); }
  };
  const onPlay = async (id: string) => {
    setActionPet(id);
    try { await api.playPet(id); await load(); } finally { setActionPet(null); }
  };

  if (loading || !data) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <View style={styles.loader}><ActivityIndicator color={colors.primary} size="large" /></View>
      </SafeAreaView>
    );
  }

  const active = data.items.find((p) => p.is_active) || data.items[0];
  const nextLocked = data.items.find((p) => !p.unlocked);
  const ptsToNext = nextLocked ? Math.max(0, nextLocked.unlock_points - data.points) : 0;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} tintColor={colors.primary} />}
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>Your Eco Pets</Text>
            <Text style={styles.headerSub}>Level {data.level} • {data.points} pts</Text>
          </View>
          <View style={styles.iconWrap}><Text style={{ fontSize: 24 }}>🌟</Text></View>
        </View>

        {/* Active pet hero card */}
        {active && active.unlocked && active.status && (
          <ActivePetCard
            pet={active}
            busy={actionPet === active.pet_id}
            onFeed={() => onFeed(active.pet_id)}
            onPlay={() => onPlay(active.pet_id)}
          />
        )}

        {/* Progress to next unlock */}
        {nextLocked && (
          <View style={styles.progressCard}>
            <View style={styles.rowBetween}>
              <View style={{ flex: 1 }}>
                <Text style={styles.progressLabel}>Next unlock</Text>
                <Text style={styles.progressName}>{nextLocked.emoji} {nextLocked.name}</Text>
              </View>
              <View style={styles.progressPts}>
                <Text style={styles.progressPtsText}>{ptsToNext} pts</Text>
              </View>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${Math.min(100, 100 - (ptsToNext / Math.max(1, nextLocked.unlock_points)) * 100)}%` },
                ]}
              />
            </View>
            <Text style={styles.progressHint}>Submit reports to earn +15 pts each 🌱</Text>
          </View>
        )}

        {/* Collection */}
        <Text style={styles.sectionTitle}>Collection</Text>
        <View style={styles.grid} testID="pets-grid">
          {data.items.map((p) => (
            <PetTile
              key={p.pet_id}
              pet={p}
              busy={actionPet === p.pet_id}
              userPoints={data.points}
              onActivate={() => onActivate(p.pet_id)}
            />
          ))}
        </View>
        <View style={{ height: 140 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function ActivePetCard({ pet, busy, onFeed, onPlay }: { pet: Pet; busy: boolean; onFeed: () => void; onPlay: () => void }) {
  const float = useSharedValue(0);
  useEffect(() => {
    float.value = withRepeat(withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, [float]);
  const floatStyle = useAnimatedStyle(() => ({ transform: [{ translateY: -8 * float.value }] }));
  const moodEmoji = pet.status?.mood === "happy" ? "😊" : pet.status?.mood === "hungry" ? "🍽️" : "😴";
  return (
    <View style={[styles.activeCard, { backgroundColor: pet.color + "1A", borderColor: pet.color }]} testID="active-pet">
      <View style={styles.activeRow}>
        <Animated.View style={[styles.bigPet, { backgroundColor: pet.color + "33" }, floatStyle]}>
          <Text style={{ fontSize: 76 }}>{pet.emoji}</Text>
        </Animated.View>
        <View style={{ flex: 1 }}>
          <Text style={styles.activeName}>{pet.name}</Text>
          <Text style={styles.activeBiome}>{pet.biome} • {moodEmoji} {pet.status?.mood}</Text>
          <StatBar label="Happiness" value={pet.status?.happiness || 0} color="#FBBF24" />
          <StatBar label="Hunger" value={pet.status?.hunger || 0} color="#EA580C" inverse />
        </View>
      </View>
      <View style={styles.actionRow}>
        <TouchableOpacity testID="pet-feed" disabled={busy} style={[styles.action, { backgroundColor: "#FB923C" }]} onPress={onFeed}>
          <Text style={styles.actionEmoji}>🍎</Text>
          <Text style={styles.actionText}>Feed</Text>
        </TouchableOpacity>
        <TouchableOpacity testID="pet-play" disabled={busy} style={[styles.action, { backgroundColor: "#38BDF8" }]} onPress={onPlay}>
          <Text style={styles.actionEmoji}>🎾</Text>
          <Text style={styles.actionText}>Play</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function StatBar({ label, value, color, inverse }: { label: string; value: number; color: string; inverse?: boolean }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <View style={{ marginTop: 8 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={styles.statLabel}>{label}</Text>
        <Text style={styles.statValue}>{pct}{inverse ? " (full)" : ""}</Text>
      </View>
      <View style={styles.statBar}>
        <View style={[styles.statFill, { width: `${pct}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

function PetTile({ pet, userPoints, busy, onActivate }: { pet: Pet; userPoints: number; busy: boolean; onActivate: () => void }) {
  const locked = !pet.unlocked;
  return (
    <TouchableOpacity
      testID={`pet-tile-${pet.pet_id}`}
      activeOpacity={locked ? 1 : 0.85}
      disabled={locked || busy || pet.is_active}
      onPress={onActivate}
      style={[
        styles.tile,
        locked && { opacity: 0.55, backgroundColor: "#E7E5E4" },
        pet.is_active && { borderColor: pet.color, borderWidth: 3, backgroundColor: pet.color + "1A" },
      ]}
    >
      <Text style={{ fontSize: 44, opacity: locked ? 0.35 : 1 }}>{pet.emoji}</Text>
      <Text style={styles.tileName} numberOfLines={1}>{pet.name.split(" ")[0]}</Text>
      <Text style={styles.tileBiome}>{pet.biome}</Text>
      {locked ? (
        <View style={styles.lockBadge}>
          <Feather name="lock" size={11} color="#fff" />
          <Text style={styles.lockText}>{pet.unlock_points} pts</Text>
        </View>
      ) : pet.is_active ? (
        <View style={[styles.lockBadge, { backgroundColor: pet.color }]}>
          <Feather name="check" size={11} color="#fff" />
          <Text style={styles.lockText}>Active</Text>
        </View>
      ) : (
        <View style={[styles.lockBadge, { backgroundColor: colors.primary }]}>
          <Text style={styles.lockText}>Set active</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.xl, gap: spacing.lg },
  loader: { flex: 1, alignItems: "center", justifyContent: "center" },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  headerTitle: { fontSize: 28, fontWeight: "900", color: colors.text, letterSpacing: -0.8 },
  headerSub: { fontSize: 13, color: colors.textMuted, marginTop: 2, fontWeight: "700" },
  iconWrap: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.primarySoft, alignItems: "center", justifyContent: "center" },

  activeCard: { borderRadius: 28, padding: 18, borderWidth: 2, ...shadow.card },
  activeRow: { flexDirection: "row", gap: 16, alignItems: "center" },
  bigPet: { width: 110, height: 110, borderRadius: 55, alignItems: "center", justifyContent: "center" },
  activeName: { fontSize: 20, fontWeight: "900", color: colors.text },
  activeBiome: { fontSize: 13, color: colors.textMuted, marginTop: 2, marginBottom: 6, fontWeight: "700" },
  statLabel: { fontSize: 11, fontWeight: "800", color: colors.textMuted, letterSpacing: 0.4 },
  statValue: { fontSize: 11, fontWeight: "800", color: colors.text },
  statBar: { height: 8, backgroundColor: colors.border, borderRadius: 999, marginTop: 4, overflow: "hidden" },
  statFill: { height: "100%", borderRadius: 999 },
  actionRow: { flexDirection: "row", gap: 10, marginTop: 14 },
  action: { flex: 1, paddingVertical: 12, borderRadius: 999, alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 6 },
  actionEmoji: { fontSize: 16 },
  actionText: { color: "#fff", fontWeight: "900", fontSize: 14 },

  progressCard: { backgroundColor: "#fff", borderRadius: 24, padding: 18, gap: 10, ...shadow.card },
  rowBetween: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  progressLabel: { fontSize: 11, fontWeight: "800", color: colors.textMuted, textTransform: "uppercase", letterSpacing: 0.6 },
  progressName: { fontSize: 16, fontWeight: "900", color: colors.text, marginTop: 2 },
  progressPts: { backgroundColor: colors.secondary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 },
  progressPtsText: { fontWeight: "900", color: "#1C1917" },
  progressBar: { height: 10, backgroundColor: colors.border, borderRadius: 999, overflow: "hidden" },
  progressFill: { height: "100%", backgroundColor: colors.primary, borderRadius: 999 },
  progressHint: { fontSize: 12, color: colors.textMuted },

  sectionTitle: { fontSize: 18, fontWeight: "900", color: colors.text, marginTop: 4 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12, justifyContent: "space-between" },
  tile: { width: "31%", backgroundColor: "#fff", borderRadius: 22, padding: 12, alignItems: "center", gap: 4, ...shadow.card, borderWidth: 2, borderColor: "transparent" },
  tileName: { fontSize: 13, fontWeight: "900", color: colors.text },
  tileBiome: { fontSize: 10, color: colors.textMuted, fontWeight: "700" },
  lockBadge: { flexDirection: "row", gap: 4, alignItems: "center", backgroundColor: "#57534E", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, marginTop: 6 },
  lockText: { color: "#fff", fontSize: 10, fontWeight: "900" },
});
