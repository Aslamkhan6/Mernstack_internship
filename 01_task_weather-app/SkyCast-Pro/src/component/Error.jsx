import React from "react";
import { MdErrorOutline } from "react-icons/md";

const ErrorCard = ({ message }) => {
  return (
    <div className="max-w-md mx-auto mt-12 bg-red-50 border border-red-200 rounded-2xl p-8 text-center shadow-lg">

      <MdErrorOutline className="text-red-500 text-6xl mx-auto mb-4" />

      <h2 className="text-2xl font-bold text-red-600">
        Oops!
      </h2>

      <p className="text-gray-600 mt-3">
        {message}
      </p>

    </div>
  );
};

export default ErrorCard;