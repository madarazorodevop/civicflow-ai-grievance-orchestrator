import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet's default icon path issues in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom colored icons based on risk/status
const createIcon = (color: string) => {
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

const icons = {
  SEVERE: createIcon('red'),
  MEDIUM: createIcon('orange'),
  LOW: createIcon('blue'),
  Resolved: createIcon('green')
};

interface ResponsiveMapProps {
  markers: any[];
  onMarkerClick: (id: string) => void;
  className?: string;
}

export function ResponsiveMap({ markers, onMarkerClick, className }: ResponsiveMapProps) {
  return (
    <MapContainer
      center={[11.1271, 78.6569]}
      zoom={7}
      className={className || "w-full h-full"}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers.map(m => (
        m.lat && m.lng ? (
          <Marker
            key={m.id}
            position={[m.lat, m.lng]}
            icon={m.status === 'Resolved' ? icons.Resolved : (icons as any)[m.riskLevel] || icons.LOW}
            eventHandlers={{ click: () => onMarkerClick(m.id) }}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <div className="mb-2 border-b pb-1">
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider block">Problem</span>
                  <h3 className="font-bold text-sm">{m.title}</h3>
                </div>
                <div className="flex flex-col gap-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Risk:</span>
                    <strong className={m.riskLevel === 'SEVERE' ? 'text-red-600' : m.riskLevel === 'MEDIUM' ? 'text-orange-600' : 'text-blue-600'}>
                      {m.riskLevel === 'SEVERE' ? '🔴 ' : m.riskLevel === 'MEDIUM' ? '🟠 ' : '🔵 '}{m.riskLevel}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Priority:</span>
                    <strong>{m.priority || m.riskLevel}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status:</span>
                    <strong>{m.status}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">ETA:</span>
                    <strong>{m.eta}</strong>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ) : null
      ))}
    </MapContainer>
  );
}
