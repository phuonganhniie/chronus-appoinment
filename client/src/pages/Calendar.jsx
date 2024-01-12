import React from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Header/Header";
import WarningModal from "../components/Modals/WarningModal";
import CreateEventModal from "../components/Modals/CreateEventModal";
import GlobalContext from "../context/GlobalContext";
import { Outlet } from "react-router-dom";
import { useContext } from "react";

export default function Calendar() {
  const { showModal, isWarning } = useContext(GlobalContext);

  return (
    <React.Fragment>
      {isWarning && <WarningModal />}
      {showModal && <CreateEventModal />}
      <div className="h-screen flex flex-1 ">
        <Sidebar />
        <div className="h-screen flex flex-1 flex-col overflow-x-hidden">
          <Header />
          <Outlet />
        </div>
      </div>
    </React.Fragment>
  );
}
