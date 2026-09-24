import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Layers } from "lucide-react";

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
  const [mapType, setMapType] = useState<'normal' | 'satellite'>('normal');

  return (
    <div className={`relative ${className || "w-full h-full"}`}>
      {/* Premium Floating Map Toggle */}
      <div className="absolute top-4 right-4 z-[1000] bg-black/60 backdrop-blur-xl p-1.5 rounded-2xl border border-white/20 shadow-2xl flex items-center gap-1">
        <div className="pl-3 pr-2 flex items-center text-gray-400">
          <Layers className="w-4 h-4" />
        </div>
        <button
          onClick={() => setMapType('normal')}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${mapType === 'normal' ? 'bg-white text-black shadow-md' : 'text-gray-300 hover:text-white hover:bg-white/10'}`}
        >
          Street
        </button>
        <button
          onClick={() => setMapType('satellite')}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${mapType === 'satellite' ? 'bg-white text-black shadow-md' : 'text-gray-300 hover:text-white hover:bg-white/10'}`}
        >
          Satellite
        </button>
      </div>

      <MapContainer
        center={[11.1271, 78.6569]}
        zoom={7}
        className="w-full h-full"
        zoomControl={false}
      >
        {mapType === 'normal' ? (
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        ) : (
          <TileLayer
            attribution='&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
        )}
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
    </div>
  );
}
