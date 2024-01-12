import React, { useContext, useEffect, useState, useRef } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import GlobalContext from "../../context/GlobalContext";

export default function Day(props) {
  dayjs.extend(utc);
  const { hours } = { ...props };
  const [dayEvents, setDayEvents] = useState([]);
  const [rowHeight, setRowHeight] = useState(0);
  const { setDateModal, setShowModal, savedEvents, setSelectedEvent } =
    useContext(GlobalContext);
  const rowRef = useRef(null);

  //desc: get the height of each row in the calendar to calculate the height of the event display
  useEffect(() => {
    if (rowRef.current) {
      const height = rowRef.current.getBoundingClientRect().height;
      setRowHeight(height);
    }
  }, []);

  //desc: filter events which match with the days in calendar, to place the event in the right row
  useEffect(() => {
    const events = savedEvents
      .filter(
        (event) =>
          dayjs(event.date).format("DD-MM-YY") === hours[0].format("DD-MM-YY")
      )
      .map((event) => {
        const startRow = dayjs.utc(event.startTime).local().hour();
        const endRow = dayjs.utc(event.endTime).local().hour();
        const span = endRow - startRow;

        return { ...event, startRow, endRow, span };
      });
    setDayEvents(events);
  }, [savedEvents, hours]);

  //set the date for the created event when click to a specific hour in the calendar
  const handleTimeEvent = (hour) => {
    setDateModal(hour);
  };

  return (
    <div>
      <div className="ml-4 flex flex-col mb-4  bg-white">
        <span className="text-xs">{hours[0].format("dddd")}</span>
        <span className="text-4xl font-semibold">{hours[0].format("DD")}</span>
      </div>
      <div className=" gap-2 relative overflow-auto h-[560px] m-2 border px-4 rounded-md scrollbar scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-100">
        {hours.map((hour, index) => (
          <div
            key={index}
            ref={index === 0 ? rowRef : null}
            className="border-t flex items-center text-gray-400 h-16 cursor-pointer font-semibold border-gray-200"
            onClick={() => {
              handleTimeEvent(hour);
              setShowModal(true);
            }}
          >
            <div>{hour.format("HH:mm")}</div>
            {dayEvents.map((event, index) => {
              const { startRow, endRow, span } = event;

              return (
                <div
                  onClick={() => setSelectedEvent(event)}
                  key={index}
                  className={`bg-${event.color}-200 ml-20 z-10 w-11/12 absolute p-2 mr-3 cursor-pointer text-gray-500 rounded-md border border-white mb-1 truncate`}
                  style={{
                    top: `${startRow * rowHeight}px`,
                    height: `${span * rowHeight}px`,
                  }}
                >
                  <p className="text-sm font-semibold">{event.title}</p>
                  <p className="text-xs mt-1">{` ${dayjs
                    .utc(event.startTime)
                    .local()
                    .format("HH:mm")} - ${dayjs
                    .utc(event.endTime)
                    .local()
                    .format("HH:mm")}`}</p>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
