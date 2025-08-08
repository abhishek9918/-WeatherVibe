import React from "react";

function ForecastCard({ item, i }) {
  const { date, day } = item;
  const { avgtemp_c, condition } = day;

  return (
    <div
      key={i}
      className="card-bg rounded-xl p-4 text-center text-gray-100 animate-zoomIn hover-lift flex-shrink-0 w-40"
      style={{ animationDelay: `${0.4 + i * 0.1}s` }}>
      <p className="font-semibold text-base md:text-lg">Day {i + 1}</p>
      <img
        src={`https:${condition.icon}`}
        alt={condition.text}
        className="w-12 h-12 mx-auto my-2"
      />
      <p className="text-lg font-semibold text-cyan-400">{avgtemp_c}°C</p>
      <p className="text-gray-300 text-sm">{condition.text}</p>
      <p className="text-gray-400 text-xs mt-2">{date}</p>
    </div>
  );
}

export default ForecastCard;
