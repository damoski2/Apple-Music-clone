import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import AppleLogoDar from "../../assets/images/AppleLogoDark.svg";

const RegularCard = () => {


  const [current_hover, set_Current_Hover] = useState<string>("");

  const handleMouseEnter = (_id: string): void => {
    set_Current_Hover(_id);
  };

  const handleMouseLeave = (): void => {
    set_Current_Hover("");
  };


  return (
    <div>
      <span className="text-[#ffffffa3] text-[15px] font-normal">
        Featuring Lil Uzi Vert
      </span>
      <div className="mt-2 rounded-xl w-[237px] h-[305px]">
        <Image src={`https://i.scdn.co/image/ab67616100005174002684808eb17d8b3645b57c`} className="cursor-pointer rounded-xl" alt="" width={237} height={305} />
      </div>
    </div>
  );
};

export default RegularCard;
