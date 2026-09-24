"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icons in Leaflet with Next.js
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  title: string;
  category: string;
  priority: string;
}

interface ResponsiveMapProps {
  markers: MapMarker[];
  center?: [number, number];
  zoom?: number;
  onMarkerClick?: (id: string) => void;
  className?: string;
}

function MapUpdater({ center, zoom }: { center?: [number, number]; zoom?: number }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom || map.getZoom());
    }
  }, [center, zoom, map]);
  return null;
}

export function ResponsiveMap({ markers, center = [40.7128, -74.0060], zoom = 13, onMarkerClick, className }: ResponsiveMapProps) {
  // Prevent SSR issues with Leaflet
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <div className={`bg-gray-100 flex items-center justify-center ${className}`}>Loading map...</div>;

  return (
    <div className={`w-full h-full relative z-0 ${className}`}>
      <MapContainer 
        center={center} 
        zoom={zoom} 
        scrollWheelZoom={true} 
        className="w-full h-full"
        zoomControl={false} // We can add custom zoom control if needed
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapUpdater center={center} zoom={zoom} />
        
        {markers.map((marker) => (
          <Marker 
            key={marker.id} 
            position={[marker.lat, marker.lng]}
            eventHandlers={{
              click: () => onMarkerClick && onMarkerClick(marker.id),
            }}
          >
            <Popup>
              <div className="flex flex-col gap-1 min-w-[150px]">
                <span className="font-bold">{marker.id}</span>
                <span className="text-sm">{marker.title}</span>
                <span className="text-xs bg-gray-100 px-1 py-0.5 rounded w-fit">{marker.category}</span>
                <span className={`text-xs font-bold ${marker.priority === 'HIGH' ? 'text-red-600' : 'text-orange-600'}`}>
                  {marker.priority}
                </span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
