import React, { useContext, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { Layout } from "../components/import";
import StyledTable from '../components/Table'
import { PrivateRoute } from "../utils";
import { GlobalContext } from "../context/GlobalContext";
import SpotifyWebApi from "spotify-web-api-node";
import { loader_types } from '../types'

//import 'antd/dist/reset.css';
import { millisToMinutesAndSeconds } from "../utils";

import PlayWhiteIcon from "../assets/images/PlayWhiteIcon.svg";
import ShufffleWhiteIcon from "../assets/images/ShuffleWhiteIcon.svg";
import PlayListThreeDotIcon from "../assets/images/PlayListThreeDotIcon.svg";
import SongThreeDotIcon from "../assets/images/SongThreeDotIcon.svg";


const spotifyApi = new SpotifyWebApi({
  clientId: "0c064b242e744e0ca6d6dbbc5458c704",
});

let currentId = "";

const Playlist = () => {
  const { query, isReady } = useRouter();
  const {
    currentPlaylist,
    accessToken,
    dispatch,
    currentPlaylistTracks,
    setCurrentSong,
    setNextSong,
    setPrevSong,
    handleSetLoader,
  } = useContext(GlobalContext);

  const [current_hover, set_Current_Hover] = useState<string>("");

  const handleMouseEnter = (_id: string): void => {
    set_Current_Hover(_id);
  };

  const handleMouseLeave = (): void => {
    set_Current_Hover("");
  };

  const findSongIndex = (elem: any) => elem.id === currentId;

  const handleSetCurrentSong = (index: any) => {
    let _idx = currentPlaylistTracks.findIndex(findSongIndex);
    let _currentSong = currentPlaylistTracks[_idx];
    setCurrentSong(_currentSong, dispatch);
    setNextSong(currentPlaylistTracks[_idx + 1], dispatch);
    setPrevSong(currentPlaylistTracks[_idx - 1], dispatch);

    resetCurrentPlaylistTrack(_idx);

  };

  const resetCurrentPlaylistTrack = (_songIndex: number) => {
    currentPlaylistTracks.forEach((track: any, index: number) => {
      let _len: number;

      if(currentPlaylistTracks.length === 1){
        _len = 1;
      }else{
        _len = currentPlaylistTracks.length - 1
      }

      let _currIndex = _songIndex;
      let newTrack = [];
      while (_currIndex < _len) {
        newTrack.push(currentPlaylistTracks[_currIndex].uri);
        _currIndex++;
      }
      _currIndex = 0;
      while (_currIndex < _songIndex) {
        newTrack.push(currentPlaylistTracks[_currIndex].uri);
        _currIndex++;
      }

      index === currentPlaylistTracks.length - 1 &&
        (() => {
          //console.log("newTrack", newTrack);
          dispatch({
            type: "SET_CURRENT_PLAYLIST_TRACKS_URI",
            payload: newTrack,
          });
        })();

      //return newTrack
    });
  };

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);

  useEffect(() => {
    if (!isReady) return;
    if (!query.playlist_id) return;

    handleSetLoader({ state: 'load_playlist', value: true } as { state: loader_types, value: boolean }, dispatch)

    spotifyApi.getPlaylist(query.playlist_id as string).then((data) => {
      let playlist = data.body;
      dispatch({
        type: "SET_CURRENT_PLAYLIST",
        payload: {
          id: playlist.id,
          name: playlist.name,
          image: playlist.images,
          uri: playlist.uri,
          snapshot_id: playlist.snapshot_id,
          href: playlist.href,
          tracks: playlist.tracks,
          owner: playlist.owner,
        },
      });
    });

    spotifyApi.getPlaylistTracks(query.playlist_id as string).then((data) => {
      let tracks: any = data.body.items;

      tracks = tracks.map((track: any) => {
        return {
          song: {
            name: track.track.name,
            preview_image: track.track.album.images[0].url,
          },
          artist: track.track.artists[0].name,
          album: track.track.album.name,
          time: millisToMinutesAndSeconds(Number(track.track.duration_ms)),
          href: track.track.href,
          id: track.track.id,
          uri: track.track.uri,
          image: track.track.album.images[0].url,
        };
      });

      dispatch({
        type: "SET_CURRENT_PLAYLIST_TRACKS",
        payload: tracks,
      });
    });
    handleSetLoader({ state: 'not_loading', value: false } as { state: loader_types, value: boolean }, dispatch)
  }, [accessToken, isReady, query]);

  const columns = [
    {
      title: "Song",
      dataIndex: "song",
      key: "song",

      render: (data: any, index: any) => (
        <div
          onClick={() => {

            currentId = index.id;
            handleSetCurrentSong(index);
          }}
          className="flex flex-row items-center relative cursor-pointer">
          <Image
            src={data.preview_image}
            alt=""
            width={40}
            height={40}
            className={`backdrop-blur-sm ${
              current_hover === index?.id ? "brightness-[.3]" : "brightness-100"
            }`}
            onMouseEnter={() => handleMouseEnter(index?.id)}
            onMouseLeave={handleMouseLeave}
          />
          <Image
            src={PlayWhiteIcon}
            alt=""
            onMouseEnter={() => handleMouseEnter(index?.id)}
            className={`absolute left-4 ${
              current_hover === index?.id ? "opacity-100" : "opacity-0"
            }`}
          />
          <a className="ml-2 hover:decoration-transparent ">{data.name}</a>
        </div>
      ),
    },
    {
      title: "Artist",
      dataIndex: "artist",
      key: "artist",
    },
    {
      title: "Album",
      dataIndex: "album",
      key: "album",
    },
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
      render: (text: string) => (
        <div className="flex flex-row items-center ">
          <p className="mr-2 mb-0">{text}</p>
          <Image src={SongThreeDotIcon} alt="" className="cursor-pointer" />
        </div>
      ),
    },
  ];

  return (
    <PrivateRoute>
      <Layout>
        <div className="h-screen bg-[#323232] pt-[90px] px-10">
          <div className="flex flex-row">
            <Image
              src={currentPlaylist?.image[0].url}
              alt=""
              width={270}
              height={270}
            />
            <div className="ml-10 self-end">
              <h1 className="text-white text-3xl font-normal">
                {currentPlaylist?.name}
              </h1>
              <h1 className="text-[#FF293F] text-[35px] font-normal">
                {currentPlaylist?.owner?.display_name}
              </h1>
              <p className="text-[#BFBFBF] text-xs">
                {currentPlaylist?.tracks?.total} SONGS
              </p>

              <div className="flex flex-row w-full mt-16">
                <button className="bg-[#d60017] rounded-[6px] h-7 px-3 text-white flex flex-row justify-center items-center w-[124px] text-xs">
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

          <div className="w-full mt-16">
            {currentPlaylistTracks && (
              <StyledTable
              columns={columns}
              dataSource={currentPlaylistTracks}
              scroll={{ y: 650 }}
              pagination={
                currentPlaylistTracks.length > 500 && {
                  defaultPageSize: 10,
                  hideOnSinglePage: true,
                }
              }
            />
            )}
          </div>
        </div>
      </Layout>
    </PrivateRoute>
  );
};

export default Playlist;
