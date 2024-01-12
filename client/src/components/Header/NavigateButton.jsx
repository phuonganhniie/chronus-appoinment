import React, { useContext, useEffect } from "react";
import { BsChevronLeft } from "react-icons/bs";
import { BsChevronRight } from "react-icons/bs";
import GlobalContext from "../../context/GlobalContext";
import weekOfYear from "dayjs/plugin/weekOfYear";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
dayjs.extend(isoWeek);

export default function NavigateButton() {
  dayjs.extend(weekOfYear);
  const {
    monthIndex,
    setMonthIndex,
    trigger,
    setTrigger,
    setWeekIndex,
    weekIndex,
    dayIndex,
    setDayIndex,
    currentView,
    yearIndex,
    setYearIndex,
    currentMonthSmallCalendarIdx,
    setCurrentMonthSmallCalendarIdx,
    setDirection,
  } = useContext(GlobalContext);

  function handlePrevMonth() {
    //switch to month view
    if (currentView === "month") {
      let prevMonth = monthIndex.subtract(1, "month");
      setMonthIndex(prevMonth);
      setCurrentMonthSmallCalendarIdx(prevMonth);
      setWeekIndex(weekIndex.subtract(1, "month").startOf("month"));
      setDayIndex(prevMonth.startOf("month"));
      if (prevMonth.year() !== yearIndex) {
        setYearIndex(prevMonth.year());
      }
    }
    //switch to week view
    else if (currentView === "week") {
      let prevWeek = weekIndex.subtract(1, "week");
      setWeekIndex(prevWeek);
      setDayIndex(prevWeek.startOf("isoWeek"));
      if (prevWeek.month() !== weekIndex.month()) {
        setMonthIndex(monthIndex.subtract(1, "month"));
        setCurrentMonthSmallCalendarIdx(
          currentMonthSmallCalendarIdx.subtract(1, "month")
        );
      } else if (prevWeek.year() !== yearIndex) {
        setYearIndex(prevWeek.year());
      }
    }
    //switch to day view
    else if (currentView === "day") {
      let prevDay = dayIndex.subtract(1, "day");
      setDayIndex(prevDay);
      if (prevDay.month() !== dayIndex.month()) {
        setMonthIndex(monthIndex.subtract(1, "month"));
        setCurrentMonthSmallCalendarIdx(monthIndex.subtract(1, "month"));
      } else if (prevDay.week() !== dayIndex.week()) {
        setWeekIndex(weekIndex.subtract(1, "week"));
      } else if (prevDay.year() !== dayIndex.year()) {
        setYearIndex(yearIndex - 1);
      }
    }

    //switch to year view
    else if (currentView === "year") {
      let prevYear = yearIndex - 1;
      setYearIndex(prevYear);
      let prevYearDate = dayjs().set("year", prevYear).startOf("year");
      setDayIndex(prevYearDate.startOf("month")); // Set to the first day of January
      setWeekIndex(prevYearDate.startOf("week")); // Set to the start of the week of the first day of January
      setMonthIndex(prevYearDate.startOf("month")); // Set to January
      setCurrentMonthSmallCalendarIdx(prevYearDate.startOf("month"));
    }
    setDirection(0);
  }

  function handleNextMonth() {
    //switch to month view
    if (currentView === "month") {
      let nextMonth = monthIndex.add(1, "month");
      setMonthIndex(nextMonth);
      setCurrentMonthSmallCalendarIdx(nextMonth);
      setCurrentMonthSmallCalendarIdx(nextMonth);
      setWeekIndex(weekIndex.add(1, "month").startOf("month"));
      let nextMonthDate = nextMonth.startOf("month");
      setDayIndex(nextMonthDate);
      if (nextMonthDate.year() !== yearIndex) {
        setYearIndex(nextMonthDate.year());
      }
    }
    //switch to week view
    else if (currentView === "week") {
      let nextWeek = weekIndex.add(1, "week");
      setWeekIndex(nextWeek);
      setDayIndex(nextWeek.startOf("isoWeek"));
      if (nextWeek.month() !== weekIndex.month()) {
        setMonthIndex(monthIndex.add(1, "month"));
        setCurrentMonthSmallCalendarIdx(monthIndex.add(1, "month"));
      } else if (nextWeek.year() !== yearIndex) {
        setYearIndex(nextWeek.year());
      }
    }
    //switch to day view
    else if (currentView === "day") {
      let nextDay = dayIndex.add(1, "day");
      setDayIndex(nextDay);
      if (dayIndex.month() !== nextDay.month()) {
        setMonthIndex(monthIndex.add(1, "month"));
        setCurrentMonthSmallCalendarIdx(monthIndex.add(1, "month"));
        setWeekIndex(nextDay.startOf("month").startOf("week"));
      } else if (dayIndex.week() !== nextDay.week()) {
        setWeekIndex(weekIndex.add(1, "week"));
      } else if (dayIndex.year() !== nextDay.year()) {
        setYearIndex(yearIndex + 1);
      }
    }
    //switch to year view
    else if (currentView === "year") {
      let nextYear = yearIndex + 1;
      setYearIndex(nextYear);
      let nextYearDate = dayjs().set("year", nextYear).startOf("year");
      setDayIndex(nextYearDate.startOf("month")); // Set to the first day of January
      setWeekIndex(nextYearDate.startOf("week")); // Set to the start of the week of the first day of January
      setMonthIndex(nextYearDate.startOf("month")); // Set to January
      setCurrentMonthSmallCalendarIdx(nextYearDate.startOf("month"));
    }
    setDirection(1);
  }

  function handleThisMonth() {
    setMonthIndex(dayjs().startOf("month"));
    setCurrentMonthSmallCalendarIdx(dayjs().startOf("month"));
    setWeekIndex(dayjs().startOf("week"));
    setTrigger(!trigger);
    setDayIndex(dayjs());
    setYearIndex(dayjs().year());
  }

  return (
    <div className="flex flex-row items-center px-1 py-1 border border-gray-300 rounded-md text-gray-600">
      <button onClick={handlePrevMonth}>
        <BsChevronLeft className="cursor-pointer" />
      </button>
      <button onClick={handleThisMonth}>
        <span className="mx-2 cursor-pointer">Today</span>
      </button>
      <button onClick={handleNextMonth}>
        <BsChevronRight className="cursor-pointer" />
      </button>
    </div>
  );
}
