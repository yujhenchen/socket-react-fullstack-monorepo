import { Dropdown } from "flowbite-react";

interface Props {
  items: string[];
}

export function AppDropdown({ items }: Props) {
  function handleOnClick() {}

  function handleOonChange() {}

  return (
    <Dropdown
      label="Dropdown button"
      dismissOnClick={false}
      onClick={handleOnClick}
      onChange={handleOonChange}
    >
      {items.map((item, index) => (
        <Dropdown.Item key={index}>{item}</Dropdown.Item>
      ))}
    </Dropdown>
  );
}
