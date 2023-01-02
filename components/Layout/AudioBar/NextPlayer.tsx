import React, { useContext, useEffect, useState, useMemo } from 'react'
import SpotifyPlayer from 'react-spotify-web-playback';
import { GlobalContext } from '../../../context/GlobalContext'


const NextPlayer = () => {

  const { accessToken, currentSong, dispatch, setCurrentSong, setNextSong, setPrevSong, nextSong, prevSong, currentPlaylistTracksUri } = useContext(GlobalContext)
  const [play, setPlay] = useState(false)


  /* let formattedUri = useMemo(()=>{
    currentPlaylistTracks.map((track:any)=>{
      return track.uri
    })
  },[currentPlaylistTracks])

  console.log('formattedUri', formattedUri) */

  if(!accessToken) return null

  return (
    <SpotifyPlayer
      token={accessToken}
      showSaveIcon
      uris={ currentPlaylistTracksUri? currentPlaylistTracksUri : [] }
      autoPlay={true}
      play={play}
      initialVolume={0.5}
      styles={{
        bgColor: '#2C2C2C',
        color: '#fff',
        height: '44px',
        activeColor: '#FF293F',
        loaderColor: '#FF293F',
        trackNameColor: '#fff',
      }}
      callback={state => {
        if (!state.isPlaying) setPlay(false)
        
        if(state.track.uri !== currentSong?.uri){
          setCurrentSong(state.track, dispatch)
        }

      /*   if(state.nextTracks[0]?.uri !== nextSong?.uri){
          setNextSong(state.nextTracks[0], dispatch)
        }
 */
      }}

    />
  )
}

export default NextPlayer