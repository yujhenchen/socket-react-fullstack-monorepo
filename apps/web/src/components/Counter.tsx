import { useEffect, useState } from "react";
import { socket } from "../socket";

export default function Counter() {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    socket.on("receive_online_people_count", (value: number) =>
      setCount(value)
    );
  }, [socket]);
  return (
    <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white flex flex-col">
      <span>There are currently:</span>
      <span className="font-normal text-gray-700 dark:text-gray-400 whitespace-pre">
        {count}
      </span>
      <span>people online</span>
    </h5>
  );
}
