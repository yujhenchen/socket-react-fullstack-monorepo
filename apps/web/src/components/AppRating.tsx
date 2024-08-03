import { Rating } from "flowbite-react";
import { useState } from "react";

const defaultFilledState = {
  first: false,
  second: false,
  third: false,
  forth: false,
  fifth: false,
};

export default function AppRating() {
  const [filledState, setFillState] = useState(defaultFilledState);
  return (
    <Rating size="lg">
      <Rating.Star filled={filledState.first} />
      <Rating.Star filled={filledState.second} />
      <Rating.Star filled={filledState.third} />
      <Rating.Star filled={filledState.forth} />
      <Rating.Star
        onMouseEnter={() =>
          setFillState({
            first: true,
            second: true,
            third: true,
            forth: true,
            fifth: true,
          })
        }
        onMouseLeave={() =>
          setFillState({
            first: true,
            second: true,
            third: true,
            forth: true,
            fifth: false,
          })
        }
        filled={filledState.fifth}
      />
    </Rating>
  );
}
