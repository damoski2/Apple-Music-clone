import React from "react";
import Image from "next/image";
import Link from "next/link";
import ListenNow from "../../../assets/images/ListenNowMobile.svg";
import ListenNowActive from '../../../assets/images/ListenNowMobileActive.svg'
import Browse from "../../../assets/images/BrowseMobile.svg";
import Radio from "../../../assets/images/RadioMobile.svg";
import Library from "../../../assets/images/LibraryMobile.svg";
import Search from "../../../assets/images/SearchMobile.svg";
import { useRouter, NextRouter } from "next/router";

const Index = () => {
  const { query, pathname }: NextRouter = useRouter();

  const returnActive = (
    value: string,
    playlistPath: string | null = null
  ): ReturnType<() => boolean> => {
    switch (pathname) {
      case "/":
        return value === "/";

      case "/browse":
        return value === "/browse";

      case "/radio":
        return value === "/radio";

      case "/recently-added":
        return value === "/recently-added";

      case "/artist":
        return value === "/artist";

      case "/albums":
        return value === "/albums";

      case "/songs":
        return value === "/songs";

      case "/playlist":
        return playlistPath === query?.playlist_id;

      default:
        return false;
    }
  };

  return (
    <div className="bg-[#4D4D4D] w-full bg-opacity-40 p-8 shadow-lg backdrop-filter backdrop-blur-md flex flex-row items-center justify-between">
      <div>
        <Link href="/" className="flex flex-col items-center" >
          <Image src={ pathname === "/"? ListenNowActive : ListenNow } alt="" width={23} height={23} />
          <span className={`text-[9px] mt-[1.5px] ${ returnActive('/') ? 'text-[#FF293F]':'text-[#bfbfbf]' } `} >Listen Now</span>
        </Link>
      </div>
      <div>
      <Link href="/browse" className="flex flex-col items-center" >
          <Image src={Browse} alt="" width={23} height={23} />
          <span className="text-[9px] mt-[1.5px] text-[#bfbfbf] " >Browse</span>
        </Link>
      </div>
      <div>
      <Link href="/" className="flex flex-col items-center" >
          <Image src={Radio} alt="" width={23} height={23} />
          <span className="text-[9px] mt-[1.5px] text-[#bfbfbf] " >Radio</span>
        </Link>
      </div>
      <div>
      <Link href="/" className="flex flex-col items-center" >
          <Image src={Library} alt="" width={23} height={23} />
          <span className="text-[9px] mt-[1.5px] text-[#bfbfbf] " >Library</span>
        </Link>
      </div>
      <div>
      <Link href="/" className="flex flex-col items-center" >
          <Image src={Search} alt="" width={23} height={23} />
          <span className="text-[9px] mt-[1.5px] text-[#bfbfbf] " >Search</span>
        </Link>
      </div>
    </div>
  );
};

export default Index;
