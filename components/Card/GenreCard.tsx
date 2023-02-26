import React, { useState, useEffect, useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import AppleLogoDark from "../../assets/images/AppleLogoDark.svg";
import AppleLogoLight from "../../assets/images/AppleLogoLight.svg";
import CardRedPlayIcon from "../../assets/images/CradRedPlayIcon.svg";
import { ArtistPayload, TrackPayload } from "../../interface";
import { Genre } from '../../types'
import _ from "lodash";
import { GlobalContext } from "../../context/GlobalContext";
import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi({
  clientId: "0c064b242e744e0ca6d6dbbc5458c704",
});






interface Props {
  data: Genre;
}

const truncate = (str: string, n: number) => {
  return str?.length > n ? str.substr(0, n - 1) + "..." : str;
};

const GenreCard = ({ data }: Props) => {
  const { dispatch, setCurrentSong, accessToken } = useContext(GlobalContext);

  useEffect(()=>{
    if(!accessToken) return
  },[accessToken])


  const [current_hover, set_Current_Hover] = useState<number>(0);

  const handleMouseEnter = (_id: number): void => {
    set_Current_Hover(_id);
  };

  const handleMouseLeave = (): void => {
    set_Current_Hover(0);
  };

  const goToGenre = async()=>{
    spotifyApi.getPlaylistsForCategory(data.spotify_meta_data,{
      country: 'USA',
      limit: 10,
      offset: 0
    })
      .then((data)=>{
        console.log('returned genre',data.body)
      })
  }
  

  return (
    <div
      onClick={goToGenre}
      className="flex-shrink-0"
      >
      <div className="mt-1 rounded-xl relative">
        <div className="relative w-full">
          <Image
            src={data?.image as unknown as string}
            className={`cursor-pointer md:w-[237px] w-full md:h-[237px] h-full rounded-xl ${
              current_hover === data?.id ? "brightness-[.7]" : "brightness-100"
            } `}
            alt=""
            
            onMouseEnter={() => handleMouseEnter(data?.id)}
            onMouseLeave={handleMouseLeave}
          />
        </div>
      </div>
      <span className="text-[#ffffffeb] text-[12px] font-normal">
        {truncate(data?.name, 16)}
      </span>
    </div>
  );
};

export default GenreCard;
