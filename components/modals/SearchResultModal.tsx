import React, { useContext, useEffect } from "react";
import Image from "next/image";
import { GlobalContext } from "../../context/GlobalContext";
import { Divider } from "antd";

const SearchResultModal = () => {
  const { dispatch, searchResults, setCurrentSong } = useContext(GlobalContext);

  const handleMusicSelect = (_song: any) => {
    
    setCurrentSong(_song, dispatch);
    dispatch({
      type: "SET_CURRENT_PLAYLIST_TRACKS_URI",
      payload: [_song.uri],
    });
  };

  return (
    <div className="fixed rounded-md w-[302px] max-h-[695px] p-[6px] h-fit bg-[#342250] z-20 bg-opacity-40 bg-clip-padding backdrop-blur-lg top-[100px] left-6 border-[.1px] border-[#fff] overflow-scroll text-[#fff] ">
      <ul>
        {searchResults?.map((result: any, index: number) => (
          <>
            <li
              onClick={() => {
                console.log("music selected", result);
                handleMusicSelect(result);
              }}
              key={index}
              className="flex items-center px-[25px] py-[10px] cursor-pointer">
              <Image src={result?.albumUrl} alt="" width={46} height={46} />
              <div className="flex flex-col ml-2">
                <span className="text-white text-[13px]">{result?.title}</span>
                <span className="text-xs text-[#BFBFBF] font-normal">
                  Song . {result?.artist}
                </span>
              </div>
            </li>
            {index !== searchResults.length - 1 && (
              <Divider
                style={{ width: "90%" }}
                className="w-11/12 bg-[#BFBFBF] h-[.1px]"
              />
            )}
          </>
        ))}
      </ul>
    </div>
  );
};

export default SearchResultModal;
