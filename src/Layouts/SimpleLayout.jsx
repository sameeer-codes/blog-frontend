import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import gameRetroCloud1 from "../assets/Media/game-retro-cloud-1.png";
import { Outlet } from "react-router";

const SimpleLayout = () => {
  return (
    <>
      {/* <Header /> */}

      <div
        className={`mx-auto min-h-[100vh] p-4 relative grid place-items-center before:content-[] before:bg-gradient-to-b  before:from-accent-primary before:to-accent-secondary before:absolute before:h-full before:w-full before:z-[-1] text-white overflow-hidden before:top-0 before:left-0`}
      >
        <img
          src={gameRetroCloud1}
          alt=""
          className="absolute max-w-76 z-[-1] opacity-0 pointer-events-none animate-[drift_40s_linear_0s_infinite] top-12"
        />
        <img
          src={gameRetroCloud1}
          alt=""
          className="absolute max-w-76 z-[-1] opacity-0 pointer-events-none animate-[drift_40s_linear_30s_infinite] top-12"
        />

        <img
          src={gameRetroCloud1}
          alt=""
          className="absolute max-w-42 z-[-1] opacity-0 pointer-events-none animate-[drift_50s_linear_0s_infinite] top-24"
        />
        <img
          src={gameRetroCloud1}
          alt=""
          className="absolute max-w-42 z-[-1] opacity-0 pointer-events-none animate-[drift_50s_linear_30s_infinite] top-24"
        />

        <img
          src={gameRetroCloud1}
          alt=""
          className="absolute max-w-42 z-[-1] opacity-0 pointer-events-none animate-[drift_40s_linear_0s_infinite] top-38"
        />
        <img
          src={gameRetroCloud1}
          alt=""
          className="absolute max-w-42 z-[-1] opacity-0 pointer-events-none animate-[drift_40s_linear_20s_infinite] top-38"
        />
        <img
          src={gameRetroCloud1}
          alt=""
          className="absolute max-w-48 z-[-1] opacity-0 pointer-events-none animate-[drift_30s_linear_0s_infinite] top-56"
        />
        <img
          src={gameRetroCloud1}
          alt=""
          className="absolute max-w-48 z-[-1] opacity-0 pointer-events-none animate-[drift_30s_linear_20s_infinite] top-56"
        />
        <img
          src={gameRetroCloud1}
          alt=""
          className="absolute max-w-76 z-[-1] opacity-0 pointer-events-none animate-[drift_45s_linear_0s_infinite] bottom-48"
        />
        <img
          src={gameRetroCloud1}
          alt=""
          className="absolute max-w-76 z-[-1] opacity-0 pointer-events-none animate-[drift_45s_linear_30s_infinite] bottom-48"
        />
        <img
          src={gameRetroCloud1}
          alt=""
          className="absolute max-w-56 z-[-1] opacity-0 pointer-events-none animate-[drift_30s_linear_0s_infinite] bottom-38"
        />
        <img
          src={gameRetroCloud1}
          alt=""
          className="absolute max-w-56 z-[-1] opacity-0 pointer-events-none animate-[drift_30s_linear_30s_infinite] bottom-38"
        />
        <img
          src={gameRetroCloud1}
          alt=""
          className="absolute max-w-72 z-[-1] opacity-0 pointer-events-none animate-[drift_50s_linear_0s_infinite] bottom-18"
        />
        <img
          src={gameRetroCloud1}
          alt=""
          className="absolute max-w-72 z-[-1] opacity-0 pointer-events-none animate-[drift_50s_linear_36s_infinite] bottom-18"
        />
        <img
          src={gameRetroCloud1}
          alt=""
          className="absolute max-w-36 z-[-1] opacity-0 pointer-events-none animate-[drift_42s_linear_0s_infinite] bottom-18"
        />
        <img
          src={gameRetroCloud1}
          alt=""
          className="absolute max-w-42 z-[-1] opacity-0 pointer-events-none animate-[drift_42s_linear_26s_infinite] bottom-18"
        />
        <Outlet />
      </div>
      {/* <Footer /> */}
    </>
  );
};

export default SimpleLayout;
