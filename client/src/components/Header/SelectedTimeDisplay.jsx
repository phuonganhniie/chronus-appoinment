import React, { useEffect } from "react";
import dayjs from "dayjs";
import GlobalContext from "../../context/GlobalContext";

export default function SelectedTimeDisplay() {
  const { monthIndex, weekIndex, currentView, dayIndex, yearIndex } =
    React.useContext(GlobalContext);

  const handleDateDisplay = () => {
    if (currentView === "month") {
      return dayjs(monthIndex).format("MMMM YYYY");
    } else if (currentView === "week") {
      return dayjs(weekIndex).format("MMMM YYYY");
    } else if (currentView === "day") {
      return dayjs(dayIndex).format("DD MMMM YYYY");
    } else if (currentView === "year") {
      return dayjs().year(yearIndex).format("YYYY");
    }
  };

  return (
    <h2 className="text-gray-500 font-bold text-lg text-l">
      {handleDateDisplay()}
    </h2>
  );
}
