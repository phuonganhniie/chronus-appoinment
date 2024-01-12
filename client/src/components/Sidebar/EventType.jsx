import React, { useState, Fragment, useEffect } from "react";
import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon, PlusIcon } from "@heroicons/react/solid";
import GlobalContext from "../../context/GlobalContext";
import { Menu, Transition } from "@headlessui/react";
import { DotsVerticalIcon } from "@heroicons/react/outline";
import { calendarUpdate } from "../../services/calendarService";
export default function EventType() {
  const [openInput, setOpenInput] = useState(false);
  const [inputEventType, setInputEventType] = useState("");
  const [updateIndex, setUpdateIndex] = useState(null);
  const [shouldUpdate, setShouldUpdate] = useState(false);
  const [remindInput, setRemindInput] = useState(false);
  const { eventTypesDispatch, totalEventTypes, setCheckedLabel, checkedLabel } =
    React.useContext(GlobalContext);

  //desc: add new event type to eventTypes state
  const handleAddNewEventType = async (e) => {
    e.preventDefault();

    if (inputEventType === "") return setRemindInput(true);

    if (updateIndex !== null) {
      eventTypesDispatch({
        type: "UPDATE_EVENT_TYPE",
        payload: { eventType: inputEventType, index: updateIndex },
      });
      setUpdateIndex(null);
    } else {
      eventTypesDispatch({ type: "ADD_EVENT_TYPE", payload: inputEventType });
      setInputEventType("");
    }
    setCheckedLabel((prevLabel) => [...prevLabel, inputEventType]);
    setInputEventType("");
    setShouldUpdate(true);
    setRemindInput(false);
  };

  //desc: remove event type from eventTypes state
  const handleRemoveEventType = (eventType) => {
    eventTypesDispatch({ type: "REMOVE_EVENT_TYPE", payload: eventType });
    setShouldUpdate(true);
  };

  //desc: update event type to database
  useEffect(() => {
    const updateCalendarToServer = async () => {
      try {
        const res = await calendarUpdate(totalEventTypes);
        console.log("calendar data send to server", res);
      } catch (error) {
        console.log(error);
      }
    };
    if (shouldUpdate) {
      updateCalendarToServer();
    }
  }, [shouldUpdate, totalEventTypes]);

  //desc: update event type from eventTypes state
  const handleUpdateEventType = (eventType, index) => {
    setInputEventType(eventType);
    setOpenInput(true);
    setUpdateIndex(index);
  };

  //desc: handle checkbox change, decide to add or remove the label from checkedLabel state
  const handleCheckboxChange = (label, checked) => {
    console.log(label, checked);
    if (checked) {
      setCheckedLabel((prevLabel) => [...prevLabel, label]);
    } else {
      setCheckedLabel((prevLabel) => prevLabel.filter((l) => l !== label));
    }
  };

  useEffect(() => {
    console.log("checkedLabel", checkedLabel);
  }, [checkedLabel]);

  //desc: merge multiple classes into one if the option is active
  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <div className="w-full pt-5 mt-6 border-t-2 border-violet-100">
      <div className=" w-full  rounded-2xl bg-white ">
        <Disclosure defaultOpen>
          {({ open }) => (
            <>
              <Disclosure.Button className="px-4 flex w-full items-center justify-between rounded-lg py-2 text-left text-sm font-medium text-gray-600 hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-purple-500/75">
                <span>Filter Events</span>
                <div className="flex items-center gap-3">
                  {/* {!openInput && (
                    <PlusIcon
                      className="h-6 w-6 p-1 text-gray-500 hover:bg-gray-200 rounded-full"
                      onClick={() => setOpenInput(true)}
                    />
                  )} */}
                  <ChevronUpIcon
                    className={`${
                      open ? "rotate-180 transform" : ""
                    } h-5 w-5 text-gray-500`}
                  />
                </div>
              </Disclosure.Button>

              <Disclosure.Panel className="pb-2 pt-4 text-sm text-gray-500">
                <React.Fragment>
                  <form
                    className="flex items-center w-full justify-around"
                    onSubmit={(e) => handleAddNewEventType(e)}
                  >
                    <input
                      type="text"
                      value={inputEventType}
                      placeholder="Add new event type"
                      onChange={(e) => setInputEventType(e.target.value)}
                      className="p-2 text-gray-500 placeholder:text-gray-400 text-xs w-3/4 border-gray-300 rounded-md"
                    />
                    <button
                      className="w-1/4 flex justify-center"
                      type="submit"
                      title="Create new event type"
                    >
                      <PlusIcon className=" w-1/2 p-1 text-gray-500 hover:bg-gray-200 rounded-full" />
                    </button>
                  </form>
                  {remindInput && (
                    <p className="text-rose-500 text-xs mt-2 ml-2  italic">
                      *Event type cannot be empty
                    </p>
                  )}

                  <div className="mt-5 flex flex-col">
                    {totalEventTypes?.map((eventType, index) => (
                      <Menu as="div" key={index} className="relative group">
                        <div className="flex justify-between justify-between items-center py-2 px-1 hover:bg-gray-100">
                          <div className="flex items-center">
                            <input
                              defaultChecked
                              type="checkbox"
                              onChange={(e) =>
                                handleCheckboxChange(
                                  eventType,
                                  e.target.checked
                                )
                              }
                              className="inline-block form-checkbox h-4 w-4 rounded-sm border-gray-400 text-violet-500 focus:outline-none focus:ring-0"
                            />
                            <label className="inline-block ml-2 text-gray-500  font-semibold ">
                              {eventType}
                            </label>
                          </div>
                          <Menu.Button>
                            <DotsVerticalIcon
                              className="-mr-1 h-5 w-5 text-white mt-1 group-hover:text-gray-400"
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
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  onClick={() =>
                                    handleUpdateEventType(eventType, index)
                                  }
                                  className={classNames(
                                    active
                                      ? "bg-gray-100 text-gray-600"
                                      : "text-gray-400",
                                    "block w-full text-left px-4 py-2"
                                  )}
                                >
                                  Edit
                                </button>
                              )}
                            </Menu.Item>
                            <Menu.Item key={index}>
                              {({ active }) => (
                                <button
                                  onClick={() =>
                                    handleRemoveEventType(eventType)
                                  }
                                  className={classNames(
                                    active
                                      ? "bg-gray-100 text-gray-600"
                                      : "text-gray-400",
                                    "block px-4 py-2 w-full text-left"
                                  )}
                                >
                                  Delete
                                </button>
                              )}
                            </Menu.Item>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    ))}
                  </div>
                </React.Fragment>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
    </div>
  );
}
