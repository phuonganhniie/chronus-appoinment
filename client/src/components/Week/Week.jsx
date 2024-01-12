import React, { useEffect, useContext, useState, useRef } from "react";
import { motion } from "framer-motion";
import { calendarVariants } from "../../animations/calendarVariants";
import GlobalContext from "../../context/GlobalContext";
import HourInDayWeek from "./HourInDayWeek";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
export default function Week(props) {
  dayjs.extend(utc);
  const { week } = { ...props };
  const { direction, weekIndex, savedEvents, setSelectedEvent, setShowModal } =
    useContext(GlobalContext);
  const [isFirstMount, setIsFirstMount] = useState(true);
  const [weekEvents, setWeekEvents] = useState([]);
  const [rowHeight, setRowHeight] = useState(0);
  const rowRef = useRef(null);

  useEffect(() => {
    if (rowRef.current) {
      const height = rowRef.current.getBoundingClientRect().height;
      setRowHeight(height);
    }
  }, []);

  useEffect(() => {
    setIsFirstMount(false);
  }, []);

  function isToday(day) {
    const format = "DD-MM-YYYY";
    const today = dayjs().format(format);
    const currentDay = day.format(format);
    if (today === currentDay) {
      return "text-violet-600";
    } else {
      return "text-gray-500";
    }
  }

  useEffect(() => {
    console.log("week row height", rowHeight);
  }, [rowHeight]);

  useEffect(() => {
    const events = savedEvents.filter((event) => {
      const eventDate = dayjs(event.date);

      const isSameDay = week.some((dayArray) =>
        dayArray.some((day) => eventDate.isSame(dayjs(day), "day"))
      );
      return isSameDay;
    });
    setWeekEvents(events);
  }, [savedEvents, week]);

  useEffect(() => {
    console.log("weekEvents", weekEvents);
  }, [weekEvents]);

  return (
    <React.Fragment>
      <div className=" py-2 w-full justify-center grid grid-cols-[1fr,11fr] bg-gray-200 rounded-lg ">
        <div className="grid grid-cols-1 "></div>
        <motion.div
          className="grid grid-cols-7"
          variants={calendarVariants(direction)}
          animate="visible"
          initial={isFirstMount ? "visible" : "hidden"}
          key={weekIndex}
        >
          {week[0].map((hour, index) => (
            <div
              key={index}
              className={`flex gap-2 flex-row justify-center ${isToday(
                hour
              )} items-center border font-semibold text-md`}
            >
              <p className="  text-center">{hour.format("DD")}</p>
              <p className="  text-center">{hour.format("ddd")}</p>
            </div>
          ))}
        </motion.div>
      </div>
      <motion.div
        className="justify-items-center pt-4 grid border mt-5  rounded-lg grid-cols-[1fr,11fr] h-[87%] overflow-auto scrollbar scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-100"
        variants={calendarVariants(direction)}
        animate="visible"
        initial={isFirstMount ? "visible" : "hidden"}
        key={weekIndex}
      >
        <div className="grid grid-rows-24  ">
          {Array.from({ length: 24 }, (_, index) => (
            <p
              key={index}
              className="text-md text-gray-400 font-semibold -mt-3 text-center"
            >
              {index}:00
            </p>
          ))}
        </div>
        <div className="grid grid-cols-7 grid-rows-24 relative">
          {week.map((day, dayIndex) => (
            <React.Fragment key={dayIndex}>
              {day.map((hour, hourIndex) => (
                <div ref={hourIndex === 0 ? rowRef : null}>
                  <HourInDayWeek key={hourIndex} hour={hour} />
                </div>
              ))}
              {weekEvents
                // .filter((event) => dayjs(event.date).day() === dayIndex)
                .map((event, index) => {
                  const startRow = dayjs.utc(event.startTime).local().hour();
                  const endRow = dayjs.utc(event.endTime).local().hour();
                  const span = endRow - startRow;
                  const dayOfWeek = dayjs(event.date).day();

                  return (
                    <div
                      onClick={() => {
                        setSelectedEvent(event);
                        setShowModal(true);
                      }}
                      key={index}
                      className={`absolute bg-${event.color}-200 
                      p-2 mr-3 w-36 cursor-pointer text-gray-600 rounded-md border border-white mb-1 truncate`}
                      style={{
                        top: `${startRow * rowHeight}px`,
                        height: `${span * rowHeight}px`,
                        gridColumnStart: dayOfWeek + 1,
                      }}
                    >
                      <p className="text-sm font-semibold">{event.title}</p>
                      <p className="text-xs mt-1">{` ${dayjs.utc(event.startTime).local().format(
                        "HH:mm"
                      )} - ${dayjs.utc(event.endTime).local().format("HH:mm")}`}</p>
                    </div>
                  );
                })}
            </React.Fragment>
          ))}
        </div>
      </motion.div>
    </React.Fragment>
  );
}
