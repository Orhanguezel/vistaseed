"use client";

import * as React from "react";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api";
import type { PublicDealer } from "./types";

const containerStyle = {
  width: "100%",
  height: "550px",
  borderRadius: "1.5rem",
};

// VISTASEED PREMIUM DARK THEME
const mapOptions: google.maps.MapOptions = {
  styles: [
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    {
      featureType: "administrative.locality",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [{ color: "#263c3f" }],
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.fill",
      stylers: [{ color: "#6b9a76" }],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#38414e" }],
    },
    {
      featureType: "road",
      elementType: "geometry.stroke",
      stylers: [{ color: "#212a37" }],
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [{ color: "#9ca5b3" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [{ color: "#746855" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [{ color: "#1f2835" }],
    },
    {
      featureType: "road.highway",
      elementType: "labels.text.fill",
      stylers: [{ color: "#f3d19c" }],
    },
    {
      featureType: "transit",
      elementType: "geometry",
      stylers: [{ color: "#2f3948" }],
    },
    {
      featureType: "transit.station",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#17263c" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [{ color: "#515c6d" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.stroke",
      stylers: [{ color: "#17263c" }],
    },
  ],
  disableDefaultUI: true,
  zoomControl: true,
  scrollwheel: true,
};

const defaultCenter = {
  lat: 38.9637,
  lng: 35.2433, // Center of Turkey
};

export default function BayiMap({
  dealers,
  emptyLabel,
  mapHint,
  height = "550px",
  rounded = true,
}: {
  dealers: PublicDealer[];
  emptyLabel: string;
  mapHint: string;
  height?: string;
  rounded?: boolean;
}) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const [selectedDealer, setSelectedDealer] = React.useState<PublicDealer | null>(null);

  const markers = React.useMemo(() => {
    return dealers
      .filter((d) => d.latitude && d.longitude)
      .map((d) => ({
        ...d,
        position: {
          lat: parseFloat(d.latitude!),
          lng: parseFloat(d.longitude!),
        },
      }));
  }, [dealers]);

  if (!isLoaded) {
    return (
      <div 
        className="w-full bg-surface-alt animate-pulse flex items-center justify-center border border-border-soft"
        style={{ height, borderRadius: rounded ? "1.5rem" : "0" }}
      >
        <span className="text-muted-foreground font-medium italic opacity-40">Harita yükleniyor...</span>
      </div>
    );
  }

  return (
    <div 
      className="relative overflow-hidden border border-border-soft shadow-2xl group"
      style={{ height, borderRadius: rounded ? "1.5rem" : "0" }}
    >
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <div className="bg-navy-mid/90 backdrop-blur-md border border-white/10 px-4 py-2 rounded-2xl shadow-xl transition-all duration-500 group-hover:bg-brand/90">
          <p className="text-[10px] font-black uppercase tracking-widest text-brand group-hover:text-white transition-colors">{mapHint}</p>
          <p className="text-sm font-bold text-white mt-1">
            {dealers.length} {dealers.length === 1 ? "Kayıtlı Bayi" : "Noktada VistaSeed"}
          </p>
        </div>
      </div>

      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={markers.length > 0 ? markers[0].position : defaultCenter}
        zoom={markers.length > 0 ? 6 : 6}
        options={mapOptions}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={marker.position}
            onClick={() => setSelectedDealer(marker)}
            icon={{
              path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z",
              fillColor: "#006838",
              fillOpacity: 1,
              strokeWeight: 2,
              strokeColor: "#ffffff",
              scale: 1.5,
              labelOrigin: new google.maps.Point(12, -10),
            }}
          />
        ))}

        {selectedDealer && (
          <InfoWindow
            position={{
              lat: parseFloat(selectedDealer.latitude!),
              lng: parseFloat(selectedDealer.longitude!),
            }}
            onCloseClick={() => setSelectedDealer(null)}
          >
            <div className="p-2 min-w-[200px] text-navy">
              <h4 className="font-black text-sm uppercase tracking-tight mb-1">{selectedDealer.company_name}</h4>
              <p className="text-xs font-bold text-brand">{selectedDealer.city} / {selectedDealer.region}</p>
              {selectedDealer.phone && (
                <p className="text-[11px] mt-2 font-medium opacity-70">Tel: {selectedDealer.phone}</p>
              )}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}
