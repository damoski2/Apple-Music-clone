import React, { useState, useContext, useRef, useEffect } from "react";
import { useRouter, NextRouter } from 'next/router'
import Link from "next/link";
import Image from "next/image";
import SearchIcon from "../../../assets/images/SearchIcon.svg";
import ListenNowIcon from "../../../assets/images/ListenNow.svg";
import BrowseIcon from "../../../assets/images/BrowseIcon.svg";
import RadioIcon from "../../../assets/images/Radio.svg";
import RecentlyAddedIcon from "../../../assets/images/RecentlyAdded.svg";
import ArtistIcon from "../../../assets/images/ArtistIcon.svg";
import AlbumsIcon from "../../../assets/images/Album.svg";
import SongsIcon from "../../../assets/images/Song.svg";
import { Input, Select } from "antd";
import Styled from "styled-components";
import { GlobalContext } from "../../../context/GlobalContext";
import SearchResultModal from "../../modals/SearchResultModal";
import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi({
  clientId: "0c064b242e744e0ca6d6dbbc5458c704",
});

const CustomSearch = Styled(Select).attrs({})`
    .ant-select-selector{
        background: transparent !important;
        border: .01px solid #fff !important;
        color: #fff !important;
    }

    .ant-select{
        background: transparent !important;
    }
    border: none !important;
    background: transparent !important;

    :placeholder{
      color: #fff;
    }
`;

