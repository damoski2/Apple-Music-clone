import React, { useContext, useEffect, useMemo, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Layout } from "../components/import";
import StyledTable from "../components/Table";
import { PrivateRoute } from "../utils";
import { GlobalContext } from "../context/GlobalContext";
import SpotifyWebApi from "spotify-web-api-node";
import { loader_types } from "../types";

//import 'antd/dist/reset.css';
import { millisToMinutesAndSeconds } from "../utils";

import PlayWhiteIcon from "../assets/images/PlayWhiteIcon.svg";
import ShufffleWhiteIcon from "../assets/images/ShuffleWhiteIcon.svg";
import PlayListThreeDotIcon from "../assets/images/PlayListThreeDotIcon.svg";
import SongThreeDotIcon from "../assets/images/SongThreeDotIcon.svg";
import PlayingAnimation from "../components/PlayingAnimation";

import AddToPlaylistModal from "../components/modals/AddToPlaylistModal";
import { index } from "./artists";

const spotifyApi = new SpotifyWebApi({
  clientId: "0c064b242e744e0ca6d6dbbc5458c704",
});

let currentId = "";

const Playlist = () => {
  const ref = useRef<any>(null);
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
    currentPlaylistOrAlbumTracksUri,
  } = useContext(GlobalContext);

  const [current_hover, set_Current_Hover] = useState<string>("");
  const [current_playing, set_Current_Playing] = useState<string>("");
  const [displayOptions, setDisplayOptions] = useState<{
    index: any;
    state: boolean;
  }>({
    index: null,
    state: false,
  });

  const handleDisplayOptionsToggle = (_index: any): void => {
    console.log("index", _index);
    setDisplayOptions({
      ...displayOptions,
      index: _index,
      state: !displayOptions.state,
    });

    dispatch({
      type: "SET_OPEN_MODAL_SONGURI",
      payload: _index?.uri,
    });
  };

  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (ref?.current && !ref?.current?.contains(e.target)) {
        setDisplayOptions({
          index: null,
          state: false,
        });
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
  }, [ref]);

  const handleMouseEnter = (_id: string): void => {
    set_Current_Hover(_id);
  };

  const handleMouseLeave = (): void => {
    set_Current_Hover("");
  };

  const findSongIndex = (elem: any) => elem.id === currentId;
  const shuffleArray = (arr: string[]) => arr.sort(() => Math.random() - 0.5);

  const handleSetCurrentSong = (index: any) => {
    let _idx = currentPlaylistTracks.findIndex(findSongIndex);
    let _currentSong = currentPlaylistTracks[_idx];
    setCurrentSong(_currentSong, dispatch);
    setNextSong(currentPlaylistTracks[_idx + 1], dispatch);
    setPrevSong(currentPlaylistTracks[_idx - 1], dispatch);

    resetCurrentPlaylistTrack(_idx);
  };

  const returnCurrentSongUri = (index: any) => {
    let _idx = currentPlaylistTracks.findIndex((elem:any)=> elem.id === index);
    let _currentSong = currentPlaylistTracks[_idx];
    return _currentSong?.uri;
  };

  const resetCurrentPlaylistTrack = (
    _songIndex: number,
    shuffle: boolean = false
  ) => {
    currentPlaylistTracks.forEach((track: any, index: number) => {
      let _len: number;

      if (currentPlaylistTracks.length === 1) {
        _len = 1;
      } else {
        _len = currentPlaylistTracks.length - 1;
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
          shuffle === true && (newTrack = shuffleArray(newTrack));
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

    handleSetLoader(
      { state: "load_playlist", value: true } as {
        state: loader_types;
        value: boolean;
      },
      dispatch
    );

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
          artistId: track.track.artists[0].id,
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
    handleSetLoader(
      { state: "not_loading", value: false } as {
        state: loader_types;
        value: boolean;
      },
      dispatch
    );
  }, [accessToken, isReady, query]);

  useEffect(() => {
    if (currentPlaylistTracks.length === 0) return;
    currentId = currentPlaylistTracks[0].id;
    let _idx = currentPlaylistTracks.findIndex(findSongIndex);
    let _currentSong = currentPlaylistTracks[_idx];
    /*  setCurrentSong(_currentSong, dispatch);
    setNextSong(currentPlaylistTracks[_idx + 1], dispatch);
    setPrevSong(currentPlaylistTracks[_idx - 1], dispatch); */
  }, [currentPlaylistTracks]);

  const handlePlaylistPlay = () => {
    resetCurrentPlaylistTrack(0);
  };

  const handlePlaylistShuffle = () => {
    resetCurrentPlaylistTrack(0, true);
  };

  //Watch change in playing song for what currently playing
  useEffect(() => {
    console.log('changed!!!!')
    currentPlaylistOrAlbumTracksUri.length > 0 &&
      set_Current_Playing(currentPlaylistOrAlbumTracksUri[0]);
  }, [currentPlaylistOrAlbumTracksUri]);



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
          className="flex flex-row items-center relative cursor-pointer"
        >
          <Image
            src={data.preview_image}
            alt=""
            width={40}
            height={40}
            className={`backdrop-blur-sm ${
              current_hover === index?.id || (returnCurrentSongUri(index.id) === current_playing) ? "brightness-[.3]" : "brightness-100"
            }`}
            onMouseEnter={() => handleMouseEnter(index?.id)}
            onMouseLeave={handleMouseLeave}
          />
          {returnCurrentSongUri(index.id) === current_playing ? (
            <div className="absolute left-2 z-30" >
              <PlayingAnimation />
              </div>
          ) : (
            <Image
              src={PlayWhiteIcon}
              alt=""
              onMouseEnter={() => handleMouseEnter(index?.id)}
              className={`absolute left-4 ${
                current_hover === index?.id ? "opacity-100" : "opacity-0"
              }`}
            />
          )}
          <a className="ml-2 hover:decoration-transparent ">{data.name}</a>
        </div>
      ),
    },
    {
      title: "Artist",
      dataIndex: "artist",
      key: "artist",
      render: (data: any, index: any) => (
        <Link href={`/artists/${index.artistId}`}>
          <p className="cursor-pointer">{index.artist}</p>
        </Link>
      ),
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
      render: (data: any, index: any) => (
        <div className="flex flex-row items-center relative">
          <p className="mr-2 mb-0">{data}</p>
          <Image
            onClick={() => handleDisplayOptionsToggle(index)}
            src={SongThreeDotIcon}
            alt=""
            className="cursor-pointer"
          />
          <div className={`absolute z-50 left-16 top-4 w-fit`}>
            {displayOptions.index === index && (
              <AddToPlaylistModal refPasser={ref} />
            )}
          </div>
        </div>
      ),
    },
  ];

  /*  */
  return (
    <PrivateRoute>
      <Layout>
        <div
          className={`${
            currentPlaylistTracks.length >= 7 ? "h-full" : "h-screen"
          } bg-[#323232] pt-[90px] px-10`}
        >
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
                <button
                  onClick={handlePlaylistPlay}
                  className="bg-[#d60017] rounded-[6px] h-7 px-3 text-white flex flex-row justify-center items-center w-[124px] text-xs"
                >
                  <Image src={PlayWhiteIcon} alt="" />{" "}
                  <span className="ml-2">Play</span>
                </button>
                <button
                  onClick={handlePlaylistShuffle}
                  className="bg-[#d60017] rounded-[6px] h-7 px-3 text-white flex flex-row justify-center items-center w-[124px] text-xs ml-2.5"
                >
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
