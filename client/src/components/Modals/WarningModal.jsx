import React from "react";
import GlobalContext from "../../context/GlobalContext";

export default function WarningModal() {
  const { isWarning, setIsWarning, setShowModal, showModal, setCancle } =
    React.useContext(GlobalContext);

  const generateWarning = () => {
    let warning;
    if (showModal) {
      warning = "Are you sure you want to delete this event?";
      return warning;
    }
  };

  const handleConfirm = () => {
    if (showModal) {
      setIsWarning(false);
      setShowModal(false);
    }
  };
  return (
    <>
      {isWarning && (
        <div className="h-screen z-50 w-full fixed left-0 flex justify-center items-center backdrop-blur-sm">
          <div className="w-1/4 bg-white p-4 rounded-lg shadow-2xl">
            <h3 className="p-2 pb-4 mb-2">{generateWarning()}</h3>
            <div className="flex justify-end gap-4">
              <button
                className="text-blue-600 px-4 py-2 rounded-md hover:bg-blue-100 font-semibold active:bg-blue-200 "
                onClick={() => setIsWarning(false)}
              >
                Cancel
              </button>
              <button
                className="text-blue-600 px-4 py-2 rounded-md hover:bg-blue-100 font-semibold active:bg-blue-200"
                onClick={handleConfirm}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
