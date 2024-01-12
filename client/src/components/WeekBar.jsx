import React from "react";

export default function WeekBar() {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return (
    <div className="grid grid-cols-7 mb-5 bg-gray-200 text-gray-400 rounded-md py-2 font-semibold text-center">
      {daysOfWeek.map((day, index) => (
        <div key={index} className=" flex flex-col">
          <header className="flex flex-col">
            <p className="text-sm mt-1">{day.toUpperCase().substring(0, 3)}</p>
          </header>
        </div>
      ))}
    </div>
  );
}
