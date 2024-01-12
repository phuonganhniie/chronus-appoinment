import React, { useEffect, useContext, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import GlobalContext from "../../context/GlobalContext";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { CgClose } from "react-icons/cg";
export default function YearEventModal(props) {
  const sizeRef = useRef(null);
  dayjs.extend(customParseFormat);
  const { position, setIsModalOpen, selectedEvent, setModalSize } = props;
  const { savedEvents, setDayIndex } = useContext(GlobalContext);
  const [todayEvents, setTodayEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (sizeRef.current) {
      const { offsetWidth, offsetHeight } = sizeRef.current;
      setModalSize({ width: offsetWidth, height: offsetHeight });
    }
  }, [sizeRef]);

  useEffect(() => {
    console.log("selectedEvent", selectedEvent);
  }, [selectedEvent]);

  useEffect(() => {
    const events = savedEvents.filter((event) => {
      return (
        dayjs(event.date).format("DD-MM-YY") ===
        selectedEvent.format("DD-MM-YY")
      );
    });
    setTodayEvents(events);
  }, [savedEvents, selectedEvent]);

  const handleDateClick = () => [
    setDayIndex(dayjs(selectedEvent)),
    setIsModalOpen(false),
    navigate("/calendar/dayview"),
  ];

  return (
    <AnimatePresence>
      <motion.div
        ref={sizeRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        delay={0.2}
        exit={{ opacity: 0 }}
        className="bg-white shadow-lg flex flex-col items-center rounded-lg px-4 py-2 z-10"
        style={{
          position: "fixed",
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      >
        <div className="flex justify-between gap-12">
          <div></div>
          <div className="flex flex-row items-center">
            <div className="flex flex-col text-gray-500 items-center">
              <span className="text-xs"> {selectedEvent.format("dddd")} </span>
              <button
                className="font-semibold text-3xl cursor-pointer hover:bg-gray-100 rounded-full p-2"
                onClick={handleDateClick}
              >
                {selectedEvent.format("DD")}
              </button>
            </div>
          </div>
          <button>
            <CgClose
              className="w-10 h-10 p-2 text-gray-400 text-black bg-gray-100 rounded-full hover:bg-gray-200"
              onClick={() => setIsModalOpen(false)}
            />
          </button>
        </div>
        <div></div>
        {todayEvents.length > 0 ? (
          todayEvents.map((event, index) => (
            <div
              key={index}
              className="flex w-full justify-start pl-3 mt-2 items-center text-gray-500 gap-3"
            >
              <div
                className={`w-3 h-3 bg-${event.label}-200 rounded-full`}
              ></div>
              <button className="font-semibold text-xs ">
                {" "}
                {event.startTime.format("HH:mm")}{" "}
              </button>
              <p className="text-xs"> {event.title} </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-xs mt-4">
            You don't have any event on this day
          </p>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
