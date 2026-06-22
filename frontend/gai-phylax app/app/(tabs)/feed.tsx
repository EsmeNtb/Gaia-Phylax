import React, { useCallback, useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, ImageBackground, Image, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withDelay, withTiming, Easing } from "react-native-reanimated";
import { colors, spacing, shadow, categories, urgencyMeta } from "@/src/theme";
import { api } from "@/src/api";

const CATEGORY_OPTIONS = ["all", ...Object.keys(categories)];

// Free cork-board texture — perfect tiled background for the pinboard look.
const CORK_BG = "https://images.unsplash.com/photo-1577705998148-6da4f3963bc8?auto=format&fit=crop&w=900&q=80";

function timeAgo(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  const m = Math.floor((Date.now() - d.getTime()) / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const dy = Math.floor(h / 24);
  return `${dy}d ago`;
}

const TILTS = [-4, 3, -2, 5, -3, 2, -5, 4];
const PIN_COLORS = ["#EF4444", "#FBBF24", "#38BDF8", "#A855F7", "#22C55E", "#EA580C"];

export default function Feed() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string>("all");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await api.listReports(category !== "all" ? { category } : {});
      setItems(r.items || []);
    } finally { setLoading(false); }
  }, [category]);

  useEffect(() => { load(); }, [load]);

  // Split into a left/right column for a more realistic corkboard layout.
  const columns = useMemo(() => {
    const left: any[] = [], right: any[] = [];
    items.forEach((it, i) => (i % 2 === 0 ? left : right).push(it));
    return { left, right };
  }, [items]);

  return (
    <View style={styles.container} testID="feed-screen">
      <SafeAreaView edges={["top"]}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>The Board</Text>
            <Text style={styles.headerSub}>Pinned signals from the community</Text>
          </View>
          <View style={styles.iconWrap}>
            <Text style={{ fontSize: 22 }}>📌</Text>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
          {CATEGORY_OPTIONS.map((c) => {
            const active = category === c;
            const meta = c === "all" ? null : categories[c];
            return (
              <TouchableOpacity
                key={c}
                testID={`feed-chip-${c}`}
                onPress={() => setCategory(c)}
                style={[styles.chip, active && { backgroundColor: "#1C1917", borderColor: "#1C1917" }]}
                activeOpacity={0.85}
              >
                <Text style={[styles.chipText, active && { color: "#fff" }]}>
                  {c === "all" ? "🌍 All" : `${meta?.emoji}  ${meta?.label}`}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </SafeAreaView>

      <ScrollView
        contentContainerStyle={styles.board}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} tintColor={colors.primary} />}
      >
        <ImageBackground
          source={{ uri: CORK_BG }}
          style={styles.cork}
          imageStyle={{ opacity: 0.95 }}
          resizeMode="cover"
        >
          {items.length === 0 && !loading ? (
            <View style={styles.empty}>
              <Text style={{ fontSize: 56 }}>📭</Text>
              <Text style={styles.emptyTitle}>Nothing pinned yet</Text>
              <Text style={styles.emptySub}>Be the first to pin a sighting!</Text>
              <TouchableOpacity style={styles.emptyBtn} onPress={() => router.push("/(tabs)/report")}>
                <Text style={styles.emptyBtnText}>Pin one now</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.cols}>
              <View style={styles.col}>
                {columns.left.map((item, i) => (
                  <Polaroid key={item.report_id} item={item} idx={i * 2} />
                ))}
              </View>
              <View style={styles.col}>
                {columns.right.map((item, i) => (
                  <Polaroid key={item.report_id} item={item} idx={i * 2 + 1} />
                ))}
              </View>
            </View>
          )}
          <View style={{ height: 140 }} />
        </ImageBackground>
      </ScrollView>
    </View>
  );
}

