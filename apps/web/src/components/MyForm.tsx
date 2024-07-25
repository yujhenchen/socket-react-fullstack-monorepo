import { FormEvent, useState } from "react";
import { socket } from "../socket";
import { Button, TextInput } from "flowbite-react";

export function MyForm() {
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
      setIsLoading(false);
      setValue("");
    } catch (error) {
      setIsLoading(false);
      if (error instanceof Error) setErrors(error);
      console.error(error);
    }
  }

  if (errors) return null;

  return (
    <form className="flex max-w-md gap-4" onSubmit={onSubmit}>
      <TextInput
        type="text"
        onChange={(e) => setValue(e.target.value)}
        value={value}
      />
      <Button type="submit" disabled={isLoading}>
        Submit
      </Button>
    </form>
  );
}
