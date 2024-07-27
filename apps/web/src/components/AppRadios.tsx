import { Label, Radio } from "flowbite-react";
import { ChangeEvent, useEffect, useState } from "react";
import { socket } from "../socket";

interface Props {
  options: string[];
}

export default function AppRadios({ options }: Props) {
  const [selectedOption, setSelectedOption] = useState<string>(
    options[0] ?? ""
  );

  useEffect(() => {
    socket.on("receive_radio_selected_value", (value: string) =>
      setSelectedOption(value)
    );
  }, [socket]);

  function handleOnChange(event: ChangeEvent<HTMLInputElement>) {
    setSelectedOption(event.target.value);
    try {
      socket.emit("radio_selected_value", event.target.value);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <fieldset className="font-normal text-gray-700 dark:text-gray-400 whitespace-pre">
      <legend className="mb-4">Choose your favorite one</legend>
      {options.map((option, index) => (
        <div className="flex items-center gap-2">
          <Radio
            key={index}
            id="united-state"
            name="countries"
            value={option}
            // defaultChecked
            checked={selectedOption === option}
            onChange={handleOnChange}
          />
          <Label htmlFor="united-state">{option}</Label>
        </div>
      ))}
    </fieldset>
  );
}
