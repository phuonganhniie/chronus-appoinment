import React from "react";

const GlobalContext = React.createContext({
  monthIndex: 0,
  setMonthIndex: (index) => {},
  weekIndex: 0,
  setWeekIndex: (index) => {},
  smallCalendarMonth: 0,
  setSmallCalendarMonth: (index) => {},
  selectedDate: 0,
  setSelectedDate: (index) => {},
  currentView: "month",
  setCurrentView: (view) => {},
  showModal: false,
  setShowModal: () => {},
  dateModal: 0,
  setDateModal: () => {},
  direction: 0,
  setDirection: () => {},
  dispatchEvent: ({type, payload}) => {},
});

export default GlobalContext;
