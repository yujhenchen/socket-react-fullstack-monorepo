import { Rating } from "flowbite-react";
import { useState } from "react";

const defaultFilledState = [false, false, false, false, false];

const starCount = 5;

export default function AppRating() {
  const [filledState, setFillState] = useState(defaultFilledState);

  //   const handleMouseOver = (event) => {
  //     setFillState((state) => {
  //       const newState = [...state];
  //       newState[event.target.id] = true;
  //       return newState;
  //     });
  //   };

  /**
   * TODO:
   * false -> click any -> before the index all set to true (includes current)
   * true -> click any -> after the index all set to true (includes current)
   */

  //   const handleMouseOut = (event) => {};

  //   const handleClick = (event) => {};

  return (
    <Rating size="lg">
      {Array.from({ length: starCount }).map((value, index) => (
        <Rating.Star
          key={index}
          id={index.toString()}
          //   onMouseOver={handleMouseOver}
          //   onMouseOut={handleMouseOut}
          //   onClick={handleClick}
          filled={filledState[index]}
        />
      ))}
    </Rating>
  );
}
