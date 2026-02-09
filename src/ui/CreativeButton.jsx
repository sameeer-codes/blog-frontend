import React from "react";
import { BsArrowRight } from "react-icons/bs";

const CreativeButton = ({ children = "Creative Button", className }) => {
  return (
    <button
      className={`group relative border p-4 rounded-full cursor-pointer flex items-center gap-4 overflow-hidden  hover:text-white transition-all duration-300 ease-in-out before:content-['']  before:absolute before:inset-0  before:bg-accent-primary before:rounded-full  before:scale-0 hover:before:scale-100 before:transition-transform before:duration-300 before:ease-in-out before:z-[-1] hover:-translate-y-2 mt-6 ${className}`}
    >
      <span className="text-sm uppercase font-bold text-center">
        {children}
      </span>
      <BsArrowRight className="hover:scale-110 group-hover:-rotate-45 transition-all duration-300 ease-in-out font-bold" />
    </button>
  );
};

export default CreativeButton;
