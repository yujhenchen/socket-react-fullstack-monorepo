import { Label, Textarea } from "flowbite-react";
import { ChangeEvent, useEffect, useState } from "react";
import { socket } from "../socket";

export function AppTextarea() {
  const [text, setText] = useState<string>("");

  useEffect(() => {
    socket.on("receive_textarea_value", (value: string) => setText(value));
  }, [socket]);

  function handleOnChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setText(event.target.value);
    try {
      socket.emit("textarea_value", event.target.value);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="max-w-md">
      <div className="mb-2 block">
        <Label htmlFor="comment" value="Your message" />
      </div>
      <Textarea
        id="comment"
        placeholder="Leave a comment..."
        // required
        rows={4}
        value={text}
        onChange={handleOnChange}
      />
    </div>
  );
}
