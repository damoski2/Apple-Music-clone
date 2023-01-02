import React, { useRef, useEffect, useState } from 'react'
import Image from 'next/image'
import ShuffleIcon from '../../../assets/images/ShuffleInactiveIcon.svg'
import ReactPlayer from 'react-player'

import ReactJkMusicPlayer from 'react-jinke-music-player'
import 'react-jinke-music-player/assets/index.css'
import Player from './Player'
import sample_songs from '../../../sample/songs'
import NextPlayer from './NextPlayer'



const Index = () => {

    const audioElem = useRef<any>()

    const [songs, setSongs] = useState(sample_songs)
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentSong, setCurrentSong] = useState(sample_songs[1])

    useEffect(()=>{
        if(isPlaying){
            audioElem?.current?.play()
        }else{
            audioElem?.current?.pause()
        }
    },[isPlaying])

    const onPlaying = () => {
        const duration = audioElem.current.duration;
        const ct = audioElem.current.currentTime;

        setCurrentSong({...currentSong, progress: (ct/duration)*100 , "length": duration  });
    }


    return (
        <div className="h-15 w-[calc(100vw_-_260px)] fixed  bg-[#2C2C2C] flex items-center pt-[10px]" >
            <audio ref={audioElem} src={currentSong.url} onTimeUpdate={onPlaying} />
            <div className="w-7/12 mx-auto" >
            <NextPlayer />
            </div>
            {/* <Player songs={songs} isPlaying={isPlaying} setIsPlaying={setIsPlaying} audioElem={audioElem} currentSong={currentSong} setCurrentSong={setCurrentSong}  /> */}
        </div>
    )
}

export default Index
