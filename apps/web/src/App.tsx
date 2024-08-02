import { useEffect, useMemo } from "react";
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
import { AppMap } from "./components/AppMap";

const trends = [
  "Micro Frontends",
  "WebAssembly (Wasm)",
  "Component-Driven Development (CDD)",
  "AI and Machine Learning Integration",
  "AI and Machine Learning Integration",
  "Server-Side Rendering (SSR) and Static Site Generation (SSG)",
];

function App() {
  useEffect(() => {
    socket.on("connect_error", (err) => {
      console.log(err);

      // the reason of the error, for example "xhr poll error"
      console.log(err.message);

      /*
      // some additional description, for example the status code of the initial HTTP response
      console.log(err.description);

      // some additional context, for example the XMLHttpRequest object
      console.log(err.context);
      */
    });

    return () => {
      socket.off("connect_error");
    };
  }, []);

  const contentList = useMemo(
    () => [
      <>
        <Messages />
        <MyForm />
      </>,
      <AppSelect items={trends} />,
      <AppCheckbox />,
      <AppRadios options={trends} />,
      <AppTextarea />,
      <>A random thing</>,
    ],
    [trends]
  );

  return (
    <main className="container min-h-screen mx-auto py-8 flex flex-col gap-8">
      <div className="flex place-content-between p-4">
        <ConnectionState />
        <ConnectionManager />
        <Counter />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {contentList.map((content, index) => (
          <AppCard key={index}>{content}</AppCard>
        ))}
      </div>

      <AppCard styleClassName="w-full h-[50vh]">
        <AppMap />
      </AppCard>
    </main>
  );
}

export default App;
