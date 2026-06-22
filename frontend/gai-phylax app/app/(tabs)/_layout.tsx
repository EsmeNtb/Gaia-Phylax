import React from "react";
import { Tabs } from "expo-router";
import { View, Text, StyleSheet, TouchableOpacity, Platform } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { colors, shadow } from "@/src/theme";

function CustomTabBar({ state, navigation }: any) {
  const insets = useSafeAreaInsets();
  const ICONS: Record<string, string> = {
    map: "map",
    feed: "list",
    report: "plus",
    pets: "heart",
    profile: "user",
  };
  return (
    <View style={[styles.tabWrap, { bottom: Math.max(insets.bottom, 12) }]}>
      <View style={styles.tabBar} testID="bottom-tab-bar">
        {state.routes.map((route: any, idx: number) => {
          const focused = state.index === idx;
          const isReport = route.name === "report";
          if (isReport) {
            return (
              <TouchableOpacity
                key={route.key}
                testID={`tab-${route.name}`}
                activeOpacity={0.85}
                onPress={() => router.push("/(tabs)/report")}
                style={styles.fab}
              >
                <Feather name="plus" size={26} color="#fff" />
              </TouchableOpacity>
            );
          }
          return (
            <TouchableOpacity
              key={route.key}
              testID={`tab-${route.name}`}
              style={styles.tabItem}
              activeOpacity={0.7}
              onPress={() => {
                const event = navigation.emit({ type: "tabPress", target: route.key, canPreventDefault: true });
                if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
              }}
            >
              <Feather name={ICONS[route.name] as any} size={22} color={focused ? colors.primary : colors.textFaint} />
              <Text style={[styles.tabLabel, { color: focused ? colors.primary : colors.textFaint }]}>
                {route.name === "map" ? "Map" : route.name === "feed" ? "Feed" : route.name === "pets" ? "Pets" : "Me"}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen name="map" />
      <Tabs.Screen name="feed" />
      <Tabs.Screen name="report" options={{ tabBarStyle: { display: "none" } }} />
      <Tabs.Screen name="pets" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabWrap: {
    position: "absolute", left: 16, right: 16,
  },
  tabBar: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-around",
    backgroundColor: "#fff",
    borderRadius: 999,
    height: 68,
    paddingHorizontal: 8,
    ...shadow.float,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 24,
  },
  tabItem: { flex: 1, alignItems: "center", justifyContent: "center", gap: 2 },
  tabLabel: { fontSize: 11, fontWeight: "800" },
  fab: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: "center", justifyContent: "center",
    marginTop: Platform.OS === "ios" ? -10 : -16,
    shadowColor: colors.primary,
    shadowOpacity: 0.4, shadowRadius: 16, shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
});
