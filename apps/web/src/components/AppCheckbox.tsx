import { Checkbox, Label } from "flowbite-react";
import { ChangeEvent, useEffect, useState } from "react";
import { socket } from "../socket";

export function AppCheckbox() {
  const [isChecked, setIsChecked] = useState<boolean>(false);

  useEffect(() => {
    socket.on("receive_dropdown_checkbox_is_checked", (checked: boolean) =>
      setIsChecked(checked)
    );
  }, [socket]);

  function handleOnChange(event: ChangeEvent<HTMLInputElement>) {
    setIsChecked(event.target.checked);
    try {
      socket.emit("checkbox_is_checked", event.target.checked);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Checkbox id="remember" checked={isChecked} onChange={handleOnChange} />
      <Label htmlFor="remember">Remember no one</Label>
    </div>
  );
}
