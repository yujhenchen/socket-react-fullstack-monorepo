import { FormEvent, useState } from "react";
// import { socket } from "../socket";

export function MyForm({ socket }) {
  const [value, setValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Error | null>(null);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    try {
      socket.emit(
        "send_msg",
        value
        //   (err, response) => {
        //   if (err) {
        //     // the other side did not acknowledge the event in the given delay
        //     console.error(err);
        //   } else {
        //     console.log(response);
        //     setIsLoading(false);
        //   }
        // }
      );
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
