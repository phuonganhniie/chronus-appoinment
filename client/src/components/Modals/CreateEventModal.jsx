import React, { useContext, useState, Fragment, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { modalVariants } from "../../animations/modalVariants";
import { AiOutlineClose } from "react-icons/ai";
import { BsCheck } from "react-icons/bs";
import GlobalContext from "../../context/GlobalContext";
import { Menu, Transition, Listbox } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { createEvent, updateEvent } from "../../services/eventServices";
import customParseFormat from "dayjs/plugin/customParseFormat";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { calendarCreate } from "../../services/calendarService";

dayjs.extend(customParseFormat);
dayjs.extend(utc);

export default function CreateEventModal() {
  const {
    showModal,
    setShowModal,
    dateModal,
    savedEvents,
    dispatchCalendarEvent,
    totalEventTypes,
    eventTypesDispatch,
    setIsWarning,
    calendarId,
    isWarning,
    selectedEvent,
    setSelectedEvent,
  } = useContext(GlobalContext);
  const [location, setLocation] = useState("");
  const [title, setTitle] = useState(selectedEvent ? selectedEvent.title : "");
  const [collaborator, setCollaborator] = useState("");
  const [description, setDescription] = useState(
    selectedEvent ? selectedEvent.description : ""
  );
  const currentTime = dateModal.startOf("hour").format("HH:mm");
  const currentDate = dateModal.format("YYYY-MM-DD");
  const [eventType, setEventType] = useState(
    selectedEvent ? selectedEvent.eventType : "My calendar"
  );
  const [startTime, setStartTime] = useState(
    selectedEvent
      ? dayjs.utc(selectedEvent.startTime).local().format("HH:mm")
      : currentTime
  );
  const [chosenDate, setChosenDate] = useState(
    selectedEvent ? selectedEvent.date : currentDate
  );
  const [endTime, setEndTime] = useState(
    selectedEvent
      ? dayjs.utc(selectedEvent.endTime).local().format("HH:mm")
      : currentTime
  );

  const hours = Array.from({ length: 24 }, (_, i) =>
    i < 10 ? `0${i}:00` : `${i}:00`
  );

  useEffect(() => {
    console.log(endTime);
  }, [endTime]);

  //list of label color for event
  const labelClasses = ["indigo", "gray", "green", "blue", "rose", "purple"];

  //choose what label for the event
  const [selectedLabel, setSelectedLabel] = useState(
    selectedEvent
      ? labelClasses.find((label) => label === selectedEvent.label)
      : labelClasses[0]
  );

  //desc: handle submit event
  const handleSubmit = async (e) => {
    e.preventDefault();

    //convert time to dayjs
    const startTimeDayjs = dayjs(startTime, "HH:mm");
    const endTimeDayjs = dayjs(endTime, "HH:mm");

    const newEvent = {
      calendarId: calendarId,
      title: title,
      description: description,
      location: "vietnam",
      date: chosenDate,
      startTime: startTimeDayjs,
      endTime: endTimeDayjs,
      color: selectedLabel,
      eventType: eventType,
    };
    if (selectedEvent) {
      const res = await updateEvent(newEvent, selectedEvent.id);
      dispatchCalendarEvent({ type: "UPDATE_EVENT", payload: res.data });
      console.log("update event", res);
    } else {
      const res = await createEvent(newEvent);
      dispatchCalendarEvent({ type: "CREATE_EVENT", payload: res.data });
      // const realTime = dayjs.utc(res.data.startTime);
    }
    setShowModal(false);
    setSelectedEvent(null);
  };

  useEffect(() => {
    console.log("selectedEvent", selectedEvent);
  }, [selectedEvent]);

  //desc: handle selected event type
  // const handleSelectedEventType = (eventType) => {
  //   eventTypesDispatch({ type: "SELECTED_EVENT_TYPE", payload: eventType });
  // };

  //desc: merge multiple classes into one if the option is active
  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <AnimatePresence>
      {showModal && (
        <motion.div
          className="h-screen w-full fixed z-40 left-0 flex justify-center items-center backdrop-blur-sm"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <form
            className="w-1/3 bg-white rounded-lg shadow-2xl"
            onSubmit={(e) => handleSubmit(e)}
          >
            <header className="px-4 py-2 mt-3 flex justify-between items-center">
              <div className="flex flex-col items-start">
                <span className="text-lg font-semibold text-gray-500">
                  {`${selectedEvent ? "Update" : "Create"} Event`}
                </span>
                <span className="text-gray-500 text-sm">
                  {`You can ${
                    selectedEvent ? "update" : "create"
                  } event, meeting and tasks`}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsWarning(true);
                  setSelectedEvent(null);
                }}
              >
                <AiOutlineClose className="text-gray-400 text-xl" />
              </button>
            </header>
            <main className="p-4 text-gray-500">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="title">Title</label>
                  <input
                    placeholder="Add title"
                    type="text"
                    name="title"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border border-gray-300 rounded-md p-2"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="description">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Event Description"
                    className="border border-gray-300 rounded-md p-2"
                  ></textarea>
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="title">Choose your collaborator</label>
                  <input
                    placeholder="Add your collaborator"
                    type="text"
                    name="collaborator"
                    id="collaborator"
                    value={collaborator}
                    onChange={(e) => setCollaborator(e.target.value)}
                    className="border border-gray-300 rounded-md p-2"
                  />
                </div>
                <div className="flex flex-1 gap-4 justify-between">
                  <div className="flex flex-col gap-2 w-1/2">
                    <label htmlFor="date">Date</label>
                    <input
                      type="date"
                      value={chosenDate}
                      onChange={(e) => setChosenDate(e.target.value)}
                      className="border border-gray-300 rounded-md p-2"
                    />
                  </div>
                  <div className="flex flex-col gap-2 w-1/2">
                    <label htmlFor="time">Time</label>
                    <div className="flex flex-1 flex-row gap-2 justify-center relative">
                      <Listbox value={startTime} onChange={setStartTime}>
                        <Listbox.Button className="border border-gray-300 rounded-md w-1/2">
                          {startTime}
                        </Listbox.Button>
                        <Listbox.Options className="cursor-pointer scrollbar scrollbar-thumb-gray-200 scrollbar-track-gray-100 border border-gray-300 top-10 left-0 bg-white rounded-md p-2 absolute z-10 w-1/2 max-h-40 overflow-auto">
                          {hours.map((hour, index) => (
                            <Listbox.Option key={index} value={hour}>
                              {({ active }) => (
                                <span
                                  className={`block ${
                                    active ? "bg-blue-200" : ""
                                  }`}
                                >
                                  {hour}
                                </span>
                              )}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </Listbox>

                      <Listbox value={endTime} onChange={setEndTime}>
                        <Listbox.Button className="border border-gray-300 rounded-md w-1/2">
                          {endTime}
                        </Listbox.Button>
                        <Listbox.Options className=" cursor-pointer scrollbar scrollbar-thumb-gray-200 scrollbar-track-gray-100 border border-gray-300 bg-white top-10 -right-1 w-1/2 rounded-md p-2 absolute z-10 max-h-60 overflow-auto">
                          {hours
                            .slice(hours.indexOf(startTime))
                            .map((hour, index) => (
                              <Listbox.Option key={index} value={hour}>
                                {({ active }) => (
                                  <span
                                    className={`block ${
                                      active ? "bg-blue-200" : ""
                                    }`}
                                  >
                                    {hour}
                                  </span>
                                )}
                              </Listbox.Option>
                            ))}
                        </Listbox.Options>
                      </Listbox>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col mt-1">
                  <Menu
                    as="div"
                    className="flex gap-3 relative justify-between items-center"
                  >
                    <label htmlFor="">Choose your event type</label>
                    <div className="w-1/2">
                      <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2  text-gray-600 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                        {!eventType ? totalEventTypes[0] : eventType}
                        <ChevronDownIcon
                          className="-mr-1 h-5 w-5 text-gray-400 mt-1"
                          aria-hidden="true"
                        />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute top-8 right-0 z-10 mt-2 w-1/2 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        {totalEventTypes.map((evt, index) => (
                          <Menu.Item key={index}>
                            {({ active }) => (
                              <span
                                onClick={() => setEventType(evt)}
                                className={classNames(
                                  active
                                    ? "bg-gray-100 text-gray-900"
                                    : "text-gray-700",
                                  "block px-4 py-2"
                                )}
                              >
                                {evt}
                              </span>
                            )}
                          </Menu.Item>
                        ))}
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
                <div className="flex mt-3 flex-row justify-between gap-x-2">
                  <label htmlFor="label">Choose your label color</label>
                  <div className="flex gap-2">
                    {labelClasses.map((label, index) => (
                      <span
                        onClick={() => setSelectedLabel(label)}
                        className={`bg-${label}-500 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer`}
                        key={index}
                      >
                        {selectedLabel === label && (
                          <BsCheck className="text-white" />
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </main>
            <footer className="p-4 flex flex-col justify-center">
              <button
                type="submit"
                className="flex justify-center items-center gap-1 bg-black text-white rounded-lg p-2"
              >
                <BsCheck className="text-2xl" />
                <span>
                  {selectedEvent ? "Update Event" : "Create Schedule"}
                </span>
              </button>
            </footer>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
