import React, { useContext, useEffect, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { Layout } from "../components/import";
import { PrivateRoute } from "../utils";
import { GlobalContext } from "../context/GlobalContext";
import SpotifyWebApi from "spotify-web-api-node";
import { Table } from 'antd'
import Styled from 'styled-components'
import { millisToMinutesAndSeconds } from '../utils'


import PlayWhiteIcon from '../assets/images/PlayWhiteIcon.svg'
import ShufffleWhiteIcon from '../assets/images/ShuffleWhiteIcon.svg'
import PlayListThreeDotIcon from '../assets/images/PlayListThreeDotIcon.svg'

const spotifyApi = new SpotifyWebApi({
  clientId: "0c064b242e744e0ca6d6dbbc5458c704",
});


const StyledTable = Styled(Table)`

.ant-table-tbody > tr > td {
  background: transparent !important;
}

.ant-table-thead > tr > th {
  background: transparent !important;
  color: #BFBFBF !important;
}

.ant-table-row{
  :nth-child(even){
    background: #1f1f1f !important;
  }
}

.ant-table{
  background: transparent !important;
  color: #fff !important;
}

`

const Playlist = () => {
  const { query, isReady } = useRouter();
  const { currentPlaylist, accessToken, dispatch, currentPlaylistTracks } = useContext(GlobalContext);

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);

  useEffect(() => {
    if (!isReady) return;
    if (!query.playlist_id) return;

    spotifyApi.getPlaylist(query.playlist_id as string).then((data) => {
      let playlist = data.body;
      dispatch({
        type: "SET_CURRENT_PLAYLIST",
        payload: {
          id: playlist.id,
          name: playlist.name,
          image: playlist.images,
          uri: playlist.uri,
          snapshot_id: playlist.snapshot_id,
          href: playlist.href,
          tracks: playlist.tracks,
          owner: playlist.owner
        },
      });
    });


    spotifyApi.getPlaylistTracks(query.playlist_id as string).then((data) => {
      let tracks : any = data.body.items;

      tracks = tracks.map((track: any) => {
        return {
          song: {
            name: track.track.name,
            preview_image: track.track.album.images[0].url
          },
          artist: track.track.artists[0].name,
          album: track.track.album.name,
          time: millisToMinutesAndSeconds(Number(track.track.duration_ms)),
          href: track.track.href,
          id: track.track.id,
          uri: track.track.uri,
          image: track.track.album.images[0].url
        }
      })



      dispatch({
        type: "SET_CURRENT_PLAYLIST_TRACKS",
        payload: tracks,
      });
    })



  }, [accessToken, isReady, query]);


  const columns = [
    {
      title: 'Song',
      dataIndex: 'song',
      key: 'song',
      
      render: (text: any) =><div className="flex flex-row items-center" >
        <Image src={text.preview_image} alt="" width={40} height={40} />
         <a className="ml-2" >{text.name}</a>
      </div>,
    },
    {
      title: 'Artist',
      dataIndex: 'artist',
      key: 'artist',
    },
    {
      title: 'Album',
      dataIndex: 'album',
      key: 'album',
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
      render: (text: string)=><div className="flex flex-row items-center " >
        <p className="mr-2" >{text}</p>
       {/*  <Image src={PlayListThreeDotIcon} alt="" /> */}
      </div>
    }
  ]

  return (
    <PrivateRoute>
      <Layout>
        <div className="h-screen bg-[#323232] pt-[90px] pl-10">
          <div className="flex flex-row" >
            <Image
              src={currentPlaylist?.image[0].url}
              alt=""
              width={270}
              height={270}
            />
            <div className="ml-10 self-end" >
              <h1 className="text-white text-3xl font-normal" >{currentPlaylist?.name}</h1>
              <h1 className="text-[#FF293F] text-[35px] font-normal" >{currentPlaylist?.owner?.display_name}</h1>
              <p className="text-[#BFBFBF] text-xs">{currentPlaylist?.tracks?.total} SONGS</p>

              <div className="flex flex-row w-full mt-16" >
                <button className="bg-[#d60017] rounded-[6px] h-7 px-3 text-white flex flex-row justify-center items-center w-[124px] text-xs"  ><Image src={PlayWhiteIcon} alt="" /> <span className="ml-2" >Play</span></button>
                <button className="bg-[#d60017] rounded-[6px] h-7 px-3 text-white flex flex-row justify-center items-center w-[124px] text-xs ml-2.5" ><Image src={ShufffleWhiteIcon} alt="" /><span className="ml-2" >Shuffle</span></button>
              </div>
            </div>
          </div>

          <div className="w-full mt-16" >
            <StyledTable columns={columns} dataSource={currentPlaylistTracks} scroll={{y: 650}}  pagination={currentPlaylistTracks.length > 50  && { defaultPageSize: 10, hideOnSinglePage: true }} />
          </div>
        </div>
      </Layout>
    </PrivateRoute>
  );
};

export default Playlist;
