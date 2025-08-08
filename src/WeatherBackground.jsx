// WeatherBackground.jsx
import React from "react";
import Confetti from "react-confetti";

import { useWindowSize } from "react-use";

export default function WeatherBackground({ weatherType }) {
  const { width, height } = useWindowSize();

  const colors = {
    rain: ["#00aaff"],
    snow: ["#ffffff"],
    cloudy: ["#cccccc"],
    clear: [],
  };

  return (
    <>
      {weatherType !== "clear" && (
        <Confetti
          width={width}
          height={height}
          colors={colors[weatherType] || ["#ffffff"]}
          gravity={weatherType === "rain" ? 0.3 : 0.05}
          numberOfPieces={weatherType === "rain" ? 200 : 100}
          wind={0}
          recycle={true}
        />
      )}
    </>
  );
}
