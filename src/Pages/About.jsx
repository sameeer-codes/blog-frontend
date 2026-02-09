import React, { useEffect } from "react";
import { BsArrowRight, BsArrowUp, BsArrowUpLeft } from "react-icons/bs";
import gameRetroCloud1 from "../assets/Media/game-retro-cloud-1.png";
import pfp from "../assets/Media/pfp.png";
import { TiArrowUpThick } from "react-icons/ti";
import { TbArrowBigUpLinesFilled, TbArrowRight } from "react-icons/tb";
import CreativeButton from "../ui/CreativeButton";

function About() {
  return (
    <>
      {/* <div className="flex p-4 rounded-md h-full w-full"> */}
      <div className="grid grid-cols-3 w-full rounded-md bg-primary/20 overflow-y-scroll scrollbar-hidden h-full m-4">
        <div className="p-8 flex flex-col justify-end gap-2">
          <h2 className="text-4xl mb-4 max-w-2xs">About Sameer's Code Lab</h2>
          <p>
            I’m Sameer — a builder who enjoys turning ideas into systems that
            feel calm, playful, and thoughtfully engineered.
          </p>
          <p>
            I like working at the intersection of design and code, where small
            details matter and structure lives quietly beneath the surface.
          </p>
          This lab is where I experiment, learn in public, and explore how
          creative ideas can be supported by solid engineering.
        </div>
        <div className="p-8 flex flex-col border-1 border-t-0 border-b-0 gap-1 justify-end">
          <div className="max-w-[96px] bg-primary mb-8 rounded-full">
            <img src={pfp} alt="" />
          </div>
          <h3 className="text-2xl">Name: Sameer Ali</h3>
          <p className="font-medium">Class: Web Developer</p>
          <p className="font-medium">
            Specialization: Systems Architecture & Problem Solutions.
          </p>

          <div className="mt-4">
            <h4 className="text-xl">Core Attributes:</h4>
            <ul className="leading-6 mt-1">
              <li className="font-medium">
                Systems Thinking{" "}
                <TbArrowBigUpLinesFilled className="inline text-green-300" />
                <TbArrowBigUpLinesFilled className="inline text-green-300" />
              </li>
              <li className="font-medium">
                UI Craft{" "}
                <TbArrowBigUpLinesFilled className="inline text-green-300" />
              </li>
              <li className="font-medium">
                Problem Solving{" "}
                <TbArrowBigUpLinesFilled className="inline text-green-300" />
                <TbArrowBigUpLinesFilled className="inline text-green-300" />
                <TbArrowBigUpLinesFilled className="inline text-green-300" />
              </li>
            </ul>
          </div>
          {/* <h4 className="text-xl"></h4> */}
          <CreativeButton
            children="Explore Player Skills"
            className={"self-start"}
          />
        </div>
        <div className="p-8 flex flex-col justify-end gap-2">
          <h2 className="text-2xl mb-2">About Sameer Ali </h2>
          <p>
            I am just a regular dev who likes to work on simple yet impactiing
            projects in the web industry, for now I just do wordpress and
            shopify but the tech stack keeps on upgrading gang.
          </p>
          <p>
            For me my job is my hobby as well, so you'll never see me half
            heartedly pressing buttons on the keyboard.
          </p>
          <p>
            I also love to design minimal user interfaces, which are easier to
            use and convert, with a lot of focus on the backend architechture so
            the product can grow with the business
          </p>
          <CreativeButton
            children="Start your Journey with me"
            className={"self-start"}
          />
        </div>
      </div>
      {/* </div> */}
    </>
  );
}

export default About;
