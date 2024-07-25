import { Button } from "flowbite-react";
import { socket } from "../socket";

export function ConnectionManager() {
  function connect() {
    socket.connect();
  }

  function disconnect() {
    socket.disconnect();
  }

  return (
    <div className="flex gap-4">
      <Button onClick={connect}>Connect</Button>
      <Button onClick={disconnect}>Disconnect</Button>
    </div>
  );
}
