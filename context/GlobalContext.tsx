import React, { useContext, useReducer, useLayoutEffect, useEffect, createContext } from 'react'
import StateReducer from './StateReducer'
import { setTokenSession, handleSetLoader, setGlobalSearchInput, setGlobalSearchResult, setPlaylists, setCurrentPlayList, setCurrentSong, setNextSong, setPrevSong } from './action'
import { checkPersistedTokens } from '../services'

interface Props {
  children?: ReactNode;
  // any props that come into the component
}

const initialState: any = {
  accessToken: null,
  refreshToken: null,
  expiresIn: null,
  auth_code: null,
  loading: false,
  searchInput: "",
  searchResults: [],
  playlists: [],
  currentPlaylist: null,
  currentPlaylistTracks: [],
  currentPlaylistTracksUri: [],
  currentSong: null,
  prevSong: null,
  nextSong: null,
  currentSongIndex: 0
}

export const GlobalContext = createContext(initialState);

GlobalContext.displayName = "";

export const GlobalProvider = ({ children }: Props) => {

  const [state, dispatch] = useReducer(StateReducer, initialState);


  useEffect(()=>{
    if(checkPersistedTokens('SET_ACCESS_TOKEN')){
      dispatch({
        type: 'SET_ACCESS_TOKEN',
        payload: {
          accessToken: checkPersistedTokens('SET_ACCESS_TOKEN')
        }
      })
    }

    if(checkPersistedTokens('SET_REFRESH_TOKEN')){
      dispatch({
        type: 'SET_REFRESH_TOKEN',
        payload: {
          refreshToken: checkPersistedTokens('SET_REFRESH_TOKEN')
        }
      })
    }

    if(checkPersistedTokens('SET_EXPIRES_IN')){
      dispatch({
        type: 'SET_EXPIRES_IN',
        payload: {
          expiresIn: checkPersistedTokens('SET_EXPIRES_IN')
        }
      })
    }

    if(checkPersistedTokens('SET_AUTH_CODE')){
      dispatch({
        type: 'SET_AUTH_CODE',
        payload: {
          auth_code: checkPersistedTokens('SET_AUTH_CODE')
        }
      })
    }

  },[])


  useEffect(()=>{
    if(state.currentPlaylistTracks.length > 0){
      dispatch({
        type: 'SET_CURRENT_SONG',
        payload: state.currentPlaylistTracks[state.currentSongIndex]
      })
    }
  },[state.currentPlaylistTracks])

  return (
    <GlobalContext.Provider value={{
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
      dispatch
    }} >
      {children}
    </GlobalContext.Provider>
  )
}

export default GlobalContext