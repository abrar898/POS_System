"use client";

import React, { useMemo } from "react";
import { GoogleMap, useJsApiLoader, Marker, Polyline } from "@react-google-maps/api";

interface MapProps {
  restaurantPos: [number, number]; // [lat, lng]
  customerPos: [number, number];   // [lat, lng]
  riderPos?: [number, number];     // [lat, lng]
  route?: [number, number][];      // array of [lat, lng]
  height?: string;
  zoom?: number;
}

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

export default function GoogleMapComponent({
  restaurantPos,
  customerPos,
  riderPos,
  route,
  height = "100%",
  zoom = 15,
}: MapProps) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || "",
  });

  const center = useMemo(() => ({ lat: restaurantPos[0], lng: restaurantPos[1] }), [restaurantPos]);

  // Convert route array of [lat, lng] to [{lat, lng}]
  const path = useMemo(() => {
    if (!route) return [];
    return route.map(pos => ({ lat: pos[0], lng: pos[1] }));
  }, [route]);

  if (!isLoaded) return <div className="w-full bg-slate-50 animate-pulse" style={{ height }} />;

  // Custom Icons using Data URIs (Emojis like the Leaflet version)
  // We define these here because they require the 'google' object to be loaded
  const restaurantIcon = {
    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
        <circle cx="20" cy="20" r="18" fill="white" stroke="#ef4444" stroke-width="2"/>
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="20">🍔</text>
      </svg>
    `),
    scaledSize: new google.maps.Size(40, 40),
    anchor: new google.maps.Point(20, 20),
  };

  const customerIcon = {
    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44">
        <circle cx="22" cy="22" r="20" fill="#ef4444" stroke="white" stroke-width="2"/>
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="22">📍</text>
      </svg>
    `),
    scaledSize: new google.maps.Size(44, 44),
    anchor: new google.maps.Point(22, 22),
  };

  const riderIcon = {
    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44">
        <circle cx="22" cy="22" r="20" fill="#3b82f6" stroke="white" stroke-width="2"/>
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="22">🛵</text>
      </svg>
    `),
    scaledSize: new google.maps.Size(44, 44),
    anchor: new google.maps.Point(22, 22),
  };

  const mapCenter = riderPos ? { lat: riderPos[0], lng: riderPos[1] } : center;

  return (
    <div style={{ height, width: "100%" }}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={mapCenter}
        zoom={zoom}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
          ],
        }}
      >
        <Marker position={center} icon={restaurantIcon} />
        <Marker position={{ lat: customerPos[0], lng: customerPos[1] }} icon={customerIcon} />
        
        {riderPos && (
          <Marker 
            position={{ lat: riderPos[0], lng: riderPos[1] }} 
            icon={riderIcon} 
            zIndex={999}
          />
        )}

        {path.length > 0 && (
          <Polyline
            path={path}
            options={{
              strokeColor: "#6366f1", // Indigo 500 to match the route
              strokeOpacity: 0.8,
              strokeWeight: 6,
            }}
          />
        )}
      </GoogleMap>
    </div>
  );
}
