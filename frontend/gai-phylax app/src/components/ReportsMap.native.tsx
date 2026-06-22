// Native-only map component (iOS/Android). On web the .web.tsx stub is used.
import React from "react";
import { View, StyleSheet, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { colors, categories, urgencyMeta } from "@/src/theme";

export default function NativeReportsMap({
  reports,
  userLoc,
  onMarkerPress,
}: {
  reports: any[];
  userLoc: { lat: number; lng: number } | null;
  onMarkerPress: (id: string) => void;
}) {
  const region = userLoc
    ? { latitude: userLoc.lat, longitude: userLoc.lng, latitudeDelta: 0.2, longitudeDelta: 0.2 }
    : { latitude: 19.4326, longitude: -99.1332, latitudeDelta: 30, longitudeDelta: 30 };

  return (
    <MapView style={StyleSheet.absoluteFill} initialRegion={region} showsUserLocation showsMyLocationButton={false}>
      {reports.map((r) => (
        <Marker
          key={r.report_id}
          coordinate={{ latitude: r.latitude, longitude: r.longitude }}
          onPress={() => onMarkerPress(r.report_id)}
        >
          <View style={[styles.marker, { backgroundColor: urgencyMeta[r.urgency]?.color || colors.primary }]}>
            <Text style={styles.markerEmoji}>{categories[r.category]?.emoji || "📍"}</Text>
          </View>
        </Marker>
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  marker: {
    width: 40, height: 40, borderRadius: 999,
    borderWidth: 3, borderColor: "#fff",
    alignItems: "center", justifyContent: "center",
    shadowColor: "#000", shadowOpacity: 0.25, shadowRadius: 8, shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  markerEmoji: { fontSize: 18 },
});
