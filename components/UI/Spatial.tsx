import React from "react";
import Image from "next/image";
import SpatialLight from "../../assets/images/SpatialIconLight.svg";
import SpatialDark from "../../assets/images/SpatialIconDark.svg";

interface Props {
  imageBrightness: number;
}

const Spatial = ({ imageBrightness }: Props) => {
  return imageBrightness <= 100 ? (
    <div className="flex flex-row bg-[#4D4D4D] w-[90px] rounded-md p-1 justify-between items-center">
      <Image src={SpatialLight} alt="" />
      <div className="flex flex-col ml-1">
        <p className="text-[9px] text-white" >Spatial Audio</p>
        <span className="text-[7px] text-white"  >with Dolby Atmos</span>
      </div>
    </div>
  ) : (
    <div className="flex flex-row bg-[#000] w-[90px] rounded-md p-1 justify-between items-center">
    <Image src={SpatialLight} alt="" />
    <div className="flex flex-col ml-1">
      <p className="text-[9px] text-white" >Spatial Audio</p>
      <span className="text-[7px] text-white"  >with Dolby Atmos</span>
    </div>
  </div>
  );
};

export default Spatial;
