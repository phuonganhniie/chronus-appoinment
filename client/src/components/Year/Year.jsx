import React, { useEffect, useState, useContext } from "react";
import GlobalContext from "../../context/GlobalContext";
import YearEventModal from "../Modals/YearEventModal";
import dayjs from "dayjs";

export default function Year({ year }) {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalSize, setModalSize] = useState({ width: 0, height: 0 });
  const { savedEvents } = useContext(GlobalContext);

  //function to check if the date is today
  function isToday(date, i) {
    const format = "YYYY-MM-DD";
    const today = dayjs().format(format);
    const currentDay = date.format(format);
    const commonClasses = [
      "flex",
      "items-center",
      "justify-center",
      "w-6",
      "h-6",
      "rounded-full",
      "cursor-pointer",
    ];

    if (today === currentDay && date.month() === i) {
      return [...commonClasses, "bg-violet-600", "text-white"].join(" ");
    } else if (
      savedEvents.some(
        (event) =>
          dayjs(currentDay).format("YYYY-MM-DD") ===
            dayjs(event.date).format("YYYY-MM-DD") && date.month() === i
      )
    ) {
      return [...commonClasses, "bg-violet-200", "text-violet-600"].join(" ");
    } else {
      return [
        ...commonClasses,
        date.month() === i ? "text-gray-800" : "text-gray-400",
        "hover:bg-gray-100",
        "active:bg-violet-100",
      ].join(" ");
    }
  }

  const handleEventClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    let x = rect.right + window.scrollX;
    let y = rect.bottom + window.scrollY;

    const modalWidth = modalSize.width; // Replace with modal's width
    const modalHeight = modalSize.height; // Replace with modal's height

    // Adjust x if the modal would go out of the viewport
    if (x + modalWidth > window.innerWidth) {
      x = window.innerWidth - modalWidth;
    }

    // Adjust y if the modal would go out of the viewport
    if (y + modalHeight > window.innerHeight) {
      y = window.innerHeight - modalHeight;
    }

    setIsModalOpen(true);
    setModalPosition({ x, y });
  };

  useEffect(() => {
    console.log("year", year);
  }, [year]);

  return (
    <div className="grid grid-cols-4 gap-4 p-4 overflow-auto h-[650px] scrollbar scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-100">
      {year.map((month, i) => {
        // Find the first day that actually belongs to the current month
        const firstDay = month.flat().find((day) => day.month() === i);

        return (
          <div key={i} className="p-2 px-3 py-3 text-xs ">
            <h2 className="text-left pl-2 font-semibold text-gray-500 text-sm mb-2">
              {firstDay ? firstDay.format("MMMM") : ""}
            </h2>
            <div className="grid grid-cols-7 gap-1">
              {daysOfWeek.map((day, j) => (
                <div key={j} className="px-1 py-1 text-center text-gray-500">
                  {day}
                </div>
              ))}
              {month.flat().map((day, j) => (
                <div
                  key={j}
                  className={isToday(day, i)}
                  onClick={(e) => {
                    handleEventClick(e);
                    setSelectedEvent(day);
                  }}
                >
                  {day.date()}
                </div>
              ))}
            </div>
          </div>
        );
      })}
      {isModalOpen && (
        <YearEventModal
          position={modalPosition}
          setIsModalOpen={setIsModalOpen}
          year={year}
          selectedEvent={selectedEvent}
          setModalSize={setModalSize}
        />
      )}
    </div>
  );
}
