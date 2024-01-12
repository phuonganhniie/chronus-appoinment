import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { calendarVariants } from "../../animations/calendarVariants";
import DayInMonth from "./DayInMonth";
import GlobalContext from "../../context/GlobalContext";

export default function Month(props) {
  const { month } = { ...props };
  const { monthIndex, direction } = React.useContext(GlobalContext);
  const [isFirstMount, setIsFirstMount] = useState(true);

  useEffect(() => {
    setIsFirstMount(false);
  }, []);

  return (
    <motion.div
      layout
      className="flex-1 grid grid-cols-7 grid-rows-5"
      variants={calendarVariants(direction)}
      initial={isFirstMount ? "visible" : "hidden"}
      animate="visible"
      exit="exit"
      key={monthIndex}
    >
      {month.map((row, idx) => (
        <React.Fragment key={idx}>
          {row.map((day, idx) => (
            <DayInMonth day={day} key={idx} />
          ))}
        </React.Fragment>
      ))}
    </motion.div>
  );
}
