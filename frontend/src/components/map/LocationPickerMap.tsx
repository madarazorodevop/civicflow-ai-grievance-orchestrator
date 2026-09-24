import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import "leaflet/dist/leaflet.css";

// Fix Leaflet's default icon path issues in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function LocationMarker({ position, setPosition }: { position: any, setPosition: any }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  const map = useMap();
  
  const lat = position?.lat;
  const lng = position?.lng;

  useEffect(() => {
    if (lat && lng) {
      map.flyTo([lat, lng], 15, { animate: true, duration: 1.5 });
    }
  }, [lat, lng, map]);

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
}

export function LocationPickerMap({ lat, lng, onChange }: { lat: number|null, lng: number|null, onChange: (lat: number, lng: number) => void }) {
  const position = lat && lng ? { lat, lng } : null;

  return (
    <MapContainer
      center={position || [11.1271, 78.6569]}
      zoom={7}
      className="w-full h-64 rounded-xl z-0"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <LocationMarker position={position} setPosition={(p: any) => onChange(p.lat, p.lng)} />
    </MapContainer>
  );
}
