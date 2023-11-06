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
    accessToken,
    randomArtistSeeds,
    handleSetLoader,
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
            //console.log("categories", data.body);
          },
          (err) => {
            //console.log("Something went wrong!", err);
          }
        );

      if (randomArtistSeeds.length > 0) {
        spotifyApi
          .getArtistRelatedArtists(randomArtistSeeds[0] as string)
          .then((data) => {
            //console.log("related artist", data.body);
          });
      }

      

      
      handleSetLoader(
        { state: "not_loading", value: false } as {
          state: loader_types;
          value: boolean;
        },
        dispatch
      );
     
    };

    //seriesOfTrackRequests();
  }, [accessToken, randomArtistSeeds]);

  useAuth(query.code as string);

  return children;
};
export default PrivateRoute;
