import React, { useEffect, useContext, useState } from "react";
import Image from "next/image";
import { GlobalContext } from "../../context/GlobalContext";
import SpotifyWebApi from "spotify-web-api-node";
import ArrowRight from "../../assets/images/ArrowRight.svg";
import PlayListIconWhite from "../../assets/images/PlayListIconWhite.svg";
import { Divider } from "antd";

const spotifyApi = new SpotifyWebApi({
  clientId: "0c064b242e744e0ca6d6dbbc5458c704",
});

const AddToPlaylistModal = ({
  refPasser,
}: {
  refPasser: React.MutableRefObject<any>;
}) => {

  const { currentPlaylist, openModalSongUri, dispatch, currentPlaylistOrAlbumTracksUri, currentSong, accessToken } = useContext(GlobalContext)

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);

  const [hover, setHover] = useState<boolean>(false);

  /*  const playListLeave = () => {
    setHover(false);
  }; */

  const playListEnter = () => {
    setHover(true);
  };

  const handleSetHoverFalse = () => {
    setHover(false);
  };

  const removeTrackFromPlaylist = () => {
    //console.log('shit to delete', currentPlaylist.id, [{uri: openModalSongUri}])
    spotifyApi.removeTracksFromPlaylist(currentPlaylist?.id, [{uri:openModalSongUri}])
      .then(data=>{
        window.location.reload()
      })
      .finally(()=>{
        handleSetHoverFalse()
      })
  };

  const handlePlayNext = ()=>{
    let currentPlayingUri: string = currentSong?.uri;
    let insertIndex: number = currentPlaylistOrAlbumTracksUri.indexOf(currentPlayingUri);
    let newSongArr: string[] = [...currentPlaylistOrAlbumTracksUri]
    insertIndex = insertIndex+1;
    newSongArr.splice(insertIndex,0,openModalSongUri);
    dispatch({
      type: 'SET_CURRENT_PLAYLIST_TRACKS_URI',
      payload: newSongArr
    })
  }

  return (
    <div className="absolute flex flex-row" ref={refPasser}>
      {hover && (
        <div className="absolute right-56">
          <PlaylistSubModal handleSetHoverFalse={handleSetHoverFalse} />
        </div>
      )}
      <div className="bg-[#313131] py-2 px-2 w-[220px] bg-opacity-40 bg-clip-padding backdrop-blur-lg border-[#bfbfbf] border-[.1px] rounded-md">
        <ul className="list-none">
          <li className="py-[1px] px-3 hover:bg-[#BF4D4D]">
            <span className="text-[#ffffffeb] text-[17px]">Add to Library</span>
          </li>
          <li
            onMouseEnter={playListEnter}
            className="py-[1px] px-3 hover:bg-[#BF4D4D]"
          >
            <span className="text-[#ffffffeb] text-[17px] flex flex-row items-center justify-between ">
              <span>Add to playlist</span> <Image src={ArrowRight} alt="" />{" "}
            </span>
          </li>
          <Divider className="my-1 h-[.0000001px] bg-[#bfbfbf]" />
          <li onClick={handlePlayNext} className="py-[1px] px-3 hover:bg-[#BF4D4D]">
            <span className="text-[#ffffffeb] text-[17px]">Play Next</span>
          </li>
          <li className="py-[1px] px-3 hover:bg-[#BF4D4D]">
            <span className="text-[#ffffffeb] text-[17px]">Play later</span>
          </li>
          <li onClick={removeTrackFromPlaylist} className="py-[1px] px-3 hover:bg-[#BF4D4D]">
            <span className="text-[#ffffffeb] text-[17px]">
              Remove from Playlist
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

const PlaylistSubModal = ({
  handleSetHoverFalse,
}: {
  handleSetHoverFalse: () => void;
}) => {
  const { accessToken, dispatch, setPlaylists, playlists, openModalSongUri } =
    useContext(GlobalContext);

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);

  useEffect(() => {
    if (!accessToken) return;

    spotifyApi.getUserPlaylists().then((data) => {
      let result: any = data.body.items;
      //console.log(data.body.items[0]);
      result = result.map((item: any) => {
        return {
          id: item.id,
          name: item.name,
          image: item.images,
          uri: item.uri,
          snapshot_id: item.snapshot_id,
          href: item.href,
          tracks: item.tracks,
          owner: item.owner,
        };
      });
      setPlaylists(result, dispatch);

      //console.log(result)
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, dispatch]);

  const addTrackToPlaylist = (_id: string) => {
    //console.log('item string',_id)
    spotifyApi
      .addTracksToPlaylist(_id, [openModalSongUri])
      .then((data) => {
        window.location.reload()
      })
      .catch((err) => {
        // Handle Error
      })
      .finally(() => handleSetHoverFalse());
  };

  return (
    <div className="bg-[#313131] py-2 px-2 w-[220px] bg-opacity-40 bg-clip-padding backdrop-blur-lg border-[#bfbfbf] border-[.1px] rounded-md">
      <ul className="list-none">
        <li className="py-[1px] px-3 hover:bg-[#BF4D4D]">
          <span className="text-[#ffffffeb] text-[17px]">New Playlist</span>
        </li>
        <Divider className="my-1 h-[.0000001px] bg-[#bfbfbf]" />
        {playlists &&
          playlists.map((item: any, index: number) => (
            <li key={index} onClick={() => addTrackToPlaylist(item.id)}>
              <span className="text-[#ffffffeb] text-[17px] flex flex-row items-center cursor-pointer hover:bg-[#BF4D4D]">
                <Image src={PlayListIconWhite} alt="" />
                <span className="ml-2">{item?.name}</span>{" "}
              </span>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default AddToPlaylistModal;
