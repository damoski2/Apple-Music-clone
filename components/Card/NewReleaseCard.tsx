import React, { useState, useEffect, useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import AppleLogoDark from "../../assets/images/AppleLogoDark.svg";
import AppleLogoLight from "../../assets/images/AppleLogoLight.svg"
import CardRedPlayIcon from "../../assets/images/CradRedPlayIcon.svg";
import { AlbumPayload } from '../../interface'
import _ from "lodash";
import { animated } from "react-spring";
import { GlobalContext } from '../../context/GlobalContext'



interface Props {
  data: AlbumPayload;
  style?: any
}

const truncate = (str: string, n: number) => {
  return str?.length > n ? str.substr(0, n - 1) + "..." : str;
}

const RegularCard = ({ data, style }: Props) => {

  const { dispatch } = useContext(GlobalContext);

  const [current_hover, set_Current_Hover] = useState<string>("");
  const [imageLightness, setImageLightness] = useState<number>(0);

  const handleMouseEnter = (_id: string): void => {
    set_Current_Hover(_id);
  };

  const handleMouseLeave = (): void => {
    set_Current_Hover("");
  };

  function getImageLightness(imageSrc: any,callback: (arg0: any)=>void) {
    var img = document.createElement("img");
    img.src = imageSrc;
    img.style.display = "none";
    img.crossOrigin = "Anonymous";
    document.body.appendChild(img);

    var colorSum = 0;

    img.onload = function() {
        // create canvas
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        var ctx = canvas.getContext("2d");
        ctx!.drawImage(img,0,0);

        var imageData = ctx!.getImageData(0,0,canvas.width,canvas.height);
        var data = imageData.data;
        var r,g,b,avg;

        for(var x = 0, len = data.length; x < len; x+=4) {
            r = data[x];
            g = data[x+1];
            b = data[x+2];

            avg = Math.floor((r+g+b)/3);
            colorSum += avg;
        }

        var brightness = Math.floor(colorSum / (img.width*img.height));
        callback(brightness);
    }
}

  useEffect(()=>{
    data && getImageLightness(data?.images[1].url,(brightness: any)=>{
      //console.log(brightness, data.name)
      setImageLightness(brightness)
    })
  },[data])

  //console.log(data)


  return (
    <animated.div
    onClick={() => {
      dispatch({
        type: "SET_CURRENT_PLAYLIST_TRACKS_URI",
        payload: [data?.uri],
      });
    }}
    className="ml-5 flex-shrink-0" style={{ ...style }}  >
      <div className=" rounded-xl relative">
        <div className="relative w-full">

        <Image src={ imageLightness <= 100 ? AppleLogoLight : AppleLogoDark } className="absolute z-20 top-1 left-[70%]" alt="" />

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
            src={data?.images[0].url}
            className={`cursor-pointer w-[237px] h-[237px] rounded-xl ${
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
        {truncate(data?.name, 16)}
      </span>
    </animated.div>
  );
};

export default RegularCard;