const Index = () => {
  const {
    dispatch,
    setGlobalSearchInput,
    setCurrentPlayList,
    searchResults,
    searchInput,
    accessToken,
    setPlaylists,
    playlists,
    auth_code
  } = useContext(GlobalContext);
  const ref = useRef<any>(null);
  const { query, pathname }: NextRouter = useRouter()
  const router: NextRouter = useRouter()


  const [displaySearchResult, setDisplaySearchResult] = useState<boolean>(false);

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);

  useEffect(() => {
    if (!accessToken) return;

    spotifyApi.getUserPlaylists().then((data) => {
      let result: any = data.body.items;
      console.log(data.body.items[0]);
      result = result.map((item: any) => {
        return {
          id: item.id,
          name: item.name,
          image: item.images,
          uri: item.uri,
          snapshot_id: item.snapshot_id,
          href: item.href,
          tracks: item.tracks,
          owner: item.owner,
        };
      });

      //console.log(result)
      setPlaylists(result, dispatch);
    });
  }, [accessToken]);

  useEffect(()=>{
    searchResults && setDisplaySearchResult(true)
  },[searchResults])

  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (ref?.current && !ref?.current?.contains(e.target)) {
        setTimeout(()=>{
          setDisplaySearchResult(false)
        },1000)
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
  }, [ref]);

  const [active, setActive] = useState<boolean>(true);
  const [value, setValue] = useState<string>("");

  const handleChange = (e: any) => {
    console.log(e.target.value);
    setValue(e.target.value);
    setGlobalSearchInput(e.target.value, dispatch);
  };

  const handleSelectTrack = (value: any) => {};


  const returnActive = (value: string, playlistPath: string | null = null): ReturnType<()=> boolean> => {
    switch(pathname){
      case '/':
        return value === '/'

      case '/browse':
        return value === '/browse'

      case '/radio':
        return value === '/radio'

      case '/recently-added':
        return value === '/recently-added'

      case '/artist':
        return value === '/artist'

      case '/albums':
        return value === '/albums'

      case '/songs':
        return value === '/songs'

      case '/playlist':
        return playlistPath === query?.playlist_id
      

      default:
        return false

    }
  }


  return (
    <div className="h-screen max-w-[260px] w-full bg-[#342250] flex flex-col items-center px-[25px] pt-16">
      <div className="relative w-full flex flex-row items-center" >
        <Image src={SearchIcon} alt="" className="absolute left-3 z-10 text-center" />
        <input
          ref={ref}
          className="bg-opacity-6 0 bg-clip-padding backdrop-blur-lg bg-[#342250] border-[0.01px] h-[28px] text-[#fff] focus:outline-none rounded-[4px] py-[1px] pl-8"
          onChange={handleChange}
          value={searchInput}
        />
      </div>
      {displaySearchResult && searchResults.length > 0 && <SearchResultModal />}
      <div className="flex flex-col w-full items-start mt-4">
        <span className="text-[10px] text-[#BFBFBF]">Apple Music</span>
        <ul className="w-full mt-2">
          <li
            onClick={()=> router.push(`/?code=${auth_code}`)}
            className={`flex w-full cursor-pointer flex-row items-center pl-3 py-1.5 rounded-md ${
              returnActive(`/`) && "bg-opacity-10 bg-gray-200 bg-opacity-10 bg-gray-200"
            }`}>
            <div className="w-[20px]">
              <Image src={ListenNowIcon} alt="" />
            </div>
            <span className="ml-2 text-white text-[13px]">Listen Now</span>
          </li>
          <li
            className={`flex w-full flex-row cursor-pointer items-center pl-3 py-1.5 rounded-md ${
              returnActive('/browse') && "bg-opacity-10 bg-gray-200 bg-[#342250]/10"
            }`}>
            <div className="w-[20px]">
              <Image src={BrowseIcon} alt="" />
            </div>
            <span className="ml-2 text-white text-[13px]">Browse</span>
          </li>
          <li
            className={`flex w-full flex-row cursor-pointer items-center pl-3 py-1.5 rounded-md ${
              returnActive('/radio') && "bg-opacity-10 bg-gray-200 bg-[#342250]/10"
            }`}>
            <div className="w-[20px]">
              <Image src={RadioIcon} alt="" />
            </div>
            <span className="ml-2 text-white text-[13px]">Radio</span>
          </li>
        </ul>
        <span className="text-[10px] mt-5 text-[#BFBFBF]">Library</span>
        <ul className="w-full">
          <li
            className={`flex w-full flex-row cursor-pointer items-center pl-3 py-1.5 rounded-md ${
              returnActive('/recently-added') && "bg-opacity-10 bg-gray-200 bg-[#342250]/10"
            }`}>
            <div className="w-[20px]">
              <Image src={RecentlyAddedIcon} alt="" />
            </div>
            <span className="ml-2 text-white text-[13px]">Recently Added</span>
          </li>
          <li
            className={`flex w-full flex-row cursor-pointer items-center pl-3 py-1.5 rounded-md ${
              returnActive('/artist') && "bg-opacity-10 bg-gray-200 bg-[#342250]/10"
            }`}>
            <div className="w-[20px]">
              <Image src={ArtistIcon} alt="" />
            </div>
            <span className="ml-2 text-white text-[13px]">Artists</span>
          </li>
          <li
            className={`flex w-full flex-row cursor-pointer items-center pl-3 py-1.5 rounded-md ${
              returnActive('/albums') && "bg-opacity-10 bg-gray-200 bg-[#342250]/10"
            }`}>
            <div className="w-[20px]">
              <Image src={AlbumsIcon} alt="" />
            </div>
            <span className="ml-2 text-white text-[13px]">Albums</span>
          </li>
          <li
            className={`flex w-full flex-row cursor-pointer items-center pl-3 py-1.5 rounded-md ${
              returnActive('/songs') && "bg-opacity-10 bg-gray-200 bg-[#342250]/10"
            }`}>
            <div className="w-[20px]">
              <Image src={SongsIcon} alt="" />
            </div>
            <span className="ml-2 text-white text-[13px]">Songs</span>
          </li>
        </ul>
        <span className="text-[10px] mt-5 text-[#BFBFBF]">Playlist</span>
        <ul className="w-full">
          {playlists &&
            playlists.map((item: any, index: number) => (
              <li
                onClick={() => setCurrentPlayList(item, dispatch)}
                key={index}
                className={`flex w-full flex-row cursor-pointer items-center pl-3 py-1.5 rounded-md ${
                  returnActive('/playlist', item?.id) && "bg-opacity-10 bg-gray-200"
                } cursor-pointer `}>
                <div className="w-[20px]">
                  <Image src={RecentlyAddedIcon} alt="" />
                </div>
                <span className="ml-2 text-white text-[13px]">{item.name}</span>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default Index;
