import { StaticImageData } from "next/image"

export type loader_types = 'not_loading' | 'load_playlist' | 'load_song' | 'load_artists' | 'load_genre' | 'load_app' | 'load_artist' | 'load_album'

export type Genre = {
    id: number,
    name: string
    spotify_meta_data: string
    image?: StaticImageData | string
}