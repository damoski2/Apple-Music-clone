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
    console.log(data)
    dispatch({
        type: 'SET_CURRENT_SONG',
        payload: data
    })
}