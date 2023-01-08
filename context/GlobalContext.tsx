import React, {
  useContext,
  useReducer,
  useLayoutEffect,
  useEffect,
  createContext,
} from "react";
import StateReducer from "./StateReducer";
import {
  setTokenSession,
  handleSetLoader,
  setGlobalSearchInput,
  setGlobalSearchResult,
  setPlaylists,
  setCurrentPlayList,
  setCurrentSong,
  setNextSong,
  setPrevSong,
  setNewReleases,
  setRecentlyPlayedTracks,
  setNewReleasesTracks
} from "./action";
import { checkPersistedTokens } from "../services";
import SpotifyWebApi from "spotify-web-api-node";
import { loader_types } from "../types";

const spotifyApi = new SpotifyWebApi({
  clientId: "0c064b242e744e0ca6d6dbbc5458c704",
});

interface Props {
  children?: ReactNode;
  // any props that come into the component
}

const initialState: any = {
  accessToken: null,
  refreshToken: null,
  expiresIn: null,
  auth_code: null,
  loading: {
    state: "not_loading" as loader_types,
    value: false,
  },
  searchInput: "",
  searchResults: [],
  playlists: [],
  currentPlaylist: null,
  currentPlaylistTracks: [],
  currentPlaylistTracksUri: [],
  currentSong: null,
  prevSong: null,
  nextSong: null,
  currentSongIndex: 0,
  newReleases: [],
  recentlyPlayedTracks: [],
  randomArtistSeeds: [],
  artistsLists: [],
  newReleaseTracks: []
};

export const GlobalContext = createContext(initialState);

GlobalContext.displayName = "";

export const GlobalProvider = ({ children }: Props) => {
  const [state, dispatch] = useReducer(StateReducer, initialState);

  useEffect(() => {
    if (checkPersistedTokens("SET_ACCESS_TOKEN")) {
      dispatch({
        type: "SET_ACCESS_TOKEN",
        payload: {
          accessToken: checkPersistedTokens("SET_ACCESS_TOKEN"),
        },
      });
    }

    if (checkPersistedTokens("SET_REFRESH_TOKEN")) {
      dispatch({
        type: "SET_REFRESH_TOKEN",
        payload: {
          refreshToken: checkPersistedTokens("SET_REFRESH_TOKEN"),
        },
      });
    }

    if (checkPersistedTokens("SET_EXPIRES_IN")) {
      dispatch({
        type: "SET_EXPIRES_IN",
        payload: {
          expiresIn: checkPersistedTokens("SET_EXPIRES_IN"),
        },
      });
    }

    if (checkPersistedTokens("SET_AUTH_CODE")) {
      dispatch({
        type: "SET_AUTH_CODE",
        payload: {
          auth_code: checkPersistedTokens("SET_AUTH_CODE"),
        },
      });
    }
  }, []);

  useEffect(() => {
    if (!state.accessToken) return;
    spotifyApi.setAccessToken(state.accessToken);
  }, [state.accessToken]);

  useEffect(() => {
    if (state.currentPlaylistTracks.length > 0) {
      dispatch({
        type: "SET_CURRENT_SONG",
        payload: state.currentPlaylistTracks[state.currentSongIndex],
      });
    }
  }, [state.currentPlaylistTracks]);

  useEffect(() => {
    if (!state.accessToken) return;
    spotifyApi.setAccessToken(state.accessToken);

    const seedRequest = async () => {
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
      if (state.playlists.length > 0) {
        let random1: number = Math.floor(
            Math.random() * state.playlists.length
          ),
          random2: number = Math.floor(Math.random() * state.playlists.length);

        let _artistId1: string = "",
          _artsisId2: string = "";

        let artistsLists: any = [];

        while (random1 === random2) {
          random2 = Math.floor(Math.random() * state.playlists.length);
        }

        _artistId1 = await spotifyApi
          .getPlaylistTracks(state.playlists[random1].id)
          .then((data) => {
            let tracks: any = data.body.items;
            random1 = Math.floor(Math.random() * tracks.length);
            return tracks[random1].track.artists[0].id;
          });

        _artsisId2 = await spotifyApi
          .getPlaylistTracks(state.playlists[random2].id)
          .then((data) => {
            let tracks: any = data.body.items;
            random2 = Math.floor(Math.random() * tracks.length);
            return tracks[random2].track.artists[0].id;
          });

        while (artistsLists.length < 10) {
          let random: number = Math.floor(
            Math.random() * state.playlists.length
          );
          let _artistId: any = await spotifyApi
            .getPlaylistTracks(state.playlists[random].id)
            .then((data) => {
              let tracks: any = data.body.items;
              random = Math.floor(Math.random() * tracks.length);

              return tracks[random].track.artists[0].id;
            });
          artistsLists.includes(_artistId)
            ? null
            : artistsLists.push(_artistId);
        }

        artistsLists = await spotifyApi
          .getArtists(artistsLists)
          .then((data) => {
            //console.log('artists...',data.body.artists)
            return data.body.artists;
          });

        await dispatch({
          type: "SET_RANDOM_ARTIST_SEEDS",
          payload: [_artistId1, _artsisId2],
        });

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
      }
    };

    seedRequest();
  }, [state.playlists, state.accessToken]);

  return (
    <GlobalContext.Provider
      value={{
        ...state,
        setTokenSession,
        handleSetLoader,
        setGlobalSearchInput,
        setGlobalSearchResult,
        setPlaylists,
        setCurrentPlayList,
        setCurrentSong,
        setNextSong,
        setPrevSong,
        setNewReleases,
        setRecentlyPlayedTracks,
        setNewReleasesTracks,
        dispatch,
      }}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContext;
