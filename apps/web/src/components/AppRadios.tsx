import { Label, Radio } from "flowbite-react";
import { ChangeEvent, useEffect, useState } from "react";
import { socket } from "../socket";

interface Props {
  eventObj: {
    emit: string;
    receive: string;
  };
  options: { name: string; value: string }[];
  title: string;
}

export default function AppRadios({ eventObj, options, title }: Props) {
  const [selectedOption, setSelectedOption] = useState<string>(
    options[0].value ?? ""
  );

  useEffect(() => {
    socket.on(eventObj.receive, (value: string, status: string) => {
      if (eventObj.receive === "receive_room_selected_value") {
        console.log(status);
      }
      setSelectedOption(value);
    });
  }, [socket]);

  function handleOnChange(event: ChangeEvent<HTMLInputElement>) {
    setSelectedOption(event.target.value);
    try {
      socket.emit(eventObj.emit, event.target.value);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <fieldset className="font-normal text-gray-700 dark:text-gray-400 whitespace-pre">
      <legend className="mb-4">{title}</legend>
      {options.map((option, index) => (
        <div key={index} className="flex items-center gap-2">
          <Radio
            id="united-state"
            name={option.name}
            value={option.value}
            // defaultChecked
            checked={selectedOption === option.value}
            onChange={handleOnChange}
          />
          <Label htmlFor="united-state">{option.value}</Label>
        </div>
      ))}
    </fieldset>
  );
}
