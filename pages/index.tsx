import { useContext, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { Layout, Loader } from "../components/import";
import { PrivateRoute, removeUndefinedFromArray } from "../utils";
import { GlobalContext } from "../context/GlobalContext";
import { Divider } from "antd";
import RegularCard from "../components/Card/RegularCard";
import RecentlyPlayedCard from "../components/Card/RecentlyPlayedCard";
import NewReleaseCard from "../components/Card/NewReleaseCard";
import { ArtistPayload, TrackPayload, AlbumPayload } from "../interface";
import { animated, useSpring } from "react-spring";
import { useScroll } from "react-use-gesture";
import SpotifyWebApi from "spotify-web-api-node";
import { loader_types } from "../types";

const spotifyApi = new SpotifyWebApi({
  clientId: "0c064b242e744e0ca6d6dbbc5458c704",
});

export default function Home() {
  const {
    artistsLists,
    accessToken,
    setRecentlyPlayedTracks,
    recentlyPlayedTracks,
    newReleaseTracks,
    playlists,
    dispatch,
    setNewReleasesTracks,
    loading,
  } = useContext(GlobalContext);

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);

    const entryRequest = async () => {
      let artistsLists: any = [];

      await dispatch({
        type: "LOADING_PAGE",
        payload: {
          state: "load_artists",
          value: true,
        } as {
          state: loader_types;
          value: boolean;
        },
      });

      if (playlists.length > 0) {
        while (artistsLists.length < 10) {
          let random: number = Math.floor(Math.random() * playlists.length);
          let _artistId: any = await spotifyApi
            .getPlaylistTracks(playlists[random].id)
            .then((data) => {
              let tracks: any = data.body.items;
              random = Math.floor(Math.random() * tracks.length);

              return tracks[random]?.track?.artists[0].id;
            });
          artistsLists.includes(_artistId)
            ? null
            : artistsLists.push(_artistId);
        }

        artistsLists = ["0n3cDqJ0hORbjIRGhdW2bI", ...artistsLists];

        artistsLists = await spotifyApi
          .getArtists(artistsLists)
          .then((data) => {
            return data.body.artists;
          });

        spotifyApi
          .getMyRecentlyPlayedTracks({ limit: 10, after: 0 })
          .then((data) => {
            setRecentlyPlayedTracks(data.body.items, dispatch);
          });
      }

      let realeseNigeria = await spotifyApi
        .getNewReleases({ limit: 10, offset: 0, country: "NG" })
        .then((data) => {
          //console.log("new release Nigeria", data.body);
          let innerdata = data.body.albums.items.map(
            (album: any, index: number) => {
              if (index < 5) {
                return album;
              }
              return;
            }
          );
          return innerdata;
        });

      let releaseUsa = await spotifyApi
        .getNewReleases({ limit: 10, offset: 0, country: "US" })
        .then((data) => {
          //console.log("new release USA", data.body);
          let innerdata = data.body.albums.items.map(
            (album: any, index: number) => {
              if (index < 5) {
                return album;
              }
              return;
            }
          );
          return innerdata;
        });

      let totalRelease = removeUndefinedFromArray([
        ...realeseNigeria,
        ...releaseUsa,
      ]);

      setNewReleasesTracks(totalRelease, dispatch);

      await dispatch({
        type: "SET_ARTISTS_LISTS",
        payload: artistsLists,
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
    };

    entryRequest();
  }, [accessToken, playlists]);

  const clamp = (value: number, clampAt: number = 30) => {
    if (value > 0) {
      return value > clampAt ? clampAt : value;
    } else {
      return value < -clampAt ? -clampAt : value;
    }
  };

  const [style, set] = useSpring(() => ({
    transform: "perspective(500px) rotateY(0deg)",
  }));

  const [style2, set2] = useSpring(() => ({
    transform: "perspective(500px) rotateY(0deg)",
  }));

  const [style3, set3] = useSpring(() => ({
    transform: "perspective(500px) rotateY(0deg)",
  }));

  const bind = useScroll((event) => {
    set({
      transform: `perspective(500px) rotateY(${
        event.scrolling ? clamp(event.delta[0]) : 0
      }deg)`,
    });
  });

  const bind2 = useScroll((event) => {
    set2({
      transform: `perspective(500px) rotateY(${
        event.scrolling ? clamp(event.delta[0]) : 0
      }deg)`,
    });
  });

  const bind3 = useScroll((event) => {
    set3({
      transform: `perspective(500px) rotateY(${
        event.scrolling ? clamp(event.delta[0]) : 0
      }deg)`,
    });
  });

  return (
    <PrivateRoute>
      <Layout>
        <Head>
          <title>Apple music</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        {loading.state === "load_artists" ? (
          <Loader />
        ) : (
          <div className="bg-[#323232] pb-36 md:pb-0 pt-[90px] md:px-10 px-6 h-full">
            <h1 className="text-4xl font-semibold text-[#ffffeb]">
              Listen Now
            </h1>
            <Divider className="bg-[#4D4D4D] mt-2 h-[0.1px]" />

            <div>
              <h3 className="text-[17px] font-medium text-[#ffffeb]">
                Top Artists
              </h3>
            </div>

            <div
              className="flex flex-row w-full overflow-scroll py-5"
              {...bind()}
            >
              {artistsLists &&
                artistsLists.map((artist: ArtistPayload, index: number) => (
                  <RegularCard data={artist} key={index} style={style} />
                ))}
            </div>

            <div className="mt-6">
              <h3 className="text-[17px] font-medium text-[#ffffeb]">
                Recently Played
              </h3>
            </div>

            <div
              className="flex flex-row w-full overflow-scroll py-4"
              {...bind2()}
            >
              {recentlyPlayedTracks &&
                recentlyPlayedTracks.map((song: any, index: number) => (
                  <RecentlyPlayedCard
                    data={song.track as TrackPayload}
                    key={index}
                    style={style2}
                  />
                ))}
            </div>

            <div className="mt-6">
              <h3 className="text-[17px] font-medium text-[#ffffed]">
                New Release
              </h3>
            </div>

            <div className="flex flex-row w-full overflow-scroll py-5">
              <div className="container">
                <div className="content">
                  <h1>Hits</h1>
                  <p>in Spatial Audio</p>
                </div>
                <div className="box"></div>
                <div className="box"></div>
                <div className="box"></div>
                <div className="box"></div>
                <div className="box"></div>
                <div className="box"></div>
                <div className="box"></div>
                <div className="box"></div>
                <div className="box"></div>
                <div className="box"></div>
              </div>

              <div
                className="flex flex-row w-full overflow-scroll "
                {...bind3()}
              >
                {newReleaseTracks &&
                  newReleaseTracks.map((song: any, index: number) => (
                    <NewReleaseCard
                      data={song as AlbumPayload}
                      key={index}
                      style={style3}
                    />
                  ))}
              </div>
            </div>
          </div>
        )}
      </Layout>
    </PrivateRoute>
  );
}
