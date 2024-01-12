import React, { useEffect, useState, useContext } from "react";
import Week from "../components/Week/Week";
import { motion } from "framer-motion";
import { getWeek } from "../utils";
import GlobalContext from "../context/GlobalContext";
export default function WeekViewCalendar() {
  const { weekIndex } = useContext(GlobalContext);
  const [currentWeek, setCurrentWeek] = useState(getWeek());
  useEffect(() => {
    setCurrentWeek(getWeek(weekIndex));
  }, [weekIndex]);

  return (
    <motion.div
      className="h-[89.4%] flex flex-col items-center px-5"
      initial={{ opacity: 0 }} // Start smaller and invisible
      animate={{ opacity: 1 }} // Scale up to the original size and become visible
      exit={{ opacity: 0 }} // Scale down and become invisible when exit
    >
      <Week week={currentWeek} />
    </motion.div>
  );
}
