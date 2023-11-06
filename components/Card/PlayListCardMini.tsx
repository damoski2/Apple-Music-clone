import React, { useState, useEffect, useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import AppleLogoDark from "../../assets/images/AppleLogoDark.svg";
import AppleLogoLight from "../../assets/images/AppleLogoLight.svg";
import CardRedPlayIcon from "../../assets/images/CradRedPlayIcon.svg";
import { PlaylistPayload } from "../../interface";
import _ from "lodash";
import { animated, useSpring } from "react-spring";
import { useScroll } from "react-use-gesture";
import { GlobalContext } from "../../context/GlobalContext";

interface Props {
  data: PlaylistPayload;
  style?: any;
}

const truncate = (str: string, n: number) => {
  return str?.length > n ? str.substr(0, n - 1) + "..." : str;
};

const PlayListCardMini = ({ data, style }: Props) => {
  //console.log(`data images`, data)

  const { dispatch, setCurrentPlayList } = useContext(GlobalContext);

  const [current_hover, set_Current_Hover] = useState<string>("");
  const [imageLightness, setImageLightness] = useState<number>(0);

  const handleMouseEnter = (_id: string): void => {
    set_Current_Hover(_id);
  };

  const handleMouseLeave = (): void => {
    set_Current_Hover("");
  };

  return (
    <div
      onClick={() => setCurrentPlayList(data, dispatch)}
      className="flex-shrink-0"
      style={{ ...style }}
    >
      <div className="mt-1 rounded-xl relative">
        <div className="relative w-full">
          <Image
            src={CardRedPlayIcon}
            alt=""
            className={`absolute cursor-pointer top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${
              current_hover === data?.id ? "opacity-100 z-10" : "opacity-0"
            } opacity-100`}
            onMouseEnter={() => handleMouseEnter(data?.id)}
            onMouseLeave={handleMouseLeave}
          />
          <Image
            src={data?.image[0].url}
            className={`cursor-pointer w-[237px] sm:h-[237px] h-[190px] rounded-xl ${
              current_hover === data?.id ? "brightness-[.7]" : "brightness-100"
            } `}
            alt=""
            width={237}
            height={237}
            onMouseEnter={() => handleMouseEnter(data?.id)}
            onMouseLeave={handleMouseLeave}
          />
        </div>
      </div>
      <span className="text-[#ffffffeb] text-[12px] font-normal">
        {truncate(data?.name, 36)}
      </span>
    </div>
  );
};

export default PlayListCardMini;
