import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { GlobalContext } from "../../context/GlobalContext";
import { PrivateRoute, stringShortener } from "../../utils";
import { Layout } from "../../components/import";
import SpotifyWebApi from "spotify-web-api-node";
import { loader_types } from "../../types";
import { Divider } from "antd";
import { AlbumPayload, ArtistPayload } from "../../interface";
import AlbumCard from "../../components/Card/AlbumCard";

import ArtsistPlayIcon from "../../assets/images/CradRedPlayIcon.svg";
import ArrowRightIcon from "../../assets/images/ArrowRight.svg";
import PlayListThreeDotIcon from "../../assets/images/PlayListThreeDotIcon.svg";
import PlayWhiteIcon from "../../assets/images/PlayWhiteIcon.svg";

const spotifyApi = new SpotifyWebApi({
  clientId: "0c064b242e744e0ca6d6dbbc5458c704",
});

const Index = () => {
  const router = useRouter();
  const { id } = router.query;
  const { dispatch, accessToken, setCurrentArtist } = useContext(GlobalContext);

  const [artist, setArtist] = useState<any>({
    artistInfo: null,
    artistAlbums: null,
    artistTopTracks: null,
    artistRelatedArtist: null,
    artistAbout: null,
  });

  const [current_hover, set_Current_Hover] = useState<string>("");

  const handleMouseEnter = (_id: string): void => {
    set_Current_Hover(_id);
  };

  const handleMouseLeave = (): void => {
    set_Current_Hover("");
  };

  const { artistInfo, artistAlbums, artistRelatedArtist, artistTopTracks } =
    artist;

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);

    const getArtist = async () => {
      try {
        await dispatch({
          type: "LOADING_PAGE",
          payload: {
            state: "load_artist",
            value: true,
          } as {
            state: loader_types;
            value: boolean;
          },
        });

        let _info = await spotifyApi.getArtist(id as string).then((data) => {
          return data.body;
        });

        let _album = await spotifyApi
          .getArtistAlbums(id as string)
          .then((data) => {
            return data.body;
          });

        let _tracks = await spotifyApi
          .getArtistTopTracks(id as string, "US")
          .then((data) => {
            return data.body;
          });

        let _relatedArtist = await spotifyApi
          .getArtistRelatedArtists(id as string)
          .then((data) => {
            return data.body;
          });

        setArtist({
          ...artist,
          artistInfo: _info,
          artistAlbums: _album,
          artistTopTracks: _tracks,
          artistRelatedArtist: _relatedArtist,
        });

        await dispatch({
          type: "LOADING_PAGE",
          payload: {
            state: "not_loading",
            value: false,
          } as {
            state: loader_types;
            value: boolean;
          },
        });
      } catch (error) {
        console.log(error);
      }
    };

    getArtist();
  }, [id, accessToken]);

  //console.log(artistTopTracks)

  const handlePlayArtistToptracks = () => {
    let _trackUri = artistTopTracks.tracks.map((track: any) => track.uri);
    dispatch({
      type: "SET_CURRENT_PLAYLIST_TRACKS_URI",
      payload: _trackUri,
    });
    //console.log(_trackUri)
  };

  return (
    <PrivateRoute>
      <Layout>
        <main className="h-full">
          <div className="bg-[#323232] px-10 h-[44vh] flex flex-col justify-end">
            <div className="flex justify-center items-center h-[80%] w-full">
              {artistInfo && (
                <Image
                  width={190}
                  height={190}
                  className="rounded-full max-w-[190px] max-h-[190px] w-[190px] h-[190px] "
                  src={artistInfo?.images[0].url}
                  alt=""
                />
              )}
            </div>
            <div className="mb-[30px] cursor-pointer flex flex-row ">
              <Image
                onClick={handlePlayArtistToptracks}
                width={46}
                height={46}
                src={ArtsistPlayIcon}
                alt=""
              />
              <h1 className="text-[#ffffffeb] ml-4 font-semibold text-[34px]">
                {artistInfo?.name}
              </h1>
            </div>
          </div>

          <div className="bg-[#1f1f1f] px-10 pt-[52px] pb-7">
            <div className="flex flex-row">
              <h2 className="mr-2 text-[#ffffffeb] text-[17px] font-medium">
                Top Songs
              </h2>
              <Image src={ArrowRightIcon} alt="" />
            </div>
            <div className="mt-2 grid grid-rows-3 grid-flow-col overflow-x-scroll ">
              {artistTopTracks?.tracks.map((track: any, index: number) => (
                <div key={index} className="max-w-[319px] w-[319px] mb-2 ">
                  <Divider className="h-[.001px] mt-1 mb-2 bg-[#4D4D4D]" />
                  <div
                    key={index}
                    className="flex flex-row justify-between items-center relative">
                    <div
                      onClick={() => {
                        dispatch({
                          type: "SET_CURRENT_PLAYLIST_TRACKS_URI",
                          payload: [track?.uri],
                        });
                      }}
                      className="flex flex-row">
                      <Image
                        width={40}
                        height={40}
                        src={track?.album?.images[0]?.url}
                        alt=""
                        onMouseEnter={() => handleMouseEnter(track?.id)}
                        onMouseLeave={handleMouseLeave}
                        className={`backdrop-blur-sm ${
                          current_hover === track?.id
                            ? "brightness-[.3]"
                            : "brightness-100"
                        }`}
                      />
                      <Image
                        src={PlayWhiteIcon}
                        alt=""
                        onMouseEnter={() => handleMouseEnter(track?.id)}
                        className={`absolute top-3.5 left-4 ${
                          current_hover === track?.id
                            ? "opacity-100"
                            : "opacity-0"
                        }`}
                      />
                      <div className="items-start ml-4 ">
                        <p className="text-[13px] text-[#ffffffeb] font-normal">
                          {stringShortener(track?.name, 28)}
                        </p>
                        <span className="text-[#ffffffa3] text-xs font-normal">
                          {stringShortener(track?.album?.name, 20)} .{" "}
                          {track?.album?.release_date.split("-")[0]}
                        </span>
                      </div>
                    </div>
                    <Image
                      src={PlayListThreeDotIcon}
                      className="cursor-pointer"
                      alt=""
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#1f1f1f] px-10 pt-[52px] pb-7">
            <div className="flex flex-row">
              <h2 className="mr-2 text-[#ffffffeb] text-[17px] font-medium">
                Albums
              </h2>
            </div>

            <div className="flex flex-row w-full overflow-scroll py-4">
              {artistAlbums?.items &&
                artistAlbums?.items.map(
                  (album: AlbumPayload, index: number) => (
                    <AlbumCard data={album as AlbumPayload} key={index} />
                  )
                )}
            </div>
          </div>

          <div className="bg-[#323232] px-10 pt-[52px] pb-7">
            <div className="flex flex-row">
              <h2 className="mr-2 text-[#ffffffeb] text-[17px] font-medium">
                Similar Artists
              </h2>
              <Image src={ArrowRightIcon} alt="" />
            </div>

            <div className="flex flex-row justify-between w-full overflow-scroll py-4 ">
              {artistRelatedArtist?.artists &&
                artistRelatedArtist?.artists
                  .slice(0, 11)
                  .map((artist: ArtistPayload, index: number) => (
                    <div
                      onClick={() => setCurrentArtist(artist, dispatch)}
                      key={index}
                      className="flex flex-col items-center mr-[15px] cursor-pointer">
                      <Image
                        width={108.75}
                        height={108.75}
                        className="rounded-full max-h-[108.75px] h-[108.75px] max-w-[108.75px] w-[108.75px]"
                        src={artist?.images[1]?.url}
                        alt=""
                      />
                      <span className="mt-2 text-xs font-normal text-[#ffffffeb]">
                        {stringShortener(artist?.name, 14)}
                      </span>
                    </div>
                  ))}
            </div>
          </div>
        </main>
      </Layout>
    </PrivateRoute>
  );
};

export default Index;
