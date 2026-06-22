import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { colors, spacing } from "@/src/theme";

export default function Welcome() {
  return (
    <View style={styles.container} testID="welcome-screen">
      <ImageBackground
        source={{ uri: "https://images.unsplash.com/photo-1440581572325-0bea30075d9d?crop=entropy&cs=srgb&fm=jpg&w=900&q=80" }}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      >
        <LinearGradient
          colors={["rgba(20,83,45,0.25)", "rgba(20,83,45,0.55)", "rgba(20,83,45,0.95)"]}
          locations={[0, 0.45, 1]}
          style={StyleSheet.absoluteFill}
        />
      </ImageBackground>

      <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
        <View style={styles.top}>
          <View style={styles.logoChip} testID="welcome-logo">
            <Text style={styles.logoEmoji}>🌿</Text>
            <Text style={styles.logoText}>Gaia Phylax</Text>
          </View>
        </View>

        <View style={styles.bottom}>
          <View style={styles.tagRow}>
            <View style={styles.tag}><Text style={styles.tagText}>🗺️ Map</Text></View>
            <View style={styles.tag}><Text style={styles.tagText}>🐾 Eco Pets</Text></View>
            <View style={styles.tag}><Text style={styles.tagText}>🤖 AI Triage</Text></View>
          </View>
          <Text style={styles.title}>Give the planet{"\n"}a voice.</Text>
          <Text style={styles.subtitle}>
            Spot pollution, fires, injured animals, illegal hunting — report them in seconds and raise eco pets as you protect nature.
          </Text>

          <TouchableOpacity
            testID="welcome-signup-button"
            style={styles.primaryBtn}
            activeOpacity={0.9}
            onPress={() => router.push("/(auth)/signup")}
          >
            <Text style={styles.primaryBtnText}>Start protecting</Text>
            <Feather name="arrow-right" size={20} color="#0F2D1A" />
          </TouchableOpacity>

          <TouchableOpacity
            testID="welcome-login-button"
            style={styles.secondaryBtn}
            activeOpacity={0.85}
            onPress={() => router.push("/(auth)/login")}
          >
            <Text style={styles.secondaryBtnText}>I already have an account</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primaryDark },
  safe: { flex: 1, justifyContent: "space-between", padding: spacing.xl },
  top: { paddingTop: Platform.OS === "android" ? spacing.lg : 0 },
  logoChip: {
    alignSelf: "flex-start",
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: "rgba(255,255,255,0.18)",
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1, borderColor: "rgba(255,255,255,0.25)",
  },
  logoEmoji: { fontSize: 18 },
  logoText: { color: "#fff", fontSize: 15, fontWeight: "800", letterSpacing: 0.4 },
  bottom: { gap: spacing.md },
  tagRow: { flexDirection: "row", gap: 8, marginBottom: spacing.sm },
  tag: { backgroundColor: "rgba(255,255,255,0.15)", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 },
  tagText: { color: "#F0FDF4", fontSize: 12, fontWeight: "700" },
  title: { color: "#fff", fontSize: 40, fontWeight: "900", letterSpacing: -1, lineHeight: 44 },
  subtitle: { color: "#DCFCE7", fontSize: 15, lineHeight: 22, marginBottom: spacing.lg },
  primaryBtn: {
    backgroundColor: colors.secondary, borderRadius: 999, paddingVertical: 18,
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
  },
  primaryBtnText: { color: "#0F2D1A", fontSize: 17, fontWeight: "900" },
  secondaryBtn: { paddingVertical: 14, alignItems: "center" },
  secondaryBtnText: { color: "#F0FDF4", fontSize: 14, fontWeight: "700" },
});
