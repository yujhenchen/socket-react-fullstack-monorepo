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
    <div>
      <span>There are currently</span>
      <span>{count}</span>
      <span>people online</span>
    </div>
  );
}
