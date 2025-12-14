import React from 'react';
import { Logo } from '../logo';

const DeleteModal = ({ isOpen, onClose, onConfirm, itemId, label }) => {
  if (!isOpen) return null;

  return (
    <div>
    <div className="fixed inset-0 bg-gray-500/25 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"> </div>
    <div className="fixed inset-0 z-50 flex items-center justify-center ">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <div className='flex flex-col items-center justify-center gap-2 '>
          <Logo />
          <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">Confirm Deletion</h2></div>
        <p className="text-gray-700 mb-6">
          Are you sure you want to delete {label}<span className="font-bold"> {itemId}</span>? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div></div>
  );
};

export default DeleteModal;
