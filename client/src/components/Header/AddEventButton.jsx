import React, { useContext } from "react";
import GlobalContext from "../../context/GlobalContext";

export default function AddEventButton() {
  const { setShowModal } = useContext(GlobalContext);

  return (
    <button
      className="py-1 px-4 bg-neutral-900 text-slate-50 rounded hover:shadow"
      onClick={() => setShowModal(true)}
      title="Click to create new event"
    >
      + Add
    </button>
  );
}
