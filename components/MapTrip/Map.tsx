import React, { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import RoutineMachine from "./RoutineMachine";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  iconUrl: "/leaflet/marker-icon.png",
  shadowUrl: "/leaflet/marker-shadow.png",
});

type MapProps = {
  originAddress: string;
  originPostalCode: string;
  destinationAddress: string;
  destinationPostalCode: string;
};

const Map: React.FC<MapProps> = ({ originAddress, originPostalCode, destinationAddress, destinationPostalCode }) => {
  const [origin, setOrigin] = useState<[number, number] | null>(null);
  const [destination, setDestination] = useState<[number, number] | null>(null);

  const geocode = async (address: string, postalCode: string): Promise<[number, number] | null> => {
    const res = await fetch(
      `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(address)}&postcode=${encodeURIComponent(
        postalCode
      )}`
    );
    const data = await res.json();
    if (data && data.features && data.features.length > 0) {
      const [lon, lat] = data.features[0].geometry.coordinates;
      return [lat, lon];
    }
    return null;
  };

  useEffect(() => {
    async function fetchCoordinates() {
      const originCoords = await geocode(originAddress, originPostalCode);
      setOrigin(originCoords);

      const destinationCoords = await geocode(destinationAddress, destinationPostalCode);
      setDestination(destinationCoords);
    }

    fetchCoordinates().catch(console.error);
  }, [originAddress, originPostalCode, destinationAddress, destinationPostalCode]);

  return (
    <MapContainer center={origin} zoom={13} style={{ height: "50vh", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap contributors" />
      {origin && destination && (
        <RoutineMachine originAddress={origin} destinationAddress={destination} />
      )}
    </MapContainer>

  );
};

export default Map;
