import {
  APIProvider,
  Map,
  MapMouseEvent,
  Marker,
} from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";
import { socket } from "../socket";

const defaultPosition = { lat: 43.2203, lng: 142.8635 };

type Position = typeof defaultPosition;

export function AppMap() {
  const [position, setPosition] = useState(defaultPosition);

  useEffect(() => {
    socket.on("receive_map_position", (value: Position) => setPosition(value));
  }, [socket]);

  function handleOnClick(event: MapMouseEvent) {
    console.log(event.detail.latLng);
    if (event.detail.latLng) setPosition(event.detail.latLng);
    try {
      socket.emit("map_position", event.detail.latLng);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <APIProvider apiKey={import.meta.env.VITE_MAP_API_KEY}>
      <Map
        defaultCenter={position}
        defaultZoom={10}
        onClick={handleOnClick}
        className="w-full h-full"
        gestureHandling={"greedy"}
        disableDefaultUI={false}
      >
        <Marker position={position} />
      </Map>
    </APIProvider>
  );
}
