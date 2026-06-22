import React, { useCallback, useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";

import { useAuth } from "@/src/auth";
import { colors, spacing, radius, shadow } from "@/src/theme";

export default function SignUp() {
  const { signUp } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = useCallback(async () => {
    setError(null);
    if (!name.trim() || !email.trim() || password.length < 6) {
      setError("Please fill all fields (password ≥ 6 chars)");
      return;
    }
    try {
      setLoading(true);
      await signUp(email.trim(), password, name.trim());
      router.replace("/(tabs)/map");
    } catch (e: any) {
      setError(e?.message || "Sign up failed");
    } finally {
      setLoading(false);
    }
  }, [name, email, password, signUp]);

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scroll}
        bottomOffset={20}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity testID="signup-back" onPress={() => router.back()} style={styles.back}>
          <Feather name="arrow-left" size={22} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.emoji}>🐸</Text>
          <Text style={styles.title}>Join the guardians</Text>
          <Text style={styles.sub}>Your first eco pet is waiting</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Your name</Text>
          <TextInput
            testID="signup-name-input"
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Ada Lovelace"
            placeholderTextColor={colors.textFaint}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            testID="signup-email-input"
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
            testID="signup-password-input"
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="At least 6 characters"
            secureTextEntry
            placeholderTextColor={colors.textFaint}
          />

          {error ? <Text testID="signup-error" style={styles.error}>{error}</Text> : null}

          <TouchableOpacity
            testID="signup-submit-button"
            style={[styles.primaryBtn, loading && { opacity: 0.6 }]}
            disabled={loading}
            onPress={onSubmit}
          >
            <Text style={styles.primaryBtnText}>{loading ? "Creating account…" : "Create account"}</Text>
          </TouchableOpacity>

          <TouchableOpacity testID="signup-go-login" style={styles.link} onPress={() => router.replace("/(auth)/login")}>
            <Text style={styles.linkText}>Already a guardian? <Text style={{ color: colors.primaryDark, fontWeight: "800" }}>Log in</Text></Text>
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
  header: { gap: 4 },
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
  link: { alignItems: "center", marginTop: spacing.md },
  linkText: { color: colors.textMuted, fontSize: 14 },
  error: { color: colors.danger, fontSize: 13, fontWeight: "700" },
});
