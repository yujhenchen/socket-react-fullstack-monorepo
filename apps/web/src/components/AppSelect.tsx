import { ChangeEvent, useEffect, useState } from "react";
import { socket } from "../socket";
import { Select } from "flowbite-react";

interface Props {
  options: { name: string; value: string }[];
}

export function AppSelect({ options }: Props) {
  const [selectedValue, setSelectedValue] = useState<string>("");

  useEffect(() => {
    socket.on("receive_dropdown_selected_value", (value: string) =>
      setSelectedValue(value)
    );
  }, [socket]);

  function handleOnChange(event: ChangeEvent<HTMLSelectElement>) {
    setSelectedValue(event.target.value);
    try {
      socket.emit("dropdown_selected_value", event.target.value);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Select value={selectedValue} onChange={handleOnChange}>
      {options.map((option, index) => (
        <option key={index} value={option.value}>
          {option.value}
        </option>
      ))}
    </Select>
  );
}
