import React from "react";

interface GenericModalProps {
  isOpen: boolean;
  toggleModal: () => void;
  title?: string;
  children: React.ReactNode;
}

const GenericModal: React.FC<GenericModalProps> = ({
  isOpen,
  toggleModal,
  title,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-40 backdrop-blur-sm px-4 overflow-y-auto">
      <div className="relative bg-white rounded-xl shadow-lg mt-10 mb-10 w-full sm:w-auto max-w-full">
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-2xl"
          onClick={toggleModal}
        >
          &times;
        </button>

        {/* Modal Header */}
        {title && (
          <div className="p-4 border-b border-gray-200">
            <h1 className="text-lg font-semibold">{title}</h1>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default GenericModal;
