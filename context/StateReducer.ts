export default (state: any, action: any)=>{
    const { payload } = action

    switch(action.type){
        case 'SET_ACCESS_TOKEN':
            return{
                ...state,
                accessToken: payload.accessToken,
            }

        case 'SET_REFRESH_TOKEN':
            return{
                ...state,
                refreshToken: payload.refreshToken
            }

        case 'SET_EXPIRES_IN':
            return{
                ...state,
                expiresIn: payload.expiresIn
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