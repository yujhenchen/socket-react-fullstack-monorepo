import { Label, Radio } from "flowbite-react";

interface Props {
  options: string[];
}

export default function AppRadios({ options }: Props) {
  return (
    <fieldset className="font-normal text-gray-700 dark:text-gray-400 whitespace-pre">
      <legend className="mb-4">Choose your favorite topic</legend>
      {options.map((option) => (
        <div className="flex items-center gap-2">
          <Radio
            id="united-state"
            name="countries"
            value="USA"
            defaultChecked
          />
          <Label htmlFor="united-state">{option}</Label>
        </div>
      ))}
    </fieldset>
  );
}
