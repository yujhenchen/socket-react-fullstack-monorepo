import { Avatar, List } from "flowbite-react";
import { useEffect, useState } from "react";
import { socket } from "../socket";

export function Messages() {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    function onMessageEvent(value: string) {
      setMessages((previous) => [...previous, value]);
    }

    socket.on("receive_msg", onMessageEvent);

    return () => {
      socket.off("receive_msg", onMessageEvent);
    };
  }, [socket]);

  return (
    <List
      unstyled
      className="max-w-md divide-y divide-gray-200 dark:divide-gray-700 max-h-56 overflow-y-scroll"
    >
      {messages.map((message, index) => (
        <List.Item
          key={index}
          className="pb-3 sm:pb-4 flex items-center space-x-4 rtl:space-x-reverse"
        >
          <Avatar img="" alt="Neil image" rounded size="sm" />
          <p className="truncate text-sm text-gray-500 dark:text-gray-400">
            {message}
          </p>
        </List.Item>
      ))}
    </List>
  );
}
