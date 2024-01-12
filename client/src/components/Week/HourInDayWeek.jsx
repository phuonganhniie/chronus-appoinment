import React, { useContext, useEffect, useState } from "react";
import GlobalContext from "../../context/GlobalContext";
import isBetween from "dayjs/plugin/isBetween";
import dayjs from "dayjs";

dayjs.extend(isBetween);

export default function HourInDayWeek(props) {
  const { setDateModal, setShowModal } = useContext(GlobalContext);
  const { hour } = { ...props };

  const handleTimeEvent = (hour) => {
    setDateModal(hour);
  };

  return (
    <div
      className="border-t border-gray-200 flex flex-row px-2 cursor-pointer"
      onClick={() => {
        handleTimeEvent(hour);
        setShowModal(true);
      }}
    >
      <p className="invisible text-md text-gray-500 font-semibold p-1 my-1 text-left">
        {hour.format("dddd, MMMM D")}
      </p>
    </div>
  );
}
