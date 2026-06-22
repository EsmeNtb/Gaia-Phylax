import React, { useCallback, useEffect, useState } from "react";
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ActivityIndicator, ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";

import { api } from "@/src/api";
import { useAuth } from "@/src/auth";
import { colors, spacing, radius, shadow, categories, urgencyMeta } from "@/src/theme";

const URGENCIES = ["low", "medium", "high", "critical"] as const;
const CATS = Object.keys(categories);

export default function ReportScreen() {
  const { refresh } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string>("pollution");
  const [urgency, setUrgency] = useState<(typeof URGENCIES)[number]>("medium");
  const [photo, setPhoto] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [address, setAddress] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [classifying, setClassifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") return;
        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        setCoords({ lat: loc.coords.latitude, lng: loc.coords.longitude });
        try {
          const rev = await Location.reverseGeocodeAsync({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
          if (rev[0]) {
            const a = rev[0];
            setAddress([a.city || a.subregion, a.region, a.country].filter(Boolean).join(", "));
          }
        } catch {}
      } catch {}
    })();
  }, []);

  const pickImage = useCallback(async (mode: "camera" | "library") => {
    try {
      if (mode === "camera") {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") { setError("Camera permission denied"); return; }
      } else {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") { setError("Photo library permission denied"); return; }
      }
      const res = mode === "camera"
        ? await ImagePicker.launchCameraAsync({ quality: 0.6, base64: true, allowsEditing: true, aspect: [4, 3] })
        : await ImagePicker.launchImageLibraryAsync({ quality: 0.6, base64: true, allowsEditing: true, aspect: [4, 3] });
      if (!res.canceled && res.assets[0]?.base64) {
        const uri = `data:image/jpeg;base64,${res.assets[0].base64}`;
        setPhoto(uri);
      }
    } catch (e: any) {
      setError(e?.message || "Could not pick image");
    }
  }, []);

  const runClassify = useCallback(async () => {
    if (!description.trim()) { setError("Add a description first"); return; }
    setError(null);
    try {
      setClassifying(true);
      const r = await api.classify(description, photo || undefined);
      if (r.category) setCategory(r.category);
      if (r.urgency) setUrgency(r.urgency);
      if (r.title && !title) setTitle(r.title);
    } catch (e: any) {
      setError(e?.message || "AI classification failed");
    } finally {
      setClassifying(false);
    }
  }, [description, photo, title]);

  const submit = useCallback(async () => {
    setError(null);
    setSuccess(null);
    if (!title.trim() || !description.trim()) { setError("Title and description are required"); return; }
    if (!coords) { setError("Location not available — please enable location"); return; }
    try {
      setSubmitting(true);
      const resp = await api.createReport({
        title: title.trim(),
        description: description.trim(),
        category, urgency,
        latitude: coords.lat,
        longitude: coords.lng,
        address: address || undefined,
        photo_base64: photo || undefined,
      });
      await refresh();
      const newlyUnlocked = resp?.award?.newly_unlocked || [];
      setSuccess(
        newlyUnlocked.length
          ? `+15 pts! 🎉 You unlocked ${newlyUnlocked.map((p: any) => p.name).join(", ")}!`
          : "+15 eco points 🌿 Thank you!"
      );
      // reset
      setTitle("");
      setDescription("");
      setPhoto(null);
      setTimeout(() => router.replace("/(tabs)/feed"), 1400);
    } catch (e: any) {
      setError(e?.message || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  }, [title, description, category, urgency, coords, address, photo, refresh]);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.headerRow}>
        <TouchableOpacity testID="report-back" onPress={() => router.back()} style={styles.iconBtn}>
          <Feather name="arrow-left" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Report</Text>
        <View style={{ width: 44 }} />
      </View>

      <KeyboardAwareScrollView contentContainerStyle={styles.scroll} bottomOffset={20}>
        {/* Photo picker */}
        <View style={styles.section}>
          <Text style={styles.label}>Photo</Text>
          {photo ? (
            <View style={styles.photoBox}>
              <Image source={{ uri: photo }} style={styles.photo} />
              <TouchableOpacity testID="report-remove-photo" style={styles.photoRemove} onPress={() => setPhoto(null)}>
                <Feather name="x" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.photoButtons}>
              <TouchableOpacity testID="report-camera" style={styles.photoBtn} onPress={() => pickImage("camera")}>
                <Feather name="camera" size={20} color={colors.primary} />
                <Text style={styles.photoBtnText}>Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity testID="report-gallery" style={styles.photoBtn} onPress={() => pickImage("library")}>
                <Feather name="image" size={20} color={colors.primary} />
                <Text style={styles.photoBtnText}>Gallery</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Title */}
        <View style={styles.section}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            testID="report-title-input"
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Short headline (e.g., Oil spill near river)"
            placeholderTextColor={colors.textFaint}
          />
        </View>

        {/* Description + AI */}
        <View style={styles.section}>
          <View style={styles.rowBetween}>
            <Text style={styles.label}>Description</Text>
            <TouchableOpacity testID="report-ai-classify" style={styles.aiBtn} onPress={runClassify} disabled={classifying}>
              {classifying ? <ActivityIndicator size="small" color="#fff" /> : <Feather name="zap" size={14} color="#fff" />}
              <Text style={styles.aiBtnText}>{classifying ? "AI…" : "AI suggest"}</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            testID="report-description-input"
            style={[styles.input, { minHeight: 110, textAlignVertical: "top" }]}
            value={description}
            onChangeText={setDescription}
            placeholder="What did you see? When? Any wildlife affected?"
            placeholderTextColor={colors.textFaint}
            multiline
          />
        </View>

        {/* Category */}
        <View style={styles.section}>
          <Text style={styles.label}>Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
            {CATS.map((c) => {
              const active = category === c;
              return (
                <TouchableOpacity
                  key={c}
                  testID={`report-cat-${c}`}
                  onPress={() => setCategory(c)}
                  style={[styles.catChip, active && { backgroundColor: categories[c].color, borderColor: categories[c].color }]}
                  activeOpacity={0.85}
                >
                  <Text style={[styles.catChipText, active && { color: "#fff" }]}>
                    {categories[c].emoji}  {categories[c].label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Urgency */}
        <View style={styles.section}>
          <Text style={styles.label}>Urgency</Text>
          <View style={styles.urgencyRow}>
            {URGENCIES.map((u) => {
              const active = urgency === u;
              return (
                <TouchableOpacity
                  key={u}
                  testID={`report-urg-${u}`}
                  onPress={() => setUrgency(u)}
                  style={[styles.urgBtn, { borderColor: urgencyMeta[u].color }, active && { backgroundColor: urgencyMeta[u].color }]}
                  activeOpacity={0.85}
                >
                  <Text style={[styles.urgText, active && { color: "#fff" }]}>{urgencyMeta[u].label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Location */}
        <View style={styles.section}>
          <Text style={styles.label}>Location</Text>
          <View style={styles.locBox}>
            <Feather name="map-pin" size={18} color={colors.primary} />
            <View style={{ flex: 1 }}>
              {coords ? (
                <>
                  <Text style={styles.locText}>{address || "Current location"}</Text>
                  <Text style={styles.locSub}>{coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}</Text>
                </>
              ) : (
                <Text style={styles.locText}>Detecting location…</Text>
              )}
            </View>
          </View>
        </View>

        {error ? <Text testID="report-error" style={styles.error}>{error}</Text> : null}
        {success ? <Text testID="report-success" style={styles.success}>{success}</Text> : null}

        <TouchableOpacity
          testID="report-submit"
          style={[styles.submit, submitting && { opacity: 0.6 }]}
          onPress={submit}
          disabled={submitting}
        >
          {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>Send report 🌿</Text>}
        </TouchableOpacity>
        <View style={{ height: 120 }} />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  headerTitle: { fontSize: 20, fontWeight: "900", color: colors.text },
  iconBtn: { width: 44, height: 44, borderRadius: 999, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", ...shadow.card },
  scroll: { padding: spacing.xl, gap: spacing.lg },
  section: { gap: 8 },
  label: { fontSize: 12, fontWeight: "800", color: colors.textMuted, textTransform: "uppercase", letterSpacing: 0.6 },
  input: {
    backgroundColor: "#fff", borderRadius: radius.lg, borderWidth: 2, borderColor: colors.border,
    paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, color: colors.text,
  },
  photoBox: { position: "relative", borderRadius: 20, overflow: "hidden" },
  photo: { width: "100%", height: 220, backgroundColor: colors.border },
  photoRemove: { position: "absolute", top: 12, right: 12, backgroundColor: "rgba(0,0,0,0.5)", width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  photoButtons: { flexDirection: "row", gap: 12 },
  photoBtn: {
    flex: 1, backgroundColor: "#fff", borderRadius: 20, padding: 24, alignItems: "center", gap: 6,
    borderWidth: 2, borderColor: colors.primarySoft, borderStyle: "dashed",
  },
  photoBtnText: { fontWeight: "800", color: colors.primaryDark },
  rowBetween: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  aiBtn: { flexDirection: "row", gap: 6, alignItems: "center", backgroundColor: colors.accent, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 },
  aiBtnText: { color: "#fff", fontSize: 12, fontWeight: "900" },
  chipsRow: { gap: 8, paddingVertical: 4 },
  catChip: {
    height: 40, paddingHorizontal: 16, borderRadius: 999, backgroundColor: "#fff",
    borderWidth: 2, borderColor: "transparent", flexShrink: 0,
    alignItems: "center", justifyContent: "center", ...shadow.card,
  },
  catChipText: { fontSize: 13, fontWeight: "800", color: colors.text },
  urgencyRow: { flexDirection: "row", gap: 8 },
  urgBtn: { flex: 1, paddingVertical: 12, borderRadius: 999, borderWidth: 2, alignItems: "center", backgroundColor: "#fff" },
  urgText: { fontWeight: "900", color: colors.text, fontSize: 13 },
  locBox: { flexDirection: "row", gap: 12, alignItems: "center", backgroundColor: "#fff", padding: 14, borderRadius: 18, ...shadow.card },
  locText: { fontSize: 14, fontWeight: "800", color: colors.text },
  locSub: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  error: { color: colors.danger, fontWeight: "700" },
  success: { color: colors.primaryDark, fontWeight: "800", backgroundColor: colors.primarySoft, padding: 12, borderRadius: 12 },
  submit: { backgroundColor: colors.primary, borderRadius: 999, paddingVertical: 18, alignItems: "center", ...shadow.float, marginTop: spacing.md },
  submitText: { color: "#fff", fontSize: 17, fontWeight: "900" },
});
