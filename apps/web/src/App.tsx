import { useEffect, useMemo, useState } from "react";
import { socket } from "./socket";
import { ConnectionState } from "./components/ConnectionState";
import { ConnectionManager } from "./components/ConnectionManager";
import { MyForm } from "./components/MyForm";
import { AppCard } from "./components/AppCard";
import { Messages } from "./components/Messages";
import { AppSelect } from "./components/AppSelect";
import { AppCheckbox } from "./components/AppCheckbox";
import AppRadios from "./components/AppRadios";
import { AppTextarea } from "./components/AppTextarea";
import Counter from "./components/Counter";

function App() {
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
    socket.on("connect_error", (err) => {
      console.log(err);

      // the reason of the error, for example "xhr poll error"
      console.log(err.message);

      // some additional description, for example the status code of the initial HTTP response
      console.log(err.description);

      // some additional context, for example the XMLHttpRequest object
      console.log(err.context);
    });

    return () => {
      socket.off("connect_error");
    };
  }, []);

  const contentList = useMemo(
    () => [
      <>
        <ConnectionState />
        <ConnectionManager />
      </>,
      <Counter />,
      <>
        <Messages />
        <MyForm />
      </>,
      <AppSelect items={options} />,
      <AppCheckbox />,
      <AppRadios options={trends} />,
      <AppTextarea />,
    ],
    []
  );

  return (
    <main className="container min-h-screen mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 py-8">
      {contentList.map((content, index) => (
        <AppCard key={index}>{content}</AppCard>
      ))}
    </main>
  );
}

export default App;
