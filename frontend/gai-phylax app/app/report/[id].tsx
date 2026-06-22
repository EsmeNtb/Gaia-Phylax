import React, { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Image, TouchableOpacity, ImageBackground } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withSequence, withTiming } from "react-native-reanimated";

import { api } from "@/src/api";
import { useAuth } from "@/src/auth";
import { colors, spacing, shadow, categories, urgencyMeta } from "@/src/theme";

const CORK_BG = "https://images.unsplash.com/photo-1577705998148-6da4f3963bc8?auto=format&fit=crop&w=900&q=80";

export default function ReportDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [liking, setLiking] = useState(false);

  // Animate the wax stamp pop-in
  const stampScale = useSharedValue(0);
  const stampStyle = useAnimatedStyle(() => ({
    transform: [{ scale: stampScale.value }, { rotate: "-18deg" }],
  }));

  const loadReport = useCallback(async () => {
    try {
      const r = await api.getReport(id);
      setData(r);
    } finally { setLoading(false); }
  }, [id]);

  useEffect(() => {
    (async () => {
      try {
        const viewed = await api.viewReport(id);
        setData(viewed);
      } catch {
        // Fallback to plain GET if viewing fails (e.g. no auth)
        await loadReport();
      } finally { setLoading(false); }
    })();
  }, [id, loadReport]);

  // Trigger stamp pop when data marks the report as viral
  useEffect(() => {
    if (data?.is_viral) {
      stampScale.value = 0;
      stampScale.value = withSequence(
        withSpring(1.25, { damping: 6, stiffness: 140 }),
        withSpring(1, { damping: 10, stiffness: 180 }),
      );
    } else {
      stampScale.value = withTiming(0, { duration: 200 });
    }
  }, [data?.is_viral, stampScale]);

  const onLike = async () => {
    if (!user) { router.push("/(auth)/login"); return; }
    setLiking(true);
    try {
      const r = await api.likeReport(id);
      setData(r);
    } finally { setLiking(false); }
  };

  if (loading) {
    return (
      <View style={styles.safe}>
        <SafeAreaView style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator color={colors.primary} size="large" />
        </SafeAreaView>
      </View>
    );
  }
  if (!data) {
    return (
      <View style={styles.safe}>
        <SafeAreaView style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <Text style={{ color: "#fff" }}>Report not found.</Text>
        </SafeAreaView>
      </View>
    );
  }

  const cat = categories[data.category];
  const urg = urgencyMeta[data.urgency];
  const photoUri = data.photo_base64
    ? (data.photo_base64.startsWith("data:") ? data.photo_base64 : `data:image/jpeg;base64,${data.photo_base64}`)
    : null;
  const date = new Date(data.created_at);
  const stampDate = `${String(date.getDate()).padStart(2, "0")}.${String(date.getMonth() + 1).padStart(2, "0")}.${date.getFullYear()}`;

  return (
    <ImageBackground source={{ uri: CORK_BG }} style={styles.safe} testID="report-detail" resizeMode="cover">
      <SafeAreaView edges={["top"]}>
        <View style={styles.headerRow}>
          <TouchableOpacity testID="detail-back" onPress={() => router.back()} style={styles.iconBtn}>
            <Feather name="arrow-left" size={22} color="#1C1917" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>POSTCARD</Text>
          <View style={{ width: 44 }} />
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.postcard}>
          {/* Pushpin */}
          <View style={styles.pinWrap} pointerEvents="none">
            <View style={styles.pin} />
            <View style={styles.pinShine} />
          </View>

          {/* Photo */}
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.photo} />
          ) : (
            <View style={[styles.photo, { alignItems: "center", justifyContent: "center", backgroundColor: "#E7E5E4" }]}>
              <Text style={{ fontSize: 84 }}>{cat?.emoji}</Text>
            </View>
          )}

          {/* Wax seal — only when viral */}
          {data.is_viral && (
            <Animated.View style={[styles.waxWrap, stampStyle]} pointerEvents="none" testID="wax-stamp">
              <View style={styles.waxOuter}>
                <View style={styles.waxInner}>
                  <Text style={styles.waxIcon}>🌿</Text>
                  <Text style={styles.waxLabel}>VIRAL</Text>
                  <Text style={styles.waxSub}>· GAIA ·</Text>
                </View>
                {/* "drips" around the seal */}
                {[0, 60, 120, 180, 240, 300].map((deg) => (
                  <View
                    key={deg}
                    style={[styles.waxDrip, { transform: [{ rotate: `${deg}deg` }, { translateY: -42 }] }]}
                  />
                ))}
              </View>
            </Animated.View>
          )}

          {/* "Postage" strip */}
          <View style={styles.strip}>
            <View style={[styles.stamp, { backgroundColor: urg.color }]}>
              <Text style={styles.stampUrgency}>{urg.label.toUpperCase()}</Text>
              <View style={styles.stampBorder} />
            </View>
            <View style={{ flex: 1, alignItems: "flex-end", gap: 6 }}>
              <View style={styles.postmark}>
                <Text style={styles.postmarkText}>📮 GAIA · {stampDate}</Text>
              </View>
              <View style={styles.viewsChip}>
                <Feather name="eye" size={11} color="#57534E" />
                <Text style={styles.viewsText}>{data.view_count} views</Text>
              </View>
            </View>
          </View>

          {/* Title + category */}
          <View style={styles.body}>
            <View style={styles.catRow}>
              <Text style={styles.catEmoji}>{cat?.emoji}</Text>
              <Text style={styles.catLabel}>{cat?.label.toUpperCase()}</Text>
            </View>
            <Text style={styles.title}>{data.title}</Text>

            <View style={styles.divider} />

            <Text style={styles.descLabel}>Note from the field</Text>
            <Text style={styles.description}>{data.description}</Text>

            <View style={styles.divider} />

            <View style={styles.footerRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.metaLabel}>FROM</Text>
                <Text style={styles.metaValue}>{data.user_name || "Anonymous"}</Text>
              </View>
              <View style={{ flex: 1, alignItems: "flex-end" }}>
                <Text style={styles.metaLabel}>WHEN</Text>
                <Text style={styles.metaValue}>{date.toLocaleString()}</Text>
              </View>
            </View>

            <View style={styles.locationCard}>
              <Feather name="map-pin" size={16} color="#1C1917" />
              <View style={{ flex: 1 }}>
                <Text style={styles.locationTitle}>{data.address || "Geo-tagged"}</Text>
                <Text style={styles.locationSub}>{data.latitude.toFixed(4)}, {data.longitude.toFixed(4)}</Text>
              </View>
            </View>

            {/* Like action */}
            <TouchableOpacity
              testID="like-button"
              activeOpacity={0.85}
              disabled={liking}
              onPress={onLike}
              style={[styles.likeBtn, data.liked && styles.likeBtnActive]}
            >
              <Feather name="heart" size={18} color={data.liked ? "#fff" : colors.danger} />
              <Text style={[styles.likeText, data.liked && { color: "#fff" }]}>
                {data.liked ? "Boosted" : "Boost this signal"}
              </Text>
              <View style={[styles.likeCount, data.liked && { backgroundColor: "rgba(255,255,255,0.25)" }]}>
                <Text style={[styles.likeCountText, data.liked && { color: "#fff" }]}>{data.like_count}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ height: 60 }} />
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#A87144" },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  headerTitle: { fontSize: 14, fontWeight: "900", color: "#FAF7F2", letterSpacing: 3, textShadowColor: "rgba(0,0,0,0.4)", textShadowRadius: 4 },
  iconBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#FAF7F2", alignItems: "center", justifyContent: "center", ...shadow.card },
  scroll: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 60 },

  postcard: {
    backgroundColor: "#FAF7F2",
    borderRadius: 6,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.45,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 14 },
    elevation: 14,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    position: "relative",
  },
  pinWrap: { position: "absolute", top: -10, alignSelf: "center", left: "50%", marginLeft: -11, width: 22, height: 22, alignItems: "center", justifyContent: "center", zIndex: 3 },
  pin: { width: 18, height: 18, borderRadius: 9, backgroundColor: "#EF4444", borderWidth: 2, borderColor: "rgba(0,0,0,0.25)", shadowColor: "#000", shadowOpacity: 0.4, shadowRadius: 3, shadowOffset: { width: 0, height: 2 }, elevation: 5 },
  pinShine: { position: "absolute", top: 3, left: 7, width: 5, height: 5, borderRadius: 3, backgroundColor: "rgba(255,255,255,0.65)" },

  photo: { width: "100%", aspectRatio: 4 / 3, backgroundColor: "#E7E5E4" },

  // Wax seal — looks like dripping wax stamped onto the photo
  waxWrap: {
    position: "absolute",
    top: 24, right: 16,
    width: 110, height: 110,
    alignItems: "center", justifyContent: "center",
    zIndex: 2,
  },
  waxOuter: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: "#7F1D1D",
    alignItems: "center", justifyContent: "center",
    borderWidth: 3, borderColor: "#450A0A",
    shadowColor: "#7F1D1D",
    shadowOpacity: 0.7, shadowRadius: 14, shadowOffset: { width: 2, height: 6 },
    elevation: 12,
  },
  waxInner: {
    width: 78, height: 78, borderRadius: 39,
    borderWidth: 2, borderColor: "rgba(255,255,255,0.25)",
    alignItems: "center", justifyContent: "center",
    gap: 0,
  },
  waxIcon: { fontSize: 18 },
  waxLabel: { color: "#FCA5A5", fontSize: 12, fontWeight: "900", letterSpacing: 2.2, marginTop: 2 },
  waxSub: { color: "rgba(252,165,165,0.6)", fontSize: 7, fontWeight: "900", letterSpacing: 2, marginTop: 2 },
  waxDrip: {
    position: "absolute", top: "50%", left: "50%",
    width: 14, height: 14, marginLeft: -7, marginTop: -7,
    borderRadius: 7, backgroundColor: "#7F1D1D",
    shadowColor: "#7F1D1D", shadowOpacity: 0.6, shadowRadius: 5,
  },

  strip: { flexDirection: "row", padding: 12, gap: 8, alignItems: "center", backgroundColor: "#FAF7F2", borderBottomWidth: 1, borderBottomColor: "rgba(0,0,0,0.06)" },
  stamp: {
    paddingHorizontal: 14, paddingVertical: 12, borderRadius: 4,
    minWidth: 90, alignItems: "center", justifyContent: "center",
    borderWidth: 2, borderColor: "#FAF7F2",
    shadowColor: "#000", shadowOpacity: 0.18, shadowRadius: 4, shadowOffset: { width: 0, height: 2 },
  },
  stampUrgency: { color: "#fff", fontWeight: "900", letterSpacing: 1, fontSize: 11 },
  stampBorder: { position: "absolute", top: 2, left: 2, right: 2, bottom: 2, borderRadius: 2, borderWidth: 1, borderColor: "rgba(255,255,255,0.5)", borderStyle: "dashed" },
  postmark: {
    transform: [{ rotate: "-6deg" }],
    paddingHorizontal: 10, paddingVertical: 6,
    borderWidth: 2, borderColor: "rgba(28,25,23,0.55)",
    borderRadius: 30, borderStyle: "dashed",
  },
  postmarkText: { fontSize: 10, fontWeight: "900", color: "rgba(28,25,23,0.7)", letterSpacing: 1 },
  viewsChip: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#F5F1E8", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999, borderWidth: 1, borderColor: "rgba(0,0,0,0.06)" },
  viewsText: { fontSize: 10, fontWeight: "800", color: "#57534E" },

  body: { paddingHorizontal: 20, paddingVertical: 16, gap: 8 },
  catRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  catEmoji: { fontSize: 18 },
  catLabel: { fontSize: 11, color: "#78716C", fontWeight: "900", letterSpacing: 1.2 },
  title: { fontSize: 28, fontWeight: "900", color: "#1C1917", letterSpacing: -0.5, lineHeight: 32 },

  divider: { height: 1, backgroundColor: "rgba(0,0,0,0.08)", marginVertical: 12 },

  descLabel: { fontSize: 10, fontWeight: "900", color: "#78716C", letterSpacing: 1.5, marginBottom: 4 },
  description: { fontSize: 15, lineHeight: 23, color: "#292524", fontStyle: "italic" },

  footerRow: { flexDirection: "row", gap: 12 },
  metaLabel: { fontSize: 9, fontWeight: "900", color: "#78716C", letterSpacing: 1.5 },
  metaValue: { fontSize: 13, fontWeight: "800", color: "#1C1917", marginTop: 2 },

  locationCard: { flexDirection: "row", gap: 10, alignItems: "center", backgroundColor: "#F5F1E8", padding: 12, borderRadius: 12, marginTop: 6, borderWidth: 1, borderColor: "rgba(0,0,0,0.05)" },
  locationTitle: { fontSize: 13, fontWeight: "800", color: "#1C1917" },
  locationSub: { fontSize: 11, color: "#78716C", marginTop: 2, fontFamily: "Courier" },

  likeBtn: {
    marginTop: 12, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10,
    paddingVertical: 14, paddingHorizontal: 18,
    backgroundColor: "#FFF1F2", borderRadius: 999,
    borderWidth: 2, borderColor: "#FECDD3",
  },
  likeBtnActive: { backgroundColor: colors.danger, borderColor: colors.danger },
  likeText: { color: colors.danger, fontWeight: "900", fontSize: 14, letterSpacing: 0.3 },
  likeCount: { backgroundColor: "#FECDD3", paddingHorizontal: 10, paddingVertical: 2, borderRadius: 999, minWidth: 28, alignItems: "center" },
  likeCountText: { color: colors.danger, fontWeight: "900", fontSize: 12 },
});
