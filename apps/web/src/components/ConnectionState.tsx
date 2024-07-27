import { useEffect, useState } from "react";
import { socket } from "../socket";

export function ConnectionState() {
  const [isConnected, setIsConnected] = useState<boolean>(socket.connected);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    socket.on("connect", onConnect);

    return () => {
      socket.off("connect", onConnect);
    };
  }, []);

  useEffect(() => {
    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  useEffect(() => {
    setIsConnected(socket.connected);
  }, [socket.connected]);

  return (
    <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
      Is Connected:{" "}
      <span className="font-normal text-gray-700 dark:text-gray-400 whitespace-pre">
        {isConnected.toString()}
      </span>
    </h5>
  );
}
