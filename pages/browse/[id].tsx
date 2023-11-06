import React, { useEffect, useContext } from "react";
import { Layout, Loader } from "../../components/import";
import { PrivateRoute } from "../../utils";
import SpotifyWebApi from "spotify-web-api-node";
import RegularCard from "../../components/Card/RegularCard";
import AlbumCard from "../../components/Card/AlbumCard";
import PlayListCard from "../../components/Card/PlayListCard";
import PlayListCardMini from "../../components/Card/PlayListCardMini";
import { GlobalContext } from "../../context/GlobalContext";
import { PlaylistPayload } from "../../interface";
import { useRouter } from "next/router";
import { capitalizeFirstLetter } from "../../utils";
import { loader_types } from "../../types";

const spotifyApi = new SpotifyWebApi({
  clientId: "0c064b242e744e0ca6d6dbbc5458c704",
});

const Index = () => {
  const {
    query: { id },
  } = useRouter();
  const { dispatch, accessToken, genrePlaylist, setGenrePlaylists, loading, currentPlaylistOrAlbumTracksUri } =
    useContext(GlobalContext);

  useEffect(() => {
    if (!accessToken) return;
    if (!id) return;
    spotifyApi.setAccessToken(accessToken);

    dispatch({
      type: "LOADING_PAGE",
      payload: {
        state: "load_genre",
        value: true,
      } as {
        state: loader_types;
        value: boolean;
      },
    });

    spotifyApi
      .getPlaylistsForCategory(id as string, {
        country: "US",
        limit: 40,
        offset: 0,
      })
      .then((resData) => {
        console.log("returned genre", resData.body?.playlists?.items);
        let result: any[] = resData.body?.playlists?.items;
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
        setGenrePlaylists(result, dispatch, id);

        dispatch({
          type: "LOADING_PAGE",
          payload: {
            state: "not_loading",
            value: false,
          } as {
            state: loader_types;
            value: boolean;
          },
        });
      });
  }, [accessToken, id]);

  if (loading.state === "load_genre") return <Loader />;

  return (
    <PrivateRoute>
      <Layout>
        <div className={`md:px-10 px-6 h-full pt-[20px] md:pt-[90px] md:pb-0 ${currentPlaylistOrAlbumTracksUri.length > 0? 'pb-40': 'pb-12' } `}>
          <div className="flex flex-row">
            <h2 className="mr-2 text-[#ffffffeb] text-4xl font-medium">
              {id && capitalizeFirstLetter(id as string)} {` `}
            </h2>
          </div>

          <div className="flex flex-row w-full overflow-scroll py-4">
            {genrePlaylist.length > 0 &&
              genrePlaylist
                .slice(0, 11)
                ?.map((playlist: PlaylistPayload, index: number) => (
                  <PlayListCard
                    data={playlist as PlaylistPayload}
                    key={index}
                  />
                ))}
          </div>

          <h2 className="mr-2 mt-4 text-[#ffffffeb] text-[17px] font-medium">
              {id && capitalizeFirstLetter(id as string)} {` `} New Release
            </h2>
          <div className="w-full grid 2xl:grid-cols-6 xl:grid-cols-4 lg:grid-cols-3 grid-cols-2 gap-x-4 gap-y-10 row-auto grid-flow-row py-4">
            {genrePlaylist.length > 0 &&
              genrePlaylist
                .slice(11, genrePlaylist.length-1)
                ?.map((playlist: PlaylistPayload, index: number) => (
                  <PlayListCardMini
                    data={playlist as PlaylistPayload}
                    key={index}
                  />
                ))}
          </div>
        </div>
      </Layout>
    </PrivateRoute>
  );
};

export default Index;
