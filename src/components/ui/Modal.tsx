// import { ReactNode } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';

// interface ModalProps {
//   isOpen: boolean;
//   toggleModal: (data?: any) => void;
//   title: string;
//   children: ReactNode;
// }

// const Modal: React.FC<ModalProps> = ({
//   isOpen,
//   toggleModal,
//   title,
//   children,
// }) => {
//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <motion.div
//           className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           // transition={{ duration: 0.3 }}
//         >
//           <motion.div
//             className="bg-white p-6 rounded-lg shadow-lg max-w-[900px] relative"
//             initial={{ scale: 0.5 }}
//             animate={{ scale: 1 }}
//             exit={{ scale: 0.5 }}
//             transition={{ duration: 0.3 }}
//           >
//             {/* Close Button */}
//             <button
//               type="button"
//               onClick={toggleModal}
//               className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
//             >
//               ✖
//             </button>
//             <h2 className="text-xl font-semibold text-gray-800 mb-2">
//               {title}
//             </h2>
//             {children}
//           </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// };

// export default Modal;
// src/components/generics/modal/GenericModal.tsx

import React from "react";

interface GenericModalProps {
  isOpen: boolean;
  toggleModal: () => void;
  title: string;
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
    <div className="fixed inset-0   backdrop-blur-xs flex justify-center items-center z-50  ">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg relative">
        <button
          className="absolute top-2 right-2 text-gray-500 cursor-pointer hover:text-red-500 text-2xl "
          onClick={toggleModal}
        >
          &times;
        </button>
        <h1 className="text-xl font-semibold mb-4">{title}</h1>
        {children}
      </div>
    </div>
  );
};

export default GenericModal;
