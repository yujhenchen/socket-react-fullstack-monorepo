import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";

export function AppMap() {
  const position = { lat: 43.2203, lng: 142.8635 };

  return (
    <APIProvider apiKey={import.meta.env.VITE_MAP_API_KEY}>
      <Map defaultCenter={position} defaultZoom={10}>
        <Marker position={position} />
      </Map>
    </APIProvider>
  );
}
