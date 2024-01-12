import React, { useContext, useEffect, useState } from "react";
import dayjs from "dayjs";
import monthStyles from "./month.module.css";
import GlobalContext from "../../context/GlobalContext";
export default function DayInMonth(props) {
  const { day } = { ...props };
  const { setDateModal, setShowModal, savedEvents, setSelectedEvent } =
    useContext(GlobalContext);
  const [monthEvents, setMonthEvents] = useState([]);

  //filter events which match with the days in calendar
  useEffect(() => {
    const event = savedEvents.filter(
      (event) => dayjs(event.date).format("DD-MM-YY") === day.format("DD-MM-YY")
    );
    setMonthEvents(event);
  }, [savedEvents, day]);

  //style today on calendar
  function isToday() {
    return dayjs().isSame(day, "day");
  }

  function isInCurrentMonth() {
    return dayjs().isSame(day, "month");
  }

  return (
    <div
      className={`border ${
        isToday() ? monthStyles.today : "border-gray-200"
      } flex flex-col px-2 ${
        isInCurrentMonth() ? "text-black" : "text-gray-500"
      }`}
    >
      <div className="flex">
        <p className="text-md text-gray-500 font-semibold p-1 my-1 text-left">
          {day.format("DD")}
        </p>
        {isToday() && <span className={monthStyles.isToday}></span>}
      </div>
      <div
        className="flex-1 cursor-pointer max-h-16 overflow-auto scrollbar scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-10"
        onClick={() => {
          setDateModal(day);
          setShowModal(true);
        }}
      >
        {monthEvents.map((event, index) => (
          <div
            className={`bg-${event.color}-200 p-1 mr-3 text-xs text-gray-600 rounded mb-1 truncate`}
            key={index}
            onClick={() => setSelectedEvent(event)}
          >
            {event.title}
          </div>
        ))}
      </div>
    </div>
  );
}
