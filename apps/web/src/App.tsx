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
import AppRating from "./components/AppRating";

const trends = [
  { name: "Micro Frontends", value: "Micro Frontends" },
  { name: "WebAssembly (Wasm)", value: "WebAssembly (Wasm)" },
  {
    name: "Component-Driven Development (CDD)",
    value: "Component-Driven Development (CDD)",
  },
  {
    name: "AI and Machine Learning Integration",
    value: "AI and Machine Learning Integration",
  },
  {
    name: "Server-Side Rendering (SSR) and Static Site Generation (SSG)",
    value: "Server-Side Rendering (SSR) and Static Site Generation (SSG)",
  },
];

const rooms = [
  { name: "Room A", value: "Room A" },
  { name: "Room B", value: "Room B" },
  { name: "Room C", value: "Room C" },
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
      <AppSelect options={trends} />,
      <AppCheckbox />,
      <AppRadios
        eventObj={{
          emit: "radio_selected_value",
          receive: "receive_radio_selected_value",
        }}
        options={trends}
        title="Choose your favorite one"
      />,
      <AppTextarea />,
      <AppRating />,
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

      <div>
        <AppRadios
          eventObj={{
            emit: "room_selected_value",
            receive: "receive_room_selected_value",
          }}
          options={rooms}
          title="Choose a room"
        />
        ,
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
