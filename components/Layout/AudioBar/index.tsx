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

   
    return (
        <div className="h-15 z-50 w-[calc(100vw_-_260px)] fixed bg-[#2C2C2C] flex items-center pt-[10px]" >
            
            <div className="w-7/12 mx-auto" >
            <NextPlayer />
            </div>
            {/* <Player songs={songs} isPlaying={isPlaying} setIsPlaying={setIsPlaying} audioElem={audioElem} currentSong={currentSong} setCurrentSong={setCurrentSong}  /> */}
        </div>
    )
}

export default Index
