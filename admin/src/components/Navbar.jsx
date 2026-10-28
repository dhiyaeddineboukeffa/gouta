import React from "react";
import { assets } from "../assets/assets";

const Navbar = ({ setToken }) => {
  return (
    <div className="flex items-center py-2 px-[4%] justify-between border-b border-gray-200">
      <div className="flex flex-col">
        <span className="text-2xl font-bold tracking-wider text-[#1E3A8A]">GOUTRA</span>
        <span className="text-xs text-gray-500 font-semibold tracking-widest">ADMIN PANEL</span>
      </div>
      <button
        onClick={() => setToken("")}
        className="bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
