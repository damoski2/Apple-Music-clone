import React, { useState, useContext, useEffect, ReactNode } from "react";
import Router, { useRouter } from "next/router";
import Redirect from "./Redirect";
import useAuth from "./useAuth";
import { GlobalContext } from "../../context/GlobalContext";
import SpotifyWebApi from "spotify-web-api-node";
import { persistTokens, checkPersistedTokens } from "../../services";
import { loader_types } from "../../types";
import { removeUndefinedFromArray } from '../../utils'

const spotifyApi = new SpotifyWebApi({
  clientId: "0c064b242e744e0ca6d6dbbc5458c704",
});

interface Props {
  children: JSX.Element;
  code?: string;
}
/* let code: string;
if(typeof window !== 'undefined'){
 code = new URLSearchParams(window.location.search).get('code') || ''
}*/
const PrivateRoute = ({ children, code }: Props) => {
  const {
    dispatch,
    auth_code,
    setGlobalSearchResult,
    searchInput,
    accessToken,
    randomArtistSeeds,
    handleSetLoader,
    setNewReleasesTracks,
  } = useContext(GlobalContext);

  const { isReady, query, pathname } = useRouter();

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);

  useEffect(() => {
    if (!isReady) return;

    if (!query.code && pathname === "/") {
      Router.push("/login");
    } else if (!query.code && pathname !== "/") {
      !checkPersistedTokens("SET_AUTH_CODE") && Router.push("/login");
    } else {
      dispatch({
        type: "SET_AUTH_CODE",
        payload: query.code,
      });
      persistTokens("SET_AUTH_CODE", query.code as string);
    }
  }, [isReady, auth_code]);

  useEffect(() => {
    if (!searchInput) return setGlobalSearchResult([], dispatch);
    if (!accessToken) return;
    let cancel: boolean = false;
    spotifyApi
      .searchTracks(searchInput)
      .then((data) => {
        if (cancel) return;
        //console.log(data?.body?.tracks?.items)
        let formattedData = data?.body?.tracks?.items?.map((track: any) => {
          const smallestAlbumImage = track.album.images.reduce(
            (smallest: any, image: any) => {
              if (image.height < smallest.height) return image;
              return smallest;
            },
            track.album.images[0]
          );

          return {
            artist: track.artists[0].name,
            title: track.name,
            uri: track.uri,
            albumUrl: smallestAlbumImage.url,
          };
        });
        //console.log(formattedData);
        setGlobalSearchResult(formattedData, dispatch);
      })
      .catch((err) => {
        //console.log(err)
      });

    return () => (cancel = true);
  }, [searchInput, accessToken]);

  useEffect(() => {
    if (!accessToken) return;

    const seriesOfTrackRequests = async () => {
      handleSetLoader(
        { state: "load_artists", value: true } as {
          state: loader_types;
          value: boolean;
        },
        dispatch
      );

      spotifyApi
        .getCategories({
          limit: 5,
          offset: 0,
          country: "SE",
          locale: "sv_SE",
        })
        .then(
          (data) => {
            console.log("categories", data.body);
          },
          (err) => {
            //console.log("Something went wrong!", err);
          }
        );

      let releaseUsa = await spotifyApi
        .getNewReleases({ limit: 10, offset: 0, country: "US" })
        .then((data) => {
          //console.log("new release USA", data.body);
          let innerdata = data.body.albums.items.map(
            (album: any, index: number) => {
              if (index < 5) {
                return album;
              }
              return
            }
          );
          return innerdata;
        });

      let realeseNigeria = await spotifyApi
        .getNewReleases({ limit: 10, offset: 0, country: "NG" })
        .then((data) => {
          //console.log("new release Nigeria", data.body);
          let innerdata = data.body.albums.items.map(
            (album: any, index: number) => {
              if (index < 5) {
                return album;
              }
              return
            }
          );
          return innerdata;
        });

      if (randomArtistSeeds.length > 0) {
        spotifyApi
          .getArtistRelatedArtists(randomArtistSeeds[0] as string)
          .then((data) => {
            console.log("related artist", data.body);
          });
      }

      let totalRelease = removeUndefinedFromArray([...realeseNigeria, ...releaseUsa]);

      
      handleSetLoader(
        { state: "not_loading", value: false } as {
          state: loader_types;
          value: boolean;
        },
        dispatch
      );
      setNewReleasesTracks(totalRelease, dispatch);
    };

    seriesOfTrackRequests();
  }, [accessToken, randomArtistSeeds]);

  useAuth(query.code as string);

  return children;
};
export default PrivateRoute;
