import React, { useEffect, useContext } from 'react'
import { GlobalContext } from '../../context/GlobalContext'
import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi({
  clientId: "0c064b242e744e0ca6d6dbbc5458c704",
});

const AddToPlaylistModal = () => {

  const { accessToken, dispatch, setPlaylists } = useContext(GlobalContext)

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);

  useEffect(() => {
    if (!accessToken) return;

    spotifyApi.getUserPlaylists().then((data) => {
      let result: any = data.body.items;
      console.log(data.body.items[0]);
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
  }, [accessToken]);

  return (
    <div>

    </div>
  )
}

export default AddToPlaylistModal