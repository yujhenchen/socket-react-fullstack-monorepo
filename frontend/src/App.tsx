import { useEffect, useState } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
// import "./App.css";
import { socket } from "./socket";
import { ConnectionState } from "./components/ConnectionState";
import { ConnectionManager } from "./components/ConnectionManager";
// import { Events } from "./components/Events";
// import { MyForm } from "./components/MyForm";

function App() {
  const [isConnected, setIsConnected] = useState<boolean>(socket.connected);
  // const [fooEvents, setFooEvents] = useState<string[]>([]);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    // function onFooEvent(value: string) {
    //   setFooEvents((previous) => [...previous, value]);
    // }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    // socket.on("foo", onFooEvent);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      // socket.off("foo", onFooEvent);
    };
  }, []);

  return (
    <div className="App">
      <ConnectionState isConnected={isConnected} />
      {/* <Events events={fooEvents} /> */}
      <ConnectionManager />
      {/* <MyForm /> */}
    </div>
  );
}

export default App;
