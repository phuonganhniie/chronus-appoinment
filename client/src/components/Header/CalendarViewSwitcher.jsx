import React from "react";
import { NavLink } from "react-router-dom";

export default function CalendarViewSwitcher() {
  function activeClass(params) {
    return params.isActive
      ? "text-violet-600 bg-violet-200 px-2 py-1 rounded-md font-semibold w-1/4"
      : "text-gray-600 w-1/4 px-2 py-1 rounded-md hover:bg-gray-100";
  }

  return (
    <ul className="flex gap-9 text-gray-600 h-8 items-center">
      <li className="w-1/4">
        <NavLink to="/calendar/dayview" className={activeClass}>
          Day
        </NavLink>
      </li>
      <li className="w-1/4">
        <NavLink to="/calendar/weekview" className={activeClass}>
          Week
        </NavLink>
      </li>
      <li className="w-1/4">
        <NavLink to="/calendar/monthview" className={activeClass}>
          Month
        </NavLink>
      </li>
      <li className="w-1/4">
        <NavLink to="/calendar/yearview" className={activeClass}>
          Year
        </NavLink>
      </li>
    </ul>
  );
}
