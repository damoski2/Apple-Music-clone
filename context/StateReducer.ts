import { millsecondstoISODateconverter } from '../utils'




export default (state: any, action: any)=>{
    const { payload } = action

    switch(action.type){
        case 'SET_ACCESS_TOKEN':
            return{
                ...state,
                accessToken: payload.accessToken || payload.access_token,
            }

        case 'SET_REFRESH_TOKEN':
            return{
                ...state,
                refreshToken: payload.refreshToken
            }

        case 'SET_EXPIRES_IN':
            let expIn;
            if(payload.expiresIn?.toString().length > 4 || payload.expires_in?.toString().length > 4){
                expIn = payload.expiresIn || payload.expires_in
                
            }else{
                expIn = millsecondstoISODateconverter(payload.expiresIn || payload.expires_in)
            }
            
            return{
                ...state,
                expiresIn: expIn
            }

        case 'SET_AUTH_CODE':
            return{
                ...state,
                auth_code: payload
            }

        case 'LOADING_PAGE':
            return{
                ...state,
                loading: payload
            }

        case 'SET_SEARCH_INPUT':
            return{
                ...state,
                searchInput: payload
            }

        case 'SET_SEARCH_RESULT':
            return{
                ...state,
                searchResults: payload
            }

        case 'SET_PLAYLISTS':
            return{
                ...state,
                playlists: payload
            }

        case 'SET_CURRENT_PLAYLIST':
            return{
                ...state,
                currentPlaylist: payload
            }

        case 'SET_CURRENT_PLAYLIST_TRACKS':
            return{
                ...state,
                currentPlaylistTracks: payload
            }

        case 'SET_CURRENT_PLAYLIST_TRACKS_URI':
            return{
                ...state,
                currentPlaylistTracksUri: payload
            }

        case 'SET_CURRENT_SONG':
            return{
                ...state,
                currentSong: payload
            }

        case 'SET_CURRENT_SONG_INDEX':
            return{
                ...state,
                currentSongIndex: payload
            }

        case 'SET_PREV_SONG':
            return{
                ...state,
                prevSong: payload
            }

        case 'SET_NEXT_SONG':
            return{
                ...state,
                nextSong: payload
            }

        case 'SET_NEW_RELEASES':
            return{
                ...state,
                newReleases: payload
            }

        case 'SET_RECENTLY_PLAYED_TRACKS':
            return{
                ...state,
                recentlyPlayedTracks: payload
            }

        case 'SET_RANDOM_ARTIST_SEEDS':
            return{
                ...state,
                randomArtistSeeds: payload
            }

        case 'SET_ARTISTS_LISTS':
            return{
                ...state,
                artistsLists: payload
            }

        case 'SET_NEW_RELEASES_TRACKS':
            return{
                ...state,
                newReleaseTracks: payload
            }

        case 'LOG_OUT':
            return{
                ...state,
                accessToken: '',
                auth_code: '',
                refreshToken: '',
                expiresIn: '',
                searchInput: '',
                searchResults: [],
                playlists: [],
                currentPlaylist: {},
                currentPlaylistTracks: []
            }
    }
}