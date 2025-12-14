/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from "react";
import { Logo } from "../logo";

const UpdateModal = ({ isOpen, onClose, onConfirm, input, label, action}) => {
const [textValue, setTextValue] = useState(input);

  useEffect(() => {
    setTextValue(input);
  }, [input, isOpen]);


  if (!isOpen) return null;

  if (input === "" || action === "reply") {
    const handleReplyConfirm = () => {
        onConfirm(textValue);
        setTextValue(""); 
    }

    return (
       <div>
    <div className="fixed inset-0 bg-gray-500/25 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"> </div>
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-md p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
        <div className="flex flex-col items-center justify-center gap-2 ">
          <Logo />
          <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">
            {label}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button> 
        <textarea 
        className="mt-3 mb-3 w-full border-gray-400 border rounded text-black overflow-auto p-3 dark:text-white" 
        value={textValue} 
        onChange={(e) => setTextValue(e.target.value)} 
        rows={4}/>
      <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleReplyConfirm} 
            className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
    </div>
  );
  } 
  // update
  if ( action === "update") {
    const handleUpdateConfirm = () => {
        onConfirm(textValue);
    }
    
    return (
      <div>
    <div className="fixed inset-0 bg-gray-500/25 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"> </div>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative w-full max-w-md p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
          <div className="flex flex-col items-center justify-center gap-2 ">
            <Logo />
            <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">
              {label}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <textarea 
          className="mt-3 mb-3 w-full border-gray-400 border rounded text-black dark:text-white overflow-auto p-3" 
          value={textValue}
          onChange={(e) => setTextValue(e.target.value)} 
          rows={6}/> 
        <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 dark:text-gray-200 hover:bg-gray-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateConfirm} 
              className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 cursor-pointer"
            >
              Save
            </button>
          </div>
        </div>
      </div>
      </div>
    );
  }
};

export default UpdateModal;