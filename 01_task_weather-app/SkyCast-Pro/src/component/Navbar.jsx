import React from "react";

const Navbar = () => {
  return (
    <nav className="w-full bg-amber-400 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <h1 className="text-3xl font-bold text-gray-900 tracking-wide ">
          🌤️ SkyCast
        </h1>

        <p className="text-sm font-medium text-gray-700">
          Live Weather Updates
        </p>
      </div>
    </nav>
  );
};

export default Navbar;