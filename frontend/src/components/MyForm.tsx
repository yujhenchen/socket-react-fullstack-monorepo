import { FormEvent, useState } from "react";
import { socket } from "../socket";

export function MyForm() {
  const [value, setValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Error | null>(null);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    try {
      socket.timeout(500).emit("send_msg", value, () => {
        setIsLoading(false);
      });
    } catch (error) {
      setIsLoading(false);
      if (error instanceof Error) setErrors(error);
      console.error(error);
    }
  }

  if (errors) return null;

  return (
    <form onSubmit={onSubmit}>
      <input type="text" onChange={(e) => setValue(e.target.value)} />
      <button type="submit" disabled={isLoading}>
        Submit
      </button>
    </form>
  );
}
