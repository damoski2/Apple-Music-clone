import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import ShuffleIcon from "../../../assets/images/ShuffleInactiveIcon.svg";
import ReactPlayer from "react-player";
import { useRouter, NextRouter } from "next/router";
import ReactJkMusicPlayer from "react-jinke-music-player";
import "react-jinke-music-player/assets/index.css";
import Player from "./Player";
import sample_songs from "../../../sample/songs";
import NextPlayer from "./NextPlayer";

const Index = () => {
  const router: NextRouter = useRouter();

  return (
    <div
      className={` ${
        router.pathname === "/login" ? "hidden" : "block"
      } h-15 z-50 md:ml-[260px] w-full bottom-[6%] md:bottom-[92%] md:top-0 md:w-[calc(100vw_-_260px)] fixed bg-[#2C2C2C] flex items-center pt-[10px]`}
    >
      <div className="w-[97%] md:w-7/12 mx-auto">
        <NextPlayer />
      </div>
      {/* <Player songs={songs} isPlaying={isPlaying} setIsPlaying={setIsPlaying} audioElem={audioElem} currentSong={currentSong} setCurrentSong={setCurrentSong}  /> */}
    </div>
  );
};

export default Index;
