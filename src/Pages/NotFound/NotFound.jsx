import React from "react";
import { NavLink } from "react-router"; // 🔹 "react-router-dom" ব্যবহার করতে হবে

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center px-4 py-8">
      <div className="text-center max-w-md sm:max-w-lg md:max-w-xl">
        <p className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-indigo-400">
          404
        </p>
        <h1 className="mt-4 text-3xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-gray-800">
          Page not found
        </h1>
        <p className="mt-6 text-base sm:text-lg md:text-xl text-gray-500">
          Sorry, we couldn’t find the page you’re looking for.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6">
          <NavLink
            to="/"
            className="rounded-md bg-gray-400 px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base font-semibold text-white shadow hover:bg-indigo-600 transition"
          >
            Return Home
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