function Polaroid({ item, idx }: { item: any; idx: number }) {
  const tilt = TILTS[idx % TILTS.length];
  const pinColor = PIN_COLORS[idx % PIN_COLORS.length];
  const photoUri = item.photo_base64
    ? (item.photo_base64.startsWith("data:") ? item.photo_base64 : `data:image/jpeg;base64,${item.photo_base64}`)
    : null;

  // Stagger drop-in: each card falls from above with a soft bounce.
  const translateY = useSharedValue(-220 - idx * 40);
  const rotate = useSharedValue(tilt - 20);
  const opacity = useSharedValue(0);
  useEffect(() => {
    const delay = idx * 90;
    translateY.value = withDelay(delay, withSpring(0, { damping: 9, stiffness: 110, mass: 0.9 }));
    rotate.value = withDelay(delay, withSpring(tilt, { damping: 8, stiffness: 95 }));
    opacity.value = withDelay(delay, withTiming(1, { duration: 240, easing: Easing.out(Easing.cubic) }));
  }, [idx, tilt, translateY, rotate, opacity]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }, { rotate: `${rotate.value}deg` }],
  }));

  return (
    <Animated.View style={animStyle}>
      <TouchableOpacity
        testID={`feed-card-${item.report_id}`}
        activeOpacity={0.85}
        onPress={() => router.push(`/report/${item.report_id}`)}
        style={styles.polaroid}
      >
        {/* Pushpin */}
        <View style={styles.pinWrap} pointerEvents="none">
          <View style={[styles.pin, { backgroundColor: pinColor }]} />
          <View style={styles.pinShine} />
        </View>

        {/* Photo */}
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={styles.photo} />
        ) : (
          <View style={[styles.photo, styles.photoPlaceholder]}>
            <Text style={{ fontSize: 48 }}>{categories[item.category]?.emoji}</Text>
          </View>
        )}

        {/* Tiny viral ribbon on the photo when the report blew up */}
        {item.is_viral && (
          <View style={styles.viralRibbon} testID={`feed-viral-${item.report_id}`} pointerEvents="none">
            <Text style={styles.viralRibbonText}>🌿 VIRAL</Text>
          </View>
        )}

        {/* Caption block */}
        <View style={styles.caption}>
          <View style={styles.captionRow}>
            <View style={[styles.urgencyDot, { backgroundColor: urgencyMeta[item.urgency]?.color }]} />
            <Text style={styles.captionTitle} numberOfLines={1}>{item.title}</Text>
          </View>
          <Text style={styles.captionMeta}>
            {categories[item.category]?.label} · {timeAgo(item.created_at)}
          </Text>
          <View style={styles.captionFooterRow}>
            <Text style={styles.captionAuthor} numberOfLines={1}>— {item.user_name || "Anonymous"}</Text>
            <View style={styles.captionStats}>
              {item.like_count > 0 && (
                <View style={styles.statChip}>
                  <Feather name="heart" size={9} color={colors.danger} />
                  <Text style={styles.statText}>{item.like_count}</Text>
                </View>
              )}
              {item.view_count > 0 && (
                <View style={styles.statChip}>
                  <Feather name="eye" size={9} color="#57534E" />
                  <Text style={styles.statText}>{item.view_count}</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const screenW = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#3C2A1E" },
  headerRow: { paddingHorizontal: spacing.xl, paddingTop: spacing.sm, paddingBottom: spacing.md, flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: colors.background },
  headerTitle: { fontSize: 28, fontWeight: "900", color: colors.text, letterSpacing: -0.8 },
  headerSub: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  iconWrap: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.primarySoft, alignItems: "center", justifyContent: "center" },
  chipsRow: { paddingHorizontal: spacing.xl, gap: 8, paddingBottom: spacing.md, backgroundColor: colors.background },
  chip: {
    height: 36, paddingHorizontal: 16,
    backgroundColor: "#fff", borderRadius: 999,
    borderWidth: 2, borderColor: "transparent",
    alignItems: "center", justifyContent: "center",
    flexShrink: 0, ...shadow.card,
  },
  chipText: { fontWeight: "800", fontSize: 13, color: colors.text },

  board: { flexGrow: 1 },
  cork: { flex: 1, paddingHorizontal: 12, paddingTop: 20, backgroundColor: "#A87144" },
  cols: { flexDirection: "row", gap: 12 },
  col: { flex: 1, gap: 24 },

  polaroid: {
    backgroundColor: "#FAF7F2",
    padding: 8,
    paddingBottom: 14,
    borderRadius: 4,
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.45,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  pinWrap: { position: "absolute", top: -10, alignSelf: "center", width: 22, height: 22, alignItems: "center", justifyContent: "center", zIndex: 2 },
  pin: {
    width: 18, height: 18, borderRadius: 9,
    borderWidth: 2, borderColor: "rgba(0,0,0,0.25)",
    shadowColor: "#000", shadowOpacity: 0.4, shadowRadius: 3, shadowOffset: { width: 0, height: 2 }, elevation: 5,
  },
  pinShine: { position: "absolute", top: 3, left: 7, width: 5, height: 5, borderRadius: 3, backgroundColor: "rgba(255,255,255,0.65)" },

  photo: { width: "100%", aspectRatio: 1, backgroundColor: "#E7E5E4", borderRadius: 2 },
  photoPlaceholder: { alignItems: "center", justifyContent: "center" },

  caption: { paddingTop: 8, paddingHorizontal: 4, gap: 2 },
  captionRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  urgencyDot: { width: 8, height: 8, borderRadius: 4 },
  captionTitle: { flex: 1, fontFamily: "Courier", fontSize: 13, fontWeight: "800", color: "#1C1917" },
  captionMeta: { fontSize: 10, color: "#78716C", fontWeight: "700" },
  captionAuthor: { fontSize: 11, color: "#57534E", fontStyle: "italic", marginTop: 2 },
  captionFooterRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 2 },
  captionStats: { flexDirection: "row", gap: 4 },
  statChip: { flexDirection: "row", alignItems: "center", gap: 3, backgroundColor: "#F5F1E8", paddingHorizontal: 5, paddingVertical: 2, borderRadius: 999 },
  statText: { fontSize: 9, fontWeight: "900", color: "#1C1917" },
  viralRibbon: {
    position: "absolute", top: 16, right: -8,
    backgroundColor: "#7F1D1D",
    paddingHorizontal: 10, paddingVertical: 4,
    transform: [{ rotate: "8deg" }],
    borderRadius: 4,
    shadowColor: "#000", shadowOpacity: 0.35, shadowRadius: 4, shadowOffset: { width: 0, height: 2 },
    elevation: 6,
    zIndex: 2,
  },
  viralRibbonText: { color: "#FCA5A5", fontSize: 10, fontWeight: "900", letterSpacing: 1 },

  empty: { alignItems: "center", paddingVertical: 60, gap: 8 },
  emptyTitle: { fontSize: 22, fontWeight: "900", color: "#FAF7F2", textShadowColor: "rgba(0,0,0,0.4)", textShadowRadius: 4 },
  emptySub: { fontSize: 13, color: "#FEF3C7", textAlign: "center" },
  emptyBtn: { marginTop: 16, backgroundColor: colors.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 999 },
  emptyBtnText: { color: "#fff", fontWeight: "900" },
});
