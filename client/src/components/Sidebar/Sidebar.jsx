import React from "react";
import SmallCalendar from "./SmallCalendar";
import EventType from "./EventType";
export default function Sidebar() {
  return (
    <div className="border p-5 w-64">
      <SmallCalendar />
      <EventType />
    </div>
  );
}
