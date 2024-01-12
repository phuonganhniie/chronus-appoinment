import React from "react";
import Month from "../components/Month/Month";
import WeekBar from "../components/WeekBar";
import { useState, useEffect, useContext } from "react";
import GlobalContext from "../context/GlobalContext";
import { getMonth } from "../utils/index";

export default function MonthViewCalendar() {
  const [currentMonth, setCurrentMonth] = useState(getMonth());
  const { monthIndex } = useContext(GlobalContext);

  useEffect(() => {
    setCurrentMonth(getMonth(monthIndex));
  }, [monthIndex]);

  return (
    <div className="flex flex-1 flex-col px-5">
      <WeekBar />
      <Month month={currentMonth} />
    </div>
  );
}
