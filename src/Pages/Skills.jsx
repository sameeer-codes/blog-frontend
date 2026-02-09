import React from "react";
import pfp from "../assets/Media/pfp.png";
import { TbStarFilled } from "react-icons/tb";

const Skills = () => {
  return (
    <>
      <div className="h-full w-full bg-primary/20 grid grid-rows-6 grid-cols-1 gap-4 p-8">
        <div className="grid grid-cols-2 row-span-2 items-center-safe">
          <div className="flex items-center gap-4 lg:gap-8">
            <div className="bg-primary inline-block rounded-full">
              <img src={pfp} alt="" className="max-w-[116px]" />
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-4xl font-medium">
                Name: <strong>Sameer Ali</strong>{" "}
              </h2>
              <h4 className="text-xl font-normal">
                Class: Wordpress & Shopify Developer
              </h4>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <p className="text-4xl font-bold font-primary text-right">
              Level 10
            </p>
            <div className="max-w-2/4 self-end w-full flex flex-col items-end text-right">
              <p className="font-medium mb-1 text-sm">XP: 837 / 1000</p>
              <div className="max-w-900/1000 relative min-w-[176px] rounded-md bg-black/80 h-4 w-full before:content-[] before:absolute before:top-0 before:left-0 before:h-full before:w-837/1000 before:bg-surface before:rounded-l-full before:transition-[width] before:duration-1000 mb-4"></div>
              <div>Next Unlock: Systems Architecture and Creative Craft</div>
            </div>
            {/* <div className="flex flex-wrap gap-1 justify-end">
              <div className="flex gap-1 items-center font-medium">
                Front-end Development: <TbStarFilled />{" "}
              </div>
              <div className="flex gap-1 items-center font-medium">
                Front-end Development: <TbStarFilled />{" "}
              </div>
              <div className="flex gap-1 items-center font-medium">
                Front-end Development: <TbStarFilled />{" "}
              </div>
              <div className="flex gap-1 items-center font-medium">
                Front-end Development: <TbStarFilled />{" "}
              </div>
            </div> */}
          </div>
        </div>
        <div className="h-full bg-primary/30 row-span-4 rounded-md grid-cols-10 grid">
          <div className="col-span-3 h-full p-4">
            <ul className="font-medium font-primary text-lg flex flex-col gap-2">
              <li className="bg-primary p-4">Core Skills</li>
              <li>Platforms and Languages</li>
              <li>Tools and Utilities</li>
            </ul>
          </div>
          <div className="col-span-7 bg-primary h-full"></div>
        </div>
      </div>
    </>
  );
};

export default Skills;
