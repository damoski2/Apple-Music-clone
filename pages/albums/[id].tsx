import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { GlobalContext } from "../../context/GlobalContext";
import { useRouter } from "next/router";
import SpotifyWebApi from "spotify-web-api-node";
import { loader_types } from "../../types";
import { millisToMinutesAndSeconds, PrivateRoute } from "../../utils";
import { Layout } from "../../components/import";

import PlayWhiteIcon from "../../assets/images/PlayWhiteIcon.svg";
import ShufffleWhiteIcon from "../../assets/images/ShuffleWhiteIcon.svg";
import SongThreeDotIcon from "../../assets/images/SongThreeDotIcon.svg";
import PlayRedIcon from "../../assets/images/PlayRedIcon.svg";

const spotifyApi = new SpotifyWebApi({
  clientId: "0c064b242e744e0ca6d6dbbc5458c704",
});

let currentId = "";

const Index = () => {
  const router = useRouter();
  const { id } = router.query;

  const {
    accessToken,
    dispatch,
    handleSetLoader,
    setCurrentAlbum,
    setCurrentSong,
    setNextSong,
    setPrevSong,
    currentAlbum,
  } = useContext(GlobalContext);
  const [currentAlbumTracks, setCurrentAlbumTracks] = useState<any[]>([]);
  const [current_hover, set_Current_Hover] = useState<string>("");

  const handleMouseEnter = (_id: string): void => {
    set_Current_Hover(_id);
  };

  const handleMouseLeave = (): void => {
    set_Current_Hover("");
  };

  const findSongIndex = (elem: any) => elem.id === currentId;

  const handleSetCurrentSong = (index: any) => {
    let _idx = currentAlbumTracks.findIndex(findSongIndex);
    let _currentSong = currentAlbumTracks[_idx];
    setCurrentSong(_currentSong, dispatch);
    setNextSong(currentAlbumTracks[_idx + 1], dispatch);
    setPrevSong(currentAlbumTracks[_idx - 1], dispatch);

    resetCurrentAlbumTrack(_idx);
  };

  const resetCurrentAlbumTrack = (_songIndex: number) => {
    currentAlbumTracks.forEach((track: any, index: number) => {
      let _len: number;

      if (currentAlbumTracks.length === 1) {
        _len = 1;
      } else {
        _len = currentAlbumTracks.length - 1;
      }

      let _currIndex = _songIndex;
      let newTrack = [];
      while (_currIndex < _len) {
        newTrack.push(currentAlbumTracks[_currIndex].uri);
        _currIndex++;
      }
      _currIndex = 0;
      while (_currIndex < _songIndex) {
        newTrack.push(currentAlbumTracks[_currIndex].uri);
        _currIndex++;
      }

      index === currentAlbumTracks.length - 1 &&
        (() => {
          //console.log("newTrack", newTrack);
          dispatch({
            type: "SET_CURRENT_ALBUM_TRACKS_URI",
            payload: newTrack,
          });
        })();

      //return newTrack
    });
  };

  useEffect(() => {
    if (!accessToken || !id) return;
    spotifyApi.setAccessToken(accessToken);

    const getAlbum = async () => {
      try {
        handleSetLoader(
          { state: "load_playlist", value: true } as {
            state: loader_types;
            value: boolean;
          },
          dispatch
        );

        let _album = await spotifyApi.getAlbum(id as string).then((data) => {
          console.log("albums, ", data.body);
          return data.body;
        });

        let _albumTracks = await spotifyApi
          .getAlbumTracks(id as string)
          .then((data) => {
            let tracks: any = data.body.items;
            let newTrack: any[] = [];

            console.log("tracks", data.body);

            tracks.forEach((track: any) => {
              console.log(track);
              newTrack.push({
                name: track?.name,
                time: millisToMinutesAndSeconds(Number(track?.duration_ms)),
                href: track?.href,
                id: track?.id,
                uri: track?.uri,
              });
            });
            return newTrack;
          });

        //console.log('album tracks', _albumTracks)

        setCurrentAlbumTracks(_albumTracks);
        setCurrentAlbum(_album, dispatch);
        handleSetLoader(
          { state: "not_loading", value: false } as {
            state: loader_types;
            value: boolean;
          },
          dispatch
        );
      } catch (error) {
        console.log(error);
      }
    };
    getAlbum();
  }, [accessToken, id]);

  useEffect(()=>{
    if(currentAlbumTracks.length === 0) return
    currentId = currentAlbumTracks[0].id;
    let _idx = currentAlbumTracks.findIndex(findSongIndex);
    let _currentSong = currentAlbumTracks[_idx];
    setCurrentSong(_currentSong, dispatch);
    setNextSong(currentAlbumTracks[_idx + 1], dispatch);
    setPrevSong(currentAlbumTracks[_idx - 1], dispatch);
  },[currentAlbumTracks])

  const handleAlbumPlay = ()=>{
    resetCurrentAlbumTrack(0);
  }

  return (
    <PrivateRoute>
      <Layout>
        <div className="h-screen bg-[#323232] flex flex-col justify-between" >
        <div className="pt-[90px] px-10">
          <div className="flex flex-row">
            <Image
              src={currentAlbum?.images[0].url}
              alt=""
              width={270}
              height={270}
            />
            <div className="ml-10 self-end">
              <h1 className="text-white text-3xl font-normal">
                {currentAlbum?.name}
              </h1>
              <h1 className="text-[#FF293F] text-[35px] font-normal">
                {currentAlbum?.artists[0]?.name}
              </h1>
              <p className="text-[#BFBFBF] text-xs">
                {currentAlbum?.genres?.join("/")} •{" "}
                {currentAlbum?.release_date.split("-")[0]}{" "}
              </p>
              <p className="text-[#BFBFBF] text-xs">
                {currentAlbum?.tracks?.total} SONGS
              </p>

              <div className="flex flex-row w-full mt-16">
                <button onClick={handleAlbumPlay} className="bg-[#d60017] rounded-[6px] h-7 px-3 text-white flex flex-row justify-center items-center w-[124px] text-xs">
                  <Image src={PlayWhiteIcon} alt="" />{" "}
                  <span className="ml-2">Play</span>
                </button>
                <button className="bg-[#d60017] rounded-[6px] h-7 px-3 text-white flex flex-row justify-center items-center w-[124px] text-xs ml-2.5">
                  <Image src={ShufffleWhiteIcon} alt="" />
                  <span className="ml-2">Shuffle</span>
                </button>
              </div>
            </div>
          </div>

          <div className="w-full mt-16 max-h-[700px] overflow-y-scroll">
            {currentAlbumTracks?.map((track: any, index: number) => (
              <div
                onMouseEnter={() => handleMouseEnter(track?.id)}
                onMouseLeave={handleMouseLeave}
                onClick={() => {
                  currentId = track?.id;
                  handleSetCurrentSong(index);
                }}
                key={index}
                className="flex flex-row justify-between w-full items-center odd:bg-[#4d4d4d] px-[18px] h-[46px]">
                <div className="flex flex-row">
                  {track?.id === current_hover ? (
                    <Image className="mr-5 cursor-pointer" src={PlayRedIcon} alt="" />
                  ) : (
                    <span className="text-[#ffffffa3] text-[13px] mr-5">
                      {index + 1}
                    </span>
                  )}
                  <p className="text-[#ffffffeb] text-[13px]">{track?.name}</p>
                </div>
                <div className="flex flex-row items-center">
                  <p className="mr-3 text-[#ffffffa3] text-[13px]">
                    {track?.time}
                  </p>
                  <Image className="cursor-pointer" src={SongThreeDotIcon} alt="" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <footer className="px-10 py-[14px] bg-[#4d4d4d]">
          <p className="text-[#ffffffa3] text-[11px]">
            Copyright @ {new Date().getFullYear()}{" "}
            <span className="text-[#ffffffeb]">Apple Inc.</span>
          </p>
        </footer>
        </div>
      </Layout>
    </PrivateRoute>
  );
};

export default Index;
