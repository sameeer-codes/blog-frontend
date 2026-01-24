import React from "react";
import { Link } from "react-router";

const NavMenu = ({ type, className, InnerItems }) => {
  let styles = "";

  if (type === "horizontal") {
    styles = "flex-col items-start";
  }
  return (
    <nav className="">
      <ul className={`flex items-center gap-1 ${className} ${styles}`}>
        {InnerItems.map((item, index) => {
          console.log(item);
          return (
            <li
              key={index}
              className="text-gray-200 hover:text-white transition-all duration-500"
            >
              <Link to={item.link}>{item.title}</Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default NavMenu;
