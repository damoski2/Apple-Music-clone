import React, { useContext } from 'react'
import Image from 'next/image'
import PrevButton from '../../../assets/images/PrevInactiveIcon.svg'
import NextButton from '../../../assets/images/NextInactiveIcon.svg'
import PlayButton from '../../../assets/images/PlayIcon.svg'
import PauseButton from '../../../assets/images/PauseIcon.svg'
import { GlobalContext } from '../../../context/GlobalContext'


interface Props{
    audioElem: any,
    isPlaying: boolean,
    setIsPlaying: any,
    currentSong: any,
    setCurrentSong: any,
    songs: any
}

const Player = ({ audioElem, isPlaying, setIsPlaying, currentSong, setCurrentSong, songs }: Props) => {

    const { dispatch } = useContext(GlobalContext)


  return (
    <div className="player_container" >
        <div className="controls" >
            <Image src={PrevButton} alt="" />
            {isPlaying? <Image src={PlayButton} alt="" />: <Image src={PauseButton} alt="" />}
            <Image src={NextButton} alt="" />
        </div>
        <div className="title" >
            <p>{currentSong.title}</p>
        </div>
        <div className="navigation" >
            <div className="navigation_wrapper" >
                <div className="seek_bar" style={{ width: `${currentSong.progress+"%"}` }} ></div>
            </div>
        </div>
    </div>
  )
}

export default Player