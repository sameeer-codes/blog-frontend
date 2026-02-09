import React, { useEffect } from "react";
import { BsArrowDown, BsArrowRight } from "react-icons/bs";
import gameRetroCloud1 from "../assets/Media/game-retro-cloud-1.png";
import CreativeButton from "../ui/CreativeButton";
import { Link } from "react-router";

function Home(className) {
  return (
    <>
      <div className="max-w-[768px] flex flex-col gap-4 p-8 h-full justify-center items-center text-center">
        <h2 className="text-6xl font-bold mt-4 flex flex-col gap-2 text-shadow-md text-shadow-gray-500">
          <span className="text-5xl">Welcome to</span>{" "}
          <span className="">Sameer's Code Lab</span>
        </h2>
        <p className="text-xl text-shadow-md text-shadow-gray-500">
          Welcome to Sameer’s Code Lab. A playfull but professional space for
          creative projects, solid engineering, and experiments where design and
          code work together.
        </p>

        <CreativeButton
          children={<Link to={"/about"}>Start Your Journey</Link>}
          className={"self-center"}
        />
      </div>
    </>
  );
}

export default Home;
