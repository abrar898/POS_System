"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";

// Fix for default marker icons in Leaflet with React
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom icons for Restaurant, Rider, and Customer
const RestaurantIcon = L.divIcon({
  html: `<div style="background: white; width: 40px; height: 40px; border-radius: 50%; display: flex; alignItems: center; justifyContent: center; font-size: 20px; box-shadow: 0 4px 10px rgba(0,0,0,0.15); border: 2px solid #ef4444">🍔</div>`,
  className: "custom-div-icon",
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

const RiderIcon = L.divIcon({
  html: `<div style="background: #3b82f6; width: 44px; height: 44px; border-radius: 50%; display: flex; alignItems: center; justifyContent: center; font-size: 22px; box-shadow: 0 4px 12px rgba(59,130,246,0.5); border: 2px solid white">🛵</div>`,
  className: "custom-div-icon",
  iconSize: [44, 44],
  iconAnchor: [22, 22],
});

const CustomerIcon = L.divIcon({
  html: `<div style="background: #ef4444; width: 44px; height: 44px; border-radius: 50%; display: flex; alignItems: center; justifyContent: center; font-size: 22px; box-shadow: 0 4px 12px rgba(239,68,68,0.5); border: 2px solid white">📍</div>`,
  className: "custom-div-icon",
  iconSize: [44, 44],
  iconAnchor: [22, 22],
});

interface LeafletMapProps {
  restaurantPos: [number, number];
  riderPos?: [number, number];
  customerPos: [number, number];
  route?: [number, number][];
  zoom?: number;
  height?: string;
  className?: string;
}

// Component to handle map centering and updating
function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
}

export default function LeafletMap({
  restaurantPos,
  riderPos,
  customerPos,
  route,
  zoom = 13,
  height = "400px",
  className = "",
}: LeafletMapProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div style={{ height, background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "#64748b", fontSize: "14px" }}>Loading Map...</div>
      </div>
    );
  }

  const mapCenter = riderPos || restaurantPos;

  return (
    <div className={className} style={{ height, width: "100%", borderRadius: "16px", overflow: "hidden", position: "relative" }}>
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
      >
        <TileLayer
          url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
          attribution='&copy; Google Maps'
        />
        
        {/* Restaurant Marker */}
        <Marker position={restaurantPos} icon={RestaurantIcon}>
          <Popup>Restaurant</Popup>
        </Marker>

        {/* Rider Marker */}
        {riderPos && (
          <Marker position={riderPos} icon={RiderIcon}>
            <Popup>Rider is here</Popup>
          </Marker>
        )}

        {/* Customer Marker */}
        <Marker position={customerPos} icon={CustomerIcon}>
          <Popup>Customer Location</Popup>
        </Marker>

        {/* Route Polyline */}
        {route && route.length > 0 && (
          <Polyline positions={route} pathOptions={{ color: "#10b981", weight: 8, opacity: 0.9 }} />
        )}

        <MapUpdater center={mapCenter} />
      </MapContainer>
    </div>
  );
}
