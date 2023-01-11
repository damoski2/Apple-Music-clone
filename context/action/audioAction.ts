import { Dispatch } from 'react'
import { DispatchType } from '../../interface'
import Router from 'next/router'

export const setGlobalSearchInput = (data: string, dispatch: Dispatch<DispatchType>)=>{
    dispatch({
        type: 'SET_SEARCH_INPUT',
        payload: data
    })
}


export const setGlobalSearchResult = (data: any, dispatch: Dispatch<DispatchType>)=>{
    dispatch({
        type: 'SET_SEARCH_RESULT',
        payload: data
    })
}

export const setPlaylists = (data: any, dispatch: Dispatch<DispatchType>)=>{
    dispatch({
        type: 'SET_PLAYLISTS',
        payload: data
    })
}


export const setCurrentPlayList = (data: any, dispatch: Dispatch<DispatchType>)=>{
    Router.push('/playlist?playlist_id='+data.id)
    dispatch({
        type: 'SET_CURRENT_PLAYLIST',
        payload: data
    })
}

export const setCurrentSong = (data: any, dispatch: Dispatch<DispatchType>)=>{
   // console.log(data)
    dispatch({
        type: 'SET_CURRENT_SONG',
        payload: data
    })
}


export const setPrevSong = (data: any, dispatch: Dispatch<DispatchType>)=>{
    dispatch({
        type: 'SET_PREV_SONG',
        payload: data
    })
}

export const setNextSong = (data: any, dispatch: Dispatch<DispatchType>)=>{
    dispatch({
        type: 'SET_NEXT_SONG',
        payload: data
    })
}


export const setCurrentSongIndex = (data: number, dispatch: Dispatch<DispatchType>)=>{
    dispatch({
        type: 'SET_CURRENT_SONG_INDEX',
        payload: data
    })
}

export const setNewReleases = (data: any, dispatch: Dispatch<DispatchType>)=>{
    dispatch({
        type: 'SET_NEW_RELEASES',
        payload: data
    })
}

export const setRecentlyPlayedTracks = (data: any, dispatch: Dispatch<DispatchType>)=>{
    dispatch({
        type: 'SET_RECENTLY_PLAYED_TRACKS',
        payload: data
    })
}

export const setNewReleasesTracks = (data: any, dispatch: Dispatch<DispatchType>)=>{
    dispatch({
        type: 'SET_NEW_RELEASES_TRACKS',
        payload: data
    })
}

export const setCurrentArtist = (data: any, dispatch: Dispatch<DispatchType>)=>{
    Router.push(`/artists/${data.id}`)
    dispatch({
        type: 'SET_CURRENT_ARTIST',
        payload: data
    })
}