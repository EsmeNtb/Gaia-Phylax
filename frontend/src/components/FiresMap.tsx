import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { FireSignal } from "../api/client";

type Props = {
  fires: FireSignal[];
};

function getFireColor(intensity: string) {
  if (intensity === "high") return "#ef4444";
  if (intensity === "medium") return "#facc15";
  if (intensity === "low") return "#22c55e";
  return "#38bdf8";
}

function getFireRadius(frp: number) {
  if (frp >= 10) return 11;
  if (frp >= 5) return 8;
  return 6;
}

export default function FiresMap({ fires }: Props) {
  return (
    <div className="map-shell">
      <MapContainer
        center={[19.4326, -99.1332]}
        zoom={3}
        minZoom={2}
        scrollWheelZoom
        className="fire-map"
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {fires.map((fire) => (
          <CircleMarker
            key={fire.id}
            center={[fire.latitude, fire.longitude]}
            radius={getFireRadius(Number(fire.frp))}
            pathOptions={{
              color: getFireColor(fire.fire_intensity),
              fillColor: getFireColor(fire.fire_intensity),
              fillOpacity: 0.68,
              weight: 2,
            }}
          >
            <Popup>
              <strong>{fire.fire_intensity.toUpperCase()} fire signal</strong>
              <br />
              FRP: {fire.frp}
              <br />
              Brightness: {fire.brightness}
              <br />
              Confidence: {fire.confidence}
              <br />
              {fire.daynight === "D" ? "Day detection" : "Night detection"}
              <br />
              {fire.detected_at_utc}
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}