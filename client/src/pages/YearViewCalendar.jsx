import React, { useEffect, useState, useContext } from "react";
import { getYear } from "../utils";
import Year from "../components/Year/Year";
import GlobalContext from "../context/GlobalContext";

export default function YearViewCalendar() {
  const { yearIndex } = useContext(GlobalContext);
  const [currentYear, setCurrentYear] = useState(getYear());
  useEffect(() => {
    setCurrentYear(getYear(yearIndex));
  }, [yearIndex]);
  return (
    <div className="flex flex-col items-center px-5">
      <Year year={currentYear} />
    </div>
  );
}
