import React, { useCallback, useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { router } from "expo-router";
import { Feather, AntDesign } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";

import { useAuth } from "@/src/auth";
import { colors, spacing, radius, shadow } from "@/src/theme";

export default function Login() {
  const { signIn, googleSignIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = useCallback(async () => {
    setError(null);
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }
    try {
      setLoading(true);
      await signIn(email.trim(), password);
      router.replace("/(tabs)/map");
    } catch (e: any) {
      setError(e?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }, [email, password, signIn]);

  const onGoogle = useCallback(async () => {
    setError(null);
    try {
      setGoogleLoading(true);
      const redirectUrl = Platform.OS === "web"
        ? (typeof window !== "undefined" ? window.location.origin + "/" : "")
        : Linking.createURL("auth");
      const authUrl = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;

      if (Platform.OS === "web") {
        if (typeof window !== "undefined") window.location.href = authUrl;
        return;
      }
      const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUrl);
      if (result.type !== "success" || !result.url) return;
      // Parse session_id from URL (hash or query)
      const u = result.url;
      const m = u.match(/[#?&]session_id=([^&]+)/);
      if (!m) {
        setError("No session_id returned");
        return;
      }
      const sid = decodeURIComponent(m[1]);
      await googleSignIn(sid);
      router.replace("/(tabs)/map");
    } catch (e: any) {
      setError(e?.message || "Google login failed");
    } finally {
      setGoogleLoading(false);
    }
  }, [googleSignIn]);

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scroll}
        bottomOffset={20}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity testID="login-back" onPress={() => router.back()} style={styles.back}>
          <Feather name="arrow-left" size={22} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.emoji}>🌱</Text>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.sub}>Your eco companions miss you</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            testID="login-email-input"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="you@earth.com"
            autoCapitalize="none"
            keyboardType="email-address"
            placeholderTextColor={colors.textFaint}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            testID="login-password-input"
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry
            placeholderTextColor={colors.textFaint}
          />

          {error ? (
            <Text testID="login-error" style={styles.error}>{error}</Text>
          ) : null}

          <TouchableOpacity
            testID="login-submit-button"
            style={[styles.primaryBtn, loading && { opacity: 0.6 }]}
            disabled={loading}
            onPress={onSubmit}
          >
            <Text style={styles.primaryBtnText}>{loading ? "Logging in…" : "Log in"}</Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.line} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.line} />
          </View>

          <TouchableOpacity
            testID="login-google-button"
            style={[styles.googleBtn, googleLoading && { opacity: 0.6 }]}
            onPress={onGoogle}
            disabled={googleLoading}
          >
            <AntDesign name="google" size={18} color={colors.text} />
            <Text style={styles.googleText}>{googleLoading ? "Opening Google…" : "Continue with Google"}</Text>
          </TouchableOpacity>

          <TouchableOpacity testID="login-go-signup" style={styles.link} onPress={() => router.replace("/(auth)/signup")}>
            <Text style={styles.linkText}>New here? <Text style={{ color: colors.primaryDark, fontWeight: "800" }}>Create an account</Text></Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.xl, gap: spacing.lg },
  back: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  header: { gap: 4, marginTop: spacing.sm },
  emoji: { fontSize: 40 },
  title: { fontSize: 32, fontWeight: "900", color: colors.text, letterSpacing: -0.8 },
  sub: { fontSize: 15, color: colors.textMuted },
  form: { gap: spacing.md, marginTop: spacing.md },
  label: { fontSize: 12, fontWeight: "800", color: colors.textMuted, textTransform: "uppercase", letterSpacing: 0.6 },
  input: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 2, borderColor: colors.border,
    paddingHorizontal: 16, paddingVertical: 14,
    fontSize: 16, color: colors.text,
  },
  primaryBtn: {
    backgroundColor: colors.primary, borderRadius: 999, paddingVertical: 16,
    alignItems: "center", justifyContent: "center", marginTop: spacing.sm,
    ...shadow.float,
  },
  primaryBtnText: { color: "#fff", fontSize: 17, fontWeight: "900" },
  divider: { flexDirection: "row", alignItems: "center", gap: 12, marginVertical: spacing.sm },
  line: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: { color: colors.textFaint, fontSize: 12, fontWeight: "700" },
  googleBtn: {
    flexDirection: "row", gap: 10, alignItems: "center", justifyContent: "center",
    backgroundColor: colors.surface, borderRadius: 999, paddingVertical: 14,
    borderWidth: 1, borderColor: colors.border, ...shadow.card,
  },
  googleText: { fontSize: 15, fontWeight: "800", color: colors.text },
  link: { alignItems: "center", marginTop: spacing.md },
  linkText: { color: colors.textMuted, fontSize: 14 },
  error: { color: colors.danger, fontSize: 13, fontWeight: "700" },
});
