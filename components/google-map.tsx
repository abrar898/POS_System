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

  const restaurantIcon = {
    url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
  };

  const customerIcon = {
    url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
  };

  const riderIcon = {
    url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
  };

  if (!isLoaded) return <div className="w-full bg-slate-50 animate-pulse" style={{ height }} />;

  return (
    <div style={{ height, width: "100%" }}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={riderPos ? { lat: riderPos[0], lng: riderPos[1] } : center}
        zoom={zoom}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
        <Marker position={{ lat: restaurantPos[0], lng: restaurantPos[1] }} icon={restaurantIcon} />
        <Marker position={{ lat: customerPos[0], lng: customerPos[1] }} icon={customerIcon} />
        
        {riderPos && (
          <Marker position={{ lat: riderPos[0], lng: riderPos[1] }} icon={riderIcon} zIndex={999} />
        )}

        {path.length > 0 && (
          <Polyline
            path={path}
            options={{
              strokeColor: "#10b981", // Emerald 500
              strokeOpacity: 1.0,
              strokeWeight: 4,
            }}
          />
        )}
      </GoogleMap>
    </div>
  );
}
