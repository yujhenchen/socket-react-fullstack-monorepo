import { useEffect, useMemo, useState } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
import { socket } from "./socket";
import { ConnectionState } from "./components/ConnectionState";
import { ConnectionManager } from "./components/ConnectionManager";
import { MyForm } from "./components/MyForm";
import { AppCard } from "./components/AppCard";
import { Messages } from "./components/Messages";
import { AppDropdown } from "./components/AppDropdown";

function App() {
  const [isConnected, setIsConnected] = useState<boolean>(socket.connected); // the state is wrong, it shows false while staying in connection
  const [messages, setMessages] = useState<string[]>([]);
  const trends = useMemo(
    () => [
      "Micro Frontends",
      "WebAssembly (Wasm)",
      "Component-Driven Development (CDD)",
      "AI and Machine Learning Integration",
      "AI and Machine Learning Integration",
      "Server-Side Rendering (SSR) and Static Site Generation (SSG)",
    ],
    []
  );
  const [options] = useState<string[]>(trends);

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

  useEffect(() => {
    function onMessageEvent(value: string) {
      setMessages((previous) => [...previous, value]);
    }

    socket.on("receive_msg", onMessageEvent);

    return () => {
      socket.off("receive_msg", onMessageEvent);
    };
  }, [socket]); // TODO: should monitor what for receive_msg event

  return (
    <main className="container min-h-screen mx-auto grid gap-4">
      <AppCard>
        <ConnectionState isConnected={isConnected} />
        <ConnectionManager />
      </AppCard>

      <AppCard>
        <Messages messages={messages} />
        <MyForm />
      </AppCard>

      <AppCard>
        <AppDropdown items={options} />
      </AppCard>
    </main>
  );
}

export default App;
