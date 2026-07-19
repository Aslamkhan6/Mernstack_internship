import React from "react";

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center mt-16">
      <div className="w-16 h-16 border-4 border-white/40 border-t-white rounded-full animate-spin"></div>

      <h2 className="mt-5 text-xl font-semibold text-white">
        Fetching Weather...
      </h2>

      <p className="text-white/70 mt-2">Please wait a moment</p>
    </div>
  );
};

export default Loading;
