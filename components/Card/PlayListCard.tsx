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
import Spatial from "../UI/Spatial";

interface Props {
  data: PlaylistPayload;
  style?: any;
}

const truncate = (str: string, n: number) => {
  return str?.length > n ? str.substr(0, n - 1) + "..." : str;
};

const PlayListCard = ({ data, style }: Props) => {
  //console.log(`data images`, data)

  const { dispatch, setCurrentPlayList } = useContext(GlobalContext);

  const [current_hover, set_Current_Hover] = useState<string>("");
  const [imageLightness, setImageLightness] = useState<number>(0);

  function getImageLightness(imageSrc: any, callback: (arg0: any) => void) {
    var img = document.createElement("img");
    img.src = imageSrc;
    img.style.display = "none";
    img.crossOrigin = "Anonymous";
    document.body.appendChild(img);

    var colorSum = 0;

    img.onload = function () {
      // create canvas
      var canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      var ctx = canvas.getContext("2d");
      ctx!.drawImage(img, 0, 0);

      var imageData = ctx!.getImageData(0, 0, canvas.width, canvas.height);
      var data = imageData.data;
      var r, g, b, avg;

      for (var x = 0, len = data.length; x < len; x += 4) {
        r = data[x];
        g = data[x + 1];
        b = data[x + 2];

        avg = Math.floor((r + g + b) / 3);
        colorSum += avg;
      }

      var brightness = Math.floor(colorSum / (img.width * img.height));
      callback(brightness);
    };
  }

  useEffect(() => {
    data &&
      getImageLightness(data?.image[0].url, (brightness: any) => {
        //console.log(brightness, data.name)
        setImageLightness(brightness);
      });
  }, [data]);

  const handleMouseEnter = (_id: string): void => {
    set_Current_Hover(_id);
  };

  const handleMouseLeave = (): void => {
    set_Current_Hover("");
  };

  return (
    <div
      onClick={() => setCurrentPlayList(data, dispatch)}
      className="ml-5 first:ml-0 flex-shrink-0"
      style={{ ...style }}
    >
      <div className="ml-12 md:ml-6">
        <h2 className="text-[17px] font-normal text-[#ffffeb]">
          {truncate(data?.name, 36)}
        </h2>
      </div>
      <div className="mt-1 rounded-xl relative">
        <div className="relative w-full">
          <div className="absolute z-20 top-2 left-[11%]">
            <Spatial imageBrightness={imageLightness} />
          </div>
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
            className={`cursor-pointer rounded-xl w-[287px] object-contain h-[237px] rounded-xl ${
              current_hover === data?.id ? "brightness-[.7]" : "brightness-100"
            } `}
            alt=""
            width={287}
            height={237}
            onMouseEnter={() => handleMouseEnter(data?.id)}
            onMouseLeave={handleMouseLeave}
          />
        </div>
      </div>
      {/*   <span className="text-[#ffffffeb] ml-12 md:ml-6 text-[12px] font-normal">
        {truncate(data?.name, 36)}
      </span> */}
    </div>
  );
};

export default PlayListCard;
